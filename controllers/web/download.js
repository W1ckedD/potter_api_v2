exports.getDownloadApp = (req, res, next) => {
    return res.render('download/download-app.ejs', {
        path: '/download-app'
    })
}