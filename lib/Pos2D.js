TANK.registerComponent("Pos2D")

.construct(function ()
{
  this.x = 0;
  this.y = 0;
  this.rotation = 0;

  this.toWorldSpace = function(parent, parentSize)
  {
    // Rotate local position by parent rotation
    var myPos = [this.x, this.y];
    this.x = myPos[0] * Math.cos(parent.rotation) - myPos[1] * Math.sin(parent.rotation);
    this.y = myPos[1] * Math.cos(parent.rotation) + myPos[0] * Math.sin(parent.rotation);

    // Add parent position
    this.x += parent.x;
    this.y += parent.y;
    this.rotation += parent.rotation;
  };
});
