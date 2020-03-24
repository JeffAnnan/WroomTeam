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
						let sql ="SELECT cirnum, cirnom, cirlongueur, cirnbspectateurs FROM circuit ORDER BY cirlongueur";
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
						let sql ="SELECT DISTINCT p.paynum, p.paynom FROM circuit c INNER JOIN pays p on p.paynum = c.paynum ORDER BY p.paynom";
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
};

module.exports.getInfoCircuitSelect = function (cirnum,callback) {
	// connection à la base
	db.getConnection(function(err, connexion){
			 if(!err){
					// s'il n'y a pas d'erreur de connexion
					// execution de la requête SQL
					let sql ="SELECT cirnum, cirnom, cirlongueur, paynum, "+
					"ciradresseimage, cirnbspectateurs, cirnbspectateurs, cirtext "+
					"FROM circuit WHERE cirnum="+cirnum;
					//console.log (sql);
					 connexion.query(sql, callback);

					 // la connexion retourne dans le pool
					 connexion.release();
			}
	});
};

module.exports.modifCircuit = function (cirnom, cirlongueur, paynum, ciradresseimage, cirnbspectateurs, cirtext, cirnum, callback) {
   // connection à la base
    db.getConnection(function(err, connexion){
        if(!err){
					req="UPDATE circuit SET cirnom='"+cirnom+"', cirlongueur="+cirlongueur+
					", paynum="+paynum+", ciradresseimage='"+ciradresseimage+
					"', cirnbspectateurs="+cirnbspectateurs+", cirtext='"+cirtext+
					"' WHERE cirnum="+cirnum;
					console.log(req);
            connexion.query(req,callback);
            connexion.release();
        }
    });
};

module.exports.supprimerCircuit = function (cirnum, callback) {
   // connection à la base
	db.getConnection(function(err, connexion){
        if(!err){
        	  // s'il n'y a pas d'erreur de connexion
        	  // execution de la requête SQL
						let sql ="DELETE FROM circuit WHERE cirnum="+cirnum;
						//console.log (sql);
            connexion.query(sql, callback);

            // la connexion retourne dans le pool
            connexion.release();
         }
      });
};
