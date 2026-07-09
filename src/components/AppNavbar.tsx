import { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { useTranslation } from '../lib/LanguageContext';
import logoNewLightBlue from '../assets/logo-new-light-blue-02.png';
import textLogoNew from '../assets/Asset-5-8.png';
import { pagesConfig } from '../config/pages';

export default function AppNavbar() {
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { language, setLanguage, t } = useTranslation();

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const openDrawer = () => setDrawerOpen(true);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  /* Close drawer on route change */
  useEffect(() => { closeDrawer(); }, [location, closeDrawer]);

  /* Close drawer on Escape key */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeDrawer(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [closeDrawer]);

  const navRef = useRef<HTMLElement>(null);

  /* Horizontal scroll on mouse wheel hover */
  useEffect(() => {
    const el = navRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (e.deltaY === 0) return;
      e.preventDefault();
      el.scrollLeft += e.deltaY;
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  /* Prevent body scroll when drawer is open */
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [drawerOpen]);

  // Sticky navbar animation on scroll
  const { scrollY } = useScroll();
  const navbarPadding = '0.85rem 3rem';
  const isSitePage = location.pathname === '/nia-site-2026';
  const lightBg = useTransform(scrollY, [0, 50], [
    'rgba(250, 251, 252, 0.55)',
    'rgba(250, 251, 252, 0.88)'
  ]);
  const darkBg = useTransform(scrollY, [0, 50], [
    'rgba(12, 10, 9, 0.55)',
    'rgba(12, 10, 9, 0.85)'
  ]);
  const navbarBg = isSitePage ? darkBg : lightBg;

  const lightBorder = useTransform(scrollY, [0, 50], [
    'rgba(228, 228, 231, 0.25)',
    'rgba(228, 228, 231, 0.55)'
  ]);
  const darkBorder = useTransform(scrollY, [0, 50], [
    'rgba(239, 68, 68, 0.12)',
    'rgba(239, 68, 68, 0.35)'
  ]);
  const navbarBorder = isSitePage ? darkBorder : lightBorder;

  // Animation variants
  const logoVariants = {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } }
  };

  const navItemVariants = {
    initial: { opacity: 0, y: -10 },
    animate: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1] as const
      }
    })
  };

  const drawerVariants = {
    closed: { x: '100%', transition: { type: 'spring' as const, damping: 25, stiffness: 200 } },
    open: { x: 0, transition: { type: 'spring' as const, damping: 25, stiffness: 200 } }
  };

  const overlayVariants = {
    closed: { opacity: 0 },
    open: { opacity: 1 }
  };

  return (
    <>
      <motion.header
        className={`navbar ${isSitePage ? 'site2026-theme' : ''}`}
        style={{
          padding: navbarPadding,
          backgroundColor: navbarBg,
          borderBottomColor: navbarBorder,
          transition: 'none', // Prevent conflict with Framer Motion scroll transform
        }}
      >
        <Link
          to="/"
          onClick={() => window.scrollTo(0, 0)}
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          <motion.div
            className="logo-container"
            style={{ cursor: 'pointer' }}
            variants={logoVariants}
            initial="initial"
            animate="animate"
          >
            <img className="logo-icon" src={logoNewLightBlue} alt="Botnoi Logo" />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span className="logo-text" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                <img src={textLogoNew} alt="Botnoi" style={{ height: '1.25rem', objectFit: 'contain' }} />
                <span>Labs</span>
              </span>
            </div>
          </motion.div>
        </Link>

        {/* Desktop nav */}
        <nav ref={navRef} aria-label="Main Navigation">
          <ul className="nav-links">
            {pagesConfig.filter(p => p.enabled).map((page, index) => {
              const path = page.path;
              const id = `nav-${page.id}`;
              const key = page.key as any;
              const active = isActive(path) && (path !== '/' || location.pathname === '/');
              return (
                <motion.li
                  key={path}
                  className={`nav-item ${active ? 'active-link' : ''}`}
                  custom={index}
                  variants={navItemVariants}
                  initial="initial"
                  animate="animate"
                >
                  <Link to={path} id={id} onClick={() => window.scrollTo(0, 0)}>
                    {t(key)}
                    {active && (
                      <motion.div
                        layoutId="activeTab"
                        className="nav-active-pill"
                        transition={{
                          x: { type: 'spring', stiffness: 380, damping: 30 },
                          width: { type: 'spring', stiffness: 380, damping: 30 },
                          y: { type: 'tween', duration: 0 },
                          height: { type: 'tween', duration: 0 }
                        }}
                      />
                    )}
                  </Link>
                </motion.li>
              );
            })}
          </ul>
        </nav>

        {/* Desktop CTA & Language Switch */}
        <motion.div
          className="navbar-cta"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.25, duration: 0.5 }}
        >
          {/* Language Switch Toggle */}
          <div className="language-toggle" style={{
            display: 'flex',
            gap: '0.25rem',
            backgroundColor: isSitePage ? 'rgba(28, 25, 23, 0.5)' : 'rgba(244, 244, 245, 0.9)',
            borderRadius: '10px',
            padding: '3px',
            border: `1px solid ${isSitePage ? 'rgba(244, 63, 94, 0.2)' : 'rgba(228, 228, 231, 0.8)'}`
          }}>
            <button
              onClick={() => setLanguage('en')}
              style={{
                padding: '0.3rem 0.6rem',
                fontSize: '0.75rem',
                fontWeight: '700',
                borderRadius: '7px',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s',
                backgroundColor: language === 'en' ? (isSitePage ? 'rgba(239, 68, 68, 0.2)' : '#FFFFFF') : 'transparent',
                color: language === 'en' ? (isSitePage ? '#FFFFFF' : 'var(--primary)') : 'var(--muted-foreground)',
                boxShadow: language === 'en' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              }}
              id="lang-toggle-en"
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('th')}
              style={{
                padding: '0.3rem 0.6rem',
                fontSize: '0.75rem',
                fontWeight: '700',
                borderRadius: '7px',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s',
                backgroundColor: language === 'th' ? (isSitePage ? 'rgba(239, 68, 68, 0.2)' : '#FFFFFF') : 'transparent',
                color: language === 'th' ? (isSitePage ? '#FFFFFF' : 'var(--primary)') : 'var(--muted-foreground)',
                boxShadow: language === 'th' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              }}
              id="lang-toggle-th"
            >
              TH
            </button>
          </div>

          <div className="widget-indicator" id="widget-status">
            <span className="widget-dot"></span>
            <span>{t('nav.live')}</span>
          </div>
          <Link
            className="btn btn-primary"
            to="/contact"
            onClick={() => window.scrollTo(0, 0)}
            style={{ padding: '0.45rem 1.25rem', fontSize: '0.8rem', borderRadius: '10px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
            id="nav-cta-button"
          >
            {t('nav.request')}
          </Link>
        </motion.div>

        {/* Hamburger (mobile only) */}
        <button
          className={`hamburger-btn${drawerOpen ? ' open' : ''}`}
          onClick={drawerOpen ? closeDrawer : openDrawer}
          aria-label="Toggle navigation menu"
          aria-expanded={drawerOpen}
          id="hamburger-btn"
        >
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>
      </motion.header>

      {/* Mobile Drawer using AnimatePresence */}
      <AnimatePresence>
        {drawerOpen && (
          <div className="mobile-drawer-portal" id="mobile-drawer">
            {/* Backdrop */}
            <motion.div
              className="mobile-drawer-overlay"
              variants={overlayVariants}
              initial="closed"
              animate="open"
              exit="closed"
              onClick={closeDrawer}
            />

            {/* Panel */}
            <motion.div
              className={`mobile-drawer-panel ${isSitePage ? 'site2026-theme dark bg-zinc-950 text-stone-100 border-l border-rose-500/10' : ''}`}
              variants={drawerVariants}
              initial="closed"
              animate="open"
              exit="closed"
            >
              {/* Drawer header */}
              <div className="mobile-drawer-header">
                <span className="mobile-drawer-logo" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                  <img src={textLogoNew} alt="Botnoi" style={{ height: '1.15rem', objectFit: 'contain' }} />
                  <span>Labs</span>
                </span>
                
                {/* Language Switch Toggle for Mobile */}
                <div className="language-toggle" style={{
                  display: 'flex',
                  gap: '0.25rem',
                  backgroundColor: isSitePage ? 'rgba(28, 25, 23, 0.5)' : 'rgba(244, 244, 245, 0.9)',
                  borderRadius: '10px',
                  padding: '3px',
                  border: `1px solid ${isSitePage ? 'rgba(244, 63, 94, 0.2)' : 'rgba(228, 228, 231, 0.8)'}`,
                  marginRight: '1rem'
                }}>
                  <button
                    onClick={() => setLanguage('en')}
                    style={{
                      padding: '0.25rem 0.5rem',
                      fontSize: '0.7rem',
                      fontWeight: '700',
                      borderRadius: '6px',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      backgroundColor: language === 'en' ? (isSitePage ? 'rgba(239, 68, 68, 0.2)' : '#FFFFFF') : 'transparent',
                      color: language === 'en' ? (isSitePage ? '#FFFFFF' : 'var(--primary)') : 'var(--muted-foreground)',
                      boxShadow: language === 'en' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                    }}
                    id="mobile-lang-toggle-en"
                  >
                    EN
                  </button>
                  <button
                    onClick={() => setLanguage('th')}
                    style={{
                      padding: '0.25rem 0.5rem',
                      fontSize: '0.7rem',
                      fontWeight: '700',
                      borderRadius: '6px',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      backgroundColor: language === 'th' ? (isSitePage ? 'rgba(239, 68, 68, 0.2)' : '#FFFFFF') : 'transparent',
                      color: language === 'th' ? (isSitePage ? '#FFFFFF' : 'var(--primary)') : 'var(--muted-foreground)',
                      boxShadow: language === 'th' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                    }}
                    id="mobile-lang-toggle-th"
                  >
                    TH
                  </button>
                </div>

                <button
                  className="mobile-drawer-close"
                  onClick={closeDrawer}
                  aria-label="Close menu"
                >
                  ✕
                </button>
              </div>

              {/* Nav links */}
              <nav aria-label="Mobile Navigation">
                <ul className="mobile-nav-links">
                  {pagesConfig.filter(p => p.enabled).map((page) => {
                    const path = page.path;
                    const id = `mobile-nav-${page.id}`;
                    const key = page.key as any;
                    const active = isActive(path) && (path !== '/' || location.pathname === '/');
                    return (
                      <li
                        key={path}
                        className={`mobile-nav-item ${active ? 'active-link' : ''}`}
                      >
                        <Link to={path} id={id} onClick={() => {
                          window.scrollTo(0, 0);
                          closeDrawer();
                        }}>
                          {t(key)}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>

              <div className="mobile-nav-divider" />

              {/* CTA in drawer */}
              <div className="mobile-cta-section">
                <div className="mobile-widget-indicator">
                  <span className="widget-dot"></span>
                  <span>{t('nav.live')}</span>
                </div>
                <Link
                  className="btn btn-primary"
                  to="/contact"
                  onClick={() => {
                    window.scrollTo(0, 0);
                    closeDrawer();
                  }}
                  id="mobile-cta-button"
                  style={{ display: 'block', textAlign: 'center' }}
                >
                  {t('nav.request')}
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
