/* ============================================================
   全站章节/练习索引 —— 首页仪表盘与练习中心统计用
   ============================================================ */
(function (global) {
  "use strict";

  var chapters = [];
  var practices = [];

  function regCh() { for (var i = 0; i < arguments.length; i++) chapters.push(arguments[i]); }
  function regP() { for (var i = 0; i < arguments.length; i++) practices.push(arguments[i]); }

  /* C 语言 */
  regCh("c-setup", "c-basic", "c-flow", "c-func", "c-array", "c-string",
        "c-pointer-basic", "c-pointer-adv", "c-mem", "c-struct", "c-file",
        "c-preproc", "c-debug", "c-advanced", "c-standard");
  regP("c-p1", "c-p2", "c-p3", "c-p4", "c-p5", "c-p6", "c-p7", "c-p8",
        "c-p9", "c-p10", "c-p11", "c-p12", "c-p13", "c-p14", "c-p15");

  /* C++ */
  regCh("cpp-why", "cpp-namespace-ref", "cpp-bool-ref", "cpp-default-args",
        "cpp-overload", "cpp-reference", "cpp-newdelete", "cpp-string",
        "cpp-vector", "cpp-class", "cpp-raii", "cpp-smartptr",
        "cpp-template", "cpp-lambda", "cpp-stl-algo", "cpp-modern", "cpp-threads");
  regP("cpp-p1", "cpp-p2", "cpp-p3", "cpp-p4", "cpp-p5", "cpp-p6", "cpp-p7",
        "cpp-p8", "cpp-p9", "cpp-p10", "cpp-p11", "cpp-p12", "cpp-p13", "cpp-p14");

  /* Python */
  regCh("py-why", "py-env", "py-basic", "py-list", "py-str",
        "py-dict", "py-control", "py-func", "py-file", "py-class",
        "py-numpy", "py-comprehension", "py-error", "py-modules", "py-advanced");
  regP("py-p1", "py-p2", "py-p3", "py-p4", "py-p5", "py-p6", "py-p7",
        "py-p8", "py-p9", "py-p10", "py-p11", "py-p12", "py-p13");

  /* ROS 2 */
  regCh("ros2-why", "ros2-setup", "ros2-concepts", "ros2-first-node",
        "ros2-topic", "ros2-msg", "ros2-service", "ros2-param",
        "ros2-launch", "ros2-tf", "ros2-bag", "ros2-custom-msg", "ros2-cv-bridge", "ros2-realtime");
  regP("ros-p1", "ros-p2", "ros-p3", "ros-p4", "ros-p5", "ros-p6",
        "ros-p7", "ros-p8", "ros-p9", "ros-p10", "ros-p11", "ros-p12");

  /* RM 电控 */
  regCh("rme-overview", "rme-dev", "rme-env", "rme-arch", "rme-task",
        "rme-can", "rme-dji-motor", "rme-pid", "rme-imu", "rme-rc",
        "rme-referee", "rme-shoot", "rme-safety", "rme-debug", "rme-competition");
  regP("rme-p1", "rme-p2", "rme-p3", "rme-p4", "rme-p5", "rme-p6",
        "rme-p7", "rme-p8", "rme-p9", "rme-p10", "rme-p11", "rme-p12");

  /* RM 视觉 */
  regCh("rmv-overview", "rmv-pipeline", "rmv-camera", "rmv-color",
        "rmv-contour", "rmv-fit", "rmv-pnp", "rmv-coord", "rmv-tracker",
        "rmv-rune", "rmv-energy", "rmv-armor-ekf", "rmv-antitop", "rmv-deploy", "rmv-tuning");
  regP("rmv-p1", "rmv-p2", "rmv-p3", "rmv-p4", "rmv-p5", "rmv-p6",
        "rmv-p7", "rmv-p8", "rmv-p9", "rmv-p10", "rmv-p11", "rmv-p12");


  /* OpenCV 专题 */
  regCh("cv-pixel", "cv-roi", "cv-color", "cv-thresh", "cv-morph",
        "cv-contour", "cv-geo", "cv-feature", "cv-video", "cv-calib",
        "cv-track", "cv-pipeline", "cv-armor");
  regP("cvp-p1", "cvp-p2", "cvp-p3", "cvp-p4", "cvp-p5", "cvp-p6",
       "cvp-p7", "cvp-p8", "cvp-p9", "cvp-p10");

  /* YOLO 深度学习 */
  regCh("dlv-why", "dlv-nn", "dlv-yolo", "dlv-data", "dlv-train",
        "dlv-onnx", "dlv-trt", "dlv-track", "dlv-rune", "dlv-deploy",
        "dlv-adv", "dlv-opt", "dlv-sys");
  regP("dlv-p1", "dlv-p2", "dlv-p3", "dlv-p4", "dlv-p5", "dlv-p6",
       "dlv-p7", "dlv-p8", "dlv-p9", "dlv-p10");

  /* 控制进阶 */
  regCh("cva-why", "cva-tf", "cva-ff", "cva-cascade", "cva-lqr",
        "cva-imu", "cva-ballistic", "cva-protect", "cva-tuning", "cva-summary",
        "cva-extra1", "cva-extra2");
  regP("cva-p1", "cva-p2", "cva-p3", "cva-p4", "cva-p5", "cva-p6",
       "cva-p7", "cva-p8", "cva-p9", "cva-p10");

  /* Linux */
  regCh("lx-why", "lx-setup", "lx-cmd", "lx-file", "lx-perm", "lx-text", "lx-pipe", "lx-proc", "lx-shell", "lx-env", "lx-git", "lx-cmake", "lx-debug", "lx-net", "lx-cross");
  regP("lx-a01", "lx-a02", "lx-a03", "lx-a04", "lx-a05", "lx-a06", "lx-a07", "lx-a08", "lx-a09", "lx-a10",
       "lx-a11", "lx-a12", "lx-a13", "lx-a14", "lx-a15", "lx-a16", "lx-a17", "lx-a18", "lx-a19", "lx-a20",
       "lx-a21", "lx-a22", "lx-a23", "lx-a24", "lx-a25", "lx-a26", "lx-a27", "lx-a28", "lx-a29", "lx-a30",
       "lx-a31", "lx-a32", "lx-a33", "lx-a34", "lx-a35", "lx-a36", "lx-a37", "lx-a38", "lx-a39", "lx-a40",
       "lx-b01", "lx-b02", "lx-b03", "lx-b04", "lx-b05", "lx-b06", "lx-b07", "lx-b08", "lx-b09", "lx-b10",
       "lx-b11", "lx-b12", "lx-b13", "lx-b14", "lx-b15", "lx-b16", "lx-b17", "lx-b18", "lx-b19", "lx-b20",
       "lx-b21", "lx-b22", "lx-b23", "lx-b24", "lx-b25", "lx-b26", "lx-b27", "lx-b28", "lx-b29", "lx-b30",
       "lx-b31", "lx-b32", "lx-b33", "lx-b34", "lx-b35", "lx-b36", "lx-b37", "lx-b38", "lx-b39", "lx-b40",
       "lx-c01", "lx-c02", "lx-c03", "lx-c04", "lx-c05", "lx-c06", "lx-c07", "lx-c08", "lx-c09", "lx-c10",
       "lx-c11", "lx-c12", "lx-c13", "lx-c14", "lx-c15", "lx-c16", "lx-c17", "lx-c18", "lx-c19", "lx-c20",
       "lx-c21", "lx-c22", "lx-c23", "lx-c24", "lx-c25", "lx-c26", "lx-c27", "lx-c28", "lx-c29", "lx-c30",
       "lx-c31", "lx-c32", "lx-c33", "lx-c34", "lx-c35", "lx-c36", "lx-c37", "lx-c38", "lx-c39", "lx-c40");

  global.SITE_INDEX = { chapters: chapters, practices: practices };

  global.refreshGlobalStats = function () {
    var s = RMStore.stats();
    var el1 = document.getElementById("stat-chapters");
    var el2 = document.getElementById("stat-practices");
    if (el1) el1.textContent = s.chDone + "/" + s.chTotal;
    if (el2) el2.textContent = s.pDone + "/" + s.pTotal;
    var pb = document.getElementById("global-progress");
    if (pb) {
      var pct = s.chTotal ? Math.round((s.chDone / s.chTotal) * 100) : 0;
      pb.style.width = pct + "%";
      var pl = document.getElementById("global-progress-label");
      if (pl) pl.textContent = "总进度：" + s.chDone + " / " + s.chTotal + " 章（" + pct + "%）· 已练会 " + s.pDone + " / " + s.pTotal + " 题";
    }
  };
  regCh("oss-vis-aim", "oss-vis-radar", "oss-vis-nav", "oss-emb-frame", "oss-emb-chassis", "oss-res-aw", "oss-route-1");
})(window);
