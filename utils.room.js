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
     * 获取当前房间所有spawn和extension中存储的energy数量
     * @param {*} room 
     * @returns 
     */
    getTotalEnergy: function (room) {
        const spawns = room.find(FIND_MY_SPAWNS);
        const extensions = room.find(FIND_MY_STRUCTURES, {
            filter: structure => structure.structureType === STRUCTURE_EXTENSION
        });

        let totalEnergy = 0;
        spawns.forEach(spawn => totalEnergy += spawn.store[RESOURCE_ENERGY]);
        extensions.forEach(extension => totalEnergy += extension.store[RESOURCE_ENERGY]);

        return totalEnergy;
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

        // const surroundingPositions = [
        //     new RoomPosition(targetPos.x, targetPos.y - 1, targetPos.roomName),      // 上
        //     new RoomPosition(targetPos.x, targetPos.y + 1, targetPos.roomName),      // 下
        //     new RoomPosition(targetPos.x - 1, targetPos.y, targetPos.roomName),      // 左
        //     new RoomPosition(targetPos.x + 1, targetPos.y, targetPos.roomName),      // 右
        // ];

        // const terrains = surroundingPositions
        //     .map(pos => room.lookForAt(LOOK_TERRAIN, pos))
        //     .filter(terrain => terrain != 'wall');

        // var positionCount = terrains.length

        // var topLeft = [
        //     new RoomPosition(targetPos.x - 1, targetPos.y - 1, targetPos.roomName),  // 左上
        //     new RoomPosition(targetPos.x, targetPos.y - 1, targetPos.roomName),      // 上
        //     new RoomPosition(targetPos.x - 1, targetPos.y, targetPos.roomName),      // 左
        // ].map(pos => room.lookForAt(LOOK_TERRAIN, pos)).filter(terrain => terrain != 'wall').length

        // var topRight = [
        //     new RoomPosition(targetPos.x + 1, targetPos.y - 1, targetPos.roomName),  // 右上
        //     new RoomPosition(targetPos.x, targetPos.y - 1, targetPos.roomName),      // 上
        //     new RoomPosition(targetPos.x + 1, targetPos.y, targetPos.roomName),      // 右
        // ].map(pos => room.lookForAt(LOOK_TERRAIN, pos)).filter(terrain => terrain != 'wall').length


        // var bottomLeft = [
        //     new RoomPosition(targetPos.x - 1, targetPos.y + 1, targetPos.roomName),  // 左下
        //     new RoomPosition(targetPos.x, targetPos.y + 1, targetPos.roomName),      // 下
        //     new RoomPosition(targetPos.x - 1, targetPos.y, targetPos.roomName),      // 左
        // ].map(pos => room.lookForAt(LOOK_TERRAIN, pos)).filter(terrain => terrain != 'wall').length

        // var bottomRight = [
        //     new RoomPosition(targetPos.x + 1, targetPos.y + 1, targetPos.roomName),  // 右下
        //     new RoomPosition(targetPos.x, targetPos.y + 1, targetPos.roomName),      // 下
        //     new RoomPosition(targetPos.x + 1, targetPos.y, targetPos.roomName),      // 右
        // ].map(pos => room.lookForAt(LOOK_TERRAIN, pos)).filter(terrain => terrain != 'wall').length

        // if (topLeft == 3) { positionCount += 1 }
        // if (topRight == 3) { positionCount += 1 }
        // if (bottomLeft == 3) { positionCount += 1 }
        // if (bottomRight == 3) { positionCount += 1 }

        // return positionCount

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
        return terrains.length
    }
}
module.exports = roomUtils;