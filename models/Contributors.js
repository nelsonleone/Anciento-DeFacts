const mongoose = require('mongoose')
const { Schema, models, model  } = mongoose;

const contributorSchema = new Schema({
  name: {
   type: String,
   required: true
  },
  email: {
   type: String,
   unique: true,
   required: true
  },
  photoURL: String
}, { timestamps: true })

const Contributor = model('Contributor',contributorSchema)

module.exports = Contributor;