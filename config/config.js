require('dotenv').config();

module.exports = {
  appKey: process.env.PORT,
  appPort: process.env.PORT,
  frontUrl: process.env.FRONT_URL,
  backURL: process.env.BACK_URL,
};
