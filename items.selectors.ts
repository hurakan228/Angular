import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ItemsState } from './items.reducer';

export const selectItemsState = createFeatureSelector<ItemsState>('items');

export const selectItems = createSelector(
  selectItemsState,
  (state: ItemsState) => state.items
);

export const selectItemsLoading = createSelector(
  selectItemsState,
  (state: ItemsState) => state.loading
);

export const selectItemsError = createSelector(
  selectItemsState,
  (state: ItemsState) => state.error
);

export const selectItemsTotal = createSelector(
  selectItemsState,
  (state: ItemsState) => state.total
);

export const selectItemsPage = createSelector(
  selectItemsState,
  (state: ItemsState) => state.page
);

export const selectItemsLimit = createSelector(
  selectItemsState,
  (state: ItemsState) => state.limit
);

export const selectItemById = (id: string) =>
  createSelector(selectItems, (items) => items.find(item => item.idMeal === id));
