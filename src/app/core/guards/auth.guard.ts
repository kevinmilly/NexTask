import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap, map, take } from 'rxjs/operators';
import { AuthService } from '../services/auth/auth.service';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) { }

  canActivate(): Observable<boolean> {

    return this.auth.user$.pipe(
      map(user => !!user),
      tap(loggedIn => {
        if (!loggedIn) {
          console.log("access.denied");
          this.router.navigate(['/login']);

        }
      })
    )
  }

}
