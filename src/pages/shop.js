import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Layout from "../layouts";
import { useTranslation } from "react-i18next";
import BG from "../components/bg";
import SEO from "../components/seo";
import "../i18n";

const PopupProducts = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 16px;
  width: 100%;
  overflow-y: auto;
  text-align: center;
  color: black;

  @media (max-width: 640px) {
    padding: 0px;
  }
`;

const Popup = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 2rem;
  border-radius: 16px;
  // box-shadow: 0 8px 30px rgba(0, 0, 0, 0.25);
  width: 100%;
  max-width: 1400px;
  max-height: 65vh;
  overflow-y: auto;
  text-align: center;
  color: black;
  @media (max-width: 640px) {
    padding: 0px;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 14px;
  margin: 0.3rem 0;
  border: 2px solid #ddd;
  border-radius: 10px;
  font-size: 1rem;
  outline: none;
  transition: all 0.25s ease;

  &:focus {
    border-color: #3498db;
    box-shadow: 0 0 8px rgba(52, 152, 219, 0.4);
    transform: scale(1.02);
  }
`;

const Button = styled.button`
  margin: 1rem auto 0;
  width: 200px;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  background: linear-gradient(135deg, rgb(23, 130, 253), rgb(97, 171, 255));
  color: white;

  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  display: block;

  &:hover {
    transform: translateY(-2px) scale(1.02);
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);
  }

  &:disabled {
    background: #aaa;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const Spinner = styled.div`
  margin: 1rem auto;
  border: 4px solid #eee;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const ErrorMsg = styled.p`
  color: red;
  margin: 0.2rem 0;
  font-size: 0.9rem;
  animation: fadeIn 0.3s ease;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
`;

const Th = styled.th`
  background: #3498db;
  color: white;
  padding: 10px;

  &:first-child {
    padding-left: 16px;
  }
`;

const Td = styled.td`
  overflow: hidden;
  white-space: preserve nowrap;
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;

  &:first-child {
    padding-left: 16px;
  }
`;

const ProductsColumn = styled.div`
  flex: 3;
  overflow-y: auto;
`;

const OrderColumn = styled.div`
  flex: 3;
  overflow-y: auto;
`;

const CategoriesColumn = styled.div`
  padding-top: 20px;
  flex: 1;
  // border-left: 1px solid #ddd;
  // padding-left: 1rem;
  max-height: 70vh;
  overflow-y: auto;
  text-align: left;
`;

const CartPopup = styled.div`
  color: black;
  position: fixed;
  top: 0;
  right: 0;
  width: 600px;
  max-width: 90%;
  height: 100vh;
  background: white;
  // border-left: 2px solid #ddd;
  padding: 2rem;
  overflow-y: auto;
  box-shadow: -8px 0 30px rgba(0, 0, 0, 0.2);
  animation: slideIn 0.3s ease;
  z-index: 1000;

  @keyframes slideIn {
    from {
      transform: translateX(100%);
    }
    to {
      transform: translateX(0%);
    }
  }
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

const ProductCard = styled.div`
  background: #fff;
  border: 2px solid ${(props) => (props.selected ? "#2ecc71" : "white")};
  border-radius: 12px;
  padding: 1rem;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  transition: transform 0.2s, border-color 0.2s;

  &:hover {
    cursor: pointer;
  }
`;

const ProductPrice = styled.div`
  font-weight: bold;
  margin: 0.25rem 0;
  color: #2ecc71;
`;

const ProductImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 10px;
`;

const ProductTitle = styled.h4`
  font-size: 1rem;
  margin: 0.5rem 0;
`;

const ProductDescription = styled.p`
  font-size: 0.9rem;
  color: #666;
  min-height: 3em;
`;

const ProductCheckbox = styled.input`
  margin-top: 0.5rem;
  transform: scale(1.3);
  cursor: pointer;
`;

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
      if (diff > 0) {
        setTimeLeft(diff);
      } else {
        handleLogout();
      }
    }
  }, []);

  useEffect(() => {
    if (timeLeft === null) return;

    if (timeLeft <= 0) {
      handleLogout();
      return;
    }

    const timerId = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLeft]);

  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    if (storedEmail) {
      setLoggedInEmail(storedEmail);
    }
  }, []);

  const placeOrder = async () => {
    if (cart.length === 0) return;

    setPlacingOrder(true);
    setOrderError("");
    setOrderSuccess(false);

    const token = localStorage.getItem("token");

    const orderData = {
      customer: loggedInEmail,
      total: totalPrice,
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

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;

    setCart((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const toggleProductInCart = (product) => {
    setCart((prev) => {
      const exists = prev.find((p) => p.id === product.id);
      if (exists) {
        return prev.filter((p) => p.id !== product.id);
      } else {
        return [...prev, { ...product, quantity: 1 }];
      }
    });
  };

  const filteredProducts =
    selectedCategories.length === 0
      ? localProducts
      : localProducts.filter((p) => selectedCategories.includes(p.category));

  const toggleCategory = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

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

  const fetchLocalProducts = async () => {
    setProductsLoading(true);
    setProductsError("");
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(
        "https://pos-backend-kso1.onrender.com/api/products/local",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
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

  const closeProductsPopup = () => {
    setShowProducts(false);
    setShowOrders(false);
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

      const expiryTimestamp = Date.now() + 60 * 60 * 1000;
      localStorage.setItem("tokenExpiry", expiryTimestamp);

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

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const fetchOrders = async () => {
    setOrdersLoading(true);
    setOrdersError("");
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(
        "https://pos-backend-kso1.onrender.com/api/orders",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
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

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.quantity * parseFloat(item.price || 0),
    0
  );

  return (
    <Layout>
      <SEO title={"Sklep"} path={props.location.pathname} lang={lang} />
      <BG />
      <div
      //   style={{ minHeight: "75vh" }}
      >
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
                if (showOrders) {
                  closeOrdersPopup();
                } else {
                  openProductsPopup();
                }
                if (showProducts) {
                  closeProductsPopup();
                } else {
                  openProductsPopup();
                }
              }}
            >
              ⚙️
            </Button>
            <Button
              style={{
                // float: "left",
                maxWidth: 90,
                marginTop: 0,
                marginLeft: 20,
              }}
              onClick={() => {
                if (showCart === false) {
                  setShowCart(true);
                } else {
                  setShowCart(false);
                }
              }}
            >
              🛒 {cart.length}
            </Button>
          </div>
        )}
      </div>
      {!loggedInEmail && (
        <Popup style={{ maxWidth: 500 }}>
          <h2>Logowanie</h2>
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Hasło"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button onClick={handleLogin} disabled={loading}>
            {loading ? "Logowanie..." : "Zaloguj"}
          </Button>
          {loading && <Spinner />}
          {validationError && <ErrorMsg>{validationError}</ErrorMsg>}
          {error && <ErrorMsg>{error}</ErrorMsg>}
        </Popup>
      )}
      {showCart && (
        <CartPopup>
          <h2>Koszyk</h2>
          <Button
            style={{ maxWidth: 28, margin: 0 }}
            onClick={() => setShowCart(false)}
          >
            ✖
          </Button>
          {orderSuccess && (
            <p style={{ color: "green", marginTop: "0.5rem" }}>
              Zamówienie złożone pomyślnie!
            </p>
          )}
          {cart.length === 0 ? (
            <p style={{ marginTop: 40 }}>Brak produktów w koszyku</p>
          ) : (
            <>
              <Table>
                <thead>
                  <tr>
                    <Th>Product</Th>
                    <Th>Cena</Th>
                    <Th>Ilość</Th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item) => (
                    <tr key={item.id}>
                      <Td>{item.title.slice(0, 24)}</Td>
                      <Td>{item.price} zł</Td>
                      <Td style={{ width: 78 }}>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) =>
                            updateQuantity(item.id, parseInt(e.target.value))
                          }
                          style={{
                            width: "60px",
                            padding: "4px",
                            fontSize: "1rem",
                          }}
                        />
                      </Td>
                      <Td style={{ width: 76, paddingRight: 8 }}>
                        <Button
                          style={{ maxWidth: 28, margin: 0 }}
                          onClick={() => toggleProductInCart(item)}
                        >
                          ✖
                        </Button>
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <div>
                <strong style={{ color: "black" }}>Liczba produktów:</strong>{" "}
                {totalItems}
                <br />
                <strong style={{ color: "black" }}>Razem:</strong>{" "}
                {totalPrice?.toFixed(2)} zł
              </div>
              <div style={{ marginTop: "1rem" }}>
                <Button
                  onClick={placeOrder}
                  disabled={placingOrder || cart.length === 0}
                >
                  {placingOrder ? "Składanie zamówienia..." : "Złóż zamówienie"}
                </Button>
                {placingOrder && <Spinner />}
                {orderError && <ErrorMsg>{orderError}</ErrorMsg>}
              </div>
            </>
          )}
        </CartPopup>
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
        <PopupProducts style={{ paddingBottom: "2rem" }}>
          <Button
            style={{ maxWidth: 28, margin: 0 }}
            onClick={closeProductsPopup}
          >
            ✖
          </Button>
          <h2>Produkty</h2>
          <ProductsColumn>
            {productsLoading && <Spinner />}
            {productsError && <ErrorMsg>{productsError}</ErrorMsg>}
            {!productsLoading && !productsError && (
              <>
                <ProductGrid>
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      onClick={() => toggleProductInCart(product)}
                      selected={
                        cart.find((item) => item.id === product.id) !==
                        undefined
                      }
                    >
                      <ProductImage src={product.image} alt={product.title} />
                      <ProductTitle>{product.title}</ProductTitle>
                      <ProductPrice>{product.price} zł</ProductPrice>
                      {/* <ProductDescription>
                        {product.description}
                      </ProductDescription> */}
                    </ProductCard>
                  ))}
                </ProductGrid>
              </>
            )}
          </ProductsColumn>
          {!productsLoading && (
            <CategoriesColumn>
              <h3>Kategorie</h3>
              {categories.map((category) => (
                <div key={category}>
                  <label>
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category)}
                      onChange={() => toggleCategory(category)}
                    />{" "}
                    {category}
                  </label>
                </div>
              ))}
            </CategoriesColumn>
          )}
        </PopupProducts>
      )}
      {showOrders && (
        <PopupProducts>
          <Button
            style={{ maxWidth: 28, margin: 0 }}
            onClick={closeOrdersPopup}
          >
            ✖
          </Button>
          <h2>Zamówienia</h2>
          <OrderColumn>
            {ordersLoading && <Spinner />}
            {ordersError && <ErrorMsg>{ordersError}</ErrorMsg>}
            {!ordersLoading && !ordersError && (
              <Table>
                <thead>
                  <tr>
                    <Th>ID</Th>
                    <Th>Customer</Th>
                    <Th>Total</Th>
                    <Th>Created At</Th>
                    <Th>Items</Th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <Td>{order.id}</Td>
                      <Td>{order.customer}</Td>
                      <Td>{parseFloat(order.total).toFixed(2)} zł</Td>
                      <Td>{new Date(order.created_at).toLocaleString()}</Td>
                      <Td>
                        {order.items && order.items.length > 0 ? (
                          order.items.map((item, i) => (
                            <span
                              key={i}
                              style={{
                                display: "block",
                                marginBottom: "0.25rem",
                              }}
                            >
                              {item.product_name} x {item.quantity} (
                              {item.product_price} zł)
                            </span>
                          ))
                        ) : (
                          <span>Brak produktów</span>
                        )}
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </OrderColumn>
        </PopupProducts>
      )}
    </Layout>
  );
};

export default Shop;
