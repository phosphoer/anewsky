TANK.registerComponent("ShipEditor")

.interfaces("Drawable")

.construct(function()
{
  this.zdepth = 0;
  this.parts = [];
})

.initialize(function()
{
  var that = this;

  // Remove player
  this.player = TANK.getEntity("Player");
  if (this.player)
    TANK.removeEntity(this.player);

  // Make cursor
  this.cursor = TANK.createEntity("Cursor");
  TANK.addEntity(this.cursor, "Cursor");

  this.partPalette = $("<div id='shipEditorPartPalette'></div>");
  this.partPalette.appendTo($("body"));

  this.saveButton = $("<div class='button'>Save</div>");
  this.saveButton.appendTo(this.partPalette);

  this.shipList = $("<div class='list'></div>");
  this.shipList.appendTo(this.partPalette);

  for (var i = 0; i < Items.length; ++i)
  {
    if (!Items[i] || Items[i].itemType != "Ship")
      continue;
    var ship = Items[i];
    var entry = $("<div class='item'>" + ship.faction + " " + ship.name + "</div>");
    entry.appendTo(this.shipList);
    entry[0].shipData = ship.data;

    entry.bind("click", function()
    {
      that.load($(this)[0].shipData);
    });
  }

  this.saveButton.bind("click", function()
  {
    var data = that.save();
    var dataStr = JSON.stringify(data);
    console.log(dataStr);
  });

  this.save = function()
  {
    var data = {};
    data.parts = [];

    var min = [Infinity, Infinity];
    var max = [-Infinity, -Infinity];
    for (var i = 0; i < this.parts.length; ++i)
    {
      min[0] = Math.min(this.parts[i].Pos2D.x - this.parts[i].Collider.width / 2, min[0]);
      min[1] = Math.min(this.parts[i].Pos2D.y - this.parts[i].Collider.height / 2, min[1]);
      max[0] = Math.max(this.parts[i].Pos2D.x + this.parts[i].Collider.width / 2, max[0]);
      max[1] = Math.max(this.parts[i].Pos2D.y + this.parts[i].Collider.height / 2, max[1]);
    }

    data.width = (max[0] - min[0]) / 3;
    data.height = (max[1] - min[1]) / 3;

    this.parts.sort(function(a, b)
    {
      return a.ShipPart.zdepth - b.ShipPart.zdepth;
    });

    for (var i = 0; i < this.parts.length; ++i)
    {
      var p = {};
      p.x = (this.parts[i].Pos2D.x - min[0]) / 3;
      p.y = (this.parts[i].Pos2D.y - min[1]) / 3;
      p.rotation = this.parts[i].Pos2D.rotation;
      p.faction = this.parts[i].ShipPart.partData.faction;
      p.type = this.parts[i].ShipPart.partData.type;
      p.index = this.parts[i].ShipPart.partData.index;
      p.flipX = this.parts[i].ShipPart.partData.flipX;
      data.parts.push(p);
    }

    return data;
  };

  this.load = function(ship)
  {
    var x = TANK.RenderManager.camera.x + window.innerWidth / 2;
    var y = TANK.RenderManager.camera.y + window.innerHeight / 2;

    for (var i = 0; i < ship.parts.length; ++i)
    {
      var part = ship.parts[i];

      var e = TANK.createEntity("ShipPart, Editable");
      e.ShipPart.partData = ShipParts[part.faction][part.type][part.index];
      e.ShipPart.flipX = part.flipX;
      e.ShipPart.zdepth = i;
      e.Pos2D.rotation = part.rotation;
      e.Pos2D.x = x + part.x * 3;
      e.Pos2D.y = y + part.y * 3;
      that.parts.push(e);
      TANK.addEntity(e);
    }
  };

  // Load all the ship parts
  for (var faction in ShipParts)
  {
    for (var partType in ShipParts[faction])
    {
      var parts = ShipParts[faction][partType];
      for (var i = 0; i < parts.length; ++i)
      {
        var part = $("<canvas></canvas>");
        part.appendTo(this.partPalette);
        part.attr("width", (parts[i].image.width * 3) + "px");
        part.attr("height", (parts[i].image.height * 3) + "px");
        part[0].shipPart = parts[i];
        var ctx = part[0].getContext("2d");
        ctx.imageSmoothingEnabled = false;
        ctx.webkitImageSmoothingEnabled = false;
        ctx.mozImageSmoothingEnabled = false;
        ctx.drawImage(parts[i].image, 0, 0, parts[i].image.width * 3, parts[i].image.height * 3);

        part.bind("click", function()
        {
          var e = TANK.createEntity("ShipPart, Editable");
          e.ShipPart.partData = $(this)[0].shipPart;
          e.Pos2D.x = TANK.RenderManager.camera.x + window.innerWidth / 2;
          e.Pos2D.y = TANK.RenderManager.camera.y + window.innerHeight / 2;
          that.parts.push(e);
          TANK.addEntity(e);
        });
      }
    }
  }

  this.addEventListener("OnMouseDown", function(button)
  {
    if (button === TANK.Key.RIGHT_MOUSE)
    {
      // Find ship parts to select
      this.selected = null;
      for (var i = 0; i < this.parts.length; ++i)
      {
        this.parts[i].Editable.selected = false;
        if (this.cursor.Collider.collide(this.parts[i].Collider))
        {
          this.selected = this.parts[i];
        }
      }

      if (this.selected)
      {
        this.selected.Editable.selected = true;
      }
    }
  });

  this.addEventListener("OnKeyPress", function(keyCode)
  {
    if (keyCode === TANK.Key.BACKSPACE && this.selected)
    {
      TANK.removeEntity(this.selected);
      for (var i = 0; i < this.parts.length; ++i)
        if (this.parts[i] === this.selected)
          this.parts.splice(i, 1);
    }
  });

  this.addEventListener("OnKeyHeld", function(keyCode)
  {
    if (keyCode === TANK.Key.W)
      TANK.RenderManager.camera.y -= 3;
    if (keyCode === TANK.Key.S)
      TANK.RenderManager.camera.y += 3;
    if (keyCode === TANK.Key.A)
      TANK.RenderManager.camera.x -= 3;
    if (keyCode === TANK.Key.D)
      TANK.RenderManager.camera.x += 3;
  });

  this.draw = function(ctx, camera)
  {
    ctx.save();

    ctx.restore();
  };
})

.destruct(function()
{
  this.partPalette.remove();

  TANK.removeEntity(this.cursor);

  // Add player
  if (this.player)
    TANK.addEntity(this.player, this.player.name);
});

//
// Cursor
//
TANK.registerComponent("Cursor")

// .interfaces("Drawable")

.requires("Pos2D, Collider")

.construct(function()
{
  this.zdepth = 5;
})

.initialize(function()
{
  this.addEventListener("OnEnterFrame", function(dt)
  {
    this.updatePos();
  });

  this.updatePos = function()
  {
    var t = this.parent.Pos2D;

    t.x = TANK.InputManager.mousePos[0];
    t.y = TANK.InputManager.mousePos[1];
    t.x -= window.innerWidth / 2;
    t.y -= window.innerHeight / 2;
    t.x *= TANK.RenderManager.camera.z;
    t.y *= TANK.RenderManager.camera.z;
    t.x += window.innerWidth / 2;
    t.y += window.innerHeight / 2;
    t.x += TANK.RenderManager.camera.x;
    t.y += TANK.RenderManager.camera.y;
  };

  this.draw = function(ctx, camera)
  {
    var t = this.parent.Pos2D;
    ctx.save();

    ctx.fillStyle = "#fff";
    ctx.fillRect(t.x - camera.x, t.y - camera.y, 50, 50);

    ctx.restore();
  };
});

//
// Editable
//
TANK.registerComponent("Editable")

.interfaces("Drawable")

.requires("Pos2D, Collider")

.construct(function()
{
  this.zdepth = 5;
  this.selected = false;
  this.dragging = false;
  this.rotating = false;
  this.oldPos = [0, 0];
})

.initialize(function()
{
  this.addEventListener("OnEnterFrame", function(dt)
  {
    var t = this.parent.Pos2D;

    if (this.dragging)
    {
      var cursor = TANK.getEntity("Cursor");
      t.x = cursor.Pos2D.x;
      t.y = cursor.Pos2D.y;
    }
  });

  this.addEventListener("OnMouseMove", function(e)
  {
    if (this.rotating)
    {
      this.parent.Pos2D.rotation += e.moveX / 150;
      this.parent.Pos2D.rotation -= e.moveY / 150;
    }
  });

  this.addEventListener("OnMouseDown", function(button)
  {
    if (this.dragging)
    {
      if (button === TANK.Key.RIGHT_MOUSE)
        this.cancelDrag();
      else if (button === TANK.Key.LEFT_MOUSE)
        this.endDrag();
    }
    else if (this.rotating)
    {
      if (button === TANK.Key.RIGHT_MOUSE)
        this.cancelRotate();
      else if (button === TANK.Key.LEFT_MOUSE)
        this.endRotate();
    }
  });

  this.addEventListener("OnKeyPress", function(keyCode)
  {
    if (!this.selected)
      return;

    if (keyCode === TANK.Key.G && !this.rotating)
    {
      if (this.dragging)
        this.cancelDrag();
      else
        this.startDrag();
    }
    else if (keyCode === TANK.Key.R && !this.dragging)
    {
      if (this.rotating)
        this.cancelRotate();
      else
        this.startRotate();
    }
    else if (keyCode === 187)
    {
      this.parent.ShipPart.zdepth += 1;
      TANK.RenderManager.sort();
    }
    else if (keyCode === 189)
    {
      this.parent.ShipPart.zdepth -= 1;
      TANK.RenderManager.sort();
    }
    else if (keyCode === TANK.Key.X)
    {
      this.parent.ShipPart.flipX = !this.parent.ShipPart.flipX;
    }
  });

  this.startDrag = function()
  {
    this.dragging = true;
    this.oldPos = [this.parent.Pos2D.x, this.parent.Pos2D.y];
  };

  this.cancelDrag = function()
  {
    this.parent.Pos2D.x = this.oldPos[0];
    this.parent.Pos2D.y = this.oldPos[1];
    this.dragging = false;
  };

  this.endDrag = function()
  {
    this.dragging = false;
  };

  this.startRotate = function()
  {
    this.rotating = true;
    this.oldRotation = this.parent.Pos2D.rotation;
  };

  this.cancelRotate = function()
  {
    this.parent.Pos2D.rotation = this.oldRotation;
    this.rotating = false;
  };

  this.endRotate = function()
  {
    this.rotating = false;
  };

  this.draw = function(ctx, camera)
  {
    if (!this.selected)
      return;

    // Size collider
    var size = [this.parent.Collider.width, this.parent.Collider.height];
    var t = this.parent.Pos2D;
    ctx.save();

    ctx.translate(t.x - camera.x, t.y - camera.y);
    ctx.rotate(t.rotation);

    ctx.strokeStyle = "#5f5";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.rect(size[0] / -2, size[1] / -2, size[0], size[1]);
    ctx.stroke();
    ctx.closePath();

    ctx.restore();
  };
});

