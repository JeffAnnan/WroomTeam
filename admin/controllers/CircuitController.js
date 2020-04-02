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
   let data1 = request;
   let data2 = response;

   model.insertFile(data1, data2, function (err, result) {
       if (err) {
           // gestion de l'erreur
           console.log(err);
           return;
       }
        response.listeAjout = result;
       //console.log(result);
       response.render('finAjoutCircuit', response);
   } );

/*
   response.title = 'Circuit ajouté';
   let data = request.body;
   let data1 = request;
   let data2 = response;

   async.parallel([
       function(callback){
           model.setCircuit(data, (function (err, result) {callback(null,result) }));
           //pour inserer dans la BD ce circuit
       }, // fin callback0
       function (callback){
           //insertion de l'image dans le dossier '../public/image/circuit/'
           model.insertFile(data1, data2, (function (errInsert, resultInsert) {callback(null,resultInsert) }));
       }, //fin callback 1
   ],
   function (err,result){
       if (err) {
           // gestion de l'erreur
           console.log(err);
           return;
       }
       response.listeAjout = result[0];
       //response.fichierImageInsere = result[1];
       //console.log(result[0]);
       response.render('finAjoutCircuit', response);
       }
   );// fin async



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
   */
 };

 module.exports.ModifCircuit = function(request, response){
     response.title = 'modifier un circuit';
     let data = request.params.cirnum;
     let data1 = request.params.paynum;
     async.parallel([
         function(callback){
             model.getInfoCircuitSelect(data, (function (err, result) {callback(null,result) }));
             //pour récupérer les information du circuit sélectionné
         }, // fin callback0
         function (callback){
             model.getListePaysMemeQueCircuitSelect(data1, (function (errPays, resultPays) {callback(null,resultPays) }));
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
     let data3 = request.body.ciradresseimageDefault;
     let data4 = request.body.ciradresseimageChangee;
     let data5 = request.body.cirnbspectateurs;
     let data6 = request.body.cirtext;
     let data7 = request.params.cirnum;
     //console.log(data, data1, data2, data3,data4, data5, data6, data7);
     model.modifCircuit(data, data1, data2, data3,data4, data5, data6, data7, function (err, result) {
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
