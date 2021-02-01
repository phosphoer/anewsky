var ShipParts =
{
  "Tern":
  {
    "Body":
    [
      {
        imagePath: "res/Parts/Tern/body-01.png"
      },
      {
        imagePath: "res/Parts/Tern/body-02.png"
      },
      {
        imagePath: "res/Parts/Tern/body-03.png"
      }
    ],
    "Nose":
    [
      {
        imagePath: "res/Parts/Tern/nose-01.png"
      }
    ],
    "Aft":
    [
      {
        imagePath: "res/Parts/Tern/aft-01.png"
      },
    ],
    "Cockpit":
    [
      {
        imagePath: "res/Parts/Tern/cockpit-01.png"
      },
    ],
    "Strut":
    [
      {
        imagePath: "res/Parts/Tern/strut-01.png"
      },
      {
        imagePath: "res/Parts/Tern/strut-02.png"
      },
    ],
    "Wing":
    [
      {
        imagePath: "res/Parts/Tern/wing-01.png"
      },
      {
        imagePath: "res/Parts/Tern/wing-02.png"
      },
    ],
    "Thruster":
    [
      {
        imagePath: "res/Parts/Tern/thruster-01.png"
      },
      {
        imagePath: "res/Parts/Tern/thruster-02.png"
      },
    ],
    "Gun":
    [
      {
        imagePath: "res/Parts/Tern/gun-01.png"
      }
    ],
    "Jet":
    [
      {
        imagePath: "res/Parts/Tern/jet-right-01.png",
        direction: "right"
      },
      {
        imagePath: "res/Parts/Tern/jet-left-01.png",
        direction: "left"
      }
    ]
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
      parts[i].image = new Image();
      parts[i].image.src = parts[i].imagePath;
      parts[i].type = partType;
      parts[i].faction = faction;
      parts[i].index = i;
    }
  }
}