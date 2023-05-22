import { snackbarElement ,renderUpdatedLikesCount,  loaderElement, renderUpdatedComments} from './script.js';
import { Snackbar } from './Snackbar.js';
import { Loader } from './Loader.js'


export async function postNewFact(formData){

  try{
    await fetch('/facts',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: formData
    })
  }

  catch(err){
    console.log(err.message)
    const snackbar = new Snackbar(err.message,'error',snackbarElement)
    snackbar.show()
 
    setTimeout(() => {
      snackbar.clear()
     },5000)
  }
}

export async function interactWithFact(userId,factId){

  const loader = new Loader(loaderElement)

  try{
    const res = await fetch(`/facts/likeFact`,{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId,
        factId
      })
    })

    loader.load()
    const resLikeCountFetch = await fetch(`/facts/likes?factId=${factId}`)
    const updatedLikesCount = await resLikeCountFetch.json()
    renderUpdatedLikesCount(updatedLikesCount)
  }
  
  catch(err){
    const snackbar = new Snackbar(err.message,'error',snackbarElement)
   snackbar.show()

   setTimeout(() => {
     snackbar.clear()
    },3000)
  }
  
  finally{
    loader.stop()
  }
}







export async function commentOnFact(factId,userId,comment){
  
  let success = false;
  const loader = new Loader(loaderElement)

  try{
    loader.load()
    const res = await fetch('/facts/comment',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        factId,
        userId,
        comment
      })
    })

    
    const commentsResData = await fetch(`/facts/comments?factId=${factId}`)
    const updatedComments = await commentsResData.json()
    await renderUpdatedComments(updatedComments)
    success = true;
  }

  catch(err){
    console.log(err)
    const snackbar = new Snackbar(err.message,'error',snackbarElement)
    snackbar.show()

    setTimeout(() =>{
      snackbar.clear()
    },3000)
  }


  finally{
    loader.stop()

    if(success){
      const snackbar = new Snackbar("Comment Sent",'success',snackbarElement)
      snackbar.show()
      
      setTimeout(() => {
        snackbar.clear()
      },3000)
    }
  }
}