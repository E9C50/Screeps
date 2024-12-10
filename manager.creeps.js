var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleCarryer = require('role.carryer');
var roleClaimer = require('role.claimer');
var rolePioneer = require('role.pioneer');

var roomUtils = require('utils.room');

const MAX_CARRYER = 2;
const MAX_PIONEER = 3;
const MAX_BUILDER = 4;
const MAX_UPGRADER = 10;

// 矿工数量自动根据坑位计算
var MAX_HARVESTER0 = 0;
var MAX_HARVESTER1 = 0;

function genbodyHarvester(maxEnergy, totalEnergy, forceSpawn) {
    var energy = forceSpawn ? totalEnergy : maxEnergy;
    energy = Math.max(300, energy);
    var bodyParts = [];

    bodyParts.push(CARRY);
    bodyParts.push(MOVE);
    energy -= BODYPART_COST.carry;
    energy -= BODYPART_COST.move;

    var workCount = parseInt(energy / BODYPART_COST.work);
    for (let i = 0; i < workCount; i++) {
        bodyParts.push(WORK);
    }

    return bodyParts;
}

function genbodyCarryer(maxEnergy, totalEnergy, forceSpawn) {
    var energy = forceSpawn ? totalEnergy : maxEnergy;
    energy = Math.max(300, energy);
    var bodyParts = [];

    var totalPartCount = energy / 50;
    if (totalPartCount % 2 == 1) {
        totalPartCount -= 1;
    }

    var singlePartCount = totalPartCount / 2;

    for (let i = 0; i < singlePartCount; i++) {
        bodyParts.push(MOVE);
        bodyParts.push(CARRY);
    }

    return bodyParts;
}

function genbodyWorker(maxEnergy, totalEnergy, forceSpawn) {
    var energy = forceSpawn ? totalEnergy : maxEnergy;
    energy = Math.max(300, energy);
    var bodyParts = [];

    bodyParts.push(CARRY);
    bodyParts.push(MOVE);
    energy -= BODYPART_COST.carry;
    energy -= BODYPART_COST.move;

    while (energy >= 150) {
        bodyParts.push(WORK);
        bodyParts.push(MOVE);
        energy -= BODYPART_COST.work;
        energy -= BODYPART_COST.move;
    }

    if (energy == 100) {
        bodyParts.push(CARRY);
        bodyParts.push(MOVE);
        energy -= BODYPART_COST.carry;
        energy -= BODYPART_COST.move;
    }
    return bodyParts;
}

function autoSpawnCreep(room) {
    var harvester0 = _.filter(Game.creeps, (creep) => creep.room.name == room.name && creep.memory.role == 'harvester0');
    var harvester1 = _.filter(Game.creeps, (creep) => creep.room.name == room.name && creep.memory.role == 'harvester1');
    var carryer = _.filter(Game.creeps, (creep) => creep.room.name == room.name && creep.memory.role == 'carryer');
    var pioneer = _.filter(Game.creeps, (creep) => creep.room.name == room.name && creep.memory.role == 'pioneer');
    var builder = _.filter(Game.creeps, (creep) => creep.room.name == room.name && creep.memory.role == 'builder');
    var upgrader = _.filter(Game.creeps, (creep) => creep.room.name == room.name && creep.memory.role == 'upgrader');

    // 显示单位信息
    var logInfo = room.name +
        ' pioneer ' + pioneer.length + ' carryer ' + carryer.length +
        ' harvester0 ' + harvester0.length + ' harvester1 ' + harvester1.length +
        ' builder ' + builder.length + ' upgrader ' + upgrader.length;
    room.visual.text(logInfo, 0, 1, { align: 'left' });

    // 自动计算挖矿坑位
    MAX_HARVESTER0 = roomUtils.getCanHarvesterPos(room, FIND_SOURCES, 0);
    MAX_HARVESTER1 = roomUtils.getCanHarvesterPos(room, FIND_SOURCES, 1);

    // 获取房间可生产最大energy值
    var extensionCount = room.find(FIND_STRUCTURES, { filter: structure => structure.structureType === STRUCTURE_EXTENSION }).length;
    var maxEnergy = extensionCount * 50 + 300
    var totalEnergy = roomUtils.getTotalEnergy(room);

    // 获取房间内的相关建筑
    var spawn = room.find(FIND_STRUCTURES, { filter: structure => structure.structureType === STRUCTURE_SPAWN })[0]
    var containers = room.find(FIND_STRUCTURES, { filter: structure => structure.structureType === STRUCTURE_CONTAINER })

    // 判断是否需要生产Builder
    var constructionSiteCount = spawn.room.find(FIND_CONSTRUCTION_SITES).length;
    var needRepairCount = spawn.room.find(FIND_STRUCTURES, {
        filter: structure => structure.hits < structure.hitsMax
    }).length;
    var needBuilder = constructionSiteCount > 0 || needRepairCount > 0;

    if (!spawn) { return; }

    // 打印生成信息
    if (spawn.spawning) {
        var spawningCreep = Game.creeps[spawn.spawning.name];
        spawn.room.visual.text('🛠️' + spawningCreep.memory.role, spawn.pos.x + 1, spawn.pos.y);
        return;
    }

    if (pioneer.length < MAX_PIONEER && containers.length == 0) {
        var newName = 'Pioneer_' + Game.time;
        spawn.spawnCreep(genbodyWorker(maxEnergy, totalEnergy, true), newName, { memory: { role: 'pioneer' } });
        return;
    }

    if (carryer.length < MAX_CARRYER && (harvester1.length > 0 || harvester0.length > 0)) {
        var newName = 'Carryer_' + Game.time;
        spawn.spawnCreep(genbodyCarryer(maxEnergy, totalEnergy, true), newName, { memory: { role: 'carryer' } });
        return;
    }

    if (harvester1.length < MAX_HARVESTER1) {
        var newName = 'Harvester1_' + Game.time;
        spawn.spawnCreep(genbodyHarvester(maxEnergy, totalEnergy, carryer.length == 0), newName, { memory: { role: 'harvester1' } });
        return;
    }

    if (harvester0.length < MAX_HARVESTER0) {
        var newName = 'Harvester0_' + Game.time;
        spawn.spawnCreep(genbodyHarvester(maxEnergy, totalEnergy, false), newName, { memory: { role: 'harvester0' } });
        return;
    }

    if (builder.length < MAX_BUILDER && needBuilder) {
        var newName = 'Builder_' + Game.time;
        spawn.spawnCreep(genbodyWorker(maxEnergy, totalEnergy, false), newName, { memory: { role: 'builder' } });
        return;
    }

    if (upgrader.length < MAX_UPGRADER) {
        var newName = 'Upgrader_' + Game.time;
        spawn.spawnCreep(genbodyWorker(maxEnergy, totalEnergy, false), newName, { memory: { role: 'upgrader' } });
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