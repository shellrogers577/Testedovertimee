import Icon from "./Icons";
import "./CartDrawer.css";

export default function CartDrawer({ items, onClose, onQuantity }) {
  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const orderMessage = [
    "Hi! I’d like to place this order from Tested Over Time:",
    "",
    ...items.map(
      ({ product, quantity }) =>
        `${quantity} × ${product.name} — $${(product.price * quantity).toFixed(2)}`,
    ),
    "",
    `Subtotal: $${total.toFixed(2)}`,
    "",
    "Please let me know the shipping cost and how to pay.",
  ].join("\n");
  const encodedOrder = encodeURIComponent(orderMessage);

  return (
    <div className="drawer-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <aside className="cart-drawer" role="dialog" aria-modal="true" aria-label="Your bag">
        <div className="drawer-heading"><h2>Your bag <span>({items.reduce((sum, item) => sum + item.quantity, 0)})</span></h2><button aria-label="Close bag" onClick={onClose}><Icon name="close" /></button></div>
        {items.length === 0 ? (
          <div className="empty-cart"><Icon name="bag" /><h3>Your bag is taking a breather.</h3><p>Find something that tells your story.</p><button onClick={onClose}>Explore the collection</button></div>
        ) : (
          <>
            <div className="cart-items">
              {items.map(({ product, quantity }) => (
                <article className="cart-item" key={product.id}>
                  <img src={product.imageUrl} alt={product.name} />
                  <div className="cart-item-info"><h3>{product.name}</h3><p>${product.price.toFixed(2)}</p>
                    <div className="quantity-control"><button aria-label="Remove one" onClick={() => onQuantity(product.id, -1)}><Icon name="minus" /></button><span>{quantity}</span><button aria-label="Add one" onClick={() => onQuantity(product.id, 1)}><Icon name="plus" /></button></div>
                  </div>
                  <strong>${(product.price * quantity).toFixed(2)}</strong>
                </article>
              ))}
            </div>
            <div className="cart-summary">
              <div><span>Subtotal</span><strong>${total.toFixed(2)}</strong></div>
              <p>Shipping and payment are confirmed with you directly before your order is finalized.</p>
              <a href={`https://wa.me/13032574241?text=${encodedOrder}`} target="_blank" rel="noreferrer">
                Continue on WhatsApp
              </a>
              <a className="cart-sms-checkout" href={`sms:+13032574241?body=${encodedOrder}`}>
                Text your order instead
              </a>
              <p className="cart-checkout-note">This sends an order request, not a payment. We’ll confirm shipping and payment with you.</p>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
