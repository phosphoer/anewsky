TANK.registerComponent("ReleaseCounter")

.construct(function()
{
  this.releaseDate = new Date(2014, 0, 4, 23, 59, 59, 999);
  this.releaseName = "prototype";
})

.initialize(function()
{
  this.mainUI = $("<div></div>");
  this.mainUI.appendTo($("body"));
  this.mainUI.css("z-index", 10);
  this.mainUI.css("position", "absolute");
  this.mainUI.css("bottom", "5px");
  this.mainUI.css("right", "5px");
  this.mainUI.css("color", "#ddd");
  this.mainUI.css("font-size", "18pt");
  this.mainUI.css("font-family", "sans-serif");

  this.addEventListener("OnEnterFrame", function(dt)
  {
    this.currentDate = new Date();
    var seconds = (this.releaseDate - this.currentDate) / 1000;
    var distString = "";

    var days = Math.floor(seconds / (60 * 60 * 24));
    seconds -= days * 24 * 60 * 60;
    var hours = Math.floor(seconds / (60 * 60));
    seconds -= hours * 60 * 60;
    var minutes = Math.floor(seconds / 60);
    seconds = Math.ceil(seconds - minutes * 60);

    distString += days + " days " + hours + " hours " + minutes + " minutes " + seconds + " seconds until " + this.releaseName;
    this.mainUI.text(distString);
  });

})

.destruct(function()
{
  this.mainUI.remove();
});
