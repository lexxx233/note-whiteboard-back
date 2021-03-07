const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const config = require('./config/config');
const router = require('./router/index');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use('/api', router);
app.use('/static', express.static('./static/'));
const port = config.appKey;
app.listen(port, () => {
  console.log('serve', port);
});
