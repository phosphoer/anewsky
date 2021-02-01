TANK.registerComponent("GlowParticle")

.interfaces("Drawable")

.requires("Pos2D")

.construct(function()
{
  this.zdepth = 5;
  this.sizeA = 3;
  this.sizeB = 10;
  this.colorA = [0, "rgba(255, 255, 255, 1)"];
  this.colorB = [0.5, "rgba(255, 200, 180, 0.6)"];
  this.colorC = [1, "rgba(255, 200, 180, 0.0)"];
  this.fadeWithLife = true;
})

.initialize(function()
{
  if (this.parent.Life)
    this.maxLife = this.parent.Life.life;

  this.draw = function(ctx, camera)
  {
    if (camera.z > 30)
      return;

    var t = this.parent.Pos2D;
    ctx.save();

    var grad = ctx.createRadialGradient(0, 0, this.sizeA, 0, 0, this.sizeB);
    grad.addColorStop(this.colorA[0], this.colorA[1]);
    grad.addColorStop(this.colorB[0], this.colorB[1]);
    grad.addColorStop(this.colorC[0], this.colorC[1]);

    ctx.translate(this.parent.Pos2D.x - camera.x, this.parent.Pos2D.y - camera.y);

    ctx.fillStyle = grad;
    if (this.parent.Life)
      ctx.globalAlpha = this.parent.Life.life / this.maxLife;
    ctx.beginPath();
    ctx.arc(0, 0, this.sizeB, 2 * Math.PI, false);
    ctx.fill();
    ctx.closePath();

    ctx.restore();
  };
});