import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import ProtectedRoute from './components/ProtectedRoute';
import LogoutHandler from './components/LogoutHandler';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import ProductForm from './pages/ProductForm';
import CategoryList from './pages/CategoryList';
import CategoryProducts from './pages/CategoryProducts';
import SupplierList from './pages/SupplierList';
import SupplierProducts from './pages/SupplierProducts';
import ProductSuppliers from './pages/ProductSuppliers';
import StockEntries from './pages/StockEntries';

function App() {
  return (
    <Router>
      <AuthProvider>
        <DataProvider>
          <LogoutHandler />
          <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
            <Navbar />
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/products"
                element={
                  <ProtectedRoute>
                    <ProductList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/products/new"
                element={
                  <ProtectedRoute>
                    <ProductForm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/products/:id"
                element={
                  <ProtectedRoute>
                    <ProductDetail />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/products/:id/edit"
                element={
                  <ProtectedRoute>
                    <ProductForm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/categories"
                element={
                  <ProtectedRoute>
                    <CategoryList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/categories/:id/products"
                element={
                  <ProtectedRoute>
                    <CategoryProducts />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/suppliers"
                element={
                  <ProtectedRoute>
                    <SupplierList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/suppliers/:id/products"
                element={
                  <ProtectedRoute>
                    <SupplierProducts />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/product-suppliers"
                element={
                  <ProtectedRoute>
                    <ProductSuppliers />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/stock-entries"
                element={
                  <ProtectedRoute>
                    <StockEntries />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
        </DataProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;