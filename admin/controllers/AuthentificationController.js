module.exports.AdminConnexion = function(request, response,next)
{
    if(!request.session.admin)
    {
        response.redirect('/');
        return;
    }
    next();
 };