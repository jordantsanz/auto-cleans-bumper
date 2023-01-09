// SN Cleans Bumping Server
// Written poorly by Jordan Sanz '22 (Brother Sidewalk Slammers) during a finals period

import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';
import morgan from 'morgan';
import * as EmailController from './controllers/email_controller';
import { readInFile } from './controllers/excel_controller';

const FILENAME_TO_READ_FROM = 'duties2.csv';
const sgMail = require('@sendgrid/mail');
require('dotenv').config();

const csv = require('csv-parser');
const fs = require('fs');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// initialize
const app = express();

// enable/disable cross origin resource sharing if necessary
app.use(cors());

// enable/disable http request logging
app.use(morgan('dev'));

// this just allows us to render ejs from the ../app/views directory
app.set('views', path.join(__dirname, '../src/views'));

// enable json message body for posting data to API
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// default index route
app.get('/', (req, res) => {
  res.send('hello world!');
});

const { CronJob } = require('cron');

const job = new CronJob('0 7 * * *', (async () => {
  await readInFile(fs, csv, FILENAME_TO_READ_FROM);
  EmailController.sendEmail();
}));

function makeJob() {
  console.log('start job');
  job.start();
}

makeJob();

// START THE SERVER
// =============================================================================
const port = process.env.PORT || 9090;
app.listen(port);

console.log(`listening on: ${port}`);
