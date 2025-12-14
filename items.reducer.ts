import { createReducer, on } from '@ngrx/store';
import * as ItemsActions from './items.actions';
import { Item } from '../models/item.model';

export interface ItemsState {
  items: Item[];
  loading: boolean;
  error: string | null;
  total: number;
  page: number;
  limit: number;
}

export const initialState: ItemsState = {
  items: [],
  loading: false,
  error: null,
  total: 0,
  page: 1,
  limit: 10
};

export const itemsReducer = createReducer(
  initialState,

  on(ItemsActions.loadItems, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(ItemsActions.loadItemsSuccess, (state, { items, total, page, limit }) => ({
    ...state,
    items,
    total,
    page,
    limit,
    loading: false,
    error: null
  })),

  on(ItemsActions.loadItemsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  on(ItemsActions.loadItem, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(ItemsActions.loadItemSuccess, (state, { item }) => ({
    ...state,
    items: state.items.some(i => i.idMeal === item.idMeal)
      ? state.items.map(i => i.idMeal === item.idMeal ? item : i)
      : [...state.items, item],
    loading: false,
    error: null
  })),

  on(ItemsActions.loadItemFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  }))
);
