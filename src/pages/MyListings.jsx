import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tag, Edit, Trash2, CheckCircle2, RotateCcw, AlertTriangle, Eye, RefreshCw, X, ShoppingBag } from 'lucide-react';
import api from '../lib/axios';
import { useAuth } from '../context/AuthContext';

const CATEGORIES = [
  'Books',
  'Drafters & Tools',
  'Calculators',
  'Electronics',
  'Lab Equipment',
  'Project Components',
  'Hostel Essentials',
  'Others',
];

const CONDITIONS = ['New', 'Like New', 'Good', 'Fair'];

export const MyListings = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('active'); // active or sold

  // Modal State for Editing
  const [editingItem, setEditingItem] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editCondition, setEditCondition] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editImage, setEditImage] = useState('');
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState('');

  const fetchMyListings = async () => {
    if (!user) return;
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/listings', {
        params: {
          seller: user._id,
          status: activeTab,
        },
      });
      setListings(res.data);
    } catch (err) {
      console.error('Error fetching my listings:', err);
      setError('Failed to fetch your listings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyListings();
  }, [activeTab, user]);

  const handleToggleSold = async (id) => {
    try {
      await api.patch(`/listings/${id}/sold`);
      fetchMyListings(); // reload list
    } catch (err) {
      console.error('Error toggling sold status:', err);
      alert('Failed to change item status.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this listing? This action cannot be undone.')) {
      return;
    }
    try {
      await api.delete(`/listings/${id}`);
      setListings(listings.filter((item) => item._id !== id));
    } catch (err) {
      console.error('Error deleting listing:', err);
      alert('Failed to delete item.');
    }
  };

  // Open Edit Modal
  const openEditModal = (item) => {
    setEditingItem(item);
    setEditTitle(item.title);
    setEditCategory(item.category);
    setEditCondition(item.condition);
    setEditPrice(item.price);
    setEditDescription(item.description);
    setEditImage(item.image);
    setEditError('');
  };

  const closeEditModal = () => {
    setEditingItem(null);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditError('');
    setEditLoading(true);

    try {
      const res = await api.put(`/listings/${editingItem._id}`, {
        title: editTitle,
        category: editCategory,
        condition: editCondition,
        price: Number(editPrice),
        description: editDescription,
        image: editImage,
      });

      // Update local state
      setListings(
        listings.map((item) => (item._id === editingItem._id ? { ...item, ...res.data } : item))
      );
      closeEditModal();
    } catch (err) {
      console.error('Error updating listing:', err);
      setEditError(err.response?.data?.message || 'Failed to update listing.');
    } finally {
      setEditLoading(false);
    }
  };

  // Convert uploaded image to base64
  const handleEditImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      setEditError('Image is too large. Max size is 8MB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setEditImage(reader.result);
      setEditError('');
    };
    reader.readAsDataURL(file);
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
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-text">My Marketplace Listings</h1>
          <p className="text-textMuted text-sm">Manage items you have listed for sale on campus.</p>
        </div>
        <button
          onClick={() => navigate('/sell')}
          className="btn btn-primary"
        >
          Post a New Listing
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-6">
        <button
          onClick={() => setActiveTab('active')}
          className={`py-3 text-sm font-bold border-b-2 transition-all relative ${
            activeTab === 'active'
              ? 'border-primary text-primary'
              : 'border-transparent text-textMuted hover:text-text'
          }`}
        >
          Active Listings
          {activeTab === 'active' && (
            <span className="absolute -top-1 -right-3.5 bg-primary/10 text-primary text-[10px] px-1.5 py-0.5 rounded-full font-bold">
              {listings.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('sold')}
          className={`py-3 text-sm font-bold border-b-2 transition-all relative ${
            activeTab === 'sold'
              ? 'border-primary text-primary'
              : 'border-transparent text-textMuted hover:text-text'
          }`}
        >
          Sold Items
          {activeTab === 'sold' && (
            <span className="absolute -top-1 -right-3.5 bg-slate-100 text-textMuted text-[10px] px-1.5 py-0.5 rounded-full font-bold">
              {listings.length}
            </span>
          )}
        </button>
      </div>

      {/* Grid List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-3">
          <RefreshCw className="animate-spin text-primary" size={36} />
          <p className="text-sm text-textMuted">Loading listings...</p>
        </div>
      ) : error ? (
        <div className="p-8 bg-red-50 border border-red-100 text-danger rounded-2xl text-center">
          {error}
        </div>
      ) : listings.length === 0 ? (
        <div className="card text-center py-16 border-dashed border-slate-200">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-textSubtle">
            <ShoppingBag size={28} />
          </div>
          <h3 className="text-lg font-bold text-text mb-1">
            {activeTab === 'active' ? 'No active listings' : 'No items marked as sold'}
          </h3>
          <p className="text-textMuted max-w-sm mx-auto text-sm mb-6">
            {activeTab === 'active'
              ? "You don't have any items currently up for sale. Create one and make it visible to classmates!"
              : "Items you mark as sold will appear here for record-keeping."}
          </p>
          {activeTab === 'active' && (
            <button
              onClick={() => navigate('/sell')}
              className="btn btn-primary mx-auto"
            >
              Post an Item
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((item) => (
            <div
              key={item._id}
              className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col"
            >
              {/* Product Image */}
              <div className="aspect-[16/10] bg-slate-50 relative overflow-hidden shrink-0 border-b border-slate-100">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80';
                  }}
                />
                <span className={`absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getConditionColor(item.condition)} shadow-sm`}>
                  {item.condition}
                </span>
                <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded-lg text-[9px] font-medium bg-black/60 text-white backdrop-blur-md">
                  {item.category}
                </span>
              </div>

              {/* Body */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-1">
                  <div className="flex items-baseline justify-between">
                    <span className="text-lg font-extrabold text-primary">
                      ₹{item.price.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <h3 className="font-bold text-text text-sm line-clamp-1">
                    {item.title}
                  </h3>
                  <p className="text-xs text-textMuted line-clamp-2">
                    {item.description}
                  </p>
                </div>

                {/* Operations Actions */}
                <div className="flex items-center gap-2 border-t border-slate-100 pt-3 shrink-0">
                  {/* Mark Sold/Active */}
                  <button
                    onClick={() => handleToggleSold(item._id)}
                    className={`flex-1 py-2 px-2.5 rounded-lg text-[11px] font-bold border flex items-center justify-center gap-1 transition-all ${
                      item.status === 'active'
                        ? 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100/70'
                        : 'border-slate-200 bg-slate-50 text-textMuted hover:bg-slate-100'
                    }`}
                    title={item.status === 'active' ? 'Mark as Sold' : 'Mark as Active'}
                  >
                    {item.status === 'active' ? (
                      <>
                        <CheckCircle2 size={13} />
                        Mark Sold
                      </>
                    ) : (
                      <>
                        <RotateCcw size={13} />
                        Reactivate
                      </>
                    )}
                  </button>

                  {/* Edit Button */}
                  <button
                    onClick={() => openEditModal(item)}
                    className="p-2 border border-slate-200 hover:border-primary hover:bg-primary/5 text-textMuted hover:text-primary rounded-lg transition-all"
                    title="Edit Listing"
                  >
                    <Edit size={14} />
                  </button>

                  {/* Delete Button */}
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="p-2 border border-slate-200 hover:border-danger hover:bg-danger/5 text-textMuted hover:text-danger rounded-lg transition-all"
                    title="Delete Listing"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* EDIT MODAL */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0">
              <h3 className="font-extrabold text-text text-base flex items-center gap-2">
                <Tag size={18} className="text-primary" /> Edit Item Listing
              </h3>
              <button
                onClick={closeEditModal}
                className="p-1 rounded-lg text-textMuted hover:text-text hover:bg-slate-100 transition-all"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Form scroll container */}
            <form onSubmit={handleEditSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
              {editError && (
                <div className="p-3 bg-danger/10 border border-danger/20 text-danger rounded-xl text-xs flex items-center gap-1.5">
                  <AlertTriangle size={15} />
                  <span>{editError}</span>
                </div>
              )}

              {/* Title */}
              <div>
                <label className="block text-[10px] font-bold text-text uppercase tracking-wider mb-2">Item Name *</label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="input text-xs"
                />
              </div>

              {/* Category & Condition */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-text uppercase tracking-wider mb-2">Category *</label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className="input text-xs bg-white"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-text uppercase tracking-wider mb-2">Condition *</label>
                  <select
                    value={editCondition}
                    onChange={(e) => setEditCondition(e.target.value)}
                    className="input text-xs bg-white"
                  >
                    {CONDITIONS.map((cond) => (
                      <option key={cond} value={cond}>{cond}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Price */}
              <div>
                <label className="block text-[10px] font-bold text-text uppercase tracking-wider mb-2">Price (₹) *</label>
                <input
                  type="number"
                  required
                  value={editPrice}
                  onChange={(e) => setEditPrice(e.target.value)}
                  className="input text-xs"
                  min={0}
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-[10px] font-bold text-text uppercase tracking-wider mb-2">Description *</label>
                <textarea
                  required
                  rows={3}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="input text-xs py-2.5 resize-none"
                />
              </div>

              {/* Image Source Edit */}
              <div>
                <label className="block text-[10px] font-bold text-text uppercase tracking-wider mb-2">Product Image *</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                  <label className="border border-dashed border-slate-200 hover:border-primary rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer bg-slate-50/50 hover:bg-primary/5 transition-all text-center">
                    <Eye size={18} className="text-textSubtle mb-1" />
                    <span className="text-[10px] font-bold text-text">Replace File</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleEditImageUpload}
                      className="hidden"
                    />
                  </label>
                  <div className="space-y-1">
                    <p className="text-[9px] text-textSubtle font-bold uppercase tracking-wider">or edit Image URL</p>
                    <input
                      type="text"
                      value={editImage.startsWith('data:') ? '' : editImage}
                      onChange={(e) => setEditImage(e.target.value)}
                      placeholder="Paste image address..."
                      className="input text-[11px] py-1.5"
                    />
                  </div>
                </div>
              </div>
            </form>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2.5 shrink-0">
              <button
                type="button"
                onClick={closeEditModal}
                className="btn btn-outline !py-2 !px-4 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleEditSubmit}
                disabled={editLoading}
                className="btn btn-primary !py-2 !px-4 text-xs font-semibold"
              >
                {editLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
