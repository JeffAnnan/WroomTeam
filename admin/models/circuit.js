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
						let sql ="SELECT cirnum, cirnom, paynum, cirlongueur, cirnbspectateurs FROM circuit ORDER BY cirlongueur";
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
						let sql ="SELECT paynum, paynom FROM pays ORDER BY paynom";
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

module.exports.getListePaysMemeQueCircuitSelect= function (paynumSelect, callback) {
   // connection à la base
	db.getConnection(function(err, connexion){
        if(!err){
        	  // s'il n'y a pas d'erreur de connexion
        	  // execution de la requête SQL
						let sql ="SELECT paynum, paynom, IF(paynum="+paynumSelect+",true,false)"
						+" AS estmeme FROM pays ORDER BY paynom";
						console.log (sql);
            connexion.query(sql, callback);

            // la connexion retourne dans le pool
            connexion.release();
         }
      });
};


module.exports.modifCircuit = function (cirnom, cirlongueur, paynum, ciradresseimageDefault, ciradresseimageChangee, cirnbspectateurs, cirtext, cirnum, callback) {
   // connection à la base
    db.getConnection(function(err, connexion){
        if(!err){
					//on prend soit le input hidden qui reprend l'image du circuit
					//si on desire changer d'image le secteur d'image charge une image,
					//il faut donc prendre cette valeur et pas le nom de l'image chargee par default
					//et qui correpond a l'image chargee lors de la creation du circuit
					let ciradresseimage;
					if (!ciradresseimageChangee=="") {
						//l'adresse de l'image est celle selctionnee par le selcteur
						ciradresseimage=ciradresseimageChangee
					}else {
						//l'adresse de l'image est celle chargee par default et saisie
						//lors de la creation du circuit
						ciradresseimage=ciradresseimageDefault
					}
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
