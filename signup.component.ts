import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; 
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  email = '';
  password = '';
  confirmPassword = '';
  loading = false;
  error = '';

  constructor(private authService: AuthService) {}

  async signup() {
    if (!this.email || !this.password) {
      this.error = 'Заполните все поля';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.error = 'Пароли не совпадают';
      return;
    }

    this.loading = true;
    this.error = '';

    try {
      await this.authService.signup(this.email, this.password);
    } catch (error: any) {
      this.error = error.message;
    } finally {
      this.loading = false;
    }
  }
}