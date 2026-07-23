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
  FlaskConical
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
  { id: -1, code: 'SANDBOX', name: 'Flight Demo', style: 'Interactive Sandbox', type: 'flight', color: '#0284c7', progress: 100, deployedUrl: '/flight-demo', githubUrl: '' },
  { id: -2, code: 'SANDBOX', name: 'IT Store Demo', style: 'Interactive Sandbox', type: 'ecommerce', color: '#6366F1', progress: 100, deployedUrl: '/it-store-demo', githubUrl: '' },
  { id: 1, code: 'TN01', name: '01-the-chill-crew', style: 'Modern Minimalist', type: 'accommodation', color: '#6366F1', progress: 85, deployedUrl: 'https://ai-learn-hub-22.lovable.app/', githubUrl: 'https://github.com/Icetea0000000000025/ai-learn-hub-22.git  ' },
  { id: 2, code: 'TN02', name: '02-cozy-oracles', style: 'Neo-Classical', type: 'flight', color: '#b45309', progress: 45, deployedUrl: 'https://example.com', githubUrl: 'https://github.com' },
  { id: 3, code: 'TN03', name: '03-controller-kings', style: 'Nordic Timber', type: 'ecommerce', color: '#059669', progress: 90, deployedUrl: 'https://eucerin-mu.vercel.app/', githubUrl: 'https://github.com' },
  { id: 4, code: 'TN04', name: '04-the-netflix-hermits', style: 'Brutalist Concrete', type: 'ecommerce', color: '#1e293b', progress: 10, deployedUrl: 'https://trip-planner-botnoi.vercel.app/', githubUrl: 'https://github.com' },
  { id: 5, code: 'TN05', name: '05-aesthetic-dreamers', style: 'Cozy Wood Cabin', type: 'accommodation', color: '#78350f', progress: 100, deployedUrl: 'https://hospital-health.lovable.app/', githubUrl: 'https://github.com' },
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
    deployedUrl: 'https://ran-lung-get-de.vercel.app/customer',
    githubUrl: 'https://github.com/ran-lung-get/ran-lung-get-demo'
  },
  { id: 8, code: 'TN08', name: '08-vibe-architects', style: 'Industrial Brickwork', type: 'ecommerce', color: '#991b1b', progress: 75, deployedUrl: 'https://example.com', githubUrl: 'https://github.com' },
  { id: 9, code: 'TN09', name: '09-sunset-superfans', style: 'Japanese Zen', type: 'accommodation', color: '#16a34a', progress: 100, deployedUrl: 'https://example.com', githubUrl: 'https://github.com' },
  { id: 10, code: 'TN10', name: '10-lazy-mermaids', style: 'Modular Container', type: 'flight', color: '#ca8a04', progress: 30, deployedUrl: 'https://b-grim-dashboard.vercel.app/', githubUrl: 'https://github.com' },
  { id: 11, code: 'TN11', name: '11-the-sharp-cuts', style: 'Mid-Century Gable', type: 'restaurant', color: '#475569', progress: 5, deployedUrl: 'https://example.com', githubUrl: 'https://github.com' },
  { id: 12, code: 'TN12', name: '12-coastal-avengers', style: 'Tropical Canopy', type: 'ecommerce', color: '#0d9488', progress: 95, deployedUrl: 'https://example.com', githubUrl: 'https://github.com' },
  { id: 13, code: 'TN13', name: '13-the-dungeon-masters', style: 'Step Architecture', type: 'accommodation', color: '#4338ca', progress: 55, deployedUrl: 'https://example.com', githubUrl: 'https://github.com' },
  { id: 14, code: 'TN14', name: '14-the-all-rounders', style: 'Atrium Courtyard', type: 'flight', color: '#db2777', progress: 100, deployedUrl: 'https://botnoi-brewai-production.up.railway.app/', githubUrl: 'https://github.com' },
  { id: 15, code: 'TN15', name: '15-mountain-mode', style: 'Flat-Roof Minimal', type: 'restaurant', color: '#0f172a', progress: 15, deployedUrl: 'https://example.com', githubUrl: 'https://github.com' },
  { id: 16, code: 'TN16', name: '16-blue-hour-society', style: 'Modern Steel Frame', type: 'ecommerce', color: '#334155', progress: 70, deployedUrl: 'https://example.com', githubUrl: 'https://github.com' },
  { id: 17, code: 'TN17', name: '17-midnight-raiders', style: 'Spanish Terracotta', type: 'accommodation', color: '#c2410c', progress: 80, deployedUrl: 'https://example.com', githubUrl: 'https://github.com' },
  { id: 18, code: 'TN18', name: '18-indie-mountain-kids', style: 'Parametric Fluid', type: 'flight', color: '#06b6d4', progress: 0, deployedUrl: 'https://example.com', githubUrl: 'https://github.com' },
  { id: 19, code: 'TN19', name: '19-ocean-avengers', style: 'Victorian Restoration', type: 'restaurant', color: '#6d28d9', progress: 100, deployedUrl: 'https://example.com', githubUrl: 'https://github.com' },
  { id: 20, code: 'TN20', name: '20-final-boss-crew', style: 'Waterfront Living', type: 'ecommerce', color: '#0369a1', progress: 40, deployedUrl: 'https://example.com', githubUrl: 'https://github.com' }
];

// ─── Shared card renderer ─────────────────────────────────────────────────────
function DemoCard({ house, t }: { house: HouseItem; t: (key: any) => string }) {
  let typeLabel = "";
  let TypeIcon = UtensilsCrossed;
  let typeBg = "bg-stone-50 text-stone-600 border-stone-200";
  let cardDescription = "";

  if (house.id === -1) {
    typeLabel = "FLIGHT";
    TypeIcon = Plane;
    typeBg = "bg-blue-50 text-blue-700 border-blue-200/50";
    cardDescription = "Domestic flight booking sandbox";
  } else if (house.id === -2) {
    typeLabel = "E-SHOP";
    TypeIcon = ShoppingBag;
    typeBg = "bg-indigo-50 text-indigo-700 border-indigo-200/50";
    cardDescription = "Tech retail e-commerce storefront";
  } else {
    cardDescription = t(`showcase.desc_${house.type}` as any);
    if (house.type === "accommodation") {
      typeLabel = t("showcase.type_accommodation");
      TypeIcon = BedDouble;
      typeBg = "bg-amber-50 text-amber-700 border-amber-200/50";
    } else if (house.type === "flight") {
      typeLabel = t("showcase.type_flight");
      TypeIcon = Plane;
      typeBg = "bg-blue-50 text-blue-700 border-blue-200/50";
    } else if (house.type === "restaurant") {
      typeLabel = t("showcase.type_restaurant");
      TypeIcon = UtensilsCrossed;
      typeBg = "bg-emerald-50 text-emerald-700 border-emerald-200/50";
    } else if (house.type === "ecommerce") {
      typeLabel = t("showcase.type_ecommerce");
      TypeIcon = ShoppingBag;
      typeBg = "bg-indigo-50 text-indigo-700 border-indigo-200/50";
    }
  }

  const hasDeployed =
    house.deployedUrl &&
    house.deployedUrl.trim() !== "" &&
    house.deployedUrl.trim() !== "https://example.com";

  return (
    <motion.div
      key={house.id}
      className="bg-card border border-border rounded-3xl p-7 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
      style={{ borderTop: '4px solid #38bdf8' }}
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

        {/* Title & Description */}
        <div className="mb-5">
          <h3 className="text-lg font-black text-foreground mb-2 group-hover:text-primary transition-colors font-mono tracking-tight truncate">
            {house.name}
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed min-h-[4.5rem] line-clamp-3">
            {cardDescription}
          </p>
        </div>
      </div>

      {/* Action Link Footer */}
      <div className="flex items-center gap-3 pt-3.5 border-t border-border">
        {house.deployedUrl.startsWith('/') ? (
          <Link
            to={house.deployedUrl}
            className={`flex-1 text-center py-3 text-xs font-extrabold rounded-xl border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              hasDeployed
                ? "bg-cta hover:bg-cta/90 border-cta text-cta-foreground shadow-sm shadow-cta/10"
                : "bg-card hover:bg-muted/40 border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            <span>{t('showcase.launch_demo')}</span>
            <ChevronRight className="size-3.5" />
          </Link>
        ) : (
          <a
            href={house.deployedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex-1 text-center py-3 text-xs font-extrabold rounded-xl border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              hasDeployed
                ? "bg-cta hover:bg-cta/90 border-cta text-cta-foreground shadow-sm shadow-cta/10"
                : "bg-card hover:bg-muted/40 border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            <span>{t('showcase.launch_demo')}</span>
            <ChevronRight className="size-3.5" />
          </a>
        )}
      </div>
    </motion.div>
  );
}

// ─── Page Component ───────────────────────────────────────────────────────────
export default function OrderDemo() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Split filtered results into two groups
  const { sandboxDemos, projectDemos } = useMemo(() => {
    const all = projectData.filter(house => {
      let overviewText = "";
      if (house.id === -1) {
        overviewText = "Domestic flight booking sandbox";
      } else if (house.id === -2) {
        overviewText = "Tech retail e-commerce storefront";
      } else {
        overviewText = t(`showcase.desc_${house.type}` as any);
      }

      const matchesSearch =
        house.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        house.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        overviewText.toLowerCase().includes(searchQuery.toLowerCase()) ||
        house.style.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = selectedCategory === "all" || house.type === selectedCategory;

      return matchesSearch && matchesCategory;
    });

    return {
      sandboxDemos: all.filter(h => h.code === 'SANDBOX'),
      projectDemos: all.filter(h => h.code !== 'SANDBOX'),
    };
  }, [searchQuery, selectedCategory, t]);

  const totalResults = sandboxDemos.length + projectDemos.length;

  return (
    <div
      className="order-theme min-h-[calc(100vh-68px)] w-full flex flex-col pb-16 selection:bg-primary selection:text-primary-foreground"
      style={{ backgroundImage: 'var(--grad-mesh)' }}
    >
      {/* 1. Page Header & Hero */}
      <header className="w-full bg-card/60 backdrop-blur-md border-b border-border py-8 relative z-10">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <span className="text-[10px] font-black text-primary uppercase tracking-widest block font-mono">
                {t('showcase.student_projects')}
              </span>
              <h1 className="text-3xl md:text-4xl font-black text-foreground mt-1 tracking-tight flex items-center gap-2 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                <Sparkles className="size-8 text-primary animate-pulse" />
                All demo
              </h1>
              <p className="text-sm text-muted-foreground font-medium mt-2 max-w-2xl leading-relaxed">
                {t('showcase.desc')}
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
              placeholder={t('showcase.search_placeholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-muted/30 border border-border focus:border-primary rounded-2xl text-xs font-bold text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-mono"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto no-scrollbar">
            {[
              { id: "all", translationKey: "showcase.cat_all" as const, icon: Sparkles },
              { id: "accommodation", translationKey: "showcase.cat_accommodation" as const, icon: BedDouble },
              { id: "flight", translationKey: "showcase.cat_flight" as const, icon: Plane },
              { id: "restaurant", translationKey: "showcase.cat_restaurant" as const, icon: UtensilsCrossed },
              { id: "ecommerce", translationKey: "showcase.cat_ecommerce" as const, icon: ShoppingBag },
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
                  <span>{t(cat.translationKey)}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto w-full px-4 md:px-8 mt-8 flex-1 space-y-12">

        {totalResults === 0 ? (
          /* Empty state */
          <div className="text-center py-20 bg-card border border-border rounded-3xl p-8 max-w-md mx-auto shadow-sm">
            <div className="w-16 h-16 bg-muted/40 rounded-full flex items-center justify-center mx-auto mb-4 border border-border">
              <Search className="size-6 text-muted-foreground" />
            </div>
            <h3 className="text-sm font-bold text-foreground mb-1">
              {t('showcase.no_projects')}
            </h3>
            <p className="text-xs text-muted-foreground font-bold">
              {t('showcase.no_projects_desc')}
            </p>
          </div>
        ) : (
          <>
            {/* ── Section 1: Sandbox Demos ───────────────────────────────── */}
            {sandboxDemos.length > 0 && (
              <section aria-label="Sandbox Demos">
                <div className="flex items-center gap-2.5 mb-5">
                  <FlaskConical className="size-4 text-primary" />
                  <h2 className="text-xs font-black text-primary uppercase tracking-widest font-mono">
                    Sandbox Demos
                  </h2>
                  <span className="text-[10px] font-black text-muted-foreground bg-muted/40 border border-border px-2 py-0.5 rounded-full font-mono">
                    {sandboxDemos.length}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {sandboxDemos.map(house => (
                    <DemoCard key={house.id} house={house} t={t} />
                  ))}
                </div>
              </section>
            )}

            {/* ── Section 2: TN Student Projects ────────────────────────── */}
            {projectDemos.length > 0 && (
              <section aria-label="TN Student Projects">
                <div className="flex items-center gap-2.5 mb-5">
                  <Sparkles className="size-4 text-primary" />
                  <h2 className="text-xs font-black text-primary uppercase tracking-widest font-mono">
                    {t('showcase.student_projects')}
                  </h2>
                  <span className="text-[10px] font-black text-muted-foreground bg-muted/40 border border-border px-2 py-0.5 rounded-full font-mono">
                    {projectDemos.length}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {projectDemos.map(house => (
                    <DemoCard key={house.id} house={house} t={t} />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </main>
    </div>
  );
}