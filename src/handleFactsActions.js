import { snackbarElement , renderUpdatedLikesCount,  loaderElement, renderUpdatedComments, renderFacts} from './script.js';
import { Snackbar } from './Snackbar.js';
import { Loader } from './Loader.js'

export async function interactWithFact(userId,factId){

  const loader = new Loader(loaderElement)
  loader.load()

  try {
    const res = await fetch(`/facts/likeFact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        factId,
      }),
    });
  
    if (res.ok) {
      const resLikeCountFetch = await fetch(`/facts/likes?factId=${factId}`)
      const updatedLikesCount = await resLikeCountFetch.json()
      await renderUpdatedLikesCount(updatedLikesCount)
  
      const snackbar = new Snackbar('Interaction Sent', 'success', snackbarElement)
      snackbar.show()
  
      setTimeout(() => {
        snackbar.clear()
      }, 3000)
    } else {
      throw new Error('Error Liking Fact')
    }
  } 
  
  catch (err) {
    const snackbar = new Snackbar(err.message, 'error', snackbarElement)
    snackbar.show()
  
    setTimeout(() => {
      snackbar.clear()
    }, 3000)
  } 
  
  finally {
    loader.stop()
  }  
}







export async function commentOnFact(factId,userId,comment){
  
  let success = false;
  let errorMessage = "";
  const loader = new Loader(loaderElement)
  loader.load()

  try{
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
    success = false;
    errorMessage = err.message;
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
    else if(!success){
      const snackbar = new Snackbar(errorMessage,'error',snackbarElement)
      snackbar.show()

      setTimeout(() =>{
        snackbar.clear()
      },3000)
    }
  }
}



export async function getSearchedFacts(searchValue){

  const loader = new Loader(loaderElement)
  loader.load()

  fetch(`/facts/search?name=${searchValue}`)
  .then(response => {
    if(response.ok){
      return response.json()
    }
    else {
      return response.json().then(data => {
        throw new Error(data.error)
    })
    }
  })
  .then(data => {
    loader.stop()
    const searchedFactsResult = data;
    renderFacts(searchedFactsResult)
  })

  .catch(error => {
    loader.stop()
    const snackbar = new Snackbar(error.message,'error',snackbarElement)
    snackbar.show()
    
    setTimeout(() => {
      snackbar.clear()
    },5000)
  })
}