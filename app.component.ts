import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { Store } from '@ngrx/store';
import { loadItems } from './state/items.actions';
import { ItemsState } from './state/items.reducer';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'food-app';
  diagnosticMessage = '';
  itemsCount = 0;
  isLoading = false;

  constructor(private store: Store<{ items: ItemsState }>) {
    console.log('🔧 AppComponent created with NgRx Store');
    

    this.store.subscribe(state => {
      this.itemsCount = state.items.items?.length || 0;
      this.isLoading = state.items.loading;
      console.log(`• Loading: ${state.items.loading}`);
      console.log(`• Error: ${state.items.error || 'none'}`);
      console.log('📊 Store subscription update:', { 
        itemsCount: this.itemsCount, 
        isLoading: this.isLoading 
      });
    });
  }


  dispatchTest() {
    this.diagnosticMessage = '🔄 Dispatching loadItems action...';
    console.log('🔄 Dispatching loadItems action');
    
  
    this.store.dispatch(loadItems({ query: '' }));
    
  
    setTimeout(() => {
      this.diagnosticMessage = `✅ Action dispatched! Check console and Redux DevTools.`;
    }, 1000);
  }

  checkState() {
    this.store.subscribe(state => {
      console.log('🔍 Current store state:', state);
      this.diagnosticMessage = `📊 Store State:
        • Items: ${state.items.items?.length || 0}
        • Loading: ${state.items.loading}
        • Error: ${state.items.error || 'none'}`;
    }).unsubscribe(); 
  }


  clearState() {
    this.diagnosticMessage = '🧹 Test: Try navigating to /items page';
  }
}