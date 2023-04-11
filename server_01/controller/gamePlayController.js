async function handleGamePlayEvent(data, ws, db, clients) {
    const roomsCollection = db.collection("rooms");

    switch (data.eventType) {
        case 'updatePos':
            var roomId = data.roomId;
            var player = data.player;
            var gameRoomToJoin = await roomsCollection.findOne({ roomId: roomId * 1 });
            const message = {
                type:'inGame',
                eventType: "updatePos",
                roomId: roomId,
                player:player,
            };
            gameRoomToJoin.players.forEach(p => {
                const clientsArray = Array.from(clients);
                const playerSocket = clientsArray.find(c => c.playerId === p.id);
                if (playerSocket) {
                    playerSocket.send(JSON.stringify(message));
                }
         });
            break;
        case 'init':
            var roomId = data.roomId;
            var playerId = data.playerId;
            var gameRoomToJoin = await roomsCollection.findOne({ roomId: roomId * 1 });
            var room = {
                roomId: roomId,
                players:[]
            };
            for (var i = 0; i < gameRoomToJoin.players.length; i++){
                if(gameRoomToJoin.players[i].id != playerId){
                    var player={ id:gameRoomToJoin.players[i].id, score:0}
                    room.players.push(player);
                }
            }
            ws.send(JSON.stringify({ eventType: "init", room: room }));
        default:
            break;

    }
}
module.exports = {
    handleGamePlayEvent,
};