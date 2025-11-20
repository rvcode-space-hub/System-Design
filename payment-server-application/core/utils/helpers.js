const { v4: uuidv4 } = require('uuid');

module.exports = {
  uid: () => uuidv4(),
  now: () => new Date().toISOString()
};
