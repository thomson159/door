import "@testing-library/jest-dom";

// Mock dla styled-components w testach
import styled from "styled-components";

jest.mock("styled-components", () => {
  const actualStyled = jest.requireActual("styled-components");
  return {
    __esModule: true,
    ...actualStyled,
    default: actualStyled.default,
  };
});
