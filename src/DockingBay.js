TANK.registerComponent("DockingBay")

.construct(function()
{
  this.queuedDocks = [];
  this.dockedShips = [];
  this.dockingRadius = 500;
})

.initialize(function()
{
  if (this.parent.Comms)
    this.parent.Comms.acceptedMessages.push("dock");

  this.addEventListener("OnEnterFrame", function(dt)
  {
    for (var i in this.queuedDocks)
    {
      var shipPos = this.queuedDocks[i].Pos2D;
      var myPos = this.parent.Pos2D;
      if (TANK.Math.pointInCircle([shipPos.x, shipPos.y], [myPos.x, myPos.y], this.dockingRadius))
      {
        this.dockShip(this.queuedDocks[i]);
        this.queuedDocks.splice(i, 1);
      }
    }
  });

  this.dockShip = function(ship)
  {
    this.dockedShips.push(ship);
    ship.invoke("OnDocked", this);
  };

  this.undockShip = function(ship)
  {
    for (var i in this.dockedShips)
    {
      if (this.dockedShips[i] == ship)
      {
        this.dockedShips.splice(i, 1);
        ship.invoke("OnUndocked", this);
        return;
      }
    }
  };

  this.getDockedShip = function(name)
  {
    for (var i in this.dockedShips)
    {
      if (this.dockedShips[i].name === name)
        return this.dockedShips[i];
    }
  };

  this.addEventListener("OnPlayerUndocked", function()
  {
    for (var i in this.dockedShips)
    {
      if (this.dockedShips[i].Player)
      {
        this.undockShip(this.dockedShips[i]);
      }
    }
  });

  this.OnCommMessage = function(message, from)
  {
    if (message === "dock")
    {
      // Check if already queued
      for (var i in this.queuedDocks)
      {
        if (this.queuedDocks[i] === from.parent)
        {
          from.sendMessage("deny", this.parent.Comms, "You are already queued for docking.");
          from.sendMessage("misc", this.parent.Comms, "Please approach to within " + this.dockingRadius + "m.");
          return;
        }
      }

      var len = CommStrings["accept"].fluffText["Tern"].length;
      var i = Math.floor(Math.random() * len);
      var response = CommStrings["accept"].fluffText["Tern"][i];
      from.sendMessage("accept", this.parent.Comms, response);

      var shipPos = from.parent.Pos2D;
      var myPos = this.parent.Pos2D;
      if (!TANK.Math.pointInCircle([shipPos.x, shipPos.y], [myPos.x, myPos.y], this.dockingRadius))
      {
        from.sendMessage("misc", this.parent.Comms, "Please approach to within " + this.dockingRadius + "m.");
        this.queuedDocks.push(from.parent);
      }
      else
      {
        this.dockShip(from.parent);
      }
    }
  };
});