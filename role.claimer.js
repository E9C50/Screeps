var roleClaimer = {
    run: function (creep, targetRoomName) {
        // 如果 Creep 不在目标房间，则让它移动到目标房间
        if (creep.room.name !== targetRoomName) {
            const exitDirection = creep.room.findExitTo(targetRoomName);
            const exit = creep.pos.findClosestByRange(exitDirection);
            creep.moveTo(exit);  // 移动到目标房间的出口
        } else {
            // 如果 Creep 已经在目标房间，尝试占领控制器
            const controller = creep.room.controller;
            if (controller && !controller.my) {
                if (creep.claimController(controller) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(controller, { maxRooms: 1,  visualizePathStyle: { stroke: '#ffffff' } });
                }
            }
        }
    }
};

module.exports = roleClaimer;