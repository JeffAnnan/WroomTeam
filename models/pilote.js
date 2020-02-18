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
module.exports.getLettrePilote = function (callback) {
   // connection à la base
	db.getConnection(function(err, connexion){
        if(!err){
        	  // s'il n'y a pas d'erreur de connexion
        	  // execution de la requête SQL
						let sql ="SELECT distinct SUBSTR(pilnom, 1, 1) as lettre FROM pilote order by lettre asc";
						//console.log (sql);
            connexion.query(sql, callback);

            // la connexion retourne dans le pool
            connexion.release();
         }
      });
};

module.exports.getInfoPilote = function (lettre, callback) {
   // connection à la base
	db.getConnection(function(err, connexion){
        if(!err){
        	  // s'il n'y a pas d'erreur de connexion
        	  // execution de la requête SQL
						let sql ="SELECT pil.pilnum, pilnom, pilprenom, phoadresse FROM pilote pil join photo pho on pho.pilnum=pil.pilnum where phonum=1 and pilnom LIKE '"+ lettre + "%' order by pilnom asc";
						//console.log (sql);
            connexion.query(sql, callback);

            // la connexion retourne dans le pool
            connexion.release();
         }
      });
};

module.exports.getInfoDetailPilote = function (pilnum, callback) {
   // connection à la base
	db.getConnection(function(err, connexion){
        if(!err){
        	  // s'il n'y a pas d'erreur de connexion
        	  // execution de la requête SQL
                  let sql ="SELECT phoadresse, pi.pilnum, pilnom, pilprenom, pildatenais, pilpoids, piltaille, piltexte,"+
                  " paynat, ecunom"+
                  " FROM pays p INNER JOIN pilote pi ON p.paynum=pi.paynum"+
                  " LEFT JOIN ecurie e ON pi.ecunum=e.ecunum"+
                  " INNER JOIN photo ph ON ph.pilnum=pi.pilnum"+
                  " WHERE phonum=1 AND pi.pilnum="+pilnum;
						//console.log (sql);
            connexion.query(sql, callback);

            // la connexion retourne dans le pool
            connexion.release();
         }
      });
};

module.exports.getSponsors = function (pilnum, callback) {
   // connection à la base
	db.getConnection(function(err, connexion){
        if(!err){
        	  // s'il n'y a pas d'erreur de connexion
        	  // execution de la requête SQL
                  let sql ="SELECT sposectactivite, sponom, p.pilnum"+
                  " FROM pilote p INNER JOIN sponsorise s ON p.pilnum=s.pilnum"+
                  " INNER JOIN sponsor sp ON sp.sponum=s.sponum"+
                  " WHERE p.pilnum="+pilnum;
            connexion.query(sql, callback);

            // la connexion retourne dans le pool
            connexion.release();
         }
      });
};

module.exports.getPhoto = function (pilnum, callback) {
   // connection à la base
	db.getConnection(function(err, connexion){
        if(!err){
        	  // s'il n'y a pas d'erreur de connexion
        	  // execution de la requête SQL
                  let sql ="SELECT phoadresse, pi.pilnum"+
                  " FROM pilote pi"+
                  " INNER JOIN photo ph ON ph.pilnum=pi.pilnum"+
                  " WHERE pi.pilnum="+pilnum;
						console.log (sql);
            connexion.query(sql, callback);

            // la connexion retourne dans le pool
            connexion.release();
         }
      });
};
