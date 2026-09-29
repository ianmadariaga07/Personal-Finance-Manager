import { Component, inject, signal} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthService} from '../../services/auth';
import {Router} from '@angular/router';
import {CommonModule} from '@angular/common';
import {MessageService} from 'primeng/api';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule],
  providers: [],
  templateUrl: './login.html',
  styleUrl: './login.css',
})

export class Login {
  public isPasswordVisible = signal<boolean>(false);
  public isLoading = signal<boolean>(false);
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private messageService = inject(MessageService);

  loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
    password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(50)]],
  });

  public visiblePassword(){
    //this.isPasswordVisible = !this.isPasswordVisible;
    this.isPasswordVisible.update( valor => !valor);
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading.set(true);
      this.authService.login(this.loginForm.getRawValue()).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Inicio de Sesion Exitoso', detail: 'Status: verified' });
          //redirigimos automáticamente a la vista de transacciones
          this.router.navigate(['/transactions']);
        },
        error: () => {
          this.isLoading.set(false);
          this.messageService.add({ severity: 'error', summary: 'Fallo en la operacion', detail: 'Desc: Autorizacion denegada'});
        }
      });
    }
  }
}
