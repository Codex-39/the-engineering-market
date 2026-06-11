import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../lib/axios';
import { Search, X } from 'lucide-react';

/**
 * Filter bar for the Home page.
 * Props:
 *   onFilterChange: (filters) => void – called when any filter changes.
 */
export const HomeFilters = ({ onFilterChange }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [state, setState] = useState(searchParams.get('state') || '');
  const [city, setCity] = useState(searchParams.get('city') || '');
  const [college, setCollege] = useState(searchParams.get('college') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');

  const [statesOptions, setStatesOptions] = useState([]);
  const [citiesOptions, setCitiesOptions] = useState([]);
  const [collegesOptions, setCollegesOptions] = useState([]);

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
    if (!state) {
      setCitiesOptions([]);
      setCity('');
      return;
    }
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
    if (!city) {
      setCollegesOptions([]);
      setCollege('');
      return;
    }
    const fetchColleges = async () => {
      try {
        const res = await api.get('/locations/colleges', { params: { state, city } });
        setCollegesOptions(res.data || []);
      } catch (e) {
        console.error('Failed to load colleges', e);
      }
    };
    fetchColleges();
  }, [city, state]);

  // Push filter changes up
  const applyFilters = () => {
    const params = {};
    if (search) params.search = search;
    if (state) params.state = state;
    if (city) params.city = city;
    if (college) params.college = college;
    if (category) params.category = category;
    if (minPrice) params.minPrice = minPrice;
    if (maxPrice) params.maxPrice = maxPrice;
    setSearchParams(params);
    onFilterChange(params);
  };

  // Run whenever any filter state changes
  useEffect(() => {
    applyFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, state, city, college, category, minPrice, maxPrice]);

  const clearAll = () => {
    setSearch('');
    setState('');
    setCity('');
    setCollege('');
    setCategory('');
    setMinPrice('');
    setMaxPrice('');
    setSearchParams({});
    onFilterChange({});
  };

  return (
    <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-200/30">
      {/* Search input */}
      <div className="relative flex-1 min-w-[200px]">
        <input
          type="text"
          placeholder="Search items..."
          className="input w-full pl-10 pr-4 py-2 text-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-textSubtle" size={16} />
      </div>

      {/* State dropdown */}
      <select
        value={state}
        onChange={(e) => setState(e.target.value)}
        className="input text-sm min-w-[140px]"
      >
        <option value="">All States</option>
        {statesOptions.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>

      {/* City dropdown */}
      <select
        value={city}
        onChange={(e) => setCity(e.target.value)}
        disabled={!state}
        className="input text-sm min-w-[140px]"
      >
        <option value="">All Cities</option>
        {citiesOptions.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      {/* College dropdown */}
      <select
        value={college}
        onChange={(e) => setCollege(e.target.value)}
        disabled={!city}
        className="input text-sm min-w-[140px]"
      >
        <option value="">All Colleges</option>
        {collegesOptions.map((col) => (
          <option key={col} value={col}>
            {col}
          </option>
        ))}
      </select>

      {/* Category dropdown */}
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="input text-sm min-w-[140px]"
      >
        <option value="">All Categories</option>
        <option value="Books">Books</option>
        <option value="Drafters & Tools">Drafters & Tools</option>
        <option value="Calculators">Calculators</option>
        <option value="Electronics">Electronics</option>
        <option value="Lab Equipment">Lab Equipment</option>
        <option value="Project Components">Project Components</option>
        <option value="Hostel Essentials">Hostel Essentials</option>
        <option value="Others">Others</option>
      </select>

      {/* Price inputs */}
      <div className="flex items-center gap-2">
        <input
          type="number"
          placeholder="Min ₹"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          className="input text-sm w-[90px] py-2 px-3"
          min={0}
        />
        <span className="text-textSubtle text-xs">-</span>
        <input
          type="number"
          placeholder="Max ₹"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="input text-sm w-[90px] py-2 px-3"
          min={0}
        />
      </div>

      {/* Clear button */}
      <button
        onClick={clearAll}
        className="flex items-center gap-1 text-xs text-textMuted hover:text-text px-2 py-1 rounded"
      >
        <X size={14} /> Clear Filters
      </button>
    </div>
  );
};
