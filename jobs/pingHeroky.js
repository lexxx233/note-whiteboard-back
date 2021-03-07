const axios = require('axios');
const cron = require('node-cron');
const config = require('../config/config');

module.exports.start = () => {
  cron.schedule('*/7 * * * *', async () => {
    console.log('ping');
    await axios.get(config.frontUrl);
    await axios.get(config.backURL);
  });
};
