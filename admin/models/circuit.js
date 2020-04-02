/*
* config.Db contient les parametres de connection à la base de données
* il va créer aussi un pool de connexions utilisables
* sa méthode getConnection permet de se connecter à MySQL
*
*/
let db = require('../configDb');
var express = require('express'),
    Busboy = require('busboy'),
		inspect = require('util').inspect,
    path = require('path'),
    fs = require('fs');

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

module.exports.insertFile = function (req, res, callback) {

	var busboy = new Busboy({ headers: req.headers });
  //variables pour recuperer les donnes du formualaire qui ne sont plus accessibles
  //avec le request.body et utilisable en meme temps avec l'upload file
  //a cause du enctype="multipart/form-data" du formulaire
  //IMPORTANT : on recupere donc ces donnees grace a un middleware appele Busboy
  //busboy permet de parser les donnes recues. On recupere donc TOUTES les donnes
  //du formulaire
  var recupDonneeForm = [];
	busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
    //on recupere ciradresseimage
    if (fieldname === 'ciradresseimage') {
      recupDonneeForm.push(filename);
    }
		var saveTo = path.join(__dirname, '../../user/public/image/circuit/' + filename);
		file.pipe(fs.createWriteStream(saveTo));
	});

  busboy.on('field', (fieldName, val) => {
    //on recupere cirnom
    if (fieldName === 'cirnom') {
      recupDonneeForm.push(val);
    }
    //on recupere cirlongueur
    if (fieldName === 'cirlongueur') {
      recupDonneeForm.push(val);
    }
    //on recupere paynum
    if (fieldName === 'paynum') {
      recupDonneeForm.push(val);
    }
    //on recupere cirnbspectateurs
    if (fieldName === 'cirnbspectateurs') {
      recupDonneeForm.push(val);
    }
    //on recupere cirtext
    if (fieldName === 'cirtext') {
      recupDonneeForm.push(val);
    }
  });

	busboy.on('finish', function() {
     //compostion de la reponse que l'on aurez du avoir du formualire
     var data = {
        cirnom: recupDonneeForm[0],
        cirlongueur: recupDonneeForm[1],
        paynum: recupDonneeForm[2],
        ciradresseimage: recupDonneeForm[3],
        cirnbspectateurs: recupDonneeForm[4],
        cirtext: recupDonneeForm[5],
    };
    //insertion dans la BD
    db.getConnection(function(err, connexion){
       if(!err){
         connexion.query('INSERT INTO circuit SET ? ',data, callback);
         connexion.release();
       }
     });
	});
	req.pipe(busboy);

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
            //console.log (sql);
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
					//console.log(req);
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
