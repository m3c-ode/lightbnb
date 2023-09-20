SELECT
  p.id,
  title,
  cost_per_night,
  avg(rating) AS average_rating
FROM
  properties p
  JOIN property_reviews pr ON pr.property_id = p.id
WHERE
  -- city = 'Vancouver' -- AND rating >= 4<
  city LIKE '%ancouv%'
GROUP BY
  p.id
HAVING
  avg(rating) >= 4
ORDER BY
  cost_per_night
LIMIT
  10;