import { useEffect, useState } from 'react';
import { useData } from '../context/DataContext';

function ProductSuppliers() {
  const {
    products,
    suppliers,
    fetchProducts,
    fetchSuppliers,
    fetchProductSuppliers,
    createProductSupplier,
    updateProductSupplier,
    deleteProductSupplier,
    loading,
  } = useData();

  const [productSuppliers, setProductSuppliers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    product: '',
    supplier: '',
    supply_price: '',
    lead_time_days: '',
    is_primary: false,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    await fetchProducts();
    await fetchSuppliers();
    const data = await fetchProductSuppliers();
    setProductSuppliers(data);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = editingId
      ? await updateProductSupplier(editingId, formData)
      : await createProductSupplier(formData);

    if (result.success) {
      setFormData({
        product: '',
        supplier: '',
        supply_price: '',
        lead_time_days: '',
        is_primary: false,
      });
      setShowForm(false);
      setEditingId(null);
      loadData();
    } else {
      alert('Error: ' + JSON.stringify(result.error));
    }
  };

  const handleEdit = (ps) => {
    setFormData({
      product: ps.product,
      supplier: ps.supplier,
      supply_price: ps.supply_price,
      lead_time_days: ps.lead_time_days,
      is_primary: ps.is_primary,
    });
    setEditingId(ps.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to remove this product-supplier relationship?')) {
      const result = await deleteProductSupplier(id);
      if (result.success) {
        loadData();
      } else {
        alert('Failed to delete: ' + result.error);
      }
    }
  };

  const handleCancel = () => {
    setFormData({
      product: '',
      supplier: '',
      supply_price: '',
      lead_time_days: '',
      is_primary: false,
    });
    setShowForm(false);
    setEditingId(null);
  };

  const getProductName = (productId) => {
    const product = products.find((p) => p.id === productId);
    return product ? `${product.name} (${product.sku})` : 'Unknown';
  };

  const getSupplierName = (supplierId) => {
    const supplier = suppliers.find((s) => s.id === supplierId);
    return supplier ? supplier.name : 'Unknown';
  };

  if (loading) {
    return <div style={{ padding: '20px' }}>Loading...</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
        }}
      >
        <h1>Product-Supplier Relationships</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{
            padding: '10px 20px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          {showForm ? 'Cancel' : 'Link Product to Supplier'}
        </button>
      </div>

      <p style={{ marginBottom: '20px', color: '#666' }}>
        Manage which suppliers provide which products, including pricing and delivery information.
      </p>

      {showForm && (
        <div
          style={{
            marginBottom: '30px',
            padding: '20px',
            border: '1px solid #ddd',
            borderRadius: '8px',
            backgroundColor: '#f9f9f9',
          }}
        >
          <h2>{editingId ? 'Edit Relationship' : 'Create New Relationship'}</h2>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Product *
              </label>
              <select
                name="product"
                value={formData.product}
                onChange={handleChange}
                required
                disabled={editingId}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
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
                Supplier *
              </label>
              <select
                name="supplier"
                value={formData.supplier}
                onChange={handleChange}
                required
                disabled={editingId}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                }}
              >
                <option value="">Select a supplier</option>
                {suppliers.map((supplier) => (
                  <option key={supplier.id} value={supplier.id}>
                    {supplier.name}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Supply Price ($) *
              </label>
              <input
                type="number"
                name="supply_price"
                value={formData.supply_price}
                onChange={handleChange}
                step="0.01"
                min="0"
                required
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                }}
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Lead Time (days) *
              </label>
              <input
                type="number"
                name="lead_time_days"
                value={formData.lead_time_days}
                onChange={handleChange}
                min="0"
                required
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                }}
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'flex', alignItems: 'center' }}>
                <input
                  type="checkbox"
                  name="is_primary"
                  checked={formData.is_primary}
                  onChange={handleChange}
                  style={{ marginRight: '8px' }}
                />
                <span style={{ fontWeight: 'bold' }}>Primary Supplier for this Product</span>
              </label>
              <p style={{ marginLeft: '28px', fontSize: '12px', color: '#666', marginTop: '5px' }}>
                Mark this as the main supplier for this product
              </p>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="submit"
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#2196F3',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                {editingId ? 'Update Relationship' : 'Create Relationship'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#9e9e9e',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {productSuppliers.length === 0 ? (
        <div style={{
          padding: '40px',
          textAlign: 'center',
          backgroundColor: '#f5f5f5',
          borderRadius: '8px'
        }}>
          <p style={{ fontSize: '18px', color: '#666' }}>
            No product-supplier relationships found. Create your first link!
          </p>
        </div>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f5f5f5' }}>
              <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>
                Product
              </th>
              <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>
                Supplier
              </th>
              <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>
                Supply Price
              </th>
              <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>
                Lead Time
              </th>
              <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>
                Primary
              </th>
              <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {productSuppliers.map((ps) => (
              <tr key={ps.id}>
                <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                  {getProductName(ps.product)}
                </td>
                <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                  {getSupplierName(ps.supplier)}
                </td>
                <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                  ₹{parseFloat(ps.supply_price).toFixed(2)}
                </td>
                <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                  {ps.lead_time_days} days
                </td>
                <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                  {ps.is_primary ? (
                    <span
                      style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        backgroundColor: '#4CAF50',
                        color: 'white',
                        fontSize: '12px',
                      }}
                    >
                      PRIMARY
                    </span>
                  ) : (
                    <span style={{ color: '#999' }}>-</span>
                  )}
                </td>
                <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                  <button
                    onClick={() => handleEdit(ps)}
                    style={{
                      padding: '4px 8px',
                      marginRight: '5px',
                      backgroundColor: '#FF9800',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(ps.id)}
                    style={{
                      padding: '4px 8px',
                      backgroundColor: '#f44336',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                    }}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div style={{ marginTop: '20px', textAlign: 'right' }}>
        <p style={{ color: '#666' }}>
          Total relationships: <strong>{productSuppliers.length}</strong>
        </p>
      </div>
    </div>
  );
}

export default ProductSuppliers;