import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productService } from '../../services/productService';
import ProductCard from '../../components/productcard/ProductCard';
import { normalizeList } from '../../utils/entityAdapters';
import './Home.css';

const CATEGORIES = [
  { name: 'Fruits', icon: '🍎', img: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=300&q=80' },
  { name: 'Vegetables', icon: '🥦', img: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300&q=80' },
  { name: 'Dairy', icon: '🥛', img: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=300&q=80' },
  { name: 'Grains', icon: '🌾', img: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300&q=80' },
  { name: 'Groceries', icon: '🛒', img: 'https://images.unsplash.com/photo-1534483509719-3feaee7c30da?w=300&q=80' },
  { name: 'Bakery', icon: '🍞', img: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&q=80' },
];

const TESTIMONIALS = [
  { name: 'Priya S.', text: 'FreshMart has changed how I grocery shop. Super fresh and fast delivery!', rating: 5 },
  { name: 'Rahul K.', text: 'Love the AI assistant feature. It helped me plan my weekly meals perfectly.', rating: 5 },
  { name: 'Anita M.', text: 'Great prices and amazing quality. Highly recommend to everyone!', rating: 4 },
];

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [heroVisible, setHeroVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setHeroVisible(true), 100);
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const products = await productService.getAllProducts();
      setFeaturedProducts(normalizeList(products).slice(0, 4));
    } catch {
      setFeaturedProducts([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home">
      {/* HERO */}
      <section className={`hero ${heroVisible ? 'visible' : ''}`}>
        <div className="hero-bg">
          <div className="hero-blob blob1"></div>
          <div className="hero-blob blob2"></div>
          <div className="hero-blob blob3"></div>
        </div>
        <div className="hero-content">
          <div className="hero-text">
            <span className="hero-badge">🌿 Farm to Table</span>
            <h1 className="hero-title">
              Fresh Groceries<br />
              <span className="highlight">Delivered Fast</span>
            </h1>
            <p className="hero-subtitle">
              Shop premium quality fruits, vegetables, and daily essentials. Fresh from local farms, delivered to your doorstep in hours.
            </p>
            <div className="hero-actions">
              <Link to="/products" className="btn-primary">Shop Now →</Link>
              <Link to="/ai-assistant" className="btn-ai">✨ Try AI Assistant</Link>
            </div>
            <div className="hero-stats">
              <div className="stat"><span>2000+</span><p>Products</p></div>
              <div className="stat-divider"></div>
              <div className="stat"><span>50k+</span><p>Customers</p></div>
              <div className="stat-divider"></div>
              <div className="stat"><span>2hr</span><p>Delivery</p></div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-img-wrap">
              <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&q=85" alt="Fresh Groceries" className="hero-img" />
              <div className="floating-card card1">
                <span>🚀</span>
                <div><strong>Fast Delivery</strong><p>Under 2 hours</p></div>
              </div>
              <div className="floating-card card2">
                <span>⭐</span>
                <div><strong>4.9 Rating</strong><p>50k+ reviews</p></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="features-strip">
        <div className="features-container">
          {[
            { icon: '🌱', title: 'Organic Fresh', desc: '100% natural, no preservatives' },
            { icon: '🚚', title: 'Free Delivery', desc: 'On orders above ₹499' },
            { icon: '🔄', title: 'Easy Returns', desc: 'No questions asked' },
            { icon: '💳', title: 'Secure Payment', desc: 'UPI, Card, COD accepted' },
          ].map((f, i) => (
            <div key={i} className="feature-chip">
              <span className="feature-icon">{f.icon}</span>
              <div>
                <strong>{f.title}</strong>
                <p>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="section categories-section">
        <div className="section-container">
          <div className="section-header">
            <span className="section-tag">Browse</span>
            <h2>Shop by Category</h2>
            <p>Find everything you need, organized by type</p>
          </div>
          <div className="categories-grid">
            {CATEGORIES.map((cat, i) => (
              <Link to={`/products?category=${cat.name}`} key={i} className="category-card">
                <div className="cat-img-wrap">
                  <img src={cat.img} alt={cat.name} />
                </div>
                <span className="cat-icon">{cat.icon}</span>
                <h3>{cat.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="section featured-section">
        <div className="section-container">
          <div className="section-header">
            <span className="section-tag">Featured</span>
            <h2>Fresh Picks Today</h2>
            <p>Hand-selected items at the best prices</p>
          </div>
          {loading ? (
            <div className="products-loading">
              {[1,2,3,4].map(i => <div key={i} className="skeleton-card"></div>)}
            </div>
          ) : (
            <div className="products-grid">
              {featuredProducts.map((p, i) => (
                <div key={i} className="product-anim" style={{ animationDelay: `${i * 0.1}s` }}>
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          )}
          <div className="view-all-wrap">
            <Link to="/products" className="btn-outline-lg">View All Products →</Link>
          </div>
        </div>
      </section>

      {/* BANNER */}
      <section className="promo-banner">
        <div className="promo-content">
          <div className="promo-text">
            <span>🤖 Powered by AI</span>
            <h2>Meet Your Personal Grocery Assistant</h2>
            <p>Get recipe suggestions, meal plans, and shopping help from our AI assistant. It knows exactly what you need!</p>
            <Link to="/ai-assistant" className="btn-white">Chat with AI →</Link>
          </div>
          <div className="promo-visual">
            <div className="chat-preview">
              <div className="chat-msg bot">What meals are you planning this week? 🌿</div>
              <div className="chat-msg user">I want healthy Indian meals!</div>
              <div className="chat-msg bot">Great! I'll suggest a list with fresh veggies and spices 🎯</div>
              <div className="chat-typing"><span></span><span></span><span></span></div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="section testimonials-section">
        <div className="section-container">
          <div className="section-header">
            <span className="section-tag">Reviews</span>
            <h2>What Our Customers Say</h2>
          </div>
          <div className="testimonials-grid">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="testimonial-card">
                <div className="stars">{'⭐'.repeat(t.rating)}</div>
                <p>"{t.text}"</p>
                <div className="reviewer">
                  <div className="reviewer-avatar">{t.name.charAt(0)}</div>
                  <strong>{t.name}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
