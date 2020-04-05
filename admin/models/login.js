let db = require('../configDb');

// Récupère le login et le mdp selon l'utilisateur entré
module.exports.getConnexion = function (login,callback) {
    // connection à la base
     db.getConnection(function(err, connexion){
         if(!err){
               // s'il n'y a pas d'erreur de connexion
               // execution de la requête SQL
                         let sql = "SELECT login, passwd FROM login WHERE login='"+login+"'";
                         //console.log (sql);
             connexion.query(sql, callback);
 
             // la connexion retourne dans le pool
             connexion.release();
          }
       });
 };