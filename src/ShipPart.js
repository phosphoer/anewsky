TANK.registerComponent("ShipPart")

.interfaces("Drawable")

.requires("Pos2D, Collider")

.construct(function()
{
  this.zdepth = 5;
  this.partData = null;
})

.initialize(function()
{
  this.draw = function(ctx, camera)
  {
    if (!this.partData)
      return;

    if (camera.z > 5)
      return;

    // Size collider
    var size = [this.partData.image.width * 3, this.partData.image.height * 3];
    this.parent.Collider.width = size[0];
    this.parent.Collider.height = size[1];

    var t = this.parent.Pos2D;
    ctx.save();

    ctx.translate(t.x - camera.x, t.y - camera.y);
    ctx.rotate(t.rotation);

    if (this.flipX)
      ctx.scale(-1, 1);

    ctx.drawImage(this.partData.image, size[0] / -2, size[1] / -2, size[0], size[1]);

    ctx.restore();
  };
});
