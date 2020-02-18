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
/*
    model.getInfoPilote(data, function (err, result) {
        if (err) {
            // gestion de l'erreur
            console.log(err);
            return;
        }
        response.listeInfoPilote = result;
        //console.log(result);

       response.render('repertoireInfoPilotes', response);
   } );
   */
 };

 module.exports.DetailInfoPilote = function(request, response){
    response.title = 'Détail des infos des pilotes';
    let data = request.params.pilnum;
    model.getInfoDetailPilote(data, function (err, result) {
        if (err) {
            // gestion de l'erreur
            console.log(err);
            return;
        }
        response.infoDetailPilote = result;
        //console.log(result);

       response.render('repertoireInfoDetailPilotes', response);
   } );


 }
