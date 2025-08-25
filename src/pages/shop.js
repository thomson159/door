import React, { useState, useEffect } from "react";
import Layout from "../layouts";
import { useTranslation } from "react-i18next";
import BG from "../components/bg";
import SEO from "../components/seo";
import "../i18n";

import LoginPopup from "../shop/LoginPopup";
import CartPopup from "../shop/CartPopup";
import ProductsPopup from "../shop/ProductsPopup";
import OrdersPopup from "../shop/OrdersPopup";
import { Button, Popup } from "../shop/styled";

const Shop = (props) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  const [email, setEmail] = useState("anna@posdemo.pl");
  const [password, setPassword] = useState("test1234");
  const [loggedInEmail, setLoggedInEmail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [validationError, setValidationError] = useState("");

  const [showOrders, setShowOrders] = useState(false);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState("");

  const [localProducts, setLocalProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [productsError, setProductsError] = useState("");
  const [showProducts, setShowProducts] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const categories = [...new Set(localProducts.map((p) => p.category))];

  const [timeLeft, setTimeLeft] = useState(null);

  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderError, setOrderError] = useState("");

  useEffect(() => {
    const expiry = localStorage.getItem("tokenExpiry");
    if (expiry) {
      const now = Date.now();
      const diff = Math.floor((expiry - now) / 1000);
      if (diff > 0) setTimeLeft(diff);
      else handleLogout();
    }
  }, []);

  useEffect(() => {
    if (timeLeft === null) return;
    if (timeLeft <= 0) {
      handleLogout();
      return;
    }
    const timerId = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timerId);
  }, [timeLeft]);

  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    if (storedEmail) setLoggedInEmail(storedEmail);
  }, []);

  const validateForm = () => {
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setValidationError("Podaj poprawny adres email");
      return false;
    }
    if (password.length < 6) {
      setValidationError("Hasło musi mieć co najmniej 6 znaków");
      return false;
    }
    setValidationError("");
    return true;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        "https://pos-backend-kso1.onrender.com/api/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Błąd logowania");
      }
      const data = await res.json();
      localStorage.setItem("token", data.token);
      localStorage.setItem("email", email);
      localStorage.setItem("tokenExpiry", Date.now() + 60 * 60 * 1000);

      setLoggedInEmail(email);
      setTimeLeft(60 * 60);
      openProductsPopup();
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("tokenExpiry");
    setLoggedInEmail(null);
    setEmail("");
    setPassword("");
    setError("");
    setValidationError("");
    setShowOrders(false);
    setTimeLeft(null);
  };

  const fetchLocalProducts = async () => {
    setProductsLoading(true);
    setProductsError("");
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(
        "https://pos-backend-kso1.onrender.com/api/products/local",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) throw new Error("Błąd pobierania produktów");
      const data = await res.json();
      setLocalProducts(data);
    } catch (err) {
      setProductsError(err.message);
    } finally {
      setProductsLoading(false);
    }
  };

  const openProductsPopup = () => {
    setShowProducts(true);
    fetchLocalProducts();
  };

  const closeProductsPopup = () => setShowProducts(false);

  const toggleCategory = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const filteredProducts =
    selectedCategories.length === 0
      ? localProducts
      : localProducts.filter((p) => selectedCategories.includes(p.category));

  const toggleProductInCart = (product) => {
    setCart((prev) => {
      const exists = prev.find((p) => p.id === product.id);
      if (exists) return prev.filter((p) => p.id !== product.id);
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    setCart((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const placeOrder = async () => {
    if (cart.length === 0) return;
    setPlacingOrder(true);
    setOrderError("");
    setOrderSuccess(false);

    const token = localStorage.getItem("token");
    const orderData = {
      customer: loggedInEmail,
      total: cart.reduce(
        (sum, item) => sum + item.quantity * parseFloat(item.price || 0),
        0
      ),
      items: cart.map((item) => ({
        product_id: item.id,
        quantity: item.quantity,
      })),
    };

    try {
      const res = await fetch(
        "https://pos-backend-kso1.onrender.com/api/orders",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(orderData),
        }
      );
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Błąd składania zamówienia");
      }
      setOrderSuccess(true);
      setCart([]);
    } catch (err) {
      setOrderError(err.message);
    } finally {
      setPlacingOrder(false);
    }
  };

  const fetchOrders = async () => {
    setOrdersLoading(true);
    setOrdersError("");
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(
        "https://pos-backend-kso1.onrender.com/api/orders",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) throw new Error("Błąd pobierania zamówień");
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      setOrdersError(err.message);
    } finally {
      setOrdersLoading(false);
    }
  };

  const openOrdersPopup = () => {
    setShowOrders(true);
    fetchOrders();
  };

  const closeOrdersPopup = () => setShowOrders(false);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <Layout>
      <SEO title={"Sklep"} path={props.location.pathname} lang={lang} />
      <BG />

      {loggedInEmail && (
        <div style={{ width: "100%", marginBottom: 20 }}>
          <Button
            style={{
              float: "left",
              maxWidth: 32,
              marginTop: 0,
              marginLeft: 20,
              marginRight: 20,
            }}
            onClick={() => {
              if (showOrders) closeOrdersPopup();
              else openProductsPopup();
            }}
          >
            ⚙️
          </Button>

          <Button
            style={{ maxWidth: 90, marginTop: 0, marginLeft: 20 }}
            onClick={() => setShowCart((prev) => !prev)}
          >
            🛒 {cart.length}
          </Button>
        </div>
      )}

      {!loggedInEmail && (
        <LoginPopup
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          handleLogin={handleLogin}
          loading={loading}
          error={error}
          validationError={validationError}
        />
      )}

      {showCart && (
        <CartPopup
          cart={cart}
          setShowCart={setShowCart}
          updateQuantity={updateQuantity}
          toggleProductInCart={toggleProductInCart}
          placeOrder={placeOrder}
          placingOrder={placingOrder}
          orderSuccess={orderSuccess}
          orderError={orderError}
        />
      )}

      {loggedInEmail && !showOrders && !showProducts && (
        <Popup style={{ maxWidth: 400, padding: "2rem" }}>
          <p>
            Zalogowany jako: <b>{loggedInEmail}</b>
          </p>
          {timeLeft !== null && (
            <p>
              Sesja wygaśnie za: <b>{formatTime(timeLeft)}</b>
            </p>
          )}
          <Button onClick={openOrdersPopup}>Zamówienia</Button>
          <Button onClick={openProductsPopup}>Produkty</Button>
          <Button onClick={handleLogout}>Wyloguj</Button>
        </Popup>
      )}

      {showProducts && (
        <ProductsPopup
          products={localProducts}
          filteredProducts={filteredProducts}
          categories={categories}
          selectedCategories={selectedCategories}
          toggleCategory={toggleCategory}
          cart={cart}
          toggleProductInCart={toggleProductInCart}
          productsLoading={productsLoading}
          productsError={productsError}
          closeProductsPopup={closeProductsPopup}
        />
      )}

      {showOrders && (
        <OrdersPopup
          orders={orders}
          ordersLoading={ordersLoading}
          ordersError={ordersError}
          closeOrdersPopup={closeOrdersPopup}
        />
      )}
    </Layout>
  );
};

export default Shop;
