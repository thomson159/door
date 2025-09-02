import styled, { keyframes } from "styled-components";

const pulse = keyframes`
  0% {
    transform: scale(1);
    filter: brightness(1);
  }
  50% {
    transform: scale(1.05);
    filter: brightness(1.2);
  }
  100% {
    transform: scale(1);
    filter: brightness(1);
  }
`;

export const StyledTradeButton = styled.button`
  max-width: 200px;
  height: 40px;
  opacity: ${({ disabled }) => (disabled ? "0.8" : "1")};
  font-size: 18px;
  cursor: pointer;
  padding: 0.25rem 0.75rem;
  color: white;
  border-radius: 2px;
  width: 100%;
  white-space: nowrap;
  border: none;
  margin-top: 2rem;
  font-weight: 500;
  text-decoration: none;
  display: inline-block;
  transition: all 0.3s ease;

  background: linear-gradient(128.17deg, gray -14.78%, #b8860b 110.05%);

  :hover {
    animation: ${pulse} 0.5s ease-out;
  }

  :focus {
    outline: none;
    opacity: 0.9;
  }

  box-shadow: ${({ theme }) => theme.shadows.small};
`;

export const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  z-index: 999;
`;

export const CartPopup = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  // width: 600px;
  max-width: 90%;
  height: 100vh;
  background: ${({ theme }) => theme.colors.blackWhite || "#fff"};
  padding: 2rem;
  overflow-y: auto;
  box-shadow: -8px 0 30px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  transform: translateX(100%);
  transition: transform 0.4s ease;

  &.visible {
    transform: translateX(0);
  }
`;

export const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  border: none;
  background: none;
  font-size: 1.2rem;
  cursor: pointer;
`;

export const Th = styled.th`
  border: 1px solid #ddd;
  background: #f0f0f0;
  color: #555;
  padding: 10px;
  text-align: left;

  &:first-child {
    padding-left: 8px;
  }
`;

export const Td = styled.td`
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;

  &:first-child {
    padding-left: 8px;
  }
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
  table-layout: fixed;
`;

export const Button = styled.button`
  margin-top: 1rem;
  width: 200px;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  background: linear-gradient(135deg, #666, #aaa);
  color: white;
  font-weight: bold;
  cursor: pointer;
  display: block;

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

export const Input = styled.input`
  width: 100%;
  padding: 8px;
  margin-top: 5px;
  border-radius: 6px;
  border: 1px solid #ddd;
  font-size: 1rem;
  box-sizing: border-box;
`;

export const Label = styled.label`
  font-size: 0.9rem;
  font-weight: bold;
  display: block;
  margin-top: 2rem;
`;

export const Select = styled.select`
  width: 100%;
  padding: 8px;
  margin-top: 5px;
  border-radius: 6px;
  border: 1px solid #ddd;
  font-size: 1rem;
`;

export const FormRow = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  flex-wrap: wrap;
`;

export const Column = styled.div`
  flex: 1;
  min-width: 200px;
`;

export const Summary = styled.div`
  font-size: 0.8rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #ddd;
  color: #555;
`;

export const ErrorText = styled.div`
  position: absolute;
  color: red;
  font-size: 0.8rem;
  margin-top: 4px;
`;
