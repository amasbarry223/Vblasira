import { Home, Search, PlusCircle, ClipboardList, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const navItems = [
  { icon: Home, label: 'Accueil', path: '/' },
  { icon: Search, label: 'Chercher', path: '/search' },
  { icon: PlusCircle, label: 'Publier', path: '/publish', isPrimary: true },
  { icon: ClipboardList, label: 'Trajets', path: '/my-trips' },
  { icon: User, label: 'Profil', path: '/profile' },
];

const BottomNav = () => {
  const location = useLocation();

  return (
    <nav
      aria-label="Navigation mobile"
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
    >
      {/* Glass background */}
      <div className="glass border-t border-white/6 shadow-[0_-8px_32px_-8px_hsl(0_0%_0%/0.5)]">
        <div className="flex items-center justify-around px-2 pb-[env(safe-area-inset-bottom)] pt-1.5">
          {navItems.map(({ icon: Icon, label, path, isPrimary }) => {
            const isActive = location.pathname === path;

            if (isPrimary) {
              return (
                <Link
                  key={path}
                  to={path}
                  className="relative -mt-5 flex flex-col items-center gap-0.5"
                  aria-label={label}
                >
                  <motion.div
                    whileTap={{ scale: 0.9 }}
                    whileHover={{ scale: 1.05 }}
                    className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-mali shadow-mali"
                    style={{ boxShadow: '0 0 24px hsl(142 71% 45% / 0.45), 0 8px 24px -4px hsl(0 0% 0% / 0.5)' }}
                  >
                    <Icon className="h-6 w-6 text-white" />
                  </motion.div>
                  <span className="text-[10px] font-medium text-muted-foreground">{label}</span>
                </Link>
              );
            }

            return (
              <Link
                key={path}
                to={path}
                className="relative flex flex-col items-center gap-0.5 px-3 py-2"
              >
                {isActive && (
                  <motion.div
                    layoutId="bottom-pill"
                    className="absolute inset-0 rounded-xl bg-primary/10"
                    transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                  />
                )}
                <motion.div whileTap={{ scale: 0.85 }}>
                  <Icon
                    className={`h-5 w-5 transition-colors ${isActive ? 'text-primary' : 'text-muted-foreground'
                      }`}
                  />
                </motion.div>
                <span
                  className={`text-[10px] font-medium transition-colors ${isActive ? 'text-primary' : 'text-muted-foreground'
                    }`}
                >
                  {label}
                </span>
                {isActive && (
                  <span className="absolute top-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-primary shadow-[0_0_6px_hsl(142_71%_45%/0.8)]" />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default BottomNav;
