TANK.registerComponent("AIShip")

.requires("Ship")

.construct(function()
{
  this.behaviors = {};
  this.numBehaviors = 0;
  this.faction = "Tern";
})

.initialize(function()
{
  this.addBehavior = function(name)
  {
    if (this.parent[name])
      return;
    this.parent.addComponent(name);
    this.behaviors[name] = true;
    ++this.numBehaviors;
  };

  this.removeBehavior = function(name)
  {
    if (!this.parent[name])
      return;
    this.parent.removeComponent(name);
    delete this.behaviors[name];
    --this.numBehaviors;
  };

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

  this.OnAttacked = function(by)
  {
    if (this.parent.AIAttackObject)
      return;

    this.removeBehavior("AIVisitObject");
    this.addBehavior("AIAttackObject");
    this.parent.AIAttackObject.destEntity = by;

    this.parent.Comms.broadcastMessage("misc", "Mayday! Mayday! We are under attack!");
  };

  this.WarpTo = function(system)
  {
    TANK.removeEntity(this.parent);
  };

  this.addEventListener("OnEnterFrame", function(dt)
  {
    // By default visit a planet
    if (this.numBehaviors === 0)
      this.addBehavior("AIVisitObject");

    // If attacking and target object is dead, go back to visiting a planet
    if (this.parent.AIAttackObject)
    {
      if (!TANK.getEntity(this.parent.AIAttackObject.destEntity.id))
      {
        this.removeBehavior("AIAttackObject");
        this.addBehavior("AIWarpAway");
      }
    }
  });

});
