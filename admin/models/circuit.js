/*
* config.Db contient les parametres de connection à la base de données
* il va créer aussi un pool de connexions utilisables
* sa méthode getConnection permet de se connecter à MySQL
*
*/

let db = require('../configDb');

/*
* Récupérer l'intégralité des circuits avec l'adresse de la photo du pays du circuit
* @return Un tableau qui contient le N°, le nom du circuitn  et le nom de la photo du drapeau du pays
*/
module.exports.getCircuits = function (callback) {
   // connection à la base
	db.getConnection(function(err, connexion){
        if(!err){
        	  // s'il n'y a pas d'erreur de connexion
        	  // execution de la requête SQL
						let sql ="SELECT cirnom, cirlongueur, cirnbspectateurs FROM circuit ORDER BY cirlongueur";
						//console.log (sql);
            connexion.query(sql, callback);

            // la connexion retourne dans le pool
            connexion.release();
         }
      });
};

module.exports.getListePays = function (callback) {
   // connection à la base
	db.getConnection(function(err, connexion){
        if(!err){
        	  // s'il n'y a pas d'erreur de connexion
        	  // execution de la requête SQL
						let sql ="SELECT p.paynum, p.paynom FROM circuit c INNER JOIN pays p on p.paynum = c.paynum ORDER BY p.paynom";
						//console.log (sql);
            connexion.query(sql, callback);

            // la connexion retourne dans le pool
            connexion.release();
         }
      });
};

module.exports.setCircuit = function (data,callback) {
   // connection à la base
    db.getConnection(function(err, connexion){
        if(!err){
            connexion.query('INSERT INTO circuit SET ? ',data,callback);
            connexion.release();
        }
    });
}
