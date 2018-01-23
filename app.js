const express = require('express');
const mongoose = require('mongoose');
// const path = require('path');
const exphbs = require('express-handlebars');
// const bodyParser = require('body-parser');
// const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');

// Load Models
require('./models/user');
require('./models/story');
// Passport Config
require('./config/passport')(passport);

// Load Routes
const auth = require('./routes/auth');
const index = require('./routes/index');

// Load Keys
const keys = require('./config/keys');


// Map global promises
mongoose.Promise = global.Promise;
// Mongoose Connect
mongoose.connect(keys.mongoURI, {
        useMongoClient: true
    })
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

const app = express();
// Handlebars Middleware
app.engine('handlebars', exphbs({
    helpers: {
        // truncate: truncate,
        // stripTags: stripTags,
        // formatDate: formatDate,
        // select: select,
        // editIcon: editIcon
    },
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

app.use(cookieParser());
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}));

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Set global vars
app.use((req, res, next) => {
    res.locals.user = req.user || null;
    next();
});

app.use('/', index);
app.use('/auth', auth);

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server started on port ${port}`)
});