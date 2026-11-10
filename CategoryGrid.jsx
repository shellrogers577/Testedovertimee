import { categories } from "../data/products";
import "./CategoryGrid.css";

export default function CategoryGrid() {
  return (
    <section className="category-grid" id="collections" aria-label="Shop collections">
      {categories.map((category, index) => (
        <a className={`category-card category-card--${index + 1}`} href="#popular" key={category.slug}>
          <img src={category.imageUrl} alt={category.name} />
          <span className="category-shade" />
          <span className="category-copy">
            <span className="category-name">{category.name}</span>
            <span className="category-cta">Shop Now</span>
          </span>
        </a>
      ))}
    </section>
  );
}
