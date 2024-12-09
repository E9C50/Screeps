var controlManager = {
    run: function () {
        // 临时调遣到其他房间工作
        var targetRoomName = 'E35N33';
        var creep_name_list = ['Harvester0_E35N33_001'];
        creep_name_list.map(creep_name => {
            var creep = Game.creeps[creep_name];
            if (creep && creep.room.name != targetRoomName) {
                const exitDirection = creep.room.findExitTo(targetRoomName);
                const exit = creep.pos.findClosestByRange(exitDirection);
                creep.moveTo(exit);  // 移动到目标房间的出口
            }
        })
    }
};

module.exports = controlManager;