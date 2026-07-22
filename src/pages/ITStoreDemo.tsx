import {
  Check,
  ChevronRight,
  Cpu,
  Minus,
  Plus,
  ReceiptText,
  ShoppingCart,
  Trash2,
  Zap,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "@/lib/LanguageContext";
import PageSkeleton from "@/components/PageSkeleton";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import "./Pages.css";

// ─── Types ─────────────────────────────────────────────────────────────────

export type ITCategory = "All Products" | "Laptops" | "Monitors" | "Audio" | "Accessories";
export type ITCart = Record<string, number>;

export interface ITProduct {
  id: string;
  name: string;
  specs: string;
  description: string;
  category: ITCategory;
  price: number;
  image: string;
  badge?: string;
  color: string; // accent color
}

export interface ITOrder {
  orderId: string;
  orderedAt: string;
  items: Array<ITProduct & { quantity: number }>;
  subtotal: number;
  shipping: number;
  total: number;
}

// ─── Storage Keys ───────────────────────────────────────────────────────────
const CART_KEY = "botnoi-itstore-cart";
const ORDER_KEY = "botnoi-itstore-last-order";
const ORDERS_KEY = "botnoi-itstore-orders";

// ─── Product Catalogue ──────────────────────────────────────────────────────
// Using freely available Unsplash CDN images
const products: ITProduct[] = [
  {
    id: "probook",
    name: "Botnoi ProBook Ultra 16",
    specs: 'Intel Core Ultra 9 · 32GB RAM · 1TB NVMe · 16" OLED 120Hz',
    description:
      "The ultimate workhorse laptop for power users and creative professionals. Blazing performance meets all-day battery life.",
    category: "Laptops",
    price: 89900,
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&q=80&auto=format&fit=crop",
    badge: "Best Seller",
    color: "#6366f1",
  },
  {
    id: "curve32",
    name: "Botnoi Curve32 Monitor",
    specs: '32" 4K VA Panel · 144Hz · HDR1000 · USB-C 90W PD',
    description:
      "Stunning curved 4K display with ultra-smooth refresh rate. Perfect for gaming and productivity side-by-side.",
    category: "Monitors",
    price: 24900,
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&q=80&auto=format&fit=crop",
    badge: "New",
    color: "#06b6d4",
  },
  {
    id: "mechkey",
    name: "BotnKey Mechanic Pro",
    specs: "Full-size · Cherry MX Red · RGB Backlit · PBT Keycaps",
    description:
      "Satisfying tactile feedback with ultra-responsive linear switches. Built for all-night coding and gaming sessions.",
    category: "Accessories",
    price: 4990,
    image: "https://images.unsplash.com/photo-1595225476474-87563907a212?w=600&q=80&auto=format&fit=crop",
    color: "#f59e0b",
  },
  {
    id: "airmouse",
    name: "Botnoi AirTrack Mouse",
    specs: "2.4GHz Wireless · 25,600 DPI · Optical Sensor · 70hr Battery",
    description:
      "Precision engineering in a lightweight, ergonomic shell. Near-zero latency, perfect for both office and competitive gaming.",
    category: "Accessories",
    price: 3290,
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&q=80&auto=format&fit=crop",
    color: "#10b981",
  },
  {
    id: "headset",
    name: "Botnoi SoundSphere ANC",
    specs: "Active Noise Cancelling · Hybrid ANC · 30hr · Hi-Res Audio",
    description:
      "Immerse yourself in studio-quality sound with industry-leading noise cancellation. Crystal-clear mic for calls and meetings.",
    category: "Audio",
    price: 9990,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80&auto=format&fit=crop",
    badge: "Top Pick",
    color: "#8b5cf6",
  },
];

const categories: ITCategory[] = ["All Products", "Laptops", "Monitors", "Audio", "Accessories"];

const money = new Intl.NumberFormat("th-TH", {
  style: "currency",
  currency: "THB",
  maximumFractionDigits: 0,
});

// ─── Component ──────────────────────────────────────────────────────────────
export default function ITStoreDemo() {
  const { t, language } = useTranslation();
  const [activeCategory, setActiveCategory] = useState<ITCategory>("All Products");
  const [cart, setCart] = useState<ITCart>({});
  const [order, setOrder] = useState<ITOrder | null>(null);
  const [invoiceOpen, setInvoiceOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const cartRef = useRef<HTMLElement>(null);

  // Load from localStorage
  useEffect(() => {
    try {
      const savedCart = window.localStorage.getItem(CART_KEY);
      const savedOrder = window.localStorage.getItem(ORDER_KEY);
      if (savedCart) setCart(JSON.parse(savedCart) as ITCart);
      if (savedOrder) setOrder(JSON.parse(savedOrder) as ITOrder);
    } catch {
      window.localStorage.removeItem(CART_KEY);
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) window.localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart, ready]);

  const visibleProducts =
    activeCategory === "All Products"
      ? products
      : products.filter((p) => p.category === activeCategory);

  const cartItems = useMemo(
    () =>
      products
        .filter((p) => (cart[p.id] ?? 0) > 0)
        .map((p) => ({ ...p, quantity: cart[p.id] ?? 0 })),
    [cart]
  );

  const itemCount = cartItems.reduce((s, i) => s + i.quantity, 0);
  const subtotal = cartItems.reduce((s, i) => s + i.price * i.quantity, 0);
  const shipping = 0; // free shipping

  const changeQty = (id: string, delta: number) => {
    setCart((prev) => {
      const next = Math.max(0, (prev[id] ?? 0) + delta);
      const updated = { ...prev, [id]: next };
      if (next === 0) delete updated[id];
      return updated;
    });
  };

  const checkout = () => {
    if (cartItems.length === 0) return;
    const newOrder: ITOrder = {
      orderId: `IT${Date.now().toString().slice(-7)}`,
      orderedAt: new Date().toLocaleString(
        language === "en" ? "en-US" : "th-TH",
        { dateStyle: "medium", timeStyle: "short" }
      ),
      items: cartItems,
      subtotal,
      shipping,
      total: subtotal + shipping,
    };
    window.localStorage.setItem(ORDER_KEY, JSON.stringify(newOrder));
    try {
      const prev = window.localStorage.getItem(ORDERS_KEY);
      const list: ITOrder[] = prev ? JSON.parse(prev) : [];
      list.unshift(newOrder);
      window.localStorage.setItem(ORDERS_KEY, JSON.stringify(list));
    } catch { /* */ }
    setOrder(newOrder);
    setCart({});
    setInvoiceOpen(true);
  };

  const getCategoryLabel = (cat: ITCategory) => {
    switch (cat) {
      case "All Products": return t("itstore.category_all");
      case "Laptops": return t("itstore.category_laptops");
      case "Monitors": return t("itstore.category_monitors");
      case "Audio": return t("itstore.category_audio");
      case "Accessories": return t("itstore.category_accessories");
    }
  };

  return (
    <>
      <AnimatePresence>
        {!ready && <PageSkeleton variant="order" />}
      </AnimatePresence>

      <div className="itstore-theme min-h-screen w-full max-w-full overflow-x-hidden bg-background text-foreground page-grid">

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <header className="relative z-20 border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0">
          <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between gap-4">
            {/* Brand */}
            <Link to="/it-store-demo" className="flex items-center gap-2.5 flex-shrink-0">
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Cpu size={20} color="white" />
              </div>
              <div>
                <div className="font-extrabold text-slate-900 text-base leading-tight tracking-tight">
                  Botnoi IT Shop
                </div>
                <div className="text-xs text-slate-400 font-medium">Tech E-Commerce Demo</div>
              </div>
            </Link>

            {/* Nav actions */}
            <nav className="flex items-center gap-3 text-sm font-semibold">
              {order && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setInvoiceOpen(true)}
                  className="text-slate-600 hover:text-slate-900 gap-1.5 font-bold hover:bg-slate-100/60 rounded-full px-3 py-1.5"
                  id="itstore-view-invoice"
                >
                  <ReceiptText className="size-4" />
                  <span>{t("itstore.nav_receipt")}</span>
                </Button>
              )}
              <Link
                to="/it-store-demo/admin"
                className="px-4 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 transition-all border border-slate-200 text-slate-700 text-xs font-bold"
                id="nav-itstore-admin"
              >
                {t("itstore.nav_admin")}
              </Link>
              <button
                className="relative flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold text-white transition-all"
                style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}
                onClick={() => cartRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}
                id="itstore-cart-btn"
              >
                <ShoppingCart className="size-4" />
                {language === "en" ? "Cart" : t("itstore.nav_cart")}
                <span className="absolute -top-1.5 -right-1.5 min-w-5 h-5 rounded-full bg-white text-indigo-600 text-xs font-extrabold flex items-center justify-center shadow px-1">
                  {itemCount}
                </span>
              </button>
            </nav>
          </div>
        </header>

        {/* ── Hero Banner ─────────────────────────────────────────────────── */}
        <section
          className="relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg,#f8f8ff 0%,#eef2ff 40%,#f0fdf4 100%)",
            padding: "4rem 1.5rem 3rem",
          }}
        >
          {/* Decorative blobs */}
          <div
            style={{
              position: "absolute", top: "-60px", right: "-60px",
              width: 320, height: 320, borderRadius: "50%",
              background: "radial-gradient(circle,rgba(99,102,241,0.12) 0%,transparent 70%)",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute", bottom: "-40px", left: "-40px",
              width: 220, height: 220, borderRadius: "50%",
              background: "radial-gradient(circle,rgba(139,92,246,0.10) 0%,transparent 70%)",
              pointerEvents: "none",
            }}
          />
          <div className="mx-auto max-w-7xl relative z-10 flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1 text-center md:text-left">
              <span
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mb-4"
                style={{ background: "rgba(99,102,241,0.1)", color: "#6366f1", border: "1px solid rgba(99,102,241,0.2)" }}
              >
                <Zap size={12} />
                {t("itstore.badge")}
              </span>
              <h1
                className="font-extrabold tracking-tight mb-3"
                style={{ fontSize: "clamp(2rem,5vw,3rem)", color: "#1e1b4b", lineHeight: 1.15 }}
                id="itstore-hero-title"
              >
                {t("itstore.hero_title")}
              </h1>
              <p className="text-slate-500 text-base max-w-lg" style={{ lineHeight: 1.65 }}>
                {t("itstore.hero_desc")}
              </p>
            </div>

            {/* Floating product preview cards */}
            <div className="flex gap-4 flex-shrink-0 flex-wrap justify-center">
              {products.slice(0, 3).map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.12, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    width: 120,
                    background: "#fff",
                    borderRadius: 16,
                    border: "1px solid rgba(228,228,231,0.8)",
                    padding: "1rem",
                    boxShadow: "0 8px 24px -4px rgba(0,0,0,0.06)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <img
                    src={p.image}
                    alt={p.name}
                    style={{ width: 72, height: 72, objectFit: "cover", borderRadius: 10 }}
                    loading="lazy"
                  />
                  <div
                    style={{
                      fontSize: "0.65rem", fontWeight: 700, color: p.color,
                      textAlign: "center", lineHeight: 1.3,
                    }}
                  >
                    {p.name}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Main Content ─────────────────────────────────────────────────── */}
        <div className="mx-auto w-full max-w-7xl px-4 py-8 pb-32 sm:px-6 lg:grid lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-8 lg:px-8 lg:pb-12">

          {/* ── Products Section ────────────────────────────────────────── */}
          <section aria-labelledby="products-heading" className="min-w-0 overflow-hidden" id="itstore-products">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "#6366f1" }}>
                  {language === "en" ? "Browse the catalogue" : "เลือกสินค้า"}
                </p>
                <h2 id="products-heading" className="font-extrabold text-3xl tracking-tight text-slate-900">
                  {language === "en" ? "Our Products" : "สินค้าทั้งหมด"}
                </h2>
              </div>
              <p className="text-xs text-slate-400 font-bold">
                {visibleProducts.length} {t("itstore.items_count")}
              </p>
            </div>

            {/* Category Pills */}
            <div
              className="mb-8 flex gap-2 overflow-x-auto whitespace-nowrap pb-3 -mx-4 px-4 scrollbar-hide snap-x"
              role="tablist"
              aria-label={language === "en" ? "Product Categories" : "หมวดหมู่สินค้า"}
            >
              {categories.map((cat) => {
                const active = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    className={`relative shrink-0 snap-start px-5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer border ${active
                        ? "border-transparent text-white"
                        : "text-slate-500 border-slate-200 hover:text-slate-800 hover:bg-slate-50"
                      }`}
                    style={active ? { background: "linear-gradient(135deg,#6366f1,#8b5cf6)" } : {}}
                    onClick={() => setActiveCategory(cat)}
                    role="tab"
                    aria-selected={active}
                    id={`itstore-cat-${cat.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    {getCategoryLabel(cat)}
                  </button>
                );
              })}
            </div>

            {/* Product Grid */}
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 gap-5"
            >
              <AnimatePresence>
                {visibleProducts.map((product) => {
                  const qty = cart[product.id] ?? 0;
                  const inCart = qty > 0;
                  return (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      transition={{ duration: 0.2 }}
                      className="w-full"
                    >
                      <div
                        className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl h-full"
                        id={`itstore-product-${product.id}`}
                      >
                        {/* Image */}
                        <div
                          className="relative overflow-hidden"
                          style={{ height: 200, background: "#f8fafc" }}
                        >
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            loading="lazy"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                `https://placehold.co/600x400/eef2ff/6366f1?text=${encodeURIComponent(product.name)}`;
                            }}
                          />
                          {/* Badge */}
                          {product.badge && (
                            <span
                              className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-bold text-white"
                              style={{ background: product.color }}
                            >
                              {product.badge}
                            </span>
                          )}
                          {/* In cart overlay */}
                          {inCart && (
                            <div
                              className="absolute inset-0 flex items-center justify-center"
                              style={{ background: "rgba(255,255,255,0.7)" }}
                            >
                              <div
                                className="flex items-center gap-3 px-4 py-2.5 rounded-full font-bold text-white shadow-lg"
                                style={{ background: product.color }}
                              >
                                <button
                                  onClick={() => changeQty(product.id, -1)}
                                  className="w-6 h-6 rounded-full bg-white/30 flex items-center justify-center hover:bg-white/50 transition"
                                  id={`itstore-minus-${product.id}`}
                                >
                                  <Minus size={12} />
                                </button>
                                <span className="min-w-[1.5rem] text-center text-sm">{qty}</span>
                                <button
                                  onClick={() => changeQty(product.id, 1)}
                                  className="w-6 h-6 rounded-full bg-white/30 flex items-center justify-center hover:bg-white/50 transition"
                                  id={`itstore-plus-${product.id}`}
                                >
                                  <Plus size={12} />
                                </button>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex flex-col flex-1 p-5 gap-3">
                          <div>
                            <h3 className="font-extrabold text-slate-900 text-base leading-tight mb-1">
                              {product.name}
                            </h3>
                            <p
                              className="text-xs font-semibold mb-2"
                              style={{ color: product.color }}
                            >
                              {t("itstore.speci")}: {product.specs}
                            </p>
                            <p className="text-sm text-slate-500 leading-relaxed">
                              {product.description}
                            </p>
                          </div>

                          <div className="mt-auto flex items-center justify-between gap-3">
                            <div className="font-extrabold text-xl text-slate-900">
                              {money.format(product.price)}
                            </div>
                            {!inCart ? (
                              <button
                                onClick={() => changeQty(product.id, 1)}
                                className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold text-white transition-all hover:scale-105 active:scale-95"
                                style={{ background: product.color }}
                                id={`itstore-add-${product.id}`}
                              >
                                <Plus size={14} /> {t("itstore.btn_add")}
                              </button>
                            ) : (
                              <span
                                className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold text-white"
                                style={{ background: product.color, opacity: 0.85 }}
                              >
                                <Check size={14} /> {t("itstore.btn_in_cart")}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          </section>

          {/* ── Cart Sidebar ─────────────────────────────────────────────── */}
          <aside
            ref={cartRef as React.RefObject<HTMLDivElement>}
            className="itstore-cart-sidebar"
            aria-label="Shopping Cart"
            id="itstore-cart"
          >
            <div className="sticky top-24">
              <div
                className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm"
              >
                {/* Cart header */}
                <div
                  className="px-6 py-4 border-b border-slate-100 flex items-center justify-between"
                  style={{ background: "linear-gradient(135deg,#f8f8ff,#eef2ff)" }}
                >
                  <div className="flex items-center gap-2">
                    <ShoppingCart size={18} style={{ color: "#6366f1" }} />
                    <span className="font-extrabold text-slate-900 text-sm">{t("itstore.cart_title")}</span>
                  </div>
                  <span
                    className="px-2 py-0.5 rounded-full text-xs font-extrabold text-white"
                    style={{ background: "#6366f1", minWidth: 22, textAlign: "center" }}
                  >
                    {itemCount}
                  </span>
                </div>

                {/* Cart items */}
                <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
                  <AnimatePresence>
                    {cartItems.length === 0 ? (
                      <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="px-6 py-10 text-center text-slate-400 text-sm"
                      >
                        <ShoppingCart size={36} className="mx-auto mb-3 opacity-30" />
                        {t("itstore.cart_empty")}
                      </motion.div>
                    ) : (
                      cartItems.map((item) => (
                        <motion.div
                          key={item.id}
                          layout
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="flex items-center gap-3 px-4 py-3"
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-12 h-12 rounded-xl object-cover border border-slate-100 flex-shrink-0"
                            loading="lazy"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                `https://placehold.co/48x48/eef2ff/6366f1?text=IT`;
                            }}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="font-bold text-slate-900 text-xs leading-tight truncate">{item.name}</div>
                            <div className="text-xs text-slate-400 mt-0.5">{money.format(item.price)}</div>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => changeQty(item.id, -1)}
                              className="w-6 h-6 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:border-red-300 hover:text-red-500 transition"
                              id={`cart-minus-${item.id}`}
                            >
                              {item.quantity === 1 ? <Trash2 size={10} /> : <Minus size={10} />}
                            </button>
                            <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                            <button
                              onClick={() => changeQty(item.id, 1)}
                              className="w-6 h-6 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:border-indigo-300 hover:text-indigo-500 transition"
                              id={`cart-plus-${item.id}`}
                            >
                              <Plus size={10} />
                            </button>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </AnimatePresence>
                </div>

                {/* Cart summary */}
                <div className="px-6 py-4 border-t border-slate-100 space-y-2">
                  <div className="flex justify-between text-sm text-slate-500">
                    <span>{t("itstore.cart_subtotal")}</span>
                    <span className="font-semibold">{money.format(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-slate-500">
                    <span>{t("itstore.cart_shipping")}</span>
                    <span className="font-semibold text-emerald-600">{t("itstore.cart_shipping_free")}</span>
                  </div>
                  <div className="flex justify-between text-base font-extrabold text-slate-900 pt-2 border-t border-slate-100">
                    <span>{t("itstore.cart_total")}</span>
                    <span style={{ color: "#6366f1" }}>{money.format(subtotal)}</span>
                  </div>
                  <button
                    onClick={checkout}
                    disabled={cartItems.length === 0}
                    className="w-full mt-3 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-extrabold text-white transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-40 disabled:pointer-events-none"
                    style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}
                    id="itstore-checkout-btn"
                  >
                    <ChevronRight size={16} /> {t("itstore.cart_checkout")}
                  </button>
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* ── Invoice Dialog ─────────────────────────────────────────────── */}
        <Dialog open={invoiceOpen} onOpenChange={setInvoiceOpen}>
          <DialogContent className="max-w-md" id="itstore-invoice-dialog">
            <DialogHeader>
              <DialogTitle className="font-extrabold text-xl flex items-center gap-2">
                <ReceiptText size={20} style={{ color: "#6366f1" }} />
                {t("itstore.receipt_title")}
              </DialogTitle>
              <DialogDescription>
                {t("itstore.receipt_id")}: <strong>{order?.orderId}</strong>
                <br />
                {t("itstore.receipt_time")}: {order?.orderedAt}
              </DialogDescription>
            </DialogHeader>
            {order && (
              <div className="space-y-3 mt-2">
                <div className="divide-y divide-slate-100 rounded-xl border border-slate-200 overflow-hidden">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 px-4 py-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-10 h-10 rounded-lg object-cover border border-slate-100 flex-shrink-0"
                        loading="lazy"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-slate-900 leading-tight truncate">{item.name}</div>
                        <div className="text-xs text-slate-400">{money.format(item.price)} × {item.quantity}</div>
                      </div>
                      <div className="text-xs font-extrabold" style={{ color: "#6366f1" }}>
                        {money.format(item.price * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="rounded-xl border border-slate-200 px-4 py-3 space-y-1.5">
                  <div className="flex justify-between text-sm text-slate-500">
                    <span>{t("itstore.cart_subtotal")}</span>
                    <span>{money.format(order.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-slate-500">
                    <span>{t("itstore.cart_shipping")}</span>
                    <span className="text-emerald-600 font-semibold">{t("itstore.cart_shipping_free")}</span>
                  </div>
                  <div className="flex justify-between text-base font-extrabold text-slate-900 border-t border-slate-100 pt-1.5">
                    <span>{t("itstore.cart_total")}</span>
                    <span style={{ color: "#6366f1" }}>{money.format(order.total)}</span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="w-full font-bold"
                  onClick={() => setInvoiceOpen(false)}
                  id="itstore-close-invoice"
                >
                  {t("itstore.receipt_close")}
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>

      </div>
    </>
  );
}
