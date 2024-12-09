var creepsUtils = require('utils.creeps');

var rolePioneer = {
    run: function (creep) {
        // if (!creep.memory.working) {
        //     creep.memory.working = false
        // }
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
            var build_target = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
            if (build_target) {
                if (creep.build(build_target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(build_target, { maxRooms: 1, visualizePathStyle: { stroke: '#ffffff' } });
                }
            }
        } else {
            var closest_resource = creep.pos.findClosestByRange(FIND_SOURCES);
            if (creep.harvest(closest_resource) == ERR_NOT_IN_RANGE) {
                creep.moveTo(closest_resource, { maxRooms: 1, visualizePathStyle: { stroke: '#ffaa00' } });
            }
        }
    }
};

module.exports = rolePioneer;