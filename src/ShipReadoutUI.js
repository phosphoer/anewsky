TANK.registerComponent("ShipReadoutUI")

.construct(function()
{
})

.initialize(function()
{
  this.mainUI = $("<div class='shipReadout'></div>");
  this.mainUI.appendTo($("body"));

  this.readoutTop = $("<div class='readoutTop'></div>");
  this.readoutTop.appendTo(this.mainUI);

  this.hull = $("<div class='readoutTopLabel'></div>");
  this.hull.appendTo(this.readoutTop);

  this.reactor = $("<div class='readoutTopLabel'></div>");
  this.reactor.appendTo(this.readoutTop);

  this.fuel = $("<div class='readoutTopLabel'></div>");
  this.fuel.appendTo(this.readoutTop);

  this.modsContent = $("<div class='readoutContent'></div>");
  this.modsContent.appendTo(this.mainUI);

  this.OnModulesChanged = function()
  {
    this.modsContent.empty();

    var mods = this.parent.Modules;
    if (!mods)
      return;

    for (var i = 0; i < 10; ++i)
    {
      var mod = mods.slots[i];
      var id = "'module" + i + "'";
      var modUI = $("<div class='moduleName' id=" + id + "></div>");
      modUI.appendTo(this.modsContent);

      if (mod)
      {
        modUI.text(mod.item.name);
      }
      else
      {
        var num = i + 1;
        if (num >= 10)
          num = 0;
        modUI.text(num);
        modUI.css("font-size", "40px");
      }
    }
  };

  this.setModulePending = function(index)
  {
    var id = "#module" + index + "";
    $(id).addClass("pending");
  };

  this.setModuleNotPending = function(index)
  {
    var id = "#module" + index + "";
    $(id).removeClass("pending");
  };

  this.setModuleActive = function(index)
  {
    var id = "#module" + index + "";
    $(id).addClass("active");
  };

  this.setModuleInactive = function(index)
  {
    var id = "#module" + index + "";
    $(id).removeClass("active");
  };

  this.setModuleDestroyed = function(index)
  {
    var id = "#module" + index + "";
    $(id).addClass("destroyed");
  };

  this.setModuleNotDestroyed = function(index)
  {
    var id = "#module" + index + "";
    $(id).removeClass("destroyed");
  };

  this.addEventListener("OnEnterFrame", function(dt)
  {
    var hull = (this.parent.Ship.hullHP / this.parent.Ship.shipData.hullHP) * 100;
    var power = (this.parent.Ship.powerLevel / this.parent.Ship.maxPower) * 100;
    var fuel = this.parent.Ship.warpFuel;
    hull = Math.round(hull);
    power = Math.round(power);
    fuel = Math.round(fuel * 100) / 100;
    this.hull.text("Hull Integrity: " + hull + "%");
    this.reactor.text("Reactor: " + power + "%");
    this.fuel.text("Jump Fuel: " + fuel + " light years");
  });

  this.OnModulesChanged();
})

.destruct(function()
{
  this.mainUI.remove();
});
