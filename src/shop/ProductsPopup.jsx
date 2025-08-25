import React from "react";
import {
  PopupProducts,
  ProductsColumn,
  CategoriesColumn,
  Button,
} from "./styled";
import ProductCard from "./ProductCard";

const ProductsPopup = ({
  products,
  filteredProducts,
  categories,
  selectedCategories,
  toggleCategory,
  cart,
  toggleProductInCart,
  productsLoading,
  productsError,
  closeProductsPopup,
}) => {
  return (
    <PopupProducts style={{ paddingBottom: "2rem" }}>
      <Button style={{ maxWidth: 28, margin: 0 }} onClick={closeProductsPopup}>
        ✖
      </Button>
      <h2>Produkty</h2>

      <ProductsColumn>
        {productsLoading && <p>Ładowanie...</p>}
        {productsError && <p style={{ color: "red" }}>{productsError}</p>}
        {!productsLoading && !productsError && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                selected={cart.find((item) => item.id === product.id) !== undefined}
                onClick={() => toggleProductInCart(product)}
              />
            ))}
          </div>
        )}
      </ProductsColumn>

      {!productsLoading && (
        <CategoriesColumn>
          <h3>Kategorie</h3>
          {categories.map((category) => (
            <div key={category}>
              <label>
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category)}
                  onChange={() => toggleCategory(category)}
                />{" "}
                {category}
              </label>
            </div>
          ))}
        </CategoriesColumn>
      )}
    </PopupProducts>
  );
};

export default ProductsPopup;
