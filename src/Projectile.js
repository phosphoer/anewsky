TANK.registerComponent("Projectile")

.requires("Pos2D, Velocity")

.construct(function()
{
  this.speed = 0;
  this.life = 0;
  this.owner = null;
})

.initialize(function()
{
  var v = this.parent.Velocity;
  v.x += Math.cos(this.parent.Pos2D.rotation - Math.PI / 2) * this.speed;
  v.y += Math.sin(this.parent.Pos2D.rotation - Math.PI / 2) * this.speed;

  this.addEventListener("OnEnterFrame", function(dt)
  {
    this.life -= dt;
    if (this.life <= 0)
      TANK.removeEntity(this.parent);
  });
});
