import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as ItemsActions from '../../state/items.actions';
import { 
  selectItems, 
  selectItemsLoading, 
  selectItemsError,
  selectItemsTotal,
  selectItemsPage,
  selectItemsLimit
} from '../../state/items.selectors';

@Component({
  selector: 'app-menu-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './menu-list.component.html',
  styleUrls: ['./menu-list.component.css']
})
export class MenuListComponent implements OnInit {
  items$: Observable<any[]>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
  total$: Observable<number>;
  page$: Observable<number>;
  limit$: Observable<number>;
  
  query: string = '';
  category: string = 'all';
  limit: number = 10;
  page: number = 1;

  constructor(
    private store: Store,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.items$ = this.store.select(selectItems);
    this.loading$ = this.store.select(selectItemsLoading);
    this.error$ = this.store.select(selectItemsError);
    this.total$ = this.store.select(selectItemsTotal);
    this.page$ = this.store.select(selectItemsPage);
    this.limit$ = this.store.select(selectItemsLimit);
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.query = params['q'] || '';
      this.category = params['category'] || 'all';
      this.page = parseInt(params['page']) || 1;
      this.loadItems();
    });
  }

  loadItems() {
    this.store.dispatch(ItemsActions.loadItems({ 
      query: this.query, 
      category: this.category,
      page: this.page,
      limit: this.limit
    }));
  }

  onSearchChange(value: string): void {
    this.query = value;
    this.page = 1;
    this.updateUrlParams();
  }

  onCategoryChange(category: string): void {
    this.category = category;
    this.page = 1;
    this.updateUrlParams();
  }

  onLimitChange(limit: number): void {
    this.limit = limit;
    this.page = 1;
    this.updateUrlParams();
  }

  updateUrlParams(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        q: this.query || null,
        category: this.category || null,
        page: this.page || null
      },
      queryParamsHandling: 'merge'
    });
  }

  prevPage(): void {
    if (this.page > 1) {
      this.page--;
      this.updateUrlParams();
    }
  }

  nextPage(): void {
    this.page++;
    this.updateUrlParams();
  }
}