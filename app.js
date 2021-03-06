const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const signUpRouter = require('./routes/signUp');
const signInRouter = require('./routes/signIn');
const projectRouter = require('./routes/project');
const activityRouter = require('./routes/activity');

const app = express();

// middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// route middleware
app.use('/sign-up', signUpRouter);
app.use('/sign-in', signInRouter);
app.use('/project', projectRouter);
app.use('/activity', activityRouter);

module.exports = app;
