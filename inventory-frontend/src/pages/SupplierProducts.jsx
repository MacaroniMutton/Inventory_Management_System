import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useData } from '../context/DataContext';

function SupplierProducts() {
  const { id } = useParams();
  const { 
    fetchProductsBySupplier, 
    fetchSupplierById, 
    fetchProductSuppliers,
    loading 
  } = useData();
  const [products, setProducts] = useState([]);
  const [supplier, setSupplier] = useState(null);
  const [productSuppliers, setProductSuppliers] = useState({});

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    const supplierData = await fetchSupplierById(id);
    const productsData = await fetchProductsBySupplier(id);
    const relationshipsData = await fetchProductSuppliers();
    
    setSupplier(supplierData);
    setProducts(productsData);
    
    // Map product relationships for pricing info
    const relationshipMap = {};
    relationshipsData.forEach(rel => {
      if (rel.supplier === parseInt(id)) {
        relationshipMap[rel.product] = rel;
      }
    });
    setProductSuppliers(relationshipMap);
  };

  if (loading) {
    return <div style={{ padding: '20px' }}>Loading...</div>;
  }

  if (!supplier) {
    return <div style={{ padding: '20px' }}>Supplier not found.</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '20px' }}>
        <Link 
          to="/suppliers"
          style={{ color: '#2196F3', textDecoration: 'none' }}
        >
          ← Back to Suppliers
        </Link>
      </div>

      <div style={{ 
        marginBottom: '30px',
        padding: '20px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        backgroundColor: '#f9f9f9'
        }}>
        <h1>{supplier.name}</h1>

        <div
            style={{
            marginTop: '15px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
            }}
        >
            <p>
            <strong>Email:</strong> {supplier.email}
            </p>

            {supplier.phone && (
            <p>
                <strong>Phone:</strong> {supplier.phone}
            </p>
            )}

            <p>
            <strong>Status:</strong>{' '}
            <span
                style={{
                padding: '4px 8px',
                borderRadius: '4px',
                backgroundColor: supplier.is_active ? '#c8e6c9' : '#ffcdd2',
                color: supplier.is_active ? '#2e7d32' : '#c62828'
                }}
            >
                {supplier.is_active ? 'Active' : 'Inactive'}
            </span>
            </p>
        </div>
    </div>


      <h2>Products Supplied</h2>

      {products.length === 0 ? (
        <div style={{ 
          padding: '40px',
          textAlign: 'center',
          backgroundColor: '#f5f5f5',
          borderRadius: '8px',
          marginTop: '20px'
        }}>
          <p style={{ fontSize: '18px', color: '#666' }}>
            This supplier is not linked to any products yet.
          </p>
          <Link 
            to="/products"
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
            View All Products
          </Link>
        </div>
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
            {products.map((product) => {
              const relationship = productSuppliers[product.id];
              return (
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
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                    {relationship ? `$${relationship.supply_price}` : 'N/A'}
                  </td>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                    {relationship ? `${relationship.lead_time_days} days` : 'N/A'}
                  </td>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                    {relationship?.is_primary ? (
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        backgroundColor: '#4CAF50',
                        color: 'white',
                        fontSize: '12px'
                      }}>
                        PRIMARY
                      </span>
                    ) : (
                      <span style={{ color: '#999' }}>-</span>
                    )}
                  </td>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                    <Link 
                      to={`/products/${product.id}`}
                      style={{ 
                        color: '#2196F3',
                        textDecoration: 'none'
                      }}
                    >
                      View Product
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      <div style={{ marginTop: '20px', textAlign: 'right' }}>
        <p style={{ color: '#666' }}>
          Total products supplied: <strong>{products.length}</strong>
        </p>
      </div>
    </div>
  );
}

export default SupplierProducts;