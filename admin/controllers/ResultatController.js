let model = require('../models/resultat.js');
let async=require('async');
  // //////////////////////////G E S T I O N   D E S   R E S U L T A T S
  module.exports.Resultat = function(request, response){
	response.title = 'Gestion des résultats';
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

  // //////////////////////////S A I S I E   D E S   R E S U L T A T S
 module.exports.SaisieResultat = function(request, response){
    response.title = 'Saisie des resultats';
    let data = request.query.gpnum;
    async.parallel([
        function(callback){
            model.getTableauResultat(data,(function (err, result) {callback(null,result) }));
            //pour afficher les informations à rentrer dans le tableau des résultats
        }, // fin callback0
        function (callback){
            model.getCountLigne(data,(function (errPil, resultPil) {callback(null,resultPil) }));
            // pour compter les lignes du tableau
        }, //fin callback 1
        function (callback){
            model.getPiloteCourse(data,(function (errPil, resultPil) {callback(null,resultPil) }));
            // pilotes non rentrés -- pour réaliser le sélect afin d'insérer une ligne
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
        response.render('ajoutResultat', response);
        }
    );// fin async
 };

  // //////////////////////////S U P P R E S S I O N   D E S   R E S U L T A T S

 module.exports.SupprimerResultat = function(request, response){
    response.title = 'Supprimer des résultats';
    let pilnum = request.params.pilnum;
    let gpnum = request.params.gpnum;
    //suppression
	 model.deleteResultat(gpnum,pilnum, function (err, result) {
		 if (err) {
			 // gestion de l'erreur
			 console.log(err);
			 return;
		 }
		 //console.log(result);
 response.render('finSuppressionResultat', response);
 });
 }

  // //////////////////////////A J O U T   D E S   R E S U L T A T S

 module.exports.AjoutResultat = function(request, response){
    response.title = 'Ajout de résultats';
    let pilnum = request.body.pilnum;
    let tempscourse = request.body.tempscourse;
    let gpnum = request.params.gpnum;
    // insertion 
	 model.ajoutResultat(gpnum,pilnum,tempscourse, function (err, result) {
		 if (err) {
			 // gestion de l'erreur
			 console.log(err);
			 return;
		 }
		 //console.log(result);
 response.render('finAjoutResultat', response);
 });
 }
