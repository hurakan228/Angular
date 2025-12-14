export interface Item {
  idMeal: string;         
  strMeal: string;        
  strMealThumb: string;     
  strCategory: string;     
  strArea: string;          
  strInstructions: string; 
  strYoutube?: string;     
  price: number;
  rating?: number;
  difficulty?: string;
  cookingTime?: number;
  calories?: number;
  isVegetarian?: boolean;
  isSpicy?: boolean;
  ingredients?: { name: string; measure: string }[];

}