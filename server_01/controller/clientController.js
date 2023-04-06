const { SHA256 } = require("crypto-js");
const crypto = require("crypto");
let RegisterMessage = "";

function validatePassword(password) {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

  return regex.test(password);
}

async function handleClientEvent(data, ws, db) {
  switch (data.eventType) {
    case "login":
      const loggedInPlayer = await login(
        data.player.userName,
        data.player.password,
        db
      );
      console.log("user logged in", loggedInPlayer);
      if (loggedInPlayer) {
        const player = {
          _id: loggedInPlayer._id,
          LoginName: loggedInPlayer.LoginName,
          FullName: loggedInPlayer.FullName,
          Score: loggedInPlayer.Score,
        };
        const sessions = db.collection("sessions");
        const playerSession = await getPlayerFromSessionToken(
          loggedInPlayer._id,
          sessions
        );
        console.log("ser_______", playerSession);
        if (playerSession == null) {
          // Generate a random session token
          const sessionToken = crypto.randomBytes(16).toString("hex");
          console.log(`Session token: ${sessionToken}`);
          sessions.insertOne({
            playerId: loggedInPlayer._id,
            token: sessionToken,
          });
          ws.send(
            JSON.stringify({
              eventType: "logged",
              player: player,
              token: sessionToken,
            })
          );
        } else {
          ws.send(
            JSON.stringify({
              eventType: "logged",
              player: player,
              token: playerSession?.token,
            })
          );
        }
      } else
        ws.send(
          JSON.stringify({
            eventType: "mess",
            message: "user or pass not correct",
          })
        );
      break;
    case "logout":
      // Look up the player ID based on the session token
      const playerId = await getPlayerIdFromSessionToken(data.sessionToken, db);
      if (playerId) {
        await logout(playerId, db);
        ws.send(JSON.stringify({ eventType: "loggedOut" }));
      } else {
        ws.send(
          JSON.stringify({ eventType: "mess", name: "session not found" })
        );
      }
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
      else ws.send(JSON.stringify({ eventType: "mess", message: "avc" }));
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

async function logout(playerId, db) {
  const session = await db.sessions.findOne({ playerId });
  if (session) {
    await db.sessions.deleteOne({ playerId });
  }
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

  if (!userName.trim()) {
    RegisterMessage = "username Cannot be empty";
    return;
  } else if (!fullName.trim()) {
    RegisterMessage = "fullname Cannot be empty";
    return;
  } else if (!password.trim()) {
    RegisterMessage = "password Cannot be empty";
    return;
  } else if (!validatePassword(password)) {
    RegisterMessage =
      "password must be at least 8 characters, contain at least one uppercase letter, one lowercase letter, and one number";
    return;
  }

  const f_password = await SHA256(password);
  console.log("Password after encrypt: " + f_password);
  const newPlayer = {
    FullName: fullName,
    LoginName: userName,
    Password: password,
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
async function getPlayerIdFromSessionToken(sessionToken, sessions) {
  const session = await sessions.findOne({ token: sessionToken });
  return session ? session.playerId : null;
}
async function getPlayerFromSessionToken(playerId, sessions) {
  const session = await sessions.findOne({ playerId: playerId });
  return session ? session : null;
}
module.exports = {
  handleClientEvent,
};
