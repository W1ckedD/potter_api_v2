exports.getLogin = (req, res, next) => {
    return res.render('auth/login.ejs', {
        path: '/login'
    })
}

exports.getRegister = (req, res, next) => {
    return res.render('auth/register.ejs', {
        path: '/register'
    });
}