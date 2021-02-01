TANK.registerComponent("LogUI")

.construct(function()
{
})

.initialize(function()
{
  var that = this;
  this.windowUI = UIHelpers.createWindow(600, 500, "Logbook");

  this.list = $("<div class='logList'></div>");
  this.list.appendTo(this.windowUI.body);

  this.info = $("<div class='logInfo'></div>");
  this.info.appendTo(this.windowUI.body);

  this.completeButton = $("<div class='button'>Complete</div>");
  this.completeButton.appendTo(this.windowUI.body);
  this.completeButton.css("display", "none");

  this.completeButton.bind("click", function()
  {
    var bulletin = $(".logItem.selected").data("quest");
    if (bulletin.validate())
    {
      TANK.ControlPanel.postSuccess("Completed mission: " + bulletin.parseString(bulletin.questData.name));
      $(".logItem.selected").remove();
    }
    else
    {
      TANK.ControlPanel.postError("Error: The objectives for the mission '" + bulletin.parseString(bulletin.questData.name + "' have not yet been met"));
    }
    that.info.empty();
  });

  this.addQuest = function(quest)
  {
    var questUI = $("<div class='logItem'>" + quest.parseString(quest.questData.name) + "</div>");
    questUI.data("quest", quest);
    questUI.appendTo(this.list);

    questUI.bind("click", function()
    {
      $(".logItem").removeClass("selected");
      $(this).toggleClass("selected");
      that.refreshInfo();
    });
  };

  this.refreshInfo = function()
  {
    this.info.empty();

    var bulletin = $(".logItem.selected").data("quest");
    var info = $("<div class='bulletinDesc'></div>");
    info.append($("<div>" + bulletin.parseString(bulletin.questData.name) + "</div>"));
    info.append($("<div>- <span class='lightText'>" + bulletin.parseString(bulletin.questData.desc) + "</span></div>"));

    if (bulletin.startLocation)
      info.append($("<div>Mission start: " + bulletin.startLocation.name + "</div>"));
    if (bulletin.endLocation)
      info.append($("<div>Mission end: " + bulletin.endLocation.name + "</div>"));
    if (bulletin.canAccept)
    {
      info.append($("<div>Mission reward: <span class='consoleOk'>" + bulletin.questData.rewardMoney + "&#x20bf;</span></div>"));
      this.completeButton.css("display", "");
    }
    else
      this.completeButton.css("display", "none");

    info.appendTo(this.info);
  };

  this.refreshBulletins = function()
  {
    this.list.empty();
    this.info.empty();

    // Add the quests
    for (var i in TANK.PlayerData.activeQuests)
      this.addQuest(TANK.PlayerData.activeQuests[i]);
  };

  this.refreshBulletins();
})

.destruct(function()
{
  this.windowUI.main.remove();
});