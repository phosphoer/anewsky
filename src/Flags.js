TANK.registerComponent("Targetable")

.interfaces("Drawable")

.construct(function()
{
  this.zdepth = 50;
  this.id = 0;
})

.initialize(function()
{
  this.id = this.parent.id;

  this.draw = function(ctx, camera)
  {
    if (camera.z > 50)
      return;

    ctx.save();

    ctx.translate(this.parent.Pos2D.x - camera.x - 50, this.parent.Pos2D.y - camera.y - 50);
    ctx.scale(camera.z, camera.z);
    ctx.fillStyle = "#ddd";
    ctx.font = "18px sans-serif";
    if (TANK.PlayerData.displayTargetIDs)
      ctx.fillText(this.id, 0, 0);
    else
      ctx.fillText(this.parent.Ship.shipName, 0, 0);

    ctx.restore();
  };
});;