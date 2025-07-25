export default function OrderStatusLegend() {
  const statuses = [
    {
      color: "bg-sky-500",
      label: "รอรับเรื่อง",
    },
    {
      color: "bg-emerald-500",
      label: "รับเรื่องแล้ว",
    },
    {
      color: "bg-amber-500",
      label: "กำลังดำเนินการ",
    },
    {
      color: "bg-rose-500",
      label: "ยกเลิก",
    },
  ];

  return (
    <div className="flex flex-wrap gap-4 items-center">
      <div className="text-white text-base sm:text-lg font-bold flex items-center whitespace-nowrap">
        📌 <span className="ml-2">สถานะคำขอ:</span>
      </div>
      <div className="flex gap-6 flex-wrap items-center text-white text-base sm:text-lg">
        {statuses.map((status, i) => (
          <div key={i} className="flex items-center gap-2 whitespace-nowrap">
            <div className={`w-4 h-4 rounded-full ${status.color}`}></div>
            <span className="font-semibold">{status.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
