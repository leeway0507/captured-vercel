"""order Router"""

from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import APIRouter, Depends, HTTPException


from expirng_dict import ExpiringDict

from model.auth_model import TokenData
from model.db_model import (
    OrderHistoryRequestSchema,
    OrderHistoryInDBSchema,
    OrderRowInDBSchmea,
)
from model.order_model import OrderInfoBeforePaymentSchema, checkSize

from router.auth import get_current_user
from router.mypage import *
from db.connection import get_db
from .utils import (
    get_order_history_from_db,
    get_user_order_count,
    get_order_row_from_db,
    create_order_history_into_db,
    create_order_row_into_db,
    check_size,
)
from components.messanger.subscriber import EventHandler
from pydantic import BaseModel


order_router = APIRouter()
order_cache = ExpiringDict(max_len=100, max_age_seconds=60 * 10)
event_hanlder = EventHandler()


@order_router.get("/get-order-history")
async def get_order_history(
    user: TokenData = Depends(get_current_user),
):
    """주문 내역 조회"""
    order_history = await get_order_history_from_db(user.user_id)

    return order_history


@order_router.get("/get-order-row")
async def get_order_row(
    order_id: str,
):
    """주문 상세내역 조회"""
    order_row = await get_order_row_from_db(order_id)
    return order_row


@order_router.post("/create-order-history")
async def create_order_history(
    order_history: OrderHistoryRequestSchema,
    db: AsyncSession = Depends(get_db),
    user: TokenData = Depends(get_current_user),
):
    """
    주문 내역 생성
    // 결제 플로우 확인 : captured/keynote/flow
    """

    order_info: OrderInfoBeforePaymentSchema = order_cache.get(order_history.order_id)  # type: ignore

    if order_info == None:
        raise HTTPException(status_code=400, detail="일치하는 주문정보가 없습니다.")

    address_id = order_info.address_id
    assert address_id != None, HTTPException(
        status_code=400, detail="주소지를 선택해주세요"
    )
    order_count = await get_user_order_count(db)
    order_history_in_db = OrderHistoryInDBSchema(
        **order_history.model_dump(),
        user_id=user.user_id,
        address_id=address_id,
        user_order_number=order_count,
    )
    if await create_order_history_into_db(order_history_in_db, db):
        order_rows = order_info.order_rows
        order_rows_in_db = [
            OrderRowInDBSchmea(**order_row.model_dump()) for order_row in order_rows
        ]
        if await create_order_row_into_db(order_rows_in_db, db):
            event_hanlder.order(order_history_in_db, order_rows_in_db)
            return {"message": "success"}

    else:
        raise HTTPException(status_code=400, detail="주문내역 생성 실패")


@order_router.post("/save-order-info-before-payment")
def save_order_info(
    payment_info: OrderInfoBeforePaymentSchema,
    user: TokenData = Depends(get_current_user),
):
    """결제 전 주문 정보 저장"""
    order_cache[payment_info.order_id] = payment_info

    print("-------order_cache-------")
    print(order_cache.get(payment_info.order_id))

    return order_cache.get(payment_info.order_id)


@order_router.get("/get-order-info-before-payment")
def get_order_info(orderId: str):
    """결제 전 주문 정보 조회"""

    info: OrderInfoBeforePaymentSchema | None = order_cache.get(orderId)  # type: ignore

    if info == None:
        raise HTTPException(status_code=403, detail="주문 정보가 없습니다")

    print("-------get_order_info-------")
    print(info.order_total_price)

    return {"orderTotalPrice": info.order_total_price}


@order_router.post("/check-size")
async def check_order_is_available(size_form: checkSize):
    return await check_size(size_form)
