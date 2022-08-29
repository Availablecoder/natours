const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: './config.env' });
const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB connection successful'));

const port = process.env.PORT || 3000;
const server = app.listen(port, '127.0.0.1', () => {
  console.log(`App is running on port ${port}...`);
});

// Handle Asynchronomus unhandled Rejections
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION Shutting down...');
  // console.log(err.name, err.message);
  console.log(err);

  // Closing server before exiting the program
  server.close(() => {
    process.exit(1);
  });
});
