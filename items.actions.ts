import { createAction, props } from '@ngrx/store';
import { Item } from '../models/item.model';

export const loadItems = createAction(
  '[Items] Load Items',
  props<{ page?: number; limit?: number; query?: string; category?: string }>()
);

export const loadItemsSuccess = createAction(
  '[Items] Load Items Success',
  props<{ items: Item[]; total: number; page: number; limit: number }>()
);

export const loadItemsFailure = createAction(
  '[Items] Load Items Failure',
  props<{ error: string }>()
);

export const loadItem = createAction(
  '[Items] Load Item',
  props<{ id: string | number }>()
);

export const loadItemSuccess = createAction(
  '[Items] Load Item Success',
  props<{ item: Item }>()
);

export const loadItemFailure = createAction(
  '[Items] Load Item Failure',
  props<{ error: string }>()
);
