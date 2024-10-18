(function (d, e, c, i, b, el, it) {
  d.da = d.da || [];
  var da = {};
  da.oldErr = d.onerror;
  da.err = [];
  d.onerror = function () {
    da.err.push(arguments);
    da.oldErr && da.oldErr.apply(d, Array.prototype.slice.call(arguments));
  };
  d.DecibelInsight = b;
  d[b] =
    d[b] ||
    function () {
      (d[b].q = d[b].q || []).push(arguments);
    };
  (el = e.createElement(c)), (it = e.getElementsByTagName(c)[0]);
  el.async = 1;
  el.src = i;
  it.parentNode.insertBefore(el, it);
})(
  window,
  document,
  "script",
  "https://cdn.decibelinsight.net/i/13879/1645248/di.js",
  "decibelInsight",
);
