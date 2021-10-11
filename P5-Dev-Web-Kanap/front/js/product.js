(async function () {
    const article = await getArticle()

    displayArticle(article)

})()

function getArticle() {
    let params = (new URL(document.location)).searchParams;
    let id = params.get('id');
    
    return fetch(id)
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

function displayArticle(article) {

    document.getElementById("main").innerHTML += `
    <article>
    <div class="item__img">
        <img src="${article.imageUrl}" alt="Photographie d'un canapé">
    </div>
    <div class="item__content">

        <div class="item__content__titlePrice">
            <h1 id="title"></h1>
            <p>Prix : <span id="price"></span>€</p>
        </div>

        <div class="item__content__description">
            <p class="item__content__description__title">Description :</p>
            <p id="description"></p>
        </div>

        <div class="item__content__settings">
            <div class="item__content__settings__color">
                <label for="color-select">Choisir une couleur :</label>
                <select name="color-select" id="colors">
                    <option value="">--SVP, choisissez une couleur --</option>
                    <option value="vert"></option>
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

