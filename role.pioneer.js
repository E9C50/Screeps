var creepsUtils = require('utils.creeps');

var rolePioneer = {
    run: function (creep) {
        // 调整工作模式
        if (creep.memory.working && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.working = false;
        }
        if (!creep.memory.working && creep.store.getFreeCapacity() == 0) {
            creep.memory.working = true;
        }
        if (!creep.memory.working && creepsUtils.pickupDroppedResource(creep)) {
            return;
        }

        if (creep.memory.working) {
            // 查找建造任务并执行
            var buildTarget = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
            if (buildTarget) {
                if (creep.build(buildTarget) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(buildTarget, { maxRooms: 1, visualizePathStyle: { stroke: '#ffffff' } });
                }
            }
        } else {
            // 采集资源
            var closestResource = creep.pos.findClosestByRange(FIND_SOURCES);
            if (creep.harvest(closestResource) == ERR_NOT_IN_RANGE) {
                creep.moveTo(closestResource, { maxRooms: 1, visualizePathStyle: { stroke: '#ffaa00' } });
            }
        }
    }
};

module.exports = rolePioneer;