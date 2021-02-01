TANK.registerComponent("ColoredBox")

.interfaces("Drawable")

.requires("Pos2D")

.construct(function()
{
  this.zdepth = 0;
  this.width = 50;
  this.height = 50;
  this.color = "#fff";
  this.centered = true;
})

.initialize(function()
{
  this.draw = function(ctx, camera)
  {
    var t = this.parent.Pos2D;
    ctx.save();
    ctx.fillStyle = this.color;

    ctx.translate(t.x - camera.x, t.y - camera.y);
    ctx.rotate(t.rotation);

    if (this.centered)
      ctx.translate(-this.width / 2, -this.height / 2);

    ctx.fillRect(0, 0, this.width, this.height);

    ctx.restore();
  };
});
