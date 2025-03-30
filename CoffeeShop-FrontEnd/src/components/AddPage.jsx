import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; 
import coverAdd from "../assets/add_product_cover.jpg";
import coverImg from "../assets/add_product_main.jpg";

const AddPage = () => {
    const navigate = useNavigate();
    
    // State to hold form inputs
    const [product, setProduct] = useState({
        name: "",
        price: "",
        category: "",
        description: "",
        image: coverImg
    });

    // State for submission status and error messages
    const [submissionStatus, setSubmissionStatus] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");

    // Handle form input changes
    const handleChange = (e) => {
        setProduct({ ...product, [e.target.name]: e.target.value });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Convert price to a number for the API
            const productToSubmit = { 
                ...product, 
                price: parseFloat(product.price) 
            };

            // Send the product to the backend API
            const response = await axios.post("http://localhost:5000/products", productToSubmit);
            
            // Set success message
            setSubmissionStatus("success");
            setErrorMessage("");
            
            // Reset the form
            setProduct({
                name: "",
                price: "",
                category: "",
                description: "",
                image: coverImg
            });
            
            // Optional: Navigate to menu after a short delay to show the success message
            setTimeout(() => {
                navigate("/menu");
            }, 1000);
            
        } catch (error) {
            // Handle API error
            setSubmissionStatus("error");
            
            if (error.response && error.response.data && error.response.data.error) {
                // Use the error message from the backend
                setErrorMessage(error.response.data.error);
            } else {
                // Fallback error message
                setErrorMessage("An error occurred while submitting the form. Please try again.");
            }
        }
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
                    <li><b>Enter the Product Name</b> – Give your creation a name that stands out! Use letters and symbols to craft the perfect title that'll catch the eye of every sea traveler.</li>
                    <li><b>Set the Price</b> – Every great treasure has its value! Enter the price using digits, whether it's a whole number or a decimal (e.g., 5 or 4.99). Keep it fair, and the crew will thank you!</li>
                    <li><b>Write a Description</b> – Tell the tale of your masterpiece! Use letters, symbols, and digits to describe its flavors, ingredients, or anything that makes it a must-try. A good description can turn a simple drink or dish into a legendary favorite!  </li>
                    <li><b>Click the Submit button</b> - Without any second thoughts click the button and watch as your product is added to our fine menu!</li>
                </ol>
                <p>We appreciate your help in making our menu the best of the seven seas. Every new addition makes the Pirate Cafe an even better place for all who stop by. So go ahead, share your ideas, and let's keep the adventure going! ️</p>
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
                      step="0.01"
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
                    {submissionStatus === "error" && <p className="error-message">{errorMessage || "Please fill in all fields before submitting."}</p>}
                </div>
            </div>
        </div>
    );
};

export default AddPage;


