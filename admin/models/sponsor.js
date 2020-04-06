/*
* config.Db contient les parametres de connection à la base de données
* il va créer aussi un pool de connexions utilisables
* sa méthode getConnection permet de se connecter à MySQL
*
*/
let db = require('../configDb');
var _ = require('underscore');

/*
* Récupérer l'intégralité des sponsors
* @return Un tableau qui contient le N°, le nom, le secteur d'activite des ecuries et leur N° d'ecrurie si elles en ont (sinon NULL)
*/
// GESTION DES SPONSORS
module.exports.getSponsors = function (callback) {
   // connection à la base
	db.getConnection(function(err, connexion){
        if(!err){
        	  // s'il n'y a pas d'erreur de connexion
        	  // execution de la requête SQL
						//on elimine les doublons et ignorons les deuxiemes entites des doublons par le GROUP BY
						//on ne prend que la premiere ligne d'un doublon
						let sql="SELECT s.sponum, s.sponom, s.sposectactivite, f.ecunum FROM sponsor s "
						+" LEFT JOIN (SELECT * FROM finance GROUP BY sponum) f ON f.sponum=s.sponum ORDER BY sponom";
						//console.log (sql);
            connexion.query(sql, callback);

            // la connexion retourne dans le pool
            connexion.release();
         }
      });
};

// AJOUTER UN SPONSOR
module.exports.getListeEcuries = function (callback) {
   // connection à la base
	db.getConnection(function(err, connexion){
        if(!err){
        	  // s'il n'y a pas d'erreur de connexion
        	  // execution de la requête SQL
						let sql ="SELECT ecunum, ecunom FROM ecurie ORDER BY ecunom";
						//console.log (sql);
            connexion.query(sql, callback);

            // la connexion retourne dans le pool
            connexion.release();
         }
      });
};
// RENTRER LES INFOS DU SPONSOR DANS LA BASE DE DONNEES
module.exports.setSponsor = function (data, callback) {
   //underscore module
	 //module pour selectionner les informations souhaitee dans data
	 //donnes a inserer dans Sponsor (on ne prend que sponom et sposectactivite)
   let dataSetInSponsor = _.pick(data, 'sponom', 'sposectactivite');
   // connection à la base
    db.getConnection(function(err, connexion){
        if(!err){
					  //insertion du sponsor
            connexion.query('INSERT INTO sponsor SET ? ',dataSetInSponsor, function(err, result) {
              //recuperation du dernier Id (sponum) insere dans sponsor
              let lastInsertedId=result.insertId;
							//creation des donnees d'insertion dans la table finance (on y mettra sponum et ecunum par le extend)
              let sponumData = {
                sponum: lastInsertedId
              };
							//on recupere data seulement ecunum
              let dataSetInFinanceEcunum = _.pick(data,'ecunum');
              //on ajoute dans les donnees d'insertion ecunum par extend
              let dataSetInFinance = _.extend(dataSetInFinanceEcunum, sponumData);

              //console.log(dataSetInFinance);
              connexion.query('INSERT INTO finance SET ? ',dataSetInFinance);
              callback();

            });
            // la connexion retourne dans le pool
            connexion.release();
        }
    });
};

// MODIFIER SPONSOR - INFOS DE PRE-SELECTION
module.exports.getInfoSponsorSelect = function (sponum, ecunum, callback) {
	// connection à la base
	db.getConnection(function(err, connexion){
			 if(!err){
				 // s'il n'y a pas d'erreur de connexion
				 // execution de la requête SQL
				 //si le sponsor n'a pas d'ecurie donc que ecunum est a null
				 //si le sponsor n'a pas d'ecurie donc que ecunum est a null
			 if (ecunum==null) {
				 let sql ="SELECT s.sponum, s.sponom, s.sposectactivite, f.ecunum FROM sponsor s"
				 +" LEFT JOIN finance f ON f.sponum=s.sponum WHERE s.sponum="+sponum;
				 //console.log (sql);
				 connexion.query(sql, callback);
				 // la connexion retourne dans le pool
				 connexion.release();
			 }else {
				 let sql ="SELECT s.sponum, s.sponom, s.sposectactivite, f.ecunum FROM sponsor s"
				 +" LEFT JOIN finance f ON f.sponum=s.sponum WHERE s.sponum="+sponum+" AND f.ecunum="+ecunum;
				 //console.log (sql);
				 connexion.query(sql, callback);
				 // la connexion retourne dans le pool
				 connexion.release();
			 }
			}
	});
};
// MODIFIER UN SPONSOR - PRE-SELECTIONNER L'ECURIE
module.exports.getListeEcurieMemeQueSponsorSelect= function (ecunumSelect, callback) {
   // connection à la base
	db.getConnection(function(err, connexion){
        if(!err){
        	  // s'il n'y a pas d'erreur de connexion
        	  // execution de la requête SQL
            //si le sponsor n'a pas d'ecurie on permet d'afficher le selecteur
            let sql="";
            if (ecunumSelect==null) {
              //on affiche toutes les ecuries
              sql ="SELECT ecunum, ecunom FROM ecurie ORDER BY ecunom";
            }else{
              //on pre-selectionne celle du sponsor en quesiton par l'ecunum du sponsor
							//retourne true (1) si ecunumSelect est le meme que l'ecunum parcouru
              sql ="SELECT ecunum, ecunom, IF(ecunum="+ecunumSelect+",true,false)"
              +" AS estmeme FROM ecurie ORDER BY ecunom";
            }

            //console.log (sql);
            connexion.query(sql, callback);

            // la connexion retourne dans le pool
            connexion.release();
         }
      });
};
// MODIFIER LES INFOS DU SPONSOR DANS LA BASE DE DONNEES
module.exports.modifSponsor = function (sponom, sposectactivite, ecunum, sponum, ecunumAvantModif, callback) {
	 // ecunumAvantModif correpond au numero d'ecurie avant que l'on ait effectué toute modification
	 //sur elle.
   // connection à la base
    db.getConnection(function(err, connexion){
        if(!err){
          //mise a jour de la table sponsor
					let reqSponsor="UPDATE sponsor SET sponom='"+connexion.escape(sponom)+"', sposectactivite='"+connexion.escape(sposectactivite)+
          "' WHERE sponum="+sponum;
					//console.log(reqSponsor);

          connexion.query(reqSponsor, function(err, result) {
            //si c'est la premiere fois que l'on donne une ecurie en modifiant un sponsor
            if (ecunumAvantModif==null) {
              //insertion dans la table finance
              let reqFinance="INSERT INTO finance SET ecunum="+connexion.escape(ecunum)+
              ", sponum="+connexion.escape(sponum);
              //console.log(reqFinance);
              connexion.query(reqFinance);
              callback();
            }else {
              //si on souhaite remettre a SANS ECURIE l'ecurie du sponsor on supprime la ligne finance
              if (ecunum=='NULL') {
                //suppression dans la table finance
                let deleteInSponsor="DELETE FROM finance WHERE sponum="+sponum;
                //console.log(deleteInSponsor);
                connexion.query(deleteInSponsor);
                callback();
              }else {
                //mise a jour de la table finance lorsqu'on modifie de maniere
								//classique un sponsor. Pour le cas des doublons de sponsor
								// on supprime de la Base les lignes avec sponum et re-créons
								// une ligne unique. Un sponsor sponsorise une ecurie
								let deleteInSponsor="DELETE FROM finance WHERE sponum="+sponum;
                //console.log(reqFinance);
                connexion.query(deleteInSponsor, function(){
									//insertion dans la table finance
									let reqFinance="INSERT INTO finance SET ecunum="+connexion.escape(ecunum)+
									", sponum="+connexion.escape(sponum);
									//console.log(reqFinance);
		              connexion.query(reqFinance);
		              callback();
								});

              }
            }
          });
          connexion.release();
        }
    });
};

// SUPPRESSION D'UN SPONSOR
module.exports.supprimerSponsor = function (sponum, callback) {
   // connection à la base
   db.getConnection(function(err, connexion){
       if(!err){
         // s'il n'y a pas d'erreur de connexion
         // execution de la requête SQL
         //sppression dans la table finance
         let deleteInFinance ="DELETE FROM finance WHERE sponum="+sponum;
         //console.log(deleteInFinance);

         connexion.query(deleteInFinance, function(err, result) {

           //suppression dans la table sponsor
           let deleteInSponsor="DELETE FROM sponsor WHERE sponum="+sponum;
           //console.log(deleteInSponsor);
           connexion.query(deleteInSponsor);
           callback();

         });
         connexion.release();


       }
   });
};
