const User = require("../models/user");
const bcrypt = require("bcryptjs");
var nodemailer = require('nodemailer');
var rn = require('random-number');
const sendgridTransport = require('nodemailer-sendgrid-transport');

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key:
        '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'
    }
  })
);

exports.getLogin = (req, res, next) => {
    // message duoc lay trong flash
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        errorMessage: message,
        userr: null 
    });
};

exports.getSignup = (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    res.render('auth/signup', {
        path: '/signup',
        pageTitle: 'Sign up',
        errorMessage: message,
        userr: null
    });
};

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({ email: email })
    .then(user => {
      if (!user) {
        // luu tren session truoc khi show message.
        return res.render('auth/login', {
          path: '/login',
          pageTitle: 'Login',
          errorMessage: 'Invalid email or password.',
          userr: null 
      });
      }
      bcrypt
        .compare(password, user.password)
        .then(doMatch => {
          if (doMatch && user.role == "admin") {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save(err => {
              console.log(err);
              res.redirect('/admin');
            });
          }
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save(err => {
              console.log(err);
              res.redirect('/');
            });
          }
          return res.render('auth/login', {
            path: '/login',
            pageTitle: 'Login',
            errorMessage: 'Invalid email or password.',
            userr: null 
        });
        })
        .catch(err => {
          console.log(err);
          res.redirect('/login');
        });
    })
    .catch(err => console.log(err));
};

exports.postLogout = (req, res, next) => {
    // huy session khi user dang xuat
    req.session.destroy(err => {
        console.log(err);
        res.redirect('/');
    });
};

exports.postSignup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    User.findOne({ email: email })
    .then(userDoc => {
      if (userDoc) { 
        return res.render('auth/signup', {
          path: '/signup',
          pageTitle: 'Sign up',
          errorMessage: "E-Mail exists already, please pick a different one.",
          userr: null
      });
      }
      if (password != confirmPassword) { 
        return res.render('auth/signup', {
          path: '/signup',
          pageTitle: 'Sign up',
          errorMessage: "Password and comfirmed password are not correct.",
          userr: null
      });
      }
      
      return bcrypt
        .hash(password, 12)
        .then(hashedPassword => {
          const user = new User({
            email: email,
            password: hashedPassword,
            cart: { items: [],
            imageUrl: "https: //ucarecdn.com/5d276379-552f-4a08-97e7-744a15f71477/ava.png" }
          });
          return user.save();
        })
        .then(result => {
          res.redirect("/login");
        });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getForgot = (req, res, next) => {
  // message duoc lay trong flash
  let message = req.flash('error');
  if (message.length > 0) {
      message = message[0];
  } else {
      message = null;
  }
  return req.session.save(err => {
    console.log(err);
    res.render('auth/forgot', {
      path: '/forgot',
      pageTitle: 'Forgot your password',
      errorMessage: message,
      userr: null
  });
})
};

exports.getVerify = (req, res, next) => {
  // message duoc lay trong flash
  let message = req.flash('error');
  if (message.length > 0) {
      message = message[0];
  } else {
      message = null;
  }
  res.render('auth/verify', {
      path: '/verify',
      pageTitle: 'Verify Code',
      errorMessage: message,
      userr: null
  });
};

exports.postVerify = (req, res, next)=>{
  const email = req.body.email;
  req.session.email = email;
  User.findOne({ email: email })
  .then(user => {
    if (!user) {
      console.log(1);
      console.log(req.flash('error'));  
      req.flash('error', 'Invalid email');
      return res.redirect('/forgot');
    }
    var gen = rn.generator({
      min:  100000
    , max:  999999
    , integer: true
    })
    const code = gen();
    req.session.codeVerify = code;
    //user.codeVerify = code;
    //console.log(user.c);
    //user.save();
      // var transporter = nodemailer.createTransport({
      //   service: 'gmail',
      //   auth: {
      //     user: 'supergogetavegito@gmail.com',
      //     pass: 'gokukamehameha'
      //   }
      // });
      var mailOptions = {
        to: user.email,
        from: 'businessweb@gmail.com',
        subject: 'Node.js Password Reset',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please enter your code: ' + code + '\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };
      transporter.sendMail(mailOptions, function(err) {
        if (err) {
          console.log(err);
        } else {
          console.log('Email sent: ' + email);
          res.redirect('/verify');
        }
        
      });
  }
  )
  .catch(err => console.log(err));
};

exports.getReset = (req, res, next) => {
  // message duoc lay trong flash
  let message = req.flash('error');
  if (message.length > 0) {
      message = message[0];
  } else {
      message = null;
  }
  res.render('auth/reset', {
      path: '/reset',
      pageTitle: 'Reset Your Password',
      errorMessage: message,
      userr: null
  });
};

exports.postReset = (req, res, next) => {
  // huy session khi user dang xuat
  const code1 = req.body.verifyCode;
  const code2 = req.session.codeVerify;
  const email = req.session.email;

  //const password = req.body.password;
  //console.log(req.session.codeVerify);
    User.findOne({ email: email })
    .then(user => {
      if(code1 == code2){
        res.redirect('/reset');
      }
      else{
        console.log(req.flash('error'));  
        req.flash('error', 'Invalid code');
        return res.redirect('/verify');
      }
      
    })
  
};

exports.getUpdatePass = (req, res, next) => {
  // message duoc lay trong flash
  
  res.render('auth/login', {
      path: '/login',
      pageTitle: 'Login',
      errorMessage: message,
      userr: null
  });
};
exports.postUpdatePass = (req, res, next) => {
  //const email2 = req.body.email2;
  const newpass = req.body.password;
  const renewpass = req.body.confirmPassword;
  const email = req.session.email;
  User.findOne({ email: email })
  .then(user => {
    if (newpass != renewpass){
      console.log(1);
      console.log(req.flash('error'));  
      req.flash('error', "Password don't match confirmation!");
      return res.session.save(err => {
        console.log(err);
        res.redirect('/reset');
      });
    }
    if (newpass == renewpass){
      return bcrypt
            .hash(newpass, 12)
            .then(hashedPassword => {
              user.password = hashedPassword;
            return user.save();
      })
      .then(result => {
        res.redirect("/login");
      });
    }
  })
  .catch(err => console.log(err));

};
