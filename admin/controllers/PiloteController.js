let async=require('async');
let model = require('../models/pilote.js');
let modelEcurie = require('../models/ecurie.js');

// ///////////////////////// R E P E R T O I R E    D E S    P I L O T E S

module.exports.Pilotes = function(request, response){
   response.title = 'Gestion des pilotes';
   model.getPilotes( function (err, result) {
       if (err) {
           // gestion de l'erreur
           console.log(err);
           return;
       }
       response.listePilotes = result;
       //console.log(result);

      response.render('gestionPilotes', response);
  } );
}

module.exports.AjoutPilote = function(request, response){
    response.title = 'ajouter un pilote';
    async.parallel([
        function(callback){
            modelEcurie.getListeEcurie(function (err, result) {callback(null,result) });
            //pour afficher à nouveau les premères lettres des pilotes 
        }, // fin callback0
        function (callback){
            model.getNationalite((function (errPil, resultPil) {callback(null,resultPil) })); 
        }, //fin callback 1
    ],
    function (err,result){
        if (err) {
            // gestion de l'erreur
            console.log(err);
            return;
        }
        response.listeEcurie = result[0];
        response.listeNationalite = result[1];
        response.render('ajoutPilote', response);
        }
    );// fin async
 };

 module.exports.FinAjoutPilote = function(request, response){
    response.title = 'Pilote ajouté';
    let data = request.body;
    model.setPilote(data, function (err, result) {
        if (err) {
            // gestion de l'erreur
            console.log(err);
            return;
        }
        response.listeAjout = result;
        //console.log(result);
 
       response.render('finAjoutPilote', response);
   } );
 }

 module.exports.ModifierPilote = function(request, response){
    response.title = 'modifier un pilote';
    let data = request.params.pilnum;
    async.parallel([
        function(callback){
            model.getInfoModif(data,(function (err, result) {callback(null,result) }));
            //pour afficher à nouveau les premères lettres des pilotes 
        }, // fin callback0
        function (callback){
            modelEcurie.getListeEcurie((function (errPil, resultPil) {callback(null,resultPil) })); 
        }, //fin callback 1
        function (callback){
            model.getNationalite((function (errPil, resultPil) {callback(null,resultPil) })); 
        }, //fin callback 2
    ],
    function (err,result){
        if (err) {
            // gestion de l'erreur
            console.log(err);
            return;
        }
        response.listeInfoModif = result[0];
        response.listeEcurie = result [1];
        response.listeNationalite = result [2];
        response.render('modifierPilote', response);
        }
    );// fin async
 };

 module.exports.FinModifierPilote = function(request, response){
    response.title = 'Pilote modifier';
    let pilnum = request.params.pilnum;
    let data = request.body;
    model.updatePilote(pilnum,data, function (err, result) {
        if (err) {
            // gestion de l'erreur
            console.log(err);
            return;
        }

 
       response.render('finModifPilote', response);
   } );
 }

 module.exports.SupprimerPilote = function(request, response){
    response.title = 'pilote supprimé';
    let pilnum = request.params.pilnum;
    model.deletePilote(pilnum, function (err, result) {
        if (err) {
            // gestion de l'erreur
            console.log(err);
            return;
        }
       response.render('supprimePilote', response);
   } );
 }
  


 