import { useEffect, useState } from "react";
import {
  BuildingOffice2Icon,
  BuildingLibraryIcon,
  ClipboardDocumentCheckIcon,
  CubeIcon,
  BuildingStorefrontIcon,
} from "@heroicons/react/24/solid";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import OrderListSection from "@/components/OrderListSection";
import OrderStatusLegend from "@/components/OrderStatusLegend";
import { fetchOrders } from "@/api/orders";

dayjs.extend(utc);
dayjs.extend(timezone);

function App() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [setError] = useState("");
  const tabs = [
    {
      key: "all",
      label: "ทุกแผนก",
      icon: <BuildingOffice2Icon className="w-5 h-5" />,
      disabled: false,
    },
    {
      key: "main-warehouse",
      label: "คลังกลาง",
      icon: <BuildingLibraryIcon className="w-5 h-5" />,
      disabled: false,
    },
    {
      key: "inspection",
      label: "ตรวจเช็ค",
      icon: <ClipboardDocumentCheckIcon className="w-5 h-5" />,
      disabled: false,
    },
    {
      key: "packaging",
      label: "บรรจุ",
      icon: <CubeIcon className="w-5 h-5" />,
      disabled: false,
    },
  ];

  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    const load = async () => {
      try {
        const allOrders = await fetchOrders();
        setOrders(allOrders);
      } catch (err) {
        console.error("❌ Fetch error:", err);
        setError(err.message);
      }
    };
  
    load();
  
    const intervalId = setInterval(load, 10 * 1000); 
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const filtered = activeTab === "all"
      ? orders
      : orders.filter((o) => o.currentDepartment === activeTab);
  
    setFilteredOrders(filtered);
  }, [activeTab, orders]);
  
  // useEffect(() => {
  //   const load = async () => {
  //     const locations = locationMap[activeTab];
  //     try {
  //       if (activeTab === "main-warehouse") {
  //         console.log({ activeTab });
  //       } else if (activeTab === "inspection") {
  //         console.log("inspection");
  //       } else if (activeTab === "packaging") {
  //         console.log("packaging");
  //       }

  //       const orders = await fetchOrders();
  //       setOrders(orders);
  //     } catch (err) {
  //       console.error("❌ Fetch error:", err);
  //       setError(err.message);
  //     }
  //   };

  //   load();

  //   const intervalId = setInterval(load, 10 * 1000);
  //   return () => clearInterval(intervalId);
  // }, [activeTab, setError]);

  return (
    <>
      <div className="px-6 pt-4  mb-4">
        <div className="flex flex-wrap justify-between items-start gap-y-4">
          <div className="flex gap-4 flex-wrap">
            {tabs.map((tab, index) => (
              <button
                key={index}
                disabled={tab.disabled}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center px-4 py-2 rounded-lg shadow-md transition-all duration-200
            ${
              tab.disabled
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : tab.key === activeTab
                ? "bg-cyan-500 text-white shadow-lg"
                : "bg-white text-gray-800 hover:bg-cyan-100"
            }`}
              >
                <div
                  className={`w-6 h-6 rounded-md flex items-center justify-center mr-2
              ${
                tab.key === activeTab
                  ? "bg-white text-cyan-600"
                  : "bg-gray-200 text-gray-700"
              }
            `}
                >
                  {tab.icon}
                </div>
                <span className="text-sm font-medium whitespace-nowrap">
                  {tab.label}
                </span>
              </button>
            ))}
          </div>

          <OrderStatusLegend />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-screen px-2 sm:px-4 lg:px-6">
        <OrderListSection
          title="⚡ งานด่วน"
          bgColor="bg-red-500"
          orders={filteredOrders.filter((o) => o.isUrgent)}
        />

        <OrderListSection
          title="🆕 งานใหม่"
          bgColor="bg-amber-600"
          orders={filteredOrders.filter(
            (o) => !o.isUrgent && o.departmentStatus === 'waiting_acknowledged'
          )}
        />

        <OrderListSection
          title="🛠️ งานกำลังทำ"
          bgColor="bg-blue-500"
          orders={filteredOrders.filter(
            (o) =>
              !o.isUrgent &&
              ['acknowledged', 'in_progress'].includes(o.departmentStatus)
          )}
        />
      </div>
    </>
  );
}

export default App;
