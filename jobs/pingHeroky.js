const axios = require('axios');
const cron = require('node-cron');
const config = require('../config/config');

module.exports.start = () => {
  cron.schedule('* * * * *', async () => {
    console.log('ping');
    await axios.default.get(config.frontUrl);
    const test = await axios.get(config.backURL);
  });
};
