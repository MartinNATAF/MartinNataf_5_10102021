(async function () {
    const article = await getArticle()
    const colors = article.colors
    displayArticle(article)
    for (color of colors) {
        displayColor(color)
    }
    const addCart = document.getElementById('addToCart');
    addCart.addEventListener('click', function() { //Cette fonction ce déclenche quand l'utilisateur clique sur ajouter au panier
        var selectElem = document.getElementById('colors');
        var index = selectElem.selectedIndex;
        var idArticle = article._id;
        var quantity = document.getElementById('quantity').value;

        if(index != 0 && quantity > 0) { //on vérifie que la couleur a été choisie et que la quantitée n'est pas à 0
            console.log('top')
            addPagner(index, colors, idArticle, quantity);
            verifOrdre();
        }
        else {
            console.log('nop')
            alert('il faut choisir une couleur et avoir au moins un article pour commander !')
            return (1);
        }
    });
})()

function getArticle() {
    let params = (new URL(document.location)).searchParams;
    let id = 'http://localhost:3000/api/products/' + params;
    var newId = id.substring(0, id.length - 1);
    return fetch(newId)
        .then(function (httpBodyResponse) {
            return httpBodyResponse.json()
        })
        .then(function (article) {
            return article
        })
        .catch(function (error) {
            alert(error)
        })
}

function displayArticle(article) {  //affichage du détail du produit en récupérant les info de l'API

    document.getElementById("main").innerHTML += `
    <article>
    <div class="item__img">
        <img src="${article.imageUrl}" alt="Photographie d'un canapé">
    </div>
    <div class="item__content">

        <div class="item__content__titlePrice">
            <h1 id="title">${article.name}</h1>
            <p>Prix : <span id="price">${article.price}</span>€</p>
        </div>

        <div class="item__content__description">
            <p class="item__content__description__title">Description :</p>
            <p id="description">${article.description}</p>
        </div>

        <div class="item__content__settings">
            <div class="item__content__settings__color">
                <label for="color-select">Choisir une couleur :</label>
                <select name="color-select" id="colors">
                    <option value="">--SVP, choisissez une couleur--</option>
                </select>
            </div>
            <div class="item__content__settings__quantity">
                <label for="itemQuantity">Nombre d'article(s) (1-100) :</label>
                <input type="number" name="itemQuantity" min="1" max="100" value="0" id="quantity">
            </div>
        </div>

        <div class="item__content__addButton">
            <button id="addToCart">Ajouter au panier</button>
        </div>

    </div>
    </article> `
}

function displayColor(color) {   //une fois que l'ensemble du html est afficher on rajoute les couleurs récupérer sur l'api.
    document.getElementById("colors").innerHTML += `
        <option value="${color}">${color}</option>
    `
}

function addPagner(index, colors, id, quantity) {  // C'est une fonction qui vérifie qu'il n'existe pas déja dans notre
    var colorValide = colors[index - 1]            // storage un élément avec le même id et la même couleur. Si oui il
    var size = localStorage.length                 // rassemble les deux élément en un élément en additionnant les quantités.
    var key = id + colorValide
    let commande = {
        _id: id,
        _color: colorValide,
        _quantity: quantity
    };
    
    if (size === 0) {
        let tableauString = JSON.stringify(commande);
        localStorage.setItem(key, tableauString);
        console.log(localStorage);
    }
    else {
        if (localStorage.getItem(key)) {
            let sortir = localStorage.getItem(key);
            let sortirJson = JSON.parse(sortir);
            let quantity1 = parseInt(commande._quantity);
            let quantity2 = parseInt(sortirJson._quantity);
            commande._quantity = quantity1 + quantity2;
            localStorage.removeItem(key);
            let tableauString = JSON.stringify(commande);
            localStorage.setItem(key, tableauString);
            console.log(localStorage);
        }
        else {
            let tableauString = JSON.stringify(commande);
            localStorage.setItem(key, tableauString);
            console.log(localStorage);
        }
    }
}

function verifOrdre() {  //Afficher les produits dans l'ordre de manière à ce que les mêmes produits ce suivent dans le panier -> tri à bulle .
    var i = 0;
    var j = 1;
    var size = localStorage.length;
    while(i < size) {
        while(j < size) {
            let key = localStorage.key(i);
            let sortir = localStorage.getItem(key);
            let sortirJson = JSON.parse(sortir);
            let key2 = localStorage.key(j);
            let sortir2 = localStorage.getItem(key2);
            let sortirJson2 = JSON.parse(sortir2);
            let keySwap = localStorage.key(i + 1);
            let sortSwap = localStorage.getItem(keySwap);
            let sortirJsonSwap = JSON.parse(sortSwap);
            if (sortirJson._id === sortirJson2._id) {
                var a = sortirJson2;
                var b = sortirJsonSwap;
                sortirJson2 = b;
                sortirJsonSwap = a;
            }
            j++;
        }
        i++;
    }
}




