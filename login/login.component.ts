import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; 

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule], 
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  login() {
    console.log('Login attempt:', this.username, this.password);
    if (this.username && this.password) {
      alert(`Добро пожаловать, ${this.username}!`);
    } else {
      alert('Пожалуйста, заполните все поля');
    }
  }
}