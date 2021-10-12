(async function () {
    afficherPagner()
})()

function afficherPagner () {
    var test = localStorage
    console.log(test)
    if (size != 0)
        for (item of localStorage) {
            let sortir = localStorage(item);
            let sortirJson = JSON.parse(sortir);
            console.log(sortirJson);
            item++;
        }
        else {
            return (0);
        }
}