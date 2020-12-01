import {BehaviorSubject, Observable, throwError} from 'rxjs'
import {IUser, Role, User} from './user'
import {catchError, filter, flatMap, map, tap} from 'rxjs/operators'

import {CacheService} from './cache.service'
import jwtDecode from 'jwt-decode'
import {transformError} from '../common'

export interface IAuthService {

  readonly authStatus$: BehaviorSubject<IAuthStatus>

  readonly currentUser$: BehaviorSubject<IUser>

  login(email: string, password: string): Observable<void>

  logout(clearToken?: boolean): void

  getToken(): string
}

export interface IAuthStatus {
  isAuthenticated: boolean
  userRole: Role
  userId: string
}

export interface IServerAuthResponse {
  accessToken: string
}

export const defaultAuthStatus: IAuthStatus = {
  isAuthenticated: false,
  userRole: Role.None,
  userId: '',
}
/* 
@Injectable({
  providedIn: 'root',
}) */
export abstract class AuthService extends CacheService implements IAuthService {

  readonly authStatus$ = new BehaviorSubject<IAuthStatus>(
    this.getItem('authStatus') ?? defaultAuthStatus
  )
  readonly currentUser$ = new BehaviorSubject<IUser>(new User())

  constructor() {
    super()
    this.authStatus$.pipe(tap((authStatus) => this.setItem('authStatus', authStatus)))
  }

  login(email: string, password: string): Observable<void> {
    this.clearToken()
    const loginResponse$ = this.authProvider(email, password).pipe(
      // tap((x) => console.log('tapLog1  ' + JSON.stringify(x))),
      map((value) => {
        this.setToken(value.accessToken)
        const token = jwtDecode(value.accessToken)
        return this.transformJwtToken(token)
      }),
      tap((status) => this.authStatus$.next(status)),
      filter((status: IAuthStatus) => status.isAuthenticated),
      // tslint:disable-next-line: deprecation
      flatMap(() => this.getCurrentUser()),
      // tap((x) => console.log('taplog2')),
      map((user) => this.currentUser$.next(user)),
      catchError(transformError)
    )
    loginResponse$.subscribe({
      error: (err) => {
        this.logout()
        return throwError(err)
      },
    })
    return loginResponse$
  }

  logout(clearToken?: boolean): void {
    if(clearToken) {
      this.clearToken()
    }
    setTimeout(() => this.authStatus$.next(defaultAuthStatus), 0)
    // throw new Error('Method not implemented.')
  }

  protected setToken(jwt: string): void {
    this.setItem('jwt', jwt)
  }
  /**
   *
   */
  getToken(): string {
    return this.getItem('jwt') ?? ''
    // throw new Error('Method not implemented.')
  }

  protected clearToken(): void {
    this.removeItem('jwt')
  }

  protected abstract authProvider(
    email: string,
    password: string
  ): Observable<IServerAuthResponse>

  protected abstract transformJwtToken(token: unknown): IAuthStatus

  protected abstract getCurrentUser(): Observable<User>
}
