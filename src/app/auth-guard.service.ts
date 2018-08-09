import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { NbAuthService } from '@nebular/auth';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private authService: NbAuthService,
    private router: Router,
  ) {}

  canActivate() {
    // canActive can return Observable<boolean>, which is exactly what isAuhenticated returns
    return this.authService.isAuthenticated()
    .do(authenticated => {
        if (!authenticated) {
          this.router.navigate(['auth/login']);
        }
      });
  }
}
