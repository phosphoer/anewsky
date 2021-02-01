TANK.registerComponent("Star")

.interfaces("Drawable")

.requires("Pos2D")

.construct(function()
{
  this.zdepth = 0;
  this.systemData = null;
})

.initialize(function()
{
  this.draw = function(ctx, camera)
  {
    if (camera.z > 100)
      return;

    var t = this.parent.Pos2D;
    ctx.save();

    var grad = ctx.createRadialGradient(0, 0, this.systemData.starSize * 0.5, 0, 0, this.systemData.starSize * 1.1);
    grad.addColorStop(0, "rgba(255, 255, 255, 1)");
    grad.addColorStop(0.25, this.systemData.starColorA);
    grad.addColorStop(0.8, this.systemData.starColorB);
    grad.addColorStop(1, this.systemData.starColorC);

    ctx.translate(this.parent.Pos2D.x - camera.x, this.parent.Pos2D.y - camera.y);

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(0, 0, this.systemData.starSize * 1.1, 2 * Math.PI, false);
    ctx.fill();
    ctx.closePath();

    ctx.restore();
  };
});
