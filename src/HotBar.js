TANK.registerComponent("HotBar")

.construct(function()
{
  this.soundButtonClick = new Audio("res/Sounds/ui-03.wav");
  this.soundButtonClick.volume = 0.1;
})

.initialize(function()
{
  this.mainUI = $("<div class='hotBar'></div>");
  this.mainUI.appendTo($("body"));

  this.buttonComm = $("<div class='button'>Comms</div>");
  this.buttonComm.appendTo(this.mainUI);

  this.buttonCargo = $("<div class='button'>Cargo</div>");
  this.buttonCargo.appendTo(this.mainUI);

  this.buttonBulletin = $("<div class='button'>BBS</div>");
  this.buttonBulletin.appendTo(this.mainUI);

  this.buttonLog = $("<div class='button'>Logbook</div>");
  this.buttonLog.appendTo(this.mainUI);

  this.buttonShop = $("<div class='button'>Shop</div>");
  this.buttonShop.appendTo(this.mainUI);
  this.buttonShop.css("display", "none");

  this.buttonRefuel = $("<div class='button'>Refuel</div>");
  this.buttonRefuel.appendTo(this.mainUI);
  this.buttonRefuel.css("display", "none");

  this.buttonUndock = $("<div class='button'>Undock</div>");
  this.buttonUndock.appendTo(this.mainUI);
  this.buttonUndock.css("display", "none");

  this.buttonSave = $("<div class='button'>Save</div>");
  this.buttonSave.appendTo(this.mainUI);
  this.buttonSave.css("display", "none");

  var that = this;
  this.buttonComm.bind("click", function()
  {
    that.toggleComms();
  });

  this.buttonCargo.bind("click", function()
  {
    that.toggleCargo();
  });

  this.buttonBulletin.bind("click", function()
  {
    that.toggleBulletin();
  });

  this.buttonLog.bind("click", function()
  {
    that.toggleLog();
  });

  this.buttonShop.bind("click", function()
  {
    that.toggleShop();
  });

  this.buttonRefuel.bind("click", function()
  {
    var player = TANK.PlayerData.player;

    var fuelDelta = player.Ship.shipData.warpFuel - player.Ship.warpFuel;
    var fuelPrice = TANK.Universe.currentSystem.getAdjustedPrice(8);
    var price = fuelPrice * fuelDelta;

    if (TANK.PlayerData.money >= price)
    {
      TANK.PlayerData.money -= price;
      player.Ship.warpFuel = player.Ship.shipData.warpFuel;
      TANK.ControlPanel.postLog("Bought " + fuelDelta + " light years worth of fuel for " + price + "&#x20bf;");
    }
    else
    {
      fuelDelta *= (TANK.PlayerData.money / price);
      player.Ship.warpFuel += fuelDelta;
      TANK.ControlPanel.postError("Error: Not enough funds to fully refuel");
      TANK.ControlPanel.postLog("Bought " + fuelDelta + " light years worth of fuel for " + price + "&#x20bf;");
    }
  });

  this.buttonUndock.bind("click", function()
  {
    that.undock();
  });

  this.buttonSave.bind("click", function()
  {
    TANK.PlayerData.save();
  });


  this.toggleComms = function()
  {
    var player = TANK.getEntity("Player");
    if (!player)
      return;

    player.removeComponent("CargoUI");
    player.removeComponent("BulletinUI");
    player.removeComponent("LogUI");
    player.removeComponent("ShopUI");

    if (!player.CommUI)
      player.addComponent("CommUI");
    else
      player.removeComponent("CommUI");

    this.soundButtonClick.play();
  };

  this.toggleCargo = function()
  {
    var player = TANK.getEntity("Player");
    if (!player && TANK.PlayerData.dockingBay)
      player = TANK.PlayerData.dockingBay.parent;
    if (!player)
      return;

    player.removeComponent("CommUI");
    player.removeComponent("BulletinUI");
    player.removeComponent("LogUI");
    player.removeComponent("ShopUI");

    if (!player.CargoUI)
      player.addComponent("CargoUI");
    else
      player.removeComponent("CargoUI");

    this.soundButtonClick.play();
  };

  this.toggleBulletin = function()
  {
    var player = TANK.getEntity("Player");
    if (!player && TANK.PlayerData.dockingBay)
      player = TANK.PlayerData.dockingBay.parent;
    if (!player)
      return;

    player.removeComponent("CommUI");
    player.removeComponent("CargoUI");
    player.removeComponent("LogUI");
    player.removeComponent("ShopUI");

    if (!player.BulletinUI)
      player.addComponent("BulletinUI");
    else
      player.removeComponent("BulletinUI");

    this.soundButtonClick.play();
  };

  this.toggleLog = function()
  {
    var player = TANK.getEntity("Player");
    if (!player && TANK.PlayerData.dockingBay)
      player = TANK.PlayerData.dockingBay.parent;
    if (!player)
      return;

    player.removeComponent("CommUI");
    player.removeComponent("BulletinUI");
    player.removeComponent("CargoUI");
    player.removeComponent("ShopUI");

    if (!player.LogUI)
      player.addComponent("LogUI");
    else
      player.removeComponent("LogUI");

    this.soundButtonClick.play();
  };

  this.toggleShop = function()
  {
    if (!TANK.PlayerData.dockingBay)
    {
      TANK.ControlPanel.postError("Error: The shop cannot be opened while not docked");
      TANK.ControlPanel.postError("How did you even do that in the first place");
      return;
    }
    player = TANK.PlayerData.dockingBay.parent;

    player.removeComponent("CommUI");
    player.removeComponent("BulletinUI");
    player.removeComponent("LogUI");
    player.removeComponent("CargoUI");

    if (!player.ShopUI)
      player.addComponent("ShopUI");
    else
      player.removeComponent("ShopUI");

    this.soundButtonClick.play();
  };

  this.undock = function()
  {
    TANK.PlayerData.dockingBay.parent.removeComponent("CargoUI");
    TANK.PlayerData.dockingBay.parent.removeComponent("ShopUI");
    TANK.PlayerData.dockingBay.parent.removeComponent("LogUI");
    TANK.PlayerData.dockingBay.parent.removeComponent("BulletinUI");
    TANK.dispatchEvent("OnPlayerUndocked");

    this.soundButtonClick.play();
  };
})

.destruct(function()
{
  this.mainUI.remove();
});