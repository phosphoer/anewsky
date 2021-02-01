TANK.registerComponent("TurnJets")

.interfaces("Drawable")

.requires("Pos2D")

.construct(function()
{
  this.zdepth = 5;
  this.leftTimer = 0;
  this.rightTimer = 0;
  this.fullGlowTime = 0.05;
})

.initialize(function()
{
  this.draw = function(ctx, camera, dt)
  {
    if (camera.z > 30)
      return;

    var t = this.parent.Pos2D;

    if (this.parent.Engines.left && this.parent.Engines.systemEnabled)
      this.rightTimer += dt;
    else
      this.rightTimer -= dt * 1.5;
    if (this.parent.Engines.right && this.parent.Engines.systemEnabled)
      this.leftTimer += dt;
    else
      this.leftTimer -= dt * 1.5;

    this.leftTimer = Math.max(this.leftTimer, 0);
    this.leftTimer = Math.min(this.leftTimer, this.fullGlowTime);
    var leftPercent = Math.max(this.leftTimer / this.fullGlowTime, 0);
    var leftSize = 0;
    leftSize = leftPercent * 10;

    this.rightTimer = Math.max(this.rightTimer, 0);
    this.rightTimer = Math.min(this.rightTimer, this.fullGlowTime);
    var rightPercent = Math.max(this.rightTimer / this.fullGlowTime, 0);
    var rightSize = 0;
    rightSize = rightPercent * 10;

    var leftGrad = ctx.createRadialGradient(0, leftSize * -0.5, leftSize * 0.3, 0, 0, leftSize);
    leftGrad.addColorStop(0, "rgba(255, 255, 255, 0.9)");
    leftGrad.addColorStop(0.4, "rgba(200, 200, 200, 0.5)");
    leftGrad.addColorStop(1, "rgba(180, 180, 180, 0.0)");

    var rightGrad = ctx.createRadialGradient(0, rightSize * -0.5, rightSize * 0.3, 0, 0, rightSize);
    rightGrad.addColorStop(0, "rgba(255, 255, 255, 0.9)");
    rightGrad.addColorStop(0.4, "rgba(200, 200, 200, 0.5)");
    rightGrad.addColorStop(1, "rgba(180, 180, 180, 0.0)");

    ctx.save();
    for (var i = 0; i < this.parent.Ship.shipData.data.parts.length; ++i)
    {
      var part = this.parent.Ship.shipData.data.parts[i];
      if (part.type != "Jet")
        continue;
      var partData = ShipParts[part.faction][part.type][part.index];

      // Draw engine glow
      ctx.save();

      var shipSize = [this.parent.Ship.imageCanvas.width * 3, this.parent.Ship.imageCanvas.height * 3];

      ctx.translate(t.x - camera.x, t.y - camera.y);
      ctx.rotate(t.rotation);
      ctx.translate(shipSize[0] / -2, shipSize[1] / -2);
      ctx.translate(part.x * 3, part.y * 3);

      if (partData.direction === "right")
        ctx.rotate(part.rotation - Math.PI / 2);
      else
        ctx.rotate(part.rotation + Math.PI / 2);

      var size = (partData.direction === "right") ? rightSize : leftSize;
      ctx.translate(0, size * 2 + ShipParts["Tern"][part.type][part.index].image.width);
      ctx.scale(1, 2);

      if (partData.direction === "right")
        ctx.fillStyle = rightGrad;
      else
        ctx.fillStyle = leftGrad;
      ctx.beginPath();
      ctx.arc(0, 0, size, 2 * Math.PI, false);
      ctx.fill();
      ctx.closePath();

      ctx.restore();
    }
    ctx.restore();
  };
});