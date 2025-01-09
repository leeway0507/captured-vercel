import { PaymentWidgetInstance, loadPaymentWidget } from '@tosspayments/payment-widget-sdk'
import { useEffect, useRef } from 'react'
import { CustomUser } from '@/auth'
import { ProductCartProps } from '@/types'
import { savePaymentInfo } from '@/actions/payment'

export interface TossPaymentsProps {
    orderId: string
    addressId: string | undefined
    totalPrice: number
    session: CustomUser
    orderItems: ProductCartProps[]
}

const getOrderName = (items: ProductCartProps[]) => {
    const { productName: name } = items[0].product
    const productName = name.length > 20 ? `${name.slice(0, 17)}...` : name

    const orderLength = items.length
    const extra = orderLength > 1 && `외 ${orderLength - 1}건`

    return `${productName} ${extra}`
}

function useTossPayments(p: TossPaymentsProps) {
    const { orderId, addressId, totalPrice, session, orderItems } = p

    const widgetRef = useRef<PaymentWidgetInstance | null>(null)
    const methodsWidgetRef = useRef<ReturnType<
        PaymentWidgetInstance['renderPaymentMethods']
    > | null>(null)

    useEffect(() => {
        ;(async () => {
            const clientKey = process.env.NEXT_PUBLIC_TOSSPAYMENTS_CLIENT_KEY!

            // ------  결제위젯 초기화 ------
            // 비회원 결제에는 customerKey 대신 ANONYMOUS를 사용하세요.
            const paymentWidget = await loadPaymentWidget(clientKey, session.userId) // 회원 결제

            // ------  결제위젯 렌더링 ------
            // https://docs.tosspayments.com/reference/widget-sdk#renderpaymentmethods선택자-결제-금액-옵션
            const paymentMethodsWidget = paymentWidget.renderPaymentMethods('#payment-widget', {
                value: totalPrice,
            })

            // ------  이용약관 렌더링 ------
            // https://docs.tosspayments.com/reference/widget-sdk#renderagreement선택자
            paymentWidget.renderAgreement('#agreement')

            methodsWidgetRef.current = paymentMethodsWidget
            widgetRef.current = paymentWidget
        })()

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // addressId 체크
    if (!addressId) return () => alert('주소를 선택해야 합니다.')

    const startPayment = async () => {
        const paymentWidget = widgetRef.current

        // toss payments 결제 정보 비교 위해 서버에 관련 정보 저장
        await savePaymentInfo(orderId, addressId, totalPrice, orderItems)

        // ------ '결제하기' 버튼 누르면 결제창 띄우기 ------
        // https://docs.tosspayments.com/reference/widget-sdk#requestpayment결제-정보

        const paymentInfo = {
            orderId,
            orderName: getOrderName(orderItems),
            customerName: session.name,
            customerEmail: session.email && session.email,
            successUrl: `${window.location.origin}/order/success`,
            failUrl: `${window.location.origin}/order/fail`,
        }

        await paymentWidget?.requestPayment(paymentInfo).catch((error) => {
            if (error.code === 'INVALID_ORDER_NAME') {
                alert(error.message)
            } else if (error.code === 'INVALID_ORDER_ID') {
                alert(error.message)
            }
        })
        // SUCCESS : https://{ORIGIN}/success?paymentKey={PAYMENT_KEY}&orderId={ORDER_ID}&amount={AMOUNT}&paymentType={PAYMENT_TYPE}
        // FAIL : https://{ORIGIN}/fail?code={ERROR_CODE}&message={ERROR_MESSAGE}&orderId={ORDER_ID}
    }

    return startPayment
}

export default useTossPayments
