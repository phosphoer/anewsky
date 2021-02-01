var DefaultPrograms = {};

//
// Pilot's log program
//
DefaultPrograms.log = function(controlPanel)
{
  this.name = "log";
  this.desc = "View and complete log entries";

  this.viewEntry = function(input)
  {
    var entryIndex = parseInt(input);
    var entry = TANK.PlayerData.activeQuests[entryIndex];
    if (!entry)
    {
      controlPanel.postError("Error: Log index not valid");
      return;
    }
    controlPanel.postLog(entry.name);
    controlPanel.postLog(" - " + entry.desc);
    if (entry.validate())
    {
      controlPanel.postLog("<span class='consoleOk'>Mission completed: " + entry.name + "</span>");
    }
  };

  this.listEntries = function()
  {
    controlPanel.postLog("<span class='consoleInfo'>Listing log entries...</span>");

    for (var i in TANK.PlayerData.activeQuests)
    {
      controlPanel.postLog(i + ". " + TANK.PlayerData.activeQuests[i].name);
    }

    controlPanel.requestInput("Enter the number of the entry you wish to view: ", this, this.viewEntry);
  };

  this.run = function(args)
  {
    this.listEntries();
  };
};

//
// Wallet program
//
DefaultPrograms.bal = function(controlPanel)
{
  this.desc = "View your current funds";

  this.run = function(args)
  {
    controlPanel.postLog("Wallet balance: <span class='consoleOk'>" + TANK.PlayerData.money + "&#x20bf;</span>");
  };
};