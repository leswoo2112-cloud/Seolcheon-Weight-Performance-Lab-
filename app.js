/* =========================================================
   설천고 WEIGHT PERFORMANCE LAB
   APP.JS
   PART 6 / 6

   MAIN APPLICATION ENGINE

   - Page Navigation
   - Mobile Sidebar
   - Clock
   - Athlete Management
   - Athlete Selection
   - Exercise Library
   - Exercise Search / Filter
   - Exercise Modal
   - Dashboard
   - Performance Radar
   - Performance Trend
   - Analysis Records
   - Record Modal
   - Training Program
   - CSV Export
   - Settings
   - Backup / Restore
   - LocalStorage
   - Cross-file integration
========================================================= */

"use strict";


/* =========================================================
   01. APPLICATION CONFIG
========================================================= */

const APP_CONFIG = {

  name:
    "설천고 WEIGHT PERFORMANCE LAB",

  version:
    "1.0.0",

  storage: {

    athletes:
      "weight_lab_athletes",

    analyses:
      "weight_lab_analyses",

    programs:
      "weight_lab_programs",

    settings:
      "weight_lab_settings",

    selectedAthlete:
      "weight_lab_selected_athlete"

  }

};


/* =========================================================
   02. APPLICATION STATE
========================================================= */

const APP_STATE = {

  athletes:
    [],

  analyses:
    [],

  programs:
    [],

  settings: {

    skeleton:
      true,

    angles:
      true,

    reference:
      true,

    barPath:
      true

  },

  selectedAthleteId:
    null,

  currentPage:
    "dashboard",

  exerciseCategory:
    "all",

  exerciseEquipment:
    "all",

  exerciseSearch:
    "",

  programExercises:
    [],

  performanceRadar:
    null,

  performanceTrend:
    null,

  selectedExercise:
    null

};


/* =========================================================
   03. DOM HELPERS
========================================================= */

const $ =
  selector =>
    document.querySelector(selector);


const $$ =
  selector =>
    [
      ...document.querySelectorAll(
        selector
      )
    ];


function getElement(
  id
) {

  return document.getElementById(id);

}


/* =========================================================
   04. GENERAL HELPERS
========================================================= */

function clamp(
  value,
  min = 0,
  max = 100
) {

  return Math.max(
    min,
    Math.min(
      max,
      Number(value) || 0
    )
  );

}


function average(
  values
) {

  const valid =
    values
      .map(Number)
      .filter(Number.isFinite);


  if (!valid.length) {
    return 0;
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


function uid(
  prefix = "id"
) {

  return (
    prefix +
    "_" +
    Date.now().toString(36) +
    "_" +
    Math.random()
      .toString(36)
      .slice(2, 8)
  );

}


function escapeHTML(
  value
) {

  return String(
    value ?? ""
  )
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

}


function safeJSONParse(
  value,
  fallback
) {

  try {

    return (
      JSON.parse(value) ??
      fallback
    );

  }

  catch (_) {

    return fallback;

  }

}


function formatDate(
  value
) {

  if (!value) {
    return "-";
  }


  const date =
    new Date(value);


  if (
    Number.isNaN(
      date.getTime()
    )
  ) {

    return "-";

  }


  return new Intl.DateTimeFormat(
    "ko-KR",
    {
      year:
        "numeric",

      month:
        "2-digit",

      day:
        "2-digit"
    }
  ).format(date);

}


function formatDateTime(
  value
) {

  if (!value) {
    return "-";
  }


  const date =
    new Date(value);


  if (
    Number.isNaN(
      date.getTime()
    )
  ) {

    return "-";

  }


  return new Intl.DateTimeFormat(
    "ko-KR",
    {
      year:
        "numeric",

      month:
        "2-digit",

      day:
        "2-digit",

      hour:
        "2-digit",

      minute:
        "2-digit"
    }
  ).format(date);

}


/* =========================================================
   05. TOAST
========================================================= */

let toastTimer = null;


function showToast(
  message
) {

  const toast =
    getElement("toast");


  if (!toast) {

    console.log(message);

    return;

  }


  toast.textContent =
    message;


  toast.classList.add(
    "show"
  );


  clearTimeout(
    toastTimer
  );


  toastTimer =
    setTimeout(
      () => {

        toast.classList.remove(
          "show"
        );

      },
      2500
    );

}


window.showToast =
  showToast;


/* =========================================================
   06. LOAD STORAGE
========================================================= */

function loadApplicationData() {

  APP_STATE.athletes =
    safeJSONParse(
      localStorage.getItem(
        APP_CONFIG.storage.athletes
      ),
      []
    );


  APP_STATE.analyses =
    safeJSONParse(
      localStorage.getItem(
        APP_CONFIG.storage.analyses
      ),
      []
    );


  APP_STATE.programs =
    safeJSONParse(
      localStorage.getItem(
        APP_CONFIG.storage.programs
      ),
      []
    );


  APP_STATE.settings = {

    ...APP_STATE.settings,

    ...safeJSONParse(
      localStorage.getItem(
        APP_CONFIG.storage.settings
      ),
      {}
    )

  };


  APP_STATE.selectedAthleteId =
    localStorage.getItem(
      APP_CONFIG.storage.selectedAthlete
    );


  if (
    !Array.isArray(
      APP_STATE.athletes
    )
  ) {

    APP_STATE.athletes =
      [];

  }


  if (
    !Array.isArray(
      APP_STATE.analyses
    )
  ) {

    APP_STATE.analyses =
      [];

  }


  if (
    !Array.isArray(
      APP_STATE.programs
    )
  ) {

    APP_STATE.programs =
      [];

  }

}


/* =========================================================
   07. SAVE STORAGE
========================================================= */

function saveAthletes() {

  localStorage.setItem(
    APP_CONFIG.storage.athletes,
    JSON.stringify(
      APP_STATE.athletes
    )
  );


  syncGlobals();


  window.dispatchEvent(
    new Event(
      "weight-athletes-updated"
    )
  );

}


function saveAnalyses() {

  localStorage.setItem(
    APP_CONFIG.storage.analyses,
    JSON.stringify(
      APP_STATE.analyses
    )
  );


  syncGlobals();

}


function savePrograms() {

  localStorage.setItem(
    APP_CONFIG.storage.programs,
    JSON.stringify(
      APP_STATE.programs
    )
  );

}


function saveSettings() {

  localStorage.setItem(
    APP_CONFIG.storage.settings,
    JSON.stringify(
      APP_STATE.settings
    )
  );

}


/* =========================================================
   08. GLOBAL DATA API
========================================================= */

function syncGlobals() {

  window.athletes =
    APP_STATE.athletes;

  window.analysisRecords =
    APP_STATE.analyses;

}


window.getAthletes =
  () =>
    APP_STATE.athletes;


window.getAnalysisRecords =
  () =>
    APP_STATE.analyses;


syncGlobals();


/* =========================================================
   09. CLOCK
========================================================= */

function updateHeaderClock() {

  const now =
    new Date();


  const dateElement =
    getElement(
      "headerDate"
    );


  const timeElement =
    getElement(
      "headerTime"
    );


  if (dateElement) {

    dateElement.textContent =
      new Intl.DateTimeFormat(
        "ko-KR",
        {
          year:
            "numeric",

          month:
            "2-digit",

          day:
            "2-digit"
        }
      ).format(now);

  }


  if (timeElement) {

    timeElement.textContent =
      now
        .toLocaleTimeString(
          "ko-KR",
          {
            hour:
              "2-digit",

            minute:
              "2-digit",

            second:
              "2-digit",

            hour12:
              false
          }
        );

  }

}


/* =========================================================
   10. PAGE NAVIGATION
========================================================= */

function navigateToPage(
  pageName
) {

  const page =
    getElement(
      `page-${pageName}`
    );


  if (!page) {

    console.warn(
      "Page not found:",
      pageName
    );

    return;

  }


  APP_STATE.currentPage =
    pageName;


  $$(".page")
    .forEach(
      element => {

        element.classList.remove(
          "active"
        );

      }
    );


  page.classList.add(
    "active"
  );


  $$(".nav-item")
    .forEach(
      button => {

        button.classList.toggle(
          "active",
          button.dataset.page ===
          pageName
        );

      }
    );


  const sidebar =
    getElement(
      "sidebar"
    );


  sidebar?.classList.remove(
    "open"
  );


  if (
    pageName ===
    "dashboard"
  ) {

    renderDashboard();

  }


  if (
    pageName ===
    "athletes"
  ) {

    renderAthletes();

  }


  if (
    pageName ===
    "exercises"
  ) {

    renderExercises();

  }


  if (
    pageName ===
    "records"
  ) {

    renderRecords();

  }


  if (
    pageName ===
    "program"
  ) {

    populateProgramSelectors();

  }


  if (
    pageName ===
    "report"
  ) {

    if (
      window.WeightReport
    ) {

      window.WeightReport
        .refreshAthletes();

    }

  }


  window.scrollTo({
    top:
      0,
    behavior:
      "smooth"
  });

}


window.navigateToPage =
  navigateToPage;


/* =========================================================
   11. NAVIGATION EVENTS
========================================================= */

function bindNavigation() {

  $$(".nav-item")
    .forEach(
      button => {

        button.addEventListener(
          "click",
          () => {

            navigateToPage(
              button.dataset.page
            );

          }
        );

      }
    );


  $$("[data-page-target]")
    .forEach(
      button => {

        button.addEventListener(
          "click",
          () => {

            navigateToPage(
              button.dataset.pageTarget
            );

          }
        );

      }
    );


  getElement(
    "mobileMenuBtn"
  )
    ?.addEventListener(
      "click",
      () => {

        getElement(
          "sidebar"
        )
          ?.classList.toggle(
            "open"
          );

      }
    );

}


/* =========================================================
   12. ATHLETE LOOKUP
========================================================= */

function getAthleteById(
  id
) {

  return (
    APP_STATE.athletes.find(
      athlete =>
        String(athlete.id) ===
        String(id)
    )
    ||
    null
  );

}


function getSelectedAthlete() {

  return getAthleteById(
    APP_STATE.selectedAthleteId
  );

}


/* =========================================================
   13. ATHLETE FORM
========================================================= */

function handleAthleteForm(
  event
) {

  event.preventDefault();


  const name =
    getElement(
      "athleteName"
    )?.value.trim();


  if (!name) {

    showToast(
      "선수 이름을 입력하세요."
    );

    return;

  }


  const athlete = {

    id:
      uid("athlete"),

    name,

    birth:
      getElement(
        "athleteBirth"
      )?.value || "",

    sport:
      getElement(
        "athleteSport"
      )?.value.trim() || "",

    height:
      Number(
        getElement(
          "athleteHeight"
        )?.value
      ) || "",

    weight:
      Number(
        getElement(
          "athleteWeight"
        )?.value
      ) || "",

    group:
      getElement(
        "athleteGroup"
      )?.value.trim() || "",

    memo:
      getElement(
        "athleteMemo"
      )?.value.trim() || "",

    createdAt:
      new Date()
        .toISOString()

  };


  APP_STATE.athletes.push(
    athlete
  );


  if (
    !APP_STATE.selectedAthleteId
  ) {

    selectAthlete(
      athlete.id
    );

  }


  saveAthletes();


  event.target.reset();


  renderAthletes();

  populateAllAthleteSelectors();

  renderDashboard();


  showToast(
    `${athlete.name} 선수가 등록되었습니다.`
  );

}


/* =========================================================
   14. RENDER ATHLETES
========================================================= */

function renderAthletes() {

  const list =
    getElement(
      "athleteList"
    );


  if (!list) {
    return;
  }


  const query =
    (
      getElement(
        "athleteSearch"
      )?.value ||
      ""
    )
      .trim()
      .toLowerCase();


  const athletes =
    APP_STATE.athletes
      .filter(
        athlete => {

          const searchText =
            [
              athlete.name,
              athlete.sport,
              athlete.group
            ]
              .join(" ")
              .toLowerCase();


          return (
            !query ||
            searchText.includes(
              query
            )
          );

        }
      );


  if (!athletes.length) {

    list.innerHTML =
      `
        <div class="empty-state">
          등록된 선수가 없습니다.
        </div>
      `;

    return;

  }


  list.innerHTML =
    athletes
      .map(
        athlete => {

          const selected =
            String(
              APP_STATE.selectedAthleteId
            ) ===
            String(
              athlete.id
            );


          return `

            <div
              class="athlete-list-item
              ${selected
                ? "selected"
                : ""}"
            >

              <button
                class="athlete-select-area"
                data-athlete-select="${escapeHTML(
                  athlete.id
                )}"
                type="button"
              >

                <div class="athlete-list-avatar">
                  👤
                </div>

                <div>

                  <strong>
                    ${escapeHTML(
                      athlete.name
                    )}
                  </strong>

                  <span>
                    ${escapeHTML(
                      athlete.sport ||
                      "종목 미등록"
                    )}
                  </span>

                  <small>

                    ${
                      athlete.height
                        ? `${athlete.height} cm`
                        : "-"
                    }

                    ·

                    ${
                      athlete.weight
                        ? `${athlete.weight} kg`
                        : "-"
                    }

                  </small>

                </div>

              </button>


              <div class="athlete-item-actions">

                <button
                  type="button"
                  data-athlete-analysis="${escapeHTML(
                    athlete.id
                  )}"
                >
                  분석
                </button>

                <button
                  type="button"
                  data-athlete-report="${escapeHTML(
                    athlete.id
                  )}"
                >
                  리포트
                </button>

                <button
                  type="button"
                  class="danger-text"
                  data-athlete-delete="${escapeHTML(
                    athlete.id
                  )}"
                >
                  삭제
                </button>

              </div>

            </div>

          `;

        }
      )
      .join("");


  $$("[data-athlete-select]")
    .forEach(
      button => {

        button.addEventListener(
          "click",
          () => {

            selectAthlete(
              button.dataset
                .athleteSelect
            );

          }
        );

      }
    );


  $$("[data-athlete-analysis]")
    .forEach(
      button => {

        button.addEventListener(
          "click",
          () => {

            const id =
              button.dataset
                .athleteAnalysis;


            selectAthlete(id);

            setAnalysisAthlete(
              id
            );

            navigateToPage(
              "analysis"
            );

          }
        );

      }
    );


  $$("[data-athlete-report]")
    .forEach(
      button => {

        button.addEventListener(
          "click",
          () => {

            const id =
              button.dataset
                .athleteReport;


            selectAthlete(id);

            navigateToPage(
              "report"
            );


            setTimeout(
              () => {

                const select =
                  getElement(
                    "reportAthlete"
                  );


                if (select) {

                  select.value =
                    id;

                }

              },
              50
            );

          }
        );

      }
    );


  $$("[data-athlete-delete]")
    .forEach(
      button => {

        button.addEventListener(
          "click",
          () => {

            deleteAthlete(
              button.dataset
                .athleteDelete
            );

          }
        );

      }
    );

}


/* =========================================================
   15. SELECT ATHLETE
========================================================= */

function selectAthlete(
  athleteId
) {

  const athlete =
    getAthleteById(
      athleteId
    );


  if (!athlete) {
    return;
  }


  APP_STATE.selectedAthleteId =
    athlete.id;


  localStorage.setItem(
    APP_CONFIG.storage
      .selectedAthlete,
    athlete.id
  );


  renderAthletes();

  renderDashboard();


  showToast(
    `${athlete.name} 선수가 선택되었습니다.`
  );

}


/* =========================================================
   16. DELETE ATHLETE
========================================================= */

function deleteAthlete(
  athleteId
) {

  const athlete =
    getAthleteById(
      athleteId
    );


  if (!athlete) {
    return;
  }


  const confirmed =
    confirm(
      `${athlete.name} 선수 정보를 삭제할까요?`
    );


  if (!confirmed) {
    return;
  }


  APP_STATE.athletes =
    APP_STATE.athletes.filter(
      item =>
        String(item.id) !==
        String(athleteId)
    );


  if (
    String(
      APP_STATE.selectedAthleteId
    ) ===
    String(
      athleteId
    )
  ) {

    APP_STATE.selectedAthleteId =
      APP_STATE.athletes[0]?.id ||
      null;


    if (
      APP_STATE.selectedAthleteId
    ) {

      localStorage.setItem(
        APP_CONFIG.storage
          .selectedAthlete,
        APP_STATE.selectedAthleteId
      );

    }

    else {

      localStorage.removeItem(
        APP_CONFIG.storage
          .selectedAthlete
      );

    }

  }


  saveAthletes();

  renderAthletes();

  populateAllAthleteSelectors();

  renderDashboard();


  showToast(
    "선수 정보가 삭제되었습니다."
  );

}


/* =========================================================
   17. ATHLETE SEARCH
========================================================= */

function bindAthleteSearch() {

  getElement(
    "athleteSearch"
  )
    ?.addEventListener(
      "input",
      renderAthletes
    );

}


/* =========================================================
   18. POPULATE ATHLETE SELECT
========================================================= */

function populateAthleteSelect(
  select,
  includeAll = false
) {

  if (!select) {
    return;
  }


  const current =
    select.value;


  select.innerHTML =
    includeAll

      ? `
          <option value="all">
            전체 선수
          </option>
        `

      : `
          <option value="">
            선수 선택
          </option>
        `;


  APP_STATE.athletes
    .forEach(
      athlete => {

        const option =
          document.createElement(
            "option"
          );


        option.value =
          athlete.id;


        option.textContent =
          athlete.name;


        select.appendChild(
          option
        );

      }
    );


  if (
    [
      ...select.options
    ].some(
      option =>
        option.value ===
        current
    )
  ) {

    select.value =
      current;

  }

}


/* =========================================================
   19. POPULATE ALL ATHLETE SELECTORS
========================================================= */

function populateAllAthleteSelectors() {

  populateAthleteSelect(
    getElement(
      "analysisAthlete"
    )
  );


  populateAthleteSelect(
    getElement(
      "programAthlete"
    )
  );


  populateAthleteSelect(
    getElement(
      "reportAthlete"
    )
  );


  populateAthleteSelect(
    getElement(
      "recordAthleteFilter"
    ),
    true
  );


  if (
    APP_STATE.selectedAthleteId
  ) {

    setAnalysisAthlete(
      APP_STATE.selectedAthleteId
    );

  }

}


/* =========================================================
   20. SET ANALYSIS ATHLETE
========================================================= */

function setAnalysisAthlete(
  athleteId
) {

  const select =
    getElement(
      "analysisAthlete"
    );


  if (!select) {
    return;
  }


  if (
    [
      ...select.options
    ].some(
      option =>
        String(option.value) ===
        String(athleteId)
    )
  ) {

    select.value =
      athleteId;

  }

}


/* =========================================================
   21. EXERCISE DATA
========================================================= */

function getExerciseDatabase() {

  if (
    Array.isArray(
      window.EXERCISES
    )
  ) {

    return window.EXERCISES;

  }


  if (
    Array.isArray(
      window.WEIGHT_EXERCISES
    )
  ) {

    return window.WEIGHT_EXERCISES;

  }


  if (
    typeof window.getExercises ===
    "function"
  ) {

    const exercises =
      window.getExercises();


    if (
      Array.isArray(exercises)
    ) {

      return exercises;

    }

  }


  return [];

}


function getExerciseById(
  id
) {

  return (
    getExerciseDatabase()
      .find(
        exercise =>
          String(exercise.id) ===
          String(id)
      )
    ||
    null
  );

}


window.getExerciseById =
  window.getExerciseById ||
  getExerciseById;


/* =========================================================
   22. CATEGORY NAME
========================================================= */

const CATEGORY_NAMES = {

  lower:
    "하체",

  chest:
    "가슴",

  back:
    "등",

  shoulder:
    "어깨",

  arms:
    "팔",

  core:
    "코어",

  olympic:
    "올림픽 리프팅",

  power:
    "파워",

  plyometric:
    "플라이오메트릭",

  functional:
    "기능성",

  mobility:
    "보강 · 가동성",

  fullbody:
    "전신"

};


function getCategoryName(
  category
) {

  return (
    CATEGORY_NAMES[category] ||
    category ||
    "WEIGHT"
  );

}


window.getCategoryName =
  getCategoryName;


/* =========================================================
   23. EQUIPMENT NAME
========================================================= */

const EQUIPMENT_NAMES = {

  barbell:
    "바벨",

  dumbbell:
    "덤벨",

  machine:
    "머신",

  cable:
    "케이블",

  bodyweight:
    "맨몸",

  kettlebell:
    "케틀벨",

  band:
    "밴드",

  medicineball:
    "메디신볼",

  other:
    "기타"

};


function getEquipmentName(
  equipment
) {

  return (
    EQUIPMENT_NAMES[
      equipment
    ] ||
    equipment ||
    "-"
  );

}


/* =========================================================
   24. EXERCISE SELECTORS
========================================================= */

function populateExerciseSelectors() {

  const exercises =
    getExerciseDatabase();


  const selects = [

    getElement(
      "analysisExercise"
    ),

    getElement(
      "programExercise"
    )

  ];


  selects.forEach(
    select => {

      if (!select) {
        return;
      }


      const current =
        select.value;


      select.innerHTML =
        `
          <option value="">
            운동 선택
          </option>
        `;


      exercises
        .forEach(
          exercise => {

            const option =
              document.createElement(
                "option"
              );


            option.value =
              exercise.id;


            option.textContent =
              `${exercise.icon || "🏋"} ${exercise.name}`;


            select.appendChild(
              option
            );

          }
        );


      if (
        [
          ...select.options
        ].some(
          option =>
            option.value ===
            current
        )
      ) {

        select.value =
          current;

      }

    }
  );


  populateRecordExerciseFilter();

}


/* =========================================================
   25. EXERCISE RENDER
========================================================= */

function renderExercises() {

  const grid =
    getElement(
      "exerciseGrid"
    );


  if (!grid) {
    return;
  }


  const exercises =
    getExerciseDatabase();


  const filtered =
    exercises.filter(
      exercise => {

        const categoryMatch =
          APP_STATE.exerciseCategory ===
          "all"

          ||
          exercise.category ===
          APP_STATE.exerciseCategory;


        const equipmentMatch =
          APP_STATE.exerciseEquipment ===
          "all"

          ||
          exercise.equipment ===
          APP_STATE.exerciseEquipment;


        const query =
          APP_STATE.exerciseSearch
            .trim()
            .toLowerCase();


        const searchText =
          [
            exercise.name,
            exercise.category,
            exercise.muscles,
            exercise.description,
            exercise.equipment
          ]
            .join(" ")
            .toLowerCase();


        const searchMatch =
          !query ||
          searchText.includes(
            query
          );


        return (
          categoryMatch &&
          equipmentMatch &&
          searchMatch
        );

      }
    );


  const count =
    getElement(
      "exerciseTotalCount"
    );


  if (count) {

    count.textContent =
      exercises.length;

  }


  if (!filtered.length) {

    grid.innerHTML =
      `
        <div class="empty-state">
          조건에 맞는 운동이 없습니다.
        </div>
      `;

    return;

  }


  grid.innerHTML =
    filtered
      .map(
        exercise => `

          <button
            class="exercise-card"
            data-exercise-id="${escapeHTML(
              exercise.id
            )}"
            type="button"
          >

            <div class="exercise-pictogram">

              ${
                exercise.icon ||
                exercise.pictogram ||
                "🏋"
              }

            </div>


            <div class="exercise-card-content">

              <span class="exercise-category">

                ${escapeHTML(
                  getCategoryName(
                    exercise.category
                  )
                )}

              </span>


              <h3>

                ${escapeHTML(
                  exercise.name
                )}

              </h3>


              <p>

                ${escapeHTML(
                  exercise.muscles ||
                  exercise.description ||
                  ""
                )}

              </p>


              <small>

                ${escapeHTML(
                  getEquipmentName(
                    exercise.equipment
                  )
                )}

              </small>

            </div>

          </button>

        `
      )
      .join("");


  $$("[data-exercise-id]")
    .forEach(
      button => {

        button.addEventListener(
          "click",
          () => {

            openExerciseModal(
              button.dataset
                .exerciseId
            );

          }
        );

      }
    );

}


/* =========================================================
   26. EXERCISE FILTERS
========================================================= */

function bindExerciseFilters() {

  getElement(
    "exerciseSearch"
  )
    ?.addEventListener(
      "input",
      event => {

        APP_STATE.exerciseSearch =
          event.target.value;

        renderExercises();

      }
    );


  getElement(
    "equipmentFilter"
  )
    ?.addEventListener(
      "change",
      event => {

        APP_STATE.exerciseEquipment =
          event.target.value;

        renderExercises();

      }
    );


  $$(".category-tab")
    .forEach(
      button => {

        button.addEventListener(
          "click",
          () => {

            APP_STATE.exerciseCategory =
              button.dataset.category;


            $$(".category-tab")
              .forEach(
                item =>
                  item.classList.remove(
                    "active"
                  )
              );


            button.classList.add(
              "active"
            );


            renderExercises();

          }
        );

      }
    );

}


/* =========================================================
   27. EXERCISE MODAL
========================================================= */

function openExerciseModal(
  exerciseId
) {

  const exercise =
    getExerciseById(
      exerciseId
    );


  if (!exercise) {
    return;
  }


  APP_STATE.selectedExercise =
    exercise;


  getElement(
    "modalExercisePictogram"
  ).textContent =
    exercise.icon ||
    exercise.pictogram ||
    "🏋";


  getElement(
    "modalExerciseCategory"
  ).textContent =
    getCategoryName(
      exercise.category
    );


  getElement(
    "modalExerciseName"
  ).textContent =
    exercise.name;


  getElement(
    "modalExerciseDescription"
  ).textContent =
    exercise.description ||
    "웨이트 퍼포먼스 분석 운동";


  getElement(
    "modalExerciseMuscles"
  ).textContent =
    Array.isArray(
      exercise.muscles
    )
      ? exercise.muscles.join(", ")
      : exercise.muscles || "-";


  getElement(
    "modalExerciseEquipment"
  ).textContent =
    getEquipmentName(
      exercise.equipment
    );


  getElement(
    "modalExerciseView"
  ).textContent =
    exercise.view ||
    exercise.recommendedView ||
    "정면 · 측면";


  getElement(
    "modalExerciseMetrics"
  ).textContent =
    Array.isArray(
      exercise.metrics
    )
      ? exercise.metrics.join(", ")
      : exercise.metrics ||
        "관절각 · 안정성 · 대칭성";


  getElement(
    "exerciseModal"
  )
    ?.classList.add(
      "show"
    );

}


/* =========================================================
   28. CLOSE EXERCISE MODAL
========================================================= */

function closeExerciseModal() {

  getElement(
    "exerciseModal"
  )
    ?.classList.remove(
      "show"
    );

}


/* =========================================================
   29. ANALYZE EXERCISE
========================================================= */

function analyzeSelectedExercise() {

  const exercise =
    APP_STATE.selectedExercise;


  if (!exercise) {
    return;
  }


  closeExerciseModal();


  navigateToPage(
    "analysis"
  );


  const select =
    getElement(
      "analysisExercise"
    );


  if (select) {

    select.value =
      exercise.id;


    select.dispatchEvent(
      new Event(
        "change",
        {
          bubbles:
            true
        }
      )
    );

  }


  if (
    APP_STATE.selectedAthleteId
  ) {

    setAnalysisAthlete(
      APP_STATE.selectedAthleteId
    );

  }


  showToast(
    `${exercise.name} 분석 준비 완료`
  );

}


/* =========================================================
   30. EXERCISE MODAL EVENTS
========================================================= */

function bindExerciseModal() {

  getElement(
    "closeExerciseModal"
  )
    ?.addEventListener(
      "click",
      closeExerciseModal
    );


  getElement(
    "analyzeSelectedExerciseBtn"
  )
    ?.addEventListener(
      "click",
      analyzeSelectedExercise
    );


  getElement(
    "exerciseModal"
  )
    ?.addEventListener(
      "click",
      event => {

        if (
          event.target.id ===
          "exerciseModal"
        ) {

          closeExerciseModal();

        }

      }
    );

}


/* =========================================================
   31. ANALYSIS RECORD NORMALIZATION
========================================================= */

function normalizeAnalysisRecord(
  detail
) {

  const athlete =
    getAthleteById(
      detail.athleteId
    );


  const exercise =
    getExerciseById(
      detail.exerciseId
    );


  return {

    id:
      detail.id ||
      uid("analysis"),

    athleteId:
      detail.athleteId ||
      "",

    athleteName:
      detail.athleteName ||
      athlete?.name ||
      "선수",

    exerciseId:
      detail.exerciseId ||
      "",

    exerciseName:
      detail.exerciseName ||
      exercise?.name ||
      "웨이트",

    exerciseIcon:
      detail.exerciseIcon ||
      exercise?.icon ||
      "🏋",

    exerciseCategory:
      detail.exerciseCategory ||
      exercise?.category ||
      "",

    reps:
      Number(
        detail.reps ??
        detail.repCount ??
        0
      ),

    score:
      Math.round(
        clamp(
          detail.score ??
          detail.technique ??
          0
        )
      ),

    technique:
      Math.round(
        clamp(
          detail.technique ??
          detail.score ??
          0
        )
      ),

    stability:
      Math.round(
        clamp(
          detail.stability ??
          0
        )
      ),

    symmetry:
      Math.round(
        clamp(
          detail.symmetry ??
          0
        )
      ),

    mobility:
      Math.round(
        clamp(
          detail.mobility ??
          0
        )
      ),

    strength:
      Math.round(
        clamp(
          detail.strength ??
          0
        )
      ),

    power:
      Math.round(
        clamp(
          detail.power ??
          0
        )
      ),

    rom:
      Number(
        detail.rom ??
        detail.ROM ??
        0
      ),

    knee:
      Number(
        detail.knee ??
        detail.kneeAngle ??
        0
      ),

    hip:
      Number(
        detail.hip ??
        detail.hipAngle ??
        0
      ),

    trunk:
      Number(
        detail.trunk ??
        detail.trunkAngle ??
        0
      ),

    ankle:
      Number(
        detail.ankle ??
        detail.ankleAngle ??
        0
      ),

    tempo:
      detail.tempo ||
      "",

    duration:
      detail.duration ||
      "",

    recommendations:
      Array.isArray(
        detail.recommendations
      )
        ? detail.recommendations
        : [],

    frame:
      detail.frame ||
      detail.snapshot ||
      null,

    createdAt:
      detail.createdAt ||
      new Date()
        .toISOString()

  };

}


/* =========================================================
   32. ANALYSIS COMPLETE
========================================================= */

function handleAnalysisComplete(
  event
) {

  if (!event.detail) {
    return;
  }


  const record =
    normalizeAnalysisRecord(
      event.detail
    );


  const existingIndex =
    APP_STATE.analyses
      .findIndex(
        item =>
          String(item.id) ===
          String(record.id)
      );


  if (
    existingIndex >= 0
  ) {

    APP_STATE.analyses[
      existingIndex
    ] = record;

  }

  else {

    APP_STATE.analyses.push(
      record
    );

  }


  window.latestWeightAnalysis =
    record;


  saveAnalyses();

  renderDashboard();

  renderRecords();


  showToast(
    "분석 결과가 저장되었습니다."
  );

}


/* =========================================================
   33. GET ATHLETE ANALYSES
========================================================= */

function getAthleteAnalyses(
  athleteId
) {

  return APP_STATE.analyses
    .filter(
      analysis =>
        String(
          analysis.athleteId
        ) ===
        String(
          athleteId
        )
    )
    .sort(
      (a, b) =>
        new Date(
          b.createdAt
        ) -
        new Date(
          a.createdAt
        )
    );

}


/* =========================================================
   34. DASHBOARD
========================================================= */

function renderDashboard() {

  const athlete =
    getSelectedAthlete();


  const allScores =
    APP_STATE.analyses
      .map(
        record =>
          Number(record.score)
      )
      .filter(
        value =>
          Number.isFinite(value) &&
          value > 0
      );


  setText(
    "dashboardAthleteCount",
    APP_STATE.athletes.length
  );


  setText(
    "dashboardAnalysisCount",
    APP_STATE.analyses.length
  );


  setText(
    "dashboardAverageScore",
    allScores.length
      ? Math.round(
          average(
            allScores
          )
        )
      : "--"
  );


  setText(
    "dashboardPRCount",
    calculatePRCount()
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


    renderDashboardRadar(
      null
    );


    renderDashboardTrend(
      []
    );


    renderDashboardRecent();

    renderDashboardPR();

    return;

  }


  const analyses =
    getAthleteAnalyses(
      athlete.id
    );


  const latest =
    analyses[0];


  setText(
    "dashboardAthleteName",
    athlete.name
  );


  setText(
    "dashboardAthleteSport",
    athlete.sport ||
    "-"
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


  setText(
    "dashboardLatestScore",
    latest?.score
      ? `${latest.score}/100`
      : "-"
  );


  renderDashboardRadar(
    latest
  );


  renderDashboardTrend(
    analyses
  );


  renderDashboardRecent();

  renderDashboardPR();

}


/* =========================================================
   35. SET TEXT
========================================================= */

function setText(
  id,
  value
) {

  const element =
    getElement(id);


  if (element) {

    element.textContent =
      value;

  }

}


/* =========================================================
   36. DASHBOARD RADAR
========================================================= */

function renderDashboardRadar(
  analysis
) {

  const canvas =
    getElement(
      "performanceRadar"
    );


  if (
    !canvas ||
    typeof Chart ===
    "undefined"
  ) {

    return;

  }


  const metrics = {

    strength:
      clamp(
        analysis?.strength ??
        0
      ),

    power:
      clamp(
        analysis?.power ??
        0
      ),

    stability:
      clamp(
        analysis?.stability ??
        0
      ),

    symmetry:
      clamp(
        analysis?.symmetry ??
        0
      ),

    mobility:
      clamp(
        analysis?.mobility ??
        0
      ),

    technique:
      clamp(
        analysis?.technique ??
        analysis?.score ??
        0
      )

  };


  setText(
    "radarStrength",
    Math.round(
      metrics.strength
    )
  );


  setText(
    "radarPower",
    Math.round(
      metrics.power
    )
  );


  setText(
    "radarStability",
    Math.round(
      metrics.stability
    )
  );


  setText(
    "radarSymmetry",
    Math.round(
      metrics.symmetry
    )
  );


  setText(
    "radarMobility",
    Math.round(
      metrics.mobility
    )
  );


  setText(
    "radarTechnique",
    Math.round(
      metrics.technique
    )
  );


  if (
    APP_STATE.performanceRadar
  ) {

    APP_STATE.performanceRadar
      .destroy();

  }


  APP_STATE.performanceRadar =
    new Chart(
      canvas,
      {

        type:
          "radar",

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
                "PERFORMANCE",

              data: [
                metrics.strength,
                metrics.power,
                metrics.stability,
                metrics.symmetry,
                metrics.mobility,
                metrics.technique
              ],

              borderWidth:
                2,

              pointRadius:
                3

            }
          ]

        },

        options: {

          responsive:
            true,

          maintainAspectRatio:
            false,

          scales: {

            r: {

              min:
                0,

              max:
                100,

              beginAtZero:
                true,

              ticks: {
                display:
                  false
              }

            }

          },

          plugins: {

            legend: {
              display:
                false
            }

          }

        }

      }
    );

}


/* =========================================================
   37. DASHBOARD TREND
========================================================= */

function renderDashboardTrend(
  analyses
) {

  const canvas =
    getElement(
      "performanceTrendChart"
    );


  if (
    !canvas ||
    typeof Chart ===
    "undefined"
  ) {

    return;

  }


  const period =
    Number(
      getElement(
        "dashboardPeriod"
      )?.value ||
      7
    );


  const records =
    analyses
      .slice(
        0,
        period
      )
      .reverse();


  if (
    APP_STATE.performanceTrend
  ) {

    APP_STATE.performanceTrend
      .destroy();

  }


  APP_STATE.performanceTrend =
    new Chart(
      canvas,
      {

        type:
          "line",

        data: {

          labels:
            records.map(
              item =>
                formatDate(
                  item.createdAt
                )
            ),

          datasets: [
            {

              label:
                "기술 점수",

              data:
                records.map(
                  item =>
                    item.score ||
                    item.technique ||
                    0
                ),

              tension:
                0.3,

              borderWidth:
                2,

              pointRadius:
                4

            }
          ]

        },

        options: {

          responsive:
            true,

          maintainAspectRatio:
            false,

          scales: {

            y: {

              min:
                0,

              max:
                100

            }

          },

          plugins: {

            legend: {
              display:
                false
            }

          }

        }

      }
    );

}


/* =========================================================
   38. DASHBOARD RECENT
========================================================= */

function renderDashboardRecent() {

  const container =
    getElement(
      "dashboardRecentList"
    );


  if (!container) {
    return;
  }


  const records =
    [...APP_STATE.analyses]
      .sort(
        (a, b) =>
          new Date(
            b.createdAt
          ) -
          new Date(
            a.createdAt
          )
      )
      .slice(
        0,
        5
      );


  if (!records.length) {

    container.innerHTML =
      `
        <div class="empty-state">
          아직 분석 기록이 없습니다.
        </div>
      `;

    return;

  }


  container.innerHTML =
    records
      .map(
        record => `

          <button
            class="recent-analysis-item"
            data-open-record="${escapeHTML(
              record.id
            )}"
            type="button"
          >

            <div>

              <strong>
                ${
                  record.exerciseIcon ||
                  "🏋"
                }
                ${escapeHTML(
                  record.exerciseName
                )}
              </strong>

              <span>
                ${escapeHTML(
                  record.athleteName
                )}
              </span>

            </div>


            <div>

              <strong>
                ${record.score || "-"}
              </strong>

              <small>
                ${formatDate(
                  record.createdAt
                )}
              </small>

            </div>

          </button>

        `
      )
      .join("");


  bindRecordOpenButtons();

}


/* =========================================================
   39. PERSONAL RECORD
========================================================= */

function calculatePRCount() {

  const map =
    new Map();


  APP_STATE.analyses
    .forEach(
      record => {

        const key =
          `${record.athleteId}_${record.exerciseId}`;


        const current =
          map.get(key);


        if (
          !current ||
          Number(record.score) >
          Number(current.score)
        ) {

          map.set(
            key,
            record
          );

        }

      }
    );


  return map.size;

}


function getPRRecords() {

  const map =
    new Map();


  APP_STATE.analyses
    .forEach(
      record => {

        const key =
          `${record.athleteId}_${record.exerciseId}`;


        const current =
          map.get(key);


        if (
          !current ||
          Number(record.score) >
          Number(current.score)
        ) {

          map.set(
            key,
            record
          );

        }

      }
    );


  return [
    ...map.values()
  ]
    .sort(
      (a, b) =>
        Number(b.score) -
        Number(a.score)
    );

}


function renderDashboardPR() {

  const container =
    getElement(
      "dashboardPRList"
    );


  if (!container) {
    return;
  }


  const records =
    getPRRecords()
      .slice(
        0,
        5
      );


  if (!records.length) {

    container.innerHTML =
      `
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

          <div class="pr-item">

            <div>

              <strong>
                ${escapeHTML(
                  record.exerciseName
                )}
              </strong>

              <span>
                ${escapeHTML(
                  record.athleteName
                )}
              </span>

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
   40. RECORD FILTER
========================================================= */

function populateRecordExerciseFilter() {

  const select =
    getElement(
      "recordExerciseFilter"
    );


  if (!select) {
    return;
  }


  const current =
    select.value;


  select.innerHTML =
    `
      <option value="all">
        전체 운동
      </option>
    `;


  getExerciseDatabase()
    .forEach(
      exercise => {

        const option =
          document.createElement(
            "option"
          );


        option.value =
          exercise.id;


        option.textContent =
          exercise.name;


        select.appendChild(
          option
        );

      }
    );


  if (
    [
      ...select.options
    ].some(
      option =>
        option.value ===
        current
    )
  ) {

    select.value =
      current;

  }

}


/* =========================================================
   41. RENDER RECORDS
========================================================= */

function renderRecords() {

  const tbody =
    getElement(
      "recordsTableBody"
    );


  if (!tbody) {
    return;
  }


  const athleteFilter =
    getElement(
      "recordAthleteFilter"
    )?.value ||
    "all";


  const exerciseFilter =
    getElement(
      "recordExerciseFilter"
    )?.value ||
    "all";


  const query =
    (
      getElement(
        "recordSearch"
      )?.value ||
      ""
    )
      .trim()
      .toLowerCase();


  const records =
    [...APP_STATE.analyses]
      .filter(
        record => {

          const athleteMatch =
            athleteFilter ===
            "all"

            ||
            String(
              record.athleteId
            ) ===
            String(
              athleteFilter
            );


          const exerciseMatch =
            exerciseFilter ===
            "all"

            ||
            String(
              record.exerciseId
            ) ===
            String(
              exerciseFilter
            );


          const searchText =
            [
              record.athleteName,
              record.exerciseName,
              record.score
            ]
              .join(" ")
              .toLowerCase();


          const searchMatch =
            !query ||
            searchText.includes(
              query
            );


          return (
            athleteMatch &&
            exerciseMatch &&
            searchMatch
          );

        }
      )
      .sort(
        (a, b) =>
          new Date(
            b.createdAt
          ) -
          new Date(
            a.createdAt
          )
      );


  if (!records.length) {

    tbody.innerHTML =
      `
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
    records
      .map(
        record => `

          <tr>

            <td>
              ${formatDateTime(
                record.createdAt
              )}
            </td>

            <td>
              ${escapeHTML(
                record.athleteName
              )}
            </td>

            <td>
              ${
                record.exerciseIcon ||
                "🏋"
              }
              ${escapeHTML(
                record.exerciseName
              )}
            </td>

            <td>
              ${record.reps || 0}
            </td>

            <td>
              <strong>
                ${record.score || "-"}
              </strong>
            </td>

            <td>
              ${
                record.symmetry
                  ? `${record.symmetry}%`
                  : "-"
              }
            </td>

            <td>
              ${
                record.rom
                  ? `${Math.round(
                      record.rom
                    )}°`
                  : "-"
              }
            </td>

            <td>

              <button
                class="table-action-button"
                data-open-record="${escapeHTML(
                  record.id
                )}"
                type="button"
              >
                보기
              </button>

            </td>

          </tr>

        `
      )
      .join("");


  bindRecordOpenButtons();

}


/* =========================================================
   42. RECORD OPEN BUTTON
========================================================= */

function bindRecordOpenButtons() {

  $$("[data-open-record]")
    .forEach(
      button => {

        button.onclick =
          () => {

            openRecordModal(
              button.dataset
                .openRecord
            );

          };

      }
    );

}


/* =========================================================
   43. RECORD MODAL
========================================================= */

function openRecordModal(
  recordId
) {

  const record =
    APP_STATE.analyses
      .find(
        item =>
          String(item.id) ===
          String(recordId)
      );


  if (!record) {
    return;
  }


  const content =
    getElement(
      "recordDetailContent"
    );


  if (!content) {
    return;
  }


  content.innerHTML =
    `

      <div class="record-detail-header">

        <div>

          <span class="eyebrow">
            ${
              record.exerciseIcon ||
              "🏋"
            }
            PERFORMANCE ANALYSIS
          </span>

          <h2>
            ${escapeHTML(
              record.exerciseName
            )}
          </h2>

          <p>
            ${escapeHTML(
              record.athleteName
            )}
            ·
            ${formatDateTime(
              record.createdAt
            )}
          </p>

        </div>


        <div class="record-detail-score">

          <strong>
            ${record.score || "--"}
          </strong>

          <span>
            /100
          </span>

        </div>

      </div>


      <div class="record-detail-grid">

        ${recordMetricHTML(
          "반복",
          record.reps || 0
        )}

        ${recordMetricHTML(
          "기술",
          record.technique || "-"
        )}

        ${recordMetricHTML(
          "안정성",
          record.stability || "-"
        )}

        ${recordMetricHTML(
          "대칭성",
          record.symmetry
            ? `${record.symmetry}%`
            : "-"
        )}

        ${recordMetricHTML(
          "ROM",
          record.rom
            ? `${Math.round(
                record.rom
              )}°`
            : "-"
        )}

        ${recordMetricHTML(
          "무릎",
          record.knee
            ? `${Math.round(
                record.knee
              )}°`
            : "-"
        )}

        ${recordMetricHTML(
          "고관절",
          record.hip
            ? `${Math.round(
                record.hip
              )}°`
            : "-"
        )}

        ${recordMetricHTML(
          "몸통",
          record.trunk
            ? `${Math.round(
                record.trunk
              )}°`
            : "-"
        )}

      </div>


      ${
        record.frame

          ? `
              <div class="record-frame">

                <img
                  src="${record.frame}"
                  alt="분석 프레임"
                />

              </div>
            `

          : ""
      }


      <div class="record-recommendations">

        <h3>
          추천 훈련
        </h3>

        ${
          Array.isArray(
            record.recommendations
          ) &&
          record.recommendations.length

            ? record.recommendations
                .map(
                  item =>
                    `
                      <div>
                        ${escapeHTML(
                          item
                        )}
                      </div>
                    `
                )
                .join("")

            : `
                <p>
                  저장된 추천 훈련이 없습니다.
                </p>
              `
        }

      </div>


      <button
        class="danger-button"
        id="deleteCurrentRecordBtn"
        type="button"
      >
        이 분석 기록 삭제
      </button>

    `;


  getElement(
    "recordModal"
  )
    ?.classList.add(
      "show"
    );


  getElement(
    "deleteCurrentRecordBtn"
  )
    ?.addEventListener(
      "click",
      () => {

        deleteAnalysisRecord(
          record.id
        );

      }
    );

}


/* =========================================================
   44. RECORD METRIC HTML
========================================================= */

function recordMetricHTML(
  label,
  value
) {

  return `

    <div class="record-metric">

      <span>
        ${escapeHTML(label)}
      </span>

      <strong>
        ${escapeHTML(value)}
      </strong>

    </div>

  `;

}


/* =========================================================
   45. CLOSE RECORD MODAL
========================================================= */

function closeRecordModal() {

  getElement(
    "recordModal"
  )
    ?.classList.remove(
      "show"
    );

}


/* =========================================================
   46. DELETE ANALYSIS RECORD
========================================================= */

function deleteAnalysisRecord(
  recordId
) {

  if (
    !confirm(
      "이 분석 기록을 삭제할까요?"
    )
  ) {

    return;

  }


  APP_STATE.analyses =
    APP_STATE.analyses.filter(
      record =>
        String(record.id) !==
        String(recordId)
    );


  saveAnalyses();

  closeRecordModal();

  renderRecords();

  renderDashboard();


  showToast(
    "분석 기록이 삭제되었습니다."
  );

}


/* =========================================================
   47. RECORD EVENTS
========================================================= */

function bindRecordEvents() {

  [
    "recordAthleteFilter",
    "recordExerciseFilter"
  ]
    .forEach(
      id => {

        getElement(id)
          ?.addEventListener(
            "change",
            renderRecords
          );

      }
    );


  getElement(
    "recordSearch"
  )
    ?.addEventListener(
      "input",
      renderRecords
    );


  getElement(
    "closeRecordModal"
  )
    ?.addEventListener(
      "click",
      closeRecordModal
    );


  getElement(
    "recordModal"
  )
    ?.addEventListener(
      "click",
      event => {

        if (
          event.target.id ===
          "recordModal"
        ) {

          closeRecordModal();

        }

      }
    );

}


/* =========================================================
   48. CSV EXPORT
========================================================= */

function exportAnalysisCSV() {

  if (
    !APP_STATE.analyses.length
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
      "기술",
      "안정성",
      "대칭성",
      "ROM",
      "무릎각도",
      "고관절각도",
      "몸통각도",
      "발목각도"
    ],

    ...APP_STATE.analyses.map(
      record => [

        record.createdAt,

        record.athleteName,

        record.exerciseName,

        record.reps,

        record.score,

        record.technique,

        record.stability,

        record.symmetry,

        record.rom,

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
              cell =>
                `"${String(
                  cell ?? ""
                )
                  .replaceAll(
                    '"',
                    '""'
                  )}"`
            )
            .join(",")
      )
      .join("\n");


  downloadBlob(
    new Blob(
      [
        "\uFEFF" +
        csv
      ],
      {
        type:
          "text/csv;charset=utf-8"
      }
    ),
    `weight_analysis_${Date.now()}.csv`
  );


  showToast(
    "CSV 파일이 생성되었습니다."
  );

}


/* =========================================================
   49. PROGRAM SELECTORS
========================================================= */

function populateProgramSelectors() {

  populateAthleteSelect(
    getElement(
      "programAthlete"
    )
  );


  populateExerciseSelectors();

}


/* =========================================================
   50. ADD PROGRAM EXERCISE
========================================================= */

function addProgramExercise() {

  const exerciseId =
    getElement(
      "programExercise"
    )?.value;


  if (!exerciseId) {

    showToast(
      "운동을 선택하세요."
    );

    return;

  }


  const exercise =
    getExerciseById(
      exerciseId
    );


  if (!exercise) {

    showToast(
      "운동 정보를 찾을 수 없습니다."
    );

    return;

  }


  const item = {

    id:
      uid("programItem"),

    exerciseId:
      exercise.id,

    exerciseName:
      exercise.name,

    icon:
      exercise.icon ||
      "🏋",

    sets:
      Math.max(
        1,
        Number(
          getElement(
            "programSets"
          )?.value
        ) || 1
      ),

    reps:
      Math.max(
        1,
        Number(
          getElement(
            "programReps"
          )?.value
        ) || 1
      ),

    weight:
      Math.max(
        0,
        Number(
          getElement(
            "programWeight"
          )?.value
        ) || 0
      ),

    rest:
      Math.max(
        0,
        Number(
          getElement(
            "programRest"
          )?.value
        ) || 0
      )

  };


  APP_STATE.programExercises
    .push(
      item
    );


  renderProgramExercises();


  showToast(
    `${exercise.name} 추가`
  );

}


/* =========================================================
   51. RENDER PROGRAM
========================================================= */

function renderProgramExercises() {

  const container =
    getElement(
      "programExerciseList"
    );


  if (!container) {
    return;
  }


  if (
    !APP_STATE.programExercises
      .length
  ) {

    container.innerHTML =
      `
        <div class="empty-state">
          추가된 운동이 없습니다.
        </div>
      `;

  }

  else {

    container.innerHTML =
      APP_STATE.programExercises
        .map(
          (item, index) => `

            <div class="program-exercise-item">

              <div class="program-order">
                ${index + 1}
              </div>


              <div class="program-exercise-icon">
                ${item.icon}
              </div>


              <div class="program-exercise-info">

                <strong>
                  ${escapeHTML(
                    item.exerciseName
                  )}
                </strong>

                <span>

                  ${item.sets} SET

                  ×

                  ${item.reps} REP

                  ·

                  ${item.weight} kg

                  ·

                  REST ${item.rest}s

                </span>

              </div>


              <button
                type="button"
                data-remove-program="${escapeHTML(
                  item.id
                )}"
              >
                ×
              </button>

            </div>

          `
        )
        .join("");


    $$("[data-remove-program]")
      .forEach(
        button => {

          button.addEventListener(
            "click",
            () => {

              APP_STATE.programExercises =
                APP_STATE.programExercises
                  .filter(
                    item =>
                      item.id !==
                      button.dataset
                        .removeProgram
                  );


              renderProgramExercises();

            }
          );

        }
      );

  }


  updateProgramSummary();

}


/* =========================================================
   52. PROGRAM SUMMARY
========================================================= */

function updateProgramSummary() {

  const exercises =
    APP_STATE.programExercises;


  const totalSets =
    exercises.reduce(
      (sum, item) =>
        sum +
        Number(item.sets),
      0
    );


  const totalVolume =
    exercises.reduce(
      (sum, item) =>

        sum +

        (
          Number(item.sets) *
          Number(item.reps) *
          Number(item.weight)
        ),

      0
    );


  setText(
    "programExerciseCount",
    exercises.length
  );


  setText(
    "programTotalSets",
    totalSets
  );


  setText(
    "programTotalVolume",
    `${Math.round(
      totalVolume
    ).toLocaleString()} kg`
  );

}


/* =========================================================
   53. SAVE PROGRAM
========================================================= */

function saveTrainingProgram() {

  const athleteId =
    getElement(
      "programAthlete"
    )?.value;


  if (!athleteId) {

    showToast(
      "선수를 선택하세요."
    );

    return;

  }


  if (
    !APP_STATE.programExercises
      .length
  ) {

    showToast(
      "운동을 한 개 이상 추가하세요."
    );

    return;

  }


  const athlete =
    getAthleteById(
      athleteId
    );


  const program = {

    id:
      uid("program"),

    athleteId,

    athleteName:
      athlete?.name ||
      "",

    name:
      getElement(
        "programName"
      )?.value.trim() ||
      "WEIGHT PROGRAM",

    exercises:
      APP_STATE.programExercises
        .map(
          item => ({
            ...item
          })
        ),

    createdAt:
      new Date()
        .toISOString()

  };


  APP_STATE.programs.push(
    program
  );


  savePrograms();


  APP_STATE.programExercises =
    [];


  renderProgramExercises();


  const nameInput =
    getElement(
      "programName"
    );


  if (nameInput) {

    nameInput.value =
      "";

  }


  showToast(
    `${program.name} 프로그램이 저장되었습니다.`
  );

}


/* =========================================================
   54. PROGRAM EVENTS
========================================================= */

function bindProgramEvents() {

  getElement(
    "addProgramExerciseBtn"
  )
    ?.addEventListener(
      "click",
      addProgramExercise
    );


  getElement(
    "saveProgramBtn"
  )
    ?.addEventListener(
      "click",
      saveTrainingProgram
    );

}


/* =========================================================
   55. SETTINGS
========================================================= */

function renderSettings() {

  const map = {

    settingSkeleton:
      "skeleton",

    settingAngles:
      "angles",

    settingReference:
      "reference",

    settingBarPath:
      "barPath"

  };


  Object.entries(map)
    .forEach(
      ([id, key]) => {

        const input =
          getElement(id);


        if (input) {

          input.checked =
            APP_STATE.settings[key];

        }

      }
    );

}


/* =========================================================
   56. SETTINGS EVENTS
========================================================= */

function bindSettings() {

  const map = {

    settingSkeleton:
      "skeleton",

    settingAngles:
      "angles",

    settingReference:
      "reference",

    settingBarPath:
      "barPath"

  };


  Object.entries(map)
    .forEach(
      ([id, key]) => {

        getElement(id)
          ?.addEventListener(
            "change",
            event => {

              APP_STATE.settings[key] =
                event.target.checked;


              saveSettings();


              applySettingsToAnalysis();

            }
          );

      }
    );

}


/* =========================================================
   57. APPLY SETTINGS
========================================================= */

function applySettingsToAnalysis() {

  const skeleton =
    getElement(
      "poseCanvas"
    );


  const vertical =
    getElement(
      "referenceVertical"
    );


  const horizontal =
    getElement(
      "referenceHorizontal"
    );


  const barPath =
    getElement(
      "barPathCanvas"
    );


  if (skeleton) {

    skeleton.style.opacity =
      APP_STATE.settings.skeleton
        ? "1"
        : "0";

  }


  if (vertical) {

    vertical.style.display =
      APP_STATE.settings.reference
        ? ""
        : "none";

  }


  if (horizontal) {

    horizontal.style.display =
      APP_STATE.settings.reference
        ? ""
        : "none";

  }


  if (barPath) {

    barPath.style.opacity =
      APP_STATE.settings.barPath
        ? "1"
        : "0";

  }

}


/* =========================================================
   58. BACKUP DATA
========================================================= */

function backupApplicationData() {

  const backup = {

    application:
      APP_CONFIG.name,

    version:
      APP_CONFIG.version,

    exportedAt:
      new Date()
        .toISOString(),

    athletes:
      APP_STATE.athletes,

    analyses:
      APP_STATE.analyses,

    programs:
      APP_STATE.programs,

    settings:
      APP_STATE.settings

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
        type:
          "application/json"
      }
    );


  downloadBlob(
    blob,
    `weight_lab_backup_${Date.now()}.json`
  );


  showToast(
    "데이터 백업 파일이 생성되었습니다."
  );

}


/* =========================================================
   59. RESTORE DATA
========================================================= */

async function restoreApplicationData(
  file
) {

  if (!file) {
    return;
  }


  try {

    const text =
      await file.text();


    const data =
      JSON.parse(text);


    if (
      !data ||
      typeof data !==
      "object"
    ) {

      throw new Error(
        "Invalid backup"
      );

    }


    if (
      Array.isArray(
        data.athletes
      )
    ) {

      APP_STATE.athletes =
        data.athletes;

    }


    if (
      Array.isArray(
        data.analyses
      )
    ) {

      APP_STATE.analyses =
        data.analyses;

    }


    if (
      Array.isArray(
        data.programs
      )
    ) {

      APP_STATE.programs =
        data.programs;

    }


    if (
      data.settings &&
      typeof data.settings ===
      "object"
    ) {

      APP_STATE.settings = {

        ...APP_STATE.settings,

        ...data.settings

      };

    }


    saveAthletes();

    saveAnalyses();

    savePrograms();

    saveSettings();


    populateAllAthleteSelectors();

    populateExerciseSelectors();

    renderAthletes();

    renderRecords();

    renderDashboard();

    renderSettings();

    applySettingsToAnalysis();


    showToast(
      "데이터 복원이 완료되었습니다."
    );

  }

  catch (error) {

    console.error(error);


    showToast(
      "백업 파일을 읽을 수 없습니다."
    );

  }

}


/* =========================================================
   60. CLEAR DATA
========================================================= */

function clearApplicationData() {

  const confirmed =
    confirm(
      "선수, 분석 기록, 프로그램 등 모든 저장 데이터를 초기화할까요?"
    );


  if (!confirmed) {
    return;
  }


  APP_STATE.athletes =
    [];

  APP_STATE.analyses =
    [];

  APP_STATE.programs =
    [];

  APP_STATE.programExercises =
    [];

  APP_STATE.selectedAthleteId =
    null;


  Object.values(
    APP_CONFIG.storage
  )
    .forEach(
      key =>
        localStorage.removeItem(
          key
        )
    );


  syncGlobals();


  populateAllAthleteSelectors();

  renderAthletes();

  renderRecords();

  renderProgramExercises();

  renderDashboard();


  if (
    window.WeightReport
  ) {

    window.WeightReport.reset();

    window.WeightReport
      .refreshAthletes();

  }


  showToast(
    "저장 데이터가 초기화되었습니다."
  );

}


/* =========================================================
   61. DOWNLOAD BLOB
========================================================= */

function downloadBlob(
  blob,
  filename
) {

  const url =
    URL.createObjectURL(
      blob
    );


  const anchor =
    document.createElement(
      "a"
    );


  anchor.href =
    url;

  anchor.download =
    filename;


  document.body
    .appendChild(
      anchor
    );


  anchor.click();


  anchor.remove();


  setTimeout(
    () => {

      URL.revokeObjectURL(
        url
      );

    },
    1000
  );

}


/* =========================================================
   62. DATA EVENTS
========================================================= */

function bindDataEvents() {

  getElement(
    "backupDataBtn"
  )
    ?.addEventListener(
      "click",
      backupApplicationData
    );


  getElement(
    "restoreDataInput"
  )
    ?.addEventListener(
      "change",
      event => {

        const file =
          event.target.files?.[0];


        restoreApplicationData(
          file
        );


        event.target.value =
          "";

      }
    );


  getElement(
    "clearDataBtn"
  )
    ?.addEventListener(
      "click",
      clearApplicationData
    );


  getElement(
    "exportCSVBtn"
  )
    ?.addEventListener(
      "click",
      exportAnalysisCSV
    );

}


/* =========================================================
   63. COACH MODE
========================================================= */

function bindCoachMode() {

  getElement(
    "coachModeBtn"
  )
    ?.addEventListener(
      "click",
      () => {

        document.body
          .classList.toggle(
            "coach-mode"
          );


        const enabled =
          document.body
            .classList.contains(
              "coach-mode"
            );


        showToast(
          enabled
            ? "코치 모드 활성화"
            : "코치 모드 해제"
        );

      }
    );

}


/* =========================================================
   64. ANALYSIS TARGET REP
========================================================= */

function bindAnalysisTargetRep() {

  const input =
    getElement(
      "analysisTargetReps"
    );


  const output =
    getElement(
      "targetRepCount"
    );


  if (
    !input ||
    !output
  ) {

    return;

  }


  const update =
    () => {

      output.textContent =
        Math.max(
          1,
          Number(
            input.value
          ) || 1
        );

    };


  input.addEventListener(
    "input",
    update
  );


  update();

}


/* =========================================================
   65. DASHBOARD PERIOD
========================================================= */

function bindDashboardPeriod() {

  getElement(
    "dashboardPeriod"
  )
    ?.addEventListener(
      "change",
      () => {

        const athlete =
          getSelectedAthlete();


        renderDashboardTrend(
          athlete
            ? getAthleteAnalyses(
                athlete.id
              )
            : []
        );

      }
    );

}


/* =========================================================
   66. KEYBOARD
========================================================= */

function bindKeyboard() {

  document.addEventListener(
    "keydown",
    event => {

      if (
        event.key ===
        "Escape"
      ) {

        closeExerciseModal();

        closeRecordModal();

        getElement(
          "sidebar"
        )
          ?.classList.remove(
            "open"
          );

      }

    }
  );

}


/* =========================================================
   67. CLOSE SIDEBAR ON OUTSIDE CLICK
========================================================= */

function bindSidebarOutsideClick() {

  document.addEventListener(
    "click",
    event => {

      const sidebar =
        getElement(
          "sidebar"
        );


      const menu =
        getElement(
          "mobileMenuBtn"
        );


      if (
        !sidebar ||
        !sidebar.classList
          .contains(
            "open"
          )
      ) {

        return;

      }


      if (
        sidebar.contains(
          event.target
        ) ||
        menu?.contains(
          event.target
        )
      ) {

        return;

      }


      sidebar.classList.remove(
        "open"
      );

    }
  );

}


/* =========================================================
   68. ANALYSIS SETTINGS BUTTONS SYNC
========================================================= */

function bindAnalysisDisplayButtons() {

  getElement(
    "toggleSkeletonBtn"
  )
    ?.addEventListener(
      "click",
      () => {

        APP_STATE.settings.skeleton =
          !APP_STATE.settings
            .skeleton;


        const setting =
          getElement(
            "settingSkeleton"
          );


        if (setting) {

          setting.checked =
            APP_STATE.settings
              .skeleton;

        }


        saveSettings();

        applySettingsToAnalysis();

      }
    );


  getElement(
    "toggleReferenceBtn"
  )
    ?.addEventListener(
      "click",
      () => {

        APP_STATE.settings.reference =
          !APP_STATE.settings
            .reference;


        const setting =
          getElement(
            "settingReference"
          );


        if (setting) {

          setting.checked =
            APP_STATE.settings
              .reference;

        }


        saveSettings();

        applySettingsToAnalysis();

      }
    );


  getElement(
    "toggleBarPathBtn"
  )
    ?.addEventListener(
      "click",
      () => {

        APP_STATE.settings.barPath =
          !APP_STATE.settings
            .barPath;


        const setting =
          getElement(
            "settingBarPath"
          );


        if (setting) {

          setting.checked =
            APP_STATE.settings
              .barPath;

        }


        saveSettings();

        applySettingsToAnalysis();

      }
    );

}


/* =========================================================
   69. SELECTED ATHLETE VALIDATION
========================================================= */

function validateSelectedAthlete() {

  if (
    !APP_STATE.athletes.length
  ) {

    APP_STATE.selectedAthleteId =
      null;

    return;

  }


  const exists =
    APP_STATE.athletes.some(
      athlete =>
        String(athlete.id) ===
        String(
          APP_STATE.selectedAthleteId
        )
    );


  if (!exists) {

    APP_STATE.selectedAthleteId =
      APP_STATE.athletes[0].id;


    localStorage.setItem(
      APP_CONFIG.storage
        .selectedAthlete,
      APP_STATE.selectedAthleteId
    );

  }

}


/* =========================================================
   70. ANALYSIS API COMPATIBILITY
========================================================= */

window.WeightLabApp = {

  getAthletes() {

    return APP_STATE.athletes;

  },


  getSelectedAthlete() {

    return getSelectedAthlete();

  },


  getExercises() {

    return getExerciseDatabase();

  },


  getAnalyses() {

    return APP_STATE.analyses;

  },


  saveAnalysis(
    analysis
  ) {

    const record =
      normalizeAnalysisRecord(
        analysis
      );


    APP_STATE.analyses.push(
      record
    );


    window.latestWeightAnalysis =
      record;


    saveAnalyses();

    renderDashboard();

    renderRecords();


    return record;

  },


  selectAthlete(
    athleteId
  ) {

    selectAthlete(
      athleteId
    );

  },


  openAnalysis(
    exerciseId = null
  ) {

    navigateToPage(
      "analysis"
    );


    if (
      exerciseId
    ) {

      const select =
        getElement(
          "analysisExercise"
        );


      if (select) {

        select.value =
          exerciseId;


        select.dispatchEvent(
          new Event(
            "change",
            {
              bubbles:
                true
            }
          )
        );

      }

    }

  },


  refresh() {

    populateAllAthleteSelectors();

    populateExerciseSelectors();

    renderAthletes();

    renderExercises();

    renderRecords();

    renderDashboard();

  }

};


/* =========================================================
   71. INITIALIZE APPLICATION
========================================================= */

function initializeApplication() {

  console.log(
    "===================================="
  );

  console.log(
    "SEOLCHEON HIGH SCHOOL"
  );

  console.log(
    "WEIGHT PERFORMANCE LAB"
  );

  console.log(
    `VERSION ${APP_CONFIG.version}`
  );

  console.log(
    "===================================="
  );


  loadApplicationData();

  validateSelectedAthlete();

  syncGlobals();


  /* -------------------------
     NAVIGATION
  ------------------------- */

  bindNavigation();


  /* -------------------------
     ATHLETE
  ------------------------- */

  getElement(
    "athleteForm"
  )
    ?.addEventListener(
      "submit",
      handleAthleteForm
    );


  bindAthleteSearch();


  /* -------------------------
     EXERCISE
  ------------------------- */

  bindExerciseFilters();

  bindExerciseModal();


  /* -------------------------
     RECORD
  ------------------------- */

  bindRecordEvents();


  /* -------------------------
     PROGRAM
  ------------------------- */

  bindProgramEvents();


  /* -------------------------
     SETTINGS
  ------------------------- */

  bindSettings();

  bindDataEvents();

  bindAnalysisDisplayButtons();


  /* -------------------------
     OTHER
  ------------------------- */

  bindCoachMode();

  bindAnalysisTargetRep();

  bindDashboardPeriod();

  bindKeyboard();

  bindSidebarOutsideClick();


  /* -------------------------
     ANALYSIS COMPLETE EVENT
  ------------------------- */

  window.addEventListener(
    "weight-analysis-complete",
    handleAnalysisComplete
  );


  /* -------------------------
     SELECTORS
  ------------------------- */

  populateAllAthleteSelectors();

  populateExerciseSelectors();


  /* -------------------------
     INITIAL RENDER
  ------------------------- */

  renderAthletes();

  renderExercises();

  renderRecords();

  renderProgramExercises();

  renderSettings();

  applySettingsToAnalysis();

  renderDashboard();


  /* -------------------------
     CLOCK
  ------------------------- */

  updateHeaderClock();


  setInterval(
    updateHeaderClock,
    1000
  );


  /* -------------------------
     ENGINE STATUS
  ------------------------- */

  setText(
    "analysisEngineStatus",
    "ENGINE READY"
  );


  console.log(
    "[WEIGHT PERFORMANCE LAB] APP READY"
  );

}


/* =========================================================
   72. DOM READY
========================================================= */

if (
  document.readyState ===
  "loading"
) {

  document.addEventListener(
    "DOMContentLoaded",
    initializeApplication
  );

}

else {

  initializeApplication();

}