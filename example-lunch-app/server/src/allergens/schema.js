const { Schema } = require('mongoose');
const { ObjectId } = Schema;

const allergenSchema = new Schema({
  name: String
});

module.exports = allergenSchema;
