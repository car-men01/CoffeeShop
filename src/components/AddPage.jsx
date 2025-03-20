import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ProductContext } from "../ProductContext";
import coverAdd from "../assets/add_product_cover.jpg";
import coverImg from "../assets/add_product_main.jpg";

const AddPage = () => {
    const { addProduct } = useContext(ProductContext);
    const navigate = useNavigate();
    
    // State to hold form inputs
    const [product, setProduct] = useState({
        name: "",
        price: "",
        category: "",
        description: "",
        image: coverImg // placeholder Img
    });

    // State for submission status
    const [submissionStatus, setSubmissionStatus] = useState(null);

    // Handle form input changes
    const handleChange = (e) => {
        setProduct({ ...product, [e.target.name]: e.target.value });
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();

        // Trim input values to avoid leading/trailing spaces
        const name = product.name.trim();
        const price = product.price.trim();
        const category = product.category.trim();
        const description = product.description.trim();

        // Check if all fields are filled
        if (!name || !price || !category || !description) {
            alert("Please fill in all fields!");
            return;
        }

        // Check if name and category are at least 3 characters long
        if (name.length < 3 || category.length < 3) {
            alert("Product name and category must be at least 3 characters long!");
            return;
        }

        // Check if description is at least 3 characters long
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

        // Ensure name and category contain only letters and symbols (no numbers)
        const containsNumbers = (str) => str.split("").some(char => !isNaN(char) && char !== " ");
        if (containsNumbers(name) || containsNumbers(category)) {
            alert("Product name and category must only contain letters and symbols, no numbers!");
            return;
        }

        // Convert price to a number
        const newProduct = { ...product, price: parseFloat(product.price) };
        
        // Add new product to context
        addProduct(newProduct);
        
        // Set success message
        setSubmissionStatus("success");

        // Redirect to menu page after adding
        //navigate("/menu");
    };

  return (
    <div>
        <div className="header-add">
            <h1>How can you make the shop better?</h1>
            <p className="description-add">If you want to help us improve our online coffee shop, you can always add a new product suggestion to the menu. </p>
            <img src={coverAdd} alt="add-product-cover" className="cover-add" />
        </div>

        <div className="steps-add">
            <h2 className="header-steps">Here are 4 easy steps how to add a product to our menu!</h2>
            <p>Ahoy, and thank you for lending a hand in making the Pirate Cafe even better! Adding a new treasure to our menu is as easy as hoisting the sails—just follow these steps: </p>
            <ol>
                <li><b>Enter the Product Name</b> – Give your creation a name that stands out! Use letters and symbols to craft the perfect title that’ll catch the eye of every sea traveler.</li>
                <li><b>Set the Price</b> – Every great treasure has its value! Enter the price using digits, whether it’s a whole number or a decimal (e.g., 5 or 4.99). Keep it fair, and the crew will thank you!</li>
                <li><b>Write a Description</b> – Tell the tale of your masterpiece! Use letters, symbols, and digits to describe its flavors, ingredients, or anything that makes it a must-try. A good description can turn a simple drink or dish into a legendary favorite!  </li>
                <li><b>Click the Submit button</b> - Without any second thoughts click the button and watch as your product is added to our fine menu!</li>
            </ol>
            <p>We appreciate your help in making our menu the best of the seven seas. Every new addition makes the Pirate Cafe an even better place for all who stop by. So go ahead, share your ideas, and let’s keep the adventure going! ️</p>
        </div>
        <div className="block-form">
            <form className="add-product-form" onSubmit={handleSubmit}>
                <label htmlFor="name">Product name</label>
                <input 
                  id="name" 
                  type="text" 
                  name="name" 
                  value={product.name} 
                  onChange={handleChange} 
                  placeholder="Enter product name" 
                  required 
                />

                <label htmlFor="price">Price</label>
                <input 
                  id="price" 
                  type="number" 
                  name="price" 
                  value={product.price} 
                  onChange={handleChange} 
                  placeholder="Enter price (€)" 
                  required 
                />

                <label htmlFor="category">Category</label>
                <input 
                  id="category" 
                  type="text" 
                  name="category" 
                  value={product.category} 
                  onChange={handleChange} 
                  placeholder="Enter category" 
                  required 
                />

                <label htmlFor="description">Description</label>
                <textarea 
                  id="description" 
                  name="description" 
                  value={product.description} 
                  onChange={handleChange} 
                  placeholder="Enter product description" 
                  required 
                ></textarea>

                <button id="submit" type="submit" className="submit-btn">Submit</button>
            </form>

            <div className="form-message">
                {submissionStatus === "success" && <p className="success-message">The form was submitted successfully!</p>}
                {submissionStatus === "error" && <p className="error-message">Please fill in all fields before submitting.</p>}
            </div>
                
        </div>
    </div>
  );
};

export default AddPage;


