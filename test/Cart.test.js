// test/Cart.test.js
import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Cart from "../src/components/shop/Cart";
import { I18nextProvider } from "react-i18next";
import i18n from "../src/i18n";

describe("Cart component", () => {
  test("renders with initial state", () => {
    render(
      <I18nextProvider i18n={i18n}>
        <Cart />
      </I18nextProvider>
    );

    // Sprawdzenie głównego nagłówka
    expect(screen.getByText(/cart/i)).toBeInTheDocument();

    // Sprawdzenie przycisków "usuń" jeśli są produkty
    expect(
      screen.getAllByRole("button", { name: /remove/i }).length
    ).toBeGreaterThanOrEqual(0);

    // Sprawdzenie podsumowania koszyka
    expect(screen.getByText(/summary/i)).toBeInTheDocument();

    // Sprawdzenie danych do wysyłki
    expect(screen.getByLabelText(/fullname/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  });
});
