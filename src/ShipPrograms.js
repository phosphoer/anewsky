var ShipPrograms = {};

//
// System program
//
ShipPrograms.sys = function(controlPanel)
{
  this.desc = "Manipulate systems on the ship, such as the engines";

  this.run = function(args)
  {
    // Display info if no arguments
    if (args.length === 1)
    {
      controlPanel.postLog("Usage: sys [command] [args]");
      controlPanel.postLog("Commands: ");
      controlPanel.postLog("<span class='consoleCommand'>list</span> - <span class='consoleInfo'>List each system and its status</span>");
      controlPanel.postLog("<span class='consoleCommand'>enable</span> [system] - <span class='consoleInfo'>Enable the system named </span>[system]");
      controlPanel.postLog("<span class='consoleCommand'>disable</span> [system] - <span class='consoleInfo'>Disable the system named </span>[system]");
      return;
    }

    if (args[1] === "list")
    {
      controlPanel.postLog("Listing systems...");
      for (var i in controlPanel.parent._components)
      {
        var c = controlPanel.parent._components[i];
        if (c.isSystem)
        {
          var status = "<span class='consoleInfo'> - ";
          if (c.systemEnabled)
          {
            if (c.systemPowered)
              status += "<span class='consoleOk'>Has Power</span> - ";
            else
              status += "<span class='consoleNotOk'>Not enough power</span> - ";
            status += "<span class='consoleOk'>Enabled</span>";
          }
          else
            status += "<span class='consoleNotOk'>Disabled</span>";
          status += "</span>";
          controlPanel.postLog(i + status);
        }
      }
      return;
    }

    if (args[1] === "disable")
    {
      if (!args[2])
      {
        controlPanel.postError("Error: Please specify a system to disable");
        return;
      }

      if (args[2] == "all")
      {
        for (var i in controlPanel.parent._components)
        {
          var c = controlPanel.parent._components[i];
          if (c.isSystem)
            controlPanel.evaluateInput("sys disable " + i);
        }
        return;
      }

      var module = controlPanel.parent._components[args[2]];
      if (module && module.isSystem)
      {
        module.systemEnabled = false;
        controlPanel.postLog(args[2] + " disabled");
      }
    }

    if (args[1] === "enable")
    {
      if (!args[2])
      {
        controlPanel.postError("Error: Please specify a module to enable");
        return;
      }

      if (args[2] == "all")
      {
        for (var i in controlPanel.parent._components)
        {
          var c = controlPanel.parent._components[i];
          if (c.isSystem)
            controlPanel.evaluateInput("sys enable " + i);
        }
        return;
      }

      var module = this.parent._components[args[2]];
      if (module && module.isSystem)
      {
        module.systemEnabled = true;
        controlPanel.postLog(args[2] + " enabled");
      }
    }
  };
};
