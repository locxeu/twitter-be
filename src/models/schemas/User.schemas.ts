import { ObjectId } from 'mongodb'
import { UserVerifyStatus } from '~/constants/enums'


interface UsersType {
  _id?: ObjectId
  password: string
  name?: string
  email: string
  date_of_birth: Date
  verifyStatus?: UserVerifyStatus
  created_at?: Date
  updated_at?: Date
  email_verified_token?: string
  forgot_password_token?: string
  bio?: string
  location?: string
  avatar?: string
  cover_photo?: string
  username?: string
}

export default class User {
  _id: ObjectId
  password: string
  name: string
  email: string
  verifyStatus: UserVerifyStatus
  created_at: Date
  updated_at: Date
  date_of_birth: Date
  email_verified_token: string
  forgot_password_token: string
  //Optional -----//
  bio: string
  location: string
  avatar: string
  cover_photo: string
  username: string

  constructor(user: UsersType) {
    const date = new Date()
    ;(this._id = user._id || new ObjectId()),
      (this.password = user.password),
      (this.name = user.name || ''),
      (this.email = user.email),
      (this.date_of_birth = user.date_of_birth || date),
      (this.verifyStatus = user.verifyStatus || UserVerifyStatus.Unverified),
      (this.created_at = user.created_at || date),
      (this.updated_at = user.updated_at || date),
      (this.email_verified_token = user.email_verified_token || ''),
      (this.forgot_password_token = user.forgot_password_token || ''),
      (this.bio = user.bio || ''),
      (this.location = user.location || ''),
      (this.avatar = user.avatar || ''),
      (this.cover_photo = user.cover_photo || ''),
      (this.username = user.username || '')
  }
}
