from typing import List, Dict
from sqlalchemy import and_, select, update, delete, insert

from sqlalchemy.ext.asyncio import AsyncSession

from model.db_model import UserAddressInDBSchema, UserAddressSchema
from model.auth_model import TokenData

from db.tables import UserAddressTable
from db.connection import commit, session_local
from logs.make_log import make_logger
from custom_alru import alru_cache

error_log = make_logger("logs/db/mypage.log", "mypage_router")


@alru_cache
async def get_user_address(user_id: str) -> List[UserAddressSchema]:
    """주소 불러오기"""
    db = session_local()
    filter_condition = and_(
        UserAddressTable.user_id == user_id, UserAddressTable.permanent == False
    )

    result = await db.execute(select(UserAddressTable).filter(filter_condition))
    result = result.all()
    await db.close()  # type: ignore
    return [UserAddressSchema(**row[0].to_dict()) for row in result]


async def get_user_address_info_by_addres_id(address_id: str) -> UserAddressSchema:
    """주소 불러오기"""
    db = session_local()
    result = await db.execute(
        select(UserAddressTable).filter(UserAddressTable.address_id == address_id)
    )
    result = result.scalar()
    await db.close()  # type: ignore
    return UserAddressSchema(**result.to_dict())


async def create_user_address(
    db: AsyncSession, user_address_db: UserAddressInDBSchema
) -> bool:
    """주소 생성"""

    stmt = insert(UserAddressTable).values([user_address_db.model_dump()])
    query = await db.execute(stmt)
    await commit(db, query, error_log)
    get_user_address.cache_invalidate(user_address_db.user_id)
    return True


async def update_user_address(
    db: AsyncSession, updated_address_db: UserAddressInDBSchema
) -> bool:
    """주소 업데이트"""

    # 영구 보관 주소는 수정할 수 없음
    address_id = updated_address_db.address_id

    assert address_id is not None

    if int(address_id.split("-")[-1]) > 1000:
        return False

    stmt = (
        update(UserAddressTable)
        .filter(UserAddressTable.address_id == address_id)
        .values(updated_address_db.model_dump())
    )
    query = await db.execute(stmt)
    get_user_address.cache_invalidate(updated_address_db.user_id)
    return await commit(db, query, error_log)


async def delete_user_address(db: AsyncSession, user_addres_id: str) -> bool:
    """주소 삭제"""

    # 메인 주소는 수정만 가능
    _, user_id, v = user_addres_id.split("-")
    if v == "0":
        error_log.error(f"{user_addres_id} : 메인 주소는 삭제할 수 없습니다.")
        return False

    stmt = delete(UserAddressTable).where(UserAddressTable.address_id == user_addres_id)
    query = await db.execute(stmt)
    get_user_address.cache_invalidate(user_id)
    return await commit(db, query, error_log)


async def create_new_address_id(db: AsyncSession, user_id: str):
    """새로운 주소 id 생성"""
    column = UserAddressTable.address_id
    condition = and_(
        UserAddressTable.user_id == user_id, UserAddressTable.permanent == False
    )
    last_number = await db.execute(
        select(column).filter(condition).order_by(column.desc())
    )

    # last_number = (query, query_result=tuple(result)) 구성임. 따라서 last_number[0][0]으로 값을 추출
    last_number = last_number.all()

    if len(last_number) == 0:
        return f"UA-{user_id}-0"
    else:
        last_number = last_number[0][0].split("-")[-1]
        return f"UA-{user_id}-{int(last_number)+1}"
