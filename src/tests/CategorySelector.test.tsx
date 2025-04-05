import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CategorySelector from '../components/CategorySelector';

// Mock data
const mockCategories = [
  {
    _id: 'category1',
    name: 'Smartphones',
    nameAr: 'الهواتف الذكية',
    description: 'Latest smartphone models',
    descriptionAr: 'أحدث موديلات الهواتف الذكية',
    image: 'https://example.com/smartphones.jpg'
  },
  {
    _id: 'category2',
    name: 'Laptops',
    nameAr: 'أجهزة الكمبيوتر المحمولة',
    description: 'High-performance laptops',
    descriptionAr: 'أجهزة الكمبيوتر المحمولة عالية الأداء',
    image: 'https://example.com/laptops.jpg'
  }
];

// Mock the CategoryService
jest.mock('../services/CategoryService', () => ({
  fetchCategories: jest.fn().mockResolvedValue(mockCategories)
}));

describe('CategorySelector Component', () => {
  const mockOnSelectCategory = jest.fn();
  
  test('renders categories correctly', async () => {
    render(
      <BrowserRouter>
        <CategorySelector 
          selectedCategory={null}
          onSelectCategory={mockOnSelectCategory}
          language="en"
        />
      </BrowserRouter>
    );
    
    // Initially should show loading
    expect(screen.getByText(/Loading categories/i)).toBeInTheDocument();
    
    // Wait for categories to load
    await waitFor(() => {
      expect(screen.getByText('Smartphones')).toBeInTheDocument();
      expect(screen.getByText('Laptops')).toBeInTheDocument();
    });
  });
  
  test('displays Arabic content when language is set to Arabic', async () => {
    render(
      <BrowserRouter>
        <CategorySelector 
          selectedCategory={null}
          onSelectCategory={mockOnSelectCategory}
          language="ar"
        />
      </BrowserRouter>
    );
    
    // Wait for categories to load
    await waitFor(() => {
      expect(screen.getByText('الهواتف الذكية')).toBeInTheDocument();
      expect(screen.getByText('أجهزة الكمبيوتر المحمولة')).toBeInTheDocument();
    });
  });
  
  test('calls onSelectCategory when a category is selected', async () => {
    render(
      <BrowserRouter>
        <CategorySelector 
          selectedCategory={null}
          onSelectCategory={mockOnSelectCategory}
          language="en"
        />
      </BrowserRouter>
    );
    
    // Wait for categories to load
    await waitFor(() => {
      expect(screen.getByText('Smartphones')).toBeInTheDocument();
    });
    
    // Click on the first category
    fireEvent.click(screen.getByText('Smartphones'));
    
    // Check if onSelectCategory was called with the correct category
    expect(mockOnSelectCategory).toHaveBeenCalledWith(mockCategories[0]);
  });
  
  test('highlights selected category', async () => {
    render(
      <BrowserRouter>
        <CategorySelector 
          selectedCategory={mockCategories[0]}
          onSelectCategory={mockOnSelectCategory}
          language="en"
        />
      </BrowserRouter>
    );
    
    // Wait for categories to load
    await waitFor(() => {
      expect(screen.getByText('Smartphones')).toBeInTheDocument();
    });
    
    // Check if the first category is highlighted (has the border-jam3a-purple class)
    const selectedCategoryCard = screen.getByText('Smartphones').closest('.border-jam3a-purple');
    expect(selectedCategoryCard).toBeInTheDocument();
  });
  
  test('displays message when no categories are available', async () => {
    // Override the mock to return empty array
    require('../services/CategoryService').fetchCategories.mockResolvedValueOnce([]);
    
    render(
      <BrowserRouter>
        <CategorySelector 
          selectedCategory={null}
          onSelectCategory={mockOnSelectCategory}
          language="en"
        />
      </BrowserRouter>
    );
    
    // Wait for categories to load
    await waitFor(() => {
      expect(screen.getByText('No categories available')).toBeInTheDocument();
    });
  });
  
  test('displays error message when fetching fails', async () => {
    // Override the mock to reject with error
    require('../services/CategoryService').fetchCategories.mockRejectedValueOnce('API Error');
    
    render(
      <BrowserRouter>
        <CategorySelector 
          selectedCategory={null}
          onSelectCategory={mockOnSelectCategory}
          language="en"
        />
      </BrowserRouter>
    );
    
    // Wait for error to display
    await waitFor(() => {
      expect(screen.getByText(/Error loading categories/i)).toBeInTheDocument();
    });
  });
});
