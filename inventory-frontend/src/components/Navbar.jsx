import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <nav style={{ 
      backgroundColor: '#2196F3',
      padding: '15px 20px',
      marginBottom: '0'
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <Link 
            to="/"
            style={{ 
              color: 'white', 
              textDecoration: 'none',
              fontSize: '20px',
              fontWeight: 'bold'
            }}
          >
            Inventory System
          </Link>
          <Link 
            to="/"
            style={{ color: 'white', textDecoration: 'none' }}
          >
            Dashboard
          </Link>
          <Link 
            to="/products"
            style={{ color: 'white', textDecoration: 'none' }}
          >
            Products
          </Link>
          <Link 
            to="/categories"
            style={{ color: 'white', textDecoration: 'none' }}
          >
            Categories
          </Link>
          <Link 
            to="/suppliers"
            style={{ color: 'white', textDecoration: 'none' }}
          >
            Suppliers
          </Link>
          <Link 
            to="/stock-entries"
            style={{ color: 'white', textDecoration: 'none' }}
          >
            Stock Entries
          </Link>
          <Link 
            to="/product-suppliers"
            style={{ color: 'white', textDecoration: 'none' }}
          >
            Product-Suppliers
          </Link>
        </div>
        <button 
          onClick={handleLogout}
          style={{
            padding: '8px 16px',
            backgroundColor: '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;