import { Bell, LogIn, Search, PlusCircle, ClipboardList, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import logo from '@/assets/logo.png';

const desktopNav = [
  { label: 'Chercher', path: '/search', icon: Search },
  { label: 'Publier', path: '/publish', icon: PlusCircle },
  { label: 'Mes trajets', path: '/my-trips', icon: ClipboardList },
  { label: 'Profil', path: '/profile', icon: User },
];

const Header = () => {
  const { user } = useAuth();
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur-md">
      <div className="container flex h-14 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="Blasira" className="h-9 w-9 object-contain" />
          <span className="text-lg font-bold text-gradient-mali">Blasira</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {desktopNav.map(({ label, path, icon: Icon }) => {
            const isActive = location.pathname === path;
            return (
              <Link
                key={path}
                to={path}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <button className="relative rounded-full p-2 text-muted-foreground transition-colors hover:text-foreground">
              <Bell className="h-5 w-5" />
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-mali-red" />
            </button>
          ) : (
            <Link to="/auth" className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground">
              <LogIn className="h-3.5 w-3.5" />
              Connexion
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
