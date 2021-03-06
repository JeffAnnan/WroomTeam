/*
* config.Db contient les parametres de connection à la base de données
* il va créer aussi un pool de connexions utilisables
* sa méthode getConnection permet de se connecter à MySQL
*
*/

let db = require('../configDb');

//modules necessaires pour upload un fichier
var express = require('express'),
    Busboy = require('busboy'),
		inspect = require('util').inspect,
    path = require('path'),
    fs = require('fs');

/*
* Récupérer l'intégralité des écuries
* @return Un tableau qui contient le N°, le nom, le nom du directeur, les points et le pays des ecuries
*/
// GESTION DES ECURIES
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

// RENTRER LES INFOS DE L'ECURIE DANS LA BASE DE DONNEES
module.exports.setEcurie = function (req, res, callback) {
		var busboy = new Busboy({ headers: req.headers });
	  //variables pour recuperer les donnees du formualaire qui ne sont plus accessibles
	  //avec le request.body et utilisables en meme temps avec l'upload file
	  //a cause du enctype="multipart/form-data" du formulaire
	  //IMPORTANT : on recupere donc ces donnees grace a un middleware appele Busboy
	  //busboy permet de parser les donnes recues. On recupere donc TOUTES les donnes
	  //du formulaire
	  var recupDonneeForm = [];
		busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
	    //avec Busboy on recupere ciradresseimage
	    if (fieldname === 'ecuadresseimage') {
	      recupDonneeForm.push(filename);
	    }
			var saveTo = path.join(__dirname, '../../user/public/image/ecurie/' + filename);
			file.pipe(fs.createWriteStream(saveTo));
		});

	  busboy.on('field', (fieldName, val) => {
	    //avec Busboy on recupere ecunom
	    if (fieldName === 'ecunom') {
	      recupDonneeForm.push(val);
	    }
	    //avec Busboy on recupere ecunomdir
	    if (fieldName === 'ecunomdir') {
	      recupDonneeForm.push(val);
	    }
	    //avec Busboy on recupere ecuadrsiege
	    if (fieldName === 'ecuadrsiege') {
	      recupDonneeForm.push(val);
	    }
	    //avec Busboy on recupere ecupoints
	    if (fieldName === 'ecupoints') {
	      recupDonneeForm.push(val);
	    }
	    //avec Busboy on recupere paynum
	    if (fieldName === 'paynum') {
	      recupDonneeForm.push(val);
	    }
	  });

    //on termine le processus d'ajout d'une ecurie + upload le fichier
		busboy.on('finish', function() {
	     //compostion de la reponse (data du resuqest.body) que l'on aurait du avoir du formualire
	     var data = {
	        ecunom: recupDonneeForm[0],
	        ecunomdir: recupDonneeForm[1],
	        ecuadrsiege: recupDonneeForm[2],
	        ecupoints: recupDonneeForm[3],
	        paynum: recupDonneeForm[4],
	        ecuadresseimage: recupDonneeForm[5],
	    };
	    //insertion dans la BD (table ecurie)
	    db.getConnection(function(err, connexion){
	       if(!err){
	         connexion.query('INSERT INTO ecurie SET ? ',data, callback);
	         connexion.release();
	       }
	     });
		});
		req.pipe(busboy);
};

// MODIFIER CIRCUIT - INFOS DE PRE-SELECTION
module.exports.getInfoEcurieSelect = function (ecunum,callback) {
	// connection à la base
	db.getConnection(function(err, connexion){
			 if(!err){
					// s'il n'y a pas d'erreur de connexion
					// execution de la requête SQL
					let sql ="SELECT ecunum, ecunom, ecunomdir, paynum, "+
					"ecuadrsiege, ecupoints FROM ecurie WHERE ecunum="+ecunum;
					//console.log (sql);
					 connexion.query(sql, callback);

					 // la connexion retourne dans le pool
					 connexion.release();
			}
	});
};
// MODIFIER UN CIRCUIT - PRE-SELECTIONNER LE PAYS
module.exports.getListePaysMemeQueEcurieSelect= function (paynumSelect, callback) {
   // connection à la base
	db.getConnection(function(err, connexion){
        if(!err){
        	  // s'il n'y a pas d'erreur de connexion
        	  // execution de la requête SQL
            //retourne true (1) si paynumSelect est le meme que le paynum parcouru
						let sql ="SELECT paynum, paynom, IF(paynum="+paynumSelect+",true,false)"
						+" AS estmeme FROM pays ORDER BY paynom";
						//console.log (sql);
            connexion.query(sql, callback);

            // la connexion retourne dans le pool
            connexion.release();
         }
      });
};

// MODIFIER LES INFOS DE L'ECURIE DANS LA BASE DE DONNEES
module.exports.modifEcurie = function (ecunum, ecunom, ecunomdir, ecuadrsiege, ecupoints, paynum, callback) {
   // connection à la base
    db.getConnection(function(err, connexion){
        if(!err){
					req="UPDATE ecurie SET ecunom="+connexion.escape(ecunom)+", ecunomdir="+connexion.escape(ecunomdir)+
					", ecuadrsiege="+connexion.escape(ecuadrsiege)+", ecupoints="+ecupoints+
					", paynum="+paynum+" WHERE ecunum="+ecunum;
					//console.log(req);
            connexion.query(req,callback);
            connexion.release();

        }
    });
};

// SUPPRESSION D'UNE ECURIE
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
