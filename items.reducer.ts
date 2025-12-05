import { createReducer, on } from '@ngrx/store';
import { Item } from '../models/item.model'; 
import * as ItemsActions from './items.actions';

export interface ItemsState {
  items: Item[];
  selectedItem: Item | null;
  loadingList: boolean;
  loadingDetails: boolean;
  errorList: string | null;
  errorDetails: string | null;
}

export const initialState: ItemsState = {
  items: [],
  selectedItem: null,
  loadingList: false,
  loadingDetails: false,
  errorList: null,
  errorDetails: null
};

export const itemsReducer = createReducer(
  initialState,

  on(ItemsActions.loadItems, (state) => ({
    ...state,
    loadingList: true,
    errorList: null
  })),

  on(ItemsActions.loadItemsSuccess, (state, { items }) => ({
    ...state,
    items,
    loadingList: false,
    errorList: null
  })),

  on(ItemsActions.loadItemsFailure, (state, { error }) => ({
    ...state,
    loadingList: false,
    errorList: error
  })),

 
  on(ItemsActions.loadItem, (state) => ({
    ...state,
    loadingDetails: true,
    errorDetails: null
  })),

  on(ItemsActions.loadItemSuccess, (state, { item }) => ({
    ...state,
    selectedItem: item,
    loadingDetails: false,
    errorDetails: null
  })),

  on(ItemsActions.loadItemFailure, (state, { error }) => ({
    ...state,
    loadingDetails: false,
    errorDetails: error
  }))
);