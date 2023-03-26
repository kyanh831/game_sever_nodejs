async function handleClientEvent(data, socket, db) {
    switch (data.eventType) {
      case 'login':
        const loggedInPlayer = await login(data.player.name, data.player.password, db);
        socket.emit('serverEvent', { eventType: 'loggedIn', player: loggedInPlayer });
        break;
      case 'logout':
        await logout(data.player.id, db);
        socket.emit('serverEvent', { eventType: 'loggedOut' });
        break;
      case 'register':
        const registeredPlayer = await register(data.player.name, data.player.password, db);
        socket.emit('serverEvent', { eventType: 'registered', player: registeredPlayer });
        break;
      case 'getPlayer':
        const player = await getPlayerById(data.player.id, db);
        socket.emit('serverEvent', { eventType: 'getPlayer', player: player });
        break;
       case 'test':
        console.log("helo:",data);
        break;
      default:
        console.log(`Unhandled client event type: ${data.eventType}`);
        break;
    }
  }
  
  async function login(name, password, db) {
    const playersCollection = db.collection('players');
    const player = await playersCollection.findOne({ name: name, password: password });
    return player;
  }
  
  async function logout(id, db) {
    const playersCollection = db.collection('players');
    await playersCollection.updateOne({ id: id }, { $set: { isLoggedIn: false } });
  }
  
  async function register(name, password, db) {
    const playersCollection = db.collection('players');
    const existingPlayer = await playersCollection.findOne({ name: name });
    if (existingPlayer) {
      throw new Error(`Player with name ${name} already exists`);
    }
    const newPlayer = new Player(uuidv4(), name, 0);
    newPlayer.password = password;
    newPlayer.isLoggedIn = true;
    await playersCollection.insertOne(newPlayer);
    return newPlayer;
  }
  function updatePosition(roomId, playerId, position) {
    socket.emit('update_position', roomId, playerId, position);
  }
  
  async function getPlayerById(id, db) {
    const playersCollection = db.collection('players');
    const player = await playersCollection.findOne({ id: id });
    return player;
  }
  
  module.exports = {
    handleClientEvent,
  };