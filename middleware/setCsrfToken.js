const crypto = require('crypto')

function generateRandomToken(length = 32) {
  return crypto.randomBytes(length).toString('hex')
}

function setCsrfToken(req, res, next) {
   const csrfToken = generateRandomToken(64)
   res.cookie('csrfToken', csrfToken, { sameSite: 'none', secure: true })
  next()
}

module.exports = setCsrfToken;