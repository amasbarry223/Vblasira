import { Home, Search, PlusCircle, ClipboardList, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { icon: Home, label: 'Accueil', path: '/' },
  { icon: Search, label: 'Chercher', path: '/search' },
  { icon: PlusCircle, label: 'Publier', path: '/publish' },
  { icon: ClipboardList, label: 'Trajets', path: '/my-trips' },
  { icon: User, label: 'Profil', path: '/profile' },
];

const BottomNav = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 backdrop-blur-md md:hidden">
      <div className="flex items-center justify-around py-2">
        {navItems.map(({ icon: Icon, label, path }) => {
          const isActive = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 text-xs transition-colors ${
                isActive
                  ? 'text-primary font-semibold'
                  : 'text-muted-foreground'
              }`}
            >
              <Icon className={`h-5 w-5 ${path === '/publish' ? 'h-6 w-6 text-primary' : ''}`} />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
