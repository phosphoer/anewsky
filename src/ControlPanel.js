TANK.registerComponent("ControlPanel")

.construct(function()
{
})

.initialize(function()
{
  this.mainUI = $("<div class='console'></div>");
  this.mainUI.appendTo($("body"));

  this.logUI = $("<div class='consoleLog'></div>");
  this.logUI.appendTo(this.mainUI);

  this.commandBuffer = $("<div class='consoleBuffer'></div>");
  this.commandBuffer.appendTo(this.logUI);

  this.postLog = function(message)
  {
    var log = $("<div>" + message + "</div>");
    log.appendTo(this.commandBuffer);
    this.logUI.animate({ scrollTop: this.logUI[0].scrollHeight}, 200);
  };

  this.postInfo = function(message)
  {
    message = "<span class='consoleInfo'>" + message + "</span>";
    var log = $("<div>" + message + "</div>");
    log.appendTo(this.commandBuffer);
    this.logUI.animate({ scrollTop: this.logUI[0].scrollHeight}, 200);
  };

  this.postSuccess = function(message)
  {
    message = "<span class='consoleOk'>" + message + "</span>";
    var log = $("<div>" + message + "</div>");
    log.appendTo(this.commandBuffer);
    this.logUI.animate({ scrollTop: this.logUI[0].scrollHeight}, 200);
  };

  this.postError = function(message)
  {
    message = "<span class='consoleError'>" + message + "</span>";
    var log = $("<div>" + message + "</div>");
    log.appendTo(this.commandBuffer);
    this.logUI.animate({ scrollTop: this.logUI[0].scrollHeight}, 200);
  };
})

.destruct(function()
{
  this.mainUI.remove();
});
