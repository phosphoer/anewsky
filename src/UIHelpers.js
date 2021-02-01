var UIHelpers = {};

UIHelpers.createWindow = function(width, height, title, pos)
{
  var mainUI = $("<div class='window'></div>");
  mainUI.appendTo($("body"));

  if (!pos)
  {
    mainUI.css("left", "10px");
    mainUI.css("top", "50px");
  }
  else
  {
    mainUI.css("left", pos[0] + "px");
    mainUI.css("top", pos[1] + "px");
  }

  var titleUI = $("<span class='windowTitle'>" + title + "</span>");
  titleUI.appendTo(mainUI);

  var bodyUI = $("<div class='windowBody'></div>");
  bodyUI.appendTo(mainUI);
  bodyUI.css("width", width + "px");
  bodyUI.css("height", height + "px");

  return {main: mainUI, title: titleUI, body: bodyUI};
};

UIHelpers.createContextMenu = function(x, y, options, clickHandler)
{
  $(".contextMenu").remove();

  var mainUI = $("<div class='contextMenu'></div>");
  mainUI.appendTo($("body"));
  mainUI.css("left", x + "px");
  mainUI.css("top", y + "px");

  for (var i = 0; i < options.length; ++i)
  {
    var optionUI = $("<div class='contextOption'>" + options[i] + "</div>");
    optionUI.appendTo(mainUI);
    optionUI.data("optionIndex", i);
    optionUI.bind("click", function()
    {
      clickHandler($(this).text());
      mainUI.remove();
    });
  }

  return mainUI;
};