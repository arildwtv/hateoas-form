const mongoose = require('mongoose');
const allergenSchema = require('./schema');

const AllergenModel = mongoose.model('Allergen', allergenSchema);

module.exports = AllergenModel;
