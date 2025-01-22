"""mypage Router"""

from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import APIRouter, Depends, HTTPException, Request

from model.auth_model import TokenData
from model.db_model import UserAddressSchema, UserAddressInDBSchema

from router.auth import get_current_user, update_user_password
from router.mypage import *
from db.connection import get_db
from .utils import *

mypage_router = APIRouter()


@mypage_router.get("/get-address")
async def get_address(user: TokenData = Depends(get_current_user)) -> List[Dict]:
    result = await get_user_address(user.user_id)
    # print(get_user_address.cache_info())
    return [row.model_dump(by_alias=True) for row in result]


@mypage_router.get("/get-address-info")
async def get_address_info_by_id(
    address_id: str,
) -> Dict:
    result = await get_user_address_info_by_addres_id(address_id)
    return result.model_dump(by_alias=True)


@mypage_router.post("/create-address")
async def create_address(
    address: UserAddressSchema,
    user: TokenData = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """주소 생성"""
    address.address_id = await create_new_address_id(db, user.user_id)
    new_address = UserAddressInDBSchema(user_id=user.user_id, **address.model_dump())

    if await create_user_address(db, new_address):
        return {"message": "success"}
    else:
        raise HTTPException(
            status_code=406, detail="주소 등록에 실패했습니다. 다시 시도해주세요."
        )


@mypage_router.post("/update-address")
async def update_address(
    address: UserAddressSchema,
    user: TokenData = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """주소 수정"""

    user_address_db = UserAddressInDBSchema(
        user_id=user.user_id, **address.model_dump()
    )
    if await update_user_address(db, user_address_db):
        return {"message": "success"}
    else:
        raise HTTPException(
            status_code=406, detail="주소 업데이트에 실패했습니다. 다시 시도해주세요."
        )


@mypage_router.post("/delete-address")
async def delete_address(
    request: Request,
    user: TokenData = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """주소 삭제"""

    data = await request.json()
    address_id = data.get("address_id")

    assert address_id is not None, HTTPException(
        status_code=400, detail="address_id가 존재해야합니다."
    )

    if await delete_user_address(db, address_id):
        return {"message": "success"}
    else:
        raise HTTPException(
            status_code=406, detail="주소 삭제에 실패했습니다. 다시 시도해주세요."
        )


@mypage_router.post("/resset-password")
async def reset_password(
    request: dict,
    user: TokenData = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """비밀번호 변경"""

    password = request.get("password")

    assert password, HTTPException(
        status_code=406, detail="비밀번호를 전달받지 못했습니다."
    )

    if await update_user_password(db, password, user.user_id):
        return {"message": "success"}
    else:
        raise HTTPException(
            status_code=406, detail="비밀번호 변경에 실패했습니다. 다시 시도해주세요."
        )
