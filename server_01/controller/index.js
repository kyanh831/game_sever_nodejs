const { handleClientEvent } = require('./clientController');
const { handleGameEvent } = require('./gameController');
const { handleGamePlayEvent} = require('./gamePlayController');
module.exports = {
  handleClientEvent,
  handleGameEvent,
  handleGamePlayEvent,
};