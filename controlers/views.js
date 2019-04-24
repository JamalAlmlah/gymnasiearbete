
const { ObjectID } = require('mongodb');
const connect = require('../models/connect');

/**
 * Logga in sida
 *
 * Denna funktioner letar efter värdet som användare gett och kolla upp den i databsen och ge fel
 * meddlande om vädret inte stämmer
 *
 * @author Jamal Al Mlah
 * @param {object} request http request från webbläsaren
 * @param {object} response http response till webbläsaren
 */

const viewabout = (request, response) => {
  response.render('about', { layout: 'nonemain' });
};

/**
 * Sidan för företagets erbjudande
 *
 * Denna funktion visar alla erbjudande som har samma företags namn.
 *
 * @author Jamal Al Mlah
 * @param {object} request http request från webbläsaren
 * @param {object} response http response till webbläsaren
 */

const viewcompany = async (request, response) => {
  const { name } = request.params;
  const db = await connect();
  const collection = db.collection('deals');
  const dealspost = await collection.find({ fnamn: name }).toArray();
  response.render('company', {
    deals: dealspost,
    fnamn: dealspost[0].fnamn,
  });
};
/* visa erbjudande i en ena sida */
/**
 * Visa erbjudande i en ena sida
 *
 * Denna funktion visar erbjudande i en ena sida när man trycker på läs mer.
 *
 * @author Jamal Al Mlah
 * @param {object} request http request från webbläsaren
 * @param {object} response http response till webbläsaren
 */

const viewDeal = async (request, response) => {
  const { id } = request.params;
  const db = await connect();
  const collection = db.collection('deals');
  const dealspost = await collection.find({ _id: ObjectID(id) }).toArray();
  response.render('annonser', {
    deals: dealspost,
    fnamn: dealspost[0].fnamn,
  });
};

/**
 * logga ut funktion
 *
 * Denna funktion tar bort data från cookies när man trycker på logga ut knapp så man bli utloggad.
 *
 * @author Jamal Al Mlah
 * @param {object} request http request från webbläsaren
 * @param {object} response http response till webbläsaren
 */

const viewlogout = (request, response) => {
  response.set(
    'Set-Cookie',
    'admin=admin; expires=Thu, 01 Jan 1970 00:00:00 GMT',
  );
  response.redirect('/controlpanel/login');
};
/**
 * kontakta oss sida
 *
 * Denna funktion hämtar sidan kontatka oss från server.
 *
 * @author Jamal Al Mlah
 * @param {object} request http request från webbläsaren
 * @param {object} response http response till webbläsaren
 */
const viewkontakta = (request, response) => {
  response.render('kontakta', { layout: 'nonemain' });
};

/**
 * Sök funktion
 *
 * Denna funktion är en sök funktion som söker efter annonser i sidan.
 *
 * @author Jamal Al Mlah
 * @param {object} request http request från webbläsaren
 * @param {object} response http response till webbläsaren
 */

const search = async (request, response) => {
  const searchquery = request.query.search;
  const db = await connect();
  const collection = db.collection('deals');
  const searchresult = await collection
    .find({ $text: { $search: searchquery } })
    .toArray();

  response.render('home', { deals: searchresult });
};
/**
 * Kontakta oss sida "post"
 *
 * Denna funktion skickar in data som skrivas in i kontatka oss sida till databas.
 *
 * @author Jamal Al Mlah
 * @param {object} request http request från webbläsaren
 * @param {object} response http response till webbläsaren
 */

const skickakontakta = async (request, response) => {
  const messages = {
    firstname: request.body.firstname,
    lastname: request.body.lastname,
    email: request.body.email,
    meddelande: request.body.meddelande,
  };
  const db = await connect();
  const collection = db.collection('messages');
  await collection.insertOne(messages);
  response.sendStatus(204);
};

module.exports = {
  viewabout,
  viewcompany,
  viewlogout,
  viewkontakta,
  skickakontakta,
  viewDeal,
  search,
};
