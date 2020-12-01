import {InMemoryAuthService} from './auth/auth.inmemory.service'

// vaffanculo
// culone

const authService = new InMemoryAuthService()
authService.login('aa.test.com', '12345678')