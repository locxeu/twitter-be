import { NextFunction, Response, Request } from 'express'
import { pick } from 'lodash'

type FilterKeys<T> = Array<keyof T>
export const filterMiddlewares =
  <T>(filerKeys: FilterKeys<T>) =>
  (req: Request, res: Response, next: NextFunction) => {
    req.body = pick(req.body, filerKeys)
    next()
  }
