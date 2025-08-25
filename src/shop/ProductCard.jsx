import React from "react";
import {
  ProductCardWrapper,
  ProductImage,
  ProductTitle,
  ProductPrice,
} from "./styled";

const ProductCard = ({ product, selected, onClick }) => {
  return (
    <ProductCardWrapper selected={selected} onClick={onClick}>
      <ProductImage src={product.image} alt={product.title} />
      <ProductTitle>{product.title}</ProductTitle>
      <ProductPrice>{product.price} zł</ProductPrice>
    </ProductCardWrapper>
  );
};

export default ProductCard;
