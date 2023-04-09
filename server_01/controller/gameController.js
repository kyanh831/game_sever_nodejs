
async function handleGameEvent(data, ws, db) {
    switch (data.eventType) {
        case 'createRoom':
            console.log(data);
            break;
        case 'findRoom':
            break;
        case 'joinRoom':
            break;
        case 'deleteRoom':
            break;
        default:
            break;    
    }
}

module.exports = {
    handleGameEvent,
};