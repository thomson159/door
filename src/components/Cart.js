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
  StyledTradeButton,
  TextArea,
} from "./CartStyles";
import InPostWidget from "./InPostWidget";

const Cart = () => {
  const [visible, setVisible] = useState(true);
  const [countries, setCountries] = useState([]);
  const [cart, setCart] = useState([
    { id: 1, title: "Produkt A", price: 219, quantity: 0 },
    { id: 2, title: "Produkt B", price: 219, quantity: 0 },
  ]);

  const countriesFallback = [
    {
      name: "France",
      code: "+33",
      postalFormat: "#####",
      postalRegex: "^\\d{5}$",
    },
    {
      name: "Belgium",
      code: "+32",
      postalFormat: "####",
      postalRegex: "^\\d{4}$",
    },
    {
      name: "Netherlands",
      code: "+31",
      postalFormat: "#### @@",
      postalRegex: "^\\d{4}\\s?[A-Z]{2}$",
    },
    {
      name: "Luxembourg",
      code: "+352",
      postalFormat: "####",
      postalRegex: "^\\d{4}$",
    },
    {
      name: "Spain",
      code: "+34",
      postalFormat: "#####",
      postalRegex: "^\\d{5}$",
    },
    {
      name: "Portugal",
      code: "+351",
      postalFormat: "####-###",
      postalRegex: "^\\d{4}-?\\d{3}$",
    },
    {
      name: "Italy",
      code: "+39",
      postalFormat: "#####",
      postalRegex: "^\\d{5}$",
    },
  ];

  const [form, setForm] = useState({
    name: "",
    country: "Poland",
    phoneCode: "+48",
    street: "",
    zip: "",
    city: "",
    phone: "",
    email: "",
    additionalInfo: "",
    deliveryMethod: "KURIER",
    locker: {
      name: "",
      address: "",
      city: "",
      zip: "",
      locationDescription: "",
    },
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("cartForm");
      if (saved) setForm(JSON.parse(saved));
    }
  }, []);

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
    updateForm("phoneCode", country?.code || "");
  };

  const hasLetter = (str) => /[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ]/.test(str);
  const allowedNameRegex = /^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ0-9\s',./-]*$/;

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
    // if (form.deliveryMethod === "PACZKOMAT") {
    //   return form.lockerId?.trim() !== "";
    // }

    const { street, zip, city, phone, email, name } = form;
    const hasItems = cart.some((item) => item.quantity > 0);

    return (
      hasItems &&
      street.trim() &&
      city.trim() &&
      hasLetter(street) &&
      hasLetter(city) &&
      validateZip(zip) &&
      validatePhone(phone) &&
      validateEmail(email) &&
      name.trim()
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
    if (field === "name")
      isValid = form.name?.trim() && allowedNameRegex.test(form.name);

    return { borderColor: isValid ? "#ddd" : "red" };
  };

  const getInputError = (field) => {
    const { street, city, zip, phone, email, name } = form;

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
      return (
        (country?.name + " " || "Poland") +
        (country?.postalFormat || "xx-xxx") +
        " (cyfry #)"
      );
    if (field === "name" && name.trim() && !hasLetter(name))
      return "Pole musi zawierać co najmniej jedną literę.";

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

    const deliveryMethod =
      (form.deliveryMethod === "KURIER" && delivery2) ||
      (form.deliveryMethod === "KURIER_2" && delivery3) ||
      (form.deliveryMethod === "KURIER_3" && delivery5) ||
      "";

    const order = {
      name: form.name,
      country: form.country,
      phoneCode: form.phoneCode,
      street: form.street,
      zip: form.zip,
      city: form.city,
      phone: form.phone,
      email: form.email,
      additionalInfo: form.additionalInfo,
      endPricePLN: summary.price + delivery,
      deliveryMethod: deliveryMethod,
      products: [],
    };

    if (cart[0].quantity > 0) {
      order.products.push({
        name: cart[0].title,
        quantity: cart[0].quantity,
      });
    }

    if (cart[1].quantity > 0) {
      order.products.push({
        name: cart[1].title,
        quantity: cart[1].quantity,
      });
    }

    console.log("Zamówienie złożone", order);
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
    if (form.country === "Poland") {
      const allowedCharsRegex = /^[0-9\s-]*$/;
      if (allowedCharsRegex.test(value)) {
        updateForm("zip", value.toUpperCase());
      }
    } else {
      const allowedCharsRegex = /^[a-zA-Z0-9\s',./-]*$/;
      if (allowedCharsRegex.test(value)) {
        updateForm("zip", value.toUpperCase());
      }
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

  const handleNameChange = (value) => {
    if (allowedNameRegex.test(value)) {
      updateForm("name", value.toUpperCase());
    }
  };

  const handleAdditionalInfoChange = (value) => {
    updateForm("additionalInfo", value.slice(0, 5000));
  };

  const delivery2 = "Kurier InPost 19,99 zł";
  const delivery1 = "Paczkomat InPost 16,99 zł";

  const delivery3 = "Kurier InPost 28,99 zł";
  const delivery4 = "Paczkomat InPost 49,99 zł";

  const delivery5 = "Kurier 69,99 zł";

  const delivery =
    form.deliveryMethod === "PACZKOMAT"
      ? parseFloat(delivery1.split(" ")[2].replace(",", "."))
      : form.deliveryMethod === "KURIER"
      ? parseFloat(delivery2.split(" ")[2].replace(",", "."))
      : form.deliveryMethod === "PACZKOMAT_2"
      ? parseFloat(delivery4.split(" ")[2].replace(",", "."))
      : form.deliveryMethod === "KURIER_2"
      ? parseFloat(delivery3.split(" ")[2].replace(",", "."))
      : form.deliveryMethod === "KURIER_3"
      ? parseFloat(delivery5.split(" ")[1].replace(",", "."))
      : 0;

  return (
    <>
      <CartPopup className={visible ? "visible" : ""}>
        <h2 style={{ width: "100%", textAlign: "center" }}>Twój koszyk</h2>
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
        <h4 style={{ marginBottom: 12, marginTop: 20 }}>
          Wybierz metodę dostawy:
        </h4>
        <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <input
            type="radio"
            name="deliveryMethod"
            value="KURIER"
            checked={form.deliveryMethod === "KURIER"}
            onChange={(e) => {
              updateForm("country", "Poland");
              updateForm("phoneCode", "+48");
              updateForm("deliveryMethod", e.target.value);
            }}
          />
          🇵🇱 {delivery2}
        </label>
        {/* <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <input
            type="radio"
            name="deliveryMethod"
            value="PACZKOMAT"
            checked={form.deliveryMethod === "PACZKOMAT"}
            onChange={(e) => {
              updateForm("country", "Poland");
              updateForm("phoneCode", "+48");
              updateForm("deliveryMethod", e.target.value);
            }}
          />
          🇵🇱 {delivery1}
        </label> */}
        <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <input
            type="radio"
            name="deliveryMethod"
            value="KURIER_2"
            checked={form.deliveryMethod === "KURIER_2"}
            onChange={(e) => {
              updateForm("country", "France");
              updateForm("phoneCode", "+33");
              updateForm("deliveryMethod", e.target.value);
            }}
          />
          🇫🇷🇧🇪🇱🇺🇪🇸🇵🇹🇮🇹 {delivery3}
        </label>
        {/* <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <input
            type="radio"
            name="deliveryMethod"
            value="PACZKOMAT_2"
            checked={form.deliveryMethod === "PACZKOMAT_2"}
            onChange={(e) => {
              updateForm("country", "France");
              updateForm("phoneCode", "+33");
              updateForm("deliveryMethod", e.target.value);
            }}
          />
          🇫🇷🇧🇪🇱🇺🇪🇸🇵🇹🇮🇹 {delivery4}
        </label> */}
        <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <input
            type="radio"
            name="deliveryMethod"
            value="KURIER_3"
            checked={form.deliveryMethod === "KURIER_3"}
            onChange={(e) => updateForm("deliveryMethod", e.target.value)}
          />
          🌍 {delivery5}
        </label>
        <Summary style={{ marginTop: 16 }}>
          <div>
            <strong>Podsumowanie</strong>
          </div>
          <div>
            <div>Dostawa: {delivery} zł</div>
            Suma (cena + dostawa): {summary.price + delivery} zł
          </div>
        </Summary>

        <h2
          style={{
            marginTop: 40,
            marginBottom: 0,
            width: "100%",
            textAlign: "center",
          }}
        >
          Dane do wysyłki
        </h2>
        <form onSubmit={handleSubmit}>
          <Label style={{ margin: 0 }} htmlFor="name">
            Imię i nazwisko
          </Label>
          <span style={{ fontSize: 10 }}>
            litery, cyfry, spacja i znaki ' , . / -
          </span>
          <Input
            id="name"
            value={form.name}
            onChange={(e) => handleNameChange(e.target.value)}
            onBlur={() => handleBlurTrim("name")}
            style={getInputStyle("name")}
            placeholder="np. Jan Kowalski"
          />
          {getInputError("name") && (
            <ErrorText>{getInputError("name")}</ErrorText>
          )}
          {!["KURIER"].includes(form.deliveryMethod) && (
            <>
              <Label htmlFor="country">Kraj</Label>
              <Select
                style={{ maxWidth: 130 }}
                id="country"
                value={form.country}
                onChange={(e) => updateCountry(e.target.value)}
                disabled={
                  !["KURIER_2", "PACZKOMAT_2", "KURIER_3"].includes(
                    form.deliveryMethod
                  )
                }
              >
                {["KURIER_2", "PACZKOMAT_2"].includes(form.deliveryMethod)
                  ? countriesFallback.map((c) => (
                      <option key={c.name} value={c.name}>
                        {c.name}
                      </option>
                    ))
                  : (countries.length > 0 ? countries : countriesFallback).map(
                      (c) => (
                        <option key={c.name} value={c.name}>
                          {c.name}
                        </option>
                      )
                    )}
              </Select>
            </>
          )}
          {["KURIER", "KURIER_2", "KURIER_3"].includes(form.deliveryMethod) && (
            <>
              <Label htmlFor="zip">Kod pocztowy</Label>
              <Input
                id="zip"
                value={form.zip}
                onChange={(e) => handleZipChange(e.target.value)}
                maxLength={country?.postalFormat?.length || 12}
                placeholder={country?.postalFormat || "xx-xxx"}
                style={getInputStyle("zip")}
              />
              {getInputError("zip") && (
                <ErrorText>{getInputError("zip")}</ErrorText>
              )}
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
            </>
          )}
          {/* {(form.deliveryMethod === "PACZKOMAT") |
            (form.deliveryMethod === "PACZKOMAT_2") && (
            <InPostWidget form={form} updateForm={updateForm} />
          )} */}
          <FormRow>
            <Column style={{ maxWidth: "100px" }}>
              <Label htmlFor="phone-code">Kod kraju</Label>
              <Input
                id="phone-code"
                type="text"
                value={form.phoneCode}
                readOnly
                disabled
                style={{
                  opacity: 0.6,
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
          <Label htmlFor="additionalInfo">Informacje dodatkowe</Label>
          <TextArea
            id="additionalInfo"
            value={form.additionalInfo}
            onChange={(e) => handleAdditionalInfoChange(e.target.value)}
            maxLength={5000}
            placeholder="Dodatkowe informacje (max 5000 znaków)"
          />
          <h2
            style={{
              marginTop: 40,
              marginBottom: 0,
              width: "100%",
              textAlign: "center",
            }}
          >
            Podsumowanie
          </h2>
          <FormRow>
            <Column>
              <Summary style={{ marginTop: 30, border: "none" }}>
                <div>
                  <strong>Adres</strong>
                </div>
                <div
                  style={{
                    marginTop: 14,
                  }}
                >
                  <p style={{ marginBottom: 4 }}>
                    <strong>Dostawa:</strong>{" "}
                    {/* {form.deliveryMethod === "PACZKOMAT" &&
                      `${delivery1}: ${form.lockerId}`}
                    {form.deliveryMethod === "PACZKOMAT_2" &&
                      `${delivery4}: ${form.lockerId}`} */}
                    {form.deliveryMethod === "KURIER" && delivery2}
                    {form.deliveryMethod === "KURIER_2" && delivery3}
                    {form.deliveryMethod === "KURIER_3" && delivery5}
                  </p>
                  <p style={{ marginBottom: 4 }}>
                    <strong>Odbiorca:</strong> {form.name}
                  </p>
                  <p style={{ marginBottom: 4 }}>
                    <strong>Kraj:</strong> {form.country}
                  </p>
                  {form.deliveryMethod === "KURIER" && (
                    <>
                      <p style={{ marginBottom: 4 }}>
                        <strong>Kod pocztowy:</strong> {form.zip}
                      </p>
                      <p style={{ marginBottom: 4 }}>
                        <strong>Miejscowość:</strong> {form.city}
                      </p>
                      <p style={{ marginBottom: 4 }}>
                        <strong>Ulica i nr:</strong> {form.street}
                      </p>
                    </>
                  )}
                  <p style={{ marginBottom: 4 }}>
                    <strong>Telefon:</strong> {form.phoneCode} {form.phone}
                  </p>
                  <p style={{ marginBottom: 4 }}>
                    <strong>Email:</strong> {form.email}
                  </p>
                  <p style={{ marginBottom: 4 }}>
                    <strong>Dodatkowe informacje:</strong>{" "}
                    {form.additionalInfo ? form.additionalInfo : "brak"}
                  </p>
                </div>
              </Summary>
            </Column>
            <Column>
              <Summary style={{ marginTop: 16, border: "none" }}>
                <div style={{ marginBottom: 14 }}>
                  <strong>Koszyk</strong>
                </div>
                {cart[0].quantity > 0 && (
                  <div>
                    Ilość - {cart[0].title}: {cart[0].quantity}
                  </div>
                )}
                {cart[1].quantity > 0 && (
                  <div>
                    Ilość - {cart[1].title}: {cart[1].quantity}
                  </div>
                )}
                <div
                  style={{
                    marginTop: 14,
                  }}
                >
                  <strong>Koszt</strong>
                </div>
                <div
                  style={{
                    marginTop: 14,
                  }}
                >
                  Cena: {summary.price} zł
                </div>
                <div>Dostawa: {delivery} zł</div>
                <div style={{ marginTop: 10 }}>
                  <strong style={{ fontSize: 16 }}>
                    Suma do zaplaty: {summary.price + delivery} zł
                  </strong>
                </div>
              </Summary>
            </Column>
          </FormRow>
          <StyledTradeButton type="submit" disabled={!validateForm()}>
            Zapłać
          </StyledTradeButton>
        </form>
      </CartPopup>
    </>
  );
};

export default Cart;
