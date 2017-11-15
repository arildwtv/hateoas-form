const set = require('lodash.set');
const { compose } = require('./util');

const applyEmbedding = (embeddingName, embeddableResource) => resource => {
  if (!embeddableResource) {
    return resource;
  }

  return set(Object.assign({}, resource), `_embedded.${embeddingName}`, embeddableResource);
};

const applyLink = (rel, title, href) => resource => {
  return set(Object.assign({}, resource), `_links.${rel}`, { title, href });
};

const applyShipmentLink = (rel, title) => (contextPath, id) =>
  applyLink(rel, title, `${contextPath}/shipments/${id}`);

const applyManifestLink = (rel, title) => (contextPath, shipmentId) =>
  applyLink(rel, title, `${contextPath}/shipments/${shipmentId}/manifest`);

const applyGoodsLink = (rel, title) => (contextPath, shipmentId) =>
  applyLink(rel, title, `${contextPath}/shipments/${shipmentId}/goods`);

const applyGoodsItemLink = (rel, title) => (contextPath, shipmentId, goodsItemId) =>
  applyLink(rel, title, `${contextPath}/shipments/${shipmentId}/goods/${goodsItemId}`);

const toGoodsItemResource = (contextPath, shipmentId) => goodsItem =>
  compose(
    applyShipmentLink('shipment', 'Shipment')(contextPath, shipmentId),
    applyGoodsItemLink('self', 'Shipment goods')(contextPath, shipmentId, goodsItem.id)
  )(goodsItem);

module.exports = {
  applyEmbedding,
  applyLink,
  applyShipmentLink,
  applyManifestLink,
  applyGoodsLink,
  applyGoodsItemLink,
  toGoodsItemResource
};
