import { Menu } from 'lucide-react';
import { useUIStore } from '../../context/uiStore';
import NotificationDropdown from '../notifications/NotificationDropdown';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
  const { toggleSidebar } = useUIStore();

  return (
    <header className="h-16 border-b bg-background flex items-center justify-between px-4 md:px-6 sticky top-0 z-10">
      <button onClick={toggleSidebar} className="md:hidden p-2 rounded-lg hover:bg-muted">
        <Menu className="w-5 h-5" />
      </button>
      <div className="flex-1" />
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <NotificationDropdown />
      </div>
    </header>
  );
};

export default Navbar;