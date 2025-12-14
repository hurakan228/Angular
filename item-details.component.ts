import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Item } from '../../models/item.model';
import { ItemsService } from '../../items/services/items.service';

@Component({
  selector: 'app-item-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './item-details.component.html',
  styleUrls: ['./item-details.component.css']
})
export class ItemDetailsComponent implements OnInit {
  item$: Observable<Item | undefined> = of(undefined);

  constructor(private route: ActivatedRoute, private itemsService: ItemsService) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) this.item$ = of(this.itemsService.getItemById(id));
  }

  addToCart(item: Item) {
    console.log('Add to cart', item.strMeal);
  }

  toggleFavorite(item: Item) {
    console.log('Toggle favorite', item.strMeal);
  }
}
