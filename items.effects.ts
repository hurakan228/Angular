import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, mergeMap } from 'rxjs/operators';
import * as ItemsActions from './items.actions';

@Injectable()
export class ItemsEffects {
  
  loadItems$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ItemsActions.loadItems),
      mergeMap((action) => {
        console.log('✅ NgRx Effect working!');
        
     
        const items = [
          { 
            id: 1, 
            name: 'Pizza Margherita', 
            description: 'Classic pizza', 
            price: 12.99, 
            category: 'Pizza' 
          },
          { 
            id: 2, 
            name: 'Pasta Carbonara', 
            description: 'Creamy pasta', 
            price: 14.99, 
            category: 'Pasta' 
          }
        ] as any; 
        
        return of(items).pipe(
          map(items => ItemsActions.loadItemsSuccess({ items })),
          catchError(error => of(ItemsActions.loadItemsFailure({ error: error.message })))
        );
      })
    )
  );

  constructor(private actions$: Actions) {
    console.log('🚀 Effects initialized');
  }
}