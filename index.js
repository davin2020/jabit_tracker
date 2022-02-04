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

const DB_USERNAME = 'YOUR_USERNAME';
const DB_PASSWORD = 'YOUR_PASSWORD';
const DB_NAME = 'YOUR_DB_NAME';
const AUTH_SECRET = 'YOUR_SECRET';

//change these connectionDetails according to your MongoDB instance eg if using cloud DB like Atlas or localhost
//for atlas cloud db, but not working, need to use right protocol ie mongdb+srv !
const connectionDetails = 'mongodb+srv://' + DB_USERNAME + ':' + DB_PASSWORD + '@cluster0.ajaya.mongodb.net/' + DB_NAME ;


mongoose.connect(connectionDetails, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: DB_NAME,
    //to get rid of deprecated warnings and to use findOneAndUpdate
    useFindAndModify: false
})
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

// this is the URL & port from the Knowsys UI repo
app.use(cors({origin: "http://localhost:3033"}));

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

//only users with jwt should be able to access this page
// app.use('/user', bodyParser.json(), jwtAuth, graphqlHTTP(req => ({
//         schema: require('./schema.js'),
//         context: {
//             user: req.user
//         }
//     }))
// )

// app.use('/api', bodyParser.json(), jwtAuth, graphqlHTTP(req => ({
//     schema: require('./schema.js'),
//         context: {
//             user: req.user
//         }
//     }))
// )

app.listen(4033);
console.log('Running a GraphQL API server at http://localhost:4033/graphql');