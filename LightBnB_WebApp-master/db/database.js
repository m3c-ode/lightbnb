const { Pool } = require('pg');

const properties = require("./json/properties.json");
const users = require("./json/users.json");
const { options } = require('../routes/apiRoutes');

const pool = new Pool({
  user: 'labber',
  password: 'labber',
  host: 'localhost',
  database: 'lightbnb'
});


// the following assumes that you named your connection variable `pool`
// pool.query(`SELECT title FROM properties LIMIT 10;`).then(response => { console.log(response.rows); });

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
  console.log("🚀 ~ file: database.js:141 ~ getAllProperties ~ options:", options);
  // const limitedProperties = {};
  // for (let i = 1; i <= limit; i++) {
  //   limitedProperties[i] = properties[i];
  // }
  // return Promise.resolve(limitedProperties);
  const {
    city,
    owner_id,
    minimum_price_per_night,
    maximum_price_per_night,
    minimum_rating
  } = options;

  // return pool
  //   .query(`
  //   SELECT
  //     p.*,
  //     avg(rating) AS average_rating
  //   FROM
  //     properties p
  //     JOIN property_reviews pr ON pr.property_id = p.id
  //   WHERE
  //     -- city = 'Vancouver' -- AND rating >= 4<
  //     city LIKE '%ancouv%'
  //   GROUP BY
  //     p.id
  //   HAVING
  //     avg(rating) >= 4
  //   ORDER BY
  //     cost_per_night
  //   LIMIT
  //     $1;
  //   `, [limit])
  //   .then((result) => {
  //     return result.rows;
  //   })
  //   .catch((err) => {
  //     console.log(err.message);
  //   });

  // 1
  const queryParams = [];
  // 2
  let queryString = `
  SELECT properties.*, avg(property_reviews.rating) as average_rating
  FROM properties
  JOIN property_reviews ON properties.id = property_id
  `;

  // if we have options, add the WHERE
  if (Object.keys(options).length > 0) {
    queryString += 'WHERE ';
  }

  if (owner_id) {
    queryParams.push(Number(owner_id));
    queryString += `owner_id = $${queryParams.length}`;
  }

  // 3
  if (city) {
    queryParams.push(`%${city}%`);
    if (queryParams.length > 1) queryString += ' AND ';
    queryString += `city LIKE $${queryParams.length}`;
  }

  if (minimum_price_per_night) {
    queryParams.push(Number(minimum_price_per_night * 100));
    if (queryParams.length > 1) queryString += ' AND ';
    queryString += `cost_per_night > $${queryParams.length}`;
  }

  if (maximum_price_per_night) {
    queryParams.push(Number(maximum_price_per_night * 100));
    if (queryParams.length > 1) queryString += ' AND ';
    queryString += `cost_per_night < $${queryParams.length}`;
  }

  // 4
  queryParams.push(limit);
  queryString += `
  GROUP BY properties.id
  ORDER BY cost_per_night
  LIMIT $${queryParams.length};
  `;

  // 5
  console.log(queryString, queryParams);

  // 6
  return pool.query(queryString, queryParams).then((res) => res.rows);

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
