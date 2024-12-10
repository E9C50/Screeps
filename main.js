var roomManager = require('manager.room');
var creepManager = require('manager.creeps');
var controlManager = require('manager.control');
var trafficManager = require('manager.traffic');

var towerManager = require('structure.tower');

trafficManager.init();

module.exports.loop = function () {
    // 利用空闲CPU生成Pixel
    if (typeof Game.cpu.generatePixel === 'function') {
        console.log(Game.cpu.bucket);
        Game.cpu.generatePixel();
    }

    // Room管理器（安全模式检测，寻路优化）
    roomManager.run();

    // Creeps管理器（自动生成，工作管理）
    creepManager.run();

    // Tower管理器（优先攻击 -> 修复 -> 治疗）
    towerManager.run();

    // 主动控制管理器（开拓地盘）
    controlManager.run();

    // 寻路优化
    for (const roomName in Game.rooms) {
        const room = Game.rooms[roomName];
        trafficManager.run(room);
    }
}