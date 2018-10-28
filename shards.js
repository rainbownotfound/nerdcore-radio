const { ShardingManager } = require('discord.js');
const shard = new ShardingManager(`./server.js`, {
    token: process.env.TOKEN,
    autoSpawn: true
});

shard.spawn(1);

setInterval(function() {
    shard.respawnAll()
}, 7200000);

shard.on('launch', s => console.log(`[ShardingManager ${shard.token}] Shard ${shard.id} / ${shard.totalShards} launched successfully.`));