TANK.registerComponent("FactionManager")

.construct(function()
{
})

.initialize(function()
{
  this.addEventListener("OnEnterFrame", function(dt)
  {
    if (TANK.MainMenu)
      return;

    for (var i in Factions)
    {
      var faction = Factions[i];

    }
  });
});