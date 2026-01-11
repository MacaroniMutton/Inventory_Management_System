import { useEffect, useState } from 'react';
import { useData } from '../context/DataContext';
import { Link } from 'react-router-dom';

function ProductList() {
  const {
    products,
    fetchProducts,
    filterProductsByCategory,
    filterProductsBySupplier,
    deleteProduct,
    loading,
    categories,
    suppliers,
    fetchCategories,
    fetchSuppliers,
  } = useData();

  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState('');

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchSuppliers();
  }, []);

  const handleCategoryChange = async (e) => {
    const categoryId = e.target.value;
    setSelectedCategory(categoryId);

    if (categoryId && selectedSupplier) {
      await filterProductsByCategory(categoryId);
    } else if (categoryId) {
      await filterProductsByCategory(categoryId);
    } else if (selectedSupplier) {
      await filterroductsBySupplier(selectedSupplier);
    } else {
      fetchProducts();
    }
  };

  const handleSupplierChange = async (e) => {
    const supplierId = e.target.value;
    setSelectedSupplier(supplierId);

    if (supplierId && selectedCategory) {
      await filterProductsBySupplier(supplierId);
    } else if (supplierId) {
      await filterProductsBySupplier(supplierId);
    } else if (selectedCategory) {
      await filterProductsByCategory(selectedCategory);
    } else {
      fetchProducts();
    }
  };

  const handleClearFilters = () => {
    setSelectedCategory('');
    setSelectedSupplier('');
    fetchProducts();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      const result = await deleteProduct(id);
      if (result.success) {
        fetchProducts();
      } else {
        alert('Failed to delete product: ' + result.error);
      }
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
        <h1>Products</h1>
        <Link
          to="/products/new"
          style={{
            padding: '10px 20px',
            backgroundColor: '#4CAF50',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '4px',
            fontSize: '14px'
          }}
        >
          Add New Product
        </Link>
      </div>

      <div style={{ 
        display: 'flex', 
        gap: '12px', 
        marginBottom: '20px',
        padding: '15px',
        backgroundColor: '#f9f9f9',
        border: '1px solid #ddd',
        borderRadius: '8px'
      }}>
        <select 
          value={selectedCategory} 
          onChange={handleCategoryChange}
          style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', flex: 1 }}
        >
          <option value="">All Categories</option>
          {categories?.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        <select 
          value={selectedSupplier} 
          onChange={handleSupplierChange}
          style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', flex: 1 }}
        >
          <option value="">All Suppliers</option>
          {suppliers?.map((sup) => (
            <option key={sup.id} value={sup.id}>
              {sup.name}
            </option>
          ))}
        </select>

        <button 
          onClick={handleClearFilters}
          style={{
            padding: '8px 16px',
            backgroundColor: '#9e9e9e',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Clear
        </button>
      </div>

      {products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f5f5f5' }}>
              <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>SKU</th>
              <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Name</th>
              <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Category</th>
              <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Suppliers</th>
              <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Status</th>
              <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td style={{ padding: '12px', border: '1px solid #ddd' }}>{product.sku}</td>
                <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                  <Link to={`/products/${product.id}`} style={{ color: '#2196F3', textDecoration: 'none' }}>
                    {product.name}
                  </Link>
                </td>
                <td style={{ padding: '12px', border: '1px solid #ddd' }}>{product.category}</td>
                <td style={{ padding: '12px', border: '1px solid #ddd' }}>{product.suppliers?.join(', ') || 'None'}</td>
                <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    backgroundColor: product.is_active ? '#c8e6c9' : '#ffcdd2',
                    color: product.is_active ? '#2e7d32' : '#c62828'
                  }}>
                    {product.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                  <Link 
                    to={`/products/${product.id}/edit`}
                    style={{
                      padding: '4px 8px',
                      marginRight: '5px',
                      backgroundColor: '#FF9800',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      textDecoration: 'none',
                      fontSize: '13px',
                      display: 'inline-block'
                    }}
                  >
                    Edit
                  </Link>
                  <button 
                    onClick={() => handleDelete(product.id)}
                    style={{
                      padding: '4px 8px',
                      backgroundColor: '#f44336',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '13px'
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ProductList;