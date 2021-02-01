TANK.registerComponent("AIAttackObject")

.construct(function()
{
  this.destEntity = null;
})

.initialize(function()
{
  this.addEventListener("OnEnterFrame", function(dt)
  {
    if (!this.destEntity)
      return;

    // Turn towards destination
    // Find direction
    var t = this.parent.Pos2D;
    var tDest = this.destEntity.Pos2D;
    var myDir = [Math.cos(t.rotation), Math.sin(t.rotation)];
    var angleToPlanet = Math.atan2(this.destEntity.Pos2D.y - t.y, this.destEntity.Pos2D.x - t.x) + Math.PI / 2;
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

    // Calculate distance
    var distance = TANK.Math.pointDistancePoint([t.x, t.y], [tDest.x, tDest.y]);
    if (distance < 200)
    {
      this.parent.Engines.forward = false;
      this.parent.Engines.stop = true;
    }
    else
    {
      // Move towards destination
      this.parent.Engines.forward = true;
      this.parent.Engines.stop = false;
    }

    // Shoot a lot!
    for (var i = 0; i < this.parent.Modules.slots.length; ++i)
      if (!this.parent.Modules.slots[i].active)
        this.parent.Modules.activateModule(i, this.destEntity, true);
  });
});
