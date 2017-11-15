const compose = require('../util').compose;
const { applyEmbedding, applyLink, applyShipmentLink, applyManifestLink, applyGoodsLink } = require('../rest');

const toResource = (contextPath, shipmentId, shipment) => manifest =>
  compose(
    applyEmbedding('shipment', shipment),
    applyManifestLink('self', 'Manifest')(contextPath, shipmentId),
    applyShipmentLink('shipment', 'Shipment')(contextPath, shipmentId)
  )(manifest);

module.exports = (shipments, manifests, goods, app, contextPath) => {
  app.get('/api/shipments/:shipmentId/manifest', (req, res) => {
    const shipment = shipments[req.params.shipmentId - 1];
  
    if (!shipment) {
      return res.status(404).send();
    }
  
    const manifest = manifests[shipment.manifestId - 1];
  
    if (!manifest) {
      return res.status(404).send();
    }
    
    res.send(toResource(contextPath, req.params.shipmentId, shipment)(manifest));
  });
  
  app.post('/api/shipments/:shipmentId/manifest', (req, res) => {
    const shipment = shipments[req.params.shipmentId - 1];
  
    if (!shipment) {
      return res.status(404).send();
    }
  
    if (manifests[shipment.manifestId - 1]) {
      return res.status(400).send();
    }
  
    const manifest = manifests.push(req.body);

    shipment.manifestId = manifests.length;
  
    res.send(toResource(contextPath, req.params.shipmentId, shipment)(manifest));
  });
  
  app.patch('/api/shipments/:shipmentId/manifest', (req, res) => {
    const shipment = shipments[req.params.shipmentId - 1];
  
    if (!shipment) {
      return res.status(404).send();
    }
  
    let manifest = manifests[shipment.manifestId - 1];
    
    if (!manifest) {
      return res.status(404).send();
    }
  
    manifest = Object.assign({}, manifest, req.body);
    manifests[shipment.manifestId - 1] = manifest;
  
    res.send(toResource(contextPath, req.params.shipmentId, shipment)(manifest));
  });
};
