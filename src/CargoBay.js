TANK.registerComponent("CargoBay")

.construct(function()
{
  this.capacity = 100;
  this.items = [];
})

.initialize(function()
{
  this.addItem = function(itemIndex)
  {
    var itemData = Items[itemIndex];
    if (this.capacity - itemData.volume < 0)
      return false;

    this.capacity -= itemData.volume;

    var item = this.getItem(itemIndex);
    if (item)
    {
      ++item.quantity;
    }
    else
    {
      item = new Item(itemIndex);
      this.items.push(item);
      item.container = this;
    }
    return true;
  };

  this.removeItem = function(itemIndex)
  {
    var item = Items[itemIndex];
    for (var i in this.items)
    {
      if (this.items[i].itemIndex === itemIndex)
      {
        this.capacity += item.volume;

        if (this.items[i].quantity > 1)
          --this.items[i].quantity;
        else
          this.items.splice(i, 1);
        return true;
      }
    }

    return false;
  };

  this.getItem = function(itemIndex)
  {
    for (var i = 0; i < this.items.length; ++i)
    {
      if (this.items[i].itemIndex === itemIndex)
        return this.items[i];
    }

    return false;
  };

  this.hasItem = function(itemIndex)
  {
    for (var i = 0; i < this.items.length; ++i)
    {
      if (this.items[i].itemIndex === itemIndex)
        return true;
    }

    return false;
  };
});