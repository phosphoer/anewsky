var Seeds =
{
  "Close planet": 0,
  "One planet": 42
};

TANK.registerComponent("Universe")

.construct(function()
{
  this.name = "Universe";
  this.description = "The Universe";
  this.seed = Seeds["Close planet"];
  this.rng = new RNG(this.seed);
  this.galaxies = [];
  this.numGalaxies = 0;
  this.numSystems = 0;
  this.numPlanets = 0;
  this.currentSystem = null;
  this.systemEntities = [];
  this.elapsedTime = 0;

  this.minGalaxies = 1;
  this.maxGalaxies = 1;
  this.minSystems = 150;
  this.maxSystems = 175;
  this.minPlanets = 0;
  this.maxPlanets = 6;
  this.uninhabitedChance = 0.05;
})

.initialize(function()
{
  this.removeEntity = function(e)
  {
    if (this.settingSystem)
      return;

    for (var i = 0; i < this.systemEntities.length; ++i)
    {
      if (this.systemEntities[i] === e)
      {
        this.systemEntities.splice(i, 1);
        return;
      }
    }
  };

  this.setCurrentSystem = function(system, noShips)
  {
    this.settingSystem = true;

    // Remove existing system entities
    if (this.currentSystem)
    {
      for (var i = 0; i < this.systemEntities.length; ++i)
        TANK.removeEntity(this.systemEntities[i]);
      this.systemEntities = [];
    }

    this.currentSystem = system;
    system.explored = true;

    // Set base color
    TANK.RenderManager.clearColor = system.baseColor;

    // Create star entity
    var e = system.entity || TANK.createEntity("Star");
    e.Star.systemData = system;
    system.entity = e;
    TANK.addEntity(e);
    this.systemEntities.push(e);

    // Create planet entities
    for (var i = 0; i < system.planets.length; ++i)
    {
      var p = system.planets[i];
      e = p.entity || TANK.createEntity("Planet");
      e.Planet.planetData = p;
      p.entity = e;
      TANK.addEntity(e);
      this.systemEntities.push(e);
    }

    // Create some AI ships
    if (!noShips)
    {
      var rng = new RNG();
      var mod = rng.normal() * 2;
      for (var i = 0; i < system.averagePopulation + mod; ++i)
      {
        TANK.ShipSpawner.spawnCivilianShip();
      }
      for (var i = 0; i < system.militaryPresence; ++i)
      {
        TANK.ShipSpawner.spawnMilitaryShip();
      }
    }

    this.settingSystem = false;
  };

  // Generate names
  GalaxyNames.push("Milky Way");
  GenerateSystemNames(500);
  GenerateShipNames();

  // Generate the universe
  var numGalaxies = Math.round(this.rng.random(this.minGalaxies, this.maxGalaxies));
  for (var i = 0; i < numGalaxies; ++i)
  {
    var g = new Galaxy(i, this);
    this.galaxies.push(g);
    ++this.numGalaxies;
  }

  this.addEventListener("OnEnterFrame", function(dt)
  {
    this.elapsedTime += dt;
  });
})

.destruct(function()
{
  // Remove existing system entities
  if (this.currentSystem)
  {
    for (var i = 0; i < this.systemEntities.length; ++i)
      TANK.removeEntity(this.systemEntities[i]);
    this.systemEntities = [];
  }
});

function Galaxy(seed, universe)
{
  this.name = GalaxyNames[seed];
  this.description = "Test Galaxy";
  this.systems = [];
  this.universe = universe;

  this.min = [Infinity, Infinity];
  this.max = [-Infinity, -Infinity];

  // Generate systems
  var numSystems = Math.round(universe.rng.random(universe.minSystems, universe.maxSystems));
  for (var j = 0; j < numSystems; ++j)
  {
    var s = new System(universe.numSystems, this);
    this.systems.push(s);
    s.index = this.systems.length - 1;
    ++universe.numSystems;
  }

  // Initialize systems
  for (var j = 0; j < this.systems.length; ++j)
  {
    var system = this.systems[j];
    this.min[0] = Math.min(system.x, this.min[0]);
    this.min[1] = Math.min(system.y, this.min[1]);
    this.max[0] = Math.max(system.x, this.max[0]);
    this.max[1] = Math.max(system.y, this.max[1]);

    // Create planet entities
    for (var i = 0; i < system.planets.length; ++i)
    {
      var p = system.planets[i];
      e = p.entity || TANK.createEntity("Planet");
      e.Planet.planetData = p;
      p.entity = e;
      TANK.addEntity(e);
      TANK.removeEntity(e);
    }
  }

  this.size = [this.max[0] - this.min[0], this.max[1] - this.min[1]];

  this.getIndex = function()
  {
    for (var i = 0; i < this.universe.galaxies.length; ++i)
    {
      if (this.universe.galaxies[i] === this)
        return i;
    }

    return null;
  };
}

function System(seed, galaxy)
{
  this.name = SystemNames[seed];
  this.description = "Test System";
  this.galaxy = galaxy;
  this.quests = {};
  this.numQuests = 0;
  this.explored = false;
  this.owner = "Tern";
  var universe = galaxy.universe;

  // Calculate position
  var t = galaxy.systems.length + 20;
  this.x = Math.cos(t) * (t * 0.1) + (universe.rng.uniform() * 2 - 1);
  this.y = Math.sin(t) * (t * 0.1) + (universe.rng.uniform() * 2 - 1);

  // Calculate population
  this.distance = Math.sqrt(this.x * this.x + this.y * this.y);
  this.averagePopulation = Math.round((30 - this.distance) * 0.25 + universe.rng.random(-3, 4));

  // Decide if uninhabited
  if (universe.rng.uniform() <= universe.uninhabitedChance)
  {
    this.uninhabited = true;
    this.averagePopulation = Math.round(universe.rng.uniform() * 3);
  }

  // Calculate military presence
  this.militaryPresence = Math.ceil(this.averagePopulation * 0.3);

  // Calculate colors
  var color = [0 + Math.round(universe.rng.random(0, 20)), 0 + Math.round(universe.rng.random(0, 20)), 0 + Math.round(universe.rng.random(0, 20))];
  this.baseColor = "rgb(" + color[0] + ", " + color[1] + ", " + color[2] + ")";
  color = [180 + Math.round(universe.rng.random(0, 70)), 180 + Math.round(universe.rng.random(0, 70)), 180 + Math.round(universe.rng.random(0, 70))];
  this.starColorA = "rgba(" + color[0] + ", " + color[1] + ", " + color[2] + ", 1)";
  this.starColorB = "rgba(" + color[0] + ", " + color[1] + ", " + color[2] + ", 0.2)";
  this.starColorC = "rgba(" + color[0] + ", " + color[1] + ", " + color[2] + ", 0)";
  this.starSize = universe.rng.random(300, 500);

  // Generate planets
  this.planets = [];
  var numPlanets = Math.round(universe.rng.random(universe.minPlanets, universe.maxPlanets));
  for (var k = 0; k < numPlanets; ++k)
  {
    var p = new Planet(seed, this);
    this.planets.push(p);
    ++universe.numPlanets;
  }

  this.getIndex = function()
  {
    for (var i = 0; i < this.galaxy.systems.length; ++i)
    {
      if (this.galaxy.systems[i] === this)
        return i;
    }

    return null;
  };

  this.getAdjustedPrice = function(itemIndex)
  {
    var item = Items[itemIndex];
    var x = (this.x - this.galaxy.min[0]) / this.galaxy.size[0];
    var y = (this.y - this.galaxy.min[1]) / this.galaxy.size[1];

    var mod = TANK.SupplyDemand.getValue(x, y);
    var price = 0;
    if (mod <= 0.5)
      price = item.minPrice + (item.price - item.minPrice) * mod * 2;
    else
      price = item.price + (item.maxPrice - item.price) * (mod * 2 - 1);

    price = Math.round(price * 100) / 100;
    return price;
  };

  this.getNearbySystem = function(radius)
  {
    var systems = this.getSystemsInRadius(radius);
    var i = Math.floor(Math.random() * systems.length);
    return systems[i];
  };

  this.getSystemsInRadius = function(radius)
  {
    var systems = [];
    for (var i = 0; i < this.galaxy.systems.length; ++i)
    {
      var s = this.galaxy.systems[i];
      if (TANK.Math.pointDistancePoint([this.x, this.y], [s.x, s.y]) <= radius)
        systems.push(s);
    }

    return systems;
  };

  this.getSystemsInRadii = function(radiusA, radiusB)
  {
    var min = Math.min(radiusA, radiusB);
    var max = Math.max(radiusA, radiusB);

    var systems = [];
    for (var i = 0; i < this.galaxy.systems.length; ++i)
    {
      var s = this.galaxy.systems[i];
      var dist = TANK.Math.pointDistancePoint([this.x, this.y], [s.x, s.y]);
      if (dist >= min && dist <= max)
        systems.push(s);
    }

    return systems;
  };

  this.getClosestSystem = function()
  {
    var closestDist = Infinity;
    var closest = null;
    for (var i = 0; i < this.galaxy.systems.length; ++i)
    {
      var s = this.galaxy.systems[i];
      if (this === s)
        continue;

      var dist = TANK.Math.pointDistancePoint([this.x, this.y], [s.x, s.y]);
      if (dist <= closestDist)
      {
        closestDist = dist;
        closest = s;
      }
    }

    return closest;
  };

  this.getRandomPlanet = function()
  {
    return this.planets[Math.floor(Math.random() * this.planets.length)];
  };
}

function Planet(seed, system)
{
  var universe = system.galaxy.universe;
  this.name = system.name + " " + (system.planets.length + 1);
  this.description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis quam urna, ultricies a euismod eget, porttitor vitae sem.";
  this.terrainType = "Rocky Road";
  var color = [Math.round(universe.rng.random(50, 150)), Math.round(universe.rng.random(50, 150)), Math.round(universe.rng.random(50, 150))];
  this.baseColor = "rgb(" + color[0] + ", " + color[1] + ", " + color[2] + ")";
  this.uninhabited = system.uninhabited;
  this.life = true;
  this.size = universe.rng.random(200, 400);
  this.orbitDistance = system.starSize * 2 + this.size + universe.rng.random(0, 10000);
  this.orbitTime = universe.rng.random(2000, 5000);
  this.orbitOffset = universe.rng.uniform() * Math.PI * 2;
  this.system = system;

  this.getIndex = function()
  {
    for (var i = 0; i < this.system.planets.length; ++i)
    {
      if (this.system.planets[i] === this)
        return i;
    }

    return null;
  };
}