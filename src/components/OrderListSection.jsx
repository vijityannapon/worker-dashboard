import OrderCard from "./OrderCard";

export default function OrderListSection({ title, bgColor = "bg-blue-500", orders = [] }) {
  console.log({orders})

  return (
    <section className={`${bgColor} text-white rounded-lg p-4`}>
      <h2 className="text-white text-xl font-bold mb-4 text-center">{title}</h2>
      <div className="space-y-4  overflow-y-auto max-h-[80vh] pr-1">
        {Array.isArray(orders) && orders.length > 0 ? (
          orders.map((order, index) => (
            <OrderCard key={order.requestNo || index} order={order} />
          ))
        ) : (
          <p className="text-gray-200 text-center">ไม่มีข้อมูล</p>
        )}
      </div>
    </section>
  );
}
