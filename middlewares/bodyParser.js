const querystring = require("querystring");

const bodyParser = (request, response, next) => {
  if (
    request.headers["content-type"] &&
    request.headers["content-type"].includes("x-www-form-urlencoded")
  ) {
    let data = "";
    request.on("data", chunk => {
      data += chunk;
    });

    request.on("end", () => {
      data = querystring.parse(data);
      request.body = data;
      next();
    });
  } else {
    next();
  }
};

module.exports = bodyParser;