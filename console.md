## 控制台常用一次性指令
``` js
Game.spawns['Spawn1'].spawnCreep([CLAIM, MOVE, MOVE, MOVE, MOVE], 'Claimer_001', { memory: { role: 'claimer' } });

Game.spawns['Spawn1'].spawnCreep([WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], 'Harvester0_E35N33_001', { memory: { role: 'harvester0' } });

Game.spawns['Spawn1'].spawnCreep([WORK, WORK, CARRY, MOVE], 'Harvester0_001', { memory: { role: 'harvester0' } });

Game.spawns['Spawn1'].spawnCreep([CARRY, CARRY, CARRY, MOVE, MOVE, MOVE], 'Carryer_001', { memory: { role: 'carryer' } });
```