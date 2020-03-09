let model = require('../models/login.js');
let Cryptr = require('cryptr');
let cryptr = new Cryptr('MaSuperCléDeChiffrementDeouF');

let async=require('async');
// ////////////////////////  L I S T E R     C I R C U I T S

module.exports.Connexion = function(request, response){
response.title = 'Liste des circuits';
let login = request.body.login;
let mdp = request.body.mdp;
let mdp = cryptr.decrypt(mdp);
 model.getConnexion(login,mdp, function (err, result) {
     if (err) {
         // gestion de l'erreur
         console.log(err);
         return;
     }
     response.listeCircuit = result;
     //console.log(result);
response.render('main', response);
});
}