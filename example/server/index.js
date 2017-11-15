const express = require('express');
const bodyParser = require('body-parser');

const host = process.env.HOST || 'localhost';
const port = process.env.PORT || 3001;
const proxyPort = process.env.PROXY_PORT || 3000;
const contextPath = `http://${host}:${proxyPort}/api`;

const app = express();
app.use(bodyParser.json());

const shipments = [];
const manifests = [];
const goods = [];

shipments.push({ departure: '2010-10-09T12:03Z', manifestId: 1 });
manifests.push({ placeOfEntry: 'Svinesund, SWE' });
shipments.push({ departure: '2010-10-12T12:03Z' });
goods.push({ shipmentId: 1, description: 'Meat', id: 1 });

app.get('/api', (req, res) => {
  res.send({
    _links: {
      self: {
        href: contextPath,
        title: 'API'
      },
      shipments: {
        href: `${contextPath}/shipments`,
        title: 'Shipments'
      }
    }
  });
});

require('./endpoints/shipments')(shipments, manifests, goods, app, contextPath);
require('./endpoints/manifests')(shipments, manifests, goods, app, contextPath);
require('./endpoints/goods')(shipments, manifests, goods, app, contextPath);

app.listen(port, () => {
  console.log('Example app listening on port', port);
});