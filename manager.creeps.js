var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleCarryer = require('role.carryer');
var roleClaimer = require('role.claimer');
var rolePioneer = require('role.pioneer');

var roomUtils = require('utils.room');

const MAX_CARRYER = 2;
const MAX_PIONEER = 2;
const MAX_BUILDER = 4;
const MAX_UPGRADER = 4;

// 矿工数量自动根据坑位计算
var MAX_HARVESTER0 = 0;
var MAX_HARVESTER1 = 0;

function genbodyHarvester(maxEnergy) {
    if (maxEnergy >= 500) { // 建建建建带动 500
        return [WORK, WORK, WORK, WORK, CARRY, MOVE]
    } else if (maxEnergy >= 300) { // 建建带动 300
        return [WORK, WORK, CARRY, MOVE]
    }
}

function genbodyCarryer(maxEnergy) {
    if (maxEnergy >= 500) { // 带带带带带动动动动动 500
        return [CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE]
    } else if (maxEnergy >= 300) { // 带带带动动动 300
        return [CARRY, CARRY, CARRY, MOVE, MOVE, MOVE]
    }
}

function genbodyWorker(maxEnergy) {
    if (maxEnergy >= 500) { // 建建带带动动动动 500
        return [WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE]
    } else if (maxEnergy >= 300) { // 建带动动 250
        return [WORK, CARRY, MOVE, MOVE]
    }
}

function autoSpawnCreep(room) {
    var harvester0 = _.filter(Game.creeps, (creep) => creep.room.name == room.name && creep.memory.role == 'harvester0');
    var harvester1 = _.filter(Game.creeps, (creep) => creep.room.name == room.name && creep.memory.role == 'harvester1');
    var carryer = _.filter(Game.creeps, (creep) => creep.room.name == room.name && creep.memory.role == 'carryer');
    var pioneer = _.filter(Game.creeps, (creep) => creep.room.name == room.name && creep.memory.role == 'pioneer');
    var builder = _.filter(Game.creeps, (creep) => creep.room.name == room.name && creep.memory.role == 'builder');
    var upgrader = _.filter(Game.creeps, (creep) => creep.room.name == room.name && creep.memory.role == 'upgrader');

    if (Game.time % 1 === 0) {
        console.log(room.name, ' ',
            'pioneer ', pioneer.length, ' ',
            'carryer ', carryer.length, ' ',
            'harvester0 ', harvester0.length, ' ',
            'harvester1 ', harvester1.length, ' ',
            'builder ', builder.length, ' ',
            'upgrader ', upgrader.length
        )
    }

    // 自动计算挖矿坑位
    MAX_HARVESTER0 = roomUtils.getCanHarvesterPos(room, FIND_SOURCES, 0);
    MAX_HARVESTER1 = roomUtils.getCanHarvesterPos(room, FIND_SOURCES, 1);

    // 获取房间可生产最大energy值
    var extensionCount = room.find(FIND_STRUCTURES, { filter: structure => structure.structureType === STRUCTURE_EXTENSION }).length;
    var maxEnergy = extensionCount * 50 + 300

    // 获取房间内的相关建筑
    var spawn = room.find(FIND_STRUCTURES, { filter: structure => structure.structureType === STRUCTURE_SPAWN })[0]
    var containers = room.find(FIND_STRUCTURES, { filter: structure => structure.structureType === STRUCTURE_CONTAINER })

    if (!spawn) {
        return
    }

    // 打印生成信息
    if (spawn.spawning) {
        var spawningCreep = Game.creeps[spawn.spawning.name];
        spawn.room.visual.text('🛠️' + spawningCreep.memory.role,
            spawn.pos.x + 1, spawn.pos.y, { align: 'left', opacity: 0.8 });
        return;
    }

    if (pioneer < MAX_PIONEER && containers.length == 0) {
        var newName = 'Pioneer_' + Game.time;
        spawn.spawnCreep(genbodyWorker(maxEnergy), newName, { memory: { role: 'pioneer' } });
        return;
    }

    if (harvester1.length < MAX_HARVESTER1) {
        var newName = 'Harvester_' + Game.time;
        spawn.spawnCreep(genbodyHarvester(maxEnergy), newName, { memory: { role: 'harvester1' } });
        return;
    }

    if (carryer.length < MAX_CARRYER) {
        var newName = 'Carryer_' + Game.time;
        spawn.spawnCreep(genbodyCarryer(maxEnergy), newName, { memory: { role: 'carryer' } });
        return;
    }

    if (harvester0.length < MAX_HARVESTER0) {
        var newName = 'Harvester_' + Game.time;
        spawn.spawnCreep(genbodyHarvester(maxEnergy), newName, { memory: { role: 'harvester0' } });
        return;
    }

    if (builder.length < MAX_BUILDER && spawn.room.find(FIND_CONSTRUCTION_SITES).length >= 1) {
        var newName = 'Builder_' + Game.time;
        spawn.spawnCreep(genbodyWorker(maxEnergy), newName, { memory: { role: 'builder' } });
        return;
    }

    if (upgrader.length < MAX_UPGRADER) {
        var newName = 'Upgrader_' + Game.time;
        spawn.spawnCreep(genbodyWorker(maxEnergy), newName, { memory: { role: 'upgrader' } });
        return;
    }
}

function creepsWorkManage() {
    for (var name in Game.creeps) {
        var creep = Game.creeps[name];

        if (creep.memory.role == 'harvester0') {
            roleHarvester.run(creep, FIND_SOURCES, 0);
        } else if (creep.memory.role == 'harvester1') {
            roleHarvester.run(creep, FIND_SOURCES, 1);
        } else if (creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        } else if (creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        } else if (creep.memory.role == 'carryer') {
            roleCarryer.run(creep);
        } else if (creep.memory.role == 'pioneer') {
            rolePioneer.run(creep);
        } else if (creep.memory.role == 'claimer') {
            roleClaimer.run(creep, 'E35N33');
        }
    }
}

var creepsManager = {
    run: function () {
        // 清除死亡的Creeps
        for (var name in Memory.creeps) {
            if (!Game.creeps[name]) {
                delete Memory.creeps[name];
            }
        }

        // 自动生产管理器
        for (roomName in Game.rooms) {
            var room = Game.rooms[roomName];
            autoSpawnCreep(room);
        }

        // 工作管理器
        creepsWorkManage();
    }
};


module.exports = creepsManager;