var roomUtils = {
    /**
     * 判断当前房间是否为战斗模式
     * @param {*} room 
     * @returns 
     */
    isFighting: function (room) {
        var enemys = room.find(FIND_HOSTILE_CREEPS);
        return enemys != '';
    },
    /**
     * 获取指定位置周围8格的非墙位置数量
     * @param {*} room 
     * @param {*} resourceType 
     * @param {*} resourceIndex 
     * @returns 
     */
    getCanHarvesterPos: function (room, resourceType, resourceIndex) {
        var sources = room.find(resourceType);
        var tempPos = new RoomPosition(25, 25, room.name)
        sources = sources.sort((a, b) => {
            const distanceA = tempPos.getRangeTo(a);
            const distanceB = tempPos.getRangeTo(b);
            return distanceA - distanceB;
        });

        var targetResource = sources[resourceIndex];
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