from typing import List

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from sqlalchemy.dialects.mysql import insert

from logs.make_log import make_logger
from db.tables import OrderHistoryTable, OrderRowTable, ProductInfoTable, SizeTable
from db.connection import commit, session_local
from model.db_model import OrderHistoryInDBSchema, OrderRowInDBSchmea
from model.order_model import (
    OrderRowResponseSchema,
    OrderHistoryResponseSchema,
    checkSize,
)

from passlib.context import CryptContext
from custom_alru import alru_cache

error_log = make_logger("logs/db/product.log", "product_router")
payment_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def get_payment_info_hash(payment_info: str) -> str:
    """결제정보를 hash로 변경"""
    return payment_context.hash(payment_info)


def verify_payment_info(plain_payment_info, hashed_payment_info) -> bool:
    """요청한 결제정보와 DB내 hash된 결제정보를 비교"""
    return payment_context.verify(plain_payment_info, hashed_payment_info)


async def get_user_order_count(db: AsyncSession):
    last_number = await db.execute(
        select([func.count()]).select_from(OrderHistoryTable)
    )
    last_number = last_number.scalar()

    if last_number is None:
        return 1

    return last_number + 1


async def create_order_history_into_db(
    order_history: OrderHistoryInDBSchema, db: AsyncSession
):
    stmt = insert(OrderHistoryTable).values([order_history.model_dump()])
    await db.execute(stmt)
    await commit(db, stmt, error_log)
    get_order_history_from_db.cache_invalidate(order_history.user_id)
    return True


async def create_order_row_into_db(
    order_rows: List[OrderRowInDBSchmea], db: AsyncSession
):
    stmt = insert(OrderRowTable).values(
        [order_row.model_dump() for order_row in order_rows]
    )

    query = await db.execute(stmt)

    return await commit(db, query, error_log)


@alru_cache
async def get_order_history_from_db(user_id: str):
    """주문 내역 조회"""
    db = session_local()
    result = await db.execute(
        select(OrderHistoryTable)
        .filter(OrderHistoryTable.user_id == user_id)
        .order_by(OrderHistoryTable.ordered_at.desc())
        .limit(20)
    )
    result = result.all()
    await db.close()  # type: ignore
    return [
        OrderHistoryResponseSchema(**row[0].to_dict()).model_dump(by_alias=True)
        for row in result
    ]


@alru_cache
async def get_order_row_from_db(order_id: str):
    """주문 상세 내역 조회"""
    db = session_local()
    result = await db.execute(
        select(
            OrderRowTable,
            ProductInfoTable.brand,
            ProductInfoTable.product_name,
            ProductInfoTable.product_id,
            ProductInfoTable.price,
            ProductInfoTable.shipping_fee,
            ProductInfoTable.intl,
        )
        .join(ProductInfoTable, ProductInfoTable.sku == OrderRowTable.sku)
        .filter(OrderRowTable.order_id == order_id)
    )
    result = result.all()
    await db.close()  # type: ignore

    return [
        OrderRowResponseSchema(
            **row[0].to_dict(),
            brand=row[1],
            product_name=row[2],
            product_id=row[3],
            price=row[4],
            shipping_fee=row[5],
            intl=row[6],
        ).model_dump(by_alias=True)
        for row in result
    ]




async def check_size(size_form: checkSize):
    db = session_local()
    result = await db.execute(
        select(SizeTable.sku, SizeTable.size).where(SizeTable.sku.in_(size_form.sku))
    )
    result = result.all()
    await db.close()  # type: ignore

    sku_size_set = set()
    for row in result:
        sku_size_set.add(f"{row[0]}-{row[1]}")

    form = {}
    for s in size_form.form:
        size_available = False

        if s in sku_size_set:
            size_available = True

        form.update({s: size_available})

    return form
