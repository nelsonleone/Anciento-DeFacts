const { getDecodedClaims } = require('../controllers/firebaseAdminInit')
const { getUserFromDatabase } = require('../controllers/handleDatabaseQuery')

async function checkAuthSession(req,res,next){
  const authSessionCookie = req.cookies.authSession;
  
  try{
    const decodedClaims = await getDecodedClaims(authSessionCookie)
    const contributorDetails = await getUserFromDatabase(decodedClaims)
    if(contributorDetails){
      res.locals.authenticated = true;
      res.locals.userDetails = {
        email: contributorDetails.email,
        name: contributorDetails.name,
        photoURL: contributorDetails.photoURL,
        id: contributorDetails._id
      }
    }
    else{
      res.locals.authenticated = false;
      res.locals.userDetails = {
        email: "",
        name:"",
        photoURL: "",
        id: ""
      }
    }
  }

  catch(err){
    res.locals.authenticated = false;
    res.locals.userDetails = {
      email: "",
      photoURL: "",
    }

  }
  next()
}

module.exports = checkAuthSession;