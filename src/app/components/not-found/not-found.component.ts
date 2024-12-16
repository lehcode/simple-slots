import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule],
  template: `
  <div class="min-h-screen flex items-center justify-center bg-gray-50 p-4">
    <div class="w-full max-w-lg transform transition-all duration-300 hover:shadow-xl">
      <div class="p-8">
        <div class="space-y-4 text-center">
            <h1 class="text-8xl font-light text-red-500 mb-4">404</h1>
            <h2 class="text-3xl font-light text-gray-800 mb-4">Page Not Found</h2>

            <p class="text-lg text-gray-600 mb-8">
              Oops! The page you're looking for doesn't exist or has been moved.
            </p>

            <!-- Action Buttons -->
            <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                color="primary"
                class="w-full sm:w-auto px-6 py-2 transition-all duration-300 hover:scale-105"
                (click)="goHome()">
                <span class="mr-2">home</span>
                Return to Home
              </button>

              <button
                color="accent"
                class="w-full sm:w-auto px-6 py-2 transition-all duration-300 hover:scale-105"
                (click)="goBack()">
                <span class="mr-2">arrow_back</span>
                Go Back
              </button>
            </div>
          </div>
      </div>
    </div>
  </div>
  `,
  styles: ``,
})

export class NotFoundComponent {
  
  constructor(private router: Router) {}

  goHome() {
    this.router.navigate(['/']);
  }

  goBack() {
    window.history.back();
  }
}
