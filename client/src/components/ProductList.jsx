
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getProducts, searchProducts } from "../services/api";
import "./ProductList.css";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = searchTerm.trim()
          ? await searchProducts(searchTerm.trim())
          : await getProducts();

        setProducts(data);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchProducts, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
  };

  return (
    <div className="product-list-container">
      <h2>Our Products</h2>

      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="Search products by name..."
          value={searchTerm}
          onChange={handleSearchChange}
        />

        {searchTerm && (
          <button
            className="clear-search-button"
            onClick={handleClearSearch}
          >
            Clear
          </button>
        )}
      </div>

      {loading ? (
        <div className="loading">Loading products...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : products.length === 0 ? (
        <div className="no-products">
          <p>
            {searchTerm
              ? `No products found matching "${searchTerm}".`
              : "No products available."}
          </p>

          {searchTerm && (
            <button
              className="clear-search-button"
              onClick={handleClearSearch}
            >
              Show All Products
            </button>
          )}
        </div>
      ) : (
        <>
          <p className="search-results-count">
            {products.length} product(s) found
          </p>

          <div className="product-grid">
            {products.map((product) => {
              const price = product.isOnSale
                ? product.salePrice
                : product.price;

              return (
                <Link
                  to={`/products/${product.id}`}
                  key={product.id}
                  className="product-card"
                >
                  <div className="product-image">
                    <img
                      src={
                        product.imageUrl ||
                        "https://placehold.co/300x200/e0e0e0/666?text=No+Image"
                      }
                      alt={product.name}
                    />

                    {product.isOnSale && (
                      <span className="sale-badge">SALE</span>
                    )}
                  </div>

                  <div className="product-info">
                    <h3>{product.name}</h3>

                    <p className="product-description">
                      {product.description}
                    </p>

                    <div className="product-pricing">
                      {product.isOnSale && (
                        <span className="original-price">
                          ${product.price.toFixed(2)}
                        </span>
                      )}

                      <span className="current-price">
                        ${price.toFixed(2)}
                      </span>
                    </div>

                    <p className="product-stock">
                      {product.currentStock > 0
                        ? `${product.currentStock} in stock`
                        : "Out of Stock"}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

export default ProductList;
