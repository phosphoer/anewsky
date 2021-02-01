function main()
{
  TANK.addComponents("Universe, MainMenu, ShipSpawner, FactionManager, PlayerData, QuestGen, SupplyDemand, InputManager, GameLogic, StarField, DustField, CollisionManager, RenderManager");

  TANK.RenderManager.context = document.getElementById("canvas").getContext("2d");
  TANK.InputManager.context = document.getElementById("stage");

  TANK.start();
}