import { sendEmail } from './email_controller';

const cleanDate = (day, date, month) => {
  const dateMonth = `${month}/${date}`;
  switch (day) {
    case 1:
      return `Mon ${dateMonth}`;
    case 2:
      return `Tue ${dateMonth}`;
    case 3:
      return `Wed ${dateMonth}`;
    case 4:
      return `Thu ${dateMonth}`;
    case 5:
      return `Fri ${dateMonth}`;
    case 6:
      return `Sat ${dateMonth}`;
    case 0:
      return `Sun ${dateMonth}`;
    default:
      return `Tue ${dateMonth}`;
  }
};

const findEmail = (fullName, namesAndEmails) => {
  let email = '';
  // eslint-disable-next-line consistent-return
  namesAndEmails.forEach((obj) => {
    Object.keys(obj).forEach((key) => {
      if (obj[key] === fullName) {
        email = obj['Personal Gmail'];
      }
    });
  });

  return email;
};

export const findDailyCleans = (data, namesAndEmails) => {
  const currentDay = new Date().getDay();
  const targetDate = cleanDate(currentDay, new Date().getDate(), new Date().getMonth() + 1);

  let foundKey = false;
  Object.keys(data[0]).forEach((key) => {
    if (key === targetDate) {
      foundKey = true;
    }
  });

  if (!foundKey) {
    console.log('Date that is not on sheet. Bye! ');
    return;
  }

  let firstNameKey = 'First Name';

  Object.keys(data).forEach((key) => {
    Object.keys(data[key]).forEach((key2) => {
      if (key2.match('First Name')) {
        firstNameKey = key2;
      }
    });
  });

  const namesCleaningWhat = [];

  Object.keys(data).forEach((key) => {
    if (data[key][targetDate] !== '') {
      const fullName = `${data[key][firstNameKey]} ${data[key]['Last Name']}`;
      namesCleaningWhat.push({
        name: fullName,
        body: `Hey there! Just a bump, today (${targetDate}) you're cleaning: ${data[key][targetDate]}`,
        to: findEmail(fullName, namesAndEmails),
      });
    }
  });

  namesCleaningWhat.forEach((obj) => {
    sendEmail(obj, targetDate);
  });
};

export const readInEmails = async (fs, csv, results) => {
  const namesAndEmails = [];
  let error = false;
  const readable = fs.createReadStream('src/namesAndEmails.csv');

  readable.on('error', (err) => {
    console.log(err);
    error = true;
  });

  const writeable = readable.pipe(csv());
  writeable.on('error', (err) => {
    console.log(err);
    error = true;
  });

  if (error) {
    console.log('There was an error reading the file. Are you sure you put it in the right place?');
  }

  writeable.on('data', (data) => { return namesAndEmails.push(data); })
    .on('end', () => {
      findDailyCleans(results, namesAndEmails);
    });
};

export const readInFile = async (fs, csv) => {
  const results = [];
  let error = false;
  const readable = fs.createReadStream('src/duties2.csv');

  readable.on('error', (err) => {
    console.log(err);
    error = true;
  });

  const writeable = readable.pipe(csv());
  writeable.on('error', (err) => {
    console.log(err);
    error = true;
  });

  if (error) {
    console.log('There was an error reading the file. Are you sure you put it in the right place?');
  }

  writeable.on('data', (data) => { return results.push(data); })
    .on('end', () => {
      readInEmails(fs, csv, results);
    });
};
