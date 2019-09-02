// var uploadcare = require('./lib/main')('0aa82163e56c80641cbe', 'f3724b192b85cc5aee6e'),
//         fs = require('fs');


//     // handler is a callback function
//     // in the form function(err, data) { // code to handle response }


//     //API interaction
//     // uploadcare.files.info('file_id', handler);
//     // uploadcare.files.store('file_id', handler);
//     // uploadcare.files.remove('file_id', handler);
//     // uploadcare.groups.info('group_id', handler);

//     //
//     //Paginated list of files/groups info
//     // uploadcare.files.list({page: 1, limit: 100}, handler);
//     // uploadcare.groups.list({page: 1, limit: 100}, handler);

//     //
//     //Upload from file
//     uploadcare.file.upload(fs.createReadStream('./product-01.jpg'), function(err,res){
//         //Res should contain returned file ID
//         console.log(err,res);
//     });

//     //
//     //Upload from URL
//     // uploadcare.file.fromUrl('http://host/image/path', function(err,res){
//     //     //Res should contain returned file ID
//     //     console.log(err,res);
//     // })


var uploadcare = require('./util/uploadCare.js')('0aa82163e56c80641cbe', 'f3724b192b85cc5aee6e'),
  fs = require('fs');

function handler(method) {
  return function (error, response) {
    if (error) {
      console.log('Error in ' + method);
      console.log('Error: ' + error);
      console.log('Response: ' + JSON.stringify(response));
    } else {
      console.log('Success: ' + method);
    }
  };
}

var path = 'product-02.jpg';
// Upload file
uploadcare.file.upload(fs.createReadStream(path), function (err, res) {
  handler('file.upload')(err, res);
  if (err) return;

  // The only thing returned when uploading is the file property.

  //https://ucarecdn.com/272ec093-6531-4cbf-babb-8773b71c9e90/test.jpg

  url = "https://ucarecdn.com/" + res.file.toString() + "/" + path;
  console.log(url);

  uploadcare.files.store(res.file, function (error, response) {
    handler('file.upload.store')(error, response);

    // setTimeout(function() {
    //     // Store to S3
    //     uploadcare.files.storeCustom(res.file, 'uploadcare-node-test', function(error, response) {
    //         handler('file.upload.storeCustom')(error, response);

    //         // Remove the file
    //         //uploadcare.files.remove(res.file, handler('file.upload.remove'));
    //     });
    // }, 1000);
  });

  // Info on file
  uploadcare.files.info(res.file, handler('file.upload.info'));
});


// uploadcare.file.fromUrl('http://i.imgur.com/L4lmrVu.jpg', function(err, res){
//     handler('file.fromUrl')(err, res);
//     if(err) return;

//     // file.fromUrl's response has file_id or uuid, it does not contain the "file" property like upload.

//     // Store the file
//     uploadcare.files.store(res.uuid, handler('file.fromUrl.store'));
//     // Info on file
//     uploadcare.files.info(res.uuid, handler('file.fromUrl.info'));
//     // Remove the file
//     uploadcare.files.remove(res.uuid, handler('file.fromUrl.remove'));
// });

