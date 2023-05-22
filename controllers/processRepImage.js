const IMAGE_MIME_TYPES = ['image/png','image/jpg','image/jpeg','image/gif', 'image/webp']

function processRepImage(fact,encodedRepImageObj){
   if(encodedRepImageObj == null)return;

   const repImageData = JSON.parse(encodedRepImageObj)

   if(repImageData != null && IMAGE_MIME_TYPES.includes(repImageData.type)){
      const imageStringData = repImageData.data;
      const imageBuffer = new Buffer.from(imageStringData,'base64')
      fact.repImageDataString = imageBuffer;
      fact.repImageType =  repImageData.type;
   }
}

module.exports = processRepImage;