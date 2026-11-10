import { useMemo, useState } from "react";
import Header from "./components/Header";
import CategoryGrid from "./components/CategoryGrid";
import ProductSection from "./components/ProductSection";
import StorySection from "./components/StorySection";
import Footer from "./components/Footer";
import VerseMarquee from "./components/VerseMarquee";
import FloatingContact from "./components/FloatingContact";
import SearchPanel from "./components/SearchPanel";
import CartDrawer from "./components/CartDrawer";
import ProductDialog from "./components/ProductDialog";
import AccountPanel from "./components/AccountPanel";
import { products as featuredProducts } from "./data/products";
import "./App.css";

export default function App() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cart, setCart] = useState([]);
  const catalog = featuredProducts;

  const cartCount = useMemo(
    () => cart.reduce((total, item) => total + item.quantity, 0),
    [cart],
  );

  function addToCart(product) {
    setCart((items) => {
      const existing = items.find((item) => item.product.id === product.id);
      return existing
        ? items.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          )
        : [...items, { product, quantity: 1 }];
    });
    setSelectedProduct(null);
    setCartOpen(true);
  }

  function changeQuantity(productId, delta) {
    setCart((items) =>
      items
        .map((item) =>
          item.product.id === productId
            ? { ...item, quantity: item.quantity + delta }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  }

  return (
    <div className="storefront">
      <Header
        cartCount={cartCount}
        menuOpen={menuOpen}
        onMenu={() => setMenuOpen((open) => !open)}
        onSearch={() => setSearchOpen(true)}
        onAccount={() => setAccountOpen(true)}
        onCart={() => setCartOpen(true)}
      />
      {menuOpen && <div className="menu-scrim" onClick={() => setMenuOpen(false)} />}
      <nav className={`mobile-menu ${menuOpen ? "mobile-menu--open" : ""}`}>
        <button className="menu-close" onClick={() => setMenuOpen(false)} aria-label="Close menu">×</button>
        <p className="eyebrow">SHOP THE COLLECTION</p>
        {["Adult Shirts", "Outerwear", "Activewear", "Hats"].map((item) => (
          <a key={item} href="#collections" onClick={() => setMenuOpen(false)}>{item}<span>↗</span></a>
        ))}
        <a href="#our-story" onClick={() => setMenuOpen(false)}>Our story<span>↗</span></a>
        <a href="sms:+13032574241">Text us<span>↗</span></a>
      </nav>

      <main>
        <CategoryGrid />
        <ProductSection products={catalog} onSelect={setSelectedProduct} />
        <VerseMarquee />
        <StorySection />
      </main>
      <Footer />
      <FloatingContact />
      {searchOpen && (
        <SearchPanel
          products={catalog}
          onClose={() => setSearchOpen(false)}
          onSelect={(product) => {
            setSearchOpen(false);
            setSelectedProduct(product);
          }}
        />
      )}
      {accountOpen && <AccountPanel onClose={() => setAccountOpen(false)} />}
      {cartOpen && (
        <CartDrawer
          items={cart}
          onClose={() => setCartOpen(false)}
          onQuantity={changeQuantity}
        />
      )}
      {selectedProduct && (
        <ProductDialog
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAdd={() => addToCart(selectedProduct)}
        />
      )}
    </div>
  );
}
