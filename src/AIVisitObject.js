TANK.registerComponent("AIVisitObject")

.construct(function()
{
  this.destEntity = null;
})

.initialize(function()
{
  this.pickDestination = function()
  {
    var numPlanets = TANK.Universe.currentSystem.planets.length;
    var planet = TANK.Universe.currentSystem.planets[Math.floor(Math.random() * numPlanets)];
    if (planet)
      this.destEntity = planet.entity;
    this.visitTime = 10 + Math.random() * 20;
  };

  this.addEventListener("OnEnterFrame", function(dt)
  {
    // Pick a destination
    var t = this.parent.Pos2D;
    if (!this.destEntity)
      this.pickDestination();

    // Couldn't find a destination, just warp away
    if (!this.destEntity)
    {
      this.visitTime -= dt;
      if (this.visitTime <= 0)
      {
        this.parent.AIShip.removeBehavior("AIVisitObject");
        this.parent.AIShip.addBehavior("AIWarpAway");
      }
    }

    if (!this.destEntity)
      return;

    // Turn towards destination
    // Find direction
    var tDest = this.destEntity.Pos2D;
    var myDir = [Math.cos(t.rotation), Math.sin(t.rotation)];
    var angleToPlanet = Math.atan2(this.destEntity.Pos2D.y - t.y, this.destEntity.Pos2D.x - t.x) + Math.PI / 2;
    var planetDir = [Math.cos(angleToPlanet), Math.sin(angleToPlanet)];
    var cross = myDir[0] * planetDir[1] - myDir[1] * planetDir[0];
    if (cross < -0.05)
    {
      this.parent.Engines.left = true;
      this.parent.Engines.right = false;
      this.parent.Engines.straighten = false;
    }
    else if (cross > 0.05)
    {
      this.parent.Engines.right = true;
      this.parent.Engines.left = false;
      this.parent.Engines.straighten = false;
    }
    else
    {
      this.parent.Engines.right = false;
      this.parent.Engines.left = false;
      this.parent.Engines.straighten = true;
    }

    // Calculate distance
    var distance = TANK.Math.pointDistancePoint([t.x, t.y], [tDest.x, tDest.y]);
    if (distance < 200)
    {
      // Slow down
      this.parent.Engines.forward = false;
      this.parent.Engines.stop = true;
      this.arrived = true;
    }
    else
    {
      // Move towards destination
      this.parent.Engines.forward = true;
      this.parent.Engines.stop = false;
    }

    // Visit for a limited amount of time
    if (this.arrived)
    {
      this.visitTime -= dt;

      if (this.visitTime <= 0)
      {
        this.arrived = false;

        // If we are done visiting, either warp away or visit a new planet
        if (Math.random() < 0.5)
          this.pickDestination();
        else
        {
          this.parent.AIShip.removeBehavior("AIVisitObject");
          this.parent.AIShip.addBehavior("AIWarpAway");
        }
      }
    }

    // Coast if we are already moving at max velocity
    myDir = [this.parent.Velocity.x, this.parent.Velocity.y];
    var vel = TANK.Math.pointDistancePoint(myDir, [0, 0]);
    cross = myDir[0] * planetDir[1] - myDir[1] * planetDir[0];
    if (Math.abs(vel - this.parent.Ship.shipData.maxSpeed) < 1 && Math.abs(cross) < 0.5)
    {
      this.parent.Engines.forward = false;
    }
  });
});
