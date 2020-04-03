let model = require('../models/resultat.js'); 
let async=require('async');
  // //////////////////////////L I S T E R    R E S U L T A T S
  module.exports.Resultat = function(request, response){
	response.title = 'Liste des résultats';
	 model.getListeGrandPrix( function (err, result) {
		 if (err) {
			 // gestion de l'erreur
			 console.log(err);
			 return;
		 }
		 response.listeGrandPrix = result;
		 //console.log(result);
 response.render('gestionResultat', response);
 });
 }

 module.exports.SaisieResultat = function(request, response){
    response.title = 'Saisie resultats';
    let data = request.query.gpnum;
    async.parallel([
        function(callback){
            model.getTableauResultat(data,(function (err, result) {callback(null,result) }));
            //pour afficher à nouveau les premères lettres des pilotes 
        }, // fin callback0
        function (callback){
            model.getCountLigne(data,(function (errPil, resultPil) {callback(null,resultPil) })); 
        }, //fin callback 1
        function (callback){
            model.getPiloteCourse(data,(function (errPil, resultPil) {callback(null,resultPil) })); 
        }, //fin callback 2
    ],
    function (err,result){
        if (err) {
            // gestion de l'erreur
            console.log(err);
            return;
        }
        response.listeTableau = result[0];
        response.listeLigne = result[1];
        response.listePilotes = result[2];
        response.render('saisieResultat', response);
        }
    );// fin async
 };

 module.exports.SupprimerResultat = function(request, response){
    response.title = 'Supprimer des résultats';
    let pilnum = request.params.pilnum;
    let gpnum = request.params.gpnum;
    console.log(gpnum);
	 model.deleteResultat(gpnum,pilnum, function (err, result) {
		 if (err) {
			 // gestion de l'erreur
			 console.log(err);
			 return;
		 }
		 //console.log(result);
 response.render('suppResultat', response);
 });
 }

 module.exports.AjoutResultat = function(request, response){
    response.title = 'Ajout de résultats';
    let pilnum = request.body.pilnum;
    let tempscourse = request.body.tempscourse;
    let gpnum = request.params.gpnum;
    console.log(gpnum);
	 model.ajoutResultat(gpnum,pilnum,tempscourse, function (err, result) {
		 if (err) {
			 // gestion de l'erreur
			 console.log(err);
			 return;
		 }
		 //console.log(result);
 response.render('ajoutResultat', response);
 });
 }

