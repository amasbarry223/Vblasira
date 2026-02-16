import { Bell, LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import logo from '@/assets/logo.png';

const Header = () => {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur-md">
      <div className="container flex h-14 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="Blasira" className="h-9 w-9 object-contain" />
          <span className="text-lg font-bold text-gradient-mali">Blasira</span>
        </Link>

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
