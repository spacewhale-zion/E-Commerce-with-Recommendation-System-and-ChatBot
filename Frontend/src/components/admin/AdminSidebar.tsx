import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { IconType } from "react-icons";
import { IoIosPeople } from "react-icons/io";
import {
  RiCoupon3Fill,
  RiDashboardFill,
  RiShoppingBag3Fill,
} from "react-icons/ri";
import {
  FaChartBar,
  FaChartLine,
  FaChartPie,
  FaGamepad,
  FaStopwatch,
} from "react-icons/fa";
import { HiMenuAlt4 } from "react-icons/hi"; // ✅ Added missing import

interface SidebarItem {
  url: string;
  text: string;
  Icon: IconType;
}

const sidebarItems: SidebarItem[] = [
  { url: "/admin/dashboard", text: "Dashboard", Icon: RiDashboardFill },
  { url: "/admin/product", text: "Product", Icon: RiShoppingBag3Fill },
  { url: "/admin/customer", text: "Customer", Icon: IoIosPeople },
  { url: "/admin/transaction", text: "Transaction", Icon: RiCoupon3Fill },
];

const chartItems: SidebarItem[] = [
  { url: "/admin/chart/bar", text: "Bar", Icon: FaChartBar },
  { url: "/admin/chart/pie", text: "Pie", Icon: FaChartPie },
  { url: "/admin/chart/line", text: "Line", Icon: FaChartLine },
];

const appItems: SidebarItem[] = [
  { url: "/admin/app/stopwatch", text: "Stopwatch", Icon: FaStopwatch },
  { url: "/admin/app/coupon", text: "Coupon", Icon: RiCoupon3Fill },
  { url: "/admin/app/toss", text: "Toss", Icon: FaGamepad },
];

const AdminSidebar = () => {
  const location = useLocation();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [phoneActive, setPhoneActive] = useState<boolean>(
    window.innerWidth < 1100
  );

  const resizeHandler = () => {
    setPhoneActive(window.innerWidth < 1100);
  };

  useEffect(() => {
    window.addEventListener("resize", resizeHandler);

    return () => {
      window.removeEventListener("resize", resizeHandler);
    };
  }, []);

  return (
    <>
      {phoneActive && (
        <button id="hamburger" onClick={() => setShowModal(true)}>
          <HiMenuAlt4 />
        </button>
      )}

      <aside
        style={
          phoneActive
            ? {
                width: "20rem",
                height: "100vh",
                position: "fixed",
                top: 0,
                left: showModal ? "0" : "-20rem",
                transition: "all 0.5s",
              }
            : {}
        }
      >
        <h2>Logo.</h2>
        <SidebarSection title="Dashboard" items={sidebarItems} location={location} />
        <SidebarSection title="Charts" items={chartItems} location={location} />
        <SidebarSection title="Apps" items={appItems} location={location} />

        {phoneActive && (
          <button id="close-sidebar" onClick={() => setShowModal(false)}>
            Close
          </button>
        )}
      </aside>
    </>
  );
};

interface SidebarSectionProps {
  title: string;
  items: SidebarItem[];
  location: ReturnType<typeof useLocation>;
}

const SidebarSection = ({ title, items, location }: SidebarSectionProps) => (
  <div>
    <h5>{title}</h5>
    <ul>
      {items.map((item, index) => (
        <Li key={index} {...item} location={location} />
      ))}
    </ul>
  </div>
);

interface LiProps {
  url: string;
  text: string;
  location: ReturnType<typeof useLocation>;
  Icon: IconType;
}

const Li = ({ url, text, location, Icon }: LiProps) => (
  <li
    style={{
      backgroundColor: location.pathname.includes(url) ? "rgba(0,115,255,0.1)" : "white",
    }}
  >
    <Link to={url}>
      <Icon />
      {text}
    </Link>
  </li>
);

export default AdminSidebar;
