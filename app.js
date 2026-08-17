/* =========================================================
   설천고 WEIGHT PERFORMANCE LAB
   APP.JS
   CORE + MOTION ANALYSIS ENGINE

   - Page Navigation
   - Athlete Management
   - Camera
   - MediaPipe Pose 33 Landmarks
   - Skeleton
   - Joint Angles
   - Rep Counter
   - Adjustable Target Reps
   - Timer
   - Manual Finish
   - Analysis Record
   - Angle Graph
   - Training Program
   - Dashboard
   - Radar Chart
   - Report Connection
   - Backup / Restore
========================================================= */

"use strict";


/* =========================================================
   01. CONFIG
========================================================= */

const APP_CONFIG = {

  name: "설천고 WEIGHT PERFORMANCE LAB",

  version: "2.0.0",

  storage: {
    athletes: "weightLabAthletes",
    analyses: "weightLabAnalyses",
    programs: "weightLabPrograms",
    settings: "weightLabSettings",
    selectedAthlete: "weightLabSelectedAthlete"
  }

};


/* =========================================================
   02. STATE
========================================================= */

const AppState = {

  currentPage: "dashboard",

  selectedAthleteId: null,

  cameraStream: null,

  cameraFacingMode: "environment",

  cameraConnected: false,

  analysisRunning: false,

  analysisStartedAt: null,

  timerInterval: null,

  pose: null,

  poseBusy: false,

  poseLoopId: null,

  currentSource: "camera",

  currentExercise: null,

  targetReps: 10,

  reps: 0,

  repPhase: "ready",

  repArmed: true,

  lastRepTime: 0,

  latestLandmarks: null,

  latestWorldLandmarks: null,

  skeletonVisible: true,

  referenceVisible: true,

  barPathVisible: true,

  analysisMode: "2d",

  cameraView: "front",

  angleHistory: {
    labels: [],
    knee: [],
    hip: [],
    trunk: [],
    ankle: []
  },

  currentMetrics: {
    knee: null,
    hip: null,
    ankle: null,
    trunk: null,
    symmetry: 0,
    stability: 0,
    mobility: 0,
    technique: 0,
    score: 0,
    tempo: null
  },

  repScores: [],

  barPath: [],

  sessionProgram: [],

  lastAnalysisRecord: null,

  lastFrameDataURL: null

};


/* =========================================================
   03. DOM
========================================================= */

function $(id) {
  return document.getElementById(id);
}


/* =========================================================
   04. STORAGE
========================================================= */

function readStorage(key, fallback = []) {

  try {

    const raw = localStorage.getItem(key);

    if (!raw) return fallback;

    return JSON.parse(raw);

  } catch (error) {

    console.error(error);

    return fallback;
  }
}


function writeStorage(key, value) {

  localStorage.setItem(
    key,
    JSON.stringify(value)
  );
}


function getAthletes() {
  return readStorage(APP_CONFIG.storage.athletes, []);
}


function saveAthletes(data) {
  writeStorage(APP_CONFIG.storage.athletes, data);
}


function getAnalyses() {
  return readStorage(APP_CONFIG.storage.analyses, []);
}


function saveAnalyses(data) {
  writeStorage(APP_CONFIG.storage.analyses, data);
}


function getPrograms() {
  return readStorage(APP_CONFIG.storage.programs, []);
}


function savePrograms(data) {
  writeStorage(APP_CONFIG.storage.programs, data);
}


/* =========================================================
   05. ID
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
   06. TOAST
========================================================= */

function showToast(message) {

  const toast = $("toast");

  if (!toast) return;

  toast.textContent = message;

  toast.classList.add("show");

  clearTimeout(showToast.timer);

  showToast.timer = setTimeout(() => {

    toast.classList.remove("show");

  }, 2500);
}

window.showToast = showToast;


/* =========================================================
   07. PAGE NAVIGATION
========================================================= */

function showPage(pageName) {

  document
    .querySelectorAll(".page")
    .forEach(page => {
      page.classList.remove("active");
    });


  const target = $(`page-${pageName}`);

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


  AppState.currentPage = pageName;


  const sidebar = $("sidebar");

  if (sidebar) {
    sidebar.classList.remove("mobile-open");
  }


  if (pageName === "dashboard") {
    renderDashboard();
  }

  if (pageName === "athletes") {
    renderAthletes();
  }

  if (pageName === "records") {
    renderRecords();
  }

  if (pageName === "program") {
    renderProgram();
  }

  if (pageName === "report") {
    populateReportAthletes();
  }
}

window.showPage = showPage;


/* =========================================================
   08. NAVIGATION EVENTS
========================================================= */

function setupNavigation() {

  document
    .querySelectorAll("[data-page]")
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          showPage(
            button.dataset.page
          );

        }
      );

    });


  document
    .querySelectorAll("[data-page-target]")
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          showPage(
            button.dataset.pageTarget
          );

        }
      );

    });


  const mobileMenuBtn =
    $("mobileMenuBtn");

  const sidebar =
    $("sidebar");


  if (
    mobileMenuBtn &&
    sidebar
  ) {

    mobileMenuBtn.addEventListener(
      "click",
      () => {

        sidebar.classList.toggle(
          "mobile-open"
        );

      }
    );

  }
}


/* =========================================================
   09. CLOCK
========================================================= */

function updateClock() {

  const now = new Date();

  const date = $("headerDate");

  const time = $("headerTime");


  if (date) {

    date.textContent =
      now.toLocaleDateString(
        "ko-KR"
      );

  }


  if (time) {

    time.textContent =
      now.toLocaleTimeString(
        "ko-KR",
        {
          hour: "2-digit",
          minute: "2-digit"
        }
      );

  }
}


/* =========================================================
   10. ATHLETE FORM
========================================================= */

function setupAthleteForm() {

  const form =
    $("athleteForm");

  if (!form) return;


  form.addEventListener(
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

        id:
          createId("athlete"),

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


      const athletes =
        getAthletes();

      athletes.push(athlete);

      saveAthletes(athletes);


      AppState.selectedAthleteId =
        athlete.id;

      localStorage.setItem(
        APP_CONFIG.storage.selectedAthlete,
        athlete.id
      );


      form.reset();


      refreshAthleteSelectors();

      renderAthletes();

      renderDashboard();


      showToast(
        `${athlete.name} 선수 등록 완료`
      );

    }
  );
}


/* =========================================================
   11. ATHLETE LIST
========================================================= */

function renderAthletes() {

  const container =
    $("athleteList");

  if (!container) return;


  const keyword =
    $("athleteSearch")
      ?.value
      .trim()
      .toLowerCase() || "";


  const athletes =
    getAthletes()
      .filter(athlete => {

        return (
          !keyword ||
          athlete.name
            .toLowerCase()
            .includes(keyword) ||
          athlete.sport
            .toLowerCase()
            .includes(keyword)
        );

      });


  if (!athletes.length) {

    container.innerHTML = `

      <div class="empty-state">
        등록된 선수가 없습니다.
      </div>

    `;

    return;
  }


  container.innerHTML =
    athletes
      .map(athlete => {

        const selected =
          athlete.id ===
          AppState.selectedAthleteId;

        return `

          <div
            class="athlete-list-item
            ${selected ? "selected" : ""}"
          >

            <button
              class="athlete-select-area"
              data-athlete-select="${athlete.id}"
            >

              <div class="athlete-list-avatar">
                👤
              </div>

              <div>

                <strong>
                  ${escapeHTML(athlete.name)}
                </strong>

                <span>
                  ${escapeHTML(
                    athlete.sport || "종목 미등록"
                  )}
                </span>

              </div>

            </button>


            <div class="athlete-item-actions">

              <button
                data-athlete-analysis="${athlete.id}"
              >
                분석
              </button>

              <button
                data-athlete-report="${athlete.id}"
              >
                리포트
              </button>

              <button
                data-athlete-delete="${athlete.id}"
              >
                삭제
              </button>

            </div>

          </div>

        `;

      })
      .join("");
}


/* =========================================================
   12. ATHLETE LIST EVENTS
========================================================= */

function setupAthleteEvents() {

  const container =
    $("athleteList");

  if (container) {

    container.addEventListener(
      "click",
      event => {

        const select =
          event.target.closest(
            "[data-athlete-select]"
          );


        if (select) {

          selectAthlete(
            select.dataset.athleteSelect
          );

          return;
        }


        const analysis =
          event.target.closest(
            "[data-athlete-analysis]"
          );


        if (analysis) {

          selectAthlete(
            analysis.dataset.athleteAnalysis
          );

          showPage("analysis");

          return;
        }


        const report =
          event.target.closest(
            "[data-athlete-report]"
          );


        if (report) {

          selectAthlete(
            report.dataset.athleteReport
          );

          showPage("report");

          const reportSelect =
            $("reportAthlete");

          if (reportSelect) {

            reportSelect.value =
              AppState.selectedAthleteId;

          }

          return;
        }


        const deleteButton =
          event.target.closest(
            "[data-athlete-delete]"
          );


        if (deleteButton) {

          deleteAthlete(
            deleteButton.dataset.athleteDelete
          );

        }

      }
    );

  }


  const search =
    $("athleteSearch");


  if (search) {

    search.addEventListener(
      "input",
      renderAthletes
    );

  }
}


/* =========================================================
   13. SELECT ATHLETE
========================================================= */

function selectAthlete(id) {

  const athlete =
    getAthletes()
      .find(item => item.id === id);


  if (!athlete) return;


  AppState.selectedAthleteId = id;


  localStorage.setItem(
    APP_CONFIG.storage.selectedAthlete,
    id
  );


  refreshAthleteSelectors();

  renderAthletes();

  renderDashboard();


  showToast(
    `${athlete.name} 선수 선택`
  );
}


/* =========================================================
   14. DELETE ATHLETE
========================================================= */

function deleteAthlete(id) {

  const athlete =
    getAthletes()
      .find(item => item.id === id);


  if (!athlete) return;


  if (
    !confirm(
      `${athlete.name} 선수를 삭제할까요?`
    )
  ) {
    return;
  }


  const athletes =
    getAthletes()
      .filter(item => item.id !== id);


  saveAthletes(athletes);


  if (
    AppState.selectedAthleteId === id
  ) {

    AppState.selectedAthleteId =
      athletes[0]?.id || null;

  }


  refreshAthleteSelectors();

  renderAthletes();

  renderDashboard();


  showToast(
    "선수 삭제 완료"
  );
}


/* =========================================================
   15. ATHLETE SELECTORS
========================================================= */

function refreshAthleteSelectors() {

  const athletes =
    getAthletes();


  const ids = [

    "analysisAthlete",
    "programAthlete",
    "reportAthlete"

  ];


  ids.forEach(id => {

    const select = $(id);

    if (!select) return;


    const firstText =
      id === "analysisAthlete"
        ? "선수 선택"
        : "선수 선택";


    select.innerHTML = `

      <option value="">
        ${firstText}
      </option>

    `;


    athletes.forEach(athlete => {

      const option =
        document.createElement(
          "option"
        );

      option.value =
        athlete.id;

      option.textContent =
        athlete.name;

      select.appendChild(option);

    });


    if (
      AppState.selectedAthleteId
    ) {

      select.value =
        AppState.selectedAthleteId;

    }

  });


  populateRecordAthleteFilter();
}


/* =========================================================
   16. RECORD ATHLETE FILTER
========================================================= */

function populateRecordAthleteFilter() {

  const select =
    $("recordAthleteFilter");

  if (!select) return;


  const current =
    select.value;


  select.innerHTML = `

    <option value="all">
      전체 선수
    </option>

  `;


  getAthletes().forEach(
    athlete => {

      const option =
        document.createElement(
          "option"
        );

      option.value =
        athlete.id;

      option.textContent =
        athlete.name;

      select.appendChild(option);

    }
  );


  if (current) {
    select.value = current;
  }
}


/* =========================================================
   17. MEDIAPIPE POSE
========================================================= */

async function initializePose() {

  if (
    AppState.pose ||
    typeof Pose === "undefined"
  ) {
    return;
  }


  try {

    const pose = new Pose({

      locateFile: file => {

        return (
          "https://cdn.jsdelivr.net/npm/@mediapipe/pose/" +
          file
        );

      }

    });


    pose.setOptions({

      modelComplexity: 1,

      smoothLandmarks: true,

      enableSegmentation: false,

      smoothSegmentation: false,

      minDetectionConfidence: 0.55,

      minTrackingConfidence: 0.55

    });


    pose.onResults(
      handlePoseResults
    );


    AppState.pose = pose;


    const status =
      $("analysisEngineStatus");

    if (status) {
      status.textContent =
        "33 POINT ENGINE READY";
    }


  } catch (error) {

    console.error(error);

    showToast(
      "모션 엔진 초기화 실패"
    );

  }
}


/* =========================================================
   18. CAMERA
========================================================= */

async function connectCamera() {

  try {

    await stopCamera();


    if (
      !navigator.mediaDevices ||
      !navigator.mediaDevices.getUserMedia
    ) {

      showToast(
        "이 브라우저에서는 카메라를 사용할 수 없습니다."
      );

      return;
    }


    const stream =
      await navigator.mediaDevices
        .getUserMedia({

          video: {

            facingMode:
              AppState.cameraFacingMode,

            width: {
              ideal: 1280
            },

            height: {
              ideal: 720
            }

          },

          audio: false

        });


    const video =
      $("cameraVideo");


    if (!video) return;


    video.srcObject = stream;

    video.hidden = false;


    const uploaded =
      $("uploadedVideo");

    const image =
      $("uploadedImage");


    if (uploaded) {
      uploaded.hidden = true;
    }

    if (image) {
      image.hidden = true;
    }


    await video.play();


    AppState.cameraStream =
      stream;

    AppState.cameraConnected =
      true;

    AppState.currentSource =
      "camera";


    hideViewerPlaceholder();


    await initializePose();


    startPoseLoop();


    showToast(
      "카메라 연결 완료"
    );


  } catch (error) {

    console.error(error);

    showToast(
      "카메라 권한 또는 연결을 확인하세요."
    );

  }
}


/* =========================================================
   19. STOP CAMERA
========================================================= */

async function stopCamera() {

  if (
    AppState.cameraStream
  ) {

    AppState.cameraStream
      .getTracks()
      .forEach(track => {
        track.stop();
      });

  }


  AppState.cameraStream = null;

  AppState.cameraConnected = false;


  const video =
    $("cameraVideo");


  if (video) {

    video.pause();

    video.srcObject = null;

  }
}


/* =========================================================
   20. SWITCH CAMERA
========================================================= */

async function switchCamera() {

  AppState.cameraFacingMode =
    AppState.cameraFacingMode ===
    "environment"
      ? "user"
      : "environment";


  await connectCamera();
}


/* =========================================================
   21. VIEWER
========================================================= */

function hideViewerPlaceholder() {

  const placeholder =
    $("viewerPlaceholder");

  if (placeholder) {
    placeholder.style.display =
      "none";
  }
}


/* =========================================================
   22. POSE LOOP
========================================================= */

function startPoseLoop() {

  cancelAnimationFrame(
    AppState.poseLoopId
  );


  const loop =
    async () => {

      let source = null;


      if (
        AppState.currentSource ===
        "camera"
      ) {

        source =
          $("cameraVideo");

      }

      else if (
        AppState.currentSource ===
        "video"
      ) {

        source =
          $("uploadedVideo");

      }


      if (
        source &&
        source.readyState >= 2 &&
        AppState.pose &&
        !AppState.poseBusy
      ) {

        try {

          AppState.poseBusy = true;

          await AppState.pose.send({
            image: source
          });

        } catch (error) {

          console.warn(
            "Pose frame skipped",
            error
          );

        } finally {

          AppState.poseBusy = false;

        }

      }


      AppState.poseLoopId =
        requestAnimationFrame(loop);

    };


  loop();
}


/* =========================================================
   23. POSE RESULT
========================================================= */

function handlePoseResults(results) {

  const landmarks =
    results.poseLandmarks;


  if (!landmarks) {

    clearPoseCanvas();

    return;
  }


  AppState.latestLandmarks =
    landmarks;

  AppState.latestWorldLandmarks =
    results.poseWorldLandmarks || null;


  drawSkeleton(landmarks);


  const metrics =
    calculatePoseMetrics(
      landmarks
    );


  AppState.currentMetrics =
    metrics;


  updateLiveMetrics(metrics);


  if (
    AppState.analysisRunning
  ) {

    updateRepCounter(
      landmarks,
      metrics
    );

    pushAngleHistory(metrics);

    updateBarPath(landmarks);

  }
}


/* =========================================================
   24. DRAW SKELETON
========================================================= */

function drawSkeleton(landmarks) {

  const canvas =
    $("poseCanvas");

  const viewer =
    canvas?.parentElement;


  if (
    !canvas ||
    !viewer
  ) return;


  const rect =
    viewer.getBoundingClientRect();


  canvas.width =
    Math.max(
      1,
      Math.floor(rect.width)
    );

  canvas.height =
    Math.max(
      1,
      Math.floor(rect.height)
    );


  const ctx =
    canvas.getContext("2d");


  ctx.clearRect(
    0,
    0,
    canvas.width,
    canvas.height
  );


  if (
    !AppState.skeletonVisible
  ) {
    return;
  }


  if (
    typeof drawConnectors ===
    "function" &&
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
    typeof drawLandmarks ===
    "function"
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
   25. CLEAR CANVAS
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
   26. GEOMETRY
========================================================= */

function angleBetween(a, b, c) {

  if (!a || !b || !c) {
    return null;
  }


  const ab = {
    x: a.x - b.x,
    y: a.y - b.y
  };


  const cb = {
    x: c.x - b.x,
    y: c.y - b.y
  };


  const dot =
    ab.x * cb.x +
    ab.y * cb.y;


  const mag1 =
    Math.hypot(
      ab.x,
      ab.y
    );


  const mag2 =
    Math.hypot(
      cb.x,
      cb.y
    );


  if (
    mag1 === 0 ||
    mag2 === 0
  ) {
    return null;
  }


  let cos =
    dot / (mag1 * mag2);


  cos =
    Math.max(
      -1,
      Math.min(1, cos)
    );


  return (
    Math.acos(cos) *
    180 /
    Math.PI
  );
}


function averageValid(values) {

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
      (a, b) => a + b,
      0
    ) /
    valid.length
  );
}


/* =========================================================
   27. CALCULATE METRICS
========================================================= */

function calculatePoseMetrics(lm) {

  const leftShoulder = lm[11];
  const rightShoulder = lm[12];

  const leftElbow = lm[13];
  const rightElbow = lm[14];

  const leftWrist = lm[15];
  const rightWrist = lm[16];

  const leftHip = lm[23];
  const rightHip = lm[24];

  const leftKnee = lm[25];
  const rightKnee = lm[26];

  const leftAnkle = lm[27];
  const rightAnkle = lm[28];

  const leftFoot = lm[31];
  const rightFoot = lm[32];


  const leftKneeAngle =
    angleBetween(
      leftHip,
      leftKnee,
      leftAnkle
    );


  const rightKneeAngle =
    angleBetween(
      rightHip,
      rightKnee,
      rightAnkle
    );


  const knee =
    averageValid([
      leftKneeAngle,
      rightKneeAngle
    ]);


  const leftHipAngle =
    angleBetween(
      leftShoulder,
      leftHip,
      leftKnee
    );


  const rightHipAngle =
    angleBetween(
      rightShoulder,
      rightHip,
      rightKnee
    );


  const hip =
    averageValid([
      leftHipAngle,
      rightHipAngle
    ]);


  const leftAnkleAngle =
    angleBetween(
      leftKnee,
      leftAnkle,
      leftFoot
    );


  const rightAnkleAngle =
    angleBetween(
      rightKnee,
      rightAnkle,
      rightFoot
    );


  const ankle =
    averageValid([
      leftAnkleAngle,
      rightAnkleAngle
    ]);


  const shoulderMid = {

    x:
      (
        leftShoulder.x +
        rightShoulder.x
      ) / 2,

    y:
      (
        leftShoulder.y +
        rightShoulder.y
      ) / 2

  };


  const hipMid = {

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


  const kneeDifference =
    Number.isFinite(
      leftKneeAngle
    ) &&
    Number.isFinite(
      rightKneeAngle
    )
      ? Math.abs(
          leftKneeAngle -
          rightKneeAngle
        )
      : 0;


  const hipDifference =
    Number.isFinite(
      leftHipAngle
    ) &&
    Number.isFinite(
      rightHipAngle
    )
      ? Math.abs(
          leftHipAngle -
          rightHipAngle
        )
      : 0;


  const symmetry =
    clamp(
      100 -
      (
        kneeDifference * 1.6 +
        hipDifference * 1.2
      ),
      0,
      100
    );


  const stability =
    clamp(
      100 -
      trunk * 1.1 -
      Math.abs(
        leftShoulder.y -
        rightShoulder.y
      ) * 150,
      0,
      100
    );


  const mobility =
    clamp(
      65 +
      (
        160 -
        (knee || 160)
      ) * 0.25 +
      (
        160 -
        (hip || 160)
      ) * 0.15,
      0,
      100
    );


  const technique =
    clamp(
      symmetry * 0.45 +
      stability * 0.35 +
      mobility * 0.20,
      0,
      100
    );


  const score =
    Math.round(
      symmetry * 0.30 +
      stability * 0.30 +
      mobility * 0.15 +
      technique * 0.25
    );


  return {

    knee:
      round1(knee),

    hip:
      round1(hip),

    ankle:
      round1(ankle),

    trunk:
      round1(trunk),

    symmetry:
      Math.round(symmetry),

    stability:
      Math.round(stability),

    mobility:
      Math.round(mobility),

    technique:
      Math.round(technique),

    score,

    leftKnee:
      round1(leftKneeAngle),

    rightKnee:
      round1(rightKneeAngle),

    leftHip:
      round1(leftHipAngle),

    rightHip:
      round1(rightHipAngle)

  };
}


/* =========================================================
   28. LIVE METRICS
========================================================= */

function updateLiveMetrics(m) {

  setText(
    "kneeAngle",
    angleText(m.knee)
  );

  setText(
    "hipAngle",
    angleText(m.hip)
  );

  setText(
    "trunkAngle",
    angleText(m.trunk)
  );

  setText(
    "ankleAngle",
    angleText(m.ankle)
  );


  setText(
    "liveKnee",
    angleText(m.knee)
  );

  setText(
    "liveHip",
    angleText(m.hip)
  );

  setText(
    "liveTrunk",
    angleText(m.trunk)
  );

  setText(
    "liveAnkle",
    angleText(m.ankle)
  );


  setText(
    "liveSymmetry",
    m.symmetry
  );

  setText(
    "liveStability",
    m.stability
  );

  setText(
    "liveTechnique",
    m.technique
  );

  setText(
    "liveROM",
    calculateROMScore(m)
  );


  setText(
    "currentPoseScore",
    m.score
  );
}


/* =========================================================
   29. ROM
========================================================= */

function calculateROMScore(m) {

  if (
    !Number.isFinite(m.knee) ||
    !Number.isFinite(m.hip)
  ) {
    return "--";
  }


  return Math.round(
    clamp(
      (
        (180 - m.knee) +
        (180 - m.hip)
      ) / 2,
      0,
      100
    )
  );
}


/* =========================================================
   30. REP COUNTER
========================================================= */

function updateRepCounter(
  landmarks,
  metrics
) {

  if (
    !AppState.analysisRunning
  ) {
    return;
  }


  const exercise =
    AppState.currentExercise;


  if (!exercise) {
    return;
  }


  const now =
    performance.now();


  if (
    now -
    AppState.lastRepTime <
    500
  ) {
    return;
  }


  const knee =
    metrics.knee;

  const hip =
    metrics.hip;


  if (
    !Number.isFinite(knee)
  ) {
    return;
  }


  const id =
    exercise.id;


  /* -------------------------------------------------------
     SQUAT FAMILY
  ------------------------------------------------------- */

  if (
    id.includes("squat") ||
    id.includes("leg-press") ||
    id.includes("lunge") ||
    id.includes("split")
  ) {

    if (
      knee < 120 &&
      AppState.repPhase !== "down"
    ) {

      AppState.repPhase =
        "down";

    }


    if (
      knee > 155 &&
      AppState.repPhase === "down"
    ) {

      completeRep();

      AppState.repPhase =
        "up";

    }

  }


  /* -------------------------------------------------------
     DEADLIFT / HIP HINGE
  ------------------------------------------------------- */

  else if (
    id.includes("deadlift") ||
    id.includes("rdl") ||
    id.includes("good-morning")
  ) {

    if (
      hip < 125 &&
      AppState.repPhase !== "down"
    ) {

      AppState.repPhase =
        "down";

    }


    if (
      hip > 155 &&
      AppState.repPhase === "down"
    ) {

      completeRep();

      AppState.repPhase =
        "up";

    }

  }


  /* -------------------------------------------------------
     PUSH UP
  ------------------------------------------------------- */

  else if (
    id.includes("push-up")
  ) {

    const elbow =
      calculateAverageElbowAngle(
        landmarks
      );


    if (
      elbow < 115 &&
      AppState.repPhase !== "down"
    ) {

      AppState.repPhase =
        "down";

    }


    if (
      elbow > 155 &&
      AppState.repPhase === "down"
    ) {

      completeRep();

      AppState.repPhase =
        "up";

    }

  }


  /* -------------------------------------------------------
     PRESS / CURL / ROW ETC
  ------------------------------------------------------- */

  else {

    const elbow =
      calculateAverageElbowAngle(
        landmarks
      );


    if (
      Number.isFinite(elbow)
    ) {

      if (
        elbow < 105 &&
        AppState.repPhase !== "contracted"
      ) {

        AppState.repPhase =
          "contracted";

      }


      if (
        elbow > 150 &&
        AppState.repPhase ===
        "contracted"
      ) {

        completeRep();

        AppState.repPhase =
          "extended";

      }

    }

  }
}


/* =========================================================
   31. ELBOW ANGLE
========================================================= */

function calculateAverageElbowAngle(
  lm
) {

  const left =
    angleBetween(
      lm[11],
      lm[13],
      lm[15]
    );


  const right =
    angleBetween(
      lm[12],
      lm[14],
      lm[16]
    );


  return averageValid([
    left,
    right
  ]);
}


/* =========================================================
   32. COMPLETE REP
========================================================= */

function completeRep() {

  const now =
    performance.now();


  AppState.lastRepTime = now;

  AppState.reps += 1;


  AppState.repScores.push(
    AppState.currentMetrics.score || 0
  );


  setText(
    "currentRepCount",
    AppState.reps
  );


  if (
    AppState.reps >=
    AppState.targetReps
  ) {

    showToast(
      `${AppState.targetReps}회 목표 완료! 측정을 계속하거나 종료할 수 있습니다.`
    );

  }
}


/* =========================================================
   33. ANALYSIS START
========================================================= */

async function startAnalysis() {

  if (
    AppState.analysisRunning
  ) {

    showToast(
      "이미 분석 중입니다."
    );

    return;
  }


  const athleteId =
    $("analysisAthlete")?.value ||
    AppState.selectedAthleteId;


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


  const exercise =
    window.getExerciseById
      ? window.getExerciseById(
          exerciseId
        )
      : null;


  if (!exercise) {

    showToast(
      "운동 정보를 찾을 수 없습니다."
    );

    return;
  }


  AppState.selectedAthleteId =
    athleteId;

  AppState.currentExercise =
    exercise;


  AppState.targetReps =
    Math.max(
      1,
      Number(
        $("analysisTargetReps")
          ?.value
      ) || 10
    );


  AppState.reps = 0;

  AppState.repPhase =
    "ready";

  AppState.repScores = [];

  AppState.barPath = [];

  AppState.angleHistory = {
    labels: [],
    knee: [],
    hip: [],
    trunk: [],
    ankle: []
  };


  setText(
    "currentRepCount",
    0
  );

  setText(
    "targetRepCount",
    AppState.targetReps
  );


  AppState.analysisRunning =
    true;

  AppState.analysisStartedAt =
    Date.now();


  startAnalysisTimer();


  const badge =
    $("liveStatusBadge");


  if (badge) {

    badge.textContent =
      "● ANALYZING";

    badge.classList.remove(
      "standby"
    );

  }


  const status =
    $("analysisEngineStatus");


  if (status) {

    status.textContent =
      "MOTION CAPTURE ACTIVE";

  }


  showToast(
    `${exercise.name} 분석 시작`
  );
}


/* =========================================================
   34. TIMER
========================================================= */

function startAnalysisTimer() {

  clearInterval(
    AppState.timerInterval
  );


  AppState.timerInterval =
    setInterval(() => {

      if (
        !AppState.analysisRunning
      ) {
        return;
      }


      const elapsed =
        Date.now() -
        AppState.analysisStartedAt;


      setText(
        "analysisTimer",
        formatDuration(elapsed)
      );


      updateTempo();

    }, 250);
}


/* =========================================================
   35. TEMPO
========================================================= */

function updateTempo() {

  if (
    !AppState.analysisStartedAt ||
    AppState.reps === 0
  ) {

    setText(
      "analysisTempo",
      "--"
    );

    return;
  }


  const seconds =
    (
      Date.now() -
      AppState.analysisStartedAt
    ) / 1000;


  const secondsPerRep =
    seconds /
    AppState.reps;


  setText(
    "analysisTempo",
    `${secondsPerRep.toFixed(1)}s`
  );
}


/* =========================================================
   36. STOP ANALYSIS
========================================================= */

function stopAnalysis() {

  if (
    !AppState.analysisRunning
  ) {

    showToast(
      "현재 진행 중인 분석이 없습니다."
    );

    return;
  }


  AppState.analysisRunning =
    false;


  clearInterval(
    AppState.timerInterval
  );


  AppState.timerInterval = null;


  captureAnalysisFrame();


  const record =
    createAnalysisRecord();


  const analyses =
    getAnalyses();


  analyses.unshift(record);


  saveAnalyses(analyses);


  AppState.lastAnalysisRecord =
    record;


  const badge =
    $("liveStatusBadge");


  if (badge) {

    badge.textContent =
      "● COMPLETE";

    badge.classList.add(
      "standby"
    );

  }


  const status =
    $("analysisEngineStatus");


  if (status) {

    status.textContent =
      "ANALYSIS COMPLETE";

  }


  renderRecords();

  renderDashboard();


  showToast(
    `분석 종료 · ${AppState.reps}회 기록 저장`
  );


  setTimeout(() => {

    const goReport =
      confirm(
        "분석이 저장되었습니다.\n바로 리포트로 이동할까요?"
      );


    if (goReport) {

      showPage("report");


      const select =
        $("reportAthlete");


      if (select) {

        select.value =
          record.athleteId;

      }


      if (
        typeof window.generateAthleteReport ===
        "function"
      ) {

        window.generateAthleteReport(
          record.athleteId
        );

      }

    }

  }, 100);
}


/* =========================================================
   37. ANALYSIS RECORD
========================================================= */

function createAnalysisRecord() {

  const athlete =
    getAthletes()
      .find(
        item =>
          item.id ===
          AppState.selectedAthleteId
      );


  const duration =
    Date.now() -
    AppState.analysisStartedAt;


  const averageRepScore =
    AppState.repScores.length
      ? Math.round(
          AppState.repScores.reduce(
            (a, b) => a + b,
            0
          ) /
          AppState.repScores.length
        )
      : AppState.currentMetrics.score;


  const metrics =
    AppState.currentMetrics;


  return {

    id:
      createId("analysis"),

    createdAt:
      new Date().toISOString(),

    athleteId:
      athlete?.id || "",

    athleteName:
      athlete?.name || "선수",

    exerciseId:
      AppState.currentExercise?.id || "",

    exerciseName:
      AppState.currentExercise?.name || "",

    category:
      AppState.currentExercise?.category || "",

    reps:
      AppState.reps,

    targetReps:
      AppState.targetReps,

    duration,

    score:
      averageRepScore || 0,

    symmetry:
      metrics.symmetry || 0,

    stability:
      metrics.stability || 0,

    mobility:
      metrics.mobility || 0,

    technique:
      metrics.technique || 0,

    power:
      estimatePowerScore(),

    strength:
      estimateStrengthScore(),

    rom:
      calculateROMScore(metrics),

    knee:
      metrics.knee,

    hip:
      metrics.hip,

    ankle:
      metrics.ankle,

    trunk:
      metrics.trunk,

    angleHistory:
      AppState.angleHistory,

    frame:
      AppState.lastFrameDataURL,

    view:
      AppState.cameraView,

    mode:
      AppState.analysisMode

  };
}


/* =========================================================
   38. PERFORMANCE ESTIMATION
========================================================= */

function estimatePowerScore() {

  const exercise =
    AppState.currentExercise;


  let base =
    AppState.currentMetrics.technique ||
    60;


  if (
    exercise &&
    (
      exercise.category === "power" ||
      exercise.category === "plyometric" ||
      exercise.category === "olympic"
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


function estimateStrengthScore() {

  let base =
    AppState.currentMetrics.stability ||
    60;


  base +=
    Math.min(
      AppState.reps,
      20
    ) * 0.6;


  return Math.round(
    clamp(
      base,
      0,
      100
    )
  );
}


/* =========================================================
   39. CAPTURE FRAME
========================================================= */

function captureAnalysisFrame() {

  try {

    const source =
      AppState.currentSource ===
      "video"
        ? $("uploadedVideo")
        : $("cameraVideo");


    if (
      !source ||
      source.videoWidth === 0
    ) {

      AppState.lastFrameDataURL =
        null;

      return;
    }


    const canvas =
      document.createElement(
        "canvas"
      );


    canvas.width =
      source.videoWidth;

    canvas.height =
      source.videoHeight;


    const ctx =
      canvas.getContext("2d");


    ctx.drawImage(
      source,
      0,
      0,
      canvas.width,
      canvas.height
    );


    AppState.lastFrameDataURL =
      canvas.toDataURL(
        "image/jpeg",
        0.72
      );


  } catch (error) {

    console.warn(error);

    AppState.lastFrameDataURL =
      null;

  }
}


/* =========================================================
   40. ANGLE HISTORY
========================================================= */

function pushAngleHistory(metrics) {

  const history =
    AppState.angleHistory;


  const index =
    history.labels.length;


  history.labels.push(index + 1);

  history.knee.push(
    metrics.knee
  );

  history.hip.push(
    metrics.hip
  );

  history.trunk.push(
    metrics.trunk
  );

  history.ankle.push(
    metrics.ankle
  );


  const maxPoints = 120;


  if (
    history.labels.length >
    maxPoints
  ) {

    Object
      .keys(history)
      .forEach(key => {

        history[key].shift();

      });

  }


  updateAngleChart();
}


/* =========================================================
   41. ANGLE CHART
========================================================= */

let angleChart = null;


function initializeAngleChart() {

  const canvas =
    $("angleChart");


  if (
    !canvas ||
    typeof Chart === "undefined"
  ) return;


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
              tension: 0.3,
              pointRadius: 0
            },

            {
              label: "고관절",
              data: [],
              tension: 0.3,
              pointRadius: 0
            },

            {
              label: "몸통",
              data: [],
              tension: 0.3,
              pointRadius: 0
            },

            {
              label: "발목",
              data: [],
              tension: 0.3,
              pointRadius: 0
            }

          ]

        },

        options: {

          responsive: true,

          maintainAspectRatio: false,

          animation: false,

          scales: {

            y: {
              min: 0,
              max: 200
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


function updateAngleChart() {

  if (!angleChart) return;


  const h =
    AppState.angleHistory;


  angleChart.data.labels =
    h.labels;


  angleChart.data.datasets[0].data =
    h.knee;


  angleChart.data.datasets[1].data =
    h.hip;


  angleChart.data.datasets[2].data =
    h.trunk;


  angleChart.data.datasets[3].data =
    h.ankle;


  angleChart.update("none");
}


/* =========================================================
   42. BAR PATH
========================================================= */

function updateBarPath(lm) {

  if (
    !AppState.barPathVisible
  ) return;


  const leftWrist =
    lm[15];

  const rightWrist =
    lm[16];


  if (
    !leftWrist ||
    !rightWrist
  ) return;


  const point = {

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


  AppState.barPath.push(point);


  if (
    AppState.barPath.length >
    150
  ) {

    AppState.barPath.shift();

  }


  drawBarPath();
}


function drawBarPath() {

  const canvas =
    $("barPathCanvas");


  if (!canvas) return;


  const viewer =
    canvas.parentElement;


  const rect =
    viewer.getBoundingClientRect();


  canvas.width =
    Math.floor(rect.width);

  canvas.height =
    Math.floor(rect.height);


  const ctx =
    canvas.getContext("2d");


  ctx.clearRect(
    0,
    0,
    canvas.width,
    canvas.height
  );


  if (
    !AppState.barPathVisible ||
    AppState.barPath.length < 2
  ) return;


  ctx.lineWidth = 4;

  ctx.beginPath();


  AppState.barPath.forEach(
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
   43. VIDEO UPLOAD
========================================================= */

function setupVideoUpload() {

  const input =
    $("analysisVideoUpload");


  if (!input) return;


  input.addEventListener(
    "change",
    async event => {

      const file =
        event.target.files?.[0];


      if (!file) return;


      await stopCamera();


      const video =
        $("uploadedVideo");


      const camera =
        $("cameraVideo");


      const image =
        $("uploadedImage");


      if (!video) return;


      video.src =
        URL.createObjectURL(file);


      video.hidden = false;


      if (camera) {
        camera.hidden = true;
      }

      if (image) {
        image.hidden = true;
      }


      AppState.currentSource =
        "video";


      hideViewerPlaceholder();


      await initializePose();


      startPoseLoop();


      showToast(
        "분석 영상 로드 완료"
      );

    }
  );
}


/* =========================================================
   44. IMAGE UPLOAD
========================================================= */

function setupImageUpload() {

  const input =
    $("analysisImageUpload");


  if (!input) return;


  input.addEventListener(
    "change",
    async event => {

      const file =
        event.target.files?.[0];


      if (!file) return;


      await stopCamera();


      const image =
        $("uploadedImage");


      const camera =
        $("cameraVideo");


      const video =
        $("uploadedVideo");


      if (!image) return;


      image.src =
        URL.createObjectURL(file);


      image.hidden = false;


      if (camera) {
        camera.hidden = true;
      }

      if (video) {
        video.hidden = true;
      }


      AppState.currentSource =
        "image";


      hideViewerPlaceholder();


      await initializePose();


      image.onload =
        async () => {

          if (
            AppState.pose
          ) {

            await AppState.pose.send({
              image
            });

          }

        };


      showToast(
        "사진 분석 준비 완료"
      );

    }
  );
}


/* =========================================================
   45. PLAYBACK
========================================================= */

function setupPlayback() {

  const back =
    $("frameBackBtn");

  const forward =
    $("frameForwardBtn");

  const play =
    $("playPauseBtn");

  const speed =
    $("playbackSpeed");


  if (back) {

    back.addEventListener(
      "click",
      () => {

        const video =
          $("uploadedVideo");

        if (
          !video ||
          video.hidden
        ) return;

        video.pause();

        video.currentTime =
          Math.max(
            0,
            video.currentTime -
            1 / 30
          );

      }
    );

  }


  if (forward) {

    forward.addEventListener(
      "click",
      () => {

        const video =
          $("uploadedVideo");

        if (
          !video ||
          video.hidden
        ) return;

        video.pause();

        video.currentTime =
          Math.min(
            video.duration || Infinity,
            video.currentTime +
            1 / 30
          );

      }
    );

  }


  if (play) {

    play.addEventListener(
      "click",
      () => {

        const video =
          $("uploadedVideo");

        if (
          !video ||
          video.hidden
        ) return;


        if (video.paused) {

          video.play();

        } else {

          video.pause();

        }

      }
    );

  }


  if (speed) {

    speed.addEventListener(
      "change",
      () => {

        const video =
          $("uploadedVideo");

        if (!video) return;


        video.playbackRate =
          Number(speed.value) || 1;

      }
    );

  }
}


/* =========================================================
   46. ANALYSIS CONTROLS
========================================================= */

function setupAnalysisControls() {

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


  $("stopAnalysisBtn")
    ?.addEventListener(
      "click",
      stopAnalysis
    );


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


        AppState.targetReps =
          value;


        setText(
          "targetRepCount",
          value
        );

      }
    );


  document
    .querySelectorAll(
      "[data-view]"
    )
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          document
            .querySelectorAll(
              "[data-view]"
            )
            .forEach(item => {

              item.classList.remove(
                "active"
              );

            });


          button.classList.add(
            "active"
          );


          AppState.cameraView =
            button.dataset.view;

        }
      );

    });


  document
    .querySelectorAll(
      "[data-analysis-mode]"
    )
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          document
            .querySelectorAll(
              "[data-analysis-mode]"
            )
            .forEach(item => {

              item.classList.remove(
                "active"
              );

            });


          button.classList.add(
            "active"
          );


          AppState.analysisMode =
            button.dataset.analysisMode;

        }
      );

    });


  $("toggleSkeletonBtn")
    ?.addEventListener(
      "click",
      () => {

        AppState.skeletonVisible =
          !AppState.skeletonVisible;


        showToast(
          AppState.skeletonVisible
            ? "스켈레톤 표시"
            : "스켈레톤 숨김"
        );

      }
    );


  $("toggleReferenceBtn")
    ?.addEventListener(
      "click",
      toggleReferenceLines
    );


  $("toggleBarPathBtn")
    ?.addEventListener(
      "click",
      () => {

        AppState.barPathVisible =
          !AppState.barPathVisible;


        if (
          !AppState.barPathVisible
        ) {

          const canvas =
            $("barPathCanvas");

          canvas
            ?.getContext("2d")
            ?.clearRect(
              0,
              0,
              canvas.width,
              canvas.height
            );

        }


        showToast(
          AppState.barPathVisible
            ? "궤적 표시"
            : "궤적 숨김"
        );

      }
    );
}


/* =========================================================
   47. REFERENCE LINES
========================================================= */

function toggleReferenceLines() {

  AppState.referenceVisible =
    !AppState.referenceVisible;


  [
    "referenceVertical",
    "referenceHorizontal"
  ]
    .forEach(id => {

      const el = $(id);

      if (el) {

        el.style.display =
          AppState.referenceVisible
            ? ""
            : "none";

      }

    });
}


/* =========================================================
   48. RECORDS
========================================================= */

function renderRecords() {

  const body =
    $("recordsTableBody");

  if (!body) return;


  const athleteFilter =
    $("recordAthleteFilter")
      ?.value || "all";


  const exerciseFilter =
    $("recordExerciseFilter")
      ?.value || "all";


  const keyword =
    $("recordSearch")
      ?.value
      .trim()
      .toLowerCase() || "";


  const records =
    getAnalyses()
      .filter(record => {

        const athleteMatch =
          athleteFilter === "all" ||
          record.athleteId ===
          athleteFilter;


        const exerciseMatch =
          exerciseFilter === "all" ||
          record.exerciseId ===
          exerciseFilter;


        const searchMatch =
          !keyword ||
          record.athleteName
            .toLowerCase()
            .includes(keyword) ||
          record.exerciseName
            .toLowerCase()
            .includes(keyword);


        return (
          athleteMatch &&
          exerciseMatch &&
          searchMatch
        );

      });


  if (!records.length) {

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
    records
      .map(record => `

        <tr>

          <td>
            ${formatDate(record.createdAt)}
          </td>

          <td>
            ${escapeHTML(record.athleteName)}
          </td>

          <td>
            ${escapeHTML(record.exerciseName)}
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
            ${record.rom}
          </td>

          <td>

            <button
              data-record-open="${record.id}"
            >
              보기
            </button>

          </td>

        </tr>

      `)
      .join("");
}


/* =========================================================
   49. RECORD EVENTS
========================================================= */

function setupRecordEvents() {

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


  $("recordsTableBody")
    ?.addEventListener(
      "click",
      event => {

        const button =
          event.target.closest(
            "[data-record-open]"
          );


        if (!button) return;


        openRecordDetail(
          button.dataset.recordOpen
        );

      }
    );


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


  $("exportCSVBtn")
    ?.addEventListener(
      "click",
      exportRecordsCSV
    );
}


/* =========================================================
   50. RECORD DETAIL
========================================================= */

function openRecordDetail(id) {

  const record =
    getAnalyses()
      .find(item => item.id === id);


  if (!record) return;


  const container =
    $("recordDetailContent");


  if (!container) return;


  container.innerHTML = `

    <div class="report-score-grid">

      <div>
        <span>선수</span>
        <strong>
          ${escapeHTML(record.athleteName)}
        </strong>
      </div>

      <div>
        <span>운동</span>
        <strong>
          ${escapeHTML(record.exerciseName)}
        </strong>
      </div>

      <div>
        <span>반복</span>
        <strong>
          ${record.reps}
        </strong>
      </div>

      <div>
        <span>점수</span>
        <strong>
          ${record.score}
        </strong>
      </div>

      <div>
        <span>대칭성</span>
        <strong>
          ${record.symmetry}%
        </strong>
      </div>

      <div>
        <span>안정성</span>
        <strong>
          ${record.stability}
        </strong>
      </div>

    </div>

  `;


  $("recordModal")
    ?.classList.add(
      "open"
    );
}


/* =========================================================
   51. CSV
========================================================= */

function exportRecordsCSV() {

  const records =
    getAnalyses();


  if (!records.length) {

    showToast(
      "저장할 기록이 없습니다."
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
      "ROM"
    ],

    ...records.map(
      record => [

        formatDate(record.createdAt),

        record.athleteName,

        record.exerciseName,

        record.reps,

        record.score,

        record.symmetry,

        record.stability,

        record.rom

      ]
    )

  ];


  const csv =
    "\uFEFF" +
    rows
      .map(row =>
        row
          .map(value =>
            `"${String(value)
              .replaceAll('"', '""')}"`
          )
          .join(",")
      )
      .join("\n");


  downloadBlob(
    csv,
    "weight-analysis.csv",
    "text/csv;charset=utf-8"
  );
}


/* =========================================================
   52. TRAINING PROGRAM
========================================================= */

function setupProgramEvents() {

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


  $("programExerciseList")
    ?.addEventListener(
      "click",
      event => {

        const remove =
          event.target.closest(
            "[data-program-remove]"
          );


        if (!remove) return;


        AppState.sessionProgram =
          AppState.sessionProgram
            .filter(
              item =>
                item.id !==
                remove.dataset.programRemove
            );


        renderProgram();

      }
    );
}


/* =========================================================
   53. ADD PROGRAM EXERCISE
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


  const exercise =
    window.getExerciseById
      ? window.getExerciseById(
          exerciseId
        )
      : null;


  if (!exercise) return;


  const item = {

    id:
      createId("programItem"),

    exerciseId:
      exercise.id,

    name:
      exercise.name,

    sets:
      Math.max(
        1,
        Number(
          $("programSets")?.value
        ) || 1
      ),

    reps:
      Math.max(
        1,
        Number(
          $("programReps")?.value
        ) || 1
      ),

    weight:
      Math.max(
        0,
        Number(
          $("programWeight")?.value
        ) || 0
      ),

    rest:
      Math.max(
        0,
        Number(
          $("programRest")?.value
        ) || 0
      )

  };


  AppState.sessionProgram.push(
    item
  );


  renderProgram();


  showToast(
    `${exercise.name} 추가`
  );
}


/* =========================================================
   54. RENDER PROGRAM
========================================================= */

function renderProgram() {

  const container =
    $("programExerciseList");


  if (!container) return;


  const items =
    AppState.sessionProgram;


  if (!items.length) {

    container.innerHTML = `

      <div class="empty-state">
        추가된 운동이 없습니다.
      </div>

    `;

  } else {

    container.innerHTML =
      items
        .map(
          (item, index) => `

            <div class="program-exercise-item">

              <div>

                <span>
                  ${index + 1}
                </span>

                <strong>
                  ${escapeHTML(item.name)}
                </strong>

              </div>


              <div>

                ${item.sets}세트 ×
                ${item.reps}회 ·
                ${item.weight}kg ·
                휴식 ${item.rest}초

              </div>


              <button
                data-program-remove="${item.id}"
              >
                ×
              </button>

            </div>

          `
        )
        .join("");

  }


  const totalSets =
    items.reduce(
      (sum, item) =>
        sum + item.sets,
      0
    );


  const volume =
    items.reduce(
      (sum, item) =>
        sum +
        item.sets *
        item.reps *
        item.weight,
      0
    );


  setText(
    "programExerciseCount",
    items.length
  );

  setText(
    "programTotalSets",
    totalSets
  );

  setText(
    "programTotalVolume",
    `${Math.round(volume)} kg`
  );
}


/* =========================================================
   55. SAVE PROGRAM
========================================================= */

function saveTrainingProgram() {

  const athleteId =
    $("programAthlete")?.value;


  const name =
    $("programName")
      ?.value
      .trim();


  if (!athleteId) {

    showToast(
      "선수를 선택하세요."
    );

    return;
  }


  if (!name) {

    showToast(
      "프로그램 이름을 입력하세요."
    );

    return;
  }


  if (
    !AppState.sessionProgram.length
  ) {

    showToast(
      "운동을 추가하세요."
    );

    return;
  }


  const athlete =
    getAthletes()
      .find(
        item =>
          item.id === athleteId
      );


  const program = {

    id:
      createId("program"),

    athleteId,

    athleteName:
      athlete?.name || "",

    name,

    exercises:
      AppState.sessionProgram,

    createdAt:
      new Date().toISOString()

  };


  const programs =
    getPrograms();


  programs.unshift(program);


  savePrograms(programs);


  AppState.sessionProgram = [];


  renderProgram();


  showToast(
    "훈련 프로그램 저장 완료"
  );
}


/* =========================================================
   56. DASHBOARD CHARTS
========================================================= */

let performanceRadar = null;
let performanceTrendChart = null;


/* =========================================================
   57. INIT DASHBOARD CHARTS
========================================================= */

function initializeDashboardCharts() {

  if (
    typeof Chart === "undefined"
  ) return;


  const radarCanvas =
    $("performanceRadar");


  if (radarCanvas) {

    performanceRadar =
      new Chart(
        radarCanvas,
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
                label: "PERFORMANCE",
                data: [0, 0, 0, 0, 0, 0],
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
                max: 100
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


  const trendCanvas =
    $("performanceTrendChart");


  if (trendCanvas) {

    performanceTrendChart =
      new Chart(
        trendCanvas,
        {

          type: "line",

          data: {

            labels: [],

            datasets: [
              {
                label: "자세 점수",
                data: [],
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
}


/* =========================================================
   58. DASHBOARD
========================================================= */

function renderDashboard() {

  const athletes =
    getAthletes();

  const analyses =
    getAnalyses();


  setText(
    "dashboardAthleteCount",
    athletes.length
  );


  setText(
    "dashboardAnalysisCount",
    analyses.length
  );


  const averageScore =
    analyses.length
      ? Math.round(
          analyses.reduce(
            (sum, item) =>
              sum + item.score,
            0
          ) /
          analyses.length
        )
      : "--";


  setText(
    "dashboardAverageScore",
    averageScore
  );


  setText(
    "dashboardPRCount",
    calculatePRCount()
  );


  const athlete =
    athletes.find(
      item =>
        item.id ===
        AppState.selectedAthleteId
    );


  if (!athlete) {

    setText(
      "dashboardAthleteName",
      "선수 미선택"
    );

    setText(
      "dashboardAthleteSport",
      "-"
    );

    setText(
      "dashboardHeight",
      "-"
    );

    setText(
      "dashboardWeight",
      "-"
    );

    setText(
      "dashboardLatestScore",
      "-"
    );

    updateDashboardRadar(null);

    renderDashboardRecent();

    renderDashboardPR();

    updateTrendChart();

    return;
  }


  setText(
    "dashboardAthleteName",
    athlete.name
  );


  setText(
    "dashboardAthleteSport",
    athlete.sport || "-"
  );


  setText(
    "dashboardHeight",
    athlete.height
      ? `${athlete.height} cm`
      : "-"
  );


  setText(
    "dashboardWeight",
    athlete.weight
      ? `${athlete.weight} kg`
      : "-"
  );


  const athleteRecords =
    analyses.filter(
      item =>
        item.athleteId ===
        athlete.id
    );


  const latest =
    athleteRecords[0];


  setText(
    "dashboardLatestScore",
    latest?.score ?? "-"
  );


  updateDashboardRadar(latest);

  renderDashboardRecent();

  renderDashboardPR();

  updateTrendChart();
}


/* =========================================================
   59. DASHBOARD RADAR
========================================================= */

function updateDashboardRadar(record) {

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
      : [0, 0, 0, 0, 0, 0];


  if (performanceRadar) {

    performanceRadar
      .data
      .datasets[0]
      .data = values;


    performanceRadar.update();

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

      setText(
        id,
        values[index]
      );

    }
  );
}


/* =========================================================
   60. TREND
========================================================= */

function updateTrendChart() {

  if (!performanceTrendChart) {
    return;
  }


  const period =
    Number(
      $("dashboardPeriod")?.value
    ) || 7;


  let records =
    getAnalyses();


  if (
    AppState.selectedAthleteId
  ) {

    records =
      records.filter(
        record =>
          record.athleteId ===
          AppState.selectedAthleteId
      );

  }


  records =
    records
      .slice(0, period)
      .reverse();


  performanceTrendChart
    .data
    .labels =
      records.map(
        record =>
          new Date(
            record.createdAt
          )
            .toLocaleDateString(
              "ko-KR",
              {
                month: "numeric",
                day: "numeric"
              }
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


  performanceTrendChart.update();
}


/* =========================================================
   61. RECENT
========================================================= */

function renderDashboardRecent() {

  const container =
    $("dashboardRecentList");


  if (!container) return;


  let records =
    getAnalyses();


  if (
    AppState.selectedAthleteId
  ) {

    records =
      records.filter(
        record =>
          record.athleteId ===
          AppState.selectedAthleteId
      );

  }


  records =
    records.slice(0, 5);


  if (!records.length) {

    container.innerHTML = `

      <div class="empty-state">
        아직 분석 기록이 없습니다.
      </div>

    `;

    return;
  }


  container.innerHTML =
    records
      .map(record => `

        <div class="recent-item">

          <div>

            <strong>
              ${escapeHTML(
                record.exerciseName
              )}
            </strong>

            <span>
              ${formatDate(
                record.createdAt
              )}
            </span>

          </div>

          <strong>
            ${record.score}
          </strong>

        </div>

      `)
      .join("");
}


/* =========================================================
   62. PR
========================================================= */

function calculatePRCount() {

  const records =
    getAnalyses();


  const best = {};


  records.forEach(record => {

    const key =
      record.athleteId +
      "_" +
      record.exerciseId;


    if (
      !best[key] ||
      record.score >
      best[key].score
    ) {

      best[key] = record;

    }

  });


  return Object.keys(best).length;
}


function renderDashboardPR() {

  const container =
    $("dashboardPRList");


  if (!container) return;


  let records =
    getAnalyses();


  if (
    AppState.selectedAthleteId
  ) {

    records =
      records.filter(
        record =>
          record.athleteId ===
          AppState.selectedAthleteId
      );

  }


  const best = {};


  records.forEach(record => {

    if (
      !best[record.exerciseId] ||
      record.score >
      best[record.exerciseId].score
    ) {

      best[record.exerciseId] =
        record;

    }

  });


  const prs =
    Object
      .values(best)
      .sort(
        (a, b) =>
          b.score -
          a.score
      )
      .slice(0, 5);


  if (!prs.length) {

    container.innerHTML = `

      <div class="empty-state">
        기록된 PR이 없습니다.
      </div>

    `;

    return;
  }


  container.innerHTML =
    prs
      .map(record => `

        <div class="recent-item">

          <div>

            <strong>
              ${escapeHTML(
                record.exerciseName
              )}
            </strong>

            <span>
              BEST SCORE
            </span>

          </div>

          <strong>
            ${record.score}
          </strong>

        </div>

      `)
      .join("");
}


/* =========================================================
   63. REPORT ATHLETES
========================================================= */

function populateReportAthletes() {

  const select =
    $("reportAthlete");


  if (!select) return;


  const selected =
    select.value ||
    AppState.selectedAthleteId;


  select.innerHTML = `

    <option value="">
      선수 선택
    </option>

  `;


  getAthletes().forEach(
    athlete => {

      const option =
        document.createElement(
          "option"
        );

      option.value =
        athlete.id;

      option.textContent =
        athlete.name;

      select.appendChild(option);

    }
  );


  if (selected) {
    select.value = selected;
  }
}


/* =========================================================
   64. BACKUP
========================================================= */

function backupData() {

  const data = {

    version:
      APP_CONFIG.version,

    exportedAt:
      new Date().toISOString(),

    athletes:
      getAthletes(),

    analyses:
      getAnalyses(),

    programs:
      getPrograms()

  };


  downloadBlob(
    JSON.stringify(
      data,
      null,
      2
    ),
    "weight-performance-lab-backup.json",
    "application/json"
  );
}


/* =========================================================
   65. RESTORE
========================================================= */

function setupRestore() {

  const input =
    $("restoreDataInput");


  if (!input) return;


  input.addEventListener(
    "change",
    event => {

      const file =
        event.target.files?.[0];


      if (!file) return;


      const reader =
        new FileReader();


      reader.onload = () => {

        try {

          const data =
            JSON.parse(
              reader.result
            );


          if (
            Array.isArray(
              data.athletes
            )
          ) {

            saveAthletes(
              data.athletes
            );

          }


          if (
            Array.isArray(
              data.analyses
            )
          ) {

            saveAnalyses(
              data.analyses
            );

          }


          if (
            Array.isArray(
              data.programs
            )
          ) {

            savePrograms(
              data.programs
            );

          }


          refreshAll();


          showToast(
            "데이터 복원 완료"
          );


        } catch (error) {

          console.error(error);

          showToast(
            "백업 파일을 확인하세요."
          );

        }

      };


      reader.readAsText(file);

    }
  );
}


/* =========================================================
   66. CLEAR DATA
========================================================= */

function clearAllData() {

  if (
    !confirm(
      "선수·분석·프로그램 데이터를 모두 삭제할까요?"
    )
  ) {
    return;
  }


  localStorage.removeItem(
    APP_CONFIG.storage.athletes
  );

  localStorage.removeItem(
    APP_CONFIG.storage.analyses
  );

  localStorage.removeItem(
    APP_CONFIG.storage.programs
  );

  localStorage.removeItem(
    APP_CONFIG.storage.selectedAthlete
  );


  AppState.selectedAthleteId =
    null;


  refreshAll();


  showToast(
    "모든 데이터가 초기화되었습니다."
  );
}


/* =========================================================
   67. SETTINGS
========================================================= */

function setupSettings() {

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


  $("settingSkeleton")
    ?.addEventListener(
      "change",
      event => {

        AppState.skeletonVisible =
          event.target.checked;

      }
    );


  $("settingReference")
    ?.addEventListener(
      "change",
      event => {

        AppState.referenceVisible =
          event.target.checked;

        [
          "referenceVertical",
          "referenceHorizontal"
        ]
          .forEach(id => {

            const el = $(id);

            if (el) {

              el.style.display =
                event.target.checked
                  ? ""
                  : "none";

            }

          });

      }
    );


  $("settingBarPath")
    ?.addEventListener(
      "change",
      event => {

        AppState.barPathVisible =
          event.target.checked;

      }
    );


  setupRestore();
}


/* =========================================================
   68. GENERAL EVENTS
========================================================= */

function setupGeneralEvents() {

  $("dashboardPeriod")
    ?.addEventListener(
      "change",
      updateTrendChart
    );


  $("analysisAthlete")
    ?.addEventListener(
      "change",
      event => {

        if (
          event.target.value
        ) {

          AppState.selectedAthleteId =
            event.target.value;

          localStorage.setItem(
            APP_CONFIG.storage.selectedAthlete,
            event.target.value
          );

        }

      }
    );


  $("coachModeBtn")
    ?.addEventListener(
      "click",
      () => {

        showToast(
          "코치 모드 활성화"
        );

      }
    );
}


/* =========================================================
   69. DOWNLOAD
========================================================= */

function downloadBlob(
  content,
  filename,
  type
) {

  const blob =
    new Blob(
      [content],
      { type }
    );


  const url =
    URL.createObjectURL(blob);


  const a =
    document.createElement("a");


  a.href = url;

  a.download = filename;


  document.body.appendChild(a);

  a.click();

  a.remove();


  URL.revokeObjectURL(url);
}


/* =========================================================
   70. UTILITY
========================================================= */

function setText(id, value) {

  const el = $(id);

  if (el) {
    el.textContent = value;
  }
}


function angleText(value) {

  return Number.isFinite(value)
    ? `${value.toFixed(1)}°`
    : "-°";
}


function round1(value) {

  return Number.isFinite(value)
    ? Math.round(value * 10) / 10
    : null;
}


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


function formatDuration(ms) {

  const total =
    Math.floor(ms / 1000);


  const minutes =
    Math.floor(total / 60);


  const seconds =
    total % 60;


  return (
    String(minutes)
      .padStart(2, "0") +
    ":" +
    String(seconds)
      .padStart(2, "0")
  );
}


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


function escapeHTML(value = "") {

  return String(value)

    .replaceAll("&", "&amp;")

    .replaceAll("<", "&lt;")

    .replaceAll(">", "&gt;")

    .replaceAll('"', "&quot;")

    .replaceAll("'", "&#039;");
}


/* =========================================================
   71. REFRESH
========================================================= */

function refreshAll() {

  refreshAthleteSelectors();

  renderAthletes();

  renderRecords();

  renderProgram();

  renderDashboard();

  populateReportAthletes();
}


/* =========================================================
   72. RESTORE STATE
========================================================= */

function restoreAppState() {

  const selected =
    localStorage.getItem(
      APP_CONFIG.storage.selectedAthlete
    );


  if (
    selected &&
    getAthletes()
      .some(
        athlete =>
          athlete.id === selected
      )
  ) {

    AppState.selectedAthleteId =
      selected;

  }

  else {

    AppState.selectedAthleteId =
      getAthletes()[0]?.id ||
      null;

  }
}


/* =========================================================
   73. APP INIT
========================================================= */

async function initializeApp() {

  restoreAppState();


  setupNavigation();

  setupAthleteForm();

  setupAthleteEvents();

  setupAnalysisControls();

  setupVideoUpload();

  setupImageUpload();

  setupPlayback();

  setupRecordEvents();

  setupProgramEvents();

  setupSettings();

  setupGeneralEvents();


  initializeDashboardCharts();

  initializeAngleChart();


  refreshAll();


  updateClock();

  setInterval(
    updateClock,
    1000
  );


  setText(
    "targetRepCount",
    $("analysisTargetReps")?.value ||
    10
  );


  await initializePose();


  console.log(
    "======================================"
  );

  console.log(
    "설천고 WEIGHT PERFORMANCE LAB"
  );

  console.log(
    `VERSION ${APP_CONFIG.version}`
  );

  console.log(
    "33 LANDMARK MOTION ENGINE READY"
  );

  console.log(
    "======================================"
  );

}


/* =========================================================
   74. GLOBAL
========================================================= */

window.AppState =
  AppState;

window.getAthletes =
  getAthletes;

window.getAnalyses =
  getAnalyses;

window.getPrograms =
  getPrograms;

window.renderDashboard =
  renderDashboard;

window.renderRecords =
  renderRecords;

window.refreshAthleteSelectors =
  refreshAthleteSelectors;


/* =========================================================
   75. START
========================================================= */

if (
  document.readyState ===
  "loading"
) {

  document.addEventListener(
    "DOMContentLoaded",
    initializeApp
  );

}

else {

  initializeApp();

}


/* =========================================================
   END APP.JS
========================================================= */