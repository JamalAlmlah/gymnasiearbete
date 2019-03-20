const querystring = require('querystring');
const bodyParser = (request, respone, next) => {
 
    if (
request.headers['content-type'] &&
request.headers['content-type'].includes('x-www-form-urlencoded')

    ){
      console.log('content-type', request.headers['content-type']);
  
      let data = "";
      request.on('data', chunk => {
    data += chunk;
    
      });
      request.on('end', ()  => {
      data = querystring.parse(data);
      request.body = data;
      next()
    });
    }
    next()
   
};
module.exports = bodyParser;