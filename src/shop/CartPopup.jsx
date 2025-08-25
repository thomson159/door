import React from "react";
import { CartPopup as CartPopupWrapper, Table, Th, Td, Button, Spinner, ErrorMsg } from "./styled";

const CartPopup = ({
  cart,
  setShowCart,
  updateQuantity,
  toggleProductInCart,
  placeOrder,
  placingOrder,
  orderSuccess,
  orderError,
}) => {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.quantity * parseFloat(item.price || 0),
    0
  );

  return (
    <CartPopupWrapper>
      <h2>Koszyk</h2>
      <Button style={{ maxWidth: 28, margin: 0 }} onClick={() => setShowCart(false)}>
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
                      onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                      style={{ width: "60px", padding: "4px", fontSize: "1rem" }}
                    />
                  </Td>
                  <Td style={{ width: 76, paddingRight: 8 }}>
                    <Button style={{ maxWidth: 28, margin: 0 }} onClick={() => toggleProductInCart(item)}>
                      ✖
                    </Button>
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>

          <div>
            <strong style={{ color: "black" }}>Liczba produktów:</strong> {totalItems}
            <br />
            <strong style={{ color: "black" }}>Razem:</strong> {totalPrice?.toFixed(2)} zł
          </div>

          <div style={{ marginTop: "1rem" }}>
            <Button onClick={placeOrder} disabled={placingOrder || cart.length === 0}>
              {placingOrder ? "Składanie zamówienia..." : "Złóż zamówienie"}
            </Button>
            {placingOrder && <Spinner />}
            {orderError && <ErrorMsg>{orderError}</ErrorMsg>}
          </div>
        </>
      )}
    </CartPopupWrapper>
  );
};

export default CartPopup;
