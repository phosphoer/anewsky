TANK.registerComponent("Comms")

.construct(function()
{
  this.commName = "";
  this.type = "";
  this.acceptedMessages = ["exit"];
})

.initialize(function()
{
  this.connectToPort = function(from)
  {
    // If we are the player, we should ask if he wants to accept the connection
    if (this.parent.Player)
    {
      TANK.ControlPanel.postLog("<div class='commRemote'>Incoming connection from " + from.commName + "...</div>");
      return true;
    }

    return true;
  };

  this.broadcastMessage = function(message, messageContent)
  {
    for (var i = 0; i < TANK.Universe.systemEntities.length; ++i)
    {
      var e = TANK.Universe.systemEntities[i];
      if (!e.Comms || e === this.parent)
        continue;

      if (e.Comms.connectToPort(this))
      {
        e.Comms.sendMessage(message, this, messageContent);
      }
    }

    if (!this.parent.Player && TANK.PlayerData.player.Comms.connectToPort(this))
    {
      TANK.PlayerData.player.Comms.sendMessage(message, this, messageContent);
    }
  };

  this.sendMessage = function(message, from, messageContent)
  {
    // If we are the player, we just show him the message instead of auto responding
    if (this.parent.Player)
    {
      TANK.ControlPanel.postLog("<div class='commRemote'>&lt;Remote Host&gt;: " + messageContent + "</div>");
      return;
    }

    // Invoke a message and let a component handle the message
    this.parent.invoke("OnCommMessage", message, from);
  };

  if (this.parent.Ship)
  {
    this.type = "Ship";
    this.commName = this.parent.Ship.shipName;
  }
  else if (this.parent.Planet)
  {
    this.type = "Planet";
    this.commName = this.parent.Planet.planetData.name;
  }
})

.destruct(function()
{
  this.acceptedMessages = ["exit"];
});
