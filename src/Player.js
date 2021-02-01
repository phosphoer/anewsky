TANK.registerComponent("Player")

.requires("Ship, Camera")

.construct(function()
{
  this.zdepth = -Infinity;
  this.pendingModules = [];

  this.soundWarpBegin = new Audio("res/Sounds/warp-03.wav");
  this.soundWarpBegin.volume = 0.2;
  this.soundWarpEnd = new Audio("res/Sounds/warp-01.wav");
  this.soundWarpEnd.volume = 0.5;
  this.soundModActivate = new Audio("res/Sounds/ui-03.wav");
  this.soundModActivate.volume = 0.1;
})

.initialize(function()
{
  this.OnDocked = function(dockingBay)
  {
    dockingBay.parent.addComponent("Camera");
    TANK.PlayerData.dockingBay = dockingBay;
    TANK.HotBar.buttonComm.css("display", "none");
    TANK.HotBar.buttonUndock.css("display", "");
    TANK.HotBar.buttonShop.css("display", "");
    TANK.HotBar.buttonRefuel.css("display", "");
    TANK.HotBar.buttonSave.css("display", "");
  };

  this.OnUndocked = function(dockingBay)
  {
    dockingBay.parent.removeComponent("Camera");
    TANK.PlayerData.dockingBay = null;
    TANK.HotBar.buttonComm.css("display", "");
    TANK.HotBar.buttonUndock.css("display", "none");
    TANK.HotBar.buttonShop.css("display", "none");
    TANK.HotBar.buttonRefuel.css("display", "none");
    TANK.HotBar.buttonSave.css("display", "none");
  };

  this.addEventListener("OnMouseWheel", function(delta)
  {
    if (TANK.RenderManager.clearColor == "rgba(0, 0, 0, 0)")
      return;

    TANK.RenderManager.camera.z += delta * 0.005 * (TANK.RenderManager.camera.z * 0.1);
    if (TANK.RenderManager.camera.z < 1)
      TANK.RenderManager.camera.z = 1;
  });

  this.addEventListener("OnKeyPress", function(keyCode)
  {
    if (keyCode === TANK.Key.W)
      this.parent.Engines.forward = true;
    if (keyCode === TANK.Key.S)
      this.parent.Engines.backward = true;
    if (keyCode === TANK.Key.A)
      this.parent.Engines.left = true;
    if (keyCode === TANK.Key.D)
      this.parent.Engines.right = true;

    if (keyCode >= TANK.Key.NUM1 && keyCode <= TANK.Key.NUM9)
    {
      this.soundModActivate.play();
      var moduleIndex = keyCode - TANK.Key.NUM1;
      if (this.pendingModules[moduleIndex])
      {
        this.pendingModules[moduleIndex] = false;
        this.parent.ShipReadoutUI.setModuleNotPending(moduleIndex);
      }
      else
      {
        this.pendingModules[moduleIndex] = true;
        this.parent.ShipReadoutUI.setModulePending(moduleIndex);
      }
      this.parent.Modules.deactivateModule(moduleIndex);
    }
  });
  this.addEventListener("OnKeyRelease", function(keyCode)
  {
    if (keyCode === TANK.Key.W)
      this.parent.Engines.forward = false;
    if (keyCode === TANK.Key.S)
      this.parent.Engines.backward = false;
    if (keyCode === TANK.Key.A)
      this.parent.Engines.left = false;
    if (keyCode === TANK.Key.D)
      this.parent.Engines.right = false;
  });

  this.addEventListener("OnMouseDown", function(button)
  {
    var areModulesPending = false;
    for (var i = 0; i < this.pendingModules.length; ++i)
      if (this.pendingModules[i])
        areModulesPending = true;
    if (!areModulesPending)
      return;

    var cursor = TANK.createEntity("Cursor");
    TANK.addEntity(cursor);
    cursor.Cursor.updatePos();

    // Find out what ship was selected
    var target = null;
    for (var i = 0; i < TANK.Universe.systemEntities.length; ++i)
    {
      var e = TANK.Universe.systemEntities[i];
      if (e.Ship)
      {
        if (cursor.Collider.collide(e.Collider))
        {
          target = e;
          break;
        }
      }
    }
    TANK.removeEntity(cursor);

    if (!target)
    {
      TANK.ControlPanel.postError("No target at the specified location");
      return;
    }

    for (var i = 0; i < this.pendingModules.length; ++i)
    {
      if (this.pendingModules[i])
      {
        this.parent.Modules.activateModule(i, target, true);
      }
      this.parent.ShipReadoutUI.setModuleNotPending(i);
      this.pendingModules[i] = false;
    }
  });

  this.addEventListener("OnEnterFrame", function(dt)
  {
    if (this.parent.Modules)
    {
      this.parent.Modules.trackPoint[0] = TANK.InputManager.mousePos[0] + TANK.RenderManager.camera.x;
      this.parent.Modules.trackPoint[1] = TANK.InputManager.mousePos[1] + TANK.RenderManager.camera.y;
    }
  });

  this.WarpTo = function(system)
  {
    this.parent.Pos2D.x = 1000;
    this.parent.Pos2D.y = 1000;
    this.parent.Velocity.x *= 0.002;
    this.parent.Velocity.y *= 0.002;
    TANK.Universe.setCurrentSystem(system);

    this.soundWarpEnd.play();
  }

  this.parent.Ship.setShipData(TANK.PlayerData.ship);
  TANK.PlayerData.player = this.parent;
});
