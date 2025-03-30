import React, { useState, useContext, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ProductContext } from "../ProductContext";
import { Link } from "react-router-dom";
import './AddPage.jsx';
import './ProductDetail.jsx';
import { faker } from '@faker-js/faker';
import espressoImg from "../assets/espresso.jpg";
import cappuccinoImg from "../assets/cappuccino.webp";
import americanoImg from "../assets/americano.png";
import captainsQuartetImg from "../assets/captains_quartet.jpg";
import krakensIcedImg from "../assets/kraken_iced.jpg";
import deadMansDripImg from "../assets/dead_mans_drip.jpg";
import shiverMeColdBrewImg from "../assets/shiver_me_cold_brew.jpg";
import frappuccinoImg from "../assets/frappuccino.jpg";
import icelatteImg from "../assets/ice_latte.jpg";
import underTheWaterImg from "../assets/under_the_water_tea.jpg";
import mermaidsChaiImg from "../assets/mermaids_chai.webp";
import stormyEarlGreyImg from "../assets/stormy_earl_grey.jpg";
import mochaImg from "../assets/mocha.jpg";
import flatWhiteImg from "../assets/flat_white.jpg";
import macchiatoImg from "../assets/macchiato.jpg";
import turkishCoffeeImg from "../assets/turkish_coffee.jpg";
import irishCoffeeImg from "../assets/irish_coffee.jpg";
import viennaCoffeeImg from "../assets/vienna_coffee.jpg";
import buccaneersBrewImg from "../assets/buccaneers_brew.jpg";
import jollyRogerJavaImg from "../assets/jolly_roger_java.jpg";
import seaWitchsLatteImg from "../assets/sea_witchs_latte.jpg";
import coconutImg from "../assets/coconut_coffee.jpg";

// Add these imports at the top of your file
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    PointElement,
    LineElement
  } from 'chart.js';
  import { Bar, Pie, Line } from 'react-chartjs-2';
  
  // Register ChartJS components
  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    PointElement,
    LineElement
  );
  

let nextProductId = 31;

// Component for Category Bar Chart
const CategoryBarChart = ({ products }) => {
    // Get counts of products by category
    const categories = [...new Set(products.map(p => p.category))];
    const categoryCounts = categories.map(category => 
      products.filter(p => p.category === category).length
    );
    
    const data = {
      labels: categories,
      datasets: [
        {
          label: 'Number of Products',
          data: categoryCounts,
          backgroundColor: [
            'rgba(75, 192, 192, 0.6)',
            'rgba(153, 102, 255, 0.6)',
            'rgba(255, 159, 64, 0.6)',
            'rgba(54, 162, 235, 0.6)',
          ],
          borderColor: [
            'rgb(75, 192, 192)',
            'rgb(153, 102, 255)',
            'rgb(255, 159, 64)',
            'rgb(54, 162, 235)',
          ],
          borderWidth: 1,
        },
      ],
    };
    
    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Products by Category',
          font: {
            size: 16
          }
        },
      },
    };
    
    return (
      <div style={{ height: '200px' }}>
        <Bar data={data} options={options} />
      </div>
    );
  };
  
  // Component for Price Distribution Pie Chart
  const PriceDistributionChart = ({ categorizedProducts }) => {
    const data = {
      labels: ['Low Price', 'Medium Price', 'High Price'],
      datasets: [
        {
          data: [
            categorizedProducts.low.length, 
            categorizedProducts.mid.length, 
            categorizedProducts.high.length
          ],
          backgroundColor: [
            'rgba(135, 206, 250, 0.7)', // Light blue
            'rgba(255, 255, 0, 0.7)',    // Yellow
            'rgba(255, 182, 193, 0.7)',  // Pink
          ],
          borderColor: [
            'rgb(135, 206, 250)',
            'rgb(255, 255, 0)',
            'rgb(255, 182, 193)',
          ],
          borderWidth: 1,
        },
      ],
    };
    
    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right',
        },
        title: {
          display: true,
          text: 'Price Distribution',
          font: {
            size: 16
          }
        },
      },
    };
    
    return (
      <div style={{ height: '200px' }}>
        <Pie data={data} options={options} />
      </div>
    );
  };
  
  // Component for Price Range Line Chart
  const PriceRangeChart = ({ products }) => {
    // Skip if no products
    if (products.length === 0) {
      return <div>No data available</div>;
    }
    
    // Get min and max prices, rounded to nearest integers
    const prices = products.map(p => p.price);
    const minPrice = Math.floor(Math.min(...prices));
    const maxPrice = Math.ceil(Math.max(...prices));
    
    // Create price ranges (e.g., 2-3, 3-4, etc.)
    const ranges = [];
    const rangeCounts = [];
    
    for (let i = minPrice; i < maxPrice; i++) {
      ranges.push(`${i}-${i+1}`);
      rangeCounts.push(products.filter(p => p.price >= i && p.price < i+1).length);
    }
    
    const data = {
      labels: ranges,
      datasets: [
        {
          label: 'Number of Products',
          data: rangeCounts,
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
          tension: 0.1,
          fill: true,
        },
      ],
    };
    
    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Products by Price Range',
          font: {
            size: 16
          }
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            precision: 0
          }
        }
      }
    };
    
    return (
      <div style={{ height: '200px' }}>
        <Line data={data} options={options} />
      </div>
    );
  };

// This will store generated products across component mounts/unmounts
const generatedProductsCache = {
    products: [],
    add: function(product) {
      this.products.push(product);
    },
    getAll: function() {
      return [...this.products];
    },
    clear: function() {
      this.products = [];
    }
  };

  // Create a global variable to access generated products from other components
window.generatedProductsCache = generatedProductsCache;

  

// Coffee shop related words for more realistic product names
const coffeeRelatedWords = [
  'Espresso', 'Latte', 'Cappuccino', 'Mocha', 'Americano', 'Macchiato', 
  'Frappe', 'Cold Brew', 'Nitro', 'Decaf', 'Ristretto', 'Affogato',
  'Cortado', 'Flat White', 'Doppio', 'Lungo', 'Turkish', 'Irish', 
  'Caramel', 'Vanilla', 'Hazelnut', 'Cinnamon', 'Chocolate', 'Pumpkin Spice'
];


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

// Update your generateRandomProduct function to ensure ID is a string
const generateRandomProduct = () => {
    const categories = ["Classic Coffee", "Specialty Drinks", "Cold Brews", "Teas"];
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    
    // Get a random coffee-related word for the name
    const randomWord = coffeeRelatedWords[Math.floor(Math.random() * coffeeRelatedWords.length)];
    const productName = `${randomWord} ${faker.commerce.productAdjective()}`;
    
    // Random coffee image - fixed to use only the imported images
    const coffeeImages = [espressoImg, americanoImg, cappuccinoImg, mochaImg, flatWhiteImg, macchiatoImg, turkishCoffeeImg, irishCoffeeImg, viennaCoffeeImg, captainsQuartetImg, krakensIcedImg, deadMansDripImg
                        , shiverMeColdBrewImg, frappuccinoImg, icelatteImg, underTheWaterImg, mermaidsChaiImg, stormyEarlGreyImg, buccaneersBrewImg, jollyRogerJavaImg, seaWitchsLatteImg, coconutImg];
    const randomImage = coffeeImages[Math.floor(Math.random() * coffeeImages.length)];
    
    // Generate a plausible price between 2 and 25
    const price = parseFloat((Math.random() * 23 + 2).toFixed(2));
    
    // Generate a description related to coffee
    const descriptions = [
        `A delightful ${randomWord.toLowerCase()} with a hint of ${faker.commerce.productAdjective().toLowerCase()} flavor.`,
        `Our special ${randomWord.toLowerCase()} blend, perfect for ${faker.word.adjective()} mornings.`,
        `A rich and ${faker.word.adjective()} ${randomWord.toLowerCase()} that will energize your day.`,
        `This ${randomWord.toLowerCase()} comes with a smooth ${faker.commerce.productMaterial().toLowerCase()} finish.`,
        `A customer favorite! ${productName} with a touch of ${faker.commerce.productMaterial().toLowerCase()}.`
    ];
    
    // Generate a unique ID string by adding a unique prefix
    const uniqueId = `gen_${nextProductId++}`;
    
    return {
        id: uniqueId, 
        name: productName,
        category: randomCategory,
        price: price,
        image: randomImage,
        description: descriptions[Math.floor(Math.random() * descriptions.length)]
    };
};

const MenuPage = () => {
    const navigate = useNavigate();
    const { products: contextProducts, addProduct } = useContext(ProductContext);
    const [isGenerating, setIsGenerating] = useState(false);
    const generationThreadsRef = useRef([]);
    
    // Use a local state to track the original products plus generated ones
    // Initialize with both context products and any cached generated products
    const [localProducts, setLocalProducts] = useState(() => {
        return [...contextProducts, ...generatedProductsCache.getAll()];
    });
    
     // Update local products when context products change
     useEffect(() => {
        setLocalProducts([...contextProducts, ...generatedProductsCache.getAll()]);
    }, [contextProducts]);

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [sortOption, setSortOption] = useState("");
    
    // Pagination states
    const [itemsPerPage, setItemsPerPage] = useState(6);
    const [currentPage, setCurrentPage] = useState(1);
    
    // Simulated asynchronous product generation with multiple "threads"
    const startAsyncProductGeneration = () => {
        // Create multiple "threads" - each running at a different interval
        const thread1 = setInterval(() => {
            generateProductAsync(1);
        }, 1500);
        
        const thread2 = setInterval(() => {
            generateProductAsync(2);
        }, 3700);
        
        const thread3 = setInterval(() => {
            generateProductAsync(3);
        }, 2800);
        
        generationThreadsRef.current = [thread1, thread2, thread3];
    };
    

    // Update your generateProductAsync function
    const generateProductAsync = (threadId) => {
        // console.log(`Thread ${threadId} generating a product...`);
        
        // Simulate async work with setTimeout
        setTimeout(() => {
            // Generate product using the existing global nextProductId counter
            const newProduct = generateRandomProduct();
            generatedProductsCache.add(newProduct);
            addProduct(newProduct);
            setLocalProducts(prev => [...prev, newProduct]);
        }, Math.random() * 500);
    };

        
    // Toggle generation of random products
    const toggleGeneration = () => {
        if (isGenerating) {
            // Stop generation - clear all threads
            generationThreadsRef.current.forEach(threadId => {
                clearInterval(threadId);
            });
            generationThreadsRef.current = [];
            setIsGenerating(false);
        } else {
            // Start generation
            setIsGenerating(true);
            startAsyncProductGeneration();
        }
    };
    
     // Cleanup intervals on unmount - but don't clear the products cache
     useEffect(() => {
        return () => {
            generationThreadsRef.current.forEach(threadId => {
                clearInterval(threadId);
            });
        };
    }, []);

    // Add a cleanup function that clears the cache when the page is refreshed
    useEffect(() => {
        const handleBeforeUnload = () => {
            generatedProductsCache.clear();
        };
        
        window.addEventListener('beforeunload', handleBeforeUnload);
        
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);

    // Get categories from local products (context + generated)
    const categories = useMemo(() => 
        [...new Set(localProducts.map(product => product.category))],
        [localProducts]
    );

    // Get price categories with memoization for performance
    const categorizedProducts = useMemo(() => 
        categorizeProductsByPrice(localProducts),
        [localProducts]
    );

    // Reset to first page when filters or items per page changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, selectedCategory, sortOption, itemsPerPage]);

    // Filter products but don't sort here - memoized for performance
    const filteredProducts = useMemo(() => 
        localProducts.filter(product =>
            (selectedCategory ? product.category === selectedCategory : true) &&
            (product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
             product.description.toLowerCase().includes(searchTerm.toLowerCase()))
        ),
        [localProducts, selectedCategory, searchTerm]
    );

    // Memoized pagination calculations for performance
    const totalFilteredProducts = filteredProducts.length;
    const totalPages = Math.ceil(totalFilteredProducts / itemsPerPage);

    // Function to get heart symbol based on price category
    const getHeartSymbol = (product) => {
        if (categorizedProducts.low.includes(product)) return "🩵"; // Blue heart for low price
        if (categorizedProducts.mid.includes(product)) return "💛"; // Yellow heart for mid price
        if (categorizedProducts.high.includes(product)) return "🩷"; // Pink heart for high price
        return "";
    };

    // Function to handle page changes
    const handlePageChange = (page) => {
        setCurrentPage(page);
        // Scroll to top when changing pages
        window.scrollTo({
            top: 0, 
            behavior: 'smooth'
        });
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
                        <button 
                            className={`generate-btn ${isGenerating ? 'active' : ''}`}
                            onClick={toggleGeneration}
                        >
                            {isGenerating ? "Stop Generating" : "Generate Products"}
                        </button>
                        <button 
                            className="add-product-btn" 
                            onClick={() => navigate("/add")}
                        >
                            Add a product →
                        </button>
                    </div>
                </div>

                {/* Generation status indicator and charts */}
                {isGenerating && (
                <div>
                    <div className="generation-indicator">
                    <p>Generating new products... {localProducts.length - contextProducts.length} added so far</p>
                    </div>
                    
                    <div className="charts-container" style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    marginTop: '20px',
                    marginBottom: '20px'
                    }}>
                    <div className="chart-box" style={{ flex: 1, margin: '0 10px' }}>
                        <CategoryBarChart products={localProducts} />
                    </div>
                    <div className="chart-box" style={{ flex: 1, margin: '0 10px' }}>
                        <PriceDistributionChart categorizedProducts={categorizedProducts} />
                    </div>
                    <div className="chart-box" style={{ flex: 1, margin: '0 10px' }}>
                        <PriceRangeChart products={localProducts} />
                    </div>
                    </div>
                </div>
                )}

                <div className="menu-grid">
                    {categories.map(category => {
                        // First filter by category
                        const categoryProducts = filteredProducts.filter(product => product.category === category);
                        if (categoryProducts.length === 0) return null;
                        
                        // Sort products within this category
                        let sortedCategoryProducts = [...categoryProducts];
                        if (sortOption === "asc") {
                            sortedCategoryProducts.sort((a, b) => a.price - b.price);
                        } else if (sortOption === "desc") {
                            sortedCategoryProducts.sort((a, b) => b.price - a.price);
                        }
                        
                        // Pagination logic - we need to adjust this since we're not using filteredProducts order
                        const startIndex = (currentPage - 1) * itemsPerPage;
                        const endIndex = Math.min(startIndex + itemsPerPage, totalFilteredProducts);
                        
                        // Calculate which products should be shown on this page
                        let allProductsSoFar = 0;
                        let productsToShowCount = 0;
                        
                        // Count products from previous categories
                        for (const cat of categories) {
                            if (cat === category) {
                                break;
                            }
                            allProductsSoFar += filteredProducts.filter(p => p.category === cat).length;
                        }
                        
                        // Calculate how many products from this category to show
                        if (allProductsSoFar >= endIndex) {
                            // This category is not on the current page
                            productsToShowCount = 0;
                        } else if (allProductsSoFar >= startIndex) {
                            // This category starts on the current page
                            productsToShowCount = Math.min(sortedCategoryProducts.length, endIndex - allProductsSoFar);
                        } else if (allProductsSoFar + sortedCategoryProducts.length > startIndex) {
                            // This category spans the current page
                            productsToShowCount = Math.min(
                                allProductsSoFar + sortedCategoryProducts.length - startIndex,
                                endIndex - startIndex
                            );
                        }
                        
                        // Skip if no products to show for this category on this page
                        if (productsToShowCount === 0) return null;
                        
                        // Get the slice of products to show
                        let startSliceIndex = Math.max(0, startIndex - allProductsSoFar);
                        const paginatedCategoryProducts = sortedCategoryProducts.slice(
                            startSliceIndex,
                            startSliceIndex + productsToShowCount
                        );
                        
                        if (paginatedCategoryProducts.length === 0) return null;
                        
                        return (
                            <div key={category}>
                                <h3>{category}</h3>
                                <div className="product-list">
                                    {paginatedCategoryProducts.map(product => (
                                        <div key={product.id} className="product-card">
                                            <Link to={`/product/${encodeURIComponent(product.id)}`} className="product-link">
                                                <img src={product.image} alt={product.name} loading="lazy" />
                                                <h4>{product.name}</h4>
                                                <p>{product.description}</p>
                                                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%"  }}>
                                                    <strong data-testid="product-price">{product.price} €</strong>
                                                    <span style={{ marginLeft: "8px", fontSize: "1.2em" }}>
                                                        {getHeartSymbol(product)}
                                                    </span>
                                                </div>
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
                
                {/* Pagination controls */}
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
                                    className={`pagination-number ${currentPage === index + 1 ? 'active' : ''}`}
                                    onClick={() => handlePageChange(index + 1)}
                                    aria-label={`Page ${index + 1}`}
                                    aria-current={currentPage === index + 1 ? 'page' : undefined}
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
                
                {/* Pagination info */}
                <div className="pagination-info">
                    Showing {Math.min(totalFilteredProducts, (currentPage - 1) * itemsPerPage + 1)}-
                    {Math.min(currentPage * itemsPerPage, totalFilteredProducts)} of {totalFilteredProducts} products
                </div>
            </div>
        </div>
    );
};

export default MenuPage;