import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ProductContext } from "../ProductContext";
import { Link } from "react-router-dom";

// Function to categorize products based on price
const categorizeProductsByPrice = (products) => {
    if (products.length === 0) return { low: [], mid: [], high: [] };

    const prices = products.map(p => p.price).sort((a, b) => a - b);
    const midStartIndex = Math.floor(products.length * 0.3);
    const midEndIndex = Math.floor(products.length * 0.7);

    const midStartPrice = prices[midStartIndex];
    const midEndPrice = prices[midEndIndex];

    return {
        low: products.filter(p => p.price <= midStartPrice),
        mid: products.filter(p => p.price > midStartPrice && p.price <= midEndPrice),
        high: products.filter(p => p.price > midEndPrice)
    };
};

const MenuPage = () => {
    const navigate = useNavigate();
    const { products } = useContext(ProductContext);

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [sortOption, setSortOption] = useState("");

    const categories = [...new Set(products.map(product => product.category))];

    // Get price categories
    const categorizedProducts = categorizeProductsByPrice(products);

    let filteredProducts = products.filter(product =>
        (selectedCategory ? product.category === selectedCategory : true) &&
        (product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
         product.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (sortOption === "asc") {
        filteredProducts.sort((a, b) => a.price - b.price);
    } else if (sortOption === "desc") {
        filteredProducts.sort((a, b) => b.price - a.price);
    }

    // Function to get heart symbol based on price category
    const getHeartSymbol = (product) => {
        if (categorizedProducts.low.includes(product)) return "🩵"; // Blue heart for low price
        if (categorizedProducts.mid.includes(product)) return "💛"; // Yellow heart for mid price
        if (categorizedProducts.high.includes(product)) return "🩷"; // Pink heart for high price
        return "";
    };

    return (
        <div>
            <div className="menu-page">
                <h1 className="welcome-menu">Welcome to Pirate Café!</h1>
                <p className="menu-text">Thank you for choosing to visit our site!</p>
                <hr className="menu-divider" />
            </div>

            <div className="menu-container">
                <h2 className="menu-title">Menu</h2>
                <p className="menu-description">
                    Scroll through the menu or quickly search for a product by its name or description. <br />
                    Click on any product to go to its Product Detail page, where you can make any desired modifications, or add a new product to the menu!
                </p>

                <div className="search-filter-container">
                    <input className="search-bar"
                        type="text" 
                        placeholder="Search for a product..." 
                        value={searchTerm} 
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <select aria-label="filter by category" className="filter-dropdown" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                        <option value="">All Categories</option>
                        {categories.map(category => (
                            <option key={category} value={category}>{category}</option>
                        ))}
                    </select>
                    <select aria-label="sort by price" className="sort-dropdown" value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
                        <option value="">No sorting</option>
                        <option value="asc">Sort ascending by price</option>
                        <option value="desc">Sort descending by price</option>
                    </select>
                    <div className="add-from-menu">
                        <button className="add-product-btn" onClick={ () => navigate("/add")}>Add a new product →</button>
                    </div>
                </div>

                <div className="menu-grid">
                    {categories.map(category => {
                        const categoryProducts = filteredProducts.filter(product => product.category === category);
                        if (categoryProducts.length === 0) return null;
                        return (
                            <div key={category}>
                                <h3>{category}</h3>
                                <div className="product-list">
                                    {categoryProducts.map(product => (
                                        <div key={product.id} className="product-card">
                                            <Link to={`/product/${product.id}`} className="product-link">
                                                <img src={product.image} alt={product.name} />
                                                <h4>{product.name}</h4>
                                                <p>{product.description}</p>
                                                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%"  }}>
                                                    <strong data-testid="product-price">{product.price} €</strong>
                                                    <span style={{ marginLeft: "8px", fontSize: "1.2em" }}>
                                                        {getHeartSymbol(product)}
                                                    </span>
                                                </div>
                                            </Link>
                                            {/* <button>Add to cart</button> */}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default MenuPage;
