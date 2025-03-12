import { Injectable, OnChanges, SimpleChanges } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    if (sessionStorage.getItem("islogIn") == "true") {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
