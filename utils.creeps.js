var creepsUtils = {
    /**
     * 捡起地上掉落的资源/墓碑的资源
     * @param {*} creep 
     * @returns 
     */
    pickupDroppedResource: function (creep) {
        if (creep.store.getFreeCapacity() == 0) {
            return false;
        }

        // 优先捡起附近掉落的资源
        const droppedEnergy = creep.pos.findInRange(FIND_DROPPED_RESOURCES, 5, {
            filter: resource => resource.resourceType === RESOURCE_ENERGY
        });

        if (droppedEnergy.length > 0) {
            if (creep.pickup(droppedEnergy[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(droppedEnergy[0], { maxRooms: 1 });
            }
            return true;
        }

        // 捡起附近墓碑的资源
        var destroyed = creep.pos.findInRange(FIND_TOMBSTONES, 5, {
            filter: tombstone => tombstone.store[RESOURCE_ENERGY] > 0
        });

        if (destroyed == '' || destroyed.length == 0) {
            destroyed = creep.pos.findInRange(FIND_RUINS, 10, {
                filter: ruin => ruin.store[RESOURCE_ENERGY] > 0
            });
        }

        if (destroyed.length > 0) {
            if (creep.withdraw(destroyed[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(destroyed[0], { maxRooms: 1 });
            }
            return true;
        }
        return false;
    }
}
module.exports = creepsUtils;