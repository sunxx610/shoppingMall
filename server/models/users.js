var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  "userId": String,
  "userName": String,
  "userPwd": String,
  "orderList": [
    {
      "orderId": String,
      "orderTotal": Number,
      "shippingFee":Number,
      "coupon":Number,
      "addressInfo": {
        "name": String,
        "streetName": String,
        "streetName2": String,
        "cityId": String,
        "city": String,
        "stateId": String,
        "state": String,
        "zipCode": String,
        "tel": String,
        "isDefault": Boolean,
      },
      "goodsList": [
        {
          "sku_id": String,
          "title": String,
          "price": String,
          "limit_num": String,
          "show_name": String,
          "ali_image": String,
          "checked": String,
          "itemCount": Number
        },
      ],
      "orderStatus": Number,
      "createDate": String
    }
  ],
  "cartList": [
    {
      "sku_id": String,
      "title": String,
      "price": Number,
      "limit_num": Number,
      "show_name": String,
      "ali_image": String,
      "checked": Boolean,
      "itemCount": Number,
    }
  ],
  "addressList": [
    {
      "name": String,
      "streetName": String,
      "streetName2": String,
      "city": String,
      "cityId": String,
      "state": String,
      "stateId": String,
      "zipCode": String,
      "tel": String,
      "isDefault": Boolean
    }
  ]
});

module.exports = mongoose.model('User', userSchema);