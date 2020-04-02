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
    let data = request.body.nom;
    console.log(data);
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
 };
