const { Types } = require('mongoose');
const AllergenModel = require('./model');
const {
  toAllergenCollectionResource,
  createAllergenCollectionHref,
  toAllergenResource,
  createAllergenHref
} = require('./rest');
const {
  throwNotFoundError,
  isNotFoundError
} = require('../rest');

module.exports = (app, rootUrl, contextPath) => {
  app.get(createAllergenCollectionHref(contextPath), (req, res) => {
    AllergenModel.find()
      .then(docs => {
        res.send(toAllergenCollectionResource(rootUrl)(docs.map(doc => doc.toObject())));
      })
      .catch(err => {
        console.error(err);
        res.send(err);
      });
  });

  app.post(createAllergenCollectionHref(contextPath), (req, res) => {
    const allergen = req.body;
    AllergenModel.create(allergen)
      .then(created => {
        res.status(201).location(createAllergenHref(rootUrl, created._id)).send();
      })
      .catch(err => {
        console.error(err);
        res.send(err);
      });
  });

  app.put(createAllergenHref(contextPath, ':id'), (req, res) => {
    AllergenModel.findById(req.params.id)
      .then(doc => {
        if (doc) {
          return doc.update(req.body);
        } else {
          throwNotFoundError();
        }
      })
      .then(() => AllergenModel.findById(req.params.id))
      .then(doc => res.send(toAllergenResource(rootUrl)(doc.toObject())))
      .catch(err => {
        console.error(err);

        if (isNotFoundError(err)) {
          res.status(404).send();
        } else {
          res.status(500).send();
        }
      });
  });

  app.get(createAllergenHref(contextPath, ':id'), (req, res) => {
    AllergenModel.findById(req.params.id)
      .then(doc => {
        if (doc) {
          res.send(toAllergenResource(rootUrl)(doc.toObject()));
        } else {
          throwNotFoundError();
        }
      })
      .catch(err => {
        console.error(err);

        if (isNotFoundError(err)) {
          res.status(404).send();
        } else {
          res.status(500).send();
        };
      });
  });

  app.delete(createAllergenHref(contextPath, ':id'), (req, res) => {
    AllergenModel.findById(req.params.id, (err, doc) => {
      if (doc) {
        doc.remove();
        res.send(toAllergenResource(rootUrl)(doc.toObject()));
      } else {
        res.status(404).send();
      }
    });
  });
};
