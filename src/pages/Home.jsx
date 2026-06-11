import { useState, useEffect, useRef } from 'react';
import { HomeFilters } from '../components/HomeFilters';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { BookOpen, DraftingCompass, Calculator, Cpu, FlaskConical, Wrench, Home as House, MoreHorizontal, ArrowRight, RefreshCw, ShoppingBag, Eye, User, Filter, X } from 'lucide-react';
import api from '../lib/axios';

const CATEGORIES = [
  { name: 'All', icon: ShoppingBag },
  { name: 'Books', icon: BookOpen },
  { name: 'Drafters & Tools', icon: DraftingCompass },
  { name: 'Calculators', icon: Calculator },
  { name: 'Electronics', icon: Cpu },
  { name: 'Lab Equipment', icon: FlaskConical },
  { name: 'Project Components', icon: Wrench },
  { name: 'Hostel Essentials', icon: House },
  { name: 'Others', icon: MoreHorizontal },
];

export const Home = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const searchVal = searchParams.get('search') || '';
  const state = searchParams.get('state') || '';
  const city = searchParams.get('city') || '';
  const college = searchParams.get('college') || '';
  const categoryParam = searchParams.get('category') || '';

  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const limit = 20; // items per page
  const [page, setPage] = useState(1);
  const [activeCategory, setActiveCategory] = useState('All');


  const productsRef = useRef(null);

  // Sync category from URL to sidebar state
  useEffect(() => {
    if (categoryParam && categoryParam !== activeCategory) {
      setActiveCategory(categoryParam);
    }
  }, [categoryParam]);

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await api.get('/listings', {
          params: {
            search: searchVal,
            state: state || undefined,
            city: city || undefined,
            college: college || undefined,
            category: activeCategory === 'All' ? undefined : activeCategory,
            limit,
            page,
          },
        });
        setListings(res.data);
      } catch (err) {
        console.error('Error fetching listings:', err);
        setError('Failed to load listings. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [searchVal, activeCategory, state, city, college]);

  const scrollToBrowse = () => {
    productsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const getConditionColor = (cond) => {
    switch (cond) {
      case 'New': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'Like New': return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'Good': return 'bg-purple-50 text-purple-700 border-purple-100';
      case 'Fair': return 'bg-amber-50 text-amber-700 border-amber-100';
      default: return 'bg-slate-50 text-slate-700 border-slate-100';
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primaryHover to-accent text-white py-12 px-6 sm:px-12 shadow-xl shadow-primary/10">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute -bottom-10 left-10 w-64 h-64 bg-accent/20 blur-2xl rounded-full pointer-events-none" />
        
        <div className="relative z-10 max-w-2xl space-y-6">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            Find what you need,<br />
            <span className="text-accent-foreground bg-gradient-to-r from-pink-200 to-indigo-100 bg-clip-text text-transparent">
              Sell what you don't.
            </span>
          </h1>
          <p className="text-white/80 text-base sm:text-lg max-w-md">
            The ultimate peer-to-peer campus marketplace for engineering students. Find textbooks, drafting tools, project components, and hostel items.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => navigate('/sell')}
              className="bg-white text-primary hover:bg-slate-50 px-6 py-3 rounded-xl font-bold text-sm transition-all duration-200 shadow-md shadow-black/10 active:scale-[0.98] flex items-center gap-2"
            >
              Sell Item
              <ArrowRight size={16} />
            </button>
            <button
              onClick={scrollToBrowse}
              className="border border-white/30 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl font-bold text-sm transition-all duration-200 active:scale-[0.98]"
            >
              Browse Items
            </button>
          </div>
        </div>
      </section>

      {/* Filter Bar */}
      {/* Mobile filter button */}
      <div className="lg:hidden flex justify-end mb-4">
        <button onClick={() => setShowFilters(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-primary border border-slate-200/30 shadow-sm hover:bg-slate-50 transition-colors">
          <Filter size={16} /> Filters
        </button>
      </div>

      {/* Desktop Filters */}
      <div className="hidden lg:block">
        <HomeFilters onFilterChange={(params) => {
          setSearchParams(params);
          if (params.category) {
            setActiveCategory(params.category);
          } else if (!params.category && activeCategory !== 'All') {
            setActiveCategory('All');
          }
        }} />
      </div>

      {/* Mobile Drawer */}
      {showFilters && (
        <div className="fixed inset-0 z-40 flex">
          <div className="fixed inset-0 bg-black/30" onClick={() => setShowFilters(false)}></div>
          <div className="relative w-64 bg-white shadow-xl transform transition-transform duration-300 translate-x-0">
            <div className="p-4">
              <button className="mb-2 flex items-center gap-2 text-sm" onClick={() => setShowFilters(false)}>
                <X size={16} /> Close
              </button>
              <HomeFilters onFilterChange={(params) => {
                setSearchParams(params);
                if (params.category) {
                  setActiveCategory(params.category);
                } else if (!params.category && activeCategory !== 'All') {
                  setActiveCategory('All');
                }
                setShowFilters(false);
              }} />
            </div>
          </div>
        </div>
      )}

      {/* Main Grid Area */}
      <div ref={productsRef} className="grid grid-cols-1 lg:grid-cols-4 gap-8 pt-4">
        
        {/* Left Category Sidebar */}
        <aside className="lg:col-span-1 space-y-4">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm sticky top-20">
            <h2 className="font-bold text-text mb-4 text-base px-2">Categories</h2>
            <nav className="space-y-1">
              {CATEGORIES.map((cat) => {
                const IconComponent = cat.icon;
                const isActive = activeCategory === cat.name;
                return (
                  <button
                    key={cat.name}
                    onClick={() => setActiveCategory(cat.name)}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                      isActive
                        ? 'bg-primary/10 text-primary font-semibold'
                        : 'text-textMuted hover:text-text hover:bg-slate-50'
                    }`}
                  >
                    <IconComponent size={18} className={isActive ? 'text-primary' : 'text-textSubtle'} />
                    <span className="truncate">{cat.name}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Product Grid Area */}
        <main className="lg:col-span-3 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-text">
                {activeCategory === 'All' ? 'Featured Items' : activeCategory}
              </h2>
              {searchVal && (
                <p className="text-sm text-textMuted mt-0.5">
                  Showing results for "<span className="font-medium text-text">{searchVal}</span>"
                </p>
              )}
            </div>
            
            <div className="text-xs text-textMuted font-medium bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200/50">
              {listings.length} {listings.length === 1 ? 'item' : 'items'} found
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-3">
              <RefreshCw className="animate-spin text-primary" size={36} />
              <p className="text-sm text-textMuted font-medium">Fetching listings...</p>
            </div>
          ) : error ? (
            <div className="p-8 bg-red-50 border border-red-100 text-danger rounded-2xl text-center">
              <p className="font-semibold">{error}</p>
              <button 
                onClick={() => setActiveCategory('All')} 
                className="mt-3 btn btn-outline bg-white !py-2 !px-4 mx-auto text-xs"
              >
                Reset Filters
              </button>
            </div>
          ) : listings.length === 0 ? (
            <div className="card text-center py-16 border-dashed border-slate-300">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-textSubtle">
                <ShoppingBag size={28} />
              </div>
              <h3 className="text-lg font-bold text-text mb-1">No items found</h3>
              <p className="text-textMuted max-w-sm mx-auto text-sm mb-6">
                We couldn't find any listings matching your search or category filters. Try resetting the criteria or be the first to post a listing!
              </p>
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => {
                    setActiveCategory('All');
                    setSearchParams({});
                  }}
                  className="btn btn-outline !py-2 !px-4 text-xs"
                >
                  Clear Search
                </button>
                <button
                  onClick={() => navigate('/sell')}
                  className="btn btn-primary !py-2 !px-4 text-xs"
                >
                  Sell an Item
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {listings.map((item) => (
                <div
                  key={item._id}
                  onClick={() => navigate(`/item/${item._id}`)}
                  className="group bg-white border border-slate-200/80 rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-slate-200/50 hover:border-slate-300 transition-all duration-300 flex flex-col cursor-pointer"
                >
                  {/* Card Image */}
                  <div className="aspect-[4/3] bg-slate-50 relative overflow-hidden shrink-0 border-b border-slate-100">
                    <img
                      src={item.images && item.images[0] ? item.images[0] : 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80'}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    
                    {/* Condition Badge */}
                    <span className={`absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getConditionColor(item.condition)} shadow-sm`}>
                      {item.condition}
                    </span>
                    
                    {/* Category Label */}
                    <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded-lg text-[9px] font-medium bg-black/60 text-white backdrop-blur-md">
                      {item.category}
                    </span>
                  </div>

                  {/* Card Body */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-1.5">
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="text-xl font-extrabold text-primary">
                          ₹{item.price.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <h3 className="font-bold text-text group-hover:text-primary transition-colors text-sm line-clamp-1">
                        {item.title}
                      </h3>
                      <p className="text-xs text-textMuted line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                      <p className="text-xs text-textMuted mt-1">
                        {item.state}, {item.city}, {item.college}
                      </p>
                    </div>

                    {/* Card Footer */}
                    <div className="flex items-center justify-between border-t border-slate-100 pt-3 shrink-0">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[9px] font-bold text-textMuted border border-slate-200">
                          <User size={10} />
                        </div>
                        <span className="text-[10px] text-textMuted font-medium truncate">
                          {item.seller?.name || 'Student'}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold text-primary flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                        Details <Eye size={12} />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
