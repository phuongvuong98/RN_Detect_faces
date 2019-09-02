const User = require("../models/user");

const bcrypt = require("bcryptjs");

exports.getChangePassword = (req, res, next) => {
    // message duoc lay trong flash
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    return res.render('shop/account', {
        path: '/account',
        pageTitle: 'Your Information',
        errorMessage: message,
        user: req.user,
        userr: req.user
    });
};

exports.postChangePassword = (req, res, next) => {
    console.log("AHIHI");
    const password = req.body.oldpass;
    const newpass = req.body.newpass;
    const renewpass = req.body.renewpass;
    const kindChange = req.body.kindChange;
    const image = req.file;
		console.log("TCL: exports.postChangePassword -> image", image)
    
    if (kindChange.includes("pw")){
    const email = req.body.email;
      User.findOne({ email: email })
    .then(user => {
      if (!user) {
        console.log(1);
        console.log(req.flash('error'));  
        req.flash('error', 'Invalid email or password.');
        return req.session.save(err => {
          console.log(err);
          res.redirect('/account');
        })
      }
      
      bcrypt
        .compare(password, user.password)
        .then(doMatch => {
             
          if (doMatch) {
            if (newpass != renewpass){
              console.log(1);
              console.log(req.flash('error'));  
              req.flash('error', "Password don't match confirmation!");
              return req.session.save(err => {
                console.log(err);
                res.redirect('/account');
              });
            }
            req.session.isLoggedIn = true;
            req.session.user = user;
            return bcrypt
              .hash(newpass, 12)
              .then(hashedPassword => {
                user.password = hashedPassword;
              return user.save();
        })
        .then(result => {
          res.redirect("/account");
        });
          }
          req.flash('error', 'Invalid email or password.');
          return req.session.save(err => {
            console.log(err);
            res.redirect('/account');
          });
        })
        .catch(err => {
          console.log(err);
          res.redirect('/account');
        });
    })
    .catch(err => console.log(err));
    }
    if (kindChange.includes("if")){
      const address = req.body.address;
      const email = req.body.email2;
      const phone = req.body.phone;
      const birthday = req.body.birthday;
      User.findOne({ email: email })
  .then(user => {
    if (!user) {
      console.log(email);
      console.log(req.flash('error'));  
      req.flash('error', 'Invalid email password.');
      return req.session.save(err => {
        console.log(err);
        res.redirect('/account');
      })
    }
    req.session.user = user;
    user.address = address;
    user.phone = phone;
    user.birthday = birthday;
    user.email = email;

    if (image) {
      user.imageUrl = "/" + image.path;
    } else {
      user.imageUrl = "https://ucarecdn.com/5d276379-552f-4a08-97e7-744a15f71477/ava.png";
    }

    user.save();
    return res.redirect('/account');
    
  })
  .catch(err => console.log(err));
    }
};

