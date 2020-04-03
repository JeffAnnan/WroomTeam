
let HomeController = require('./../controllers/HomeController');
let AuthentificationController = require('./../controllers/AuthentificationController');
let ResultatController = require('./../controllers/ResultatController');
let EcurieController = require('./../controllers/EcurieController');
let PiloteController = require('./../controllers/PiloteController');
let CircuitController = require('./../controllers/CircuitController');
let SponsorController = require('./../controllers/SponsorController');

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
    app.get('/modif/:pilnum/:paynum/:ecunum?', AuthentificationController.AdminConnexion,PiloteController.ModifierPilote);
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
   app.get('/resultats', AuthentificationController.AdminConnexion,ResultatController.ListerResultat);
   app.get('/GrandPrix/:gpnum',AuthentificationController.AdminConnexion, ResultatController.DetailResultat);

 // Sponsors
   app.get('/sponsor', SponsorController.Sponsors);
   app.get('/ajoutSponsor', SponsorController.AjoutSponsor);
   app.post('/sponsorAjoute', SponsorController.FinAjoutSponsor);
   app.get('/modifSponsor/:sponum/:ecunum?', SponsorController.ModifSponsor);
   app.post('/sponsorModifie/:sponum/:ecunum?', SponsorController.FinModifSponsor);
   app.get('/supprSponsor/:sponum', SponsorController.SupprSponsor);





// tout le reste
app.get('*', HomeController.NotFound);
app.post('*', HomeController.NotFound);

};
