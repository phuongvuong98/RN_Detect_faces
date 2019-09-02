const Product = require("../models/product");

function postKind(products, kindFilter, kind) {
    var newProd = products.filter(i => i.category == kind);
    if (kindFilter.includes("filter-P-0-50")) {
        newProd = newProd.filter(i => (parseFloat(i.price) >= 0 && parseFloat(i.price) <= 50));
    }
    if (kindFilter.includes("filter-P-50-100")) {
        newProd = newProd.filter(i => (parseFloat(i.price) >= 50 && parseFloat(i.price) <= 100));
    }
    if (kindFilter.includes("filter-P-100+")) {
        newProd = newProd.filter(i => (parseFloat(i.price) > 100));
    }
    if (kindFilter.includes("filter-SB-LH")) {
        newProd.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    }
    if (kindFilter.includes("filter-SB-HL")) {
        newProd.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
    }
    return newProd;
};
exports.getWomen = (req, res, next) => {
    Product.find()
    .then(products => {
        // thay doi product tuy vao chuc nang
        console.log(products[0]);
        var newProd = products.filter(i => i.category == "women");
        // console.log(newProd);
        return res.render("shop/products", {
            path: "/product",
            pageTitle: "Women",
            products: newProd,
            kind: "women",
            kindFilter: [""],
            userr: req.user
        });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.postWomen = (req, res, next) => {
    var kindFilter = req.body.kindFilter;
    var kindFilterEdit = req.body.kindFilterEdit;
    if (typeof kindFilter === 'string') {
        kindFilter = kindFilter.split(',');
    }
    kindFilter = kindFilter.filter(i => (i !== ""));
    kindFilter = kindFilter.filter(i => (i !== kindFilterEdit));

    Product.find()
        .then(products => {
            // thay doi product tuy vao chuc nang
            return postKind(products, kindFilter, "women");
        })
        .then(newProd => {
            if (kindFilter.length == 0) kindFilter.push("");
            console.log("kindFilter_new:", kindFilter);
            return res.render("shop/products", {
                path: "/products",
                pageTitle: "Women",
                products: newProd,
                kind: "women",
                kindFilter: kindFilter,
                userr: req.user
            });
        })
        .catch(err => {
          console.log(err);
        });
};

exports.getMen = (req, res, next) => {
    Product.find()
    .then(products => {
        var newProd = products.filter(i => i.category == "men");
        return res.render("shop/products", {
            path: "/product",
            pageTitle: "Men",
            products: newProd,
            kind: "men",
            kindFilter: [""],
            userr: req.user
        });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.postMen = (req, res, next) => {
    var kindFilter = req.body.kindFilter;
    var kindFilterEdit = req.body.kindFilterEdit;
    if (typeof kindFilter === 'string') kindFilter = kindFilter.split(',');
    kindFilter = kindFilter.filter(i => (i !== ""));
    kindFilter = kindFilter.filter(i => (i !== kindFilterEdit));

    Product.find()
        .then(products => {
            return postKind(products, kindFilter, "men");
        })
        .then(newProd => {
            if (kindFilter.length == 0) kindFilter.push("");
            console.log("kindFilter_new:", kindFilter);
            return res.render("shop/products", {
                path: "/products",
                pageTitle: "Men",
                products: newProd,
                kind: "men",
                kindFilter: kindFilter,
                userr: req.user
            });
        })
        .catch(err => {
          console.log(err);
        });
};

exports.getBag = (req, res, next) => {
    Product.find()
    .then(products => {
        var newProd = products.filter(i => i.category == "bag");
        return res.render("shop/products", {
            path: "/product",
            pageTitle: "Bag",
            products: newProd,
            kind: "bag",
            kindFilter: [""],
            userr: req.user
        });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.postBag = (req, res, next) => {
    var kindFilter = req.body.kindFilter;
    var kindFilterEdit = req.body.kindFilterEdit;
    if (typeof kindFilter === 'string') kindFilter = kindFilter.split(',');
    kindFilter = kindFilter.filter(i => (i !== ""));
    kindFilter = kindFilter.filter(i => (i !== kindFilterEdit));

    Product.find()
        .then(products => {
            return postKind(products, kindFilter, "bag");
        })
        .then(newProd => {
            if (kindFilter.length == 0) kindFilter.push("");
            console.log("kindFilter_new:", kindFilter);
            return res.render("shop/products", {
                path: "/products",
                pageTitle: "Bag",
                products: newProd,
                kind: "bag",
                kindFilter: kindFilter,
                userr: req.user
            });
        })
        .catch(err => {
          console.log(err);
        });
};

exports.getShoes = (req, res, next) => {
    Product.find()
    .then(products => {
        var newProd = products.filter(i => i.category == "shoes");
        return res.render("shop/products", {
            path: "/product",
            pageTitle: "Shoes",
            products: newProd,
            kind: "shoes",
            kindFilter: [""],
            userr: req.user
        });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.postShoes = (req, res, next) => {
    var kindFilter = req.body.kindFilter;
    var kindFilterEdit = req.body.kindFilterEdit;
    if (typeof kindFilter === 'string') kindFilter = kindFilter.split(',');
    kindFilter = kindFilter.filter(i => (i !== ""));
    kindFilter = kindFilter.filter(i => (i !== kindFilterEdit));

    Product.find()
        .then(products => {
            return postKind(products, kindFilter, "shoes");
        })
        .then(newProd => {
            if (kindFilter.length == 0) kindFilter.push("");
            console.log("kindFilter_new:", kindFilter);
            return res.render("shop/products", {
                path: "/products",
                pageTitle: "Shoes",
                products: newProd,
                kind: "shoes",
                kindFilter: kindFilter,
                userr: req.user
            });
        })
        .catch(err => {
          console.log(err);
        });
};

exports.getWatches = (req, res, next) => {
    Product.find()
    .then(products => {
        var newProd = products.filter(i => i.category == "watches");
        return res.render("shop/products", {
            path: "/product",
            pageTitle: "Watches",
            products: newProd,
            kind: "watches",
            kindFilter: [""],
            userr: req.user
        });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.postWatches = (req, res, next) => {
    var kindFilter = req.body.kindFilter;
    var kindFilterEdit = req.body.kindFilterEdit;
    if (typeof kindFilter === 'string') kindFilter = kindFilter.split(',');
    kindFilter = kindFilter.filter(i => (i !== ""));
    kindFilter = kindFilter.filter(i => (i !== kindFilterEdit));

    Product.find()
        .then(products => {
            return postKind(products, kindFilter, "watches");
        })
        .then(newProd => {
            if (kindFilter.length == 0) kindFilter.push("");
            console.log("kindFilter_new:", kindFilter);
            return res.render("shop/products", {
                path: "/products",
                pageTitle: "Watches",
                products: newProd,
                kind: "watches",
                kindFilter: kindFilter,
                userr: req.user
            });
        })
        .catch(err => {
          console.log(err);
        });
};