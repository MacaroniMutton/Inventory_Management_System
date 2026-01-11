import { useEffect, useState } from 'react';
import { useData } from '../context/DataContext';

function StockEntries() {
  const { 
    stockEntries, 
    products,
    fetchStockEntries, 
    fetchProducts,
    createStockEntry, 
    loading 
  } = useData();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    product_id: '',
    movement_type: 'IN',
    quantity: '',
    reference: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStockEntries();
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const result = await createStockEntry({
      ...formData,
      quantity: parseInt(formData.quantity)
    });

    if (result.success) {
      setFormData({ product_id: '', movement_type: 'IN', quantity: '', reference: '' });
      setShowForm(false);
      fetchStockEntries();
    } else {
      setError(JSON.stringify(result.error));
    }
  };

  if (loading) {
    return <div style={{ padding: '20px' }}>Loading...</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <h1>Stock Entries</h1>
        <button 
          onClick={() => setShowForm(!showForm)}
          style={{
            padding: '10px 20px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          {showForm ? 'Cancel' : 'Add Stock Entry'}
        </button>
      </div>

      {showForm && (
        <div style={{ 
          marginBottom: '30px',
          padding: '20px',
          border: '1px solid #ddd',
          borderRadius: '8px',
          backgroundColor: '#f9f9f9'
        }}>
          <h2>Create Stock Entry</h2>

          {error && (
            <div style={{ 
              padding: '10px', 
              backgroundColor: '#ffebee', 
              border: '1px solid #f44336',
              borderRadius: '4px',
              marginBottom: '15px',
              color: '#c62828'
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Product *
              </label>
              <select
                name="product_id"
                value={formData.product_id}
                onChange={handleChange}
                required
                style={{ 
                  width: '100%', 
                  padding: '8px',
                  border: '1px solid #ccc',
                  borderRadius: '4px'
                }}
              >
                <option value="">Select a product</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name} ({product.sku})
                  </option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Movement Type *
              </label>
              <select
                name="movement_type"
                value={formData.movement_type}
                onChange={handleChange}
                required
                style={{ 
                  width: '100%', 
                  padding: '8px',
                  border: '1px solid #ccc',
                  borderRadius: '4px'
                }}
              >
                <option value="IN">Stock In</option>
                <option value="OUT">Stock Out</option>
              </select>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Quantity *
              </label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                min="1"
                required
                style={{ 
                  width: '100%', 
                  padding: '8px',
                  border: '1px solid #ccc',
                  borderRadius: '4px'
                }}
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Reference
              </label>
              <input
                type="text"
                name="reference"
                value={formData.reference}
                onChange={handleChange}
                placeholder="Invoice / PO / Adjustment reason"
                style={{ 
                  width: '100%', 
                  padding: '8px',
                  border: '1px solid #ccc',
                  borderRadius: '4px'
                }}
              />
            </div>

            <button 
              type="submit"
              style={{
                padding: '10px 20px',
                backgroundColor: '#2196F3',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Create Entry
            </button>
          </form>
        </div>
      )}

      {stockEntries.length === 0 ? (
        <p>No stock entries found.</p>
      ) : (
        <table style={{ 
          width: '100%', 
          borderCollapse: 'collapse'
        }}>
          <thead>
            <tr style={{ backgroundColor: '#f5f5f5' }}>
              <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>
                Date
              </th>
              <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>
                Product
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
            {stockEntries.map((entry) => (
              <tr key={entry.id}>
                <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                  {new Date(entry.created_at).toLocaleString()}
                </td>
                <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                  {entry.product}
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
  );
}

export default StockEntries;