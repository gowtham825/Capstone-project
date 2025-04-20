// shared/interceptors/http-error.interceptor.ts
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  
  constructor() {}
  
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMsg = '';
        
        // Log all errors to console
        console.error('HTTP Error occurred:', error);
        
        if (error.error instanceof ErrorEvent) {
          // Client-side error
          errorMsg = `Error: ${error.error.message}`;
        } else {
          // Server-side error
          if (error.error && error.error.message) {
            // Use server's error message if available
            errorMsg = error.error.message;
          } else {
            // Create a message based on status code
            switch (error.status) {
              case 400:
                errorMsg = 'Bad Request: Please check your input data';
                break;
              case 401:
                errorMsg = 'Unauthorized: Please log in again';
                break;
              case 403:
                errorMsg = 'Forbidden: You do not have permission to access this resource';
                break;
              case 404:
                errorMsg = 'Not Found: The requested resource does not exist';
                break;
              case 500:
                errorMsg = 'Server Error: Something went wrong on our end, please try again later';
                break;
              case 503:
                errorMsg = 'Service Unavailable: The server is temporarily unavailable, please try again later';
                break;
              default:
                errorMsg = `Error Code: ${error.status}. Message: ${error.message}`;
            }
          }
        }
        
        // Return the error for components to handle
        return throwError(() => new Error(errorMsg));
      })
    );
  }
}