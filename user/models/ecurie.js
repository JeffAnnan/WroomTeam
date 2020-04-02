/*
* config.Db contient les parametres de connection à la base de données
* il va créer aussi un pool de connexions utilisables
* sa méthode getConnection permet de se connecter à MySQL
*
*/

let db = require('../configDb');

/*
* Récupérer l'intégralité les écuries avec l'adresse de la photo du pays de l'écurie
* @return Un tableau qui contient le N°, le nom de l'écurie et le nom de la photo du drapeau du pays
*/
module.exports.getListeEcurie = function (callback) {
   // connection à la base
	db.getConnection(function(err, connexion){
        if(!err){
        	  // s'il n'y a pas d'erreur de connexion
        	  // execution de la requête SQL
						let sql ="SELECT ecunum, payadrdrap, ecunom FROM " +
                            "ecurie e INNER JOIN pays p ";
						sql= sql + "ON p.paynum=e.paynum ORDER BY ecunom";
						//console.log (sql);
            connexion.query(sql, callback);

            // la connexion retourne dans le pool
            connexion.release();
         }
      });
};

/*
* Récupérer l'intégralité des details des ecuries.
* @return Un tableau qui contient le nom, la Longueur, le nombre de spectateurs, la description, l'adresse de la photo du ciruitn le pays
*/

module.exports.getDetailEcurie = function (ecunum, callback) {
   // connection à la base
	db.getConnection(function(err, connexion){
        if(!err){
        	  // s'il n'y a pas d'erreur de connexion
        	  // execution de la requête SQL
						//une ecurie participe au championnat si elle a des pilotes
						let sql ="SELECT ecunom, ecunomdir, ecuadrsiege, ecuadresseimage, p.paynom FROM " +
                            "ecurie e INNER JOIN pays p ";
						sql= sql + "ON p.paynum=e.paynum where ecunum="+ecunum;
						//console.log (sql);
            connexion.query(sql, callback);

            // la connexion retourne dans le pool
            connexion.release();
         }
      });
};

module.exports.participeChampionnat = function (ecunum, callback) {
   // connection à la base
	db.getConnection(function(err, connexion){
        if(!err){
        	  // s'il n'y a pas d'erreur de connexion
        	  // execution de la requête SQL

						let sql ="SELECT p.pilnum, pilnom, pilprenom, phoadresse, CONCAT(SUBSTR(piltexte, 1, 100),'...') as piltexte FROM pilote p INNER JOIN" +
                            " ecurie e on e.ecunum=p.ecunum INNER JOIN photo ph on ph.pilnum=p.pilnum";
						sql= sql + " where phonum=1 and e.ecunum="+ecunum;
						//console.log (sql);
            connexion.query(sql, callback);

            // la connexion retourne dans le pool
            connexion.release();
         }
      });
};

module.exports.getInfoVoitureEcurieParticipeChampionnat = function (ecunum, callback) {
   // connection à la base
	db.getConnection(function(err, connexion){
        if(!err){
        	  // s'il n'y a pas d'erreur de connexion
        	  // execution de la requête SQL
						let sql ="SELECT voinom, voiadresseimage, tpv.typelibelle FROM " +
                            " voiture v INNER JOIN type_voiture tpv on tpv.typnum=v.typnum";
						sql= sql + " where v.ecunum="+ecunum;
						//console.log (sql);
            connexion.query(sql, callback);

            // la connexion retourne dans le pool
            connexion.release();
         }
      });
};
