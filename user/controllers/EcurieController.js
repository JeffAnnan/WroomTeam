let model = require('../models/ecurie.js');
let async=require('async');

   // //////////////////////// L I S T E R  E C U R I E S
module.exports.ListerEcurie = function(request, response){
   response.title = 'Liste des écuries';
    model.getListeEcurie( function (err, result) {
        if (err) {
            // gestion de l'erreur
            console.log(err);
            return;
        }
        response.listeEcurie = result;
        //console.log(result);
response.render('listerEcurie', response);
});
}

   // //////////////////////// D E T A I L S  E C U R I E S
module.exports.DetailEcurie = function(request, response){
    let data = request.params.ecunum;
    response.title = 'Détails de l\'ecurie N°'+ data;

    async.parallel([
        function(callback){
            model.getListeEcurie(function (err, result) {callback(null,result) });
            //pour afficher à nouveau les ecuries
        }, // fin callback0
        function (callback){
            model.getDetailEcurie(data, (function (errEcu, resultEcu) {callback(null,resultEcu) }));
            //pour afficher les informations de l'ecurie (le detail de l'ecurie selectionnee)
        }, //fin callback 1
        function (callback){
            model.participeChampionnat(data, (function (errEcu, resultEcu) {callback(null,resultEcu) }));
            //pour retourner une requete indiquant les pilotes de l'ecurie donc si elle participe au championnat
        }, //fin callback 2
        function (callback){
            model.getInfoVoitureEcurieParticipeChampionnat(data, (function (errEcu, resultEcu) {callback(null,resultEcu) }));
            //pour retourner les voiture des ecuries et leurs informations 
        }, //fin callback 3
    ],
    function (err,result){
        if (err) {
            // gestion de l'erreur
            console.log(err);
            return;
        }
        response.listeEcurie = result[0];
        response.detailEcurie=result[1];
        response.detailEcuriePilote=result[2];
        response.detailEcurieVoiture=result[3];
        response.render('detaillerEcurie', response);
        }
    );// fin async

 };
