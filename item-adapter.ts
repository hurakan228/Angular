import { MenuItem } from '../services/menu.service';
import { Item } from '../models/item.model';

function convertIngredients(ingredients: string[]): { name: string; measure: string }[] {
  return ingredients.map(str => {
    const parts = str.split(' ');
    const measure = parts[0] || '';
    const name = parts.slice(1).join(' ') || str;
    return { name, measure };
  });
}

export function adaptMenuItemToItem(menuItem: MenuItem): Item {
  return {
    idMeal: menuItem.idMeal,
    strMeal: menuItem.strMeal,
    strMealThumb: menuItem.strMealThumb,
    strCategory: menuItem.strCategory,
    strArea: menuItem.strArea || 'International',
    strInstructions: menuItem.strInstructions,
    strYoutube: menuItem.strYoutube || '',
    price: menuItem.price,
    rating: menuItem.rating,
    difficulty: menuItem.difficulty,
    cookingTime: menuItem.cookingTime,
    calories: menuItem.calories,
    isVegetarian: menuItem.isVegetarian,
    isSpicy: menuItem.isSpicy,
    ingredients: convertIngredients(menuItem.ingredients || [])
  };
}

export function adaptMenuItemsToItems(menuItems: MenuItem[]): Item[] {
  return menuItems.map(adaptMenuItemToItem);
}
