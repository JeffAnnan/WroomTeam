let model = require('../models/ecurie.js');
let modelCircuit = require('../models/circuit.js');
let async=require('async');

   // //////////////////////// L I S T E R  E C U R I E S

module.exports.ListerEcurie = function(request, response){
   response.title = 'Liste des écuries';
    model.getListeEcurie( function (err, result) {
        if (err) {
            // gestion de l'erreur
            console.log(err);
            return;
        }
        response.listeEcuries = result;
        //console.log(result);
    response.render('gestionEcuries', response);
});
}

module.exports.AjoutEcurie = function(request, response){
    response.title = 'ajouter une ecurie';
    modelCircuit.getListePays(function (err, result) {
        if (err) {
            // gestion de l'erreur
            console.log(err);
            return;
        }
        response.listePays = result;
        //console.log(result);

        response.render('ajoutEcurie', response);
    } );
 };

 module.exports.FinAjoutEcurie = function(request, response){
    response.title = 'Ecurie ajoutée';
    let data = request.body;
    model.setEcurie(data, function (err, result) {
        if (err) {
            // gestion de l'erreur
            console.log(err);
            return;
        }
        response.listeAjout = result;
        //console.log(result);

       response.render('finAjoutEcurie', response);
   } );
 };

 module.exports.ModifEcurie = function(request, response){
     response.title = 'modifier une ecurie';
     let data = request.params.ecunum;
     let data1 = request.params.paynum;

     async.parallel([
         function(callback){
             model.getInfoEcurieSelect(data, (function (err, result) {callback(null,result) }));
             //pour récupérer les information de l'écurie sélectionné
         }, // fin callback0
         function (callback){
             model.getListePaysMemeQueEcurieSelect(data1, (function (errPays, resultPays) {callback(null,resultPays) }));
         }, //fin callback 1
     ],
     function (err,result){
         if (err) {
             // gestion de l'erreur
             console.log(err);
             return;
         }
         response.listeInfoEcurieSelect = result[0];
         response.listePaysMemeQueEcurieSelect = result[1];
         //console.log(result[0]);
         response.render('modifEcurie', response);
         }
     );// fin async
  };

  module.exports.FinModifEcurie = function(request, response){
     response.title = 'Ecurie modifiée';
     let data = request.params.ecunum;
     let data1 = request.body.ecunom;
     let data2 = request.body.ecunomdir;
     let data3 = request.body.ecuadrsiege;
     let data4 = request.body.ecupoints;
     let data5 = request.body.paynum;
     let data6 = request.body.ecuadresseimageDefault;
     let data7 = request.body.ecuadresseimageChangee;

     //console.log(data, data1, data2, data3,data4, data5, data6, data7);
     model.modifEcurie(data, data1, data2, data3,data4, data5, data6, data7, function (err, result) {
         if (err) {
             // gestion de l'erreur
             console.log(err);
             return;
         }
         response.listeAjout = result;
         //console.log(result);

        response.render('finModifEcurie', response);
    } );
  };

  module.exports.SupprEcurie = function(request, response){
      response.title = 'supprimer une ecurie';
      let data = request.params.ecunum;
      model.supprimerEcurie(data, function (err, result) {
          if (err) {
              // gestion de l'erreur
              console.log(err);
              return;
          }
          response.ecurieSuprimee = result;
          //console.log(result);

          response.render('finSuppressionEcurie', response);
      } );
   };
