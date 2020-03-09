let model = require('../models/circuit.js');
let async=require('async');
// ////////////////////////  L I S T E R     C I R C U I T S

module.exports.ListerCircuit = function(request, response){
response.title = 'Liste des circuits';
 model.getListeCircuit( function (err, result) {
     if (err) {
         // gestion de l'erreur
         console.log(err);
         return;
     }
     response.listeCircuit = result;
     //console.log(result);
response.render('listerCircuit', response);
});
}
/*
module.exports.DetailCircuit = function(request, response){
response.title = 'Détails des circuits';
  let data = request.params.cirnum;
 model.getDetailCircuit(data, function (err, result) {
     if (err) {
         // gestion de l'erreur
         console.log(err);
         return;
     }
     response.detailCircuit = result;
     //console.log(result);
response.render('detaillerCircuit', response);
});
*/

module.exports.DetailCircuit = function(request, response){
    let data = request.params.cirnum;
    response.title = 'Détails du circuit de '+ data;

    async.parallel([
        function(callback){
            model.getListeCircuit(function (err, result) {callback(null,result) });
            //pour afficher à nouveau les premères lettres des pilotes

        }, // fin callback0
        function (callback){
            model.getDetailCircuit(data, (function (errCir, resultCir) {callback(null,resultCir) }));
        }, //fin callback 1
    ],
    function (err,result){
        if (err) {
            // gestion de l'erreur
            console.log(err);
            return;
        }
        response.listeCircuit = result[0];

        donnees=result[1];

        response.detailCircuit=donnees;
        response.render('detaillerCircuit', response);
        }
    );// fin async

 };
