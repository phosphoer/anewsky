TANK.registerComponent("Map")

.interfaces("Drawable")

.construct(function()
{
  this.zdepth = 50;
  this.starSize = 5;
  this.pan = {x: 0, y: 0};
  this.zoom = 1;
  this.lastMousePos = null;
  this.panning = false;
  this.selectedSystem = null;
})

.initialize(function()
{
  this.width = 12000;
  this.height = 12000;

  this.pan.x = -TANK.Universe.currentSystem.x * this.width;
  this.pan.y = -TANK.Universe.currentSystem.y * this.height;

  // Create map controls window
  this.windowUI = UIHelpers.createWindow(400, 300, "Map");

  // Info pane
  this.systemInfo = $("<div class='mapSystemInfoPane'></div>");
  this.systemInfoName = $("<div class='mapSystemInfoName'></div>");
  this.systemInfoName.appendTo(this.systemInfo);
  this.systemInfoSize = $("<div></div>");
  this.systemInfoSize.appendTo(this.systemInfo);
  this.systemInfoDistance = $("<div></div>");
  this.systemInfoDistance.appendTo(this.systemInfo);
  this.systemInfoDist = $("<div></div>");
  this.systemInfoDist.appendTo(this.systemInfo);

  // Controls pane
  this.mapControls = $("<div class='mapControlPane'></div>");
  this.mapControlsWarp = $("<div class='button'>Warp</div>");
  this.mapControlsWarp.appendTo(this.mapControls);

  // Selecting systems and panning
  var galaxies = TANK.Universe.galaxies;
  var that = this;
  this.addEventListener("OnMouseDown", function(button)
  {
    var pos = [TANK.InputManager.mousePos[0], TANK.InputManager.mousePos[1]];

    // Inverse transform input coords
    pos[0] -= window.innerWidth / 2;
    pos[1] -= window.innerHeight / 2;
    pos[0] *= this.zoom;
    pos[1] *= this.zoom;
    pos[0] -= this.pan.x;
    pos[1] -= this.pan.y;

    // Find which system was selected
    this.selectedSystem = null;
    for (var i = 0; i < galaxies[0].systems.length; ++i)
    {
      var system = galaxies[0].systems[i];
      var systemPos = [system.x * this.width, system.y * this.height];

      var dist = Math.sqrt((pos[0] - systemPos[0]) * (pos[0] - systemPos[0]) + (pos[1] - systemPos[1]) * (pos[1] - systemPos[1]));
      if (dist < this.starSize * this.zoom * 2)
        this.selectedSystem = system;
    }

    this.refreshSystemInfo();

    this.panning = true;
  });

  // Stop panning on mouse up
  this.addEventListener("OnMouseUp", function(e)
  {
    that.panning = false;
  });

  // Handle panning the map
  this.addEventListener("OnMouseMove", function(e)
  {
    if (!that.lastMousePos)
      that.lastMousePos = {x: e.x, y: e.y};

    if (!that.panning)
    {
      that.lastMousePos.x = e.x;
      that.lastMousePos.y = e.y;
      return;
    }

    that.pan.x += (e.x - that.lastMousePos.x) * that.zoom;
    that.pan.y += (e.y - that.lastMousePos.y) * that.zoom;

    that.lastMousePos.x = e.x;
    that.lastMousePos.y = e.y;
  });

  // Fill out information about a system
  this.refreshSystemInfo = function()
  {
    if (!this.selectedSystem)
    {
      this.systemInfo.remove();
      this.mapControls.remove();
      return;
    }

    var dist = TANK.Math.pointDistancePoint([this.selectedSystem.x, this.selectedSystem.y], [TANK.Universe.currentSystem.x, TANK.Universe.currentSystem.y]);
    dist *= 100;
    dist = Math.round(dist);
    dist /= 100;

    this.systemInfoName.text(this.selectedSystem.explored ? this.selectedSystem.name : "Unexplored System");
    if (this.selectedSystem.explored)
      this.systemInfoSize.text("Star class: " + Math.round(this.selectedSystem.starSize / 100));
    else
      this.systemInfoSize.text("Star class: N/A");
    this.systemInfoDistance.text("Distance: " + dist + " light years");
    this.systemInfoDist.text("Distance to center: " + Math.round(this.selectedSystem.distance * 100) / 100 + " light years");
    this.systemInfo.appendTo(this.windowUI.body);
    this.mapControls.appendTo(this.windowUI.body);

    this.mapControlsWarp.bind("click", function()
    {
      // Check if system is in warp range
      if (dist > that.parent.Ship.shipData.warpRange)
      {
        TANK.ControlPanel.postError("Error: System out of warp range");
        return;
      }
      if (that.selectedSystem === TANK.Universe.currentSystem)
        return;
      TANK.ControlPanel.postInfo("Initializing FTL drive...");
      that.parent.Engines.BeginWarp(that.selectedSystem);
    });
  };
  this.refreshSystemInfo();

  // Updater
  this.draw = function(ctx, camera)
  {
    this.zoom = camera.z;

    // If in warp, set pan manually
    if (this.parent.Engines.inWarp)
    {
      var t = this.parent.Pos2D;
      var dist = TANK.Math.pointDistancePoint([t.x, t.y], [0, 0]);
      var percent = dist / 60000;
      var p = [TANK.Universe.currentSystem.x * this.width, TANK.Universe.currentSystem.y * this.height];
      var v = [this.parent.Engines.warpSystem.x * this.width, this.parent.Engines.warpSystem.y * this.height];
      v[0] -= p[0];
      v[1] -= p[1];
      this.pan.x = -p[0] - v[0] * percent;
      this.pan.y = -p[1] - v[1] * percent;
    }

    // Clear the map
    ctx.save();

    ctx.translate(this.pan.x, this.pan.y);

    // Draw the map
    for (var i = 0; i < galaxies.length; ++i)
      this.drawGalaxy(galaxies[i]);

    // Draw warp radius
    var radiusPos = [TANK.Universe.currentSystem.x * this.width, TANK.Universe.currentSystem.y * this.height];
    ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
    ctx.beginPath();
    ctx.arc(radiusPos[0], radiusPos[1], this.parent.Ship.shipData.warpRange * this.width, Math.PI * 2, false);
    ctx.fill();
    ctx.closePath();

    ctx.restore();
  };

  var ctx = TANK.RenderManager.context;
  this.drawGalaxy = function(g)
  {
    // Draw systems
    for (var i = 0; i < g.systems.length; ++i)
      this.drawSystem(g.systems[i]);
  };

  this.drawSystem = function(s)
  {
    ctx.save();
    ctx.translate(s.x * this.width, s.y * this.height);
    ctx.scale(this.zoom, this.zoom);
    if (TANK.Universe.currentSystem === s)
    {
      ctx.fillStyle = "rgba(150, 150, 250, 0.4)";
      ctx.beginPath();
      ctx.arc(0, 0, this.starSize * 2, Math.PI * 2, false);
      ctx.fill();
      ctx.closePath();
    }

    if (this.selectedSystem === s)
    {
      ctx.fillStyle = "rgba(150, 250, 150, 0.4)";
      ctx.beginPath();
      ctx.arc(0, 0, this.starSize * 2, Math.PI * 2, false);
      ctx.fill();

      var toSys = TANK.Universe.currentSystem;
      ctx.strokeStyle = ctx.fillStyle;
      ctx.lineWidth = 2;
      ctx.moveTo((toSys.x - s.x) * this.width / this.zoom, (toSys.y - s.y) * this.height / this.zoom);
      ctx.lineTo(0, 0);
      ctx.stroke();

      ctx.closePath();
    }

    var dist = TANK.Math.pointDistancePoint([s.x, s.y], [TANK.Universe.currentSystem.x, TANK.Universe.currentSystem.y]);
    if (!s.explored && dist > this.parent.Ship.shipData.warpRange)
    {
      ctx.restore();
      return;
    }

    ctx.fillStyle = s.starColorA;
    ctx.strokeStyle = s.starColorA;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, this.starSize, Math.PI * 2, false);
    if (s.explored)
      ctx.fill();
    else
      ctx.stroke();
    ctx.closePath();
    ctx.restore();

    ctx.save();
    ctx.translate(s.x * this.width + this.starSize * this.zoom, s.y * this.height - this.starSize * this.zoom);
    ctx.scale(this.zoom, this.zoom);
    ctx.fillStyle = "#ddd";
    ctx.font = "14px sans-serif";
    if (s.explored)
      ctx.fillText(s.name, 0, 0);
    else
      ctx.fillText("Unexplored System", 0, 0);
    ctx.restore();
  };
})

.destruct(function()
{
  this.windowUI.main.remove();
});
