TANK.registerComponent("SupplyDemand")

// .interfaces("Drawable")

.construct(function()
{
  this.zdepth = 10;
  this.resolution = 75;
  this.effectTimer = 0;
  this.grid = [];

  for (var i = 0; i < this.resolution; ++i)
  {
    this.grid[i] = [];
    for (var j = 0; j < this.resolution; ++j)
    {
      this.grid[i][j] = 1;
    }
  }
})

.initialize(function()
{
  this.getValue = function(x, y)
  {
    x = Math.floor(x * this.resolution);
    y = Math.floor(y * this.resolution);
    if (x < 0 || x > this.resolution || y < 0 || y > this.resolution)
      return 1;

    return this.grid[x][y] / 2;
  };

  this.addEffect = function(x, y, offset, radius)
  {
    x = Math.floor(x * this.resolution);
    y = Math.floor(y * this.resolution);
    radius = Math.floor(radius * this.resolution);

    for (var i = Math.floor(x - radius); i < Math.floor(x + radius); ++i)
    {
      if (i < 0 || i >= this.resolution)
        continue;

      for (var j = Math.floor(y - radius); j < Math.floor(y + radius); ++j)
      {
        if (j < 0 || j >= this.resolution)
          continue;

        var dist = Math.sqrt((x - i) * (x - i) + (y - j) * (y - j));
        var percent = Math.max((radius - dist) / radius, 0);
        this.grid[i][j] += offset * percent;
        this.grid[i][j] = Math.max(this.grid[i][j], 0);
        this.grid[i][j] = Math.min(this.grid[i][j], 2);
      }
    }
  };

  this.draw = function(ctx, camera)
  {
    ctx.save();
    for (var i = 0; i < this.resolution; ++i)
    {
      for (var j = 0; j < this.resolution; ++j)
      {
        ctx.fillStyle = "rgba(255, 255, 255, " + (this.grid[i][j] * 0.5) + ")";
        ctx.fillRect(i * this.resolution, j * this.resolution, this.resolution, this.resolution);
      }
    }
    ctx.restore();
  };

  this.addEventListener("OnEnterFrame", function(dt)
  {
    if (TANK.MainMenu)
      return;

    // Mutate over time
    this.effectTimer += dt;
    if (this.effectTimer > 1)
    {
      this.effectTimer = 0;

      var effect = (Math.random() - 0.5) * 0.3;
      var radius = 0.2 - Math.random() * 0.10 + Math.random() * 0.20;
      var x = Math.random();
      var y = Math.random();
      this.addEffect(x, y, effect, radius);
    }
  });

  // Initialize values
  for (var i = 0; i < this.resolution * 5; ++i)
  {
    var effect = (Math.random() - 0.5) * 0.3;
    var radius = 0.1 - Math.random() * 0.05 + Math.random() * 0.1;
    var x = Math.random();
    var y = Math.random();
    this.addEffect(x, y, effect, radius);
  }
});
