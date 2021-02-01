var SlotItems = {};

SlotItems.ProjectileGun = function(parent, itemIndex)
{
  this.parent = parent;
  this.itemIndex = itemIndex;
  this.item = Items[itemIndex];
  this.loop = false;
  this.cooldown = 0;
  this.rotation = 0;

  this.soundFire = new Audio("res/Sounds/shoot-09.wav");
  this.soundFire.volume = 0.2;
  this.soundHit = new Audio("res/Sounds/hit-04.wav");
  this.soundHit.volume = 0.2;

  this.activate = function()
  {
    this.soundFire.play();
    var e = TANK.createEntity("Projectile, GlowParticle, Collider");
    e.Pos2D.x = parent.parent.Ship.imageCanvas.width * 3 / -2 + this.part.x * 3;
    e.Pos2D.y = parent.parent.Ship.imageCanvas.height * 3 / -2 + this.part.y * 3;
    e.Pos2D.rotation = this.rotation;
    e.Pos2D.toWorldSpace(parent.parent.Pos2D);
    e.Collider.ignored[parent.parent.id] = true;
    e.Collider.collisionLayer = "Weapons";
    e.Collider.collidesWith = ["Ships"];
    e.Projectile.speed = this.item.projectileSpeed;
    e.Projectile.life = this.item.projectileRange / this.item.projectileSpeed;
    e.Projectile.owner = this.parent.parent;
    e.Velocity.x += this.parent.parent.Velocity.x;
    e.Velocity.y += this.parent.parent.Velocity.y;
    TANK.addEntity(e);

    var that = this;
    e.Projectile.OnCollide = function(other)
    {
      other.invoke("OnAttacked", e.Projectile.owner);
      that.soundHit.play();

      if (other.Ship)
      {
        other.Ship.takeDamage(e.Pos2D.x, e.Pos2D.y, that.item.damage);
      }
      TANK.removeEntity(e);
    };
  };
};

