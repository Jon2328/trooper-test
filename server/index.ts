import express from 'express';
import * as dotenv from 'dotenv'
import knexConfig from './db/config'
import cors from 'cors'
import cookieParser from 'cookie-parser'

dotenv.config()

const app = express()
const port = 3000

app.use(cors())
app.use(cookieParser())

app.use((req, _res, next) => {
  req.db = knexConfig()
  next()
})

app.use(express.json())

app.get('/api/', (req, res) => {
  res.send('Hello')
})

app.use('/api/user/', require('./routes/user'))

app.listen(port, () => {
  console.log('server started at ' + port)
})