// CSE340/models/favorite-model.js
const pool = require("../database/")

/* ***************************
 *  Add a favorite
 * ************************** */
async function addFavorite(account_id, inv_id) {
  try {
    const sql = `INSERT INTO favorite (account_id, inv_id) VALUES ($1, $2) RETURNING *`
    const result = await pool.query(sql, [account_id, inv_id])
    return result.rows[0]
  } catch (error) {
    // If unique constraint violation or other DB error, throw upward
    throw error
  }
}

/* ***************************
 *  Remove a favorite
 * ************************** */
async function removeFavorite(account_id, inv_id) {
  try {
    const sql = `DELETE FROM favorite WHERE account_id = $1 AND inv_id = $2 RETURNING *`
    const result = await pool.query(sql, [account_id, inv_id])
    return result.rows[0]
  } catch (error) {
    throw error
  }
}

/* ***************************
 *  Get favorites for an account (with vehicle data)
 * ************************** */
async function getFavoritesByAccountId(account_id) {
  try {
    const sql = `
      SELECT f.favorite_id, f.inv_id, i.inv_make, i.inv_model, i.inv_year, i.inv_price, i.inv_image, i.inv_thumbnail
      FROM favorite AS f
      JOIN inventory AS i ON f.inv_id = i.inv_id
      WHERE f.account_id = $1
      ORDER BY f.created_at DESC
    `
    const result = await pool.query(sql, [account_id])
    return result.rows
  } catch (error) {
    throw error
  }
}

/* ***************************
 *  Check if a favorite exists
 * ************************** */
async function checkFavoriteExists(account_id, inv_id) {
  try {
    const sql = `SELECT favorite_id FROM favorite WHERE account_id = $1 AND inv_id = $2`
    const result = await pool.query(sql, [account_id, inv_id])
    return result.rows[0] // undefined if not exists
  } catch (error) {
    throw error
  }
}

module.exports = {
  addFavorite,
  removeFavorite,
  getFavoritesByAccountId,
  checkFavoriteExists,
}
