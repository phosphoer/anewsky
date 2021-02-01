TANK.registerComponent("QuestGen")

.construct(function()
{
  this.questId = 0;
  this.questLife = 100;
  this.quests = {};
  this.questTime = 10;
})

.initialize(function()
{
  this.addQuest = function(quest)
  {
    quest.id = this.questId++;
    quest.life = this.questLife;
    this.quests[quest.id] = quest;
    quest.startLocation.system.quests[quest.id] = quest;
    ++quest.startLocation.system.numQuests;
    return quest;
  };

  this.removeQuest = function(quest)
  {
    --quest.startLocation.system.numQuests;
    delete quest.startLocation.system.quests[quest.id];
    delete this.quests[quest.id];
  };

  this.addEventListener("OnEnterFrame", function(dt)
  {
    if (TANK.MainMenu || !TANK.Universe)
      return;

    if (!TANK.Universe.currentSystem)
      return;

    this.questTime -= dt;
    if (this.questTime <= 0)
    {
      this.questTime = 15 + Math.random() * 15;
      var quest = new Quest(Math.floor(Math.random() * Quests.length));
      quest.initializeLocation();

      if (!quest.startLocation)
        return;

      if (quest.startLocation.system.numQuests < 3)
        this.addQuest(quest);
    }
  });
});

function Quest(questIndex)
{
  this.id = -1;
  this.life = 0;
  this.questIndex = questIndex;
  this.questData = Quests[questIndex];
  this.startLocation = null;
  this.endLocation = null;
  this.canAccept = true;

  this.parseString = function(str)
  {
    var newStr = str;
    newStr = newStr.replace("{startLocation}", this.startLocation.name);
    newStr = newStr.replace("{endLocation}", this.endLocation.name);
    return newStr;
  };

  this.initializeLocation = function()
  {
    // Search for a planet to start the quest on
    for (var i = 4; i < 10; ++i)
    {
      this.startLocation = TANK.Universe.currentSystem.getNearbySystem(i).getRandomPlanet();
      if (this.startLocation)
        break;
    }
    // If we somehow still don't have a planet, give up
    if (!this.startLocation)
      return;

    var systems = this.startLocation.system.getSystemsInRadii(this.questData.travelToRadius[0], this.questData.travelToRadius[1]);
    if (systems.length === 0)
      console.error("Couldn't find an end location for quest");
    this.endLocation = systems[Math.floor(Math.random() * systems.length)].getRandomPlanet();
  };

  this.accept = function()
  {
    TANK.QuestGen.removeQuest(this);
    QuestAcceptors[this.questData.acceptor](this);
  };

  this.validate = function()
  {
    var complete = QuestValidators[this.questData.validator](this);
    if (complete)
    {
      delete TANK.PlayerData.activeQuests[this.id];
      TANK.PlayerData.money += this.questData.rewardMoney;
    }
    return complete;
  };

  this.save = function()
  {
    var save = {};
    save.questIndex = this.questIndex;
    save.startPlanetIndex = this.startLocation.getIndex();
    save.startSystemIndex = this.startLocation.system.getIndex();
    save.startGalaxyIndex = this.startLocation.system.galaxy.getIndex();
    save.endPlanetIndex = this.endLocation.getIndex();
    save.endSystemIndex = this.endLocation.system.getIndex();
    save.endGalaxyIndex = this.endLocation.system.galaxy.getIndex();
    save.canAccept = this.canAccept;
    return save;
  };

  this.load = function(save)
  {
    this.id = TANK.QuestGen.questId++;
    this.questIndex = save.questIndex;
    this.questData = Quests[this.questIndex];
    this.startLocation = TANK.Universe.galaxies[save.startGalaxyIndex].systems[save.startSystemIndex].planets[save.startPlanetIndex];
    this.endLocation = TANK.Universe.galaxies[save.endGalaxyIndex].systems[save.endSystemIndex].planets[save.endPlanetIndex];
    this.canAccept = save.canAccept;
  };
}