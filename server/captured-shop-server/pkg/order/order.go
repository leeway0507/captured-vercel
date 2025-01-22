package order

import (
	"errors"
	"product-server/pkg/entities"
	"time"

	"github.com/hashicorp/golang-lru/v2/expirable"
)

var (
	cache = expirable.NewLRU[string, entities.PreOrder](5, nil, time.Second*100)
)

func SavePreOrder(preOrder entities.PreOrder) int {
	cache.Add(preOrder.OrderID, preOrder)
	return cache.Len()
}

func LoadPreOrder(orderID string) (*entities.PreOrder, error) {
	items, ok := cache.Get(orderID)
	if !ok {
		return nil, errors.New("order not found")
	}
	return &items, nil
}

// order_cache[payment_info.order_id] = payment_info

// async def get_user_order_count(db: AsyncSession):
//     last_number = await db.execute(
//         select([func.count()]).select_from(OrderHistoryTable)
//     )
//     last_number = last_number.scalar()

//     if last_number is None:
//         return 1

//     return last_number + 1

// async def create_order_history_into_db(
//     order_history: OrderHistoryInDBSchema, db: AsyncSession
// ):
//     stmt = insert(OrderHistoryTable).values([order_history.model_dump()])
//     await db.execute(stmt)
//     await commit(db, stmt, error_log)
//     get_order_history_from_db.cache_invalidate(order_history.user_id)
//     return True

// async def create_order_row_into_db(
//     order_rows: List[OrderRowInDBSchmea], db: AsyncSession
// ):
//     stmt = insert(OrderRowTable).values(
//         [order_row.model_dump() for order_row in order_rows]
//     )

//     query = await db.execute(stmt)

//     return await commit(db, query, error_log)
