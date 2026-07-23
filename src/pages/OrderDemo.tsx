import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "@/lib/LanguageContext";
import {
  Search,
  Plane,
  BedDouble,
  UtensilsCrossed,
  ShoppingBag,
  ChevronRight,
  Sparkles,
  Home
} from "lucide-react";

// House Item Interface
export interface HouseItem {
  id: number;
  code: string;
  name: string;
  style: string;
  type: "accommodation" | "flight" | "restaurant" | "ecommerce";
  color: string;
  progress: number;
  deployedUrl: string;
  githubUrl: string;
}

// Receipt & MenuItem Interfaces for Admin portal compatibility
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

export interface Receipt {
  orderId: string;
  orderedAt: string;
  items: Array<MenuItem & { quantity: number }>;
  subtotal: number;
  serviceFee: number;
  total: number;
}

// 20 Houses Mock Database mapped to Project Types and URLs
const projectData: HouseItem[] = [
  { id: 1, code: 'TN01', name: '01-the-chill-crew', style: 'Modern Minimalist', type: 'accommodation', color: '#6366F1', progress: 85, deployedUrl: 'https://example.com', githubUrl: 'https://github.com' },
  { id: 2, code: 'TN02', name: '02-cozy-oracles', style: 'Neo-Classical', type: 'flight', color: '#b45309', progress: 45, deployedUrl: 'https://example.com', githubUrl: 'https://github.com' },
  { id: 3, code: 'TN03', name: '03-controller-kings', style: 'Nordic Timber', type: 'ecommerce', color: '#059669', progress: 90, deployedUrl: 'https://example.com', githubUrl: 'https://github.com' },
  { id: 4, code: 'TN04', name: '04-the-netflix-hermits', style: 'Brutalist Concrete', type: 'ecommerce', color: '#1e293b', progress: 10, deployedUrl: 'https://example.com', githubUrl: 'https://github.com' },
  { id: 5, code: 'TN05', name: '05-aesthetic-dreamers', style: 'Cozy Wood Cabin', type: 'accommodation', color: '#78350f', progress: 100, deployedUrl: 'https://example.com', githubUrl: 'https://github.com' },
  { id: 6, code: 'TN06', name: '06-lo-fi-homebodies', style: 'Glass Contemporary', type: 'flight', color: '#0284c7', progress: 60, deployedUrl: 'https://example.com', githubUrl: 'https://github.com' },
  // Team 7 (Ours) - Lovable deployed app
  { 
    id: 7, 
    code: 'TN07', 
    name: '07-steak-game-bros', 
    style: 'Organic Earth Dome', 
    type: 'restaurant', 
    color: '#10B981', 
    progress: 80, 
    deployedUrl: 'https://ran-lung-get.lovable.app/customer', 
    githubUrl: 'https://github.com/SvechaZ/ran-lung-get' 
  },
  { id: 8, code: 'TN08', name: '08-vibe-architects', style: 'Industrial Brickwork', type: 'ecommerce', color: '#991b1b', progress: 75, deployedUrl: 'https://example.com', githubUrl: 'https://github.com' },
  { id: 9, code: 'TN09', name: '09-sunset-superfans', style: 'Japanese Zen', type: 'accommodation', color: '#16a34a', progress: 100, deployedUrl: 'https://example.com', githubUrl: 'https://github.com' },
  { id: 10, code: 'TN10', name: '10-lazy-mermaids', style: 'Modular Container', type: 'flight', color: '#ca8a04', progress: 30, deployedUrl: 'https://example.com', githubUrl: 'https://github.com' },
  { id: 11, code: 'TN11', name: '11-the-sharp-cuts', style: 'Mid-Century Gable', type: 'restaurant', color: '#475569', progress: 5, deployedUrl: 'https://example.com', githubUrl: 'https://github.com' },
  { id: 12, code: 'TN12', name: '12-coastal-avengers', style: 'Tropical Canopy', type: 'ecommerce', color: '#0d9488', progress: 95, deployedUrl: 'https://example.com', githubUrl: 'https://github.com' },
  { id: 13, code: 'TN13', name: '13-the-dungeon-masters', style: 'Step Architecture', type: 'accommodation', color: '#4338ca', progress: 55, deployedUrl: 'https://example.com', githubUrl: 'https://github.com' },
  { id: 14, code: 'TN14', name: '14-the-all-rounders', style: 'Atrium Courtyard', type: 'flight', color: '#db2777', progress: 100, deployedUrl: 'https://example.com', githubUrl: 'https://github.com' },
  { id: 15, code: 'TN15', name: '15-mountain-mode', style: 'Flat-Roof Minimal', type: 'restaurant', color: '#0f172a', progress: 15, deployedUrl: 'https://example.com', githubUrl: 'https://github.com' },
  { id: 16, code: 'TN16', name: '16-blue-hour-society', style: 'Modern Steel Frame', type: 'ecommerce', color: '#334155', progress: 70, deployedUrl: 'https://example.com', githubUrl: 'https://github.com' },
  { id: 17, code: 'TN17', name: '17-midnight-raiders', style: 'Spanish Terracotta', type: 'accommodation', color: '#c2410c', progress: 80, deployedUrl: 'https://example.com', githubUrl: 'https://github.com' },
  { id: 18, code: 'TN18', name: '18-indie-mountain-kids', style: 'Parametric Fluid', type: 'flight', color: '#06b6d4', progress: 0, deployedUrl: 'https://example.com', githubUrl: 'https://github.com' },
  { id: 19, code: 'TN19', name: '19-ocean-avengers', style: 'Victorian Restoration', type: 'restaurant', color: '#6d28d9', progress: 100, deployedUrl: 'https://example.com', githubUrl: 'https://github.com' },
  { id: 20, code: 'TN20', name: '20-final-boss-crew', style: 'Waterfront Living', type: 'ecommerce', color: '#0369a1', progress: 40, deployedUrl: 'https://example.com', githubUrl: 'https://github.com' }
];

// Helper to get bilingual project overview by type
export const getProjectOverview = (type: string, lang: string): string => {
  if (type === "accommodation") {
    return lang === 'en'
      ? "Resort & Hotel Booking: Complete reservation system featuring room catalogs, date selectors, pricing calculations, and confirmation views."
      : "ระบบจองที่พักและรีสอร์ท: บริการค้นหาห้องพัก เช็คห้องว่าง ระบุวันเข้าพัก คำนวณราคาห้องพัก และยืนยันการจอง";
  } else if (type === "flight") {
    return lang === 'en'
      ? "Flight Booking Engine: Domestic airline booking portal with interactive passenger inputs, seat mapping, and simulated boarding pass generation."
      : "ระบบจองตั๋วเครื่องบิน: ค้นหาเที่ยวบิน ระบุจำนวนผู้โดยสาร เลือกที่นั่งบนเครื่องบิน และการออกบอร์ดดิ้งพาสจำลอง";
  } else if (type === "restaurant") {
    return lang === 'en'
      ? "Restaurant Ordering App: Digital dining menu order application with item categorization, shopping cart, checkout billing, and live invoices."
      : "ระบบสั่งอาหารและรูมเซอร์วิส: เมนูอาหารออนไลน์พร้อมระบบจัดการตะกร้าสินค้า สรุปรายการสั่งซื้อ และพิมพ์ใบเสร็จแบบเรียลไทม์";
  } else { // ecommerce
    return lang === 'en'
      ? "Tech E-Shop Storefront: Complete consumer electronics retail site with category filtering, shopping cart updates, and invoice receipts."
      : "ร้านค้าออนไลน์อุปกรณ์ไอที: แหล่งรวมแก็ดเจ็ตไอที คัดกรองหมวดหมู่สินค้า หยิบใส่ตะกร้า ชำระเงิน และออกใบเสร็จรับเงิน";
  }
};

export default function OrderDemo() {
  const { language } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Filtering Logic
  const filteredHouses = useMemo(() => {
    return projectData.filter(house => {
      const overviewText = getProjectOverview(house.type, language);
      const matchesSearch = house.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            house.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            overviewText.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            house.style.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === "all" || house.type === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory, language]);

  return (
    <div 
      className="order-theme min-h-[calc(100vh-68px)] w-full flex flex-col pb-16 selection:bg-primary selection:text-primary-foreground"
      style={{ backgroundImage: 'var(--grad-mesh)' }}
    >
      {/* 1. Page Header & Hero */}
      <header className="w-full bg-card/60 backdrop-blur-md border-b border-border py-8 relative z-10">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          {/* Breadcrumbs */}
          <nav className="mb-4 flex items-center gap-2 text-xs text-muted-foreground font-bold" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-primary transition-colors flex items-center gap-1">
              <Home className="size-3" />
              <span>{language === 'en' ? 'Home' : 'หน้าหลัก'}</span>
            </Link>
            <ChevronRight className="size-3 text-stone-400" />
            <span className="text-foreground font-extrabold uppercase font-mono">
              {language === 'en' ? 'Showcase Portal' : 'คลังเดโมพอร์ทัล'}
            </span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <span className="text-[10px] font-black text-primary uppercase tracking-widest block font-mono">
                {language === 'en' ? 'TN01 - TN20 Student Projects' : 'โครงการพัฒนาแอปพลิเคชันจากบ้านพัก TN01-TN20'}
              </span>
              <h1 className="text-3xl md:text-4xl font-black text-foreground mt-1 tracking-tight flex items-center gap-2 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                <Sparkles className="size-8 text-primary animate-pulse" />
                {language === 'en' ? 'TN House Showcase Portal' : 'พอร์ทัลรวบรวมผลงานบ้าน TN'}
              </h1>
              <p className="text-sm text-muted-foreground font-medium mt-2 max-w-2xl leading-relaxed">
                {language === 'en'
                  ? "Explore the active web applications developed by Teams TN01 to TN20. Click 'Launch Demo' to open the deployed websites in a new tab."
                  : "รวบรวมเดโมและผลงานการพัฒนาแอปพลิเคชันจากผู้พัฒนาบ้านพัก TN01 ถึง TN20 คลิก 'เปิดดูระบบเดโม' เพื่อทดลองใช้งานหน้าเว็บจริงในแท็บใหม่"
                }
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* 2. Search & Filtering Controls */}
      <section className="max-w-7xl mx-auto w-full px-4 md:px-8 mt-10" aria-label="Search and Filter">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-card border border-border p-4 rounded-3xl shadow-sm">
          {/* Search Input */}
          <div className="relative w-full lg:max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              type="text"
              placeholder={language === 'en' ? "Search by code or team name..." : "ค้นหาด้วยรหัสบ้านหรือชื่อทีม..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-muted/30 border border-border focus:border-primary rounded-2xl text-xs font-bold text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-mono"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto no-scrollbar">
            {[
              { id: "all", labelTh: "ทั้งหมด", labelEn: "All", icon: Sparkles },
              { id: "accommodation", labelTh: "จองที่พัก", labelEn: "Accommodation", icon: BedDouble },
              { id: "flight", labelTh: "จองเที่ยวบิน", labelEn: "Flight Booking", icon: Plane },
              { id: "restaurant", labelTh: "สั่งอาหาร", labelEn: "Restaurant", icon: UtensilsCrossed },
              { id: "ecommerce", labelTh: "อีคอมเมิร์ซ", labelEn: "E-Commerce", icon: ShoppingBag },
            ].map((cat) => {
              const isActive = selectedCategory === cat.id;
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-2 rounded-xl text-[11px] font-extrabold transition-all flex items-center gap-2 cursor-pointer border ${
                    isActive
                      ? "bg-primary text-primary-foreground border-primary shadow-sm"
                      : "text-muted-foreground bg-muted/30 hover:bg-muted/50 hover:text-foreground border-border"
                  }`}
                >
                  <Icon className="size-3.5" />
                  <span>{language === 'en' ? cat.labelEn : cat.labelTh}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. Cards Bento Grid */}
      <main className="max-w-7xl mx-auto w-full px-4 md:px-8 mt-8 flex-1">
        {filteredHouses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredHouses.map((house) => {
              // Determine project type details
              let typeLabel = "";
              let TypeIcon = UtensilsCrossed;
              let typeBg = "bg-stone-50 text-stone-600 border-stone-200";
              
              if (house.type === "accommodation") {
                typeLabel = language === 'en' ? "Resort" : "จองที่พัก";
                TypeIcon = BedDouble;
                typeBg = "bg-amber-50 text-amber-700 border-amber-200/50";
              } else if (house.type === "flight") {
                typeLabel = language === 'en' ? "Flight" : "จองตั๋วบิน";
                TypeIcon = Plane;
                typeBg = "bg-blue-50 text-blue-700 border-blue-200/50";
              } else if (house.type === "restaurant") {
                typeLabel = language === 'en' ? "Restaurant" : "สั่งอาหาร";
                TypeIcon = UtensilsCrossed;
                typeBg = "bg-emerald-50 text-emerald-700 border-emerald-200/50";
              } else if (house.type === "ecommerce") {
                typeLabel = language === 'en' ? "E-Shop" : "อีคอมเมิร์ซ";
                TypeIcon = ShoppingBag;
                typeBg = "bg-indigo-50 text-indigo-700 border-indigo-200/50";
              }

              const isTeam7 = house.code === "TN07";

              return (
                <motion.div
                  key={house.id}
                  className="bg-card border border-border rounded-3xl p-7 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
                  style={{
                    borderTop: '4px solid #38bdf8'
                  }}
                  whileHover={{ y: -4, scale: 1.01 }}
                >
                  <div>
                    {/* Top tags */}
                    <div className="flex items-center justify-between mb-4">
                      <span className={`text-[10px] font-black tracking-wider uppercase px-2.5 py-1 rounded-full border flex items-center gap-1.5 ${typeBg}`}>
                        <TypeIcon className="size-3" />
                        {typeLabel}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-black text-foreground font-mono bg-muted/50 px-2 py-0.5 rounded-lg border border-border">
                          {house.code}
                        </span>
                      </div>
                    </div>

                                        {/* Team Info Layout (Icon Removed) */}
                    <div className="mb-5">
                      {/* Team Names & Details */}
                      <h3 className="text-lg font-black text-foreground mb-2 group-hover:text-primary transition-colors font-mono tracking-tight truncate">
                        {house.name}
                      </h3>
                      <p className="text-xs text-muted-foreground leading-relaxed min-h-[4.5rem] line-clamp-3">
                        {getProjectOverview(house.type, language)}
                      </p>
                    </div>
                  </div>

                  {/* Action Link Footer */}
                  <div className="flex items-center gap-3 pt-3.5 border-t border-border">
                    {/* Launch Live App */}
                    <a
                      href={house.deployedUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex-1 text-center py-3 text-xs font-extrabold rounded-xl border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                        isTeam7 
                          ? "bg-cta hover:bg-cta/90 border-cta text-cta-foreground shadow-sm shadow-cta/10" 
                          : "bg-card hover:bg-muted/40 border-border text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <span>{language === 'en' ? 'Launch Demo' : 'เปิดดูระบบเดโม'}</span>
                      <ChevronRight className="size-3.5" />
                    </a>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 bg-card border border-border rounded-3xl p-8 max-w-md mx-auto shadow-sm">
            <div className="w-16 h-16 bg-muted/40 rounded-full flex items-center justify-center mx-auto mb-4 border border-border">
              <Search className="size-6 text-muted-foreground" />
            </div>
            <h3 className="text-sm font-bold text-foreground mb-1">
              {language === 'en' ? 'No projects found' : 'ไม่พบผลงานโครงการ'}
            </h3>
            <p className="text-xs text-muted-foreground font-bold">
              {language === 'en' 
                ? 'Try adjusting your search filters or queries.' 
                : 'กรุณาลองปรับปรุงคำค้นหาหรือตัวกรองใหม่อีกครั้ง'
              }
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
