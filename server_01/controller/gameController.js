
async function handleGameEvent(data, ws, db, clients) {
    const roomsCollection = db.collection("rooms");

    switch (data.eventType) {
        case 'createRoom':
            console.log(data);
            const newRoom = {
                roomId: await generateRoomId(roomsCollection),
                players: [{ id: data.player.id, score: 0 }],
            };
            ws.playerId = data.player.id;
            await roomsCollection.insertOne(newRoom);
            console.log(`Created room ${newRoom.roomId}`);
            ws.send(JSON.stringify({ eventType: "roomCreated", roomId: newRoom.roomId }));
            break;
        case 'findRoom':
            var roomId = data.roomId;
            console.log(roomId);
            const room = await roomsCollection.findOne({ roomId: roomId * 1 });
            console.log('room: ' + room);
            if (!room)
                ws.send(JSON.stringify({ eventType: "findRoom", room: null }));
            else
                ws.send(JSON.stringify({ eventType: "findRoom", room: room }));
            break;
        case 'joinRoom':
            console.log(data);
            var roomId = data.roomId;
            var player = { id: data.playerId, score: 0 };
            var gameRoomToJoin = await roomsCollection.findOne({ roomId: roomId * 1 });
            const numberOfPlayers = gameRoomToJoin.players.length;
            if (gameRoomToJoin && numberOfPlayers < 5) {
                ws.playerId = player.id;
                await roomsCollection.updateOne(
                    { roomId: roomId * 1 },
                    { $push: { players: player } }
                );
                ws.send(JSON.stringify({ eventType: "roomJoined", numberOfPlayers }));
                const message = {
                    eventType: "playerJoined",
                    numberOfPlayers: numberOfPlayers
                };

                // send message to all players in the room except the newly joined player
                gameRoomToJoin.players.forEach(p => {
                    const clientsArray = Array.from(clients);
                    const playerSocket = clientsArray.find(c => c.playerId === p.id);
                    if (playerSocket) {
                        playerSocket.send(JSON.stringify(message));
                    }
                });
            } else {
                ws.send(JSON.stringify({ eventType: "roomUnavailable" }));
            }
            break;
        case 'deleteRoom':
            var roomId = data.roomId;
            console.log(roomId);
            try {
                await db.rooms.deleteOne({ roomId: roomId * 1 });
            } catch (error) {
                ws.send(JSON.stringify({ eventType: "mess", data: 'Can not delete room' }));
            }
            console.log(`Deleted room ${roomId}`);
            ws.send(JSON.stringify({ eventType: "roomRemoved", data: 'room removed' }));
            break;
        case 'startGame':
            var roomId =data.roomId;
            var message ={
                eventType: 'startGame'
            }
            var gameRoomToJoin = await roomsCollection.findOne({ roomId: roomId * 1 });

            gameRoomToJoin.players.forEach(p => {
                const clientsArray = Array.from(clients);
                const playerSocket = clientsArray.find(c => c.playerId === p.id);
                if (playerSocket) {
                    playerSocket.send(JSON.stringify(message));
                }
            });
        default:
            break;
    }
}
async function generateRoomId(roomsCollection) {
    let roomId;
    do {
        roomId = Math.floor(Math.random() * 1000000); // Generate a random 6-digit number for the room ID
        const room = await roomsCollection.findOne({ roomId }); // Find a room with the same roomId
        if (room) continue; // If a room is found, continue looping to generate a new roomId
        return roomId;
    } while (true); // Loop until a unique roomId is found
}
module.exports = {
    handleGameEvent,
};