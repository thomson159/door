export const hasLetter = (str) => /[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ]/.test(str);
export const allowedNameRegex = /^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ0-9\s',./-]*$/;
export const allowedStreetRegex = /^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ0-9\s',./-]*$/;
export const allowedCityRegex = /^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ0-9\s',./-]*$/;

export const countriesInpost = [
  {
    name: "France",
    code: "+33",
    postalFormat: "#####",
    postalRegex: "^\\d{5}$", // np. 75008
  },
  {
    name: "Belgium",
    code: "+32",
    postalFormat: "####",
    postalRegex: "^\\d{4}$", // np. 1000
  },
  {
    name: "Netherlands",
    code: "+31",
    postalFormat: "#### XX",
    postalRegex: "^\\d{4} [A-Z]{2}$", // np. 1234 AB
  },
  {
    name: "Luxembourg",
    code: "+352",
    postalFormat: "####",
    postalRegex: "^\\d{4}$", // np. 2999
  },
  {
    name: "Spain",
    code: "+34",
    postalFormat: "#####",
    postalRegex: "^\\d{5}$", // np. 28013
  },
  {
    name: "Portugal",
    code: "+351",
    postalFormat: "####-###",
    postalRegex: "^\\d{4}-\\d{3}$", // np. 1000-001
  },
  {
    name: "Italy",
    code: "+39",
    postalFormat: "#####",
    postalRegex: "^\\d{5}$", // np. 00184
  },
];

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const lastChar = email[email.length - 1];
  return emailRegex.test(email) && !/[^a-zA-Z0-9]/.test(lastChar);
};

export const validatePhone = (phone, form) => {
  const length = phone.length;
  if (!/^[0-9]+$/.test(phone)) return false;
  return form.country === "Poland" ? length === 9 : length >= 6 && length <= 11;
};

export const validateZip = (zip, form, countries) => {
  if (!zip) return false;

  let country = {
    name: "Poland",
    code: "+48",
    postalFormat: "##-###",
    postalRegex: "^\\d{2}-\\d{3}$",
  };

  if (form.deliveryMethod === "KURIER_3") {
    country = countries.find((c) => c.name === form.country);
  }

  if (form.deliveryMethod === "KURIER_2") {
    country = countriesInpost.find((c) => c.name === form.country);
  }

  if (!country || !country.postalRegex) return true;

  const regex = new RegExp(country.postalRegex);
  return regex.test(zip.trim());
};
