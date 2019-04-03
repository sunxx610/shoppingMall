let express = require('express');
let router = express.Router();
let Goods = require('../models/goods');
let Users = require('../models/users');

require('./../util/util')

/* GET users listing. */
router.get('/', (req, res, next) => {
  res.send('respond with a resource');
});

//login
router.post('/login', (req, res, next) => {
  let _where = {
    userName: req.body.userName,
    userPwd: req.body.userPwd
  };
  let maxAge = req.body.rememberSign ? 1000 * 60 * 60 * 24 * 14 : -1;
  let usersModel = Users.findOne(_where);
  usersModel.exec((err, userDoc) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message
      })
    } else {
      if (userDoc) {
        res.cookie("userId", userDoc.userId, {
          path: '/',
          maxAge
        });
        res.cookie("userName", userDoc.userName, {
          path: '/',
          maxAge
        });
        res.json({
          status: '0',
          msg: '',
          result: {
            userName: userDoc.userName,
            userId: userDoc.userId
          }
        })
      } else {
        res.json({
          status: '2',
          msg: 'Username or password your typed is wrong.',
          result: ''
        })
      }
    }
  })

});

//logout
router.post("/logout", (req, res, next) => {
  res.cookie("userId", "", {
    path: '/',
    maxAge: -1
  });
  res.cookie("userName", "", {
    path: '/',
    maxAge: -1
  });
  res.json({
    status: '0',
    msg: '',
    result: ''
  })
});

//register
router.post('/register', (req, res, next) => {
  let userName = req.body.userName,
    userPwd = req.body.userPwd;
  let _where = {
    userName: userName,
  };
  let maxAge = req.body.rememberSign ? 1000 * 60 * 60 * 24 * 14 : -1;
  let usersModel = Users.findOne(_where);
  usersModel.exec((err, userDoc) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message
      })
    } else {
      if (userDoc) {
        res.json({
          status: '10002',
          msg: 'The username has been existed.',
          result: ''
        })
      } else {
        let userId = Math.floor((Math.random()+0.1) * 10000000000).toString();
        console.log('random',userId);
        Users.create({
          userId: userId,
          userName: userName,
          userPwd: userPwd,
          orderList:[],
          cartList:[],
          addressList:[]
        }).then((doc,len,err)=>{
          console.log('doc',doc)
          if(err){
            res.json({
              status: '1',
              msg: err.message
            })
          }else{
            res.cookie("userId", doc.userId, {
              path: '/',
              maxAge
            });
            res.cookie("userName", doc.userName, {
              path: '/',
              maxAge
            });
            res.json({
              status: '0',
              msg: '',
              result: {
                userName: req.cookies.userName,
                userId: doc.userId
              }
            });
          }
        });
      }
    }
  })

});

//check login
router.get("/checkLogin", (req, res, next) => {
  if (req.cookies.userId) {
    res.json({
      status: '0',
      msg: '',
      result: {
        userName: req.cookies.userName
      }
    });
  } else {
    res.json({
      status: '1',
      msg: 'You haven\'t login.',
      result: ''
    })
  }
});

//check cart list
router.get("/cartList", (req, res, next) => {
  let userId = req.cookies.userId;
  let usersModel = Users.findOne({userId});
  usersModel.exec((err, userDoc) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      })
    } else {
      if (userDoc) {
        res.json({
          status: '0',
          msg: '',
          result: userDoc.cartList
        })
      } else {

      }
    }
  })
});

//delete cart data
router.post("/delCart", (req, res, next) => {
  let userId = req.cookies.userId;
  let sku_id = req.body.itemId;
  let usersModel = Users.updateOne({userId}, {
    $pull: {
      'cartList': {sku_id}
    }
  });
  usersModel.exec((err, userDoc) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      })
    } else {
      if (userDoc) {
        res.json({
          status: '0',
          msg: '',
          result: ''
        })
      }
    }
  })
});

//edit cart data
router.post("/editCart", (req, res, next) => {
  let userId = req.cookies.userId;
  let sku_id = req.body.itemId;
  let itemCount = req.body.itemCount;
  let checked = req.body.checked;
  let exceedFlag = false;

  if (checked !== 1 && checked !== -1) {
    let usersModel = Users.updateOne({
      "userId": userId,
      "cartList.sku_id": sku_id
    }, {"cartList.$.checked": !checked});
    usersModel.exec((err, userDoc) => {
      if (err) {
        res.json({
          status: '1',
          msg: err.message,
          result: ''
        })
      } else {
        res.json({
          status: '0',
          msg: '',
          result: {
            exceedFlag,
            itemCount
          }
        })
      }
    })
  } else {
    let goodsModel = Goods.findOne({"sku_list.sku_id": sku_id}, {'sku_list.sku_id.$': 1});
    goodsModel.exec((err, doc) => {
      if (err) {
        res.json({
          status: '1',
          msg: err.message,
          result: ''
        })
      } else {
        if (doc) {
          let limit_num = doc.sku_list[0].limit_num;
          if (limit_num < itemCount) {
            itemCount = limit_num;
            exceedFlag = true;
            res.json({
              status: '0',
              msg: '',
              result: {
                exceedFlag,
                limit_num
              }
            })
          } else {
            let usersModel = Users.updateOne({
              "userId": userId,
              "cartList.sku_id": sku_id
            }, {"cartList.$.itemCount": itemCount});
            usersModel.exec((err, userDoc) => {
              if (err) {
                res.json({
                  status: '1',
                  msg: err.message,
                  result: ''
                })
              } else {
                res.json({
                  status: '0',
                  msg: '',
                  result: {
                    exceedFlag,
                    itemCount
                  }
                })
              }
            })
          }
        }
      }
    })
  }
});

//check all items in cart
router.post("/checkAll", (req, res, next) => {
  let userId = req.cookies.userId;
  let allChecked = req.body.allChecked;
  Users.findOne({userId}, (err, userDoc) => {
      if (err) {
        res.json({
          status: '1',
          msg: err.message,
          result: ''
        })
      } else {
        if (userDoc) {
          userDoc.cartList.forEach(item => {
            item.checked = !allChecked;
          });
          userDoc.save((err1, userDoc1) => {
            if (err1) {
              res.json({
                status: '1',
                msg: err.message,
                result: ''
              })
            } else {
              res.json({
                status: '0',
                msg: '',
                result: ''
              })
            }
          });
        }
      }
    }
  );
});


//delete all checked items in cart
router.post("/delAllChecked", (req, res, next) => {
  let userId = req.cookies.userId;
  let usersModel = Users.updateMany({userId}, {$pull: {cartList: {checked: true}}})
  usersModel.exec((err, userDoc) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      })
    } else {
      res.json({
        status: '0',
        msg: '',
        result: ''
      })
    }
  })
});

//check user Address list
router.get("/addressList", (req, res, next) => {
  let userId = req.cookies.userId;
  let userModel = Users.findOne({userId});
  userModel.exec((err, userDoc) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      })
    } else {
      if (userDoc) {
        res.json({
          status: '0',
          msg: '',
          result: userDoc.addressList
        })
      }
    }
  })
});


//set default address
router.post("/setDefaultAddress", (req, res, next) => {
  let userId = req.cookies.userId;
  let addressId = req.body.addressId;
  if (!addressId) {
    res.json({
      status: '1003',
      msg: 'Address id is not exist',
      result: ''
    })
  } else {
    let userModel = Users.findOne({userId});
    userModel.exec((err, userDoc) => {
      if (err) {
        res.json({
          status: '1',
          msg: err.message,
          result: ''
        })
      } else {
        let addressList = userDoc.addressList;
        addressList.forEach(item => {
          item.isDefault = item._id == addressId;
        });
        userDoc.save((err1, userDoc1) => {
          if (err) {
            res.json({
              status: '1',
              msg: err.message,
              result: ''
            })
          } else {
            res.json({
              status: '0',
              msg: '',
              result: userDoc1.addressList
            })
          }
        })

      }
    })
  }

});


//add new address
router.post("/addNewAddress", (req, res, next) => {
  let userId = req.cookies.userId;
  let newAddressInfo = req.body.newAddressInfo;
  let userModel = Users.findOne({userId});
  userModel.exec((err, userDoc) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      })
    } else {
      userDoc.addressList.push(newAddressInfo);
      if (newAddressInfo.isDefault) {
        userDoc.addressList.forEach((address, index) => {
          if (index < userDoc.addressList.length - 1)
            address.isDefault = false
        })
      }
      userDoc.save((err1, userDoc1) => {
        if (err) {
          res.json({
            status: '1',
            msg: err.message,
            result: ''
          })
        } else {
          res.json({
            status: '0',
            msg: '',
            result: userDoc1.addressList
          })
        }
      })
    }
  })

});


//edit address
router.post("/editAddress", (req, res, next) => {
  let userId = req.cookies.userId;
  let newAddressInfo = req.body.newAddressInfo;

  let userModel = Users.findOne({userId,});
  userModel.exec((err, userDoc) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      })
    } else {
      userDoc.addressList.forEach(address => {

        console.log(address._id, newAddressInfo._id)
        if (address._id == newAddressInfo._id) {
          address.name = newAddressInfo.name;
          address.streetName = newAddressInfo.streetName;
          address.streetName2 = newAddressInfo.streetName2;
          address.cityId = newAddressInfo.cityId;
          address.city = newAddressInfo.city;
          address.stateId = newAddressInfo.stateId;
          address.state = newAddressInfo.state;
          address.zipCode = newAddressInfo.zipCode;
          address.tel = newAddressInfo.tel;
          address.isDefault = newAddressInfo.isDefault;
        } else {
          if (newAddressInfo.isDefault) {
            address.isDefault = false
          }
        }
      });
      userDoc.save((err1, userDoc1) => {
        if (err1) {
          res.json({
            status: '1',
            msg: err.message,
            result: ''
          })
        } else {
          res.json({
            status: '0',
            msg: '',
            result: userDoc1.addressList
          })
        }
      })
    }
  })
});


//delete address
router.post("/delAddress", (req, res, next) => {
  let userId = req.cookies.userId;
  let _id = req.body._id;
  console.log('api id',typeof _id,_id)

  let userModel = Users.updateOne({userId}, {$pull: {addressList: {_id: _id}}});
  userModel.exec((err, userDoc) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      })
    } else {
      res.json({
        status: '0',
        msg: '',
        result: ''
      })
    }
  })
});


//get Payment Order
router.post("/payment", function (req, res, next) {
  var userId = req.cookies.userId,
    addressId = req.body.addressId,
    orderTotal = req.body.orderTotal,
    shippingFee = req.body.shippingFee,
    coupon = req.body.coupon
  Users.findOne({userId}, function (err, doc) {
    if (err) {
      res.json({
        status: "1",
        msg: err.message,
        result: ''
      });
    } else {
      var address = '', goodsList = [];
      //get shipping address info
      doc.addressList.forEach((item) => {
        if (addressId == item._id) {
          address = item;
        }
      });

      //get checked items in cart
      doc.cartList.filter((item) => {
        if (item.checked) {
          goodsList.push(item);
        }
      });

      var platform = '766';
      var r1 = Math.floor(Math.random() * 10);
      var r2 = Math.floor(Math.random() * 10);

      var sysDate = new Date().Format('MMddyyyyhhmmss');
      var createDate = new Date().Format('MM-dd-yyyy hh:mm:ss');
      var orderId = platform + r1 + sysDate + r2;
      var order = {
        orderId: orderId,
        orderTotal: orderTotal,
        shippingFee: shippingFee,
        coupon: coupon,
        addressInfo: address,
        goodsList: goodsList,
        orderStatus: '1',
        createDate: createDate
      };

      doc.orderList.push(order);

      doc.save(function (err1, doc1) {
        if (err1) {
          res.json({
            status: "1",
            msg: err.message,
            result: ''
          });
        } else {
          res.json({
            status: "0",
            msg: '',
            result: {
              orderId: order.orderId,
              orderTotal: order.orderTotal
            }
          });
        }
      });
    }
  })
});

//check order info by order Id
router.get("/orderDetails", function (req, res, next) {
  var userId = req.cookies.userId, orderId = req.query.orderId;
  Users.findOne({userId}, function (err, userDoc) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      });
    } else {
      var orderList = userDoc.orderList;
      if (orderList.length > 0) {
        let targetOrder = '';
        orderList.forEach((item) => {
          if (item.orderId == orderId) {
            targetOrder = item;
          }
        });
        if (targetOrder.orderTotal > 0) {
          res.json({
            status: '0',
            msg: '',
            result: {
              targetOrder,
            }
          })
        } else {
          res.json({
            status: '120002',
            msg: 'order is not exist',
            result: ''
          });
        }
      } else {
        res.json({
          status: '120001',
          msg: 'You don\'t have any orders',
          result: ''
        });
      }
    }
  })
});


//get filtered order info
router.get("/filteredOrderDetails", function (req, res, next) {
  let userId = req.cookies.userId;
  let timeRangeIndex = req.query.timeRangeIndex, status = req.query.status;
  let startDate = '', endDate = '';

  switch (timeRangeIndex) {
    case '0':
      startDate = new Date() - 1000 * 60 * 60 * 24 * 30 * 3;
      endDate = new Date();
      break;
    case '1':
      startDate = new Date(new Date().getFullYear(), 0, 1);
      endDate = new Date(new Date().getFullYear(), 11, 31);
      break;
    case '2':
      startDate = new Date(new Date().getFullYear() - 1, 0, 1);
      endDate = new Date(new Date().getFullYear() - 1, 11, 31);
      break;
    default:
      startDate = new Date(new Date().getFullYear() - 19, 0, 1);
      endDate = new Date(new Date().getFullYear() - 2, 11, 31);
  }

  console.log('start', typeof startDate, startDate),
    console.log('end', typeof endDate, endDate);

  Users.findOne({userId}, function (err, userDoc) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      });
    } else {
      let orderList = userDoc.orderList;
      if (orderList.length > 0) {
        let targetOrders = [];
        orderList.forEach((item) => {
          if (status == '0') {
            if (new Date(item.createDate) >= startDate && new Date(item.createDate) <= endDate) {
              targetOrders.push(item);
            }
          } else {
            if (item.orderStatus == status && new Date(item.createDate) >= startDate && new Date(item.createDate) <= endDate) {
              targetOrders.push(item);
            }
          }
        });
        if (targetOrders.length > 0) {
          res.json({
            status: '0',
            msg: '',
            result: {
              targetOrders,
            }
          })
        } else {
          res.json({
            status: '120002',
            msg: 'You don\'t have orders in selected time range and status',
            result: ''
          });
        }
      } else {
        res.json({
          status: '120001',
          msg: 'You don\'t have any orders',
          result: ''
        });
      }
    }
  })
});

module.exports = router;
