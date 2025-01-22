import pytest
from components.messanger.subscriber import event_handler, EventHandler
from model.db_model import UserSchema, OrderHistoryInDBSchema, OrderRowInDBSchmea
from datetime import datetime
from components.env import env


@pytest.fixture(scope="module")
def EventHandlerImpl():
    yield event_handler


def test_user_register(EventHandlerImpl: EventHandler):
    user = UserSchema(
        user_id="asd", email="hello_world@naver.com", kr_name="테스트", sign_up_type="test"
    )
    EventHandlerImpl.user_registered(user)


def test_EventHandler_is_singleton(EventHandlerImpl: EventHandler):
    a = EventHandlerImpl
    b = EventHandler()

    assert a == b


def test_order(EventHandlerImpl: EventHandler):
    user = UserSchema(
        user_id="asd", email="hello_world@naver.com", kr_name="테스트", sign_up_type="test"
    )
    order = OrderHistoryInDBSchema(
        order_id="vmD2XId2M-BEX8JzTWuBT",
        user_id="6x8w1PfgbrODnDE2F0ZrCE0frvBVLAITJgPVLlXHyYc",
        address_id="UA-6x8w1PfgbrODnDE2F0ZrCE0frvBVLAITJgPVLlXHyYc-0",
        ordered_at=datetime.now(),
        user_order_number=1,
        order_status="배송준비",
        order_total_price=244000,
        payment_method="카드",
        payment_status="승인완료",
        payment_info="51404300****145*",
        payment_key="gpMwnkjKyO6BYq7GWPVvGQNGvPqwKLrNE5vbo1d4JlALRXxz",
    )
    order_item = OrderRowInDBSchmea(
        order_row_id=4,
        order_id="vmD2XId2M-BEX8JzTWuBT",
        sku=30,
        size="M",
        quantity=1,
        delivery_status="배송준비",
    )

    EventHandlerImpl.order(order, [order_item])
