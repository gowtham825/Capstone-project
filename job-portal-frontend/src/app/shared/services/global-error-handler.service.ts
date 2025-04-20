// shared/services/global-error-handler.service.ts
import { ErrorHandler, Injectable, NgZone } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class GlobalErrorHandlerService implements ErrorHandler {
  
  constructor(
    private snackBar: MatSnackBar,
    private zone: NgZone
  ) { }
  
  handleError(error: any): void {
    // Log the error to console
    console.error('Global error handler caught an error:', error);
    
    // Extract meaningful error message
    const errorMessage = error?.message || 'An unexpected error occurred';
    
    // Use NgZone to ensure UI updates correctly
    this.zone.run(() => {
      // Show user-friendly error message
      this.snackBar.open(errorMessage, 'Dismiss', {
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        panelClass: ['error-snackbar']
      });
    });
  }
}