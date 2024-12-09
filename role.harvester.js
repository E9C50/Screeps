var roleHarvester = {
    run: function (creep, resourceType, resourceIndex) {
        // if (creep.memory.harvesting == undefined) {
        //     creep.memory.harvesting = true
        // }
        if (!creep.memory.harvesting && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.harvesting = true;
        }
        if (creep.memory.harvesting && creep.store.getFreeCapacity() == 0) {
            creep.memory.harvesting = false;
        }

        var targetResource = creep.room.find(resourceType)[resourceIndex];

        // 采集矿物
        if (creep.memory.harvesting) {
            if (creep.harvest(targetResource) == ERR_NOT_IN_RANGE) {
                creep.moveTo(targetResource, { maxRooms: 1, visualizePathStyle: { stroke: '#ffaa00' } });
            }
        }

        // 存放矿物
        if (!creep.memory.harvesting) {
            // 优先放在距离5以内的Container中
            var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: structure =>
                    structure.structureType === STRUCTURE_CONTAINER
                    && structure.store.getFreeCapacity() > 0
                    && structure.pos.getRangeTo(creep) <= 5
            });

            // 如果附近没有Container，则放入Spawn/Extension中
            if (!target) {
                target = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION
                            || structure.structureType == STRUCTURE_SPAWN)
                            && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                    }
                });
            }

            if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target, { maxRooms: 1, visualizePathStyle: { stroke: '#ffffff' } });
            }
        }

    }
};

module.exports = roleHarvester;