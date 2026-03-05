import { useState, useEffect } from 'react';
import { Bell, Search, PlusCircle, ClipboardList, User, Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '@/assets/logo.png';

const desktopNav = [
  { label: 'Chercher', path: '/search', icon: Search },
  { label: 'Publier', path: '/publish', icon: PlusCircle },
  { label: 'Mes trajets', path: '/my-trips', icon: ClipboardList },
  { label: 'Profil', path: '/profile', icon: User },
];

const Header = () => {
  const { user, profile } = useAuth();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${scrolled
          ? 'glass border-b border-white/5 shadow-[0_8px_32px_-8px_hsl(0_0%_0%/0.4)]'
          : 'bg-transparent border-b border-transparent'
          }`}
      >
        <div className={`container flex items-center justify-between gap-4 transition-all duration-300 ${scrolled ? 'h-14' : 'h-16 md:h-18'}`}>

          {/* Logo */}
          <Link to="/" className="group flex shrink-0 items-center gap-2.5">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-mali shadow-mali transition-transform duration-300 group-hover:scale-105">
              <img src={logo} alt="Blasira" className="h-7 w-7 object-contain" />
            </div>
            <span className="font-display text-xl font-bold text-gradient-mali tracking-tight">
              Blasira
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex flex-1 items-center justify-center gap-1" aria-label="Navigation principale">
            {desktopNav.map(({ label, path, icon: Icon }) => {
              const isActive = location.pathname === path;
              return (
                <Link
                  key={path}
                  to={path}
                  className={`relative flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200 ${isActive
                    ? 'text-primary bg-primary/10'
                    : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                    }`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                  {isActive && (
                    <motion.div
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-xl bg-primary/10 ring-1 ring-primary/20"
                      transition={{ type: 'spring', stiffness: 350, damping: 35 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right actions */}
          <div className="flex shrink-0 items-center gap-2">
            {user ? (
              <>
                <button
                  type="button"
                  aria-label="Notifications"
                  className="relative flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground transition-all hover:text-foreground hover:bg-white/5"
                >
                  <Bell className="h-5 w-5" />
                  <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_6px_hsl(142_71%_45%/0.8)]" />
                </button>
                <Link
                  to="/profile"
                  className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-muted transition-all hover:border-primary/40 hover:shadow-glow-sm"
                >
                  {profile?.avatar_url ? (
                    <img src={profile.avatar_url} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <User className="h-4 w-4 text-muted-foreground" />
                  )}
                </Link>
              </>
            ) : (
              <Link
                to="/auth"
                className="relative inline-flex items-center gap-2 overflow-hidden rounded-xl bg-gradient-mali px-5 py-2.5 text-sm font-semibold text-white shadow-mali transition-all hover:opacity-90 hover:shadow-glow-green active:scale-95"
              >
                <span className="relative z-10">Créer un compte</span>
              </Link>
            )}

            {/* Mobile menu toggle */}
            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground hover:bg-white/5 hover:text-foreground md:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile dropdown menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
            className="fixed left-0 right-0 top-14 z-40 glass border-b border-white/5 px-4 pb-4 pt-2 md:hidden shadow-card"
          >
            <nav className="flex flex-col gap-1">
              {desktopNav.map(({ label, path, icon: Icon }) => {
                const isActive = location.pathname === path;
                return (
                  <Link
                    key={path}
                    to={path}
                    className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'
                      }`}
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </Link>
                );
              })}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
