import {AuthService, IAuthStatus, IServerAuthResponse} from './auth.service'
import {Observable, of, throwError} from 'rxjs'
import {PhoneType, Role, User} from './user'

import {sign} from 'fake-jwt-sign'

/**
 * a fake authProvider function that simulates the authentication process, including creating a fake JWT on the fly
 *//* 
@Injectable({
providedIn: 'root',
} )*/

export class InMemoryAuthService extends AuthService {
  constructor() {
    super()
    console.warn(
      "You're using the InMemoryAuthService. Do not use this service in production."
    )
  }
  // defaultUser: any
  private defaultUser = User.Build({
    _id: '5da01751da27cc462d265913',
    email: 'duluca@gmail.com',
    name: {first: 'Doguhan', last: 'Uluca'},
    picture: 'https://secure.gravatar.com/avatar/7cbaa9afb5ca78d97f3c689f8ce6c985',
    role: Role.Manager,
    dateOfBirth: new Date(1980, 1, 1),
    userStatus: true,
    address: {
      line1: '101 Sesame St.',
      city: 'Bethesda',
      state: 'Maryland',
      zip: '20810',
    },
    level: 2,
    phones: [
      {
        id: 0,
        type: PhoneType.Mobile,
        digits: '5555550717',
      },
    ],
  })

  /**
   * Restituisce Observable\<IServerAuthResponse\> alla fz. login.
   *
   * I dati dell'oggetto IServerAuthResponse vengono creati internamente alla funzione stessa, il metodo sign del modulo 'fake-jwt-sign' crea lo JWT.
   */
  protected authProvider(
    email: string,
    password: string
  ): Observable<IServerAuthResponse> {
    email = email.toLowerCase()
    if(!email.endsWith('@test.com')) {
      return throwError('Failed to login! Email needs to end with @test.com.')
    }
    const authStatus = {
      isAuthenticated: true,
      userId: this.defaultUser._id,
      userRole: email.includes('cashier')
        ? Role.Cashier
        : email.includes('clerk')
          ? Role.Clerk
          : email.includes('manager')
            ? Role.Manager
            : Role.None,
    } as IAuthStatus
    this.defaultUser.role = authStatus.userRole
    const authResponse = {
      accessToken: sign(authStatus, 'secret', {
        expiresIn: '1h',
        algorithm: 'none',
      }),
    } as IServerAuthResponse
    return of(authResponse)
  }

  protected transformJwtToken(token: IAuthStatus): IAuthStatus {
    return token
  }

  protected getCurrentUser(): Observable<User> {
    return of(this.defaultUser)
  }
}
