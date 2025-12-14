import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, mergeMap } from 'rxjs/operators';
import * as ItemsActions from './items.actions';
import { MenuService, MenuItem } from '../services/menu.service';
import { Item } from '../models/item.model';

@Injectable()
export class ItemsEffects {

  private convertIngredients(ingredients: string[]): { name: string; measure: string }[] {
    return ingredients.map(str => {
      const [measure, ...nameParts] = str.split(' ');
      return { measure: measure || '', name: nameParts.join(' ') || str };
    });
  }

  loadItems$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ItemsActions.loadItems),
      mergeMap((action) =>
        this.menuService.getItems(action.query).pipe(
          map((menuItems: MenuItem[]) => {
            const items: Item[] = menuItems.map(item => ({
              ...item,
              ingredients: this.convertIngredients(item.ingredients || [])
            }));
            return ItemsActions.loadItemsSuccess({
              items,
              total: items.length,
              page: action.page || 1,
              limit: action.limit || 10
            });
          }),
          catchError(error => of(ItemsActions.loadItemsFailure({ error: error.message })))
        )
      )
    )
  );

  loadItem$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ItemsActions.loadItem),
      mergeMap(action =>
        this.menuService.getItemById(Number(action.id)).pipe(
          map((menuItem: MenuItem | undefined) => {
            if (!menuItem) throw new Error('Item not found');
            const item: Item = {
              ...menuItem,
              ingredients: this.convertIngredients(menuItem.ingredients || [])
            };
            return ItemsActions.loadItemSuccess({ item });
          }),
          catchError(error => of(ItemsActions.loadItemFailure({ error: error.message })))
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private menuService: MenuService
  ) {}
}
