var creepsUtils = require('utils.creeps');
var roomUtils = require('utils.room');

var roleCarryer = {
    run: function (creep) {
        if (creep.memory.carrying && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.carrying = false;
        }
        if (!creep.memory.carrying && creep.store.getFreeCapacity() == 0) {
            creep.memory.carrying = true;
        }

        if (!creep.memory.carrying && creepsUtils.pickupDroppedResource(creep)) {
            return;
        }

        if (!creep.memory.carrying) {
            var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: structure =>
                    structure.structureType === STRUCTURE_CONTAINER
                    && structure.store[RESOURCE_ENERGY] > 0
            });
            if (creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target, { maxRooms: 1,  visualizePathStyle: { stroke: '#ffaa00' } });
            }
        } else {
            var structures = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION
                        || structure.structureType == STRUCTURE_SPAWN)
                        && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                }
            });

            if (roomUtils.isFighting(creep.room) || structures == '') {
                structures = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return structure.structureType == STRUCTURE_TOWER
                            && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                    }
                });
            }

            if (structures.length > 0) {
                if (creep.transfer(structures[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(structures[0], { maxRooms: 1,  visualizePathStyle: { stroke: '#ffffff' } });
                }
            }
        }
    }
};

module.exports = roleCarryer;