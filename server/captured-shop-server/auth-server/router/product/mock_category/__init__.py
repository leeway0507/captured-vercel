import json
from model.product_model import ProductResponseSchema

mock_json_path = "router/product/mock_category/category.json"
with open(mock_json_path, "r") as f:
    mock_items = json.loads(f.read())


def get_category_mock(page: int, limit=8):
    last_page = (len(mock_items) // limit) + 1
    slice_page = page - 1
    data = mock_items[79:80]
    # data = mock_items[slice_page * limit : page * limit]

    return ProductResponseSchema(data=data, currentPage=page, lastPage=last_page)
