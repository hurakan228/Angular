import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuService, CartItem } from '../../services/menu.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent {
  cartItems$: Observable<CartItem[]>;
  cartTotal$: Observable<number>;

  constructor(public menuService: MenuService) {
    this.cartItems$ = this.menuService.cartItems$;
    this.cartTotal$ = this.menuService.cartItems$.pipe(
      map(items => items.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0))
    );
  }

  updateQuantity(itemId: string, quantity: number) {
    this.menuService.updateQuantity(itemId, quantity);
  }

  removeItem(itemId: string) {
    this.menuService.removeFromCart(itemId);
  }

  clearCart() {
    this.menuService.clearCart();
  }
}
