var creepsUtils = require('utils.creeps');

// 资源获取模式，true：距离最近的；false：存货最多的
const sourceClosestMode = false;

var roleUpgrader = {
    run: function (creep) {
        // 调整工作模式
        if (creep.memory.upgrading && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.upgrading = false;
        }
        if (!creep.memory.upgrading && creep.store.getFreeCapacity() == 0) {
            creep.memory.upgrading = true;
        }
        if (!creep.memory.upgrading && creepsUtils.pickupDroppedResource(creep)) {
            return;
        }

        if (creep.memory.upgrading) {
            // 房间签名
            // if(creep.signController(creep.room.controller, "I am a beginner, playing peacefully. Please don't attack me!!!") == ERR_NOT_IN_RANGE) {
            //     creep.moveTo(creep.room.controller);
            // }

            // 执行升级任务
            if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, { maxRooms: 1, visualizePathStyle: { stroke: '#ffffff' } });
            }
        } else {
            // 获取存货最多的Container
            const mostContainer = creep.room.find(FIND_STRUCTURES, {
                filter: container =>
                    container.structureType === STRUCTURE_CONTAINER
                    && container.store[RESOURCE_ENERGY] > 200
            }).reduce((max, container) => {
                if (container.store[RESOURCE_ENERGY] > (max ? max.store[RESOURCE_ENERGY] : 0)) {
                    return container;
                }
                return max;
            }, null);

            // 获取距离最近的Container
            var closestContainer = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: structure =>
                    structure.structureType === STRUCTURE_CONTAINER
                    && structure.store[RESOURCE_ENERGY] > 200
            });

            var targetContainer = sourceClosestMode ? closestContainer : mostContainer;
            if (creep.withdraw(targetContainer, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(targetContainer, { maxRooms: 1, visualizePathStyle: { stroke: '#ffaa00' } });
            }
        }
    }
};

module.exports = roleUpgrader;