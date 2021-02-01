TANK.registerComponent("ShopUI")

.construct(function()
{
})

.initialize(function()
{
  var that = this;

  this.windowUI = UIHelpers.createWindow(600, 500, "Market");

  this.itemList = $("<div class='shopItemList'></div>");
  this.itemList.appendTo(this.windowUI.body);

  this.moneyDisplay = $("<div></div>");
  this.moneyDisplay.appendTo(this.windowUI.body);

  this.buyButton = $("<div class='button'>Buy</div>");
  this.buyButton.appendTo(this.windowUI.body);

  this.buyButton.bind("click", function()
  {
    var itemIndex = $(".shopItem.selected").data("itemIndex");
    if (itemIndex === undefined)
    {
      TANK.ControlPanel.postError("Error: Please select an item to purchase");
      return;
    }

    var item = Items[itemIndex];
    if (!item)
    {
      TANK.ControlPanel.postError("Error: Somehow you selected an item that doesn't exist");
      TANK.ControlPanel.postError("Something must be very wrong");
      return;
    }

    var price = that.parent.Planet.planetData.system.getAdjustedPrice(itemIndex);
    if (TANK.PlayerData.money >= price)
    {
      TANK.PlayerData.money -= price;
      that.parent.CargoBay.addItem(itemIndex);
      TANK.ControlPanel.postInfo(item.name + " was purchased and stored in the hanger");
    }
    else
    {
      TANK.ControlPanel.postError("Error: You do not have sufficient funds to purchase " + item.name);
    }

    that.refreshItemList();
  });

  this.refreshMoney = function()
  {
    this.moneyDisplay.html("Current funds: " + TANK.PlayerData.money + "&#x20bf;");
  };

  this.refreshItemList = function()
  {
    this.itemList.empty();

    // Fill with items
    for (var i = 0; i < Items.length; ++i)
    {
      if (!Items[i] || Items[i].price == undefined)
        continue;

      var item = Items[i];
      var price = this.parent.Planet.planetData.system.getAdjustedPrice(i);
      var itemUI = $("<div class='shopItem'></div>");
      itemUI.data("itemIndex", i);
      itemUI.appendTo(this.itemList);
      if (price <= TANK.PlayerData.money)
        itemUI.append($("<div>" + item.name + " - <span class='affordable'>" + price + "&#x20bf;</span></div>"));
      else
        itemUI.append($("<div>" + item.name + " - <span class='unaffordable'>" + price + "&#x20bf;</span></div>"));
      itemUI.append($("<div class='lightText'>" + item.desc + "</div>"));
      itemUI.append($("<div>Volume: <span class='lightText'>" + item.volume + "m<sup>3</sup></span></div>"));
      if (item.itemType === "Ship")
      {
        itemUI.append($("<div>Faction: <span class='lightText'>" + item.faction + "</span></div>"));
        itemUI.append($("<div>Max Speed: <span class='lightText'>" + item.maxSpeed + " m/s</span></div>"));
        itemUI.append($("<div>Accel: <span class='lightText'>" + item.accel + " m/s<sup>2</sup></span></div>"));
        itemUI.append($("<div>Turn Speed: <span class='lightText'>" + item.turnSpeed + " rad/sec</span></div>"));
      }
      else if (item.itemType === "Equipable")
      {
        itemUI.append($("<div>Cooldown time: <span class='lightText'>" + item.cooldownTime + " sec</span></div>"));
        itemUI.append($("<div>Power cost: <span class='lightText'>" + item.powerDrain + "</span></div>"));
        if (item.trackSpeed)
          itemUI.append($("<div>Track speed: <span class='lightText'>" + item.trackSpeed + " rad/sec</span></div>"));
        if (item.damage)
          itemUI.append($("<div>Damage: <span class='lightText'>" + item.damage + "</span></div>"));
        if (item.projectileSpeed)
          itemUI.append($("<div>Projectile Speed: <span class='lightText'>" + item.projectileSpeed + " m/s</span></div>"));
        if (item.projectileRange)
          itemUI.append($("<div>Effective Range: <span class='lightText'>" + item.projectileRange + " m</span></div>"));
      }
    }

    $(".shopItem").bind("click", function()
    {
      $(".shopItem").removeClass("selected");
      $(this).toggleClass("selected");
    });

    this.refreshMoney();
  };

  this.refreshItemList();
})

.destruct(function()
{
  this.windowUI.main.remove();
});