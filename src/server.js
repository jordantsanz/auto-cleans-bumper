/* eslint-disable no-await-in-loop */
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';
import morgan from 'morgan';
import * as EmailController from './controllers/email_controller';
import { readInFile } from './controllers/excel_controller';

const sgMail = require('@sendgrid/mail');

const csv = require('csv-parser');
const fs = require('fs');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);
// import * as EmailController from './controllers/email_controller';

// initialize
const app = express();

// enable/disable cross origin resource sharing if necessary
app.use(cors());

// enable/disable http request logging
app.use(morgan('dev'));

// enable only if you want templating
app.set('view engine', 'ejs');
// enable only if you want static assets from folder static
app.use(express.static('static'));

// this just allows us to render ejs from the ../app/views directory
app.set('views', path.join(__dirname, '../src/views'));

// enable json message body for posting data to API
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// additional init stuff should go before hitting the routing

// default index route
app.get('/', (req, res) => {
  res.send('hello world!');
});

const { CronJob } = require('cron');

// async function makeJob() {
//   const job = new CronJob('0 7 * * *', (async () => {
//     const prices = [];
//     const stocks = await StockController.getStocks();
//     console.log('stocks:', stocks);
//     for (let i = 0; i < stocks.length; i += 1) {
//       const open = await EmailController.checkPrice(stocks[i].name);
//       prices.push({ name: stocks[i].name, open });
//     }

//     console.log('You will see this message every minute');
//     console.log('-----');
//     console.log('prices', prices);
//     EmailController.sendEmail(prices);
//   }), null, true, 'America/Los_Angeles');
//   job.start();
// }

async function makeJob2() {
  const job = new CronJob('0 7 * * *', (async () => {
    EmailController.sendEmail();
    job.start();
  }));
}

// makeJob();
readInFile(fs, csv);

makeJob2();

// START THE SERVER
// =============================================================================
const port = process.env.PORT || 9090;
app.listen(port);

console.log(`listening on: ${port}`);
