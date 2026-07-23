import { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { useTranslation } from '../lib/LanguageContext';
import logoNewLightBlue from '../assets/logo-new-light-blue-02.png';
import textLogoNew from '../assets/Asset-5-8.png';
import { pagesConfig } from '../config/pages';

const FlightIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '16px', height: '16px' }}>
    <path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3.5c-.5-.5-2.5 0-4 1.5L13.5 8.5 5.3 6.7 3.5 8.5l7.3 3.6-3.6 3.6-3.6-1.8L2 15.4l3.5 1.5 1.5 3.5 1.5-1.5-1.8-3.6 3.6-3.6 3.6 7.3z" />
  </svg>
);

const HouseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '16px', height: '16px' }}>
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
    <polyline points="9 22 9 12 15 12 15 22"></polyline>
  </svg>
);

const ITStoreIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '16px', height: '16px' }}>
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
    <line x1="8" y1="21" x2="16" y2="21"></line>
    <line x1="12" y1="17" x2="12" y2="21"></line>
  </svg>
);

export default function AppNavbar() {
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { language, setLanguage, t } = useTranslation();

  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [mobileLangMenuOpen, setMobileLangMenuOpen] = useState(false);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileDemosOpen, setMobileDemosOpen] = useState(false);
  const dropdownRef = useRef<HTMLLIElement>(null);

  const supportedLanguages = [
    { code: 'en', label: 'EN', flagCode: 'us', native: 'English' },
    { code: 'th', label: 'TH', flagCode: 'th', native: 'ไทย' },
    { code: 'zh', label: 'ZH', flagCode: 'cn', native: '中文' },
    { code: 'ja', label: 'JA', flagCode: 'jp', native: '日本語' },
    { code: 'ko', label: 'KO', flagCode: 'kr', native: '한국어' },
    { code: 'es', label: 'ES', flagCode: 'es', native: 'Español' },
    { code: 'fr', label: 'FR', flagCode: 'fr', native: 'Français' },
  ] as const;

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const mainNavPages = pagesConfig.filter(p => p.enabled && !['flight', 'order', 'itstore'].includes(p.id));
  const demoNavPages = pagesConfig.filter(p => p.enabled && ['flight', 'order', 'itstore'].includes(p.id));
  const isDemoActive = demoNavPages.some(page => isActive(page.path));

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  useEffect(() => {
    const handleFocusIn = (e: FocusEvent) => {
      if (dropdownRef.current?.contains(e.target as Node)) {
        setDropdownOpen(true);
      }
    };
    document.addEventListener('focusin', handleFocusIn);
    return () => document.removeEventListener('focusin', handleFocusIn);
  }, []);

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
            {mainNavPages.map((page, index) => {
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

            {/* Demos Dropdown */}
            {demoNavPages.length > 0 && (
              <motion.li
                ref={dropdownRef}
                className="nav-item dropdown-wrapper"
                onMouseEnter={() => setDropdownOpen(true)}
                onMouseLeave={() => setDropdownOpen(false)}
                custom={mainNavPages.length}
                variants={navItemVariants}
                initial="initial"
                animate="animate"
              >
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  aria-expanded={dropdownOpen}
                  className={`dropdown-btn ${isDemoActive ? 'active-dropdown' : ''} ${dropdownOpen ? 'dropdown-open' : ''}`}
                >
                  <span>{t('nav.all_demos')}</span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                  {isDemoActive && (
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
                </button>

                <motion.div
                  className="dropdown-overlay"
                  initial="closed"
                  animate={dropdownOpen ? "open" : "closed"}
                  variants={{
                    open: {
                      opacity: 1,
                      y: 0,
                      scale: 1,
                      pointerEvents: 'auto',
                      transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] }
                    },
                    closed: {
                      opacity: 0,
                      y: 8,
                      scale: 0.95,
                      pointerEvents: 'none',
                      transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] }
                    }
                  }}
                >
                  {demoNavPages.map((page) => {
                    const path = page.path;
                    const id = `nav-${page.id}`;
                    const key = page.key as any;
                    const descKey = `${page.key}_desc` as any;
                    const active = isActive(path);

                    let itemIcon = <ITStoreIcon />;
                    if (page.id === 'flight') itemIcon = <FlightIcon />;
                    else if (page.id === 'order') itemIcon = <HouseIcon />;

                    return (
                      <Link
                        key={path}
                        to={path}
                        id={id}
                        onClick={() => {
                          window.scrollTo(0, 0);
                          setDropdownOpen(false);
                        }}
                        className="dropdown-item"
                        style={active ? { color: 'var(--primary)', background: 'rgba(99, 102, 241, 0.04)' } : undefined}
                      >
                        <div className="dropdown-item-icon">
                          {itemIcon}
                        </div>
                        <div className="dropdown-item-content">
                          <span className="dropdown-item-title">{t(key)}</span>
                          <span className="dropdown-item-desc">{t(descKey)}</span>
                        </div>
                      </Link>
                    );
                  })}
                </motion.div>
              </motion.li>
            )}
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
          <div style={{ position: 'relative', zIndex: 10 }}>
            <button
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                backgroundColor: isSitePage ? 'rgba(28, 25, 23, 0.5)' : 'rgba(244, 244, 245, 0.9)',
                borderRadius: '10px',
                padding: '0.4rem 0.8rem',
                border: `1px solid ${isSitePage ? 'rgba(244, 63, 94, 0.2)' : 'rgba(228, 228, 231, 0.8)'}`,
                cursor: 'pointer',
                fontSize: '0.75rem',
                fontWeight: '700',
                color: isSitePage ? '#FFFFFF' : 'var(--primary)',
                transition: 'all 0.2s',
              }}
              id="lang-dropdown-trigger"
            >
              <img
                src={`https://flagcdn.com/w40/${supportedLanguages.find(l => l.code === language)?.flagCode || 'us'}.png`}
                alt={language}
                style={{
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '1px solid rgba(0,0,0,0.08)'
                }}
              />
              <span>{language.toUpperCase()}</span>
              <span style={{
                fontSize: '0.6rem',
                opacity: 0.7,
                display: 'inline-block',
                transform: langMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s'
              }}>▼</span>
            </button>

            {langMenuOpen && (
              <>
                {/* Backdrop overlay */}
                <div
                  onClick={() => setLangMenuOpen(false)}
                  style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 998,
                    backgroundColor: 'transparent',
                  }}
                />

                {/* Dropdown list */}
                <div
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 0.5rem)',
                    right: 0,
                    backgroundColor: isSitePage ? 'rgba(28, 25, 23, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(12px)',
                    border: `1px solid ${isSitePage ? 'rgba(244, 63, 94, 0.15)' : 'rgba(228, 228, 231, 0.85)'}`,
                    borderRadius: '12px',
                    padding: '0.4rem',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
                    minWidth: '150px',
                    zIndex: 999,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.2rem',
                  }}
                  id="lang-dropdown-menu"
                >
                  {supportedLanguages.map((lang) => {
                    const active = language === lang.code;
                    return (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang.code);
                          setLangMenuOpen(false);
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.75rem',
                          padding: '0.45rem 0.6rem',
                          borderRadius: '8px',
                          border: 'none',
                          backgroundColor: active ? (isSitePage ? 'rgba(239, 68, 68, 0.15)' : 'rgba(99, 102, 241, 0.08)') : 'transparent',
                          color: active ? (isSitePage ? '#FFFFFF' : 'var(--primary)') : (isSitePage ? '#A1A1AA' : 'var(--muted-foreground)'),
                          fontSize: '0.75rem',
                          fontWeight: active ? '700' : '500',
                          textAlign: 'left',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                        }}
                        className={`lang-option-${lang.code}`}
                      >
                        <span style={{ flex: 1 }}>{lang.native}</span>
                        <img
                          src={`https://flagcdn.com/w40/${lang.flagCode}.png`}
                          alt={lang.label}
                          style={{
                            width: '16px',
                            height: '16px',
                            borderRadius: '50%',
                            objectFit: 'cover',
                            border: '1px solid rgba(0,0,0,0.08)'
                          }}
                        />
                      </button>
                    );
                  })}
                </div>
              </>
            )}
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
                <div style={{ position: 'relative', marginRight: '1rem', zIndex: 10 }}>
                  <button
                    onClick={() => setMobileLangMenuOpen(!mobileLangMenuOpen)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      backgroundColor: isSitePage ? 'rgba(28, 25, 23, 0.5)' : 'rgba(244, 244, 245, 0.9)',
                      borderRadius: '10px',
                      padding: '0.4rem 0.8rem',
                      border: `1px solid ${isSitePage ? 'rgba(244, 63, 94, 0.2)' : 'rgba(228, 228, 231, 0.8)'}`,
                      cursor: 'pointer',
                      fontSize: '0.7rem',
                      fontWeight: '700',
                      color: isSitePage ? '#FFFFFF' : 'var(--primary)',
                      transition: 'all 0.2s',
                    }}
                    id="mobile-lang-dropdown-trigger"
                  >
                    <img
                      src={`https://flagcdn.com/w40/${supportedLanguages.find(l => l.code === language)?.flagCode || 'us'}.png`}
                      alt={language}
                      style={{
                        width: '14px',
                        height: '14px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: '1px solid rgba(0,0,0,0.08)'
                      }}
                    />
                    <span>{language.toUpperCase()}</span>
                    <span style={{
                      fontSize: '0.55rem',
                      opacity: 0.7,
                      display: 'inline-block',
                      transform: mobileLangMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s'
                    }}>▼</span>
                  </button>

                  {mobileLangMenuOpen && (
                    <>
                      {/* Backdrop overlay */}
                      <div
                        onClick={() => setMobileLangMenuOpen(false)}
                        style={{
                          position: 'fixed',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          zIndex: 998,
                          backgroundColor: 'transparent',
                        }}
                      />

                      {/* Dropdown list */}
                      <div
                        style={{
                          position: 'absolute',
                          top: 'calc(100% + 0.5rem)',
                          right: 0,
                          backgroundColor: isSitePage ? 'rgba(28, 25, 23, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                          backdropFilter: 'blur(12px)',
                          border: `1px solid ${isSitePage ? 'rgba(244, 63, 94, 0.15)' : 'rgba(228, 228, 231, 0.85)'}`,
                          borderRadius: '12px',
                          padding: '0.4rem',
                          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
                          minWidth: '140px',
                          zIndex: 999,
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.2rem',
                        }}
                        id="mobile-lang-dropdown-menu"
                      >
                        {supportedLanguages.map((lang) => {
                          const active = language === lang.code;
                          return (
                            <button
                              key={lang.code}
                              onClick={() => {
                                setLanguage(lang.code);
                                setMobileLangMenuOpen(false);
                              }}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                padding: '0.4rem 0.5rem',
                                borderRadius: '8px',
                                border: 'none',
                                backgroundColor: active ? (isSitePage ? 'rgba(239, 68, 68, 0.15)' : 'rgba(99, 102, 241, 0.08)') : 'transparent',
                                color: active ? (isSitePage ? '#FFFFFF' : 'var(--primary)') : (isSitePage ? '#A1A1AA' : 'var(--muted-foreground)'),
                                fontSize: '0.7rem',
                                fontWeight: active ? '700' : '500',
                                textAlign: 'left',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                              }}
                            >
                              <span style={{ flex: 1 }}>{lang.native}</span>
                              <img
                                src={`https://flagcdn.com/w40/${lang.flagCode}.png`}
                                alt={lang.label}
                                style={{
                                  width: '14px',
                                  height: '14px',
                                  borderRadius: '50%',
                                  objectFit: 'cover',
                                  border: '1px solid rgba(0,0,0,0.08)'
                                }}
                              />
                            </button>
                          );
                        })}
                      </div>
                    </>
                  )}
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
                  {mainNavPages.map((page) => {
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

                  {/* Collapsible Demos in Mobile Drawer */}
                  {demoNavPages.length > 0 && (
                    <li className="mobile-nav-item">
                      <button
                        onClick={() => setMobileDemosOpen(!mobileDemosOpen)}
                        className={`mobile-nav-submenu-trigger ${isDemoActive ? 'active-submenu' : ''}`}
                        aria-expanded={mobileDemosOpen}
                      >
                        <span>{t('nav.all_demos')}</span>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: mobileDemosOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
                          <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                      </button>

                      <AnimatePresence>
                        {mobileDemosOpen && (
                          <motion.ul
                            className="mobile-submenu-list"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25, ease: 'easeInOut' }}
                            style={{ overflow: 'hidden' }}
                          >
                            {demoNavPages.map((page) => {
                              const path = page.path;
                              const id = `mobile-nav-${page.id}`;
                              const key = page.key as any;
                              const active = isActive(path);
                              return (
                                <li
                                  key={path}
                                  className={`mobile-submenu-item ${active ? 'active-link' : ''}`}
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
                          </motion.ul>
                        )}
                      </AnimatePresence>
                    </li>
                  )}
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
