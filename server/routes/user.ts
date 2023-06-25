import express = require('express')
const router = express.Router()

import bcrypt from 'bcrypt'
import emailValidator from 'email-validator'
import jwt from 'jsonwebtoken'
import auth from '../middlewares/auth'

const saltRounds = 10;

router.post('/register', async (req, res) => {
  try {
    const payload = req.body
    let InsufficientParam = []
    // Payload Existence Check and Validation

    if (!payload.email || !(typeof payload.email === 'string')) {
      InsufficientParam.push('Email')
    }

    if (!payload.password || !(typeof payload.password === 'string')) {
      InsufficientParam.push('Password')
    }

    if (InsufficientParam.length > 1) {
      throw new Error(`Insufficient Payload (${InsufficientParam.toString()})`)
    }

    // Validate Email
    const emailIsValid = emailValidator.validate(payload.email)
    if (!emailIsValid) {
      throw new Error('Email is invalid')
    }

    // Check email is already registered
    const existingUser = await req.db('user')
    .select('user.*')
    .where('email', '=', payload.email)
    .where('is_deleted', '=', false)
    .first()

    if (existingUser) {
      throw new Error('User already registered')
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(payload.password, saltRounds)

    // Insert user to db
    await req.db('user').insert({
      email: payload.email,
      password: hashedPassword
    })

   
    res.json({Status: 'Successful'})
  } catch (err) {
    console.log(err)
    res.status(400).json({err: err.message})
  }
})

router.post('/login', async (req, res) => {
  try {
    const payload = req.body
    let InsufficientParam = []
    // Payload Existence Check and Validation

    if (!payload.email || !(typeof payload.email === 'string')) {
      InsufficientParam.push('Email')
    }

    if (!payload.password || !(typeof payload.password === 'string')) {
      InsufficientParam.push('Password')
    }

    if (InsufficientParam.length > 1) {
      throw new Error(`Insufficient Payload (${InsufficientParam.toString()})`)
    }

    // Validate Email
    const emailIsValid = emailValidator.validate(payload.email)
    if (!emailIsValid) {
      throw new Error('Email is invalid')
    }

    // Check if user exist
    const existingUser = await req.db('user')
    .select('user.*')
    .where('email', '=', payload.email)
    .where('is_deleted', '=', false)
    .first()

    if (!existingUser) {
      throw new Error('Credential is incorrect')
    }

    // Check password
    const passwordCorrect = await bcrypt.compare(payload.password, existingUser.password)

    if (!passwordCorrect) {
      throw new Error('Credential is incorrect')
    }

    // Generate token
    const token = jwt.sign({ email: existingUser.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.cookie('auth', token, {httpOnly: true, secure: true })
    res.json({Status: 'Successful'})
  } catch (err) {
    console.log(err)
    res.status(400).json({err: err.message})
  }
})

module.exports = router