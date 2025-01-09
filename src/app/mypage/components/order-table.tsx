import { KRW } from '@/utils/currency'
import { OrderHistoryProps } from '@/types'
import Link from 'next/link'

function OrderHistoryTableHeader() {
    return (
        <div className="border-b border-black/90 h-10 text-nowrap grid grid-cols-4">
            <div>주문번호</div>
            <div>주문상태</div>
            <div>주문일</div>
            <div>결제금액</div>
        </div>
    )
}

function OrderHistoryTableRow({ data }: { data: OrderHistoryProps }) {
    const row =
        'hover:bg-gray-100 odd:bg-slate-50 hover:cursor-pointer grid grid-cols-4 place-items-center '
    return (
        <Link href={`?orderId=${data.orderId}`} className={`${row}`}>
            <div className="text-nowrap p-4">{data.userOrderNumber}</div>
            <div className="text-nowrap p-4">{data.orderStatus}</div>
            <div className="p-4">{data.orderedAt.replace('T', ' ')}</div>
            <div className="text-nowrap p-4">{KRW(data.orderTotalPrice)}</div>
        </Link>
    )
}

function OrderHistoryTableBody({ data }: { data: OrderHistoryProps[] }) {
    return data.map((d) => <OrderHistoryTableRow key={d.userOrderNumber} data={d} />)
}

const tableClass = 'w-full  text-center mx-auto'
export default function OrderHistoryTable({ orderHistory }: { orderHistory: OrderHistoryProps[] }) {
    return (
        <div className={`${tableClass}`} key="order">
            <OrderHistoryTableHeader />
            <OrderHistoryTableBody data={orderHistory} />
        </div>
    )
}
