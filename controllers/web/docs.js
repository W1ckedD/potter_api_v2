exports.getDocs = (req, res, next) => {
    return res.render('docs/docs.ejs', {
        path: '/docs'
    })
}