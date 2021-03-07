const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const config = require('./config/config');
const router = require('./router/index');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({ origin: '*' }));
app.use('/api', router);
app.use('/static', express.static('./static/'));
const port = config.appPort;
app.listen(port, () => {
  console.log('server', port || 3000);
});
require('./jobs/pingHeroky').start();
