const { Pool } = require('pg');

const properties = require("./json/properties.json");
const users = require("./json/users.json");

const pool = new Pool({
  user: 'labber',
  password: 'labber',
  host: 'localhost',
  database: 'lightbnb'
});


// the following assumes that you named your connection variable `pool`
pool.query(`SELECT title FROM properties LIMIT 10;`).then(response => { console.log(response.rows); });
/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function(email) {
  // let resolvedUser = null;
  // for (const userId in users) {
  //   const user = users[userId];
  //   if (user && user.email.toLowerCase() === email.toLowerCase()) {
  //     resolvedUser = user;
  //   }
  // }
  // return Promise.resolve(resolvedUser);
  return pool
    .query(`
    SELECT * from users
    WHERE email = $1
    `, [email])
    .then((result) => {
      // returns undefined if no match found
      if (result.rowCount === 0) return null;
      return result.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
    });
};

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {
  // return Promise.resolve(users[id]);
  return pool
    .query(`
    SELECT * from users
    WHERE id = $1
    `, [id])
    .then((result) => {
      if (result.rowCount === 0) return null;
      return result.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
    });
};

/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser = function(user) {
  // const userId = Object.keys(users).length + 1;
  // user.id = userId;
  // users[userId] = user;
  // return Promise.resolve(user);

  // Check if user already exists??

  return pool
    .query(`
    INSERT INTO users (name, password, email) VALUES (
      $1, $2, $3
    )
    RETURNING *;
    `, [user.name, user.password, user.email])
    .then((result) => {
      console.log("🚀 ~ file: database.js:87 ~ .then ~ result:", result);
      return result.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
    });
};

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {
  console.log("🚀 ~ file: database.js:105 ~ getAllReservations ~ limit:", limit);
  console.log("🚀 ~ file: database.js:105 ~ getAllReservations ~ guest_id:", guest_id);
  // return getAllProperties(null, 2);
  return pool.query(`
  SELECT
  r.id,
  r.start_date,
  p.*,
  avg(pr.rating) AS avg_rating
  FROM
    reservations r
    JOIN properties p ON r.property_id = p.id
    JOIN property_reviews pr ON pr.property_id = p.id
  WHERE
    r.guest_id = $1
  GROUP BY
    r.id,
    p.id
  ORDER BY
    start_date
  LIMIT
    $2;
    `, [guest_id, limit])
    .then((res) => {
      console.log("🚀 ~ file: database.js:153 ~ getAllReservations ~ guest_id:", guest_id);
      console.log("🚀 ~ file: database.js:154 ~ getAllReservations ~ limit:", limit);
      console.log("🚀 ~ file: database.js:127 ~ .then ~ res:", res);
      console.log("🚀 ~ file: database.js:127 ~ .then ~ res.rows:", res.rows);
      return res.rows;
    })
    .catch(err => console.log(err.message));
};

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = function(options, limit = 10) {
  // const limitedProperties = {};
  // for (let i = 1; i <= limit; i++) {
  //   limitedProperties[i] = properties[i];
  // }
  // return Promise.resolve(limitedProperties);

  return pool
    .query(`
    SELECT * from properties
    LIMIT $1
    `, [limit])
    .then((result) => {
      return result.rows;
    })
    .catch((err) => {
      console.log(err.message);
    });

};

/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  const propertyId = Object.keys(properties).length + 1;
  property.id = propertyId;
  properties[propertyId] = property;
  return Promise.resolve(property);
};

module.exports = {
  getUserWithEmail,
  getUserWithId,
  addUser,
  getAllReservations,
  getAllProperties,
  addProperty,
};
