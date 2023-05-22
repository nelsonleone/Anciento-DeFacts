export class Loader {
   constructor(element){
      this.element = element;
   }

   load(){
      this.element.style.display = "block";
   }

   stop(){
      this.element.style.display = "none";
   }
}