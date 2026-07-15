import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Sparkles, ShoppingBag, ChefHat, Settings, Eye, X } from "lucide-react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { supabase } from "../lib/supabase";
import { LanguageProvider } from "../lib/i18n";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "LINE LIFF Food Delivery" },
      { name: "description", content: "A mobile-first food delivery app for LINE LIFF with customer, staff, and admin order workflows." },
      { name: "author", content: "Lovable" },
      { property: "og:title", content: "LINE LIFF Food Delivery" },
      { property: "og:description", content: "A mobile-first food delivery app for LINE LIFF with customer, staff, and admin order workflows." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:site", content: "@Lovable" },
      { name: "twitter:title", content: "LINE LIFF Food Delivery" },
      { name: "twitter:description", content: "A mobile-first food delivery app for LINE LIFF with customer, staff, and admin order workflows." },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Prompt:wght@300;400;500;600;700;800&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const [hasMounted, setHasMounted] = useState(false);
  const [demoPanelOpen, setDemoPanelOpen] = useState(false);

  const routerState = useRouterState();

  useEffect(() => {
    setHasMounted(true);
  }, []);

  // 🚀 Background Silent Auth Setup
  useEffect(() => {
    async function ensureDemoSession() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          console.log("[Demo Auth] No session found. Attempting silent sign-in...");
          const { data, error } = await supabase.auth.signInWithPassword({
            email: "demo@demo.com",
            password: "demo123456",
          });

          if (error) {
            console.log("[Demo Auth] Sign-in failed. Attempting to register demo account...", error.message);
            // Sign up if not exists
            const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
              email: "demo@demo.com",
              password: "demo123456",
              options: {
                data: {
                  full_name: "Demo Manager",
                  display_name: "Demo Manager",
                  role: "admin",
                },
              },
            });

            if (signUpError) {
              console.error("[Demo Auth] Failed to sign up demo account:", signUpError.message);
              return;
            }

            if (signUpData?.user) {
              console.log("[Demo Auth] Sign-up successful. Syncing profile to database users table...");
              const client = supabase as any;
              const now = new Date().toISOString();
              const { error: upsertError } = await client.from("users").upsert({
                auth_user_id: signUpData.user.id,
                display_name: "Demo Manager",
                email: "demo@demo.com",
                role: "admin",
                is_active: true,
                updated_at: now,
                last_login_at: now,
              }, { onConflict: "auth_user_id" });

              if (upsertError) {
                console.error("[Demo Auth] Failed to upsert demo user to database:", upsertError.message);
              }

              // Sign in again
              const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
                email: "demo@demo.com",
                password: "demo123456",
              });

              if (loginError) {
                console.error("[Demo Auth] Failed to sign in after sign-up:", loginError.message);
              } else {
                console.log("[Demo Auth] Silent sign-in completed successfully after registration!");
              }
            }
          } else {
            console.log("[Demo Auth] Silent sign-in completed successfully!");
          }
        } else {
          console.log("[Demo Auth] Existing session active:", session.user.email);
        }
      } catch (err) {
        console.error("[Demo Auth] Unexpected error in ensureDemoSession:", err);
      }
    }
    ensureDemoSession();
  }, []);

  useEffect(() => {
    // 🚀 ทำให้ทั้งเว็บเป็น Real-Time: คอยดักจับการเปลี่ยนแปลงของทุกตารางในฐานข้อมูล
    const channel = supabase
      .channel("global-db-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public" },
        (payload: any) => {
          console.log("🔄 Database Changed:", payload);
          // ทันทีที่มีอะไรเปลี่ยน ให้ดึงข้อมูลใหม่ทั้งหมด (ทำให้ UI อัปเดตทันที)
          queryClient.invalidateQueries();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const isNavigating = hasMounted && routerState.status === "pending";

  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        {/* Top Progress Bar when navigating */}
        <AnimatePresence>
          {isNavigating && (
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed top-0 left-0 right-0 h-1 z-[9999] bg-[#fcc14a] origin-left"
            />
          )}
        </AnimatePresence>

        <div className="min-h-screen w-full pb-16">
          {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
          <Outlet />
        </div>

        {/* Global Demo Switcher Panel */}
        <DemoSwitcher
          open={demoPanelOpen}
          onClose={() => setDemoPanelOpen(false)}
          onOpen={() => setDemoPanelOpen(true)}
        />
      </LanguageProvider>
    </QueryClientProvider>
  );
}

// ── Demo Switcher Component ───────────────────────────────────
function DemoSwitcher({
  open,
  onOpen,
  onClose,
}: {
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
}) {
  const state = useRouterState();
  const currentPath = state.location.pathname;

  const roles = [
    {
      id: "customer",
      name: "ลูกค้า (Customer)",
      desc: "หน้าจอสั่งอาหารสำหรับลูกค้าจำลอง",
      icon: ShoppingBag,
      path: "/customer",
      color: "#fcc14a",
      action: () => {
        localStorage.setItem("ran-lung-get-guest", "true");
        localStorage.removeItem("ran-lung-get-admin-demo");
      },
    },
    {
      id: "staff",
      name: "พนักงาน (Staff)",
      desc: "หน้าจอจัดการออเดอร์และโต๊ะอาหาร",
      icon: Eye,
      path: "/staff",
      color: "#3b82f6",
      action: () => {
        localStorage.removeItem("ran-lung-get-guest");
        localStorage.removeItem("ran-lung-get-admin-demo");
      },
    },
    {
      id: "kitchen",
      name: "ห้องครัว (Kitchen)",
      desc: "หน้าจอลำดับออเดอร์สำหรับเชฟ",
      icon: ChefHat,
      path: "/kitchen",
      color: "#10b981",
      action: () => {
        localStorage.removeItem("ran-lung-get-guest");
        localStorage.removeItem("ran-lung-get-admin-demo");
      },
    },
    {
      id: "admin",
      name: "แอดมิน (Admin Dashboard)",
      desc: "หน้าแดชบอร์ดจัดการร้าน คลัง และรายได้",
      icon: Settings,
      path: "/admin",
      color: "#ec4899",
      action: () => {
        localStorage.setItem("ran-lung-get-admin-demo", "true");
        localStorage.removeItem("ran-lung-get-guest");
      },
    },
  ];

  const handleNavigate = (role: typeof roles[0]) => {
    role.action();
    onClose();
    // Ensure full refresh when switching context between roles
    window.location.href = role.path;
  };

  return (
    <>
      {/* Floating Demo Launcher Button */}
      {!open && (
        <motion.button
          onClick={onOpen}
          whileHover={{ scale: 1.08, boxShadow: "0 0 25px rgba(252, 193, 74, 0.45)" }}
          whileTap={{ scale: 0.95 }}
          className="fixed bottom-6 right-6 z-[99999] flex items-center gap-2 rounded-full px-4 py-3 font-bold text-white shadow-lg cursor-pointer transition-all duration-300"
          style={{
            background: "linear-gradient(135deg, #002e47 0%, #004165 100%)",
            border: "2px solid #fcc14a",
            fontFamily: "'Prompt', sans-serif",
          }}
        >
          <Sparkles size={16} className="text-[#fcc14a] animate-pulse" />
          <span className="text-[11px] tracking-wider font-semibold">DEMO PANEL</span>
        </motion.button>
      )}

      {/* Drawer Overlay */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 z-[99998] bg-black cursor-pointer"
            />

            {/* Sliding Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 z-[99999] w-full max-w-sm bg-[#001724]/95 text-white p-6 shadow-2xl flex flex-col justify-between border-l border-white/10"
              style={{
                backdropFilter: "blur(16px)",
                fontFamily: "'Prompt', sans-serif",
              }}
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
                  <div className="flex items-center gap-2">
                    <Sparkles className="text-[#fcc14a]" size={18} />
                    <h2 className="text-md font-bold tracking-wide">Demo Controller</h2>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-1.5 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-pointer"
                  >
                    <X size={18} />
                  </button>
                </div>

                <p className="text-xs text-white/60 mb-6 leading-relaxed">
                  สลับบทบาทของคุณเพื่อทดสอบการทำงานของระบบแบบ Real-Time ข้อมูลทั้งหมดจะเชื่อมโยงถึงกัน
                </p>

                {/* Role Options */}
                <div className="flex flex-col gap-3">
                  {roles.map((role) => {
                    const isActive = currentPath.startsWith(role.path);
                    const Icon = role.icon;
                    return (
                      <button
                        key={role.id}
                        onClick={() => handleNavigate(role)}
                        className="group w-full flex items-start gap-3.5 p-3.5 rounded-2xl border transition-all text-left cursor-pointer"
                        style={{
                          background: isActive ? "rgba(252, 193, 74, 0.08)" : "rgba(255, 255, 255, 0.02)",
                          borderColor: isActive ? "#fcc14a" : "rgba(255, 255, 255, 0.05)",
                          boxShadow: isActive ? "0 4px 15px rgba(252, 193, 74, 0.12)" : "none",
                        }}
                      >
                        <div
                          className="p-2.5 rounded-xl shrink-0"
                          style={{
                            background: isActive ? role.color : "rgba(255, 255, 255, 0.04)",
                            color: isActive ? "#001724" : role.color,
                          }}
                        >
                          <Icon size={18} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3
                            className="font-bold text-xs mb-0.5 group-hover:text-[#fcc14a] transition-colors"
                            style={{ color: isActive ? "#fcc14a" : "white" }}
                          >
                            {role.name}
                          </h3>
                          <p className="text-[11px] text-white/40 leading-normal">{role.desc}</p>
                        </div>
                        {isActive && (
                          <span className="text-[9px] bg-[#fcc14a] text-[#001724] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider shrink-0 mt-0.5">
                            Active
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Footer info */}
              <div className="border-t border-white/10 pt-4 mt-6">
                <div className="flex items-center gap-2 text-[10px] text-white/40">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>เชื่อมต่อฐานข้อมูล Supabase สำเร็จ (Demo Mode)</span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
