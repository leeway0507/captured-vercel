import { ProductProps } from './product'

export interface OrderHistoryProps {
    orderId: string
    userOrderNumber: number
    orderedAt: string
    orderStatus: string
    paymentStatus: string
    addressId: string
    orderTotalPrice: number
    paymentMethod: string
}
export interface OrderItemProps extends Omit<ProductProps, 'size'> {
    orderNum: number
    orderId: string
    size: string
    quantity: number
    deliveryStatus: string
    deliveryNumber: string
    deliveryCompany: string
}

export interface OrderHistoryRequestProps {
    paymentKey: string
    orderId: string
    orderedAt: Date
    orderTotalPrice: Number
    paymentMethod: String
    paymentInfo: String
}

export interface CheckCartItemResultProps {
    [form: string]: boolean
}

export interface RequestItemCheckProps {
    sku: number
    size: string
    quantity: number
}
