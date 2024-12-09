function safemodeChecker(room) {
    const structures = room.find(FIND_STRUCTURES);

    structures.forEach(structure => {
        if (structure.hits < structure.hitsMax
            && structure.structureType != STRUCTURE_ROAD
            && structure.structureType != STRUCTURE_WALL
            && structure.structureType != STRUCTURE_RAMPART
            && structure.structureType != STRUCTURE_CONTAINER
        ) {
            if (room.controller && !room.controller.safeMode) {
                // const result = structure.controller.activateSafeMode();
                console.log('立即激活安全模式！！！');
            }
        }
    });
}

var roomManager = {
    run: function () {
        for (roomName in Game.rooms) {
            var room = Game.rooms[roomName];
            // 检测敌人和攻击，开启安全模式
            safemodeChecker(room);
        }
    }
};

module.exports = roomManager;