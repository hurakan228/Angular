import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Item } from '../models/item.model';

@Injectable({
  providedIn: 'root'
})
export class ItemsService {
  
  constructor(private http: HttpClient) {
    console.log('✅ ItemsService created');
  }

  getItems(query?: string): Observable<Item[]> {
    console.log('📞 ItemsService.getItems() called with query:', query || 'none');
    
    // Mock данные - замените на реальный API
    const mockItems: Item[] = [
      { 
        id: 1, 
        name: 'Pizza Margherita', 
        description: 'Classic pizza with tomato and mozzarella', 
        price: 12.99, 
        category: 'Pizza',
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400'
      },
      { 
        id: 2, 
        name: 'Pasta Carbonara', 
        description: 'Creamy pasta with bacon and egg', 
        price: 14.99, 
        category: 'Pasta',
        image: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400'
      },
      { 
        id: 3, 
        name: 'Caesar Salad', 
        description: 'Fresh salad with Caesar dressing', 
        price: 9.99, 
        category: 'Salad',
        image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400'
      }
    ];

    // Фильтрация по query если есть
    let filteredItems = mockItems;
    if (query) {
      filteredItems = mockItems.filter(item => 
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase())
      );
    }


    return of(filteredItems).pipe(delay(500));
  }

  getItemById(id: string | number): Observable<Item> {
    console.log('📞 ItemsService.getItemById() called with id:', id);
    

    const mockItems: Item[] = [
      { id: 1, name: 'Pizza Margherita', description: 'Classic pizza with tomato and mozzarella', price: 12.99, category: 'Pizza' },
      { id: 2, name: 'Pasta Carbonara', description: 'Creamy pasta with bacon and egg', price: 14.99, category: 'Pasta' },
      { id: 3, name: 'Caesar Salad', description: 'Fresh salad with Caesar dressing', price: 9.99, category: 'Salad' }
    ];

    const item = mockItems.find(i => i.id == id);
    
    if (item) {
      return of(item).pipe(delay(300));
    } else {
      throw new Error(`Item with id ${id} not found`);
    }
  }
}