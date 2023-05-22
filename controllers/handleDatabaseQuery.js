const admin = require('./firebaseAdminInit')
const Contributor = require('../models/Contributors')

async function setUserInDatabase(idToken){
  try{
      const decodedClaims = await admin.auth().verifyIdToken(idToken)
      const result = await Contributor.findOne({ email: decodedClaims.email })
      if(!result){
         const contributor = await new Contributor({
            name: decodedClaims.name,
            picture: decodedClaims.picture,
            email: decodedClaims.email
         })
         contributor.save()
      }
      return true;
   }
   catch(err){
      console.log(err.message)
      return null;
   }
}

async function getUserFromDatabase(decodedClaims){
  const user = await Contributor.findOne({ email: decodedClaims.email }).exec()

   if(user){
    return user
  }
  return null;
}

module.exports = {
   setUserInDatabase,
   getUserFromDatabase
}