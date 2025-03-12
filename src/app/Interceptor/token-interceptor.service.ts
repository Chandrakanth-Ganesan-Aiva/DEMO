import { HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, switchMap } from 'rxjs';
import { selectToken } from '../NgrxStore/auth.selector';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService {

  constructor(private store: Store) {}
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Select the token from the store and handle it asynchronously using switchMap
    return this.store.select(selectToken).pipe(
      switchMap((token: string | null) => {
        // Clone the request and add the Authorization header if the token exists
        const clonedRequest = req.clone({
          setHeaders: {
            Authorization: token ? `Bearer ${token}` : ''
          }
        });
        // Continue with the request
        return next.handle(clonedRequest);
      })
    );
  }
  
}
