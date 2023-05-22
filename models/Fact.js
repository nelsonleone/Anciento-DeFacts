const mongoose = require('mongoose');
const { Schema, model } = mongoose;


const commentSchema = new Schema({
  comment: String,
  commentedBy: {
    type:  Schema.Types.ObjectId,
    ref: 'Contributor'
  }
})

const taskSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  repImageDataString: Buffer,
  repImageType: String,
  repImageAlt: String,
  credits: [String],
  contributor: {
    type: Schema.Types.ObjectId,
    ref: 'Contributor'
  },
  likes: [Schema.Types.ObjectId],
  comments: [commentSchema]
}, { timestamps: true })

taskSchema.virtual('repImageSrcPath').get(function(){
  if (this.repImageDataString && this.repImageType) {
    return `data:${this.repImageType};charset=utf-8;base64,${this.repImageDataString.toString('base64')}`
  }
})

const Task = model('Task', taskSchema)

module.exports = Task;
