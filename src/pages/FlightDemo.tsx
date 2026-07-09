import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { useTranslation } from "@/lib/LanguageContext";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { saveBooking } from "@/lib/bookings";
import { toast, Toaster } from "sonner";
import PageSkeleton from "@/components/PageSkeleton";
import SkeletonImage from "@/components/SkeletonImage";
import botnoiAirLogo from "@/assets/BOTNOI-AIR-logo.png";
import heroBg from "@/assets/hero-bg.jpg";
import promoChiangmai from "@/assets/promo-chiangmai.jpg";
import promoPhuket from "@/assets/promo-phuket.jpg";
import promoHatyai from "@/assets/promo-hatyai.jpg";

const CITIES = [
  "กรุงเทพฯ (DMK)",
  "เชียงใหม่ (CNX)",
  "ภูเก็ต (HKT)",
  "หาดใหญ่ (HDY)",
  "อุดรธานี (UTH)",
  "อุบลราชธานี (UBP)",
  "ขอนแก่น (KKC)",
  "สุราษฎร์ธานี (URT)",
  "นครศรีธรรมราช (NST)",
  "เชียงราย (CEI)",
];

interface BookingForm {
  from: string;
  to: string;
  departDate: string;
  returnDate: string;
  passengers: number;
  promoCode: string;
  passengerName: string;
  email: string;
  phone: string;
}

export default function FlightDemo() {
  const { t, language } = useTranslation();
  const [isReady, setIsReady] = useState(false);
  const [tripType, setTripType] = useState<"round" | "oneway">("round");
  const [ticketBooking, setTicketBooking] = useState<BookingForm | null>(null);
  const [boardingPassOpen, setBoardingPassOpen] = useState(false);
  const [form, setForm] = useState<BookingForm>({
    from: "กรุงเทพฯ (DMK)",
    to: "เชียงใหม่ (CNX)",
    departDate: "",
    returnDate: "",
    passengers: 1,
    promoCode: "",
    passengerName: "",
    email: "",
    phone: "",
  });

  // Show page skeleton until first paint completes
  useEffect(() => {
    const id = requestAnimationFrame(() => setIsReady(true));
    try {
      const saved = window.localStorage.getItem("botnoi-air-last-booking");
      if (saved) {
        setTicketBooking(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load last booking:", e);
    }
    return () => cancelAnimationFrame(id);
  }, []);

  const { scrollY } = useScroll();
  const heroParallax = useTransform(scrollY, [0, 400], [0, 150]);

  const getCityLabel = (city: string) => {
    if (language === 'en') {
      const mapping: Record<string, string> = {
        "กรุงเทพฯ (DMK)": "Bangkok (DMK)",
        "เชียงใหม่ (CNX)": "Chiang Mai (CNX)",
        "ภูเก็ต (HKT)": "Phuket (HKT)",
        "หาดใหญ่ (HDY)": "Hat Yai (HDY)",
        "อุดรธานี (UTH)": "Udon Thani (UTH)",
        "อุบลราชธานี (UBP)": "Ubon Ratchathani (UBP)",
        "ขอนแก่น (KKC)": "Khon Kaen (KKC)",
        "สุราษฎร์ธานี (URT)": "Surat Thani (URT)",
        "นครศรีธรรมราช (NST)": "Nakhon Si Thammarat (NST)",
        "เชียงราย (CEI)": "Chiang Rai (CEI)",
      };
      return mapping[city] || city;
    }
    return city;
  };

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.departDate || !form.passengerName || !form.email) {
      toast.error(t('flight.booking_error'));
      return;
    }
    const newBooking = { tripType, ...form };
    saveBooking(newBooking);
    toast.success(t('flight.booking_success'));
    setTicketBooking(newBooking);
    try {
      window.localStorage.setItem("botnoi-air-last-booking", JSON.stringify(newBooking));
    } catch (err) {
      console.error("Failed to save booking:", err);
    }
    setBoardingPassOpen(true);
    setForm({ ...form, passengerName: "", email: "", phone: "", promoCode: "" });
  }

  return (
    <>
      <AnimatePresence>
        {!isReady && <PageSkeleton variant="flight" />}
      </AnimatePresence>
      <div className="flight-theme min-h-screen bg-background relative text-foreground overflow-x-hidden">
        <Toaster position="top-center" richColors />

        {ticketBooking && (
          <TicketModal
            booking={ticketBooking}
            open={boardingPassOpen}
            onClose={() => setBoardingPassOpen(false)}
          />
        )}

        {/* HERO with image background & parallax */}
        <section className="relative isolate overflow-hidden text-white min-h-[500px] flex flex-col justify-between">
          <motion.img
            src={heroBg}
            alt="Flight View Thailand"
            className="absolute inset-0 -z-10 h-[120%] w-full object-cover"
            style={{ y: heroParallax }}
          />
          {/* Dark scrim for text readability */}
          <div className="absolute inset-0 -z-[5] bg-gradient-to-b from-slate-900/60 via-slate-900/30 to-slate-900/70" />

          <header className="relative z-20 bg-white/85 backdrop-blur-md border-b border-slate-200/50">
            <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
              <Link to="/flight-demo" className="flex items-center gap-2.5">
                <img src={botnoiAirLogo} alt="BotnoiAir" className="h-10 w-auto object-contain" />
              </Link>
              <nav className="flex items-center gap-4">
                {ticketBooking && (
                  <button
                    onClick={() => setBoardingPassOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-sky-700 hover:text-sky-900 hover:bg-sky-50 rounded-full transition-all"
                    id="nav-flight-boarding-pass"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/></svg>
                    {t('flight.nav_receipt') || 'Boarding Pass'}
                  </button>
                )}
                <Link to="/flight-demo/admin" className="px-4 py-1.5 rounded-full bg-sky-50 hover:bg-sky-100 transition-all border border-sky-100 text-sky-700 hover:text-sky-800 text-sm font-semibold" id="nav-flight-admin">{t('flight.nav_admin')}</Link>
              </nav>
            </div>
          </header>

          <div className="mx-auto max-w-7xl px-6 pt-12 md:pt-16 pb-40 md:pb-44 w-full relative z-10">
            {/* Dark scrim behind text for readability */}
            <motion.div
              className="max-w-2xl"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="inline-block rounded-full bg-sky-600/80 backdrop-blur-md px-4 py-1.5 text-xs font-bold tracking-wider text-white border border-sky-400/40 uppercase shadow-sm">
                {t('flight.badge')}
              </span>

              <h1 className="mt-4 font-display text-4xl md:text-6xl leading-tight text-white tracking-tight">
                <span className="[-webkit-text-stroke:1px_#555555] [-webkit-text-fill-color:white] text-white block md:inline">
                  {t('flight.hero_title')}
                </span>
                <br />
                <span className="bg-gradient-to-r from-sky-300 to-cyan-200 bg-clip-text text-transparent drop-shadow-lg">
                  {t('flight.hero_title_sub')}
                </span>
              </h1>

              <p
                className="mt-4 text-base md:text-lg text-white max-w-lg leading-relaxed font-medium"
                style={{ textShadow: '0 1px 6px rgba(0,0,0,0.6)' }}
              >
                {t('flight.hero_desc')}
              </p>
            </motion.div>
          </div>
        </section>

        {/* BOOKING FORM */}
        <section id="booking" className="mx-auto max-w-5xl px-6 -mt-24 relative z-10">
          <motion.div
            className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-slate-200/50 p-6 md:p-8 hover:shadow-sky-500/5 transition-shadow duration-300"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
              <h2 className="font-display text-2xl font-extrabold text-slate-900 tracking-tight">{t('flight.form_title')}</h2>
              <div className="flex gap-1.5 bg-slate-100 p-1.5 rounded-full border border-slate-200/50">
                {(["round", "oneway"] as const).map((tType) => (
                  <button
                    key={tType}
                    type="button"
                    onClick={() => setTripType(tType)}
                    className={`px-5 py-2 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${tripType === tType
                      ? "bg-white text-sky-700 shadow-sm border border-slate-200/20"
                      : "text-slate-500 hover:text-slate-800"
                      }`}
                  >
                    {tType === "round" ? t('flight.round_trip') : t('flight.one_way')}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={submit} className="grid md:grid-cols-2 gap-4">
              <Field label={t('flight.from')} htmlFor="fromCity">
                <select
                  id="fromCity"
                  name="fromCity"
                  required
                  value={form.from}
                  onChange={(e) => setForm({ ...form, from: e.target.value })}
                  className="w-full bg-transparent outline-none font-bold text-slate-800 text-sm py-1"
                >
                  {CITIES.map((c) => (
                    <option key={c} value={c} className="bg-white">{getCityLabel(c)}</option>
                  ))}
                </select>
              </Field>

              <Field label={t('flight.to')} htmlFor="toCity">
                <select
                  id="toCity"
                  name="toCity"
                  required
                  value={form.to}
                  onChange={(e) => setForm({ ...form, to: e.target.value })}
                  className="w-full bg-transparent outline-none font-bold text-slate-800 text-sm py-1"
                >
                  {CITIES.map((c) => (
                    <option key={c} value={c} className="bg-white">{getCityLabel(c)}</option>
                  ))}
                </select>
              </Field>

              <Field label={t('flight.depart')} htmlFor="departDate">
                <input
                  type="date"
                  id="departDate"
                  name="departDate"
                  required
                  value={form.departDate}
                  onChange={(e) => setForm({ ...form, departDate: e.target.value })}
                  className="w-full bg-transparent outline-none font-bold text-slate-800 text-sm text-foreground"
                />
              </Field>

              {tripType === "round" ? (
                <Field label={t('flight.return')} htmlFor="returnDate">
                  <input
                    type="date"
                    id="returnDate"
                    name="returnDate"
                    required
                    value={form.returnDate}
                    onChange={(e) => setForm({ ...form, returnDate: e.target.value })}
                    className="w-full bg-transparent outline-none font-bold text-slate-800 text-sm text-foreground"
                  />
                </Field>
              ) : (
                <div className="hidden md:block"></div>
              )}

              <Field label={t('flight.passengers')} htmlFor="passengers">
                <input
                  type="number"
                  id="passengers"
                  name="passengers"
                  min={1}
                  max={9}
                  value={form.passengers}
                  onChange={(e) => setForm({ ...form, passengers: +e.target.value })}
                  className="w-full bg-transparent outline-none font-bold text-slate-800 text-sm text-foreground"
                />
              </Field>

              <Field label={t('flight.promo')} htmlFor="promoCode">
                <input
                  id="promoCode"
                  name="promoCode"
                  value={form.promoCode}
                  onChange={(e) => setForm({ ...form, promoCode: e.target.value })}
                  className="w-full bg-transparent outline-none font-bold text-slate-800 text-sm text-foreground"
                  placeholder={language === 'en' ? "e.g., PROMO2026" : "เช่น PROMO2026"}
                />
              </Field>

              <div className="md:col-span-2 mt-4 pt-6 border-t border-slate-100">
                <h3 className="font-display text-lg font-bold mb-4 text-slate-800">{t('flight.modal_passenger')}</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <Field label={t('flight.passenger_name')} htmlFor="passengerName">
                    <input
                      id="passengerName"
                      name="passengerName"
                      required
                      value={form.passengerName}
                      onChange={(e) => setForm({ ...form, passengerName: e.target.value })}
                      className="w-full bg-transparent outline-none font-bold text-slate-800 text-sm text-foreground"
                      placeholder={t('flight.passenger_name_placeholder')}
                    />
                  </Field>
                  <Field label={t('flight.email')} htmlFor="email">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full bg-transparent outline-none font-bold text-slate-800 text-sm text-foreground"
                      placeholder="you@email.com"
                    />
                  </Field>
                  <Field label={t('flight.phone')} htmlFor="phone">
                    <input
                      id="phone"
                      name="phone"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full bg-transparent outline-none font-bold text-slate-800 text-sm text-foreground"
                      placeholder="08X-XXX-XXXX"
                    />
                  </Field>
                </div>
              </div>

              <div className="md:col-span-2 flex justify-end pt-4">
                <button
                  type="submit"
                  id="submit-flight-booking"
                  className="px-10 py-4 rounded-full bg-gradient-to-r from-sky-600 to-indigo-600 text-white font-display font-bold text-sm shadow-md hover:from-sky-500 hover:to-indigo-500 hover:shadow-lg active:scale-98 transition-all cursor-pointer"
                >
                  {t('flight.submit')}
                </button>
              </div>
            </form>
          </motion.div>
        </section>

        {/* PROMOTIONS */}
        <section id="promo" className="mx-auto max-w-5xl px-6 py-24">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-xs font-bold text-sky-600 uppercase tracking-widest">{t('flight.promo_heading')}</p>
              <h2 className="font-display text-3xl font-extrabold mt-1.5 text-slate-900 tracking-tight">{t('flight.promo_subheading')}</h2>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { t: language === 'en' ? "Bangkok → Chiang Mai" : "กรุงเทพฯ → เชียงใหม่", p: "690", img: promoChiangmai, label: t('flight.card_chiangmai'), desc: t('flight.card_chiangmai_desc') },
              { t: language === 'en' ? "Bangkok → Phuket" : "กรุงเทพฯ → ภูเก็ต", p: "890", img: promoPhuket, label: t('flight.card_phuket'), desc: t('flight.card_phuket_desc') },
              { t: language === 'en' ? "Bangkok → Hat Yai" : "กรุงเทพฯ → หาดใหญ่", p: "990", img: promoHatyai, label: t('flight.card_hatyai'), desc: t('flight.card_hatyai_desc') },
            ].map((x, index) => (
              <motion.article
                key={x.t}
                className="group relative overflow-hidden rounded-3xl aspect-[4/5] cursor-pointer border border-slate-200/50 shadow-md"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ y: -6, scale: 1.05 }}
              >
                <SkeletonImage
                  src={x.img}
                  alt={x.label}
                  wrapperClassName="absolute inset-0"
                  loading="lazy"
                  className="transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                <div className="absolute inset-0 p-6 flex flex-col justify-end text-white z-10 text-left">
                  <p className="text-[10px] font-bold tracking-widest uppercase opacity-75">{x.label}</p>
                  <p className="mt-1.5 font-display text-xl font-bold tracking-tight">{x.t}</p>
                  <p className="mt-2 text-xs text-white/70 line-clamp-2 leading-relaxed">{x.desc}</p>
                  <div className="mt-4 flex items-end justify-between">
                    <div>
                      <p className="text-[10px] opacity-75">{t('flight.starting_price')}</p>
                      <p className="font-display text-2xl font-black text-white">฿{x.p}</p>
                    </div>
                    <span className="rounded-full bg-white/20 backdrop-blur-md px-4 py-2 text-xs font-bold text-white border border-white/10 group-hover:bg-white/30 transition-colors">
                      {t('flight.details')}
                    </span>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </section>


        {/* SPECIAL SERVICES */}
        <section className="bg-gradient-to-b from-sky-50/40 to-indigo-50/40 border-y border-slate-100 py-20 relative z-10 text-left">
          <div className="mx-auto max-w-5xl px-6">
            <div className="text-center max-w-xl mx-auto mb-16">
              <h2 className="font-display text-3xl font-extrabold text-slate-900 tracking-tight">{t('flight.about_heading')}</h2>
              <p className="text-sm text-slate-500 mt-3">{t('flight.about_subheading')}</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/40 shadow-sm hover:shadow-md hover:border-sky-500/20 transition-all duration-300">
                <h4 className="font-display font-bold text-slate-900 mb-2">{t('flight.service1_title')}</h4>
                <p className="text-xs text-slate-500 leading-relaxed">{t('flight.service1_desc')}</p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/40 shadow-sm hover:shadow-md hover:border-sky-500/20 transition-all duration-300">
                <h4 className="font-display font-bold text-slate-900 mb-2">{t('flight.service2_title')}</h4>
                <p className="text-xs text-slate-500 leading-relaxed">{t('flight.service2_desc')}</p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/40 shadow-sm hover:shadow-md hover:border-sky-500/20 transition-all duration-300">
                <h4 className="font-display font-bold text-slate-900 mb-2">{t('flight.service3_title')}</h4>
                <p className="text-xs text-slate-500 leading-relaxed">{t('flight.service3_desc')}</p>
              </div>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer id="info" className="bg-slate-900 text-slate-400 py-16 border-t border-slate-800">
          <div className="mx-auto max-w-5xl px-6 grid md:grid-cols-3 gap-10 text-left">
            <div>
              <p className="font-display text-xl font-black text-white tracking-tight">BotnoiAir</p>
              <p className="text-xs opacity-75 mt-3 leading-relaxed">
                {t('flight.hero_desc')}
              </p>
            </div>
            <div>
              <p className="font-display font-bold mb-3 text-white text-sm">Services</p>
              <ul className="text-xs opacity-75 space-y-2.5">
                <li>{t('flight.nav_booking')}</li>
                <li>{t('flight.service1_title')}</li>
                <li>{t('flight.service2_title')}</li>
              </ul>
            </div>
            <div>
              <p className="font-display font-bold mb-3 text-white text-sm">Contact Us</p>
              <ul className="text-xs opacity-75 space-y-2.5">
                <li>Tel. 1318 (24 Hours)</li>
                <li>support@botnoiair.example</li>
              </ul>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

function Field({ label, htmlFor, children }: { label: string; htmlFor?: string; children: React.ReactNode }) {
  return (
    <div className="block rounded-2xl bg-slate-50/60 px-4 py-3.5 border border-slate-200/60 transition-all focus-within:border-sky-500 focus-within:bg-white focus-within:shadow-md focus-within:ring-2 focus-within:ring-sky-500/10">
      <label htmlFor={htmlFor} className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block cursor-pointer">{label}</label>
      <div className="mt-1">{children}</div>
    </div>
  );
}

function TicketModal({ booking, open, onClose }: { booking: any, open: boolean, onClose: () => void }) {
  const { t, language } = useTranslation();
  if (!booking) return null;

  const getCode = (city: string) => city.match(/\(([A-Z]{3})\)/)?.[1] || "N/A";
  const getCleanCity = (city: string) => {
    if (language === 'en') {
      const mapping: Record<string, string> = {
        "กรุงเทพฯ (DMK)": "Bangkok",
        "เชียงใหม่ (CNX)": "Chiang Mai",
        "ภูเก็ต (HKT)": "Phuket",
        "หาดใหญ่ (HDY)": "Hat Yai",
        "อุดรธานี (UTH)": "Udon Thani",
        "อุบลราชธานี (UBP)": "Ubon Ratchathani",
        "ขอนแก่น (KKC)": "Khon Kaen",
        "สุราษฎร์ธานี (URT)": "Surat Thani",
        "นครศรีธรรมราช (NST)": "Nakhon Si Thammarat",
        "เชียงราย (CEI)": "Chiang Rai",
      };
      return mapping[city] || city.split('(')[0].trim();
    }
    return city.split('(')[0].trim();
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto overflow-x-hidden rounded-3xl sm:rounded-3xl border-slate-200 p-0 sm:max-w-md text-slate-800">
        <div className="ticket-paper relative">
          <div className="bg-sky-600 text-white p-6 flex justify-between items-center rounded-t-3xl">
            <div className="font-display font-black text-2xl tracking-tight">BotnoiAir</div>
            <div className="text-xs font-bold uppercase tracking-widest opacity-80">Boarding Pass</div>
          </div>

          <div className="p-8 pb-10 relative">
            {/* Ticket cutouts */}
            <div className="absolute top-1/2 -left-3 -translate-y-1/2 w-6 h-6 bg-black/80 rounded-full z-10"></div>
            <div className="absolute top-1/2 -right-3 -translate-y-1/2 w-6 h-6 bg-black/80 rounded-full z-10"></div>

            <div className="flex justify-between items-center mb-8 relative z-10">
              <div className="text-center w-24">
                <div className="text-3xl font-black font-display text-sky-600 tracking-tight">{getCode(booking.from)}</div>
                <div className="text-[10px] text-slate-500 mt-1 truncate px-1">{getCleanCity(booking.from)}</div>
              </div>

              <div className="flex-1 flex flex-col items-center px-2 relative">
                <div className="w-full h-px border-t border-dashed border-slate-200 absolute top-1/2 -translate-y-1/2"></div>
                <div className="bg-white px-2 relative z-10 text-sky-600">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.2-1.1.6L3 8l6 3-3 3-3-1-2 1 4 4 1-2-1-3 3-3 3 6 1.2-.7a1.04 1.04 0 0 0 .6-1.1z" /></svg>
                </div>
              </div>

              <div className="text-center w-24">
                <div className="text-3xl font-black font-display text-sky-600 tracking-tight">{getCode(booking.to)}</div>
                <div className="text-[10px] text-slate-500 mt-1 truncate px-1">{getCleanCity(booking.to)}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-y-6 gap-x-4 mb-8 text-left">
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-bold mb-0.5">{t('flight.modal_passenger')}</p>
                <p className="font-bold text-sm truncate text-slate-800">{booking.passengerName}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-bold mb-0.5">Flight</p>
                <p className="font-bold text-sm text-slate-800">SN{Math.floor(Math.random() * 899 + 100)}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-bold mb-0.5">{t('flight.modal_depart')}</p>
                <p className="font-bold text-sm text-slate-800">{booking.departDate}</p>
              </div>
              {booking.tripType === "round" && booking.returnDate && (
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold mb-0.5">{t('flight.modal_return')}</p>
                  <p className="font-bold text-sm text-slate-800">{booking.returnDate}</p>
                </div>
              )}
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-bold mb-0.5">{t('flight.modal_passengers_num')}</p>
                <p className="font-bold text-sm text-slate-800">{booking.passengers}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-bold mb-0.5">{t('flight.modal_seat')}</p>
                <p className="font-bold text-sm text-slate-800">{booking.seat || `${Math.floor(Math.random() * 30 + 1)}${['A', 'B', 'C', 'D', 'E', 'F'][Math.floor(Math.random() * 6)]}`}</p>
              </div>
            </div>

            <div className="flex justify-center mt-6 pt-6 border-t border-dashed border-slate-200 opacity-60">
              <div className="h-10 w-full max-w-[280px]" style={{ background: "repeating-linear-gradient(95deg, #334155, #334155 2px, transparent 2px, transparent 4px, #334155 4px, #334155 6px, transparent 6px, transparent 10px, #334155 10px, #334155 14px, transparent 14px, transparent 16px)" }}></div>
            </div>
          </div>

          <div className="p-4 bg-slate-50 border-t border-slate-100 text-center rounded-b-3xl">
            <button onClick={onClose} id="confirm-ticket-modal" className="px-6 py-2 bg-slate-900 text-white font-bold text-xs rounded-full shadow-sm hover:scale-105 active:scale-98 transition-all cursor-pointer">
              {t('flight.modal_close')}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
