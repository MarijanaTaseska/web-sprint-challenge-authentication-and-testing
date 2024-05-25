const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const session = require('express-session')
const Store = require('connect-session-knex')(session)
const restrict = require('./middleware/restricted.js');

const authRouter = require('./auth/auth-router.js');
const jokesRouter = require('./jokes/jokes-router.js');

const server = express();

server.use(helmet());
server.use(cors());
server.use(express.json());
server.use(session({
    name: 'banana',
    secret: 'shh',
    cookie: {
        maxAge: 1000 * 60 * 60,
        secure: false,
        httpOnly: false,
    },
    rolling: true,
    resave: false,
    saveUninitialized: false,
    store:new Store({
        knex:require('../data/dbConfig.js'),
        tablename: ' sessions',
        sidfieldname: 'sid',
        createtable:true,
        clearInterval:1000 * 60 * 60,
    })
}))

server.use('/api/auth', authRouter);
server.use('/api/jokes', restrict, jokesRouter); // only logged-in users should have access!

module.exports = server;
