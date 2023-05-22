require('dotenv').config()
const admin = require('../../controllers/firebaseAdminInit')

const { Router } = require('express')
const router = Router()
const setResponse = require('../setResponse')
const getConfigData = require('../getConfigData')

router.post('/',setResponse.handleCreateSessionCookie)
router.get('/signin',redirectIfLoggedIn,setResponse.getSignIn)
router.get('/signup',redirectIfLoggedIn,setResponse.getSignUp)
router.get('/signout',setResponse.getSignOut)

// send config values to client
router.get('/getConfig',getConfigData)

async function redirectIfLoggedIn(req,res,next){
   const authSessionCookie = req.cookies.authSession || '';
   try{
      const decodedClaims = await admin.auth().verifySessionCookie(authSessionCookie, true)
      if(decodedClaims){
        res.redirect('/')
      }
      next()
   }

   catch(err){
      next()
   }
}

module.exports = router;