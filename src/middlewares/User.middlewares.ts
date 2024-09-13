import { checkSchema, ParamSchema } from 'express-validator'
import HTTP_STATUS from '~/constants/httpStatus'
import { USER_MESSAGES } from '~/constants/userMessage'
import { ErrorWithStatus } from '~/models/error'
import databaseService from '~/services/database.services'
import usersService from '~/services/users.rervices'
import { verifyToken } from '~/utils/jwt'
import { NextFunction, Request, Response } from 'express'
import { TokenPayload } from '~/models/request/User.request'
import { UserVerifyStatus } from '~/constants/enums'
import { validate } from '~/utils/validation'

const dateOfBirthSchema: ParamSchema = {
  isISO8601: {
    options: {
      strict: true,
      strictSeparator: true
    }
  }
}

const nameSchema: ParamSchema = {
  notEmpty: {
    errorMessage: USER_MESSAGES.NAME_IS_REQUIRED
  },
  isString: {
    errorMessage: USER_MESSAGES.NAME_MUST_BE_STRING
  },
  isLength: {
    options: {
      min: 2,
      max: 100
    },
    errorMessage: USER_MESSAGES.NAME_LENGTH_MUST_BE_MORE_THAN_3
  },
  trim: true
}

const imageSchema: ParamSchema = {
  optional: true,
  isString: {
    errorMessage: USER_MESSAGES.IMAGE_MUST_BE_STRING
  },
  isLength: {
    options: {
      min: 2,
      max: 400
    }
  },
  trim: true
}

export const loginValidator = checkSchema({
  email: {
    notEmpty: {
      errorMessage: USER_MESSAGES.EMAIL_IS_REQUIRED
    },
    isEmail: {
      errorMessage: USER_MESSAGES.EMAIL_IS_INVALID
    },
    trim: true,
    custom: {
      options: async (value, { req }) => {
        const user = await databaseService.users.findOne({ email: value })
        if (user === null) {
          throw new Error(USER_MESSAGES.USER_NOT_FOUND)
        }
        req.user = user
        return true
      }
    }
  },
  password: {
    notEmpty: {
      errorMessage: USER_MESSAGES.PASSWORD_IS_REQUIRED
    },
    isLength: {
      options: {
        min: 6,
        max: 50
      }
    }
  }
})

export const registerValidator = checkSchema({
  name: {
    isLength: {
      options: {
        min: 2,
        max: 100
      }
    },
    trim: true
  },
  email: {
    notEmpty: true,
    isEmail: true,
    trim: true,
    custom: {
      options: async (value) => {
        const isEmailExist = await usersService.checkEmailExist(value)
        if (isEmailExist) {
          throw new Error('Email already exist')
        }
        return true
      }
    }
  },
  password: {
    notEmpty: true,
    isLength: {
      options: {
        min: 6,
        max: 50
      }
    }
  },
  confirm_password: {
    notEmpty: true,
    isLength: {
      options: {
        min: 6,
        max: 50
      }
    },
    custom: {
      options: (value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('Password confirmation does not match password')
        }
        return true
      }
    }
  },
  date_of_birth: {
    isISO8601: {
      options: {
        strict: true,
        strictSeparator: true
      }
    }
  }
})

export const accessTokenValidator = checkSchema(
  {
    Authorization: {
      notEmpty: {
        errorMessage: USER_MESSAGES.ACCESS_TOKEN_IS_REQUIRED
      },
      custom: {
        options: async (value, { req }) => {
          const access_token = value.split(' ')[1]
          if (!access_token) {
            throw new ErrorWithStatus({
              messages: USER_MESSAGES.ACCESS_TOKEN_IS_REQUIRED,
              status: HTTP_STATUS.UNAUTHORIZED
            })
          }

          const decoded_authorization = await verifyToken({
            token: access_token,
            secretOrPublicKey: process.env.JWT_SECRET_ACCESS_TOKEN as string
          })
          console.log(decoded_authorization, 'value decoded_authorization')
          ;(req as Request & { decoded_authorization: any }).decoded_authorization = decoded_authorization
          return true
        }
      }
    }
  },
  ['headers']
)

export const refreshTokenValidator = checkSchema(
  {
    refresh_token: {
      notEmpty: {
        errorMessage: USER_MESSAGES.ACCESS_TOKEN_IS_REQUIRED
      },
      custom: {
        options: async (value, { req }) => {
          try {
            const [decoded_refreshToken, refresh_token] = await Promise.all([
              verifyToken({ token: value, secretOrPublicKey: process.env.JWT_SECRET_REFRESH_TOKEN as string }),
              databaseService.refreshToken.findOne({ token: value })
            ])
            if (refresh_token === null) {
              throw new ErrorWithStatus({
                messages: USER_MESSAGES.USER_REFRESH_TOKEN_NOT_EXIST,
                status: HTTP_STATUS.UNAUTHORIZED
              })
            }
            ;(req as Request & { decoded_refreshToken: any }).decoded_refreshToken = decoded_refreshToken
          } catch (error) {
            throw new ErrorWithStatus({
              messages: USER_MESSAGES.REFRESH_TOKEN_IS_INVALID,
              status: HTTP_STATUS.UNAUTHORIZED
            })
          }
          return true
        }
      }
    }
  },
  ['body']
)

export const emailVerifyTokenValidator = checkSchema(
  {
    email_verify_token: {
      trim: true,
      custom: {
        options: async (value, { req }) => {
          if (!value) {
            throw new ErrorWithStatus({
              messages: USER_MESSAGES.EMAIL_VERIFY_TOKEN_IS_REQUIRED,
              status: HTTP_STATUS.UNAUTHORIZED
            })
          }
          const decoded_email_verify_token = await verifyToken({
            token: value,
            secretOrPublicKey: process.env.JWT_SECRET_EMAIL_TOKEN as string
          })
          ;(req as Request & { decoded_email_verify_token: any }).decoded_email_verify_token =
            decoded_email_verify_token

          return true
        }
      }
    }
  },
  ['body']
)

export const updateProfileValidator = checkSchema(
  {
    name: {
      ...nameSchema,
      optional: true,
      notEmpty: undefined
    },
    date_of_birth: {
      ...dateOfBirthSchema,
      optional: true,
      notEmpty: undefined
    },
    location: {
      isString: {
        errorMessage: USER_MESSAGES.LOCATION_MUST_BE_STRING
      }
    },
    website: {
      isString: {
        errorMessage: USER_MESSAGES.WEBSITE_MUST_BE_STRING
      }
    },
    avatar: imageSchema,
    cover_photo: imageSchema
  },
  ['body']
)

export const verifyUserValidator = async (req: Request, res: Response, next: NextFunction) => {
  const { verify } = req.decoded_authorization as TokenPayload
  console.log(verify, 'verifyUserValidator')
  // console.log(req, 'req')

  if (verify !== UserVerifyStatus.Verified) {
    return next(
      new ErrorWithStatus({
        messages: USER_MESSAGES.USER_NOT_VERIFIED,
        status: HTTP_STATUS.FORBIDDEN
      })
    )
  }
  next()
}
