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
