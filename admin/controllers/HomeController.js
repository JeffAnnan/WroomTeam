
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
// ////////////////////////  L I S T E R     C I R C U I T S

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
     let mdpDecrypte = cryptr.decrypt(result[0].passwd);

     if(mdpDecrypte==mdp && login==result[0].login){
        request.session.admin=true;
     }
     else
     {
       request.session.admin=false;
     }
     response.connexion = result;
     response.render('home', response);
});
}
