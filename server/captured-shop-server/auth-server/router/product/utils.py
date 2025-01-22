from typing import Tuple, Dict, Optional
import json

from sqlalchemy import and_, func, select, text

from logs.make_log import make_logger
from db.tables import ProductInfoTable, SizeTable

from model.db_model import ProductInfoSchema
from model.product_model import ProductResponseSchema
from .filter import (
    create_order_by_filter,
    create_filter_query_dict,
    get_page_idx,
)
from db.connection import session_local

from sqlalchemy.ext.asyncio import AsyncSession
from custom_alru import alru_cache
from functools import lru_cache

error_log = make_logger("logs/db/product.log", "product_router")


async def get_all_product_sku(db: AsyncSession) -> list[int]:
    result = await db.execute(
        select(ProductInfoTable.sku).where(ProductInfoTable.deploy == 1)
    )
    result = result.all()
    return [row[0] for row in result]


async def get_product(sku: int, db: AsyncSession) -> ProductInfoSchema | None:
    result = await db.execute(
        select(ProductInfoTable, func.group_concat(SizeTable.size).label("size"))
        .join(
            SizeTable,
            ProductInfoTable.sku == SizeTable.sku,
        )
        .where(
            SizeTable.available == 1,
            SizeTable.sku == sku,
        )
        .group_by(SizeTable.sku)
    )
    result = result.all()
    if result == []:
        stmt = select(ProductInfoTable).where(ProductInfoTable.sku == sku)
        result = await db.execute(stmt)
        result = result.all()
        if result == []:
            return None
        return ProductInfoSchema(**result[0][0].to_dict())

    return ProductInfoSchema(**result[0][0].to_dict(), size=result[0][1])


async def get_category(
    sort_by: str = "최신순",
    category: Optional[str] = None,
    category_spec: Optional[str] = None,
    brand: Optional[str] = None,
    intl: Optional[str] = None,
    price: Optional[str] = None,
    size_array: Optional[str] = None,
    page: int = 1,
    limit: int = 8,
) -> ProductResponseSchema:
    request_filter = {
        "sort_by": sort_by,
        "category": category,
        "category_spec": category_spec,
        "brand": brand,
        "intl": intl,
        "price": price,
        "size_array": size_array,
    }

    page_idx = await get_page_idx(**request_filter, limit=limit)

    current_cursor, last_page = await get_page_cursor(page, page_idx)

    if current_cursor == -1:
        """필터 결과 없음"""
        return ProductResponseSchema(data=[], currentPage=0, lastPage=last_page)

    filter = create_filter_query_dict(**request_filter)
    sort_type, column, order_by = create_order_by_filter(request_filter.get("sort_by"))

    # group_by
    group_by = SizeTable.sku
    if "size_array" in filter.keys():
        group_by = ProductInfoTable.sku

    db = session_local()
    result = await db.execute(
        select(ProductInfoTable, func.group_concat(SizeTable.size).label("size"))
        .join(SizeTable, ProductInfoTable.sku == SizeTable.sku)
        .where(
            *filter.values(),
            column < current_cursor,
            ProductInfoTable.deploy == 1,
            SizeTable.available == 1,
        )
        .group_by(group_by)
        .order_by(*order_by)
        .limit(limit)
    )
    await db.close()  # type: ignore

    data = [
        ProductInfoSchema(**row[0].to_dict(), size=row[1]).model_dump(by_alias=True)
        for row in result
    ]
    return ProductResponseSchema(data=data, currentPage=page, lastPage=last_page)


async def get_page_cursor(
    page: int, page_idx: Dict[int, int | str]
) -> Tuple[int | str, int]:
    """page index에서 페이지에 해당하는 sku를 추출"""

    # 제품이 없는 경우
    if not page_idx:
        return -1, 0

    # 마지막 페이지보다 큰 값을 요구할 경우 경우
    last_page = max(page_idx.keys())
    if page > last_page:
        return -1, last_page

    # print("page_idx 정상적으로 기입되는지 확인 ", "page : ", page, "page_index : ", page_idx)
    return page_idx[page], last_page


####### FILTER METHOD ##########
####### FILTER METHOD ##########


async def searchProductInDB(keyword: str, limit: int, db: AsyncSession):
    stmt = (
        select(ProductInfoTable, func.group_concat(SizeTable.size).label("size"))
        .join(SizeTable, ProductInfoTable.sku == SizeTable.sku)
        .where(
            text(f"MATCH(search_info) AGAINST (:keyword)").params(keyword=keyword),
            SizeTable.available == True,
            ProductInfoTable.deploy == True,
        )
        .group_by(SizeTable.sku)
        .limit(limit)
    )

    result = await db.execute(stmt)
    result = result.all()

    return [
        ProductInfoSchema(**row[0].to_dict(), size=row[1]).model_dump(by_alias=True)
        for row in result
    ]
