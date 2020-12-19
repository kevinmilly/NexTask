import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

import { AuthService} from './auth.service'
import { Observable } from 'rxjs';
import { tap, map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

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

  canActivate(): boolean {
    
    if (!this.auth.user) {
      // console.log('Returning false');
      this.router.navigate(['login']);
      return false;
    }
    console.log('Returning true');
    return true;
}

}