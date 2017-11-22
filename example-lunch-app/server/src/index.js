const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// HATEOAS utilities.
const { compose } = require('./util');
const { applyLink } = require('./rest');
const {
  applyAllergenCollectionLink,
  applyFindAllergenLink
} = require('./allergens/rest');
const {
  applyMealPlanCollectionLink,
  applyFindMealPlanLink,
  applyCurrentMealPlanLink
} = require('./meal-plans/rest');

// Server configuration.
const host = process.env.HOST || 'localhost';
const port = process.env.PORT || 3001;
const proxyPort = process.env.PROXY_PORT || 3000;
const contextPath = '/api';
const rootUrl = `http://${host}:${proxyPort}${contextPath}`;

const app = express();
app.use(bodyParser.json());

mongoose.connect(process.env.MONGODB_URI);

app.get(contextPath, (req, res) => {
  res.send(compose(
    applyLink('self', 'API', rootUrl),
    applyAllergenCollectionLink('allergens', 'Allergens')(rootUrl),
    applyFindAllergenLink('findAllergen', 'Find Allergen By ID')(rootUrl),
    applyMealPlanCollectionLink('mealPlans', 'Meal Plans')(rootUrl),
    applyFindMealPlanLink('findMealPlan', 'Find Meal Plan By Week')(rootUrl),
    applyCurrentMealPlanLink('currentMealPlan', 'Meal Plan Current Week')(rootUrl)
  )({}));
});

require('./meal-plans/endpoints')(app, rootUrl, contextPath);
require('./allergens/endpoints')(app, rootUrl, contextPath);

app.listen(port, () => {
  console.log('Example app listening on port', port);
});