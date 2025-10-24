import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, map, of, forkJoin } from 'rxjs';

export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  ingredients: string[];
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
}

export interface Category {
  id: string;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private apiUrl = 'https://jsonplaceholder.typicode.com';
  
  private menuItems = new BehaviorSubject<MenuItem[]>([]);
  public menuItems$ = this.menuItems.asObservable();
  
  private cartItems = new BehaviorSubject<CartItem[]>([]);
  public cartItems$ = this.cartItems.asObservable();
  
  private categories = new BehaviorSubject<Category[]>([
    { id: 'all', name: 'Все блюда' },
    { id: 'pizza', name: 'Пицца' },
    { id: 'burger', name: 'Бургеры' },
    { id: 'salad', name: 'Салаты' },
    { id: 'pasta', name: 'Паста' },
    { id: 'sushi', name: 'Суши' },
    { id: 'drink', name: 'Напитки' }
  ]);
  public categories$ = this.categories.asObservable();

  private selectedCategory = new BehaviorSubject<string>('all');
  public selectedCategory$ = this.selectedCategory.asObservable();

  private foodImages = {
    pizza: [
      'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=300&h=200&fit=crop',
      'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=300&h=200&fit=crop'
    ],
    burger: [
      'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&h=200&fit=crop',
      'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=300&h=200&fit=crop'
    ],
    salad: [
      'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300&h=200&fit=crop',
      'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&h=200&fit=crop'
    ],
    pasta: [
      'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=300&h=200&fit=crop',
      'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=300&h=200&fit=crop'
    ],
    sushi: [
      'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=300&h=200&fit=crop',
      'https://images.unsplash.com/photo-1563612116621-9c56e0e214b3?w=300&h=200&fit=crop'
    ],
    drink: [
      'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=300&h=200&fit=crop',
      'https://images.unsplash.com/photo-1437418747212-8d9709afab22?w=300&h=200&fit=crop'
    ]
  };

  constructor(private http: HttpClient) {}

  loadMenuItems(): void {
    this.http.get<any[]>(`${this.apiUrl}/posts`).pipe(
      map(posts => this.transformToMenuItems(posts)),
      catchError(() => of(this.getFallbackMenuItems()))
    ).subscribe(items => {
      this.menuItems.next(items);
    });
  }

  private transformToMenuItems(posts: any[]): MenuItem[] {
    const categories = ['pizza', 'burger', 'salad', 'pasta', 'sushi', 'drink'];
    const foodNames = [
      'Пицца Маргарита', 'Пицца Пепперони', 'Бургер Классик', 'Чизбургер',
      'Салат Цезарь', 'Греческий салат', 'Паста Карбонара', 'Спагетти Болоньезе',
      'Ролл Филадельфия', 'Ролл Калифорния', 'Кола', 'Апельсиновый сок'
    ];

    const ingredientsMap: { [key: string]: string[] } = {
      pizza: ['томаты', 'моцарелла', 'базилик'],
      burger: ['котлета', 'сыр', 'салат', 'помидор'],
      salad: ['салат', 'курица', 'сухарики', 'соус'],
      pasta: ['паста', 'бекон', 'сливки', 'сыр'],
      sushi: ['рис', 'нори', 'лосось', 'авокадо'],
      drink: ['газировка', 'сахар']
    };

    return posts.slice(0, 12).map((post, index) => {
      const category = categories[index % categories.length];
      const categoryImages = this.foodImages[category as keyof typeof this.foodImages];
      const imageIndex = Math.floor(index / categories.length) % categoryImages.length;
      
      return {
        id: post.id,
        name: foodNames[index] || `Блюдо ${index + 1}`,
        description: post.body.substring(0, 60) + '...',
        price: this.generatePrice(category),
        image: categoryImages[imageIndex],
        category: category,
        ingredients: ingredientsMap[category] || []
      };
    });
  }

  private generatePrice(category: string): number {
    const priceRanges: { [key: string]: [number, number] } = {
      pizza: [1800, 3500],
      burger: [1200, 2500],
      salad: [800, 2000],
      pasta: [1500, 2800],
      sushi: [2000, 4500],
      drink: [300, 800]
    };
    
    const [min, max] = priceRanges[category] || [500, 2000];
    return Math.floor(Math.random() * (max - min)) + min;
  }

  private getFallbackMenuItems(): MenuItem[] {
    return [
      {
        id: 1,
        name: 'Пицца Маргарита',
        description: 'Классическая итальянская пицца с томатами и моцареллой',
        price: 2500,
        image: this.foodImages.pizza[0],
        category: 'pizza',
        ingredients: ['томаты', 'моцарелла', 'базилик']
      },
      {
        id: 2,
        name: 'Бургер Классик',
        description: 'Сочная говяжья котлета с овощами и сыром',
        price: 1800,
        image: this.foodImages.burger[0],
        category: 'burger',
        ingredients: ['котлета', 'сыр', 'салат', 'помидор']
      }
    ];
  }

  setSelectedCategory(category: string): void {
    this.selectedCategory.next(category);
  }

  addToCart(item: MenuItem): void {
    const currentCart = this.cartItems.value;
    const existingItem = currentCart.find(cartItem => cartItem.menuItem.id === item.id);
    
    if (existingItem) {
      existingItem.quantity++;
    } else {
      currentCart.push({ menuItem: item, quantity: 1 });
    }
    
    this.cartItems.next([...currentCart]);
  }

  removeFromCart(itemId: number): void {
    const currentCart = this.cartItems.value.filter(item => item.menuItem.id !== itemId);
    this.cartItems.next(currentCart);
  }

  updateQuantity(itemId: number, quantity: number): void {
    const currentCart = this.cartItems.value;
    const item = currentCart.find(cartItem => cartItem.menuItem.id === itemId);
    
    if (item) {
      if (quantity <= 0) {
        this.removeFromCart(itemId);
      } else {
        item.quantity = quantity;
        this.cartItems.next([...currentCart]);
      }
    }
  }

  getCartTotal(): number {
    return this.cartItems.value.reduce((total, item) => 
      total + (item.menuItem.price * item.quantity), 0
    );
  }

  clearCart(): void {
    this.cartItems.next([]);
  }

  addMenuItem(item: Omit<MenuItem, 'id'>): void {
    const currentItems = this.menuItems.value;
    const newItem: MenuItem = {
      ...item,
      id: Date.now()
    };
    
    this.menuItems.next([...currentItems, newItem]);
  }
}