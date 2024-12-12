const getOtherArea = function (dp, i, j, len) {
    // 越界时的默认值
    const nullNode = { len: 0, swamp: 0 }
    // 检查索引是否小于零，小于零就返回默认值
    return {
        topLeft: (i - len > -1 && j - len > -1) ? dp[i - len][j - len] : nullNode,
        top: (i - len > -1) ? dp[i - len][j] : nullNode,
        left: (j - len > -1) ? dp[i][j - len] : nullNode,
    }
}
const getCenterBybottomRight = function (i, j, len) {
    return [
        i - (len / 2) + 0.5,
        j - (len / 2) + 0.5,
    ]
}
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
    },
    distanceCompute: function (room) {
        const ROOM_MAX_SIZE = 49;
        const BASE_SIZE = 11;

        const terrain = room.getTerrain();

        let dp = Array(ROOM_MAX_SIZE).fill(undefined).map(_ => [])
        // 结果集里对应的沼泽数量
        let minSwamp = Infinity

        // 遍历所有地块
        for (let i = 0; i < ROOM_MAX_SIZE; i++) {
            for (let j = 0; j < ROOM_MAX_SIZE; j++) {
                const { topLeft, top, left } = getOtherArea(dp, i, j, 1)

                // 生成当前位置的状态
                dp[i][j] = {
                    // 以当前位置为右下角，可以生成的最大正方形的边长
                    len: terrain.get(j, i) === TERRAIN_MASK_WALL ? 0 : (Math.min(topLeft.len, top.len, left.len) + 1),
                    // 以当前位置为右下角，[0][0] 为左上角的区域内所有的沼泽数量
                    swamp: top.swamp + left.swamp - topLeft.swamp + (terrain.get(j, i) === TERRAIN_MASK_SWAMP ? 1 : 0)
                }

                // 发现该正方形已经可以满足要求了
                if (dp[i][j].len >= BASE_SIZE) {
                    // 获取正方形右上侧的三个区域
                    const { topLeft, top, left } = getOtherArea(dp, i, j, BASE_SIZE)
                    // 计算出当前区域内的沼泽数量
                    const currentSwamp = dp[i][j].swamp - top.swamp - left.swamp + topLeft.swamp

                    // 沼泽数量不是最小的
                    if (currentSwamp > minSwamp) continue

                    const pos = getCenterBybottomRight(i, j, BASE_SIZE)
                    room.visual.text(currentSwamp, pos[1], pos[0], { align: 'center' });

                    // // 对比沼泽数量并更新结果
                    // if (currentSwamp < minSwamp) {
                    //     minSwamp = currentSwamp
                    //     result = [centerPos]
                    // } else if (currentSwamp === minSwamp) {
                    //     result.push(centerPos)
                    // }
                }
            }
        }
    }
}
module.exports = roomUtils;