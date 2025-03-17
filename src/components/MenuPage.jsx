// import React, { useState, useContext } from "react";
// import { useNavigate } from "react-router-dom";
// import { ProductContext } from "../ProductContext";
// import { Link } from "react-router-dom";

// const MenuPage = () => {
//     const navigate = useNavigate();
//     const { products } = useContext(ProductContext);

//     // State for search, category filter, and sorting
//     const [searchTerm, setSearchTerm] = useState("");
//     const [selectedCategory, setSelectedCategory] = useState("");  // perform a unit test for this
//     const [sortOption, setSortOption] = useState("");

//     // perform unit test for the category dropdown (verify that the expected output is the same as the actual output)
//     // Get unique categories from products
//     const categories = [...new Set(products.map(product => product.category))];

//     // Filtered products based on search and category
//     let filteredProducts = products.filter(product =>
//         (selectedCategory ? product.category === selectedCategory : true) &&
//         (product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//          product.description.toLowerCase().includes(searchTerm.toLowerCase()))
//     );

//     // Sorting logic
//     if (sortOption === "asc") {
//         filteredProducts.sort((a, b) => a.price - b.price);
//     } else if (sortOption === "desc") {
//         filteredProducts.sort((a, b) => b.price - a.price);
//     }

//     return (
//     <div>
//         <div className="menu-page">
//             <h1 className="welcome-menu">Welcome to Pirate Café!</h1>
//             <p className="menu-text">Thank you for choosing to visit our site!</p>
//             <hr className="menu-divider" />
//         </div>

//         <div className="menu-container">
//             <h2 className="menu-title">Menu</h2>
//             <p className="menu-description">
//             Scroll through the menu or quickly search for a product by its name or description. <br />
//             Click on any product to go to its Product Detail page, where you can make any desired modifications, or add a new product to the menu!</p>

//             <div className="search-filter-container">
//                 <input className="search-bar"
//                     type="text" 
//                     placeholder="Search for a product..." 
//                     value={searchTerm} 
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                 />
//                 <select className="filter-dropdown" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
//                     <option value="">All Categories</option>
//                     {categories.map(category => (
//                         <option key={category} value={category}>{category}</option>
//                     ))}
//                 </select>
//                 <select className="sort-dropdown" value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
//                     <option value="">No sorting</option>
//                     <option value="asc">Sort ascending by price</option>
//                     <option value="desc">Sort descending by price</option>
//                 </select>
//                 <div className="add-from-menu">
//                 <button className="add-product-btn" onClick={ () => navigate("/add")}>Add a new product →</button>
//             </div>
//             </div>
//             <div className="menu-grid">
//             {categories.map(category => (
//                     <div key={category}>
//                         <h3>{category}</h3>
//                         <div className="product-list">
//                             {filteredProducts
//                                 .filter(product => product.category === category)
//                                 .map(product => (
//                                     <div key={product.id} className="product-card">
//                                         <Link to={`/product/${product.id}`} className="product-link">
//                                             <img src={product.image} alt={product.name} />
//                                             <h4>{product.name}</h4>
//                                             <p>{product.description}</p>
//                                             <p><strong>{product.price} €</strong></p>
//                                         </Link>
//                                         <button>Add to cart</button>
//                                     </div>
//                                 ))}
//                         </div>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     </div>
//   );
// };

// export default MenuPage;

import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ProductContext } from "../ProductContext";
import { Link } from "react-router-dom";

const MenuPage = () => {
    const navigate = useNavigate();
    const { products } = useContext(ProductContext);

    // State for search, category filter, and sorting
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");  // perform a unit test for this
    const [sortOption, setSortOption] = useState("");

    // perform unit test for the category dropdown (verify that the expected output is the same as the actual output)
    // Get unique categories from products
    const categories = [...new Set(products.map(product => product.category))];

    // Filtered products based on search and category
    let filteredProducts = products.filter(product =>
        (selectedCategory ? product.category === selectedCategory : true) &&
        (product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
         product.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    // Sorting logic
    if (sortOption === "asc") {
        filteredProducts.sort((a, b) => a.price - b.price);
    } else if (sortOption === "desc") {
        filteredProducts.sort((a, b) => b.price - a.price);
    }

    // Test function for category filtering
    function testCategoryFiltering() {
        const testProducts = [
            { id: 1, name: "Espresso", category: "Classic Coffee", price: 5 },
            { id: 2, name: "Americano", category: "Classic Coffee", price: 3.9 },
            { id: 3, name: "Cappuccino", category: "Classic Coffee", price: 6.2 },
            { id: 4, name: "The Captain's Quartet", category: "Specialty Drinks", price: 8.3 },
            { id: 5, name: "Kraken's Iced Coffee", category: "Specialty Drinks", price: 3 },
            { id: 6, name: "Dead Man's Drip", category: "Specialty Drinks", price: 3.2 },
            { id: 7, name: "Shiver Me Cold Brew", category: "Cold Brews", price: 21 },
            { id: 8, name: "Frappuccino", category: "Cold Brews", price: 2 },
            { id: 9, name: "Ice Latte", category: "Cold Brews", price: 11 },
            { id: 10, name: "Under The Water Tea", category: "Teas", price: 7.7 },
            { id: 11, name: "Mermaid's Chai", category: "Teas", price: 9.9 },
            { id: 12, name: "Stormy Earl Grey", category: "Teas", price: 8.5 }
        ];

        const selectedCategoryTest = "Teas";
        const filteredTestProducts = testProducts.filter(product => product.category === selectedCategoryTest);

        console.log("Filtered Products for category 'Teas':", filteredTestProducts);

        const expectedProducts = [
            { id: 10, name: "Under The Water Tea", category: "Teas", price: 7.7 },
            { id: 11, name: "Mermaid's Chai", category: "Teas", price: 9.9 },
            { id: 12, name: "Stormy Earl Grey", category: "Teas", price: 8.5 }
        ];

        console.assert(
            JSON.stringify(filteredTestProducts) === JSON.stringify(expectedProducts),
            "Category filtering test failed"
        );

    }

    testCategoryFiltering();
    

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
            Click on any product to go to its Product Detail page, where you can make any desired modifications, or add a new product to the menu!</p>

            <div className="search-filter-container">
                <input className="search-bar"
                    type="text" 
                    placeholder="Search for a product..." 
                    value={searchTerm} 
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select className="filter-dropdown" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                    <option value="">All Categories</option>
                    {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                    ))}
                </select>
                <select className="sort-dropdown" value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
                    <option value="">No sorting</option>
                    <option value="asc">Sort ascending by price</option>
                    <option value="desc">Sort descending by price</option>
                </select>
                <div className="add-from-menu">
                <button className="add-product-btn" onClick={ () => navigate("/add")}>Add a new product →</button>
            </div>
            </div>
            <div className="menu-grid">
            {categories.map(category => (
                    <div key={category}>
                        <h3>{category}</h3>
                        <div className="product-list">
                            {filteredProducts
                                .filter(product => product.category === category)
                                .map(product => (
                                    <div key={product.id} className="product-card">
                                        <Link to={`/product/${product.id}`} className="product-link">
                                            <img src={product.image} alt={product.name} />
                                            <h4>{product.name}</h4>
                                            <p>{product.description}</p>
                                            <p><strong>{product.price} €</strong></p>
                                        </Link>
                                        <button>Add to cart</button>
                                    </div>
                                ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
  );
};

export default MenuPage;
