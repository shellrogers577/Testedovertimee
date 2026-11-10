import { useRef } from "react";
import Icon from "./Icons";
import "./ProductSection.css";

export default function ProductSection({
  products,
  onSelect,
}) {
  const row = useRef(null);
  const featured = products.filter((product) => product.featured);

  return (
    <section className="product-section" id="popular">
      <div className="section-heading">
        <h2>Most popular</h2>
        <div className="slider-arrows">
          <button
            aria-label="Scroll products left"
            onClick={() =>
              row.current?.scrollBy({ left: -350, behavior: "smooth" })
            }
          >
            <Icon name="left" />
          </button>
          <button
            aria-label="Scroll products right"
            onClick={() =>
              row.current?.scrollBy({ left: 350, behavior: "smooth" })
            }
          >
            <Icon name="right" />
          </button>
        </div>
      </div>
      <div className="product-row" ref={row}>
        {featured.map((product) => (
          <article className="product-card" key={product.id}>
            <button
              className="product-image-button"
              onClick={() => onSelect(product)}
              aria-label={`View ${product.name}`}
            >
              <img src={product.imageUrl} alt={product.name} loading="lazy" />
              {product.stock <= 5 && (
                <span className="stock-tag">Low stock</span>
              )}
            </button>
            <button className="product-info" onClick={() => onSelect(product)}>
              <span className="product-name">{product.name}</span>
              <span className="product-price">${product.price.toFixed(2)}</span>
            </button>
            <button
              className="quick-add"
              aria-label={`Quick add ${product.name}`}
              onClick={() => onSelect(product)}
            >
              <Icon name="plus" />
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
