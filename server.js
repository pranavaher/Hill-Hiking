const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', (err) => {
  // console.log('UNCAUGHT EXCEPTION! 💥 Shutting down');
  // console.log(err.name, err.message);
  console.log(err);
  process.exit(1);
});

dotenv.config({ path: './config.env' });
const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  //connecting to hosted DB
  .connect(DB, {
    // .connect(process.env.DATABASE_LOCAL, {  //connecting to local DB
    useNewUrlParser: true,
    // useCreateIndex: true,
    // useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB connection successful!!'));

// const testTour = new Tour({
//   name: 'The Park Camper 1',
//   price: 997,
// });

// testTour
//   .save()
//   .then((doc) => {
//     console.log(doc);
//   })
//   .catch((err) => {
//     console.log('Error💥: ', err);
//   });

// console.log(process.env);
// console.log(app.get('env'));

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

process.on('unhandledRejection', (err) => {
  console.log('Unhandled Rejection 💥 Shutting down');
  console.log(err);
  server.close(() => {
    process.exit(1);
  });
});
