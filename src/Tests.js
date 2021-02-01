TANK.registerComponent("IntersectionTest")

.interfaces("Drawable")

.construct(function()
{
  this.zdepth = 100;
})

.initialize(function()
{
  this.rects =
  [
    {center: [100, 100], size: [80, 50]},
    {center: [100, 200], size: [80, 50], angle: Math.random() * Math.PI * 2}
  ];

  this.lines =
  [
    {a: [300, 200], b: [500, 500]},
    {a: [500, 200], b: [300, 500]}
  ];

  this.draw = function(ctx, camera)
  {
    for (var i = 0; i < this.rects.length; ++i)
    {
      ctx.save();
      var hit = false;
      if (this.rects[i].angle)
        hit = Math.pointInOBB(TANK.InputManager.mousePos, this.rects[i].center, this.rects[i].size, this.rects[i].angle += 0.01);
      else
        hit = Math.pointInAABB(TANK.InputManager.mousePos, this.rects[i].center, this.rects[i].size);
      if (hit.splice)
      {
        ctx.fillStyle = "rgba(100, 100, 255, 0.8)";
        ctx.fillRect(hit[0], hit[1], 10, 10);
      }
      else if (hit)
        ctx.fillStyle = "rgba(255, 100, 100, 0.8)";
      else
        ctx.fillStyle = "rgba(100, 255, 100, 0.8)";

      var angle = this.rects[i].angle || 0;

      ctx.translate(this.rects[i].center[0], this.rects[i].center[1]);
      ctx.rotate(angle);
      ctx.translate(-this.rects[i].size[0] / 2 - this.rects[i].center[0], -this.rects[i].size[1] / 2 - this.rects[i].center[1]);
      ctx.fillRect(this.rects[i].center[0], this.rects[i].center[1], this.rects[i].size[0], this.rects[i].size[1]);
      ctx.restore();
    }

    ctx.save();
    ctx.strokeStyle = "rgba(100, 100, 255, 0.8)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(TANK.InputManager.mousePos[0], TANK.InputManager.mousePos[1]);
    ctx.stroke();
    ctx.closePath();
    ctx.restore();

    for (var i = 0; i < this.lines.length; ++i)
    {
      ctx.save();
      var intersect = Math.lineIntersection(this.lines[i].a, this.lines[i].b, [0, 0], TANK.InputManager.mousePos);
      ctx.strokeStyle = "rgba(100, 255, 100, 0.8)";
      ctx.lineWidth = 2;

      ctx.beginPath();
      ctx.moveTo(this.lines[i].a[0], this.lines[i].a[1]);
      ctx.lineTo(this.lines[i].b[0], this.lines[i].b[1]);
      ctx.stroke();
      ctx.closePath();

      if (intersect)
      {
        console.log("test");
        ctx.fillStyle = "rgba(255, 100, 100, 0.8)";
        ctx.fillRect(intersect[0], intersect[1], 5, 5);
      }

      ctx.restore();
    }
  };
});

TANK.registerComponent("Pos2DTest")

.construct(function()
{
})

.initialize(function()
{
  this.e1 = TANK.createEntity("Pos2D, ColoredBox");
  this.e1.ColoredBox.color = "rgba(255, 255, 255, 0.8)";
  this.e1.ColoredBox.width = 200;
  this.e1.ColoredBox.height = 300;
  this.e1.Pos2D.x = 400;
  this.e1.Pos2D.y = 200;
  TANK.addEntity(this.e1);

  this.e2 = TANK.createEntity("Pos2D, ColoredBox");
  this.e2.ColoredBox.color = "rgba(255, 100, 100, 0.8)";
  TANK.addEntity(this.e2);

  var that = this;
  this.e2.Pos2D.addEventListener("OnEnterFrame", function(dt)
  {
    that.e1.Pos2D.rotation += dt * 0.2;
    this.x = 75;
    this.y = 125;
    this.rotation = 0;
    this.toWorldSpace(that.e1.Pos2D, [200, 300]);
  });


})

.destruct(function()
{
  TANK.removeEntity(this.e1);
  TANK.removeEntity(this.e2);
});
