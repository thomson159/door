export const countriesInpost = [
  {
    name: "France",
    code: "+33",
    phoneLength: 9, // bez kierunkowego +33, np. 612345678
    postalFormat: "#####",
    postalRegex: "^\\d{5}$", // np. 75008
  },
  {
    name: "Belgium",
    code: "+32",
    phoneLength: 8, // bez +32
    postalFormat: "####",
    postalRegex: "^\\d{4}$", // np. 1000
  },
  {
    name: "Netherlands",
    code: "+31",
    phoneLength: 9, // np. 612345678
    postalFormat: "#### XX",
    postalRegex: "^\\d{4} [A-Z]{2}$", // np. 1234 AB
  },
  {
    name: "Luxembourg",
    code: "+352",
    phoneLength: 8, // np. 66123456
    postalFormat: "####",
    postalRegex: "^\\d{4}$", // np. 2999
  },
  {
    name: "Spain",
    code: "+34",
    phoneLength: 9, // np. 612345678
    postalFormat: "#####",
    postalRegex: "^\\d{5}$", // np. 28013
  },
  {
    name: "Portugal",
    code: "+351",
    phoneLength: 9, // np. 912345678
    postalFormat: "####-###",
    postalRegex: "^\\d{4}-\\d{3}$", // np. 1000-001
  },
  {
    name: "Italy",
    code: "+39",
    phoneLength: 10, // np. 3123456789
    postalFormat: "#####",
    postalRegex: "^\\d{5}$", // np. 00184
  },
];
