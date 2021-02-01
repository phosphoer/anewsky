TANK.registerComponent("CargoUI")

.construct(function()
{
})

.initialize(function()
{
  this.windowUI = UIHelpers.createWindow(450, 300, "Cargo");

  this.shipCargo = $("<div class='cargoList'></div>");
  this.shipCargo.appendTo(this.windowUI.body);

  this.otherCargo = $("<div class='cargoList'></div>");
  this.otherCargo.appendTo(this.windowUI.body);

  var that = this;
  this.addItem = function(cargoUI, item)
  {
    var itemUI = $("<div class='listItem'>" + item.name + " <span class='lightText'>(" + item.quantity + ") " + item.volume + "m<sup>3</sup></span></div>");
      itemUI.appendTo(cargoUI);
    itemUI.data("item", item);
    itemUI.bind("click", function(e)
    {
      var item = $(this).data("item");

      var options = [];
      if (that.parent.Ship)
        options.push("Jettison");
      if (that.parent.DockingBay)
        options.push("Transfer");
      if (item.itemType === "Ship" && item.container.parent.DockingBay)
        options.push("Make active");
      if (item.itemType === "Equipable")
        options.push("Equip");
      options.push("Cancel");

      UIHelpers.createContextMenu(e.pageX, e.pageY, options, function(option)
      {
        if (option === "Jettison")
        {
          that.parent.CargoBay.removeItem(item.itemIndex);
          TANK.ControlPanel.postInfo("Jettisoned " + item.name + " into space");
        }
        else if (option === "Transfer")
        {
          var oldContainer = item.container;
          // Transfer the item to the docking bay
          if (item.container.parent.Ship)
          {
            if (that.parent.CargoBay.addItem(item.itemIndex))
            {
              oldContainer.removeItem(item.itemIndex);
              TANK.ControlPanel.postInfo("Transferred " + item.name + " to docking bay");
            }
            else
              TANK.ControlPanel.postError("No room for " + item.name + " in the docking bay");
          }
          // Transfer the item to the ship
          else
          {
            var player = that.parent.DockingBay.getDockedShip("Player");
            if (player.CargoBay.addItem(item.itemIndex))
            {
              oldContainer.removeItem(item.itemIndex);
              TANK.ControlPanel.postInfo("Transferred " + item.name + " to ship");
            }
            else
              TANK.ControlPanel.postError("No room for " + item.name + " in the ship");
          }
        }
        else if (option === "Make active")
        {
          // Remove new ship from cargo bay
          that.parent.CargoBay.removeItem(item.itemIndex);

          // Add player's active ship to cargo bay
          var oldShip = Items[TANK.PlayerData.ship];
          that.parent.CargoBay.addItem(TANK.PlayerData.ship);

          // Activate new ship
          TANK.PlayerData.ship = item.itemIndex;
          var player = that.parent.DockingBay.getDockedShip("Player");
          player.Ship.setShipData(TANK.PlayerData.ship);

          TANK.ControlPanel.postInfo("Moved " + oldShip.name + " to hanger, activated " + item.name);
        }
        else if (option === "Equip")
        {
          // Equip the item
          var player = that.parent.DockingBay.getDockedShip("Player");
          if (player.Modules.addModule(item.itemIndex))
          {
            // Remove item from cargo bay
            that.parent.CargoBay.removeItem(item.itemIndex);
            TANK.ControlPanel.postInfo("Fitted " + item.name + " to active ship");
          }
          else
            TANK.ControlPanel.postError("Error: No free slot to fit " + item.name);

        }
        that.refreshContents();
      });
    });
  };

  this.refreshContents = function()
  {
    this.shipCargo.empty();
    this.otherCargo.empty();

    this.shipCargo.append("<div class='lightText'>In ship</div>");
    this.otherCargo.append("<div class='lightText'>In hanger</div>");

    if (this.parent.Ship)
    {
      for (var i = 0; i < this.parent.CargoBay.items.length; ++i)
      {
        var item = this.parent.CargoBay.items[i];
        this.addItem(this.shipCargo, item);
      }

      if (this.parent.CargoBay.items.length === 0)
        this.shipCargo.append("<div class='lightText'>Nothing here!</div>");
    }
    else if (this.parent.DockingBay)
    {
      for (var i = 0; i < this.parent.CargoBay.items.length; ++i)
      {
        var item = this.parent.CargoBay.items[i];
        this.addItem(this.otherCargo, item);
      }

      if (this.parent.CargoBay.items.length === 0)
        this.otherCargo.append("<div class='lightText'>Nothing here!</div>");

      var player = this.parent.DockingBay.getDockedShip("Player");
      for (var i = 0; i < player.CargoBay.items.length; ++i)
      {
        var item = player.CargoBay.items[i];
        this.addItem(this.shipCargo, item);
      }

      if (player.CargoBay.items.length === 0)
        this.shipCargo.append("<div class='lightText'>Nothing here!</div>");
    }
  };

  this.refreshContents();
})

.destruct(function()
{
  this.windowUI.main.remove();
});