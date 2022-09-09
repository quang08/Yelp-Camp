if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}//only need dotenv in development in production though as most hosting providers (e.g. Digital Ocean, Heroku, AWS) provide their own mechanism for you to safely inject environment variables into the environment that your application is running in.

const express = require('express');
const app = express();
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');//for layouts
const ExpressError = require('./utils/ExpressError');
const session = require('express-session');
const flash = require('connect-flash');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const isLoggedIn = require('./middleware');
const mongoSanitize = require('express-mongo-sanitize'); //Prevent Mongo Injection
const helmet = require('helmet'); //content security policy
const dbUrl = process.env.DB_URL||'mongodb://localhost:27017/yelp-camp' ; //MongoAtlas DB URL

const MongoDBStore = require('connect-mongo'); //To store Sessions in Mongo

//--------------------------------------MongoDB Setup: Connect Server with DB--------------------------------------
// 'mongodb://localhost:27017/yelp-camp'
mongoose.connect(dbUrl,{
    // useNewUrlParser: true,
    // useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

//---------------------------Express App Setup: Views folder - Dynamic Rendering---------------------------------
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

app.use(express.static(path.join(__dirname,'public')))//serve static assets
//this makes it possible to access the files in the public folder via http 
//and be rendered no matter out current directory

//Body Parser to parse content posted from a form
app.use(express.urlencoded({extended:true}));
//Method override for put/patch/delete
app.use(methodOverride('_method'));
//Esj Mate for layout
app.engine('ejs', ejsMate);
//Use express-mongo-sanitize preventing Mongo Injection
app.use(mongoSanitize());
//***************************************Sessions**************************************
const secret = process.env.SECRET || '08022003'

const store = MongoDBStore.create({
  mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,//resave after 24h
    crypto: {
        secret
    }
})

store.on("error",function(e){
  console.log('STORE ERROR',e);//error
})

const sessionConfig = {
    store,//store session now in Mongo
    name: 'session', //shouldnt use the default connect.sid name
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true, //security purpose: only accesible through HTTP, not JS since JS can be on the client side and inspectable
        // secure: true, //only accessible through HTTPS, even more secured. But for production only, in dev mode we cant use this since localhost is not HTTPS
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, //expires in one week
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig));
app.use(flash());

//Passport Configuration
app.use(passport.initialize());
app.use(passport.session())//persistent login, have to have session before this line is written
passport.use(new LocalStrategy(User.authenticate()));//activate authenticate() static method within Passport

passport.serializeUser(User.serializeUser()); //storing the user's info in the session
passport.deserializeUser(User.deserializeUser());//getting that user out of that session

//GLOBAL - HAVE ACCESS IN EVERY ROUTE
//What we store to the res.locals object is available for that request-response cycle only (e.g. for when we request an individual route and send a response for it).
app.use((req,res,next)=>{
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

//-------------------------------Content Security Policy(Helmet)--------------------------------

const scriptSrcUrls = [
 
    'https://stackpath.bootstrapcdn.com/',
    'https://api.tiles.mapbox.com/',
    'https://api.mapbox.com/',
    'https://kit.fontawesome.com/',
    'https://cdnjs.cloudflare.com/',
    'https://cdn.jsdelivr.net/',
    'https://code.jquery.com'
  ];
  const styleSrcUrls = [
    'https://kit-free.fontawesome.com/',
    'https://stackpath.bootstrapcdn.com/',
    'https://api.mapbox.com/',
    'https://api.tiles.mapbox.com/',
    'https://fonts.googleapis.com/',
    'https://use.fontawesome.com/',
    'https://cdn.jsdelivr.net/'
  ];
  const connectSrcUrls = [
    'https://api.mapbox.com/',
    'https://a.tiles.mapbox.com/',
    'https://b.tiles.mapbox.com/',
    'https://events.mapbox.com/'
  ];
  const fontSrcUrls = [];
  app.use(
    helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: [],
        connectSrc: ["'self'", ...connectSrcUrls],
        scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
        styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
        workerSrc: ["'self'", 'blob:'],
        objectSrc: [],
        imgSrc: [
          "'self'",
          'blob:',
          'data:',
          'https://res.cloudinary.com/dkdw3voic/', //SHOULD MATCH YOUR CLOUDINARY ACCOUNT!
          'https://images.unsplash.com/'
        ],
        fontSrc: ["'self'", ...fontSrcUrls]
      }
    })
  );


//-------------------------------------------ROUTER---------------------------------------------
const campgroundRoutes = require('./routes/campgrounds');
app.use('/campgrounds', campgroundRoutes);

const reviewRoutes = require('./routes/reviews');
app.use('/campgrounds/:id/reviews', reviewRoutes);

const userRoutes = require('./routes/users');
app.use('/', userRoutes);

app.use('/',(req,res)=>{
    res.render('home')
});

//----------------------------------------ERROR HANDLING----------------------------------------

//target all the request, if no request above is matched, this will run
app.all('*',(req,res,next)=>{
    next(new ExpressError('Page Not Found',404));//passing in the error
});
app.use((err,req,res,next)=>{
    const {statusCode = 500} = err;
    if(!err.message) err.message = "Something is Wrong"; //default message
    res.status(statusCode).render('error', {err});//catch the error that was passed in by next()
    //render the error.ejs file
})


//----------------------------------------------PORT----------------------------------------------
app.listen(3000,()=>{
    console.log("Serving on Port 3000")
});