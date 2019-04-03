let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
let Goods = require('../models/goods');
let Users = require('../models/users');


mongoose.connect('mongodb://127.0.0.1:27017/shoppingMall');

mongoose.connection.on("connected", () => {
  console.log("MongoDB connected successful.")
});
mongoose.connection.on("error", () => {
  console.log("MongoDB connected error.")
});
mongoose.connection.on("disconnected", () => {
  console.log("MongoDB disconnected.")
});

//get goods data
router.get('/', (req, res, next) => {
  let id = req.query.id;
  let _where = {};
  let _sort = {};
  let page = parseInt(req.query.page);
  let limit = parseInt(req.query.limit);
  let sort = parseInt(req.query.sort);
  let cate = req.query.cate;
  let attr = req.query.attr;
  let priceRange = req.query.priceRange;
  let skip = (page - 1) * limit;
  let priceGt = '';
  let priceLte = '';
  let cateGt = '';
  let cateLte = '';
  if (id) {
    _where.id = id;
  }
  if (cate != '0' && cate) {
    switch (cate) {
      case '1':
        cateGt = 1000300;
        cateLte = 1000399;
        break;
      case '2':
        cateGt = 1000200;
        cateLte = 1000299;
        break;
      case '3':
        cateGt = 1000500;
        cateLte = 1000599;
        break;
      case '4':
        cateGt = 1000400;
        cateLte = 1000499;
        break;
      case '5':
        cateGt = 1000600;
        cateLte = 1000699;
        break;
    }
    _where.id = {
      $gt: cateGt,
      $lte: cateLte
    }
  }
  if (priceRange != 'all' && priceRange) {
    switch (priceRange) {
      case '0':
        priceGt = 0;
        priceLte = 250;
        break;
      case '1':
        priceGt = 250;
        priceLte = 500;
        break;
      case '2':
        priceGt = 500;
        priceLte = 750;
        break;
      case '3':
        priceGt = 750;
        priceLte = 1000;
        break;
      case '>1000':
        priceGt = 1000;
        break;
    }
    _where.price = {
      $gt: priceGt,
      $lte: priceLte
    }
  }

  let goodsModel = Goods.find(_where).limit(limit).skip(skip);
  if (sort && attr) {
    _sort[attr] = sort;
    goodsModel.sort(_sort);
  }

  goodsModel.exec((err, doc) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message
      })
    } else {

      res.json({
        status: '0',
        msg: '',
        result: {
          count: doc.length,
          list: doc
        }
      })
    }
  })
});

//add goods to cart
router.post("/addCart", (req, res, next) => {
  let userId = req.cookies.userId, itemId = req.body.itemId, addCount = req.body.addCount,limit_num = '';
  let usersModel = Users.findOne({userId});
  let goodsModel = Goods.findOne({"sku_list.sku_id": itemId}, {'sku_list.sku_id.$': 1});
  goodsModel.exec((err, doc) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message
      })
    } else {
      limit_num = doc.sku_list[0].limit_num;
      let exceedFlag = (addCount > limit_num);
      addCount = Math.min(addCount, limit_num);

      usersModel.exec((err, userDoc) => {
        if (err) {
          res.json({
            status: '1',
            msg: err.message
          })
        } else {
          if (userDoc) {
            let goodsItem = '';
            userDoc.cartList.forEach(item => {
              if (item.sku_id == itemId) {
                goodsItem = item;
                item.itemCount += addCount;
                if (item.itemCount > limit_num) {
                  item.itemCount = limit_num;
                  exceedFlag = true;
                }
              }
            });
            if (goodsItem) {
              userDoc.save((err2, doc2) => {
                if (err2) {
                  res.json({
                    status: '1',
                    msg: err2.message
                  })
                } else {
                  res.json({
                    status: '0',
                    msg: '',
                    result: {
                      count: doc2.cartList.length,
                      list: doc2.cartList,
                      exceedFlag: exceedFlag,
                      limit_num
                    }
                  })
                }
              });
            } else {
              goodsModel.exec((err1, doc) => {
                if (err1) {
                  res.json({
                    status: '1',
                    msg: err1.message
                  })
                } else {
                  if (doc) {
                    userDoc.cartList.push({
                      sku_id: doc.sku_list[0].sku_id,
                      title: doc.sku_list[0].title,
                      price: doc.sku_list[0].price,
                      limit_num: doc.sku_list[0].limit_num,
                      show_name: doc.sku_list[0].spec_json.show_name,
                      ali_image: doc.sku_list[0].ali_images[0],
                      checked: true,
                      itemCount: addCount,
                    });
                    userDoc.save((err2, doc2) => {
                      if (err2) {
                        res.json({
                          status: '1',
                          msg: err2.message
                        })
                      } else {
                        console.log(typeof doc2)
                        res.json({
                          status: '0',
                          msg: '',
                          result: {
                            count: doc2.length,
                            list: doc2.cartList,
                            exceedFlag: exceedFlag,
                            limit_num: doc.limit_num
                          }
                        })
                      }
                    });
                  } else {

                  }
                }
              })
            }


          }
        }
      })
    }
  });

});


module.exports = router;