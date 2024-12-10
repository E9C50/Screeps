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
            // 查找建造任务并执行，优先 Spawn
            var buildTarget = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES, {
                filter: structure => structure.structureType === STRUCTURE_SPAWN
            });
            // 其次 Container
            if (!buildTarget) {
                buildTarget = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES, {
                    filter: structure => structure.structureType === STRUCTURE_CONTAINER
                });
            }
            // 其次 Extension
            if (!buildTarget) {
                buildTarget = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES, {
                    filter: structure => structure.structureType === STRUCTURE_EXTENSION
                });
            }
            // 其他类型
            if (!buildTarget) {
                buildTarget = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
            }
            if (buildTarget) {
                if (creep.build(buildTarget) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(buildTarget, { maxRooms: 1, visualizePathStyle: { stroke: '#ffffff' } });
                }
            }
        } else {
            // 获取距离最近的Container，有则直接拿资源，没有就去挖矿
            var closestContainer = creep.pos.findInRange(FIND_STRUCTURES, 5, {
                filter: structure =>
                    structure.structureType === STRUCTURE_CONTAINER
                    && structure.store[RESOURCE_ENERGY] > 0
            })[0];
            if (closestContainer) {
                if (creep.withdraw(closestContainer, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(closestContainer, { maxRooms: 1, visualizePathStyle: { stroke: '#ffaa00' } });
                }
                return;
            }
            // 采集资源
            var closestResource = creep.pos.findClosestByRange(FIND_SOURCES);
            if (creep.harvest(closestResource) == ERR_NOT_IN_RANGE) {
                creep.moveTo(closestResource, { maxRooms: 1, visualizePathStyle: { stroke: '#ffaa00' } });
            }
        }
    }
};

module.exports = rolePioneer;