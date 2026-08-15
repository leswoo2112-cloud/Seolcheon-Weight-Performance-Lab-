/* =========================================================
   설천고 WEIGHT PERFORMANCE LAB
   ANALYSIS.JS
   PART 4 / 6

   MOTION ANALYSIS ENGINE

   - MediaPipe Pose 33 landmarks
   - Camera
   - Front / Side / Rear / Top setup
   - Uploaded video
   - Uploaded image
   - 2D skeleton
   - AI estimated 3D skeleton
   - Joint angles
   - Symmetry
   - Stability
   - ROM
   - Technique score
   - Repetition estimation
   - Slow motion
   - Frame stepping
   - Reference lines
   - Motion trajectory
   - Angle graph
   - Training recommendations
========================================================= */

"use strict";


/* =========================================================
   01. DOM
========================================================= */

const ANALYSIS_DOM = {

  athlete:
    document.getElementById("analysisAthlete"),

  exercise:
    document.getElementById("analysisExercise"),

  targetReps:
    document.getElementById("analysisTargetReps"),

  connectCamera:
    document.getElementById("connectCameraBtn"),

  switchCamera:
    document.getElementById("switchCameraBtn"),

  videoUpload:
    document.getElementById("analysisVideoUpload"),

  imageUpload:
    document.getElementById("analysisImageUpload"),

  start:
    document.getElementById("startAnalysisBtn"),

  stop:
    document.getElementById("stopAnalysisBtn"),

  cameraVideo:
    document.getElementById("cameraVideo"),

  uploadedVideo:
    document.getElementById("uploadedVideo"),

  uploadedImage:
    document.getElementById("uploadedImage"),

  poseCanvas:
    document.getElementById("poseCanvas"),

  pathCanvas:
    document.getElementById("barPathCanvas"),

  placeholder:
    document.getElementById("viewerPlaceholder"),

  status:
    document.getElementById("analysisEngineStatus"),

  liveBadge:
    document.getElementById("liveStatusBadge"),

  title:
    document.getElementById("motionAnalysisTitle"),

  currentRep:
    document.getElementById("currentRepCount"),

  targetRep:
    document.getElementById("targetRepCount"),

  score:
    document.getElementById("currentPoseScore"),

  timer:
    document.getElementById("analysisTimer"),

  tempo:
    document.getElementById("analysisTempo"),

  knee:
    document.getElementById("kneeAngle"),

  hip:
    document.getElementById("hipAngle"),

  trunk:
    document.getElementById("trunkAngle"),

  ankle:
    document.getElementById("ankleAngle"),

  liveKnee:
    document.getElementById("liveKnee"),

  liveHip:
    document.getElementById("liveHip"),

  liveTrunk:
    document.getElementById("liveTrunk"),

  liveAnkle:
    document.getElementById("liveAnkle"),

  symmetry:
    document.getElementById("liveSymmetry"),

  rom:
    document.getElementById("liveROM"),

  stability:
    document.getElementById("liveStability"),

  technique:
    document.getElementById("liveTechnique"),

  kneeRange:
    document.getElementById("kneeRange"),

  hipRange:
    document.getElementById("hipRange"),

  trunkRange:
    document.getElementById("trunkRange"),

  ankleRange:
    document.getElementById("ankleRange"),

  checkpointList:
    document.getElementById("checkpointList"),

  recommendations:
    document.getElementById("trainingRecommendations"),

  frameBack:
    document.getElementById("frameBackBtn"),

  frameForward:
    document.getElementById("frameForwardBtn"),

  playPause:
    document.getElementById("playPauseBtn"),

  playbackSpeed:
    document.getElementById("playbackSpeed"),

  toggleSkeleton:
    document.getElementById("toggleSkeletonBtn"),

  toggleReference:
    document.getElementById("toggleReferenceBtn"),

  togglePath:
    document.getElementById("toggleBarPathBtn"),

  referenceVertical:
    document.getElementById("referenceVertical"),

  referenceHorizontal:
    document.getElementById("referenceHorizontal"),

  angleChart:
    document.getElementById("angleChart")

};


/* =========================================================
   02. ENGINE STATE
========================================================= */

const MOTION_STATE = {

  pose: null,

  stream: null,

  cameraFacing:
    "environment",

  source:
    null,

  running:
    false,

  skeleton:
    true,

  reference:
    true,

  path:
    true,

  mode:
    "2d",

  view:
    "front",

  latestLandmarks:
    null,

  latestWorldLandmarks:
    null,

  frameBusy:
    false,

  animationId:
    null,

  startTime:
    null,

  timerInterval:
    null,

  repCount:
    0,

  repPhase:
    "up",

  lastRepTime:
    null,

  repTimes:
    [],

  angleHistory: {
    knee: [],
    hip: [],
    trunk: [],
    ankle: []
  },

  hipHistory:
    [],

  trajectory:
    [],

  maxHistory:
    120,

  selectedExercise:
    null,

  latestMetrics:
    null

};


/* =========================================================
   03. CANVAS
========================================================= */

const poseCtx =
  ANALYSIS_DOM.poseCanvas
    ?.getContext("2d");

const pathCtx =
  ANALYSIS_DOM.pathCanvas
    ?.getContext("2d");


function resizeAnalysisCanvas() {

  const viewer =
    document.querySelector(
      ".motion-viewer"
    );

  if (!viewer) return;

  const width =
    Math.max(
      1,
      viewer.clientWidth
    );

  const height =
    Math.max(
      1,
      viewer.clientHeight
    );


  if (
    ANALYSIS_DOM.poseCanvas.width !== width ||
    ANALYSIS_DOM.poseCanvas.height !== height
  ) {

    ANALYSIS_DOM.poseCanvas.width =
      width;

    ANALYSIS_DOM.poseCanvas.height =
      height;

  }


  if (
    ANALYSIS_DOM.pathCanvas.width !== width ||
    ANALYSIS_DOM.pathCanvas.height !== height
  ) {

    ANALYSIS_DOM.pathCanvas.width =
      width;

    ANALYSIS_DOM.pathCanvas.height =
      height;

  }

}


window.addEventListener(
  "resize",
  resizeAnalysisCanvas
);


/* =========================================================
   04. BASIC UTILITIES
========================================================= */

function clamp(
  value,
  min,
  max
) {

  return Math.max(
    min,
    Math.min(max, value)
  );

}


function average(values) {

  const valid =
    values.filter(
      Number.isFinite
    );

  if (!valid.length) {
    return 0;
  }

  return (
    valid.reduce(
      (sum, value) =>
        sum + value,
      0
    ) / valid.length
  );

}


function distance2D(a, b) {

  if (!a || !b) {
    return 0;
  }

  return Math.hypot(
    a.x - b.x,
    a.y - b.y
  );

}


function calculateAngle(
  a,
  b,
  c
) {

  if (!a || !b || !c) {
    return null;
  }

  const radians =

    Math.atan2(
      c.y - b.y,
      c.x - b.x
    )

    -

    Math.atan2(
      a.y - b.y,
      a.x - b.x
    );


  let angle =
    Math.abs(
      radians *
      180 /
      Math.PI
    );


  if (angle > 180) {
    angle =
      360 - angle;
  }


  return angle;

}


function visibleLandmark(
  landmark,
  threshold = 0.35
) {

  if (!landmark) {
    return false;
  }

  if (
    landmark.visibility === undefined
  ) {
    return true;
  }

  return (
    landmark.visibility >=
    threshold
  );

}


function formatAngle(value) {

  if (!Number.isFinite(value)) {
    return "-°";
  }

  return (
    Math.round(value) +
    "°"
  );

}


/* =========================================================
   05. MEDIAPIPE INITIALIZATION
========================================================= */

function initializePoseEngine() {

  if (
    typeof Pose ===
    "undefined"
  ) {

    setEngineStatus(
      "POSE LOAD ERROR"
    );

    console.error(
      "MediaPipe Pose가 로드되지 않았습니다."
    );

    return false;

  }


  try {

    MOTION_STATE.pose =
      new Pose({

        locateFile:
          file =>
            `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`

      });


    MOTION_STATE.pose.setOptions({

      modelComplexity:
        1,

      smoothLandmarks:
        true,

      enableSegmentation:
        false,

      smoothSegmentation:
        false,

      minDetectionConfidence:
        0.55,

      minTrackingConfidence:
        0.55

    });


    MOTION_STATE.pose.onResults(
      handlePoseResults
    );


    setEngineStatus(
      "33 LANDMARK READY"
    );


    return true;

  }

  catch (error) {

    console.error(
      error
    );

    setEngineStatus(
      "ENGINE ERROR"
    );

    return false;

  }

}


/* =========================================================
   06. STATUS
========================================================= */

function setEngineStatus(text) {

  if (ANALYSIS_DOM.status) {
    ANALYSIS_DOM.status.textContent =
      text;
  }

}


function setLiveStatus(
  active,
  text
) {

  if (!ANALYSIS_DOM.liveBadge) {
    return;
  }


  ANALYSIS_DOM.liveBadge.textContent =
    active
      ? `● ${text || "LIVE"}`
      : `● ${text || "STANDBY"}`;


  ANALYSIS_DOM.liveBadge
    .classList
    .toggle(
      "standby",
      !active
    );

}


/* =========================================================
   07. SOURCE VISIBILITY
========================================================= */

function hideAllSources() {

  if (ANALYSIS_DOM.cameraVideo) {

    ANALYSIS_DOM.cameraVideo.style.display =
      "none";

  }


  if (ANALYSIS_DOM.uploadedVideo) {

    ANALYSIS_DOM.uploadedVideo.hidden =
      true;

    ANALYSIS_DOM.uploadedVideo.style.display =
      "none";

  }


  if (ANALYSIS_DOM.uploadedImage) {

    ANALYSIS_DOM.uploadedImage.hidden =
      true;

    ANALYSIS_DOM.uploadedImage.style.display =
      "none";

  }

}


function showSource(type) {

  hideAllSources();


  if (type === "camera") {

    ANALYSIS_DOM.cameraVideo.style.display =
      "block";

  }


  if (type === "video") {

    ANALYSIS_DOM.uploadedVideo.hidden =
      false;

    ANALYSIS_DOM.uploadedVideo.style.display =
      "block";

  }


  if (type === "image") {

    ANALYSIS_DOM.uploadedImage.hidden =
      false;

    ANALYSIS_DOM.uploadedImage.style.display =
      "block";

  }


  if (ANALYSIS_DOM.placeholder) {

    ANALYSIS_DOM.placeholder.style.display =
      "none";

  }


  MOTION_STATE.source =
    type;


  resizeAnalysisCanvas();

}


/* =========================================================
   08. CAMERA
========================================================= */

async function connectAnalysisCamera() {

  stopCurrentCamera();


  try {

    setEngineStatus(
      "CAMERA CONNECTING..."
    );


    const constraints = {

      audio:
        false,

      video: {

        facingMode: {
          ideal:
            MOTION_STATE.cameraFacing
        },

        width: {
          ideal:
            1280
        },

        height: {
          ideal:
            720
        }

      }

    };


    const stream =
      await navigator.mediaDevices
        .getUserMedia(
          constraints
        );


    MOTION_STATE.stream =
      stream;


    ANALYSIS_DOM.cameraVideo.srcObject =
      stream;


    await ANALYSIS_DOM.cameraVideo.play();


    showSource(
      "camera"
    );


    setEngineStatus(
      "CAMERA READY"
    );


    setLiveStatus(
      false,
      "CAMERA READY"
    );


    toastAnalysis(
      "카메라가 연결되었습니다."
    );

  }

  catch (error) {

    console.error(
      error
    );


    setEngineStatus(
      "CAMERA ERROR"
    );


    toastAnalysis(
      "카메라를 사용할 수 없습니다. 브라우저의 카메라 권한과 HTTPS 연결을 확인하세요."
    );

  }

}


function stopCurrentCamera() {

  if (
    MOTION_STATE.stream
  ) {

    MOTION_STATE.stream
      .getTracks()
      .forEach(
        track =>
          track.stop()
      );

    MOTION_STATE.stream =
      null;

  }


  if (
    ANALYSIS_DOM.cameraVideo
  ) {

    ANALYSIS_DOM.cameraVideo.srcObject =
      null;

  }

}


async function switchAnalysisCamera() {

  MOTION_STATE.cameraFacing =

    MOTION_STATE.cameraFacing ===
    "environment"

      ? "user"

      : "environment";


  await connectAnalysisCamera();

}


/* =========================================================
   09. FILE VIDEO
========================================================= */

function handleVideoUpload(event) {

  const file =
    event.target.files?.[0];


  if (!file) {
    return;
  }


  stopCurrentCamera();


  const url =
    URL.createObjectURL(
      file
    );


  ANALYSIS_DOM.uploadedVideo.src =
    url;


  showSource(
    "video"
  );


  ANALYSIS_DOM.uploadedVideo
    .addEventListener(
      "loadedmetadata",
      () => {

        ANALYSIS_DOM.uploadedVideo.playbackRate =
          Number(
            ANALYSIS_DOM.playbackSpeed.value
          ) || 1;

        resizeAnalysisCanvas();

      },
      {
        once:
          true
      }
    );


  setEngineStatus(
    "VIDEO READY"
  );


  toastAnalysis(
    "분석 영상이 준비되었습니다."
  );

}


/* =========================================================
   10. IMAGE
========================================================= */

function handleImageUpload(event) {

  const file =
    event.target.files?.[0];


  if (!file) {
    return;
  }


  stopCurrentCamera();


  const url =
    URL.createObjectURL(
      file
    );


  ANALYSIS_DOM.uploadedImage.src =
    url;


  ANALYSIS_DOM.uploadedImage.onload =
    async () => {

      showSource(
        "image"
      );


      resizeAnalysisCanvas();


      await processPoseFrame(
        ANALYSIS_DOM.uploadedImage
      );


      setEngineStatus(
        "IMAGE ANALYZED"
      );


      setLiveStatus(
        false,
        "IMAGE"
      );

    };

}


/* =========================================================
   11. START ANALYSIS
========================================================= */

async function startMotionAnalysis() {

  if (
    !MOTION_STATE.pose
  ) {

    const ready =
      initializePoseEngine();


    if (!ready) {
      return;
    }

  }


  if (
    !MOTION_STATE.source
  ) {

    toastAnalysis(
      "먼저 카메라를 연결하거나 영상/사진을 업로드하세요."
    );

    return;

  }


  MOTION_STATE.running =
    true;

  MOTION_STATE.repCount =
    0;

  MOTION_STATE.repPhase =
    "up";

  MOTION_STATE.repTimes =
    [];

  MOTION_STATE.lastRepTime =
    null;

  MOTION_STATE.angleHistory = {
    knee: [],
    hip: [],
    trunk: [],
    ankle: []
  };

  MOTION_STATE.hipHistory =
    [];

  MOTION_STATE.trajectory =
    [];


  ANALYSIS_DOM.currentRep.textContent =
    "0";


  MOTION_STATE.startTime =
    Date.now();


  startAnalysisTimer();


  setLiveStatus(
    true,
    "MOTION CAPTURE"
  );


  setEngineStatus(
    "ANALYZING 33 LANDMARKS"
  );


  if (
    MOTION_STATE.source ===
    "camera"
  ) {

    analysisLoop(
      ANALYSIS_DOM.cameraVideo
    );

  }


  if (
    MOTION_STATE.source ===
    "video"
  ) {

    try {

      await ANALYSIS_DOM.uploadedVideo.play();

    }

    catch (_) {}


    analysisLoop(
      ANALYSIS_DOM.uploadedVideo
    );

  }


  if (
    MOTION_STATE.source ===
    "image"
  ) {

    await processPoseFrame(
      ANALYSIS_DOM.uploadedImage
    );

  }

}


/* =========================================================
   12. ANALYSIS LOOP
========================================================= */

async function analysisLoop(sourceElement) {

  if (
    !MOTION_STATE.running
  ) {
    return;
  }


  if (
    !MOTION_STATE.frameBusy
  ) {

    MOTION_STATE.frameBusy =
      true;


    try {

      await processPoseFrame(
        sourceElement
      );

    }

    catch (error) {

      console.error(
        "Pose frame error:",
        error
      );

    }

    finally {

      MOTION_STATE.frameBusy =
        false;

    }

  }


  MOTION_STATE.animationId =
    requestAnimationFrame(
      () =>
        analysisLoop(
          sourceElement
        )
    );

}


/* =========================================================
   13. SEND FRAME
========================================================= */

async function processPoseFrame(
  source
) {

  if (
    !source ||
    !MOTION_STATE.pose
  ) {
    return;
  }


  await MOTION_STATE.pose.send({
    image:
      source
  });

}


/* =========================================================
   14. POSE RESULT
========================================================= */

function handlePoseResults(results) {

  resizeAnalysisCanvas();


  const landmarks =
    results.poseLandmarks;


  const worldLandmarks =
    results.poseWorldLandmarks;


  clearPoseCanvas();


  if (
    !landmarks ||
    landmarks.length !== 33
  ) {

    setEngineStatus(
      "SEARCHING PERSON..."
    );

    return;

  }


  MOTION_STATE.latestLandmarks =
    landmarks;

  MOTION_STATE.latestWorldLandmarks =
    worldLandmarks || null;


  setEngineStatus(
    MOTION_STATE.mode === "3d"
      ? "33 LANDMARK · AI 3D"
      : "33 LANDMARK · 2D"
  );


  if (
    MOTION_STATE.skeleton
  ) {

    drawPoseSkeleton(
      landmarks
    );

  }


  const metrics =
    calculateBiomechanics(
      landmarks
    );


  MOTION_STATE.latestMetrics =
    metrics;


  updateLiveMetrics(
    metrics
  );


  updateHistory(
    metrics
  );


  updateRepCounter(
    metrics
  );


  updatePoseScore(
    metrics
  );


  updateMotionTrajectory(
    landmarks
  );


  drawMotionTrajectory();


  updateAngleChart();


  if (
    MOTION_STATE.mode ===
    "3d"
  ) {

    draw3DDepthEffect(
      worldLandmarks ||
      landmarks
    );

  }

}


/* =========================================================
   15. CLEAR CANVAS
========================================================= */

function clearPoseCanvas() {

  if (!poseCtx) {
    return;
  }

  poseCtx.clearRect(
    0,
    0,
    ANALYSIS_DOM.poseCanvas.width,
    ANALYSIS_DOM.poseCanvas.height
  );

}


/* =========================================================
   16. DRAW 33 LANDMARK SKELETON
========================================================= */

function drawPoseSkeleton(
  landmarks
) {

  if (!poseCtx) {
    return;
  }


  const width =
    ANALYSIS_DOM.poseCanvas.width;

  const height =
    ANALYSIS_DOM.poseCanvas.height;


  poseCtx.save();


  poseCtx.lineWidth =
    4;

  poseCtx.lineCap =
    "round";

  poseCtx.lineJoin =
    "round";


  /*
     CONNECTIONS
  */

  POSE_CONNECTIONS_CUSTOM
    .forEach(
      ([startIndex, endIndex]) => {

        const start =
          landmarks[startIndex];

        const end =
          landmarks[endIndex];


        if (
          !visibleLandmark(start) ||
          !visibleLandmark(end)
        ) {
          return;
        }


        poseCtx.beginPath();

        poseCtx.moveTo(
          start.x * width,
          start.y * height
        );

        poseCtx.lineTo(
          end.x * width,
          end.y * height
        );


        poseCtx.strokeStyle =
          "rgba(35, 199, 217, 0.95)";


        poseCtx.stroke();

      }
    );


  /*
     33 LANDMARK POINTS
  */

  landmarks.forEach(
    (point, index) => {

      if (
        !visibleLandmark(
          point,
          0.25
        )
      ) {
        return;
      }


      const x =
        point.x * width;

      const y =
        point.y * height;


      const majorJoint =
        [
          11, 12,
          13, 14,
          15, 16,
          23, 24,
          25, 26,
          27, 28,
          29, 30,
          31, 32
        ].includes(index);


      poseCtx.beginPath();

      poseCtx.arc(
        x,
        y,
        majorJoint
          ? 6
          : 3.5,
        0,
        Math.PI * 2
      );


      poseCtx.fillStyle =
        majorJoint
          ? "#31e6bb"
          : "#ffffff";


      poseCtx.fill();


      if (majorJoint) {

        poseCtx.beginPath();

        poseCtx.arc(
          x,
          y,
          9,
          0,
          Math.PI * 2
        );

        poseCtx.strokeStyle =
          "rgba(49,230,187,.35)";

        poseCtx.lineWidth =
          2;

        poseCtx.stroke();

      }

    }
  );


  drawJointAngleLabels(
    landmarks
  );


  poseCtx.restore();

}


/* =========================================================
   17. JOINT ANGLE LABELS
========================================================= */

function drawJointAngleLabels(
  landmarks
) {

  const settings =
    document.getElementById(
      "settingAngles"
    );


  if (
    settings &&
    !settings.checked
  ) {
    return;
  }


  const width =
    ANALYSIS_DOM.poseCanvas.width;

  const height =
    ANALYSIS_DOM.poseCanvas.height;


  const labels = [

    {
      index: 25,
      label: "LK",
      angle:
        calculateAngle(
          landmarks[23],
          landmarks[25],
          landmarks[27]
        )
    },

    {
      index: 26,
      label: "RK",
      angle:
        calculateAngle(
          landmarks[24],
          landmarks[26],
          landmarks[28]
        )
    },

    {
      index: 23,
      label: "LH",
      angle:
        calculateAngle(
          landmarks[11],
          landmarks[23],
          landmarks[25]
        )
    },

    {
      index: 24,
      label: "RH",
      angle:
        calculateAngle(
          landmarks[12],
          landmarks[24],
          landmarks[26]
        )
    },

    {
      index: 13,
      label: "LE",
      angle:
        calculateAngle(
          landmarks[11],
          landmarks[13],
          landmarks[15]
        )
    },

    {
      index: 14,
      label: "RE",
      angle:
        calculateAngle(
          landmarks[12],
          landmarks[14],
          landmarks[16]
        )
    }

  ];


  labels.forEach(item => {

    const point =
      landmarks[item.index];


    if (
      !point ||
      !Number.isFinite(
        item.angle
      )
    ) {
      return;
    }


    const x =
      point.x * width + 9;

    const y =
      point.y * height - 9;


    poseCtx.font =
      "bold 11px sans-serif";

    poseCtx.fillStyle =
      "rgba(2,10,15,.82)";


    poseCtx.fillRect(
      x - 3,
      y - 13,
      54,
      18
    );


    poseCtx.fillStyle =
      "#ffffff";


    poseCtx.fillText(
      `${item.label} ${Math.round(item.angle)}°`,
      x,
      y
    );

  });

}


/* =========================================================
   18. BIOMECHANICS
========================================================= */

function calculateBiomechanics(
  lm
) {

  const leftKnee =
    calculateAngle(
      lm[23],
      lm[25],
      lm[27]
    );

  const rightKnee =
    calculateAngle(
      lm[24],
      lm[26],
      lm[28]
    );


  const leftHip =
    calculateAngle(
      lm[11],
      lm[23],
      lm[25]
    );

  const rightHip =
    calculateAngle(
      lm[12],
      lm[24],
      lm[26]
    );


  const leftAnkle =
    calculateAngle(
      lm[25],
      lm[27],
      lm[31]
    );

  const rightAnkle =
    calculateAngle(
      lm[26],
      lm[28],
      lm[32]
    );


  const shoulderCenter = {

    x:
      (
        lm[11].x +
        lm[12].x
      ) / 2,

    y:
      (
        lm[11].y +
        lm[12].y
      ) / 2

  };


  const hipCenter = {

    x:
      (
        lm[23].x +
        lm[24].x
      ) / 2,

    y:
      (
        lm[23].y +
        lm[24].y
      ) / 2

  };


  const trunk =
    Math.abs(
      Math.atan2(
        shoulderCenter.x -
        hipCenter.x,

        hipCenter.y -
        shoulderCenter.y
      ) *
      180 /
      Math.PI
    );


  const knee =
    average([
      leftKnee,
      rightKnee
    ]);


  const hip =
    average([
      leftHip,
      rightHip
    ]);


  const ankle =
    average([
      leftAnkle,
      rightAnkle
    ]);


  const kneeDifference =
    Math.abs(
      leftKnee -
      rightKnee
    );


  const hipDifference =
    Math.abs(
      leftHip -
      rightHip
    );


  const symmetry =
    clamp(
      100 -
      (
        kneeDifference *
        1.5 +
        hipDifference *
        1.1
      ),
      0,
      100
    );


  const shoulderTilt =
    Math.abs(
      lm[11].y -
      lm[12].y
    );


  const hipTilt =
    Math.abs(
      lm[23].y -
      lm[24].y
    );


  const stability =
    clamp(
      100 -
      (
        shoulderTilt *
        600 +
        hipTilt *
        650
      ),
      0,
      100
    );


  return {

    leftKnee,
    rightKnee,

    leftHip,
    rightHip,

    leftAnkle,
    rightAnkle,

    knee,
    hip,
    ankle,
    trunk,

    symmetry,
    stability,

    hipCenter

  };

}


/* =========================================================
   19. LIVE METRICS
========================================================= */

function updateLiveMetrics(
  metrics
) {

  const knee =
    formatAngle(
      metrics.knee
    );

  const hip =
    formatAngle(
      metrics.hip
    );

  const ankle =
    formatAngle(
      metrics.ankle
    );

  const trunk =
    formatAngle(
      metrics.trunk
    );


  ANALYSIS_DOM.knee.textContent =
    knee;

  ANALYSIS_DOM.hip.textContent =
    hip;

  ANALYSIS_DOM.ankle.textContent =
    ankle;

  ANALYSIS_DOM.trunk.textContent =
    trunk;


  ANALYSIS_DOM.liveKnee.textContent =
    knee;

  ANALYSIS_DOM.liveHip.textContent =
    hip;

  ANALYSIS_DOM.liveAnkle.textContent =
    ankle;

  ANALYSIS_DOM.liveTrunk.textContent =
    trunk;


  ANALYSIS_DOM.symmetry.textContent =
    Math.round(
      metrics.symmetry
    );


  ANALYSIS_DOM.stability.textContent =
    Math.round(
      metrics.stability
    );

}


/* =========================================================
   20. HISTORY / ROM
========================================================= */

function pushHistory(
  array,
  value
) {

  if (
    Number.isFinite(value)
  ) {

    array.push(value);

  }


  if (
    array.length >
    MOTION_STATE.maxHistory
  ) {

    array.shift();

  }

}


function updateHistory(
  metrics
) {

  pushHistory(
    MOTION_STATE.angleHistory.knee,
    metrics.knee
  );

  pushHistory(
    MOTION_STATE.angleHistory.hip,
    metrics.hip
  );

  pushHistory(
    MOTION_STATE.angleHistory.trunk,
    metrics.trunk
  );

  pushHistory(
    MOTION_STATE.angleHistory.ankle,
    metrics.ankle
  );


  pushHistory(
    MOTION_STATE.hipHistory,
    metrics.hipCenter.y
  );


  const kneeHistory =
    MOTION_STATE.angleHistory.knee;


  if (
    kneeHistory.length > 3
  ) {

    const max =
      Math.max(
        ...kneeHistory
      );

    const min =
      Math.min(
        ...kneeHistory
      );

    const rom =
      Math.max(
        0,
        max - min
      );


    ANALYSIS_DOM.rom.textContent =
      Math.round(rom);

  }

}


/* =========================================================
   21. REP COUNTER
========================================================= */

function updateRepCounter(
  metrics
) {

  const knee =
    metrics.knee;


  if (
    !Number.isFinite(knee)
  ) {
    return;
  }


  /*
     범용 반복 추정.

     스쿼트류처럼
     관절 굴곡 → 신전이 명확한 운동에서
     가장 잘 작동한다.

     운동별 전문 rep detector는
     이후 확장 가능.
  */


  if (
    MOTION_STATE.repPhase ===
    "up" &&
    knee < 115
  ) {

    MOTION_STATE.repPhase =
      "down";

  }


  if (
    MOTION_STATE.repPhase ===
    "down" &&
    knee > 155
  ) {

    MOTION_STATE.repPhase =
      "up";


    MOTION_STATE.repCount +=
      1;


    ANALYSIS_DOM.currentRep.textContent =
      MOTION_STATE.repCount;


    const now =
      performance.now();


    if (
      MOTION_STATE.lastRepTime
    ) {

      const seconds =
        (
          now -
          MOTION_STATE.lastRepTime
        ) / 1000;


      MOTION_STATE.repTimes.push(
        seconds
      );


      ANALYSIS_DOM.tempo.textContent =
        `${seconds.toFixed(1)}s`;

    }


    MOTION_STATE.lastRepTime =
      now;

  }

}


/* =========================================================
   22. TECHNIQUE SCORE
========================================================= */

function scoreAngleAgainstRange(
  value,
  range
) {

  if (
    !Number.isFinite(value)
  ) {
    return 50;
  }


  if (
    !Array.isArray(range) ||
    range.length !== 2
  ) {
    return 85;
  }


  const [
    min,
    max
  ] =
    range;


  if (
    value >= min &&
    value <= max
  ) {

    return 100;

  }


  const distance =

    value < min
      ? min - value
      : value - max;


  return clamp(
    100 -
    distance * 2,
    0,
    100
  );

}


function updatePoseScore(
  metrics
) {

  const targets =
    MOTION_STATE
      .selectedExercise
      ?.angleTargets ||
    {};


  const kneeScore =
    scoreAngleAgainstRange(
      metrics.knee,
      targets.knee
    );


  const hipScore =
    scoreAngleAgainstRange(
      metrics.hip,
      targets.hip
    );


  const ankleScore =
    scoreAngleAgainstRange(
      metrics.ankle,
      targets.ankle
    );


  const trunkScore =
    scoreAngleAgainstRange(
      metrics.trunk,
      targets.trunk
    );


  const technique =

    average([

      kneeScore,

      hipScore,

      ankleScore,

      trunkScore,

      metrics.symmetry,

      metrics.stability

    ]);


  const finalScore =
    Math.round(
      clamp(
        technique,
        0,
        100
      )
    );


  ANALYSIS_DOM.score.textContent =
    finalScore;


  ANALYSIS_DOM.technique.textContent =
    finalScore;


  MOTION_STATE.latestMetrics.technique =
    finalScore;

}


/* =========================================================
   23. TRAJECTORY
========================================================= */

function updateMotionTrajectory(
  landmarks
) {

  if (
    !MOTION_STATE.path
  ) {
    return;
  }


  /*
     일반 카메라만으로 바벨 자체를
     안정적으로 식별할 수 없으므로
     현재는 손목 중심 이동 경로를
     운동 궤적 프록시로 사용한다.
  */


  const left =
    landmarks[15];

  const right =
    landmarks[16];


  if (
    !visibleLandmark(left) ||
    !visibleLandmark(right)
  ) {
    return;
  }


  const point = {

    x:
      (
        left.x +
        right.x
      ) / 2,

    y:
      (
        left.y +
        right.y
      ) / 2

  };


  MOTION_STATE.trajectory.push(
    point
  );


  if (
    MOTION_STATE.trajectory.length >
    100
  ) {

    MOTION_STATE.trajectory.shift();

  }

}


function drawMotionTrajectory() {

  if (!pathCtx) {
    return;
  }


  pathCtx.clearRect(
    0,
    0,
    ANALYSIS_DOM.pathCanvas.width,
    ANALYSIS_DOM.pathCanvas.height
  );


  if (
    !MOTION_STATE.path ||
    MOTION_STATE.trajectory.length < 2
  ) {
    return;
  }


  const width =
    ANALYSIS_DOM.pathCanvas.width;

  const height =
    ANALYSIS_DOM.pathCanvas.height;


  pathCtx.save();


  pathCtx.lineWidth =
    3;


  pathCtx.strokeStyle =
    "rgba(255,200,87,.95)";


  pathCtx.beginPath();


  MOTION_STATE.trajectory
    .forEach(
      (point, index) => {

        const x =
          point.x * width;

        const y =
          point.y * height;


        if (index === 0) {

          pathCtx.moveTo(
            x,
            y
          );

        }

        else {

          pathCtx.lineTo(
            x,
            y
          );

        }

      }
    );


  pathCtx.stroke();


  const last =
    MOTION_STATE
      .trajectory[
        MOTION_STATE.trajectory.length - 1
      ];


  pathCtx.beginPath();

  pathCtx.arc(
    last.x * width,
    last.y * height,
    6,
    0,
    Math.PI * 2
  );


  pathCtx.fillStyle =
    "#ffc857";

  pathCtx.fill();


  pathCtx.restore();

}


/* =========================================================
   24. AI 3D DEPTH VIEW
========================================================= */

function draw3DDepthEffect(
  landmarks
) {

  if (
    !poseCtx ||
    !landmarks
  ) {
    return;
  }


  const width =
    ANALYSIS_DOM.poseCanvas.width;

  const height =
    ANALYSIS_DOM.poseCanvas.height;


  const boxWidth =
    Math.min(
      220,
      width * 0.28
    );

  const boxHeight =
    Math.min(
      270,
      height * 0.48
    );


  const originX =
    width -
    boxWidth -
    14;

  const originY =
    height -
    boxHeight -
    14;


  poseCtx.save();


  poseCtx.fillStyle =
    "rgba(2,10,15,.78)";


  poseCtx.fillRect(
    originX,
    originY,
    boxWidth,
    boxHeight
  );


  poseCtx.strokeStyle =
    "rgba(35,199,217,.35)";

  poseCtx.lineWidth =
    1;

  poseCtx.strokeRect(
    originX,
    originY,
    boxWidth,
    boxHeight
  );


  poseCtx.fillStyle =
    "#31e6bb";

  poseCtx.font =
    "bold 10px sans-serif";

  poseCtx.fillText(
    "AI 3D ESTIMATION",
    originX + 10,
    originY + 17
  );


  const importantConnections =
    POSE_CONNECTIONS_CUSTOM;


  const project =
    point => {

      /*
         world landmark이면 x/y/z가
         실제 3D 추정 좌표.

         2D fallback에서는 z를 이용해
         깊이 효과만 준다.
      */

      const x =
        Number(point.x) || 0;

      const y =
        Number(point.y) || 0;

      const z =
        Number(point.z) || 0;


      const scale =
        landmarks ===
        MOTION_STATE.latestWorldLandmarks

          ? boxHeight * 1.7

          : boxHeight * 0.75;


      if (
        landmarks ===
        MOTION_STATE.latestWorldLandmarks
      ) {

        return {

          x:
            originX +
            boxWidth / 2 +
            x * scale +
            z * scale * 0.35,

          y:
            originY +
            boxHeight / 2 +
            y * scale

        };

      }


      return {

        x:
          originX +
          x * boxWidth +
          z * 30,

        y:
          originY +
          y * boxHeight

      };

    };


  poseCtx.lineWidth =
    2;


  importantConnections
    .forEach(
      ([aIndex, bIndex]) => {

        const a =
          landmarks[aIndex];

        const b =
          landmarks[bIndex];


        if (!a || !b) {
          return;
        }


        const pa =
          project(a);

        const pb =
          project(b);


        poseCtx.beginPath();

        poseCtx.moveTo(
          pa.x,
          pa.y
        );

        poseCtx.lineTo(
          pb.x,
          pb.y
        );


        poseCtx.strokeStyle =
          "rgba(49,230,187,.9)";

        poseCtx.stroke();

      }
    );


  landmarks.forEach(
    (point, index) => {

      if (
        index > 32
      ) {
        return;
      }


      const p =
        project(point);


      poseCtx.beginPath();

      poseCtx.arc(
        p.x,
        p.y,
        2.8,
        0,
        Math.PI * 2
      );


      poseCtx.fillStyle =
        "#ffffff";

      poseCtx.fill();

    }
  );


  poseCtx.restore();

}


/* =========================================================
   25. ANGLE GRAPH
========================================================= */

let angleChartInstance =
  null;


function initializeAngleChart() {

  if (
    !ANALYSIS_DOM.angleChart ||
    typeof Chart ===
    "undefined"
  ) {
    return;
  }


  angleChartInstance =
    new Chart(
      ANALYSIS_DOM.angleChart,
      {

        type:
          "line",

        data: {

          labels:
            [],

          datasets: [

            {
              label:
                "무릎",
              data:
                [],
              borderWidth:
                2,
              pointRadius:
                0,
              tension:
                0.25
            },

            {
              label:
                "고관절",
              data:
                [],
              borderWidth:
                2,
              pointRadius:
                0,
              tension:
                0.25
            },

            {
              label:
                "몸통",
              data:
                [],
              borderWidth:
                2,
              pointRadius:
                0,
              tension:
                0.25
            },

            {
              label:
                "발목",
              data:
                [],
              borderWidth:
                2,
              pointRadius:
                0,
              tension:
                0.25
            }

          ]

        },

        options: {

          responsive:
            true,

          maintainAspectRatio:
            false,

          animation:
            false,

          interaction: {
            intersect:
              false
          },

          scales: {

            y: {

              min:
                0,

              max:
                180,

              ticks: {
                color:
                  "#6f8794"
              },

              grid: {
                color:
                  "rgba(255,255,255,.05)"
              }

            },

            x: {

              ticks: {
                display:
                  false
              },

              grid: {
                display:
                  false
              }

            }

          },

          plugins: {

            legend: {

              labels: {
                color:
                  "#a7bac5"
              }

            }

          }

        }

      }
    );

}


let chartUpdateCounter =
  0;


function updateAngleChart() {

  if (
    !angleChartInstance
  ) {
    return;
  }


  /*
     매 프레임 Chart.js를 다시 그리면
     모바일에서 무거우므로
     몇 프레임마다 업데이트.
  */

  chartUpdateCounter++;


  if (
    chartUpdateCounter % 4 !== 0
  ) {
    return;
  }


  const history =
    MOTION_STATE.angleHistory;


  const length =
    history.knee.length;


  angleChartInstance.data.labels =
    Array.from(
      {
        length
      },
      (_, i) => i
    );


  angleChartInstance
    .data
    .datasets[0]
    .data =
      [...history.knee];


  angleChartInstance
    .data
    .datasets[1]
    .data =
      [...history.hip];


  angleChartInstance
    .data
    .datasets[2]
    .data =
      [...history.trunk];


  angleChartInstance
    .data
    .datasets[3]
    .data =
      [...history.ankle];


  angleChartInstance.update(
    "none"
  );

}


/* =========================================================
   26. EXERCISE CONFIG
========================================================= */

function populateAnalysisExercises() {

  if (
    !ANALYSIS_DOM.exercise ||
    !window.EXERCISES
  ) {
    return;
  }


  ANALYSIS_DOM.exercise.innerHTML =
    `
      <option value="">
        운동 선택
      </option>
    `;


  window.EXERCISES
    .forEach(
      exercise => {

        const option =
          document.createElement(
            "option"
          );


        option.value =
          exercise.id;

        option.textContent =
          `${exercise.icon} ${exercise.name}`;


        ANALYSIS_DOM.exercise
          .appendChild(
            option
          );

      }
    );

}


function handleExerciseChange() {

  const id =
    ANALYSIS_DOM.exercise.value;


  const exercise =
    window.getExerciseById
      ? window.getExerciseById(id)
      : null;


  MOTION_STATE.selectedExercise =
    exercise;


  if (!exercise) {

    ANALYSIS_DOM.title.textContent =
      "자세 분석";

    return;

  }


  ANALYSIS_DOM.title.textContent =
    `${exercise.name} 자세 분석`;


  setRecommendedView(
    exercise.view
  );


  updateAngleRanges(
    exercise
  );


  renderCheckpoints(
    exercise
  );


  renderRecommendations(
    exercise
  );

}


/* =========================================================
   27. ANGLE TARGET DISPLAY
========================================================= */

function rangeText(range) {

  if (
    !Array.isArray(range)
  ) {
    return "운동별 기준";
  }


  return (
    `${range[0]}° ~ ${range[1]}°`
  );

}


function updateAngleRanges(
  exercise
) {

  const targets =
    exercise.angleTargets ||
    {};


  ANALYSIS_DOM.kneeRange.textContent =
    rangeText(
      targets.knee
    );


  ANALYSIS_DOM.hipRange.textContent =
    rangeText(
      targets.hip
    );


  ANALYSIS_DOM.trunkRange.textContent =
    rangeText(
      targets.trunk
    );


  ANALYSIS_DOM.ankleRange.textContent =
    rangeText(
      targets.ankle
    );

}


/* =========================================================
   28. CHECKPOINTS
========================================================= */

function renderCheckpoints(
  exercise
) {

  const checkpoints =
    exercise.checkpoints || [];


  if (!checkpoints.length) {

    ANALYSIS_DOM.checkpointList.innerHTML =
      `
        <div class="checkpoint-row">
          <span>
            기본 관절 정렬 및 좌우 대칭 분석
          </span>
          <strong class="good">
            READY
          </strong>
        </div>
      `;

    return;

  }


  ANALYSIS_DOM.checkpointList.innerHTML =
    checkpoints
      .map(
        checkpoint => `

          <div class="checkpoint-row">

            <span>
              ${checkpoint}
            </span>

            <strong class="good">
              CHECK
            </strong>

          </div>

        `
      )
      .join("");

}


/* =========================================================
   29. TRAINING RECOMMENDATIONS
========================================================= */

function renderRecommendations(
  exercise
) {

  const recommendations =

    window.getGeneralRecommendations

      ? window.getGeneralRecommendations(
          exercise
        )

      : exercise.recommendations || [];


  if (
    !recommendations.length
  ) {

    ANALYSIS_DOM.recommendations.innerHTML =
      `
        <div class="empty-state">
          추천 훈련 데이터가 없습니다.
        </div>
      `;

    return;

  }


  ANALYSIS_DOM.recommendations.innerHTML =

    recommendations
      .map(
        (name, index) => `

          <div class="recommendation-card">

            <strong>
              ${index + 1}. ${name}
            </strong>

            <p>
              분석 결과에 따라 자세 안정성과
              동작 효율 개선을 위한 보조 훈련으로
              활용할 수 있습니다.
            </p>

          </div>

        `
      )
      .join("");

}


/* =========================================================
   30. VIEW SELECTOR
========================================================= */

function setRecommendedView(
  view
) {

  if (!view) {
    return;
  }


  MOTION_STATE.view =
    view;


  document
    .querySelectorAll(
      ".view-button"
    )
    .forEach(
      button => {

        button.classList.toggle(
          "active",
          button.dataset.view ===
          view
        );

      }
    );

}


/* =========================================================
   31. 2D / 3D
========================================================= */

function setAnalysisMode(
  mode
) {

  MOTION_STATE.mode =
    mode;


  document
    .querySelectorAll(
      ".mode-button"
    )
    .forEach(
      button => {

        button.classList.toggle(
          "active",
          button.dataset.analysisMode ===
          mode
        );

      }
    );


  setEngineStatus(

    mode === "3d"

      ? "AI 3D MODE READY"

      : "2D MODE READY"

  );

}


/* =========================================================
   32. PLAYBACK
========================================================= */

function getPlaybackVideo() {

  if (
    MOTION_STATE.source ===
    "video"
  ) {

    return ANALYSIS_DOM.uploadedVideo;

  }


  return null;

}


function togglePlayback() {

  const video =
    getPlaybackVideo();


  if (!video) {
    return;
  }


  if (video.paused) {

    video.play();

  }

  else {

    video.pause();

  }

}


function stepFrame(
  direction
) {

  const video =
    getPlaybackVideo();


  if (!video) {
    return;
  }


  video.pause();


  /*
     일반적인 30fps 기준.
     브라우저 video API는 원본 fps를
     직접 제공하지 않으므로 근사값.
  */

  const frameDuration =
    1 / 30;


  video.currentTime =
    clamp(

      video.currentTime +
      frameDuration *
      direction,

      0,

      Number.isFinite(
        video.duration
      )
        ? video.duration
        : video.currentTime + 1

    );


  video.addEventListener(
    "seeked",
    () => {

      processPoseFrame(
        video
      );

    },
    {
      once:
        true
    }
  );

}


/* =========================================================
   33. TIMER
========================================================= */

function startAnalysisTimer() {

  clearInterval(
    MOTION_STATE.timerInterval
  );


  MOTION_STATE.timerInterval =
    setInterval(
      () => {

        if (
          !MOTION_STATE.startTime
        ) {
          return;
        }


        const seconds =
          Math.floor(
            (
              Date.now() -
              MOTION_STATE.startTime
            ) / 1000
          );


        const min =
          String(
            Math.floor(
              seconds / 60
            )
          )
          .padStart(
            2,
            "0"
          );


        const sec =
          String(
            seconds % 60
          )
          .padStart(
            2,
            "0"
          );


        ANALYSIS_DOM.timer.textContent =
          `${min}:${sec}`;

      },
      500
    );

}


/* =========================================================
   34. STOP
========================================================= */

function stopMotionAnalysis() {

  MOTION_STATE.running =
    false;


  if (
    MOTION_STATE.animationId
  ) {

    cancelAnimationFrame(
      MOTION_STATE.animationId
    );

    MOTION_STATE.animationId =
      null;

  }


  clearInterval(
    MOTION_STATE.timerInterval
  );


  if (
    MOTION_STATE.source ===
    "video"
  ) {

    ANALYSIS_DOM.uploadedVideo.pause();

  }


  setLiveStatus(
    false,
    "COMPLETE"
  );


  setEngineStatus(
    "ANALYSIS COMPLETE"
  );


  saveLatestAnalysisSnapshot();


  toastAnalysis(
    "자세 분석이 종료되었습니다."
  );

}


/* =========================================================
   35. SNAPSHOT
========================================================= */

function createAnalysisSnapshot() {

  if (
    !MOTION_STATE.latestMetrics
  ) {
    return null;
  }


  const exercise =
    MOTION_STATE.selectedExercise;


  return {

    id:
      `analysis-${Date.now()}`,

    createdAt:
      new Date()
        .toISOString(),

    athleteId:
      ANALYSIS_DOM.athlete?.value ||
      "",

    exerciseId:
      exercise?.id ||
      "",

    exerciseName:
      exercise?.name ||
      "운동",

    exerciseIcon:
      exercise?.icon ||
      "🏋️",

    exerciseCategory:
      exercise?.category ||
      "",

    view:
      MOTION_STATE.view,

    analysisMode:
      MOTION_STATE.mode,

    landmarkCount:
      33,

    reps:
      MOTION_STATE.repCount,

    score:
      MOTION_STATE
        .latestMetrics
        .technique ||
      0,

    symmetry:
      Math.round(
        MOTION_STATE
          .latestMetrics
          .symmetry ||
        0
      ),

    stability:
      Math.round(
        MOTION_STATE
          .latestMetrics
          .stability ||
        0
      ),

    knee:
      Math.round(
        MOTION_STATE
          .latestMetrics
          .knee ||
        0
      ),

    hip:
      Math.round(
        MOTION_STATE
          .latestMetrics
          .hip ||
        0
      ),

    ankle:
      Math.round(
        MOTION_STATE
          .latestMetrics
          .ankle ||
        0
      ),

    trunk:
      Math.round(
        MOTION_STATE
          .latestMetrics
          .trunk ||
        0
      ),

    recommendations:

      exercise

        ? (
            window
              .getGeneralRecommendations
              ? window
                  .getGeneralRecommendations(
                    exercise
                  )
              : exercise.recommendations ||
                []
          )

        : []

  };

}


function saveLatestAnalysisSnapshot() {

  const snapshot =
    createAnalysisSnapshot();


  if (!snapshot) {
    return;
  }


  window.latestWeightAnalysis =
    snapshot;


  window.dispatchEvent(
    new CustomEvent(
      "weight-analysis-complete",
      {
        detail:
          snapshot
      }
    )
  );

}


/* =========================================================
   36. TARGET REPS
========================================================= */

function updateTargetReps() {

  const target =
    clamp(
      Number(
        ANALYSIS_DOM
          .targetReps
          .value
      ) || 1,
      1,
      100
    );


  ANALYSIS_DOM.targetRep.textContent =
    target;

}


/* =========================================================
   37. TOGGLES
========================================================= */

function toggleSkeleton() {

  MOTION_STATE.skeleton =
    !MOTION_STATE.skeleton;


  ANALYSIS_DOM.toggleSkeleton
    .classList
    .toggle(
      "active",
      MOTION_STATE.skeleton
    );


  if (
    !MOTION_STATE.skeleton
  ) {

    clearPoseCanvas();

  }

}


function toggleReference() {

  MOTION_STATE.reference =
    !MOTION_STATE.reference;


  const display =
    MOTION_STATE.reference
      ? ""
      : "none";


  ANALYSIS_DOM.referenceVertical
    .style.display =
      display;


  ANALYSIS_DOM.referenceHorizontal
    .style.display =
      display;

}


function toggleTrajectory() {

  MOTION_STATE.path =
    !MOTION_STATE.path;


  if (
    !MOTION_STATE.path &&
    pathCtx
  ) {

    pathCtx.clearRect(
      0,
      0,
      ANALYSIS_DOM.pathCanvas.width,
      ANALYSIS_DOM.pathCanvas.height
    );

  }

}


/* =========================================================
   38. PLAYBACK SPEED
========================================================= */

function changePlaybackSpeed() {

  const speed =
    Number(
      ANALYSIS_DOM.playbackSpeed.value
    ) || 1;


  if (
    ANALYSIS_DOM.uploadedVideo
  ) {

    ANALYSIS_DOM.uploadedVideo.playbackRate =
      speed;

  }

}


/* =========================================================
   39. EVENT LISTENERS
========================================================= */

function bindAnalysisEvents() {

  ANALYSIS_DOM.connectCamera
    ?.addEventListener(
      "click",
      connectAnalysisCamera
    );


  ANALYSIS_DOM.switchCamera
    ?.addEventListener(
      "click",
      switchAnalysisCamera
    );


  ANALYSIS_DOM.videoUpload
    ?.addEventListener(
      "change",
      handleVideoUpload
    );


  ANALYSIS_DOM.imageUpload
    ?.addEventListener(
      "change",
      handleImageUpload
    );


  ANALYSIS_DOM.start
    ?.addEventListener(
      "click",
      startMotionAnalysis
    );


  ANALYSIS_DOM.stop
    ?.addEventListener(
      "click",
      stopMotionAnalysis
    );


  ANALYSIS_DOM.exercise
    ?.addEventListener(
      "change",
      handleExerciseChange
    );


  ANALYSIS_DOM.targetReps
    ?.addEventListener(
      "input",
      updateTargetReps
    );


  ANALYSIS_DOM.playPause
    ?.addEventListener(
      "click",
      togglePlayback
    );


  ANALYSIS_DOM.frameBack
    ?.addEventListener(
      "click",
      () =>
        stepFrame(-1)
    );


  ANALYSIS_DOM.frameForward
    ?.addEventListener(
      "click",
      () =>
        stepFrame(1)
    );


  ANALYSIS_DOM.playbackSpeed
    ?.addEventListener(
      "change",
      changePlaybackSpeed
    );


  ANALYSIS_DOM.toggleSkeleton
    ?.addEventListener(
      "click",
      toggleSkeleton
    );


  ANALYSIS_DOM.toggleReference
    ?.addEventListener(
      "click",
      toggleReference
    );


  ANALYSIS_DOM.togglePath
    ?.addEventListener(
      "click",
      toggleTrajectory
    );


  document
    .querySelectorAll(
      ".view-button"
    )
    .forEach(
      button => {

        button.addEventListener(
          "click",
          () => {

            MOTION_STATE.view =
              button.dataset.view;


            document
              .querySelectorAll(
                ".view-button"
              )
              .forEach(
                item =>
                  item.classList.remove(
                    "active"
                  )
              );


            button.classList.add(
              "active"
            );

          }
        );

      }
    );


  document
    .querySelectorAll(
      ".mode-button"
    )
    .forEach(
      button => {

        button.addEventListener(
          "click",
          () => {

            setAnalysisMode(
              button.dataset.analysisMode
            );

          }
        );

      }
    );

}


/* =========================================================
   40. SETTINGS SYNC
========================================================= */

function bindAnalysisSettings() {

  const skeleton =
    document.getElementById(
      "settingSkeleton"
    );

  const reference =
    document.getElementById(
      "settingReference"
    );

  const path =
    document.getElementById(
      "settingBarPath"
    );


  skeleton
    ?.addEventListener(
      "change",
      () => {

        MOTION_STATE.skeleton =
          skeleton.checked;

      }
    );


  reference
    ?.addEventListener(
      "change",
      () => {

        MOTION_STATE.reference =
          reference.checked;


        ANALYSIS_DOM.referenceVertical
          .style.display =
            reference.checked
              ? ""
              : "none";


        ANALYSIS_DOM.referenceHorizontal
          .style.display =
            reference.checked
              ? ""
              : "none";

      }
    );


  path
    ?.addEventListener(
      "change",
      () => {

        MOTION_STATE.path =
          path.checked;

      }
    );

}


/* =========================================================
   41. TOAST FALLBACK
========================================================= */

function toastAnalysis(
  message
) {

  if (
    typeof window.showToast ===
    "function"
  ) {

    window.showToast(
      message
    );

    return;

  }


  const toast =
    document.getElementById(
      "toast"
    );


  if (!toast) {

    console.log(
      message
    );

    return;

  }


  toast.textContent =
    message;


  toast.classList.add(
    "show"
  );


  clearTimeout(
    toast._timer
  );


  toast._timer =
    setTimeout(
      () =>
        toast.classList.remove(
          "show"
        ),
      2500
    );

}


/* =========================================================
   42. EXTERNAL ANALYSIS API
========================================================= */

window.WeightMotionAnalysis = {

  start:
    startMotionAnalysis,

  stop:
    stopMotionAnalysis,

  connectCamera:
    connectAnalysisCamera,

  switchCamera:
    switchAnalysisCamera,

  selectExercise(
    exerciseId
  ) {

    ANALYSIS_DOM.exercise.value =
      exerciseId;


    handleExerciseChange();

  },

  setMode:
    setAnalysisMode,

  getLatestMetrics() {

    return (
      MOTION_STATE.latestMetrics
    );

  },

  getSnapshot:
    createAnalysisSnapshot,

  getLandmarks() {

    return (
      MOTION_STATE.latestLandmarks
    );

  },

  getWorldLandmarks() {

    return (
      MOTION_STATE.latestWorldLandmarks
    );

  }

};


/* =========================================================
   43. INITIALIZATION
========================================================= */

function initializeAnalysisSystem() {

  resizeAnalysisCanvas();

  populateAnalysisExercises();

  initializeAngleChart();

  bindAnalysisEvents();

  bindAnalysisSettings();

  updateTargetReps();


  /*
     Pose 객체는 여기서 생성.

     카메라는 사용자가 버튼을
     누르기 전까지 권한 요청하지 않는다.
  */

  initializePoseEngine();


  console.log(
    "[WEIGHT PERFORMANCE LAB] Motion analysis initialized."
  );


  console.log(
    "[POSE] 33 landmark configuration enabled."
  );

}


if (
  document.readyState ===
  "loading"
) {

  document.addEventListener(
    "DOMContentLoaded",
    initializeAnalysisSystem
  );

}

else {

  initializeAnalysisSystem();

}