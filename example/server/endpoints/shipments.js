const { compose } = require('../util');
const { applyEmbedding, applyLink, applyShipmentLink, applyManifestLink, applyGoodsLink, applyGoodsItemLink, toGoodsItemResource } = require('../rest');

const applyGoodsEmbedding = (contextPath, id, goods) => shipment => {
  const goodsForShipment = goods.filter(goodsItem =>
    parseInt(goodsItem.shipmentId, 10) === parseInt(id, 10));

  if (!goodsForShipment) {
    return shipment;
  }

  const goodsCollectionResource = compose(
    applyEmbedding(
      'item',
      goodsForShipment.map((goodsItem, index) => toGoodsItemResource(contextPath, id)(goodsItem))
    ),
    applyLink('self', 'Shipment goods', `${contextPath}/shipments/${id}/goods`)
  )({});

  return applyEmbedding('goods', goodsCollectionResource)(shipment);
};

const applyManifestEmbedding = (contextPath, shipmentId, manifests) => shipment => {
  const manifest = manifests[shipment.manifestId - 1];

  if (!manifest) {
    return shipment;
  }

  const manifestResource = compose(
    applyManifestLink('self', 'Manifest')(contextPath, shipmentId)
  )(manifest);

  return applyEmbedding('manifest', manifestResource)(shipment);
};

const toResource = (contextPath, id, manifests, goods) =>
  compose(
    applyShipmentLink('self', 'Shipment')(contextPath, id),
    applyManifestLink('manifest', 'Shipment Manifest')(contextPath, id),
    applyGoodsLink('goods', 'Shipment goods')(contextPath, id),
    applyGoodsEmbedding(contextPath, id, goods),
    applyManifestEmbedding(contextPath, id, manifests)
  );

module.exports = (shipments, manifests, goods, app, contextPath) => {
  app.get('/api/shipments', (req, res) => {
    const shipmentCollectionResource = compose(
      applyEmbedding(
        'shipments',
        shipments.map((shipment, index) => toResource(contextPath, index + 1, manfiests, goods)(shipment))
      ),
      applyLink('self', 'Shipments', `${contextPath}/shipments`)
    )({});

    res.send(shipmentCollectionResource);
  });
  
  app.post('/api/shipments', (req, res) => {
    const shipment = req.body;
  
    if (!shipment.departure) {
      return res.status(400).send({
        departure: [
          {
            key: 'shipment.departure.required',
            defaultMessage: 'Shipment departure is required'
          }
        ]
      });
    }

    shipments.push(shipment);
  
    res.send(toResource(contextPath, shipments.length, manifests, goods)(shipment));
  });
  
  app.get('/api/shipments/:shipmentId', (req, res) => {
    const shipment = shipments[req.params.shipmentId - 1];
  
    if (!shipment) {
      return res.status(404).send();
    }
    
    res.status(200).send(toResource(contextPath, req.params.shipmentId, manifests, goods)(shipment));
  });
  
  app.patch('/api/shipments/:shipmentId', (req, res) => {
    let shipment = shipments[req.params.shipmentId - 1];
    
    if (!shipment) {
      return res.status(404).send();
    }
  
    shipment = Object.assign({}, shipment, req.body);
    shipments[req.params.shipmentId - 1] = shipment;
    
    res.send(toResource(contextPath, req.params.shipmentId, manifests, goods)(shipment));
  });
};
