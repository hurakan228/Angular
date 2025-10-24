import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MenuService, MenuItem, CartItem, Category } from '../../services/menu.service';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-menu-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './menu-list.component.html',
  styleUrls: ['./menu-list.component.css']
})
export class MenuListComponent implements OnInit {
  allMenuItems: MenuItem[] = [];
  filteredItems: MenuItem[] = [];
  cartItems: CartItem[] = [];
  categories: Category[] = [];
  searchTerm: string = '';
  selectedCategory: string = 'all';
  isLoading: boolean = true;
  error: string | null = null; // Добавляем свойство error

  private searchSubject = new Subject<string>();

  constructor(private menuService: MenuService) {}

  ngOnInit() {
    this.menuService.menuItems$.subscribe((items: MenuItem[]) => {
      this.allMenuItems = items;
      this.applyFilters();
      this.isLoading = false;
      this.error = null; // Сбрасываем ошибку при успешной загрузке
    });

    this.menuService.cartItems$.subscribe((items: CartItem[]) => {
      this.cartItems = items;
    });

    this.menuService.categories$.subscribe((categories: Category[]) => {
      this.categories = categories;
    });

    this.menuService.selectedCategory$.subscribe((category: string) => {
      this.selectedCategory = category;
      this.applyFilters();
    });

    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(() => {
      this.applyFilters();
    });

    this.loadMenu();
  }

  // Добавляем метод reloadMenu
  reloadMenu(): void {
    this.isLoading = true;
    this.error = null;
    this.searchTerm = '';
    this.selectedCategory = 'all';
    this.menuService.setSelectedCategory('all');
    this.loadMenu();
  }

  // Выносим загрузку в отдельный метод
  private loadMenu(): void {
    this.menuService.loadMenuItems();
    // Имитируем обработку ошибок, так как в текущем сервисе их нет
    setTimeout(() => {
      if (this.allMenuItems.length === 0) {
        this.error = 'Не удалось загрузить меню. Проверьте подключение к интернету.';
      }
      this.isLoading = false;
    }, 2000);
  }

  onSearchInput(): void {
    this.searchSubject.next(this.searchTerm);
  }

  selectCategory(category: string): void {
    this.menuService.setSelectedCategory(category);
  }

  addToCart(item: MenuItem): void {
    this.menuService.addToCart(item);
  }

  removeFromCart(itemId: number): void {
    this.menuService.removeFromCart(itemId);
  }

  increaseQuantity(itemId: number): void {
    const item = this.cartItems.find(cartItem => cartItem.menuItem.id === itemId);
    if (item) {
      this.menuService.updateQuantity(itemId, item.quantity + 1);
    }
  }

  decreaseQuantity(itemId: number): void {
    const item = this.cartItems.find(cartItem => cartItem.menuItem.id === itemId);
    if (item) {
      this.menuService.updateQuantity(itemId, item.quantity - 1);
    }
  }

  getCartTotal(): number {
    return this.menuService.getCartTotal();
  }

  clearCart(): void {
    this.menuService.clearCart();
  }

  checkout(): void {
    if (this.cartItems.length > 0) {
      alert(`Заказ оформлен! Сумма: ${this.getCartTotal()} ₸`);
      this.clearCart();
    }
  }

  getCategoryName(categoryId: string): string {
    const category = this.categories.find(cat => cat.id === categoryId);
    return category ? category.name : categoryId;
  }

  private applyFilters(): void {
    let filtered = this.allMenuItems;

    if (this.selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === this.selectedCategory);
    }

    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(term) ||
        item.description.toLowerCase().includes(term) ||
        item.ingredients.some((ing: string) => ing.toLowerCase().includes(term))
      );
    }

    this.filteredItems = filtered;
  }
}