var roomUtils = {
    isFighting: function (room) {
        var enemys = room.find(FIND_HOSTILE_CREEPS);
        return enemys != '';
    }
}
module.exports = roomUtils;