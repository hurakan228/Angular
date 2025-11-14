import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, map, of, delay } from 'rxjs';

export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  ingredients: string[];
  rating: number; 
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
  
  public menuItems = new BehaviorSubject<MenuItem[]>([]);
  public menuItems$ = this.menuItems.asObservable();
  
  public cartItems = new BehaviorSubject<CartItem[]>([]);
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

  private localMenuItems: MenuItem[] = [
    {
      id: 1,
      name: 'Пицца Маргарита',
      description: 'Классическая итальянская пицца с томатным соусом, моцареллой и свежим базиликом',
      price: 3500,
      image: 'https://recfood.ru/wp-content/uploads/2019/11/1009813_1566295877.5247_original.jpg',
      category: 'pizza',
      ingredients: ['томаты', 'моцарелла', 'базилик', 'оливковое масло'],
      rating: 4.8 
    },
    {
      id: 2,
      name: 'Пицца Пепперони',
      description: 'Острая пицца с колбаской пепперони, сыром моцарелла и томатным соусом',
      price: 3200,
      image: 'https://s1.eda.ru/StaticContent/Photos/Upscaled/120131085053/171027192707/p_O.jpg',
      category: 'pizza',
      ingredients: ['пепперони', 'моцарелла', 'томатный соус', 'орегано'],
      rating: 4.7 
    },
    {
      id: 3,
      name: 'Бургер Классик',
      description: 'Сочная говяжья котлета с сыром, свежими овощами и специальным соусом',
      price: 2200,
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop',
      category: 'burger',
      ingredients: ['говяжья котлета', 'сыр', 'салат', 'помидор', 'лук', 'соус'],
      rating: 4.5
    },
    {
      id: 4,
      name: 'Чизбургер',
      description: 'Аппетитный бургер с двойной порцией сыра и сочной котлетой',
      price: 2800,
      image: 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=400&h=300&fit=crop',
      category: 'burger',
      ingredients: ['говяжья котлета', 'сыр чеддер', 'салат', 'маринованные огурцы'],
      rating: 4.6 
    },
    {
      id: 5,
      name: 'Салат Цезарь',
      description: 'Классический салат с курицей, крутонами, пармезаном и соусом цезарь',
      price: 2200,
      image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=300&fit=crop',
      category: 'salad',
      ingredients: ['курица', 'салат романо', 'пармезан', 'крутоны', 'соус цезарь'],
      rating: 4.4 
    },
    {
      id: 6,
      name: 'Греческий салат',
      description: 'Свежий салат с фетой, оливками, овощами и оливковым маслом',
      price: 2000,
      image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=300&fit=crop',
      category: 'salad',
      ingredients: ['помидоры', 'огурцы', 'фета', 'оливки', 'лук', 'оливковое масло'],
      rating: 4.3 
    },
    {
      id: 7,
      name: 'Паста Карбонара',
      description: 'Итальянская паста с беконом, сыром пармезан и сливочным соусом',
      price: 4800,
      image: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=400&h=300&fit=crop',
      category: 'pasta',
      ingredients: ['паста', 'креветки', 'пармезан', 'яйцо', 'сливки', 'перец'],
      rating: 4.7 
    },
    {
      id: 8,
      name: 'Спагетти Болоньезе',
      description: 'Традиционные спагетти с мясным соусом болоньезе и пармезаном',
      price: 3200,
      image: 'https://images.unsplash.com/photo-1551892374-ecf8754cf8b0?w=400&h=300&fit=crop',
      category: 'pasta',
      ingredients: ['спагетти', 'мясной фарш', 'томаты', 'лук', 'морковь', 'пармезан'],
      rating: 4.6 
    },
    {
      id: 9,
      name: 'Ролл Филадельфия',
      description: 'Нежный ролл с лососем, сливочным сыром и авокадо',
      price: 3000,
      image: 'https://rnr.ua/storage/2025/01/01/f8c77a05ce9307debbfbb849c1d597ed/conversions/19169359846924198-webp_wide.webp',
      category: 'sushi',
      ingredients: ['рис', 'нори', 'лосось', 'сыр филадельфия', 'авокадо', 'огурец'],
      rating: 4.9 
    },
    {
      id: 10,
      name: 'Ролл Калифорния',
      description: 'Популярный ролл с крабом, авокадо и икрой тобико',
      price: 2800,
      image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=300&fit=crop',
      category: 'sushi',
      ingredients: ['рис', 'нори', 'краб', 'авокадо', 'икра тобико', 'майонез'],
      rating: 4.8 
    },
    {
      id: 11,
      name: 'Pepsi',
      description: 'Освежающий газированный напиток',
      price: 800,
      image: 'https://cdn-kz3.foodpicasso.com/assets/2024/01/30/5ddc14ec32f80ffecdd726fd05f8ec86---jpg_1000x_103c0_convert.jpg',
      category: 'drink',
      ingredients: ['газированная вода', 'сахар', 'кофеин'],
      rating: 4.2 
    },
    {
      id: 12,
      name: 'Апельсиновый сок',
      description: 'Свежевыжатый апельсиновый сок',
      price: 1200,
      image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=400&h=300&fit=crop',
      category: 'drink',
      ingredients: ['апельсины'],
      rating: 4.5 
    }
  ];

  constructor(private http: HttpClient) {}

  getItems(query?: string): Observable<MenuItem[]> {
    return of(this.localMenuItems).pipe(
      delay(500),
      map(items => {
        if (query) {
          const lowerQuery = query.toLowerCase();
          return items.filter(item => 
            item.name.toLowerCase().includes(lowerQuery) ||
            item.description.toLowerCase().includes(lowerQuery) ||
            item.category.toLowerCase().includes(lowerQuery)
          );
        }
        return items;
      }),
      catchError(() => of(this.localMenuItems))
    );
  }

  getItemById(id: number): Observable<MenuItem | undefined> {
    return of(this.localMenuItems.find(item => item.id === id)).pipe(
      delay(300)
    );
  }

  loadMenuItems(): void {
    this.menuItems.next(this.localMenuItems);
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