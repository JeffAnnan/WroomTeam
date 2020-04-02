
let HomeController = require('./../controllers/HomeController');
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
    app.get('/pilotes', PiloteController.Pilotes);
    app.get('/ajout', PiloteController.AjoutPilote);
    app.post('/piloteAjoute', PiloteController.FinAjoutPilote);
    //app.get('/detailInfoPilote/:pilnum', PiloteController.DetailInfoPilote);

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
