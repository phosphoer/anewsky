var GalaxyNames = [];
var SystemNames = [];
var ShipNames = [];
var CurrentShipName = 0;

var shuffleArray = function(array) {
  var i = array.length, j, temp;
  if ( i == 0 ) return array;
  while ( --i ) {
     j = Math.floor( Math.random() * ( i + 1 ) );
     temp = array[i];
     array[i] = array[j];
     array[j] = temp;
  }
  return array;
}

function GenerateSystemNames(count)
{
  var systemName1A =
  [
    "Cen",
    "Al",
    "Neb",
    "Pol",
    "Tri",
    "Di",
    "Dio",
    "Ben",
    "Qua",
    "Ver",
    "Vir",
    "Mel",
    "Mol",
    "Cho",
    "Cha",
    "Chi",
    "Cla",
    "Clo",
    "Ban",
    "Tra",
    "Vze",
    "Gol",
    "Fal",
    "Gen",
    "Ply",
    "Ear",
    "Ura",
    "Pho"
  ];

  var systemName1B =
  [
    "tos",
    "ar",
    "der",
    "pol",
    "ven",
    "on",
    "tas",
    "nom",
    "dad",
    "kos",
    "ger",
    "war",
    "zer"
  ];

  var systemName1C =
  [
    "cen",
    "al",
    "neb",
    "pol",
    "tri",
    "di",
    "dio",
    "ben",
    "qua",
    "ver",
    "vir",
    "mel",
    "mol",
    "cho",
    "cha",
    "chi",
    "cla",
    "clo",
    "ban",
    "tra",
    "vze",
    "gol",
    "fal"
  ];

  var names = {};
  for (var i = 0; i < count; ++i)
  {
    var a = systemName1A[Math.floor(TANK.Universe.rng.random(0, systemName1A.length))];
    var b = systemName1B[Math.floor(TANK.Universe.rng.random(0, systemName1B.length))];
    var c = systemName1C[Math.floor(TANK.Universe.rng.random(0, systemName1C.length))];

    var name = a + b;
    if (TANK.Universe.rng.random(0, 1) < 0.3)
      name += c;

    if (names[name])
      --i;
    else
    {
      names[name] = true;
      SystemNames.push(name);
    }
  }
}

function GenerateShipNames()
{
  var shipName1A =
  [
    "Pride",
    "Pillar",
    "Blade",
    "Leaf",
    "Heart",
    "Flower",
    "Rose",
    "Rock",
    "Bird",
    "Fish",
    "Destroyer",
  ];

  var shipName3A =
  [
    "Space",
    "Autumn",
    "Winter",
    "Spring",
    "Summer",
    "the Sky",
    "Glory",
    "Gold",
    "Despair",
    "Moonlight",
  ];

  var shipName1B =
  [
    "Floating",
    "Flying",
    "Flaming",
    "Dancing",
    "Falling",
    "Courageous",
    "Dirty",
    "Happy",
    "Running",
    "Scared",
    "Sacred",
    "Angry",
    "Trembling",
    "Millenium",
    "Audacious",
    "Serene",
    "HMS",
    "USC",
    "BCF",
    "ERA",
    "ETC",
    "GSA",
    "RSA",
    "SS",
    "CSS",
  ];

  var shipName2B =
  [
    "Leaf",
    "Rock",
    "Tree",
    "Planet",
    "Star",
    "Sun",
    "Galaxy",
    "Enterprise",
    "Bucket",
    "Barge",
    "Moth",
    "Dragon",
    "Falcon",
    "Corsair",
    "Trafalga",
    "Derelict",
    "Kestrel",
    "Firefly",
    "Bird",
  ];

  for (var i in shipName1A)
  {
    for (var k in shipName3A)
    {
      var a = shipName1A[i];
      if (Math.random() < 0.3)
        a = shipName1B[Math.floor(Math.random() * shipName1B.length)] + " " + a;
      if (Math.random() < 0.3)
        a = "The " + a;
      var b = "of"
      var c = shipName3A[k];
      ShipNames.push(a + " " + b + " " + c);
    }
  }

  for (var j in shipName1B)
  {
    for (var k in shipName2B)
    {
      var b = shipName1B[j];
      if (Math.random() < 0.3)
        b = "The " + b;
      var c = shipName2B[k];
      ShipNames.push(b + " " + c);
    }
  }

  shuffleArray(ShipNames);
}