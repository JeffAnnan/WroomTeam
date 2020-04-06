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
* Récupérer l'intégralité des circuits
* @return Un tableau qui contient le N°, le nom, la pays, la longueur, le nombre de spectateurs des circuits
*/
// GESTION DES CIRCUITS
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

// AJOUTER UN CIRCUIT
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
// RENTRER LES INFOS DU CIRCUIT DANS LA BASE DE DONNEES
module.exports.setCircuit = function (req, res, callback) {

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
    if (fieldname === 'ciradresseimage') {
      recupDonneeForm.push(filename);
    }
		var saveTo = path.join(__dirname, '../../user/public/image/circuit/' + filename);
		file.pipe(fs.createWriteStream(saveTo));
	});

  busboy.on('field', (fieldName, val) => {
    //avec Busboy on recupere cirnom
    if (fieldName === 'cirnom') {
      recupDonneeForm.push(val);
    }
    //avec Busboy on recupere cirlongueur
    if (fieldName === 'cirlongueur') {
      recupDonneeForm.push(val);
    }
    //avec Busboy on recupere paynum
    if (fieldName === 'paynum') {
      recupDonneeForm.push(val);
    }
    //avec Busboy on recupere cirnbspectateurs
    if (fieldName === 'cirnbspectateurs') {
      recupDonneeForm.push(val);
    }
    //avec Busboy on recupere cirtext
    if (fieldName === 'cirtext') {
      recupDonneeForm.push(val);
    }
  });

  //on termine le processus d'ajout du circuit + upload le fichier
	busboy.on('finish', function() {
     //compostion de la reponse (data du resuqest.body) que l'on aurait du avoir du formualire
     var data = {
        cirnom: recupDonneeForm[0],
        cirlongueur: recupDonneeForm[1],
        paynum: recupDonneeForm[2],
        ciradresseimage: recupDonneeForm[3],
        cirnbspectateurs: recupDonneeForm[4],
        cirtext: recupDonneeForm[5],
    };
    //insertion dans la BD (table circuit)
    db.getConnection(function(err, connexion){
       if(!err){
         connexion.query('INSERT INTO circuit SET ? ',data, callback);
         connexion.release();
       }
     });
	});
	req.pipe(busboy);

};

// MODIFIER CIRCUIT - INFOS DE PRE-SELECTION
module.exports.getInfoCircuitSelect = function (cirnum,callback) {
	// connection à la base
	db.getConnection(function(err, connexion){
			 if(!err){
					// s'il n'y a pas d'erreur de connexion
					// execution de la requête SQL
					let sql ="SELECT cirnum, cirnom, cirlongueur, paynum, "+
					"cirnbspectateurs, cirnbspectateurs, cirtext "+
					"FROM circuit WHERE cirnum="+cirnum;
					//console.log (sql);
					 connexion.query(sql, callback);

					 // la connexion retourne dans le pool
					 connexion.release();
			}
	});
};
// MODIFIER UN CIRCUIT - PRE-SELECTIONNER LE PAYS
module.exports.getListePaysMemeQueCircuitSelect= function (paynumSelect, callback) {
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
// MODIFIER LES INFOS DU CIRCUIT DANS LA BASE DE DONNEES
module.exports.modifCircuit = function (cirnom, cirlongueur, paynum, cirnbspectateurs, cirtext, cirnum, callback) {
   // connection à la base
    db.getConnection(function(err, connexion){
        if(!err){
					req="UPDATE circuit SET cirnom='"+cirnom+"', cirlongueur="+cirlongueur+
					", paynum="+paynum+", cirnbspectateurs="+cirnbspectateurs+", cirtext='"+cirtext+
					"' WHERE cirnum="+cirnum;
					  //console.log(req);
            connexion.query(req,callback);
            connexion.release();

        }
    });
};

// SUPPRESSION D'UN CIRCUIT
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
