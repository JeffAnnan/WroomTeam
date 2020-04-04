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
						let sql ="SELECT pil.pilnum,pil.pilnom, pil.pilprenom, pil.pildatenais, p.paynum, p.paynom, e.ecunum, e.ecunom"
						+" FROM pilote pil LEFT JOIN pays p on p.paynum=pil.paynum"
						+" LEFT JOIN ecurie e on e.ecunum=pil.ecunum ORDER BY pilnom";
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
module.exports.setPilote = function (req, res, callback) {
	var busboy = new Busboy({ headers: req.headers });
  //variables pour recuperer les donnes du formualaire qui ne sont plus accessibles
  //avec le request.body et utilisable en meme temps avec l'upload file
  //a cause du enctype="multipart/form-data" du formulaire
  //IMPORTANT : on recupere donc ces donnees grace a un middleware appele Busboy
  //busboy permet de parser les donnes recues. On recupere donc TOUTES les donnes
  //du formulaire
  var recupDonneeForm = [];
	busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
    //on recupere phonum
    if (fieldname === 'phoadresse') {
      recupDonneeForm.push(filename);
    }
		var saveTo = path.join(__dirname, '../../user/public/image/pilote/' + filename);
		file.pipe(fs.createWriteStream(saveTo));
	});

  busboy.on('field', (fieldName, val) => {
    //on recupere pilprenom
    if (fieldName === 'pilprenom') {
      recupDonneeForm.push(val);
    }
    //on recupere pilnom
    if (fieldName === 'pilnom') {
      recupDonneeForm.push(val);
    }
    //on recupere pildatenais
    if (fieldName === 'pildatenais') {
      recupDonneeForm.push(val);
    }
    //on recupere paynum
    if (fieldName === 'paynum') {
      recupDonneeForm.push(val);
    }
    //on recupere ecunum
    if (fieldName === 'ecunum') {
      recupDonneeForm.push(val);
    }
		//on recupere pilpoints
    if (fieldName === 'pilpoints') {
      recupDonneeForm.push(val);
    }
    //on recupere pilpoids
    if (fieldName === 'pilpoids') {
      recupDonneeForm.push(val);
    }
    //on recupere piltaille
    if (fieldName === 'piltaille') {
      recupDonneeForm.push(val);
    }
		//on recupere piltexte
    if (fieldName === 'piltexte') {
      recupDonneeForm.push(val);
    }
  });

	busboy.on('finish', function() {
		console.log(recupDonneeForm);
     //compostion de la reponse que l'on aurez du avoir du formualire
		 //on passe de l'incide 7 a 9 car on traite l'ajout de phoadresse dans un autre table
     var data = {
				pilprenom: recupDonneeForm[0],
			  pilnom: recupDonneeForm[1],
			  pildatenais: recupDonneeForm[2],
			  paynum: recupDonneeForm[3],
			  ecunum: recupDonneeForm[4],
			  pilpoints: recupDonneeForm[5],
			  pilpoids: recupDonneeForm[6],
			  piltaille: recupDonneeForm[7],
			  piltexte: recupDonneeForm[9]
    };
    //insertion dans la BD
    db.getConnection(function(err, connexion){
       if(!err){
         connexion.query('INSERT INTO pilote SET ? ',data, function(err, result) {
					 //recuperation de dernier Id insere dans pilote
					 let lastInsertedId=result.insertId;
					 //creation des donnes d'insertion dans la table photo (on y mettra phonum, pilnum et phoadresse)
					 let photoData = {
						 phonum: '1',
						 pilnum: lastInsertedId,
						 phoadresse: recupDonneeForm[8]
					 };
					 console.log(photoData);
					 connexion.query('INSERT INTO photo SET ? ',photoData);
					 callback();

				 });
         connexion.release();
       }
     });
	});
	req.pipe(busboy);
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

// MODIFIER UN PILOTE - PRE-SELECTIONNER LA NATIONALITE
module.exports.getNationalitePreSelect = function (paynumSelect, callback) {
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
// MODIFIER UN PILOTE - PRE-SELECTIONNER L'ECURIE
module.exports.getListeEcuriePreSelect = function (ecunumSelect, callback) {
   // connection à la base
	db.getConnection(function(err, connexion){
        if(!err){
					//si le pilote na pas d'ecurie on affiche les ecuries de maniere classique sans pre-selection
					if (ecunumSelect==null) {
							// s'il n'y a pas d'erreur de connexion
						  // execution de la requête SQL
						  let sql ="SELECT ecunum, ecunom FROM " +
															"ecurie ORDER BY ecunom";
						  //console.log (sql);
							connexion.query(sql, callback);
							// la connexion retourne dans le pool
							connexion.release();
					}else {
							//si le pilote a deja une ecurie on pre-selectionne le selecteur d'ecurie
							// s'il n'y a pas d'erreur de connexion
							// execution de la requête SQL
							//retourne true 1 si ecunumSelect est le meme que l'ecunum parcouru
							let sql ="SELECT ecunum, ecunom, IF(ecunum="+ecunumSelect+",true,false)"
							+" AS estmeme FROM ecurie ORDER BY ecunom";
							//console.log (sql);
							connexion.query(sql, callback);
							// la connexion retourne dans le pool
							connexion.release();
					}

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
