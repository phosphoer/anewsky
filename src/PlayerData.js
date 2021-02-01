TANK.registerComponent("PlayerData")

.construct(function()
{
  this.version = 14;

  this.newGame = function()
  {
    localStorage["save"] = null;

    this.activeQuests = {};
    this.ship = 100;
    this.modules = [200];
    this.cargo = [0];
    this.money = 123456789;

    // Find a random planet to start on
    do
    {
      var startSystemIndex = Math.floor(Math.random() * TANK.Universe.galaxies[0].systems.length);
      var system = TANK.Universe.galaxies[0].systems[startSystemIndex];
      this.lastGalaxy = 0;
      this.lastSystem = startSystemIndex;
      this.lastPlanet = 0;
    } while (system.planets.length == 0);

    this.start();
  };

  this.load = function()
  {
    var saveData = localStorage["save"];

    if (!saveData || saveData == "null")
    {
      console.log("No save file found, starting a new game");
      this.newGame();
      return;
    }

    // Check compatibility
    var save = JSON.parse(saveData);
    if (save.version != this.version)
    {
      console.error("The save file is incompatible with this version, it must be wiped : (");
      this.newGame();
      return;
    }

    // Load quests
    this.activeQuests = {};
    for (var i in save.activeQuests)
    {
      var savedQuest = save.activeQuests[i];
      var quest = new Quest();
      quest.load(savedQuest);
      this.activeQuests[i] = quest;
    }

    // Load explored systems
    for (var i = 0; i < save.exploredSystems.length; ++i)
    {
      var data = save.exploredSystems[i];
      TANK.Universe.galaxies[data.galaxy].systems[data.system].explored = true;
    }

    // Load assets
    for (var i = 0; i < save.assets.length; ++i)
    {
      var asset = save.assets[i];
      var cargobay = TANK.Universe.galaxies[asset.galaxy].systems[asset.system].planets[asset.planet].entity.CargoBay;
      if (cargobay)
        cargobay.addItem(asset.item);
    }

    // Load cargo
    this.cargo = [];
    for (var i = 0; i < save.cargo.length; ++i)
      this.cargo.push(save.cargo[i]);

    this.ship = save.ship;
    this.modules = save.modules;
    this.money = save.money;
    this.lastPlanet = save.lastPlanet;
    this.lastSystem = save.lastSystem;
    this.lastGalaxy = save.lastGalaxy;
    TANK.Universe.elapsedTime = save.elapsedTime;

    this.start();
  };

  this.save = function()
  {
    var planet = this.dockingBay.parent.Planet.planetData;
    var save = {};
    save.version = this.version;
    save.activeQuests = {};
    for (var i in this.activeQuests)
      save.activeQuests[i] = this.activeQuests[i].save();
    save.ship = this.ship;
    save.modules = this.modules;
    save.money = this.money;
    save.elapsedTime = TANK.Universe.elapsedTime;

    // Save location
    for (var i = 0; i < TANK.Universe.galaxies.length; ++i)
    {
      var galaxy = TANK.Universe.galaxies[i];
      if (galaxy === planet.system.galaxy)
      {
        save.lastGalaxy = i;
        break;
      }
    }
    var galaxy = TANK.Universe.galaxies[save.lastGalaxy];

    for (var i = 0; i < galaxy.systems.length; ++i)
    {
      var system = galaxy.systems[i];
      if (system === planet.system)
      {
        save.lastSystem = i;
        break;
      }
    }
    var system = galaxy.systems[save.lastSystem];

    for (var i = 0; i < system.planets.length; ++i)
    {
      var p = system.planets[i];
      if (p === planet)
      {
        save.lastPlanet = i;
        break;
      }
    }

    // Save cargohold
    var player = this.dockingBay.getDockedShip("Player");
    save.cargo = [];
    for (var n = 0; n < player.CargoBay.items.length; ++n)
    {
      save.cargo.push(player.CargoBay.items[n].itemIndex);
    }

    // Save system related data
    save.assets = [];
    save.exploredSystems = [];
    for (var i = 0; i < TANK.Universe.galaxies.length; ++i)
    {
      var galaxy = TANK.Universe.galaxies[i];
      for (var j = 0; j < galaxy.systems.length; ++j)
      {
        var system = galaxy.systems[j];

        // Save explored status
        if (system.explored)
          save.exploredSystems.push({galaxy: i, system: j});

        for (var k = 0; k < system.planets.length; ++k)
        {
          var planet = system.planets[k];

          // Save assets
          var cargo = planet.entity.CargoBay;
          for (var n = 0; cargo && n < cargo.items.length; ++n)
          {
            var asset = {};
            asset.planet = k;
            asset.system = j;
            asset.galaxy = i;
            asset.item = cargo.items[n].itemIndex;
            save.assets.push(asset);
          }
        }
      }
    }

    var saveData = JSON.stringify(save);
    localStorage["save"] = saveData;
  };

  this.start = function()
  {
    TANK.Universe.setCurrentSystem(TANK.Universe.galaxies[this.lastGalaxy].systems[this.lastSystem]);

    // Spawn player
    var e = TANK.createEntity("Ship, Player");
    e.Pos2D.x = TANK.Universe.currentSystem.planets[this.lastPlanet].entity.Pos2D.x;
    e.Pos2D.y = TANK.Universe.currentSystem.planets[this.lastPlanet].entity.Pos2D.y;
    e.Ship.zdepth = 5;
    TANK.addEntity(e, "Player");
    e.addComponent("ShipReadoutUI");

    for (var i = 0; i < this.cargo.length; ++i)
      e.CargoBay.addItem(this.cargo[i]);

    for (var i = 0; i < this.modules.length; ++i)
      e.Modules.addModule(this.modules[i]);
  };
})

.initialize(function()
{
});