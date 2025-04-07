import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ProductSelector from '../components/ProductSelector';

// Mock data
const mockProducts = [
  {
    _id: 'product1',
    name: 'iPhone 14 Pro',
    nameAr: 'آيفون 14 برو',
    description: 'Latest iPhone model with advanced features',
    descriptionAr: 'أحدث طراز من آيفون مع ميزات متقدمة',
    price: 4999,
    image: 'https://example.com/iphone14.jpg',
    category: 'smartphones'
  },
  {
    _id: 'product2',
    name: 'Samsung Galaxy S23',
    nameAr: 'سامسونج جالاكسي إس 23',
    description: 'Flagship Android smartphone with premium features',
    descriptionAr: 'هاتف أندرويد رائد مع ميزات متميزة',
    price: 3999,
    image: 'https://example.com/galaxys23.jpg',
    category: 'smartphones'
  }
];

describe('ProductSelector Component', () => {
  const mockOnSelectProduct = jest.fn();
  
  test('renders products correctly', () => {
    render(
      <BrowserRouter>
        <ProductSelector 
          products={mockProducts}
          selectedProduct={null}
          onSelectProduct={mockOnSelectProduct}
          language="en"
          discount={10}
          currency="SAR"
        />
      </BrowserRouter>
    );
    
    // Check if product names are displayed
    expect(screen.getByText('iPhone 14 Pro')).toBeInTheDocument();
    expect(screen.getByText('Samsung Galaxy S23')).toBeInTheDocument();
    
    // Check if discount is displayed
    expect(screen.getAllByText('10% OFF')).toHaveLength(2);
    
    // Check if prices are displayed
    expect(screen.getAllByText('Regular Price')).toHaveLength(2);
    expect(screen.getAllByText('Jam3a Price')).toHaveLength(2);
  });
  
  test('displays Arabic content when language is set to Arabic', () => {
    render(
      <BrowserRouter>
        <ProductSelector 
          products={mockProducts}
          selectedProduct={null}
          onSelectProduct={mockOnSelectProduct}
          language="ar"
          discount={10}
          currency="ريال"
        />
      </BrowserRouter>
    );
    
    // Check if Arabic product names are displayed
    expect(screen.getByText('آيفون 14 برو')).toBeInTheDocument();
    expect(screen.getByText('سامسونج جالاكسي إس 23')).toBeInTheDocument();
  });
  
  test('calls onSelectProduct when a product is selected', () => {
    render(
      <BrowserRouter>
        <ProductSelector 
          products={mockProducts}
          selectedProduct={null}
          onSelectProduct={mockOnSelectProduct}
          language="en"
          discount={10}
          currency="SAR"
        />
      </BrowserRouter>
    );
    
    // Click on the first product
    fireEvent.click(screen.getByText('iPhone 14 Pro'));
    
    // Check if onSelectProduct was called with the correct product
    expect(mockOnSelectProduct).toHaveBeenCalledWith(mockProducts[0]);
  });
  
  test('highlights selected product', () => {
    render(
      <BrowserRouter>
        <ProductSelector 
          products={mockProducts}
          selectedProduct={mockProducts[0]}
          onSelectProduct={mockOnSelectProduct}
          language="en"
          discount={10}
          currency="SAR"
        />
      </BrowserRouter>
    );
    
    // Check if the first product is highlighted (has the border-jam3a-purple class)
    const selectedProductCard = screen.getByText('iPhone 14 Pro').closest('.border-jam3a-purple');
    expect(selectedProductCard).toBeInTheDocument();
  });
  
  test('displays correct discounted price', () => {
    render(
      <BrowserRouter>
        <ProductSelector 
          products={mockProducts}
          selectedProduct={null}
          onSelectProduct={mockOnSelectProduct}
          language="en"
          discount={10}
          currency="SAR"
        />
      </BrowserRouter>
    );
    
    // Regular price for iPhone 14 Pro
    expect(screen.getByText('4,999 SAR')).toBeInTheDocument();
    
    // Discounted price for iPhone 14 Pro (4999 * 0.9 = 4499.1)
    expect(screen.getByText('4,499.1 SAR')).toBeInTheDocument();
  });
  
  test('displays message when no products are available', () => {
    render(
      <BrowserRouter>
        <ProductSelector 
          products={[]}
          selectedProduct={null}
          onSelectProduct={mockOnSelectProduct}
          language="en"
          discount={10}
          currency="SAR"
        />
      </BrowserRouter>
    );
    
    expect(screen.getByText('No products available in this category.')).toBeInTheDocument();
  });
});
