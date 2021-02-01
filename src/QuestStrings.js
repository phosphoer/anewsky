var QuestValidators = {};
var QuestAcceptors = {};

QuestValidators.courier = function(quest)
{
  var hasItem = quest.endLocation.entity.CargoBay.hasItem(quest.questData.courierItem);
  if (hasItem)
    quest.endLocation.entity.CargoBay.removeItem(quest.questData.courierItem);

  return hasItem;
};

QuestAcceptors.courier = function(quest)
{
  quest.startLocation.entity.CargoBay.addItem(quest.questData.courierItem);
};

var Quests =
[
  {
    name: "Bowden's Malady",
    desc: "Dear pilot, the people of {endLocation} are suffering from a horrible degenerative disease called Bowden's Malady. A shipment of medical supplies is urgently needed if any of us are to survive. The supplies should be picked up from {startLocation}. We offer you all we can spare as compensation.",
    rewardMoney: 25000,
    validator: "courier",
    acceptor: "courier",
    travelToRadius: [5, 10],
    courierItem: 5
  },
  {
    name: "{endLocation} in Need",
    desc: "A shipment of vaccines is desperately needed at {endLocation} in order to combat a new rapidly spreading virus. Pick up the vaccines at {startLocation}.",
    rewardMoney: 20000,
    validator: "courier",
    acceptor: "courier",
    travelToRadius: [4, 7],
    courierItem: 2
  },
  {
    name: "Our Honeymoon",
    desc: "Hi pilot! My husband and I just got married, and have chosen our honeymoon location on the lovely planet of {endLocation}. We are looking for a ride over there from {startLocation} as soon as possible. Thanks!",
    rewardMoney: 30000,
    validator: "courier",
    acceptor: "courier",
    travelToRadius: [5, 13],
    courierItem: 4
  },
  {
    name: "Business Trip",
    desc: "I need to attend a company meeting on {endLocation}, and my company cannot afford to send me there themselves. I need to be picked up from {startLocation}.",
    rewardMoney: 12000,
    validator: "courier",
    acceptor: "courier",
    travelToRadius: [3, 6],
    courierItem: 3
  },
  {
    name: "Visiting a Friend",
    desc: "Hey pilot! I'm stuck here on {startLocation} and I need to get to {endLocation} to visit my friend. Pick me up!",
    rewardMoney: 10000,
    validator: "courier",
    acceptor: "courier",
    travelToRadius: [3, 5],
    courierItem: 3
  },
];