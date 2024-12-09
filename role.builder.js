var creepsUtils = require('utils.creeps');

var roleBuilder = {
	run: function (creep) {
		if (creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) {
			creep.memory.building = false;
		}
		if (!creep.memory.building && creep.store.getFreeCapacity() == 0) {
			creep.memory.building = true;
		}

		if (!creep.memory.building && creepsUtils.pickupDroppedResource(creep)) {
			return;
		}

		if (creep.memory.building) {
			var build_target = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES, {
				// filter: structure => structure.structureType === STRUCTURE_CONTAINER
				filter: structure => structure.structureType === STRUCTURE_TOWER
			});
			if (!build_target) {
				build_target = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
			}

			var repair_target = creep.room.find(FIND_STRUCTURES, {
				filter: structure => structure.hits < structure.hitsMax && structure.hits < 100
			}).reduce((min, structure) => {
				if (min == null) { return structure }
				return structure.hits < min.hits ? structure : min;
			}, null);

			if (build_target) {
				if (creep.build(build_target) == ERR_NOT_IN_RANGE) {
					creep.moveTo(build_target, { maxRooms: 1, visualizePathStyle: { stroke: '#ffffff' } });
				}
			} else {
				const structures = creep.room.find(FIND_STRUCTURES, {
					filter: structure => structure.hits < structure.hitsMax
				});

				if (structures.length > 0) {
					structures.sort((a, b) => a.hits - b.hits);

					const target = structures[0];

					if (creep.repair(target) === ERR_NOT_IN_RANGE) {
						creep.moveTo(target, { maxRooms: 1,  visualizePathStyle: { stroke: '#ffffff' } });
					}
				}
			}
		} else {
			const most_container = creep.room.find(FIND_STRUCTURES, {
				filter: container =>
					container.structureType === STRUCTURE_CONTAINER
					&& container.store[RESOURCE_ENERGY] > 200
			}).reduce((max, container) => {
				if (container.store[RESOURCE_ENERGY] > (max ? max.store[RESOURCE_ENERGY] : 0)) {
					return container;
				}
				return max;
			}, null);

			var closest_container = creep.pos.findClosestByRange(FIND_STRUCTURES, {
				filter: structure =>
					structure.structureType === STRUCTURE_CONTAINER
					&& structure.store[RESOURCE_ENERGY] > 200
			});

			if (creep.withdraw(most_container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
				creep.moveTo(most_container, { maxRooms: 1,  visualizePathStyle: { stroke: '#ffaa00' } });
			}
		}
	}
};

module.exports = roleBuilder;