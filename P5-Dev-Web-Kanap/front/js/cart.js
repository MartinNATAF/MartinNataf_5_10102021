(async function () {
    afficherPagner()
    await deleteElt()
})()

async function afficherPagner () {
    
    var size = localStorage.length
    let tabAffiche = [];
    if (size != 0) {
        for (var i = 0; i < localStorage.length; i++) {
            let key = localStorage.key(i);
            let sortir = localStorage.getItem(key);
            let sortirJson = JSON.parse(sortir);
            let adresse = "http://localhost:3000/api/products/" + sortirJson._id;
            const article = await getArticle(adresse);
            let élémentFinal = {
                _id: article._id,
                _imageUrl: article.imageUrl,
                _name: article.name,
                _price: parseInt(article.price),
                _quantity: parseInt(sortirJson._quantity)
            }
            console.log(élémentFinal);
            tabAffiche[i] = élémentFinal;
            displayArticle(tabAffiche[i], sortirJson._color, sortirJson._id)
        }
        /*var article = 0;
        var count = 2;
        while (article < tabAffiche.length) {
            var articleSup =  article + 1;

            while (articleSup < tabAffiche.length) {
                var fin = tabAffiche.length - 1;
                
                if (tabAffiche[article]._name === tabAffiche[articleSup]._name) {
                    tabAffiche[article]._quantity += tabAffiche[articleSup]._quantity;
                    if (articleSup === fin) {
                        tabAffiche.pop();
                    }
                    else {
                        var test = tabAffiche.splice(articleSup,  1);
                        console.log(test, "toze")
                    }
                }
                articleSup++;
            }
            articleSup = count;
            count++;
            article++;
            console.log(article, "petit");
            console.log(articleSup, "grand");
        }*/
    }
    else {
        return (0);
    }
}

function getArticle(adresse) {
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

function displayArticle(article, color, id) {
    
   document.getElementById('cart__items').innerHTML += `
    <article class="cart__item" data-id="${id}">
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
                    <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${article._quantity}">
                </div>
                <div class="cart__item__content__settings__delete">
                    <p class="deleteItem" data-id="delete:${id}">Supprimer</p>
                </div>
            </div>
        </div>
    </article> `
}

async function deleteElt() {
    const deletePagner = document.getElementById('deleteItem');
    deletePagner.addEventListener('click', function() {
        console.log('alright')
        var element = document.getElementById();
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }
    })
}

