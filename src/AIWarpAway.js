TANK.registerComponent("AIWarpAway")

.construct(function()
{
  this.destSystem = null;
  this.destPos = null;
})

.initialize(function()
{
  this.addEventListener("OnEnterFrame", function(dt)
  {
    // Pick a destination
    var t = this.parent.Pos2D;
    if (!this.destSystem)
    {
      this.destSystem = TANK.Universe.currentSystem.getClosestSystem();
    }

    // Turn towards destination
    // Find direction
    if (!this.destPos)
      this.destPos = [-5000 + Math.random() * 10000, -5000 + Math.random() * 10000];
    var myDir = [Math.cos(t.rotation), Math.sin(t.rotation)];
    var angleToPlanet = Math.atan2(this.destPos[1] - t.y, this.destPos[0] - t.x) + Math.PI / 2;
    var planetDir = [Math.cos(angleToPlanet), Math.sin(angleToPlanet)];
    var cross = myDir[0] * planetDir[1] - myDir[1] * planetDir[0];
    if (cross < 0)
    {
      this.parent.Engines.left = true;
      this.parent.Engines.right = false;
    }
    else if (cross > 0)
    {
      this.parent.Engines.right = true;
      this.parent.Engines.left = false;
    }
    this.parent.Engines.forward = false;
    this.parent.Engines.backward = false;
    this.parent.Engines.stop = true;

    if (Math.abs(this.parent.Velocity.x) < 5 && Math.abs(this.parent.Velocity.y) < 5)
    {
      if (Math.abs(cross) < 0.1)
      {
        if (this.parent.Engines.BeginWarp(this.destSystem))
          this.parent.AIShip.removeBehavior("AIWarpAway");
      }
    }
  });
});
