
  // ////////////////////////////////////////////// A C C U E I L
module.exports.Index = function(request, response){
    response.title = "Bienvenue sur le site de WROOM (IUT du Limousin).";
    response.render('home', response);
};
module.exports.NotFound = function(request, response){
    response.title = "Bienvenue sur le site de SIXVOIX (IUT du Limousin).";
    response.render('notFound', response);
};

let model = require('../models/login.js');
let Cryptr = require('cryptr');
let cryptr = new Cryptr('MaSuperCléDeChiffrementDeouF');

let async=require('async');
// ////////////////////////  C O N N E X I O N 

module.exports.Connexion = function(request, response){
response.title = 'Connexion';
let login = request.body.login; 
let mdp = request.body.mdp;
 model.getConnexion(login, function (err, result) {
     if (err) {
         // gestion de l'erreur
         console.log(err);
         return;
     }
     let mdpDecrypte = cryptr.decrypt(result[0].passwd); // On décrypte le mot de passe correspondant à l'utilisateur saisi de la bd

     if(mdpDecrypte==mdp && login==result[0].login){ // Si le mot de passe saisi correspond à celui décrypté de la bd 
        request.session.admin=true; // connexion possible -- admin = true
     }
     else
     {
       request.session.admin=false; // sinon connexion impossible -- admin = false
     }
     response.connexion = result;
     response.render('home', response);
});
}
