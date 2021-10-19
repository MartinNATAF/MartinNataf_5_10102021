let params = (new URL(document.location)).searchParams; //on récupère les paramètres de notre url.
var id = params.toString();  //on le convertie en une chaine de caractère (sinon on peut pas utiliser length, id serait un search params)
var newId = id.substring(0, id.length - 1); //on enlève le = à la finb du search params.
var balise = document.getElementById('orderId').innerHTML; 
if (balise != "") { //si il y'avais déja un numéro de commande on le supprime
    document.getElementById('orderId').innerHTML = "";
}
document.getElementById("orderId").innerHTML += `
    ${newId}
`
//on viens d'afficher notre nouvelle commande avec son numéro.
id = 0; //on modifie les valeurs pour ne rien stocké 
newId = 0; // même chose.