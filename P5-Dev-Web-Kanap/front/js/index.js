(async function () {
    const articles = await getArticles()

    for (article of articles) {
        displayArticle(article)
    }
})()

function getArticles() {  // on récupère l'ensemble des articles dans l'API et ce n'est qu'une fois les articles arrivés qu'on continue pour la suite.
    return fetch("http://localhost:3000/api/products")
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

function displayArticle(article) { // on affiche un article par un article en avancant dans le tableau qu'on a récupéré grâce au fetch. 

    document.getElementById("main").innerHTML += `
    <section class="items" id="items">
        <a href="./product.html?${article._id}">
            <article>
                <img src="${article.imageUrl}" alt="${article.altTxt}">
                <h3 class ="productName">${article.name}</h3>
                <p class ="productDescription">${article.description}</p>
            </article>
        </a>
    </section> `
}