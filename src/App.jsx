import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Home } from './pages/Home';
import { ItemDetails } from './pages/ItemDetails';
import { SellItem } from './pages/SellItem';
import { MyListings } from './pages/MyListings';
import { Chat } from './pages/Chat';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected Routes */}
        <Route element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route path="/" element={<Home />} />
          <Route path="/item/:id" element={<ItemDetails />} />
          <Route path="/sell" element={<SellItem />} />
          <Route path="/my-listings" element={<MyListings />} />
          <Route path="/chat" element={<Chat />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
