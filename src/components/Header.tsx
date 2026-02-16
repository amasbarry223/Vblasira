import { Bell } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur-md">
      <div className="container flex h-14 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-mali">
            <span className="text-sm font-bold text-primary-foreground">B</span>
          </div>
          <span className="text-lg font-bold text-gradient-mali">Blasira</span>
        </Link>

        <button className="relative rounded-full p-2 text-muted-foreground transition-colors hover:text-foreground">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-mali-red" />
        </button>
      </div>
    </header>
  );
};

export default Header;
