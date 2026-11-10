import Icon from "./Icons";
import "./Header.css";

export default function Header({ cartCount, menuOpen, onMenu, onSearch, onAccount, onCart }) {
  return (
    <header className="site-header">
      <a className="wordmark" href="#" aria-label="Tested Over Time home">TESTED OVER TIME</a>
      <div className="header-actions">
        <button className="icon-button" aria-label="Search" onClick={onSearch}><Icon name="search" /></button>
        <button className="icon-button account-link" onClick={onAccount} aria-label="Customer account"><Icon name="user" /></button>
        <button className="icon-button cart-button" aria-label={`Shopping bag, ${cartCount} items`} onClick={onCart}>
          <Icon name="bag" />{cartCount > 0 && <span className="cart-count">{cartCount}</span>}
        </button>
        <button className="icon-button menu-button" aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} onClick={onMenu}>
          <Icon name="menu" />
        </button>
      </div>
    </header>
  );
}
