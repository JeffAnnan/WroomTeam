let model = require('../models/circuit.js');
let async=require('async');

// //////////////////////////G E S T I O N   D E S C I R C U I T S
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

// ///////////////////////// A J O U T    D E S   C I R C U I T S
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
/**Insertion dans la base de donnees des informations saisies du circuit**/
 module.exports.FinAjoutCircuit = function(request, response){
   response.title = 'Circuit ajouté';
   let req = request;
   let res = response;

   model.setCircuit(req, res, function (err, result) {
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

// ///////////////////////// M O D I F I C A T I O N   D E S   C I R C U I T S
 module.exports.ModifCircuit = function(request, response){
     response.title = 'modifier un circuit';
     let cirnum = request.params.cirnum;
     let paynum = request.params.paynum;
     async.parallel([
         function(callback){
             model.getInfoCircuitSelect(cirnum, (function (err, result) {callback(null,result) }));
             //pour récupérer les informations du circuit sélectionné
         }, // fin callback0
         function (callback){
             model.getListePaysMemeQueCircuitSelect(paynum, (function (errPays, resultPays) {callback(null,resultPays) }));
             //pour recuperer une requete indiquant si le pays du ciruit selectionne est le meme que l'un des pays passe
             //en revue dans la liste de l'ensemble des pays existant en BD.
             //Cela permet pour chaque pays passe en revue de rendre 1 (true) ou 0 (false)
             //et ainsi pre-selectionner un pays (celui du circuit en question) dans le menu deroulant
         }, //fin callback 1
     ],
     function (err,result){
         if (err) {
             // gestion de l'erreur
             console.log(err);
             return;
         }
         response.listeInfoCircuitSelect = result[0];
         response.listePaysMemeQueCircuitSelect = result[1];
         response.render('modifCircuit', response);
         }
     );// fin async
  };
  /**Update dans la base de donnees des informations saisies et modifiees du circuit**/
  module.exports.FinModifCircuit = function(request, response){
     response.title = 'Circuit modifié';
     let cirnom = request.body.cirnom;
     let cirlongueur = request.body.cirlongueur;
     let paynum = request.body.paynum;
     let cirnbspectateurs = request.body.cirnbspectateurs;
     let cirtext = request.body.cirtext;
     let cirnum = request.params.cirnum;
     model.modifCircuit(cirnom, cirlongueur, paynum, cirnbspectateurs, cirtext, cirnum, function (err, result) {
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

  // ///////////////////////// S U P P R E S S I O N   D E S   C I R C U I T S
  module.exports.SupprCircuit = function(request, response){
      response.title = 'supprimer un circuit';
      let cirnum = request.params.cirnum;
      model.supprimerCircuit(cirnum, function (err, result) {
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
