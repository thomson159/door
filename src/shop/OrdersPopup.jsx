import React from "react";
import { PopupProducts, OrderColumn, Table, Th, Td, Button, Spinner, ErrorMsg } from "./styled";

const OrdersPopup = ({
  orders,
  ordersLoading,
  ordersError,
  closeOrdersPopup,
}) => {
  return (
    <PopupProducts>
      <Button style={{ maxWidth: 28, margin: 0 }} onClick={closeOrdersPopup}>
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
                        <span key={i} style={{ display: "block", marginBottom: "0.25rem" }}>
                          {item.product_name} x {item.quantity} ({item.product_price} zł)
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
  );
};

export default OrdersPopup;
