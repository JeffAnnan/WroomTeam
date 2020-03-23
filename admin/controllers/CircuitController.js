let model = require('../models/circuit.js');
let async=require('async');
// ///////////////////////// R E P E R T O I R E    D E S    C I R C U I T S

module.exports.Circuits = function(request, response){
  response.title = 'Gestion des circuits';
     model.getCircuits( function (err, result) {
         if (err) {
             // gestion de l'erreur
             console.log(err);
             return;
         }
         response.listeCircuits = result;
         //console.log(result);

         response.render('gestionCircuits', response);
    } );
};

module.exports.AjoutCircuit = function(request, response){
    response.title = 'ajouter un circuit';
    model.getListePays(function (err, result) {
        if (err) {
            // gestion de l'erreur
            console.log(err);
            return;
        }
        response.listePays = result;
        //console.log(result);

        response.render('ajoutCircuit', response);
    } );
 };

 module.exports.FinAjoutCircuit = function(request, response){
    response.title = 'Circuit ajouté';
    let data = request.body;
    model.setCircuit(data, function (err, result) {
        if (err) {
            // gestion de l'erreur
            console.log(err);
            return;
        }
        response.listeAjout = result;
        //console.log(result);

       response.render('finAjoutCircuit', response);
   } );
 };
