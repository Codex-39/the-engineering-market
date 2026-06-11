import { useState, useRef, useEffect } from 'react';
import { Navigate, Outlet, useNavigate, useSearchParams } from 'react-router-dom';
import { MessageSquare, Plus, Bell, LogOut, Search, ShoppingBag, ChevronDown, User } from 'lucide-react';
import api from '../lib/axios';
import { useAuth } from '../context/AuthContext';

export const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  
  const dropdownRef = useRef(null);

  // Fetch notifications from API
  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await api.get('/notifications');
      const data = response.data || [];
      setNotifications(data);
      setUnreadCount(data.filter((n) => !n.isRead).length);
    } catch (err) {
      console.error('Failed to fetch notifications', err);
    } finally {
      setLoading(false);
    }
  };

  // Sync search input with searchParams changes (e.g. if cleared)
  useEffect(() => {
    setSearchInput(searchParams.get('search') || '');
  }, [searchParams]);

  // Handle outside click to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      navigate(`/?search=${encodeURIComponent(searchInput.trim())}`);
    } else {
      navigate('/');
    }
  };

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchInput(val);
    // Realtime search if they clear it
    if (!val.trim()) {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col text-text">
      {/* Top Header Navbar */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200/80 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Logo */}
          <div 
            onClick={() => navigate('/')} 
            className="flex items-center gap-2 cursor-pointer select-none shrink-0"
          >
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-md shadow-primary/20">
              <ShoppingBag size={20} className="text-white" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                EngMarket
              </span>
              <p className="text-[10px] text-textMuted font-medium -mt-1">Student Hub</p>
            </div>
          </div>

          {/* Search Bar Form */}
          <form onSubmit={handleSearchSubmit} className="flex-1 max-w-md mx-4 hidden md:block">
            <div className="relative">
              <input
                type="text"
                placeholder="Search books, drafters, calculators, components..."
                value={searchInput}
                onChange={handleSearchChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 text-text placeholder-textSubtle"
              />
              <Search 
                size={16} 
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-textSubtle" 
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchInput('');
                    navigate('/');
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-textMuted hover:text-text"
                >
                  Clear
                </button>
              )}
            </div>
          </form>

          {/* Navigation Controls */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            {/* Sell Item Button */}
            <button
              onClick={() => navigate('/sell')}
              className="btn btn-primary !px-4 !py-2 text-xs sm:text-sm font-semibold rounded-xl flex items-center gap-1.5"
            >
              <Plus size={16} />
              <span className="hidden sm:inline">Sell Item</span>
            </button>

            {/* My Listings Button */}
            <button
              onClick={() => navigate('/my-listings')}
              className="p-2.5 text-textMuted hover:text-primary hover:bg-slate-50 rounded-xl transition-all relative"
              title="My Listings"
            >
              <ShoppingBag size={20} />
            </button>

            {/* Messages Chat Button */}
            <button
              onClick={() => navigate('/chat')}
              className="p-2.5 text-textMuted hover:text-primary hover:bg-slate-50 rounded-xl transition-all relative"
              title="Messages"
            >
              <MessageSquare size={20} />
            </button>

            {/* Notifications Icon */}
            <div className="relative">
              <button
                onClick={async () => {
                  // Toggle dropdown and fetch latest notifications
                  setShowNotifications(!showNotifications);
                  if (!showNotifications) {
                    // Fetch when opening
                    await fetchNotifications();
                  }
                }}
                className="p-2.5 text-textMuted hover:text-primary hover:bg-slate-50 rounded-xl transition-all"
                title="Notifications"
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute top-2.5 right-2.5 min-w-[1.2rem] h-4 bg-danger text-xs rounded-full flex items-center justify-center text-white font-medium ring-2 ring-white">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl border border-slate-100 shadow-xl py-3 z-50 animate-slide-up">
                  <div className="px-4 pb-2 border-b border-slate-100 flex justify-between items-center">
                    <span className="font-bold text-sm text-text">Notifications</span>
                    <button
                      onClick={async () => {
                        await api.put('/notifications/read-all');
                        setNotifications([]);
                        setUnreadCount(0);
                        setShowNotifications(false);
                      }}
                      className="text-xs text-primary hover:underline"
                    >
                      Dismiss All
                    </button>
                  </div>
                  <div className="max-h-64 overflow-y-auto px-4 py-2 space-y-2 text-xs text-textMuted mt-1">
                    {notifications.length === 0 ? (
                      <div className="p-2 text-center text-textSubtle">No notifications</div>
                    ) : (
                      notifications.map((notif) => (
                        <div key={notif._id} className="p-2 bg-slate-50 rounded-lg border border-slate-100/50">
                          <p className="font-medium text-text">
                            {notif.senderId?.name || 'Someone'} {notif.type === 'message' ? 'sent you a message' : notif.message}
                          </p>
                          <p className="text-[10px] mt-0.5">{new Date(notif.createdAt).toLocaleString()}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User profile avatar / Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                className="flex items-center gap-1.5 p-1 rounded-xl hover:bg-slate-50 transition-all"
              >
                <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm border border-primary/20">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <ChevronDown size={14} className="text-textMuted hidden sm:block" />
              </button>

              {showProfileDropdown && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl border border-slate-100 shadow-xl py-2 z-50 animate-slide-up">
                  <div className="px-4 py-2.5 border-b border-slate-100">
                    <p className="text-sm font-bold text-text truncate">{user?.name}</p>
                    <p className="text-xs text-textMuted truncate">{user?.email}</p>
                  </div>
                  <div className="p-1">
                    <button
                      onClick={() => {
                        setShowProfileDropdown(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-textMuted hover:text-danger hover:bg-danger/5 transition-all text-left"
                    >
                      <LogOut size={16} />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Search Bar - visible only on mobile */}
      <div className="md:hidden px-4 py-2.5 bg-white border-b border-slate-100 shadow-sm">
        <form onSubmit={handleSearchSubmit} className="w-full">
          <div className="relative">
            <input
              type="text"
              placeholder="Search books, drafters, components..."
              value={searchInput}
              onChange={handleSearchChange}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 text-text placeholder-textSubtle"
            />
            <Search 
              size={14} 
              className="absolute left-3 top-1/2 -translate-y-1/2 text-textSubtle" 
            />
          </div>
        </form>
      </div>

      {/* Main Page Area */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
