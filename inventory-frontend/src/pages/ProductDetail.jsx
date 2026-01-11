import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useData } from '../context/DataContext';

function ProductDetail() {
  const { id } = useParams();
  const { fetchProductById, fetchStockHistory, loading } = useData();
  const [product, setProduct] = useState(null);
  const [stockHistory, setStockHistory] = useState([]);

  useEffect(() => {
    loadProductData();
  }, [id]);

  const loadProductData = async () => {
    const productData = await fetchProductById(id);
    const historyData = await fetchStockHistory(id);
    
    setProduct(productData);
    setStockHistory(historyData);
  };

  if (loading) {
    return <div style={{ padding: '20px' }}>Loading...</div>;
  }

  if (!product) {
    return <div style={{ padding: '20px' }}>Product not found.</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '20px' }}>
        <Link 
          to="/products"
          style={{ color: '#2196F3', textDecoration: 'none' }}
        >
          ← Back to Products
        </Link>
      </div>

      <h1>{product.name}</h1>

      <div style={{ 
        marginTop: '20px',
        padding: '20px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        backgroundColor: '#f9f9f9'
      }}>
        <h2>Product Details</h2>
        <table style={{ width: '100%' }}>
          <tbody>
            <tr>
              <td style={{ padding: '8px', fontWeight: 'bold', width: '200px' }}>
                SKU:
              </td>
              <td style={{ padding: '8px' }}>{product.sku}</td>
            </tr>
            <tr>
              <td style={{ padding: '8px', fontWeight: 'bold' }}>Category:</td>
              <td style={{ padding: '8px' }}>{product.category}</td>
            </tr>
            <tr>
              <td style={{ padding: '8px', fontWeight: 'bold' }}>Description:</td>
              <td style={{ padding: '8px' }}>
                {product.description || 'No description'}
              </td>
            </tr>
            <tr>
              <td style={{ padding: '8px', fontWeight: 'bold' }}>Suppliers:</td>
              <td style={{ padding: '8px' }}>
                {product.suppliers.join(', ') || 'None'}
              </td>
            </tr>
            <tr>
              <td style={{ padding: '8px', fontWeight: 'bold' }}>Status:</td>
              <td style={{ padding: '8px' }}>
                <span style={{
                  padding: '4px 8px',
                  borderRadius: '4px',
                  backgroundColor: product.is_active ? '#c8e6c9' : '#ffcdd2',
                  color: product.is_active ? '#2e7d32' : '#c62828'
                }}>
                  {product.is_active ? 'Active' : 'Inactive'}
                </span>
              </td>
            </tr>
            <tr>
              <td style={{ padding: '8px', fontWeight: 'bold' }}>Created At:</td>
              <td style={{ padding: '8px' }}>
                {new Date(product.created_at).toLocaleString()}
              </td>
            </tr>
            <tr>
              <td style={{ padding: '8px', fontWeight: 'bold' }}>Updated At:</td>
              <td style={{ padding: '8px' }}>
                {new Date(product.updated_at).toLocaleString()}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: '40px' }}>
        <h2>Stock History</h2>
        {stockHistory.length === 0 ? (
          <p>No stock movements recorded.</p>
        ) : (
          <table style={{ 
            width: '100%', 
            borderCollapse: 'collapse',
            marginTop: '20px'
          }}>
            <thead>
              <tr style={{ backgroundColor: '#f5f5f5' }}>
                <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>
                  Date
                </th>
                <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>
                  Type
                </th>
                <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>
                  Quantity
                </th>
                <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>
                  Reference
                </th>
              </tr>
            </thead>
            <tbody>
              {stockHistory.map((entry) => (
                <tr key={entry.id}>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                    {new Date(entry.created_at).toLocaleString()}
                  </td>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      backgroundColor: entry.movement_type === 'IN' ? '#c8e6c9' : '#ffcdd2',
                      color: entry.movement_type === 'IN' ? '#2e7d32' : '#c62828'
                    }}>
                      {entry.movement_type === 'IN' ? 'Stock In' : 'Stock Out'}
                    </span>
                  </td>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                    {entry.movement_type === 'IN' ? '+' : '-'}{entry.quantity}
                  </td>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                    {entry.reference || 'N/A'}
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

export default ProductDetail;