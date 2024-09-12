import { NextFunction, Request, Response } from 'express'
import { ObjectId } from 'mongodb'
import HTTP_STATUS from '~/constants/httpStatus'
import { USER_MESSAGES } from '~/constants/userMessage'
import { LogoutRequestBody, RegisterRequestBody, TokenPayload } from '~/models/request/User.request'
import databaseService from '~/services/database.services'
import usersService from '~/services/users.rervices'

export const loginController = async (req: Request, res: Response, next: NextFunction) => {
  const { user }: any = req
  console.log('user', user)
  const user_id = user._id as ObjectId
  const result = await usersService.login({ user_id: user_id.toString(), verify: user.verifyStatus })
  return res.json({
    message: 'Login success',
    result
  })
}

export const registerController = async (
  req: Request<any, any, RegisterRequestBody>,
  res: Response,
  next: NextFunction
) => {
  const result = await usersService.register(req.body)
  return res.json({
    message: 'Register success',
    result
  })
}

export const logoutController = async (
  req: Request<any, any, LogoutRequestBody>,
  res: Response,
  next: NextFunction
) => {
  const { refresh_token } = req.body
  const result = await usersService.logout(refresh_token)
  return res.json({
    result
  })
}

export const emailVerifyController = async (req: Request, res: Response, next: NextFunction) => {
  const { user_id } = req.decoded_email_verify_token as TokenPayload
  const user = await databaseService.users.findOne({ _id: new ObjectId(user_id) })
  if (!user) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      message: USER_MESSAGES.USER_NOT_FOUND
    })
  }
  if (user.email_verified_token === '') {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      message: USER_MESSAGES.USER_NOT_FOUND
    })
  }

  const result = await usersService.verifyEmail(user_id)
  return res.json({
    message: 'Verify email success',
    result
  })
}

export const profileController = async (req: Request, res: Response, next: NextFunction) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const result = await usersService.getMe(user_id)

  return res.json({
    message: 'Success',
    result
  })
}

export const updateProfileController = async (req: Request, res: Response, next: NextFunction) => {
  // const { user_id } = req.decoded_authorization as TokenPayload
  // const result = await usersService.getMe(user_id)
  return res.json({
    message: 'Success',
    // result
  })
}
