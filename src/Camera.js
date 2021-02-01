TANK.registerComponent("Camera")

.interfaces("Drawable")

.construct(function()
{
  this.zdepth = -1000;
})

.initialize(function()
{
  this.draw = function(ctx, camera)
  {
    camera.x = this.parent.Pos2D.x - window.innerWidth / 2;
    camera.y = this.parent.Pos2D.y - window.innerHeight / 2;
  };
});