import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

import { AuthService } from '../services/auth/auth.service'
import { Observable } from 'rxjs';
import { tap, map, take } from 'rxjs/operators';
import { AuthRedoneService } from '../services/auth/authredone.service';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthRedoneService, private router: Router) { }

  // canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {

  //     return this.auth.user$.pipe(
  //          take(1),
  //          map(user => !!user), // <-- map to boolean
  //          tap(loggedIn => {
  //            if (!loggedIn) {
  //              this.router.navigate(['/login']);
  //              return false;
  //            } else {
  //             this.router.navigate(['']);
  //                return true;
  //            }
  //        })
  //   )

  // }

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
