TANK.registerComponent("Engines")

.requires("Ship", "Velocity", "EngineGlow, TurnJets")

.construct(function()
{
  this.forward = false;
  this.backward = false;
  this.left = false;
  this.right = false;
  this.stop = false;
  this.straighten = false;
  this.warping = false;
  this.inWarp = false;
  this.systemPowered = false;
  this.systemEnabled = true;
  this.lastDt = 0;
  this.maxHP = 150;
  this.hp = this.maxHP;

  this.isSystem = true;
  this.powerDrain = 1;
  this.powerDrainFlight = 1;
  this.powerDrainWarp = 20;
  this.maxRudder = 1;
  this.warpSpeed = 10000;
  this.warpAccel = 1000;
  this.warpDelay = 3;
})

.initialize(function()
{
  this.OnUndocked = function(dockingBay)
  {
    this.forward = false;
    this.backward = false;
    this.left = false;
    this.right = false;
    this.stop = false;
    this.parent.Pos2D.x = dockingBay.parent.Pos2D.x;
    this.parent.Pos2D.y = dockingBay.parent.Pos2D.y;
    this.parent.Pos2D.rotation = Math.random() * Math.PI * 2;
    this.parent.Velocity.x = Math.cos(this.parent.Pos2D.rotation - Math.PI / 2) * 2;
    this.parent.Velocity.y = Math.sin(this.parent.Pos2D.rotation - Math.PI / 2) * 2;
  };

  this.addEventListener("OnEnterFrame", function(dt)
  {
    this.lastDt = dt;

    if (this.hp <= 0 && this.systemEnabled)
    {
      this.systemEnabled = false;
      this.hp = 0;
      if (this.parent.Player)
        TANK.ControlPanel.postError("WARNING: Engines destroyed");
    }

    var functionality = this.hp / this.maxHP;

    if (!this.systemEnabled)
      return;

    // Get power requirements
    if (!this.parent.Ship.requestPower(this.powerDrain * dt))
    {
      this.systemPowered = false;
      return;
    }
    this.systemPowered = true;

    // Calculate flight power requirements
    if (this.forward || this.backward || this.left || this.right || this.stop)
    {
      if (!this.parent.Ship.requestPower(this.powerDrainFlight * dt))
        return;
    }

    // Calculate accel
    var accel = 0;
    var maxSpeed = this.inWarp ? this.warpSpeed : this.parent.Ship.shipData.maxSpeed;
    if (this.forward)
      accel += this.parent.Ship.shipData.accel * functionality;
    if (this.backward)
      accel += -this.parent.Ship.shipData.accel * functionality;
    if (this.inWarp)
      accel = this.warpAccel;
    else if (this.warping)
      accel = 0;

    // Move
    this.parent.Velocity.x += Math.cos(this.parent.Pos2D.rotation - Math.PI / 2) * accel * dt;
    this.parent.Velocity.y += Math.sin(this.parent.Pos2D.rotation - Math.PI / 2) * accel * dt;

    // Stop
    if (this.stop && !this.warping)
    {
      var moveAngle = Math.atan2(this.parent.Velocity.y, this.parent.Velocity.x) + Math.PI / 2;
      moveAngle += Math.PI;
      this.parent.Velocity.x += Math.cos(moveAngle - Math.PI / 2) * this.parent.Ship.shipData.accel * dt;
      this.parent.Velocity.y += Math.sin(moveAngle - Math.PI / 2) * this.parent.Ship.shipData.accel * dt;
    }

    // Cap speed
    var vel = TANK.Math.pointDistancePoint([this.parent.Velocity.x, this.parent.Velocity.y], [0, 0]);
    if (vel > maxSpeed * functionality)
    {
      this.parent.Velocity.x /= vel;
      this.parent.Velocity.y /= vel;
      this.parent.Velocity.x *= maxSpeed * functionality;
      this.parent.Velocity.y *= maxSpeed * functionality;
    }

    // Turn
    var rudder = 0;
    if (this.right)
      this.parent.Velocity.r += this.parent.Ship.shipData.turnAccel * dt * functionality;
    if (this.left)
      this.parent.Velocity.r -= this.parent.Ship.shipData.turnAccel * dt * functionality;
    if (this.warping)
      this.parent.Velocity.r = 0;
    if (this.straighten)
      this.parent.Velocity.r *= 0.95;
    this.parent.Velocity.r = Math.min(this.parent.Ship.shipData.turnSpeed, this.parent.Velocity.r);
    this.parent.Velocity.r = Math.max(-this.parent.Ship.shipData.turnSpeed, this.parent.Velocity.r);


    // Handle warping
    if (this.warping)
    {
      if (this.warpTimer > 0)
        this.warpTimer -= dt;

      // Begin warp
      if (this.warpTimer <= 0)
      {
        if (!this.inWarp)
        {
          this.inWarp = true;

          if (this.parent.Player)
          {
            TANK.ControlPanel.postLog("Warping to " + this.warpSystem.name + "...");
            this.parent.Player.soundWarpBegin.play();
          }
        }
      }

      // Warp distances
      var t = this.parent.Pos2D;
      if (TANK.Math.pointDistancePoint([t.x, t.y], [0, 0]) > 60000)
      {
        this.parent.invoke("WarpTo", this.warpSystem);
        this.warping = false;
        this.inWarp = false;
        TANK.StarField.warpEffect = false;
        TANK.DustField.warpEffect = false;
        this.parent.Ship.warpFuel -= this.warpCost;
      }
      if (TANK.Math.pointDistancePoint([t.x, t.y], [0, 0]) > 30000 && this.parent.Player)
      {
        TANK.StarField.warpEffect = true;
        TANK.DustField.warpEffect = true;
      }
    }
  });

  this.BeginWarp = function(system)
  {
    if (!this.parent.Ship.requestPower(this.powerDrainWarp))
    {
      if (this.parent.Player)
        TANK.ControlPanel.postError("Error: Could not initiate warp: Insufficient power");
      return false;
    }

    var dist = TANK.Math.pointDistancePoint([system.x, system.y], [TANK.Universe.currentSystem.x, TANK.Universe.currentSystem.y]);
    if (this.parent.Ship.warpFuel < dist)
    {
      if (this.parent.Player)
        TANK.ControlPanel.postError("Error: Could not initiate warp: Insufficient fuel");
      return false;
    }

    this.warpTimer = this.warpDelay;
    this.warping = true;
    this.warpSystem = system;
    this.warpCost = dist;

    return true;
  };
});