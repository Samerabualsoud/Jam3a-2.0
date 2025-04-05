import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { fetchCategories } from '@/services/CategoryService';
import { useLanguage } from '@/components/Header';
import { Loader2 } from 'lucide-react';

/**
 * CategorySelector Component
 * Displays all available categories for creating or browsing Jam3a deals
 */
const CategorySelector = ({ 
  selectedCategory, 
  onSelectCategory, 
  language 
}) => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Content based on language
  const content = {
    en: {
      loading: "Loading categories...",
      error: "Error loading categories",
      noCategories: "No categories available"
    },
    ar: {
      loading: "جاري تحميل الفئات...",
      error: "خطأ في تحميل الفئات",
      noCategories: "لا توجد فئات متاحة"
    }
  };

  const currentContent = content[language];

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setIsLoading(true);
        const categoriesData = await fetchCategories();
        setCategories(categoriesData);
        setIsLoading(false);
      } catch (err) {
        console.error('Error loading categories:', err);
        setError(err.message || 'Failed to load categories');
        setIsLoading(false);
      }
    };

    loadCategories();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-jam3a-purple" />
        <span className="ml-2">{currentContent.loading}</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        <p>{currentContent.error}: {error}</p>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>{currentContent.noCategories}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {categories.map((category) => (
        <Card 
          key={category._id} 
          className={`cursor-pointer transition-all hover:shadow-md ${
            selectedCategory?._id === category._id 
              ? 'border-2 border-jam3a-purple' 
              : 'border hover:border-gray-300'
          }`}
          onClick={() => onSelectCategory(category)}
        >
          <CardContent className="p-0">
            <div className="h-32 overflow-hidden">
              <img 
                src={category.image || 'https://via.placeholder.com/300x200?text=Category'} 
                alt={language === 'ar' && category.nameAr ? category.nameAr : category.name} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4 text-center">
              <h3 className="font-semibold">
                {language === 'ar' && category.nameAr ? category.nameAr : category.name}
              </h3>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CategorySelector;
