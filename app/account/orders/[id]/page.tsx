import { OrderDetails } from "@/components/order-details"

export default function OrderDetailsPage({ params }: { params: { id: string } }) {
    return (
        <div className="container mx-auto px-4 py-8">
            <OrderDetails orderId={params.id} />
        </div>
    )
}
