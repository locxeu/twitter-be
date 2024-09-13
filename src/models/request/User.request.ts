import exp from 'constants'
import { JwtPayload } from 'jsonwebtoken'
import { TokenType } from '~/constants/enums'

export interface RegisterRequestBody {
  name: string
  password: string
  email: string
  confirm_password: string
  date_of_birth: string
}

export interface LogoutRequestBody {
  refresh_token: string
}

export interface EmailVerifyRequestBody {
  refresh_token: string
}

export interface TokenPayload extends JwtPayload {
  user_id: string
  token_type: TokenType
}

export interface UpdateProfileRequestBody {
  name?: string
  email?: string
  date_of_birth?: string
  location?: string
  website?: string
  avatar?: string
  cover_photo?: string
}
