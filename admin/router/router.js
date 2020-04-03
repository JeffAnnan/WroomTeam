
let HomeController = require('./../controllers/HomeController');
let AuthentificationController = require('./../controllers/AuthentificationController');
let ResultatController = require('./../controllers/ResultatController');
let EcurieController = require('./../controllers/EcurieController');
let PiloteController = require('./../controllers/PiloteController');
let CircuitController = require('./../controllers/CircuitController');

// Routes
module.exports = function(app){

// Main Routes
    app.get('/', HomeController.Index);
    app.get('/menu', HomeController.Index);

// accueil
app.post('/menu', HomeController.Connexion);
    app.post('/', HomeController.Connexion);

// pilotes
    app.get('/pilotes', AuthentificationController.AdminConnexion, PiloteController.Pilotes);
    //ajouter
    
    app.get('/ajout', AuthentificationController.AdminConnexion,PiloteController.AjoutPilote);
    app.post('/piloteAjoute',AuthentificationController.AdminConnexion, PiloteController.FinAjoutPilote);

    //modifier
    app.get('/modif/:pilnum', AuthentificationController.AdminConnexion,PiloteController.ModifierPilote);
    app.post('/piloteModifie/:pilnum', AuthentificationController.AdminConnexion,PiloteController.FinModifierPilote);

    // supprimer
    app.get('/supp/:pilnum', AuthentificationController.AdminConnexion, PiloteController.SupprimerPilote);

 // circuits
   app.get('/circuits', AuthentificationController.AdminConnexion,CircuitController.Circuits);
   app.get('/ajoutCircuit', AuthentificationController.AdminConnexion,CircuitController.AjoutCircuit);
   app.post('/circuitAjoute',AuthentificationController.AdminConnexion, CircuitController.FinAjoutCircuit);
   app.get('/modifCircuit/:cirnum/:paynum', AuthentificationController.AdminConnexion,CircuitController.ModifCircuit);
   app.post('/circuitModifie/:cirnum', AuthentificationController.AdminConnexion,CircuitController.FinModifCircuit);
   app.get('/supprCircuit/:cirnum',AuthentificationController.AdminConnexion, CircuitController.SupprCircuit);

// Ecuries
   app.get('/ecuries', AuthentificationController.AdminConnexion,EcurieController.ListerEcurie);
   app.get('/ajoutEcurie', AuthentificationController.AdminConnexion,EcurieController.AjoutEcurie);
   app.post('/ecurieAjoute', AuthentificationController.AdminConnexion,EcurieController.FinAjoutEcurie);
   app.get('/modifEcurie/:ecunum/:paynum', AuthentificationController.AdminConnexion,EcurieController.ModifEcurie);
   app.post('/ecurieModifie/:ecunum', AuthentificationController.AdminConnexion,EcurieController.FinModifEcurie);
   app.get('/supprEcurie/:ecunum', AuthentificationController.AdminConnexion,EcurieController.SupprEcurie);

 //Résultats
   app.get('/resultats', AuthentificationController.AdminConnexion,ResultatController.Resultat);
   app.get('/saisieResultat',AuthentificationController.AdminConnexion, ResultatController.SaisieResultat);
  // supprimer
   app.get('/suppResultat/:pilnum/:gpnum',AuthentificationController.AdminConnexion, ResultatController.SupprimerResultat);
  // ajout
    app.post('/ajoutResultat/:gpnum',AuthentificationController.AdminConnexion, ResultatController.AjoutResultat);


// tout le reste
app.get('*', HomeController.NotFound);
app.post('*', HomeController.NotFound);

};
