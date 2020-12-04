import { combineLatest } from "rxjs";
import { filter, tap } from "rxjs/operators";
import { InMemoryAuthService } from "./auth/auth.inmemory.service";

// vaffanculo
// culone

const authService = new InMemoryAuthService();
function login() {
  authService.login("aa@test.com", "12345678");
  let authStatus$ = authService.authStatus$
  let currentUser$ = authService.currentUser$
  combineLatest([authStatus$, currentUser$]) 
  .pipe(
    filter(([authStatus, user]) => 
      authStatus.isAuthenticated && user?._id !== ''
    ),
    tap(([authStatus, user]) => {
      console.log('authstatus è ' + JSON.stringify(authStatus) + '\n user è ' + JSON.stringify(user))
    })
  )
  .subscribe()
}
login()