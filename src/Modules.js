TANK.registerComponent("Modules")

.interfaces("Drawable")

.requires("Pos2D")

.construct(function()
{
  this.zdepth = 50;

  this.systemPowered = false;
  this.systemEnabled = true;
  this.isSystem = true;
  this.powerDrain = 1;

  this.slots = [];
  this.maxSlots = 0;

  this.trackPoint = [0, 0];
})

.initialize(function()
{
  this.addModule = function(itemIndex)
  {
    var item = Items[itemIndex];
    var mod = new SlotItems[item.modName](this, itemIndex);
    if (this.slots.length >= this.maxSlots)
      return false;

    var gunIndex = 0;
    for (var i in this.parent.Ship.shipData.data.parts)
    {
      var part = this.parent.Ship.shipData.data.parts[i];
      if (part.type === "Gun")
      {
        if (gunIndex === this.slots.length)
        {
          mod.part = part;
          break;
        }
        else
          ++gunIndex;
      }
    }

    mod.parent = this;
    this.slots.push(mod);
    this.parent.invoke("OnModulesChanged");

    return true;
  };

  this.getModuleFromPart = function(part)
  {
    for (var i = 0; i < this.slots.length; ++i)
    {
      if (this.slots[i].part === part)
        return this.slots[i];
    }

    return null;
  };

  this.refreshModules = function()
  {
    for (var j = 0; j < this.slots.length; ++j)
    {
      var mod = this.slots[j];
      var gunIndex = 0;
      for (var i in this.parent.Ship.shipData.data.parts)
      {
        var part = this.parent.Ship.shipData.data.parts[i];
        if (part.type === "Gun")
        {
          if (gunIndex === j)
          {
            mod.part = part;
            break;
          }
          else
            ++gunIndex;
        }
      }
    }
  };

  this.activateModule = function(index, target, loop)
  {
    var mod = this.slots[index];
    if (!mod)
    {
      return false;
    }

    mod.target = target;
    mod.active = true;
    mod.loop = loop;

    if (mod.cooldown > 0)
      return false;

    if (mod.hp <= 0)
    {
      this.parent.ShipReadoutUI.setModuleDestroyed(index);
      return false;
    }

    if (!this.parent.Ship.requestPower(mod.powerDrain))
      return false;

    if (mod.fixed || mod.onTarget)
    {
      mod.activate();
      mod.cooldown = mod.item.cooldownTime;
    }

    if (this.parent.ShipReadoutUI)
      this.parent.ShipReadoutUI.setModuleActive(index);

    return true;
  };

  this.deactivateModule = function(index)
  {
    var mod = this.slots[index];
    if (!mod)
      return false;

    mod.target = null;
    mod.active = false;
    mod.deactivate && mod.deactivate();

    if (this.parent.ShipReadoutUI)
      this.parent.ShipReadoutUI.setModuleInactive(index);

    return true;
  };

  this.isTargeting = function(obj)
  {
    for (var i = 0; i < this.slots.length; ++i)
    {
      if (this.slots[i].target === obj)
        return true;
    }

    return false;
  };

  this.addEventListener("OnEnterFrame", function(dt)
  {
    this.lastDt = dt;
    if (!this.systemEnabled)
      return;

    // Get power requirements
    if (!this.parent.Ship.requestPower(this.powerDrain * dt))
    {
      this.systemPowered = false;
      return;
    }
    this.systemPowered = true;

    // Apply cooldown and loop to modules
    for (var i = 0; i < this.slots.length; ++i)
    {
      var mod = this.slots[i];

      if (mod.cooldown > 0)
        mod.cooldown -= dt;

      if (mod.hp <= 0)
      {
        this.parent.ShipReadoutUI.setModuleDestroyed(i);
        continue;
      }

      if (!mod.active)
        continue;

      if (mod.cooldown <= 0 && !mod.loop)
      {
        this.deactivateModule(i);
        continue;
      }

      // Check if target is still alive
      if (mod.target && !TANK.getEntity(mod.target.id))
      {
        this.deactivateModule(i);
        continue;
      }

      if (!mod.item.fixed)
      {
        // Lead the target
        var t = this.parent.Pos2D;
        var tDest = mod.target.Pos2D;
        var distance = TANK.Math.pointDistancePoint([t.x, t.y], [tDest.x, tDest.y]);
        var myV = [this.parent.Velocity.x, this.parent.Velocity.y];
        var targetV = [mod.target.Velocity.x, mod.target.Velocity.y];
        var relativeV = [targetV[0] - myV[0], targetV[1] - myV[1]];
        relativeV[0] *= distance / mod.item.projectileSpeed;
        relativeV[1] *= distance / mod.item.projectileSpeed;

        var trackPoint = [tDest.x + relativeV[0], tDest.y + relativeV[1]];

        // Aim the module towards the current target
        var myDir = [Math.cos(mod.rotation + t.rotation), Math.sin(mod.rotation + t.rotation)];
        var angleToTarget = Math.atan2(trackPoint[1] - t.y, trackPoint[0] - t.x) + Math.PI / 2;
        var targetDir = [Math.cos(angleToTarget), Math.sin(angleToTarget)];
        var cross = myDir[0] * targetDir[1] - myDir[1] * targetDir[0];

        mod.onTarget = false;
        if (cross < -0.05)
          mod.rotation -= mod.item.trackSpeed * dt;
        else if (cross > 0.05)
          mod.rotation += mod.item.trackSpeed * dt;
        else
          mod.onTarget = true;

        if (mod.loop && mod.cooldown <= 0 && mod.onTarget)
          this.activateModule(i, mod.target, true);
      }

      if (mod.item.fixed && mod.loop && mod.cooldown <= 0)
        this.activateModule(i, mod.target, true);
    }

  });

  this.draw = function(ctx, camera)
  {
    var t = this.parent.Pos2D;

    ctx.save();
    for (var i = 0; i < this.slots.length; ++i)
    {
      var mod = this.slots[i];
      var partData = mod.item.partData;
      var part = mod.part;

      // Draw line to target
      if (mod.target)
      {
        ctx.strokeStyle = "rgba(255, 100, 50, 0.5)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(t.x - camera.x, t.y - camera.y);
        ctx.lineTo(mod.target.Pos2D.x - camera.x, mod.target.Pos2D.y - camera.y);
        ctx.stroke();
        ctx.closePath();
      }

      if (camera.z > 5)
        continue;

      // Draw module
      ctx.save();
      if (part.flipX)
        ctx.scale(-1, 1);

      var size = [partData.image.width * 3, partData.image.height * 3];
      var shipSize = [this.parent.Ship.imageCanvas.width * 3, this.parent.Ship.imageCanvas.height * 3];

      ctx.translate(t.x - camera.x, t.y - camera.y);
      ctx.rotate(t.rotation);
      ctx.translate(shipSize[0] / -2, shipSize[1] / -2);
      ctx.translate(part.x * 3, part.y * 3);

      ctx.rotate(part.rotation + mod.rotation);
      ctx.translate(size[0] / -2, size[1] / -2);
      ctx.drawImage(partData.image, 0, 0, size[0], size[1]);
      ctx.restore();
    }
    ctx.restore();

  };
});
