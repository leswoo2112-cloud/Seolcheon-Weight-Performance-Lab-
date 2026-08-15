/* =========================================================
   SEOLCHEON HIGH SCHOOL
   WEIGHT PERFORMANCE LAB

   ANALYSIS.JS
   PART 1 / 3

   MOTION ANALYSIS ENGINE
   ---------------------------------------------------------
   - MediaPipe Pose 33 Landmarks
   - Camera
   - Video Upload
   - Image Upload
   - 2D / 3D Mode
   - Front / Side / Rear / Top View
   - Skeleton Overlay
   - Joint Angle Analysis
   - Reference Lines
   - Slow Motion
   - Frame Control
========================================================= */

"use strict";


/* =========================================================
   01. ANALYSIS STATE
========================================================= */

const MOTION_STATE = {

  pose: null,

  stream: null,

  running: false,

  cameraConnected: false,

  sourceType: "camera",

  facingMode: "user",

  view: "front",

  mode: "2d",

  skeletonVisible: true,

  referenceVisible: true,

  barPathVisible: true,

  anglesVisible: true,

  lastResults: null,

  lastLandmarks: null,

  frameBusy: false,

  animationFrame: null,

  timerInterval: null,

  startTime: 0,

  elapsed: 0,

  repCount: 0,

  targetReps: 10,

  movementPhase: "ready",

  previousPhase: "ready",

  frameCounter: 0,

  poseScore: 0,

  symmetry: 0,

  stability: 0,

  mobility: 0,

  technique: 0,

  rom: 0,

  angleHistory: {

    knee: [],

    hip: [],

    ankle: [],

    trunk: []

  },

  barPath: [],

  currentAngles: {

    knee: null,

    leftKnee: null,

    rightKnee: null,

    hip: null,

    leftHip: null,

    rightHip: null,

    ankle: null,

    leftAnkle: null,

    rightAnkle: null,

    trunk: null,

    leftElbow: null,

    rightElbow: null,

    leftShoulder: null,

    rightShoulder: null

  }

};


/* =========================================================
   02. DOM REFERENCES
========================================================= */

const ANALYSIS_DOM = {};


function cacheAnalysisDOM() {

  ANALYSIS_DOM.cameraVideo =
    document.getElementById("cameraVideo");

  ANALYSIS_DOM.uploadedVideo =
    document.getElementById("uploadedVideo");

  ANALYSIS_DOM.uploadedImage =
    document.getElementById("uploadedImage");

  ANALYSIS_DOM.poseCanvas =
    document.getElementById("poseCanvas");

  ANALYSIS_DOM.barPathCanvas =
    document.getElementById("barPathCanvas");

  ANALYSIS_DOM.viewerPlaceholder =
    document.getElementById("viewerPlaceholder");


  ANALYSIS_DOM.connectCameraBtn =
    document.getElementById("connectCameraBtn");

  ANALYSIS_DOM.switchCameraBtn =
    document.getElementById("switchCameraBtn");

  ANALYSIS_DOM.startAnalysisBtn =
    document.getElementById("startAnalysisBtn");

  ANALYSIS_DOM.stopAnalysisBtn =
    document.getElementById("stopAnalysisBtn");


  ANALYSIS_DOM.videoUpload =
    document.getElementById("analysisVideoUpload");

  ANALYSIS_DOM.imageUpload =
    document.getElementById("analysisImageUpload");


  ANALYSIS_DOM.analysisAthlete =
    document.getElementById("analysisAthlete");

  ANALYSIS_DOM.analysisExercise =
    document.getElementById("analysisExercise");

  ANALYSIS_DOM.targetReps =
    document.getElementById("analysisTargetReps");


  ANALYSIS_DOM.currentRepCount =
    document.getElementById("currentRepCount");

  ANALYSIS_DOM.targetRepCount =
    document.getElementById("targetRepCount");

  ANALYSIS_DOM.poseScore =
    document.getElementById("currentPoseScore");

  ANALYSIS_DOM.timer =
    document.getElementById("analysisTimer");

  ANALYSIS_DOM.tempo =
    document.getElementById("analysisTempo");


  ANALYSIS_DOM.kneeAngle =
    document.getElementById("kneeAngle");

  ANALYSIS_DOM.hipAngle =
    document.getElementById("hipAngle");

  ANALYSIS_DOM.trunkAngle =
    document.getElementById("trunkAngle");

  ANALYSIS_DOM.ankleAngle =
    document.getElementById("ankleAngle");


  ANALYSIS_DOM.liveKnee =
    document.getElementById("liveKnee");

  ANALYSIS_DOM.liveHip =
    document.getElementById("liveHip");

  ANALYSIS_DOM.liveTrunk =
    document.getElementById("liveTrunk");

  ANALYSIS_DOM.liveAnkle =
    document.getElementById("liveAnkle");

  ANALYSIS_DOM.liveSymmetry =
    document.getElementById("liveSymmetry");

  ANALYSIS_DOM.liveROM =
    document.getElementById("liveROM");

  ANALYSIS_DOM.liveStability =
    document.getElementById("liveStability");

  ANALYSIS_DOM.liveTechnique =
    document.getElementById("liveTechnique");


  ANALYSIS_DOM.referenceVertical =
    document.getElementById("referenceVertical");

  ANALYSIS_DOM.referenceHorizontal =
    document.getElementById("referenceHorizontal");


  ANALYSIS_DOM.frameBackBtn =
    document.getElementById("frameBackBtn");

  ANALYSIS_DOM.frameForwardBtn =
    document.getElementById("frameForwardBtn");

  ANALYSIS_DOM.playPauseBtn =
    document.getElementById("playPauseBtn");

  ANALYSIS_DOM.playbackSpeed =
    document.getElementById("playbackSpeed");

  ANALYSIS_DOM.toggleSkeletonBtn =
    document.getElementById("toggleSkeletonBtn");

  ANALYSIS_DOM.toggleReferenceBtn =
    document.getElementById("toggleReferenceBtn");

  ANALYSIS_DOM.toggleBarPathBtn =
    document.getElementById("toggleBarPathBtn");


  ANALYSIS_DOM.liveStatusBadge =
    document.getElementById("liveStatusBadge");

  ANALYSIS_DOM.engineStatus =
    document.getElementById("analysisEngineStatus");

  ANALYSIS_DOM.motionTitle =
    document.getElementById("motionAnalysisTitle");

  ANALYSIS_DOM.checkpointList =
    document.getElementById("checkpointList");

  ANALYSIS_DOM.trainingRecommendations =
    document.getElementById("trainingRecommendations");

}


/* =========================================================
   03. MEDIAPIPE LANDMARK INDEX

   MediaPipe Pose = 33 landmarks
========================================================= */

const POSE_POINT = {

  NOSE: 0,

  LEFT_EYE_INNER: 1,
  LEFT_EYE: 2,
  LEFT_EYE_OUTER: 3,

  RIGHT_EYE_INNER: 4,
  RIGHT_EYE: 5,
  RIGHT_EYE_OUTER: 6,

  LEFT_EAR: 7,
  RIGHT_EAR: 8,

  MOUTH_LEFT: 9,
  MOUTH_RIGHT: 10,

  LEFT_SHOULDER: 11,
  RIGHT_SHOULDER: 12,

  LEFT_ELBOW: 13,
  RIGHT_ELBOW: 14,

  LEFT_WRIST: 15,
  RIGHT_WRIST: 16,

  LEFT_PINKY: 17,
  RIGHT_PINKY: 18,

  LEFT_INDEX: 19,
  RIGHT_INDEX: 20,

  LEFT_THUMB: 21,
  RIGHT_THUMB: 22,

  LEFT_HIP: 23,
  RIGHT_HIP: 24,

  LEFT_KNEE: 25,
  RIGHT_KNEE: 26,

  LEFT_ANKLE: 27,
  RIGHT_ANKLE: 28,

  LEFT_HEEL: 29,
  RIGHT_HEEL: 30,

  LEFT_FOOT: 31,
  RIGHT_FOOT: 32

};


/* =========================================================
   04. SKELETON CONNECTIONS
========================================================= */

const SKELETON_CONNECTIONS = [

  /* FACE */

  [0, 1],
  [1, 2],
  [2, 3],

  [0, 4],
  [4, 5],
  [5, 6],

  [3, 7],
  [6, 8],


  /* SHOULDERS */

  [11, 12],


  /* LEFT ARM */

  [11, 13],
  [13, 15],

  [15, 17],
  [15, 19],
  [15, 21],


  /* RIGHT ARM */

  [12, 14],
  [14, 16],

  [16, 18],
  [16, 20],
  [16, 22],


  /* TORSO */

  [11, 23],
  [12, 24],

  [23, 24],


  /* LEFT LEG */

  [23, 25],
  [25, 27],

  [27, 29],
  [29, 31],
  [27, 31],


  /* RIGHT LEG */

  [24, 26],
  [26, 28],

  [28, 30],
  [30, 32],
  [28, 32]

];


/* =========================================================
   05. INITIALIZE MOTION ENGINE
========================================================= */

async function initializeMotionAnalysis() {

  cacheAnalysisDOM();

  setupAnalysisEvents();

  setupPoseCanvas();

  initializePoseEngine();

  updateAnalysisStatus(
    "ENGINE READY",
    false
  );

}


/* =========================================================
   06. INITIALIZE MEDIAPIPE POSE
========================================================= */

function initializePoseEngine() {

  if (typeof Pose === "undefined") {

    console.error(
      "MediaPipe Pose library not loaded."
    );

    updateAnalysisStatus(
      "ENGINE ERROR",
      false
    );

    return;

  }


  MOTION_STATE.pose =
    new Pose({

      locateFile: (file) => {

        return (
          "https://cdn.jsdelivr.net/npm/" +
          "@mediapipe/pose/" +
          file
        );

      }

    });


  MOTION_STATE.pose.setOptions({

    modelComplexity: 2,

    smoothLandmarks: true,

    enableSegmentation: false,

    smoothSegmentation: false,

    minDetectionConfidence: 0.55,

    minTrackingConfidence: 0.55

  });


  MOTION_STATE.pose.onResults(
    handlePoseResults
  );

}


/* =========================================================
   07. CANVAS SETUP
========================================================= */

function setupPoseCanvas() {

  const canvas =
    ANALYSIS_DOM.poseCanvas;

  if (!canvas) {
    return;
  }


  const resize = () => {

    const viewer =
      canvas.parentElement;

    if (!viewer) {
      return;
    }


    const rect =
      viewer.getBoundingClientRect();


    const dpr =
      window.devicePixelRatio || 1;


    canvas.width =
      Math.max(
        1,
        Math.floor(
          rect.width * dpr
        )
      );


    canvas.height =
      Math.max(
        1,
        Math.floor(
          rect.height * dpr
        )
      );


    canvas.style.width =
      rect.width + "px";

    canvas.style.height =
      rect.height + "px";


    const barCanvas =
      ANALYSIS_DOM.barPathCanvas;


    if (barCanvas) {

      barCanvas.width =
        canvas.width;

      barCanvas.height =
        canvas.height;

      barCanvas.style.width =
        rect.width + "px";

      barCanvas.style.height =
        rect.height + "px";

    }

  };


  resize();


  window.addEventListener(
    "resize",
    resize
  );


  if (
    typeof ResizeObserver !==
    "undefined"
  ) {

    const observer =
      new ResizeObserver(resize);

    observer.observe(
      canvas.parentElement
    );

  }

}


/* =========================================================
   08. EVENTS
========================================================= */

function setupAnalysisEvents() {


  /* CAMERA */

  ANALYSIS_DOM.connectCameraBtn
    ?.addEventListener(
      "click",
      connectAnalysisCamera
    );


  ANALYSIS_DOM.switchCameraBtn
    ?.addEventListener(
      "click",
      switchAnalysisCamera
    );


  /* START / STOP */

  ANALYSIS_DOM.startAnalysisBtn
    ?.addEventListener(
      "click",
      startMotionAnalysis
    );


  ANALYSIS_DOM.stopAnalysisBtn
    ?.addEventListener(
      "click",
      stopMotionAnalysis
    );


  /* VIDEO */

  ANALYSIS_DOM.videoUpload
    ?.addEventListener(
      "change",
      handleVideoUpload
    );


  /* IMAGE */

  ANALYSIS_DOM.imageUpload
    ?.addEventListener(
      "change",
      handleImageUpload
    );


  /* TARGET REPS */

  ANALYSIS_DOM.targetReps
    ?.addEventListener(
      "input",
      () => {

        const value =
          Number(
            ANALYSIS_DOM.targetReps.value
          );

        MOTION_STATE.targetReps =
          Math.max(
            1,
            value || 1
          );


        if (
          ANALYSIS_DOM.targetRepCount
        ) {

          ANALYSIS_DOM
            .targetRepCount
            .textContent =
            MOTION_STATE.targetReps;

        }

      }
    );


  /* EXERCISE */

  ANALYSIS_DOM.analysisExercise
    ?.addEventListener(
      "change",
      handleAnalysisExerciseChange
    );


  /* VIEW BUTTON */

  document
    .querySelectorAll(
      "[data-view]"
    )
    .forEach(
      button => {

        button.addEventListener(
          "click",
          () => {

            document
              .querySelectorAll(
                "[data-view]"
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


            MOTION_STATE.view =
              button.dataset.view;


            updateViewMode();

          }
        );

      }
    );


  /* 2D / 3D */

  document
    .querySelectorAll(
      "[data-analysis-mode]"
    )
    .forEach(
      button => {

        button.addEventListener(
          "click",
          () => {

            document
              .querySelectorAll(
                "[data-analysis-mode]"
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


            MOTION_STATE.mode =
              button.dataset.analysisMode;


            updateAnalysisMode();

          }
        );

      }
    );


  /* SKELETON */

  ANALYSIS_DOM.toggleSkeletonBtn
    ?.addEventListener(
      "click",
      () => {

        MOTION_STATE
          .skeletonVisible =
          !MOTION_STATE
            .skeletonVisible;


        ANALYSIS_DOM
          .toggleSkeletonBtn
          ?.classList.toggle(
            "active",
            MOTION_STATE
              .skeletonVisible
          );


        redrawLastPose();

      }
    );


  /* REFERENCE */

  ANALYSIS_DOM.toggleReferenceBtn
    ?.addEventListener(
      "click",
      () => {

        MOTION_STATE
          .referenceVisible =
          !MOTION_STATE
            .referenceVisible;


        updateReferenceVisibility();

      }
    );


  /* BAR PATH */

  ANALYSIS_DOM.toggleBarPathBtn
    ?.addEventListener(
      "click",
      () => {

        MOTION_STATE
          .barPathVisible =
          !MOTION_STATE
            .barPathVisible;


        ANALYSIS_DOM
          .toggleBarPathBtn
          ?.classList.toggle(
            "active",
            MOTION_STATE
              .barPathVisible
          );


        drawBarPath();

      }
    );


  /* PLAYBACK SPEED */

  ANALYSIS_DOM.playbackSpeed
    ?.addEventListener(
      "change",
      () => {

        if (
          ANALYSIS_DOM
            .uploadedVideo
        ) {

          ANALYSIS_DOM
            .uploadedVideo
            .playbackRate =
            Number(
              ANALYSIS_DOM
                .playbackSpeed
                .value
            );

        }

      }
    );


  /* PLAY / PAUSE */

  ANALYSIS_DOM.playPauseBtn
    ?.addEventListener(
      "click",
      toggleUploadedVideoPlayback
    );


  /* FRAME BACK */

  ANALYSIS_DOM.frameBackBtn
    ?.addEventListener(
      "click",
      () => {

        moveVideoFrame(-1);

      }
    );


  /* FRAME FORWARD */

  ANALYSIS_DOM.frameForwardBtn
    ?.addEventListener(
      "click",
      () => {

        moveVideoFrame(1);

      }
    );

}


/* =========================================================
   09. CAMERA CONNECT
========================================================= */

async function connectAnalysisCamera() {

  try {

    stopCameraStream();


    MOTION_STATE.sourceType =
      "camera";


    const constraints = {

      audio: false,

      video: {

        facingMode:
          MOTION_STATE.facingMode,

        width: {
          ideal: 1920
        },

        height: {
          ideal: 1080
        }

      }

    };


    const stream =
      await navigator
        .mediaDevices
        .getUserMedia(
          constraints
        );


    MOTION_STATE.stream =
      stream;


    const video =
      ANALYSIS_DOM.cameraVideo;


    video.srcObject =
      stream;


    video.hidden =
      false;


    ANALYSIS_DOM.uploadedVideo.hidden =
      true;

    ANALYSIS_DOM.uploadedImage.hidden =
      true;


    ANALYSIS_DOM.viewerPlaceholder
      ?.classList.add(
        "hidden"
      );


    await video.play();


    MOTION_STATE.cameraConnected =
      true;


    updateAnalysisStatus(
      "CAMERA ONLINE",
      true
    );


    startCameraPoseLoop();


    if (
      typeof showToast ===
      "function"
    ) {

      showToast(
        "카메라가 연결되었습니다."
      );

    }

  }

  catch (error) {

    console.error(
      "Camera error:",
      error
    );


    updateAnalysisStatus(
      "CAMERA ERROR",
      false
    );


    if (
      typeof showToast ===
      "function"
    ) {

      showToast(
        "카메라 권한을 확인해주세요."
      );

    }

  }

}


/* =========================================================
   10. CAMERA SWITCH
========================================================= */

async function switchAnalysisCamera() {

  MOTION_STATE.facingMode =

    MOTION_STATE.facingMode ===
    "user"

      ? "environment"

      : "user";


  await connectAnalysisCamera();

}


/* =========================================================
   11. CAMERA LOOP
========================================================= */

function startCameraPoseLoop() {

  cancelAnimationFrame(
    MOTION_STATE.animationFrame
  );


  const processFrame =
    async () => {

      const video =
        ANALYSIS_DOM.cameraVideo;


      if (
        !video ||
        !MOTION_STATE.pose ||
        video.readyState < 2
      ) {

        MOTION_STATE.animationFrame =
          requestAnimationFrame(
            processFrame
          );

        return;

      }


      if (
        !MOTION_STATE.frameBusy
      ) {

        MOTION_STATE.frameBusy =
          true;


        try {

          await MOTION_STATE.pose.send({

            image: video

          });

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


      MOTION_STATE.animationFrame =
        requestAnimationFrame(
          processFrame
        );

    };


  processFrame();

}


/* =========================================================
   12. STOP CAMERA
========================================================= */

function stopCameraStream() {

  if (
    MOTION_STATE.stream
  ) {

    MOTION_STATE.stream
      .getTracks()
      .forEach(
        track => track.stop()
      );

  }


  MOTION_STATE.stream =
    null;


  MOTION_STATE.cameraConnected =
    false;


  if (
    MOTION_STATE.animationFrame
  ) {

    cancelAnimationFrame(
      MOTION_STATE.animationFrame
    );

  }


  MOTION_STATE.animationFrame =
    null;

}


/* =========================================================
   13. VIDEO UPLOAD
========================================================= */

function handleVideoUpload(event) {

  const file =
    event.target.files?.[0];


  if (!file) {
    return;
  }


  stopCameraStream();


  MOTION_STATE.sourceType =
    "video";


  const video =
    ANALYSIS_DOM.uploadedVideo;


  const url =
    URL.createObjectURL(
      file
    );


  video.src =
    url;


  video.hidden =
    false;


  ANALYSIS_DOM.cameraVideo.hidden =
    true;

  ANALYSIS_DOM.uploadedImage.hidden =
    true;


  ANALYSIS_DOM.viewerPlaceholder
    ?.classList.add(
      "hidden"
    );


  video.onloadedmetadata =
    () => {

      video.playbackRate =
        Number(
          ANALYSIS_DOM
            .playbackSpeed
            ?.value || 1
        );


      analyzeUploadedVideo();

    };


  if (
    typeof showToast ===
    "function"
  ) {

    showToast(
      "분석 영상을 불러왔습니다."
    );

  }

}


/* =========================================================
   14. VIDEO ANALYSIS LOOP
========================================================= */

function analyzeUploadedVideo() {

  const video =
    ANALYSIS_DOM.uploadedVideo;


  cancelAnimationFrame(
    MOTION_STATE.animationFrame
  );


  const loop =
    async () => {

      if (
        video.hidden ||
        video.ended
      ) {

        return;

      }


      if (
        video.readyState >= 2 &&
        !video.paused &&
        !MOTION_STATE.frameBusy
      ) {

        MOTION_STATE.frameBusy =
          true;


        try {

          await MOTION_STATE.pose.send({

            image: video

          });

        }

        catch (error) {

          console.error(
            error
          );

        }

        finally {

          MOTION_STATE.frameBusy =
            false;

        }

      }


      MOTION_STATE.animationFrame =
        requestAnimationFrame(
          loop
        );

    };


  loop();

}


/* =========================================================
   15. IMAGE UPLOAD
========================================================= */

function handleImageUpload(event) {

  const file =
    event.target.files?.[0];


  if (!file) {
    return;
  }


  stopCameraStream();


  MOTION_STATE.sourceType =
    "image";


  const image =
    ANALYSIS_DOM.uploadedImage;


  const url =
    URL.createObjectURL(
      file
    );


  image.src =
    url;


  image.hidden =
    false;


  ANALYSIS_DOM.cameraVideo.hidden =
    true;

  ANALYSIS_DOM.uploadedVideo.hidden =
    true;


  ANALYSIS_DOM.viewerPlaceholder
    ?.classList.add(
      "hidden"
    );


  image.onload =
    async () => {

      if (
        !MOTION_STATE.pose
      ) {
        return;
      }


      try {

        await MOTION_STATE.pose.send({

          image: image

        });

      }

      catch (error) {

        console.error(
          "Image analysis error:",
          error
        );

      }

    };


  if (
    typeof showToast ===
    "function"
  ) {

    showToast(
      "사진 분석을 시작합니다."
    );

  }

}


/* =========================================================
   16. PLAYBACK
========================================================= */

function toggleUploadedVideoPlayback() {

  const video =
    ANALYSIS_DOM.uploadedVideo;


  if (
    !video ||
    video.hidden
  ) {
    return;
  }


  if (
    video.paused
  ) {

    video.play();

    analyzeUploadedVideo();

  }

  else {

    video.pause();

  }

}


/* =========================================================
   17. FRAME CONTROL

   일반 영상은 정확한 원본 FPS 정보를 브라우저에서
   항상 제공하지 않기 때문에 기본 30fps 기준.
========================================================= */

function moveVideoFrame(direction) {

  const video =
    ANALYSIS_DOM.uploadedVideo;


  if (
    !video ||
    video.hidden
  ) {
    return;
  }


  video.pause();


  const assumedFPS =
    30;


  const frameDuration =
    1 / assumedFPS;


  video.currentTime =
    Math.max(

      0,

      Math.min(

        video.duration || Infinity,

        video.currentTime +
        direction *
        frameDuration

      )

    );


  video.addEventListener(

    "seeked",

    analyzeCurrentVideoFrame,

    {
      once: true
    }

  );

}


/* =========================================================
   18. ANALYZE CURRENT VIDEO FRAME
========================================================= */

async function analyzeCurrentVideoFrame() {

  const video =
    ANALYSIS_DOM.uploadedVideo;


  if (
    !MOTION_STATE.pose ||
    !video
  ) {
    return;
  }


  try {

    await MOTION_STATE.pose.send({

      image: video

    });

  }

  catch (error) {

    console.error(
      error
    );

  }

}


/* =========================================================
   19. ANALYSIS START
========================================================= */

function startMotionAnalysis() {

  const exerciseId =
    ANALYSIS_DOM.analysisExercise
      ?.value;


  if (!exerciseId) {

    if (
      typeof showToast ===
      "function"
    ) {

      showToast(
        "분석할 운동을 먼저 선택하세요."
      );

    }

    return;

  }


  const hasSource =

    MOTION_STATE.cameraConnected ||

    (
      ANALYSIS_DOM.uploadedVideo &&
      !ANALYSIS_DOM.uploadedVideo.hidden
    ) ||

    (
      ANALYSIS_DOM.uploadedImage &&
      !ANALYSIS_DOM.uploadedImage.hidden
    );


  if (!hasSource) {

    if (
      typeof showToast ===
      "function"
    ) {

      showToast(
        "카메라를 연결하거나 영상을 업로드하세요."
      );

    }

    return;

  }


  MOTION_STATE.running =
    true;


  MOTION_STATE.repCount =
    0;


  MOTION_STATE.movementPhase =
    "ready";


  MOTION_STATE.previousPhase =
    "ready";


  MOTION_STATE.angleHistory = {

    knee: [],

    hip: [],

    ankle: [],

    trunk: []

  };


  MOTION_STATE.barPath =
    [];


  MOTION_STATE.startTime =
    Date.now();


  MOTION_STATE.targetReps =
    Number(
      ANALYSIS_DOM.targetReps
        ?.value || 10
    );


  updateRepDisplay();


  startAnalysisTimer();


  updateAnalysisStatus(
    "LIVE ANALYSIS",
    true
  );


  if (
    ANALYSIS_DOM.liveStatusBadge
  ) {

    ANALYSIS_DOM
      .liveStatusBadge
      .textContent =
      "● LIVE";


    ANALYSIS_DOM
      .liveStatusBadge
      .classList.remove(
        "standby"
      );

  }


  if (
    typeof showToast ===
    "function"
  ) {

    showToast(
      "자세 분석을 시작합니다."
    );

  }

}


/* =========================================================
   20. ANALYSIS STOP
========================================================= */

function stopMotionAnalysis() {

  MOTION_STATE.running =
    false;


  stopAnalysisTimer();


  updateAnalysisStatus(
    "ANALYSIS COMPLETE",
    false
  );


  if (
    ANALYSIS_DOM.liveStatusBadge
  ) {

    ANALYSIS_DOM
      .liveStatusBadge
      .textContent =
      "● STANDBY";


    ANALYSIS_DOM
      .liveStatusBadge
      .classList.add(
        "standby"
      );

  }


  generateTrainingRecommendations();


  saveCurrentAnalysis();


  if (
    typeof showToast ===
    "function"
  ) {

    showToast(
      "분석이 완료되었습니다."
    );

  }

}


/* =========================================================
   21. TIMER
========================================================= */

function startAnalysisTimer() {

  stopAnalysisTimer();


  MOTION_STATE.timerInterval =
    setInterval(
      () => {

        MOTION_STATE.elapsed =
          Date.now() -
          MOTION_STATE.startTime;


        const seconds =
          Math.floor(
            MOTION_STATE.elapsed /
            1000
          );


        const min =
          String(
            Math.floor(
              seconds / 60
            )
          ).padStart(
            2,
            "0"
          );


        const sec =
          String(
            seconds % 60
          ).padStart(
            2,
            "0"
          );


        if (
          ANALYSIS_DOM.timer
        ) {

          ANALYSIS_DOM
            .timer
            .textContent =
            `${min}:${sec}`;

        }

      },

      250
    );

}


/* =========================================================
   22. TIMER STOP
========================================================= */

function stopAnalysisTimer() {

  if (
    MOTION_STATE.timerInterval
  ) {

    clearInterval(
      MOTION_STATE.timerInterval
    );

  }


  MOTION_STATE.timerInterval =
    null;

}


/* =========================================================
   23. ANALYSIS STATUS
========================================================= */

function updateAnalysisStatus(
  text,
  live
) {

  if (
    ANALYSIS_DOM.engineStatus
  ) {

    ANALYSIS_DOM
      .engineStatus
      .textContent =
      text;

  }


  const badge =
    ANALYSIS_DOM.liveStatusBadge;


  if (
    badge &&
    live
  ) {

    badge.classList.remove(
      "standby"
    );

  }

}


/* =========================================================
   24. VIEW MODE
========================================================= */

function updateViewMode() {

  const viewNames = {

    front: "정면",

    side: "측면",

    rear: "후면",

    top: "상단"

  };


  const exercise =
    getCurrentAnalysisExercise();


  if (
    ANALYSIS_DOM.motionTitle
  ) {

    ANALYSIS_DOM
      .motionTitle
      .textContent =

      `${exercise?.name || "자세 분석"} · ` +

      `${viewNames[MOTION_STATE.view]}`;

  }


  updateExerciseCheckpoints();

}


/* =========================================================
   25. 2D / 3D MODE
========================================================= */

function updateAnalysisMode() {

  if (
    typeof showToast !==
    "function"
  ) {
    return;
  }


  if (
    MOTION_STATE.mode ===
    "3d"
  ) {

    showToast(
      "3D 관절 좌표 추정 모드"
    );

  }

  else {

    showToast(
      "2D 영상 분석 모드"
    );

  }

}


/* =========================================================
   PART 1 END

   NEXT:
   - Pose result rendering
   - 33 joint skeleton
   - landmark drawing
   - angle calculation
   - knee / hip / ankle / trunk
   - symmetry
   - 3D coordinate processing
========================================================= */
/* =========================================================
   SEOLCHEON HIGH SCHOOL
   WEIGHT PERFORMANCE LAB

   ANALYSIS.JS
   PART 2 / 3

   POSE / BIOMECHANICS ENGINE
   ---------------------------------------------------------
   - MediaPipe 33 Joint Motion Capture
   - Skeleton Rendering
   - 2D / 3D Landmark Processing
   - Joint Angle Calculation
   - Knee / Hip / Ankle / Trunk
   - Shoulder / Elbow
   - Symmetry Analysis
   - ROM
   - Stability
   - Technique Score
   - Angle Labels
   - Reference Points
========================================================= */


/* =========================================================
   26. MEDIAPIPE RESULT
========================================================= */

function handlePoseResults(results) {

  MOTION_STATE.lastResults =
    results;


  if (
    !results ||
    !results.poseLandmarks
  ) {

    clearPoseCanvas();

    return;

  }


  const landmarks =
    results.poseLandmarks;


  MOTION_STATE.lastLandmarks =
    landmarks;


  /* -----------------------------------------
     1. DRAW SKELETON
  ----------------------------------------- */

  drawPoseSkeleton(
    landmarks
  );


  /* -----------------------------------------
     2. CALCULATE ANGLES
  ----------------------------------------- */

  const angles =
    calculateAllJointAngles(
      landmarks
    );


  MOTION_STATE.currentAngles =
    angles;


  /* -----------------------------------------
     3. PERFORMANCE METRICS
  ----------------------------------------- */

  calculateBiomechanics(
    landmarks,
    angles
  );


  /* -----------------------------------------
     4. UPDATE UI
  ----------------------------------------- */

  updateLiveAngleDisplay(
    angles
  );


  updateBiomechanicsDisplay();


  /* -----------------------------------------
     5. RUNNING ANALYSIS
  ----------------------------------------- */

  if (
    MOTION_STATE.running
  ) {

    MOTION_STATE.frameCounter++;


    detectExerciseRepetition(
      landmarks,
      angles
    );


    updateAngleHistory(
      angles
    );


    trackBarPath(
      landmarks
    );


    updatePoseScore(
      landmarks,
      angles
    );

  }

}


/* =========================================================
   27. CLEAR POSE CANVAS
========================================================= */

function clearPoseCanvas() {

  const canvas =
    ANALYSIS_DOM.poseCanvas;


  if (!canvas) {
    return;
  }


  const ctx =
    canvas.getContext("2d");


  ctx.clearRect(
    0,
    0,
    canvas.width,
    canvas.height
  );

}


/* =========================================================
   28. REDRAW LAST POSE
========================================================= */

function redrawLastPose() {

  if (
    MOTION_STATE.lastLandmarks
  ) {

    drawPoseSkeleton(
      MOTION_STATE.lastLandmarks
    );

  }

}


/* =========================================================
   29. LANDMARK -> CANVAS POSITION
========================================================= */

function landmarkToCanvas(
  landmark,
  canvas
) {

  if (
    !landmark ||
    !canvas
  ) {

    return {
      x: 0,
      y: 0
    };

  }


  return {

    x:
      landmark.x *
      canvas.width,

    y:
      landmark.y *
      canvas.height

  };

}


/* =========================================================
   30. LANDMARK VISIBILITY
========================================================= */

function isLandmarkVisible(
  landmark,
  threshold = 0.35
) {

  if (!landmark) {
    return false;
  }


  if (
    landmark.visibility ===
    undefined
  ) {

    return true;

  }


  return (
    landmark.visibility >=
    threshold
  );

}


/* =========================================================
   31. DRAW COMPLETE 33-JOINT SKELETON
========================================================= */

function drawPoseSkeleton(
  landmarks
) {

  const canvas =
    ANALYSIS_DOM.poseCanvas;


  if (
    !canvas ||
    !landmarks
  ) {
    return;
  }


  const ctx =
    canvas.getContext("2d");


  ctx.clearRect(
    0,
    0,
    canvas.width,
    canvas.height
  );


  if (
    !MOTION_STATE.skeletonVisible
  ) {

    if (
      MOTION_STATE.anglesVisible
    ) {

      drawJointAngleLabels(
        landmarks
      );

    }

    return;

  }


  ctx.save();


  /* =======================================================
     CONNECTION LINES
  ======================================================= */

  ctx.lineWidth =
    Math.max(
      4,
      canvas.width * 0.003
    );


  ctx.lineCap =
    "round";


  ctx.lineJoin =
    "round";


  ctx.strokeStyle =
    "rgba(50, 245, 224, 0.95)";


  ctx.shadowColor =
    "rgba(20, 240, 220, 0.75)";


  ctx.shadowBlur =
    10;


  SKELETON_CONNECTIONS
    .forEach(
      connection => {

        const [
          startIndex,
          endIndex
        ] = connection;


        const start =
          landmarks[startIndex];


        const end =
          landmarks[endIndex];


        if (
          !isLandmarkVisible(start) ||
          !isLandmarkVisible(end)
        ) {

          return;

        }


        const p1 =
          landmarkToCanvas(
            start,
            canvas
          );


        const p2 =
          landmarkToCanvas(
            end,
            canvas
          );


        ctx.beginPath();

        ctx.moveTo(
          p1.x,
          p1.y
        );

        ctx.lineTo(
          p2.x,
          p2.y
        );

        ctx.stroke();

      }
    );


  /* =======================================================
     33 LANDMARK POINTS
  ======================================================= */

  landmarks.forEach(
    (
      landmark,
      index
    ) => {

      if (
        !isLandmarkVisible(
          landmark
        )
      ) {
        return;
      }


      const point =
        landmarkToCanvas(
          landmark,
          canvas
        );


      const isMajorJoint =
        [

          11, 12,

          13, 14,

          15, 16,

          23, 24,

          25, 26,

          27, 28

        ].includes(index);


      const radius =
        isMajorJoint
          ? Math.max(
              8,
              canvas.width * 0.006
            )
          : Math.max(
              4,
              canvas.width * 0.0035
            );


      ctx.beginPath();


      ctx.arc(
        point.x,
        point.y,
        radius,
        0,
        Math.PI * 2
      );


      ctx.fillStyle =
        isMajorJoint
          ? "#35ffe1"
          : "#8affef";


      ctx.fill();


      ctx.lineWidth =
        Math.max(
          2,
          canvas.width * 0.0015
        );


      ctx.strokeStyle =
        "rgba(0, 40, 50, 0.95)";


      ctx.stroke();

    }
  );


  ctx.restore();


  /* =======================================================
     JOINT ANGLE GRAPHICS
  ======================================================= */

  if (
    MOTION_STATE.anglesVisible
  ) {

    drawJointAngleLabels(
      landmarks
    );

  }


  /* =======================================================
     CENTER OF BODY
  ======================================================= */

  drawBodyCenter(
    landmarks
  );

}


/* =========================================================
   32. BODY CENTER
========================================================= */

function drawBodyCenter(
  landmarks
) {

  const canvas =
    ANALYSIS_DOM.poseCanvas;


  if (!canvas) {
    return;
  }


  const leftHip =
    landmarks[
      POSE_POINT.LEFT_HIP
    ];


  const rightHip =
    landmarks[
      POSE_POINT.RIGHT_HIP
    ];


  if (
    !leftHip ||
    !rightHip
  ) {
    return;
  }


  const center = {

    x:
      (
        leftHip.x +
        rightHip.x
      ) / 2,

    y:
      (
        leftHip.y +
        rightHip.y
      ) / 2

  };


  const point =
    landmarkToCanvas(
      center,
      canvas
    );


  const ctx =
    canvas.getContext("2d");


  ctx.save();


  ctx.beginPath();


  ctx.arc(
    point.x,
    point.y,
    Math.max(
      7,
      canvas.width * 0.005
    ),
    0,
    Math.PI * 2
  );


  ctx.fillStyle =
    "rgba(255,255,255,0.95)";


  ctx.fill();


  ctx.lineWidth =
    3;


  ctx.strokeStyle =
    "#35ffe1";


  ctx.stroke();


  ctx.restore();

}


/* =========================================================
   33. BASIC ANGLE FUNCTION
========================================================= */

function calculateAngle(
  a,
  b,
  c
) {

  if (
    !a ||
    !b ||
    !c
  ) {

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


  if (
    angle > 180
  ) {

    angle =
      360 -
      angle;

  }


  return angle;

}


/* =========================================================
   34. 3D ANGLE FUNCTION
========================================================= */

function calculateAngle3D(
  a,
  b,
  c
) {

  if (
    !a ||
    !b ||
    !c
  ) {

    return null;

  }


  const ba = {

    x: a.x - b.x,

    y: a.y - b.y,

    z:
      (a.z || 0) -
      (b.z || 0)

  };


  const bc = {

    x: c.x - b.x,

    y: c.y - b.y,

    z:
      (c.z || 0) -
      (b.z || 0)

  };


  const dot =

    ba.x * bc.x +

    ba.y * bc.y +

    ba.z * bc.z;


  const magBA =
    Math.sqrt(

      ba.x * ba.x +

      ba.y * ba.y +

      ba.z * ba.z

    );


  const magBC =
    Math.sqrt(

      bc.x * bc.x +

      bc.y * bc.y +

      bc.z * bc.z

    );


  if (
    magBA === 0 ||
    magBC === 0
  ) {

    return null;

  }


  let cosine =
    dot /
    (
      magBA *
      magBC
    );


  cosine =
    Math.max(
      -1,
      Math.min(
        1,
        cosine
      )
    );


  return (
    Math.acos(cosine) *
    180 /
    Math.PI
  );

}


/* =========================================================
   35. SELECT ANGLE MODE
========================================================= */

function getJointAngle(
  a,
  b,
  c
) {

  if (
    MOTION_STATE.mode ===
    "3d"
  ) {

    return calculateAngle3D(
      a,
      b,
      c
    );

  }


  return calculateAngle(
    a,
    b,
    c
  );

}


/* =========================================================
   36. TRUNK ANGLE
========================================================= */

function calculateTrunkAngle(
  landmarks
) {

  const leftShoulder =
    landmarks[
      POSE_POINT.LEFT_SHOULDER
    ];


  const rightShoulder =
    landmarks[
      POSE_POINT.RIGHT_SHOULDER
    ];


  const leftHip =
    landmarks[
      POSE_POINT.LEFT_HIP
    ];


  const rightHip =
    landmarks[
      POSE_POINT.RIGHT_HIP
    ];


  if (
    !leftShoulder ||
    !rightShoulder ||
    !leftHip ||
    !rightHip
  ) {

    return null;

  }


  const shoulderCenter = {

    x:
      (
        leftShoulder.x +
        rightShoulder.x
      ) / 2,

    y:
      (
        leftShoulder.y +
        rightShoulder.y
      ) / 2,

    z:
      (
        (leftShoulder.z || 0) +
        (rightShoulder.z || 0)
      ) / 2

  };


  const hipCenter = {

    x:
      (
        leftHip.x +
        rightHip.x
      ) / 2,

    y:
      (
        leftHip.y +
        rightHip.y
      ) / 2,

    z:
      (
        (leftHip.z || 0) +
        (rightHip.z || 0)
      ) / 2

  };


  const dx =
    shoulderCenter.x -
    hipCenter.x;


  const dy =
    hipCenter.y -
    shoulderCenter.y;


  let angle =
    Math.atan2(
      Math.abs(dx),
      Math.abs(dy)
    ) *
    180 /
    Math.PI;


  return angle;

}


/* =========================================================
   37. ALL JOINT ANGLES
========================================================= */

function calculateAllJointAngles(
  landmarks
) {

  const L =
    POSE_POINT;


  /* LEFT KNEE */

  const leftKnee =
    getJointAngle(

      landmarks[L.LEFT_HIP],

      landmarks[L.LEFT_KNEE],

      landmarks[L.LEFT_ANKLE]

    );


  /* RIGHT KNEE */

  const rightKnee =
    getJointAngle(

      landmarks[L.RIGHT_HIP],

      landmarks[L.RIGHT_KNEE],

      landmarks[L.RIGHT_ANKLE]

    );


  /* LEFT HIP */

  const leftHip =
    getJointAngle(

      landmarks[
        L.LEFT_SHOULDER
      ],

      landmarks[
        L.LEFT_HIP
      ],

      landmarks[
        L.LEFT_KNEE
      ]

    );


  /* RIGHT HIP */

  const rightHip =
    getJointAngle(

      landmarks[
        L.RIGHT_SHOULDER
      ],

      landmarks[
        L.RIGHT_HIP
      ],

      landmarks[
        L.RIGHT_KNEE
      ]

    );


  /* LEFT ANKLE */

  const leftAnkle =
    getJointAngle(

      landmarks[
        L.LEFT_KNEE
      ],

      landmarks[
        L.LEFT_ANKLE
      ],

      landmarks[
        L.LEFT_FOOT
      ]

    );


  /* RIGHT ANKLE */

  const rightAnkle =
    getJointAngle(

      landmarks[
        L.RIGHT_KNEE
      ],

      landmarks[
        L.RIGHT_ANKLE
      ],

      landmarks[
        L.RIGHT_FOOT
      ]

    );


  /* LEFT ELBOW */

  const leftElbow =
    getJointAngle(

      landmarks[
        L.LEFT_SHOULDER
      ],

      landmarks[
        L.LEFT_ELBOW
      ],

      landmarks[
        L.LEFT_WRIST
      ]

    );


  /* RIGHT ELBOW */

  const rightElbow =
    getJointAngle(

      landmarks[
        L.RIGHT_SHOULDER
      ],

      landmarks[
        L.RIGHT_ELBOW
      ],

      landmarks[
        L.RIGHT_WRIST
      ]

    );


  /* LEFT SHOULDER */

  const leftShoulder =
    getJointAngle(

      landmarks[
        L.LEFT_ELBOW
      ],

      landmarks[
        L.LEFT_SHOULDER
      ],

      landmarks[
        L.LEFT_HIP
      ]

    );


  /* RIGHT SHOULDER */

  const rightShoulder =
    getJointAngle(

      landmarks[
        L.RIGHT_ELBOW
      ],

      landmarks[
        L.RIGHT_SHOULDER
      ],

      landmarks[
        L.RIGHT_HIP
      ]

    );


  /* TRUNK */

  const trunk =
    calculateTrunkAngle(
      landmarks
    );


  return {

    leftKnee,

    rightKnee,

    knee:
      averageValidAngles(
        leftKnee,
        rightKnee
      ),


    leftHip,

    rightHip,

    hip:
      averageValidAngles(
        leftHip,
        rightHip
      ),


    leftAnkle,

    rightAnkle,

    ankle:
      averageValidAngles(
        leftAnkle,
        rightAnkle
      ),


    leftElbow,

    rightElbow,


    leftShoulder,

    rightShoulder,


    trunk

  };

}


/* =========================================================
   38. AVERAGE VALID ANGLES
========================================================= */

function averageValidAngles(
  a,
  b
) {

  if (
    Number.isFinite(a) &&
    Number.isFinite(b)
  ) {

    return (
      a + b
    ) / 2;

  }


  if (
    Number.isFinite(a)
  ) {

    return a;

  }


  if (
    Number.isFinite(b)
  ) {

    return b;

  }


  return null;

}


/* =========================================================
   39. DRAW JOINT ANGLE LABELS
========================================================= */

function drawJointAngleLabels(
  landmarks
) {

  const canvas =
    ANALYSIS_DOM.poseCanvas;


  if (
    !canvas ||
    !landmarks
  ) {
    return;
  }


  const ctx =
    canvas.getContext("2d");


  const angles =
    MOTION_STATE.currentAngles;


  if (!angles) {
    return;
  }


  const labels = [

    {

      point:
        POSE_POINT.LEFT_KNEE,

      value:
        angles.leftKnee,

      name:
        "KNEE"

    },

    {

      point:
        POSE_POINT.LEFT_HIP,

      value:
        angles.leftHip,

      name:
        "HIP"

    },

    {

      point:
        POSE_POINT.LEFT_ANKLE,

      value:
        angles.leftAnkle,

      name:
        "ANKLE"

    },

    {

      point:
        POSE_POINT.LEFT_ELBOW,

      value:
        angles.leftElbow,

      name:
        "ELBOW"

    }

  ];


  ctx.save();


  labels.forEach(
    item => {

      if (
        !Number.isFinite(
          item.value
        )
      ) {
        return;
      }


      const landmark =
        landmarks[item.point];


      if (
        !isLandmarkVisible(
          landmark
        )
      ) {
        return;
      }


      const point =
        landmarkToCanvas(
          landmark,
          canvas
        );


      const text =
        `${Math.round(item.value)}°`;


      const fontSize =
        Math.max(
          15,
          canvas.width * 0.012
        );


      ctx.font =
        `700 ${fontSize}px Arial`;


      const metrics =
        ctx.measureText(text);


      const padding =
        fontSize * 0.55;


      const width =
        metrics.width +
        padding * 2;


      const height =
        fontSize * 1.8;


      const x =
        point.x +
        18;


      const y =
        point.y -
        height / 2;


      ctx.fillStyle =
        "rgba(3, 21, 33, 0.90)";


      roundedCanvasRect(

        ctx,

        x,

        y,

        width,

        height,

        10

      );


      ctx.fill();


      ctx.fillStyle =
        "#45ffe1";


      ctx.textBaseline =
        "middle";


      ctx.fillText(

        text,

        x + padding,

        y + height / 2

      );

    }
  );


  ctx.restore();

}


/* =========================================================
   40. ROUNDED CANVAS RECT
========================================================= */

function roundedCanvasRect(
  ctx,
  x,
  y,
  width,
  height,
  radius
) {

  radius =
    Math.min(
      radius,
      width / 2,
      height / 2
    );


  ctx.beginPath();


  ctx.moveTo(
    x + radius,
    y
  );


  ctx.lineTo(
    x + width - radius,
    y
  );


  ctx.quadraticCurveTo(
    x + width,
    y,
    x + width,
    y + radius
  );


  ctx.lineTo(
    x + width,
    y + height - radius
  );


  ctx.quadraticCurveTo(
    x + width,
    y + height,
    x + width - radius,
    y + height
  );


  ctx.lineTo(
    x + radius,
    y + height
  );


  ctx.quadraticCurveTo(
    x,
    y + height,
    x,
    y + height - radius
  );


  ctx.lineTo(
    x,
    y + radius
  );


  ctx.quadraticCurveTo(
    x,
    y,
    x + radius,
    y
  );


  ctx.closePath();

}


/* =========================================================
   41. FORMAT ANGLE
========================================================= */

function formatAngle(
  angle
) {

  if (
    !Number.isFinite(angle)
  ) {

    return "-°";

  }


  return (
    Math.round(angle) +
    "°"
  );

}


/* =========================================================
   42. LIVE ANGLE DISPLAY
========================================================= */

function updateLiveAngleDisplay(
  angles
) {

  if (!angles) {
    return;
  }


  const knee =
    formatAngle(
      angles.knee
    );


  const hip =
    formatAngle(
      angles.hip
    );


  const ankle =
    formatAngle(
      angles.ankle
    );


  const trunk =
    formatAngle(
      angles.trunk
    );


  if (
    ANALYSIS_DOM.kneeAngle
  ) {

    ANALYSIS_DOM
      .kneeAngle
      .textContent =
      knee;

  }


  if (
    ANALYSIS_DOM.hipAngle
  ) {

    ANALYSIS_DOM
      .hipAngle
      .textContent =
      hip;

  }


  if (
    ANALYSIS_DOM.ankleAngle
  ) {

    ANALYSIS_DOM
      .ankleAngle
      .textContent =
      ankle;

  }


  if (
    ANALYSIS_DOM.trunkAngle
  ) {

    ANALYSIS_DOM
      .trunkAngle
      .textContent =
      trunk;

  }


  if (
    ANALYSIS_DOM.liveKnee
  ) {

    ANALYSIS_DOM
      .liveKnee
      .textContent =
      knee;

  }


  if (
    ANALYSIS_DOM.liveHip
  ) {

    ANALYSIS_DOM
      .liveHip
      .textContent =
      hip;

  }


  if (
    ANALYSIS_DOM.liveAnkle
  ) {

    ANALYSIS_DOM
      .liveAnkle
      .textContent =
      ankle;

  }


  if (
    ANALYSIS_DOM.liveTrunk
  ) {

    ANALYSIS_DOM
      .liveTrunk
      .textContent =
      trunk;

  }

}


/* =========================================================
   43. BIOMECHANICS
========================================================= */

function calculateBiomechanics(
  landmarks,
  angles
) {

  if (
    !landmarks ||
    !angles
  ) {
    return;
  }


  MOTION_STATE.symmetry =
    calculateSymmetry(
      landmarks,
      angles
    );


  MOTION_STATE.rom =
    calculateCurrentROM();


  MOTION_STATE.stability =
    calculateStability(
      landmarks
    );


  MOTION_STATE.mobility =
    calculateMobility(
      angles
    );


  MOTION_STATE.technique =
    calculateTechniqueScore(
      landmarks,
      angles
    );

}


/* =========================================================
   44. SYMMETRY ANALYSIS
========================================================= */

function calculateSymmetry(
  landmarks,
  angles
) {

  const differences =
    [];


  const addDifference =
    (
      left,
      right,
      maxDifference
    ) => {

      if (
        Number.isFinite(left) &&
        Number.isFinite(right)
      ) {

        const diff =
          Math.abs(
            left -
            right
          );


        differences.push(

          Math.max(
            0,
            100 -
            (
              diff /
              maxDifference
            ) *
            100
          )

        );

      }

    };


  addDifference(

    angles.leftKnee,

    angles.rightKnee,

    30

  );


  addDifference(

    angles.leftHip,

    angles.rightHip,

    30

  );


  addDifference(

    angles.leftAnkle,

    angles.rightAnkle,

    25

  );


  addDifference(

    angles.leftShoulder,

    angles.rightShoulder,

    30

  );


  addDifference(

    angles.leftElbow,

    angles.rightElbow,

    30

  );


  if (
    differences.length ===
    0
  ) {

    return 0;

  }


  const score =

    differences.reduce(
      (
        sum,
        value
      ) =>
        sum + value,

      0
    )

    /

    differences.length;


  return clampScore(
    score
  );

}


/* =========================================================
   45. CURRENT ROM
========================================================= */

function calculateCurrentROM() {

  const kneeHistory =
    MOTION_STATE
      .angleHistory
      .knee;


  if (
    kneeHistory.length <
    2
  ) {

    return 0;

  }


  const values =
    kneeHistory.filter(
      Number.isFinite
    );


  if (
    values.length <
    2
  ) {

    return 0;

  }


  return (

    Math.max(...values) -

    Math.min(...values)

  );

}


/* =========================================================
   46. STABILITY
========================================================= */

function calculateStability(
  landmarks
) {

  const leftHip =
    landmarks[
      POSE_POINT.LEFT_HIP
    ];


  const rightHip =
    landmarks[
      POSE_POINT.RIGHT_HIP
    ];


  const leftShoulder =
    landmarks[
      POSE_POINT.LEFT_SHOULDER
    ];


  const rightShoulder =
    landmarks[
      POSE_POINT.RIGHT_SHOULDER
    ];


  if (
    !leftHip ||
    !rightHip ||
    !leftShoulder ||
    !rightShoulder
  ) {

    return 0;

  }


  const hipTilt =
    Math.abs(
      leftHip.y -
      rightHip.y
    );


  const shoulderTilt =
    Math.abs(
      leftShoulder.y -
      rightShoulder.y
    );


  const penalty =
    (
      hipTilt * 350
    ) +
    (
      shoulderTilt * 300
    );


  return clampScore(
    100 -
    penalty
  );

}


/* =========================================================
   47. MOBILITY
========================================================= */

function calculateMobility(
  angles
) {

  let score =
    100;


  if (
    Number.isFinite(
      angles.ankle
    )
  ) {

    const ankleDeviation =
      Math.abs(
        angles.ankle -
        90
      );


    score -=
      Math.max(
        0,
        ankleDeviation -
        30
      ) *
      0.35;

  }


  if (
    Number.isFinite(
      angles.hip
    )
  ) {

    if (
      angles.hip >
      175
    ) {

      score -= 5;

    }

  }


  return clampScore(
    score
  );

}


/* =========================================================
   48. TECHNIQUE SCORE
========================================================= */

function calculateTechniqueScore(
  landmarks,
  angles
) {

  const exercise =
    getCurrentAnalysisExercise();


  let score =
    100;


  /* -----------------------------------------
     GENERAL TRUNK CONTROL
  ----------------------------------------- */

  if (
    Number.isFinite(
      angles.trunk
    )
  ) {

    if (
      angles.trunk >
      60
    ) {

      score -=
        (
          angles.trunk -
          60
        ) *
        0.6;

    }

  }


  /* -----------------------------------------
     SYMMETRY
  ----------------------------------------- */

  score -=
    (
      100 -
      MOTION_STATE.symmetry
    ) *
    0.25;


  /* -----------------------------------------
     STABILITY
  ----------------------------------------- */

  score -=
    (
      100 -
      MOTION_STATE.stability
    ) *
    0.20;


  /* -----------------------------------------
     EXERCISE SPECIFIC
  ----------------------------------------- */

  const exerciseName =
    (
      exercise?.name ||
      ""
    ).toLowerCase();


  if (
    exerciseName.includes(
      "스쿼트"
    ) ||
    exerciseName.includes(
      "squat"
    )
  ) {

    score =
      evaluateSquatTechnique(
        score,
        landmarks,
        angles
      );

  }


  if (
    exerciseName.includes(
      "데드리프트"
    ) ||
    exerciseName.includes(
      "deadlift"
    )
  ) {

    score =
      evaluateDeadliftTechnique(
        score,
        angles
      );

  }


  if (
    exerciseName.includes(
      "런지"
    ) ||
    exerciseName.includes(
      "lunge"
    )
  ) {

    score =
      evaluateLungeTechnique(
        score,
        angles
      );

  }


  return clampScore(
    score
  );

}


/* =========================================================
   49. SQUAT TECHNIQUE
========================================================= */

function evaluateSquatTechnique(
  score,
  landmarks,
  angles
) {

  if (
    Number.isFinite(
      angles.knee
    )
  ) {

    if (
      angles.knee <
      45
    ) {

      score -= 5;

    }

  }


  if (
    Number.isFinite(
      angles.trunk
    )
  ) {

    if (
      angles.trunk >
      55
    ) {

      score -=
        (
          angles.trunk -
          55
        ) *
        0.5;

    }

  }


  return score;

}


/* =========================================================
   50. DEADLIFT TECHNIQUE
========================================================= */

function evaluateDeadliftTechnique(
  score,
  angles
) {

  if (
    Number.isFinite(
      angles.trunk
    )
  ) {

    if (
      angles.trunk >
      70
    ) {

      score -= 8;

    }

  }


  if (
    Number.isFinite(
      angles.leftHip
    ) &&
    Number.isFinite(
      angles.rightHip
    )
  ) {

    const diff =
      Math.abs(
        angles.leftHip -
        angles.rightHip
      );


    score -=
      Math.min(
        10,
        diff * 0.4
      );

  }


  return score;

}


/* =========================================================
   51. LUNGE TECHNIQUE
========================================================= */

function evaluateLungeTechnique(
  score,
  angles
) {

  if (
    Number.isFinite(
      angles.trunk
    ) &&
    angles.trunk >
    35
  ) {

    score -=
      (
        angles.trunk -
        35
      ) *
      0.4;

  }


  return score;

}


/* =========================================================
   52. CLAMP SCORE
========================================================= */

function clampScore(
  value
) {

  if (
    !Number.isFinite(value)
  ) {

    return 0;

  }


  return Math.round(

    Math.max(
      0,
      Math.min(
        100,
        value
      )
    )

  );

}


/* =========================================================
   53. UPDATE BIOMECHANICS UI
========================================================= */

function updateBiomechanicsDisplay() {

  if (
    ANALYSIS_DOM.liveSymmetry
  ) {

    ANALYSIS_DOM
      .liveSymmetry
      .textContent =
      MOTION_STATE.symmetry;

  }


  if (
    ANALYSIS_DOM.liveROM
  ) {

    ANALYSIS_DOM
      .liveROM
      .textContent =
      Math.round(
        MOTION_STATE.rom
      ) + "°";

  }


  if (
    ANALYSIS_DOM.liveStability
  ) {

    ANALYSIS_DOM
      .liveStability
      .textContent =
      MOTION_STATE.stability;

  }


  if (
    ANALYSIS_DOM.liveTechnique
  ) {

    ANALYSIS_DOM
      .liveTechnique
      .textContent =
      MOTION_STATE.technique;

  }

}


/* =========================================================
   54. POSE SCORE
========================================================= */

function updatePoseScore(
  landmarks,
  angles
) {

  const symmetry =
    MOTION_STATE.symmetry;


  const stability =
    MOTION_STATE.stability;


  const technique =
    MOTION_STATE.technique;


  const mobility =
    MOTION_STATE.mobility;


  const score =

    symmetry *
    0.20

    +

    stability *
    0.20

    +

    technique *
    0.45

    +

    mobility *
    0.15;


  MOTION_STATE.poseScore =
    clampScore(
      score
    );


  if (
    ANALYSIS_DOM.poseScore
  ) {

    ANALYSIS_DOM
      .poseScore
      .textContent =
      MOTION_STATE.poseScore;

  }

}


/* =========================================================
   55. ANGLE HISTORY
========================================================= */

function updateAngleHistory(
  angles
) {

  const maxHistory =
    600;


  const addValue =
    (
      key,
      value
    ) => {

      if (
        !Number.isFinite(value)
      ) {
        return;
      }


      MOTION_STATE
        .angleHistory[key]
        .push(value);


      if (
        MOTION_STATE
          .angleHistory[key]
          .length >
        maxHistory
      ) {

        MOTION_STATE
          .angleHistory[key]
          .shift();

      }

    };


  addValue(
    "knee",
    angles.knee
  );


  addValue(
    "hip",
    angles.hip
  );


  addValue(
    "ankle",
    angles.ankle
  );


  addValue(
    "trunk",
    angles.trunk
  );


  MOTION_STATE.rom =
    calculateCurrentROM();


  updateAngleChart();

}


/* =========================================================
   56. REP DETECTION
========================================================= */

function detectExerciseRepetition(
  landmarks,
  angles
) {

  const exercise =
    getCurrentAnalysisExercise();


  if (!exercise) {
    return;
  }


  const name =
    (
      exercise.name ||
      ""
    ).toLowerCase();


  /* =======================================================
     SQUAT / LUNGE / LEG PRESS STYLE
  ======================================================= */

  if (

    name.includes("스쿼트") ||

    name.includes("squat") ||

    name.includes("런지") ||

    name.includes("lunge")

  ) {

    detectKneeDominantRep(
      angles
    );

    return;

  }


  /* =======================================================
     DEADLIFT / RDL / GOOD MORNING
  ======================================================= */

  if (

    name.includes("데드") ||

    name.includes("deadlift") ||

    name.includes("루마니안") ||

    name.includes("rdl")

  ) {

    detectHipDominantRep(
      angles
    );

    return;

  }


  /* =======================================================
     PRESS / CURL
  ======================================================= */

  if (

    name.includes("프레스") ||

    name.includes("press") ||

    name.includes("컬") ||

    name.includes("curl")

  ) {

    detectUpperBodyRep(
      angles
    );

    return;

  }


  /* DEFAULT */

  detectGenericRep(
    angles
  );

}


/* =========================================================
   57. KNEE DOMINANT REP
========================================================= */

function detectKneeDominantRep(
  angles
) {

  const knee =
    angles.knee;


  if (
    !Number.isFinite(knee)
  ) {
    return;
  }


  if (
    knee <
    115
  ) {

    MOTION_STATE.movementPhase =
      "down";

  }


  if (

    knee >
    155 &&

    MOTION_STATE
      .movementPhase ===
      "down"

  ) {

    registerRep();


    MOTION_STATE.movementPhase =
      "up";

  }

}


/* =========================================================
   58. HIP DOMINANT REP
========================================================= */

function detectHipDominantRep(
  angles
) {

  const hip =
    angles.hip;


  if (
    !Number.isFinite(hip)
  ) {
    return;
  }


  if (
    hip <
    120
  ) {

    MOTION_STATE.movementPhase =
      "down";

  }


  if (

    hip >
    160 &&

    MOTION_STATE
      .movementPhase ===
      "down"

  ) {

    registerRep();


    MOTION_STATE.movementPhase =
      "up";

  }

}


/* =========================================================
   59. UPPER BODY REP
========================================================= */

function detectUpperBodyRep(
  angles
) {

  const elbow =
    averageValidAngles(

      angles.leftElbow,

      angles.rightElbow

    );


  if (
    !Number.isFinite(elbow)
  ) {
    return;
  }


  if (
    elbow <
    95
  ) {

    MOTION_STATE.movementPhase =
      "flexed";

  }


  if (

    elbow >
    150 &&

    MOTION_STATE
      .movementPhase ===
      "flexed"

  ) {

    registerRep();


    MOTION_STATE.movementPhase =
      "extended";

  }

}


/* =========================================================
   60. GENERIC REP
========================================================= */

function detectGenericRep(
  angles
) {

  const knee =
    angles.knee;


  if (
    !Number.isFinite(knee)
  ) {
    return;
  }


  if (
    knee <
    120
  ) {

    MOTION_STATE.movementPhase =
      "down";

  }


  if (

    knee >
    155 &&

    MOTION_STATE
      .movementPhase ===
      "down"

  ) {

    registerRep();


    MOTION_STATE.movementPhase =
      "up";

  }

}


/* =========================================================
   61. REGISTER REP
========================================================= */

function registerRep() {

  MOTION_STATE.repCount++;


  updateRepDisplay();


  calculateTempo();


  if (

    MOTION_STATE.repCount >=
    MOTION_STATE.targetReps

  ) {

    if (
      typeof showToast ===
      "function"
    ) {

      showToast(
        "목표 반복 횟수를 달성했습니다."
      );

    }

  }

}


/* =========================================================
   62. REP DISPLAY
========================================================= */

function updateRepDisplay() {

  if (
    ANALYSIS_DOM.currentRepCount
  ) {

    ANALYSIS_DOM
      .currentRepCount
      .textContent =
      MOTION_STATE.repCount;

  }


  if (
    ANALYSIS_DOM.targetRepCount
  ) {

    ANALYSIS_DOM
      .targetRepCount
      .textContent =
      MOTION_STATE.targetReps;

  }

}


/* =========================================================
   63. TEMPO
========================================================= */

function calculateTempo() {

  if (
    MOTION_STATE.repCount <= 0
  ) {
    return;
  }


  const seconds =
    (
      Date.now() -
      MOTION_STATE.startTime
    ) /
    1000;


  const average =
    seconds /
    MOTION_STATE.repCount;


  if (
    ANALYSIS_DOM.tempo
  ) {

    ANALYSIS_DOM
      .tempo
      .textContent =
      average.toFixed(1) +
      "s";

  }

}


/* =========================================================
   64. 3D LANDMARK DATA

   MediaPipe의 z 좌표를 이용한 추정 좌표.
   단일 카메라이므로 실제 모션캡처 장비 수준의
   절대 3D 좌표가 아니라 AI 기반 상대 3D 추정값.
========================================================= */

function get3DPoseCoordinates() {

  const landmarks =
    MOTION_STATE.lastLandmarks;


  if (!landmarks) {

    return [];

  }


  return landmarks.map(
    (
      point,
      index
    ) => {

      return {

        id: index,

        x: point.x,

        y: point.y,

        z:
          point.z || 0,

        visibility:
          point.visibility ?? 1

      };

    }
  );

}


/* =========================================================
   65. REFERENCE VISIBILITY
========================================================= */

function updateReferenceVisibility() {

  const visible =
    MOTION_STATE.referenceVisible;


  if (
    ANALYSIS_DOM.referenceVertical
  ) {

    ANALYSIS_DOM
      .referenceVertical
      .style.display =
      visible
        ? ""
        : "none";

  }


  if (
    ANALYSIS_DOM.referenceHorizontal
  ) {

    ANALYSIS_DOM
      .referenceHorizontal
      .style.display =
      visible
        ? ""
        : "none";

  }


  ANALYSIS_DOM
    .toggleReferenceBtn
    ?.classList.toggle(
      "active",
      visible
    );

}


/* =========================================================
   66. GET CURRENT EXERCISE

   exercises.js의 배열 이름이 달라도 최대한 대응.
========================================================= */

function getCurrentAnalysisExercise() {

  const id =
    ANALYSIS_DOM.analysisExercise
      ?.value;


  if (!id) {
    return null;
  }


  const possibleArrays = [

    window.EXERCISES,

    window.exercises,

    window.EXERCISE_DATABASE,

    window.exerciseDatabase

  ];


  for (
    const list of possibleArrays
  ) {

    if (
      !Array.isArray(list)
    ) {
      continue;
    }


    const found =
      list.find(
        exercise =>

          String(
            exercise.id
          ) ===
          String(id)

      );


    if (found) {
      return found;
    }

  }


  /* SELECT OPTION FALLBACK */

  const option =
    ANALYSIS_DOM
      .analysisExercise
      ?.selectedOptions?.[0];


  if (!option) {
    return null;
  }


  return {

    id,

    name:
      option.textContent
        .trim(),

    category:
      option.dataset.category ||
      "",

    equipment:
      option.dataset.equipment ||
      ""

  };

}


/* =========================================================
   67. EXERCISE CHANGE
========================================================= */

function handleAnalysisExerciseChange() {

  const exercise =
    getCurrentAnalysisExercise();


  if (!exercise) {
    return;
  }


  if (
    ANALYSIS_DOM.motionTitle
  ) {

    ANALYSIS_DOM
      .motionTitle
      .textContent =
      exercise.name;

  }


  updateExerciseCheckpoints();


  updateRecommendedCameraView(
    exercise
  );

}


/* =========================================================
   68. RECOMMENDED CAMERA VIEW
========================================================= */

function updateRecommendedCameraView(
  exercise
) {

  if (!exercise) {
    return;
  }


  const recommendedView =

    exercise.view ||

    exercise.cameraView ||

    exercise.recommendedView;


  if (
    !recommendedView
  ) {
    return;
  }


  const normalized =
    String(
      recommendedView
    ).toLowerCase();


  let view =
    null;


  if (
    normalized.includes(
      "측"
    ) ||
    normalized.includes(
      "side"
    )
  ) {

    view =
      "side";

  }


  else if (
    normalized.includes(
      "후"
    ) ||
    normalized.includes(
      "rear"
    )
  ) {

    view =
      "rear";

  }


  else if (
    normalized.includes(
      "상"
    ) ||
    normalized.includes(
      "top"
    )
  ) {

    view =
      "top";

  }


  else if (
    normalized.includes(
      "정"
    ) ||
    normalized.includes(
      "front"
    )
  ) {

    view =
      "front";

  }


  if (!view) {
    return;
  }


  MOTION_STATE.view =
    view;


  document
    .querySelectorAll(
      "[data-view]"
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


  updateViewMode();

}


/* =========================================================
   69. CHECKPOINTS
========================================================= */

function updateExerciseCheckpoints() {

  const container =
    ANALYSIS_DOM.checkpointList;


  if (!container) {
    return;
  }


  const exercise =
    getCurrentAnalysisExercise();


  if (!exercise) {

    container.innerHTML = `

      <div class="checkpoint-row">

        <span>
          운동을 선택하면 분석 기준이 표시됩니다.
        </span>

        <strong>-</strong>

      </div>

    `;

    return;

  }


  const name =
    exercise.name.toLowerCase();


  let checkpoints =
    [];


  if (

    name.includes("스쿼트") ||

    name.includes("squat")

  ) {

    checkpoints = [

      [
        "무릎 좌우 대칭",
        "CHECK"
      ],

      [
        "고관절 깊이",
        "CHECK"
      ],

      [
        "몸통 기울기",
        "CHECK"
      ],

      [
        "발목 가동범위",
        "CHECK"
      ],

      [
        "무릎-발 정렬",
        "CHECK"
      ],

      [
        "하강·상승 템포",
        "CHECK"
      ]

    ];

  }


  else if (

    name.includes("데드") ||

    name.includes("deadlift")

  ) {

    checkpoints = [

      [
        "고관절 힌지",
        "CHECK"
      ],

      [
        "몸통 각도",
        "CHECK"
      ],

      [
        "좌우 고관절 대칭",
        "CHECK"
      ],

      [
        "무릎 각도",
        "CHECK"
      ],

      [
        "바벨 이동 경로",
        "CHECK"
      ]

    ];

  }


  else if (

    name.includes("프레스") ||

    name.includes("press")

  ) {

    checkpoints = [

      [
        "팔꿈치 각도",
        "CHECK"
      ],

      [
        "어깨 좌우 대칭",
        "CHECK"
      ],

      [
        "손목 이동 경로",
        "CHECK"
      ],

      [
        "몸통 안정성",
        "CHECK"
      ]

    ];

  }


  else {

    checkpoints = [

      [
        "관절 가동범위",
        "CHECK"
      ],

      [
        "좌우 대칭",
        "CHECK"
      ],

      [
        "몸통 안정성",
        "CHECK"
      ],

      [
        "움직임 템포",
        "CHECK"
      ],

      [
        "기술 수행",
        "CHECK"
      ]

    ];

  }


  container.innerHTML =
    checkpoints
      .map(
        item => `

          <div class="checkpoint-row">

            <span>
              ${item[0]}
            </span>

            <strong>
              ${item[1]}
            </strong>

          </div>

        `
      )
      .join("");

}


/* =========================================================
   PART 2 END

   PART 3:
   ---------------------------------------------------------
   - Barbell / wrist trajectory
   - Angle Chart.js graph
   - Training recommendations
   - Exercise → Analysis page connection
   - Automatic exercise selection
   - Save analysis
   - Analysis record
   - Report data connection
   - Representative analysis frame
   - Report pictogram
   - Radar data
   - Initialization
========================================================= */
/* =========================================================
   SEOLCHEON HIGH SCHOOL
   WEIGHT PERFORMANCE LAB

   ANALYSIS.JS
   PART 3 / 3

   FINAL CONNECTION ENGINE
   ---------------------------------------------------------
   - Exercise → Analysis Navigation
   - Auto Exercise Selection
   - Trajectory Tracking
   - Angle Chart
   - Training Recommendation
   - Analysis Save
   - Representative Frame
   - Report Connection
   - Radar Data
   - Final Initialization
========================================================= */


/* =========================================================
   70. TRAJECTORY TRACKING
========================================================= */

function trackBarPath(landmarks) {

  if (
    !MOTION_STATE.barPathVisible ||
    !landmarks
  ) {
    return;
  }


  const exercise =
    getCurrentAnalysisExercise();


  const name =
    (
      exercise?.name ||
      ""
    ).toLowerCase();


  let targetPoint = null;


  /* -------------------------------------------------------
     바벨 운동
  ------------------------------------------------------- */

  if (

    name.includes("스쿼트") ||
    name.includes("deadlift") ||
    name.includes("데드") ||
    name.includes("클린") ||
    name.includes("clean") ||
    name.includes("스내치") ||
    name.includes("snatch") ||
    name.includes("프레스") ||
    name.includes("press")

  ) {

    const leftWrist =
      landmarks[
        POSE_POINT.LEFT_WRIST
      ];


    const rightWrist =
      landmarks[
        POSE_POINT.RIGHT_WRIST
      ];


    if (
      leftWrist &&
      rightWrist
    ) {

      targetPoint = {

        x:
          (
            leftWrist.x +
            rightWrist.x
          ) / 2,

        y:
          (
            leftWrist.y +
            rightWrist.y
          ) / 2

      };

    }

  }


  /* -------------------------------------------------------
     기본: 손 중심 추적
  ------------------------------------------------------- */

  if (!targetPoint) {

    const leftWrist =
      landmarks[
        POSE_POINT.LEFT_WRIST
      ];


    const rightWrist =
      landmarks[
        POSE_POINT.RIGHT_WRIST
      ];


    if (
      leftWrist &&
      rightWrist
    ) {

      targetPoint = {

        x:
          (
            leftWrist.x +
            rightWrist.x
          ) / 2,

        y:
          (
            leftWrist.y +
            rightWrist.y
          ) / 2

      };

    }

  }


  if (!targetPoint) {
    return;
  }


  MOTION_STATE.barPath.push(
    targetPoint
  );


  if (
    MOTION_STATE.barPath.length >
    500
  ) {

    MOTION_STATE.barPath.shift();

  }


  drawBarPath();

}


/* =========================================================
   71. DRAW TRAJECTORY
========================================================= */

function drawBarPath() {

  const canvas =
    ANALYSIS_DOM.barPathCanvas;


  if (!canvas) {
    return;
  }


  const viewer =
    canvas.parentElement;


  if (!viewer) {
    return;
  }


  const rect =
    viewer.getBoundingClientRect();


  if (
    canvas.width !==
    Math.round(rect.width)
  ) {

    canvas.width =
      Math.round(rect.width);

  }


  if (
    canvas.height !==
    Math.round(rect.height)
  ) {

    canvas.height =
      Math.round(rect.height);

  }


  const ctx =
    canvas.getContext("2d");


  ctx.clearRect(
    0,
    0,
    canvas.width,
    canvas.height
  );


  if (
    !MOTION_STATE.barPathVisible ||
    MOTION_STATE.barPath.length <
    2
  ) {
    return;
  }


  ctx.save();


  ctx.lineWidth =
    Math.max(
      3,
      canvas.width * 0.003
    );


  ctx.lineCap =
    "round";


  ctx.lineJoin =
    "round";


  ctx.strokeStyle =
    "rgba(255, 213, 79, 0.95)";


  ctx.shadowColor =
    "rgba(255, 213, 79, 0.65)";


  ctx.shadowBlur =
    10;


  ctx.beginPath();


  MOTION_STATE.barPath.forEach(
    (
      point,
      index
    ) => {

      const x =
        point.x *
        canvas.width;


      const y =
        point.y *
        canvas.height;


      if (
        index === 0
      ) {

        ctx.moveTo(
          x,
          y
        );

      }

      else {

        ctx.lineTo(
          x,
          y
        );

      }

    }
  );


  ctx.stroke();


  /* CURRENT POSITION */

  const last =
    MOTION_STATE.barPath[
      MOTION_STATE.barPath.length - 1
    ];


  ctx.beginPath();


  ctx.arc(

    last.x *
    canvas.width,

    last.y *
    canvas.height,

    7,

    0,

    Math.PI * 2

  );


  ctx.fillStyle =
    "#ffe36e";


  ctx.fill();


  ctx.restore();

}


/* =========================================================
   72. CLEAR TRAJECTORY
========================================================= */

function clearBarPath() {

  MOTION_STATE.barPath =
    [];


  const canvas =
    ANALYSIS_DOM.barPathCanvas;


  if (!canvas) {
    return;
  }


  const ctx =
    canvas.getContext("2d");


  ctx.clearRect(
    0,
    0,
    canvas.width,
    canvas.height
  );

}


/* =========================================================
   73. ANGLE CHART
========================================================= */

let motionAngleChart = null;


function createAngleChart() {

  const canvas =
    document.getElementById(
      "angleChart"
    );


  if (
    !canvas ||
    typeof Chart ===
    "undefined"
  ) {
    return;
  }


  if (
    motionAngleChart
  ) {

    motionAngleChart.destroy();

  }


  motionAngleChart =
    new Chart(
      canvas,
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
                "발목",

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

            mode:
              "index",

            intersect:
              false

          },

          scales: {

            x: {

              display:
                false

            },

            y: {

              suggestedMin:
                0,

              suggestedMax:
                180,

              ticks: {

                callback:
                  value =>
                    value + "°"

              }

            }

          },

          plugins: {

            legend: {

              position:
                "top"

            }

          }

        }

      }
    );

}


/* =========================================================
   74. UPDATE ANGLE CHART
========================================================= */

function updateAngleChart() {

  if (
    !motionAngleChart
  ) {
    return;
  }


  const knee =
    MOTION_STATE
      .angleHistory
      .knee;


  const hip =
    MOTION_STATE
      .angleHistory
      .hip;


  const ankle =
    MOTION_STATE
      .angleHistory
      .ankle;


  const trunk =
    MOTION_STATE
      .angleHistory
      .trunk;


  const maxLength =
    Math.max(

      knee.length,

      hip.length,

      ankle.length,

      trunk.length

    );


  const start =
    Math.max(
      0,
      maxLength - 180
    );


  motionAngleChart.data.labels =
    Array.from(
      {
        length:
          maxLength - start
      },
      (
        _,
        index
      ) =>
        index
    );


  motionAngleChart
    .data
    .datasets[0]
    .data =
    knee.slice(start);


  motionAngleChart
    .data
    .datasets[1]
    .data =
    hip.slice(start);


  motionAngleChart
    .data
    .datasets[2]
    .data =
    ankle.slice(start);


  motionAngleChart
    .data
    .datasets[3]
    .data =
    trunk.slice(start);


  motionAngleChart.update(
    "none"
  );

}


/* =========================================================
   75. RESET ANGLE HISTORY
========================================================= */

function resetAngleHistory() {

  MOTION_STATE.angleHistory = {

    knee: [],

    hip: [],

    ankle: [],

    trunk: []

  };


  if (
    motionAngleChart
  ) {

    motionAngleChart.data.labels =
      [];


    motionAngleChart.data.datasets
      .forEach(
        dataset => {

          dataset.data =
            [];

        }
      );


    motionAngleChart.update(
      "none"
    );

  }

}


/* =========================================================
   76. TRAINING RECOMMENDATION ENGINE
========================================================= */

function generateTrainingRecommendations() {

  const container =
    ANALYSIS_DOM
      .trainingRecommendations;


  if (!container) {
    return;
  }


  const recommendations =
    [];


  const exercise =
    getCurrentAnalysisExercise();


  const exerciseName =
    exercise?.name ||
    "선택 운동";


  /* -------------------------------------------------------
     SYMMETRY
  ------------------------------------------------------- */

  if (
    MOTION_STATE.symmetry <
    85
  ) {

    recommendations.push({

      title:
        "좌우 대칭 보강",

      description:
        "좌우 관절 움직임 차이가 감지되었습니다. 한쪽씩 수행하는 보조 운동과 저강도 컨트롤 훈련을 추가하세요.",

      tag:
        "SYMMETRY"

    });

  }


  /* -------------------------------------------------------
     STABILITY
  ------------------------------------------------------- */

  if (
    MOTION_STATE.stability <
    85
  ) {

    recommendations.push({

      title:
        "몸통 안정성",

      description:
        "동작 중 몸통 또는 골반 흔들림이 감지되었습니다. 코어 안정화와 저중량 기술 훈련을 우선하세요.",

      tag:
        "STABILITY"

    });

  }


  /* -------------------------------------------------------
     MOBILITY
  ------------------------------------------------------- */

  if (
    MOTION_STATE.mobility <
    85
  ) {

    recommendations.push({

      title:
        "가동범위 개선",

      description:
        "관절 가동범위를 확인하고 발목·고관절 중심의 동적 가동성 운동을 준비운동에 추가하세요.",

      tag:
        "MOBILITY"

    });

  }


  /* -------------------------------------------------------
     TECHNIQUE
  ------------------------------------------------------- */

  if (
    MOTION_STATE.technique <
    85
  ) {

    recommendations.push({

      title:
        `${exerciseName} 기술 세션`,

      description:
        "중량을 낮추고 동작 속도를 조절해 기준 자세를 반복하세요. 측면 영상을 함께 비교하면 자세 변화 확인에 유리합니다.",

      tag:
        "TECHNIQUE"

    });

  }


  /* -------------------------------------------------------
     TRUNK
  ------------------------------------------------------- */

  if (
    MOTION_STATE.currentAngles &&
    MOTION_STATE.currentAngles.trunk >
    55
  ) {

    recommendations.push({

      title:
        "몸통 컨트롤",

      description:
        "몸통 기울기가 크게 나타났습니다. 현재 운동의 특성을 고려해 몸통 위치와 고관절 사용 패턴을 다시 확인하세요.",

      tag:
        "TRUNK"

    });

  }


  /* -------------------------------------------------------
     GOOD RESULT
  ------------------------------------------------------- */

  if (
    recommendations.length ===
    0
  ) {

    recommendations.push({

      title:
        "현재 패턴 유지",

      description:
        "현재 측정에서는 큰 좌우 불균형이나 안정성 저하가 두드러지지 않았습니다. 동일 조건에서 반복 측정해 변화를 확인하세요.",

      tag:
        "GOOD"

    });


    recommendations.push({

      title:
        "점진적 부하 증가",

      description:
        "기술이 안정적으로 유지되는 범위에서 코치 지도에 따라 훈련 부하를 점진적으로 조절하세요.",

      tag:
        "PROGRESSION"

    });

  }


  container.innerHTML =
    recommendations
      .slice(
        0,
        6
      )
      .map(
        item => `

          <article class="recommendation-card">

            <span class="recommendation-tag">
              ${item.tag}
            </span>

            <h4>
              ${item.title}
            </h4>

            <p>
              ${item.description}
            </p>

          </article>

        `
      )
      .join("");


  MOTION_STATE.recommendations =
    recommendations;

}


/* =========================================================
   77. CAPTURE REPRESENTATIVE FRAME
========================================================= */

function captureAnalysisFrame() {

  const source =

    !ANALYSIS_DOM.uploadedVideo?.hidden
      ? ANALYSIS_DOM.uploadedVideo

      : !ANALYSIS_DOM.uploadedImage?.hidden
        ? ANALYSIS_DOM.uploadedImage

        : ANALYSIS_DOM.cameraVideo;


  if (!source) {
    return null;
  }


  const width =
    source.videoWidth ||
    source.naturalWidth ||
    source.clientWidth;


  const height =
    source.videoHeight ||
    source.naturalHeight ||
    source.clientHeight;


  if (
    !width ||
    !height
  ) {

    return null;

  }


  const canvas =
    document.createElement(
      "canvas"
    );


  canvas.width =
    width;


  canvas.height =
    height;


  const ctx =
    canvas.getContext(
      "2d"
    );


  try {

    ctx.drawImage(
      source,
      0,
      0,
      width,
      height
    );


    /* Skeleton overlay */

    if (
      ANALYSIS_DOM.poseCanvas
    ) {

      ctx.drawImage(
        ANALYSIS_DOM.poseCanvas,
        0,
        0,
        width,
        height
      );

    }


    return canvas.toDataURL(
      "image/jpeg",
      0.82
    );

  }

  catch (error) {

    console.warn(
      "대표 프레임 저장 실패:",
      error
    );


    return null;

  }

}


/* =========================================================
   78. BUILD ANALYSIS RECORD
========================================================= */

function buildAnalysisRecord() {

  const athleteId =
    ANALYSIS_DOM
      .analysisAthlete
      ?.value ||
    "";


  const athleteOption =
    ANALYSIS_DOM
      .analysisAthlete
      ?.selectedOptions?.[0];


  const exercise =
    getCurrentAnalysisExercise();


  const frame =
    captureAnalysisFrame();


  return {

    id:
      "analysis_" +
      Date.now(),

    createdAt:
      new Date()
        .toISOString(),

    athleteId,

    athleteName:
      athleteOption
        ?.textContent
        ?.trim() ||
      "선수 미선택",

    exerciseId:
      exercise?.id ||
      "",

    exerciseName:
      exercise?.name ||
      "운동 미선택",

    exerciseCategory:
      exercise?.category ||
      "",

    view:
      MOTION_STATE.view,

    mode:
      MOTION_STATE.mode,

    reps:
      MOTION_STATE.repCount,

    targetReps:
      MOTION_STATE.targetReps,

    score:
      MOTION_STATE.poseScore,

    symmetry:
      MOTION_STATE.symmetry,

    stability:
      MOTION_STATE.stability,

    mobility:
      MOTION_STATE.mobility,

    technique:
      MOTION_STATE.technique,

    rom:
      Math.round(
        MOTION_STATE.rom
      ),

    angles: {

      knee:
        roundNullable(
          MOTION_STATE
            .currentAngles
            ?.knee
        ),

      hip:
        roundNullable(
          MOTION_STATE
            .currentAngles
            ?.hip
        ),

      ankle:
        roundNullable(
          MOTION_STATE
            .currentAngles
            ?.ankle
        ),

      trunk:
        roundNullable(
          MOTION_STATE
            .currentAngles
            ?.trunk
        )

    },

    radar: {

      strength:
        calculateStrengthScore(),

      power:
        calculatePowerScore(),

      stability:
        MOTION_STATE.stability,

      symmetry:
        MOTION_STATE.symmetry,

      mobility:
        MOTION_STATE.mobility,

      technique:
        MOTION_STATE.technique

    },

    recommendations:
      MOTION_STATE
        .recommendations ||
      [],

    frame,

    angleHistory: {

      knee:
        MOTION_STATE
          .angleHistory
          .knee
          .slice(-300),

      hip:
        MOTION_STATE
          .angleHistory
          .hip
          .slice(-300),

      ankle:
        MOTION_STATE
          .angleHistory
          .ankle
          .slice(-300),

      trunk:
        MOTION_STATE
          .angleHistory
          .trunk
          .slice(-300)

    }

  };

}


/* =========================================================
   79. ROUND NULLABLE
========================================================= */

function roundNullable(
  value
) {

  if (
    !Number.isFinite(value)
  ) {

    return null;

  }


  return Math.round(
    value
  );

}


/* =========================================================
   80. STRENGTH SCORE
========================================================= */

function calculateStrengthScore() {

  let score =
    MOTION_STATE.poseScore;


  if (
    MOTION_STATE.repCount >
    0
  ) {

    score +=
      Math.min(
        8,
        MOTION_STATE.repCount *
        0.5
      );

  }


  return clampScore(
    score
  );

}


/* =========================================================
   81. POWER SCORE
========================================================= */

function calculatePowerScore() {

  const tempoText =
    ANALYSIS_DOM
      .tempo
      ?.textContent ||
    "";


  const tempo =
    parseFloat(
      tempoText
    );


  let score =
    MOTION_STATE.poseScore;


  if (
    Number.isFinite(tempo) &&
    tempo > 0
  ) {

    if (
      tempo <
      2
    ) {

      score += 5;

    }


    else if (
      tempo >
      5
    ) {

      score -= 5;

    }

  }


  return clampScore(
    score
  );

}


/* =========================================================
   82. SAVE ANALYSIS
========================================================= */

function saveCompletedAnalysis() {

  const record =
    buildAnalysisRecord();


  let records =
    [];


  try {

    records =
      JSON.parse(
        localStorage.getItem(
          "seolcheon_weight_analyses"
        )
      ) ||
      [];

  }

  catch {

    records =
      [];

  }


  records.unshift(
    record
  );


  /* 너무 커지는 것 방지 */

  records =
    records.slice(
      0,
      150
    );


  try {

    localStorage.setItem(

      "seolcheon_weight_analyses",

      JSON.stringify(
        records
      )

    );

  }

  catch (error) {

    console.warn(
      "분석 저장 공간 부족:",
      error
    );


    /*
      이미지 때문에 localStorage 용량이
      초과될 경우 프레임을 제외하고 다시 저장
    */

    record.frame =
      null;


    try {

      localStorage.setItem(

        "seolcheon_weight_analyses",

        JSON.stringify(
          records
        )

      );

    }

    catch (secondError) {

      console.error(
        secondError
      );

    }

  }


  MOTION_STATE.lastRecord =
    record;


  window.dispatchEvent(
    new CustomEvent(
      "seolcheonAnalysisSaved",
      {
        detail:
          record
      }
    )
  );


  return record;

}


/* =========================================================
   83. FINISH ANALYSIS
========================================================= */

function finishMotionAnalysis() {

  if (
    !MOTION_STATE.running
  ) {

    return;

  }


  MOTION_STATE.running =
    false;


  generateTrainingRecommendations();


  const record =
    saveCompletedAnalysis();


  updateAnalysisStatus(
    "ANALYSIS COMPLETE"
  );


  if (
    ANALYSIS_DOM.liveStatusBadge
  ) {

    ANALYSIS_DOM
      .liveStatusBadge
      .textContent =
      "● COMPLETE";


    ANALYSIS_DOM
      .liveStatusBadge
      .classList.remove(
        "standby"
      );

  }


  if (
    typeof showToast ===
    "function"
  ) {

    showToast(
      `${record.exerciseName} 분석이 저장되었습니다.`
    );

  }


  return record;

}


/* =========================================================
   84. EXERCISE → ANALYSIS

   ★ 중요 기능

   웨이트 종목 카드에서
   "분석하기"를 누르면

   1. 자세 분석 페이지 이동
   2. 운동 자동 선택
   3. 운동 이름 표시
   4. 권장 카메라 방향 자동 설정
========================================================= */

function openExerciseAnalysis(
  exerciseId
) {

  if (!exerciseId) {
    return;
  }


  /* PAGE CHANGE */

  if (
    typeof switchPage ===
    "function"
  ) {

    switchPage(
      "analysis"
    );

  }

  else {

    document
      .querySelectorAll(
        ".page"
      )
      .forEach(
        page => {

          page.classList.remove(
            "active"
          );

        }
      );


    document
      .getElementById(
        "page-analysis"
      )
      ?.classList.add(
        "active"
      );


    document
      .querySelectorAll(
        ".nav-item"
      )
      .forEach(
        item => {

          item.classList.toggle(

            "active",

            item.dataset.page ===
            "analysis"

          );

        }
      );

  }


  /* SELECT EXERCISE */

  if (
    ANALYSIS_DOM.analysisExercise
  ) {

    ANALYSIS_DOM
      .analysisExercise
      .value =
      String(
        exerciseId
      );


    ANALYSIS_DOM
      .analysisExercise
      .dispatchEvent(
        new Event(
          "change",
          {
            bubbles:
              true
          }
        )
      );

  }


  /* SCROLL TOP */

  window.scrollTo({

    top:
      0,

    behavior:
      "smooth"

  });


  if (
    typeof showToast ===
    "function"
  ) {

    showToast(
      "자세 분석 화면으로 이동했습니다."
    );

  }

}


/* =========================================================
   85. GLOBAL FUNCTION

   exercises.js에서 바로 사용 가능

   예:
   analyzeExercise("back-squat")
========================================================= */

window.analyzeExercise =
  function(
    exerciseId
  ) {

    openExerciseAnalysis(
      exerciseId
    );

  };


/* =========================================================
   86. EXERCISE CARD AUTO CONNECTION

   아래 형태면 자동 인식:

   data-exercise-id="back-squat"

   data-action="analyze"
========================================================= */

function connectExerciseCardsToAnalysis() {

  document.addEventListener(
    "click",
    event => {

      const analyzeButton =
        event.target.closest(
          "[data-action='analyze']"
        );


      if (
        analyzeButton
      ) {

        const card =
          analyzeButton.closest(
            "[data-exercise-id]"
          );


        const exerciseId =

          analyzeButton
            .dataset
            .exerciseId

          ||

          card
            ?.dataset
            .exerciseId;


        if (
          exerciseId
        ) {

          event.preventDefault();


          openExerciseAnalysis(
            exerciseId
          );

        }


        return;

      }


      /*
        카드 자체에
        data-open-analysis="true"
        가 있으면 카드 클릭도 분석 이동
      */

      const card =
        event.target.closest(
          "[data-open-analysis='true'][data-exercise-id]"
        );


      if (
        card
      ) {

        openExerciseAnalysis(
          card.dataset.exerciseId
        );

      }

    }
  );

}


/* =========================================================
   87. MODAL ANALYZE BUTTON
========================================================= */

function connectModalAnalysisButton() {

  const button =
    document.getElementById(
      "analyzeSelectedExerciseBtn"
    );


  if (!button) {
    return;
  }


  button.addEventListener(
    "click",
    () => {

      const modal =
        document.getElementById(
          "exerciseModal"
        );


      const exerciseId =

        modal
          ?.dataset
          .exerciseId

        ||

        button
          .dataset
          .exerciseId;


      if (!exerciseId) {

        if (
          typeof showToast ===
          "function"
        ) {

          showToast(
            "운동을 먼저 선택하세요."
          );

        }


        return;

      }


      modal
        ?.classList.remove(
          "active"
        );


      openExerciseAnalysis(
        exerciseId
      );

    }
  );

}


/* =========================================================
   88. SET MODAL EXERCISE

   exercises.js에서 운동 모달 열 때 호출 가능

   setAnalysisModalExercise(exercise.id)
========================================================= */

window.setAnalysisModalExercise =
  function(
    exerciseId
  ) {

    const modal =
      document.getElementById(
        "exerciseModal"
      );


    const button =
      document.getElementById(
        "analyzeSelectedExerciseBtn"
      );


    if (
      modal
    ) {

      modal.dataset.exerciseId =
        exerciseId;

    }


    if (
      button
    ) {

      button.dataset.exerciseId =
        exerciseId;

    }

  };


/* =========================================================
   89. REPORT BRIDGE
========================================================= */

window.getLatestWeightAnalysis =
  function(
    athleteId = null
  ) {

    let records =
      [];


    try {

      records =
        JSON.parse(
          localStorage.getItem(
            "seolcheon_weight_analyses"
          )
        ) ||
        [];

    }

    catch {

      return null;

    }


    if (
      !athleteId
    ) {

      return (
        records[0] ||
        null
      );

    }


    return (

      records.find(
        record =>

          String(
            record.athleteId
          ) ===
          String(
            athleteId
          )

      )

      ||

      null

    );

  };


/* =========================================================
   90. ALL ANALYSIS RECORDS
========================================================= */

window.getWeightAnalysisRecords =
  function() {

    try {

      return (
        JSON.parse(
          localStorage.getItem(
            "seolcheon_weight_analyses"
          )
        ) ||
        []
      );

    }

    catch {

      return [];

    }

  };


/* =========================================================
   91. RESET MOTION SESSION
========================================================= */

function resetMotionSession() {

  MOTION_STATE.running =
    false;


  MOTION_STATE.repCount =
    0;


  MOTION_STATE.frameCounter =
    0;


  MOTION_STATE.poseScore =
    0;


  MOTION_STATE.symmetry =
    0;


  MOTION_STATE.stability =
    0;


  MOTION_STATE.mobility =
    0;


  MOTION_STATE.technique =
    0;


  MOTION_STATE.rom =
    0;


  MOTION_STATE.movementPhase =
    "ready";


  MOTION_STATE.startTime =
    0;


  MOTION_STATE.recommendations =
    [];


  clearBarPath();


  resetAngleHistory();


  updateRepDisplay();


  if (
    ANALYSIS_DOM.poseScore
  ) {

    ANALYSIS_DOM
      .poseScore
      .textContent =
      "--";

  }


  if (
    ANALYSIS_DOM.tempo
  ) {

    ANALYSIS_DOM
      .tempo
      .textContent =
      "--";

  }

}


/* =========================================================
   92. START ANALYSIS SESSION
========================================================= */

function startMotionAnalysis() {

  const athlete =
    ANALYSIS_DOM
      .analysisAthlete
      ?.value;


  const exercise =
    ANALYSIS_DOM
      .analysisExercise
      ?.value;


  if (!athlete) {

    if (
      typeof showToast ===
      "function"
    ) {

      showToast(
        "측정 선수를 선택하세요."
      );

    }

    return;

  }


  if (!exercise) {

    if (
      typeof showToast ===
      "function"
    ) {

      showToast(
        "분석할 운동을 선택하세요."
      );

    }

    return;

  }


  resetMotionSession();


  MOTION_STATE.targetReps =
    Math.max(

      1,

      parseInt(
        ANALYSIS_DOM
          .analysisTargetReps
          ?.value ||
        10
      )

    );


  MOTION_STATE.startTime =
    Date.now();


  MOTION_STATE.running =
    true;


  updateRepDisplay();


  updateAnalysisStatus(
    "ANALYZING"
  );


  if (
    ANALYSIS_DOM.liveStatusBadge
  ) {

    ANALYSIS_DOM
      .liveStatusBadge
      .textContent =
      "● LIVE";


    ANALYSIS_DOM
      .liveStatusBadge
      .classList.remove(
        "standby"
      );

  }


  if (
    typeof showToast ===
    "function"
  ) {

    showToast(
      "자세 분석을 시작합니다."
    );

  }

}


/* =========================================================
   93. TIMER
========================================================= */

function updateMotionTimer() {

  if (
    !MOTION_STATE.running ||
    !MOTION_STATE.startTime
  ) {

    return;

  }


  const seconds =
    Math.floor(

      (
        Date.now() -
        MOTION_STATE.startTime
      ) /
      1000

    );


  const minutes =
    Math.floor(
      seconds /
      60
    );


  const remain =
    seconds %
    60;


  const text =

    String(minutes)
      .padStart(
        2,
        "0"
      )

    +

    ":"

    +

    String(remain)
      .padStart(
        2,
        "0"
      );


  if (
    ANALYSIS_DOM.timer
  ) {

    ANALYSIS_DOM
      .timer
      .textContent =
      text;

  }

}


/* =========================================================
   94. ANALYSIS BUTTON CONNECTION
========================================================= */

function connectAnalysisButtons() {

  ANALYSIS_DOM
    .startAnalysisBtn
    ?.addEventListener(
      "click",
      startMotionAnalysis
    );


  ANALYSIS_DOM
    .stopAnalysisBtn
    ?.addEventListener(
      "click",
      finishMotionAnalysis
    );


  ANALYSIS_DOM
    .analysisExercise
    ?.addEventListener(
      "change",
      handleAnalysisExerciseChange
    );


  ANALYSIS_DOM
    .analysisTargetReps
    ?.addEventListener(
      "input",
      () => {

        MOTION_STATE.targetReps =
          Math.max(

            1,

            parseInt(
              ANALYSIS_DOM
                .analysisTargetReps
                .value ||
              10
            )

          );


        updateRepDisplay();

      }
    );

}


/* =========================================================
   95. SKELETON BUTTON
========================================================= */

function connectSkeletonButton() {

  ANALYSIS_DOM
    .toggleSkeletonBtn
    ?.addEventListener(
      "click",
      () => {

        MOTION_STATE.skeletonVisible =
          !MOTION_STATE.skeletonVisible;


        ANALYSIS_DOM
          .toggleSkeletonBtn
          .classList.toggle(
            "active",
            MOTION_STATE.skeletonVisible
          );


        redrawLastPose();

      }
    );

}


/* =========================================================
   96. REFERENCE BUTTON
========================================================= */

function connectReferenceButton() {

  ANALYSIS_DOM
    .toggleReferenceBtn
    ?.addEventListener(
      "click",
      () => {

        MOTION_STATE.referenceVisible =
          !MOTION_STATE.referenceVisible;


        updateReferenceVisibility();

      }
    );

}


/* =========================================================
   97. BAR PATH BUTTON
========================================================= */

function connectBarPathButton() {

  ANALYSIS_DOM
    .toggleBarPathBtn
    ?.addEventListener(
      "click",
      () => {

        MOTION_STATE.barPathVisible =
          !MOTION_STATE.barPathVisible;


        ANALYSIS_DOM
          .toggleBarPathBtn
          .classList.toggle(
            "active",
            MOTION_STATE.barPathVisible
          );


        if (
          MOTION_STATE.barPathVisible
        ) {

          drawBarPath();

        }

        else {

          clearBarPath();

        }

      }
    );

}


/* =========================================================
   98. ANALYSIS MODE BUTTONS
========================================================= */

function connectAnalysisModeButtons() {

  document
    .querySelectorAll(
      "[data-analysis-mode]"
    )
    .forEach(
      button => {

        button.addEventListener(
          "click",
          () => {

            MOTION_STATE.mode =
              button.dataset.analysisMode;


            document
              .querySelectorAll(
                "[data-analysis-mode]"
              )
              .forEach(
                item => {

                  item.classList.toggle(

                    "active",

                    item === button

                  );

                }
              );


            if (
              typeof showToast ===
              "function"
            ) {

              showToast(

                MOTION_STATE.mode ===
                "3d"

                  ? "AI 3D 관절 좌표 분석 모드"

                  : "2D 자세 분석 모드"

              );

            }

          }
        );

      }
    );

}


/* =========================================================
   99. VIEW BUTTONS
========================================================= */

function connectViewButtons() {

  document
    .querySelectorAll(
      "[data-view]"
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
                "[data-view]"
              )
              .forEach(
                item => {

                  item.classList.toggle(

                    "active",

                    item === button

                  );

                }
              );


            updateViewMode();

          }
        );

      }
    );

}


/* =========================================================
   100. VIEW MODE
========================================================= */

function updateViewMode() {

  const viewer =
    document.querySelector(
      ".motion-viewer"
    );


  if (!viewer) {
    return;
  }


  viewer.dataset.view =
    MOTION_STATE.view;


  const names = {

    front:
      "정면",

    side:
      "측면",

    rear:
      "후면",

    top:
      "상단"

  };


  viewer.dataset.viewName =
    names[
      MOTION_STATE.view
    ] ||
    "";

}


/* =========================================================
   101. SETTINGS CONNECTION
========================================================= */

function connectAnalysisSettings() {

  const skeletonSetting =
    document.getElementById(
      "settingSkeleton"
    );


  const angleSetting =
    document.getElementById(
      "settingAngles"
    );


  const referenceSetting =
    document.getElementById(
      "settingReference"
    );


  const barSetting =
    document.getElementById(
      "settingBarPath"
    );


  skeletonSetting
    ?.addEventListener(
      "change",
      () => {

        MOTION_STATE.skeletonVisible =
          skeletonSetting.checked;


        redrawLastPose();

      }
    );


  angleSetting
    ?.addEventListener(
      "change",
      () => {

        MOTION_STATE.anglesVisible =
          angleSetting.checked;


        redrawLastPose();

      }
    );


  referenceSetting
    ?.addEventListener(
      "change",
      () => {

        MOTION_STATE.referenceVisible =
          referenceSetting.checked;


        updateReferenceVisibility();

      }
    );


  barSetting
    ?.addEventListener(
      "change",
      () => {

        MOTION_STATE.barPathVisible =
          barSetting.checked;


        if (
          MOTION_STATE.barPathVisible
        ) {

          drawBarPath();

        }

        else {

          clearBarPath();

        }

      }
    );

}


/* =========================================================
   102. RESIZE OVERLAY CANVAS
========================================================= */

function resizeMotionCanvases() {

  const viewer =
    document.querySelector(
      ".motion-viewer"
    );


  if (!viewer) {
    return;
  }


  const rect =
    viewer.getBoundingClientRect();


  [

    ANALYSIS_DOM.poseCanvas,

    ANALYSIS_DOM.barPathCanvas

  ].forEach(
    canvas => {

      if (!canvas) {
        return;
      }


      const width =
        Math.max(
          1,
          Math.round(
            rect.width
          )
        );


      const height =
        Math.max(
          1,
          Math.round(
            rect.height
          )
        );


      if (
        canvas.width !==
        width
      ) {

        canvas.width =
          width;

      }


      if (
        canvas.height !==
        height
      ) {

        canvas.height =
          height;

      }

    }
  );


  redrawLastPose();


  drawBarPath();

}


/* =========================================================
   103. ANALYSIS STATUS
========================================================= */

function updateAnalysisStatus(
  text
) {

  if (
    ANALYSIS_DOM
      .analysisEngineStatus
  ) {

    ANALYSIS_DOM
      .analysisEngineStatus
      .textContent =
      text;

  }

}


/* =========================================================
   104. KEYBOARD SLOW MOTION CONTROL

   Space = play/pause
   ← = previous frame
   → = next frame
========================================================= */

function connectKeyboardAnalysisControls() {

  document.addEventListener(
    "keydown",
    event => {

      const page =
        document.getElementById(
          "page-analysis"
        );


      if (
        !page?.classList.contains(
          "active"
        )
      ) {

        return;

      }


      if (
        event.code ===
        "Space"
      ) {

        const video =
          getActiveAnalysisVideo?.();


        if (!video) {
          return;
        }


        event.preventDefault();


        if (
          video.paused
        ) {

          video.play();

        }

        else {

          video.pause();

        }

      }

    }
  );

}


/* =========================================================
   105. EXPOSE 33 LANDMARK DATA
========================================================= */

window.getMotionCapture33 =
  function() {

    if (
      !MOTION_STATE.lastLandmarks
    ) {

      return [];

    }


    return MOTION_STATE
      .lastLandmarks
      .map(
        (
          landmark,
          index
        ) => ({

          joint:
            index,

          x:
            landmark.x,

          y:
            landmark.y,

          z:
            landmark.z || 0,

          visibility:
            landmark.visibility ?? 1

        })
      );

  };


/* =========================================================
   106. EXPORT CURRENT BIOMECHANICS
========================================================= */

window.getCurrentBiomechanics =
  function() {

    return {

      angles:
        MOTION_STATE.currentAngles,

      symmetry:
        MOTION_STATE.symmetry,

      stability:
        MOTION_STATE.stability,

      mobility:
        MOTION_STATE.mobility,

      technique:
        MOTION_STATE.technique,

      rom:
        MOTION_STATE.rom,

      score:
        MOTION_STATE.poseScore,

      reps:
        MOTION_STATE.repCount,

      mode:
        MOTION_STATE.mode,

      view:
        MOTION_STATE.view,

      coordinates3D:
        get3DPoseCoordinates()

    };

  };


/* =========================================================
   107. TIMER LOOP
========================================================= */

setInterval(
  () => {

    updateMotionTimer();

  },
  250
);


/* =========================================================
   108. FINAL INITIALIZATION
========================================================= */

function initializeMotionAnalysisPart3() {

  createAngleChart();


  connectExerciseCardsToAnalysis();


  connectModalAnalysisButton();


  connectAnalysisButtons();


  connectSkeletonButton();


  connectReferenceButton();


  connectBarPathButton();


  connectAnalysisModeButtons();


  connectViewButtons();


  connectAnalysisSettings();


  connectKeyboardAnalysisControls();


  updateReferenceVisibility();


  updateViewMode();


  resizeMotionCanvases();


  window.addEventListener(
    "resize",
    resizeMotionCanvases
  );


  console.log(
    "WEIGHT PERFORMANCE LAB / MOTION ENGINE READY"
  );

}


/* =========================================================
   109. SAFE START
========================================================= */

if (
  document.readyState ===
  "loading"
) {

  document.addEventListener(
    "DOMContentLoaded",
    initializeMotionAnalysisPart3
  );

}

else {

  initializeMotionAnalysisPart3();

}


/* =========================================================
   ANALYSIS.JS COMPLETE

   ✓ Camera
   ✓ Video Upload
   ✓ Image Upload
   ✓ Front View
   ✓ Side View
   ✓ Rear View
   ✓ Top View
   ✓ Slow Motion
   ✓ Frame Control
   ✓ MediaPipe Pose
   ✓ 33 Joint Detection
   ✓ Skeleton Motion Capture
   ✓ 2D Analysis
   ✓ Relative 3D Estimation
   ✓ Knee Angle
   ✓ Hip Angle
   ✓ Ankle Angle
   ✓ Trunk Angle
   ✓ Shoulder Angle
   ✓ Elbow Angle
   ✓ Symmetry
   ✓ ROM
   ✓ Stability
   ✓ Mobility
   ✓ Technique Score
   ✓ Rep Counter
   ✓ Tempo
   ✓ Trajectory
   ✓ Reference Lines
   ✓ Angle Graph
   ✓ Training Recommendation
   ✓ Analysis Save
   ✓ Report Bridge
   ✓ Exercise → Analysis
========================================================= */