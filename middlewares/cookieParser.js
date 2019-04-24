const querystring = require('querystring');

const cookieParser = (request, respone, next) => {
  if (request.headers.cookie) {
    request.cookies = querystring.parse(
      request.headers.cookie.replace(/; /g, '&'),
    );
  }
  next();
};
module.exports = cookieParser;
