import jwt from 'jsonwebtoken'

export default async(req, res, next) => {
  try {
    // Check user auth token
    if (!req.cookies.auth) {
      throw new Error('Unauthorized')
    }
    const decoded = await jwt.verify(req.cookies.auth, process.env.JWT_SECRET);
    const existingUser = await req.db('user')
    .select('user.*')
    .where('email', '=', decoded.email)
    .where('is_deleted', '=', false)
    .first()

    if (!existingUser) {
      throw new Error('Unauthorized')
    }

    req.user = existingUser
    return next()
  } catch(err) {
    console.log(err)
    return res.status(400).json({err: 'Unauthorized'})
  }
}