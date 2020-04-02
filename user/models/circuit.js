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
module.exports.getListeCircuit = function (callback) {
   // connection à la base
	db.getConnection(function(err, connexion){
        if(!err){
        	  // s'il n'y a pas d'erreur de connexion
        	  // execution de la requête SQL
						let sql ="SELECT cirnum, payadrdrap, cirnom FROM " +
                            "circuit c INNER JOIN pays p ";
						sql= sql + "ON p.paynum=c.paynum ORDER BY cirnom";
						//console.log (sql);
            connexion.query(sql, callback);

            // la connexion retourne dans le pool
            connexion.release();
         }
      });
};

/*
* Récupérer l'intégralité des details des circuits.
* @return Un tableau qui contient le nom, la Longueur, le nombre de spectateurs, la description, l'adresse de la photo du ciruitn le pays
*/

module.exports.getDetailCircuit = function (cirnum, callback) {
   // connection à la base
	db.getConnection(function(err, connexion){
        if(!err){
        	  // s'il n'y a pas d'erreur de connexion
        	  // execution de la requête SQL
						let sql ="SELECT cirnom, cirlongueur, cirnbspectateurs, cirtext, ciradresseimage, p.paynom FROM " +
                            "circuit c INNER JOIN pays p ";
						sql= sql + "ON p.paynum=c.paynum where cirnum="+cirnum;
						//console.log (sql);
            connexion.query(sql, callback);

            // la connexion retourne dans le pool
            connexion.release();
         }
      });
};
