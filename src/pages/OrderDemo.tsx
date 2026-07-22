import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "@/lib/LanguageContext";
import {
  Check,
  ChevronRight,
  ChevronDown,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  UtensilsCrossed,
  Calendar,
  Plane,
  BedDouble,
  Search,
  Sliders,
  Sparkles,
  FolderOpen,
  CheckCircle,
  FileCheck,
  AlertCircle,
  Menu
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast, Toaster } from "sonner";

// Receipt Interface exported for Admin page compliance
export interface Receipt {
  orderId: string;
  orderedAt: string;
  items: Array<MenuItem & { quantity: number }>;
  subtotal: number;
  serviceFee: number;
  total: number;
}

// 20 Houses Mock DB with specified Project Types
export interface HouseItem {
  id: number;
  code: string;
  name: string;
  style: string;
  type: "accommodation" | "flight" | "restaurant" | "ecommerce";
  color: string;
  basePrice: number;
  progress: number;
}

const projectData: HouseItem[] = [
  { id: 1, code: 'TN01', name: '01-the-chill-crew', style: 'Modern Minimalist', type: 'accommodation', color: '#6366F1', basePrice: 1800000, progress: 85 },
  { id: 2, code: 'TN02', name: '02-cozy-oracles', style: 'Neo-Classical', type: 'flight', color: '#b45309', basePrice: 4200000, progress: 45 },
  { id: 3, code: 'TN03', name: '03-controller-kings', style: 'Nordic Timber', type: 'ecommerce', color: '#059669', basePrice: 2100000, progress: 90 },
  { id: 4, code: 'TN04', name: '04-the-netflix-hermits', style: 'Brutalist Concrete', type: 'ecommerce', color: '#1e293b', basePrice: 3100000, progress: 10 },
  { id: 5, code: 'TN05', name: '05-aesthetic-dreamers', style: 'Cozy Wood Cabin', type: 'accommodation', color: '#78350f', basePrice: 1500000, progress: 100 },
  { id: 6, code: 'TN06', name: '06-lo-fi-homebodies', style: 'Glass Contemporary', type: 'flight', color: '#0284c7', basePrice: 2900000, progress: 60 },
  { id: 7, code: 'TN07', name: '07-steak-game-bros', style: 'Organic Earth Dome', type: 'restaurant', color: '#10B981', basePrice: 1200000, progress: 80 },
  { id: 8, code: 'TN08', name: '08-vibe-architects', style: 'Industrial Brickwork', type: 'ecommerce', color: '#991b1b', basePrice: 2500000, progress: 75 },
  { id: 9, code: 'TN09', name: '09-sunset-superfans', style: 'Japanese Zen', type: 'accommodation', color: '#16a34a', basePrice: 1900000, progress: 100 },
  { id: 10, code: 'TN10', name: '10-lazy-mermaids', style: 'Modular Container', type: 'flight', color: '#ca8a04', basePrice: 1400000, progress: 30 },
  { id: 11, code: 'TN11', name: '11-the-sharp-cuts', style: 'Mid-Century Gable', type: 'restaurant', color: '#475569', basePrice: 2350000, progress: 5 },
  { id: 12, code: 'TN12', name: '12-coastal-avengers', style: 'Tropical Canopy', type: 'ecommerce', color: '#0d9488', basePrice: 3800000, progress: 95 },
  { id: 13, code: 'TN13', name: '13-the-dungeon-masters', style: 'Step Architecture', type: 'accommodation', color: '#4338ca', basePrice: 4700000, progress: 55 },
  { id: 14, code: 'TN14', name: '14-the-all-rounders', style: 'Atrium Courtyard', type: 'flight', color: '#db2777', basePrice: 3200000, progress: 100 },
  { id: 15, code: 'TN15', name: '15-mountain-mode', style: 'Flat-Roof Minimal', type: 'restaurant', color: '#0f172a', basePrice: 2700000, progress: 15 },
  { id: 16, code: 'TN16', name: '16-blue-hour-society', style: 'Modern Steel Frame', type: 'ecommerce', color: '#334155', basePrice: 2900000, progress: 70 },
  { id: 17, code: 'TN17', name: '17-midnight-raiders', style: 'Spanish Terracotta', type: 'accommodation', color: '#c2410c', basePrice: 3100000, progress: 80 },
  { id: 18, code: 'TN18', name: '18-indie-mountain-kids', style: 'Parametric Fluid', type: 'flight', color: '#06b6d4', basePrice: 5500000, progress: 0 },
  { id: 19, code: 'TN19', name: '19-ocean-avengers', style: 'Victorian Restoration', type: 'restaurant', color: '#6d28d9', basePrice: 3600000, progress: 100 },
  { id: 20, code: 'TN20', name: '20-final-boss-crew', style: 'Waterfront Living', type: 'ecommerce', color: '#0369a1', basePrice: 2200000, progress: 40 }
];

// Kanban Database
interface KanbanTask {
  id: number;
  titleTh: string;
  titleEn: string;
  level: "High" | "Medium" | "Low";
  daysTh: string;
  daysEn: string;
}

const tasksDatabase: Record<string, KanbanTask[]> = {
  todo: [
    { id: 101, titleTh: "สำรวจพื้นที่หน้างานและเจาะชั้นดินฐานราก", titleEn: "Site Survey & Soil Test Drilling", level: "High", daysTh: "3 วัน", daysEn: "3 days" },
    { id: 102, titleTh: "ตรวจเช็กและอนุมัติแบบวิศวกรรมโครงสร้างคานหลัก", titleEn: "Verify & Approve Structural Beam Blueprint", level: "Medium", daysTh: "5 วัน", daysEn: "5 days" },
    { id: 103, titleTh: "ส่งรายการวัสดุเสริมเหล็กและปริมาณคอนกรีต", titleEn: "Submit Steel & Concrete Material Take-off", level: "Low", daysTh: "2 วัน", daysEn: "2 days" },
  ],
  progress: [
    { id: 201, titleTh: "ดำเนินการขุดดินเทคอนกรีตฐานรากสเต็ปแรก", titleEn: "Pouring Concrete Foundation Level 1", level: "High", daysTh: "กำลังทำ", daysEn: "In Progress" },
    { id: 202, titleTh: "จัดทำแบบหล่อและเชื่อมโครงเหล็กข้ออ้อย", titleEn: "Welding & Rebar Reinforcement Framing", level: "Medium", daysTh: "กำลังทำ", daysEn: "In Progress" },
  ],
  review: [
    { id: 301, titleTh: "ส่งรายงานผลกำลังอัดคอนกรีต 28 วัน", titleEn: "Review Concrete 28-day Compressive Strength", level: "High", daysTh: "ส่งตรวจ", daysEn: "Under Review" },
    { id: 302, titleTh: "ตรวจสอบระดับแนวดิ่งและมุมแนวเสาหลักด้วยกล้องไลก้า", titleEn: "Audit Vertical Pillar Alignment using Leica Leica", level: "Low", daysTh: "ส่งตรวจ", daysEn: "Under Review" },
  ],
  done: [
    { id: 401, titleTh: "ลงนามอนุมัติผังเขตสิทธิ์การก่อสร้างโดยวิศวกรควบคุม", titleEn: "Sign & Authorize Site Boundary Authorization", level: "Medium", daysTh: "เสร็จสิ้น", daysEn: "Completed" },
    { id: 402, titleTh: "เตรียมพื้นที่เทตอม่อชั่วคราวและลงเสาเข็มทดสอบ", titleEn: "Complete Test Pile Loading & Area Leveling", level: "Low", daysTh: "เสร็จสิ้น", daysEn: "Completed" }
  ]
};

// Menu items for Restaurant Demo
export interface MenuItem {
  id: string;
  name: string;
  nameTh: string;
  nameEn: string;
  descTh: string;
  descEn: string;
  price: number;
  category: string;
}

const foodMenu: MenuItem[] = [
  { id: "padkrapao", name: "ข้าวกะเพราออร์แกนิกไข่ดาว", nameTh: "ข้าวกะเพราออร์แกนิกไข่ดาว", nameEn: "Organic Chicken Krapao with Fried Egg", descTh: "กะเพราป่าเก็บสดใบหอม ผัดไฟแรงพร้อมเนื้อไก่ออร์แกนิกและไข่ดาวเป็ดไล่ทุ่ง", descEn: "Stir-fried organic chicken with hot basil, served with a crispy farm egg over rice.", price: 99, category: "จานเดี่ยว" },
  { id: "tomyum", name: "ต้มยำกุ้งแม่น้ำน้ำข้น", nameTh: "ต้มยำกุ้งแม่น้ำน้ำข้น", nameEn: "Creamy Tom Yum River Prawn", descTh: "กุ้งแม่น้ำตัวใหญ่ในน้ำซุปสมุนไพรสดข้นคลัก พริกเผาปรุงสูตรลับเฉพาะ", descEn: "Creamy, spicy and sour broth infused with local herbs and premium giant prawns.", price: 199, category: "เมนูยอดนิยม" },
  { id: "greencurry", name: "แกงเขียวหวานไก่บ้านยอดมะพร้าว", nameTh: "แกงเขียวหวานไก่บ้านยอดมะพร้าว", nameEn: "Green Curry Chicken with Coconut Shoots", descTh: "พริกแกงตำสดหอมกลิ่นเครื่องเทศ แกงกะทิคั้นมือคู่มะพร้าวอ่อนกรอบ", descEn: "House-made curry paste simmered with free-range chicken and sweet coconut shoots.", price: 159, category: "กับข้าว" },
  { id: "mangosticky", name: "ข้าวเหนียวมะม่วงน้ำดอกไม้", nameTh: "ข้าวเหนียวมะม่วงน้ำดอกไม้", nameEn: "Mango Sticky Rice", descTh: "มะม่วงน้ำดอกไม้สุกหวานฉ่ำ เสิร์ฟพร้อมข้าวเหนียวมูนกะทิข้นสดใบเตย", descEn: "Sweet ripe mango served with premium coconut-dressed sticky rice.", price: 129, category: "ของหวาน" },
];

export default function OrderDemo() {
  const { language } = useTranslation();
  const [activeHouseId, setActiveHouseId] = useState<number>(7); // Default to House 7 (07-steak-game-bros)
  const [activeTab, setActiveTab] = useState<"kanban" | "demo">("demo");
  const [demoRole, setDemoRole] = useState<string>("customer");
  const [sprint, setSprint] = useState<number>(1);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [projectDropdownOpen, setProjectDropdownOpen] = useState(false);

  // Accommodation demo states
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [roomType, setRoomType] = useState("Deluxe Cabin");
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  // Flight demo states
  const [fromCity, setFromCity] = useState("Bangkok (DMK)");
  const [toCity, setToCity] = useState("Chiang Mai (CNX)");
  const [departDate, setDepartDate] = useState("");
  const [flightConfirmed, setFlightConfirmed] = useState(false);

  // E-Commerce demo states
  const [shopCart, setShopCart] = useState<Record<string, number>>({});
  const [ecommerceConfirmed, setEcommerceConfirmed] = useState(false);

  // General checkout modal states
  const [restaurantConfirmed, setRestaurantConfirmed] = useState(false);

  // Helper for formatted Thai currency
  const money = (num: number) => {
    return new Intl.NumberFormat("th-TH", {
      style: "currency",
      currency: "THB",
      maximumFractionDigits: 0
    }).format(num);
  };

  const activeHouse = useMemo(() => {
    return projectData.find(h => h.id === activeHouseId) || projectData[6];
  }, [activeHouseId]);

  const activeTypeLabel = (type: string) => {
    if (language === 'en') {
      switch (type) {
        case "accommodation": return "Resort Booking";
        case "flight": return "Flight Ticket Booking";
        case "restaurant": return "Room Service Dining";
        case "ecommerce": return "Smart Home E-Store";
        default: return type;
      }
    } else {
      switch (type) {
        case "accommodation": return "จองที่พักรีสอร์ต";
        case "flight": return "จองตั๋วเครื่องบิน";
        case "restaurant": return "สั่งอาหารรูมเซอร์วิส";
        case "ecommerce": return "ร้านค้าสินค้าไอที";
        default: return type;
      }
    }
  };

  // Toast notifications for actions
  const triggerToast = (msg: string) => {
    toast.success(msg);
  };

  // Reset demo states when house changes
  useEffect(() => {
    setCart({});
    setShopCart({});
    setBookingConfirmed(false);
    setFlightConfirmed(false);
    setEcommerceConfirmed(false);
    setRestaurantConfirmed(false);
  }, [activeHouseId]);

  // Lock body scroll at root document level to prevent outer browser scrolling
  useEffect(() => {
    if (activeHouseId === 7 && activeTab === "demo") {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [activeHouseId, activeTab]);

  // Restaurant ordering actions
  const changeFoodQty = (id: string, amt: number) => {
    setCart(prev => {
      const val = (prev[id] || 0) + amt;
      const next = { ...prev, [id]: val };
      if (val <= 0) delete next[id];
      return next;
    });
  };

  const cartTotal = useMemo(() => {
    return foodMenu.reduce((sum, item) => sum + item.price * (cart[item.id] || 0), 0);
  }, [cart]);

  // Smart Home E-Commerce items
  const techProducts = [
    { id: "bulb", nameTh: "หลอดไฟเปลี่ยนสีอัจฉริยะ", nameEn: "Smart RGB Dome Bulb", price: 490 },
    { id: "sensor", nameTh: "เซ็นเซอร์จับความชื้นในโดม", nameEn: "Eco Dome Humidity Sensor", price: 850 },
    { id: "lock", nameTh: "กลอนประตูสแกนลายนิ้วมือ", nameEn: "Biometric Smart Door Lock", price: 3200 },
    { id: "speaker", nameTh: "ลำโพงสั่งการผู้ช่วยอัจฉริยะ", nameEn: "Voice Assistant Smart Speaker", price: 1500 }
  ];

  const changeTechQty = (id: string, amt: number) => {
    setShopCart(prev => {
      const val = (prev[id] || 0) + amt;
      const next = { ...prev, [id]: val };
      if (val <= 0) delete next[id];
      return next;
    });
  };

  const shopTotal = useMemo(() => {
    return techProducts.reduce((sum, item) => sum + item.price * (shopCart[item.id] || 0), 0);
  }, [shopCart]);

  return (
    <div className="order-theme bg-background text-foreground font-sans leading-relaxed selection:bg-sky-600 selection:text-white flex h-screen w-screen overflow-hidden pb-0">
      <Toaster position="top-center" richColors />

      {/* LEFT SIDEBAR */}
      <aside className={`${sidebarCollapsed ? "w-0 border-r-0" : "w-64 border-r border-stone-200"} bg-stone-50 flex flex-col justify-between h-screen shrink-0 transition-all duration-300 overflow-hidden z-50`}>
          <div className="p-4 border-b border-stone-200 flex items-center justify-between bg-white shrink-0">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse"></span>
              <span className="font-black text-stone-800 text-sm tracking-tight">TN House Portal</span>
            </div>
            <button
              onClick={() => setSidebarCollapsed(true)}
              className="p-1 hover:bg-stone-100 rounded text-stone-400 hover:text-stone-600 transition-colors cursor-pointer"
              title={language === 'en' ? "Close menu" : "ปิดเมนู"}
            >
              <ChevronRight className="size-4 rotate-180" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto py-4 space-y-6">
            {/* A. Project Selector */}
            <div className="px-4">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block mb-2 font-mono">
                {language === 'en' ? 'Project Selection' : 'เลือกโครงการ'}
              </span>
              <div className="relative" id="project-dropdown-container">
                <button
                  onClick={() => setProjectDropdownOpen(!projectDropdownOpen)}
                  className="w-full flex items-center bg-white border border-stone-200 hover:border-stone-300 rounded-xl px-3 py-2.5 shadow-sm text-left cursor-pointer transition-colors"
                  id="house-selector-sidebar-trigger"
                >
                  <Search className="size-4 text-stone-400 mr-2 shrink-0" />
                  <span className="text-xs text-stone-800 font-extrabold flex-1 truncate">
                    {activeHouse.code} - {activeHouse.name}
                  </span>
                  <ChevronDown className={`size-3 text-stone-400 transition-transform ${projectDropdownOpen ? "rotate-180" : ""}`} />
                </button>

                {projectDropdownOpen && (
                  <>
                    {/* Transparent overlay to close dropdown */}
                    <div 
                      className="fixed inset-0 z-40 bg-transparent" 
                      onClick={() => setProjectDropdownOpen(false)} 
                    />
                    
                    {/* Dropdown Popover */}
                    <div className="absolute left-0 right-0 mt-1.5 bg-white border border-stone-200 rounded-2xl shadow-xl z-50 max-h-72 overflow-y-auto p-1.5 space-y-0.5 no-scrollbar scroll-smooth">
                      {projectData.map((house) => {
                        const isSelected = house.id === activeHouseId;
                        return (
                          <button
                            key={house.id}
                            onClick={() => {
                              setActiveHouseId(house.id);
                              setProjectDropdownOpen(false);
                            }}
                            className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center justify-between ${
                              isSelected
                                ? "bg-sky-50 text-sky-800"
                                : "text-stone-700 hover:bg-stone-50 hover:text-stone-900"
                            }`}
                          >
                            <span className="truncate">{house.code} - {house.name}</span>
                            {isSelected && <Check className="size-3 text-sky-600 shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* B. View Mode Switcher */}
            <div className="px-4">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block mb-2 font-mono">
                {language === 'en' ? 'View Mode' : 'โหมดการดู'}
              </span>
              <div className="flex flex-col gap-1.5">
                <button
                  onClick={() => setActiveTab("kanban")}
                  className={`w-full px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                    activeTab === "kanban"
                      ? "bg-sky-600 text-white shadow-sm"
                      : "text-stone-600 hover:text-stone-900 bg-stone-100/60 hover:bg-stone-100"
                  }`}
                  id="sidebar-tab-kanban-trigger"
                >
                  <Sliders className="size-3.5" />
                  <span>{language === 'en' ? 'Sprint Board' : 'บอร์ดความคืบหน้า'}</span>
                </button>
                <button
                  onClick={() => setActiveTab("demo")}
                  className={`w-full px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                    activeTab === "demo"
                      ? "bg-sky-600 text-white shadow-sm"
                      : "text-stone-600 hover:text-stone-900 bg-stone-100/60 hover:bg-stone-100"
                  }`}
                  id="sidebar-tab-demo-trigger"
                >
                  <Sparkles className="size-3.5" />
                  <span>{language === 'en' ? 'Live Demo' : 'เดโมระบบจำลอง'}</span>
                </button>
              </div>
            </div>

            {/* C. Demo Role Switcher */}
            {activeHouse.code === "TN07" && activeTab === "demo" && (
              <div className="px-4">
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block mb-2 font-mono">
                  {language === 'en' ? 'Demo Role' : 'บทบาทผู้ใช้งาน'}
                </span>
                <div className="flex flex-col gap-1.5">
                  {[
                    { value: "customer", labelTh: "ลูกค้า (Customer)", labelEn: "Customer" },
                    { value: "staff", labelTh: "พนักงาน (Staff)", labelEn: "Staff" },
                    { value: "kitchen", labelTh: "ห้องครัว (Kitchen)", labelEn: "Kitchen" },
                  ].map((role) => (
                    <button
                      key={role.value}
                      onClick={() => setDemoRole(role.value)}
                      className={`w-full px-3 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                        demoRole === role.value
                          ? "bg-sky-50 text-sky-800 border border-sky-200"
                          : "text-stone-600 hover:text-stone-900 bg-white hover:bg-stone-100/50 border border-stone-200/60"
                      }`}
                      id={`sidebar-role-${role.value}-trigger`}
                    >
                      <span>{language === 'en' ? role.labelEn : role.labelTh}</span>
                      {demoRole === role.value && <Check className="size-3.5 text-sky-600 shrink-0" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-stone-200 bg-white flex flex-col gap-2 shrink-0">
            <div className="text-[10px] text-stone-400 font-bold text-center">
              Powered by Botnoi WebAvatar
            </div>
            <Link
              to="/"
              className="w-full text-center py-2 bg-stone-100 hover:bg-stone-200 text-stone-600 hover:text-stone-900 text-xs font-bold rounded-xl transition-all border border-stone-200/80"
              id="sidebar-back-home-button"
            >
              {language === 'en' ? 'Back to Hub' : 'กลับสู่หน้าหลัก'}
            </Link>
          </div>
        </aside>

      {/* 3. Main Workspace Container (Fluid to take full width and height with sidebar layout) */}
      <div className={`w-full grow flex flex-col overflow-y-auto min-h-0 relative ${activeHouse.code === "TN07" && activeTab === "demo" ? "px-0 py-0" : "px-6 py-8 md:px-10"}`}>

        {/* Floating Sidebar Toggle Button (Only when sidebar is collapsed) */}
        {sidebarCollapsed && (
          <button
            onClick={() => setSidebarCollapsed(false)}
            className="absolute top-4 left-4 z-40 p-2 bg-white/95 backdrop-blur-md hover:bg-white text-stone-700 hover:text-sky-600 rounded-full shadow-lg border border-stone-200 cursor-pointer flex items-center justify-center transition-all hover:scale-105 active:scale-95"
            id="floating-sidebar-toggle-btn"
            title={language === 'en' ? "Open menu" : "เปิดเมนู"}
          >
            <Menu className="size-4" />
          </button>
        )}

        {/* Breadcrumb Path Route - Hidden when full screen */}
        {!(activeHouse.code === "TN07" && activeTab === "demo") && (
          <nav className="mb-6 flex items-center gap-2 text-xs text-stone-500 font-bold" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-sky-600 transition-colors">{language === 'en' ? 'Home' : 'หน้าหลัก'}</Link>
            <ChevronRight className="size-3 text-stone-400" />
            <span className="text-sky-600">{activeHouse.code} ({activeHouse.name})</span>
            <ChevronRight className="size-3 text-stone-400" />
            <span className="text-stone-800 font-extrabold uppercase font-mono">{activeTypeLabel(activeHouse.type)}</span>
          </nav>
        )}

        {/* Main Selection Title - Hidden when full screen */}
        {!(activeHouse.code === "TN07" && activeTab === "demo") && (
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200 pb-4 mb-8">
            <div>
              <h2 className="text-2xl font-black text-stone-900 tracking-tight flex items-center gap-2">
                <Sparkles className="size-6 text-sky-600 animate-pulse" />
                {language === 'en' ? 'Adaptive Client Sandbox' : 'แซนด์บอกซ์จำลองโครงการบ้าน'}
              </h2>
              <p className="text-xs text-stone-500 font-bold mt-1">
                {language === 'en'
                  ? "Switch houses dynamically. The portal renders hotel booking, flight booking, restaurant orders, or IT shop."
                  : "สลับดูการทำงานของบ้าน 20 หลังได้ทันที ระบบจะเปลี่ยนฟังก์ชันจำลองและการตอบกลับของ WebAvatar ตามประเภทของบ้าน"
                }
              </p>
            </div>
          </div>
        )}

        {/* 4. Tab 1: KANBAN SPRINT PROGRESS BOARD */}
        <AnimatePresence mode="wait">
          {activeTab === "kanban" && (
            <motion.div
              key="kanban-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="space-y-6 max-w-7xl mx-auto w-full"
            >
              {/* Sprint control header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white border border-stone-200 p-5 rounded-3xl shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600">
                    <FolderOpen className="size-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-stone-900 m-0 tracking-wide">
                      {language === 'en' ? `Construction Sprint Progress — Sprint ${sprint}` : `ความคืบหน้างานก่อสร้างประจำสัปดาห์ — Sprint ${sprint}`}
                    </h3>
                    <p className="text-[11px] text-stone-500 mt-0.5 font-bold">
                      {language === 'en' ? 'Check weekly tasks and sprint cards for: ' : 'ตรวจสอบรายการการ์ดงานของ: '}
                      <span className="text-sky-600 font-extrabold">{activeHouse.code} - {activeHouse.name}</span>
                    </p>
                  </div>
                </div>

                {/* Sprint switcher tabs */}
                <div className="flex bg-stone-100 border border-stone-200 p-1 rounded-xl">
                  {[1, 2, 3].map((num) => (
                    <button
                      key={num}
                      onClick={() => {
                        setSprint(num);
                        triggerToast(language === 'en' ? `Switched to Sprint ${num}` : `สลับข้อมูลเป็น Sprint ${num} เรียบร้อย`);
                      }}
                      className={`px-4 py-1.5 rounded-lg text-xs font-black transition-all ${sprint === num
                          ? "bg-white text-sky-600 border border-stone-200/50 shadow-sm"
                          : "text-stone-500 hover:text-stone-800"
                        }`}
                    >
                      Sprint {num}
                    </button>
                  ))}
                </div>
              </div>

              {/* Kanban Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Column 1: To-Do */}
                <div className="flex flex-col bg-stone-50/50 border border-stone-200 rounded-3xl p-4 min-h-[400px] shadow-sm">
                  <div className="flex items-center justify-between border-b border-stone-200 pb-3 mb-4">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-stone-400"></span>
                      <span className="text-xs font-black text-stone-800 tracking-wide">{language === 'en' ? 'To-Do' : 'รอเริ่มงาน'}</span>
                    </div>
                    <span className="bg-stone-200/60 text-stone-600 text-[10px] font-bold px-2 py-0.5 rounded-md font-mono">
                      {tasksDatabase.todo.length}
                    </span>
                  </div>
                  <div className="space-y-4 overflow-y-auto no-scrollbar">
                    {tasksDatabase.todo.map((task) => (
                      <KanbanCard key={task.id} task={task} house={activeHouse} sprint={sprint} language={language} />
                    ))}
                  </div>
                </div>

                {/* Column 2: In Progress */}
                <div className="flex flex-col bg-stone-50/50 border border-stone-200 rounded-3xl p-4 min-h-[400px] shadow-sm">
                  <div className="flex items-center justify-between border-b border-stone-200 pb-3 mb-4">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                      <span className="text-xs font-black text-stone-800 tracking-wide">{language === 'en' ? 'In Progress' : 'กำลังดำเนินการ'}</span>
                    </div>
                    <span className="bg-stone-200/60 text-stone-600 text-[10px] font-bold px-2 py-0.5 rounded-md font-mono">
                      {tasksDatabase.progress.length}
                    </span>
                  </div>
                  <div className="space-y-4 overflow-y-auto no-scrollbar">
                    {tasksDatabase.progress.map((task) => (
                      <KanbanCard key={task.id} task={task} house={activeHouse} sprint={sprint} language={language} />
                    ))}
                  </div>
                </div>

                {/* Column 3: Under Review */}
                <div className="flex flex-col bg-stone-50/50 border border-stone-200 rounded-3xl p-4 min-h-[400px] shadow-sm">
                  <div className="flex items-center justify-between border-b border-stone-200 pb-3 mb-4">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
                      <span className="text-xs font-black text-stone-800 tracking-wide">{language === 'en' ? 'Review' : 'ส่งตรวจงาน'}</span>
                    </div>
                    <span className="bg-stone-200/60 text-stone-600 text-[10px] font-bold px-2 py-0.5 rounded-md font-mono">
                      {tasksDatabase.review.length}
                    </span>
                  </div>
                  <div className="space-y-4 overflow-y-auto no-scrollbar">
                    {tasksDatabase.review.map((task) => (
                      <KanbanCard key={task.id} task={task} house={activeHouse} sprint={sprint} language={language} />
                    ))}
                  </div>
                </div>

                {/* Column 4: Done */}
                <div className="flex flex-col bg-stone-50/50 border border-stone-200 rounded-3xl p-4 min-h-[400px] shadow-sm">
                  <div className="flex items-center justify-between border-b border-stone-200 pb-3 mb-4">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-sky-500 animate-pulse"></span>
                      <span className="text-xs font-black text-stone-800 tracking-wide">{language === 'en' ? 'Done' : 'เสร็จสมบูรณ์'}</span>
                    </div>
                    <span className="bg-stone-200/60 text-stone-600 text-[10px] font-bold px-2 py-0.5 rounded-md font-mono">
                      {tasksDatabase.done.length}
                    </span>
                  </div>
                  <div className="space-y-4 overflow-y-auto no-scrollbar">
                    {tasksDatabase.done.map((task) => (
                      <KanbanCard key={task.id} task={task} house={activeHouse} sprint={sprint} language={language} />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* 5. Tab 2: INTERACTIVE DYNAMIC PROJECTS (DEMO) */}
          {activeTab === "demo" && (
            <motion.div
              key="demo-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className={activeHouse.code === "TN07" ? "w-full grow flex flex-col overflow-hidden" : "w-full max-w-7xl mx-auto"}
            >

              {/* RESTAURANT DEMO (MAPPED TO HOUSE 7) */}
              {activeHouse.type === "restaurant" && (
                activeHouse.code === "TN07" ? (
                  <div className="w-full h-[calc(100vh-68px)] overflow-hidden bg-white">
                    <iframe
                      src={`https://ran-lung-get.lovable.app/${demoRole}`}
                      className="w-full h-full border-none"
                      title="Ran Lung Get LINE LIFF App"
                      sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                      id="liff-app-iframe"
                    />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
                    {/* Left: Food Menu Display */}
                    <div className="space-y-6">
                      <div className="bg-white border border-stone-200 p-6 rounded-3xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
                        <div>
                          <span className="text-[10px] font-bold text-sky-600 uppercase tracking-widest block font-mono">
                            {language === 'en' ? 'Eco Dome Room Service' : 'ระบบสั่งอาหารแบบไดนามิก'}
                          </span>
                          <h3 className="text-xl font-extrabold text-stone-900 mt-1 tracking-tight">
                            {language === 'en' ? `${activeHouse.name} Café & Dining` : `${activeHouse.name} บริการอาหารอร่อยถึงที่`}
                          </h3>
                          <p className="text-xs text-stone-500 font-bold mt-0.5 leading-relaxed">
                            {language === 'en'
                              ? "Try speaking commands like \"order Green Curry\" or \"add Mango Sticky Rice to cart\""
                              : "สั่งวัตถุดิบและอาหารด้วยระบบ WebAvatar (พูดว่า \"เพิ่มแกงเขียวหวานลงตะกร้า\" หรือ \"ชำระเงิน\")"
                            }
                          </p>
                        </div>
                        <div className="px-4 py-2 bg-sky-50 border border-sky-100 rounded-2xl flex items-center gap-2">
                          <UtensilsCrossed className="size-4 text-sky-600" />
                          <span className="text-xs font-bold text-sky-800 font-mono">{activeHouse.style}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {foodMenu.map((item) => {
                          const qty = cart[item.id] || 0;
                          return (
                            <div
                              key={item.id}
                              className="bg-white border border-stone-200 p-5 rounded-3xl hover:border-sky-200 transition-all flex flex-col justify-between hover:shadow-md group"
                            >
                              <div>
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-[10px] font-bold text-sky-700 tracking-wider font-mono bg-sky-50 px-2 py-0.5 rounded border border-sky-100/50">
                                    {item.category}
                                  </span>
                                  <span className="text-sm font-extrabold text-stone-900 font-mono">{money(item.price)}</span>
                                </div>
                                <h4 className="text-sm font-bold text-stone-800 mb-1 group-hover:text-sky-600 transition-colors">
                                  {language === 'en' ? item.nameEn : item.nameTh}
                                </h4>
                                <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed mb-4">
                                  {language === 'en' ? item.descEn : item.descTh}
                                </p>
                              </div>

                              <div className="flex items-center justify-between border-t border-stone-100 pt-3">
                                <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">{language === 'en' ? 'Item quantity' : 'จำนวนของชิ้นนี้'}</span>
                                {qty === 0 ? (
                                  <Button
                                    variant="restaurant"
                                    size="restaurantIcon"
                                    onClick={() => changeFoodQty(item.id, 1)}
                                    className="h-8 rounded-xl bg-sky-50 text-sky-600 hover:bg-sky-600 hover:text-white transition-all text-xs font-bold gap-1 px-3 cursor-pointer border border-sky-100/30"
                                    id={`add-${item.id}`}
                                    aria-label={language === 'en' ? `Add ${item.nameEn} to cart` : `เพิ่ม ${item.nameTh} ลงตะกร้า`}
                                  >
                                    <Plus className="size-3" />
                                    <span>{language === 'en' ? 'Add' : 'หยิบใส่ตะกร้า'}</span>
                                  </Button>
                                ) : (
                                  <div className="flex items-center gap-1.5 bg-stone-50 border border-stone-200 p-0.5 rounded-xl">
                                    <button
                                      onClick={() => changeFoodQty(item.id, -1)}
                                      className="p-1 text-stone-500 hover:text-red-500 hover:bg-white rounded-lg transition-colors cursor-pointer"
                                      id={`decrease-${item.id}`}
                                      aria-label={language === 'en' ? `Decrease quantity of ${item.nameEn}` : `ลดจำนวน ${item.nameTh}`}
                                    >
                                      <Minus className="size-3" />
                                    </button>
                                    <span className="w-5 text-center text-xs font-black text-stone-800 font-mono" id={`quantity-${item.id}`}>{qty}</span>
                                    <button
                                      onClick={() => changeFoodQty(item.id, 1)}
                                      className="p-1 text-stone-500 hover:text-sky-600 hover:bg-white rounded-lg transition-colors cursor-pointer"
                                      id={`increase-${item.id}`}
                                      aria-label={language === 'en' ? `Increase quantity of ${item.nameEn}` : `เพิ่มจำนวน ${item.nameTh}`}
                                    >
                                      <Plus className="size-3" />
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Right: Cart Overlay & Invoice receipt */}
                    <div className="bg-white border border-stone-200 p-6 rounded-3xl self-start shadow-md w-full">
                      <div className="flex items-center justify-between border-b border-stone-100 pb-4 mb-4">
                        <div>
                          <span className="text-[10px] text-sky-600 font-bold uppercase tracking-wider block font-mono">
                            {language === 'en' ? 'Room bill' : 'ใบสั่งอาหาร'}
                          </span>
                          <h4 className="text-lg font-black text-stone-900 tracking-tight">{language === 'en' ? 'Your Order Cart' : 'รายการที่เลือก'}</h4>
                        </div>
                        <div className="w-10 h-10 bg-sky-50 border border-sky-100 rounded-xl flex items-center justify-center text-sky-600 shadow-inner">
                          <ShoppingBag className="size-5" />
                        </div>
                      </div>

                      <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1 no-scrollbar">
                        {Object.keys(cart).length === 0 ? (
                          <div className="py-12 text-center text-stone-400">
                            <UtensilsCrossed className="size-10 text-stone-300 mx-auto opacity-75 mb-3" />
                            <p className="text-xs font-semibold">{language === 'en' ? 'Your cart is empty' : 'ยังไม่ได้กดเลือกสินค้า'}</p>
                            <p className="text-[10px] text-stone-400 mt-1">{language === 'en' ? 'Choose from the left menu items' : 'ลองกดปุ่มหยิบใส่ตะกร้าด้านซ้าย'}</p>
                          </div>
                        ) : (
                          foodMenu
                            .filter(item => (cart[item.id] || 0) > 0)
                            .map(item => {
                              const qty = cart[item.id];
                              return (
                                <div key={item.id} className="flex items-center justify-between gap-3 text-xs bg-stone-50 p-2.5 rounded-2xl border border-stone-100">
                                  <div className="min-w-0 flex-1">
                                    <h5 className="font-bold text-stone-800 truncate">{language === 'en' ? item.nameEn : item.nameTh}</h5>
                                    <span className="text-[10px] text-stone-500 font-mono font-bold">{qty} x {money(item.price)}</span>
                                  </div>
                                  <span className="font-bold text-stone-900 font-mono shrink-0">{money(item.price * qty)}</span>
                                  <button
                                    onClick={() => changeFoodQty(item.id, -qty)}
                                    className="text-stone-400 hover:text-rose-500 p-1 transition-colors cursor-pointer"
                                    id={`remove-cart-${item.id}`}
                                    aria-label={language === 'en' ? `Remove ${item.nameEn} from cart` : `ลบ ${item.nameTh}`}
                                  >
                                    <Trash2 className="size-3.5" />
                                  </button>
                                </div>
                              );
                            })
                        )}
                      </div>

                      <div className="border-t border-dashed border-stone-200 pt-4 mt-4">
                        <div className="flex justify-between text-xs font-bold text-stone-500 mb-2">
                          <span>{language === 'en' ? 'Subtotal' : 'รวมค่าอาหาร'}</span>
                          <span className="font-mono">{money(cartTotal)}</span>
                        </div>
                        <div className="flex justify-between text-xs font-bold text-stone-500 mb-3">
                          <span>{language === 'en' ? 'Dome Service Fee' : 'ค่าบริการรูมเซอร์วิส'}</span>
                          <span className="font-mono">{money(cartTotal > 0 ? 50 : 0)}</span>
                        </div>
                        <div className="flex justify-between border-t border-stone-100 pt-3 text-sm font-extrabold text-stone-900">
                          <span>{language === 'en' ? 'Total Payment' : 'ยอดชำระสุทธิ'}</span>
                          <span className="text-sky-600 font-mono text-lg">{money(cartTotal > 0 ? cartTotal + 50 : 0)}</span>
                        </div>
                      </div>

                      <Button
                        className="mt-6 w-full cursor-pointer bg-sky-600 hover:bg-sky-700 text-white font-black text-xs py-3 rounded-2xl flex items-center justify-center gap-1.5 transition-all shadow-md shadow-sky-600/10"
                        disabled={Object.keys(cart).length === 0}
                        onClick={() => setRestaurantConfirmed(true)}
                        id="restaurant-checkout-button"
                        aria-label="ยืนยันการชำระเงินค่าอาหารรูมเซอร์วิส"
                      >
                        <span>{language === 'en' ? 'Confirm Room Order' : 'ยืนยันสั่งอาหารเข้าห้อง'}</span>
                        <ChevronRight className="size-4" />
                      </Button>
                    </div>
                  </div>
                )
              )}

              {/* ACCOMMODATION DEMO (MAPPED TO ACCOMMODATION TYPE HOUSES) */}
              {activeHouse.type === "accommodation" && (
                <div className="max-w-xl mx-auto bg-white border border-stone-200 p-6 sm:p-8 rounded-3xl shadow-md">
                  <div className="text-center mb-6">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-sky-50 border border-sky-100 text-sky-600 mb-3 font-mono uppercase tracking-wider">
                      <BedDouble className="size-3.5" />
                      {language === 'en' ? 'Accommodation Booking' : 'ระบบสำรองห้องพักสากล'}
                    </span>
                    <h3 className="text-xl font-extrabold text-stone-900 tracking-tight">
                      {language === 'en' ? `Book ${activeHouse.name}` : `จองห้องพักโครงการ ${activeHouse.name}`}
                    </h3>
                    <p className="text-xs text-stone-500 font-bold mt-1">
                      {language === 'en'
                        ? 'Simulate resort booking flow for premium cabins and architectural estates.'
                        : 'ทดสอบจำลองกระบวนการกรอกเอกสารจองที่พักและสิทธิพักตากอากาศ'
                      }
                    </p>
                  </div>

                  <form
                    onSubmit={(e) => { e.preventDefault(); setBookingConfirmed(true); }}
                    className="space-y-4"
                    aria-label="แบบฟอร์มจองที่พักจำลอง"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col">
                        <label htmlFor="checkin-date" className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1.5">{language === 'en' ? 'Check-in Date' : 'วันเช็คอิน'}</label>
                        <div className="relative flex items-center bg-stone-50 border border-stone-200 rounded-xl px-3 py-2">
                          <Calendar className="size-4 text-stone-400 mr-2" />
                          <input
                            type="date"
                            id="checkin-date"
                            required
                            value={checkIn}
                            onChange={(e) => setCheckIn(e.target.value)}
                            className="bg-transparent text-xs text-stone-800 focus:outline-none w-full cursor-pointer"
                          />
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <label htmlFor="checkout-date" className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1.5">{language === 'en' ? 'Check-out Date' : 'วันเช็คเอาท์'}</label>
                        <div className="relative flex items-center bg-stone-50 border border-stone-200 rounded-xl px-3 py-2">
                          <Calendar className="size-4 text-stone-400 mr-2" />
                          <input
                            type="date"
                            id="checkout-date"
                            required
                            value={checkOut}
                            onChange={(e) => setCheckOut(e.target.value)}
                            className="bg-transparent text-xs text-stone-800 focus:outline-none w-full cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col">
                        <label htmlFor="guests-count" className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1.5">{language === 'en' ? 'Guests' : 'จำนวนผู้เข้าพัก'}</label>
                        <select
                          id="guests-count"
                          value={guests}
                          onChange={(e) => setGuests(Number(e.target.value))}
                          className="bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 text-xs text-stone-800 font-semibold focus:outline-none cursor-pointer"
                        >
                          {[1, 2, 3, 4, 5].map(n => (
                            <option key={n} value={n} className="bg-white">{n} {language === 'en' ? 'Person' : 'ท่าน'}</option>
                          ))}
                        </select>
                      </div>
                      <div className="flex flex-col">
                        <label htmlFor="room-style" className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1.5">{language === 'en' ? 'Room Category' : 'รูปแบบห้องพัก'}</label>
                        <select
                          id="room-style"
                          value={roomType}
                          onChange={(e) => setRoomType(e.target.value)}
                          className="bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 text-xs text-stone-800 font-semibold focus:outline-none cursor-pointer"
                        >
                          <option value="Standard Room" className="bg-white">{language === 'en' ? 'Standard Studio' : 'ห้องสตูดิโอทั่วไป'}</option>
                          <option value="Deluxe Cabin" className="bg-white">{language === 'en' ? 'Deluxe Forest Cabin' : 'ห้องดีลักซ์วิวป่าไม้'}</option>
                          <option value="Presidential Penthouse" className="bg-white">{language === 'en' ? 'Presidential Glass Penthouse' : 'ห้องเพนต์เฮาส์เรือนกระจก'}</option>
                        </select>
                      </div>
                    </div>

                    <div className="bg-sky-50/50 border border-sky-100 p-4 rounded-2xl flex flex-col justify-between text-xs text-stone-700 font-medium">
                      <span className="text-[9px] text-sky-600 font-bold block uppercase tracking-wider mb-1">{language === 'en' ? 'Estimated Pricing (Per Night)' : 'ราคาประเมินค่าเข้าพักต่อคืน'}</span>
                      <span className="text-lg font-black text-sky-700 font-mono">{money(activeHouse.basePrice / 1000)} / คืน</span>
                    </div>

                    <Button
                      type="submit"
                      className="w-full cursor-pointer bg-sky-600 hover:bg-sky-700 text-white font-black text-xs py-3 rounded-2xl flex items-center justify-center gap-1.5 shadow-md shadow-sky-600/10"
                      id="confirm-booking-button"
                      aria-label="กดยืนยันการจองตั๋วบ้านพัก"
                    >
                      <span>{language === 'en' ? 'Secure Booking Reservation' : 'ยืนยันจองห้องพักทันที'}</span>
                      <ChevronRight className="size-4" />
                    </Button>
                  </form>
                </div>
              )}

              {/* FLIGHT BOOKING DEMO (MAPPED TO FLIGHT TYPE HOUSES) */}
              {activeHouse.type === "flight" && (
                <div className="max-w-xl mx-auto bg-white border border-stone-200 p-6 sm:p-8 rounded-3xl shadow-md">
                  <div className="text-center mb-6">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-sky-50 border border-sky-100 text-sky-600 mb-3 font-mono uppercase tracking-wider">
                      <Plane className="size-3.5" />
                      {language === 'en' ? 'Flight Booking Demo' : 'ระบบจองตั๋วเที่ยวบินด่วน'}
                    </span>
                    <h3 className="text-xl font-extrabold text-stone-900 tracking-tight">
                      {language === 'en' ? `Flight to ${activeHouse.name}` : `ตั๋วเครื่องบินสำหรับโครงการ ${activeHouse.name}`}
                    </h3>
                    <p className="text-xs text-stone-500 font-bold mt-1">
                      {language === 'en'
                        ? 'Simulate airline seat reservations for visiting project construction sites.'
                        : 'จำลองการเดินทางไปรับหน้างานก่อสร้างด่วนทางอากาศสำหรับสายลุย'
                      }
                    </p>
                  </div>

                  <form
                    onSubmit={(e) => { e.preventDefault(); setFlightConfirmed(true); }}
                    className="space-y-4"
                    aria-label="แบบฟอร์มจองตั๋วบินจำลอง"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col">
                        <label htmlFor="city-origin" className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1.5">{language === 'en' ? 'From' : 'เมืองต้นทาง'}</label>
                        <select
                          id="city-origin"
                          value={fromCity}
                          onChange={(e) => setFromCity(e.target.value)}
                          className="bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 text-xs text-stone-800 font-semibold focus:outline-none cursor-pointer"
                        >
                          <option value="Bangkok (DMK)" className="bg-white">Bangkok (DMK)</option>
                          <option value="Phuket (HKT)" className="bg-white">Phuket (HKT)</option>
                          <option value="Udon Thani (UTH)" className="bg-white">Udon Thani (UTH)</option>
                        </select>
                      </div>
                      <div className="flex flex-col">
                        <label htmlFor="city-destination" className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1.5">{language === 'en' ? 'To' : 'เมืองปลายทาง'}</label>
                        <select
                          id="city-destination"
                          value={toCity}
                          onChange={(e) => setToCity(e.target.value)}
                          className="bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 text-xs text-stone-800 font-semibold focus:outline-none cursor-pointer"
                        >
                          <option value="Chiang Mai (CNX)" className="bg-white">Chiang Mai (CNX)</option>
                          <option value="Hat Yai (HDY)" className="bg-white">Hat Yai (HDY)</option>
                          <option value="Khon Kaen (KKC)" className="bg-white">Khon Kaen (KKC)</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex flex-col">
                      <label htmlFor="flight-date" className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1.5">{language === 'en' ? 'Departure Date' : 'วันออกเดินทาง'}</label>
                      <div className="relative flex items-center bg-stone-50 border border-stone-200 rounded-xl px-3 py-2">
                        <Calendar className="size-4 text-stone-400 mr-2" />
                        <input
                          type="date"
                          id="flight-date"
                          required
                          value={departDate}
                          onChange={(e) => setDepartDate(e.target.value)}
                          className="bg-transparent text-xs text-stone-800 focus:outline-none w-full cursor-pointer"
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full cursor-pointer bg-[#0284c7] hover:bg-[#0369a1] text-white font-black text-xs py-3 rounded-2xl flex items-center justify-center gap-1.5 shadow-md shadow-sky-600/10"
                      id="search-flight-button"
                      aria-label="กดยืนยันค้นหาไฟล์ตบินจำลอง"
                    >
                      <span>{language === 'en' ? 'Search & Book Boarding Pass' : 'จองเที่ยวบินด่วน'}</span>
                      <ChevronRight className="size-4" />
                    </Button>
                  </form>
                </div>
              )}

              {/* E-COMMERCE DEMO (MAPPED TO ECOMMERCE TYPE HOUSES) */}
              {activeHouse.type === "ecommerce" && (
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
                  {/* Products Grid */}
                  <div className="space-y-6">
                    <div className="bg-white border border-stone-200 p-6 rounded-3xl shadow-sm">
                      <span className="text-[10px] font-bold text-sky-600 uppercase tracking-widest block font-mono">
                        {language === 'en' ? 'Smart Home E-Store' : 'ร้านค้าเครื่องใช้อัจฉริยะ'}
                      </span>
                      <h3 className="text-xl font-extrabold text-stone-900 mt-1 tracking-tight">
                        {language === 'en' ? `${activeHouse.name} Smart Accessories` : `${activeHouse.name} อุปกรณ์ตกแต่งบ้านอัจฉริยะ`}
                      </h3>
                      <p className="text-xs text-stone-500 font-bold mt-1">
                        {language === 'en'
                          ? 'Add home decor items and automated appliances to build your dream home.'
                          : 'เลือกซื้อโมดูลตกแต่งและเครื่องใช้ IoT สำหรับบ้านของคุณเพื่อทดสอบ'
                        }
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {techProducts.map((p) => {
                        const qty = shopCart[p.id] || 0;
                        return (
                          <div key={p.id} className="bg-white border border-stone-200 p-4 rounded-2xl flex flex-col justify-between hover:border-sky-200 hover:shadow-md transition-all">
                            <div className="mb-3">
                              <h4 className="text-xs font-bold text-stone-800">{language === 'en' ? p.nameEn : p.nameTh}</h4>
                              <span className="text-sm font-extrabold text-sky-600 font-mono block mt-1">{money(p.price)}</span>
                            </div>
                            <div className="flex items-center justify-between border-t border-stone-100 pt-3">
                              <span className="text-[10px] text-stone-400 font-bold">{language === 'en' ? 'Quantity' : 'จำนวน'}</span>
                              {qty === 0 ? (
                                <button
                                  onClick={() => changeTechQty(p.id, 1)}
                                  className="h-8 rounded-xl bg-stone-50 border border-stone-200 hover:bg-sky-600 hover:text-white px-3 text-xs font-bold transition-all cursor-pointer text-stone-600 hover:border-sky-600"
                                  id={`add-tech-${p.id}`}
                                >
                                  + {language === 'en' ? 'Add' : 'เพิ่ม'}
                                </button>
                              ) : (
                                <div className="flex items-center gap-1.5 bg-stone-50 border border-stone-200 p-0.5 rounded-lg">
                                  <button
                                    onClick={() => changeTechQty(p.id, -1)}
                                    className="p-1 text-stone-400 hover:text-red-500 cursor-pointer"
                                    id={`dec-tech-${p.id}`}
                                  >
                                    <Minus className="size-3" />
                                  </button>
                                  <span className="w-4 text-center text-xs font-black text-stone-800 font-mono">{qty}</span>
                                  <button
                                    onClick={() => changeTechQty(p.id, 1)}
                                    className="p-1 text-stone-400 hover:text-sky-500 cursor-pointer"
                                    id={`inc-tech-${p.id}`}
                                  >
                                    <Plus className="size-3" />
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Cart Sidebar */}
                  <div className="bg-white border border-stone-200 p-6 rounded-3xl self-start w-full shadow-sm">
                    <div className="flex items-center justify-between border-b border-stone-100 pb-3 mb-4">
                      <h4 className="text-base font-extrabold text-stone-800">{language === 'en' ? 'Shopping Cart' : 'ตะกร้าสินค้า'}</h4>
                      <ShoppingBag className="size-5 text-sky-600" />
                    </div>

                    <div className="space-y-3 mb-4">
                      {Object.keys(shopCart).length === 0 ? (
                        <p className="text-xs text-stone-400 text-center py-8">{language === 'en' ? 'Cart is empty' : 'ยังไม่มีสินค้าในตะกร้า'}</p>
                      ) : (
                        techProducts
                          .filter(p => (shopCart[p.id] || 0) > 0)
                          .map(p => (
                            <div key={p.id} className="flex justify-between text-xs bg-stone-50 p-2 rounded-xl border border-stone-100">
                              <span>{language === 'en' ? p.nameEn : p.nameTh} x{shopCart[p.id]}</span>
                              <span className="font-bold text-stone-900 font-mono">{money(p.price * shopCart[p.id])}</span>
                            </div>
                          ))
                      )}
                    </div>

                    <div className="border-t border-stone-100 pt-3 flex justify-between text-xs font-bold text-stone-500 mb-4">
                      <span>{language === 'en' ? 'Subtotal' : 'ราคารวม'}</span>
                      <span className="text-sky-600 font-mono text-sm">{money(shopTotal)}</span>
                    </div>

                    <Button
                      className="w-full cursor-pointer bg-sky-600 hover:bg-sky-700 text-white font-black text-xs py-3 rounded-2xl flex items-center justify-center gap-1.5 shadow-md shadow-sky-600/10"
                      disabled={shopTotal === 0}
                      onClick={() => setEcommerceConfirmed(true)}
                      id="tech-checkout-button"
                      aria-label="กดยืนยันชำระเงินซื้อสินค้าตกแต่งบ้าน"
                    >
                      <span>{language === 'en' ? 'Checkout Invoice' : 'ชำระเงินและออกใบสั่งซื้อ'}</span>
                    </Button>
                  </div>
                </div>
              )}

            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* CONFIRMATION MODALS (RECEIPTS) */}

      {/* 1. Restaurant Receipt Dialog */}
      <Dialog open={restaurantConfirmed} onOpenChange={setRestaurantConfirmed}>
        <DialogContent className="max-h-[90vh] overflow-y-auto rounded-3xl border-stone-200 bg-white text-stone-800 p-6 sm:max-w-md">
          <DialogHeader className="items-center text-center">
            <div className="mb-3 grid size-12 place-items-center rounded-full bg-sky-500 text-white shadow-md">
              <Check className="size-6" />
            </div>
            <DialogTitle className="text-xl font-extrabold text-stone-900 tracking-tight">
              {language === 'en' ? 'Order Placed successfully!' : 'ส่งออเดอร์สำเร็จ!'}
            </DialogTitle>
            <DialogDescription className="text-xs text-stone-500 font-semibold">
              {language === 'en' ? `The kitchen of ${activeHouse.name} is preparing your food.` : `ครัวของ ${activeHouse.name} ได้รับรายการแล้ว`}
            </DialogDescription>
          </DialogHeader>
          <div className="my-5 border-y border-dashed border-stone-200 py-4 text-center font-mono">
            <p className="text-sm font-bold text-stone-900 uppercase">{activeHouse.name} Dining Service</p>
            <p className="text-[10px] text-stone-400 mt-1 font-bold">Receipt ID: #ED{Math.floor(1000 + Math.random() * 9000)}</p>
          </div>
          <div className="space-y-2 text-xs">
            {foodMenu.filter(i => (cart[i.id] || 0) > 0).map(item => (
              <div key={item.id} className="flex justify-between text-stone-700">
                <span>{cart[item.id]} × {language === 'en' ? item.nameEn : item.nameTh}</span>
                <span className="font-mono text-stone-900 font-bold">{money(item.price * cart[item.id])}</span>
              </div>
            ))}
            <div className="flex justify-between text-stone-500 pt-2 border-t border-stone-100">
              <span>{language === 'en' ? 'Service Fee' : 'ค่าบริการรูมเซอร์วิส'}</span>
              <span className="font-mono">฿50</span>
            </div>
            <div className="flex justify-between text-sm font-black text-stone-900 pt-2 border-t border-stone-200">
              <span>{language === 'en' ? 'Total charged' : 'รวมชำระ'}</span>
              <span className="text-sky-600 font-mono">{money(cartTotal + 50)}</span>
            </div>
          </div>
          <button
            onClick={() => { setRestaurantConfirmed(false); setCart({}); }}
            className="mt-6 w-full cursor-pointer bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs py-2.5 rounded-xl border border-stone-200"
            id="close-restaurant-modal"
          >
            {language === 'en' ? 'Close & Order Again' : 'ปิดหน้านี้'}
          </button>
        </DialogContent>
      </Dialog>

      {/* 2. Accommodation Receipt Dialog */}
      <Dialog open={bookingConfirmed} onOpenChange={setBookingConfirmed}>
        <DialogContent className="max-h-[90vh] overflow-y-auto rounded-3xl border-stone-200 bg-white text-stone-800 p-6 sm:max-w-md">
          <DialogHeader className="items-center text-center">
            <div className="mb-3 grid size-12 place-items-center rounded-full bg-sky-500 text-white shadow-md">
              <CheckCircle className="size-6" />
            </div>
            <DialogTitle className="text-xl font-extrabold text-stone-900 tracking-tight">
              {language === 'en' ? 'Reservation Confirmed!' : 'จองที่พักสำเร็จ!'}
            </DialogTitle>
            <DialogDescription className="text-xs text-stone-500 font-semibold">
              {language === 'en' ? 'Your booking sheet has been saved.' : 'ข้อมูลการเข้าพักของคุณถูกบันทึกเรียบร้อย'}
            </DialogDescription>
          </DialogHeader>
          <div className="my-4 border-y border-dashed border-stone-200 py-3 text-center text-xs">
            <p className="font-bold text-stone-900 uppercase tracking-wider">{activeHouse.name}</p>
            <p className="text-[10px] text-stone-400 mt-1 font-mono font-bold">Reference: #BK{Math.floor(100000 + Math.random() * 900000)}</p>
          </div>
          <div className="space-y-3 text-xs">
            <div className="flex justify-between">
              <span className="text-stone-500 font-bold">{language === 'en' ? 'Check-in' : 'วันเช็คอิน'}</span>
              <span className="font-bold text-stone-900 font-mono">{checkIn || "2026-07-20"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500 font-bold">{language === 'en' ? 'Check-out' : 'วันเช็คเอาท์'}</span>
              <span className="font-bold text-stone-900 font-mono">{checkOut || "2026-07-25"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500 font-bold">{language === 'en' ? 'Guests count' : 'ผู้เข้าพัก'}</span>
              <span className="font-bold text-stone-900">{guests} {language === 'en' ? 'person(s)' : 'ท่าน'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500 font-bold">{language === 'en' ? 'Room Category' : 'รูปแบบห้อง'}</span>
              <span className="font-bold text-stone-900">{roomType}</span>
            </div>
            <div className="flex justify-between border-t border-stone-100 pt-3 text-sm font-black">
              <span className="text-stone-700">{language === 'en' ? 'Status' : 'สถานะการจอง'}</span>
              <span className="text-sky-600 font-extrabold uppercase font-mono">{language === 'en' ? 'RESERVED' : 'จองแล้ว'}</span>
            </div>
          </div>
          <button
            onClick={() => setBookingConfirmed(false)}
            className="mt-6 w-full cursor-pointer bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs py-2.5 rounded-xl border border-stone-200"
            id="close-booking-modal"
          >
            {language === 'en' ? 'Done' : 'เสร็จสิ้น'}
          </button>
        </DialogContent>
      </Dialog>

      {/* 3. Flight Boarding Pass Modal */}
      <Dialog open={flightConfirmed} onOpenChange={setFlightConfirmed}>
        <DialogContent className="max-h-[90vh] overflow-y-auto rounded-3xl border-stone-200 bg-white text-stone-800 p-6 sm:max-w-md">
          <DialogHeader className="items-center text-center">
            <div className="mb-3 grid size-12 place-items-center rounded-full bg-sky-500 text-white shadow-md">
              <FileCheck className="size-6" />
            </div>
            <DialogTitle className="text-xl font-extrabold text-stone-900 tracking-tight">
              {language === 'en' ? 'Boarding Pass Issued!' : 'ออกตั๋วเครื่องบินสำเร็จ!'}
            </DialogTitle>
            <DialogDescription className="text-xs text-stone-500 font-semibold">
              {language === 'en' ? 'Please present this ticket at the check-in gate.' : 'โปรดแสดงบัตรผ่านนี้ที่เกตขึ้นเครื่อง'}
            </DialogDescription>
          </DialogHeader>
          <div className="my-4 border-y border-dashed border-stone-200 py-3 text-center text-xs">
            <p className="font-bold text-sky-600 font-mono tracking-widest uppercase">BOTNOI AIRLINE</p>
            <p className="text-[10px] text-stone-400 mt-1 font-mono font-bold">Flight ID: #BA{Math.floor(100 + Math.random() * 900)}</p>
          </div>
          <div className="space-y-3 text-xs">
            <div className="flex justify-between">
              <span className="text-stone-500 font-bold">{language === 'en' ? 'From Destination' : 'ต้นทาง'}</span>
              <span className="font-bold text-stone-900">{fromCity}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500 font-bold">{language === 'en' ? 'To Destination' : 'ปลายทาง'}</span>
              <span className="font-bold text-stone-900">{toCity}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500 font-bold">{language === 'en' ? 'Flight Date' : 'วันเดินทาง'}</span>
              <span className="font-bold text-stone-900 font-mono">{departDate || "2026-07-28"}</span>
            </div>
            <div className="flex justify-between border-t border-stone-100 pt-3 text-sm font-black">
              <span className="text-stone-700">{language === 'en' ? 'Assigned Seat' : 'ที่นั่ง'}</span>
              <span className="text-[#0284c7] font-mono">24A (Window)</span>
            </div>
          </div>
          <button
            onClick={() => setFlightConfirmed(false)}
            className="mt-6 w-full cursor-pointer bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs py-2.5 rounded-xl border border-stone-200"
            id="close-flight-modal"
          >
            {language === 'en' ? 'Close Ticket' : 'ปิดตั๋ว'}
          </button>
        </DialogContent>
      </Dialog>

      {/* 4. E-Commerce Invoice Modal */}
      <Dialog open={ecommerceConfirmed} onOpenChange={setEcommerceConfirmed}>
        <DialogContent className="max-h-[90vh] overflow-y-auto rounded-3xl border-stone-200 bg-white text-stone-800 p-6 sm:max-w-md">
          <DialogHeader className="items-center text-center">
            <div className="mb-3 grid size-12 place-items-center rounded-full bg-sky-500 text-white shadow-md">
              <AlertCircle className="size-6" />
            </div>
            <DialogTitle className="text-xl font-extrabold text-stone-900 tracking-tight">
              {language === 'en' ? 'Invoice Paid Successfully!' : 'ชำระใบเสร็จสำเร็จ!'}
            </DialogTitle>
            <DialogDescription className="text-xs text-stone-500 font-semibold">
              {language === 'en' ? 'Your smart home decor order is on its way.' : 'คำสั่งซื้อสินค้าอัจฉริยะของคุณจะถูกจัดส่งเร็วๆ นี้'}
            </DialogDescription>
          </DialogHeader>
          <div className="my-4 border-y border-dashed border-stone-200 py-3 text-center text-xs font-mono">
            <p className="font-bold text-stone-900 uppercase">{activeHouse.name} Store</p>
            <p className="text-[10px] text-stone-400 mt-1 font-bold">Invoice Ref: #INV{Math.floor(10000 + Math.random() * 90000)}</p>
          </div>
          <div className="space-y-2 text-xs">
            {techProducts.filter(p => (shopCart[p.id] || 0) > 0).map(p => (
              <div key={p.id} className="flex justify-between text-stone-700">
                <span>{shopCart[p.id]} x {language === 'en' ? p.nameEn : p.nameTh}</span>
                <span className="font-mono text-stone-900 font-bold">{money(p.price * shopCart[p.id])}</span>
              </div>
            ))}
            <div className="flex justify-between border-t border-stone-100 pt-2 text-sm font-black text-stone-900">
              <span>{language === 'en' ? 'Amount Charged' : 'ยอดชำระจริง'}</span>
              <span className="text-sky-600 font-mono font-bold">{money(shopTotal)}</span>
            </div>
          </div>
          <button
            onClick={() => { setEcommerceConfirmed(false); setShopCart({}); }}
            className="mt-6 w-full cursor-pointer bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs py-2.5 rounded-xl border border-stone-200"
            id="close-tech-modal"
          >
            {language === 'en' ? 'Close Invoice' : 'ปิดใบชำระเงิน'}
          </button>
        </DialogContent>
      </Dialog>

    </div>
  );
}

// Kanban Card Component to keep code modular and readable
interface KanbanCardProps {
  task: KanbanTask;
  house: HouseItem;
  sprint: number;
  language: string;
}

function KanbanCard({ task, house, sprint, language }: KanbanCardProps) {
  const levelColor = task.level === "High" ? "text-rose-600 bg-rose-50 border-rose-100" :
    task.level === "Medium" ? "text-amber-700 bg-amber-50 border-amber-100" :
      "text-stone-500 bg-stone-100/60 border-stone-200/65";

  return (
    <div className="bg-white border border-stone-200 p-4 rounded-2xl hover:border-sky-500 hover:shadow-md transition-all cursor-grab active:cursor-grabbing select-none group">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[9px] font-mono text-stone-400 font-bold uppercase tracking-wide">
          {house.code}-T{task.id + (sprint * 10)}
        </span>
        <span className={`text-[8px] font-bold px-2 py-0.5 rounded-md border ${levelColor}`}>
          {task.level}
        </span>
      </div>
      <h4 className="text-[11px] font-bold text-stone-700 leading-relaxed mb-3 group-hover:text-sky-600 transition-colors">
        {language === 'en' ? task.titleEn : task.titleTh} ({house.name})
      </h4>
      <div className="flex items-center justify-between border-t border-stone-100 pt-2 text-[9px] text-stone-400 font-bold">
        <span><Calendar className="size-3 inline-block mr-1 text-stone-400" /> Sprint {sprint}</span>
        <span className="font-mono text-stone-500">{language === 'en' ? task.daysEn : task.daysTh}</span>
      </div>
    </div>
  );
}
