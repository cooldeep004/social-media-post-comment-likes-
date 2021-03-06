const express=require('express');
const app=express();
const cookieparser=require('cookie-parser');
const port=8000;
const expressLayout =require('express-ejs-layouts');
const db=require('./config/mongoose');

const session =require('express-session');
const passport=require('passport');
const passportLocal =require('./config/passport-local-strategy');
const passportJwt=require('./config/passport-jwt-strategy');
const passportGoogle=require('./config/passport-google-oauth2-strategy');
const MongoStore=require('connect-mongo')(session);
const sassMiddleware=require('node-sass-middleware');

//setup the chat server to be used 
const chatServer =require('http').Server(app);
const chatSocket=require('./config/chat_socket').chatSockets(chatServer);
chatServer.listen(5000);
console.log('chat server is runninr on port 5000');

const flash=require('connect-flash');
const customMware=require('./config/middleware');
app.use(sassMiddleware({
    src:'./assets/scss',
    dest:'./assets/css',
    debug:true,
    outputStyle:'extended',
    prefix:'/css'

}));
app.use(express.urlencoded());
app.use(cookieparser());
app.use(expressLayout);

//extract style and scripts
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);



//look for the assets file like css nd js
app.use(express.static('./assets'))
//make the uploads path avilable to browser
app.use('/uploads', express.static(__dirname + '/uploads'));
//set up the views
app.set('view engine','ejs');
app.set('views','./views');


app.use(session({
    name: 'kuquora',
    secret:'blahsomething',
    saveUninitialized:false, // not save if user is not login
    resave:false, //  do not change if nothing changes
    cookie:{
        maxAge:(1000*60*100)
    },
    store : new MongoStore(
        {
            mongooseConnection : db,
            autoRemove:'disabled'
        }, function(err){
            console.log(err || 'connect-mongodb setup ok');
        }
    )
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);

app.use(flash());
app.use(customMware.setFlash);

//use express router
app.use('/',require('./routes'));
// to run express server
app.listen(port,function(err){
    if(err){
        console.log(`error${err}`)
        return;  
    }
    // interpolation
    console.log(`port${port}`);
});
/*
npm init
npm install express  app.listen
create router and controllers
npm install ejs and set view engine
npm install express-ejs-layouts for partial and layouts _header and _footer
app.set layout extract to extract the styles
npm install mongoose to connect to database and fill mongoose.js 
to get the data from the form we use urlencoded to decode
app.use is a middleware
install cookie parser saving cookies 
install passport and passport -local passport-local-strategy.js
install express-session in index.js and app.use(session({
app.use(passport.initialize());
app.use(passport.session());
}))

*/