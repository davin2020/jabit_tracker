require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { graphqlHTTP } = require('express-graphql');
const mongoose = require('mongoose').set('debug', true);
const expressjwt = require('express-jwt');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//read from local .env file or Env Config Vars in Heroku Prod deployment
const DB_NAME = process.env.DB_NAME;
const AUTH_SECRET = process.env.JWT_SECRET; 
console.log(`Your port is ${process.env.PORT}`);

//for now always connect to Prod ie cloud db
if (process.env.NODE_ENV === 'production') {
    console.log('Connected to PROD Atlas Cloud DB');
    // console.log(process.env.MONGODB_URI);
    mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName: DB_NAME,
        //to get rid of deprecated warnings and to use findOneAndUpdate
        useFindAndModify: false,
    }) 
} 
else {
    console.log('Connected to dev but using same cloud Atlas DB');
    mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName: DB_NAME,
        //to get rid of deprecated warnings and to use findOneAndUpdate
        useFindAndModify: false,
    }) 
}
    //LATER check out these other optoins too
    // keepAlive: true,
    // useNewUrlParser: true,
    // useCreateIndex: true,

mongoose.connection.once('open', () => {
    console.log(`Connected to database: ${DB_NAME}`);
})

const jwtAuth = expressjwt( {
    //this turns key into token, must explicitly declare which hashing algorithm your using
    secret: AUTH_SECRET,
    credentialsRequired: false,
    algorithms: ['HS256']
});

app.use(jwtAuth);

// allow CORS from any URL, so Heroku deployment works
app.use(cors());
// app.use(cors({origin: "http://localhost:3033"}));

app.use('/graphql', graphqlHTTP({
    schema: require('./schema.js'),
    // graphiql: true
     graphiql: {
        defaultQuery: "# query {\n" +
            "#  users(email: 'marty@example.com') {\n" +
            "#    _id\n" +
            "#    fullname\n" +
            "#    email\n" +
            "#    password\n" +
            "#    dream_job\n" +
            "#    motivation\n" +
            "#    total_points\n" +
            "#  }\n" +
            "# }\n\n" 
        },
}))

// only users with jwt should be able to access this page
app.use('/dashboard', bodyParser.json(), jwtAuth, graphqlHTTP(req => ({
        schema: require('./schema.js'),
        context: {
            user: req.user
        }
    }))
)

app.use('/api', bodyParser.json(), jwtAuth, graphqlHTTP(req => ({
    schema: require('./schema.js'),
        context: {
            user: req.user
        }
    }))
)

//to test in Prod
app.get('/', function (req, res) {
  res.send('Jabit Tracker API - Hello World!')
})

const PORT = process.env.PORT || 4033;
app.listen(PORT, () => {
  console.warn(`Running a GraphQL API server at http://localhost:${PORT}/graphql`);
});