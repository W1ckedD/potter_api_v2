const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const ConnectDB = require('./config/db');
const favicon = require('serve-favicon');

dotenv.config({ path: './config/config.env' });

ConnectDB();

const app = express();

const store = new MongoDBStore({
    uri: process.env.MONGODB_CONN_STR,
    collection: 'apiSessions',
});

// Middlewares
app.use(favicon(path.join(__dirname, 'public', 'img', 'favicon.ico')));
app.use(
    session({
        secret: process.env.SECRET_KEY,
        cookie: {
            maxAge: 1000 * 60 * 60 * 2,
        },
        store,
        resave: false,
        saveUninitialized: false,
    })
);
app.use(express.static(path.join(__dirname, 'public')));
app.use(morgan('dev'));

// Web Routes
app.use('/download-app', require('./routes/web/download'));
app.use('/docs', require('./routes/web/docs'));
app.use('/', require('./routes/web/about'));
app.use('/', require('./routes/web/auth'));
app.get('/', (req, res, next) => {
    return res.render('index/index.ejs', { path: '/' });
})

const { PORT, NODE_ENV } = process.env;

app.listen(PORT, () =>
    console.log(`Server listening in ${NODE_ENV} mode on port ${PORT}`)
);
