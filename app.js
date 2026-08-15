/* =========================================================
   설천고 WEIGHT PERFORMANCE LAB
   APP.JS

   MAIN APPLICATION CONTROLLER
========================================================= */

"use strict";


/* =========================================================
   STORAGE
========================================================= */

const STORAGE_KEYS = {
  athletes: "weight_lab_athletes",
  analyses: "weight_lab_analyses",
  programs: "weight_lab_programs",
  settings: "weight_lab_settings"
};


const APP_STATE = {

  currentPage: "dashboard",

  selectedAthleteId: null,

  selectedExerciseId: null,

  currentCategory: "all",

  cameraStream: null,

  cameraFacingMode: "environment",

  sourceType: null,

  analysisRunning: false,

  analysisStartedAt: null,

  analysisTimerInterval: null,

  currentRepCount: 0,

  analysisMode: "2d",

  cameraView: "front",

  skeletonVisible: true,

  referenceVisible: true,

  barPathVisible: true,

  programExercises: [],

  targetMode: "reps",

  targetSets: 1,

  targetReps: 10,

  completedSets: 0

};


/* =========================================================
   HELPERS
========================================================= */

function $(id) {
  return document.getElementById(id);
}


function query(selector) {
  return document.querySelector(selector);
}


function queryAll(selector) {
  return [...document.querySelectorAll(selector)];
}


function loadJSON(key, fallback = []) {

  try {

    const data = localStorage.getItem(key);

    if (!data) {
      return fallback;
    }

    return JSON.parse(data);

  } catch (error) {

    console.error(error);

    return fallback;
  }
}


function saveJSON(key, value) {

  try {

    localStorage.setItem(
      key,
      JSON.stringify(value)
    );

  } catch (error) {

    console.error(error);

    showToast("데이터 저장 중 오류가 발생했습니다.");
  }
}


function generateId(prefix = "id") {

  return `${prefix}_${Date.now()}_${Math.random()
    .toString(36)
    .slice(2, 9)}`;
}


function clamp(value, min, max) {

  return Math.min(
    Math.max(value, min),
    max
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


function formatDateTime(dateValue) {

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleString("ko-KR");
}


function formatDuration(seconds) {

  const safeSeconds =
    Math.max(0, Math.floor(seconds));

  const minutes =
    Math.floor(safeSeconds / 60);

  const remain =
    safeSeconds % 60;

  return (
    String(minutes).padStart(2, "0") +
    ":" +
    String(remain).padStart(2, "0")
  );
}


/* =========================================================
   TOAST
========================================================= */

let toastTimer = null;


function showToast(message) {

  const toast = $("toast");

  if (!toast) {
    return;
  }

  toast.textContent = message;

  toast.classList.add("show");

  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {

    toast.classList.remove("show");

  }, 2500);
}


/* =========================================================
   PAGE NAVIGATION
========================================================= */

function openPage(pageName) {

  const page =
    $(`page-${pageName}`);

  if (!page) {
    return;
  }


  queryAll(".page").forEach(item => {

    item.classList.remove("active");

  });


  page.classList.add("active");


  queryAll(".nav-item").forEach(button => {

    button.classList.toggle(
      "active",
      button.dataset.page === pageName
    );

  });


  APP_STATE.currentPage = pageName;


  const sidebar = $("sidebar");

  if (sidebar) {
    sidebar.classList.remove("mobile-open");
  }


  if (pageName === "dashboard") {

    refreshDashboard();

  }


  if (pageName === "athletes") {

    renderAthletes();

  }


  if (pageName === "exercises") {

    renderExercises();

  }


  if (pageName === "analysis") {

    refreshAnalysisSelectors();

  }


  if (pageName === "records") {

    renderRecords();

  }


  if (pageName === "program") {

    refreshProgramSelectors();
    renderProgramExercises();

  }


  if (pageName === "report") {

    refreshReportAthletes();

  }


  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}


/* =========================================================
   CLOCK
========================================================= */

function updateClock() {

  const now = new Date();


  if ($("headerDate")) {

    $("headerDate").textContent =
      now.toLocaleDateString(
        "ko-KR",
        {
          year: "numeric",
          month: "2-digit",
          day: "2-digit"
        }
      );

  }


  if ($("headerTime")) {

    $("headerTime").textContent =
      now.toLocaleTimeString(
        "ko-KR",
        {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false
        }
      );

  }
}


/* =========================================================
   ATHLETES
========================================================= */

function getAthletes() {

  return loadJSON(
    STORAGE_KEYS.athletes,
    []
  );
}


function saveAthletes(athletes) {

  saveJSON(
    STORAGE_KEYS.athletes,
    athletes
  );
}


function getAthleteById(id) {

  return getAthletes().find(
    athlete => athlete.id === id
  ) || null;
}


function createAthlete(event) {

  event.preventDefault();


  const name =
    $("athleteName")?.value.trim();


  if (!name) {

    showToast("선수 이름을 입력하세요.");

    return;
  }


  const athlete = {

    id: generateId("athlete"),

    name,

    birth:
      $("athleteBirth")?.value || "",

    sport:
      $("athleteSport")?.value.trim() || "",

    height:
      Number(
        $("athleteHeight")?.value || 0
      ),

    weight:
      Number(
        $("athleteWeight")?.value || 0
      ),

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


  APP_STATE.selectedAthleteId =
    athlete.id;


  event.target.reset();


  renderAthletes();

  refreshAllAthleteSelectors();

  refreshDashboard();


  showToast(
    `${athlete.name} 선수 등록 완료`
  );
}


function selectAthlete(id) {

  APP_STATE.selectedAthleteId = id;

  renderAthletes();

  refreshDashboard();

  refreshAnalysisSelectors();

  refreshProgramSelectors();

  refreshReportAthletes();
}


function deleteAthlete(id) {

  const athlete =
    getAthleteById(id);


  if (!athlete) {
    return;
  }


  const confirmed =
    confirm(
      `${athlete.name} 선수를 삭제할까요?`
    );


  if (!confirmed) {
    return;
  }


  const athletes =
    getAthletes().filter(
      item => item.id !== id
    );


  saveAthletes(athletes);


  if (
    APP_STATE.selectedAthleteId === id
  ) {

    APP_STATE.selectedAthleteId =
      athletes[0]?.id || null;

  }


  renderAthletes();

  refreshAllAthleteSelectors();

  refreshDashboard();


  showToast("선수 삭제 완료");
}


function renderAthletes() {

  const container =
    $("athleteList");


  if (!container) {
    return;
  }


  const keyword =
    $("athleteSearch")
      ?.value
      .trim()
      .toLowerCase() || "";


  const athletes =
    getAthletes().filter(athlete => {

      const text =
        [
          athlete.name,
          athlete.sport,
          athlete.group
        ]
          .join(" ")
          .toLowerCase();


      return text.includes(keyword);
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
    athletes.map(athlete => {

      const active =
        athlete.id ===
        APP_STATE.selectedAthleteId;


      return `
        <article
          class="athlete-card ${active ? "active" : ""}"
          data-athlete-id="${athlete.id}"
        >

          <div class="athlete-card-avatar">
            👤
          </div>

          <div class="athlete-card-info">

            <strong>
              ${escapeHTML(athlete.name)}
            </strong>

            <span>
              ${escapeHTML(athlete.sport || "종목 미등록")}
            </span>

            <small>
              ${
                athlete.height
                  ? athlete.height + "cm"
                  : "-"
              }
              ·
              ${
                athlete.weight
                  ? athlete.weight + "kg"
                  : "-"
              }
            </small>

          </div>

          <div class="athlete-card-actions">

            <button
              type="button"
              data-athlete-select="${athlete.id}"
            >
              선택
            </button>

            <button
              type="button"
              data-athlete-analyze="${athlete.id}"
            >
              분석
            </button>

            <button
              type="button"
              data-athlete-delete="${athlete.id}"
            >
              삭제
            </button>

          </div>

        </article>
      `;

    }).join("");
}


/* =========================================================
   ATHLETE SELECTORS
========================================================= */

function populateAthleteSelect(
  select,
  selectedId = ""
) {

  if (!select) {
    return;
  }


  const athletes =
    getAthletes();


  select.innerHTML =
    `
      <option value="">
        선수 선택
      </option>
    ` +
    athletes.map(athlete => `
      <option
        value="${athlete.id}"
        ${
          athlete.id === selectedId
            ? "selected"
            : ""
        }
      >
        ${escapeHTML(athlete.name)}
      </option>
    `).join("");
}


function refreshAllAthleteSelectors() {

  populateAthleteSelect(
    $("analysisAthlete"),
    APP_STATE.selectedAthleteId
  );


  populateAthleteSelect(
    $("programAthlete"),
    APP_STATE.selectedAthleteId
  );


  populateAthleteSelect(
    $("reportAthlete"),
    APP_STATE.selectedAthleteId
  );


  populateRecordAthleteFilter();
}


/* =========================================================
   EXERCISE LIBRARY
========================================================= */

function renderExercises() {

  const container =
    $("exerciseGrid");


  if (!container) {
    return;
  }


  const keyword =
    $("exerciseSearch")?.value || "";


  const equipment =
    $("equipmentFilter")?.value || "all";


  const exercises =
    window.searchExercises
      ? window.searchExercises(
          keyword,
          APP_STATE.currentCategory,
          equipment
        )
      : [];


  if ($("exerciseTotalCount")) {

    $("exerciseTotalCount").textContent =
      exercises.length;

  }


  if (!exercises.length) {

    container.innerHTML = `
      <div class="empty-state">
        조건에 맞는 운동이 없습니다.
      </div>
    `;

    return;
  }


  container.innerHTML =
    exercises.map(exercise => `

      <article
        class="exercise-card"
        data-exercise-id="${exercise.id}"
      >

        <div class="exercise-pictogram">
          ${exercise.pictogram}
        </div>


        <div class="exercise-card-content">

          <span class="exercise-category">
            ${
              window.getExerciseCategoryLabel(
                exercise.category
              )
            }
          </span>

          <h3>
            ${escapeHTML(exercise.name)}
          </h3>

          <p>
            ${escapeHTML(exercise.muscles)}
          </p>

          <small>
            ${
              window.getExerciseEquipmentLabel(
                exercise.equipment
              )
            }
          </small>

        </div>


        <div class="exercise-card-buttons">

          <button
            type="button"
            class="secondary-button"
            data-exercise-detail="${exercise.id}"
          >
            자세히
          </button>

          <button
            type="button"
            class="primary-button"
            data-exercise-analyze="${exercise.id}"
          >
            자세 분석
          </button>

        </div>

      </article>

    `).join("");
}


/* =========================================================
   EXERCISE MODAL
========================================================= */

function openExerciseModal(id) {

  const exercise =
    window.getExerciseById?.(id);


  if (!exercise) {
    return;
  }


  APP_STATE.selectedExerciseId =
    exercise.id;


  $("modalExercisePictogram").textContent =
    exercise.pictogram;


  $("modalExerciseCategory").textContent =
    window.getExerciseCategoryLabel(
      exercise.category
    );


  $("modalExerciseName").textContent =
    exercise.name;


  $("modalExerciseDescription").textContent =
    exercise.description;


  $("modalExerciseMuscles").textContent =
    exercise.muscles;


  $("modalExerciseEquipment").textContent =
    window.getExerciseEquipmentLabel(
      exercise.equipment
    );


  $("modalExerciseView").textContent =
    getViewLabel(
      exercise.recommendedView
    );


  $("modalExerciseMetrics").textContent =
    exercise.metrics;


  $("exerciseModal")
    ?.classList.add("open");
}


function closeExerciseModal() {

  $("exerciseModal")
    ?.classList.remove("open");
}


/* =========================================================
   ANALYZE EXERCISE
========================================================= */

function analyzeExercise(id) {

  const exercise =
    window.getExerciseById?.(id);


  if (!exercise) {

    showToast("운동 정보를 찾을 수 없습니다.");

    return;
  }


  APP_STATE.selectedExerciseId =
    id;


  closeExerciseModal();


  openPage("analysis");


  refreshAnalysisSelectors();


  if ($("analysisExercise")) {

    $("analysisExercise").value = id;

  }


  applySelectedExercise();


  showToast(
    `${exercise.name} 분석 준비 완료`
  );
}


/* =========================================================
   EXERCISE SELECT
========================================================= */

function populateExerciseSelect(select) {

  if (!select) {
    return;
  }


  const exercises =
    window.EXERCISES || [];


  select.innerHTML =
    `
      <option value="">
        운동 선택
      </option>
    ` +
    exercises.map(exercise => `
      <option value="${exercise.id}">
        ${escapeHTML(exercise.name)}
      </option>
    `).join("");


  if (APP_STATE.selectedExerciseId) {

    select.value =
      APP_STATE.selectedExerciseId;

  }
}


/* =========================================================
   ANALYSIS TARGET MODE
========================================================= */

function ensureAnalysisTargetControls() {

  const targetInput =
    $("analysisTargetReps");


  if (!targetInput) {
    return;
  }


  const parent =
    targetInput.closest(".form-field");


  if (!parent) {
    return;
  }


  if ($("analysisTargetMode")) {
    return;
  }


  const wrapper =
    document.createElement("div");


  wrapper.className =
    "analysis-target-config";


  wrapper.innerHTML = `

    <label class="form-field">

      <span>
        분석 종료 방식
      </span>

      <select id="analysisTargetMode">

        <option value="free">
          자유 분석
        </option>

        <option value="reps" selected>
          반복 횟수
        </option>

        <option value="sets">
          세트 × 반복
        </option>

      </select>

    </label>


    <div
      class="form-row"
      id="analysisSetConfig"
      hidden
    >

      <label class="form-field">

        <span>
          목표 세트
        </span>

        <input
          id="analysisTargetSets"
          type="number"
          value="3"
          min="1"
          max="20"
        />

      </label>


      <label class="form-field">

        <span>
          세트당 반복
        </span>

        <input
          id="analysisSetReps"
          type="number"
          value="10"
          min="1"
          max="100"
        />

      </label>

    </div>

  `;


  parent.parentNode.insertBefore(
    wrapper,
    parent
  );


  const oldLabel =
    parent.querySelector("span");


  if (oldLabel) {

    oldLabel.textContent =
      "목표 반복 횟수";

  }


  $("analysisTargetMode")
    ?.addEventListener(
      "change",
      updateAnalysisTargetUI
    );


  $("analysisTargetSets")
    ?.addEventListener(
      "input",
      syncAnalysisTarget
    );


  $("analysisSetReps")
    ?.addEventListener(
      "input",
      syncAnalysisTarget
    );


  targetInput.addEventListener(
    "input",
    syncAnalysisTarget
  );


  updateAnalysisTargetUI();
}


/* =========================================================
   TARGET UI
========================================================= */

function updateAnalysisTargetUI() {

  const mode =
    $("analysisTargetMode")?.value ||
    "reps";


  APP_STATE.targetMode = mode;


  const normalRepField =
    $("analysisTargetReps")
      ?.closest(".form-field");


  const setConfig =
    $("analysisSetConfig");


  if (mode === "free") {

    if (normalRepField) {
      normalRepField.hidden = true;
    }

    if (setConfig) {
      setConfig.hidden = true;
    }

  }


  if (mode === "reps") {

    if (normalRepField) {
      normalRepField.hidden = false;
    }

    if (setConfig) {
      setConfig.hidden = true;
    }

  }


  if (mode === "sets") {

    if (normalRepField) {
      normalRepField.hidden = true;
    }

    if (setConfig) {
      setConfig.hidden = false;
    }

  }


  syncAnalysisTarget();
}


/* =========================================================
   TARGET SYNC
========================================================= */

function syncAnalysisTarget() {

  const mode =
    $("analysisTargetMode")?.value ||
    "reps";


  APP_STATE.targetMode = mode;


  if (mode === "free") {

    APP_STATE.targetReps = 0;

    APP_STATE.targetSets = 0;

    if ($("targetRepCount")) {

      $("targetRepCount").textContent =
        "∞";

    }

    return;
  }


  if (mode === "reps") {

    const reps =
      Math.max(
        1,
        Number(
          $("analysisTargetReps")?.value || 10
        )
      );


    APP_STATE.targetReps = reps;

    APP_STATE.targetSets = 1;


    if ($("targetRepCount")) {

      $("targetRepCount").textContent =
        reps;

    }

    return;
  }


  const sets =
    Math.max(
      1,
      Number(
        $("analysisTargetSets")?.value || 3
      )
    );


  const reps =
    Math.max(
      1,
      Number(
        $("analysisSetReps")?.value || 10
      )
    );


  APP_STATE.targetSets = sets;

  APP_STATE.targetReps = reps;


  if ($("targetRepCount")) {

    $("targetRepCount").textContent =
      `${sets}×${reps}`;

  }
}


/* =========================================================
   ANALYSIS SELECTORS
========================================================= */

function refreshAnalysisSelectors() {

  populateAthleteSelect(
    $("analysisAthlete"),
    APP_STATE.selectedAthleteId
  );


  populateExerciseSelect(
    $("analysisExercise")
  );


  ensureAnalysisTargetControls();


  if (
    APP_STATE.selectedExerciseId &&
    $("analysisExercise")
  ) {

    $("analysisExercise").value =
      APP_STATE.selectedExerciseId;

    applySelectedExercise();

  }
}


/* =========================================================
   SELECTED EXERCISE PROFILE
========================================================= */

function applySelectedExercise() {

  const id =
    $("analysisExercise")?.value;


  if (!id) {
    return;
  }


  APP_STATE.selectedExerciseId = id;


  const exercise =
    window.getExerciseById?.(id);


  if (!exercise) {
    return;
  }


  if ($("motionAnalysisTitle")) {

    $("motionAnalysisTitle").textContent =
      `${exercise.name} 자세 분석`;

  }


  const recommendedView =
    exercise.recommendedView || "side";


  APP_STATE.cameraView =
    recommendedView;


  queryAll(".view-button")
    .forEach(button => {

      button.classList.toggle(
        "active",
        button.dataset.view ===
          recommendedView
      );

    });


  renderExerciseCheckpoints(exercise);


  showToast(
    `추천 촬영 방향: ${getViewLabel(recommendedView)}`
  );
}


/* =========================================================
   VIEW LABEL
========================================================= */

function getViewLabel(view) {

  const labels = {
    front: "정면",
    side: "측면",
    rear: "후면",
    top: "상단"
  };


  return labels[view] || view;
}


/* =========================================================
   CHECKPOINTS
========================================================= */

function renderExerciseCheckpoints(exercise) {

  const container =
    $("checkpointList");


  if (!container) {
    return;
  }


  const points =
    exercise.checkpoints || [];


  if (!points.length) {

    container.innerHTML = `
      <div class="checkpoint-row">
        <span>분석 기준 없음</span>
        <strong>-</strong>
      </div>
    `;

    return;
  }


  container.innerHTML =
    points.map((point, index) => `

      <div class="checkpoint-row">

        <span>
          ${escapeHTML(point)}
        </span>

        <strong id="checkpoint-${index}">
          READY
        </strong>

      </div>

    `).join("");
}


/* =========================================================
   CAMERA
========================================================= */

async function connectCamera() {

  try {

    stopCamera();


    const constraints = {

      audio: false,

      video: {

        facingMode:
          APP_STATE.cameraFacingMode,

        width: {
          ideal: 1920
        },

        height: {
          ideal: 1080
        }

      }

    };


    const stream =
      await navigator.mediaDevices
        .getUserMedia(constraints);


    APP_STATE.cameraStream =
      stream;


    APP_STATE.sourceType =
      "camera";


    const video =
      $("cameraVideo");


    if (video) {

      video.hidden = false;

      video.srcObject = stream;

      await video.play();

    }


    if ($("uploadedVideo")) {

      $("uploadedVideo").hidden = true;

    }


    if ($("uploadedImage")) {

      $("uploadedImage").hidden = true;

    }


    hideViewerPlaceholder();


    showToast("카메라 연결 완료");


    if (
      typeof window.initializePoseEngine ===
      "function"
    ) {

      window.initializePoseEngine();

    }


  } catch (error) {

    console.error(error);

    showToast(
      "카메라 연결에 실패했습니다. 브라우저 권한을 확인하세요."
    );
  }
}


/* =========================================================
   STOP CAMERA
========================================================= */

function stopCamera() {

  if (APP_STATE.cameraStream) {

    APP_STATE.cameraStream
      .getTracks()
      .forEach(track => track.stop());

  }


  APP_STATE.cameraStream = null;


  const video =
    $("cameraVideo");


  if (video) {

    video.srcObject = null;

  }
}


/* =========================================================
   SWITCH CAMERA
========================================================= */

async function switchCamera() {

  APP_STATE.cameraFacingMode =
    APP_STATE.cameraFacingMode ===
    "environment"
      ? "user"
      : "environment";


  await connectCamera();
}


/* =========================================================
   VIDEO UPLOAD
========================================================= */

function handleVideoUpload(event) {

  const file =
    event.target.files?.[0];


  if (!file) {
    return;
  }


  stopCamera();


  APP_STATE.sourceType =
    "video";


  const url =
    URL.createObjectURL(file);


  const video =
    $("uploadedVideo");


  if (!video) {
    return;
  }


  video.src = url;

  video.hidden = false;


  $("cameraVideo").hidden = true;

  $("uploadedImage").hidden = true;


  hideViewerPlaceholder();


  video.playbackRate =
    Number(
      $("playbackSpeed")?.value || 1
    );


  showToast("분석 영상 업로드 완료");
}


/* =========================================================
   IMAGE UPLOAD
========================================================= */

function handleImageUpload(event) {

  const file =
    event.target.files?.[0];


  if (!file) {
    return;
  }


  stopCamera();


  APP_STATE.sourceType =
    "image";


  const url =
    URL.createObjectURL(file);


  const image =
    $("uploadedImage");


  if (!image) {
    return;
  }


  image.src = url;

  image.hidden = false;


  $("cameraVideo").hidden = true;

  $("uploadedVideo").hidden = true;


  hideViewerPlaceholder();


  showToast("분석 사진 업로드 완료");
}


/* =========================================================
   VIEWER PLACEHOLDER
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
   PLAYBACK
========================================================= */

function getActiveVideo() {

  if (
    APP_STATE.sourceType === "video"
  ) {

    return $("uploadedVideo");

  }


  if (
    APP_STATE.sourceType === "camera"
  ) {

    return $("cameraVideo");

  }


  return null;
}


function togglePlayPause() {

  const video =
    getActiveVideo();


  if (
    !video ||
    APP_STATE.sourceType !== "video"
  ) {

    return;
  }


  if (video.paused) {

    video.play();

  } else {

    video.pause();

  }
}


function moveFrame(direction) {

  const video =
    $("uploadedVideo");


  if (
    !video ||
    APP_STATE.sourceType !== "video"
  ) {

    return;
  }


  video.pause();


  const fps = 30;

  const frameDuration =
    1 / fps;


  video.currentTime =
    clamp(
      video.currentTime +
        frameDuration * direction,
      0,
      video.duration || Infinity
    );
}


function changePlaybackSpeed() {

  const video =
    $("uploadedVideo");


  if (!video) {
    return;
  }


  video.playbackRate =
    Number(
      $("playbackSpeed")?.value || 1
    );
}


/* =========================================================
   DISPLAY TOGGLES
========================================================= */

function toggleSkeleton() {

  APP_STATE.skeletonVisible =
    !APP_STATE.skeletonVisible;


  const canvas =
    $("poseCanvas");


  if (canvas) {

    canvas.style.display =
      APP_STATE.skeletonVisible
        ? ""
        : "none";

  }


  if ($("settingSkeleton")) {

    $("settingSkeleton").checked =
      APP_STATE.skeletonVisible;

  }
}


function toggleReference() {

  APP_STATE.referenceVisible =
    !APP_STATE.referenceVisible;


  [
    $("referenceVertical"),
    $("referenceHorizontal")
  ].forEach(element => {

    if (element) {

      element.style.display =
        APP_STATE.referenceVisible
          ? ""
          : "none";

    }

  });


  if ($("settingReference")) {

    $("settingReference").checked =
      APP_STATE.referenceVisible;

  }
}


function toggleBarPath() {

  APP_STATE.barPathVisible =
    !APP_STATE.barPathVisible;


  const canvas =
    $("barPathCanvas");


  if (canvas) {

    canvas.style.display =
      APP_STATE.barPathVisible
        ? ""
        : "none";

  }


  if ($("settingBarPath")) {

    $("settingBarPath").checked =
      APP_STATE.barPathVisible;

  }
}


/* =========================================================
   ANALYSIS
========================================================= */

function startAnalysis() {

  if (APP_STATE.analysisRunning) {

    showToast("이미 분석 중입니다.");

    return;
  }


  const athleteId =
    $("analysisAthlete")?.value;


  const exerciseId =
    $("analysisExercise")?.value;


  if (!athleteId) {

    showToast("측정 선수를 선택하세요.");

    return;
  }


  if (!exerciseId) {

    showToast("분석 운동을 선택하세요.");

    return;
  }


  if (!APP_STATE.sourceType) {

    showToast(
      "카메라를 연결하거나 영상을 업로드하세요."
    );

    return;
  }


  APP_STATE.selectedAthleteId =
    athleteId;


  APP_STATE.selectedExerciseId =
    exerciseId;


  APP_STATE.currentRepCount = 0;

  APP_STATE.completedSets = 0;

  APP_STATE.analysisRunning = true;

  APP_STATE.analysisStartedAt =
    Date.now();


  syncAnalysisTarget();


  if ($("currentRepCount")) {

    $("currentRepCount").textContent =
      "0";

  }


  if ($("analysisTimer")) {

    $("analysisTimer").textContent =
      "00:00";

  }


  const badge =
    $("liveStatusBadge");


  if (badge) {

    badge.textContent =
      "● ANALYZING";

    badge.classList.remove(
      "standby"
    );

  }


  if ($("analysisEngineStatus")) {

    $("analysisEngineStatus").textContent =
      "ANALYSIS RUNNING";

  }


  clearInterval(
    APP_STATE.analysisTimerInterval
  );


  APP_STATE.analysisTimerInterval =
    setInterval(() => {

      if (!APP_STATE.analysisRunning) {
        return;
      }


      const seconds =
        (
          Date.now() -
          APP_STATE.analysisStartedAt
        ) / 1000;


      if ($("analysisTimer")) {

        $("analysisTimer").textContent =
          formatDuration(seconds);

      }

    }, 250);


  if (
    typeof window.startPoseAnalysis ===
    "function"
  ) {

    window.startPoseAnalysis({
      athleteId,
      exerciseId,
      targetMode:
        APP_STATE.targetMode,
      targetSets:
        APP_STATE.targetSets,
      targetReps:
        APP_STATE.targetReps
    });

  }


  showToast("자세 분석을 시작합니다.");
}


/* =========================================================
   REP UPDATE

   analysis engine에서 호출 가능
========================================================= */

function registerRep(repData = {}) {

  if (!APP_STATE.analysisRunning) {
    return;
  }


  APP_STATE.currentRepCount += 1;


  if ($("currentRepCount")) {

    $("currentRepCount").textContent =
      APP_STATE.currentRepCount;

  }


  if (
    typeof repData.score ===
    "number" &&
    $("currentPoseScore")
  ) {

    $("currentPoseScore").textContent =
      Math.round(repData.score);

  }


  if (
    typeof repData.tempo ===
    "number" &&
    $("analysisTempo")
  ) {

    $("analysisTempo").textContent =
      `${repData.tempo.toFixed(2)}s`;

  }


  checkAutomaticAnalysisFinish();
}


/* =========================================================
   AUTO FINISH
========================================================= */

function checkAutomaticAnalysisFinish() {

  if (
    APP_STATE.targetMode === "free"
  ) {

    return;
  }


  if (
    APP_STATE.targetMode === "reps"
  ) {

    if (
      APP_STATE.currentRepCount >=
      APP_STATE.targetReps
    ) {

      finishAnalysis({
        auto: true
      });

    }

    return;
  }


  if (
    APP_STATE.targetMode === "sets"
  ) {

    const totalTarget =
      APP_STATE.targetSets *
      APP_STATE.targetReps;


    if (
      APP_STATE.currentRepCount >=
      totalTarget
    ) {

      finishAnalysis({
        auto: true
      });

    }

  }
}


/* =========================================================
   FINISH ANALYSIS
========================================================= */

function finishAnalysis(options = {}) {

  if (!APP_STATE.analysisRunning) {

    showToast("현재 진행 중인 분석이 없습니다.");

    return;
  }


  APP_STATE.analysisRunning = false;


  clearInterval(
    APP_STATE.analysisTimerInterval
  );


  APP_STATE.analysisTimerInterval =
    null;


  if (
    typeof window.stopPoseAnalysis ===
    "function"
  ) {

    window.stopPoseAnalysis();

  }


  const elapsedSeconds =
    APP_STATE.analysisStartedAt
      ? (
          Date.now() -
          APP_STATE.analysisStartedAt
        ) / 1000
      : 0;


  const engineResult =
    typeof window.getCurrentAnalysisResult ===
    "function"
      ? window.getCurrentAnalysisResult()
      : {};


  const record =
    createAnalysisRecord(
      engineResult,
      elapsedSeconds
    );


  saveAnalysisRecord(record);


  updateAnalysisUIAfterFinish(record);


  const exercise =
    window.getExerciseById?.(
      record.exerciseId
    );


  showTrainingRecommendations(
    record
  );


  if (options.auto) {

    showToast(
      `${exercise?.name || "운동"} 목표 완료`
    );

  } else {

    showToast(
      `분석 종료 · ${record.reps}회 저장`
    );

  }


  setTimeout(() => {

    const goReport =
      confirm(
        "분석이 저장되었습니다.\n바로 선수 리포트로 이동할까요?"
      );


    if (goReport) {

      APP_STATE.selectedAthleteId =
        record.athleteId;


      openPage("report");


      if ($("reportAthlete")) {

        $("reportAthlete").value =
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

  }, 150);
}


/* =========================================================
   ANALYSIS RECORD CREATOR
========================================================= */

function createAnalysisRecord(
  engineResult = {},
  elapsedSeconds = 0
) {

  const score =
    clamp(
      Number(
        engineResult.score ??
        engineResult.technique ??
        80
      ),
      0,
      100
    );


  return {

    id:
      generateId("analysis"),

    createdAt:
      new Date().toISOString(),

    athleteId:
      APP_STATE.selectedAthleteId,

    exerciseId:
      APP_STATE.selectedExerciseId,

    reps:
      Number(
        engineResult.reps ??
        APP_STATE.currentRepCount
      ),

    duration:
      Math.round(elapsedSeconds),

    score:
      Math.round(score),

    strength:
      Math.round(
        clamp(
          Number(
            engineResult.strength ??
            score
          ),
          0,
          100
        )
      ),

    power:
      Math.round(
        clamp(
          Number(
            engineResult.power ??
            score
          ),
          0,
          100
        )
      ),

    stability:
      Math.round(
        clamp(
          Number(
            engineResult.stability ??
            score
          ),
          0,
          100
        )
      ),

    symmetry:
      Math.round(
        clamp(
          Number(
            engineResult.symmetry ??
            score
          ),
          0,
          100
        )
      ),

    mobility:
      Math.round(
        clamp(
          Number(
            engineResult.mobility ??
            score
          ),
          0,
          100
        )
      ),

    technique:
      Math.round(
        clamp(
          Number(
            engineResult.technique ??
            score
          ),
          0,
          100
        )
      ),

    rom:
      Math.round(
        clamp(
          Number(
            engineResult.rom ??
            80
          ),
          0,
          100
        )
      ),

    kneeAngle:
      engineResult.kneeAngle ?? null,

    hipAngle:
      engineResult.hipAngle ?? null,

    trunkAngle:
      engineResult.trunkAngle ?? null,

    ankleAngle:
      engineResult.ankleAngle ?? null,

    targetMode:
      APP_STATE.targetMode,

    targetSets:
      APP_STATE.targetSets,

    targetReps:
      APP_STATE.targetReps,

    cameraView:
      APP_STATE.cameraView,

    analysisMode:
      APP_STATE.analysisMode

  };
}


/* =========================================================
   SAVE ANALYSIS
========================================================= */

function getAnalysisRecords() {

  return loadJSON(
    STORAGE_KEYS.analyses,
    []
  );
}


function saveAnalysisRecord(record) {

  const records =
    getAnalysisRecords();


  records.unshift(record);


  saveJSON(
    STORAGE_KEYS.analyses,
    records
  );


  refreshDashboard();

  renderRecords();
}


/* =========================================================
   ANALYSIS FINISH UI
========================================================= */

function updateAnalysisUIAfterFinish(record) {

  const badge =
    $("liveStatusBadge");


  if (badge) {

    badge.textContent =
      "● COMPLETE";

    badge.classList.add(
      "standby"
    );

  }


  if ($("analysisEngineStatus")) {

    $("analysisEngineStatus").textContent =
      "ANALYSIS COMPLETE";

  }


  if ($("currentPoseScore")) {

    $("currentPoseScore").textContent =
      record.score;

  }


  if ($("liveSymmetry")) {

    $("liveSymmetry").textContent =
      record.symmetry;

  }


  if ($("liveROM")) {

    $("liveROM").textContent =
      record.rom;

  }


  if ($("liveStability")) {

    $("liveStability").textContent =
      record.stability;

  }


  if ($("liveTechnique")) {

    $("liveTechnique").textContent =
      record.technique;

  }
}


/* =========================================================
   TRAINING RECOMMENDATIONS
========================================================= */

function showTrainingRecommendations(
  record
) {

  const container =
    $("trainingRecommendations");


  if (!container) {
    return;
  }


  const recommendations =
    window.getExerciseRecommendations
      ? window.getExerciseRecommendations(
          record.exerciseId,
          record
        )
      : [];


  if (!recommendations.length) {

    container.innerHTML = `
      <div class="empty-state">
        현재 추가 권장사항이 없습니다.
      </div>
    `;

    return;
  }


  container.innerHTML =
    recommendations.map(item => `

      <article class="recommendation-card">

        <strong>
          ${escapeHTML(item.title)}
        </strong>

        <p>
          ${escapeHTML(item.description)}
        </p>

      </article>

    `).join("");
}


/* =========================================================
   RECORDS
========================================================= */

function populateRecordAthleteFilter() {

  const select =
    $("recordAthleteFilter");


  if (!select) {
    return;
  }


  const current =
    select.value || "all";


  const athletes =
    getAthletes();


  select.innerHTML =
    `
      <option value="all">
        전체 선수
      </option>
    ` +
    athletes.map(athlete => `
      <option value="${athlete.id}">
        ${escapeHTML(athlete.name)}
      </option>
    `).join("");


  select.value =
    athletes.some(
      athlete => athlete.id === current
    )
      ? current
      : "all";
}


function populateRecordExerciseFilter() {

  const select =
    $("recordExerciseFilter");


  if (!select) {
    return;
  }


  const current =
    select.value || "all";


  select.innerHTML =
    `
      <option value="all">
        전체 운동
      </option>
    ` +
    (window.EXERCISES || [])
      .map(exercise => `
        <option value="${exercise.id}">
          ${escapeHTML(exercise.name)}
        </option>
      `)
      .join("");


  select.value =
    current;
}


function renderRecords() {

  const tbody =
    $("recordsTableBody");


  if (!tbody) {
    return;
  }


  populateRecordAthleteFilter();

  populateRecordExerciseFilter();


  const athleteFilter =
    $("recordAthleteFilter")?.value ||
    "all";


  const exerciseFilter =
    $("recordExerciseFilter")?.value ||
    "all";


  const keyword =
    $("recordSearch")
      ?.value
      .trim()
      .toLowerCase() || "";


  const records =
    getAnalysisRecords()
      .filter(record => {

        if (
          athleteFilter !== "all" &&
          record.athleteId !== athleteFilter
        ) {

          return false;

        }


        if (
          exerciseFilter !== "all" &&
          record.exerciseId !== exerciseFilter
        ) {

          return false;

        }


        const athlete =
          getAthleteById(
            record.athleteId
          );


        const exercise =
          window.getExerciseById?.(
            record.exerciseId
          );


        const searchText =
          [
            athlete?.name,
            exercise?.name
          ]
            .join(" ")
            .toLowerCase();


        return searchText.includes(
          keyword
        );

      });


  if (!records.length) {

    tbody.innerHTML = `
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


  tbody.innerHTML =
    records.map(record => {

      const athlete =
        getAthleteById(
          record.athleteId
        );


      const exercise =
        window.getExerciseById?.(
          record.exerciseId
        );


      return `
        <tr>

          <td>
            ${formatDateTime(record.createdAt)}
          </td>

          <td>
            ${escapeHTML(athlete?.name || "-")}
          </td>

          <td>
            ${escapeHTML(exercise?.name || "-")}
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
              type="button"
              data-record-open="${record.id}"
            >
              보기
            </button>

          </td>

        </tr>
      `;

    }).join("");
}


/* =========================================================
   RECORD DETAIL
========================================================= */

function openRecordDetail(id) {

  const record =
    getAnalysisRecords().find(
      item => item.id === id
    );


  if (!record) {
    return;
  }


  const athlete =
    getAthleteById(
      record.athleteId
    );


  const exercise =
    window.getExerciseById?.(
      record.exerciseId
    );


  const container =
    $("recordDetailContent");


  if (!container) {
    return;
  }


  container.innerHTML = `

    <div class="report-info-grid">

      <div>
        <span>선수</span>
        <strong>
          ${escapeHTML(athlete?.name || "-")}
        </strong>
      </div>

      <div>
        <span>운동</span>
        <strong>
          ${escapeHTML(exercise?.name || "-")}
        </strong>
      </div>

      <div>
        <span>반복</span>
        <strong>${record.reps}</strong>
      </div>

      <div>
        <span>점수</span>
        <strong>${record.score}</strong>
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

    </div>

  `;


  $("recordModal")
    ?.classList.add("open");
}


/* =========================================================
   PROGRAM
========================================================= */

function refreshProgramSelectors() {

  populateAthleteSelect(
    $("programAthlete"),
    APP_STATE.selectedAthleteId
  );


  populateExerciseSelect(
    $("programExercise")
  );
}


function addProgramExercise() {

  const exerciseId =
    $("programExercise")?.value;


  if (!exerciseId) {

    showToast("운동을 선택하세요.");

    return;
  }


  const exercise =
    window.getExerciseById?.(
      exerciseId
    );


  if (!exercise) {
    return;
  }


  const item = {

    id:
      generateId("programExercise"),

    exerciseId,

    sets:
      Math.max(
        1,
        Number(
          $("programSets")?.value || 1
        )
      ),

    reps:
      Math.max(
        1,
        Number(
          $("programReps")?.value || 1
        )
      ),

    weight:
      Math.max(
        0,
        Number(
          $("programWeight")?.value || 0
        )
      ),

    rest:
      Math.max(
        0,
        Number(
          $("programRest")?.value || 0
        )
      )

  };


  APP_STATE.programExercises.push(
    item
  );


  renderProgramExercises();


  showToast(
    `${exercise.name} 추가 완료`
  );
}


/* =========================================================
   PROGRAM RENDER
========================================================= */

function renderProgramExercises() {

  const container =
    $("programExerciseList");


  if (!container) {
    return;
  }


  if (
    !APP_STATE.programExercises.length
  ) {

    container.innerHTML = `
      <div class="empty-state">
        추가된 운동이 없습니다.
      </div>
    `;

  } else {

    container.innerHTML =
      APP_STATE.programExercises
        .map((item, index) => {

          const exercise =
            window.getExerciseById?.(
              item.exerciseId
            );


          const volume =
            item.sets *
            item.reps *
            item.weight;


          return `

            <article class="program-exercise-card">

              <div class="program-order">
                ${index + 1}
              </div>

              <div>

                <strong>
                  ${exercise?.pictogram || "🏋"}
                  ${escapeHTML(exercise?.name || "-")}
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
                data-program-delete="${item.id}"
              >
                삭제
              </button>

            </article>

          `;

        }).join("");

  }


  updateProgramSummary();
}


/* =========================================================
   PROGRAM SUMMARY
========================================================= */

function updateProgramSummary() {

  const items =
    APP_STATE.programExercises;


  const totalSets =
    items.reduce(
      (sum, item) =>
        sum + item.sets,
      0
    );


  const totalVolume =
    items.reduce(
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

    $("programExerciseCount").textContent =
      items.length;

  }


  if ($("programTotalSets")) {

    $("programTotalSets").textContent =
      totalSets;

  }


  if ($("programTotalVolume")) {

    $("programTotalVolume").textContent =
      `${totalVolume.toLocaleString()} kg`;

  }
}


/* =========================================================
   DELETE PROGRAM ITEM
========================================================= */

function deleteProgramExercise(id) {

  APP_STATE.programExercises =
    APP_STATE.programExercises.filter(
      item => item.id !== id
    );


  renderProgramExercises();
}


/* =========================================================
   SAVE PROGRAM
========================================================= */

function saveProgram() {

  const athleteId =
    $("programAthlete")?.value;


  const name =
    $("programName")?.value.trim();


  if (!athleteId) {

    showToast("선수를 선택하세요.");

    return;
  }


  if (!name) {

    showToast("프로그램 이름을 입력하세요.");

    return;
  }


  if (
    !APP_STATE.programExercises.length
  ) {

    showToast(
      "프로그램에 운동을 추가하세요."
    );

    return;
  }


  const programs =
    loadJSON(
      STORAGE_KEYS.programs,
      []
    );


  programs.unshift({

    id:
      generateId("program"),

    athleteId,

    name,

    createdAt:
      new Date().toISOString(),

    exercises:
      APP_STATE.programExercises
        .map(item => ({
          ...item
        }))

  });


  saveJSON(
    STORAGE_KEYS.programs,
    programs
  );


  APP_STATE.programExercises = [];


  if ($("programName")) {

    $("programName").value = "";

  }


  renderProgramExercises();


  showToast("훈련 프로그램 저장 완료");
}


/* =========================================================
   DASHBOARD
========================================================= */

function refreshDashboard() {

  const athletes =
    getAthletes();


  const records =
    getAnalysisRecords();


  if ($("dashboardAthleteCount")) {

    $("dashboardAthleteCount").textContent =
      athletes.length;

  }


  if ($("dashboardAnalysisCount")) {

    $("dashboardAnalysisCount").textContent =
      records.length;

  }


  const averageScore =
    records.length
      ? Math.round(
          records.reduce(
            (sum, record) =>
              sum + Number(record.score || 0),
            0
          ) / records.length
        )
      : null;


  if ($("dashboardAverageScore")) {

    $("dashboardAverageScore").textContent =
      averageScore ?? "--";

  }


  if ($("dashboardPRCount")) {

    $("dashboardPRCount").textContent =
      calculatePRCount(records);

  }


  let athlete =
    getAthleteById(
      APP_STATE.selectedAthleteId
    );


  if (!athlete && athletes.length) {

    athlete = athletes[0];

    APP_STATE.selectedAthleteId =
      athlete.id;

  }


  renderDashboardAthlete(
    athlete,
    records
  );


  renderDashboardRecent(records);

  renderDashboardPR(records);


  if (
    typeof window.updateDashboardCharts ===
    "function"
  ) {

    window.updateDashboardCharts(
      athlete,
      records
    );

  }
}


/* =========================================================
   DASHBOARD ATHLETE
========================================================= */

function renderDashboardAthlete(
  athlete,
  records
) {

  if (!athlete) {

    $("dashboardAthleteName").textContent =
      "선수 미선택";

    $("dashboardAthleteSport").textContent =
      "-";

    $("dashboardHeight").textContent =
      "-";

    $("dashboardWeight").textContent =
      "-";

    $("dashboardLatestScore").textContent =
      "-";

    return;
  }


  const athleteRecords =
    records.filter(
      record =>
        record.athleteId === athlete.id
    );


  const latest =
    athleteRecords[0];


  $("dashboardAthleteName").textContent =
    athlete.name;


  $("dashboardAthleteSport").textContent =
    athlete.sport || "-";


  $("dashboardHeight").textContent =
    athlete.height
      ? `${athlete.height} cm`
      : "-";


  $("dashboardWeight").textContent =
    athlete.weight
      ? `${athlete.weight} kg`
      : "-";


  $("dashboardLatestScore").textContent =
    latest
      ? latest.score
      : "-";


  const metrics =
    latest || {};


  setText(
    "radarStrength",
    metrics.strength || 0
  );

  setText(
    "radarPower",
    metrics.power || 0
  );

  setText(
    "radarStability",
    metrics.stability || 0
  );

  setText(
    "radarSymmetry",
    metrics.symmetry || 0
  );

  setText(
    "radarMobility",
    metrics.mobility || 0
  );

  setText(
    "radarTechnique",
    metrics.technique || 0
  );
}


/* =========================================================
   DASHBOARD RECENT
========================================================= */

function renderDashboardRecent(records) {

  const container =
    $("dashboardRecentList");


  if (!container) {
    return;
  }


  const recent =
    records.slice(0, 5);


  if (!recent.length) {

    container.innerHTML = `
      <div class="empty-state">
        아직 분석 기록이 없습니다.
      </div>
    `;

    return;
  }


  container.innerHTML =
    recent.map(record => {

      const athlete =
        getAthleteById(
          record.athleteId
        );


      const exercise =
        window.getExerciseById?.(
          record.exerciseId
        );


      return `

        <div class="recent-item">

          <div>

            <strong>
              ${escapeHTML(exercise?.name || "-")}
            </strong>

            <span>
              ${escapeHTML(athlete?.name || "-")}
            </span>

          </div>

          <strong>
            ${record.score}
          </strong>

        </div>

      `;

    }).join("");
}


/* =========================================================
   PR
========================================================= */

function calculatePRCount(records) {

  const best = new Map();


  records.forEach(record => {

    const key =
      `${record.athleteId}_${record.exerciseId}`;


    const previous =
      best.get(key);


    if (
      !previous ||
      record.score > previous
    ) {

      best.set(
        key,
        record.score
      );

    }

  });


  return best.size;
}


function renderDashboardPR(records) {

  const container =
    $("dashboardPRList");


  if (!container) {
    return;
  }


  const sorted =
    [...records]
      .sort(
        (a, b) =>
          b.score - a.score
      )
      .slice(0, 5);


  if (!sorted.length) {

    container.innerHTML = `
      <div class="empty-state">
        기록된 PR이 없습니다.
      </div>
    `;

    return;
  }


  container.innerHTML =
    sorted.map(record => {

      const exercise =
        window.getExerciseById?.(
          record.exerciseId
        );


      return `

        <div class="recent-item">

          <span>
            ${escapeHTML(exercise?.name || "-")}
          </span>

          <strong>
            ${record.score}
          </strong>

        </div>

      `;

    }).join("");
}


/* =========================================================
   REPORT
========================================================= */

function refreshReportAthletes() {

  populateAthleteSelect(
    $("reportAthlete"),
    APP_STATE.selectedAthleteId
  );
}


/* =========================================================
   CSV
========================================================= */

function exportCSV() {

  const records =
    getAnalysisRecords();


  if (!records.length) {

    showToast("저장할 기록이 없습니다.");

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
      "ROM",
      "안정성",
      "기술"
    ],

    ...records.map(record => {

      const athlete =
        getAthleteById(
          record.athleteId
        );


      const exercise =
        window.getExerciseById?.(
          record.exerciseId
        );


      return [

        record.createdAt,

        athlete?.name || "",

        exercise?.name || "",

        record.reps,

        record.score,

        record.symmetry,

        record.rom,

        record.stability,

        record.technique

      ];

    })

  ];


  const csv =
    "\uFEFF" +
    rows
      .map(row =>
        row.map(value =>
          `"${String(value)
            .replaceAll('"', '""')}"`
        ).join(",")
      )
      .join("\n");


  const blob =
    new Blob(
      [csv],
      {
        type:
          "text/csv;charset=utf-8;"
      }
    );


  const url =
    URL.createObjectURL(blob);


  const anchor =
    document.createElement("a");


  anchor.href = url;

  anchor.download =
    `weight-analysis-${Date.now()}.csv`;


  anchor.click();


  URL.revokeObjectURL(url);
}


/* =========================================================
   BACKUP
========================================================= */

function backupData() {

  const backup = {

    version: "2.0",

    exportedAt:
      new Date().toISOString(),

    athletes:
      getAthletes(),

    analyses:
      getAnalysisRecords(),

    programs:
      loadJSON(
        STORAGE_KEYS.programs,
        []
      ),

    settings:
      loadJSON(
        STORAGE_KEYS.settings,
        {}
      )

  };


  const blob =
    new Blob(
      [
        JSON.stringify(
          backup,
          null,
          2
        )
      ],
      {
        type: "application/json"
      }
    );


  const url =
    URL.createObjectURL(blob);


  const anchor =
    document.createElement("a");


  anchor.href = url;

  anchor.download =
    `weight-lab-backup-${Date.now()}.json`;


  anchor.click();


  URL.revokeObjectURL(url);


  showToast("데이터 백업 완료");
}


/* =========================================================
   RESTORE
========================================================= */

function restoreData(event) {

  const file =
    event.target.files?.[0];


  if (!file) {
    return;
  }


  const reader =
    new FileReader();


  reader.onload = () => {

    try {

      const data =
        JSON.parse(reader.result);


      if (
        Array.isArray(data.athletes)
      ) {

        saveJSON(
          STORAGE_KEYS.athletes,
          data.athletes
        );

      }


      if (
        Array.isArray(data.analyses)
      ) {

        saveJSON(
          STORAGE_KEYS.analyses,
          data.analyses
        );

      }


      if (
        Array.isArray(data.programs)
      ) {

        saveJSON(
          STORAGE_KEYS.programs,
          data.programs
        );

      }


      if (data.settings) {

        saveJSON(
          STORAGE_KEYS.settings,
          data.settings
        );

      }


      refreshAll();


      showToast("데이터 복원 완료");


    } catch (error) {

      console.error(error);

      showToast(
        "올바른 백업 파일이 아닙니다."
      );

    }

  };


  reader.readAsText(file);
}


/* =========================================================
   CLEAR
========================================================= */

function clearAllData() {

  const confirmed =
    confirm(
      "선수, 분석 기록, 프로그램을 모두 삭제할까요?"
    );


  if (!confirmed) {
    return;
  }


  Object.values(STORAGE_KEYS)
    .forEach(key => {

      localStorage.removeItem(key);

    });


  APP_STATE.selectedAthleteId = null;

  APP_STATE.selectedExerciseId = null;

  APP_STATE.programExercises = [];


  refreshAll();


  showToast("모든 데이터가 초기화되었습니다.");
}


/* =========================================================
   SET TEXT
========================================================= */

function setText(id, value) {

  const element = $(id);

  if (element) {

    element.textContent = value;

  }
}


/* =========================================================
   REFRESH ALL
========================================================= */

function refreshAll() {

  refreshAllAthleteSelectors();

  renderAthletes();

  renderExercises();

  renderRecords();

  renderProgramExercises();

  refreshDashboard();
}


/* =========================================================
   GLOBAL CLICK HANDLER
========================================================= */

document.addEventListener(
  "click",
  event => {

    const nav =
      event.target.closest(
        "[data-page]"
      );


    if (nav) {

      openPage(
        nav.dataset.page
      );

      return;
    }


    const pageTarget =
      event.target.closest(
        "[data-page-target]"
      );


    if (pageTarget) {

      openPage(
        pageTarget.dataset.pageTarget
      );

      return;
    }


    const detail =
      event.target.closest(
        "[data-exercise-detail]"
      );


    if (detail) {

      openExerciseModal(
        detail.dataset.exerciseDetail
      );

      return;
    }


    const analyze =
      event.target.closest(
        "[data-exercise-analyze]"
      );


    if (analyze) {

      analyzeExercise(
        analyze.dataset.exerciseAnalyze
      );

      return;
    }


    const athleteSelect =
      event.target.closest(
        "[data-athlete-select]"
      );


    if (athleteSelect) {

      selectAthlete(
        athleteSelect.dataset.athleteSelect
      );

      return;
    }


    const athleteAnalyze =
      event.target.closest(
        "[data-athlete-analyze]"
      );


    if (athleteAnalyze) {

      selectAthlete(
        athleteAnalyze.dataset.athleteAnalyze
      );

      openPage("analysis");

      return;
    }


    const athleteDelete =
      event.target.closest(
        "[data-athlete-delete]"
      );


    if (athleteDelete) {

      deleteAthlete(
        athleteDelete.dataset.athleteDelete
      );

      return;
    }


    const programDelete =
      event.target.closest(
        "[data-program-delete]"
      );


    if (programDelete) {

      deleteProgramExercise(
        programDelete.dataset.programDelete
      );

      return;
    }


    const recordOpen =
      event.target.closest(
        "[data-record-open]"
      );


    if (recordOpen) {

      openRecordDetail(
        recordOpen.dataset.recordOpen
      );

    }

  }
);


/* =========================================================
   INITIAL EVENT LISTENERS
========================================================= */

function bindEvents() {

  /* MOBILE */

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


  /* ATHLETE */

  $("athleteForm")
    ?.addEventListener(
      "submit",
      createAthlete
    );


  $("athleteSearch")
    ?.addEventListener(
      "input",
      renderAthletes
    );


  /* EXERCISE */

  $("exerciseSearch")
    ?.addEventListener(
      "input",
      renderExercises
    );


  $("equipmentFilter")
    ?.addEventListener(
      "change",
      renderExercises
    );


  queryAll(".category-tab")
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          APP_STATE.currentCategory =
            button.dataset.category;


          queryAll(".category-tab")
            .forEach(item => {

              item.classList.remove(
                "active"
              );

            });


          button.classList.add(
            "active"
          );


          renderExercises();

        }
      );

    });


  $("closeExerciseModal")
    ?.addEventListener(
      "click",
      closeExerciseModal
    );


  $("analyzeSelectedExerciseBtn")
    ?.addEventListener(
      "click",
      () => {

        if (
          APP_STATE.selectedExerciseId
        ) {

          analyzeExercise(
            APP_STATE.selectedExerciseId
          );

        }

      }
    );


  /* ANALYSIS */

  $("analysisAthlete")
    ?.addEventListener(
      "change",
      event => {

        APP_STATE.selectedAthleteId =
          event.target.value || null;

      }
    );


  $("analysisExercise")
    ?.addEventListener(
      "change",
      applySelectedExercise
    );


  queryAll(".view-button")
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          APP_STATE.cameraView =
            button.dataset.view;


          queryAll(".view-button")
            .forEach(item => {

              item.classList.remove(
                "active"
              );

            });


          button.classList.add(
            "active"
          );

        }
      );

    });


  queryAll(".mode-button")
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          APP_STATE.analysisMode =
            button.dataset.analysisMode;


          queryAll(".mode-button")
            .forEach(item => {

              item.classList.remove(
                "active"
              );

            });


          button.classList.add(
            "active"
          );

        }
      );

    });


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


  $("analysisVideoUpload")
    ?.addEventListener(
      "change",
      handleVideoUpload
    );


  $("analysisImageUpload")
    ?.addEventListener(
      "change",
      handleImageUpload
    );


  $("startAnalysisBtn")
    ?.addEventListener(
      "click",
      startAnalysis
    );


  $("stopAnalysisBtn")
    ?.addEventListener(
      "click",
      () => {

        finishAnalysis({
          auto: false
        });

      }
    );


  $("playPauseBtn")
    ?.addEventListener(
      "click",
      togglePlayPause
    );


  $("frameBackBtn")
    ?.addEventListener(
      "click",
      () => moveFrame(-1)
    );


  $("frameForwardBtn")
    ?.addEventListener(
      "click",
      () => moveFrame(1)
    );


  $("playbackSpeed")
    ?.addEventListener(
      "change",
      changePlaybackSpeed
    );


  $("toggleSkeletonBtn")
    ?.addEventListener(
      "click",
      toggleSkeleton
    );


  $("toggleReferenceBtn")
    ?.addEventListener(
      "click",
      toggleReference
    );


  $("toggleBarPathBtn")
    ?.addEventListener(
      "click",
      toggleBarPath
    );


  /* RECORD */

  $("recordAthleteFilter")
    ?.addEventListener(
      "change",
      renderRecords
    );


  $("recordExerciseFilter")
    ?.addEventListener(
      "change",
      renderRecords
    );


  $("recordSearch")
    ?.addEventListener(
      "input",
      renderRecords
    );


  $("exportCSVBtn")
    ?.addEventListener(
      "click",
      exportCSV
    );


  $("closeRecordModal")
    ?.addEventListener(
      "click",
      () => {

        $("recordModal")
          ?.classList.remove("open");

      }
    );


  /* PROGRAM */

  $("addProgramExerciseBtn")
    ?.addEventListener(
      "click",
      addProgramExercise
    );


  $("saveProgramBtn")
    ?.addEventListener(
      "click",
      saveProgram
    );


  /* REPORT */

  $("generateReportBtn")
    ?.addEventListener(
      "click",
      () => {

        const athleteId =
          $("reportAthlete")?.value;


        if (!athleteId) {

          showToast(
            "선수를 선택하세요."
          );

          return;
        }


        APP_STATE.selectedAthleteId =
          athleteId;


        if (
          typeof window.generateAthleteReport ===
          "function"
        ) {

          window.generateAthleteReport(
            athleteId
          );

        } else {

          showToast(
            "리포트 엔진 연결 대기"
          );

        }

      }
    );


  $("printReportBtn")
    ?.addEventListener(
      "click",
      () => window.print()
    );


  /* SETTINGS */

  $("backupDataBtn")
    ?.addEventListener(
      "click",
      backupData
    );


  $("restoreDataInput")
    ?.addEventListener(
      "change",
      restoreData
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

        APP_STATE.skeletonVisible =
          event.target.checked;


        const canvas =
          $("poseCanvas");


        if (canvas) {

          canvas.style.display =
            APP_STATE.skeletonVisible
              ? ""
              : "none";

        }

      }
    );


  $("settingReference")
    ?.addEventListener(
      "change",
      event => {

        APP_STATE.referenceVisible =
          event.target.checked;


        [
          $("referenceVertical"),
          $("referenceHorizontal")
        ].forEach(element => {

          if (element) {

            element.style.display =
              APP_STATE.referenceVisible
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

        APP_STATE.barPathVisible =
          event.target.checked;


        if ($("barPathCanvas")) {

          $("barPathCanvas")
            .style.display =
            APP_STATE.barPathVisible
              ? ""
              : "none";

        }

      }
    );


  /* MODAL BACKGROUND */

  queryAll(".modal")
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
   EXPOSE TO ANALYSIS ENGINE
========================================================= */

window.registerRep =
  registerRep;


window.finishAnalysis =
  finishAnalysis;


window.getWeightLabState =
  () => APP_STATE;


window.getWeightLabAthletes =
  getAthletes;


window.getWeightLabAnalysisRecords =
  getAnalysisRecords;


window.openWeightLabPage =
  openPage;


/* =========================================================
   INITIALIZE
========================================================= */

function initializeApp() {

  console.log(
    "[WEIGHT LAB] Initializing..."
  );


  bindEvents();


  ensureAnalysisTargetControls();


  updateClock();

  setInterval(
    updateClock,
    1000
  );


  refreshAll();


  if (
    !APP_STATE.selectedAthleteId
  ) {

    const athletes =
      getAthletes();


    if (athletes.length) {

      APP_STATE.selectedAthleteId =
        athletes[0].id;

    }

  }


  refreshAllAthleteSelectors();

  refreshDashboard();


  console.log(
    "[WEIGHT LAB] Application Ready"
  );
}


/* =========================================================
   DOM READY
========================================================= */

if (
  document.readyState === "loading"
) {

  document.addEventListener(
    "DOMContentLoaded",
    initializeApp
  );

} else {

  initializeApp();

}