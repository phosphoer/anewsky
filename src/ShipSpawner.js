TANK.registerComponent("ShipSpawner")

.construct(function()
{
  this.spawnTimeMin = 20;
  this.spawnTimeRand = 25;
  this.spawnTimer = this.spawnTimeMin + Math.random() * this.spawnTimeRand;

  this.spawnCivilianShip = function()
  {
    // Count existing AI ships
    var numShips = 0;
    for (var i = 0; i < TANK.Universe.systemEntities.length; ++i)
    {
      var e = TANK.Universe.systemEntities[i];
      if (e.Ship && e.AIShip && e.Ship.shipData.classification === "civilian")
        ++numShips;
    }
    if (numShips >= TANK.Universe.currentSystem.averagePopulation)
      return;

    var e = TANK.createEntity("AIShip");
    e.Ship.zdepth = 4;
    e.Pos2D.x = -5000 + Math.random() * 10000;
    e.Pos2D.y = -5000 + Math.random() * 10000;

    // Name the ship
    if (CurrentShipName >= ShipNames.length)
      CurrentShipName = 0;
    e.Ship.shipName = ShipNames[CurrentShipName++];

    TANK.addEntity(e);
    TANK.Universe.systemEntities.push(e);

    // Pick what type of ship it is
    var faction = Factions[TANK.Universe.currentSystem.owner];
    var shipPresetIndex = Math.floor(Math.random() * faction.ships.civilian.length);
    var shipPreset = faction.ships.civilian[shipPresetIndex];
    e.Ship.setShipData(shipPreset.ship);
    for (var i = 0; i < shipPreset.modules.length; ++i)
      e.Modules.addModule(shipPreset.modules[i]);
  };

  this.spawnMilitaryShip = function()
  {
    // Count existing AI ships
    var numShips = 0;
    for (var i = 0; i < TANK.Universe.systemEntities.length; ++i)
    {
      var e = TANK.Universe.systemEntities[i];
      if (e.Ship && e.AIShip && e.Ship.shipData.classification === "military")
        ++numShips;
    }
    if (numShips >= TANK.Universe.currentSystem.militaryPresence)
      return;

    var e = TANK.createEntity("AIShip");
    e.Ship.zdepth = 4;
    e.Pos2D.x = -5000 + Math.random() * 10000;
    e.Pos2D.y = -5000 + Math.random() * 10000;

    // Name the ship
    if (CurrentShipName >= ShipNames.length)
      CurrentShipName = 0;
    e.Ship.shipName = ShipNames[CurrentShipName++];

    TANK.addEntity(e);
    TANK.Universe.systemEntities.push(e);

    // Pick what type of ship it is
    var faction = Factions[TANK.Universe.currentSystem.owner];
    var militaryShips = [];
    for (var i = 0; faction.ships.militaryLight && i < faction.ships.militaryLight.length; ++i)
      militaryShips.push(faction.ships.militaryLight[i]);
    for (var i = 0; faction.ships.militaryMedium && i < faction.ships.militaryMedium.length; ++i)
      militaryShips.push(faction.ships.militaryMedium[i]);
    for (var i = 0; faction.ships.militaryHeavy && i < faction.ships.militaryHeavy.length; ++i)
      militaryShips.push(faction.ships.militaryHeavy[i]);
    var shipPresetIndex = Math.floor(Math.random() * militaryShips.length);
    var shipPreset = militaryShips[shipPresetIndex];
    e.Ship.setShipData(shipPreset.ship);
    for (var i = 0; i < shipPreset.modules.length; ++i)
      e.Modules.addModule(shipPreset.modules[i]);
  };
})

.initialize(function()
{

  this.addEventListener("OnEnterFrame", function(dt)
  {
    if (TANK.MainMenu)
      return;

    if (this.spawnTimer <= 0)
    {
      this.spawnCivilianShip();
      this.spawnMilitaryShip();
      this.spawnTimer = this.spawnTimeMin + Math.random() * this.spawnTimeRand;
    }

    this.spawnTimer -= dt;
  });
});