TANK.registerComponent("MainMenu")

.construct(function()
{
})

.initialize(function()
{
  this.universeEntity = TANK.createEntity("Universe");
  this.universeEntity.Universe.rng = new RNG("planett");
  TANK.addEntity(this.universeEntity);

  this.onEnterFrame = function(dt)
  {
    if (this.started)
    {
      this.universeEntity.Universe.setCurrentSystem(this.universeEntity.Universe.galaxies[0].systems[1], true);
      this.removeEventListener("OnEnterFrame", this.onEnterFrame);
      return;
    }

    TANK.RenderManager.camera.z = 4;
    this.started = true;
  }

  this.addEventListener("OnEnterFrame", this.onEnterFrame);

  this.titleUI = $("<div class='mainMenuTitle'>A New Sky</div>");
  $("body").append(this.titleUI);

  this.optionsUI = $("<div class='mainMenuOptions'></div>");
  this.continueGameButton = $("<div class='mainMenuOption'>Continue Game</div>");
  this.newGameButton = $("<div class='mainMenuOption'>New Game</div>");
  this.optionsButton = $("<div class='mainMenuOption'>Options</div>");
  this.creditsButton = $("<div class='mainMenuOption'>Credits</div>");

  this.optionsUI.append(this.continueGameButton);
  this.optionsUI.append(this.newGameButton);
  this.optionsUI.append(this.optionsButton);
  this.optionsUI.append(this.creditsButton);
  $("body").append(this.optionsUI);

  var that = this;
  this.continueGameButton.bind("click", function()
  {
    TANK.removeEntity(that.universeEntity);
    TANK.PlayerData.load();
    TANK.addComponents("ControlPanel, HotBar");
    TANK.removeComponent("MainMenu");
  });

  this.newGameButton.bind("click", function()
  {
    TANK.removeEntity(that.universeEntity);
    TANK.PlayerData.newGame();
    TANK.addComponents("ControlPanel, HotBar");
    TANK.removeComponent("MainMenu");
  });

})

.destruct(function()
{
  this.optionsUI.remove();
  this.titleUI.fadeOut();
});