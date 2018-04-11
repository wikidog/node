import request from 'request';

// Wrap 'request' in a promise
//
let geocodeAddress = (address) => {

  return new Promise((resolve, reject) => {

    let encodedAddress = encodeURIComponent(address);

    request({
      url: `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}`,
      json: true
    }, (error, response, body) => {
      if (error) {
        reject('Unable to connect to Google servers.');
      } else if (body.status === 'ZERO_RESULTS') {
        reject('Unable to find that address.');
      } else if (body.status === 'OK') {
        resolve({
          address: body.results[0].formatted_address,
          latitude: body.results[0].geometry.location.lat,
          longitude: body.results[0].geometry.location.lng
        });
      } else {
        reject('Unknown error');
      }
    });
  });
};

// invoke the test code in here so that we don't need to
//  add anything in the main.js
//
//module.exports = geocodeAddress('23051 rio lobos rd')
module.exports = geocodeAddress('AAAAA00000')
  .then(location => {
    console.log('We get results!');
    console.log(JSON.stringify(location, undefined, 2));
  })
  .catch(errorMessage => {
    console.log(errorMessage);
  });


