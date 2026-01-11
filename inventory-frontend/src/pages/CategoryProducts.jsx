import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useData } from '../context/DataContext';

function CategoryProducts() {
  const { id } = useParams();
  const { fetchProductsByCategory, fetchCategoryById, loading } = useData();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(null);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    const categoryData = await fetchCategoryById(id);
    const productsData = await fetchProductsByCategory(id);
    
    setCategory(categoryData);
    setProducts(productsData);
  };

  if (loading) {
    return <div style={{ padding: '20px' }}>Loading...</div>;
  }

  if (!category) {
    return <div style={{ padding: '20px' }}>Category not found.</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '20px' }}>
        <Link 
          to="/categories"
          style={{ color: '#2196F3', textDecoration: 'none' }}
        >
          ← Back to Categories
        </Link>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h1>Products in Category: {category.name}</h1>
        {category.description && (
          <p style={{ color: '#666', marginTop: '10px' }}>
            {category.description}
          </p>
        )}
      </div>

      {products.length === 0 ? (
        <div style={{ 
          padding: '40px',
          textAlign: 'center',
          backgroundColor: '#f5f5f5',
          borderRadius: '8px'
        }}>
          <p style={{ fontSize: '18px', color: '#666' }}>
            No products found in this category.
          </p>
          <Link 
            to="/products/new"
            style={{
              display: 'inline-block',
              marginTop: '20px',
              padding: '10px 20px',
              backgroundColor: '#4CAF50',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '4px'
            }}
          >
            Add First Product
          </Link>
        </div>
      ) : (
        <table style={{ 
          width: '100%', 
          borderCollapse: 'collapse'
        }}>
          <thead>
            <tr style={{ backgroundColor: '#f5f5f5' }}>
              <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>
                SKU
              </th>
              <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>
                Name
              </th>
              <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>
                Description
              </th>
              <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>
                Suppliers
              </th>
              <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>
                Status
              </th>
              <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                  {product.sku}
                </td>
                <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                  {product.name}
                </td>
                <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                  {product.description || 'N/A'}
                </td>
                <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                  {product.suppliers.join(', ') || 'None'}
                </td>
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
                    to={`/products/${product.id}`}
                    style={{ 
                      marginRight: '10px',
                      color: '#2196F3',
                      textDecoration: 'none'
                    }}
                  >
                    View
                  </Link>
                  <Link 
                    to={`/products/${product.id}/edit`}
                    style={{ 
                      color: '#FF9800',
                      textDecoration: 'none'
                    }}
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div style={{ marginTop: '20px', textAlign: 'right' }}>
        <p style={{ color: '#666' }}>
          Total products: <strong>{products.length}</strong>
        </p>
      </div>
    </div>
  );
}

export default CategoryProducts;