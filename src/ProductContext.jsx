import React, { createContext, useState } from "react";
import espressoImg from "./assets/espresso.jpg";
import cappuccinoImg from "./assets/cappuccino.webp";
import americanoImg from "./assets/americano.png";
import captainsQuartetImg from "./assets/captains_quartet.jpg";
import krakensIcedImg from "./assets/kraken_iced.jpg";
import deadMansDripImg from "./assets/dead_mans_drip.jpg";
import shiverMeColdBrewImg from "./assets/shiver_me_cold_brew.jpg";
import frappuccinoImg from "./assets/frappuccino.jpg";
import icelatteImg from "./assets/ice_latte.jpg";
import underTheWaterImg from "./assets/under_the_water_tea.jpg";
import mermaidsChaiImg from "./assets/mermaids_chai.webp";
import stormyEarlGreyImg from "./assets/stormy_earl_grey.jpg";

export const ProductContext = createContext();

const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([
    { id: 1, name: "Espresso", category: "Classic Coffee", price: 5, image: espressoImg, description: "Bold and strong, just like the waves of the sea" },
    { id: 2, name: "Americano", category: "Classic Coffee", price: 3.9, image: americanoImg, description: "Bold and strong, just like the waves of the sea" },
    { id: 3, name: "Cappuccino", category: "Classic Coffee", price: 6.2, image: cappuccinoImg, description: "Bold and strong, just like the waves of the sea" },
    { id: 4, name: "The Captain's Quartet", category: "Specialty Drinks", price: 8.3, image: captainsQuartetImg, description: "A perfect choice for a group of four coffee lovers" },
    { id: 5, name: "Kraken's Iced Coffee", category: "Specialty Drinks", price: 3, image: krakensIcedImg, description: "Strong ice coffee, the best to drink before trying to engage the kraken" },
    { id: 6, name: "Dead Man's Drip", category: "Specialty Drinks", price: 3.2, image: deadMansDripImg, description: "Intense espresso with a lingering bitter taste" },
    { id: 7, name: "Shiver Me Cold Brew", category: "Cold Brews", price: 21, image: shiverMeColdBrewImg, description: "Bold and strong, just like the waves of the sea" },
    { id: 8, name: "Frappuccino", category: "Cold Brews", price: 2, image: frappuccinoImg, description: "Bold and strong, just like the waves of the sea" },
    { id: 9, name: "Ice Latte", category: "Cold Brews", price: 11, image: icelatteImg, description: "Bold and strong, just like the waves of the sea" },
    { id: 10, name: "Under The Water Tea", category: "Teas", price: 7.7, image: underTheWaterImg, description: "Bold and strong, just like the waves of the sea" },
    { id: 11, name: "Mermaid's Chai", category: "Teas", price: 9.9, image: mermaidsChaiImg, description: "Bold and strong, just like the waves of the sea" },
    { id: 12, name: "Stormy Earl Grey", category: "Teas", price: 8.5, image: stormyEarlGreyImg, description: "Bold and strong, just like the waves of the sea" },

  ]);

  // CRUD Operations
  const addProduct = (newProduct) => {
    setProducts([...products, { ...newProduct, id: Date.now() }]);
  };

  const updateProduct = (updatedProduct) => {
    setProducts(prevProducts => 
        prevProducts.map(p => p.id === updatedProduct.id ? updatedProduct : p)
    );
  };

  const deleteProduct = (id) => {
    setProducts(prevProducts => {
        const updatedProducts = prevProducts.filter(product => product.id !== id);
        return updatedProducts;
    });
  };
  

  return (
    <ProductContext.Provider value={{ products, addProduct, updateProduct, deleteProduct }}>
      {children}
    </ProductContext.Provider>
  );
};

export default ProductProvider;