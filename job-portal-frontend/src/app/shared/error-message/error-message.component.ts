// shared/error-message/error-message.component.ts
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-error-message',
  template: `
    <div *ngIf="errorMessage" class="error-container">
      <mat-icon>error</mat-icon>
      <span>{{ errorMessage }}</span>
      <button mat-icon-button (click)="dismissError()" aria-label="Dismiss error">
        <mat-icon>close</mat-icon>
      </button>
    </div>
  `,
  styles: [`
    .error-container {
      display: flex;
      align-items: center;
      background-color: #ffebee;
      color: #c62828;
      padding: 10px 16px;
      border-radius: 4px;
      margin-bottom: 16px;
      animation: fadeIn 0.3s ease-in;
    }
    
    mat-icon {
      margin-right: 8px;
    }
    
    button {
      margin-left: auto;
    }
    
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  `]
})
export class ErrorMessageComponent implements OnInit {
  @Input() errorMessage: string | null = null;
  
  constructor() { }
  
  ngOnInit(): void { }
  
  dismissError(): void {
    this.errorMessage = null;
  }
}