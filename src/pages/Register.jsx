import { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { UserPlus, Mail, Lock, User, ShoppingBag } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../lib/axios';

export const Register = () => {
  const { user, register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profileState, setProfileState] = useState('');
  const [profileCity, setProfileCity] = useState('');
  const [profileCollege, setProfileCollege] = useState('');
  const [customCollege, setCustomCollege] = useState('');
  const [isCustomCollege, setIsCustomCollege] = useState(false);
  const [statesOptions, setStatesOptions] = useState([]);
  const [citiesOptions, setCitiesOptions] = useState([]);
  const [collegesOptions, setCollegesOptions] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Load states on mount
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
    if (!profileState) {
      setCitiesOptions([]);
      setProfileCity('');
      return;
    }
    const fetchCities = async () => {
      try {
        const res = await api.get('/locations/cities', { params: { state: profileState } });
        setCitiesOptions(res.data || []);
      } catch (e) {
        console.error('Failed to load cities', e);
      }
    };
    fetchCities();
  }, [profileState]);

  // Load colleges when city changes
  useEffect(() => {
    if (!profileCity) {
      setCollegesOptions([]);
      setProfileCollege('');
      return;
    }
    const fetchColleges = async () => {
      try {
        const res = await api.get('/locations/colleges', { params: { state: profileState, city: profileCity } });
        setCollegesOptions(res.data || []);
      } catch (e) {
        console.error('Failed to load colleges', e);
      }
    };
    fetchColleges();
  }, [profileCity, profileState]);

  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const finalCollege = profileCollege === 'custom' ? customCollege : profileCollege;

    if (!profileState || !profileCity || !finalCollege) {
      setError('State, City, and College are required.');
      return;
    }

    setLoading(true);
    try {
      await register(name, email, password, 'user', profileState, profileCity, finalCollege);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data?.errors?.[0]?.msg ||
        'Registration failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden py-12">
      {/* Premium Background Effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="card glass w-full max-w-md relative z-10 animate-slide-up">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-primary/20 mb-6">
            <ShoppingBag size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-text mb-2">Create Account</h1>
          <p className="text-textMuted">Join the EngMarket student community</p>
        </div>

        {error && (
          <div className="mb-6 px-4 py-3 bg-danger/10 border border-danger/20 text-danger rounded-xl text-sm flex items-center justify-center text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          <div>
            <label className="block text-sm font-medium text-textMuted mb-2">
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-textSubtle">
                <User size={18} />
              </div>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input pl-11"
                placeholder="John Doe"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-textMuted mb-2">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-textSubtle">
                <Mail size={18} />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input pl-11"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-textMuted mb-2">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-textSubtle">
                <Lock size={18} />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input pl-11"
                placeholder="Min. 6 characters"
                minLength={6}
              />
            </div>
          </div>

          {/* State Select */}
          <div>
            <label className="block text-sm font-medium text-textMuted mb-2">
              State *
            </label>
            <select
              required
              value={profileState}
              onChange={(e) => setProfileState(e.target.value)}
              className="input bg-white text-sm"
            >
              <option value="">Select State</option>
              {statesOptions.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* City Select */}
          <div>
            <label className="block text-sm font-medium text-textMuted mb-2">
              City *
            </label>
            <select
              required
              value={profileCity}
              onChange={(e) => setProfileCity(e.target.value)}
              disabled={!profileState}
              className="input bg-white text-sm"
            >
              <option value="">Select City</option>
              {citiesOptions.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* College Select */}
          <div>
            <label className="block text-sm font-medium text-textMuted mb-2">
              College *
            </label>
            <select
              required
              value={profileCollege}
              onChange={(e) => {
                setProfileCollege(e.target.value);
                setIsCustomCollege(e.target.value === 'custom');
              }}
              disabled={!profileCity}
              className="input bg-white text-sm"
            >
              <option value="">Select College</option>
              {collegesOptions.map((col) => (
                <option key={col} value={col}>{col}</option>
              ))}
              <option value="custom">Other / Custom College</option>
            </select>
          </div>

          {/* Custom College Input */}
          {isCustomCollege && (
            <div>
              <label className="block text-sm font-medium text-textMuted mb-2">
                Specify College Name *
              </label>
              <input
                type="text"
                required
                placeholder="Enter college name"
                value={customCollege}
                onChange={(e) => setCustomCollege(e.target.value)}
                className="input"
              />
            </div>
          )}

          <button type="submit" disabled={loading} className="w-full btn btn-primary mt-6">
            {loading ? (
               <span className="flex items-center gap-2">
                 <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                 </svg>
                 Creating Account...
               </span>
            ) : (
              <>
                <UserPlus size={18} />
                Create Account
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-textSubtle">
          <p>
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:text-primaryHover hover:underline font-semibold transition-colors">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
