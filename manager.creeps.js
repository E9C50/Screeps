var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleCarryer = require('role.carryer');
var roleClaimer = require('role.claimer');
var rolePioneer = require('role.pioneer');

const MAX_CARRYER = 3;
const MAX_HARVESTER0 = 2;
const MAX_HARVESTER1 = 3;
const MAX_BUILDER = 1;
const MAX_UPGRADER = 8;

function genbody_harvester(max_energy) {
    if (max_energy >= 500) {
        return [WORK, WORK, WORK, WORK, CARRY, MOVE]
    } else if (max_energy >= 300) {
        return [WORK, WORK, CARRY, MOVE]
    }
}

function genbody_carryer(max_energy) {
    if (max_energy >= 500) {
        return [CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE]
    } else if (max_energy >= 300) {
        return [CARRY, CARRY, CARRY, MOVE, MOVE, MOVE]
    }
}

function genbody_upgrader(max_energy) {
    if (max_energy >= 500) {
        return [WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE]
    } else if (max_energy >= 300) {
        return [WORK, CARRY, CARRY, MOVE, MOVE]
    }
}

function genbody_builder(max_energy) {
    if (max_energy >= 500) {
        return [WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE]
    } else if (max_energy >= 300) {
        return [WORK, CARRY, CARRY, MOVE, MOVE]
    }
}

function autoSpawnCreep(room) {
    var harvester0 = _.filter(Game.creeps, (creep) => creep.room.name == room.name && creep.memory.role == 'harvester0');
    var harvester1 = _.filter(Game.creeps, (creep) => creep.room.name == room.name && creep.memory.role == 'harvester1');
    var carryer = _.filter(Game.creeps, (creep) => creep.room.name == room.name && creep.memory.role == 'carryer');
    var builder = _.filter(Game.creeps, (creep) => creep.room.name == room.name && creep.memory.role == 'builder');
    var upgrader = _.filter(Game.creeps, (creep) => creep.room.name == room.name && creep.memory.role == 'upgrader');

    if (Game.time % 1 === 0) {
        console.log(room.name, ' ',
            'harvester0 ', harvester0.length, ' ',
            'harvester1 ', harvester1.length, ' ',
            'carryer ', carryer.length, ' ',
            'builder ', builder.length, ' ',
            'upgrader ', upgrader.length
        )
    }

    // 获取房间可生产最大energy值
    var extension_count = room.find(FIND_STRUCTURES, { filter: structure => structure.structureType === STRUCTURE_EXTENSION }).length;
    var max_energy = extension_count * 50 + 300

    var spawn = room.find(FIND_STRUCTURES, { filter: structure => structure.structureType === STRUCTURE_SPAWN })[0]

    if (!spawn) {
        return
    }

    if (spawn.spawning) {
        var spawningCreep = Game.creeps[spawn.spawning.name];
        spawn.room.visual.text('🛠️' + spawningCreep.memory.role,
            spawn.pos.x + 1, spawn.pos.y, { align: 'left', opacity: 0.8 });
        return;
    }

    if (harvester1.length < MAX_HARVESTER1) {
        var newName = 'Harvester_' + Game.time;
        spawn.spawnCreep(genbody_harvester(max_energy), newName, { memory: { role: 'harvester1' } });
        return;
    }

    if (carryer.length < MAX_CARRYER) {
        var newName = 'Carryer_' + Game.time;
        spawn.spawnCreep(genbody_carryer(max_energy), newName, { memory: { role: 'carryer' } });
        return;
    }

    if (harvester0.length < MAX_HARVESTER0) {
        var newName = 'Harvester_' + Game.time;
        spawn.spawnCreep(genbody_harvester(max_energy), newName, { memory: { role: 'harvester0' } });
        return;
    }

    if (builder.length < MAX_BUILDER && spawn.room.find(FIND_CONSTRUCTION_SITES).length >= 1) {
        var newName = 'Builder_' + Game.time;
        spawn.spawnCreep(genbody_builder(max_energy), newName, { memory: { role: 'builder' } });
        return;
    }

    if (upgrader.length < MAX_UPGRADER) {
        var newName = 'Upgrader_' + Game.time;
        spawn.spawnCreep(genbody_upgrader(max_energy), newName, { memory: { role: 'upgrader' } });
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
        } else if (creep.memory.role == 'claimer') {
            roleClaimer.run(creep, 'E35N33');
        } else if (creep.memory.role == 'pioneer') {
            rolePioneer.run(creep);
        }
    }
}

var creepsManager = {
    run: function () {
        // 清除死亡的creeps
        for (var name in Memory.creeps) {
            if (!Game.creeps[name]) {
                delete Memory.creeps[name];
            }
        }

        for (roomName in Game.rooms) {
            var room = Game.rooms[roomName];
            autoSpawnCreep(room);
        }

        creepsWorkManage();
    }
};


module.exports = creepsManager;