const admin = require('./firebaseAdminInit')
const { setUserInDatabase } = require('./handleDatabaseQuery')
const processRepImage = require('./processRepImage')
const Contributor = require('../models/Contributors')
const Fact = require('../models/Fact')
const { getDecodedClaims } = require('../controllers/firebaseAdminInit')

const getSignIn = (req,res) => {
  res.render('auth/signin',{ title: "Anciento-De'Facts | SignIn" })
}


const getSignUp = async(req,res) => {
  res.render('auth/signup',{ title: "Anciento-De'Facts | Create Account" })
}


const getSignOut = async(req,res) => {
  res.clearCookie('authSession')
  res.redirect('/auth/signin')
}

async function handleCreateSessionCookie(req,res,next){
  const idToken = req.body.idToken?.toString()
  // const csrfToken = req.body.csrfToken.toString()

  // // Guard against CSRF attacks.
  // if (csrfToken !== req.cookies.csrfToken) {
  //   res.status(401).send('UNAUTHORIZED REQUEST!')
  //   return;
  // }

  try{
    const expiresIn = 60 * 60 * 24 * 3 * 1000;

    const sessionCookie = await admin.auth().createSessionCookie(idToken, { expiresIn })
    const options = { maxAge: expiresIn, httpOnly: true, secure: true, sameSite: 'none' }
    res.cookie('authSession', sessionCookie, options)
    const isSetted = await setUserInDatabase(idToken)
    if(isSetted){
      res.status(201).send('success')
    }
  }

  catch(err){
    res.status(401).send('UNAUTHORIZED REQUEST!')
  }
}



const handleNewFactPost = async(req,res) => {
  if(!req.cookies.authSession){
    res.status(401).send(`<h2>UNAUTHORIZED REQUEST, PLEASE LOGIN FIRST</h2>`)
    return;
  }

  const authSessionCookie = req.cookies.authSession;
  const { title,factBody, credits , repImage, repImageAltText } = req.body;
  const creditsArr = credits.toString().split(/,\s*/)
  
  try{
    const decodedClaims = await getDecodedClaims(authSessionCookie)
    const contributor = await Contributor.findOne({ email: decodedClaims.email })

    const fact = new Fact({
      title,
      body: factBody,
      credits: creditsArr,
      contributor: contributor._id
    })
    await processRepImage(fact,repImage)

    if(repImageAltText){
      fact.repImageAlt = repImageAltText
    }

    fact.save()
    res.redirect('/facts')
  }

  catch(err){
    res.status(err.statusCode || 401).send(err.message)
  }
}


const fetchFacts = async (authSessionCookie) => {
  try{
    const decodedClaims = await getDecodedClaims(authSessionCookie)
    const fetchedFacts = await Fact.find().sort({ likes: -1 }).limit(10).populate('contributor comments.commentedBy')
    return fetchedFacts;
  }

  catch(err){
    return []
  }
}

const getUpdatedComments = async(req,res) => {
  const factId = req.query.factId;

  try{
    const fact = await Fact.findOne({ _id: factId }).populate('contributor comments.commentedBy')
    const comments = fact.comments;
    res.status(201).json(comments)
  }

  catch(err){
    res.status(500).json({error:err.message})
  }
}

const getUpdatedLikesCount = async(req,res) => {
  const factId = req.query.factId;
  
  try{
    const fact = await Fact.findOne({ _id: factId }).populate('contributor comments.commentedBy')
    const likesArray = fact.likes;
    res.status(201).json(likesArray.length)
  }

  catch(err){
    res.status(500).json({error:err.message})
  }
}


const getMoreFacts = async (req,res,next) => {
  const count = req.query.count;
  try{
    const fetchedFacts = Fact.find().sort({ likes: -1 }).limit(count ? count * 10 : 10).populate('contributor comments.commentedBy')
    res.json(fetchedFacts)
  }

  catch(err){
    res.redirect('/facts')
  }
}


async function renderDynamicRoutes(req,res){
  const routeId = req.params._id;

  try{
    const viewedRouteFact = await Fact.findOne({ _id: routeId }).populate('contributor comments.commentedBy')
    const suggestedFacts = await Fact.find().sort({  likes: -1 }).limit(4).populate('contributor comments.commentedBy')
    res.render('facts/factDetailsPage', { title: `Anciento De'Facts - ${viewedRouteFact.title}`, factDetails:  viewedRouteFact, suggestedFacts })
  }

  catch(err){
    res.status(404).send("Errror Occured Fetching This Details Page...Try again")
  }
}




module.exports = {
  getSignIn,
  getSignUp,
  handleCreateSessionCookie,
  getSignOut,
  handleNewFactPost,
  getMoreFacts,
  fetchFacts,
  renderDynamicRoutes,
  getUpdatedComments,
  getUpdatedLikesCount
}