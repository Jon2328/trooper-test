import express = require('express')
const router = express.Router()

import bcrypt from 'bcrypt'
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
    const emailIsValid = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(payload.email)
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
   
    // Generate token
    const token = jwt.sign({ email: payload.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.cookie('auth', token, {httpOnly: true, secure: true })
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
    const emailIsValid = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(payload.email)
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

router.post('/profile-creation', auth, async (req, res) => {
  try {
    const payload = req.body
    let InsufficientParam = []
    // Payload Existence Check and Validation

    if (!payload.name || !(typeof payload.name === 'string')) {
      InsufficientParam.push('Name')
    }

    if (!payload.dob || !(typeof payload.dob === 'string')) {
      InsufficientParam.push('Date of birth')
    }

    if (!payload.phone || !(typeof payload.phone === 'string')) {
      InsufficientParam.push('Phone')
    }

    if (!payload.address || !(typeof payload.address === 'string')) {
      InsufficientParam.push('Address')
    }

    if (InsufficientParam.length > 1) {
      throw new Error(`Insufficient Payload (${InsufficientParam.toString()})`)
    }

    const updateProfile = await req.db('user')
    .update({
      name: payload.name,
      dob: payload.dob,
      phone: payload.phone,
      address: payload.address
    })
    .where('email', '=', req.user.email)
    .where('is_deleted', '=', 0)
    console.log(updateProfile)

    res.json({status: 'Successful'})
  } catch (err) {
    console.log(err)
    res.status(400).json({err: err.message})
  }
  
})

module.exports = router