"""인증과 관련된 함수 정의"""

from typing import Dict, Any
from datetime import datetime, timedelta
from uuid import uuid1
import os


import jwt
from decouple import Config, RepositoryEnv
from passlib.context import CryptContext
from fastapi.security import OAuth2PasswordBearer
from fastapi import Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_, update, insert


from model.db_model import (
    UserSchema,
    UserAddressSchema,
    UserIndDBSchema,
    UserAddressInDBSchema,
)
from model.registration_model import EmailRegistrationSchema, RegistrationOauthSchema
from model.auth_model import LoginSchema, TokenData, Token, EmailSchema
from logs.make_log import make_logger
from db.tables import UserTable, UserAddressTable
from db.connection import commit

error_log = make_logger("logs/db/auth.log", "auth_router")

if os.environ.get("ProductionLevel"):
    config = Config(RepositoryEnv(".env.production"))
else:
    config = Config(RepositoryEnv(".env.dev"))


JWT_SECRET = config("JWT_SECRET")
JWT_ALGORITHM = config("JWT_ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = config("ACCESS_TOKEN_EXPIRE_MINUTES", cast=int)

assert isinstance(JWT_ALGORITHM, str), "JWT_ALGORITHM is not 'str' type"
assert isinstance(JWT_SECRET, str), "JWT_SECRET is not 'str' type"
assert isinstance(
    ACCESS_TOKEN_EXPIRE_MINUTES, int
), "ACCESS_TOKEN_EXPIRE_MINUTES is not 'int' type"

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/signin")
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def verify_password(plain_password, hashed_password) -> bool:
    """요청한 비밀번호와 DB내 hash된 비밀번호를 비교"""
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password) -> str:
    """비밀번호를 hash로 변경"""
    return pwd_context.hash(password)


async def authenticate_user(db: AsyncSession, login: LoginSchema) -> UserSchema | int:
    """
    로그인 요청한 유저가 DB에 있는지 확인
    - args : LoginSchema(email, password)
    - return : UserSchema | bool
    """

    user_db = await get_user_db_by_email(db, login.email)

    if user_db is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="email not found",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not verify_password(login.password, user_db.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return UserSchema(**user_db.model_dump())


def create_access_token(data: Dict, expires_delta: timedelta | None = None) -> str:
    """
    JWT 토큰 생성
    - args : data({key:value}), expires_delta(timedelta)
    - return : str
    """
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)

    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALGORITHM)


def create_access_token_form(user_id) -> Token:
    """
    JWT 토큰 생성
    - args : user_id(str)
    - return : Token(access_token, token_type)
    """
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"user_id": user_id}, expires_delta=access_token_expires
    )
    return Token(access_token=access_token, token_type="bearer")


def get_current_user(token: str = Depends(oauth2_scheme)) -> TokenData:
    """
    JWT 토큰 decode를 통해 얻은 user_id로 유저 정보(UserSchema)를 반환
    - args : token(str)
    - return : TokenData
    """

    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="해당 토큰의 인증 정보가 없습니다.",
        headers={"WWW-Authenticate": "Bearer"},
    )
    exp_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="요청기간이 만료됐습니다. 재로그인 해주세요.",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        user_id: str = payload.get("user_id")
        if user_id is None:
            raise credentials_exception

        expire_time: int = payload.get("exp")
        if expire_time is None or expire_time < datetime.utcnow().timestamp():
            raise exp_exception

        token_data = TokenData(user_id=user_id)

    except jwt.PyJWTError as e:
        error_log.error(e)
        raise credentials_exception

    return token_data


async def register_auth_user(
    auth_user_registration: RegistrationOauthSchema, db: AsyncSession
) -> UserSchema | None:
    """네이버 카카오 회원가입 시 user 정보를 DB에 저장"""

    auth_user_registration.register_at = datetime.now()
    auth_user_registration.last_login = datetime.now()

    try:
        stmt = insert(UserTable).values(**auth_user_registration.model_dump())
        await db.execute(stmt)
        await db.commit()
        return await get_user_by_user_id(db, auth_user_registration.user_id)
    except Exception as e:
        error_log.error(e)
        return None


async def register_user_and_address(
    db: AsyncSession,
    user_registration: EmailRegistrationSchema,
    address: UserAddressSchema,
) -> UserSchema | None:
    """
    회원가입 시 user, address 정보를 DB에 저장 | 성공 & 실패 여부에 따라 UserSchema 반환
    - args : user(EmailRegistrationSchema), address(UserAddressSchema)
    - return : UserSchema | None
    """

    # add user info
    user_registration.user_id = create_user_id()
    user_registration.password = get_password_hash(user_registration.password)
    user_registration.register_at = datetime.now()
    user_registration.last_login = datetime.now()

    query = db.add(UserTable(**user_registration.model_dump()))  # type: ignore
    result = await commit(db, query, error_log)

    if result is None:
        return None

    # add uer address info
    user_address_in_db = UserAddressInDBSchema(
        user_id=user_registration.user_id,
        **address.model_dump(),
    )
    user_address_in_db.address_id = f"UA-{user_registration.user_id}-{0}"
    query = db.add(UserAddressTable(**user_address_in_db.model_dump()))  # type: ignore
    result = await commit(db, query, error_log)
    if result is None:
        return None

    return await get_user_by_email(db, user_registration.email)


def create_user_id() -> str:
    """email을 통해 user_id 생성"""
    return uuid1().hex


async def get_user_by_email(db: AsyncSession, email: str) -> UserSchema | None:
    """email을 통해 user정보 획득"""

    result = await db.execute(select(UserTable).filter(UserTable.email == email))  # type: ignore
    result = result.scalar()

    if result is None:
        return None

    result = result.to_dict()
    result.pop("password")
    return UserSchema(**result)


async def get_user_db_by_email(db: AsyncSession, email: str) -> UserIndDBSchema | None:
    """email을 통해 user_db(user + 비밀번호) 획득"""

    result = await db.execute(select(UserTable).filter(UserTable.email == email))  # type: ignore
    result = result.scalar()

    if result is None:
        return None

    result = result.to_dict()
    return UserIndDBSchema(**result)


async def get_user_by_user_id(db: AsyncSession, user_id: str) -> UserSchema | None:
    """email을 통해 user정보 획득"""

    result = await db.execute(select(UserTable).filter(UserTable.user_id == user_id))  # type: ignore
    result = result.scalar()

    if result is None:
        return None

    result = result.to_dict()
    result.pop("password")
    return UserSchema(**result)


async def update_user_password(db: AsyncSession, password: str, user_id: str) -> bool:
    """비밀번호 변경"""
    stmt = (
        update(UserTable)
        .filter(UserTable.user_id == user_id)
        .values({"password": get_password_hash(password)})
    )
    query = await db.execute(stmt)
    return await commit(db, query, error_log)


async def get_user_by_email_and_name(
    db: AsyncSession, name: str, email: str
) -> UserSchema | None:
    """이름과 이메일을 통해 user정보 획득"""

    result = await db.execute(
        select(UserTable).filter(
            and_(UserTable.kr_name == name, UserTable.email == email)
        )
    )
    result = result.scalar()

    if result is None:
        return None

    result = result.to_dict()
    result.pop("password")
    return UserSchema(**result)


#### EMAIL VERIFICATION ####

from random import randint
from fastapi_mail import ConnectionConfig, FastMail, MessageSchema, MessageType
from pathlib import Path


password = config.get("GMAIL_APP_PASSWORD")
gmail_id = config.get("GMAIL_ID")
sending_email = config.get("SENDING_EMAIL")
assert isinstance(password, str), "password is not str"
assert isinstance(sending_email, str), "password is not str"
assert isinstance(gmail_id, str), "password is not str"

print(Path(__file__).parent / "templates")

conf = ConnectionConfig(
    MAIL_USERNAME=gmail_id,
    MAIL_PASSWORD=password,
    MAIL_FROM=sending_email,
    MAIL_PORT=465,
    MAIL_SERVER="smtp.gmail.com",
    MAIL_STARTTLS=False,
    MAIL_SSL_TLS=True,
    USE_CREDENTIALS=True,
    VALIDATE_CERTS=True,
    TEMPLATE_FOLDER=Path(__file__).parent / "templates",
)


def generate_code(email: str) -> Dict[str, Dict[str, Any]]:
    """6자리의 숫자로 이루어진 code 생성"""
    code = str(randint(100000, 999999))
    return {
        email: {
            "code": code,
            "expire": datetime.now() + timedelta(minutes=3),
        }
    }


async def send_code(user_code: Dict[str, Dict[str, Any]]):
    email = list(user_code.keys())
    code = user_code[email[0]]["code"]
    recipients = EmailSchema(email=email).email

    message = MessageSchema(
        subject="[CAPTURED] 이메일 인증번호",
        recipients=recipients,
        template_body={"code": code},
        subtype=MessageType.html,
    )

    fm = FastMail(conf)
    return await fm.send_message(message, template_name="email_verification.html")


def verification_code(server_code: Dict[str, Any], request_code: str):
    """code 인증"""

    if server_code["expire"] < datetime.now():
        return {"result": False, "message": "expired"}

    if request_code != server_code["code"]:
        return {"result": False, "message": "not matched"}

    return {"result": True, "message": "success"}


async def update_last_login(user_id, db: AsyncSession):
    stmt = (
        update(UserTable)
        .filter(UserTable.user_id == user_id)
        .values({"last_login": datetime.now()})
    )
    await db.execute(stmt)
    await db.commit()
    return True
