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
						let sql ="SELECT ecunum, ecunom, ecunomdir, ecupoints, paynum FROM " +
                            "ecurie ORDER BY ecunom";
						//console.log (sql);
            connexion.query(sql, callback);

            // la connexion retourne dans le pool
            connexion.release();
         }
      });
};

module.exports.setEcurie = function (data,callback) {
   // connection à la base
    db.getConnection(function(err, connexion){
        if(!err){
            connexion.query('INSERT INTO ecurie SET ? ',data,callback);
            connexion.release();
        }
    });
};

module.exports.getInfoEcurieSelect = function (ecunum,callback) {
	// connection à la base
	db.getConnection(function(err, connexion){
			 if(!err){
					// s'il n'y a pas d'erreur de connexion
					// execution de la requête SQL
					let sql ="SELECT ecunum, ecunom, ecunomdir, paynum, "+
					"ecuadrsiege, ecupoints, ecuadresseimage FROM ecurie WHERE ecunum="+ecunum;
					//console.log (sql);
					 connexion.query(sql, callback);

					 // la connexion retourne dans le pool
					 connexion.release();
			}
	});
};

module.exports.getListePaysMemeQueEcurieSelect= function (paynumSelect, callback) {
   // connection à la base
	db.getConnection(function(err, connexion){
        if(!err){
        	  // s'il n'y a pas d'erreur de connexion
        	  // execution de la requête SQL
						let sql ="SELECT paynum, paynom, IF(paynum="+paynumSelect+",true,false)"
						+" AS estmeme FROM pays ORDER BY paynom";
						//console.log (sql);
            connexion.query(sql, callback);

            // la connexion retourne dans le pool
            connexion.release();
         }
      });
};

module.exports.modifEcurie = function (ecunum, ecunom, ecunomdir, ecuadrsiege, ecupoints, paynum, ecuadresseimageDefault, ecuadresseimageChangee, callback) {
   // connection à la base
    db.getConnection(function(err, connexion){
        if(!err){
					//on prend soit le input hidden qui reprend l'image de l'écurie
					//si on desire changer d'image le selecteur d'image charge une image,
					//il faut donc prendre cette valeur et pas le nom de l'image chargee par default
					//et qui correpond a l'image chargee lors de la creation d'une écurie
					let ecuadresseimage;

					if (!ecuadresseimageChangee=="") {
						//l'adresse de l'image est celle selctionnee par le selcteur
						ecuadresseimage=ecuadresseimageChangee
					}else {
						//l'adresse de l'image est celle chargee par default et saisie
						//lors de la creation d'une ecurie
						ecuadresseimage=ecuadresseimageDefault
					}
				//	console.log(ecuadresseimageChangee);
				//	console.log(ecuadresseimageDefault);
					req="UPDATE ecurie SET ecunom='"+ecunom+"', ecunomdir='"+ecunomdir+
					"', ecuadrsiege='"+ecuadrsiege+"', ecupoints="+ecupoints+
					", paynum="+paynum+", ecuadresseimage='"+ecuadresseimage+
					"' WHERE ecunum="+ecunum;
					//console.log(req);
            connexion.query(req,callback);
            connexion.release();

        }
    });
};

module.exports.supprimerEcurie = function (ecunum, callback) {
   // connection à la base
	db.getConnection(function(err, connexion){
        if(!err){
        	  // s'il n'y a pas d'erreur de connexion
        	  // execution de la requête SQL
						let sql ="DELETE FROM ecurie WHERE ecunum="+ecunum;
						//console.log (sql);
            connexion.query(sql, callback);

            // la connexion retourne dans le pool
            connexion.release();
         }
      });
};
