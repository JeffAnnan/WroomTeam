
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
    app.post('/piloteModifie/:pilnum', PiloteController.FinModifierPilote);

    // supprimer
    app.get('/supp/:pilnum', AuthentificationController.AdminConnexion, PiloteController.SupprimerPilote);

 // circuits
   app.get('/circuits', CircuitController.Circuits);
   app.get('/ajoutCircuit', CircuitController.AjoutCircuit);
   app.post('/circuitAjoute', CircuitController.FinAjoutCircuit);
   app.get('/modifCircuit/:cirnum/:paynum', CircuitController.ModifCircuit);
   app.post('/circuitModifie/:cirnum', CircuitController.FinModifCircuit);
   app.get('/supprCircuit/:cirnum', CircuitController.SupprCircuit);

// Ecuries
   app.get('/ecuries', EcurieController.ListerEcurie);
   app.get('/ajoutEcurie', EcurieController.AjoutEcurie);
   app.post('/ecurieAjoute', EcurieController.FinAjoutEcurie);
   app.get('/modifEcurie/:ecunum/:paynum', EcurieController.ModifEcurie);
   app.post('/ecurieModifie/:ecunum', EcurieController.FinModifEcurie);
   app.get('/supprEcurie/:ecunum', EcurieController.SupprEcurie);

 //Résultats
   app.get('/resultats', ResultatController.ListerResultat);
   app.get('/GrandPrix/:gpnum', ResultatController.DetailResultat);




// tout le reste
app.get('*', HomeController.NotFound);
app.post('*', HomeController.NotFound);

};
