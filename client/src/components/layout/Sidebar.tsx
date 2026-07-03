import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, Calendar, Users, LogOut, X } from 'lucide-react';
import { useAuthStore } from '../../context/authStore';
import { useUIStore } from '../../context/uiStore';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/projects', label: 'Projects', icon: FolderKanban },
  { to: '/calendar', label: 'Calendar', icon: Calendar },
  { to: '/team', label: 'Team', icon: Users },
];

const Sidebar = () => {
  const { user, logout } = useAuthStore();
  const { sidebarOpen, closeSidebar } = useUIStore();

  return (
    <>
      {/* Mobile overlay backdrop */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-30 md:hidden" onClick={closeSidebar} />
      )}

      <aside
        className={`w-64 h-screen border-r bg-background flex flex-col fixed left-0 top-0 z-40 transition-transform duration-200
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
      >
        <div className="p-5 border-b flex items-center justify-between">
          <h1 className="text-xl font-bold text-indigo-600">ProjectFlow</h1>
          <button onClick={closeSidebar} className="md:hidden">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={closeSidebar}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950' : 'text-muted-foreground hover:bg-muted'
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
            <div className="w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center text-sm font-medium shrink-0">
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
    </>
  );
};

export default Sidebar;