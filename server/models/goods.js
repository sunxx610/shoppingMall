var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var productSchema = new Schema({
  "id": String,
  "price": Number,
  "sku_list": [
    {
      "sku_id": String,
      "title": String,
      "sub_title": String,
      "price": Number,
      "limit_num": Number,
      "spec_json": {
        "image": String,
        "show_name": String
      },
      "ali_images": Array
    },
  ]
});

module.exports = mongoose.model('Good', productSchema);