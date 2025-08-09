import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';

@Injectable({
  providedIn: 'any'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean | UrlTree {
    const token = localStorage.getItem('jwt_token');

    if (token) {
      // Token exists → allow navigation
      return true;
    } else {
      // No token → redirect to login
      return this.router.parseUrl('/login');
    }
  }
}
