const express = require('express');
const router = express.Router();
const initialProducts = require('../data/initialProducts');

// Initialize with products from data file
let products = [...initialProducts];

// Get all products with filters
router.get('/', (req, res) => {
    const { search, category, sort, limit = 36, page = 1 } = req.query;
    let filteredProducts = [...products];

    // Filter by search term
    if (search) {
        filteredProducts = filteredProducts.filter(p =>
            p.name.toLowerCase().includes(search.toLowerCase()) ||
            p.description.toLowerCase().includes(search.toLowerCase())
        );
    }

    // Filter by category (if specified)
    if (category) {
        filteredProducts = filteredProducts.filter(p => p.category === category);
    }

    // First, group products by category
    const groupedByCategory = {};
    filteredProducts.forEach(product => {
        if (!groupedByCategory[product.category]) {
            groupedByCategory[product.category] = [];
        }
        groupedByCategory[product.category].push(product);
    });
    
    // Sort within each category if needed
    if (sort === 'asc' || sort === 'desc') {
        Object.keys(groupedByCategory).forEach(cat => {
            groupedByCategory[cat].sort((a, b) => 
                sort === 'asc' ? a.price - b.price : b.price - a.price
            );
        });
    }
    
    // Flatten back, but preserve category ordering
    let orderedProducts = [];
    const categoryOrder = ["Classic Coffee", "Specialty Drinks", "Cold Brews", "Teas"];
    
    // Add products in the correct category order
    categoryOrder.forEach(categoryName => {
        if (groupedByCategory[categoryName]) {
            orderedProducts = [...orderedProducts, ...groupedByCategory[categoryName]];
        }
    });
    
    // Add any products with categories not in the predefined order
    Object.keys(groupedByCategory).forEach(categoryName => {
        if (!categoryOrder.includes(categoryName)) {
            orderedProducts = [...orderedProducts, ...groupedByCategory[categoryName]];
        }
    });
    
    // Apply pagination
    const total = orderedProducts.length;
    const startIndex = (parseInt(page) - 1) * parseInt(limit);
    const paginatedProducts = orderedProducts.slice(startIndex, startIndex + parseInt(limit));

    res.json({ 
        products: paginatedProducts, 
        total: total 
    });
});

// Get unique categories
router.get('/categories', (req, res) => {
    const categories = [...new Set(products.map(p => p.category))];
    const categoryOrder = ["Classic Coffee", "Specialty Drinks", "Cold Brews", "Teas"];
    
    // Sort categories according to predefined order
    const sortedCategories = categories.sort((a, b) => {
        const indexA = categoryOrder.indexOf(a);
        const indexB = categoryOrder.indexOf(b);
        
        if (indexA !== -1 && indexB !== -1) {
            return indexA - indexB;
        }
        
        if (indexA !== -1) return -1;
        if (indexB !== -1) return 1;
        
        return a.localeCompare(b);
    });
    
    res.json(sortedCategories);
});

// Get single product by ID
router.get('/:id', (req, res) => {
    const { id } = req.params;
    
    // Try to find product with exact ID match (string or number)
    let product = products.find(p => p.id.toString() === id.toString());
    
    if (!product) {
        return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json(product);
});

// Add a new product with comprehensive validation
router.post('/', (req, res) => {
    const { name, category, price, description, image } = req.body;

    // Step 1: Check if all required fields are filled
    if (!name || !category || price === undefined || !description) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    // Step 2: Trim string values
    const trimmedName = name.trim();
    const trimmedCategory = category.trim();
    const trimmedDescription = description.trim();

    // Step 3: Check if name and category are at least 3 characters long
    if (trimmedName.length < 3) {
        return res.status(400).json({ error: 'Product name must be at least 3 characters long' });
    }

    if (trimmedCategory.length < 3) {
        return res.status(400).json({ error: 'Category must be at least 3 characters long' });
    }

    // Step 4: Check if description is at least 3 characters long
    if (trimmedDescription.length < 3) {
        return res.status(400).json({ error: 'Description must be at least 3 characters long' });
    }

    // Step 5: Validate price: should be a valid positive number
    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
        return res.status(400).json({ error: 'Please enter a valid price (e.g., 5 or 4.99)' });
    }

    // Step 6: Ensure name and category contain only letters and symbols (no numbers)
    const containsNumbers = (str) => str.split("").some(char => !isNaN(parseInt(char)) && char !== " ");
    if (containsNumbers(trimmedName)) {
        return res.status(400).json({ error: 'Product name must only contain letters and symbols, no numbers' });
    }

    if (containsNumbers(trimmedCategory)) {
        return res.status(400).json({ error: 'Category must only contain letters and symbols, no numbers' });
    }

    // Create the new product
    const newProduct = {
        id: Date.now().toString(), // Generate a unique ID
        name: trimmedName,
        category: trimmedCategory,
        price: parsedPrice, // Use the parsed price
        description: trimmedDescription,
        image: "/assets/add_product_main.jpg" // Default image
    };

    // Add the product to our in-memory storage
    products.push(newProduct);
    
    // Return the new product with status 201 (Created)
    res.status(201).json(newProduct);
});

// Update a product with validation
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { name, category, price, description } = req.body;

    // Find the product
    const productIndex = products.findIndex(p => p.id.toString() === id.toString());
    if (productIndex === -1) {
        return res.status(404).json({ error: 'Product not found' });
    }
    
    // Keep the existing product data for fields not being updated
    const existingProduct = products[productIndex];
    
    // Validate name if provided
    let trimmedName = existingProduct.name;
    if (name !== undefined) {
        trimmedName = name.trim();
        if (trimmedName.length < 3) {
            return res.status(400).json({ error: 'Product name must be at least 3 characters long' });
        }
        
        // Ensure name contains only letters and symbols
        const containsNumbers = (str) => str.split("").some(char => !isNaN(parseInt(char)) && char !== " ");
        if (containsNumbers(trimmedName)) {
            return res.status(400).json({ error: 'Product name must only contain letters and symbols, no numbers' });
        }
    }
    
    // Validate category if provided
    let trimmedCategory = existingProduct.category;
    if (category !== undefined) {
        trimmedCategory = category.trim();
        if (trimmedCategory.length < 3) {
            return res.status(400).json({ error: 'Category must be at least 3 characters long' });
        }
        
        // Ensure category contains only letters and symbols
        const containsNumbers = (str) => str.split("").some(char => !isNaN(parseInt(char)) && char !== " ");
        if (containsNumbers(trimmedCategory)) {
            return res.status(400).json({ error: 'Category must only contain letters and symbols, no numbers' });
        }
    }
    
    // Validate description if provided
    let trimmedDescription = existingProduct.description;
    if (description !== undefined) {
        trimmedDescription = description.trim();
        if (trimmedDescription.length < 3) {
            return res.status(400).json({ error: 'Description must be at least 3 characters long' });
        }
    }
    
    // Validate price if provided
    let parsedPrice = existingProduct.price;
    if (price !== undefined) {
        parsedPrice = parseFloat(price);
        if (isNaN(parsedPrice) || parsedPrice <= 0) {
            return res.status(400).json({ error: 'Please enter a valid price (e.g., 5 or 4.99)' });
        }
    }

    // Update the product
    const updatedProduct = {
        ...existingProduct,
        name: trimmedName,
        category: trimmedCategory, 
        price: parsedPrice,
        description: trimmedDescription
    };
    
    products[productIndex] = updatedProduct;
    res.json(updatedProduct);
});

// Delete a product
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    
    // Find product first (for validation)
    const productExists = products.some(p => p.id.toString() === id.toString());
    
    if (!productExists) {
        return res.status(404).json({ error: 'Product not found' });
    }
    
    // Remove product
    products = products.filter(p => p.id.toString() !== id.toString());
    res.status(204).send(); // 204 No Content - Success but no content to return
});

module.exports = router;