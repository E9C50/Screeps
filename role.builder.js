var creepsUtils = require('utils.creeps');

// 资源获取模式，true：距离最近的；false：存货最多的
const sourceClosestMode = true;

var roleBuilder = {
	run: function (creep) {
		// 调整工作模式
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
			// 获取优先建造的建筑
			var buildTarget = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES, {
				filter: structure => structure.structureType === STRUCTURE_TOWER
					|| structure.structureType === STRUCTURE_CONTAINER
					|| structure.structureType === STRUCTURE_EXTENSION
			});
			// 其次获取其他建筑
			if (!buildTarget) {
				buildTarget = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
			}

			// 获取需要修复的血量最低的建筑
			var repairTarget = creep.room.find(FIND_STRUCTURES, {
				filter: structure => structure.hits < structure.hitsMax
			}).reduce((min, structure) => {
				if (min == null) { return structure }
				return structure.hits < min.hits ? structure : min;
			}, null);

			if (buildTarget) {
				// 优先建造
				if (creep.build(buildTarget) == ERR_NOT_IN_RANGE) {
					creep.moveTo(buildTarget, { maxRooms: 1, visualizePathStyle: { stroke: '#ffffff' } });
				}
			} else {
				// 其次修复
				if (creep.repair(repairTarget) === ERR_NOT_IN_RANGE) {
					creep.moveTo(repairTarget, { maxRooms: 1, visualizePathStyle: { stroke: '#ffffff' } });
				}
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

module.exports = roleBuilder;