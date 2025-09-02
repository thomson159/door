import React, { useState, useEffect } from "react";
import {
  Overlay,
  CartPopup,
  CloseButton,
  Table,
  Th,
  Td,
  Input,
  Label,
  Select,
  FormRow,
  Column,
  Summary,
  ErrorText,
  Button,
  StyledTradeButton,
} from "./CartStyles";

const Cart = () => {
  const [visible, setVisible] = useState(true);
  const [countries, setCountries] = useState([]);
  const [cart, setCart] = useState([
    { id: 1, title: "Produkt A", price: 219, quantity: 0 },
    { id: 2, title: "Produkt B", price: 219, quantity: 0 },
  ]);

  const countriesFallback = [
    {
      name: "Poland",
      code: "+48",
      postalFormat: "xx-xxx",
      postalRegex: "^\\d{2}-?\\d{3}$",
    },
    {
      name: "Germany",
      code: "+49",
      postalFormat: "#####",
      postalRegex: "^\\d{5}$",
    },
    {
      name: "France",
      code: "+33",
      postalFormat: "#####",
      postalRegex: "^\\d{5}$",
    },
    {
      name: "Spain",
      code: "+34",
      postalFormat: "#####",
      postalRegex: "^\\d{5}$",
    },
  ];

  const [form, setForm] = useState(() => {
    const saved = localStorage.getItem("cartForm");
    return saved
      ? JSON.parse(saved)
      : {
          country: "Poland",
          countryCode: "+48",
          street: "",
          zip: "",
          city: "",
          phone: "",
          email: "",
        };
  });

  useEffect(() => {
    localStorage.setItem("cartForm", JSON.stringify(form));
  }, [form]);

  useEffect(() => {
    fetch("https://restcountries.com/v3.1/all?fields=name,idd,postalCode")
      .then((res) => {
        if (!res.ok) throw new Error("Błąd sieci");
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          const sorted = data
            .map((c) => ({
              name: c.name?.common,
              code:
                c.idd?.root +
                (c.idd?.suffixes?.length > 0 ? c.idd.suffixes[0] : ""),
              postalFormat: c.postalCode?.format || "",
              postalRegex: c.postalCode?.regex || "",
            }))
            .filter((c) => c.name && c.code)
            .sort((a, b) => a.name.localeCompare(b.name));

          setCountries(sorted);
        } else {
          setCountries(
            [...countriesFallback].sort((a, b) => a.name.localeCompare(b.name))
          );
        }
      })
      .catch(() => {
        setCountries([...countriesFallback]);
      });
  }, []);

  const updateQuantity = (id, quantity) => {
    if (quantity < 0) return;
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const updateForm = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const updateCountry = (name) => {
    const country =
      countries.find((c) => c.name === name) ||
      countriesFallback.find((c) => c.name === name);
    updateForm("country", name);
    updateForm("countryCode", country?.code || "");
  };

  const hasLetter = (str) => /[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ]/.test(str);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const lastChar = email[email.length - 1];
    return emailRegex.test(email) && !/[^a-zA-Z0-9]/.test(lastChar);
  };

  const validatePhone = (phone) => {
    const length = phone.length;
    if (!/^[0-9]+$/.test(phone)) return false;
    return form.country === "Poland"
      ? length === 9
      : length >= 6 && length <= 11;
  };

  const validateForm = () => {
    const { street, zip, city, phone, email } = form;
    const hasItems = cart.some((item) => item.quantity > 0);

    return (
      hasItems &&
      street.trim() &&
      city.trim() &&
      hasLetter(street) &&
      hasLetter(city) &&
      validateZip(zip) &&
      validatePhone(phone) &&
      validateEmail(email)
    );
  };

  const getInputStyle = (field) => {
    let isValid = true;
    if (field === "street")
      isValid = form.street.trim() && hasLetter(form.street);
    if (field === "city") isValid = form.city.trim() && hasLetter(form.city);
    if (field === "zip") isValid = validateZip(form.zip);
    if (field === "phone") isValid = validatePhone(form.phone);
    if (field === "email") isValid = validateEmail(form.email);

    return { borderColor: isValid ? "#ddd" : "red" };
  };

  const getInputError = (field) => {
    const { street, city, zip, phone, email } = form;

    if (field === "street" && street.trim() && !hasLetter(street))
      return "Ulica musi zawierać co najmniej jedną literę.";
    if (field === "city" && city.trim() && !hasLetter(city))
      return "Miejscowość musi zawierać co najmniej jedną literę.";
    if (field === "phone" && phone && !validatePhone(phone))
      return form.country === "Poland"
        ? "Telefon musi mieć dokładnie 9 cyfr."
        : "Telefon musi mieć od 6 do 11 cyfr.";
    if (field === "email" && email && !validateEmail(email))
      return "Podaj poprawny adres email.";
    if (field === "zip" && zip && !validateZip(zip))
      return "Niepoprawny kod pocztowy.";

    return "";
  };

  const handlePhoneChange = (value) => {
    const cleaned = value.replace(/[^0-9]/g, "");
    const maxLength = form.country === "Poland" ? 9 : 11;
    updateForm("phone", cleaned.slice(0, maxLength));
  };

  const allowedStreetRegex = /^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ0-9\s',./-]*$/;
  const allowedCityRegex = /^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ0-9\s',./-]*$/;

  const handleStreetChange = (value) => {
    if (allowedStreetRegex.test(value))
      updateForm("street", value.toUpperCase());
  };

  const handleCityChange = (value) => {
    if (allowedCityRegex.test(value)) updateForm("city", value.toUpperCase());
  };

  const handleBlurTrim = (field) => {
    updateForm(field, form[field].trim());
  };

  const handleEmailChange = (value) => {
    const cleaned = value.trim().toLowerCase();
    const allowedCharsRegex = /^[a-z0-9@.\-]*$/;
    if (allowedCharsRegex.test(cleaned)) updateForm("email", cleaned);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    console.log("Zamówienie złożone", form, cart);
  };

  const validateZip = (zip) => {
    if (!zip) return false;

    const country =
      countries.find((c) => c.name === form.country) ||
      countriesFallback.find((c) => c.name === form.country);
    if (!country || !country.postalRegex) return true;

    const regex = new RegExp(country.postalRegex);
    return regex.test(zip);
  };

  const handleZipChange = (value) => {
    const allowedCharsRegex = /^[a-zA-Z0-9\s',./-]*$/;
    if (allowedCharsRegex.test(value)) {
      updateForm("zip", value.toUpperCase());
    }
  };

  const summary = cart.reduce(
    (acc, item) => {
      acc.items += item.quantity;
      acc.price += item.quantity * item.price;
      return acc;
    },
    { items: 0, price: 0 }
  );

  const country = countries.find((c) => c.name === form.country);

  return (
    <>
      <Overlay onClick={() => setVisible(false)} />
      <CartPopup className={visible ? "visible" : ""}>
        <CloseButton onClick={() => setVisible(false)}>X</CloseButton>

        <h2>Twój koszyk</h2>

        <Table>
          <thead>
            <tr>
              <Th></Th>
              <Th>Cena</Th>
              <Th>Ilość</Th>
              <Th></Th>
            </tr>
          </thead>
          <tbody>
            {cart.map(({ id, title, price, quantity }) => (
              <tr key={id}>
                <Td>{title}</Td>
                <Td>{price} zł</Td>
                <Td>
                  <Input
                    type="number"
                    min="0"
                    value={quantity}
                    onChange={(e) => updateQuantity(id, Number(e.target.value))}
                    style={{ width: "60px" }}
                  />
                </Td>
                <Td>
                  <StyledTradeButton
                    style={{ maxWidth: 70, margin: 0 }}
                    onClick={() => updateQuantity(id, 0)}
                  >
                    Usuń
                  </StyledTradeButton>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>

        <Summary>
          <div>
            <strong>Podsumowanie</strong>
          </div>
          <div>Ilość produktów: {summary.items}</div>
          <div>Cena: {summary.price} zł</div>
        </Summary>

        {summary.items === 0 && (
          <div style={{ color: "red", marginBottom: 16 }}>
            Koszyk jest pusty. Dodaj produkty przed złożeniem zamówienia.
          </div>
        )}

        <h2 style={{ marginTop: 40, marginBottom: 0 }}>Dane do wysyłki</h2>

        <form onSubmit={handleSubmit}>
          <FormRow>
            <Column>
              <Label htmlFor="country">Kraj</Label>
              <span style={{ fontSize: 10 }}>wybierz</span>
              <Select
                id="country"
                value={form.country}
                onChange={(e) => updateCountry(e.target.value)}
              >
                {(countries.length > 0 ? countries : countriesFallback).map(
                  (c) => (
                    <option key={c.name} value={c.name}>
                      {c.name}
                    </option>
                  )
                )}
              </Select>
            </Column>
            <Column>
              <Label htmlFor="zip">Kod pocztowy</Label>
              <span style={{ fontSize: 10 }}>
                litery, cyfry, spacja i znaki ' , . / -
              </span>
              <Input
                id="zip"
                value={form.zip}
                onChange={(e) => handleZipChange(e.target.value)}
                maxLength={12}
                placeholder={country?.postalFormat || "xx-xxx"}
                style={getInputStyle("zip")}
              />
              {getInputError("zip") && (
                <ErrorText>{getInputError("zip")}</ErrorText>
              )}
            </Column>
          </FormRow>

          <FormRow>
            <Column>
              <Label htmlFor="city">Miejscowość</Label>
              <span style={{ fontSize: 10 }}>
                litery, cyfry, spacja i znaki ' , . / -
              </span>
              <Input
                id="city"
                value={form.city}
                onChange={(e) => handleCityChange(e.target.value)}
                onBlur={() => handleBlurTrim("city")}
                style={getInputStyle("city")}
                placeholder="np. Bielsko-Biała"
              />
              {getInputError("city") && (
                <ErrorText>{getInputError("city")}</ErrorText>
              )}
            </Column>
            <Column>
              <Label htmlFor="street">Ulica i nr</Label>
              <span style={{ fontSize: 10 }}>
                litery, cyfry, spacja i znaki ' , . / -
              </span>
              <Input
                id="street"
                value={form.street}
                onChange={(e) => handleStreetChange(e.target.value)}
                onBlur={() => handleBlurTrim("street")}
                style={getInputStyle("street")}
                placeholder="np. Lipowa 10A/12"
              />
              {getInputError("street") && (
                <ErrorText>{getInputError("street")}</ErrorText>
              )}
            </Column>
          </FormRow>

          <FormRow>
            <Column style={{ maxWidth: "100px" }}>
              <Label htmlFor="phone-code">Kod kraju</Label>
              <Input
                id="phone-code"
                type="text"
                value={form.countryCode}
                readOnly
                disabled
                style={{
                  backgroundColor: "#eee",
                  cursor: "not-allowed",
                }}
              />
            </Column>
            <Column>
              <Label htmlFor="phone">Telefon</Label>
              <Input
                id="phone"
                value={form.phone}
                onChange={(e) => handlePhoneChange(e.target.value)}
                maxLength={form.country === "Poland" ? 9 : 11}
                style={getInputStyle("phone")}
                placeholder={
                  form.country === "Poland" ? "np. 123456789" : "6-11 cyfr"
                }
              />
              {getInputError("phone") && (
                <ErrorText>{getInputError("phone")}</ErrorText>
              )}
            </Column>
          </FormRow>

          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={form.email}
            onChange={(e) => handleEmailChange(e.target.value)}
            onBlur={() => handleBlurTrim("email")}
            style={getInputStyle("email")}
            placeholder="np. jan.kowalski@example.com"
          />
          {getInputError("email") && (
            <ErrorText>{getInputError("email")}</ErrorText>
          )}

          {form.street || form.city || form.zip || form.phone || form.email ? (
            <Summary style={{ marginTop: 30 }}>
              <div>
                <strong>Podsumowanie</strong>
              </div>
              <div
                style={{
                  marginTop: 14,
                }}
              >
                <p style={{ marginBottom: 4 }}>
                  <strong>Kraj:</strong> {form.country}
                </p>
                <p style={{ marginBottom: 4 }}>
                  <strong>Kod pocztowy:</strong> {form.zip}
                </p>
                <p style={{ marginBottom: 4 }}>
                  <strong>Miejscowość:</strong> {form.city}
                </p>
                <p style={{ marginBottom: 4 }}>
                  <strong>Ulica i nr:</strong> {form.street}
                </p>
                <p style={{ marginBottom: 4 }}>
                  <strong>Telefon:</strong> {form.countryCode} {form.phone}
                </p>
                <p style={{ marginBottom: 4 }}>
                  <strong>Email:</strong> {form.email}
                </p>
              </div>
            </Summary>
          ) : null}
          <StyledTradeButton type="submit" disabled={!validateForm()}>
            Złóż zamówienie
          </StyledTradeButton>
        </form>
      </CartPopup>
    </>
  );
};

export default Cart;
