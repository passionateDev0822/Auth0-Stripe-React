// src/Products.js
import React, { useEffect, useState, useContext } from "react";
import { getProducts, createCheckoutSession } from "../api";
import Loading from "../components/Loading";
import { withAuthenticationRequired } from "@auth0/auth0-react";
import { useStripe } from "@stripe/react-stripe-js";
import { ToastContext } from "../App";
import { toast } from "react-toastify";

const Products = () => {
  const [products, setProducts] = useState([]);
  const toastMessage = useContext(ToastContext);
  console.log("toastMessage", toastMessage);
  const stripe = useStripe();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data); // The response data should now be an array of products with price details
      } catch (error) {
        console.error("Error fetching products", error);
      }
    };

    fetchProducts();
    console.log("products", products);
  }, []);

  useEffect(() => {
    if (toastMessage) {
      toast(toastMessage);
    }
  }, [toastMessage]);

  const handleCheckout = async (priceId) => {
    try {
      const { id } = await createCheckoutSession(priceId);
      const { error } = await stripe.redirectToCheckout({ sessionId: id });
      if (error) {
        console.error("Error during redirect to checkout:", error);
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
    }
  };

  return (
    <div>
      <h1>Products</h1>
      <div>
        {products.length > 0 ? (
          products.map((product) => (
            <div className="product-box">
              <div className="product-image">
                <img src={product.images[0]} alt={product.name} />
              </div>
              <div className="product-details">
                <h2 className="product-name">{product.name}</h2>
                <p className="product-description">{product.description}</p>
                <p className="product-price">
                  Price: ${(product.price / 100).toFixed(2)}{" "}
                  {product.currency.toUpperCase()}
                </p>
                <button
                  className="buy-button"
                  onClick={() => handleCheckout(product.price_id)}
                >
                  Buy Now
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No products available</p>
        )}
      </div>
    </div>
  );
};

export default withAuthenticationRequired(Products, {
  onRedirecting: () => <Loading />,
});
