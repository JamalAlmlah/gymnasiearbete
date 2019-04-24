const bcrypt = require('bcrypt');
const connect = require('../models/connect');

/**
 * Logga in sida
 *
 * Denna funktioner letar efter värdet som användare gett och kolla upp den i databsen och ge fel.
 * meddlande om vädret inte stämmer
 *
 * @author Jamal Al Mlah
 * @param {object} request http request från webbläsaren
 * @param {object} response http response till webbläsaren
 */
const createSession = async (request, response) => {
  /* eslint-disable no-console */
  console.log(connect);
  const db = await connect();
  const collection = db.collection('users');
  const login = await collection.find({ username: request.body.UserName })
    .toArray();

  bcrypt.compare(request.body.Password, login[0].password, (
    err,
    res,
  ) => {
    if (res) {
      response.set('Set-Cookie', 'admin=true;');
      response.redirect('/controlpanel');
    } else {
      response.render('login', {
        layout: 'login',
        meddelande: 'Fel användernamn eller lösenord',
      });
    }
  });
};

/**
 * meddelande i kontrollpanel
 *
 * Denna funktikon listar in alla meddelande som jag får på en lista som finns i kontrollpanel
 *
 * @author Jamal Al Mlah
 * @param {object} request http request från webbläsaren
 * @param {object} response http response till webbläsaren
 */

const viewmessage = async (request, response) => {
  const db = await connect();
  const collection = db.collection('messages');
  const messagescp = await collection.find().toArray();
  if (request.cookies && request.cookies.admin) {
    response.render('meddelande', { messages: messagescp, layout: 'cp' });
  } else {
    response.redirect('/controlpanel/login');
  }
};
/**
 * controlpanel sida
 *
 * Denna är get versionen av controlpanel sida funktion
 *
 * @author Jamal Al Mlah
 * @param {object} request http request från webbläsaren
 * @param {object} response http response till webbläsaren
 */
const viewcp = (request, response) => {
  if (request.cookies && request.cookies.admin) {
    response.render('controlpanel', { layout: 'cp' });
  } else {
    response.redirect('/controlpanel/login');
  }
};


/**
 * Logga in sida
 *
 * Denna är get versionen av logga in sida funktion
 *
 * @author Jamal Al Mlah
 * @param {object} request http request från webbläsaren
 * @param {object} response http response till webbläsaren
 */
const viewlogin = (request, response) => {
  response.render('login', { layout: 'login' });
};

module.exports = {
  createSession, viewmessage, viewcp, viewlogin,
};
