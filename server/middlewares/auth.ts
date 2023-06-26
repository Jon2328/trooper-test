import jwt from 'jsonwebtoken'

export default async(req, res, next) => {
  try {
    // Check user auth token
    if (!req.cookies.auth) {
      throw new Error('Unauthorized')
    }
    const decoded = await jwt.verify(req.cookies.auth, process.env.JWT_SECRET);
    req.user = { email: decoded.email }
    return next()
  } catch(err) {
    console.log(err)
    return res.status(400).json({err: 'Unauthorized'})
  }
}