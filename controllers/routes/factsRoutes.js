const { Router } = require('express')
const router = Router()
const { 
   handleNewFactPost,
   renderDynamicRoutes, 
   getUpdatedComments, 
   fetchFacts,
   getUpdatedLikesCount,
   getSearchedFacts
} = require('../setResponse')

const { handleFactsLikes , handleComment  } = require('../handleFactInteractions')

router.get('/', async(req,res) => {
   const authSessionCookie = req.cookies.authSession || '';
   const facts = await fetchFacts(authSessionCookie,50) 
   res.render('facts/index', { title: "Anciento De'Facts - Facts", facts })
})

router.get('/new',(req,res) => {
   res.render('facts/new', { title: "Anciento De'Facts - New Fact" })
})

router.get('/search',getSearchedFacts)

router.post('/',handleNewFactPost)

router.get('/comments',getUpdatedComments)
router.get('/likes',getUpdatedLikesCount)
router.post('/likeFact',handleFactsLikes)
router.post('/comment',handleComment)

router.get('/factDetails/:_id',renderDynamicRoutes)

module.exports = router;