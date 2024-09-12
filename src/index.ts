import express, { NextFunction, Request, Response } from 'express'
import databaseService from './services/database.services'
import usersRouter from './routers/User.routers'
import { defaultErrorhandler } from './middlewares/error.middlewares'
const app = express()
const router = express.Router()
const port = 3000

// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })

// router.get('/tweets', (req, res) => {
//   res.json({
//     data: [{ id: 1, text: 'Hello World!' }]
//   })
// })
databaseService.connect()
app.use(express.json())
app.use('/api', router)
app.use('/users', usersRouter)
app.use(defaultErrorhandler)
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
