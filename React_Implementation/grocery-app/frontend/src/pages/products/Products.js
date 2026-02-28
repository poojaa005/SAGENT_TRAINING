import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { productService } from '../../services/productService';
import ProductCard from '../../components/productcard/ProductCard';
import { getProductCategory, getProductName, getProductPrice, normalizeList } from '../../utils/entityAdapters';
import './Products.css';

const CATEGORIES = ['All', 'Grains', 'Dairy', 'Fruits', 'Vegetables', 'Groceries', 'Bakery', 'Beverages', 'Snacks'];

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy] = useState('default');
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const cat = params.get('category');
    if (cat) setActiveCategory(cat);
    loadProducts();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [products, search, activeCategory, sortBy]);

  const loadProducts = async () => {
    try {
      const data = await productService.getAllProducts();
      setProducts(normalizeList(data));
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let result = [...products];
    if (activeCategory !== 'All') result = result.filter((p) => getProductCategory(p) === activeCategory);
    if (search) result = result.filter((p) => getProductName(p).toLowerCase().includes(search.toLowerCase()));
    if (sortBy === 'price-asc') result.sort((a, b) => getProductPrice(a) - getProductPrice(b));
    if (sortBy === 'price-desc') result.sort((a, b) => getProductPrice(b) - getProductPrice(a));
    if (sortBy === 'name') result.sort((a, b) => getProductName(a).localeCompare(getProductName(b)));
    setFiltered(result);
  };

  return (
    <div className="products-page">
      <div className="products-hero">
        <h1>Our Fresh Market</h1>
        <p>Discover {products.length}+ fresh products from local farms</p>
      </div>
      <div className="products-container">
        <div className="products-toolbar">
          <div className="search-bar">
            <span>Search</span>
            <input type="text" placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} />
            {search && (
              <button onClick={() => setSearch('')} className="clear-search">
                x
              </button>
            )}
          </div>
          <select className="sort-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="default">Sort by: Default</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name">Name: A-Z</option>
          </select>
        </div>

        <div className="category-tabs">
          {CATEGORIES.map((cat) => (
            <button key={cat} className={`cat-tab ${activeCategory === cat ? 'active' : ''}`} onClick={() => setActiveCategory(cat)}>
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="products-grid">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="skeleton-card"></div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">No items</div>
            <h3>No products found</h3>
            <p>Try a different search or category</p>
            <button
              onClick={() => {
                setSearch('');
                setActiveCategory('All');
              }}
              className="btn-reset"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            <p className="results-count">{filtered.length} products found</p>
            <div className="products-grid">
              {filtered.map((p, i) => (
                <div key={i} className="product-anim" style={{ animationDelay: `${i * 0.05}s` }}>
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Products;
