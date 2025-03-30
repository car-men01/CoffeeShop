import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    // State for product data
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    // Fetch product data from backend when component mounts
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`http://localhost:5000/products/${id}`);
                setProduct(response.data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching product:", err);
                setError("Failed to load product. It may have been deleted or does not exist.");
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    // Handle deletion
    const handleDelete = () => {
        setShowConfirmModal(true);
    };

    const confirmDelete = async () => {
        try {
            await axios.delete(`http://localhost:5000/products/${id}`);
            navigate("/menu");
        } catch (err) {
            console.error("Error deleting product:", err);
            alert("Failed to delete product. Please try again.");
        }
    };

    // Handle update
    const handleUpdate = async (updatedFields) => {
        try {
            // Send only the updated fields to the backend
            const updatedProduct = await axios.put(`http://localhost:5000/products/${id}`, updatedFields);
            setProduct(updatedProduct.data); // Update local state with returned data
            navigate("/menu");  // Redirect to menu after saving
        } catch (err) {
            console.error("Error updating product:", err);
            
            // Display error message from backend if available
            if (err.response && err.response.data && err.response.data.error) {
                alert(err.response.data.error);
            } else {
                alert("Failed to update product. Please try again.");
            }
        }
    };

    // Show loading state
    if (loading) return <div className="loading">Loading product details...</div>;
    
    // Show error state
    if (error) return <h2 className="product-not-found">{error}</h2>;
    
    // Show not found state
    if (!product) return <h2 className="product-not-found">Product not found</h2>;

    return (
        <div>
            <div className="title-detail">
                <h1 className="welcome-title-product">Welcome to {product.name} product detail page!</h1>
                <hr className="detail-devider" />
            </div>
            <div className="product-detail-container">
                <div className="delete-container">
                    <img className="product-image" src={`http://localhost:5000${product.image}`} alt={product.name} />
                    <div className="title-and-info">
                        <h2 className="delete-p-title">Delete the selected product</h2>
                        <div className="product-info">
                            <h1 className="product-title">{product.name}</h1>
                            <p className="product-category">Category: {product.category}</p>
                            <p data-testid="product-description" className="product-description">{product.description}</p>
                            <p className="product-price"><strong>{product.price} €</strong></p>
                            <button id="delete" className="delete-button" onClick={handleDelete}>Delete</button>
                        </div>
                    </div>
                </div>
                <hr className="detail-devider" />
                <div className="update-container">
                    <div className="title-and-form">
                        <h2 className="update-p-title">Edit the selected product</h2>
                        <UpdateForm product={product} onUpdate={handleUpdate} />
                    </div>
                    <img className="product-image" src={`http://localhost:5000${product.image}`} alt={product.name} />
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showConfirmModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <p className="modal-text">Are you sure you want to delete this product?</p>
                        <div className="modal-buttons">
                            <button id="delete" className="modal-delete-button" onClick={confirmDelete}>Delete</button>
                            <button className="modal-cancel-button" onClick={() => setShowConfirmModal(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const UpdateForm = ({ product, onUpdate }) => {
    const [formData, setFormData] = useState({
        name: product.name,
        price: product.price,
        description: product.description,
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Convert price to number for API
            const updatedData = {
                name: formData.name,
                price: parseFloat(formData.price),
                description: formData.description,
                category: product.category // Keep the original category
            };

            // Submit to parent component which handles the API call
            onUpdate(updatedData);
        } catch (err) {
            console.error("Error in form submission:", err);
        }
    };

    const handleCancel = () => {
        // Reset form to original product data
        setFormData({
            name: product.name,
            price: product.price,
            description: product.description,
        });
    };

    return (
        <form data-testid="product-form" className="update-form" onSubmit={handleSubmit}>
            <label aria-label="product name" htmlFor="product-name">Product name</label>
            <input 
                id="product-name" 
                aria-label="product name" 
                data-testid="product-name"
                className="form-input"
                name="name"
                value={formData.name}
                onChange={handleChange}
            />
            <label htmlFor="price">Price</label>
            <input 
                id="price" 
                data-testid="product-price"
                className="form-input"
                name="price"
                type="number"
                step="0.01"
                min="0.01"
                value={formData.price}
                onChange={handleChange}
            />
            <label htmlFor="description">Description</label>
            <textarea 
                id="description" 
                data-testid="product-desc"
                className="form-textarea"
                name="description"
                value={formData.description}
                onChange={handleChange}
            />
            <button data-testid="save" id="save" className="form-button" type="submit">Save changes</button>
            <button className="form-button cancel-button" type="button" onClick={handleCancel}>Cancel</button>
        </form>
    );
};

export default ProductDetail;
