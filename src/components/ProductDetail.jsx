import React, { useContext, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ProductContext } from "../ProductContext";

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { products, setProducts } = useContext(ProductContext);

    const { deleteProduct } = useContext(ProductContext); // Get delete function from context
    const { updateProduct } = useContext(ProductContext); // Get update function from context

    const [showConfirmModal, setShowConfirmModal] = useState(false); // State for delete confirmation modal

    // With this more flexible product finding approach:
    const findProduct = () => {
        // First try to find by direct match (for string IDs with prefixes like "gen_31")
        let foundProduct = products.find(p => p.id === id);
        
        // Then try numeric comparison (for regular numeric IDs)
        if (!foundProduct) {
            // Try to parse the ID as a number, but only if it doesn't have a prefix
            if (!id.includes('_')) {
                const numericId = parseInt(id);
                foundProduct = products.find(p => p.id === numericId);
            }
        }
        
        // Try to find in generated products cache if available
        if (!foundProduct && window.generatedProductsCache) {
            const cachedProducts = window.generatedProductsCache.getAll();
            foundProduct = cachedProducts.find(p => p.id === id);
        }
        
        return foundProduct;
    };

    const product = findProduct();

    //const product = products.find(p => p.id === parseInt(id));

    if (!product) return <h2 className="product-not-found">Product not found</h2>;

    const handleDelete = () => {
        setShowConfirmModal(true); // Show confirmation modal
    };

    const confirmDelete = () => {
        deleteProduct(parseInt(id)); 
        navigate("/menu");  // Redirect to menu after deleting
    };

    const handleUpdate = (updatedFields) => {
        const updatedProduct = { ...product, ...updatedFields };
        updateProduct(updatedProduct);
        navigate("/menu");  // Redirect to menu after saving
    };

    return (
        <div>
            <div className="title-detail">
                <h1 className="welcome-title-product">Welcome to {product.name} product detail page!</h1>
                <hr className="detail-devider" />
            </div>
            <div className="product-detail-container">
                <div className="delete-container">
                    <img className="product-image" src={product.image} alt={product.name} />
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
                    <img className="product-image" src={product.image} alt={product.name} />
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

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Trim input values to avoid leading/trailing spaces
        const name = formData.name.trim();
        const price = formData.price.trim();
        const description = formData.description.trim();

        // Check if all fields are filled
        if (!name || !price || !description) {
            alert("Please fill in all fields!");
            return;
        }

        // Check if name and description are at least 3 characters long
        if (name.length < 3) {
            alert("Product name must be at least 3 characters long!");
            return;
        }

        if (description.length < 3) {
            alert("Description must be at least 3 characters long!");
            return;
        }

        // Validate price: should be a valid float
        const parsedPrice = parseFloat(price);
        if (isNaN(parsedPrice) || parsedPrice <= 0) {
            alert("Please enter a valid price (e.g., 5 or 4.99)!");
            return;
        }

        // Ensure name contains only letters and symbols (no numbers)
        const containsNumbers = (str) => str.split("").some(char => !isNaN(char) && char !== " ");
        if (containsNumbers(name)) {
            alert("Product name must only contain letters and symbols, no numbers!");
            return;
        }

        // If all checks pass, update the product
        onUpdate({ name, price: parsedPrice, description });
    };

    const handleCancel = () => {
        // Reset the form to the original product data
        setFormData({
            name: product.name,
            price: product.price,
            description: product.description,
        });
    };

    return (
        <form data-testid="product-form" className="update-form" onSubmit={handleSubmit}>
            <label aria-label="product name" htmlFor="product-name">Product name</label>
            <input id="product-name" aria-label="product name" data-testid="product-name"
                className="form-input"
                name="name"
                value={formData.name}
                onChange={handleChange}
            />
            <label htmlFor="price">Price</label>
            <input id="price" data-testid="product-price"
                className="form-input"
                name="price"
                value={formData.price}
                onChange={handleChange}
            />
            <label htmlFor="description">Description</label>
            <textarea id="description" data-testid="product-desc"
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
