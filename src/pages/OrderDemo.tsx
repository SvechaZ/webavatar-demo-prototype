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

export default function OrderDemo() {
  const { language } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Filtering Logic
  const filteredHouses = useMemo(() => {
    return projectData.filter(house => {
      const matchesSearch = house.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            house.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            house.style.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === "all" || house.type === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="order-theme min-h-[calc(100vh-68px)] bg-stone-50/50 w-full flex flex-col pb-16 selection:bg-sky-600 selection:text-white">
      {/* 1. Page Header & Hero */}
      <header className="w-full bg-white border-b border-stone-200/80 py-8 relative z-10">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          {/* Breadcrumbs */}
          <nav className="mb-4 flex items-center gap-2 text-xs text-stone-500 font-bold" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-sky-600 transition-colors flex items-center gap-1">
              <Home className="size-3" />
              <span>{language === 'en' ? 'Home' : 'หน้าหลัก'}</span>
            </Link>
            <ChevronRight className="size-3 text-stone-400" />
            <span className="text-stone-800 font-extrabold uppercase font-mono">
              {language === 'en' ? 'Showcase Portal' : 'คลังเดโมพอร์ทัล'}
            </span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <span className="text-[10px] font-black text-sky-600 uppercase tracking-widest block font-mono">
                {language === 'en' ? 'TN01 - TN20 Student Projects' : 'โครงการพัฒนาแอปพลิเคชันจากบ้านพัก TN01-TN20'}
              </span>
              <h1 className="text-3xl md:text-4xl font-black text-stone-900 mt-1 tracking-tight flex items-center gap-2 bg-gradient-to-r from-stone-900 to-stone-700 bg-clip-text text-transparent">
                <Sparkles className="size-8 text-sky-500 animate-pulse" />
                {language === 'en' ? 'TN House Showcase Portal' : 'พอร์ทัลรวบรวมผลงานบ้าน TN'}
              </h1>
              <p className="text-sm text-stone-500 font-medium mt-2 max-w-2xl leading-relaxed">
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
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white border border-stone-200 p-4 rounded-3xl shadow-sm">
          {/* Search Input */}
          <div className="relative w-full lg:max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-stone-400" />
            <input
              type="text"
              placeholder={language === 'en' ? "Search by code or team name..." : "ค้นหาด้วยรหัสบ้านหรือชื่อทีม..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 focus:border-sky-500 rounded-2xl text-xs font-bold text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 transition-all font-mono"
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
                      ? "bg-sky-600 text-white border-sky-600 shadow-sm"
                      : "text-stone-600 bg-stone-50 hover:bg-stone-100 hover:text-stone-900 border-stone-200"
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
                  className="bg-white border border-stone-200/80 rounded-3xl p-5 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
                  style={{
                    borderTop: `4px solid ${house.color}`
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
                      <span className="text-xs font-black text-stone-800 font-mono bg-stone-100 px-2 py-0.5 rounded-lg border border-stone-200/50">
                        {house.code}
                      </span>
                    </div>

                    {/* Team Names & Details */}
                    <h3 className="text-sm font-extrabold text-stone-900 mb-1 group-hover:text-sky-600 transition-colors font-mono tracking-tight truncate">
                      {house.name}
                    </h3>
                    <p className="text-[10px] text-stone-500 font-bold mb-4 font-mono">
                      {language === 'en' ? `Style: ${house.style}` : `สไตล์: ${house.style}`}
                    </p>

                    {/* Image Placeholder Banner */}
                    <div className="w-full h-32 rounded-2xl mb-5 overflow-hidden relative flex items-center justify-center bg-stone-50 border border-stone-100">
                      {/* Gradient Backdrop based on Type */}
                      {house.type === "accommodation" && (
                        <div className="absolute inset-0 bg-gradient-to-br from-amber-400/10 to-orange-500/5" />
                      )}
                      {house.type === "flight" && (
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 to-indigo-500/5" />
                      )}
                      {house.type === "restaurant" && (
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/10 to-teal-500/5" />
                      )}
                      {house.type === "ecommerce" && (
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-400/10 to-purple-500/5" />
                      )}

                      {/* Centered Graphic */}
                      <div className="z-10 p-3.5 rounded-full bg-white shadow-md border border-stone-100 flex items-center justify-center">
                        <TypeIcon 
                          className="size-8" 
                          style={{ color: house.color }}
                        />
                      </div>

                      {/* Pulse Status Indicator for Team 7 */}
                      {isTeam7 && (
                        <span className="absolute bottom-2.5 right-2.5 bg-emerald-500 text-white font-mono text-[9px] font-black px-2 py-0.5 rounded-md shadow-sm tracking-wider uppercase animate-pulse">
                          {language === 'en' ? 'OUR TEAM (LIVE)' : 'ทีมของเรา (ใช้งานได้)'}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action Link Footer */}
                  <div className="flex items-center gap-3 pt-3.5 border-t border-stone-100">
                    {/* Source Code */}
                    <a
                      href={house.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 bg-stone-100 hover:bg-stone-200 border border-stone-200 text-stone-600 hover:text-stone-900 rounded-xl transition-all cursor-pointer flex items-center justify-center"
                      title={language === 'en' ? "View Code" : "ดูซอร์สโค้ด"}
                    >
                      <span className="font-extrabold text-[11px] font-mono">&lt;/&gt;</span>
                    </a>

                    {/* Launch Live App */}
                    <a
                      href={house.deployedUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex-1 text-center py-2.5 text-[11px] font-extrabold rounded-xl border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                        isTeam7 
                          ? "bg-emerald-600 hover:bg-emerald-700 border-emerald-700 text-white shadow-sm shadow-emerald-600/10" 
                          : "bg-white hover:bg-stone-50 border-stone-200 text-stone-700 hover:text-stone-900"
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
          <div className="text-center py-20 bg-white border border-stone-200 rounded-3xl p-8 max-w-md mx-auto shadow-sm">
            <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4 border border-stone-200/50">
              <Search className="size-6 text-stone-400" />
            </div>
            <h3 className="text-sm font-bold text-stone-800 mb-1">
              {language === 'en' ? 'No projects found' : 'ไม่พบผลงานโครงการ'}
            </h3>
            <p className="text-xs text-stone-500 font-bold">
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
