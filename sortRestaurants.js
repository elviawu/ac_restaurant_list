function sortRestaurants(sortQuery) {
  let sortMethod = ''
  
  switch (sortQuery) {
    case 'name-asc':
      sortMethod = { name: 'asc' }
      break
    case 'name-desc':
      sortMethod = { name: 'desc' }
      break
    case 'rating':
      sortMethod = { rating: 'desc' }
      break
    case 'category':
      sortMethod = { category: 'asc' }
      break
    case 'location':
      sortMethod = { location: 'asc' }
      break
  }
  return sortMethod
}

module.exports = sortRestaurants