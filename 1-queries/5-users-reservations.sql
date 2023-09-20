SELECT
  r.id,
  title,
  r.start_date,
  cost_per_night,
  avg(pr.rating) AS avg_rating
FROM
  reservations r
  JOIN properties p ON r.property_id = p.id
  JOIN property_reviews pr ON pr.property_id = p.id
WHERE
  r.guest_id = 1
GROUP BY
  r.id,
  p.id -- OR: -- p.title,
  -- cost_per_night
ORDER BY
  start_date
LIMIT
  10;