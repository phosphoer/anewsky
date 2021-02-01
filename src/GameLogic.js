TANK.registerComponent("GameLogic")

.construct(function()
{
})

.initialize(function()
{
  this.addEventListener("OnMouseWheel", function(delta)
  {
    var player = TANK.getEntity("Player");
    if (!player)
      return;

    if (TANK.RenderManager.camera.z > 100 && !player.Map)
      player.addComponent("Map");
    else if (TANK.RenderManager.camera.z < 100 && player.Map)
      player.removeComponent("Map");
  });

  // Listen for map and control panel
  this.addEventListener("OnKeyPress", function(keyCode)
  {
    var player = TANK.getEntity("Player");

    if (keyCode === TANK.Key.I)
      TANK.HotBar.toggleCargo();

    if (keyCode === TANK.Key.C)
      TANK.HotBar.toggleComms();

    if (keyCode === TANK.Key.B)
      TANK.HotBar.toggleBulletin();

    if (keyCode === TANK.Key.L)
      TANK.HotBar.toggleLog();

    if (keyCode === TANK.Key.E && !TANK.PlayerData.dockingBay)
    {
      if (!TANK.ShipEditor)
        TANK.addComponent("ShipEditor");
      else
        TANK.removeComponent("ShipEditor");
    }
  });
});
