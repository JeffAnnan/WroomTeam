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

 module.exports.ModifCircuit = function(request, response){
   /*
     response.title = 'modifier un circuit';
     let data = request.params.cirnum;
     model.getInfoCircuitSelect(data, function (err, result) {
         if (err) {
             // gestion de l'erreur
             console.log(err);
             return;
         }
         response.listeInfoCircuitSelect = result;
         //console.log(result);

         response.render('modifCircuit', response);
     } );
*/
     response.title = 'modifier un circuit';
     let data = request.params.cirnum;
     //console.log(data);
     async.parallel([
         function(callback){
             model.getInfoCircuitSelect(data, (function (err, result) {callback(null,result) }));
             //pour récupérer les information du circuit sélectionné
         }, // fin callback0
         function (callback){
             model.getListePays((function (errPays, resultPays) {callback(null,resultPays) }));
         }, //fin callback 1
     ],
     function (err,result){
         if (err) {
             // gestion de l'erreur
             console.log(err);
             return;
         }
         response.listeInfoCircuitSelect = result[0];
         response.listePays = result[1];
         //console.log(result[0]);
         response.render('modifCircuit', response);
         }
     );// fin async
  };

  module.exports.FinModifCircuit = function(request, response){
     response.title = 'Circuit modifié';
     let data = request.body.cirnom;
     let data1 = request.body.cirlongueur;
     let data2 = request.body.paynum;
     let data3 = request.body.ciradresseimage;
     let data4 = request.body.cirnbspectateurs;
     let data5 = request.body.cirtext;
     let data6 = request.params.cirnum;
     console.log(data, data1, data2, data3,data4, data5, data6);
     model.modifCircuit(data, data1, data2, data3,data4, data5, data6, function (err, result) {
         if (err) {
             // gestion de l'erreur
             console.log(err);
             return;
         }
         response.listeAjout = result;
         //console.log(result);

        response.render('finModifCircuit', response);
    } );
  };

  module.exports.SupprCircuit = function(request, response){
      response.title = 'supprimer un circuit';
      let data = request.params.cirnum;
      model.supprimerCircuit(data, function (err, result) {
          if (err) {
              // gestion de l'erreur
              console.log(err);
              return;
          }
          response.circuitSuprime = result;
          //console.log(result);

          response.render('finSuppressionCircuit', response);
      } );
   };
