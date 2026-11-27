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
  public forgotOpen = signal<boolean>(false);
  public forgotLoading = signal<boolean>(false);
  public forgotMessage = signal<string | null>(null);
  public forgotError = signal<string | null>(null);
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private messageService = inject(MessageService);

  loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
    password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(50)]],
  });

  forgotForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
  });

  public visiblePassword(){
    //this.isPasswordVisible = !this.isPasswordVisible;
    this.isPasswordVisible.update( valor => !valor);
  }

  public openForgotPassword() {
    //precargamos el correo que el usuario ya escribió en el login
    this.forgotForm.reset({ email: this.loginForm.controls.email.value });
    this.forgotMessage.set(null);
    this.forgotError.set(null);
    this.forgotOpen.set(true);
  }

  public closeForgotPassword() {
    this.forgotOpen.set(false);
  }

  public sendForgotPassword() {
    if (this.forgotForm.invalid) {
      this.forgotForm.markAllAsTouched();
      return;
    }

    this.forgotLoading.set(true);
    this.forgotMessage.set(null);
    this.forgotError.set(null);

    this.authService
      .forgotPassword(this.forgotForm.controls.email.value)
      .subscribe({
        next: (res) => {
          this.forgotLoading.set(false);
          this.forgotMessage.set(
            res?.message ??
              'Si el correo está registrado, recibirás instrucciones para restablecer tu conexión.',
          );
        },
        error: () => {
          this.forgotLoading.set(false);
          this.forgotError.set(
            'No se pudo procesar la solicitud. Verifica el correo e inténtalo de nuevo.',
          );
        },
      });
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
