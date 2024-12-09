var roomUtils = {
    isFighting: function (room) {
        var enemys = room.find(FIND_HOSTILE_CREEPS);
        return enemys != '';
    },
    getCanHarvesterPos: function (room, resource_type, resource_index) {
        var targetResource = room.find(resource_type)[resource_index];
        var targetPos = targetResource.pos;

        const surroundingPositions = [
            new RoomPosition(targetPos.x - 1, targetPos.y - 1, targetPos.roomName),  // 左上
            new RoomPosition(targetPos.x, targetPos.y - 1, targetPos.roomName),      // 上
            new RoomPosition(targetPos.x + 1, targetPos.y - 1, targetPos.roomName),  // 右上
            new RoomPosition(targetPos.x - 1, targetPos.y, targetPos.roomName),      // 左
            new RoomPosition(targetPos.x + 1, targetPos.y, targetPos.roomName),      // 右
            new RoomPosition(targetPos.x - 1, targetPos.y + 1, targetPos.roomName),  // 左下
            new RoomPosition(targetPos.x, targetPos.y + 1, targetPos.roomName),      // 下
            new RoomPosition(targetPos.x + 1, targetPos.y + 1, targetPos.roomName),  // 右下
        ];

        const terrains = surroundingPositions
            .map(pos => room.lookForAt(LOOK_TERRAIN, pos))
            .filter(terrain => terrain != 'wall');
        return 8 - terrains.length
    }
}
module.exports = roomUtils;