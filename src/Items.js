var Items = [];

function Item(itemIndex)
{
  this.itemIndex = itemIndex;
  this.container = null;
  this.quantity = 1;
  for (var i in Items[itemIndex])
    this[i] = Items[itemIndex][i];
};

Items[0] =
{
  name: "Exotic Dancers",
  volume: 5
};

Items[1] =
{
  name: "Medical Supplies",
  volume: 15,
  price: 100,
  minPrice: 75,
  maxPrice: 145
};

Items[2] =
{
  name: "Vaccines",
  volume: 10
};

Items[3] =
{
  name: "Passenger",
  volume: 5
};

Items[4] =
{
  name: "Newly Weds",
  volume: 5
};

Items[5] =
{
  name: "Special Medical Supplies",
  volume: 25
};

Items[6] =
{
  name: "Minerals",
  volume: 0.1,
  price: 1,
  minPrice: 0.75,
  maxPrice: 2
};

Items[7] =
{
  name: "Water",
  volume: 1,
  price: 18,
  minPrice: 10,
  maxPrice: 30
};

Items[8] =
{
  name: "Fuel",
  volume: 0.8,
  price: 120,
  minPrice: 90,
  maxPrice: 150
};

Items[100] =
{
  name: "Shuttle",
  volume: 300,
  price: 10000,
  minPrice: 9000,
  maxPrice: 12000,
  hullHP: 200,
  itemType: "Ship",
  data: {"parts":[{"x":7,"y":22.666666666666668,"rotation":-0.38666666666666694,"faction":"Tern","type":"Strut","index":1},{"x":19.666666666666668,"y":22.666666666666668,"rotation":0.33333333333333337,"faction":"Tern","type":"Strut","index":1},{"x":14,"y":6,"rotation":0,"faction":"Tern","type":"Nose","index":0},{"x":3.5,"y":26.5,"rotation":0,"faction":"Tern","type":"Thruster","index":0},{"x":24.5,"y":26.5,"rotation":0,"faction":"Tern","type":"Thruster","index":0},{"x":14,"y":15,"rotation":0,"faction":"Tern","type":"Body","index":2},{"x":14,"y":23,"rotation":0,"faction":"Tern","type":"Aft","index":0},{"x":14,"y":7.333333333333333,"rotation":0,"faction":"Tern","type":"Cockpit","index":0},{"x":14.166666666666666,"y":21,"rotation":0,"faction":"Tern","type":"Gun","index":0},{"x":15.5,"y":9.833333333333334,"rotation":0,"faction":"Tern","type":"Jet","index":0},{"x":12.166666666666666,"y":9.833333333333334,"rotation":0,"faction":"Tern","type":"Jet","index":1}],"width":28,"height":32.5},
  type: "Frigate",
  classification: "civilian",
  faction: "Tern",
  maxSpeed: 200,
  accel: 50,
  turnSpeed: 1,
  turnAccel: 3,
  warpRange: 4,
  warpFuel: 10
};

Items[101] =
{
  name: "Freighter",
  volume: 800,
  price: 70000,
  minPrice: 65000,
  maxPrice: 78000,
  hullHP: 400,
  itemType: "Ship",
  data: {"parts":[{"x":11,"y":29.666666666666668,"rotation":0,"faction":"Tern","type":"Body","index":0},{"x":11.166666666666666,"y":6,"rotation":0,"faction":"Tern","type":"Nose","index":0},{"x":11.166666666666666,"y":37.666666666666664,"rotation":0,"faction":"Tern","type":"Aft","index":0},{"x":11.166666666666666,"y":18,"rotation":0,"faction":"Tern","type":"Body","index":2},{"x":11.166666666666666,"y":8.333333333333334,"rotation":0,"faction":"Tern","type":"Cockpit","index":0},{"x":11.166666666666666,"y":37.333333333333336,"rotation":0,"faction":"Tern","type":"Thruster","index":1},{"x":13.166666666666666,"y":12.333333333333334,"rotation":0,"faction":"Tern","type":"Jet","index":0},{"x":9.166666666666666,"y":12.333333333333334,"rotation":0,"faction":"Tern","type":"Jet","index":1},{"x":11.166666666666666,"y":20,"rotation":0,"faction":"Tern","type":"Gun","index":0},{"x":18.833333333333332,"y":40,"rotation":0,"faction":"Tern","type":"Thruster","index":0},{"x":3.5,"y":40,"rotation":0,"faction":"Tern","type":"Thruster","index":0}],"width":22.333333333333332,"height":46},
  type: "Freighter",
  classification: "civilian",
  faction: "Tern",
  maxSpeed: 100,
  accel: 30,
  turnSpeed: 0.5,
  turnAccel: 2,
  warpRange: 3,
  warpFuel: 15
};

Items[102] =
{
  name: "Fighter",
  volume: 400,
  price: 80000,
  minPrice: 73000,
  maxPrice: 90000,
  hullHP: 300,
  itemType: "Ship",
  data: {"parts":[{"x":12.666666666666666,"y":16.666666666666668,"rotation":-0.3466666666666666,"faction":"Tern","type":"Strut","index":0},{"x":25.333333333333332,"y":16.333333333333332,"rotation":0,"faction":"Tern","type":"Strut","index":1},{"x":6.333333333333333,"y":23,"rotation":0,"faction":"Tern","type":"Thruster","index":0},{"x":19,"y":18,"rotation":0,"faction":"Tern","type":"Body","index":2},{"x":19,"y":24.333333333333332,"rotation":0,"faction":"Tern","type":"Thruster","index":1},{"x":19,"y":6,"rotation":0,"faction":"Tern","type":"Nose","index":0},{"x":6,"y":16.666666666666668,"rotation":-1.5666666666666682,"faction":"Tern","type":"Wing","index":0},{"x":19,"y":22.333333333333332,"rotation":0,"faction":"Tern","type":"Thruster","index":0},{"x":36.333333333333336,"y":16.666666666666668,"rotation":0,"faction":"Tern","type":"Wing","index":1},{"x":19,"y":6.333333333333333,"rotation":0,"faction":"Tern","type":"Cockpit","index":0},{"x":33.166666666666664,"y":17.666666666666668,"rotation":0,"faction":"Tern","type":"Gun","index":0},{"x":18.833333333333332,"y":18.333333333333332,"rotation":0,"faction":"Tern","type":"Gun","index":0}],"width":45.333333333333336,"height":32.333333333333336},
  type: "Frigate",
  classification: "military",
  faction: "Tern",
  maxSpeed: 250,
  accel: 70,
  turnSpeed: 1.5,
  turnAccel: 4,
  warpRange: 3,
  warpFuel: 9
};

Items[200] =
{
  name: "Small Railgun",
  desc: "A magnetically powered weapon that launches chunks of molten metal at high velocities towards an unfortunate target.",
  volume: 10,
  price: 5000,
  minPrice: 4300,
  maxPrice: 6000,
  hp: 100,
  itemType: "Equipable",
  modName: "ProjectileGun",
  partData: ShipParts["Tern"]["Gun"][0],
  cooldownTime: 1,
  powerDrain: 10,
  fixed: false,
  trackSpeed: 2,
  damage: 40,
  projectileSpeed: 1000,
  projectileRange: 6000
};