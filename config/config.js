require('dotenv').config();

module.exports = {
  appKey: process.env.APP_PORT,
  appPort: process.env.APP_PORT,
  frontUrl: process.env.FRONT_URL,
  backURL: process.env.BACK_URL,
};
