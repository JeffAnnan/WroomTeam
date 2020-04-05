// Controle les routes 
module.exports.AdminConnexion = function(request, response,next)
{
    if(!request.session.admin) // (redirection vers la page de connexion si l'utilisateur n'est pas connecté)
    {
        response.redirect('/');
        return;
    }
    next();
 };