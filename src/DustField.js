TANK.registerComponent("DustField")

.interfaces("Drawable")

.construct(function()
{
  this.zdepth = 10;
  this.stars = [];
})

.initialize(function()
{
  for (var i = 0; i < 50; ++i)
  {
    this.stars.push(
    {
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      z: Math.random() + 1
    });
  }

  this.draw = function(ctx, camera)
  {
    ctx.save();

    ctx.fillStyle = "#ddd";

    for (var i = 0; i < this.stars.length; ++i)
    {
      var x = (this.stars[i].x - camera.x * this.stars[i].z) - window.innerWidth / 2;
      var y = (this.stars[i].y - camera.y * this.stars[i].z) - window.innerHeight / 2;
      x %= window.innerWidth;
      y %= window.innerHeight;
      while (x < 0)
        x += window.innerWidth;
      while (y < 0)
        y += window.innerHeight;

      x -= (window.innerWidth * TANK.RenderManager.camera.z - window.innerWidth) * (0.5 / TANK.RenderManager.camera.z);
      y -= (window.innerHeight * TANK.RenderManager.camera.z - window.innerHeight) * (0.5 / TANK.RenderManager.camera.z);
      x *= TANK.RenderManager.camera.z;
      y *= TANK.RenderManager.camera.z;
      ctx.fillRect(x, y, 1, 1);
    }

    ctx.restore();
  };
});
