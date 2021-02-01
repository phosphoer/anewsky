var Factions =
{
  "Tern":
  {
    name: "Tern",
    hasPlayerStanding: true,
    spawnNearTerritory: true,
    canDeclareWar: true,
    canDeclareAlliance: true,
    playerStanding: 0,
    ships:
    {
      civilian:
      [
        {"ship": 100, "modules": []},
        {"ship": 100, "modules": [200]},
        {"ship": 101, "modules": []},
        {"ship": 101, "modules": [200]}
      ],
      militaryLight:
      [
        {"ship": 102, "modules": [200]}
      ]
    }
  }
};