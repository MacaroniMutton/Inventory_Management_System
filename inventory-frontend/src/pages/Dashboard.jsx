import { useEffect, useState } from 'react';
import { useData } from '../context/DataContext';
import { Link } from 'react-router-dom';

function Dashboard() {
  const { fetchInventorySummary, fetchLowStockProducts, loading } = useData();
  const [summary, setSummary] = useState(null);
  const [lowStockProducts, setLowStockProducts] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    const summaryData = await fetchInventorySummary();
    const lowStockData = await fetchLowStockProducts();
    
    setSummary(summaryData);
    setLowStockProducts(lowStockData);
  };

  if (loading) {
    return <div style={{ padding: '20px' }}>Loading...</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Dashboard</h1>

      {summary && (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          marginBottom: '30px'
        }}>
          <div style={{
            padding: '20px',
            border: '1px solid #ddd',
            borderRadius: '8px',
            backgroundColor: '#f5f5f5'
          }}>
            <h3>Total Products</h3>
            <p style={{ fontSize: '32px', fontWeight: 'bold', margin: '10px 0' }}>
              {summary.product_count}
            </p>
          </div>

          <div style={{
            padding: '20px',
            border: '1px solid #ddd',
            borderRadius: '8px',
            backgroundColor: '#f5f5f5'
          }}>
            <h3>Total Suppliers</h3>
            <p style={{ fontSize: '32px', fontWeight: 'bold', margin: '10px 0' }}>
              {summary.supplier_count}
            </p>
          </div>

          <div style={{
            padding: '20px',
            border: '1px solid #ddd',
            borderRadius: '8px',
            backgroundColor: '#f5f5f5'
          }}>
            <h3>Products with Stock</h3>
            <p style={{ fontSize: '32px', fontWeight: 'bold', margin: '10px 0' }}>
              {summary.products_with_stock}
            </p>
          </div>

          <div style={{
            padding: '20px',
            border: '1px solid #ddd',
            borderRadius: '8px',
            backgroundColor: '#f5f5f5'
          }}>
            <h3>Total Stock Units</h3>
            <p style={{ fontSize: '32px', fontWeight: 'bold', margin: '10px 0' }}>
              {summary.total_stock_units}
            </p>
          </div>

          <div style={{
            padding: '20px',
            border: '1px solid #ddd',
            borderRadius: '8px',
            backgroundColor: '#e3f2fd'
          }}>
            <h3>Total Stock Value</h3>
            <p style={{ fontSize: '32px', fontWeight: 'bold', margin: '10px 0' }}>
              ₹{summary.total_stock_value}
            </p>
          </div>
        </div>
      )}

      <div style={{ marginTop: '40px' }}>
        <h2>Low Stock Products</h2>
        {lowStockProducts.length === 0 ? (
          <p>No products with low stock.</p>
        ) : (
          <table style={{ 
            width: '100%', 
            borderCollapse: 'collapse',
            marginTop: '20px'
          }}>
            <thead>
              <tr style={{ backgroundColor: '#f5f5f5' }}>
                <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>
                  SKU
                </th>
                <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>
                  Product Name
                </th>
                <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>
                  Category
                </th>
                <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>
                  Current Stock
                </th>
                <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {lowStockProducts.map((product) => (
                <tr key={product.id}>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                    {product.sku}
                  </td>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                    {product.name}
                  </td>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                    {product.category}
                  </td>
                  <td style={{ 
                    padding: '12px', 
                    border: '1px solid #ddd',
                    color: product.stock < 5 ? 'red' : 'orange',
                    fontWeight: 'bold'
                  }}>
                    {product.stock}
                  </td>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                    <Link 
                      to={`/products/${product.id}`}
                      style={{ color: '#2196F3', textDecoration: 'none' }}
                    >
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Dashboard;