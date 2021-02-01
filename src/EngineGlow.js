TANK.registerComponent("EngineGlow")

.interfaces("Drawable")

.requires("Pos2D")

.construct(function()
{
  this.zdepth = 5;
  this.glowTimer = 0;
  this.fullGlowTime = 0.4;
})

.initialize(function()
{
  this.draw = function(ctx, camera, dt)
  {
    if (camera.z > 30)
      return;

    var t = this.parent.Pos2D;

    var size = 0;
    if (this.parent.Engines.forward && this.parent.Engines.systemEnabled)
    {
      this.glowTimer += dt;
    }
    else
    {
      this.glowTimer -= dt * 1.5;
    }
    this.glowTimer = Math.max(this.glowTimer, 0);
    this.glowTimer = Math.min(this.glowTimer, this.fullGlowTime);
    var glowPercent = Math.max(this.glowTimer / this.fullGlowTime, 0);
    size = glowPercent * 20;

    var grad = ctx.createRadialGradient(0, size * -0.5, size * 0.3, 0, 0, size);
    grad.addColorStop(0, "rgba(255, 255, 255, 0.9)");
    grad.addColorStop(0.4, "rgba(180, 180, 255, 0.5)");
    grad.addColorStop(1, "rgba(180, 180, 255, 0.0)");

    ctx.save();
    for (var i = 0; i < this.parent.Ship.shipData.data.parts.length; ++i)
    {
      var part = this.parent.Ship.shipData.data.parts[i];
      if (part.type != "Thruster")
        continue;

      // Draw engine glow
      ctx.save();

      var shipSize = [this.parent.Ship.imageCanvas.width * 3, this.parent.Ship.imageCanvas.height * 3];

      ctx.translate(t.x - camera.x, t.y - camera.y);
      ctx.rotate(t.rotation);
      ctx.translate(shipSize[0] / -2, shipSize[1] / -2);
      ctx.translate(part.x * 3, part.y * 3);

      ctx.rotate(part.rotation);
      ctx.translate(0, size * 2 + ShipParts["Tern"][part.type][part.index].image.height);
      ctx.scale(1, 2);

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(0, 0, size, 2 * Math.PI, false);
      ctx.fill();
      ctx.closePath();

      ctx.restore();
    }
    ctx.restore();
  };
});