"""product Router"""

from typing import Any, Dict

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from model.product_model import RequestFilterSchema
from . import utils, mock_category


from db.connection import get_db


product_router = APIRouter()


@product_router.post("/get-category")
async def get_filtered_item_list(
    page: int,
    filter: RequestFilterSchema,
):
    """리스트 불러오기"""

    print("------get_filtered_item_list--------")
    print("filter category 시작")
    print("page", page)
    print("request_filter", filter.model_dump(exclude_none=True))

    v = await utils.get_category(
        **filter.model_dump(exclude_none=True), page=page, limit=48
    )
    return v


@product_router.post("/get-category-mock")
def get_category_mock_data(
    page: int,
    filter: RequestFilterSchema,
):
    """리스트 불러오기"""

    return mock_category.get_category_mock(page=page, limit=7)


@product_router.get("/get-product/{sku}")
async def get_a_single_product(
    sku: int, db: AsyncSession = Depends(get_db)
) -> Dict[str, Any]:
    """제품 정보 불러오기"""
    result = await utils.get_product(sku, db)
    if result is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="제품 정보가 없습니다."
        )
    return result.model_dump(by_alias=True)


@product_router.get("/search")
async def search_product(
    keyword: str, limit: int = 50, db: AsyncSession = Depends(get_db)
):
    """제품 정보 불러오기"""
    result = await utils.searchProductInDB(keyword=keyword, limit=limit, db=db)
    return result


@product_router.get("/get-all-product-sku")
async def get_all_product_sku_api(db: AsyncSession = Depends(get_db)):
    """제품 정보 불러오기"""
    result = await utils.get_all_product_sku(db=db)
    return result


# @product_router.get("/get-filter-meta")
# def get_init_meta():
#     return get_init_meta_data()
