(function () {
  var bg = document.getElementById('background');
  var cxt = bg.getContext('2d');

  var points = [];

  var start_point = new Date();
  var RandomFunction = function (base, range, phi, cycle) {
    this.base = base;
    this.range = range;
    this.phi = phi;
    this.cycle = cycle * 1000;
  };
  RandomFunction.prototype.calc = function (now) {
    return Math.sin(
      (this.cycle + (now - start_point) * 1.0 / this.cycle) * 2 * Math.PI
    ) * this.range + this.base;
  };

  var Point = function (x, a, b) {
    this.x = x;
    this.a = a;
    this.b = b;
  };

  var initialize = function () {
    var random = Math.random;
    var points_count = ((random() * 2) | 0) + 3;
    for (var i = 0; i < points_count; ++i) {
      if (i === 0) {
        points.push(new Point(
          new RandomFunction(0, 0, 0, 10000000),
          new RandomFunction(
            random() - 0.15,
            random() * 0.3,
            random(),
            random() * 8 + random() * 8 + 3),
          new RandomFunction(
            random() + 0.15,
            random() * 0.3,
            random(),
            random() * 8 + random() * 8 + 3)
        ));
      }
      else if (i == points_count - 1) {
        points.push(new Point(
          new RandomFunction(1, 0, 0, 10000000),
          new RandomFunction(
            random() - 0.15,
            random() * 0.3,
            random(),
            random() * 8 + random() * 8 + 3),
          new RandomFunction(
            random() + 0.15,
            random() * 0.3,
            random(),
            random() * 8 + random() * 8 + 3)
        ));
      }
      else {
        points.push(new Point(
          new RandomFunction(
            random() * 0.3 + 1.0 * i / points_count - 0.15,
            random() * 0.15,
            random(),
            random() * 10 + 3),
          new RandomFunction(
            random() - 0.15,
            random() * 0.3,
            random(),
            random() * 8 + random() * 8 + 3),
          new RandomFunction(
            random() + 0.15,
            random() * 0.3,
            random(),
            random() * 8 + random() * 8 + 3)
        ));
      }
    }
  };
  initialize();
  console.log(points);

  var draw = function () {
    var Position = function (x, y) {
      this.x = x;
      this.y = y;
    };

    var len = points.length;
    var now = new Date();
    for (var i = 1; i < len; ++i) {
      var t;
      var lx = points[i - 1].x.calc(now);
      var la = new Position(lx, points[i - 1].a.calc(now));
      var lb = new Position(lx, points[i - 1].b.calc(now));

      if (la.y > lb.y) {
        t = la.y;
        la.y = lb.y;
        lb.y = t;
      }

      var rx = points[i].x.calc(now);
      var ra = new Position(rx, points[i].a.calc(now));
      var rb = new Position(rx, points[i].b.calc(now));

      if (ra.y > rb.y) {
        t = ra.y;
        ra.y = rb.y;
        rb.y = t;
      }

      var opacity = Math.abs(lb.y - la.y) + Math.abs(rb.y - ra.y);
      opacity = 0.7 - opacity / 5;

      cxt.fillStyle = 'rgba(153, 0, 0, ' + opacity + ')';
      cxt.beginPath();
      cxt.moveTo(la.x * width, la.y * height);
      cxt.lineTo(lb.x * width, lb.y * height);
      cxt.lineTo(rb.x * width, rb.y * height);
      cxt.lineTo(ra.x * width, ra.y * height);
      cxt.fill();
    };
  };

  var width, height;

  window.addEventListener('resize', function () {
    width = window.innerWidth;
    height = window.innerHeight;
    bg.style.width = width + 'px';
    bg.style.height = height + 'px';
    cxt.canvas.width = width;
    cxt.canvas.height = height;

    draw();
  });

  window.dispatchEvent(new Event('resize'));

  var update = function () {
    cxt.clearRect(0, 0, width, height);
    draw();
    requestAnimationFrame(update);
  };
  update();
})();
