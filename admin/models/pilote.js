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

// GESTION DES PILOTES
module.exports.getPilotes = function (callback) {
   // connection à la base
	db.getConnection(function(err, connexion){
        if(!err){
        	  // s'il n'y a pas d'erreur de connexion
        	  // execution de la requête SQL
						let sql ="SELECT pilnum,pilnom, pilprenom, pildatenais FROM pilote ORDER BY pilnom";
						//console.log (sql);
            connexion.query(sql, callback);

            // la connexion retourne dans le pool
            connexion.release();
         }
      });
};

// AJOUTER UN PILOTE
module.exports.getNationalite = function (callback) {
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

// RENTRER LES INFOS DU PILOTE DANS LA BASE DE DONNEES
module.exports.setPilote = function (data,callback) {
   // connection à la base
    db.getConnection(function(err, connexion){
        if(!err){
            connexion.query('INSERT INTO pilote SET ? ',data,callback);
            connexion.release();
         }
      });
}

// MODIFIER
module.exports.getInfoModif = function (pilnum, callback) {
   // connection à la base
	db.getConnection(function(err, connexion){
        if(!err){
        	  // s'il n'y a pas d'erreur de connexion
        	  // execution de la requête SQL
                  let sql ="SELECT pi.pilnum, pilnom, pilprenom, pildatenais, pilpoids, pilpoints, piltaille, piltexte,"+
                  " paynom, ecunom"+
                  " FROM pays p INNER JOIN pilote pi ON p.paynum=pi.paynum"+
                  " LEFT JOIN ecurie e ON pi.ecunum=e.ecunum"+
                  " WHERE pi.pilnum="+pilnum;
						//console.log (sql);
            connexion.query(sql, callback);

            // la connexion retourne dans le pool
            connexion.release();
         }
      });
};

// MODIFIER LES INFOS DU PILOTE DANS LA BASE DE DONNEES
module.exports.updatePilote = function (pilnum,data,callback) {
   // connection à la base
    db.getConnection(function(err, connexion){
        if(!err){
            connexion.query('UPDATE pilote SET ? WHERE pilnum='+pilnum,data,callback);
            connexion.release();
         }
      });
}

module.exports.deletePilote = function (pilnum, callback2, callback1,callback4,callback3,callback) {
   // connection à la base
	db.getConnection(function(err, connexion){
        if(!err){
        	  // s'il n'y a pas d'erreur de connexion
             // execution de la requête SQL
                  let sql1="DELETE FROM essais WHERE pilnum="+pilnum;
                  let sql2="DELETE FROM course WHERE pilnum="+pilnum;
                  let sql3="DELETE FROM photo WHERE pilnum="+pilnum;
                  let sql4 = "DELETE FROM sponsorise WHERE pilnum="+pilnum
						let sql ="DELETE FROM pilote WHERE pilnum="+pilnum;
                  console.log (sql);
            connexion.query(sql2, callback2);
            connexion.query(sql1, callback1);
            connexion.query(sql4, callback4);
            connexion.query(sql3, callback3);
            connexion.query(sql, callback);

            // la connexion retourne dans le pool
            connexion.release();
         }
      });
};

