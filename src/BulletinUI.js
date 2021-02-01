TANK.registerComponent("BulletinUI")

.construct(function()
{
})

.initialize(function()
{
  var that = this;
  this.windowUI = UIHelpers.createWindow(600, 500, "BBS");

  this.list = $("<div class='bulletinList'></div>");
  this.list.appendTo(this.windowUI.body);

  this.info = $("<div class='bulletinInfo'></div>");
  this.info.appendTo(this.windowUI.body);

  this.acceptButton = $("<div class='button'>Accept</div>");
  this.acceptButton.appendTo(this.windowUI.body);
  this.acceptButton.css("display", "none");

  this.acceptButton.bind("click", function()
  {
    var bulletin = $(".bulletinItem.selected").data("quest");
    bulletin.accept();
    TANK.ControlPanel.postInfo("Accepted mission: " + bulletin.parseString(bulletin.questData.name));
    TANK.PlayerData.activeQuests[bulletin.id] = bulletin;
    $(".bulletinItem.selected").remove();
    that.info.empty();
  });

  this.addQuest = function(quest)
  {
    var questUI = $("<div class='bulletinItem'>" + quest.parseString(quest.questData.name) + "</div>");
    questUI.data("quest", quest);
    questUI.appendTo(this.list);

    questUI.bind("click", function()
    {
      $(".bulletinItem").removeClass("selected");
      $(this).toggleClass("selected");
      that.refreshInfo();
    });
  };

  this.refreshInfo = function()
  {
    this.info.empty();

    var bulletin = $(".bulletinItem.selected").data("quest");
    var info = $("<div class='bulletinDesc'></div>");
    info.append($("<div>" + bulletin.parseString(bulletin.questData.name) + "</div>"));
    info.append($("<div>- <span class='lightText'>" + bulletin.parseString(bulletin.questData.desc) + "</span></div>"));

    if (bulletin.startLocation)
      info.append($("<div>Mission start: " + bulletin.startLocation.name + "</div>"));
    if (bulletin.endLocation)
      info.append($("<div>Mission end: " + bulletin.endLocation.name + "</div>"));
    if (bulletin.canAccept)
    {
      this.acceptButton.css("display", "");
      info.append($("<div>Mission reward: <span class='consoleOk'>" + bulletin.questData.rewardMoney + "&#x20bf;</span></div>"));
    }
    else
      this.acceptButton.css("display", "none");

    info.appendTo(this.info);
  };

  this.refreshBulletins = function()
  {
    this.list.empty();
    this.info.empty();

    // Find nearby systems
    var systems = TANK.Universe.currentSystem.getSystemsInRadius(5);
    systems.push(TANK.Universe.currentSystem);

    // Search for quests
    this.quests = [];
    for (var i = 0; i < systems.length; ++i)
    {
      for (var j in systems[i].quests)
      {
        var quest = systems[i].quests[j];
        this.quests.push(quest);
      }
    }

    // Add the quests
    for (var i = 0; i < this.quests.length; ++i)
      this.addQuest(this.quests[i]);

    if (this.quests.length === 0)
      $("<div class='lightText'>No bulletins found nearby</div>").appendTo(this.list);
  };

  this.refreshBulletins();
})

.destruct(function()
{
  this.windowUI.main.remove();
});