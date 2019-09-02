const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const flash = require('connect-flash');
const multer = require('multer');
const mongoose = require("mongoose");
const errorController = require("./controllers/error");
const User = require("./models/user");
const fs = require('fs');

const app = express();
const MONGODB_URI =
'mongodb+srv://nodejs:Vuong0935986100@cluster0-aecmg.mongodb.net/testshop';

const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions'
});

// // chinh image dc luu trong server va ten cua no
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + '-' + file.originalname);
  }
});

// // dieu chinh format upload hop le
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// // Them templating engine de render html, css
// app.set("view engine", "ejs");
// app.set("views", "views");

// const adminRoutes = require("./routes/admin");
// const shopRoutes = require("./routes/shop");
// const utilRoutes = require("./routes/util");
// const authRoutes = require("./routes/auth");
// const userInforRoutes = require("./routes/userInfor");

app.use(bodyParser.urlencoded({ extended: false }));
// // dung multer de loc file 
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')
);
app.use(express.static(path.join(__dirname, 'public')));
// them 1 static duong dan public
app.use('/images', express.static(path.join(__dirname, 'images')));

// // cấu hình cho session
// app.use(
//   session({
//     secret: 'my secret', // secret dùng tạo hash (hash lưu id trong cookie)
//     resave: false, // session sẽ ko lưu với mỗi lệnh request => tốc đô
//     saveUninitialized: false, // chắn chăn ko có session đc save mỗi request
//     store: store
//   })
// );

// // them flash de gui ve message error thong qua session
// app.use(flash());

// // Tao middleware cho user khi da start thanh cong SERVER voi PORT
// app.use((req, res, next) => {
//   if (!req.session.user) {
//     return next();
//   }
//   User.findById(req.session.user._id)
//     .then(user => {
//       req.user = user;
//       next();
//     })
//     .catch(err => console.log(err));
// });

var NumFaces = 0;

async function detect(fileName) {
  const vision = require('@google-cloud/vision');

  // Creates a client
  const client = new vision.ImageAnnotatorClient();

  /**
   * TODO(developer): Uncomment the following line before running the sample.
   */
  // const fileName = '/images/huhu.jpg';

  const [result] = await client.faceDetection(fileName);
  const faces = result.faceAnnotations;
  console.log('Faces:', faces);
  faces.forEach((face, i) => {
    console.log(`  Face #${i + 1}:`);
    console.log(`    Joy: ${face.joyLikelihood}`);
    console.log(`    Anger: ${face.angerLikelihood}`);
    console.log(`    Sorrow: ${face.sorrowLikelihood}`);
    console.log(`    Surprise: ${face.surpriseLikelihood}`);
  });
}

async function detectFaces(inputFile) {
  const vision = require('@google-cloud/vision');
  // Creates a client
  const client = new vision.ImageAnnotatorClient();

  // Make a call to the Vision API to detect the faces
  const request = {image: {source: {filename: inputFile}}};
  const results = await client.faceDetection(request);
  const faces = results[0].faceAnnotations;
  const numFaces = faces.length;
  NumFaces = numFaces;
  console.log(`Found ${numFaces} face${numFaces === 1 ? '' : 's'}.`);
  return faces;
}

async function highlightFaces(inputFile, faces, outputFile, Canvas) {
  const {promisify} = require('util');
  const readFile = promisify(fs.readFile);
  const image = await readFile(inputFile);
  const Image = Canvas.Image;
  // Open the original image into a canvas
  const img = new Image();
  img.src = image;
  const canvas = new Canvas.Canvas(img.width, img.height);
  const context = canvas.getContext('2d');
  context.drawImage(img, 0, 0, img.width, img.height);

  // Now draw boxes around all the faces
  context.strokeStyle = 'rgba(0,255,0,0.8)';
  context.lineWidth = '5';

  faces.forEach(face => {
    context.beginPath();
    let origX = 0;
    let origY = 0;
    face.boundingPoly.vertices.forEach((bounds, i) => {
      if (i === 0) {
        origX = bounds.x;
        origY = bounds.y;
      }
      context.lineTo(bounds.x, bounds.y);
    });
    context.lineTo(origX, origY);
    context.stroke();
  });

  // Write the result to a file
  console.log(`Writing to file ${outputFile}`);
  const writeStream = fs.createWriteStream(outputFile);
  const pngStream = canvas.pngStream();

  await new Promise((resolve, reject) => {
    pngStream
      .on('data', chunk => writeStream.write(chunk))
      .on('error', reject)
      .on('end', resolve);
  });
}
async function main(inputFile, outputFile) {
  const Canvas = require('canvas');
  outputFile = outputFile || 'out.png';
  const faces = await detectFaces(inputFile);
  console.log(faces);
  console.log('Highlighting...');
  await highlightFaces(inputFile, faces, outputFile, Canvas);
  console.log('Finished!');
}


app.use((req, res, next) => {
  // gui ve 1 bien trong moi 1 route
  // res.locals.isAuthenticated = req.session.isLoggedIn;
  // res.locals.currentUser = req.session.user;
  // res.locals.errMessage = req.session.errM;
  // res.locals.errPass = req.session.errP;
  // Imports the Google Cloud client library
  
  // detect('./images/huhu.jpg')
  // .then(res => {
  //   console.log("huhu");
  // });

  // followers('phuongvuongnguyen').then(no => {
  //   console.log(no);
  //   // 460
  // });


  next();
});

app.post("/image", (req, res, next) => {
  console.log("---------------HUHUHUHUHU--------------");
  console.log(req.file);
  var newImage = new Date().toISOString() + "-" + req.file.originalname;
  main("./" + req.file.path, "./images/" + newImage)
    .then(results => {
      console.log("Detect completed!");
      var newUrl = "/images/" + newImage;
      return newUrl.toString();
    })
    .then(newUrl => {
      res.json({ 
        "newUrl": newUrl,
        numFaces: NumFaces
      });
    });
});

// app.use("/admin", adminRoutes);
// app.use(shopRoutes);
// app.use(utilRoutes);
// app.use(authRoutes);
// app.use(userInforRoutes);
// app.use(errorController.get404);

mongoose.
  connect(
    MONGODB_URI,
    { useNewUrlParser: true}
  )
  .then(result => {
    console.log("CONNECTED in port 3000");
    // console.log(path.join(__dirname, 'images'));
    app.listen(process.env.PORT || 3000);
  })
  .catch(err => {
    console.log(err);
  });
