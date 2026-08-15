/* =========================================================
   설천고 WEIGHT PERFORMANCE LAB
   APP.JS
   PART 1 / 2

   CORE
   - Navigation
   - Athlete Database
   - Camera
   - MediaPipe Pose 33
   - Joint Angles
   - Rep Counter
   - Timer
   - Slow Motion
   - Angle Graph
========================================================= */

"use strict";


/* =========================================================
   01. STORAGE
========================================================= */

const STORAGE = {
  athletes: "weightLabAthletes",
  records: "weightLabRecords",
  programs: "weightLabPrograms",
  settings: "weightLabSettings"
};

function loadData(key, fallback = []) {

  try {

    const data =
      JSON.parse(localStorage.getItem(key));

    return data ?? fallback;

  } catch (error) {

    console.error(
      "[STORAGE LOAD ERROR]",
      key,
      error
    );

    return fallback;
  }
}


function saveData(key, data) {

  try {

    localStorage.setItem(
      key,
      JSON.stringify(data)
    );

    return true;

  } catch (error) {

    console.error(
      "[STORAGE SAVE ERROR]",
      key,
      error
    );

    showToast("데이터 저장 실패");

    return false;
  }
}


let athletes =
  loadData(STORAGE.athletes, []);

let analysisRecords =
  loadData(STORAGE.records, []);

let trainingPrograms =
  loadData(STORAGE.programs, []);


/* =========================================================
   02. GLOBAL STATE
========================================================= */

const APP_STATE = {

  currentPage: "dashboard",

  selectedAthleteId: null,

  analysisRunning: false,

  cameraConnected: false,

  cameraFacing: "environment",

  cameraStream: null,

  pose: null,

  poseBusy: false,

  poseLoopId: null,

  sourceType: null,

  analysisMode: "2d",

  analysisView: "front",

  skeletonVisible: true,

  referenceVisible: true,

  barPathVisible: true,

  analysisStartTime: null,

  timerInterval: null,

  repCount: 0,

  repPhase: "up",

  lastRepTime: null,

  repTimes: [],

  latestLandmarks: null,

  latestWorldLandmarks: null,

  latestMetrics: null,

  angleHistory: [],

  maxHistory: 180,

  barPath: [],

  currentProgramExercises: []

};


/* =========================================================
   03. DOM HELPER
========================================================= */

function $(id) {
  return document.getElementById(id);
}


function clamp(value, min, max) {

  return Math.min(
    Math.max(value, min),
    max
  );
}


function round(value, digits = 0) {

  const power =
    Math.pow(10, digits);

  return (
    Math.round(value * power) /
    power
  );
}


/* =========================================================
   04. TOAST
========================================================= */

function showToast(message) {

  const toast = $("toast");

  if (!toast) {

    console.log(message);

    return;
  }

  toast.textContent = message;

  toast.classList.add("show");

  clearTimeout(
    showToast.timeout
  );

  showToast.timeout =
    setTimeout(() => {

      toast.classList.remove("show");

    }, 2500);
}


/* =========================================================
   05. PAGE NAVIGATION
========================================================= */

function navigateToPage(pageName) {

  APP_STATE.currentPage =
    pageName;

  document
    .querySelectorAll(".page")
    .forEach(page => {

      page.classList.remove("active");

    });


  const target =
    $(`page-${pageName}`);

  if (target) {

    target.classList.add("active");

  }


  document
    .querySelectorAll(".nav-item")
    .forEach(button => {

      button.classList.toggle(
        "active",
        button.dataset.page === pageName
      );

    });


  $("sidebar")
    ?.classList.remove("mobile-open");


  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });


  if (pageName === "dashboard") {
    renderDashboard();
  }

  if (pageName === "athletes") {
    renderAthleteList();
  }

  if (pageName === "records") {
    renderRecords();
  }

  if (pageName === "program") {
    renderProgramBuilder();
  }

  if (pageName === "report") {
    populateAllAthleteSelects();
  }
}


window.navigateToPage =
  navigateToPage;


/* =========================================================
   06. NAVIGATION EVENTS
========================================================= */

function initializeNavigation() {

  document
    .querySelectorAll(".nav-item")
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          navigateToPage(
            button.dataset.page
          );

        }
      );

    });


  document
    .querySelectorAll(
      "[data-page-target]"
    )
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          navigateToPage(
            button.dataset.pageTarget
          );

        }
      );

    });


  $("mobileMenuBtn")
    ?.addEventListener(
      "click",
      () => {

        $("sidebar")
          ?.classList.toggle(
            "mobile-open"
          );

      }
    );
}


/* =========================================================
   07. CLOCK
========================================================= */

function updateClock() {

  const now = new Date();

  const date =
    now.toLocaleDateString(
      "ko-KR",
      {
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
      }
    );

  const time =
    now.toLocaleTimeString(
      "ko-KR",
      {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
      }
    );

  if ($("headerDate")) {
    $("headerDate").textContent = date;
  }

  if ($("headerTime")) {
    $("headerTime").textContent = time;
  }
}


/* =========================================================
   08. ATHLETE ID
========================================================= */

function createId(prefix = "id") {

  return (
    prefix +
    "_" +
    Date.now() +
    "_" +
    Math.random()
      .toString(36)
      .slice(2, 8)
  );
}


/* =========================================================
   09. ATHLETE FORM
========================================================= */

function initializeAthleteForm() {

  $("athleteForm")
    ?.addEventListener(
      "submit",
      event => {

        event.preventDefault();

        const name =
          $("athleteName")?.value.trim();

        if (!name) {

          showToast(
            "선수 이름을 입력하세요."
          );

          return;
        }


        const athlete = {

          id: createId("athlete"),

          name,

          birth:
            $("athleteBirth")?.value || "",

          sport:
            $("athleteSport")?.value.trim() || "",

          height:
            Number(
              $("athleteHeight")?.value
            ) || 0,

          weight:
            Number(
              $("athleteWeight")?.value
            ) || 0,

          group:
            $("athleteGroup")?.value.trim() || "",

          memo:
            $("athleteMemo")?.value.trim() || "",

          createdAt:
            new Date().toISOString()

        };


        athletes.push(athlete);

        saveData(
          STORAGE.athletes,
          athletes
        );


        APP_STATE.selectedAthleteId =
          athlete.id;


        event.target.reset();


        populateAllAthleteSelects();

        renderAthleteList();

        renderDashboard();


        showToast(
          `${athlete.name} 선수 등록 완료`
        );

      }
    );
}


/* =========================================================
   10. ATHLETE LIST
========================================================= */

function renderAthleteList() {

  const container =
    $("athleteList");

  if (!container) return;


  const search =
    $("athleteSearch")
      ?.value
      .trim()
      .toLowerCase() || "";


  const filtered =
    athletes.filter(athlete => {

      return (
        !search ||
        athlete.name
          .toLowerCase()
          .includes(search) ||
        athlete.sport
          .toLowerCase()
          .includes(search)
      );

    });


  if (!filtered.length) {

    container.innerHTML = `
      <div class="empty-state">
        등록된 선수가 없습니다.
      </div>
    `;

    return;
  }


  container.innerHTML =
    filtered
      .map(athlete => {

        const selected =
          APP_STATE.selectedAthleteId ===
          athlete.id;

        return `
          <div
            class="athlete-list-card
            ${selected ? "selected" : ""}"
            data-athlete-id="${athlete.id}"
          >

            <div class="athlete-avatar">
              👤
            </div>

            <div class="athlete-list-info">

              <strong>
                ${athlete.name}
              </strong>

              <span>
                ${athlete.sport || "종목 미등록"}
              </span>

              <small>
                ${athlete.height || "-"} cm ·
                ${athlete.weight || "-"} kg
              </small>

            </div>

            <div class="athlete-card-actions">

              <button
                type="button"
                data-analyze-athlete="${athlete.id}"
              >
                분석
              </button>

              <button
                type="button"
                data-delete-athlete="${athlete.id}"
              >
                삭제
              </button>

            </div>

          </div>
        `;

      })
      .join("");


  container
    .querySelectorAll(
      "[data-athlete-id]"
    )
    .forEach(card => {

      card.addEventListener(
        "click",
        event => {

          if (
            event.target.closest("button")
          ) {
            return;
          }

          APP_STATE.selectedAthleteId =
            card.dataset.athleteId;

          renderAthleteList();

          renderDashboard();

        }
      );

    });


  container
    .querySelectorAll(
      "[data-analyze-athlete]"
    )
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          const id =
            button.dataset.analyzeAthlete;

          APP_STATE.selectedAthleteId =
            id;

          populateAllAthleteSelects();

          if ($("analysisAthlete")) {
            $("analysisAthlete").value = id;
          }

          navigateToPage("analysis");

        }
      );

    });


  container
    .querySelectorAll(
      "[data-delete-athlete]"
    )
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          deleteAthlete(
            button.dataset.deleteAthlete
          );

        }
      );

    });
}


/* =========================================================
   11. DELETE ATHLETE
========================================================= */

function deleteAthlete(id) {

  const athlete =
    athletes.find(
      item => item.id === id
    );

  if (!athlete) return;


  if (
    !confirm(
      `${athlete.name} 선수를 삭제할까요?`
    )
  ) {
    return;
  }


  athletes =
    athletes.filter(
      item => item.id !== id
    );


  saveData(
    STORAGE.athletes,
    athletes
  );


  if (
    APP_STATE.selectedAthleteId === id
  ) {

    APP_STATE.selectedAthleteId =
      athletes[0]?.id || null;

  }


  populateAllAthleteSelects();

  renderAthleteList();

  renderDashboard();

  showToast("선수를 삭제했습니다.");
}


/* =========================================================
   12. ATHLETE SEARCH
========================================================= */

function initializeAthleteSearch() {

  $("athleteSearch")
    ?.addEventListener(
      "input",
      renderAthleteList
    );
}


/* =========================================================
   13. POPULATE ATHLETE SELECTS
========================================================= */

function populateAllAthleteSelects() {

  const ids = [
    "analysisAthlete",
    "programAthlete",
    "reportAthlete"
  ];


  ids.forEach(id => {

    const select = $(id);

    if (!select) return;


    const oldValue =
      select.value;


    select.innerHTML = `
      <option value="">
        선수 선택
      </option>

      ${athletes
        .map(athlete => `
          <option value="${athlete.id}">
            ${athlete.name}
          </option>
        `)
        .join("")}
    `;


    if (
      athletes.some(
        athlete =>
          athlete.id === oldValue
      )
    ) {

      select.value = oldValue;

    } else if (
      APP_STATE.selectedAthleteId
    ) {

      select.value =
        APP_STATE.selectedAthleteId;

    }

  });


  const recordFilter =
    $("recordAthleteFilter");

  if (recordFilter) {

    const oldValue =
      recordFilter.value;

    recordFilter.innerHTML = `
      <option value="all">
        전체 선수
      </option>

      ${athletes
        .map(athlete => `
          <option value="${athlete.id}">
            ${athlete.name}
          </option>
        `)
        .join("")}
    `;

    if (
      oldValue &&
      oldValue !== ""
    ) {
      recordFilter.value =
        oldValue;
    }
  }
}


/* =========================================================
   14. ANALYSIS ATHLETE CHANGE
========================================================= */

function initializeAnalysisAthlete() {

  $("analysisAthlete")
    ?.addEventListener(
      "change",
      event => {

        APP_STATE.selectedAthleteId =
          event.target.value || null;

        renderDashboard();

      }
    );
}


/* =========================================================
   15. CAMERA ELEMENTS
========================================================= */

function getActiveVideoElement() {

  if (
    APP_STATE.sourceType === "upload-video"
  ) {

    return $("uploadedVideo");

  }

  return $("cameraVideo");
}


/* =========================================================
   16. CONNECT CAMERA
========================================================= */

async function connectCamera() {

  try {

    stopCameraStream();


    const constraints = {

      audio: false,

      video: {

        facingMode: {
          ideal:
            APP_STATE.cameraFacing
        },

        width: {
          ideal: 1280
        },

        height: {
          ideal: 720
        }

      }

    };


    const stream =
      await navigator.mediaDevices
        .getUserMedia(
          constraints
        );


    APP_STATE.cameraStream =
      stream;

    APP_STATE.cameraConnected =
      true;

    APP_STATE.sourceType =
      "camera";


    const video =
      $("cameraVideo");


    video.srcObject =
      stream;

    video.hidden = false;


    if ($("uploadedVideo")) {
      $("uploadedVideo").hidden = true;
    }

    if ($("uploadedImage")) {
      $("uploadedImage").hidden = true;
    }

    if ($("viewerPlaceholder")) {
      $("viewerPlaceholder").hidden = true;
    }


    await video.play();


    resizePoseCanvas();


    showToast(
      "카메라 연결 완료"
    );


    $("analysisEngineStatus").textContent =
      "CAMERA READY";


    await initializePoseEngine();


  } catch (error) {

    console.error(error);

    showToast(
      "카메라를 연결할 수 없습니다."
    );


    if ($("analysisEngineStatus")) {

      $("analysisEngineStatus")
        .textContent =
        "CAMERA ERROR";

    }
  }
}


/* =========================================================
   17. STOP CAMERA STREAM
========================================================= */

function stopCameraStream() {

  if (
    APP_STATE.cameraStream
  ) {

    APP_STATE.cameraStream
      .getTracks()
      .forEach(track => {

        track.stop();

      });

  }


  APP_STATE.cameraStream =
    null;

  APP_STATE.cameraConnected =
    false;


  const video =
    $("cameraVideo");

  if (video) {

    video.pause();

    video.srcObject = null;

  }
}


/* =========================================================
   18. SWITCH CAMERA
========================================================= */

async function switchCamera() {

  APP_STATE.cameraFacing =
    APP_STATE.cameraFacing ===
    "environment"
      ? "user"
      : "environment";


  await connectCamera();
}


/* =========================================================
   19. VIDEO UPLOAD
========================================================= */

function initializeVideoUpload() {

  $("analysisVideoUpload")
    ?.addEventListener(
      "change",
      event => {

        const file =
          event.target.files?.[0];

        if (!file) return;


        stopCameraStream();


        const url =
          URL.createObjectURL(file);


        const video =
          $("uploadedVideo");


        video.src = url;

        video.hidden = false;


        $("cameraVideo").hidden = true;

        $("uploadedImage").hidden = true;

        $("viewerPlaceholder").hidden =
          true;


        APP_STATE.sourceType =
          "upload-video";


        video.onloadedmetadata =
          () => {

            resizePoseCanvas();

            initializePoseEngine();

          };


        showToast(
          "분석 영상을 불러왔습니다."
        );

      }
    );
}


/* =========================================================
   20. IMAGE UPLOAD
========================================================= */

function initializeImageUpload() {

  $("analysisImageUpload")
    ?.addEventListener(
      "change",
      event => {

        const file =
          event.target.files?.[0];

        if (!file) return;


        stopCameraStream();


        const url =
          URL.createObjectURL(file);


        const image =
          $("uploadedImage");


        image.src = url;

        image.hidden = false;


        $("cameraVideo").hidden = true;

        $("uploadedVideo").hidden = true;

        $("viewerPlaceholder").hidden =
          true;


        APP_STATE.sourceType =
          "upload-image";


        image.onload =
          async () => {

            resizePoseCanvas();

            await initializePoseEngine();

            await analyzeImageFrame();

          };


        showToast(
          "분석 사진을 불러왔습니다."
        );

      }
    );
}


/* =========================================================
   21. MEDIAPIPE POSE 33
========================================================= */

async function initializePoseEngine() {

  if (APP_STATE.pose) {
    return;
  }


  if (
    typeof Pose === "undefined"
  ) {

    console.error(
      "MediaPipe Pose not loaded"
    );

    showToast(
      "모션 분석 엔진을 불러오지 못했습니다."
    );

    return;
  }


  APP_STATE.pose =
    new Pose({

      locateFile: file =>

        `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`

    });


  APP_STATE.pose.setOptions({

    modelComplexity: 2,

    smoothLandmarks: true,

    enableSegmentation: false,

    smoothSegmentation: false,

    minDetectionConfidence: 0.55,

    minTrackingConfidence: 0.55

  });


  APP_STATE.pose.onResults(
    handlePoseResults
  );


  if ($("analysisEngineStatus")) {

    $("analysisEngineStatus")
      .textContent =
      "POSE 33 READY";

  }
}


/* =========================================================
   22. START ANALYSIS
========================================================= */

async function startAnalysis() {

  if (
    APP_STATE.analysisRunning
  ) {
    return;
  }


  const athleteId =
    $("analysisAthlete")?.value;

  const exerciseId =
    $("analysisExercise")?.value;


  if (!athleteId) {

    showToast(
      "측정 선수를 선택하세요."
    );

    return;
  }


  if (!exerciseId) {

    showToast(
      "분석 운동을 선택하세요."
    );

    return;
  }


  if (!APP_STATE.sourceType) {

    showToast(
      "카메라 또는 영상을 먼저 연결하세요."
    );

    return;
  }


  await initializePoseEngine();


  resetAnalysisSession();


  APP_STATE.analysisRunning =
    true;

  APP_STATE.analysisStartTime =
    Date.now();


  if ($("liveStatusBadge")) {

    $("liveStatusBadge")
      .textContent =
      "● LIVE";

    $("liveStatusBadge")
      .classList.remove(
        "standby"
      );

  }


  if ($("analysisEngineStatus")) {

    $("analysisEngineStatus")
      .textContent =
      "ANALYZING";

  }


  startAnalysisTimer();


  if (
    APP_STATE.sourceType ===
    "upload-video"
  ) {

    const video =
      $("uploadedVideo");

    try {
      await video.play();
    } catch {}

  }


  startPoseLoop();


  showToast(
    "자세 분석을 시작했습니다."
  );
}


/* =========================================================
   23. STOP ANALYSIS

   ★ 기존에 안 되던 분석 종료 수정
========================================================= */

function stopAnalysis() {

  if (
    !APP_STATE.analysisRunning
  ) {

    showToast(
      "진행 중인 분석이 없습니다."
    );

    return;
  }


  APP_STATE.analysisRunning =
    false;


  stopPoseLoop();

  stopAnalysisTimer();


  if (
    APP_STATE.sourceType ===
    "upload-video"
  ) {

    $("uploadedVideo")
      ?.pause();

  }


  if ($("liveStatusBadge")) {

    $("liveStatusBadge")
      .textContent =
      "● COMPLETE";

    $("liveStatusBadge")
      .classList.add(
        "standby"
      );

  }


  if ($("analysisEngineStatus")) {

    $("analysisEngineStatus")
      .textContent =
      "ANALYSIS COMPLETE";

  }


  saveCurrentAnalysis();


  showToast(
    `분석 완료 · ${APP_STATE.repCount}회`
  );


  renderDashboard();

  renderRecords();
}


/* =========================================================
   24. RESET ANALYSIS SESSION
========================================================= */

function resetAnalysisSession() {

  APP_STATE.repCount = 0;

  APP_STATE.repPhase = "up";

  APP_STATE.lastRepTime = null;

  APP_STATE.repTimes = [];

  APP_STATE.angleHistory = [];

  APP_STATE.barPath = [];

  APP_STATE.latestMetrics = null;


  if ($("currentRepCount")) {

    $("currentRepCount")
      .textContent = "0";

  }


  const target =
    Number(
      $("analysisTargetReps")?.value
    ) || 10;


  if ($("targetRepCount")) {

    $("targetRepCount")
      .textContent =
      target;

  }


  if ($("currentPoseScore")) {

    $("currentPoseScore")
      .textContent =
      "--";

  }


  if ($("analysisTimer")) {

    $("analysisTimer")
      .textContent =
      "00:00";

  }


  if ($("analysisTempo")) {

    $("analysisTempo")
      .textContent =
      "--";

  }


  clearAngleChart();

  clearBarPath();
}


/* =========================================================
   25. ANALYSIS TIMER
========================================================= */

function startAnalysisTimer() {

  stopAnalysisTimer();


  APP_STATE.timerInterval =
    setInterval(() => {

      if (
        !APP_STATE.analysisStartTime
      ) return;


      const elapsed =
        Date.now() -
        APP_STATE.analysisStartTime;


      const seconds =
        Math.floor(
          elapsed / 1000
        );


      const minutes =
        Math.floor(
          seconds / 60
        );


      const remain =
        seconds % 60;


      if ($("analysisTimer")) {

        $("analysisTimer")
          .textContent =
          `${String(minutes).padStart(2, "0")}:${String(remain).padStart(2, "0")}`;

      }

    }, 250);
}


function stopAnalysisTimer() {

  if (
    APP_STATE.timerInterval
  ) {

    clearInterval(
      APP_STATE.timerInterval
    );

  }

  APP_STATE.timerInterval =
    null;
}


/* =========================================================
   26. POSE LOOP
========================================================= */

function startPoseLoop() {

  stopPoseLoop();


  const loop =
    async () => {

      if (
        !APP_STATE.analysisRunning
      ) {
        return;
      }


      if (
        !APP_STATE.poseBusy
      ) {

        const source =
          getPoseSource();


        if (
          source &&
          sourceReady(source)
        ) {

          APP_STATE.poseBusy =
            true;

          try {

            await APP_STATE.pose.send({
              image: source
            });

          } catch (error) {

            console.error(
              "[POSE SEND]",
              error
            );

          } finally {

            APP_STATE.poseBusy =
              false;

          }

        }

      }


      APP_STATE.poseLoopId =
        requestAnimationFrame(
          loop
        );

    };


  APP_STATE.poseLoopId =
    requestAnimationFrame(
      loop
    );
}


function stopPoseLoop() {

  if (
    APP_STATE.poseLoopId
  ) {

    cancelAnimationFrame(
      APP_STATE.poseLoopId
    );

  }

  APP_STATE.poseLoopId =
    null;
}


/* =========================================================
   27. POSE SOURCE
========================================================= */

function getPoseSource() {

  if (
    APP_STATE.sourceType ===
    "camera"
  ) {

    return $("cameraVideo");

  }


  if (
    APP_STATE.sourceType ===
    "upload-video"
  ) {

    return $("uploadedVideo");

  }


  if (
    APP_STATE.sourceType ===
    "upload-image"
  ) {

    return $("uploadedImage");

  }


  return null;
}


function sourceReady(source) {

  if (
    source instanceof HTMLVideoElement
  ) {

    return (
      source.readyState >= 2 &&
      source.videoWidth > 0 &&
      source.videoHeight > 0
    );

  }


  if (
    source instanceof HTMLImageElement
  ) {

    return (
      source.complete &&
      source.naturalWidth > 0
    );

  }


  return false;
}


/* =========================================================
   28. ANALYZE IMAGE
========================================================= */

async function analyzeImageFrame() {

  if (
    !APP_STATE.pose
  ) return;


  const image =
    $("uploadedImage");


  if (!sourceReady(image)) {
    return;
  }


  APP_STATE.poseBusy = true;


  try {

    await APP_STATE.pose.send({
      image
    });

  } finally {

    APP_STATE.poseBusy = false;

  }
}


/* =========================================================
   29. POSE RESULT

   MediaPipe Pose = 33 landmarks
========================================================= */

function handlePoseResults(results) {

  const landmarks =
    results.poseLandmarks;

  const world =
    results.poseWorldLandmarks;


  if (
    !landmarks ||
    landmarks.length < 33
  ) {

    clearPoseCanvas();

    return;
  }


  APP_STATE.latestLandmarks =
    landmarks;

  APP_STATE.latestWorldLandmarks =
    world || null;


  drawPoseSkeleton(
    landmarks
  );


  const metrics =
    calculateBiomechanics(
      landmarks
    );


  APP_STATE.latestMetrics =
    metrics;


  updateLiveMetrics(
    metrics
  );


  if (
    APP_STATE.analysisRunning
  ) {

    updateRepCounter(
      landmarks,
      metrics
    );

    pushAngleHistory(
      metrics
    );

    updateBarPath(
      landmarks
    );

  }
}


/* =========================================================
   30. POSE CANVAS
========================================================= */

function resizePoseCanvas() {

  const viewer =
    document.querySelector(
      ".motion-viewer"
    );

  const canvas =
    $("poseCanvas");

  const pathCanvas =
    $("barPathCanvas");


  if (
    !viewer ||
    !canvas
  ) return;


  const rect =
    viewer.getBoundingClientRect();


  const width =
    Math.max(
      1,
      Math.floor(rect.width)
    );


  const height =
    Math.max(
      1,
      Math.floor(rect.height)
    );


  if (
    canvas.width !== width ||
    canvas.height !== height
  ) {

    canvas.width = width;

    canvas.height = height;

  }


  if (pathCanvas) {

    if (
      pathCanvas.width !== width ||
      pathCanvas.height !== height
    ) {

      pathCanvas.width = width;

      pathCanvas.height = height;

    }

  }
}


/* =========================================================
   31. DRAW 33 LANDMARK SKELETON
========================================================= */

function drawPoseSkeleton(
  landmarks
) {

  const canvas =
    $("poseCanvas");

  if (!canvas) return;


  resizePoseCanvas();


  const ctx =
    canvas.getContext("2d");


  ctx.clearRect(
    0,
    0,
    canvas.width,
    canvas.height
  );


  if (
    !APP_STATE.skeletonVisible
  ) {
    return;
  }


  if (
    typeof drawConnectors !==
      "undefined" &&
    typeof POSE_CONNECTIONS !==
      "undefined"
  ) {

    drawConnectors(
      ctx,
      landmarks,
      POSE_CONNECTIONS,
      {
        lineWidth: 4
      }
    );

  }


  if (
    typeof drawLandmarks !==
    "undefined"
  ) {

    drawLandmarks(
      ctx,
      landmarks,
      {
        lineWidth: 2,
        radius: 4
      }
    );

  }
}


/* =========================================================
   32. CLEAR POSE
========================================================= */

function clearPoseCanvas() {

  const canvas =
    $("poseCanvas");

  if (!canvas) return;


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
   33. LANDMARK INDEX

   MediaPipe Pose 33
========================================================= */

const LM = {

  nose: 0,

  leftShoulder: 11,
  rightShoulder: 12,

  leftElbow: 13,
  rightElbow: 14,

  leftWrist: 15,
  rightWrist: 16,

  leftHip: 23,
  rightHip: 24,

  leftKnee: 25,
  rightKnee: 26,

  leftAnkle: 27,
  rightAnkle: 28,

  leftHeel: 29,
  rightHeel: 30,

  leftFoot: 31,
  rightFoot: 32

};


/* =========================================================
   34. VISIBILITY
========================================================= */

function landmarkVisible(
  landmark,
  minimum = 0.45
) {

  if (!landmark) return false;

  if (
    landmark.visibility ===
    undefined
  ) {
    return true;
  }

  return (
    landmark.visibility >=
    minimum
  );
}


/* =========================================================
   35. ANGLE CALCULATION
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
  ) return null;


  const radians =
    Math.atan2(
      c.y - b.y,
      c.x - b.x
    ) -
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


/* =========================================================
   36. AVERAGE VALID VALUES
========================================================= */

function averageValid(
  values
) {

  const valid =
    values.filter(
      value =>
        Number.isFinite(value)
    );


  if (!valid.length) {
    return null;
  }


  return (
    valid.reduce(
      (sum, value) =>
        sum + value,
      0
    ) /
    valid.length
  );
}


/* =========================================================
   37. BIOMECHANICS
========================================================= */

function calculateBiomechanics(
  lm
) {

  const leftKnee =
    calculateAngle(
      lm[LM.leftHip],
      lm[LM.leftKnee],
      lm[LM.leftAnkle]
    );


  const rightKnee =
    calculateAngle(
      lm[LM.rightHip],
      lm[LM.rightKnee],
      lm[LM.rightAnkle]
    );


  const leftHip =
    calculateAngle(
      lm[LM.leftShoulder],
      lm[LM.leftHip],
      lm[LM.leftKnee]
    );


  const rightHip =
    calculateAngle(
      lm[LM.rightShoulder],
      lm[LM.rightHip],
      lm[LM.rightKnee]
    );


  const leftAnkle =
    calculateAngle(
      lm[LM.leftKnee],
      lm[LM.leftAnkle],
      lm[LM.leftFoot]
    );


  const rightAnkle =
    calculateAngle(
      lm[LM.rightKnee],
      lm[LM.rightAnkle],
      lm[LM.rightFoot]
    );


  const leftElbow =
    calculateAngle(
      lm[LM.leftShoulder],
      lm[LM.leftElbow],
      lm[LM.leftWrist]
    );


  const rightElbow =
    calculateAngle(
      lm[LM.rightShoulder],
      lm[LM.rightElbow],
      lm[LM.rightWrist]
    );


  const shoulderMid = {

    x:
      (
        lm[LM.leftShoulder].x +
        lm[LM.rightShoulder].x
      ) / 2,

    y:
      (
        lm[LM.leftShoulder].y +
        lm[LM.rightShoulder].y
      ) / 2

  };


  const hipMid = {

    x:
      (
        lm[LM.leftHip].x +
        lm[LM.rightHip].x
      ) / 2,

    y:
      (
        lm[LM.leftHip].y +
        lm[LM.rightHip].y
      ) / 2

  };


  const dx =
    shoulderMid.x -
    hipMid.x;

  const dy =
    hipMid.y -
    shoulderMid.y;


  const trunk =
    Math.abs(
      Math.atan2(
        dx,
        dy
      ) *
      180 /
      Math.PI
    );


  const knee =
    averageValid([
      leftKnee,
      rightKnee
    ]);


  const hip =
    averageValid([
      leftHip,
      rightHip
    ]);


  const ankle =
    averageValid([
      leftAnkle,
      rightAnkle
    ]);


  const elbow =
    averageValid([
      leftElbow,
      rightElbow
    ]);


  const kneeDifference =
    (
      Number.isFinite(leftKnee) &&
      Number.isFinite(rightKnee)
    )
      ? Math.abs(
          leftKnee -
          rightKnee
        )
      : 0;


  const hipDifference =
    (
      Number.isFinite(leftHip) &&
      Number.isFinite(rightHip)
    )
      ? Math.abs(
          leftHip -
          rightHip
        )
      : 0;


  const symmetry =
    clamp(
      100 -
      (
        kneeDifference * 1.3 +
        hipDifference * 0.7
      ),
      0,
      100
    );


  const stability =
    clamp(
      100 -
      trunk * 0.8 -
      kneeDifference,
      0,
      100
    );


  const mobility =
    knee
      ? clamp(
          180 - knee,
          0,
          100
        )
      : 0;


  const technique =
    clamp(
      symmetry * 0.45 +
      stability * 0.35 +
      clamp(
        100 - trunk,
        0,
        100
      ) * 0.20,
      0,
      100
    );


  const score =
    clamp(
      symmetry * 0.35 +
      stability * 0.30 +
      technique * 0.35,
      0,
      100
    );


  return {

    knee,
    leftKnee,
    rightKnee,

    hip,
    leftHip,
    rightHip,

    ankle,
    leftAnkle,
    rightAnkle,

    elbow,
    leftElbow,
    rightElbow,

    trunk,

    symmetry,
    stability,
    mobility,
    technique,
    score

  };
}


/* =========================================================
   38. LIVE METRICS
========================================================= */

function updateLiveMetrics(
  metrics
) {

  setAngleText(
    "kneeAngle",
    metrics.knee
  );

  setAngleText(
    "hipAngle",
    metrics.hip
  );

  setAngleText(
    "trunkAngle",
    metrics.trunk
  );

  setAngleText(
    "ankleAngle",
    metrics.ankle
  );


  setAngleText(
    "liveKnee",
    metrics.knee
  );

  setAngleText(
    "liveHip",
    metrics.hip
  );

  setAngleText(
    "liveTrunk",
    metrics.trunk
  );

  setAngleText(
    "liveAnkle",
    metrics.ankle
  );


  if ($("liveSymmetry")) {

    $("liveSymmetry")
      .textContent =
      Math.round(
        metrics.symmetry
      );

  }


  if ($("liveROM")) {

    $("liveROM")
      .textContent =
      metrics.knee
        ? `${Math.round(180 - metrics.knee)}°`
        : "--";

  }


  if ($("liveStability")) {

    $("liveStability")
      .textContent =
      Math.round(
        metrics.stability
      );

  }


  if ($("liveTechnique")) {

    $("liveTechnique")
      .textContent =
      Math.round(
        metrics.technique
      );

  }


  if ($("currentPoseScore")) {

    $("currentPoseScore")
      .textContent =
      Math.round(
        metrics.score
      );

  }
}


function setAngleText(
  id,
  value
) {

  const element = $(id);

  if (!element) return;


  element.textContent =
    Number.isFinite(value)
      ? `${Math.round(value)}°`
      : "-°";
}


/* =========================================================
   39. REP COUNTER

   운동별 counter 설정 사용
========================================================= */

function updateRepCounter(
  landmarks,
  metrics
) {

  const exercise =
    typeof getCurrentExerciseAnalysisConfig ===
    "function"
      ? getCurrentExerciseAnalysisConfig()
      : null;


  if (!exercise) return;


  let counter =
    exercise.counter;


  if (!counter) {

    if (
      [
        "lower",
        "olympic",
        "power",
        "plyometric"
      ].includes(
        exercise.category
      )
    ) {

      counter = {
        joint: "knee",
        downAngle: 110,
        upAngle: 155
      };

    } else if (
      [
        "chest",
        "back",
        "shoulder",
        "arms"
      ].includes(
        exercise.category
      )
    ) {

      counter = {
        joint: "elbow",
        downAngle: 100,
        upAngle: 150
      };

    } else {

      return;
    }

  }


  let angle = null;


  switch (
    counter.joint
  ) {

    case "knee":
      angle = metrics.knee;
      break;

    case "hip":
      angle = metrics.hip;
      break;

    case "elbow":
      angle = metrics.elbow;
      break;

    default:
      angle = metrics.knee;

  }


  if (
    !Number.isFinite(angle)
  ) {
    return;
  }


  if (
    APP_STATE.repPhase ===
      "up" &&
    angle <=
      counter.downAngle
  ) {

    APP_STATE.repPhase =
      "down";

  }


  if (
    APP_STATE.repPhase ===
      "down" &&
    angle >=
      counter.upAngle
  ) {

    APP_STATE.repPhase =
      "up";


    registerRep();

  }
}


/* =========================================================
   40. REGISTER REP
========================================================= */

function registerRep() {

  const now =
    Date.now();


  if (
    APP_STATE.lastRepTime
  ) {

    const duration =
      (
        now -
        APP_STATE.lastRepTime
      ) / 1000;


    if (
      duration > 0.25 &&
      duration < 30
    ) {

      APP_STATE.repTimes.push(
        duration
      );

    }

  }


  APP_STATE.lastRepTime =
    now;


  APP_STATE.repCount += 1;


  if ($("currentRepCount")) {

    $("currentRepCount")
      .textContent =
      APP_STATE.repCount;

  }


  updateTempo();


  const target =
    Number(
      $("analysisTargetReps")?.value
    ) || 10;


  if (
    APP_STATE.repCount >=
      target &&
    APP_STATE.analysisRunning
  ) {

    showToast(
      "목표 반복 횟수 달성"
    );

  }
}


/* =========================================================
   41. TEMPO
========================================================= */

function updateTempo() {

  if (
    !APP_STATE.repTimes.length
  ) {

    $("analysisTempo").textContent =
      "--";

    return;
  }


  const recent =
    APP_STATE.repTimes
      .slice(-3);


  const average =
    recent.reduce(
      (sum, value) =>
        sum + value,
      0
    ) /
    recent.length;


  $("analysisTempo")
    .textContent =
    `${average.toFixed(1)}s`;
}


/* =========================================================
   42. ANGLE CHART
========================================================= */

let angleChart = null;


function initializeAngleChart() {

  const canvas =
    $("angleChart");

  if (
    !canvas ||
    typeof Chart === "undefined"
  ) {
    return;
  }


  angleChart =
    new Chart(
      canvas,
      {

        type: "line",

        data: {

          labels: [],

          datasets: [

            {
              label: "무릎",
              data: [],
              borderWidth: 2,
              pointRadius: 0,
              tension: 0.25
            },

            {
              label: "고관절",
              data: [],
              borderWidth: 2,
              pointRadius: 0,
              tension: 0.25
            },

            {
              label: "몸통",
              data: [],
              borderWidth: 2,
              pointRadius: 0,
              tension: 0.25
            },

            {
              label: "발목",
              data: [],
              borderWidth: 2,
              pointRadius: 0,
              tension: 0.25
            }

          ]

        },

        options: {

          responsive: true,

          maintainAspectRatio: false,

          animation: false,

          interaction: {
            intersect: false,
            mode: "index"
          },

          scales: {

            y: {

              suggestedMin: 0,

              suggestedMax: 180,

              title: {
                display: true,
                text: "ANGLE °"
              }

            },

            x: {

              display: false

            }

          },

          plugins: {

            legend: {
              display: true
            }

          }

        }

      }
    );
}


/* =========================================================
   43. PUSH ANGLE HISTORY
========================================================= */

function pushAngleHistory(
  metrics
) {

  const item = {

    time:
      (
        Date.now() -
        APP_STATE.analysisStartTime
      ) / 1000,

    knee:
      metrics.knee,

    hip:
      metrics.hip,

    trunk:
      metrics.trunk,

    ankle:
      metrics.ankle

  };


  APP_STATE.angleHistory.push(
    item
  );


  if (
    APP_STATE.angleHistory.length >
    APP_STATE.maxHistory
  ) {

    APP_STATE.angleHistory.shift();

  }


  updateAngleChart();
}


/* =========================================================
   44. UPDATE ANGLE CHART
========================================================= */

function updateAngleChart() {

  if (!angleChart) return;


  const history =
    APP_STATE.angleHistory;


  angleChart.data.labels =
    history.map(
      item =>
        item.time.toFixed(1)
    );


  angleChart
    .data
    .datasets[0]
    .data =
    history.map(
      item => item.knee
    );


  angleChart
    .data
    .datasets[1]
    .data =
    history.map(
      item => item.hip
    );


  angleChart
    .data
    .datasets[2]
    .data =
    history.map(
      item => item.trunk
    );


  angleChart
    .data
    .datasets[3]
    .data =
    history.map(
      item => item.ankle
    );


  angleChart.update("none");
}


/* =========================================================
   45. CLEAR ANGLE CHART
========================================================= */

function clearAngleChart() {

  if (!angleChart) return;


  angleChart.data.labels = [];


  angleChart
    .data
    .datasets
    .forEach(dataset => {

      dataset.data = [];

    });


  angleChart.update("none");
}


/* =========================================================
   46. BAR PATH

   영상에서 손목 중앙 궤적을 표시
========================================================= */

function updateBarPath(
  landmarks
) {

  if (
    !APP_STATE.barPathVisible
  ) return;


  const left =
    landmarks[
      LM.leftWrist
    ];

  const right =
    landmarks[
      LM.rightWrist
    ];


  if (
    !landmarkVisible(left) ||
    !landmarkVisible(right)
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


  APP_STATE.barPath.push(
    point
  );


  if (
    APP_STATE.barPath.length >
    150
  ) {

    APP_STATE.barPath.shift();

  }


  drawBarPath();
}


/* =========================================================
   47. DRAW BAR PATH
========================================================= */

function drawBarPath() {

  const canvas =
    $("barPathCanvas");

  if (!canvas) return;


  resizePoseCanvas();


  const ctx =
    canvas.getContext("2d");


  ctx.clearRect(
    0,
    0,
    canvas.width,
    canvas.height
  );


  if (
    !APP_STATE.barPathVisible ||
    APP_STATE.barPath.length <
      2
  ) {
    return;
  }


  ctx.lineWidth = 4;

  ctx.beginPath();


  APP_STATE.barPath.forEach(
    (point, index) => {

      const x =
        point.x *
        canvas.width;

      const y =
        point.y *
        canvas.height;


      if (index === 0) {

        ctx.moveTo(x, y);

      } else {

        ctx.lineTo(x, y);

      }

    }
  );


  ctx.stroke();
}


/* =========================================================
   48. CLEAR BAR PATH
========================================================= */

function clearBarPath() {

  APP_STATE.barPath = [];


  const canvas =
    $("barPathCanvas");

  if (!canvas) return;


  canvas
    .getContext("2d")
    .clearRect(
      0,
      0,
      canvas.width,
      canvas.height
    );
}


/* =========================================================
   49. PLAYBACK SPEED
========================================================= */

function initializePlayback() {

  $("playbackSpeed")
    ?.addEventListener(
      "change",
      event => {

        const video =
          $("uploadedVideo");

        if (!video) return;


        video.playbackRate =
          Number(
            event.target.value
          ) || 1;

      }
    );


  $("playPauseBtn")
    ?.addEventListener(
      "click",
      () => {

        const video =
          $("uploadedVideo");


        if (
          !video ||
          video.hidden
        ) {
          return;
        }


        if (video.paused) {

          video.play();

        } else {

          video.pause();

        }

      }
    );


  $("frameBackBtn")
    ?.addEventListener(
      "click",
      () => {

        stepVideoFrame(-1);

      }
    );


  $("frameForwardBtn")
    ?.addEventListener(
      "click",
      () => {

        stepVideoFrame(1);

      }
    );
}


/* =========================================================
   50. FRAME STEP
========================================================= */

function stepVideoFrame(
  direction
) {

  const video =
    $("uploadedVideo");


  if (
    !video ||
    video.hidden
  ) {
    return;
  }


  video.pause();


  /*
    일반 영상 기준 30fps 가정.
    실제 영상 fps 메타데이터는
    브라우저 video 요소에서 직접 제공하지 않음.
  */

  const frameDuration =
    1 / 30;


  video.currentTime =
    clamp(
      video.currentTime +
      direction *
      frameDuration,
      0,
      video.duration || 0
    );


  setTimeout(
    analyzeCurrentVideoFrame,
    40
  );
}


async function analyzeCurrentVideoFrame() {

  if (!APP_STATE.pose) {
    await initializePoseEngine();
  }


  const video =
    $("uploadedVideo");


  if (!sourceReady(video)) {
    return;
  }


  if (
    APP_STATE.poseBusy
  ) return;


  APP_STATE.poseBusy = true;


  try {

    await APP_STATE.pose.send({
      image: video
    });

  } finally {

    APP_STATE.poseBusy =
      false;

  }
}


/* =========================================================
   51. VIEW SELECTOR
========================================================= */

function initializeViewSelector() {

  document
    .querySelectorAll(
      ".view-button"
    )
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          document
            .querySelectorAll(
              ".view-button"
            )
            .forEach(item => {

              item.classList.remove(
                "active"
              );

            });


          button.classList.add(
            "active"
          );


          APP_STATE.analysisView =
            button.dataset.view;

        }
      );

    });
}


window.setAnalysisView =
  function(view) {

    APP_STATE.analysisView =
      view;

  };


/* =========================================================
   52. 2D / 3D MODE
========================================================= */

function initializeAnalysisMode() {

  document
    .querySelectorAll(
      ".mode-button"
    )
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          document
            .querySelectorAll(
              ".mode-button"
            )
            .forEach(item => {

              item.classList.remove(
                "active"
              );

            });


          button.classList.add(
            "active"
          );


          APP_STATE.analysisMode =
            button.dataset.analysisMode;


          if (
            APP_STATE.analysisMode ===
            "3d"
          ) {

            showToast(
              "3D AI 좌표 추정 모드"
            );

          }

        }
      );

    });
}


/* =========================================================
   53. DISPLAY TOGGLES
========================================================= */

function initializeDisplayToggles() {

  $("toggleSkeletonBtn")
    ?.addEventListener(
      "click",
      () => {

        APP_STATE.skeletonVisible =
          !APP_STATE.skeletonVisible;


        if (
          APP_STATE.latestLandmarks
        ) {

          drawPoseSkeleton(
            APP_STATE.latestLandmarks
          );

        }

      }
    );


  $("toggleReferenceBtn")
    ?.addEventListener(
      "click",
      () => {

        APP_STATE.referenceVisible =
          !APP_STATE.referenceVisible;


        updateReferenceLines();

      }
    );


  $("toggleBarPathBtn")
    ?.addEventListener(
      "click",
      () => {

        APP_STATE.barPathVisible =
          !APP_STATE.barPathVisible;


        if (
          APP_STATE.barPathVisible
        ) {

          drawBarPath();

        } else {

          const canvas =
            $("barPathCanvas");

          canvas
            ?.getContext("2d")
            .clearRect(
              0,
              0,
              canvas.width,
              canvas.height
            );

        }

      }
    );
}


/* =========================================================
   54. REFERENCE LINES
========================================================= */

function updateReferenceLines() {

  const vertical =
    $("referenceVertical");

  const horizontal =
    $("referenceHorizontal");


  if (vertical) {

    vertical.style.display =
      APP_STATE.referenceVisible
        ? ""
        : "none";

  }


  if (horizontal) {

    horizontal.style.display =
      APP_STATE.referenceVisible
        ? ""
        : "none";

  }
}


/* =========================================================
   55. ANALYSIS BUTTON EVENTS
========================================================= */

function initializeAnalysisButtons() {

  $("connectCameraBtn")
    ?.addEventListener(
      "click",
      connectCamera
    );


  $("switchCameraBtn")
    ?.addEventListener(
      "click",
      switchCamera
    );


  $("startAnalysisBtn")
    ?.addEventListener(
      "click",
      startAnalysis
    );


  /*
    ★ 분석 종료 버튼 직접 연결
  */

  $("stopAnalysisBtn")
    ?.addEventListener(
      "click",
      stopAnalysis
    );
}
/* =========================================================
   APP.JS
   PART 2 / 2

   - Save Analysis
   - Dashboard
   - Records
   - Training Program
   - Recommendations
   - Report
   - CSV Export
   - Backup / Restore
   - Settings
   - Final Initialization
========================================================= */


/* =========================================================
   56. CURRENT EXERCISE
========================================================= */

function getCurrentExercise() {

  const id =
    $("analysisExercise")?.value;

  if (!id) return null;


  if (
    typeof EXERCISES !== "undefined"
  ) {

    return EXERCISES.find(
      exercise =>
        String(exercise.id) === String(id)
    ) || null;

  }


  if (
    typeof exercises !== "undefined"
  ) {

    return exercises.find(
      exercise =>
        String(exercise.id) === String(id)
    ) || null;

  }


  return null;
}


/* =========================================================
   57. CURRENT ATHLETE
========================================================= */

function getCurrentAthlete() {

  const id =
    $("analysisAthlete")?.value ||
    APP_STATE.selectedAthleteId;


  return athletes.find(
    athlete =>
      athlete.id === id
  ) || null;
}


/* =========================================================
   58. ANALYSIS DURATION
========================================================= */

function getAnalysisDuration() {

  if (
    !APP_STATE.analysisStartTime
  ) {
    return 0;
  }


  return round(
    (
      Date.now() -
      APP_STATE.analysisStartTime
    ) / 1000,
    1
  );
}


/* =========================================================
   59. ANALYSIS AVERAGE METRICS
========================================================= */

function calculateSessionAverage() {

  const history =
    APP_STATE.angleHistory;


  const latest =
    APP_STATE.latestMetrics;


  if (!latest) {

    return {

      knee: 0,
      hip: 0,
      trunk: 0,
      ankle: 0,

      symmetry: 0,
      stability: 0,
      mobility: 0,
      technique: 0,
      score: 0

    };
  }


  if (!history.length) {

    return {

      knee:
        latest.knee || 0,

      hip:
        latest.hip || 0,

      trunk:
        latest.trunk || 0,

      ankle:
        latest.ankle || 0,

      symmetry:
        latest.symmetry || 0,

      stability:
        latest.stability || 0,

      mobility:
        latest.mobility || 0,

      technique:
        latest.technique || 0,

      score:
        latest.score || 0

    };
  }


  const average =
    key => {

      const values =
        history
          .map(item => item[key])
          .filter(
            value =>
              Number.isFinite(value)
          );


      if (!values.length) {
        return 0;
      }


      return (
        values.reduce(
          (sum, value) =>
            sum + value,
          0
        ) /
        values.length
      );
    };


  return {

    knee:
      average("knee"),

    hip:
      average("hip"),

    trunk:
      average("trunk"),

    ankle:
      average("ankle"),

    symmetry:
      latest.symmetry || 0,

    stability:
      latest.stability || 0,

    mobility:
      latest.mobility || 0,

    technique:
      latest.technique || 0,

    score:
      latest.score || 0

  };
}


/* =========================================================
   60. ANALYSIS SNAPSHOT

   리포트 대표 장면용
========================================================= */

function captureAnalysisSnapshot() {

  const viewer =
    document.querySelector(
      ".motion-viewer"
    );


  const source =
    getPoseSource();


  if (
    !viewer ||
    !source ||
    !sourceReady(source)
  ) {
    return "";
  }


  try {

    const canvas =
      document.createElement(
        "canvas"
      );


    const width = 960;

    const height = 540;


    canvas.width = width;

    canvas.height = height;


    const ctx =
      canvas.getContext("2d");


    ctx.drawImage(
      source,
      0,
      0,
      width,
      height
    );


    /*
      현재 스켈레톤 캔버스도
      대표 프레임에 합성
    */

    const poseCanvas =
      $("poseCanvas");


    if (poseCanvas) {

      ctx.drawImage(
        poseCanvas,
        0,
        0,
        width,
        height
      );

    }


    return canvas.toDataURL(
      "image/jpeg",
      0.72
    );


  } catch (error) {

    console.warn(
      "[SNAPSHOT]",
      error
    );

    return "";
  }
}


/* =========================================================
   61. SAVE CURRENT ANALYSIS
========================================================= */

function saveCurrentAnalysis() {

  const athlete =
    getCurrentAthlete();


  const exercise =
    getCurrentExercise();


  if (
    !athlete ||
    !exercise
  ) {

    console.warn(
      "분석 저장 조건 부족"
    );

    return;
  }


  const metrics =
    calculateSessionAverage();


  const duration =
    getAnalysisDuration();


  const averageRepTime =
    APP_STATE.repTimes.length

      ? APP_STATE.repTimes.reduce(
          (sum, value) =>
            sum + value,
          0
        ) /
        APP_STATE.repTimes.length

      : 0;


  const previousRecords =
    analysisRecords.filter(
      record =>
        record.athleteId ===
          athlete.id &&
        record.exerciseId ===
          exercise.id
    );


  const previousBest =
    previousRecords.length

      ? Math.max(
          ...previousRecords.map(
            record =>
              Number(
                record.score
              ) || 0
          )
        )

      : 0;


  const score =
    Math.round(
      metrics.score
    );


  const isPR =
    previousRecords.length > 0 &&
    score > previousBest;


  const record = {

    id:
      createId("analysis"),

    createdAt:
      new Date().toISOString(),

    athleteId:
      athlete.id,

    athleteName:
      athlete.name,

    exerciseId:
      exercise.id,

    exerciseName:
      exercise.name,

    category:
      exercise.category || "",

    equipment:
      exercise.equipment || "",

    pictogram:
      exercise.pictogram || "🏋",

    view:
      APP_STATE.analysisView,

    mode:
      APP_STATE.analysisMode,

    source:
      APP_STATE.sourceType,

    reps:
      APP_STATE.repCount,

    targetReps:
      Number(
        $("analysisTargetReps")?.value
      ) || 0,

    duration,

    averageRepTime:
      round(
        averageRepTime,
        2
      ),

    score,

    knee:
      round(
        metrics.knee,
        1
      ),

    hip:
      round(
        metrics.hip,
        1
      ),

    trunk:
      round(
        metrics.trunk,
        1
      ),

    ankle:
      round(
        metrics.ankle,
        1
      ),

    symmetry:
      Math.round(
        metrics.symmetry
      ),

    stability:
      Math.round(
        metrics.stability
      ),

    mobility:
      Math.round(
        metrics.mobility
      ),

    technique:
      Math.round(
        metrics.technique
      ),

    /*
      간단한 파워/근력 추정 지표.
      실제 force plate 측정값 아님.
    */

    strength:
      calculateStrengthScore(
        exercise,
        metrics
      ),

    power:
      calculatePowerScore(
        exercise,
        metrics
      ),

    recommendations:
      generateTrainingRecommendations(
        exercise,
        metrics
      ),

    snapshot:
      captureAnalysisSnapshot(),

    isPR,

    angleHistory:
      APP_STATE.angleHistory
        .slice(-120)

  };


  analysisRecords.unshift(
    record
  );


  /*
    localStorage 용량 때문에
    분석 기록 최대 100개 유지
  */

  if (
    analysisRecords.length >
    100
  ) {

    analysisRecords =
      analysisRecords.slice(
        0,
        100
      );

  }


  saveData(
    STORAGE.records,
    analysisRecords
  );


  renderTrainingRecommendations(
    record.recommendations
  );


  if (isPR) {

    showToast(
      `🏆 새로운 PR · ${score}점`
    );

  }
}


/* =========================================================
   62. STRENGTH SCORE
========================================================= */

function calculateStrengthScore(
  exercise,
  metrics
) {

  let base =
    metrics.technique * 0.55 +
    metrics.stability * 0.45;


  if (
    [
      "lower",
      "chest",
      "back",
      "olympic"
    ].includes(
      exercise.category
    )
  ) {

    base += 4;

  }


  return Math.round(
    clamp(
      base,
      0,
      100
    )
  );
}


/* =========================================================
   63. POWER SCORE
========================================================= */

function calculatePowerScore(
  exercise,
  metrics
) {

  let base =
    metrics.technique * 0.45 +
    metrics.mobility * 0.25 +
    metrics.stability * 0.30;


  if (
    [
      "power",
      "plyometric",
      "olympic"
    ].includes(
      exercise.category
    )
  ) {

    base += 8;

  }


  return Math.round(
    clamp(
      base,
      0,
      100
    )
  );
}


/* =========================================================
   64. TRAINING RECOMMENDATION ENGINE
========================================================= */

function generateTrainingRecommendations(
  exercise,
  metrics
) {

  const recommendations = [];


  const add = (
    name,
    reason,
    category = "보강"
  ) => {

    if (
      recommendations.some(
        item =>
          item.name === name
      )
    ) {
      return;
    }


    recommendations.push({

      name,
      reason,
      category

    });

  };


  /*
    무릎 ROM 부족
  */

  if (
    metrics.knee > 115
  ) {

    add(
      "고블릿 스쿼트",
      "스쿼트 깊이와 하체 가동범위 향상",
      "하체"
    );

    add(
      "템포 스쿼트",
      "하강 구간 제어와 자세 안정성 향상",
      "하체"
    );

    add(
      "발목 가동성 드릴",
      "발목 배측굴곡과 스쿼트 깊이 개선",
      "가동성"
    );

    add(
      "힐 엘리베이티드 스쿼트",
      "무릎 전방 이동과 대퇴사두근 사용 연습",
      "하체"
    );
  }


  /*
    좌우 비대칭
  */

  if (
    metrics.symmetry < 88
  ) {

    add(
      "불가리안 스플릿 스쿼트",
      "좌우 하체 근력 차이 보완",
      "하체"
    );

    add(
      "리버스 런지",
      "편측 안정성과 하체 제어 향상",
      "하체"
    );

    add(
      "싱글 레그 RDL",
      "편측 고관절 안정성과 균형 향상",
      "하체"
    );

    add(
      "스텝업",
      "좌우 독립적인 힘 발휘 능력 향상",
      "하체"
    );

    add(
      "싱글 레그 스쿼트 보조",
      "좌우 움직임 패턴 비교 및 교정",
      "맨몸"
    );
  }


  /*
    몸통 안정성
  */

  if (
    metrics.stability < 88 ||
    metrics.trunk > 35
  ) {

    add(
      "데드버그",
      "몸통 고정과 골반 제어 향상",
      "코어"
    );

    add(
      "버드독",
      "척추 안정성과 교차 패턴 제어",
      "코어"
    );

    add(
      "팔로프 프레스",
      "회전 저항 능력 향상",
      "코어"
    );

    add(
      "플랭크",
      "기본 몸통 안정성 강화",
      "코어"
    );

    add(
      "사이드 플랭크",
      "측면 코어와 골반 안정성 강화",
      "코어"
    );

    add(
      "프론트 랙 캐리",
      "몸통 강성과 자세 유지 능력 강화",
      "기능성"
    );
  }


  /*
    가동성
  */

  if (
    metrics.mobility < 70
  ) {

    add(
      "90/90 힙 모빌리티",
      "고관절 회전 가동성 향상",
      "가동성"
    );

    add(
      "딥 스쿼트 홀드",
      "하체 복합 가동범위 향상",
      "가동성"
    );

    add(
      "월 앵클 드릴",
      "발목 가동범위 향상",
      "가동성"
    );

    add(
      "코사크 스쿼트",
      "고관절 측면 가동성과 내전근 제어",
      "가동성"
    );
  }


  /*
    파워 계열
  */

  if (
    [
      "power",
      "olympic",
      "plyometric"
    ].includes(
      exercise.category
    )
  ) {

    add(
      "박스 점프",
      "폭발적인 하체 신전 능력 향상",
      "파워"
    );

    add(
      "스쿼트 점프",
      "수직 파워 발달",
      "파워"
    );

    add(
      "메디신볼 스로우",
      "전신 폭발력과 힘 전달 연습",
      "파워"
    );

    add(
      "점프 슈러그",
      "폭발적인 고관절 신전 패턴 강화",
      "올림픽 리프팅"
    );
  }


  /*
    상체 계열
  */

  if (
    [
      "chest",
      "back",
      "shoulder",
      "arms"
    ].includes(
      exercise.category
    )
  ) {

    add(
      "스캐풀라 푸시업",
      "견갑골 움직임과 상체 안정성 향상",
      "상체"
    );

    add(
      "밴드 페이스풀",
      "후면 어깨와 견갑 안정성 강화",
      "상체"
    );

    add(
      "밴드 외회전",
      "회전근개 제어 능력 강화",
      "보강"
    );

    add(
      "푸시업",
      "상체 기본 밀기 패턴 강화",
      "맨몸"
    );
  }


  /*
    일반 하체
  */

  if (
    exercise.category ===
      "lower"
  ) {

    add(
      "맨몸 스쿼트",
      "기본 스쿼트 패턴 반복 학습",
      "맨몸"
    );

    add(
      "워킹 런지",
      "하체 근력과 동적 안정성 향상",
      "하체"
    );

    add(
      "글루트 브리지",
      "둔근 활성과 고관절 신전 강화",
      "하체"
    );

    add(
      "카프 레이즈",
      "발목과 종아리 지지 능력 강화",
      "하체"
    );
  }


  /*
    결과가 좋아도 발전용 추천
  */

  if (
    recommendations.length < 5
  ) {

    add(
      "템포 트레이닝",
      "동작 속도 제어와 기술 일관성 향상",
      "기술"
    );

    add(
      "아이소메트릭 홀드",
      "특정 관절 각도에서의 안정성 강화",
      "기술"
    );

    add(
      "저중량 기술 세트",
      "피로가 적은 상태에서 정확한 동작 반복",
      "기술"
    );

    add(
      "코어 브레이싱 드릴",
      "전신 힘 전달을 위한 몸통 고정 능력 향상",
      "코어"
    );

    add(
      "편측 보강 운동",
      "좌우 균형과 움직임 안정성 유지",
      "보강"
    );
  }


  return recommendations.slice(
    0,
    12
  );
}


/* =========================================================
   65. RENDER RECOMMENDATIONS
========================================================= */

function renderTrainingRecommendations(
  recommendations = []
) {

  const container =
    $("trainingRecommendations");


  if (!container) return;


  if (
    !recommendations.length
  ) {

    container.innerHTML = `
      <div class="empty-state">
        분석 완료 후 추천 훈련이 표시됩니다.
      </div>
    `;

    return;
  }


  container.innerHTML =
    recommendations
      .map(
        (item, index) => `
          <article class="recommendation-card">

            <div class="recommendation-number">
              ${String(index + 1).padStart(2, "0")}
            </div>

            <div>

              <span class="recommendation-category">
                ${item.category}
              </span>

              <h4>
                ${item.name}
              </h4>

              <p>
                ${item.reason}
              </p>

            </div>

          </article>
        `
      )
      .join("");
}


/* =========================================================
   66. DASHBOARD CHARTS
========================================================= */

let performanceRadarChart = null;

let performanceTrendChart = null;


/* =========================================================
   67. INITIALIZE DASHBOARD RADAR
========================================================= */

function initializePerformanceRadar() {

  const canvas =
    $("performanceRadar");


  if (
    !canvas ||
    typeof Chart ===
      "undefined"
  ) {
    return;
  }


  performanceRadarChart =
    new Chart(
      canvas,
      {

        type: "radar",

        data: {

          labels: [
            "근력",
            "파워",
            "안정성",
            "대칭성",
            "가동성",
            "기술"
          ],

          datasets: [
            {

              label:
                "Performance",

              data: [
                0,
                0,
                0,
                0,
                0,
                0
              ],

              borderWidth: 2,

              pointRadius: 3

            }
          ]

        },

        options: {

          responsive: true,

          maintainAspectRatio: false,

          scales: {

            r: {

              min: 0,

              max: 100,

              ticks: {
                display: false
              },

              pointLabels: {
                font: {
                  size: 12
                }
              }

            }

          },

          plugins: {

            legend: {
              display: false
            }

          }

        }

      }
    );
}


/* =========================================================
   68. PERFORMANCE TREND
========================================================= */

function initializePerformanceTrend() {

  const canvas =
    $("performanceTrendChart");


  if (
    !canvas ||
    typeof Chart ===
      "undefined"
  ) {
    return;
  }


  performanceTrendChart =
    new Chart(
      canvas,
      {

        type: "line",

        data: {

          labels: [],

          datasets: [

            {
              label: "기술 점수",
              data: [],
              borderWidth: 3,
              pointRadius: 3,
              tension: 0.3
            },

            {
              label: "대칭성",
              data: [],
              borderWidth: 2,
              pointRadius: 2,
              tension: 0.3
            }

          ]

        },

        options: {

          responsive: true,

          maintainAspectRatio: false,

          scales: {

            y: {

              min: 0,

              max: 100

            }

          }

        }

      }
    );
}


/* =========================================================
   69. RENDER DASHBOARD
========================================================= */

function renderDashboard() {

  if ($("dashboardAthleteCount")) {

    $("dashboardAthleteCount")
      .textContent =
      athletes.length;

  }


  if ($("dashboardAnalysisCount")) {

    $("dashboardAnalysisCount")
      .textContent =
      analysisRecords.length;

  }


  const averageScore =
    analysisRecords.length

      ? analysisRecords.reduce(
          (sum, record) =>
            sum +
            (
              Number(
                record.score
              ) || 0
            ),
          0
        ) /
        analysisRecords.length

      : 0;


  if ($("dashboardAverageScore")) {

    $("dashboardAverageScore")
      .textContent =
      analysisRecords.length
        ? Math.round(
            averageScore
          )
        : "--";

  }


  const prRecords =
    analysisRecords.filter(
      record =>
        record.isPR
    );


  if ($("dashboardPRCount")) {

    $("dashboardPRCount")
      .textContent =
      prRecords.length;

  }


  let athlete =
    athletes.find(
      item =>
        item.id ===
        APP_STATE.selectedAthleteId
    );


  if (
    !athlete &&
    athletes.length
  ) {

    athlete =
      athletes[0];

    APP_STATE.selectedAthleteId =
      athlete.id;

  }


  if (!athlete) {

    if ($("dashboardAthleteName")) {
      $("dashboardAthleteName")
        .textContent =
        "선수 미선택";
    }

    if ($("dashboardAthleteSport")) {
      $("dashboardAthleteSport")
        .textContent = "-";
    }

    if ($("dashboardHeight")) {
      $("dashboardHeight")
        .textContent = "-";
    }

    if ($("dashboardWeight")) {
      $("dashboardWeight")
        .textContent = "-";
    }

    if ($("dashboardLatestScore")) {
      $("dashboardLatestScore")
        .textContent = "-";
    }


    updateDashboardRadar(null);

    renderDashboardRecent();

    renderDashboardPR();

    updatePerformanceTrend();

    return;
  }


  $("dashboardAthleteName")
    .textContent =
    athlete.name;


  $("dashboardAthleteSport")
    .textContent =
    athlete.sport || "-";


  $("dashboardHeight")
    .textContent =
    athlete.height
      ? `${athlete.height} cm`
      : "-";


  $("dashboardWeight")
    .textContent =
    athlete.weight
      ? `${athlete.weight} kg`
      : "-";


  const records =
    analysisRecords.filter(
      record =>
        record.athleteId ===
        athlete.id
    );


  const latest =
    records[0];


  $("dashboardLatestScore")
    .textContent =
    latest
      ? `${latest.score}/100`
      : "-";


  updateDashboardRadar(
    latest
  );

  renderDashboardRecent();

  renderDashboardPR();

  updatePerformanceTrend();
}


/* =========================================================
   70. DASHBOARD RADAR
========================================================= */

function updateDashboardRadar(
  record
) {

  const values =
    record

      ? [
          record.strength || 0,
          record.power || 0,
          record.stability || 0,
          record.symmetry || 0,
          record.mobility || 0,
          record.technique || 0
        ]

      : [
          0,
          0,
          0,
          0,
          0,
          0
        ];


  if (
    performanceRadarChart
  ) {

    performanceRadarChart
      .data
      .datasets[0]
      .data =
      values;


    performanceRadarChart.update();

  }


  const ids = [
    "radarStrength",
    "radarPower",
    "radarStability",
    "radarSymmetry",
    "radarMobility",
    "radarTechnique"
  ];


  ids.forEach(
    (id, index) => {

      if ($(id)) {

        $(id).textContent =
          Math.round(
            values[index]
          );

      }

    }
  );
}


/* =========================================================
   71. DASHBOARD RECENT
========================================================= */

function renderDashboardRecent() {

  const container =
    $("dashboardRecentList");

  if (!container) return;


  const records =
    APP_STATE.selectedAthleteId

      ? analysisRecords.filter(
          record =>
            record.athleteId ===
            APP_STATE.selectedAthleteId
        )

      : analysisRecords;


  const recent =
    records.slice(
      0,
      5
    );


  if (!recent.length) {

    container.innerHTML = `
      <div class="empty-state">
        아직 분석 기록이 없습니다.
      </div>
    `;

    return;
  }


  container.innerHTML =
    recent
      .map(
        record => `
          <div class="recent-analysis-row">

            <div class="recent-icon">
              ${record.pictogram || "🏋"}
            </div>

            <div>

              <strong>
                ${record.exerciseName}
              </strong>

              <span>
                ${formatDate(record.createdAt)}
              </span>

            </div>

            <strong class="recent-score">
              ${record.score}
            </strong>

          </div>
        `
      )
      .join("");
}


/* =========================================================
   72. DASHBOARD PR
========================================================= */

function renderDashboardPR() {

  const container =
    $("dashboardPRList");

  if (!container) return;


  let records =
    analysisRecords.filter(
      record =>
        record.isPR
    );


  if (
    APP_STATE.selectedAthleteId
  ) {

    records =
      records.filter(
        record =>
          record.athleteId ===
          APP_STATE.selectedAthleteId
      );

  }


  records =
    records.slice(
      0,
      5
    );


  if (!records.length) {

    container.innerHTML = `
      <div class="empty-state">
        기록된 PR이 없습니다.
      </div>
    `;

    return;
  }


  container.innerHTML =
    records
      .map(
        record => `
          <div class="pr-row">

            <span>
              🏆
            </span>

            <div>

              <strong>
                ${record.exerciseName}
              </strong>

              <small>
                ${formatDate(record.createdAt)}
              </small>

            </div>

            <strong>
              ${record.score}
            </strong>

          </div>
        `
      )
      .join("");
}


/* =========================================================
   73. PERFORMANCE TREND UPDATE
========================================================= */

function updatePerformanceTrend() {

  if (
    !performanceTrendChart
  ) return;


  const period =
    Number(
      $("dashboardPeriod")?.value
    ) || 7;


  let records =
    analysisRecords;


  if (
    APP_STATE.selectedAthleteId
  ) {

    records =
      records.filter(
        record =>
          record.athleteId ===
          APP_STATE.selectedAthleteId
      );

  }


  records =
    records
      .slice(
        0,
        period
      )
      .reverse();


  performanceTrendChart
    .data
    .labels =
    records.map(
      record =>
        shortDate(
          record.createdAt
        )
    );


  performanceTrendChart
    .data
    .datasets[0]
    .data =
    records.map(
      record =>
        record.score
    );


  performanceTrendChart
    .data
    .datasets[1]
    .data =
    records.map(
      record =>
        record.symmetry
    );


  performanceTrendChart.update();
}


/* =========================================================
   74. DASHBOARD PERIOD
========================================================= */

function initializeDashboardPeriod() {

  $("dashboardPeriod")
    ?.addEventListener(
      "change",
      updatePerformanceTrend
    );
}


/* =========================================================
   75. DATE FORMAT
========================================================= */

function formatDate(value) {

  if (!value) return "-";


  return new Date(value)
    .toLocaleString(
      "ko-KR",
      {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit"
      }
    );
}


function shortDate(value) {

  const date =
    new Date(value);


  return (
    `${date.getMonth() + 1}/${date.getDate()}`
  );
}


/* =========================================================
   76. RECORD FILTER EXERCISES
========================================================= */

function populateRecordExerciseFilter() {

  const select =
    $("recordExerciseFilter");

  if (!select) return;


  const names =
    [
      ...new Set(
        analysisRecords.map(
          record =>
            record.exerciseName
        )
      )
    ]
      .filter(Boolean)
      .sort();


  const old =
    select.value;


  select.innerHTML = `
    <option value="all">
      전체 운동
    </option>

    ${names
      .map(
        name => `
          <option value="${name}">
            ${name}
          </option>
        `
      )
      .join("")}
  `;


  if (
    names.includes(old)
  ) {
    select.value = old;
  }
}


/* =========================================================
   77. RENDER RECORDS
========================================================= */

function renderRecords() {

  const body =
    $("recordsTableBody");

  if (!body) return;


  populateRecordExerciseFilter();


  const athleteFilter =
    $("recordAthleteFilter")
      ?.value || "all";


  const exerciseFilter =
    $("recordExerciseFilter")
      ?.value || "all";


  const search =
    $("recordSearch")
      ?.value
      .trim()
      .toLowerCase() || "";


  const filtered =
    analysisRecords.filter(
      record => {

        const athleteOK =
          athleteFilter === "all" ||
          record.athleteId ===
            athleteFilter;


        const exerciseOK =
          exerciseFilter === "all" ||
          record.exerciseName ===
            exerciseFilter;


        const searchOK =
          !search ||
          record.athleteName
            ?.toLowerCase()
            .includes(search) ||
          record.exerciseName
            ?.toLowerCase()
            .includes(search);


        return (
          athleteOK &&
          exerciseOK &&
          searchOK
        );

      }
    );


  if (!filtered.length) {

    body.innerHTML = `
      <tr>
        <td
          colspan="8"
          class="empty-table"
        >
          저장된 분석 기록이 없습니다.
        </td>
      </tr>
    `;

    return;
  }


  body.innerHTML =
    filtered
      .map(
        record => `
          <tr>

            <td>
              ${formatDate(record.createdAt)}
            </td>

            <td>
              ${record.athleteName}
            </td>

            <td>
              ${record.pictogram || "🏋"}
              ${record.exerciseName}
            </td>

            <td>
              ${record.reps}
            </td>

            <td>
              <strong>
                ${record.score}
              </strong>
            </td>

            <td>
              ${record.symmetry}%
            </td>

            <td>
              ${record.mobility}
            </td>

            <td>

              <button
                class="table-action-button"
                data-record-detail="${record.id}"
              >
                상세
              </button>

            </td>

          </tr>
        `
      )
      .join("");


  body
    .querySelectorAll(
      "[data-record-detail]"
    )
    .forEach(
      button => {

        button.addEventListener(
          "click",
          () => {

            openRecordDetail(
              button.dataset.recordDetail
            );

          }
        );

      }
    );
}


/* =========================================================
   78. RECORD FILTER EVENTS
========================================================= */

function initializeRecordFilters() {

  [
    "recordAthleteFilter",
    "recordExerciseFilter"
  ]
    .forEach(id => {

      $(id)
        ?.addEventListener(
          "change",
          renderRecords
        );

    });


  $("recordSearch")
    ?.addEventListener(
      "input",
      renderRecords
    );
}


/* =========================================================
   79. RECORD DETAIL
========================================================= */

function openRecordDetail(
  id
) {

  const record =
    analysisRecords.find(
      item =>
        item.id === id
    );


  if (!record) return;


  const container =
    $("recordDetailContent");


  if (!container) return;


  container.innerHTML = `

    <div class="record-detail-header">

      <div class="record-detail-icon">
        ${record.pictogram || "🏋"}
      </div>

      <div>

        <span class="eyebrow">
          ${record.athleteName}
        </span>

        <h3>
          ${record.exerciseName}
        </h3>

        <p>
          ${formatDate(record.createdAt)}
        </p>

      </div>

      <div class="record-detail-score">
        ${record.score}
      </div>

    </div>


    <div class="record-detail-grid">

      <div>
        <span>반복</span>
        <strong>${record.reps}</strong>
      </div>

      <div>
        <span>측정 시간</span>
        <strong>${record.duration}s</strong>
      </div>

      <div>
        <span>대칭성</span>
        <strong>${record.symmetry}%</strong>
      </div>

      <div>
        <span>안정성</span>
        <strong>${record.stability}</strong>
      </div>

      <div>
        <span>가동성</span>
        <strong>${record.mobility}</strong>
      </div>

      <div>
        <span>기술</span>
        <strong>${record.technique}</strong>
      </div>

      <div>
        <span>무릎</span>
        <strong>${record.knee}°</strong>
      </div>

      <div>
        <span>고관절</span>
        <strong>${record.hip}°</strong>
      </div>

      <div>
        <span>몸통</span>
        <strong>${record.trunk}°</strong>
      </div>

      <div>
        <span>발목</span>
        <strong>${record.ankle}°</strong>
      </div>

    </div>


    ${
      record.snapshot
        ? `
          <img
            class="record-snapshot"
            src="${record.snapshot}"
            alt="분석 장면"
          />
        `
        : ""
    }


    <h3>
      추천 훈련
    </h3>

    <div class="record-recommendation-list">

      ${
        (
          record.recommendations ||
          []
        )
          .map(
            item => `
              <div>
                <strong>
                  ${item.name}
                </strong>

                <span>
                  ${item.reason}
                </span>
              </div>
            `
          )
          .join("")
      }

    </div>
  `;


  $("recordModal")
    ?.classList.add(
      "open"
    );
}


/* =========================================================
   80. MODALS
========================================================= */

function initializeModals() {

  $("closeRecordModal")
    ?.addEventListener(
      "click",
      () => {

        $("recordModal")
          ?.classList.remove(
            "open"
          );

      }
    );


  $("closeExerciseModal")
    ?.addEventListener(
      "click",
      () => {

        $("exerciseModal")
          ?.classList.remove(
            "open"
          );

      }
    );


  document
    .querySelectorAll(
      ".modal"
    )
    .forEach(modal => {

      modal.addEventListener(
        "click",
        event => {

          if (
            event.target === modal
          ) {

            modal.classList.remove(
              "open"
            );

          }

        }
      );

    });
}


/* =========================================================
   81. TRAINING PROGRAM EXERCISE SELECT
========================================================= */

function populateProgramExerciseSelect() {

  const select =
    $("programExercise");

  if (!select) return;


  const list =
    typeof EXERCISES !==
      "undefined"

      ? EXERCISES

      : (
          typeof exercises !==
            "undefined"
            ? exercises
            : []
        );


  select.innerHTML = `
    <option value="">
      운동 선택
    </option>

    ${list
      .map(
        exercise => `
          <option value="${exercise.id}">
            ${exercise.name}
          </option>
        `
      )
      .join("")}
  `;
}


/* =========================================================
   82. PROGRAM BUILDER
========================================================= */

function renderProgramBuilder() {

  populateProgramExerciseSelect();

  renderCurrentProgram();
}


/* =========================================================
   83. ADD PROGRAM EXERCISE

   ★ 기존 훈련 프로그램 안 되던 부분 수정
========================================================= */

function addProgramExercise() {

  const exerciseId =
    $("programExercise")?.value;


  if (!exerciseId) {

    showToast(
      "운동을 선택하세요."
    );

    return;
  }


  const list =
    typeof EXERCISES !==
      "undefined"

      ? EXERCISES

      : (
          typeof exercises !==
            "undefined"
            ? exercises
            : []
        );


  const exercise =
    list.find(
      item =>
        String(item.id) ===
        String(exerciseId)
    );


  if (!exercise) {

    showToast(
      "운동 정보를 찾지 못했습니다."
    );

    return;
  }


  const sets =
    Math.max(
      1,
      Number(
        $("programSets")?.value
      ) || 1
    );


  const reps =
    Math.max(
      1,
      Number(
        $("programReps")?.value
      ) || 1
    );


  const weight =
    Math.max(
      0,
      Number(
        $("programWeight")?.value
      ) || 0
    );


  const rest =
    Math.max(
      0,
      Number(
        $("programRest")?.value
      ) || 0
    );


  APP_STATE
    .currentProgramExercises
    .push({

      id:
        createId("programExercise"),

      exerciseId:
        exercise.id,

      name:
        exercise.name,

      pictogram:
        exercise.pictogram || "🏋",

      category:
        exercise.category || "",

      sets,

      reps,

      weight,

      rest

    });


  renderCurrentProgram();


  showToast(
    `${exercise.name} 추가`
  );
}


/* =========================================================
   84. RENDER CURRENT PROGRAM
========================================================= */

function renderCurrentProgram() {

  const container =
    $("programExerciseList");


  if (!container) return;


  const list =
    APP_STATE
      .currentProgramExercises;


  if (!list.length) {

    container.innerHTML = `
      <div class="empty-state">
        추가된 운동이 없습니다.
      </div>
    `;

  } else {

    container.innerHTML =
      list
        .map(
          (item, index) => {

            const volume =
              item.sets *
              item.reps *
              item.weight;


            return `
              <div class="program-row">

                <div class="program-order">
                  ${index + 1}
                </div>

                <div class="program-icon">
                  ${item.pictogram}
                </div>

                <div class="program-info">

                  <strong>
                    ${item.name}
                  </strong>

                  <span>
                    ${item.sets}세트 ×
                    ${item.reps}회 ·
                    ${item.weight}kg
                  </span>

                  <small>
                    휴식 ${item.rest}초 ·
                    볼륨 ${volume.toLocaleString()}kg
                  </small>

                </div>

                <button
                  type="button"
                  class="program-delete"
                  data-program-delete="${item.id}"
                >
                  ×
                </button>

              </div>
            `;

          }
        )
        .join("");


    container
      .querySelectorAll(
        "[data-program-delete]"
      )
      .forEach(
        button => {

          button.addEventListener(
            "click",
            () => {

              removeProgramExercise(
                button.dataset.programDelete
              );

            }
          );

        }
      );
  }


  updateProgramSummary();
}


/* =========================================================
   85. REMOVE PROGRAM EXERCISE
========================================================= */

function removeProgramExercise(
  id
) {

  APP_STATE.currentProgramExercises =
    APP_STATE
      .currentProgramExercises
      .filter(
        item =>
          item.id !== id
      );


  renderCurrentProgram();
}


/* =========================================================
   86. PROGRAM SUMMARY
========================================================= */

function updateProgramSummary() {

  const list =
    APP_STATE
      .currentProgramExercises;


  const exerciseCount =
    list.length;


  const totalSets =
    list.reduce(
      (sum, item) =>
        sum + item.sets,
      0
    );


  const totalVolume =
    list.reduce(
      (sum, item) =>
        sum +
        (
          item.sets *
          item.reps *
          item.weight
        ),
      0
    );


  if ($("programExerciseCount")) {

    $("programExerciseCount")
      .textContent =
      exerciseCount;

  }


  if ($("programTotalSets")) {

    $("programTotalSets")
      .textContent =
      totalSets;

  }


  if ($("programTotalVolume")) {

    $("programTotalVolume")
      .textContent =
      `${totalVolume.toLocaleString()} kg`;

  }
}


/* =========================================================
   87. SAVE TRAINING PROGRAM
========================================================= */

function saveTrainingProgram() {

  const athleteId =
    $("programAthlete")?.value;


  if (!athleteId) {

    showToast(
      "선수를 선택하세요."
    );

    return;
  }


  if (
    !APP_STATE
      .currentProgramExercises
      .length
  ) {

    showToast(
      "운동을 1개 이상 추가하세요."
    );

    return;
  }


  const athlete =
    athletes.find(
      item =>
        item.id === athleteId
    );


  if (!athlete) return;


  const name =
    $("programName")
      ?.value
      .trim() ||
    `${athlete.name} 웨이트 프로그램`;


  const program = {

    id:
      createId("program"),

    athleteId,

    athleteName:
      athlete.name,

    name,

    createdAt:
      new Date().toISOString(),

    exercises:
      APP_STATE
        .currentProgramExercises
        .map(
          item => ({
            ...item
          })
        )

  };


  trainingPrograms.unshift(
    program
  );


  saveData(
    STORAGE.programs,
    trainingPrograms
  );


  APP_STATE.currentProgramExercises =
    [];


  if ($("programName")) {
    $("programName").value = "";
  }


  renderCurrentProgram();


  showToast(
    "훈련 프로그램 저장 완료"
  );
}


/* =========================================================
   88. PROGRAM EVENTS
========================================================= */

function initializeProgramEvents() {

  $("addProgramExerciseBtn")
    ?.addEventListener(
      "click",
      addProgramExercise
    );


  $("saveProgramBtn")
    ?.addEventListener(
      "click",
      saveTrainingProgram
    );
}


/* =========================================================
   89. CSV EXPORT
========================================================= */

function exportRecordsCSV() {

  if (
    !analysisRecords.length
  ) {

    showToast(
      "저장할 분석 기록이 없습니다."
    );

    return;
  }


  const rows = [

    [
      "측정일",
      "선수",
      "운동",
      "반복",
      "점수",
      "대칭성",
      "안정성",
      "가동성",
      "기술",
      "무릎각도",
      "고관절각도",
      "몸통각도",
      "발목각도"
    ],

    ...analysisRecords.map(
      record => [

        formatDate(
          record.createdAt
        ),

        record.athleteName,

        record.exerciseName,

        record.reps,

        record.score,

        record.symmetry,

        record.stability,

        record.mobility,

        record.technique,

        record.knee,

        record.hip,

        record.trunk,

        record.ankle

      ]
    )

  ];


  const csv =
    rows
      .map(
        row =>
          row
            .map(
              value =>
                `"${String(value ?? "")
                  .replaceAll(
                    '"',
                    '""'
                  )}"`
            )
            .join(",")
      )
      .join("\n");


  downloadTextFile(
    "\uFEFF" + csv,
    "seolcheon_weight_analysis.csv",
    "text/csv;charset=utf-8"
  );


  showToast(
    "CSV 저장 완료"
  );
}


/* =========================================================
   90. DOWNLOAD TEXT FILE
========================================================= */

function downloadTextFile(
  content,
  filename,
  type
) {

  const blob =
    new Blob(
      [content],
      {
        type
      }
    );


  const url =
    URL.createObjectURL(
      blob
    );


  const link =
    document.createElement(
      "a"
    );


  link.href = url;

  link.download = filename;


  document.body.appendChild(
    link
  );


  link.click();

  link.remove();


  setTimeout(
    () =>
      URL.revokeObjectURL(
        url
      ),
    1000
  );
}


/* =========================================================
   91. DATA BACKUP
========================================================= */

function backupData() {

  const backup = {

    version: "2.0",

    generatedAt:
      new Date().toISOString(),

    athletes,

    analysisRecords,

    trainingPrograms,

    settings:
      loadData(
        STORAGE.settings,
        {}
      )

  };


  downloadTextFile(

    JSON.stringify(
      backup,
      null,
      2
    ),

    "seolcheon_weight_lab_backup.json",

    "application/json"

  );


  showToast(
    "데이터 백업 완료"
  );
}


/* =========================================================
   92. RESTORE DATA
========================================================= */

function initializeRestoreData() {

  $("restoreDataInput")
    ?.addEventListener(
      "change",
      event => {

        const file =
          event.target.files?.[0];


        if (!file) return;


        const reader =
          new FileReader();


        reader.onload =
          () => {

            try {

              const data =
                JSON.parse(
                  reader.result
                );


              if (
                !Array.isArray(
                  data.athletes
                )
              ) {

                throw new Error(
                  "invalid backup"
                );
              }


              athletes =
                data.athletes ||
                [];


              analysisRecords =
                data.analysisRecords ||
                [];


              trainingPrograms =
                data.trainingPrograms ||
                [];


              saveData(
                STORAGE.athletes,
                athletes
              );


              saveData(
                STORAGE.records,
                analysisRecords
              );


              saveData(
                STORAGE.programs,
                trainingPrograms
              );


              if (
                data.settings
              ) {

                saveData(
                  STORAGE.settings,
                  data.settings
                );

              }


              populateAllAthleteSelects();

              renderAthleteList();

              renderRecords();

              renderDashboard();

              showToast(
                "데이터 복원 완료"
              );


            } catch (error) {

              console.error(
                error
              );


              showToast(
                "백업 파일을 읽을 수 없습니다."
              );

            }

          };


        reader.readAsText(
          file
        );

      }
    );
}


/* =========================================================
   93. CLEAR DATA
========================================================= */

function clearAllData() {

  const confirmed =
    confirm(
      "선수·분석·훈련 프로그램 데이터를 모두 초기화할까요?"
    );


  if (!confirmed) return;


  athletes = [];

  analysisRecords = [];

  trainingPrograms = [];


  APP_STATE.selectedAthleteId =
    null;


  APP_STATE.currentProgramExercises =
    [];


  localStorage.removeItem(
    STORAGE.athletes
  );

  localStorage.removeItem(
    STORAGE.records
  );

  localStorage.removeItem(
    STORAGE.programs
  );


  populateAllAthleteSelects();

  renderAthleteList();

  renderRecords();

  renderCurrentProgram();

  renderDashboard();


  showToast(
    "모든 데이터 초기화 완료"
  );
}


/* =========================================================
   94. SETTINGS
========================================================= */

function initializeSettings() {

  const saved =
    loadData(
      STORAGE.settings,
      {
        skeleton: true,
        angles: true,
        reference: true,
        barPath: true
      }
    );


  APP_STATE.skeletonVisible =
    saved.skeleton !== false;


  APP_STATE.referenceVisible =
    saved.reference !== false;


  APP_STATE.barPathVisible =
    saved.barPath !== false;


  if ($("settingSkeleton")) {

    $("settingSkeleton").checked =
      APP_STATE.skeletonVisible;

  }


  if ($("settingReference")) {

    $("settingReference").checked =
      APP_STATE.referenceVisible;

  }


  if ($("settingBarPath")) {

    $("settingBarPath").checked =
      APP_STATE.barPathVisible;

  }


  const saveSettings =
    () => {

      const settings = {

        skeleton:
          $("settingSkeleton")
            ?.checked ?? true,

        angles:
          $("settingAngles")
            ?.checked ?? true,

        reference:
          $("settingReference")
            ?.checked ?? true,

        barPath:
          $("settingBarPath")
            ?.checked ?? true

      };


      APP_STATE.skeletonVisible =
        settings.skeleton;


      APP_STATE.referenceVisible =
        settings.reference;


      APP_STATE.barPathVisible =
        settings.barPath;


      saveData(
        STORAGE.settings,
        settings
      );


      updateReferenceLines();


      if (
        APP_STATE.latestLandmarks
      ) {

        drawPoseSkeleton(
          APP_STATE.latestLandmarks
        );

      }


      drawBarPath();

    };


  [
    "settingSkeleton",
    "settingAngles",
    "settingReference",
    "settingBarPath"
  ]
    .forEach(id => {

      $(id)
        ?.addEventListener(
          "change",
          saveSettings
        );

    });


  updateReferenceLines();
}


/* =========================================================
   95. REPORT RADAR
========================================================= */

let reportRadarChart = null;


function initializeReportRadar() {

  const canvas =
    $("reportRadarChart");


  if (
    !canvas ||
    typeof Chart ===
      "undefined"
  ) {
    return;
  }


  reportRadarChart =
    new Chart(
      canvas,
      {

        type: "radar",

        data: {

          labels: [
            "근력",
            "파워",
            "안정성",
            "대칭성",
            "가동성",
            "기술"
          ],

          datasets: [

            {

              data: [
                0,
                0,
                0,
                0,
                0,
                0
              ],

              borderWidth: 2,

              pointRadius: 3

            }

          ]

        },

        options: {

          responsive: true,

          maintainAspectRatio: false,

          scales: {

            r: {

              min: 0,

              max: 100,

              ticks: {
                display: false
              }

            }

          },

          plugins: {

            legend: {
              display: false
            }

          }

        }

      }
    );
}


/* =========================================================
   96. GENERATE REPORT
========================================================= */

function generateReport() {

  const athleteId =
    $("reportAthlete")?.value;


  if (!athleteId) {

    showToast(
      "선수를 선택하세요."
    );

    return;
  }


  const athlete =
    athletes.find(
      item =>
        item.id === athleteId
    );


  if (!athlete) return;


  const records =
    analysisRecords.filter(
      record =>
        record.athleteId ===
        athleteId
    );


  const latest =
    records[0];


  $("reportGeneratedDate")
    .textContent =
    new Date()
      .toLocaleString(
        "ko-KR"
      );


  $("reportAthleteName")
    .textContent =
    athlete.name;


  $("reportSport")
    .textContent =
    athlete.sport || "-";


  $("reportHeight")
    .textContent =
    athlete.height
      ? `${athlete.height} cm`
      : "-";


  $("reportWeight")
    .textContent =
    athlete.weight
      ? `${athlete.weight} kg`
      : "-";


  if (!latest) {

    $("reportOverallScore")
      .textContent =
      "--";


    $("reportExerciseName")
      .textContent =
      "운동 분석 기록 없음";


    $("reportExerciseCategory")
      .textContent =
      "-";


    $("reportExercisePictogram")
      .textContent =
      "🏋";


    $("reportRecommendations")
      .innerHTML =
      "분석 결과가 없습니다.";


    showToast(
      "해당 선수의 분석 기록이 없습니다."
    );

    return;
  }


  $("reportOverallScore")
    .textContent =
    latest.score;


  $("reportExerciseName")
    .textContent =
    latest.exerciseName;


  $("reportExerciseCategory")
    .textContent =
    categoryLabel(
      latest.category
    );


  $("reportExercisePictogram")
    .textContent =
    latest.pictogram || "🏋";


  $("reportStrength")
    .textContent =
    latest.strength;


  $("reportPower")
    .textContent =
    latest.power;


  $("reportStability")
    .textContent =
    latest.stability;


  $("reportSymmetry")
    .textContent =
    latest.symmetry;


  $("reportMobility")
    .textContent =
    latest.mobility;


  $("reportTechnique")
    .textContent =
    latest.technique;


  if (
    reportRadarChart
  ) {

    reportRadarChart
      .data
      .datasets[0]
      .data = [

        latest.strength,

        latest.power,

        latest.stability,

        latest.symmetry,

        latest.mobility,

        latest.technique

      ];


    reportRadarChart.update();

  }


  const frame =
    $("reportAnalysisFrame");


  if (
    latest.snapshot
  ) {

    frame.innerHTML = `
      <img
        src="${latest.snapshot}"
        alt="${latest.exerciseName} 자세 분석"
        class="report-analysis-image"
      />
    `;

  } else {

    frame.innerHTML = `
      <div class="report-frame-placeholder">

        <div class="report-frame-icon">
          ${latest.pictogram || "🏋"}
        </div>

        <strong>
          ${latest.exerciseName}
        </strong>

        <span>
          자세 분석 대표 장면
        </span>

      </div>
    `;

  }


  const recommendations =
    latest.recommendations || [];


  $("reportRecommendations")
    .innerHTML =
    recommendations.length

      ? recommendations
          .map(
            (item, index) => `
              <div class="report-recommendation-row">

                <strong>
                  ${index + 1}.
                  ${item.name}
                </strong>

                <span>
                  ${item.reason}
                </span>

              </div>
            `
          )
          .join("")

      : "권장 훈련 없음";


  showToast(
    "선수 리포트 생성 완료"
  );
}


/* =========================================================
   97. CATEGORY LABEL
========================================================= */

function categoryLabel(
  category
) {

  const map = {

    lower: "하체",
    chest: "가슴",
    back: "등",
    shoulder: "어깨",
    arms: "팔",
    core: "코어",

    olympic:
      "올림픽 리프팅",

    power: "파워",

    plyometric:
      "플라이오메트릭",

    functional:
      "기능성",

    mobility:
      "보강 · 가동성",

    fullbody:
      "전신",

    bodyweight:
      "맨몸"

  };


  return (
    map[category] ||
    category ||
    "-"
  );
}


/* =========================================================
   98. REPORT EVENTS
========================================================= */

function initializeReportEvents() {

  $("generateReportBtn")
    ?.addEventListener(
      "click",
      generateReport
    );


  $("printReportBtn")
    ?.addEventListener(
      "click",
      () => {

        window.print();

      }
    );
}


/* =========================================================
   99. ANALYSIS EXERCISE CHANGE
========================================================= */

function initializeAnalysisExerciseChange() {

  $("analysisExercise")
    ?.addEventListener(
      "change",
      () => {

        const exercise =
          getCurrentExercise();


        if (!exercise) {

          $("motionAnalysisTitle")
            .textContent =
            "자세 분석";

          return;
        }


        $("motionAnalysisTitle")
          .textContent =
          `${exercise.name} 자세 분석`;


        updateExerciseCheckpoints(
          exercise
        );

      }
    );
}


/* =========================================================
   100. CHECKPOINTS
========================================================= */

function updateExerciseCheckpoints(
  exercise
) {

  const container =
    $("checkpointList");


  if (!container) return;


  let checkpoints =
    exercise.checkpoints ||
    exercise.analysisPoints ||
    [];


  if (
    typeof checkpoints ===
    "string"
  ) {

    checkpoints =
      checkpoints
        .split(",")
        .map(
          item =>
            item.trim()
        )
        .filter(Boolean);

  }


  if (
    !checkpoints.length
  ) {

    checkpoints = [

      "좌우 관절 대칭 확인",

      "몸통 안정성 유지",

      "주요 관절 가동범위 확인",

      "동작 속도와 반복 일관성 확인",

      "관절 정렬과 중심 이동 확인"

    ];
  }


  container.innerHTML =
    checkpoints
      .map(
        checkpoint => `
          <div class="checkpoint-row">

            <span>
              ${checkpoint}
            </span>

            <strong>
              CHECK
            </strong>

          </div>
        `
      )
      .join("");
}


/* =========================================================
   101. TARGET REPS
========================================================= */

function initializeTargetReps() {

  $("analysisTargetReps")
    ?.addEventListener(
      "input",
      event => {

        const value =
          Math.max(
            1,
            Number(
              event.target.value
            ) || 1
          );


        if ($("targetRepCount")) {

          $("targetRepCount")
            .textContent =
            value;

        }

      }
    );
}


/* =========================================================
   102. GLOBAL RESIZE
========================================================= */

function initializeResize() {

  window.addEventListener(
    "resize",
    () => {

      resizePoseCanvas();


      if (
        APP_STATE.latestLandmarks
      ) {

        drawPoseSkeleton(
          APP_STATE.latestLandmarks
        );

      }


      drawBarPath();

    }
  );
}


/* =========================================================
   103. VISIBILITY CHANGE
========================================================= */

function initializeVisibilityHandler() {

  document.addEventListener(
    "visibilitychange",
    () => {

      /*
        iPad Safari에서
        백그라운드 → 복귀 시
        분석 루프 재연결
      */

      if (
        document.visibilityState ===
          "visible" &&
        APP_STATE.analysisRunning &&
        !APP_STATE.poseLoopId
      ) {

        startPoseLoop();

      }

    }
  );
}


/* =========================================================
   104. BEFORE UNLOAD
========================================================= */

function initializeUnload() {

  window.addEventListener(
    "beforeunload",
    () => {

      stopPoseLoop();

      stopCameraStream();

    }
  );
}


/* =========================================================
   105. EXPORT / BACKUP EVENTS
========================================================= */

function initializeDataEvents() {

  $("exportCSVBtn")
    ?.addEventListener(
      "click",
      exportRecordsCSV
    );


  $("backupDataBtn")
    ?.addEventListener(
      "click",
      backupData
    );


  $("clearDataBtn")
    ?.addEventListener(
      "click",
      clearAllData
    );


  initializeRestoreData();
}


/* =========================================================
   106. COACH MODE
========================================================= */

function initializeCoachMode() {

  $("coachModeBtn")
    ?.addEventListener(
      "click",
      () => {

        document.body
          .classList.toggle(
            "coach-mode"
          );


        const active =
          document.body
            .classList
            .contains(
              "coach-mode"
            );


        $("coachModeBtn")
          .textContent =
          active
            ? "👤 코치 모드 ON"
            : "👤 코치 모드";


        showToast(
          active
            ? "코치 모드 활성화"
            : "코치 모드 해제"
        );

      }
    );
}


/* =========================================================
   107. EXERCISE → ANALYSIS BRIDGE

   운동 카드에서 '분석하기' 누르면
   분석 페이지 + 해당 종목 자동 선택
========================================================= */

window.startExerciseAnalysis =
  function(exerciseId) {

    navigateToPage(
      "analysis"
    );


    setTimeout(
      () => {

        const select =
          $("analysisExercise");


        if (!select) return;


        select.value =
          exerciseId;


        select.dispatchEvent(
          new Event(
            "change"
          )
        );


        showToast(
          "분석 운동이 설정되었습니다."
        );

      },
      50
    );
  };


/* =========================================================
   108. SELECT EXERCISE FROM MODAL
========================================================= */

function initializeExerciseModalAnalysis() {

  $("analyzeSelectedExerciseBtn")
    ?.addEventListener(
      "click",
      () => {

        const button =
          $("analyzeSelectedExerciseBtn");


        const id =
          button.dataset.exerciseId;


        if (!id) {

          showToast(
            "운동을 다시 선택하세요."
          );

          return;
        }


        $("exerciseModal")
          ?.classList.remove(
            "open"
          );


        window.startExerciseAnalysis(
          id
        );

      }
    );
}


/* =========================================================
   109. CAMERA PERMISSION CHECK
========================================================= */

function checkCameraSupport() {

  if (
    !navigator.mediaDevices ||
    !navigator.mediaDevices.getUserMedia
  ) {

    if (
      $("connectCameraBtn")
    ) {

      $("connectCameraBtn")
        .disabled =
        true;

    }


    if (
      $("analysisEngineStatus")
    ) {

      $("analysisEngineStatus")
        .textContent =
        "CAMERA UNSUPPORTED";

    }

  }
}


/* =========================================================
   110. INITIAL STATUS
========================================================= */

function initializeAnalysisStatus() {

  if (
    $("analysisEngineStatus")
  ) {

    $("analysisEngineStatus")
      .textContent =
      "ENGINE READY";

  }


  if (
    $("liveStatusBadge")
  ) {

    $("liveStatusBadge")
      .textContent =
      "● STANDBY";

  }


  updateReferenceLines();
}


/* =========================================================
   111. INITIAL SELECTED ATHLETE
========================================================= */

function initializeSelectedAthlete() {

  if (
    athletes.length &&
    !APP_STATE.selectedAthleteId
  ) {

    APP_STATE.selectedAthleteId =
      athletes[0].id;

  }
}


/* =========================================================
   112. AUTO STOP TARGET OPTION

   현재는 목표 도달해도 자동 종료하지 않음.
   코치가 마지막 동작을 확인하고
   직접 종료 가능.
========================================================= */

function checkTargetCompletion() {

  const target =
    Number(
      $("analysisTargetReps")?.value
    ) || 0;


  if (
    target > 0 &&
    APP_STATE.repCount >= target
  ) {

    return true;

  }


  return false;
}


/* =========================================================
   113. ANALYSIS DEBUG INFO
========================================================= */

window.WeightLabDebug = {

  get state() {
    return APP_STATE;
  },

  get athletes() {
    return athletes;
  },

  get records() {
    return analysisRecords;
  },

  get programs() {
    return trainingPrograms;
  },

  stopAnalysis,

  startAnalysis,

  connectCamera

};


/* =========================================================
   114. APP INITIALIZE
========================================================= */

async function initializeApp() {

  console.log(
    "%cSEOLCHEON WEIGHT PERFORMANCE LAB",
    "font-size:18px;font-weight:bold;"
  );


  console.log(
    "System initializing..."
  );


  /*
    Navigation
  */

  initializeNavigation();


  /*
    Clock
  */

  updateClock();

  setInterval(
    updateClock,
    1000
  );


  /*
    Athlete
  */

  initializeSelectedAthlete();

  initializeAthleteForm();

  initializeAthleteSearch();

  initializeAnalysisAthlete();

  populateAllAthleteSelects();

  renderAthleteList();


  /*
    Dashboard
  */

  initializePerformanceRadar();

  initializePerformanceTrend();

  initializeDashboardPeriod();


  /*
    Analysis
  */

  initializeAngleChart();

  initializeVideoUpload();

  initializeImageUpload();

  initializePlayback();

  initializeViewSelector();

  initializeAnalysisMode();

  initializeDisplayToggles();

  initializeAnalysisButtons();

  initializeAnalysisExerciseChange();

  initializeTargetReps();

  initializeAnalysisStatus();


  /*
    Records
  */

  initializeRecordFilters();

  initializeModals();


  /*
    Training program
  */

  populateProgramExerciseSelect();

  initializeProgramEvents();

  renderCurrentProgram();


  /*
    Report
  */

  initializeReportRadar();

  initializeReportEvents();


  /*
    Exercise bridge
  */

  initializeExerciseModalAnalysis();


  /*
    Settings
  */

  initializeSettings();


  /*
    Data
  */

  initializeDataEvents();


  /*
    Other
  */

  initializeCoachMode();

  initializeResize();

  initializeVisibilityHandler();

  initializeUnload();

  checkCameraSupport();


  /*
    First render
  */

  renderDashboard();

  renderRecords();


  console.log(
    "WEIGHT PERFORMANCE LAB READY"
  );


  if (
    $("analysisEngineStatus")
  ) {

    $("analysisEngineStatus")
      .textContent =
      "ENGINE READY";

  }

}


/* =========================================================
   115. DOM READY
========================================================= */

if (
  document.readyState ===
  "loading"
) {

  document.addEventListener(
    "DOMContentLoaded",
    initializeApp
  );

} else {

  initializeApp();

}


/* =========================================================
   END APP.JS
========================================================= */