let model = require('../models/ecurie.js');
let modelCircuit = require('../models/circuit.js');
let async=require('async');

// //////////////////////////G E S T I O N   D E S  E C U R I E S
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

// //////////////////////////A J O U T    D E S  E C U R I E S
module.exports.AjoutEcurie = function(request, response){
    response.title = 'ajouter une ecurie';
    //pour afficher la liste des pays
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
/**Insertion dans la base de donnees des informations saisies de l'ecurie**/
 module.exports.FinAjoutEcurie = function(request, response){
    response.title = 'Ecurie ajoutée';
    let req = request;
    let res = response;

    model.setEcurie(req, res, function (err, result) {
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

 // ///////////////////////// M O D I F I C A T I O N   D E S   E C U R I E S
 module.exports.ModifEcurie = function(request, response){
     response.title = 'modifier une ecurie';
     let ecunum = request.params.ecunum;
     let paynum = request.params.paynum;

     async.parallel([
         function(callback){
             model.getInfoEcurieSelect(ecunum, (function (err, result) {callback(null,result) }));
             //pour récupérer les informations de l'écurie sélectionnée
         }, // fin callback0
         function (callback){
             model.getListePaysMemeQueEcurieSelect(paynum, (function (errPays, resultPays) {callback(null,resultPays) }));
             //pour recuperer une requete indiquant si le pays de l'ecurie selectionnee est le meme que l'un des pays passe
             //en revue dans la liste de l'ensemble des pays existant en BD.
             //Cela permet pour chaque pays passe en revue de rendre 1 (true) ou 0 (false)
             //et ainsi pre-selectionner un pays (celui de l'ecurie en question) dans le menu deroulant
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
         response.render('modifEcurie', response);
         }
     );// fin async
  };
  /**Update dans la base de donnees des informations saisies et modifiees de l'ecurie**/
  module.exports.FinModifEcurie = function(request, response){
     response.title = 'Ecurie modifiée';
     let ecunum = request.params.ecunum;
     let ecunom = request.body.ecunom;
     let ecunomdir = request.body.ecunomdir;
     let ecuadrsiege = request.body.ecuadrsiege;
     let ecupoints = request.body.ecupoints;
     let paynum = request.body.paynum;

     model.modifEcurie(ecunum, ecunom, ecunomdir, ecuadrsiege, ecupoints, paynum, function (err, result) {
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

// ///////////////////////// S U P P R E S S I O N   D E S   E C U R I E S
  module.exports.SupprEcurie = function(request, response){
      response.title = 'supprimer une ecurie';
      let ecunum = request.params.ecunum;
      model.supprimerEcurie(ecunum, function (err, result) {
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
