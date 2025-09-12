import React, { useState, useEffect } from "react";
import {
  CartPopup,
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
  MarginDiv,
  MarginTopDiv,
} from "./CartStyles";
import {
  allowedNameRegex,
  allowedStreetRegex,
  allowedCityRegex,
  poland,
  delivery2,
  delivery3,
  delivery5,
  emptyForm,
  products,
  KURIER,
  KURIER_2,
  KURIER_3,
  POLAND,
  api,
  zipRegexMap,
  defaultRegex,
  info,
  phone,
  email,
  cartForm,
  name,
  zip,
  city,
  street,
  phoneCode,
  country,
  getInputError,
  getSummary,
  getDeliveryMethod,
  getDelivery,
  additionalInfo,
  getInputStyle,
  validateForm,
  france,
} from "./cartUtils";
import { countriesInpost } from "./countries";
import { useTranslation } from "react-i18next";
import "../../i18n";

const Cart = () => {
  const { t } = useTranslation();
  const [countries, setCountries] = useState([]);
  const [currentCountry, setCurrentCountry] = useState(poland);
  const [form, setForm] = useState(emptyForm);
  const [cart, setCart] = useState(products);
  const summary = getSummary(cart);
  const deliveryMethod = getDeliveryMethod(form);
  const delivery = getDelivery(form);

  useEffect(() => {
    if (typeof window !== "undefined") {
      // const saved = localStorage.getItem(cartForm);
      // console.log(JSON.parse(saved));
      // console.log(currentCountry);
      // if (saved) setForm(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    // localStorage.setItem(cartForm, JSON.stringify(form));
  }, [form]);

  useEffect(() => {
    fetch(api)
      .then((res) => {
        if (!res.ok) throw new Error();
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
            [...countriesInpost].sort((a, b) => a.name.localeCompare(b.name))
          );
        }
      })
      .catch(() => {
        setCountries([...countriesInpost]);
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
    const countryObj =
      countries.find((c) => c.name === name) ||
      countriesInpost.find((c) => c.name === name);

    updateForm("country", name);
    updateForm("phoneCode", countryObj?.code || "");
    updateForm("zip", "");
    setCurrentCountry(countryObj);
  };

  const handlePhoneChange = (value) => {
    const cleaned = value.replace(/[^0-9]/g, "");
    const maxLength = form.country === POLAND ? 9 : 11;
    updateForm(phone, cleaned.slice(0, maxLength));
  };

  const handleStreetChange = (value) => {
    if (allowedStreetRegex.test(value)) updateForm(street, value.toUpperCase());
  };

  const handleCityChange = (value) => {
    if (allowedCityRegex.test(value)) updateForm(city, value.toUpperCase());
  };

  const handleBlurTrim = (field) => {
    updateForm(field, form[field].trim());
  };

  const handleEmailChange = (value) => {
    const cleaned = value.trim().toLowerCase();
    const allowedCharsRegex = /^[a-z0-9@.\-]*$/;
    if (allowedCharsRegex.test(cleaned)) updateForm(email, cleaned);
  };

  const handleSubmit = (e) => {
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
      price: summary.price + delivery,
      currency: "PLN",
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

    e.preventDefault();
    if (!validateForm({ ...form, products: order.products }, currentCountry))
      return;

    if (window.confirm(info)) {
      console.log("Zamówienie złożone", order);
    }

    // alert(order);
  };

  const zipMasks = {
    [POLAND]: "##-###",
    ["Portugal"]: "####-###",
    ["Netherlands"]: "#### @@",
  };

  const handleZipChange = (value) => {
    const mask = zipMasks[form.country];
    if (!mask) {
      const allowedCharsRegex = zipRegexMap[form.country] || defaultRegex;
      if (allowedCharsRegex.test(value)) {
        updateForm(zip, value.toUpperCase());
      }
      return;
    }

    let raw = value.toUpperCase().replace(/[^0-9A-Z -]/g, "");
    let formatted = "";
    let rawIndex = 0;

    for (let i = 0; i < mask.length && rawIndex < raw.length; i++) {
      const m = mask[i];
      const c = raw[rawIndex];

      if (m === "#") {
        if (/[0-9]/.test(c)) {
          formatted += c;
          rawIndex++;
        }
      } else if (m === "@") {
        if (/[A-Z]/.test(c)) {
          formatted += c;
          rawIndex++;
        }
      } else {
        // separator z maski
        if (formatted.length === i) {
          // separator jest dokładnie teraz na pozycji maski
          if (c === m) {
            // user sam wpisał
            formatted += c;
            rawIndex++;
          } else {
            // user nie wpisał -> dodaj automatycznie
            formatted += m;
          }
        } else {
          // jeśli separator w złym miejscu -> ignorujemy
          if (c === "-" || c === " ") {
            rawIndex++;
            i--; // spróbuj ponownie ten sam znak maski
          }
        }
      }
    }

    updateForm(zip, formatted);
  };

  const handleNameChange = (value) => {
    if (allowedNameRegex.test(value)) {
      updateForm(name, value.toUpperCase());
    }
  };

  const handleAdditionalInfoChange = (value) => {
    updateForm(additionalInfo, value.slice(0, 5000));
  };

  return (
    <>
      <CartPopup style={{ marginBottom: 200 }}>
        <h2 style={{ width: "100%", textAlign: "center" }}>{t("cart")}</h2>
        <Table>
          <thead>
            <tr>
              <Th></Th>
              <Th>{t("price")}</Th>
              <Th>{t("quantity")}</Th>
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
                    // style={{ width: "60px" }}
                  />
                </Td>
                <Td style={{ paddingRight: 8 }}>
                  <StyledTradeButton
                    style={{ maxWidth: 70, margin: 0, maxWidth: "100%" }}
                    onClick={() => updateQuantity(id, 0)}
                  >
                    {t("remove")}
                  </StyledTradeButton>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
        <Summary>
          <div>
            <strong>{t("summary")}</strong>
          </div>
          <div>
            {t("products_count")}: {summary.items}
          </div>
          <div>
            {t("price")}: {summary.price} zł
          </div>
        </Summary>
        {summary.items === 0 && (
          <div style={{ color: "red", marginBottom: 16 }}>
            {t("empty_cart")}
          </div>
        )}
        <h4 style={{ marginBottom: 12, marginTop: 20 }}>
          {t("choose_delivery")}
        </h4>
        <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <input
            type="radio"
            name="deliveryMethod"
            value={KURIER}
            checked={form.deliveryMethod === KURIER}
            onChange={(e) => {
              updateForm("country", POLAND);
              updateForm("phoneCode", "+48");
              updateForm("deliveryMethod", e.target.value);
              setCurrentCountry(poland);
              updateForm("zip", "");
            }}
          />
          🇵🇱 {t(delivery2)}
        </label>
        {/* <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <input
            type="radio"
            name=deliveryMethod
            value="PACZKOMAT"
            checked={form.deliveryMethod === "PACZKOMAT"}
            onChange={(e) => {
              updateForm(country, POLAND);
              updateForm(phoneCode, "+48");
              updateForm(deliveryMethod, e.target.value);
            }}
          />
          🇵🇱 {delivery1}
        </label> */}
        <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <input
            type="radio"
            name={"deliveryMethod"}
            value={KURIER_2}
            checked={form.deliveryMethod === KURIER_2}
            onChange={(e) => {
              updateForm("country", "France");
              updateForm("phoneCode", "+33");
              updateForm("deliveryMethod", e.target.value);
              setCurrentCountry(france);
              updateForm("zip", "");
            }}
          />
          🇫🇷🇧🇪🇱🇺🇪🇸🇵🇹🇮🇹 {t(delivery3)}
        </label>
        {/* <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <input
            type="radio"
            name=deliveryMethod
            value="PACZKOMAT_2"
            checked={form.deliveryMethod === "PACZKOMAT_2"}
            onChange={(e) => {
              updateForm(country, "France");
              updateForm(phoneCode, "+33");
              updateForm(deliveryMethod, e.target.value);
            }}
          />
          🇫🇷🇧🇪🇱🇺🇪🇸🇵🇹🇮🇹 {delivery4}
        </label> */}
        <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <input
            type="radio"
            name={"deliveryMethod"}
            value={KURIER_3}
            checked={form.deliveryMethod === KURIER_3}
            onChange={(e) => {
              updateForm("deliveryMethod", e.target.value);
              updateForm("zip", "");
            }}
          />
          🌍 {t(delivery5)}
        </label>
        <Summary style={{ marginTop: 16 }}>
          <div>
            <strong>{t("summary")}</strong>
          </div>
          <div>
            <div>
              {t("delivery")}: {delivery} zł
            </div>
            {t("sum_with_delivery")}: {summary.price + delivery} zł
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
          {t("shipping_data")}
        </h2>
        <form onSubmit={handleSubmit}>
          <Label style={{ margin: 0 }} htmlFor={name}>
            {t("fullname")}
          </Label>
          <span style={{ fontSize: 10 }}>{t("fullname_hint")}</span>
          <Input
            id={name}
            value={form.name}
            onChange={(e) => handleNameChange(e.target.value)}
            onBlur={() => handleBlurTrim(name)}
            style={getInputStyle(name, form, currentCountry)}
            placeholder={t("fullname_placeholder")}
            required={true}
          />
          {getInputError(t, name, form, currentCountry) && (
            <ErrorText>
              {getInputError(t, name, form, currentCountry)}
            </ErrorText>
          )}
          {![KURIER].includes(form.deliveryMethod) && (
            <>
              <Label htmlFor={country}>{t("country")}</Label>
              <Select
                style={{ maxWidth: 200 }}
                id={country}
                value={form.country}
                onChange={(e) => updateCountry(e.target.value)}
                disabled={
                  ![KURIER_2, "PACZKOMAT_2", KURIER_3].includes(
                    form.deliveryMethod
                  )
                }
              >
                {[KURIER_2, "PACZKOMAT_2"].includes(form.deliveryMethod)
                  ? countriesInpost.map((c) => (
                      <option key={c.name} value={c.name}>
                        {c.name}
                      </option>
                    ))
                  : (countries.length > 0 ? countries : countriesInpost).map(
                      (c) => (
                        <option key={c.name} value={c.name}>
                          {c.name}
                        </option>
                      )
                    )}
              </Select>
            </>
          )}
          {[KURIER, KURIER_2, KURIER_3].includes(form.deliveryMethod) && (
            <>
              <Label htmlFor={zip}>{t("zip")}</Label>
              <Input
                id={zip}
                value={form.zip}
                onChange={(e) => handleZipChange(e.target.value)}
                maxLength={currentCountry?.postalFormat?.length || 12}
                placeholder={currentCountry?.postalFormat || ""}
                style={getInputStyle(zip, form, currentCountry)}
                required={true}
              />
              {getInputError(t, zip, form, currentCountry) && (
                <ErrorText>
                  {getInputError(t, zip, form, currentCountry)}
                </ErrorText>
              )}
              <FormRow>
                <Column>
                  <Label htmlFor={city}>{t("city")}</Label>
                  <span style={{ fontSize: 10 }}>{t("fullname_hint")}</span>
                  <Input
                    id={city}
                    value={form.city}
                    onChange={(e) => handleCityChange(e.target.value)}
                    onBlur={() => handleBlurTrim(city)}
                    style={getInputStyle(city, form, currentCountry)}
                    placeholder={t("city_placeholder")}
                    required={true}
                  />
                  {getInputError(t, city, form, currentCountry) && (
                    <ErrorText>
                      {getInputError(t, city, form, currentCountry)}
                    </ErrorText>
                  )}
                </Column>
                <Column>
                  <Label htmlFor={street}>{t("street")}</Label>
                  <span style={{ fontSize: 10 }}>{t("fullname_hint")}</span>
                  <Input
                    id={street}
                    value={form.street}
                    onChange={(e) => handleStreetChange(e.target.value)}
                    onBlur={() => handleBlurTrim(street)}
                    style={getInputStyle(street, form, currentCountry)}
                    placeholder={t("street_placeholder")}
                    required={true}
                  />
                  {getInputError(t, street, form, currentCountry) && (
                    <ErrorText>
                      {getInputError(t, street, form, currentCountry)}
                    </ErrorText>
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
              <Label htmlFor={phoneCode}>{t("phone_code")}</Label>
              <Input
                id={phoneCode}
                type="text"
                value={form.phoneCode}
                readOnly
                disabled
                style={{
                  opacity: 0.6,
                  cursor: "not-allowed",
                }}
                required={true}
              />
            </Column>
            <Column>
              <Label htmlFor={phone}>{t("phone")}</Label>
              <Input
                id={phone}
                value={form.phone}
                onChange={(e) => handlePhoneChange(e.target.value)}
                maxLength={form.country === POLAND ? 9 : 11}
                style={getInputStyle(phone, form, currentCountry)}
                placeholder={form.country === POLAND ? "123456789" : "6-11"}
                required={true}
              />
              {getInputError(t, phone, form, currentCountry) && (
                <ErrorText>
                  {getInputError(t, phone, form, currentCountry)}
                </ErrorText>
              )}
            </Column>
          </FormRow>
          <Label htmlFor={email}>{t("email_label")}</Label>
          <Input
            id={email}
            type={email}
            value={form.email}
            onChange={(e) => handleEmailChange(e.target.value)}
            onBlur={() => handleBlurTrim(email)}
            style={getInputStyle(email, form, currentCountry)}
            placeholder={t("email_placeholder")}
            required={true}
          />
          {getInputError(t, email, form, currentCountry) && (
            <ErrorText>
              {getInputError(t, email, form, currentCountry)}
            </ErrorText>
          )}
          <Label htmlFor={additionalInfo}>{t("additional_info")}</Label>
          <TextArea
            id={additionalInfo}
            value={form.additionalInfo}
            onChange={(e) => handleAdditionalInfoChange(e.target.value)}
            maxLength={5000}
            placeholder={t("additional_info_placeholder")}
          />
          <Summary></Summary>
          <h2
            style={{
              marginTop: 40,
              marginBottom: 0,
              width: "100%",
              textAlign: "center",
            }}
          >
            {t("summary")}
          </h2>
          <FormRow>
            <Column>
              <Summary style={{ marginTop: 30, border: "none" }}>
                <strong>{t("address")}</strong>
                <MarginTopDiv>
                  <MarginDiv>
                    <strong>{t("delivery")}:</strong>{" "}
                    {/* {form.deliveryMethod === "PACZKOMAT" &&
                      `${delivery1}: ${form.lockerId}`}
                    {form.deliveryMethod === "PACZKOMAT_2" &&
                      `${delivery4}: ${form.lockerId}`} */}
                    {t(deliveryMethod)}
                  </MarginDiv>
                  <MarginDiv>
                    <strong>{t("receiver")}:</strong> {form.name}
                  </MarginDiv>
                  <MarginDiv>
                    <strong>{t("country")}:</strong> {form.country}
                  </MarginDiv>
                  {form.deliveryMethod === KURIER && (
                    <>
                      <MarginDiv>
                        <strong>{t("zip")}:</strong> {form.zip}
                      </MarginDiv>
                      <MarginDiv>
                        <strong>{t("city")}:</strong> {form.city}
                      </MarginDiv>
                      <MarginDiv>
                        <strong>{t("street")}</strong> {form.street}
                      </MarginDiv>
                    </>
                  )}
                  <MarginDiv>
                    <strong>{t("phone")}:</strong> {form.phoneCode} {form.phone}
                  </MarginDiv>
                  <MarginDiv>
                    <strong>{t("email_label")}:</strong> {form.email}
                  </MarginDiv>
                  <MarginDiv>
                    <strong>{t("extra_info")}:</strong> {form.additionalInfo}
                  </MarginDiv>
                </MarginTopDiv>
              </Summary>
            </Column>
            <Column>
              <Summary style={{ marginTop: 16, border: "none" }}>
                <div style={{ marginBottom: 14 }}>
                  <strong>{t("basket")}</strong>
                </div>
                {cart[0].quantity <= 0 && cart[1].quantity <= 0 && (
                  <>{t("empty")}</>
                )}
                {cart[0].quantity > 0 && (
                  <div>
                    {cart[0].title}: {cart[0].quantity}
                  </div>
                )}
                {cart[1].quantity > 0 && (
                  <div>
                    {cart[1].title}: {cart[1].quantity}
                  </div>
                )}
                <MarginTopDiv>
                  <strong>{t("cost")}</strong>
                </MarginTopDiv>
                <MarginTopDiv>
                  {t("price")}: {summary.price} zł
                </MarginTopDiv>
                <div>
                  {t("delivery")}: {delivery} zł
                </div>
                <div style={{ marginTop: 10 }}>
                  <strong style={{ fontSize: 16 }}>
                    {t("total_to_pay")}: {summary.price + delivery} zł
                  </strong>
                </div>
              </Summary>
            </Column>
          </FormRow>
          <input required={true} type="checkbox" />
          <span
            style={{
              fontSize: 15,
              marginLeft: 8,
              marginRight: 40,
              marginBottom: 10,
            }}
          >
            {t("accept")}{" "}
            <a target="_black" href="/privacy">
              {" "}
              {t("policy")}
            </a>
          </span>
          <StyledTradeButton type="submit">{t("pay")}</StyledTradeButton>
        </form>
      </CartPopup>
    </>
  );
};

export default Cart;
