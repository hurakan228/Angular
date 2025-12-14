import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs';

export interface Item {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  price: number;
  rating?: number;
  ingredients?: string[];
}

export interface CartItem {
  menuItem: Item;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private apiUrl = 'https://www.themealdb.com/api/json/v1/1';

  private menuItemsSubject = new BehaviorSubject<Item[]>([]);
  public menuItems$ = this.menuItemsSubject.asObservable();

  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  public cartItems$ = this.cartItemsSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadInitialData();
  }

  private loadInitialData() {
    this.getMealsByCategory('Beef').subscribe();
  }

  getMealsByCategory(category: string): Observable<Item[]> {
    const url = category === 'all' 
      ? `${this.apiUrl}/search.php?s=` 
      : `${this.apiUrl}/filter.php?c=${category}`;

    return this.http.get<any>(url).pipe(
      map(response => {
        const meals = response.meals || [];
        const items: Item[] = meals.map((meal: any) => ({
          idMeal: meal.idMeal,
          strMeal: meal.strMeal,
          strMealThumb: meal.strMealThumb,
          price: Math.floor(Math.random() * 2000) + 500,
          rating: +(Math.random() * 1 + 4).toFixed(1),
          ingredients: [] // можно заполнить позже
        }));
        this.menuItemsSubject.next(items);
        return items;
      }),
      catchError(err => {
        console.error('Error fetching meals', err);
        return of([]);
      })
    );
  }

  getItemById(id: string): Observable<Item | undefined> {
    return this.menuItems$.pipe(
      map(items => items.find(i => i.idMeal === id))
    );
  }

  addToCart(item: Item) {
    const cart = this.cartItemsSubject.value;
    const existing = cart.find(ci => ci.menuItem.idMeal === item.idMeal);
    if (existing) existing.quantity++;
    else cart.push({ menuItem: item, quantity: 1 });
    this.cartItemsSubject.next([...cart]);
  }

  updateQuantity(itemId: string, quantity: number) {
    const cart = this.cartItemsSubject.value;
    const item = cart.find(ci => ci.menuItem.idMeal === itemId);
    if (item) {
      if (quantity <= 0) this.removeFromCart(itemId);
      else {
        item.quantity = quantity;
        this.cartItemsSubject.next([...cart]);
      }
    }
  }

  removeFromCart(itemId: string) {
    const cart = this.cartItemsSubject.value.filter(ci => ci.menuItem.idMeal !== itemId);
    this.cartItemsSubject.next(cart);
  }

  clearCart() {
    this.cartItemsSubject.next([]);
  }

  getCartTotal(): number {
    return this.cartItemsSubject.value.reduce((sum, ci) => sum + ci.menuItem.price * ci.quantity, 0);
  }
}
