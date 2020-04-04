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
module.exports.getListeGrandPrix = function (callback) {
    // connection à la base
     db.getConnection(function(err, connexion){
         if(!err){
               // s'il n'y a pas d'erreur de connexion
               // execution de la requête SQL
                         let sql ="SELECT gpnum,gpnom,payadrdrap FROM " +
                             "grandprix g INNER JOIN circuit c ON g.cirnum=c.cirnum "+
                             " INNER JOIN pays p ON c.paynum=p.paynum ORDER BY gpnom ASC";
                        //console.log (sql);
             connexion.query(sql, callback);
 
             // la connexion retourne dans le pool
             connexion.release();
          }
       });
 };

 module.exports.getTitreResultat = function (gpnum, callback) {
    // connection à la base
     db.getConnection(function(err, connexion){
         if(!err){
               // s'il n'y a pas d'erreur de connexion
               // execution de la requête SQL
                         let sql ="SELECT gpnum,gpnom,gpdate,gpcommentaire FROM " +
                          "grandprix WHERE gpnum="+gpnum;
                        
                        //console.log (sql);
             connexion.query(sql, callback);
 
             // la connexion retourne dans le pool
             connexion.release();
          }
       });
 };

 module.exports.getTableauResultat = function (gpnum, callback) {
    // connection à la base
     db.getConnection(function(err, connexion){
         if(!err){
               // s'il n'y a pas d'erreur de connexion
               // execution de la requête SQL
               let sql= "Select rang,p.pilnum, pilprenom, pilnom, tempscourse, CASE "+
               "WHEN rang=1 THEN '25' "+
               "WHEN rang=2 THEN '18' "+
               "WHEN rang=3 THEN '15' "+                                   
               "WHEN rang=4 THEN '12' "+
               "WHEN rang=5 THEN '10' "+
               "WHEN rang=6 THEN '8' "+
               "WHEN rang=7 THEN '6' "+
               "WHEN rang=8 THEN '4' "+
               "WHEN rang=9 THEN '2' "+
               "WHEN rang=10 THEN '1' "+
               "ELSE '0' "+
               "END AS Points FROM "+
               
               "(SELECT pilnum, tempscourse,ROW_NUMBER() OVER(ORDER BY tempscourse) AS rang"+

                  " FROM course "+
                  "Where gpnum="+gpnum+
               ")t "+
               "INNER JOIN PILOTE p on t.pilnum=p.pilnum LIMIT 10"; 
                        
                       // console.log (sql);
             connexion.query(sql, callback);
 
             // la connexion retourne dans le pool
             connexion.release();
          }
       });
 };

