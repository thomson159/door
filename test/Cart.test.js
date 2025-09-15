import React from "react";
import "@testing-library/jest-dom";
import Cart from "../src/components/shop/Cart";
import { I18nextProvider } from "react-i18next";
import i18n from "../src/i18n";
import { ThemeProvider } from "styled-components";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";

const mockTheme = {
  white: "#FFFFFF",
  black: "#000000",
  textColor: "#010101",
  invertedTextColor: "#FFFFFF",
  greyText: "#6C7284",
  buttonBorder: "#01010130",
  buttonBorderHover: "#01010160",
  heroBG:
    "radial-gradient(76.02% 75.41% at 1.84% 0%, #FF3696 0%, #FFD8EB 100%)",
  gradientBG:
    "linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, #fff 31.19%, rgba(0, 0, 0, 0) 100%)",
  newPill: "radial-gradient(76.02% 75.41% at 1.84% 0%,#000 0%,#260082 100%)",
  invertImage: "filter: invert(1);",
  backgroundColor: "#F7F8FA",
  modalBackground: "rgba(0,0,0,0.5)",
  cardBG: "rgba(0, 0, 0, .04)",
  menuBG: "white",
  marqueeBG: "#010101",
  inputBackground: "#FFFFFF",
  placeholderGray: "#E1E1E1",
  shadowColor: "#FFE135",
  concreteGray: "#FAFAFA",
  mercuryGray: "#E1E1E1",
  silverGray: "#C4C4C4",
  chaliceGray: "#AEAEAE",
  doveGray: "#737373",
  colors: {
    blue1: "#2172E5",
    blue2: "#A9C8F5",
    blue3: "#7DACF0",
    blue4: "#5190EB",
    blue5: "#2172E5",
    blue6: "#1A5BB6",
    blue7: "#144489",
    blue8: "#0E2F5E",
    blue9: "#191B1F",
    grey1: "#FFFFFF",
    grey2: "#F7F8FA",
    grey3: "#EDEEF2",
    grey4: "#CED0D9",
    grey5: "#888D9B",
    grey6: "#565A69",
    grey7: "#40444F",
    grey8: "#2C2F36",
    grey9: "#191B1F",
    white: "#FFFFFF",
    black: "#000000",
    whiteBlack: "#000000",
    blackWhite: "#FFFFFF",
    green1: "#E6F3EC",
    green2: "#27AE60",
    pink1: "#B8860B",
    pink2: "#FF8EC4",
    pink3: "#FFD7EA",
    yellow1: "#F3BE1E",
    yellow2: "#ffe490",
    red1: "#FF6871",
    link: "#B8860B",
    invertedLink: "#FFE135",
  },
  shadows: {
    small: "0px 2px 4px rgba(0, 0, 0, 0.1)",
    large: "0px 6px 10px rgba(0, 0, 0, 0.15)",
    huge:
      "0px 0px 1px rgba(0, 0, 0, 0.02), 0px 4px 8px rgba(0, 0, 0, 0.02), 0px 16px 24px rgba(0, 0, 0, 0.02), 0px 24px 32px rgba(0, 0, 0, 0.02)",
  },
  mediaWidth: {
    upToSmall: "(max-width: 600px)",
    upToMedium: "(max-width: 960px)",
    upToLarge: "(max-width: 1280px)",
  },
  flexColumnNoWrap: "display: flex; flex-flow: column nowrap;",
  flexRowNoWrap: "display: flex; flex-flow: row nowrap;",
};

jest.mock("../src/images/menu.inline.svg", () => "MenuIconMock");
jest.mock("../src/images/x.inline.svg", () => "CloseIconMock");

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve([]),
  })
);

describe("Cart component", () => {
  test("english language, country poland", async () => {
    render(
      <I18nextProvider i18n={i18n}>
        <ThemeProvider theme={mockTheme}>
          <Cart />
        </ThemeProvider>
      </I18nextProvider>
    );

    await waitFor(() => {
      expect(screen.getByText("Your cart")).toBeInTheDocument();
      expect(screen.getByText("Poland")).toBeInTheDocument();
      expect(screen.getByText("+48")).toBeInTheDocument();
    });
  });

  test("renders", async () => {
    render(
      <I18nextProvider i18n={i18n}>
        <ThemeProvider theme={mockTheme}>
          <Cart />
        </ThemeProvider>
      </I18nextProvider>
    );

    await waitFor(() => {
      expect(screen.getByText("Price")).toBeInTheDocument();
      expect(screen.getByText("Quantity")).toBeInTheDocument();
      expect(screen.getByText("Produkt A")).toBeInTheDocument();
      expect(screen.getByText("Produkt B")).toBeInTheDocument();
      expect(screen.getByText("1 zł")).toBeInTheDocument();
      expect(screen.getByText("219 zł")).toBeInTheDocument();
      expect(screen.getByText("Choose delivery method")).toBeInTheDocument();
      expect(screen.getByText("Shipping details")).toBeInTheDocument();
      expect(screen.getByText("Number of products: 0")).toBeInTheDocument();

      expect(screen.getByText("Pay")).toBeInTheDocument();
      expect(screen.getByText("Accept the")).toBeInTheDocument();
      expect(screen.getByText("Privacy Policy")).toBeInTheDocument();
      expect(screen.getByText("Basket")).toBeInTheDocument();
      expect(screen.getByText("empty")).toBeInTheDocument();

      expect(screen.getByText("Total to pay: 1 zł")).toBeInTheDocument();
      expect(screen.getByText("Cost")).toBeInTheDocument();
      expect(screen.getByText("Extra information:")).toBeInTheDocument();
    });
  });

  test("full name input validation", async () => {
    render(
      <I18nextProvider i18n={i18n}>
        <ThemeProvider theme={mockTheme}>
          <Cart />
        </ThemeProvider>
      </I18nextProvider>
    );

    const input = await screen.findByLabelText(/full name/i);

    // CORRECT

    fireEvent.change(input, { target: { value: "John Doe, O'Neil /.-" } });
    expect(input.value).toBe("JOHN DOE, O'NEIL /.-");

    fireEvent.change(input, { target: { value: "J" } });
    expect(input.value).toBe("J");

    fireEvent.change(input, { target: { value: "1" } });
    expect(input.value).toBe("1");
    expect(
      screen.getByText("Must contain at least one letter.")
    ).toBeInTheDocument();

    fireEvent.change(input, { target: { value: "," } });
    expect(input.value).toBe(",");
    expect(
      screen.getByText("Must contain at least one letter.")
    ).toBeInTheDocument();

    fireEvent.change(input, { target: { value: "J" } });
    expect(input.value).toBe("J");

    fireEvent.change(input, { target: { value: "         " } });
    expect(input.value).toBe("         ");

    fireEvent.change(input, { target: { value: "qwe      " } });
    expect(input.value).toBe("QWE      ");

    // INCORRECT

    fireEvent.change(input, { target: { value: "John123@!" } });
    expect(input.value).not.toBe("John123@!");
  });

  test("city input validation", async () => {
    render(
      <I18nextProvider i18n={i18n}>
        <ThemeProvider theme={mockTheme}>
          <Cart />
        </ThemeProvider>
      </I18nextProvider>
    );

    const input = await screen.findByLabelText(/city/i);

    // CORRECT

    fireEvent.change(input, { target: { value: "John Doe, O'Neil /.-" } });
    expect(input.value).toBe("JOHN DOE, O'NEIL /.-");

    fireEvent.change(input, { target: { value: "J" } });
    expect(input.value).toBe("J");

    fireEvent.change(input, { target: { value: "1" } });
    expect(input.value).toBe("1");
    expect(
      screen.getByText("Must contain at least one letter.")
    ).toBeInTheDocument();

    fireEvent.change(input, { target: { value: "," } });
    expect(input.value).toBe(",");
    expect(
      screen.getByText("Must contain at least one letter.")
    ).toBeInTheDocument();

    fireEvent.change(input, { target: { value: "J" } });
    expect(input.value).toBe("J");

    fireEvent.change(input, { target: { value: "         " } });
    expect(input.value).toBe("         ");

    fireEvent.change(input, { target: { value: "qwe      " } });
    expect(input.value).toBe("QWE      ");

    // INCORRECT

    fireEvent.change(input, { target: { value: "John123@!" } });
    expect(input.value).not.toBe("John123@!");
  });

  test("street input validation", async () => {
    render(
      <I18nextProvider i18n={i18n}>
        <ThemeProvider theme={mockTheme}>
          <Cart />
        </ThemeProvider>
      </I18nextProvider>
    );

    const input = await screen.findByLabelText(/street/i);

    // CORRECT

    fireEvent.change(input, { target: { value: "John Doe, O'Neil /.-" } });
    expect(input.value).toBe("JOHN DOE, O'NEIL /.-");

    fireEvent.change(input, { target: { value: "J" } });
    expect(input.value).toBe("J");

    fireEvent.change(input, { target: { value: "1" } });
    expect(input.value).toBe("1");
    expect(
      screen.getByText("Must contain at least one letter.")
    ).toBeInTheDocument();

    fireEvent.change(input, { target: { value: "," } });
    expect(input.value).toBe(",");
    expect(
      screen.getByText("Must contain at least one letter.")
    ).toBeInTheDocument();

    fireEvent.change(input, { target: { value: "J" } });
    expect(input.value).toBe("J");

    fireEvent.change(input, { target: { value: "         " } });
    expect(input.value).toBe("         ");

    fireEvent.change(input, { target: { value: "qwe      " } });
    expect(input.value).toBe("QWE      ");

    // INCORRECT

    fireEvent.change(input, { target: { value: "John123@!" } });
    expect(input.value).not.toBe("John123@!");
  });

  test("email input validation", async () => {
    render(
      <I18nextProvider i18n={i18n}>
        <ThemeProvider theme={mockTheme}>
          <Cart />
        </ThemeProvider>
      </I18nextProvider>
    );

    const input = await screen.findByLabelText(/email/i);

    // CORRECT

    fireEvent.change(input, {
      target: { value: "example@dummy.comasdasdasd" },
    });
    expect(input.value).toBe("example@dummy.comasdasdasd");

    fireEvent.change(input, {
      target: { value: "@." },
    });
    expect(input.value).toBe("@.");

    fireEvent.change(input, {
      target: { value: "1" },
    });
    expect(input.value).toBe("1");

    fireEvent.change(input, {
      target: { value: "ex" },
    });
    expect(input.value).toBe("ex");

    fireEvent.change(input, {
      target: { value: "ex@" },
    });
    expect(input.value).toBe("ex@");

    fireEvent.change(input, {
      target: { value: "ex@asd" },
    });
    expect(input.value).toBe("ex@asd");

    expect(
      screen.getByText("Please enter a valid email address.")
    ).toBeInTheDocument();

    fireEvent.change(input, { target: { value: "         " } });
    expect(input.value).toBe("");

    fireEvent.change(input, { target: { value: "qwe      " } });
    expect(input.value).toBe("qwe");

    fireEvent.change(input, { target: { value: " " } });
    expect(input.value).toBe("");

    // INCORRECT

    expect(input.value).not.toBe(" ");

    fireEvent.change(input, { target: { value: "example@dummy,com" } });
    expect(input.value).not.toBe("example@dummy,com");
    expect(input.value).toBe("");

    fireEvent.change(input, { target: { value: "example@dummy,com    " } });
    expect(input.value).not.toBe("example@dummy,com    ");
    expect(input.value).toBe("");

    fireEvent.change(input, { target: { value: "example@dummy,com    as" } });
    expect(input.value).not.toBe("example@dummy,com    as");
    expect(input.value).toBe("");
  });

  test("phone input validation", async () => {
    render(
      <I18nextProvider i18n={i18n}>
        <ThemeProvider theme={mockTheme}>
          <Cart />
        </ThemeProvider>
      </I18nextProvider>
    );

    const input = await screen.findByLabelText(/phone/i);

    // CORRECT

    fireEvent.change(input, { target: { value: "123456789" } });
    expect(input.value).toBe("123456789");

    expect(screen.getByText("+48 123456789")).toBeInTheDocument();

    fireEvent.change(input, { target: { value: "12345678" } });
    expect(input.value).toBe("12345678");

    expect(
      screen.getByText("Phone number must be exactly 9 digits.")
    ).toBeInTheDocument();

    // INCORRECT

    fireEvent.change(input, { target: { value: "John123@!" } });
    expect(input.value).not.toBe("John123@!");

    fireEvent.change(input, { target: { value: "1234567890" } });
    expect(input.value).not.toBe("1234567890");
  });

  test("POLAND - postal code input validation", async () => {
    render(
      <I18nextProvider i18n={i18n}>
        <ThemeProvider theme={mockTheme}>
          <Cart />
        </ThemeProvider>
      </I18nextProvider>
    );

    const input = await screen.findByLabelText(/postal code/i);

    // CORRECT

    fireEvent.change(input, { target: { value: "1" } });
    expect(input.value).toBe("1");

    expect(screen.getByText("Poland ##-### (digits #)")).toBeInTheDocument();

    fireEvent.change(input, { target: { value: "11-111" } });
    expect(input.value).toBe("11-111");

    fireEvent.change(input, { target: { value: "11" } });
    expect(input.value).toBe("11");

    fireEvent.change(input, { target: { value: "11-" } });
    expect(input.value).toBe("11-");

    fireEvent.change(input, { target: { value: "11-1" } });
    expect(input.value).toBe("11-1");

    // INCORRECT

    fireEvent.change(input, { target: { value: "asd " } });
    expect(input.value).not.toBe("asd ");

    fireEvent.change(input, { target: { value: " " } });
    expect(input.value).not.toBe(" ");

    fireEvent.change(input, { target: { value: "-" } });
    expect(input.value).not.toBe("-");

    fireEvent.change(input, { target: { value: "a" } });
    expect(input.value).not.toBe("a");

    fireEvent.change(input, { target: { value: "-1" } });
    expect(input.value).not.toBe("-1");

    fireEvent.change(input, { target: { value: "1-" } });
    expect(input.value).not.toBe("1-");

    fireEvent.change(input, { target: { value: "11--1" } });
    expect(input.value).not.toBe("11--1");

    fireEvent.change(input, { target: { value: "111111" } });
    expect(input.value).not.toBe("111111");

    fireEvent.change(input, { target: { value: "John123@!" } });
    expect(input.value).not.toBe("John123@!");

    fireEvent.change(input, { target: { value: "1234567" } });
    expect(input.value).not.toBe("1234567");
  });

  test("form validation for all fields", async () => {
    render(
      <I18nextProvider i18n={i18n}>
        <ThemeProvider theme={mockTheme}>
          <Cart />
        </ThemeProvider>
      </I18nextProvider>
    );

    // czekamy na załadowanie inputów
    const fullName = await screen.findByLabelText(/full name/i);
    const phone = screen.getByLabelText(/phone/i);
    const email = screen.getByLabelText(/email/i);
    const postal = screen.getByLabelText(/postal code/i);
    const city = screen.getByLabelText(/city/i);
    const street = screen.getByLabelText(/street/i);

    // test dozwolonych wartości
    fireEvent.change(fullName, { target: { value: "John O'Neil, /.-" } });
    fireEvent.change(phone, { target: { value: "123456789" } });
    fireEvent.change(email, { target: { value: "test@example.com" } });
    fireEvent.change(postal, { target: { value: "12-345" } });
    fireEvent.change(city, { target: { value: "Warsaw" } });
    fireEvent.change(street, { target: { value: "Main Street 10/12" } });

    // sprawdzamy czy wartości zostały ustawione
    expect(fullName.value).toBe("JOHN O'NEIL, /.-");
    expect(phone.value).toBe("123456789");
    expect(email.value).toBe("test@example.com");
    expect(postal.value).toBe("12-345");
    expect(city.value).toBe("WARSAW");
    expect(street.value).toBe("MAIN STREET 10/12");

    // test niedozwolonych wartości (przykładowo)
    fireEvent.change(fullName, { target: { value: "John123@!" } });
    expect(fullName.value).not.toBe("John123@!");
  });
});
