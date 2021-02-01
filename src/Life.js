TANK.registerComponent("Life")

.construct(function()
{
  this.life = 0;
})

.initialize(function()
{
  this.addEventListener("OnEnterFrame", function(dt)
  {
    this.life -= dt;
    if (this.life <= 0)
      TANK.removeEntity(this.parent.id);
  });
});