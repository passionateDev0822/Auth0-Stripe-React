import React, { createContext, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import { Container } from "reactstrap";
import Loading from "./components/Loading";
import history from "./utils/history";
import Footer from "./components/Footer";
import Home from "./views/Home";
import Profile from "./views/Profile";
import Products from "./views/Products";
import Success from "./views/Success";
import Cancel from "./views/Cancel";
import { loadStripe } from "@stripe/stripe-js";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import "./App.css";
import { useAuth0 } from "@auth0/auth0-react";
import NavBar from "./components/Navbar";

const stripePromise = loadStripe(
  "pk_test_51PQbqi08tGGq5KGVbXVz0ZS6dvgLSZ3hDxXM552gT8DOVk2zYXlHGtGYpJ8XyNWNEZIrxnBpYpr6hVQ2uSS3t5p100r5t327gg"
); // Replace with your actual Stripe publishable key

export const ToastContext = createContext();

function App() {
  const { isLoading, error } = useAuth0();
  const [toastMessage, setToastMessage] = useState("");

  if (error) {
    return <div>Oops... {error.message}</div>;
  }

  if (isLoading) {
    return <Loading />;
  }
  return (
    <Elements stripe={stripePromise}>
      <Router history={history}>
        <ToastContext.Provider value={setToastMessage}>
          <div id="app" className="d-flex flex-column h-100">
            <ToastContainer />
            <NavBar />
            <Container className="flex-grow-1 mt-5">
              <Routes>
                <Route path="/" exact element={<Home />} />
                <Route path="/profile" exact element={<Profile />} />
                <Route path="/products" exact element={<Products />} />
                <Route path="/success" exact element={<Success />} />
                <Route path="/cancel" exact element={<Cancel />} />
                <Route path="*" element={<Navigate to="/products" />} />
              </Routes>
            </Container>
            <Footer />
          </div>
        </ToastContext.Provider>
      </Router>
    </Elements>
  );
}

export default App;
