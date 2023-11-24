
import "./assets/styles/style.scss";
import "./index.scss";
import { openModal } from "./assets/javascripts/modal";

const articlesContainer = document.querySelector(".articles-container");
const categoriesContaineer = document.querySelector('.categories');

let filter;
let articles;

const displayMenuCategories = (categoriesArray) => {
    const liElements = categoriesArray.map( categoryElement => {
        const li = document.createElement('li');
        li.innerHTML = `${categoryElement[0]} ( <span>${categoryElement[1]}</span> )`;
        li.classList.add('active');
        if (categoryElement[0] === filter) {
          li.classList.add('active');
        }
        li.addEventListener('click', () => {
            liElements.forEach(element => element.classList.remove('active'));
            if(filter === categoryElement[0]) {
              filter = null;
            } else {
              li.classList.add('active');
              filter = categoryElement[0];
            }
            createArticles();
            })
           
        return li;
        })
        categoriesContaineer.innerHTML = '';
        categoriesContaineer.append(...liElements);
}

const createMenuCategories = () => {
    const categories = articles.reduce((acc, article) => {
      if(acc[article.category]) { // si on a deja cette categorie dans notre objet, on incremente le nombre de celui-ci
        acc[article.category]++;
      } else { // sinon on creer cette nouvelle categorie, et on met 1 en quantite
        acc[article.category] = 1;
      }
      return acc; // attention a ne pas oublier le return acc
      }, {});
    console.log(categories);

    const categoriesArray = Object.keys(categories).map(category => {
        return [category, categories[category]]
    }); //[['nature', 3], ['tech', 3], []]
    displayMenuCategories(categoriesArray);
}

const fetchArticles = async () => {
  try {
    const response = await fetch("https://restapi.fr/api/jocelyn_blog");
     articles = await response.json();

    if (!(articles instanceof Array)) {
      articles = [articles];
    }

    if(articles.length) {
        // createArticles();
        // createMenuCategories();
    }else {
        articlesContainer.innerHTML = "Pas d'articles ...";
        categoriesContaineer.innerHTML = "Aucune categorie";
    }

    console.log(articles);
    createArticles(articles);
    createMenuCategories(articles);
  } catch (error) {
    // console.error(error);
  }
};

const createArticles = () => {  
    const articlesDOM = articles
        .filter(article => {
            if(filter)  {
                return article.category === filter;

            }
            return true;
        })
  // Pour chaque article present dans notre liste d'article :
  .map((article) => {
    // On va creer un noeud, une div
    const articleNode = document.createElement("div");
    // creation dune DIV pour afficher les articles

    // On ajoute une classe a cette div : 'article'
    articleNode.classList.add("article");

    // on affiche l'articles 
    articleNode.innerHTML = `
    <img src="${article.image ? article.image : "assets/images/default_profile.png"}" alt="User picture">
    <h2>${article.title ? article.title : "Titre de l'article"}</h2>
    <p class="article-author">${article.author} - <span> ${new Date(article.createdAt).toLocaleDateString("fr-FR", {
      weekday: "long",   //  le jour : en lettre
      day: "2-digit",   //   le jour : en chiffre en 2 chiffres
      month: "long",   //    le mois : en lettre
      year: "numeric",//     l'année : en chiffre
    })}</span></p>
    <p class="article-content">${article.content}</p>
    <div class="article-actions">
    <button class="btn btn-primary" data-id= ${article._id}>Modifier</button>
    <button class="btn btn-danger" data-id= ${article._id}>Supprimer</button>
    </div>
    `;
    return articleNode; // va nous permmetre de retourner larticle
  });
  articlesContainer.innerHTML = "";
  articlesContainer.append(...articlesDOM);

  const deleteButtons = articlesContainer.querySelectorAll('.btn-danger');
  const editButtons = articlesContainer.querySelectorAll('.btn-primary');

  deleteButtons.forEach((button) => {  // pour chaque  boutton suprimer
    button.addEventListener("click", async (event) => { // quand on click sur un boutton suprimmer
      event.preventDefault();  // empéche le rechargement de la page quand une action est faite 
      window.scrollTo(0, 0);
      // on veut récupere la reponse ==> louverture du modal la phrase suivante safichera
      const answer = await openModal("Etes vous sur de vouloire supprimer votre articles ?");
      if (answer == true ){
        try {
        const target = event.target;
        const articleId = target.dataset.id; // Tout attribut HTML quicommence par data- sera récupérable en JavaScript sur la propriété dataset
        const response = await fetch(
          `https://restapi.fr/api/jocelyn_blog/${articleId}`,  // on récupére l'ID de larticle pour le suprimmer par la suite 
          {
            method: "DELETE",  // methode pour supprimer 
          }
        );
        const body = await response.json();
        fetchArticles();
        console.log(body);
      } catch (error) {
        console.error(error);
      } 
      }
     
    });
  });

  editButtons.forEach(button => {  //  pour chaque boutton modifier 
    button.addEventListener("click", async (event) => { // quand on va cliquer sur le bouton modifier : 
      event.preventDefault(); // empéche le rechargement de la page au click
      const target = event.target;  // on accéde aux données saisie 
      const articleId = target.dataset.id;  // on recupére ID de larticle pour modifier le bon article 
      location.assign(`/form.html?id=${articleId}`); // on redirige vers form.html avec (location ) et (assign) pour transmettre des infos
    })
  })

}

fetchArticles();  // on rappelle la fonction pour la mettre en oeuvre
