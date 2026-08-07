'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Globe, Menu, X, ChevronRight,
  ChevronDown, 
 HelpCircle, Play, FileText, Briefcase, LayoutGrid, Users, FlyoutMenu, Check, Mail, Megaphone, Search, UserRoundCog, Bot, TrendingUp, MonitorSmartphone, Video, 
 ChevronsDown,
 ChevronsRight} from 'lucide-react';
import { useTranslation } from '@/lib/language-context';
import './Navbar.css';
import { div } from 'framer-motion/client';

const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
];

const Navbar = () => {
  const [openFlyout, setOpenFlyout] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null); // 'services' | 'more' | 'lang'
  const pathname = usePathname();
  const navRef = useRef(null);

  const { lang, changeLanguage, t } = useTranslation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 30);
    const handleClickOutside = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setActiveDropdown(null);
        setOpenFlyout(null);
      }
    };
    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (pathname === '/login' || pathname.startsWith('/dashboard') || pathname === '/signup') return null;

  const servicesItems = [
    { href: '/marketing/paid-ads', icon: Megaphone, title: 'Paid Ads & AI Marketing', desc: 'Automated campaigns that maximize ROI across every channel.' },
    // AI Dropdown
     { href:'#', flyout: true,   icon: LayoutGrid, title: 'AI Solutions', desc: 'Custom AI integrations that streamline operations.', children: [
       { href: '/ai/seo', icon: Search, title: 'AI-Driven SEO', desc: 'Strategy-driven campaigns that amplify authority and awareness.' },
    { href: '/lead-automation', icon: UserRoundCog, title: 'CRM & Lead Automation', desc: 'Custom AI integrations that streamline operations.' },
    { href: '/ai/agents-chatbots', icon: Bot, title: 'AI Voice Agents & Chatbots', desc: 'Custom AI integrations that streamline operations.' },
     { href: '/ai/video-content', icon:Video, title: 'AI Video Content', desc: 'Custom AI integrations that streamline operations.' },
     ]},
      { href: '/growth-consulting', icon: TrendingUp, title: 'Growth Consulting', desc: 'Custom AI integrations that streamline operations.' },
       { href: '/web-design', icon: MonitorSmartphone, title: 'Web Design', desc: 'Custom AI integrations that streamline operations.' },
  ];
const aiItems = [
  
]
  const moreItems = [
    { href: '/contact', icon: Mail, title: t('nav.contact', 'Contact Us'), desc: 'Get in touch with our Lagos growth team.' },
    { href: '/demo', icon: Play, title: t('nav.demo', 'Demo'), desc: 'See Buzzap AI systems live in action.' },
    { href: '/faq', icon: HelpCircle, title: t('nav.faq', 'FAQ'), desc: 'Frequently asked questions answered.' },
    { href: '/terms', icon: FileText, title: t('nav.terms', 'Terms & Conditions'), desc: 'Our policies and legal agreements.' },
  ];

  return (
    <>
      <nav className={`navbar-container ${isScrolled ? 'scrolled' : ''}`} ref={navRef}>
        <div className="navbar-wrapper">

          {/* Brand Logo + Name */}
          <div className="navbar-left">
            <Link href="/" className="navbar-brand">
              <Image src="/logo.png" alt="Buzzap" className="logo-img" width={120} height={30} style={{ height: 30, width: 'auto' }} />
              <span className="brand-name">Buzzap</span>
            </Link>
          </div>

          {/* Center Nav Links */}
          <div className="navbar-center">
            <Link href="/" className={`nav-link ${pathname === '/' ? 'active' : ''}`}>{t('nav.home', 'Home')}</Link>
           

            {/* Services Dropdown */}
            <div
              className="nav-dropdown-wrapper"
              onMouseEnter={() => setActiveDropdown('services')}
              onMouseLeave={() => {
                setActiveDropdown(null);
                setOpenFlyout(null);
              }}
            >
              <button className={`nav-link dropdown-toggle ${activeDropdown === 'services' ? 'active' : ''}`}>
                {t('nav.services', 'Services')} <ChevronDown size={14} className={`chevron-icon ${activeDropdown === 'services' ? 'rotated' : ''}`} />
              </button>
              <AnimatePresence>
                {activeDropdown === 'services' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.18, ease: 'easeOut' }}
                    className="nav-mega-dropdown"
                  >
                    {servicesItems.map((item) => {
                      const Icon = item.icon;
                      if (item.flyout) {
                        const isOpen = openFlyout === item.title;

                        return (
                          <div
                            key={item.title}
                            className="flyout-item"
                            onMouseEnter={() => setOpenFlyout(item.title)}
                            onMouseLeave={() => setOpenFlyout((current) => current === item.title ? null : current)}
                          >
                            <button
                              className="btn"
                              onClick={(e) => {
                                e.preventDefault();
                                setOpenFlyout((current) => current === item.title ? null : item.title);
                              }}
                            >
                              <div className="dropdown-icon-box"><Icon size={18} /></div>
                              <div><h4>{item.title}</h4><p>{item.desc}</p></div>
                              {isOpen ? <ChevronsRight size={26} /> : <ChevronsDown size={26} />}
                            </button>

                            {isOpen && item.children && (
                              <div className="flyout-dropdown-wrapper" onMouseEnter={() => setOpenFlyout(item.title)} onMouseLeave={() => setOpenFlyout(null)}>
                                <motion.div
                                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                  animate={{ opacity: 1, y: 0, scale: 1 }}
                                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                                  transition={{ duration: 0.18, ease: 'easeOut' }}
                                  className="flyout-dropdown"
                                >
                                  {item.children.map((child) => {
                                    const ChildIcon = child.icon;
                                    return (
                                      <Link key={child.href} href={child.href} className="dropdown-item" onClick={() => setActiveDropdown(null)}>
                                        <div className="dropdown-icon-box"><ChildIcon size={16} /></div>
                                        <div><h4>{child.title}</h4><p>{child.desc}</p></div>
                                      </Link>
                                    );
                                  })}
                                </motion.div>
                              </div>
                            )}
                          </div>
                        );
                      }

                      return (
                        <Link key={item.href} href={item.href} className="dropdown-item" onClick={() => setActiveDropdown(null)}>
                          <div className="dropdown-icon-box"><Icon size={18} /></div>
                          <div><h4>{item.title}</h4><p>{item.desc}</p></div>
                        </Link>
                      );
                    })}
                   
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link href="/why-buzzap" className={`nav-link ${pathname === '/why-buzzap' ? 'active' : ''}`}>{t('nav.whyBuzzap', 'Why Buzzap')}</Link>
            <Link href="/insights" className={`nav-link ${pathname === '/insights' ? 'active' : ''}`}>{t('nav.insights', 'Insights')}</Link>
            <Link href="/case-studies" className={`nav-link ${pathname === '/case-studies' ? 'active' : ''}`}>{t('nav.caseStudies', 'Case Studies')}</Link>
            <Link href="/pricing" className={`nav-link ${pathname === '/pricing' ? 'active' : ''}`}>{t('nav.pricing', 'Pricing')}</Link>
            <Link href="/contact" className={`nav-link ${pathname === '/contact' ? 'active' : ''}`}>{t('nav.contact', 'Contact')}</Link>

            {/* More Dropdown */}
            <div
              className="nav-dropdown-wrapper"
              onMouseEnter={() => setActiveDropdown('more')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className={`nav-link dropdown-toggle ${activeDropdown === 'more' ? 'active' : ''}`}>
                {t('nav.more', 'More')} <ChevronDown size={14} className={`chevron-icon ${activeDropdown === 'more' ? 'rotated' : ''}`} />
              </button>
              <AnimatePresence>
                {activeDropdown === 'more' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.18, ease: 'easeOut' }}
                    className="nav-mega-dropdown"
                  >
                    {moreItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link key={item.href} href={item.href} className="dropdown-item" onClick={() => setActiveDropdown(null)}>
                          <div className="dropdown-icon-box"><Icon size={16} /></div>
                          <div><h4>{item.title}</h4><p>{item.desc}</p></div>
                        </Link>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Right Side */}
          <div className="navbar-right">
            {/* Interactive Language Selector Dropdown */}
            <div className="nav-dropdown-wrapper" style={{ position: 'relative' }}>
              <div
                className="lang-selection"
                onClick={() => setActiveDropdown(activeDropdown === 'lang' ? null : 'lang')}
              >
                <Globe size={16} />
                <span className="uppercase-code">{lang}</span>
                <ChevronDown size={12} className={`chevron-icon ${activeDropdown === 'lang' ? 'rotated' : ''}`} />
              </div>

              <AnimatePresence>
                {activeDropdown === 'lang' && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 8px)',
                      right: 0,
                      background: 'rgba(8, 13, 30, 0.95)',
                      border: '1px solid rgba(99, 102, 241, 0.2)',
                      borderRadius: '12px',
                      padding: '6px',
                      minWidth: '130px',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
                      backdropFilter: 'blur(16px)',
                      zIndex: 2100,
                    }}
                  >
                    {languages.map((l) => (
                      <button
                        key={l.code}
                        type="button"
                        onClick={() => {
                          changeLanguage(l.code);
                          setActiveDropdown(null);
                        }}
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '8px 12px',
                          background: lang === l.code ? 'rgba(99, 102, 241, 0.18)' : 'transparent',
                          border: 'none',
                          borderRadius: '8px',
                          color: lang === l.code ? '#fff' : '#cbd5e1',
                          fontSize: '13px',
                          fontWeight: lang === l.code ? '700' : '500',
                          cursor: 'pointer',
                        }}
                      >
                        <span>{l.flag} {l.name}</span>
                        {lang === l.code && <Check size={14} style={{ color: '#818cf8' }} />}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link href="/booking" className="btn-audit">
              <span>{t('nav.getAudit', 'Get Free Audit')}</span>
              <ArrowUpRight size={14} className="audit-arrow" />
            </Link>
          </div>

          {/* Mobile Toggle */}
          <div className="mobile-toggle" onClick={() => setMobileMenu(!mobileMenu)}>
            {mobileMenu ? <X size={24} /> : <Menu size={24} />}
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenu && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="mobile-menu"
          >
            <div className="mobile-menu-links">
              <Link href="/" onClick={() => setMobileMenu(false)}>{t('nav.home', 'Home')}</Link>
              <Link href="/services" onClick={() => setMobileMenu(false)}>{t('nav.services', 'Services')}</Link>
              <Link href="/why-buzzap" onClick={() => setMobileMenu(false)}>{t('nav.whyBuzzap', 'Why Buzzap')}</Link>
              <Link href="/insights" onClick={() => setMobileMenu(false)}>{t('nav.insights', 'Insights')}</Link>
              <Link href="/case-studies" onClick={() => setMobileMenu(false)}>{t('nav.caseStudies', 'Case Studies')}</Link>
              <Link href="/pricing" onClick={() => setMobileMenu(false)}>{t('nav.pricing', 'Pricing')}</Link>
              <Link href="/contact" onClick={() => setMobileMenu(false)}>{t('nav.contact', 'Contact')}</Link>
              <Link href="/demo" onClick={() => setMobileMenu(false)}>{t('nav.demo', 'Demo')}</Link>
              <Link href="/faq" onClick={() => setMobileMenu(false)}>{t('nav.faq', 'FAQ')}</Link>

              {/* Mobile Language Selector */}
              <div style={{ marginTop: '10px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '8px' }}>Select Language</span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {languages.map((l) => (
                    <button
                      key={l.code}
                      type="button"
                      onClick={() => changeLanguage(l.code)}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '8px',
                        border: '1px solid rgba(255,255,255,0.1)',
                        background: lang === l.code ? 'rgba(99, 102, 241, 0.25)' : 'rgba(255,255,255,0.03)',
                        color: lang === l.code ? '#fff' : '#94a3b8',
                        fontSize: '12px',
                        fontWeight: '600',
                        cursor: 'pointer',
                      }}
                    >
                      {l.flag} {l.code.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button className="mobile-btn" onClick={() => setMobileMenu(false)}>
              <Link href="/booking">{t('nav.getAudit', 'Get Free Audit')}</Link>
              <ArrowUpRight size={18} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;

