from typing import List
from .slack import SlackEvent
from model.db_model import UserSchema, OrderRowInDBSchmea, OrderHistoryInDBSchema
from components.env import env


class EventHandler:
    _instance = None
    _subscriber = []

    def __new__(cls):
        """싱글톤 패턴 적용"""
        if cls._instance is None:
            cls._instance = super().__new__(cls)

        return cls._instance

    def subscribe(self, subscribefn):
        print(f"subscribefn : {subscribefn}")
        self._subscriber.append(subscribefn)

    def user_registered(self, user: UserSchema):
        for concrete_subscriber in self._subscriber:
            getattr(concrete_subscriber, "user_registered")(user)

    def order(
        self,
        order: OrderHistoryInDBSchema,
        order_item: List[OrderRowInDBSchmea],
    ):
        for concrete_subscriber in self._subscriber:
            getattr(concrete_subscriber, "order")(order, order_item)


event_handler = EventHandler()
slack = SlackEvent(env.SLACK_CHANNEL)
event_handler.subscribe(slack)
