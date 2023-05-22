const admin = require('firebase-admin')
const serviceAccount = require(process.env.PATH_TO_SERVICE_KEY)

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
})


async function getDecodedClaims(authSessionCookie){
  const decodedClaims = await admin.auth().verifySessionCookie(authSessionCookie, true)
  return decodedClaims;
}

module.exports = admin;
module.exports.getDecodedClaims = getDecodedClaims;