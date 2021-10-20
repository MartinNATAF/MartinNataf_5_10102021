(async function () {
    afficherPagner();
})()

async function afficherPagner () { // cette fonction affiche le panier, c'est la fonction globale,
                                    // elle est bien segmenté avec plusieurs fonction.
    var size = localStorage.length
    let tabAffiche = [];
    if (size != 0) {
        for (var i = 0; i < localStorage.length; i++) { // tant que l'on a pas terminé d'afficher les différents produits de notre panier on continue notre fonction.
            let key = localStorage.key(i);       // on va récupérer la clé de notre local storage pour l'élément i.
            let sortir = localStorage.getItem(key); //maintenant on récupère l'item grace à notre clé.
            let sortirJson = JSON.parse(sortir);  //on le transforme en objet javascript.
            let adresse = "http://localhost:3000/api/products/" + sortirJson._id; // on fait un fetch avec l'id dans notre objet JS.
            const article = await getArticle(adresse);
            let élémentFinal = { // une fois qu'on a l'ensemble de nos valeurs on les stock dans un objet qu'on réutilisera plus tard.
                _id: article._id,
                _imageUrl: article.imageUrl,
                _name: article.name,
                _price: parseInt(article.price),
                _quantity: parseInt(sortirJson._quantity)
            }
            console.log(élémentFinal); //les consoles log sont des mini test pour s'assurer que le code fonctionne bien.
            tabAffiche[i] = élémentFinal; // on stocke notre produit dans un tableau (récapitulatif)
            displayArticle(tabAffiche[i], sortirJson._color, key) //on affiche notre article avec les valeurs nécessaire.
            if (i == localStorage.length - 1) { //une fois que l'on sais qu'on a tout afficher on appel différentes fonctions qui vont être utile pour l'utilisateur.
                suppression() //fonction quand l'utilisateur supprime un article du panier
                valueQuantity()  //calcul le nombre total d'article et le prix total
                changement() //observe si il y'a un changement de quantité et modifie les valeurs en conséquence.
                ContactCheck() //fonction qui verifie que avant de faire la commande le formulaire est bien remplis.
            }
        }
    }
    else {
        alert("vous n'avez encore aucun produit de sélectionné pour votre panier")
        return (0);
    }
}

function getArticle(adresse) { //fonction qui récupère l'article avec fetch et qui le renvoie que lorsqu'il a reçu la réponse.
    return fetch(adresse)
        .then(function (httpBodyResponse) {
            return httpBodyResponse.json()
        })
        .then(function (articles) {
            return articles
        })
        .catch(function (error) {
            alert(error)
        })
}

function displayArticle(article, color, id) { //affiche l'article en question.
    
   document.getElementById('cart__items').innerHTML += `
    <article class="cart__item" id=":${id}">
        <div class="cart__item__img">
            <img src="${article._imageUrl}" alt="Photographie d'un canapé">
        </div>
        <div class="cart__item__content">
            <div class="cart__item__content__titlePrice">
                <h2>${article._name}</h2>
                <h2>${color}</h2>
                <p>${article._price} €</p>
            </div>
            <div class="cart__item__content__settings">
                <div class="cart__item__content__settings__quantity">
                    <p>Qté : </p>
                    <input type="number" data-id="${id}" id="_${id}" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${article._quantity}">
                </div>
                <div class="cart__item__content__settings__delete">
                    <p class="deleteItem" id="${id}">Supprimer</p>
                </div>
            </div>
        </div>
    </article> `
}

function suppression() { //supprime notre article si l'utilisateur le veux.
    var elements = document.getElementsByClassName("deleteItem");

    var myFunction = function() {
        var attribute = this.getAttribute("id");
        var élémentParent = ":" + attribute
        var element = document.getElementById(élémentParent);
        while (element.firstChild) { // tant que cette élément a des enfants on les supprimes
            element.removeChild(element.firstChild);
        }
        document.getElementById(élémentParent).remove(); //une fois que les enfants sont supprimés on supprime l'élement parent.
        localStorage.removeItem(attribute); //on supprime du local storage grâce à notre clé
        valueQuantity(); // recalcul la quantité une fois que l'élément a été supprimé 
    };

    for (var i = 0; i < elements.length; i++) {
        elements[i].addEventListener('click', myFunction, false);
    }
}

async function valueQuantity() { // calcul le nombre d'articles globeaux et le prix total puis l'affiche dynamiquement
    var quantity = 0;
    var money = 0;
    for (var i = 0; i < localStorage.length; i++) {
        let key = localStorage.key(i);
        let sortir = localStorage.getItem(key);
        let sortirJson = JSON.parse(sortir);
        let quantityNb = parseInt(sortirJson._quantity); // on met notre quantité en int pour faire des opérations mathématique avec.
        let adresse = "http://localhost:3000/api/products/" + sortirJson._id;
        const article = await getArticle(adresse);
        console.log(article)
        quantity += quantityNb; // on ajoute au fur et a mesure la quantité pour chaque article.
        money += article.price * quantityNb; //on ajoute au fur et a mesur le prix de chaque article multiplié par sa quantitée
    }
    var balise = document.getElementById('totalQuantity').innerHTML; //une fois l'ensembles des articles vu. on affiche
    if (balise != "") {
        document.getElementById('totalQuantity').innerHTML = "";
    }
    var balise2 = document.getElementById('totalPrice').innerHTML;
    if (balise2 != "") {
        document.getElementById('totalPrice').innerHTML = "";
    }
    document.getElementById("totalQuantity").innerHTML += `
    ${quantity}
    `
    document.getElementById("totalPrice").innerHTML += `
    ${money}
    `
}

function changement() { // fonction qui regarde si il y'a un changement dans les quantités
    var elements = document.getElementsByClassName("itemQuantity");

    var myFunction = function() {
        var attribute = this.getAttribute("data-id"); //on récupère le data-id pour voire quel article a été modifié.
        var concat = '_' + attribute; // l'endroit ou est stocké la valeur du nombre de produit.
        var valQuantity = document.getElementById(concat).value;
        console.log(valQuantity)
        let sortir = localStorage.getItem(attribute);
        let sortirJson = JSON.parse(sortir);
        sortirJson._quantity = valQuantity; //on modifie la valeur dans notre objet java.
        console.log(sortirJson)
        localStorage.removeItem(attribute); //on suprime notre objet dans le local storage
        let tableauString = JSON.stringify(sortirJson);
        localStorage.setItem(attribute, tableauString); // on stoque de nouveau notre objet en lui attribuant la clé de l'objet précedement supprimer.
        console.log(localStorage)
        valueQuantity(); //on change la quantité total des articles et le prix total.
    };

    for (var i = 0; i < elements.length; i++) { //pour l'ensembles des éléments du tableau (get element by class renvoie un tableau)
        elements[i].addEventListener('change', myFunction, false);
    }
}

function ContactCheck() { //vérifie si le formulaire est bien remplie avant de faire la requète POST vers l'api
    const order = document.getElementById('order');
    order.addEventListener('click', function()  {
        console.log("test")
        const firstName = document.getElementById('firstName').value;
        const lastName = document.getElementById('lastName').value;
        const adresse = document.getElementById('address').value;
        const city = document.getElementById('city').value;
        const email = document.getElementById('email').value;
        let store = localStorage.length
        if (validationFirstName(firstName) === true && validationLastName(lastName) === true) {
            if (validationAdresse(adresse) === true && validationCity(city) === true) {
                if (validationMail(email) === true && store != 0) {
                    postReservaiton(firstName, lastName, adresse, city, email); // envoie la requète post
                }
            }
        }
        if (store === 0) {
            alert("Votre commande est vide, merci de bien vouloir remplir votre panier")
        }
    });
}

function validationMail(value) { //vérifie à l'aide de regex que l'adresse mail est composé d'une première partie avec des lettres, des nombres, et quelques signes spéciaux.
                                // suivie du signe @ puis de nouveau cette sélection suivie d'un . enfin il ne peux y'avoir que deux caractères en lettres après le .
    var verif = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]{2,}[.][a-zA-Z]{2,3}$/ ;
    if (verif.exec(value) == null) {
        alert("Votre email est incorrecte");
        return false;
    }
    else {
        return true;
    }	
}

function validationFirstName(value) {
    var verif = /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u ; //autorise cette liste de caractère.
    if (verif.exec(value) == null) {
        alert("Votre First Name est incorrecte");
        return false;
    }
    else {
        return true;
    }
}

function validationLastName(value) {
    var verif = /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u ;
    if (verif.exec(value) == null) {
        alert("Votre Last Name est incorrecte");
        return false;
    }
    else {
        return true;
    }
}

function validationCity(value) {
    var verif = /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u ;
    if (verif.exec(value) == null) {
        alert("Votre City est incorrecte");
        return false;
    }
    else {
        return true;
    }
}

function validationAdresse(value) {
    var verif = /^[a-zA-Z0-9ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð\s,.'-]{3,}$/ ; //même chose mais au mois 3 caractère.
    if (verif.exec(value) == null) {
        alert("Votre Adresse est incorrecte");
        return false;
    }
    else {
        return true;
    }
}

async function postReservaiton(first, last, adresse, ville, mail) { // crée le tableau de donnée de contatc
    let contact = {
        firstName: first,
        lastName: last,
        address: adresse,
        city: ville,
        email: mail
    }
    let products = [];
    var i = 0;
    let key;
    let sortir;
    let sortirJson;
    while (i < localStorage.length) { //on remplis le tableau avec nos valeurs final.
        key = localStorage.key(i);
        sortir = localStorage.getItem(key);
        sortirJson = JSON.parse(sortir);
        products[i] = sortirJson._id;
        i++;
    }
    const aEnvoyer = { //on envoie cet objet et ce tableau à l'api
        contact,
        products
    }
    envoiePost(aEnvoyer);
    
}


async function envoiePost(post) {
    await axios.post("http://localhost:3000/api/products/order", JSON.stringify(post), {headers: {'Content-Type': 'application/json'}}) // on utilise axios pour faire un post vers l'api on privilégie cette méthode qui est plus facile.
        .then(function(res){
            const resultat = res
            const redirection = "./confirmation.html?" + resultat.data.orderId
            localStorage.clear() //on efface nos valeurs la commande est effectué
            window.location.href = redirection ; //on redirige l'utilisateur vers la page de confirmation.
        })
        .catch(function(err){
            console.log(err)
        })
}

