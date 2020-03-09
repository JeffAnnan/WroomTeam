let async=require('async');
let model = require('../models/pilote.js');

// ///////////////////////// R E P E R T O I R E    D E S    P I L O T E S

module.exports.Repertoire = function(request, response){
   response.title = 'Répertoire des pilotes';
   model.getLettrePilote( function (err, result) {
       if (err) {
           // gestion de l'erreur
           console.log(err);
           return;
       }
       response.listeLettrePilote = result;
       //console.log(result);

      response.render('repertoirePilotes', response);
  } );
}

module.exports.DetailRepertoire = function(request, response){
    let data = request.params.lettre;
    response.title = 'Pilote dont le nom commence par' + data;
    async.parallel([
        function(callback){
            model.getLettrePilote(function (err, result) {callback(null,result) });
            //pour afficher à nouveau les premères lettres des pilotes

        }, // fin callback0
        function (callback){
            model.getInfoPilote(data, (function (errPil, resultPil) {callback(null,resultPil) }));
        }, //fin callback 1
    ],
    function (err,result){
        if (err) {
            // gestion de l'erreur
            console.log(err);
            return;
        }
        response.listeLettrePilote = result[0];

        donnees=result[1];
        /*
        for (let i=1; 1<donnees.length; i++) {
            if (i%3==0) {
                donnees[i].ligne="1";
            }//fin if
        }//fin for
        */
        response.listeInfoPilote=donnees;
        response.render('repertoireInfoPilotes', response);
        }
    );// fin async

 };


 module.exports.DetailInfoPilote = function(request, response){
    response.title = 'Détail des infos des pilotes';
    let data = request.params.pilnum;
    async.parallel([
        function(callback){
            model.getLettrePilote(function (err, result) {callback(null,result) });
            //pour afficher à nouveau les premères lettres des pilotes

        }, // fin callback0
        function (callback){
            model.getInfoDetailPilote(data, (function (errPil, resultPil) {callback(null,resultPil) }));
        }, //fin callback 1
        function (callback){
            model.getSponsors(data, (function (errSp, resultSp) {callback(null,resultSp) }));
        }, //fin callback 2
        function (callback){
            model.getPhoto(data, (function(errPh, resultPh){callback (null,resultPh)}));
        }
    ],
    function (err,result){
        if (err) {
            // gestion de l'erreur
            console.log(err);
            return;
        }
        response.listeLettrePilote = result[0];
        response.listeInfoPilote=result[1];
        response.listeSponsors=result[2];
        response.listePhotos=result[3];

        response.render('repertoireInfoDetailPilotes', response);
        }
    );// fin async
 };
