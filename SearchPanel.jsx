import { useMemo, useState } from "react";
import Icon from "./Icons";
import "./SearchPanel.css";

export default function SearchPanel({ products, onClose, onSelect }) {
  const [query, setQuery] = useState("");
  const results = useMemo(() => {
    const search = query.trim().toLowerCase();
    return search ? products.filter((item) => `${item.name} ${item.category}`.toLowerCase().includes(search)) : products.slice(0, 4);
  }, [products, query]);

  return (
    <div className="overlay-backdrop search-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="search-panel" role="dialog" aria-modal="true" aria-label="Search products">
        <div className="search-top"><span>What are you looking for?</span><button aria-label="Close search" onClick={onClose}><Icon name="close" /></button></div>
        <label className="search-input"><Icon name="search" /><input autoFocus placeholder="Search the collection" value={query} onChange={(event) => setQuery(event.target.value)} /><kbd>ESC</kbd></label>
        <div className="search-results">
          {results.map((product) => (
            <button className="search-result" key={product.id} onClick={() => onSelect(product)}>
              <img src={product.imageUrl} alt="" /><span>{product.name}<small>${product.price.toFixed(2)}</small></span><span aria-hidden="true">↗</span>
            </button>
          ))}
          {results.length === 0 && <p className="search-empty">No pieces found. Try a different search.</p>}
        </div>
      </section>
    </div>
  );
}
