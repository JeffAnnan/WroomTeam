let model = require('../models/resultat.js'); 
let async=require('async');
  // //////////////////////////L I S T E R    R E S U L T A T S
  module.exports.ListerResultat = function(request, response){
	response.title = 'Liste des résultats';
	 model.getListeGrandPrix( function (err, result) {
		 if (err) {
			 // gestion de l'erreur
			 console.log(err);
			 return;
		 }
		 response.listeGrandPrix = result;
		 //console.log(result);
 response.render('listerResultat', response);
 });
 }

 module.exports.DetailResultat = function(request, response){
    let data = request.params.gpnum;
    response.title = 'Détails du grand prix de '+ data;
    async.parallel([
        function(callback){
            model.getListeGrandPrix(function (err, result) {callback(null,result) });
            //pour afficher à nouveau les premères lettres des pilotes

        }, // fin callback0
        function (callback){
            model.getTitreResultat(data, (function (errRes, resultRes) {callback(null,resultRes) }));
        }, //fin callback 1
        function (callback){
            model.getTableauResultat(data, (function (errTab, resultTab) {callback(null,resultTab) }));
        }, //fin callback 1
    ],
    function (err,result){
        if (err) {
            // gestion de l'erreur
            console.log(err);
            return;
        }
    
        response.listeGrandPrix = result[0];
        response.listeTitre = result[1];
        response.listeTableau = result[2];
        response.render('detailResultat', response);
        }
    );// fin async

 };

