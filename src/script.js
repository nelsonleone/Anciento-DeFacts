import { signInWithGoogle, handleSignOut } from './handleAuth.js';
import { interactWithFact, commentOnFact, postNewFact } from './handleFactsActions.js'

const openNavBtn = document.querySelector('.open-nav-btn')
const openNavImage = document.querySelector('.toggleImage')
const mainNav = document.getElementById('main-nav')
const imageInput = document.querySelector('input[type="file"]')
const authButtons = document.querySelectorAll('.auth-button')
const signOutBtn = document.getElementById('signout-btn')
const factsSection = document.querySelector('.facts-container')
const factLikeBtns = document.querySelectorAll('.like-fact-btn')
export const snackbarElement = document.querySelector('[data-snackbar]')
const commentForm = document.querySelector('.comment-form')
const commentsContainer = document.getElementById('comments-container')
export const loaderElement = document.getElementById('loader')



commentForm && commentForm.addEventListener('submit',async function(e){
   e.preventDefault()
   const comment = this.addComment.value;
   const factId = this.id;
   const userId = this.dataset.userid;
   await commentOnFact(factId,userId,comment)
   this.addComment.value = "";
})


factLikeBtns.length > 0 && factLikeBtns.forEach(btn => {
   btn.addEventListener('click', async function(e) {
      if (this.classList.contains('liked')) {
         await interactWithFact(this.dataset.userid,this.id)
         this.classList.remove('liked')
         this.classList.add('not-liked')
      } else {
         await interactWithFact(this.dataset.userid,this.id)
         this.classList.add('liked')
         this.classList.remove('not-liked')
      }
   })
})



// render updated comments
export function renderUpdatedComments(comments){
   commentsContainer.innerHTML = "";
   let htmlElements = "";

   comments.forEach((comment) => {
      htmlElements += `
      <div class="comment">
         <div>
            <span>${comment.commentedBy.name}</span>
            <span>${hideEmail(comment.commentedBy.email)}</span>
         </div>
         <p>${comment.comment}</p>
      </div>
      `
   })

   document.getElementById('fact-comments-count').innerText = comments.length;
   commentsContainer.innerHTML = htmlElements;
}




// partially hide user's email 
function hideEmail(email){
   const [localPart, domainPart] = email.split('@')
   const hiddenLocalPart = localPart.replace(/(?<=.{5})./g, '*')
   const hiddenEmail = `${hiddenLocalPart}@${domainPart}`

   return hiddenEmail;
}


export function renderUpdatedLikesCount(updatedLikesCount){
   document.getElementById('fact-likes-count').innerText = updatedLikesCount;
}


if(signOutBtn){
   signOutBtn.addEventListener('click',handleSignOut)
}


// nav menu toggle
openNavBtn.addEventListener('click',() => {
   if(openNavImage.src.match('/images/icon-hamburger.svg')){
      openNavImage.setAttribute('src','/images/icon-close.svg')
      mainNav.style.display = "block";
      openNavBtn.ariaExpanded = true;
   }else{
      openNavImage.setAttribute('src','/images/icon-hamburger.svg')
      mainNav.style.display = "none";
      openNavBtn.ariaExpanded = false;
   }
})




// handle signin/signup
authButtons.forEach((button) => {
   button.addEventListener('click',signInWithGoogle)
})


// FilePond init
FilePond.registerPlugin(
   FilePondPluginImagePreview,
   FilePondPluginImageResize,
   FilePondPluginFileEncode
)

FilePond.setOptions({
   stylePanelAspectRatio: 1,
   imageResizeTargetWidth: 800,
   imageResizeTargetHeight: 760,
   imageTransformOutputQuality: 0.9
})

FilePond.parse(document.body)