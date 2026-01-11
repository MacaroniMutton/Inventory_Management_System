import { createContext, useState, useContext } from 'react';
import api from '../services/api';

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [stockEntries, setStockEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Products
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await api.get('/products/');
      setProducts(response.data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchLowStockProducts = async () => {
    setLoading(true);
    try {
      const response = await api.get('/products/low-stock/');
      return response.data;
    } catch (err) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const fetchProductById = async (id) => {
    setLoading(true);
    try {
      const response = await api.get(`/products/${id}/`);
      setError(null);
      return response.data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const fetchProductsBySupplier = async (supplierId) => {
    setLoading(true);
    try {
      const response = await api.get(`/products/by-supplier/${supplierId}/`);
      setError(null);
      return response.data;
    } catch (err) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const filterProductsBySupplier = async (supplierId) => {
    setLoading(true);
    try {
        const response = await api.get(`/products/by-supplier/${supplierId}/`);
        setProducts(response.data);   // 🔴 important
    } catch (err) {
        setError(err.message);
    } finally {
        setLoading(false);
    }
    };

  const fetchProductsByCategory = async (categoryId) => {
    setLoading(true);
    try {
      const response = await api.get(`/products/by-category/${categoryId}/`);
      setError(null);
      return response.data;
    } catch (err) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const filterProductsByCategory = async (categoryId) => {
    setLoading(true);
    try {
        const response = await api.get(`/products/by-category/${categoryId}/`);
        setProducts(response.data);   // 🔴 important
    } catch (err) {
        setError(err.message);
    } finally {
        setLoading(false);
    }
    };

  const fetchStockHistory = async (productId) => {
    setLoading(true);
    try {
      const response = await api.get(`/products/${productId}/stock-history/`);
      setError(null);
      return response.data;
    } catch (err) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const createProduct = async (productData) => {
    setLoading(true);
    try {
      const response = await api.post('/products/', productData);
      setProducts([...products, response.data]);
      setError(null);
      return { success: true, data: response.data };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.response?.data };
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (id, productData) => {
    setLoading(true);
    try {
      const response = await api.put(`/products/${id}/`, productData);
      setProducts(products.map(p => p.id === id ? response.data : p));
      setError(null);
      return { success: true, data: response.data };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.response?.data };
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    setLoading(true);
    try {
      await api.delete(`/products/${id}/`);
      setProducts(products.filter(p => p.id !== id));
      setError(null);
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Categories
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await api.get('/categories/');
      setCategories(response.data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategoryById = async (id) => {
    setLoading(true);
    try {
      const response = await api.get(`/categories/${id}/`);
      setError(null);
      return response.data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createCategory = async (categoryData) => {
    setLoading(true);
    try {
      const response = await api.post('/categories/', categoryData);
      setCategories([...categories, response.data]);
      setError(null);
      return { success: true, data: response.data };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.response?.data };
    } finally {
      setLoading(false);
    }
  };

  const updateCategory = async (id, categoryData) => {
    setLoading(true);
    try {
      const response = await api.put(`/categories/${id}/`, categoryData);
      setCategories(categories.map(c => c.id === id ? response.data : c));
      setError(null);
      return { success: true, data: response.data };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.response?.data };
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async (id) => {
    setLoading(true);
    try {
      await api.delete(`/categories/${id}/`);
      setCategories(categories.filter(c => c.id !== id));
      setError(null);
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Suppliers
  const fetchSuppliers = async () => {
    setLoading(true);
    try {
      const response = await api.get('/suppliers/');
      setSuppliers(response.data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchSupplierById = async (id) => {
    setLoading(true);
    try {
      const response = await api.get(`/suppliers/${id}/`);
      setError(null);
      return response.data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createSupplier = async (supplierData) => {
    setLoading(true);
    try {
      const response = await api.post('/suppliers/', supplierData);
      setSuppliers([...suppliers, response.data]);
      setError(null);
      return { success: true, data: response.data };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.response?.data };
    } finally {
      setLoading(false);
    }
  };

  const updateSupplier = async (id, supplierData) => {
    setLoading(true);
    try {
      const response = await api.put(`/suppliers/${id}/`, supplierData);
      setSuppliers(suppliers.map(s => s.id === id ? response.data : s));
      setError(null);
      return { success: true, data: response.data };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.response?.data };
    } finally {
      setLoading(false);
    }
  };

  const deleteSupplier = async (id) => {
    setLoading(true);
    try {
      await api.delete(`/suppliers/${id}/`);
      setSuppliers(suppliers.filter(s => s.id !== id));
      setError(null);
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Product-Supplier relationships
  const fetchProductSuppliers = async (productId = null) => {
    setLoading(true);
    try {
      const url = productId 
        ? `/product-suppliers/?product=${productId}`
        : '/product-suppliers/';
      const response = await api.get(url);
      setError(null);
      return response.data;
    } catch (err) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const createProductSupplier = async (data) => {
    setLoading(true);
    try {
      const response = await api.post('/product-suppliers/', data);
      setError(null);
      return { success: true, data: response.data };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.response?.data };
    } finally {
      setLoading(false);
    }
  };

  const updateProductSupplier = async (id, data) => {
    setLoading(true);
    try {
      const response = await api.put(`/product-suppliers/${id}/`, data);
      setError(null);
      return { success: true, data: response.data };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.response?.data };
    } finally {
      setLoading(false);
    }
  };

  const deleteProductSupplier = async (id) => {
    setLoading(true);
    try {
      await api.delete(`/product-suppliers/${id}/`);
      setError(null);
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Stock Entries
  const fetchStockEntries = async () => {
    setLoading(true);
    try {
      const response = await api.get('/stock-entries/');
      setStockEntries(response.data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createStockEntry = async (entryData) => {
    setLoading(true);
    try {
      const response = await api.post('/stock-entries/', entryData);
      setStockEntries([response.data, ...stockEntries]);
      setError(null);
      return { success: true, data: response.data };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.response?.data };
    } finally {
      setLoading(false);
    }
  };

  // Inventory Summary
  const fetchInventorySummary = async () => {
    setLoading(true);
    try {
      const response = await api.get('/stats/inventory-summary/');
      setError(null);
      return response.data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return (
    <DataContext.Provider
      value={{
        products,
        categories,
        suppliers,
        stockEntries,
        loading,
        error,
        fetchProducts,
        fetchLowStockProducts,
        fetchProductById,
        fetchProductsBySupplier,
        fetchProductsByCategory,
        fetchStockHistory,
        createProduct,
        updateProduct,
        deleteProduct,
        fetchCategories,
        fetchCategoryById,
        createCategory,
        updateCategory,
        deleteCategory,
        fetchSuppliers,
        fetchSupplierById,
        createSupplier,
        updateSupplier,
        deleteSupplier,
        fetchProductSuppliers,
        createProductSupplier,
        updateProductSupplier,
        deleteProductSupplier,
        fetchStockEntries,
        createStockEntry,
        fetchInventorySummary,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};