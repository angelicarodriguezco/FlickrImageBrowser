const authMiddleWare = (request, response, next) => {
    if (request.session && request.session.username) {
        next();
    } else {
        response.redirect('/login');
    }
}

module.exports  = {
    authMiddleWare
}