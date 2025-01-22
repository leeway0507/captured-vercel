import json
from typing import List
from slack_sdk import WebClient
from slack_sdk.errors import SlackApiError
from components.env import env
from model.db_model import UserSchema, OrderRowInDBSchmea, OrderHistoryInDBSchema
from datetime import datetime
from pydantic import BaseModel

client = WebClient(token=env.SLACK_TOKEN)


def handle_non_serializable(obj):
    if isinstance(obj, datetime):
        return obj.isoformat()
    else:
        raise TypeError(f"Object of type {type(obj)} is not JSON serializable")


class SlackEvent:
    _instance = None

    def __init__(self, channel_id) -> None:
        self.channel_id = channel_id

    def __new__(cls, channel_id: str):
        """싱글톤 패턴 적용"""
        print("slack channel Init")
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance.__init__(channel_id)
            return cls._instance

    def user_registered(self, user: UserSchema):
        text = f"""🥳🥳🥳🥳🥳🥳🥳🥳🥳\n\n-----신규 회원 등록 ----- \n\n 가입자명 : {user.kr_name} \n 가입방식 : {user.sign_up_type}"""
        return self.send_slack_message(text)

    def order(
        self,
        order: OrderHistoryInDBSchema,
        order_items: List[OrderRowInDBSchmea],
    ):
        order_info = self.order_template(order)
        order_item_info = self.order_item_template(order_items)
        text = "\n".join([order_info, order_item_info])
        return self.send_slack_message(text)

    def order_template(self, order: OrderHistoryInDBSchema):
        return f"""
        ----🚀🚀 신규 구매 🚀🚀 ---- \n
        주문일 : {order.ordered_at} \n
        주문 ID : {order.order_id} \n
        구매자 ID : {order.user_id} \n
        구매금액 : {order.order_total_price} \n
        결제방식 : {order.payment_method} \n
        거래상태 : {order.payment_status} \n
        """

    def order_item_template(self, order_items: List[OrderRowInDBSchmea]):
        def _order_item(order_item: OrderRowInDBSchmea):
            return f"""
        물품 ID : {order_item.sku} \n
        사이즈 : {order_item.size} \n
        수량 : {order_item.quantity} \n
        """

        text = "----구매 상세---- \n"
        item_info = "\n".join([_order_item(item) for item in order_items])
        return text + item_info

    def send_slack_message(self, text: str):
        try:
            client.chat_postMessage(channel=self.channel_id, text=text)
        except SlackApiError as e:
            print(f"Error sending message to Slack: {e.response['error']}")

    def serialize_pydantic(self, pydanticModel: BaseModel):
        return json.dumps(
            pydanticModel.model_dump(),
            indent=4,
            ensure_ascii=False,
            default=handle_non_serializable,
        )
