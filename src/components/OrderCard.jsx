import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const statusColors = {
  waiting_acknowledged: "text-sky-500",
  acknowledged: "text-emerald-500",
  in_progress: "text-amber-500",
  จัดช้า: "text-red-500",
  cancelled: "text-rose-500",
};

const translateDepartment = (key) => {
  switch (key) {
    case "main-warehouse":
      return "คลังกลาง";
    case "inspection":
      return "ตรวจเช็ค";
    case "packaging":
      return "บรรจุ";
    default:
      return "ไม่ระบุ";
  }
};

export default function OrderCard({ order }) {
  // if (
  //   !Array.isArray(order.salesordersubs) ||
  //   order.salesordersubs.length === 0
  // ) {
  //   return null;
  // }
  let status = "";
  let statusText = "";

  if (order.status === "cancelled") {
    status = "cancelled";
    statusText = "ยกเลิก";
  } else if (order.departmentStatus === "waiting_acknowledged") {
    status = "waiting_acknowledged";
    statusText = "รอรับเรื่อง";
  } else if (order.departmentStatus === "acknowledged") {
    status = "acknowledged";
    statusText = "รับเรื่องแล้ว";
  } else if (order.departmentStatus === "in_progress") {
    status = "in_progress";
    statusText = "กำลังดำเนินการ";
  }

  return (
    <div className="bg-slate-800 text-white rounded-xl shadow-lg p-4 border border-white/10 space-y-3">
      <div className="flex justify-between flex-wrap">
        <div>
          <p className="text-red-400 font-semibold text-lg">
            {order.requestBy}
          </p>

          <p className="font-bold text-lg tracking-wide">
            📄 {order.requestNo}
          </p>
        </div>

        <div className="text-right text-sm sm:text-base font-medium space-y-1">
          <div className="flex items-center justify-end gap-1 text-gray-300">
            📅
            <span>
              {dayjs(order.requiredDate)
                .tz("Asia/Bangkok")
                .format("DD/MM/YYYY")}
            </span>
          </div>
          <p className={`font-bold ${statusColors[status] || "text-white"}`}>
            {statusText}
          </p>
        </div>
      </div>

      {/*
      <div className="flex justify-between items-center text-sm sm:text-base text-gray-300 border-t border-white/10 pt-3">
        <div className="flex items-center gap-2">
          🚚 <span className="font-medium">บริการ:</span>
          <span className="text-white">
            {order.shipAgentServCode?.trim() ? order.shipAgentServCode : "-"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          💳 <span className="font-medium">การชำระเงิน:</span>
          <span className="text-white">
            {order.orderStatus?.trim() ? order.orderStatus : "-"}
          </span>
        </div>
      </div>
      */}

      <div className="flex justify-between items-center text-sm sm:text-base text-gray-300 border-t border-white/10 pt-3">
        <div className="flex items-center gap-2">
          📝 <span className="font-medium">หมายเหตุ(คลังย่อย) : </span>
          <span className="text-white">{order.note ? order.note : "-"}</span>
        </div>
      </div>

      {order.currentDepartment !== "main-warehouse" &&
        order.mainWarehouseNote && (
          <div className="flex justify-between items-center text-sm sm:text-base text-gray-300 border-t border-white/10 pt-3">
            <div className="flex items-center gap-2">
              📝 <span className="font-medium">หมายเหตุ(คลังกลาง) : </span>
              <span className="text-white">
                {order.mainWarehouseNote ? order.mainWarehouseNote : "-"}
              </span>
            </div>
          </div>
        )}

      {/* 
      {order.note && (
        <p className="text-xs text-gray-400 border-t border-white/10 pt-2 mt-2">
          📝 {order.note}
        </p>
      )} */}

      <p className="text-xs text-gray-400 border-t border-white/10 pt-2 mt-2"></p>

      {/* {order.mainWarehouseNote && (
        <p className="text-xs text-gray-400 border-t border-white/10 pt-2 mt-2">
          📝 {order.mainWarehouseNote}
        </p>
      )} */}
      <div className="bg-slate-900 rounded-md px-4 py-3 border border-white/5 space-y-1">
        <div className="flex justify-between items-center text-white font-semibold text-lg">
          {/* ซ้าย: productCode */}
          <div className="flex items-center gap-2">
            📦 <span>{order.productCode || ""}</span>
          </div>

          {/* ขวา: ผู้ดำเนินการ */}
          {order.acknowledgedBy && (
            <div className="text-gray-300 flex items-center gap-1 text-sm">
              <span className="text-xs leading-none">🧑‍🔧</span>
              <span>ผู้ดำเนินการ:</span>
              <span className="font-semibold">
                {order.acknowledgedBy || "-"}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 text-base text-gray-100">
          📝 <span>{order.productName || ""}</span>
        </div>

        <div className="flex justify-between items-center text-sm pt-2">
          <span className="text-blue-300 flex items-center gap-1">
            🏠 <span>แผนก:</span>{" "}
            <span className="font-semibold">
              {translateDepartment(order.currentDepartment)}
            </span>
          </span>

          <span className="text-gray-300 flex items-center gap-1">
            {order.currentDepartment === "main-warehouse" ? (
              <>
                📦 <span>จำนวน:</span>{" "}
                <span className="text-red-400 font-bold tracking-wider font-semibold">
                  {order.requestQuantity}
                </span>{" "}
                {order.requestUnit === "pallet" ? "พาเลท" : "ชิ้น"}
              </>
            ) : (
              <>
                📦 <span>สถานะ:</span>{" "}
                <span className="text-red-400 font-bold tracking-wider font-semibold">
                  {/* ({sub?.quantityScanned}/{sub?.quantity}) */}(
                  {order.processQuantity}/{order.requestQuantity})
                </span>
              </>
            )}
          </span>
        </div>
        {/* {order.currentDepartment === "main-warehouse" &&
          order.acknowledgedBy && (
            <div className="flex items-center gap-2 text-lime-400 text-sm">
              <span className="text-xs leading-none">👤</span>
              <span>ผู้ดำเนินการ:</span>
              <span className="font-semibold">
                {order.acknowledgedBy || "-"}
              </span>
            </div>
          )} */}
      </div>

      {Array.isArray(order.salesordersubs) &&
        order.salesordersubs.length > 0 && (
          <div className="space-y-2 border-t border-white/10 pt-3">
            {order.salesordersubs.map((sub, i) => (
              <div
                key={i}
                className="bg-slate-900 rounded-md px-4 py-3 border border-white/5 space-y-1"
              >
                <div className="flex items-center gap-2 text-white font-semibold text-lg">
                  📦 <span>{sub.itemNo}</span>
                </div>

                {sub.description && (
                  <div className="flex items-center gap-2 text-base text-gray-100">
                    📝 <span>{sub.description}</span>
                  </div>
                )}

                <div className="flex justify-between items-center text-sm pt-2">
                  <span className="text-blue-300 flex items-center gap-1">
                    🏠 <span>ห้องจัดของ:</span>{" "}
                    <span className="font-semibold">
                      {sub.locationCode || "ไม่ระบุ"}
                    </span>
                  </span>
                  <span className="text-gray-300 flex items-center gap-1">
                    📦 <span>สถานะ:</span>{" "}
                    <span className="text-red-400 font-bold tracking-wider font-semibold">
                      ({sub.quantityScanned}/{sub.quantity})
                    </span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
    </div>
  );
}
