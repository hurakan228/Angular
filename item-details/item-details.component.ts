import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MenuService, MenuItem } from '../../services/menu.service';

@Component({
  selector: 'app-item-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './item-details.component.html',
  styleUrls: ['./item-details.component.css']
})
export class ItemDetailsComponent implements OnInit {
  item: MenuItem | undefined;
  loading = false;
  error = '';

  constructor(
    private route: ActivatedRoute,
    public menuService: MenuService,
    private location: Location
  ) {}

  ngOnInit() {
    this.loadItem();
  }

  loadItem() {
    this.loading = true;
    this.error = '';
    
    const id = Number(this.route.snapshot.paramMap.get('id'));
    
    this.menuService.getItemById(id).subscribe({
      next: (item: MenuItem | undefined) => {
        this.item = item;
        this.loading = false;
        if (!item) {
          this.error = 'Блюдо не найдено';
        }
      },
      error: (err: any) => {
        this.error = 'Ошибка загрузки данных';
        this.loading = false;
        console.error('Error loading item:', err);
      }
    });
  }

  goBack() {
    this.location.back();
  }

  addToCart(item: MenuItem) {
    this.menuService.addToCart(item);
    alert('Товар "' + item.name + '" добавлен в корзину!');
  }
}