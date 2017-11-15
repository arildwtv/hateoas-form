const { compose } = require('../util');
const { applyEmbedding, applyLink, applyShipmentLink, applyManifestLink, applyGoodsItemLink, toGoodsItemResource } = require('../rest');


module.exports = (shipments, manifests, goods, app, contextPath) => {
  app.get('/api/shipments/:shipmentId/goods', (req, res) => {
    const shipment = shipments[req.params.shipmentId - 1];
    
    if (!shipment) {
      return res.status(404).send();
    }

    const goodsForShipment = goods.filter(goodsItem =>
      parseInt(goodsItem.shipmentId, 10) === parseInt(req.params.shipmentId, 10));
    
    const goodsCollectionResource = compose(
      applyEmbedding(
        'item',
        goods.map((goodsItem, index) => toGoodsItemResource(contextPath, req.params.shipmentId)(goodsItem))
      ),
      applyLink('self', 'Shipment goods', `${contextPath}/shipments/${req.params.shipmentId}/goods`)
    )({});

    res.send(goodsCollectionResource);
  });

  app.post('/api/shipments/:shipmentId/goods', (req, res) => {
    const shipment = shipments[req.params.shipmentId - 1];
    
    if (!shipment) {
      return res.status(404).send();
    }
    
    const goodsItem = req.body;
    
    if (!goodsItem.description) {
      return res.status(400).send({
        description: [
          {
            key: 'goods.description.required',
            defaultMessage: 'Shipment goods description is required'
          }
        ]
      });
    }

    const newGoodsItem = Object.assign({}, goodsItem, {
      id: goods.length + 1,
      shipmentId: parseInt(req.params.shipmentId, 10)
    });

    goods.push(newGoodsItem);

    const goodsItemResource = toGoodsItemResource(contextPath, req.params.shipmentId)(newGoodsItem);

    res.send(goodsItemResource);
  });

  app.post('/api/shipments/:shipmentId/goods', (req, res) => {
    const shipment = shipments[req.params.shipmentId - 1];
    
    if (!shipment) {
      return res.status(404).send();
    }
    
    const goodsItem = req.body;
    
    if (!goodsItem.description) {
      return res.status(400).send({
        description: [
          {
            key: 'description.required',
            defaultMessage: 'Shipment goods description is required'
          }
        ]
      });
    }

    const newGoodsItem = Object.assign({}, goodsItem, {
      id: goods.length + 1,
      shipmentId: parseInt(req.params.shipmentId, 10)
    });

    goods.push(newGoodsItem);

    const goodsItemResource = toGoodsItemResource(contextPath, req.params.shipmentId)(newGoodsItem);

    res.send(goodsItemResource);
  });

  app.get('/api/shipments/:shipmentId/goods/:goodsItemId', (req, res) => {
    const shipment = shipments[req.params.shipmentId - 1];
    
    if (!shipment) {
      return res.status(404).send();
    }

    const goodsItem = goods.filter(goodsItem =>
      parseInt(goodsItem.shipmentId, 10) === parseInt(req.params.shipmentId, 10))
      .find(goodsItem => parseInt(goodsItem.id, 10) === parseInt(req.params.goodsItemId, 10));
    
    if (!goodsItem) {
      return res.status(404).send();
    }

    res.send(toGoodsItemResource(contextPath, req.params.shipmentId)(goodsItem));
  });
  
  app.patch('/api/shipments/:shipmentId/goods/:goodsItemId', (req, res) => {
    const shipment = shipments[req.params.shipmentId - 1];
    
    if (!shipment) {
      return res.status(404).send();
    }
    
    const goodsItemIndex = goods.findIndex(goodsItem =>
      parseInt(goodsItem.shipmentId, 10) === parseInt(req.params.shipmentId, 10) &&
        parseInt(goodsItem.id, 10) === parseInt(req.params.goodsItemId, 10));
    
    if (goodsItemIndex < 0) {
      return res.status(404).send();
    }
    
    const goodsItem = goods[goodsItemIndex];

    const updatedGoodsItem = Object.assign({}, goodsItem, req.body);
    
    if (!updatedGoodsItem.description) {
      return res.status(400).send({
        description: [
          {
            key: 'description.required',
            defaultMessage: 'Shipment goods description is required'
          }
        ]
      });
    }

    goods[goodsItemIndex] = updatedGoodsItem;

    res.send(toGoodsItemResource(contextPath, req.params.shipmentId)(updatedGoodsItem));
  });
};