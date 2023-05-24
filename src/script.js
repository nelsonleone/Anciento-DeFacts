import { signInWithGoogle, handleSignOut } from './handleAuth.js';
import { interactWithFact, commentOnFact, getSearchedFacts } from './handleFactsActions.js'

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
export const signInhiddenInput = document.querySelector('.signin-hiddenInput')
export const signUphiddenInput = document.querySelector('.signup-hiddenInput')
export const searchFactInput = document.querySelector('.search-facts')
export const searchFactForm = document.querySelector('.search-facts-form')

searchFactForm?.addEventListener('submit',(e) => {
   e.preventDefault()
   getSearchedFacts(searchFactInput.value)
})

searchFactInput?.addEventListener('input',(e) => {
   if(e.target.value === ""){
      // get facts if no value id passed
      setTimeout(() => {
         getSearchedFacts(searchFactInput.value)
      }, 3000)
   }
})

window.addEventListener('load',() => {
   if(searchFactInput){
      searchFactInput.value = "";
   }
})

commentForm?.addEventListener('submit', async function (e) {
   e.preventDefault();
   const comment = this.addComment.value;
   const factId = this.id;
   const userId = this.dataset.userid;
   await commentOnFact(factId, userId, comment);
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


const usernameEJSContainer = document.getElementById('user-name')


export function renderFacts(factsArr){
   let htmlfacts = '';

   factsArr.forEach(fact => {
            
      htmlfacts += `
      <div class="fact" tabindex="0" aria-label="Fact" aria-labelledby="${fact._id}">
               
         <div class="fact-contributor-details">
            <p aria-label="Fact Writer Name">
               ${fact.contributor.name === usernameEJSContainer.value ? "You" : fact.contributor.name }
            </p>
            <p>${hideEmail(fact.contributor.email)}</p>
         </div>

         <div class="fact-image-container">
            <img src="${fact.repImageSrcPath}" alt="${fact.repImageAlt}" />
         </div>

         <div>
            <h3 id="${fact._id}">${fact.title}</h3>
            <p class="fact-body">${fact.body.slice(0,100)}.....</p>
         </div>

         <div class="interaction-contents">
            <div>
               <span aria-label="fact likes">${fact.likes.length || 0 }</span>
               <i class="fa-solid fa-heart"></i>
            </div>
            <div>
               <span aria-label="Fact Comment Count">${fact.comments.length || 0 }</span>
               <i aria-label="Comments" class="fa-solid fa-comment"></i>
            </div>
         </div>

         <a href="/facts/factDetails/${fact._id}" class="view-full-details">
            <i class="fa-solid fa-eye" style="color: #12a8a6;"></i>
         </a>
         <p class="createdAt">${new Date(fact.createdAt).toLocaleString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
      </div>
      `
   })

   document.getElementById('facts-container').innerHTML = htmlfacts;
}