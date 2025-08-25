import styled from "styled-components";

export const Popup = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 2rem;
  border-radius: 16px;
  width: 100%;
  max-width: 1400px;
  max-height: 65vh;
  overflow-y: auto;
  text-align: center;
  color: black;
  @media (max-width: 640px) {
    padding: 0px;
  }
`;

export const PopupProducts = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 16px;
  width: 100%;
  overflow-y: auto;
  text-align: center;
  color: black;
  @media (max-width: 640px) {
    padding: 0px;
  }
`;

export const Input = styled.input`
  width: 100%;
  padding: 12px 14px;
  margin: 0.3rem 0;
  border: 2px solid #ddd;
  border-radius: 10px;
  font-size: 1rem;
  outline: none;
  transition: all 0.25s ease;
  &:focus {
    border-color: #3498db;
    box-shadow: 0 0 8px rgba(52, 152, 219, 0.4);
    transform: scale(1.02);
  }
`;

export const Button = styled.button`
  margin: 1rem auto 0;
  width: 200px;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  background: linear-gradient(135deg, rgb(23, 130, 253), rgb(97, 171, 255));
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  display: block;
  &:hover {
    transform: translateY(-2px) scale(1.02);
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);
  }
  &:disabled {
    background: #aaa;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

export const Spinner = styled.div`
  margin: 1rem auto;
  border: 4px solid #eee;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  animation: spin 1s linear infinite;
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

export const ErrorMsg = styled.p`
  color: red;
  margin: 0.2rem 0;
  font-size: 0.9rem;
  animation: fadeIn 0.3s ease;
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
`;

export const Th = styled.th`
  background: #3498db;
  color: white;
  padding: 10px;
  &:first-child {
    padding-left: 16px;
  }
`;

export const Td = styled.td`
  overflow: hidden;
  white-space: nowrap;
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
  &:first-child {
    padding-left: 16px;
  }
`;

export const CartPopup = styled.div`
  color: black;
  position: fixed;
  top: 0;
  right: 0;
  width: 600px;
  max-width: 90%;
  height: 100vh;
  background: white;
  padding: 2rem;
  overflow-y: auto;
  box-shadow: -8px 0 30px rgba(0, 0, 0, 0.2);
  animation: slideIn 0.3s ease;
  z-index: 1000;
  @keyframes slideIn {
    from {
      transform: translateX(100%);
    }
    to {
      transform: translateX(0%);
    }
  }
`;

export const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, 220px);
  gap: 1rem;
  justify-content: center;
  margin-top: 1rem;
`;

export const ProductCardWrapper = styled.div`
  width: 220px;
  background: #fff;
  border: 2px solid ${(props) => (props.selected ? "#2ecc71" : "white")};
  border-radius: 12px;
  padding: 1rem;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  transition: transform 0.2s, border-color 0.2s;

  &:hover {
    cursor: pointer;
  }
`;

export const ProductPrice = styled.div`
  font-weight: bold;
  margin: 0.25rem 0;
  color: #2ecc71;
`;

export const ProductImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 10px;
`;

export const ProductTitle = styled.h4`
  font-size: 1rem;
  margin: 0.5rem 0;
`;

export const ProductsColumn = styled.div`
  flex: 3;
  overflow-y: auto;
`;

export const OrderColumn = styled.div`
  flex: 3;
  overflow-y: auto;
`;

export const CategoriesColumn = styled.div`
  padding-top: 20px;
  flex: 1;
  max-height: 70vh;
  overflow-y: auto;
  text-align: left;
`;
