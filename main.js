/// <reference path="C:/Users/Artur/AppData/Local/Screeps/scripts/ScreepsAutocomplete/_references.js" />
var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
//Where we build things
var TargetSpawner = 'Home';
//Quotas for unit sustain
var TargetHarvesters = 4;
var TargetUpgraders = 2;
var TargetBuilders = 1;

module.exports.loop = function () {

    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }
    if(Game.spawns[TargetSpawner].store[RESOURCE_ENERGY] >= 300) { //Do we have enough energy to build?
        var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
        var upgrader = _.filter(Game.screeps, (creep) => creep.memory.role == 'upgrader');
        var builder = _.filter(Game.screeps, (creep) => creep.memory.role == 'builder');
        if(harvesters.length < TargetHarvesters) {
            SpawnCreep('harvester', [WORK, CARRY, MOVE]);
        }
        else if(upgrader.length < TargetUpgraders) {
            SpawnCreep('upgrader', [WORK, CARRY, MOVE]);
        }
        else if(builder.length < TargetBuilders) {
            SpawnCreep('builder', [WORK, CARRY, MOVE]);
        }
    }
    if(Game.spawns[TargetSpawner].spawning) { 
        var spawningCreep = Game.creeps[Game.spawns[TargetSpawner].spawning.name];
        Game.spawns[TargetSpawner].room.visual.text(
            '🛠️' + spawningCreep.memory.role,
            Game.spawns[TargetSpawner].pos.x + 1,
            Game.spawns[TargetSpawner].pos.y,
            {align: 'left', opacity: 0.8});
    }

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
    }
}

function defendRoom(roomName) {
    var hostiles = Game.rooms[roomName].find(FIND_HOSTILE_CREEPS);
    if(hostiles.length > 0) {
        var username = hostiles[0].owner.username;
        Game.notify(`User ${username} spotted in room ${roomName}`);
        var towers = Game.rooms[roomName].find(
            FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}});
        towers.forEach(tower => tower.attack(hostiles[0]));
    }
}
///<summary>
///Spawns a creep, requiring a role and a body array
///</summary>
///<param name="role">The role of the spawned creep, will automatically set body type if they are one of the basic types.</param>
///<param name="role">Body, will generate a body from the array given.</param>
var CreepNumberIncrement = 0
function SpawnCreep(role, body = []) {
    var newName = role + CreepNumberIncrement;
    console.log('Attempting to spawn' + newName);
    if(!body.length) {
        console.log('SpawnCreep failed due to empty body list');
        return;
    }
    Game.spawns[TargetSpawner].spawnCreep([body[0], body[1], body[2]], newName, 
    {memory: {role: role}});
    CreepNumberIncrement = CreepNumberIncrement + 1;
};