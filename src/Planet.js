TANK.registerComponent("Planet")

.interfaces("Drawable")

.requires("Pos2D, Collider, Selectable")

.construct(function()
{
  this.zdepth = 0;
  this.planetData = null;
})

.initialize(function()
{
  if (!this.planetData.uninhabited)
  {
    this.parent.addComponent("Comms");
    this.parent.addComponent("DockingBay");
    this.parent.addComponent("CargoBay");
  }

  if (this.parent.Comms)
    this.parent.Comms.acceptedMessages.push("greet");

  if (this.parent.DockingBay)
    this.parent.DockingBay.dockingRadius = this.planetData.size;

  this.parent.Collider.width = this.planetData.size * 2;
  this.parent.Collider.height = this.planetData.size * 2;

  if (this.parent.CargoBay)
    this.parent.CargoBay.capacity = 10000000;

  this.OnCommMessage = function(message, from)
  {
    if (message === "greet")
    {
      var len = CommStrings["greetResponse"].fluffText["Tern"].length;
      var i = Math.floor(Math.random() * len);
      var response = CommStrings["greetResponse"].fluffText["Tern"][i];
      from.sendMessage("greetResponse", this.parent.Comms, response);
    }
  };

  this.OnSelected = function()
  {
    this.planetInfoUI = UIHelpers.createWindow(300, 200, this.planetData.name, [window.innerWidth - 400, 200]);
    var info = $("<div class='planetInfo'></div>");
    info.text(this.planetData.description);
    this.planetInfoUI.body.append(info);
    info = $("<div class='planetInfo'></div>");
    info.text("Terrain: " + this.planetData.terrainType);
    this.planetInfoUI.body.append(info);
    info = $("<div class='planetInfo'></div>");
    info.text("Inhabited: " + !this.planetData.uninhabited);
    this.planetInfoUI.body.append(info);
    info = $("<div class='planetInfo'></div>");
    info.text("Tech level: " + 1);
    this.planetInfoUI.body.append(info);
  };

  this.OnDeselected = function()
  {
    this.planetInfoUI.main.remove();
    this.planetInfoUI = null;
  };

  this.addEventListener("OnComponentInitialized", function(c)
  {
    if (c.name === "Map" && this.planetInfoUI)
      this.planetInfoUI.main.remove();
  });

  this.updatePosition = function()
  {
    this.elapsedTime = TANK.Universe.elapsedTime;
    this.time = ((this.elapsedTime) / Math.PI) * 20;
    this.time /= this.planetData.orbitTime;
    this.time += this.planetData.orbitOffset;
    this.parent.Pos2D.x = Math.cos(this.time) * this.planetData.orbitDistance;
    this.parent.Pos2D.y = Math.sin(this.time) * this.planetData.orbitDistance;
  };

  this.draw = function(ctx, camera)
  {
    if (camera.z > 100)
      return;

    this.updatePosition();

    var t = this.parent.Pos2D;
    ctx.save();

    ctx.strokeStyle = "#aaa";
    ctx.beginPath();
    ctx.arc(0 - camera.x, 0 - camera.y, this.planetData.orbitDistance, 2 * Math.PI, false);
    ctx.stroke();
    ctx.closePath();

    ctx.fillStyle = this.planetData.baseColor;
    ctx.beginPath();
    ctx.arc(this.parent.Pos2D.x - camera.x, this.parent.Pos2D.y - camera.y, this.planetData.size, 2 * Math.PI, false);
    ctx.fill();
    ctx.closePath();

    var x = -this.planetData.size;
    var y = 0;
    var grad = ctx.createRadialGradient(x, y, this.planetData.size * 0.7, x, y, this.planetData.size * 2.0);
    grad.addColorStop(0, "rgba(0, 0, 0, 0.0)");
    grad.addColorStop(1, "rgba(0, 0, 0, 1)");

    ctx.translate(this.parent.Pos2D.x - camera.x, this.parent.Pos2D.y - camera.y);
    ctx.rotate(this.time);

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(0, 0, this.planetData.size + 3, 2 * Math.PI, false);
    ctx.fill();
    ctx.closePath();

    ctx.scale(TANK.RenderManager.camera.z, TANK.RenderManager.camera.z);
    ctx.rotate(-this.time);
    ctx.fillStyle = "#ddd";
    ctx.font = "16px sans-serif";
    ctx.fillText(this.planetData.name, 0, 0);

    ctx.restore();
  };

  this.updatePosition();
});
