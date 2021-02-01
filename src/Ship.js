TANK.registerComponent("Ship")

.interfaces("Drawable")

.requires("Velocity, Targetable, Modules, Engines, Collider, Comms, CargoBay")

.construct(function()
{
  this.powerLevel = 0;
  this.shipName = "";

  this.maxPower = 100;
  this.powerRecharge = 5;
  this.lowPowerWarning = false;

  this.soundExplode = new Audio("res/Sounds/explode-04.wav");
  this.soundExplode.volume = 0.2;
})

.initialize(function()
{
  this.parent.Collider.collisionLayer = "Ships";

  if (this.parent.Comms)
    this.parent.Comms.acceptedMessages.push("greet");

  this.OnDocked = function(dockingBay)
  {
    TANK.removeEntity(this.parent);
  };

  this.OnUndocked = function()
  {
    // Black magic
    TANK.addEntity(this.parent, this.parent.name);
  }

  this.addEventListener("OnEnterFrame", function(dt)
  {
    // Die if no hull
    if (this.hullHP <= 0)
    {
      this.explode();
    }

    // Recharge power
    this.powerLevel += this.powerRecharge * dt;
    if (this.powerLevel > this.maxPower)
      this.powerLevel = this.maxPower;
  });

  this.draw = function(ctx, camera)
  {
    if (camera.z > 100)
      return;

    var t = this.parent.Pos2D;
    if (camera.z > 10)
    {
      var size = [0, 0];
      if (this.shipData.type === "Frigate")
        size = [10, 14];
      else if (this.shipData.type === "Freighter")
        size = [14, 14];

      ctx.save();
      ctx.translate(t.x - camera.x, t.y - camera.y);
      ctx.rotate(t.rotation);
      ctx.scale(camera.z, camera.z);
      ctx.translate(-size[0] / 2, -size[1] / 2);

      ctx.fillStyle = "rgb(150, 255, 150)";
      ctx.beginPath();

      // Triangle
      if (this.shipData.type === "Frigate")
      {
        ctx.moveTo(0, size[1]);
        ctx.lineTo(size[0] / 2, 0);
        ctx.lineTo(size[0], size[1]);
        ctx.fill();
      }
      // Cross
      else if (this.shipData.type === "Freighter")
      {
        ctx.fillRect(0, size[1] * 0.375, size[0], size[1] * 0.25);
        ctx.fillRect(size[0] * 0.375, 0, size[0] * 0.25, size[1]);
      }
      ctx.closePath();
      ctx.restore();
      return;
    }

    var size = [this.imageCanvas.width * 3, this.imageCanvas.height * 3];
    ctx.save();
    ctx.translate(t.x - camera.x, t.y - camera.y);
    ctx.rotate(t.rotation);
    ctx.translate(-size[0] / 2, -size[1] / 2);
    ctx.drawImage(this.imageCanvas, 0, 0, size[0], size[1]);
    ctx.restore();
  };

  this.setShipData = function(shipIndex)
  {
    this.shipData = Items[shipIndex];

    this.hullHP = this.shipData.hullHP;
    this.warpFuel = this.shipData.warpFuel;

    // Calculate ship size
    this.width = this.shipData.data.width * 3;
    this.height = this.shipData.data.height * 3;
    this.parent.Collider.width = this.width;
    this.parent.Collider.height = this.height;

    // Create prerendered canvas
    this.imageCanvas = document.createElement("canvas");
    this.imageCanvas.width = this.shipData.data.width + 2;
    this.imageCanvas.height = this.shipData.data.height + 2;
    this.imageContext = this.imageCanvas.getContext("2d");

    // Visualize canvas
    // this.imageContext.fillStyle = "rgba(255, 0, 255, 0.1)";
    // this.imageContext.fillRect(0, 0, this.imageCanvas.width, this.imageCanvas.height);

    // Pre render ship on canvas
    var ctx = this.imageContext;
    ctx.imageSmoothingEnabled = false;
    ctx.webkitImageSmoothingEnabled = false;
    ctx.mozImageSmoothingEnabled = false;
    for (var i = 0; i < this.shipData.data.parts.length; ++i)
    {
      var part = this.shipData.data.parts[i];

      // We don't prerender guns or jets onto the ship
      if (part.type === "Gun" || part.type === "Jet")
      {
        ++this.parent.Modules.maxSlots;
        continue;
      }

      var partData = ShipParts[part.faction][part.type][part.index];
      ctx.save();

      if (part.flipX)
        ctx.scale(-1, 1);
      ctx.translate(part.x, part.y);
      ctx.rotate(part.rotation);
      ctx.translate(partData.image.width / -2, partData.image.height / -2);
      ctx.drawImage(partData.image, 0, 0);
      ctx.restore();
    }

    if (this.parent.Modules)
      this.parent.Modules.refreshModules();
  };

  this.takeDamage = function(x, y, damage)
  {
    x -= this.parent.Pos2D.x;
    y -= this.parent.Pos2D.y;

    var oldPos = [x, y];
    x = oldPos[0] * Math.cos(-this.parent.Pos2D.rotation) - oldPos[1] * Math.sin(-this.parent.Pos2D.rotation);
    y = oldPos[1] * Math.cos(-this.parent.Pos2D.rotation) + oldPos[0] * Math.sin(-this.parent.Pos2D.rotation);

    x += this.width;
    y += this.height;

    x /= 3;
    y /= 3;

    var closestDist = Infinity;
    var closest = null;
    for (var i = 0; i < this.shipData.data.parts.length; ++i)
    {
      var part = this.shipData.data.parts[i];
      var dist = TANK.Math.pointDistancePoint([x, y], [part.x, part.y]);
      if (dist < closestDist)
      {
        closestDist = dist;
        closest = part;
      }
    }

    if (closest.type === "Thruster")
    {
      this.parent.Engines.hp -= damage * 0.8;
      this.hullHP -= damage * 0.2;
    }
    else if (closest.type === "Gun")
    {
      var mod = this.parent.Modules.getModuleFromPart(closest);
      if (mod)
      {
        mod.item.hp -= damage * 0.8;
        this.hullHP -= damage * 0.2;
      }
      else
        this.hullHP -= damage;
    }
    else
    {
      this.hullHP -= damage;
    }
  };

  this.explode = function()
  {
    this.soundExplode.play();

    var x = this.parent.Pos2D.x - this.width / 2;
    var y = this.parent.Pos2D.y - this.height / 2;

    for (var i = 0; i < this.shipData.data.parts.length; ++i)
    {
      var part = this.shipData.data.parts[i];

      // We don't use guns as parts
      if (part.type === "Gun" || part.type === "Jet")
        continue;

      var partData = ShipParts[part.faction][part.type][part.index];
      var e = TANK.createEntity("ShipPart, Velocity");
      e.ShipPart.partData = partData;
      e.ShipPart.flipX = part.flipX;
      e.ShipPart.zdepth = this.zdepth + i;
      e.Pos2D.rotation = part.rotation + this.parent.Pos2D.rotation;
      e.Pos2D.x = part.x * 3 - this.width / 2;
      e.Pos2D.y = part.y * 3 - this.height / 2;
      var oldPos = [e.Pos2D.x, e.Pos2D.y];
      e.Pos2D.x = oldPos[0] * Math.cos(this.parent.Pos2D.rotation) - oldPos[1] * Math.sin(this.parent.Pos2D.rotation);
      e.Pos2D.y = oldPos[1] * Math.cos(this.parent.Pos2D.rotation) + oldPos[0] * Math.sin(this.parent.Pos2D.rotation);
      e.Pos2D.x += x + this.width / 2;
      e.Pos2D.y += y + this.height / 2;
      e.Velocity.x = -20 + Math.random() * 40 + this.parent.Velocity.x;
      e.Velocity.y = -20 + Math.random() * 40 + this.parent.Velocity.y;
      e.Velocity.r = -0.5 + Math.random() * 1;
      TANK.addEntity(e);
      TANK.Universe.systemEntities.push(e);
    }

    for (var i = 0; i < 5; ++i)
    {
      var e = TANK.createEntity("GlowParticle, Velocity, Life");
      var angle = Math.random() * Math.PI * 2;
      var speed = 15 + Math.random() * 20;
      e.Pos2D.x = this.parent.Pos2D.x - 20 + Math.random() * 40;
      e.Pos2D.y = this.parent.Pos2D.y - 20 + Math.random() * 40;
      e.Life.life = 1 + Math.random() * 3;
      e.Velocity.x = Math.cos(angle) * speed + this.parent.Velocity.x * 0.5;
      e.Velocity.y = Math.sin(angle) * speed + this.parent.Velocity.y * 0.5;
      e.GlowParticle.sizeA = 40 + Math.random() * 30;
      e.GlowParticle.sizeB = e.GlowParticle.sizeA + 50 + Math.random() * 40;
      e.GlowParticle.colorA = [0, "rgba(255, 255, 255, 0.8)"];
      e.GlowParticle.colorB = [0.4, "rgba(200, 150, 100, 0.3)"];
      e.GlowParticle.colorC = [1, "rgba(200, 150, 100, 0.0)"];
      TANK.addEntity(e);

      e.GlowParticle.addEventListener("OnEnterFrame", function(dt)
      {
        this.sizeA -= dt * 10;
        if (this.sizeA <= 0)
          this.sizeA = 0;
        this.sizeB += dt * 10;
      });
    }

    for (var i = 0; i < 50; ++i)
    {
      var e = TANK.createEntity("GlowParticle, Velocity, Life");
      var angle = Math.random() * Math.PI * 2;
      var speed = 80 + Math.random() * 170;
      e.Pos2D.x = this.parent.Pos2D.x - 10 + Math.random() * 20;
      e.Pos2D.y = this.parent.Pos2D.y - 10 + Math.random() * 20;
      e.Life.life = 2 + Math.random() * 4;
      e.Velocity.x = Math.cos(angle) * speed + this.parent.Velocity.x;
      e.Velocity.y = Math.sin(angle) * speed + this.parent.Velocity.y;
      e.GlowParticle.sizeA = 1 + Math.random();
      e.GlowParticle.sizeB = 5 + Math.random() * 2;
      e.GlowParticle.colorA = [0, "rgba(255, 255, 255, 1)"];
      e.GlowParticle.colorB = [0.4, "rgba(200, 150, 100, 0.3)"];
      e.GlowParticle.colorC = [1, "rgba(200, 150, 100, 0.0)"];
      e.GlowParticle.friction = 0.99 - Math.random() * 0.02;
      TANK.addEntity(e);

      e.GlowParticle.addEventListener("OnEnterFrame", function(dt)
      {
        this.parent.Velocity.x *= this.friction;
        this.parent.Velocity.y *= this.friction;
      });
    }

    TANK.removeEntity(this.parent);
  };

  this.requestPower = function(amount)
  {
    if (this.powerLevel < amount)
    {
      return false;
    }

    this.powerLevel -= amount;
    return true;
  };
})

.destruct(function()
{
  TANK.Universe.removeEntity(this.parent);
});
