const csrf = require('csrf')
const csrfTokens = new csrf()


function setCsrfToken(req,res,next){
   const secret = csrfTokens.secretSync()
   const token = csrfTokens.create(secret)
 
   res.cookie('csrfToken', token, { httpOnly: true, secure: true, sameSite: 'none' })
 
   req.csrfToken = token;
   console.log(res.cookies,req.csrfToken) 
   next()
}

module.exports = setCsrfToken;