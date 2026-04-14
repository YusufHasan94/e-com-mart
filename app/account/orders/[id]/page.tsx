import { OrderDetails } from "@/components/order-details"
import { AccountLayout } from "@/components/account-layout"

export default function OrderDetailsPage({ params }: { params: { id: string } }) {
    return (
        <AccountLayout activeTab="purchases">
            <OrderDetails orderId={params.id} />
        </AccountLayout>
    )
}
