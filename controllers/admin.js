const Product = require("../models/product");
const User = require("../models/user");

exports.getIndex = (req, res, next) => {
  res.render("admin/index", {
      pageTitle: "Admin Page",
      path: "/"
  });
};

exports.getUser = (req, res, next) => {
  User.find()
  .then(users => {
    //console.log(users);
    users = users.filter(u => u.delete_at == undefined);
    return res.render("admin/user-list", {
      pageTitle: "ALL USERS",
      users: users
  });
  })
};

exports.getEditUser = (req, res, next) => {
  const userId = req.params.userId;
  console.log("TCL: exports.getEditUser -> userId", userId);
  
  User.findById(userId)
  .then(user => {
    if (!user) {
      return res.redirect("/admin");
    }
    res.render("admin/user-edit", {
      pageTitle: "Edit user",
      user: user
    });
  })
  .catch(err => {
		console.log("TCL: exports.getEditUser -> err", err)
  });
};

exports.postEditUser = (req, res, next) => {
  const userId = req.body.userId;
  const emailUp = req.body.email;
  const birthdayUp = req.body.birthday;
  const phoneUp = req.body.phone;
  const roleUp = req.body.role;
  const addressUp = req.body.address;
  const delete_atUp = req.body.delete_at;
  const image = req.file;
  
	console.log("TCL: exports.postEditUser -> image", image);
  console.log("TCL: exports.postEditUser -> userId", userId);
  
  User.findById(userId)
  .then(user => {
    user.email = emailUp;
    user.birthday = birthdayUp;
    user.phone = phoneUp;
    user.role = roleUp;
    user.address = addressUp;
    user.delete_at = delete_atUp;
    user.update_at = Date();
    
    if (image) {
      user.imageUrl = "/" + image.path;
    } else {
      user.imageUrl = "https://ucarecdn.com/5d276379-552f-4a08-97e7-744a15f71477/ava.png";
    }

    return user.save();
  })
  .then(result => {
    console.log("Updated user!");
    return res.redirect("/admin/users");
  })
  .catch(err => {
		console.log("TCL: exports.getEditUser -> err", err)
  });
};

exports.postDeleteUser = (req, res, next) => {
  const userId = req.body.userId;
  const delete_atUp = new Date();
	console.log("TCL: exports.postDeleteUser -> delete_atUp", delete_atUp)
  
  User.findById(userId)
  .then(user => {
    user.delete_at = delete_atUp;
    return user.save();
  })
  .then(result => {
    console.log("Deleted user!");
    return res.redirect("/admin/users");
  })
  .catch(err => {
		console.log("TCL: exports.postDeleteUser -> err", err)
  });
};


exports.getProducts = (req, res, next) => {
  Product.find()
  .then(products => {
    res.render("admin/product-list", {
      pageTitle: "ALL PRODUCTS",
      products: products
  });
  })
};

exports.getAddProduct = (req, res, next) => {
  const list_cate = [];
  Product.find().exec(function(err, data){
    
    for (var product of data){
      var check = true;
      for( var x of list_cate){
        if(x == product.category){
          check = false;
          break;
        }
      }
      if(check == true){
        list_cate.push(product.category);
        //console.log(list_cate.length);
      }
    
    }
    res.render("admin/product-edit", {
      pageTitle: "ADD PRODUCT",
      editing: false,
      list_cate: list_cate
    });
    //console.log(list_cate.length);
  });
  
};

exports.postAddProduct = (req, res, next) => {
  const name = req.body.name;
  const category = req.body.category;
  const description = req.body.description;
  const price = req.body.price;
  const size = req.body.size;
  const sizeArr = size.split(",");
  const create_at = new Date();
  
  const image = req.file;

  if (image) {
    imageUrl = "/" + image.path;
  } else {
    imageUrl = "https://ucarecdn.com/5d276379-552f-4a08-97e7-744a15f71477/ava.png";
  }

  const product = new Product({
    name: name,
    category: category,
    description: description,
    price: price,
    size: sizeArr,
    imageUrl: imageUrl,
    create_at: create_at,
    userId: req.user
  });
  product.save();
  
  return res.redirect("/admin/products");
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/admin/products');
  }
  const productId = req.params.productId;
  console.log("TCL: exports.getEditProduct -> productId", productId);
  Product.findById(productId)
    .then(product => {
      if (!product) {
        return res.redirect('/admin/products');
      }
      Product.find().exec(function(err, data){
        const list_cate = [];
        for (var pro of data){
          var check = true;
          for( var x of list_cate){
            if((x == pro.category)){
              check = false;
              break;
            }
          }
          if(check == true){
            list_cate.push(pro.category);
            //console.log(list_cate.length);
          }
          
        }
        list_cate.splice(list_cate.indexOf(product.category), 1);
        //console.log(list_cate.length);
        res.render("admin/product-edit", {
        pageTitle: "EDIT PRODUCT",
        editing: editMode,
        product: product,
        list_cate: list_cate
        });
        
        //console.log(list_cate.length);
      });
      
    })
    .catch(err => {
			console.log("TCL: exports.getEditProduct -> err", err)  
    });
};

exports.postEditProduct = (req, res, next) => {
  const productId = req.body.productId;
	console.log("TCL: exports.postEditProduct -> productId", productId);

  const name = req.body.name;
  const category = req.body.category;
  const description = req.body.description;
  const price = req.body.price;
  const size = req.body.size;
  const sizeArr = size.split(",");
  const create_at = new Date();
  
  const image = req.file;

  if (image) {
    imageUrl = "/" + image.path;
  } else {
    imageUrl = "https://ucarecdn.com/5d276379-552f-4a08-97e7-744a15f71477/ava.png";
  }

  Product.findById(productId)
    .then(product => {
      if (!product) {
        return res.redirect('/admin/products');
      }
      
      product.name = name;
      product.category = category;
      product.description = description;
      product.price = price;
      product.size = sizeArr;
      product.imageUrl = imageUrl;
      product.create_at = create_at;
      product.userId = req.user;

      product.save();
      
      return res.redirect("/admin/products");
    })
    .catch(err => {
			console.log("TCL: exports.getEditProduct -> err", err)  
    });
};

exports.postDeleteProduct = (req, res, next) => {
  const productId = req.body.productId;
	console.log("TCL: exports.postDeleteProduct -> productId", productId)
  const delete_atUp = new Date();
	console.log("TCL: exports.postDeleteProduct -> delete_atUp", delete_atUp)
	
  
  Product.findById(productId)
  .then(product => {
    product.delete_at = delete_atUp;
    return product.save();
  })
  .then(result => {
    console.log("Deleted product!");
    return res.redirect("/admin/products");
  })
  .catch(err => {
		console.log("TCL: exports.postDeleteProduct -> err", err)
  });
};


exports.getOrders = (req, res, next) => {
  User.find()
      .populate("cart.items.productId")
    .then(users => {
      const orderList = [];
      for (let i = 0; i < users.length; i++) {
        let user = users[i];
        let productOrder = user.productOrder || []
        for (let i = 0; i < productOrder.length; i++){
          let items = productOrder[i].items;

          orderList.push({
            user: user.email,
            sumPrice: productOrder[i].sum,
            itemsOrder: items
          })
        }
      }
      console.log("Order List: ");
      console.log(orderList)
      res.render("admin/order-list", {
        pageTitle: "All Orders",
        path: "/",
        orders: orderList
      });
    })
    .catch(err => {
      console.log(err);
    });

};

