import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, LogOut } from 'lucide-react';
import { useAuthStore } from '../../context/authStore';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/projects', label: 'Projects', icon: FolderKanban },
];

const Sidebar = () => {
  const { user, logout } = useAuthStore();

  return (
    <aside className="w-64 h-screen border-r bg-background flex flex-col fixed left-0 top-0">
      <div className="p-5 border-b">
        <h1 className="text-xl font-bold text-indigo-600">ProjectFlow</h1>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive ? 'bg-indigo-50 text-indigo-600' : 'text-muted-foreground hover:bg-muted'
              }`
            }
          >
            <Icon className="w-4 h-4" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="p-3 border-t">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center text-sm font-medium">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.name}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.role}</p>
          </div>
          <button onClick={logout} title="Logout">
            <LogOut className="w-4 h-4 text-muted-foreground hover:text-red-500" />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;