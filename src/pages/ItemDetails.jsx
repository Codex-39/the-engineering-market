import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MessageSquare, Heart, Share2, Shield, User, ArrowLeft, RefreshCw, AlertCircle, ShoppingBag } from 'lucide-react';
import api from '../lib/axios';
import { useAuth } from '../context/AuthContext';

export const ItemDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [interestLoading, setInterestLoading] = useState(false);
  const [interestSent, setInterestSent] = useState(false);

  useEffect(() => {
    const fetchListingDetails = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await api.get(`/listings/${id}`);
        setListing(res.data);
      } catch (err) {
        console.error('Error fetching listing details:', err);
        setError(err.response?.data?.message || 'Listing not found.');
      } finally {
        setLoading(false);
      }
    };

    fetchListingDetails();
  }, [id]);

  const handleStartChat = async (initialMessage = "Hi! Is this item still available?") => {
    if (!listing || !user) return;

    // Users cannot chat with themselves
    if (listing.seller._id === user._id) {
      alert("This is your listing!");
      return;
    }

    setInterestLoading(true);
    try {
      // Create initial conversation message
      await api.post('/chats', {
        receiverId: listing.seller._id,
        listingId: listing._id,
        content: initialMessage,
      });

      // Conversation ID sorting pattern matches backend
      const conversationId = [user._id, listing.seller._id].sort().join('-');
      
      // Navigate to chat and open this conversation
      navigate(`/chat?convo=${conversationId}`);
    } catch (err) {
      console.error('Error starting chat:', err);
      alert('Failed to connect with seller. Please try again.');
    } finally {
      setInterestLoading(false);
    }
  };

  const handleImInterested = () => {
    const interestMsg = `Hi! I am interested in buying your item "${listing.title}" listed for ₹${listing.price.toLocaleString('en-IN')}. Is it still available?`;
    handleStartChat(interestMsg);
    setInterestSent(true);
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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-3">
        <RefreshCw className="animate-spin text-primary" size={36} />
        <p className="text-sm text-textMuted font-medium">Loading item details...</p>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="max-w-md mx-auto text-center py-20 space-y-4">
        <div className="w-16 h-16 bg-red-50 text-danger rounded-full flex items-center justify-center mx-auto">
          <AlertCircle size={32} />
        </div>
        <h3 className="text-xl font-bold text-text">Item Not Found</h3>
        <p className="text-textMuted text-sm">{error || "The listing you are looking for does not exist or has been deleted."}</p>
        <Link to="/" className="btn btn-primary inline-flex">
          Back to Browse
        </Link>
      </div>
    );
  }

  const isOwnListing = listing.seller._id === user?._id;

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto">
      {/* Back navigation */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-xs font-semibold text-textMuted hover:text-text transition-colors"
      >
        <ArrowLeft size={14} /> Back to Listings
      </button>

      {/* Main product card */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Image Gallery */}
        <div className="md:col-span-7 space-y-4">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-3 shadow-sm overflow-hidden aspect-[4/3] relative flex items-center justify-center">
            <img
              src={listing.image}
              alt={listing.title}
              className="max-h-full max-w-full object-contain rounded-xl"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80';
              }}
            />
            {listing.status === 'sold' && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                <span className="text-white text-3xl font-extrabold tracking-widest uppercase border-4 border-white px-6 py-2 rounded-xl">
                  Sold
                </span>
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-4 gap-3">
            {/* Gallery placeholders */}
            <div className="aspect-[4/3] bg-slate-50 border border-slate-200 rounded-xl overflow-hidden cursor-pointer p-1">
              <img src={listing.image} alt="" className="w-full h-full object-cover rounded-lg" />
            </div>
            <div className="aspect-[4/3] bg-slate-100 border border-dashed border-slate-200 rounded-xl flex items-center justify-center text-textSubtle">
              <ShoppingBag size={18} />
            </div>
            <div className="aspect-[4/3] bg-slate-100 border border-dashed border-slate-200 rounded-xl flex items-center justify-center text-textSubtle">
              <ShoppingBag size={18} />
            </div>
            <div className="aspect-[4/3] bg-slate-100 border border-dashed border-slate-200 rounded-xl flex items-center justify-center text-textSubtle">
              <ShoppingBag size={18} />
            </div>
          </div>
        </div>

        {/* Right Side: Details & Actions */}
        <div className="md:col-span-5 space-y-6">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-6">
            
            {/* Header info */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="bg-primary/10 text-primary text-[11px] font-bold px-2.5 py-0.5 rounded-lg border border-primary/20">
                  {listing.category}
                </span>
                <span className={`px-2.5 py-0.5 rounded-lg text-[11px] font-bold border ${getConditionColor(listing.condition)}`}>
                  {listing.condition} Condition
                </span>
              </div>
              <h1 className="text-2xl font-extrabold text-text tracking-tight leading-tight">
                {listing.title}
              </h1>
              <div className="text-3xl font-extrabold text-primary">
                ₹{listing.price.toLocaleString('en-IN')}
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* Seller Info Card */}
            <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm border border-primary/20 shrink-0">
                  {listing.seller?.name?.charAt(0).toUpperCase() || '?'}
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-textSubtle font-medium uppercase tracking-wider">Posted by</p>
                  <p className="font-bold text-text text-sm truncate">{listing.seller?.name}</p>
                  <p className="text-[10px] text-textMuted truncate">{listing.seller?.email}</p>
                </div>
              </div>
              <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-100 shrink-0">
                Student Seller
              </span>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              {isOwnListing ? (
                <button
                  onClick={() => navigate('/my-listings')}
                  className="w-full btn btn-primary flex items-center justify-center"
                >
                  Manage My Listings
                </button>
              ) : listing.status === 'sold' ? (
                <button
                  disabled
                  className="w-full bg-slate-100 border border-slate-200 text-slate-400 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 cursor-not-allowed"
                >
                  This Item is Sold
                </button>
              ) : (
                <>
                  <button
                    onClick={() => handleStartChat()}
                    disabled={interestLoading}
                    className="w-full btn btn-outline py-3 flex items-center justify-center gap-2"
                  >
                    <MessageSquare size={16} />
                    Chat with Seller
                  </button>
                  <button
                    onClick={handleImInterested}
                    disabled={interestLoading}
                    className="w-full btn btn-primary py-3 flex items-center justify-center gap-2"
                  >
                    {interestLoading ? (
                      <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                    ) : (
                      "I'm Interested"
                    )}
                  </button>
                </>
              )}
            </div>
            
            {/* Safety Tip */}
            <div className="flex gap-2.5 p-3.5 bg-purple-50/50 border border-purple-100/50 rounded-xl text-xs text-textMuted">
              <Shield size={16} className="text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-text mb-0.5">Campus Safety Guarantee</p>
                <p className="leading-normal">Always inspect the item in person and meet in open public locations on campus (e.g., library, cafeteria) for exchange.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Description box */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-sm space-y-4">
        <h2 className="text-lg font-bold text-text">Description</h2>
        <p className="text-sm text-textMuted leading-relaxed whitespace-pre-wrap">
          {listing.description}
        </p>
      </div>
    </div>
  );
};
