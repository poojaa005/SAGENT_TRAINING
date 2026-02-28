import React from 'react';
import { useCart } from '../../context/CartContext';
import {
  getProductCategory,
  getProductDescription,
  getProductName,
  getProductOffer,
  getProductPrice,
  getStockQuantity,
} from '../../utils/entityAdapters';
import './ProductCard.css';

const PRODUCT_IMAGES = {
  Grains: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&q=80',
  Dairy: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&q=80',
  Fruits: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400&q=80',
  Vegetables: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&q=80',
  Groceries: 'https://images.unsplash.com/photo-1534483509719-3feaee7c30da?w=400&q=80',
  Bakery: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&q=80',
  Beverages: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&q=80',
  Snacks: 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=400&q=80',
  default: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&q=80',
};

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const name = getProductName(product);
  const price = getProductPrice(product);
  const offer = getProductOffer(product);
  const category = getProductCategory(product);
  const stock = getStockQuantity(product);
  const desc = getProductDescription(product);
  const discountedPrice = offer > 0 ? price - (price * offer) / 100 : price;
  const imageUrl = PRODUCT_IMAGES[category] || PRODUCT_IMAGES.default;

  return (
    <div className="product-card">
      <div className="product-img-wrap">
        <img src={imageUrl} alt={name} className="product-img" loading="lazy" />
        {offer > 0 && <span className="offer-badge">{offer}% OFF</span>}
        {stock === 0 && <div className="out-of-stock-overlay">Out of Stock</div>}
      </div>
      <div className="product-info">
        <span className="product-category">{category}</span>
        <h3 className="product-name">{name}</h3>
        {desc && <p className="product-desc">{desc}</p>}
        <div className="product-pricing">
          <span className="price-current">Rs.{discountedPrice.toFixed(2)}</span>
          {offer > 0 && <span className="price-original">Rs.{price.toFixed(2)}</span>}
        </div>
        <div className="product-footer">
          <span className={`stock-label ${stock > 0 ? 'in' : 'out'}`}>
            {stock > 0 ? `${stock} in stock` : 'Out of stock'}
          </span>
          <button className="add-cart-btn" onClick={() => addToCart(product)} disabled={stock === 0}>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
