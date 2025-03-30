import React, { createContext, useState, useEffect } from "react";
import axios from "axios";


export const ProductContext = createContext();

const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/products");
        setProducts(response.data.products);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // CRUD Operations - now using API calls
  const addProduct = async (newProduct) => {
    try {
      const response = await axios.post("http://localhost:5000/products", newProduct);
      setProducts([...products, response.data]);
    } catch (err) {
      console.error("Error adding product:", err);
    }
  };

  const updateProduct = async (updatedProduct) => {
    try {
      await axios.put(`http://localhost:5000/products/${updatedProduct.id}`, updatedProduct);
      setProducts(prevProducts => 
        prevProducts.map(p => p.id === updatedProduct.id ? updatedProduct : p)
      );
    } catch (err) {
      console.error("Error updating product:", err);
    }
  };

  const deleteProduct = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/products/${id}`);
      setProducts(prevProducts => prevProducts.filter(product => product.id !== id));
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };

  return (
    <ProductContext.Provider value={{ 
      products, 
      addProduct, 
      updateProduct, 
      deleteProduct,
      loading,
      error 
    }}>
      {children}
    </ProductContext.Provider>
  );
};

export default ProductProvider;