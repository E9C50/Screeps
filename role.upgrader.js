var creepsUtils = require('utils.creeps');

var roleUpgrader = {
    run: function (creep) {
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
            // if(creep.signController(creep.room.controller, "I am a beginner, playing peacefully. Please don't attack me!!!") == ERR_NOT_IN_RANGE) {
            //     creep.moveTo(creep.room.controller);
            // }
            if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, { maxRooms: 1, visualizePathStyle: { stroke: '#ffffff' } });
            }
        } else {
            const mostContainer = creep.room.find(FIND_STRUCTURES, {
                filter: container =>
                    container.structureType === STRUCTURE_CONTAINER
                    && container.store[RESOURCE_ENERGY] > 500
            }).reduce((max, container) => {
                if (container.store[RESOURCE_ENERGY] > (max ? max.store[RESOURCE_ENERGY] : 0)) {
                    return container;
                }
                return max;
            }, null);

            var closestContainer = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: structure =>
                    structure.structureType === STRUCTURE_CONTAINER
                    && structure.store[RESOURCE_ENERGY] > 500
            });

            if (creep.withdraw(mostContainer, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(closestContainer, { maxRooms: 1, visualizePathStyle: { stroke: '#ffaa00' } });
            }
        }
    }
};

module.exports = roleUpgrader;