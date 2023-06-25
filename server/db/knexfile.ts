import { Knex } from "knex";
import * as dotenv from 'dotenv'
dotenv.config({path: __dirname + '/../.env'})
const config: Knex.Config = {
  client: process.env.DB_CLIENT,
  connection: {
    host : process.env.DB_HOST,
    port : Number(process.env.DB_PORT),
    user : process.env.DB_USER,
    password : process.env.DB_PASSWORD,
    database : process.env.DB_DATABASE
  },
  migrations: {
    tableName: 'migrations',
    directory: './migrations',
    loadExtensions: ['.ts']
  }
}

export = config