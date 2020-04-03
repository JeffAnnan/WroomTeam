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
                         let sql ="SELECT gpnum,gpnom FROM grandprix";
                        console.log (sql);
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
               let sql= "Select gpnum ,rang,t.pilnum, pilprenom, pilnom, tempscourse, CASE "+
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
               
               "(SELECT gpnum,pilnum, tempscourse,ROW_NUMBER() OVER(ORDER BY tempscourse) AS rang"+

                  " FROM course "+
                  "Where gpnum="+gpnum+
               ")t "+
               "INNER JOIN PILOTE p on t.pilnum=p.pilnum"; 
                        
            // console.log (sql);
             connexion.query(sql, callback);
 
             // la connexion retourne dans le pool
             connexion.release();
          }
       });
 };

 module.exports.getCountLigne = function (gpnum, callback) {
   // connection à la base
    db.getConnection(function(err, connexion){
        if(!err){
              // s'il n'y a pas d'erreur de connexion
              // execution de la requête SQL
              let sql= "Select count(*) AS ligne FROM "+
              
              "(SELECT gpnum,pilnum, tempscourse,ROW_NUMBER() OVER(ORDER BY tempscourse) AS rang"+

                 " FROM course "+
                 "Where gpnum="+gpnum+
              ")t "+
              "INNER JOIN PILOTE p on t.pilnum=p.pilnum"; 
                       
            console.log (sql);
            connexion.query(sql, callback);

            // la connexion retourne dans le pool
            connexion.release();
         }
      });
};

 module.exports.getCountLigne = function (gpnum, callback) {
   // connection à la base
    db.getConnection(function(err, connexion){
        if(!err){
              // s'il n'y a pas d'erreur de connexion
              // execution de la requête SQL
              let sql= "Select count(*) AS ligne FROM "+
              
              "(SELECT gpnum,pilnum, tempscourse,ROW_NUMBER() OVER(ORDER BY tempscourse) AS rang"+

                 " FROM course "+
                 "Where gpnum="+gpnum+
              ")t "+
              "INNER JOIN PILOTE p on t.pilnum=p.pilnum"; 
                       
            console.log (sql);
            connexion.query(sql, callback);

            // la connexion retourne dans le pool
            connexion.release();
         }
      });
};

module.exports.getPiloteCourse = function (gpnum, callback) {
   // connection à la base
    db.getConnection(function(err, connexion){
        if(!err){
              // s'il n'y a pas d'erreur de connexion
              // execution de la requête SQL
              let sql= "SELECT p.pilnum, pilnom FROM "+
              "(SELECT pilnum FROM pilote EXCEPT (SELECT pilnum FROM course  WHERE gpnum="+gpnum+"))t "+ 
              "INNER JOIN pilote p ON p.pilnum=t.pilnum "+
              "ORDER BY pilnom";
                       
            console.log (sql);
            connexion.query(sql, callback);

            // la connexion retourne dans le pool
            connexion.release();
         }
      });
};

 module.exports.deleteResultat = function (gpnum, pilnum,callback2, callback1) {
   // connection à la base
	db.getConnection(function(err, connexion){
        if(!err){
        	  // s'il n'y a pas d'erreur de connexion
             // execution de la requête SQL
                  let sql1="DELETE FROM essais WHERE gpnum="+gpnum+" AND pilnum="+pilnum;
                  let sql2="DELETE FROM course WHERE gpnum="+gpnum+" AND pilnum="+pilnum;
                  
                 
            connexion.query(sql2, callback2);
            connexion.query(sql1, callback1);
           

            // la connexion retourne dans le pool
            connexion.release();
         }
      });
};

module.exports.ajoutResultat = function (gpnum, pilnum,tempscourse, callback) {
   // connection à la base
	db.getConnection(function(err, connexion){
        if(!err){
        	  // s'il n'y a pas d'erreur de connexion
             // execution de la requête SQL
                  let sql='INSERT INTO course SET gpnum='+gpnum+', pilnum='+pilnum+', tempscourse="'+tempscourse+'"';
                 
            connexion.query(sql, callback);
           

            // la connexion retourne dans le pool
            connexion.release();
         }
      });
};

