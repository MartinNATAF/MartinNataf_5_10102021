(async function () {
    afficherPagner();
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
            displayArticle(tabAffiche[i], sortirJson._color, key)
            if (i == localStorage.length - 1) {
                suppression()
                valueQuantity()
                changement()
                ContactCheck()
            }
        }
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

function suppression() {
    var elements = document.getElementsByClassName("deleteItem");

    var myFunction = function() {
        var attribute = this.getAttribute("id");
        var test = ":" + attribute
        var element = document.getElementById(test);
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }
        document.getElementById(test).remove();
        localStorage.removeItem(attribute);
        valueQuantity();
    };

    for (var i = 0; i < elements.length; i++) {
        elements[i].addEventListener('click', myFunction, false);
    }
}

async function valueQuantity() {
    var quantity = 0;
    var money = 0;
    for (var i = 0; i < localStorage.length; i++) {
        let key = localStorage.key(i);
        let sortir = localStorage.getItem(key);
        let sortirJson = JSON.parse(sortir);
        let quantityNb = parseInt(sortirJson._quantity);
        let adresse = "http://localhost:3000/api/products/" + sortirJson._id;
        const article = await getArticle(adresse);
        console.log(article)
        quantity += quantityNb;
        money += article.price * quantityNb;
    }
    var balise = document.getElementById('totalQuantity').innerHTML;
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

function changement() {
    var elements = document.getElementsByClassName("itemQuantity");

    var myFunction = function() {
        var attribute = this.getAttribute("data-id");
        var concat = '_' + attribute;
        var valQuantity = document.getElementById(concat).value;
        console.log(valQuantity)
        let sortir = localStorage.getItem(attribute);
        let sortirJson = JSON.parse(sortir);
        sortirJson._quantity = valQuantity;
        console.log(sortirJson)
        localStorage.removeItem(attribute);
        let tableauString = JSON.stringify(sortirJson);
        localStorage.setItem(attribute, tableauString);
        console.log(localStorage)
        valueQuantity();
    };

    for (var i = 0; i < elements.length; i++) {
        elements[i].addEventListener('change', myFunction, false);
    }
}

function ContactCheck() {
    const order = document.getElementById('order');
    order.addEventListener('click', function() {
        var firstName = document.getElementById('firstName').value;
        var firstNameIsValide = validationFirstName(firstName);
        var lastName = document.getElementById('lastName').value;
        var lastNameIsValide = validationLastName(lastName);
        var adresse = document.getElementById('address').value;
        var adresseIsValide = validationAdresse(adresse);
        var city = document.getElementById('city').value;
        var cityIsValide = validationCity(city);
        var email = document.getElementById('email').value;
        var emailIsValide = validationMail(email);
        var store = localStorage.length
        if (firstNameIsValide === true && lastNameIsValide === true) {
            if (adresseIsValide === true && cityIsValide === true) {
                if (emailIsValide === true && store != 0) {
                    postReservaiton(firstName, lastName, adresse, city, email);
                    return (0);
                }
                return (0)
            }
            return (0)
        }
        if (store === 0) {
            alert("Votre commande est vide, merci de bien vouloir remplir votre panier")
        }
    });
}

function validationMail(value) {
    var verif = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9-]{2,}[.][a-zA-Z]{2,3}$/ ;
    if (verif.exec(value) == null) {
        alert("Votre email est incorrecte");
        return false;
    }
    else {
        return true;
    }	
}

function validationFirstName(value) {
    var verif = /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u ;
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
    var verif = /^[a-zA-Z0-9\s,.'-]{3,}$/ ;
    if (verif.exec(value) == null) {
        alert("Votre Adresse est incorrecte");
        return false;
    }
    else {
        return true;
    }
}

function postReservaiton(first, last, adresse1, ville, mail) {
    let contact = {
        firstName: first,
        lastName: last,
        adresse: adresse1,
        city: ville,
        email: mail
    }
    let produitCommande = [];
    var i = 0;
    while (i < localStorage.length) {
        let key = localStorage.key(i);
        produitCommande[i] = key;
        i++;
    }
    const aEnvoyer = {
        contact,
        produitCommande,
    }

    const promise = fetch("http://localhost:3000/api/products/order", {
	method: "POST",
    body: JSON.stringify(aEnvoyer),
	headers: { 
        'Accept': 'application/json', 
        'Content-Type': 'application/json' 
    },
    });
    promise.then(async(response)=> {
        try {
            const contenu = response.json;
            console.log("contenu")
            console.log(contenu)
        }
        catch(e) {
            console.log(e);
        }
    })
     
    /*const options = {
        method: 'POST',
        body: JSON.stringify(aEnvoyer),
        headers: {
            'Content-Type': 'application/json'
        }
    }
     
    fetch('http://localhost:3000/api/products/order', options)
        .then(res => res.json())
        .then(res => console.log(res));

    axios.post("http://localhost:3000/api/products/order", {"body": JSON.stringify(aEnvoyer)}, {headers: {'Content-Type': 'application/json'}})
        .then(function(res){
            console.log(res)
        })
        .catch(function(err){
            console.log(err)
        })*/
}
