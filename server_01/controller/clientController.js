const { SHA256 } = require("crypto-js");

async function handleClientEvent(data, ws, db) {
  switch (data.eventType) {
    case "login":
      const loggedInPlayer = await login(
        data.player.userName,
        data.player.password,
        db
      );
      console.log("user logged in", loggedInPlayer);
      if (loggedInPlayer?._id)
        ws.send(
          JSON.stringify({ eventType: "logged", player: loggedInPlayer })
        );
      else
        ws.send(
          JSON.stringify({
            eventType: "mess",
            message: "user or pass not correct",
          })
        );
      break;
    case "logout":
      await logout(data.player.id, db);
      ws.send(JSON.stringify({ eventType: "loggedOut" }));
      break;
    case "register":
      const registeredPlayer = await register(
        data.player.userName,
        data.player.fullName,
        data.player.password,
        db
      );
      console.log("new:", registeredPlayer);
      if (registeredPlayer?._id)
        ws.send(
          JSON.stringify({ eventType: "registered", player: registeredPlayer })
        );
      else
        ws.send(
          JSON.stringify({ eventType: "mess", message: "can not create user" })
        );
      break;
    case "getPlayer":
      const player = await getPlayerById(data.player.id, db);
      ws.send(JSON.stringify({ eventType: "getPlayer", player: player }));
      break;
    case "test":
      console.log("helo 123:", data);
      var data = { eventType: "mess", message: "user or pass not correct" };
      ws.send(JSON.stringify(data));
      break;
    default:
      console.log(`Unhandled client event type: ${data.eventType}`);
      break;
  }
}
async function login(name, password, db) {
  const playersCollection = db.collection("players");
  const f_password = await SHA256(password);
  const player = await playersCollection.findOne({
    LoginName: name,
    Password: f_password,
  });
  return player;
}

async function logout(id, db) {
  const playersCollection = db.collection("players");
  await playersCollection.updateOne(
    { id: id },
    { $set: { isLoggedIn: false } }
  );
}

async function register(userName, fullName, password, db) {
  console.log("name: " + userName);
  console.log("name: " + fullName);
  console.log("pass: " + password);
  const playersCollection = db.collection("players");
  const existingPlayer = await playersCollection.findOne({
    LoginName: userName,
  });
  if (existingPlayer) {
    console.log(`Player with name ${userName} already exists`);
    return;
  }
  const f_password = await SHA256(password);
  console.log("Password after encrypt: " + f_password);
  const newPlayer = {
    FullName: fullName,
    LoginName: userName,
    Password: f_password,
    Score: 0,
  };
  try {
    await playersCollection.insertOne(newPlayer);
  } catch (e) {
    console.log("error:", e);
  }
  return newPlayer;
}
async function getPlayerById(id, db) {
  const playersCollection = db.collection("players");
  const player = await playersCollection.findOne({ id: id });
  return player;
}
module.exports = {
  handleClientEvent,
};
