let model = require('../models/sponsor.js');
let async=require('async');
// ///////////////////////// R E P E R T O I R E    D E S   S P O N S O R S

module.exports.Sponsors = function(request, response){
  response.title = 'Gestion des sponsors';
     model.getSponsors( function (err, result) {
         if (err) {
             // gestion de l'erreur
             console.log(err);
             return;
         }
         response.listeSponsors = result;
         //console.log(result);

         response.render('gestionSponsors', response);
    } );
};

module.exports.AjoutSponsor = function(request, response){

    response.title = 'ajouter un sponsor';
    model.getListeEcuries(function (err, result) {
        if (err) {
            // gestion de l'erreur
            console.log(err);
            return;
        }
        response.listeEcuries = result;
        //console.log(result);

        response.render('ajoutSponsor', response);
    } );

 };

 module.exports.FinAjoutSponsor = function(request, response){
   response.title = 'Sponsor ajoutée';
   let data = request.body;
console.log(data);
   model.setSponsor(data, function (err, result) {
       if (err) {
           // gestion de l'erreur
           console.log(err);
           return;
       }
       response.listeAjout = result;
       //console.log(result);

      response.render('finAjoutSponsor', response);
  } );
 };

 module.exports.ModifSponsor = function(request, response){
     response.title = 'modifier un sponsor';
     let data = request.params.sponum;
     let data1 = request.params.ecunum;


     async.parallel([
         function(callback){
             model.getInfoSponsorSelect(data, data1, (function (err, result) {callback(null,result) }));
             //pour récupérer les informations du sponsor sélectionné
         }, // fin callback0
         function (callback){
             model.getListePaysMemeQueSponsorSelect(data1, (function (errPays, resultPays) {callback(null,resultPays) }));
         }, //fin callback 1
     ],
     function (err,result){
         if (err) {
             // gestion de l'erreur
             console.log(err);
             return;
         }
         response.listeInfoSponsorSelect = result[0];
         response.listePaysMemeQueSponsorSelect = result[1];
         //console.log(result[0]);
         response.render('modifSponsor', response);
         }
     );// fin async
  };

  module.exports.FinModifSponsor = function(request, response){
     response.title = 'Sponsor modifié';
     let data = request.body.sponom;
     let data1 = request.body.sposectactivite;
     let data2 = request.body.ecunum;
     let data3 = request.params.sponum;
     let data4 =request.params.ecunum;
     //console.log(data, data1, data2, data3);
     model.modifSponsor(data, data1, data2, data3, data4, function (err, result) {
         if (err) {
             // gestion de l'erreur
             console.log(err);
             return;
         }
         response.listeAjout = result;
         //console.log(result);

        response.render('finModifSponsor', response);
    } );
  };

  module.exports.SupprSponsor = function(request, response){
      response.title = 'supprimer un sponsor';
      let data = request.params.sponum;
      model.supprimerSponsor(data, function (err, result) {
          if (err) {
              // gestion de l'erreur
              console.log(err);
              return;
          }
          response.sponsorSuprime = result;
          //console.log(result);

          response.render('finSuppressionSponsor', response);
      } );
   };
