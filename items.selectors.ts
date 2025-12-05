import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ItemsState } from './items.reducer';

export const selectItemsState = createFeatureSelector<ItemsState>('items');

export const selectAllItems = createSelector(
  selectItemsState,
  (state: ItemsState) => state.items
);

export const selectItemsLoading = createSelector(
  selectItemsState,
  (state: ItemsState) => state.loadingList
);

export const selectItemsError = createSelector(
  selectItemsState,
  (state: ItemsState) => state.errorList
);

export const selectSelectedItem = createSelector(
  selectItemsState,
  (state: ItemsState) => state.selectedItem
);

export const selectItemDetailsLoading = createSelector(
  selectItemsState,
  (state: ItemsState) => state.loadingDetails
);

export const selectItemDetailsError = createSelector(
  selectItemsState,
  (state: ItemsState) => state.errorDetails
);