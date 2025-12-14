import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Item } from '../../models/item.model';

@Injectable({
  providedIn: 'root'
})
export class ItemsService {
  private apiUrl = 'https://jsonplaceholder.typicode.com/posts'; // временный URL для демо

  constructor(private http: HttpClient) {}

  getItems(query?: string): Observable<Item[]> {
    // Временные данные для демонстрации
    const mockItems: Item[] = [
      { id: 1, name: 'Pizza Margherita', description: 'Classic pizza with tomato and mozzarella', price: 12.99, category: 'Pizza' },
      { id: 2, name: 'Pasta Carbonara', description: 'Creamy pasta with bacon and egg', price: 14.99, category: 'Pasta' },
      { id: 3, name: 'Caesar Salad', description: 'Fresh salad with Caesar dressing', price: 9.99, category: 'Salad' },
      { id: 4, name: 'Burger', description: 'Beef burger with cheese and vegetables', price: 11.99, category: 'Burger' }
    ];

    return new Observable(observer => {
      setTimeout(() => {
        if (query) {
          const filtered = mockItems.filter(item => 
            item.name.toLowerCase().includes(query.toLowerCase()) ||
            item.description.toLowerCase().includes(query.toLowerCase())
          );
          observer.next(filtered);
        } else {
          observer.next(mockItems);
        }
        observer.complete();
      }, 500); // имитация задержки сети
    });
  }

  getItemById(id: string | number): Observable<Item> {
    const mockItems: Item[] = [
      { id: 1, name: 'Pizza Margherita', description: 'Classic pizza with tomato and mozzarella', price: 12.99, category: 'Pizza' },
      { id: 2, name: 'Pasta Carbonara', description: 'Creamy pasta with bacon and egg', price: 14.99, category: 'Pasta' },
      { id: 3, name: 'Caesar Salad', description: 'Fresh salad with Caesar dressing', price: 9.99, category: 'Salad' },
      { id: 4, name: 'Burger', description: 'Beef burger with cheese and vegetables', price: 11.99, category: 'Burger' }
    ];

    return new Observable(observer => {
      setTimeout(() => {
        const item = mockItems.find(i => i.id == id);
        if (item) {
          observer.next(item);
        } else {
          observer.error('Item not found');
        }
        observer.complete();
      }, 300);
    });
  }
}