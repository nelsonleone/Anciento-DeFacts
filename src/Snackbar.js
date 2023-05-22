export class Snackbar {
   constructor(message,severity,element){
      this.message = message;
      this.severity = severity;
      this.element = element;
   }

   clear(){
      this.message = "";
      this.severity = "";
      this.element.style.display = "none";
   }

   show(){
      this.element.style.display = "block";
      this.element.classList.toggle(this.severity)
      this.element.innerHTML = `
         <div class="snackbar">
         <span>${this.message}</span>
         </div>
      `
   }
}