import Icon from "./Icons";
import "./ProductDialog.css";

export default function ProductDialog({ product, onClose, onAdd }) {
  return (
    <div className="overlay-backdrop product-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="product-dialog" role="dialog" aria-modal="true" aria-label={product.name}>
        <button className="product-dialog-close" aria-label="Close product details" onClick={onClose}><Icon name="close" /></button>
        <div className="dialog-image"><img src={product.imageUrl} alt={product.name} /></div>
        <div className="dialog-details">
          <p className="dialog-category">{product.category}</p>
          <h2>{product.name}</h2>
          <p className="dialog-price">${product.price.toFixed(2)}</p>
          <p className="dialog-description">{product.description}</p>
          <p className="dialog-stock">{product.stock <= 5 ? "A few left in this run" : "Made to wear, made to last"}</p>
          <button className="dialog-add" onClick={onAdd}>Add to bag — ${product.price.toFixed(2)}</button>
          <a className="dialog-contact" href="sms:+13032574241">Questions? Text us at +1 (303) 257-4241</a>
        </div>
      </section>
    </div>
  );
}
