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
import mochaImg from "./assets/mocha.jpg";
import flatWhiteImg from "./assets/flat_white.jpg";
import macchiatoImg from "./assets/macchiato.jpg";
import turkishCoffeeImg from "./assets/turkish_coffee.jpg";
import irishCoffeeImg from "./assets/irish_coffee.jpg";
import viennaCoffeeImg from "./assets/vienna_coffee.jpg";
import buccaneersBrewImg from "./assets/buccaneers_brew.jpg";
import jollyRogerJavaImg from "./assets/jolly_roger_java.jpg";
import seaWitchsLatteImg from "./assets/sea_witchs_latte.jpg";
import coconutImg from "./assets/coconut_coffee.jpg";
import blackbeardsBlendImg from "./assets/blackbeards_blend.jpg";
import goldRushEspressoImg from "./assets/gold_rush_espresso.jpg";
import vanillaColdBrewImg from "./assets/vanilla_cold_brew.jpg";
import chocolateHazelnutImg from "./assets/chocolate_hazelnut_cold_brew.jpg";
import saltedCaramelImg from "./assets/salted_caramel.jpg";
import coconutColdBrewImg from "./assets/coconut_cold_brew.jpg";
import nitroBrewImg from "./assets/nitro_brew.jpg";
import mapleBourbonImg from "./assets/maple_bourbon.jpg";
import piratesGreenImg from "./assets/pirates_green_tea.jpg";
import spicedRumTeaImg from "./assets/spiced_rum_tea.jpg";
import goldenTurmericTeaImg from "./assets/golden_turmeric.jpg";
import berryTreasureImg from "./assets/berry_treasure.jpg";
import chamomileImg from "./assets/captains_chamomile.jpg";
import mintyShipmateImg from "./assets/minty.jpg";

export const ProductContext = createContext();

const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([
    // Classic Coffee
    { id: 1, name: "Espresso", category: "Classic Coffee", price: 5, image: espressoImg, description: "Bold and strong, just like the waves of the sea" },
    { id: 2, name: "Americano", category: "Classic Coffee", price: 3.9, image: americanoImg, description: "A softened espresso with a bit of hot water" },
    { id: 3, name: "Cappuccino", category: "Classic Coffee", price: 6.2, image: cappuccinoImg, description: "Foamy coffee, but enough to keep you awake for a whole day" },
    { id: 4, name: "Mocha", category: "Classic Coffee", price: 6.5, image: mochaImg, description: "A chocolatey delight with an espresso kick" },
    { id: 5, name: "Flat White", category: "Classic Coffee", price: 6.7, image: flatWhiteImg, description: "Silky smooth espresso with creamy milk" },
    { id: 6, name: "Macchiato", category: "Classic Coffee", price: 5.2, image: macchiatoImg, description: "Espresso topped with a hint of frothy milk" },
    { id: 7, name: "Turkish Coffee", category: "Classic Coffee", price: 4.5, image: turkishCoffeeImg, description: "Rich, unfiltered, and steeped in tradition" },
    { id: 8, name: "Irish Coffee", category: "Classic Coffee", price: 9.0, image: irishCoffeeImg, description: "Coffee with a touch of whiskey and whipped cream" },
    { id: 9, name: "Vienna Coffee", category: "Classic Coffee", price: 7.5, image: viennaCoffeeImg, description: "Strong espresso topped with whipped cream" },

    // Specialty Drinks
    { id: 10, name: "The Captain's Quartet", category: "Specialty Drinks", price: 8.3, image: captainsQuartetImg, description: "A perfect choice for a group of four coffee lovers" },
    { id: 11, name: "Kraken's Iced Coffee", category: "Specialty Drinks", price: 3, image: krakensIcedImg, description: "Strong ice coffee, the best to drink before trying to engage the kraken" },
    { id: 12, name: "Dead Man's Drip", category: "Specialty Drinks", price: 3.2, image: deadMansDripImg, description: "Intense espresso with a lingering bitter taste" },
    { id: 13, name: "Buccaneer's Brew", category: "Specialty Drinks", price: 7.5, image: buccaneersBrewImg, description: "A daring mix of espresso, caramel, and sea salt" },
    { id: 14, name: "Jolly Roger Java", category: "Specialty Drinks", price: 6.9, image: jollyRogerJavaImg, description: "A pirate's favorite—espresso with a hint of rum flavor" },
    { id: 15, name: "Sea Witch's Latte", category: "Specialty Drinks", price: 8.2, image: seaWitchsLatteImg, description: "Dark roast with a hint of vanilla and magic" },
    { id: 16, name: "Coconut Coffee", category: "Specialty Drinks", price: 7.8, image: coconutImg, description: "A tropical coffee with a splash of coconut milk" },
    { id: 17, name: "Blackbeard's Blend", category: "Specialty Drinks", price: 9.0, image: blackbeardsBlendImg, description: "Bold and mysterious, just like the legend" },
    { id: 18, name: "Gold Rush Espresso", category: "Specialty Drinks", price: 8.5, image: goldRushEspressoImg, description: "A golden-hued coffee with a shot of honey" },

    // Cold Brews
    { id: 19, name: "Shiver Me Cold Brew", category: "Cold Brews", price: 21, image: shiverMeColdBrewImg, description: "Chilly bitter taste with a touch of milk" },
    { id: 20, name: "Frappuccino", category: "Cold Brews", price: 2, image: frappuccinoImg, description: "Chocholatey iced coffee" },
    { id: 21, name: "Ice Latte", category: "Cold Brews", price: 11, image: icelatteImg, description: "Perfect for any girlie who likes adventures <3" },
    { id: 22, name: "Vanilla Sweet Cold Brew", category: "Cold Brews", price: 6.5, image: vanillaColdBrewImg, description: "Smooth cold brew infused with vanilla syrup" },
    { id: 23, name: "Chocolate Hazelnut Cold Brew", category: "Cold Brews", price: 7.0, image: chocolateHazelnutImg, description: "Nutty, chocolatey, and ice cold" },
    { id: 24, name: "Salted Caramel Cold Brew", category: "Cold Brews", price: 6.8, image: saltedCaramelImg, description: "A perfect mix of coffee and caramel with a salty twist" },
    { id: 25, name: "Pirate's Coconut Cold Brew", category: "Cold Brews", price: 7.2, image: coconutColdBrewImg, description: "Coconut-flavored cold brew for a tropical twist" },
    { id: 26, name: "Dark Roast Nitro", category: "Cold Brews", price: 8.0, image: nitroBrewImg, description: "A strong, smooth nitro-infused cold brew" },
    { id: 27, name: "Maple Bourbon Cold Brew", category: "Cold Brews", price: 9.5, image: mapleBourbonImg, description: "Rich maple and bourbon flavor blended into cold brew" },

    // Teas
    { id: 28, name: "Under The Water Tea", category: "Teas", price: 7.7, image: underTheWaterImg, description: "Soothing and calming, with a sense of danger" },
    { id: 29, name: "Mermaid's Chai", category: "Teas", price: 9.9, image: mermaidsChaiImg, description: "It seems lite its taste is calling to you" },
    { id: 30, name: "Stormy Earl Grey", category: "Teas", price: 8.5, image: stormyEarlGreyImg, description: "A refreshing and warming adventure" },
    { id: 31, name: "Pirate's Green Tea", category: "Teas", price: 6.5, image: piratesGreenImg, description: "Refreshing and packed with antioxidants" },
    { id: 32, name: "Spiced Rum Tea", category: "Teas", price: 7.0, image: spicedRumTeaImg, description: "Black tea with a hint of warm spices" },
    { id: 33, name: "Golden Turmeric Tea", category: "Teas", price: 7.2, image: goldenTurmericTeaImg, description: "A warm, soothing tea with turmeric and honey" },
    { id: 34, name: "Berry Treasure Tea", category: "Teas", price: 8.5, image: berryTreasureImg, description: "A fruity tea blend packed with flavor" },
    { id: 35, name: "Captain’s Chamomile", category: "Teas", price: 6.8, image: chamomileImg, description: "A relaxing chamomile tea with a citrus hint" },
    { id: 36, name: "Minty Shipmate Tea", category: "Teas", price: 6.9, image: mintyShipmateImg, description: "A refreshing peppermint tea" },

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