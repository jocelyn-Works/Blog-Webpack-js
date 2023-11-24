import './../assets/styles/style.scss';
import './form.scss';
import { openModal } from '../assets/javascripts/modal';

const form = document.querySelector("form"); // on récupére le formulaire 
const errorList = document.querySelector("#errors");
const btnCancel = document.querySelector('.btn-secondary');



let articleId;

// pré rempli le formulaire lors de la modification grace a InitForm qui a récupéré id de l'article
const fillForm = (article) => {
    const author = document.querySelector('input[name="author"]');
    const image = document.querySelector('input[name="image"]');
    const category = document.querySelector('select[name="category"]');    // récupére les input , select et textarea
    const title = document.querySelector('input[name="title"]');
    const content = document.querySelector("textarea"); 

    author.value = article.author || '';
    image.value = article.image || '';
    category.value = article.category || '';   // remplie les champs avec leurs valeurs grace l'ID récupérer dans initform
    title.value = article.title || '';
    content.value = article.content || '';

   }
//  récupére l' ID de larticle   
const initForm = async () => { 
    const params = new URL(location.href); // on récupére les paramétre de l' URL 
    articleId = params.searchParams.get('id'); // dans l'URL on recupére la valeur du paramètre ID de larticle
    if (articleId) {  
        const response = await fetch(`https://restapi.fr/api/jocelyn_blog/${articleId}`); // dans reponse on a récupérer ID de l'article
        if (response.status <300){ // si le statut de la reponse est   inférieur à 300 alors ont continue  ( 0 => 299 reponse vraie )
            const article = await response.json(); //la réponse soit renvoyée sous forme de données JSON ( clé : valeur )
            fillForm(article); // on appelle la fonction fillform pour remplire le formulaire avec les données de l'article
            console.log(article)
        }
    }

}

initForm()  // dans la fonction InitForm on retrouve la fonction fillForm 
// let errors = [];

btnCancel.addEventListener('click', async () => { // bouton pour annuler les modifications 
    const answer = await openModal(" En annulant, vous perdrez tout votre article, confirmez-vous la suppression ?");
    if (answer === true) {
        location.assign('/index.html');
    }
    location.assign('/index.html');        //et revenir sur index 
})

form.addEventListener('submit',  async event => {  //  fonction pour lécoute de nortre formulaire 
    event.preventDefault();

    const formData = new FormData(form);           // représente les données  des champs du formulaire 
    const entries = formData.entries();           //  on accéde au données 
    const article = Object.fromEntries(entries); //   on crée un article pour chaque données q'on a récuperer

    if (formIsvalid(article)){
        try {
            // verifie si les champs on été saisie 
            const json = JSON.stringify(article);  // covertir nos données en chaine de caractére ( clé : valeur)
            let response;
            if (articleId) {
                // envoyer les donnees a notre serveur distant
                response = await fetch(`https://restapi.fr/api/jocelyn_blog/${articleId}`, { // pour modifier un article
                    method: 'PATCH', // PATCH va modifier seulement ce qui a été modifier dans le form //
                    headers: {'Content-Type' : 'application/json'}, // renvoi du json ( chaine de caractére ) pour interpreter la requéte
                    body: json
                });
            }else{
                response = await fetch(`https://restapi.fr/api/jocelyn_blog`, { //  pour crée un article
                    method: 'POST', // envoi des donné //
                    headers: {'Content-Type' : 'application/json'}, // renvoi du json ( chaine de caractére ) pour interpreter la requéte
                    body : json
                });
            }

            // const body = await response.json();
            // form.reset();
            // console.log(body);
            if (response.status < 299) { //si les donnees sont bien envoyé ( 0 => 299 = reponse true )
                location.assign('/index.html'); // renvoi a la page index 
            }
        }catch (error) {
            console.error(error);
        }
    // console.log(json);
}})

const formIsvalid = (article) => {  
    let errors =[];                 // verifie si tout les champs du formulaire sont remplie //
    if (!article.author || !article.category || !article.content || !article.image || !article.title){ 
        errors.push("Vous devez renseigner tous les champs");
    }else{
        errors = [];
    }

    if (errors.length) {
        let errorHTML ="";
        errors.forEach(error => {
            errorHTML += `<li>${error}</li>`
        });
        errorList.innerHTML = errorHTML;
        return false;
    }else {
        errorList.innerHTML = '';
        return true;
    }
}
// fonction pour aficher  ou non les asterix rouge quand le champs est remplie ou non 
function hideRequired() {
          const requiredFields = document.querySelectorAll("input, select, textarea");
          requiredFields.forEach(field => {
            field.addEventListener("input", () => {
              if (field.value !== "" && field.value !== "Choisir une categorie" ) {
                field.previousElementSibling.innerHTML = field.previousElementSibling.innerHTML.replace("*", "");
              } else {
                field.previousElementSibling.innerHTML = field.previousElementSibling.innerHTML.replace("*", "") + "<span style='color: red;'>*</span>";
              }
            });
          });
}
      
hideRequired();