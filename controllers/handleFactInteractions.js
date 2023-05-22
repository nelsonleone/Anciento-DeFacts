const { default: mongoose } = require('mongoose')
const CustomError = require('./CustomError')
const Fact = require('../models/Fact')

async function handleFactsLikes(req,res,next){
   const factId = req.body.factId;
   const userId = req.body.userId;

   if(!factId || !userId){
     throw new CustomError(500,"Empty Query Parameter Passed")
   }

   try {
      const fact = await Fact.findById(factId)

      if (fact.likes.includes(userId)) {
        await fact.updateOne({ $pull: { likes: userId } })
        res.locals.facts = updatedFactsData()
        res.status(201).send("Fact Unliked")
      } else {        
        await fact.updateOne({ $push: { likes: userId } })
        res.status(201).send("Fact Liked")
      } 
   }

   catch (error) {
      if (error instanceof mongoose.Error.CastError) {
        res.status(400).send(error.message)
      } else {
        res.status(error.code || 500).send(error.message)
      }
   }
}


async function handleComment(req,res){
  const { factId, userId, comment } = req.body;

  if(!factId || !userId || !comment){
    throw new CustomError(500,"Empty Query Parameter Passed")
  }

  try{
    const fact = await Fact.findOneAndUpdate(
      { _id: factId },
      { $push: { comments: { comment, commentedBy: userId } } },
      { new: true }
    )
    res.status(201).send("Commented")
  }

  catch(error){
    res.status(error.code || 500).send(error.message)
  }
}



module.exports = {
  handleFactsLikes,
  handleComment,
}