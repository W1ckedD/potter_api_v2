exports.getAboutUs = (req, res, next) => {
    return res.render('about/about-us.ejs', {
        path: '/about-us'
    });
};

exports.getContacttUs = (req, res, next) => {
    return res.render('about/contact-us.ejs', {
        path: '/about-us'
    });
};

