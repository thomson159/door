export const api =
  "https://restcountries.com/v3.1/all?fields=name,idd,postalCode";

export const delivery2 = "Kurier InPost 1 zł";
export const delivery1 = "Paczkomat InPost 16,99 zł";
export const delivery3 = "Kurier InPost 28,99 zł";
export const delivery4 = "Paczkomat InPost 49,99 zł";
export const delivery5 = "Kurier 69,99 zł";
export const KURIER = "KURIER";
export const KURIER_2 = "KURIER_2";
export const KURIER_3 = "KURIER_3";
export const POLAND = "Poland";
export const phone = "phone";
export const email = "email";
export const street = "street";
export const city = "city";
export const zip = "zip";
export const name = "name";
export const phoneCode = "phoneCode";
export const country = "country";
export const cartForm = "cartForm";
export const deliveryMethod = "deliveryMethod";
export const additionalInfo = "additionalInfo";

export const info = `Czy masz pewność, że wszystkie informacje są poprawne? Kliknij OK, aby przejść do płatności.`;
export const validPhone = "Telefon musi mieć dokładnie 9 cyfr.";
export const validPhone2 = "Telefon musi mieć od 6 do 11 cyfr.";
export const cyfry = " (cyfry #)";
export const validEmail = "Podaj poprawny adres email.";
export const validInfo = "Musi zawierać co najmniej jedną literę.";

export const hasLetter = (str) => /[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ]/.test(str);
export const allowedNameRegex = /^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ0-9\s',./-]*$/;
export const allowedStreetRegex = /^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ0-9\s',./-]*$/;
export const allowedCityRegex = /^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ0-9\s',./-]*$/;
export const defaultRegex = /^[a-zA-Z0-9\s',./-]*$/;
export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const zipRegexMap = {
  Portugal: /^[0-9-]*$/,
  Netherlands: /^[a-zA-Z0-9 ]*$/,
  France: /^[0-9]*$/,
  Belgium: /^[0-9]*$/,
  Luxembourg: /^[0-9]*$/,
  Spain: /^[0-9]*$/,
  Italy: /^[0-9]*$/,
};

export const emptyForm = {
  name: "",
  country: POLAND,
  phoneCode: "+48",
  street: "",
  zip: "",
  city: "",
  phone: "",
  email: "",
  additionalInfo: "",
  deliveryMethod: KURIER,
  products: [],

  // locker: {
  //   name: "",
  //   address: "",
  //   city: "",
  //   zip: "",
  //   locationDescription: "",
  // },
};

export const products = [
  { id: 1, title: "Produkt A", price: 1, quantity: 0 },
  { id: 2, title: "Produkt B", price: 219, quantity: 0 },
];

export const poland = {
  name: POLAND,
  code: "+48",
  postalFormat: "##-###",
  postalRegex: "^\\d{2}-\\d{3}$",
};

export const france = {
  name: "France",
  code: "+33",
  postalFormat: "#####",
  postalRegex: "^\\d{5}$",
};

export const validateEmail = (email = "") => {
  try {
    if (!email || typeof email !== "string") return false;
    const lastChar = email[email.length - 1];
    return emailRegex.test(email) && /[a-zA-Z0-9]/.test(lastChar);
  } catch {
    return false;
  }
};

export const validatePhone = (phone = "", form = {}) => {
  try {
    if (!phone || typeof phone !== "string") return false;
    const digits = phone.replace(/\s+/g, "");
    if (!/^[0-9]+$/.test(digits)) return false;
    const length = digits.length;
    return form.country === POLAND ? length === 9 : length >= 6 && length <= 11;
  } catch {
    return false;
  }
};

export const validateZip = (zip = "", form = {}, currentCountry) => {
  try {
    if (!zip || typeof zip !== "string") return false;

    let country = poland;
    if (form.deliveryMethod === KURIER_3 || form.deliveryMethod === KURIER_2) {
      country = currentCountry;
    }

    if (!country || !country.postalRegex) return true;

    const regex = new RegExp(country.postalRegex);
    return regex.test(zip.trim());
  } catch {
    return false;
  }
};

export const validateForm = (form, currentCountry) => {
  console.log("@@@@", form);

  try {
    const hasItems =
      Array.isArray(form.products) && form.products.some((i) => i.quantity > 0);

    const x =
      hasItems &&
      !!form.street?.trim() &&
      !!form.city?.trim() &&
      hasLetter(form.street) &&
      hasLetter(form.city) &&
      validateZip(form.zip, form, currentCountry) &&
      validatePhone(form.phone, form) &&
      validateEmail(form.email) &&
      !!form.name?.trim();

    // console.log(hasItems);

    return x;
  } catch {
    return false;
  }
};

export const getSummary = (cart) =>
  cart.reduce(
    (acc, item) => {
      acc.items += item.quantity;
      acc.price += item.quantity * item.price;
      return acc;
    },
    { items: 0, price: 0 }
  );

export const getDeliveryMethod = (form) =>
  (form.deliveryMethod === KURIER && delivery2) ||
  (form.deliveryMethod === KURIER_2 && delivery3) ||
  (form.deliveryMethod === KURIER_3 && delivery5) ||
  "";

export const parseDelivery = (str, index = 2) => {
  try {
    return parseFloat(str.split(" ")[index].replace(",", "."));
  } catch {
    return 0;
  }
};

export const getDelivery = (form) =>
  form.deliveryMethod === "PACZKOMAT"
    ? parseDelivery(delivery1)
    : form.deliveryMethod === KURIER
    ? parseDelivery(delivery2)
    : form.deliveryMethod === "PACZKOMAT_2"
    ? parseDelivery(delivery4)
    : form.deliveryMethod === KURIER_2
    ? parseDelivery(delivery3)
    : form.deliveryMethod === KURIER_3
    ? parseDelivery(delivery5, 1)
    : 0;

export const getInputError = (t, field, form = {}, currentCountry) => {
  try {
    const f = String(field);

    if (f === "street" && form.street?.trim() && !hasLetter(form.street))
      return t(validInfo);
    if (f === "city" && form.city?.trim() && !hasLetter(form.city))
      return t(validInfo);
    if (f === "phone" && form.phone && !validatePhone(form.phone, form))
      return form.country === POLAND ? t(validPhone) : t(validPhone2);
    if (f === "email" && form.email && !validateEmail(form.email))
      return t(validEmail);
    if (f === "zip" && form.zip && !validateZip(form.zip, form, currentCountry))
      return (
        (currentCountry?.name || "") +
        " " +
        (currentCountry?.postalFormat || "") +
        t(cyfry)
      );
    if (f === "name" && form.name?.trim() && !hasLetter(form.name))
      return t(validInfo);

    return "";
  } catch {
    return "";
  }
};

export const getInputStyle = (field, form = {}, currentCountry) => {
  try {
    const f = String(field);
    let isValid = true;

    if (f === "street")
      isValid = !!form.street?.trim() && hasLetter(form.street);
    if (f === "city") isValid = !!form.city?.trim() && hasLetter(form.city);
    if (f === "zip") isValid = validateZip(form.zip, form, currentCountry);
    if (f === "phone") isValid = validatePhone(form.phone, form);
    if (f === "email") isValid = validateEmail(form.email);
    if (f === "name")
      isValid = !!form.name?.trim() && allowedNameRegex.test(form.name);

    return { borderColor: isValid ? "#ddd" : "red" };
  } catch {
    return { borderColor: "red" };
  }
};
