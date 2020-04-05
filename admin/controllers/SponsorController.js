let model = require('../models/sponsor.js');
let async=require('async');

// ///////////////////////// G E S T I O N   D E S   S P O N S O R S
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

// ///////////////////////// A J O U T    D E S   S P O N S O R S
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
/**Insertion dans la base de donnees des informations saisies du sponsor**/
 module.exports.FinAjoutSponsor = function(request, response){
   response.title = 'Sponsor ajoutée';
   let data = request.body;
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

// ///////////////////////// M O D I F I C A T I O N   D E S   S P O N S O R S
 module.exports.ModifSponsor = function(request, response){
     response.title = 'modifier un sponsor';
     let sponum = request.params.sponum;
     let ecunum = request.params.ecunum;

     async.parallel([
         function(callback){
             model.getInfoSponsorSelect(sponum, ecunum, (function (err, result) {callback(null,result) }));
             //pour récupérer les informations du sponsor sélectionné
         }, // fin callback0
         function (callback){
             model.getListeEcurieMemeQueSponsorSelect(ecunum, (function (errPays, resultPays) {callback(null,resultPays) }));
             //pour recuperer une requete indiquant si l'ecurie du sponsor selectionne est la meme que l'une des ecuries passee
             //en revue dans la liste de l'ensemble des ecuries existant en BD.
             //Cela permet pour chaque ecurie passe en revue de rendre 1 (true) ou 0 (false)
             //et ainsi pre-selectionner une ecurie (celle du sponsor en question) dans le menu deroulant
         }, //fin callback 1
     ],
     function (err,result){
         if (err) {
             // gestion de l'erreur
             console.log(err);
             return;
         }
         response.listeInfoSponsorSelect = result[0];
         response.listeEcurieMemeQueSponsorSelect = result[1];
         response.render('modifSponsor', response);
         }
     );// fin async
  };
  /**Update dans la base de donnees des informations saisies et modifiees du sponsor**/
  module.exports.FinModifSponsor = function(request, response){
     response.title = 'Sponsor modifié';
     let sponom = request.body.sponom;
     let sposectactivite = request.body.sposectactivite;
     let ecunum = request.body.ecunum;
     let sponum = request.params.sponum;
     let ecunumAvantModif =request.params.ecunum;

     model.modifSponsor(sponom, sposectactivite, ecunum, sponum, ecunumAvantModif, function (err, result) {
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

// ///////////////////////// S U P P R E S S I O N   D E S   S P O N S O R S
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
