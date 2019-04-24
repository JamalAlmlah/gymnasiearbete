const bcrypt = require('bcrypt');
const connect = require('../models/connect');

/**
 * skapa en användare
 *
 * Denna funktion skapar ny användare.
 *
 * @author Jamal Al Mlah
 * @param {object} request http request från webbläsaren
 * @param {object} response http response till webbläsaren
 */
const createUser = async (request, response) => {
  const saltRounds = 10;
  bcrypt.genSalt(saltRounds, (error, salt) => {
    bcrypt.hash(request.body.Password, salt, async (err, hash) => {
      const user = {
        username: request.body.UserName,
        email: request.body.Email,
        password: hash,

      };
      const db = await connect();
      const collection = db.collection('users');
      try {
        await collection.insertOne(user);
        response.sendStatus(204);
      } catch (e) {
        /* eslint-disable no-console */
        console.error(error);
      }
    });
  });
};
/**
 * skapa en användare "get"
 *
 * Denna funktion hämtar sidan registrera.
 *
 * @author Jamal Al Mlah
 * @param {object} request http request från webbläsaren
 * @param {object} response http response till webbläsaren
 */

const ucreateUser = (request, response) => {
  if (request.cookies && request.cookies.admin) {
    response.render('registrera', { layout: 'cp' });
  } else {
    response.redirect('/controlpanel/login');
  }
};
module.exports = { createUser, ucreateUser };
