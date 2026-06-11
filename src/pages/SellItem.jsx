import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, AlertCircle, ShoppingBag, Eye, User, Sparkles } from 'lucide-react';
import api from '../lib/axios';

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

export const SellItem = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [condition, setCondition] = useState(CONDITIONS[2]); // Default: Good
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState([]);
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [college, setCollege] = useState('');
  const [statesOptions, setStatesOptions] = useState([]);
  const [citiesOptions, setCitiesOptions] = useState([]);
  const [collegesOptions, setCollegesOptions] = useState([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState('');
const previewImage = images[0] || null;
  // Load state options on mount
  useEffect(() => {
    const fetchStates = async () => {
      try {
        const res = await api.get('/locations/states');
        setStatesOptions(res.data || []);
      } catch (e) {
        console.error('Failed to load states', e);
      }
    };
    fetchStates();
  }, []);

  // Load cities when state changes
  useEffect(() => {
    if (!state) return;
    const fetchCities = async () => {
      try {
        const res = await api.get('/locations/cities', { params: { state } });
        setCitiesOptions(res.data || []);
      } catch (e) {
        console.error('Failed to load cities', e);
      }
    };
    fetchCities();
  }, [state]);

  // Load colleges when city changes
  useEffect(() => {
    if (!city) return;
    const fetchColleges = async () => {
      try {
        const res = await api.get('/locations/colleges', { params: { state, city } });
        setCollegesOptions(res.data || []);
      } catch (e) {
        console.error('Failed to load colleges', e);
      }
    };
    fetchColleges();
  }, [city]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim() || !description.trim() || !price || images.length === 0) {
      setError('Please fill in all required fields and upload an image.');
      return;
    }

    if (Number(price) < 0) {
      setError('Price cannot be negative.');
      return;
    }

    setLoading(true);
    try {
      await api.post('/listings', {
        title,
        description,
        category,
        condition,
        price: Number(price),
        images,
        state,
        city,
        college,
      });
      // Redirect to homepage after posting
      navigate('/');
    } catch (err) {
      console.error('Error creating listing:', err);
      setError(err.response?.data?.message || 'Failed to post listing. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  // Handle local image file uploads (multiple)
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const maxSize = 8 * 1024 * 1024;
    const readFile = (file) =>
      new Promise((resolve, reject) => {
        if (file.size > maxSize) {
          reject(new Error('Image is too large. Max size is 8MB.'));
          return;
        }
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    Promise.all(files.map(readFile))
      .then((results) => setImages((prev) => [...prev, ...results]))
      .catch((err) => setError(err.message));
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
      <div>
        <h1 className="text-2xl font-extrabold text-text flex items-center gap-2">
          List an Item for Sale <Sparkles className="text-primary" size={20} />
        </h1>
        <p className="text-textMuted text-sm">Fill in the details below to publish your item to the campus feed.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form Panel */}
        <form onSubmit={handleSubmit} className="lg:col-span-7 bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          {error && (
            <div className="p-4 bg-danger/10 border border-danger/20 text-danger rounded-xl text-sm flex items-center gap-2">
              <AlertCircle size={18} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Item Title */}
          <div>
            <label className="block text-xs font-bold text-text uppercase tracking-wider mb-2">Item Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. HC Verma Physics Vol 1, Casio FX-991EX..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input text-sm"
              maxLength={80}
            />
          </div>

          {/* Location selects */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-text uppercase tracking-wider mb-2">State *</label>
              <select value={state} onChange={(e) => setState(e.target.value)} className="input text-sm bg-white">
                <option value="">Select State</option>
                {statesOptions.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-text uppercase tracking-wider mb-2">City *</label>
              <select value={city} onChange={(e) => setCity(e.target.value)} className="input text-sm bg-white" disabled={!state}>
                <option value="">Select City</option>
                {citiesOptions.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-text uppercase tracking-wider mb-2">College *</label>
              <select value={college} onChange={(e) => setCollege(e.target.value)} className="input text-sm bg-white" disabled={!city}>
                <option value="">Select College</option>
                {collegesOptions.map((col) => (
                  <option key={col} value={col}>{col}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Category & Condition */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-text uppercase tracking-wider mb-2">Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="input text-sm bg-white"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-text uppercase tracking-wider mb-2">Condition *</label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                className="input text-sm bg-white"
              >
                {CONDITIONS.map((cond) => (
                  <option key={cond} value={cond}>{cond}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Price */}
          <div>
            <label className="block text-xs font-bold text-text uppercase tracking-wider mb-2">Price (₹) *</label>
            <input
              type="number"
              required
              placeholder="e.g. 500"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="input text-sm"
              min={0}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-text uppercase tracking-wider mb-2">Description *</label>
            <textarea
              required
              rows={4}
              placeholder="Describe the item condition, usage details, availability, and specific meeting spot preference..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input text-sm py-3 resize-none"
              maxLength={1000}
            />
          </div>

          {/* Image Upload */}
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
              <div>
                <label className="block text-xs font-bold text-text uppercase tracking-wider mb-2">Product Images *</label>
                <label className="border-2 border-dashed border-slate-200 hover:border-primary rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer bg-slate-50/50 hover:bg-primary/5 transition-all text-center">
                  <Upload className="text-textSubtle mb-2" size={24} />
                  <span className="text-xs font-bold text-text">Click to Upload</span>
                  <span className="text-[10px] text-textMuted mt-1">PNG, JPG up to 8MB each</span>
                  <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
                </label>
                {/* Preview thumbnails */}
                <div className="mt-2 flex flex-wrap gap-2">
                  {images.map((src, idx) => (
                    <img key={idx} src={src} alt={`preview-${idx}`} className="w-12 h-12 object-cover rounded" />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full btn btn-primary py-3 flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              "Post Listing"
            )}
          </button>
        </form>

        {/* Right Preview Panel */}
        <aside className="lg:col-span-5 space-y-4 lg:sticky lg:top-20">
          <div className="flex items-center justify-between px-2">
            <h2 className="font-bold text-sm text-text flex items-center gap-1.5 uppercase tracking-wider">
              <Eye size={16} className="text-primary" /> Live Card Preview
            </h2>
            <span className="text-[10px] text-textMuted font-medium bg-slate-100 px-2 py-1 rounded">Updates instantly</span>
          </div>

          <div className="flex items-center justify-center p-6 bg-slate-100 rounded-3xl border border-slate-200 border-dashed">
            {/* Renders the listing card exactly like Home grid */}
            <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-lg w-full max-w-sm flex flex-col transition-all duration-300">
              
              {/* Card Image */}
              <div className="aspect-[4/3] bg-slate-50 relative overflow-hidden shrink-0 border-b border-slate-100 flex items-center justify-center">
                {previewImage ? (
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-textSubtle p-4">
                    <ShoppingBag size={36} className="text-slate-300 mb-2" />
                    <span className="text-xs">Upload item picture</span>
                  </div>
                )}
                
                {/* Condition Badge */}
                <span className={`absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getConditionColor(condition)} shadow-sm`}>
                  {condition}
                </span>
                
                {/* Category Label */}
                <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded-lg text-[9px] font-medium bg-black/60 text-white backdrop-blur-md">
                  {category}
                </span>
              </div>

              {/* Card Body */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-1.5">
                  <span className="text-xl font-extrabold text-primary">
                    ₹{(Number(price) || 0).toLocaleString('en-IN')}
                  </span>
                  <h3 className="font-bold text-text text-sm truncate">
                    {title || 'Sample Item Name'}
                  </h3>
                  <p className="text-xs text-textMuted line-clamp-2 leading-relaxed">
                    {description || 'Sample item description will update dynamically. Tell details about quality, condition, purchase details...'}
                  </p>
                </div>

                {/* Card Footer */}
                <div className="flex items-center justify-between border-t border-slate-100 pt-3 shrink-0">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[9px] font-bold text-textMuted border border-slate-200">
                      <User size={10} />
                    </div>
                    <span className="text-[10px] text-textMuted font-medium truncate">
                      You (Seller)
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-primary flex items-center gap-0.5">
                    Details <Eye size={12} />
                  </span>
                </div>
              </div>

            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};
