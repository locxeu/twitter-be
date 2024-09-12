import { TokenPayload } from './models/request/User.request'
import User from './models/schemas/User.schemas'

declare module 'express' {
  interface Request {
    uses?: User
    decoded_authorization?: TokenPayload
    decoded_refresh_token?: TokenPayload
    decoded_email_verify_token?: TokenPayload
  }
}
