import { redirect } from 'next/navigation'
import { OrderHistoryRequestProps } from '@/types'
import {
    getPaymentVerification,
    confirmPaymentFromTossServer,
    createOrderHistory,
} from '@/actions/payment'
import CatchError from '@/utils/error/handle-fetch-error'
import Success from './client'

interface PaymentSuccessParams {
    paymentType: string
    orderId: string
    paymentKey: string
    amount: string
}

export default async function Page({ searchParams }: { searchParams: PaymentSuccessParams }) {
    const { orderId, paymentKey, amount } = searchParams

    // 1. 결제정보를 서버에서 불러온다.
    // const { orderTotalPrice } = await getPaymentVerification(orderId, accessToken)
    const { orderTotalPrice } = await getPaymentVerification(orderId)
        .then((r) => CatchError(r))
        .catch(() =>
            redirect(
                '/order/fail?code=FAIL_TO_GET_INFO&message=결제정보를 불러오는데 실패했습니다.',
            ),
        )

    // 2. 요청 가격과 서버에 저장된 가격이 동일한지 점검한다.
    const isPriceCorrect = orderTotalPrice === Number(amount)
    if (!isPriceCorrect) {
        return redirect('/order/fail?code=NOT_MATCH_AMOUNT&message=결제 금액이 일치하지 않습니다.')
    }

    // 3. 토스 서버로 결제 요청을 보낸다.
    const data = await confirmPaymentFromTossServer(
        process.env.TOSSPAYMENTS_SECRET_KEY!,
        paymentKey,
        amount,
        orderId,
    )
        .then((r) => CatchError(r))
        .catch((err) => {
            const errorStatus = new URLSearchParams(JSON.parse(err.message)).toString()
            return redirect(`/order/fail?${errorStatus}`)
        })

    const orderHistory: OrderHistoryRequestProps = {
        paymentKey: data.paymentKey,
        orderId: data.orderId,
        orderedAt: data.approvedAt,
        orderTotalPrice: Number(data.totalAmount),
        paymentMethod: data.method, // 카드, 간편결제
        paymentInfo: data.card.number,
    }

    // 4. 결제정보를 서버에 저장한다.
    await createOrderHistory(orderHistory)
        .then((r) => CatchError(r))
        .catch(() =>
            redirect('/order/fail?code=FAIL_TO_SAVE_INFO&message=결제정보 저장에 실패했습니다.'),
        )
    return <Success orderId={orderId} />
}
