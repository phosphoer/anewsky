Math.pointInAABB = function(point, center, size)
{
  var halfSize = [size[0] / 2, size[1] / 2];
  if (point[0] < center[0] - halfSize[0] || point[1] < center[1] - halfSize[1])
    return false;
  if (point[0] > center[0] + halfSize[0] || point[1] > center[1] + halfSize[1])
    return false;
  return true;
};

Math.pointInOBB = function(point, center, size, angle)
{
  pointRot = [];
  pointRot[0] = (point[0] - center[0]) * Math.cos(-angle) - (point[1] - center[1]) * Math.sin(-angle) + center[0];
  pointRot[1] = (point[0] - center[0]) * Math.sin(-angle) + (point[1] - center[1]) * Math.cos(-angle) + center[1];
  return Math.pointInAABB(pointRot, center, size);
};

Math.lineIntersection = function(line1A, line1B, line2A, line2B)
{
  var r = [line1B[0] - line1A[0], line1B[1] - line1A[1]];
  var rlen = TANK.Math.pointDistancePoint(line1A, line1B);
  r[0] /= rlen;
  r[1] /= rlen;

  var s = [line2B[0] - line2A[0], line2B[1] - line2A[1]];
  var slen = TANK.Math.pointDistancePoint(line2A, line2B);
  s[0] /= slen;
  s[1] /= slen;

  // Solve for
  // line2A + s * u = line1A + r * t;
  // t = (line1A - line2A) x s / (r x s);
  // u = (line1A - line2A) x r / (r x s);
  var vec = [line2A[0] - line1A[0], line2A[1] - line1A[1]];
  var t = (vec[0] * s[1] - vec[1] * s[0]) / (r[0] * s[1] - r[1] * s[0]);
  var u = (vec[0] * r[1] - vec[1] * r[0]) / (r[0] * s[1] - r[1] * s[0]);

  if (t >= 0 && t <= rlen && u >= 0 && u <= slen)
    return [line1A[0] + r[0] * t, line1A[1] + r[1] * t];

  return null;
};