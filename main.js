var towerManager = require('manager.tower');
var creepManager = require('manager.creeps');
var trafficManager = require('manager.traffic');

trafficManager.init();

function safemodeChecker() {
    for (roomName in Game.rooms) {
        var room = Game.rooms[roomName];
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
}

module.exports.loop = function () {
    // 利用空闲CPU生成Pixel
    Game.cpu.generatePixel();

    // 检测敌人和攻击，开启安全模式
    safemodeChecker();

    // Creeps管理器（自动生成，工作管理）
    creepManager.run();

    // Tower管理器（优先攻击 -> 修复 -> 治疗）
    towerManager.run();

    // 临时调遣到其他房间工作
    var targetRoomName = 'E35N33';
    var creep_name_list = ['Harvester0_E35N33_001'];
    creep_name_list.map(creep_name => {
        var creep = Game.creeps[creep_name];
        if (creep && creep.room.name != targetRoomName) {
            const exitDirection = creep.room.findExitTo(targetRoomName);
            const exit = creep.pos.findClosestByRange(exitDirection);
            creep.moveTo(exit);  // 移动到目标房间的出口
        }
    })

    // 寻路优化
    for (const roomName in Game.rooms) {
        const room = Game.rooms[roomName];
        trafficManager.run(room);
    }
}