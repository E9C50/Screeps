var controlManager = {
    run: function () {
        // 临时调遣到其他房间工作
        var targetRoomName = 'E35N33';
        var creepNameList = ['Harvester0_E35N33_001'];
        creepNameList.map(creepName => {
            var creep = Game.creeps[creepName];
            if (creep && creep.room.name != targetRoomName) {
                const exitDirection = creep.room.findExitTo(targetRoomName);
                const exit = creep.pos.findClosestByRange(exitDirection);
                creep.moveTo(exit);  // 移动到目标房间的出口
            }
        })
    }
};

module.exports = controlManager;