import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";

const MenuPage = () => {
    const navigate = useNavigate();
    const scrollPosition = useRef(0); // Track scroll position
    
    // State for products and filters
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [sortOption, setSortOption] = useState("");
    const [itemsPerPage, setItemsPerPage] = useState(6);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalProducts, setTotalProducts] = useState(0);
    const [allCategories, setAllCategories] = useState([]);
    const [categoryOrder] = useState(["Classic Coffee", "Specialty Drinks", "Cold Brews", "Teas"]);
    const [loading, setLoading] = useState(false); // Start without loading
    const [error, setError] = useState(null);

    // Debounce search term
    useEffect(() => {
        const timerId = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 300);
        
        return () => clearTimeout(timerId);
    }, [searchTerm]);

    // Reset to first page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [debouncedSearchTerm, selectedCategory, sortOption, itemsPerPage]);

    // Fetch all categories once at component mount
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get("http://localhost:5000/products/categories");
                setAllCategories(response.data);
            } catch (error) {
                console.error("Error fetching categories:", error);
                // Don't set error state for categories - just log it
            }
        };
        
        fetchCategories();
    }, []);

    // Fetch products when filters or pagination change
    useEffect(() => {
        // Save current scroll position before fetching
        if (!loading) {
            scrollPosition.current = window.scrollY;
        }
        
        const fetchProducts = async () => {
            try {
                setLoading(true);
                
                const response = await axios.get("http://localhost:5000/products", {
                    params: {
                        search: debouncedSearchTerm,
                        category: selectedCategory,
                        sort: sortOption,
                        limit: itemsPerPage,
                        page: currentPage
                    }
                });
                
                setProducts(response.data.products || []);
                setTotalProducts(response.data.total || 0);
                
                setLoading(false);
                
                // Restore scroll position for searches but not page changes
                if (debouncedSearchTerm !== "" && !loading) {
                    setTimeout(() => {
                        window.scrollTo(0, scrollPosition.current);
                    }, 10);
                }
                
            } catch (error) {
                console.error("Error fetching products:", error);
                setError("Failed to load products");
                setLoading(false);
            }
        };
        
        fetchProducts();
    }, [debouncedSearchTerm, selectedCategory, sortOption, currentPage, itemsPerPage]);

    // Handle page change
    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // Group products by category for display
    // const getGroupedProducts = () => {
    //     const grouped = {};
        
    //     // Group products by category
    //     products.forEach(product => {
    //         if (!grouped[product.category]) {
    //             grouped[product.category] = [];
    //         }
    //         grouped[product.category].push(product);
    //     });
        
    //     return grouped;
    // };

    // Group products by category for display
    const getGroupedProducts = () => {
      const grouped = {};
      
      // Initialize with all categories (even empty ones) in the right order
      categoryOrder.forEach(category => {
          grouped[category] = [];
      });
      
      // Group products by category
      products.forEach(product => {
          if (!grouped[product.category]) {
              grouped[product.category] = [];
          }
          grouped[product.category].push(product);
      });
      
      // Remove empty categories and order by categoryOrder
      const result = {};
      
      // First add categories in our predefined order
      categoryOrder.forEach(category => {
          if (grouped[category] && grouped[category].length > 0) {
              result[category] = grouped[category];
          }
      });
      
      // Then add any other categories (that weren't in our predefined order)
      Object.keys(grouped).forEach(category => {
          if (!categoryOrder.includes(category) && grouped[category].length > 0) {
              result[category] = grouped[category];
          }
      });
      
      return result;
    };

    const groupedProducts = getGroupedProducts();
    const totalPages = Math.ceil(totalProducts / itemsPerPage);

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
                    <input
                        className="search-bar"
                        type="text"
                        placeholder="Search for a product..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <select
                        aria-label="filter by category"
                        className="filter-dropdown"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                        <option value="">All Categories</option>
                        {allCategories.map((category) => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>
                    <select
                        aria-label="sort by price"
                        className="sort-dropdown"
                        value={sortOption}
                        onChange={(e) => setSortOption(e.target.value)}
                    >
                        <option value="">No sorting</option>
                        <option value="asc">Sort ascending by price</option>
                        <option value="desc">Sort descending by price</option>
                    </select>
                    <select
                        aria-label="items per page"
                        className="items-per-page-dropdown"
                        value={itemsPerPage}
                        onChange={(e) => setItemsPerPage(Number(e.target.value))}
                    >
                        <option value={6}>6 items</option>
                        <option value={9}>9 items</option>
                        <option value={12}>12 items</option>
                        <option value={15}>15 items</option>
                    </select>
                    <div className="button-group">
                        <button className="add-product-btn" onClick={() => navigate("/add")}>
                            Add a product →
                        </button>
                    </div>
                </div>

                <div className="product-container">
                    {loading && products.length === 0 ? (
                        <div className="loading">Loading...</div>
                    ) : error ? (
                        <div className="error-message">{error}</div>
                    ) : Object.keys(groupedProducts).length === 0 ? (
                        <div className="no-results">No products found matching your criteria.</div>
                    ) : (
                        <div className="menu-grid">
                            {Object.keys(groupedProducts).map(category => (
                                <div key={category}>
                                    <h3>{category}</h3>
                                    <div className="product-list">
                                        {groupedProducts[category].map(product => (
                                            <div key={product.id} className="product-card">
                                                <Link to={`/product/${encodeURIComponent(product.id)}`} className="product-link">
                                                    <img 
                                                        src={`http://localhost:5000${product.image}`} 
                                                        alt={product.name} 
                                                        loading="lazy" 
                                                    />
                                                    <h4>{product.name}</h4>
                                                    <p>{product.description}</p>
                                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%" }}>
                                                        <strong data-testid="product-price">{product.price} €</strong>
                                                    </div>
                                                </Link>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {totalPages > 1 && (
                        <div className="pagination-container">
                            <button
                                className="pagination-button"
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                aria-label="Previous page"
                            >
                                &lt; Previous
                            </button>

                            <div className="pagination-numbers">
                                {[...Array(totalPages)].map((_, index) => (
                                    <button
                                        key={index}
                                        className={`pagination-number ${currentPage === index + 1 ? "active" : ""}`}
                                        onClick={() => handlePageChange(index + 1)}
                                        aria-label={`Page ${index + 1}`}
                                        aria-current={currentPage === index + 1 ? "page" : undefined}
                                    >
                                        {index + 1}
                                    </button>
                                ))}
                            </div>

                            <button
                                className="pagination-button"
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                aria-label="Next page"
                            >
                                Next &gt;
                            </button>
                        </div>
                    )}
                    
                    {products.length > 0 && (
                        <div className="pagination-info">
                            Showing {(currentPage - 1) * itemsPerPage + 1}-
                            {Math.min(currentPage * itemsPerPage, totalProducts)} of {totalProducts} products
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MenuPage;