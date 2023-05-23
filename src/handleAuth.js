import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import { signInhiddenInput, signUphiddenInput } from './script.js';

let auth;
let app;
let authProvider;

const fetchEnvVar = async() => {
  const configData = await fetch('/auth/getConfig')
  const configValueObj = await configData.json()

  const firebaseConfig = {
    apiKey: configValueObj.FIREBASE_API_KEY,
    authDomain: configValueObj.FIREBASE_AUTH_DOMAIN,
    projectId: configValueObj.FIREBASE_PROJECT_ID,
    storageBucket: configValueObj.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: configValueObj.FIREBASE_MESSAGING_SENDER_ID,
    appId:  configValueObj.FIREBASE_API_ID,
    measurementId:  configValueObj.FIREBASE_MEASUREMENT_ID
  }
  app = initializeApp(firebaseConfig)
  authProvider = new GoogleAuthProvider()
  auth = getAuth()
}

fetchEnvVar()

export async function signInWithGoogle(){
  try{
    const credential = await signInWithPopup(auth,authProvider)
    const user = credential.user;
    const token = await user.getIdToken()
    postIdToken(token)
  }
  catch(err) {
    alert("Error:" + err.message)
  }
}



async function postIdToken(idToken){

  let csrfToken;
  if(window.location.href === '/auth/signin'){
    csrfToken = signInhiddenInput.value;
  }
  else if(window.location.href === '/auth/signup'){
    csrfToken = signUphiddenInput.value
  }

  try{
    await fetch('/auth',{
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ idToken , csrfToken})
    })

    window.location.href = "/"
  }

  catch(err){
    alert(err.message, 'Error Authenticating User...Try Again')
  }
}

export async function handleSignOut(){
  auth.signOut()
  try{
    await fetch('/auth/signout',{
      method: 'GET'
    })

    location.assign('/')
  }

  catch(err){
    alert('Error Signing-Out, Try Again')
  }
}