import { Router } from 'express'
import {
  emailVerifyController,
  followController,
  loginController,
  logoutController,
  profileController,
  registerController,
  unfollowController,
  updateProfileController
} from '~/controllers/Users.controllers'
import { filterMiddlewares } from '~/middlewares/common.middlewares'
import {
  accessTokenValidator,
  emailVerifyTokenValidator,
  followUserValidator,
  loginValidator,
  refreshTokenValidator,
  registerValidator,
  unFollowUserValidator,
  updateProfileValidator,
  verifyUserValidator
} from '~/middlewares/user.middlewares'
import { UpdateProfileRequestBody } from '~/models/request/User.request'
import { wrapRequestHandler } from '~/utils/handlers'
import { validate } from '~/utils/validation'

const usersRouter = Router()

/**
 * Description: Login user
 * Path: /login
 * Method: POST
 * Body: { email: string, password: string }
 *
 */
usersRouter.post('/login', validate(loginValidator), wrapRequestHandler(loginController))

/**
 * Description. Register a newter a new user
 * Path: /register
 * Method: POST
 * Body:{ name: string
  password: string
  email: string
  confirm_password: string
  date_of_birth: string}
 *
 */
usersRouter.post('/register', validate(registerValidator), wrapRequestHandler(registerController))

/**
 * Description: Logout user
 * Path: /logout
 * Method: POST
 * Body: {refresh_token:string}
 *
 */
usersRouter.post(
  '/logout',
  validate(accessTokenValidator),
  validate(refreshTokenValidator),
  wrapRequestHandler(logoutController)
)

/**
 * Description: Verify email user
 * Path: /verify-email
 * Method: POST
 * Body: {refresh_token:string}
 *
 */
usersRouter.post('/verify-email', validate(emailVerifyTokenValidator), wrapRequestHandler(emailVerifyController))

/**
 * Description: Get user profile
 * Path: /me
 * Method: GET
 */
usersRouter.get('/me', validate(accessTokenValidator), wrapRequestHandler(profileController))

/**
 * Description: Update user profile
 * Path: /me
 * Method: GET
 */
usersRouter.patch(
  '/me',
  validate(accessTokenValidator),
  verifyUserValidator,
  validate(updateProfileValidator),
  filterMiddlewares<UpdateProfileRequestBody>([
    'name',
    'email',
    'date_of_birth',
    'location',
    'website',
    'avatar',
    'cover_photo'
  ]),
  wrapRequestHandler(updateProfileController)
)

/**
 * Description: Follow user
 * Path: /follow
 * Method: POST
 * Body: {follow_user_id:string}
 */
usersRouter.post(
  '/follow',
  validate(accessTokenValidator),
  verifyUserValidator,
  followUserValidator,
  wrapRequestHandler(followController)
)

/**
 * Description: Unfollow user
 * Path: /follow/:follow_user_id
 * Method: DELETE
 * Params: {follow_user_id:string}
 */

usersRouter.delete(
  '/follow/:follow_user_id',
  validate(accessTokenValidator),
  verifyUserValidator,
  unFollowUserValidator,
  wrapRequestHandler(unfollowController)
)

export default usersRouter
