import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MenuService } from '../../services/menu.service';

@Component({
  selector: 'app-add-item',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.css']
})
export class AddItemComponent {
  newItem = {
    name: '',
    price: 0,
    description: '',
    image: '',
    category: 'pizza',
    ingredients: ['']
  };

  previewImage: string | ArrayBuffer | null = null;
  isSubmitting: boolean = false;

  categories = [
    { id: 'pizza', name: 'Пицца' },
    { id: 'burger', name: 'Бургер' },
    { id: 'salad', name: 'Салат' },
    { id: 'pasta', name: 'Паста' },
    { id: 'sushi', name: 'Суши' },
    { id: 'drink', name: 'Напиток' }
  ];

  constructor(private menuService: MenuService) {}

  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.previewImage = reader.result;
        this.newItem.image = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  addItem() {
    if (!this.newItem.name.trim() || this.newItem.price <= 0) {
      alert('Пожалуйста, заполните название и цену корректно');
      return;
    }

    this.isSubmitting = true;

    const itemToAdd = {
      ...this.newItem,
      image: this.newItem.image || this.getDefaultImage(this.newItem.category),
      ingredients: this.newItem.ingredients.filter(ing => ing.trim() !== '')
    };

    this.menuService.addMenuItem(itemToAdd);
    this.resetForm();
    
    setTimeout(() => {
      this.isSubmitting = false;
    }, 500);
  }

  addIngredient() {
    this.newItem.ingredients.push('');
  }

  removeIngredient(index: number) {
    this.newItem.ingredients.splice(index, 1);
  }

  private getDefaultImage(category: string): string {
    const defaultImages: { [key: string]: string } = {
      pizza: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=300&h=200&fit=crop',
      burger: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&h=200&fit=crop',
      salad: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300&h=200&fit=crop',
      pasta: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=300&h=200&fit=crop',
      sushi: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=300&h=200&fit=crop',
      drink: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=300&h=200&fit=crop'
    };
    return defaultImages[category] || defaultImages['pizza'];
  }

  private resetForm(): void {
    this.newItem = { 
      name: '', 
      price: 0, 
      description: '', 
      image: '',
      category: 'pizza',
      ingredients: ['']
    };
    this.previewImage = null;
    
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  }
}