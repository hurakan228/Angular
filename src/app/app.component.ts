import { Component } from '@angular/core';
import { AddItemComponent } from './components/add-item/add-item.component';
import { MenuListComponent } from './components/menu-list/menu-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [AddItemComponent, MenuListComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'menu_project';
}