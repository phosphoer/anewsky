TANK.registerComponent("CommUI")

.construct(function()
{
  this.soundMessageSend = new Audio("res/Sounds/ui-02.wav");
  this.soundMessageSend.volume = 0.2;

  this.soundCommOpen = new Audio("res/Sounds/ui-01.wav");
  this.soundCommOpen.volume = 0.2;
})

.initialize(function()
{
  this.windowUI = UIHelpers.createWindow(500, 400, "Comms");

  this.topHalf = $("<div class='commSection'></div>");
  this.topHalf.appendTo(this.windowUI.body);

  this.portListTitle = $("<div class='sectionTitle'>Open ports</div>");
  this.portListTitle.appendTo(this.topHalf);

  this.portList = $("<div></div>");
  this.portList.appendTo(this.topHalf);

  this.bottomHalf = $("<div class='commSection'></div>");
  this.bottomHalf.appendTo(this.windowUI.body);

  this.convoListTitle = $("<div class='sectionTitle'>Connected ports</div>");
  this.convoListTitle.appendTo(this.bottomHalf);

  this.convoList = $("<div></div>");
  this.convoList.appendTo(this.bottomHalf);

  var that = this;
  this.listComms = function()
  {
    this.portList.empty();

    TANK.ControlPanel.postLog("<div class='consoleInfo'>Scanning for listening ports...</div>");
    // Add entities in system that are hailable
    for (var i in TANK.Universe.systemEntities)
    {
      var e = TANK.Universe.systemEntities[i];
      if (e.Comms)
      {
        var portUI = $("<div class='listItem'>" + e.Comms.commName + " (" + e.Comms.type + ")</div>");
        portUI.data("comms", e.Comms);
        portUI.appendTo(this.portList);

        portUI.bind("click", function()
        {
          that.openComms($(this).data("comms"));
        });
      }
    }
  };

  this.openComms = function(comms)
  {
    var that = this;
    this.soundCommOpen.play();
    TANK.ControlPanel.postLog("<div class='consoleInfo'>Opening communications to " + comms.commName + "...</div>");
    var connected = comms.connectToPort(this.parent.Comms);
    if (!connected)
    {
      TANK.ControlPanel.postError("Error: Connection refused by remote host");
      return;
    }
    var commUI = $("<div class='commConvo'>" + comms.commName + "</div>");
    commUI.appendTo(this.convoList);

    TANK.ControlPanel.postLog("<div class='consoleInfo'>Connection succeeded</div>");
    TANK.ControlPanel.postLog("<div class='consoleInfo'>Scanning accepted message types...</div>");

    var commOptions = comms.acceptedMessages;
    for (var i = 0; i < commOptions.length; ++i)
    {
      var commString = CommStrings[commOptions[i]].optionText;
      var optionUI = $("<div class='listItem'> - " + commString + "</div>");
      optionUI.appendTo(commUI);
      optionUI.data("optionIndex", i);

      optionUI.bind("click", function()
      {
        that.soundMessageSend.play();
        var message = commOptions[$(this).data("optionIndex")];
        if (message === "exit")
        {
          commUI.remove();
          TANK.ControlPanel.postError("Disconnected by client");
          return;
        }
        var numPlayerTexts = CommStrings[message].playerText.length;
        var playerText = Math.floor(Math.random() * numPlayerTexts);
        TANK.ControlPanel.postLog("<div class='commPlayer'>&lt;You&gt;: " + CommStrings[message].playerText[playerText] + "</div>");
        comms.sendMessage(message, that.parent.Comms);
      });
    }
  };

  this.listComms();
})

.destruct(function()
{
  this.windowUI.main.remove();
});