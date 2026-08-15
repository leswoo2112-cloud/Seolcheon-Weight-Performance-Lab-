/* =========================================================
   설천고 WEIGHT PERFORMANCE LAB
   APP.JS
   PART 1 / 3

   CORE
   - App State
   - LocalStorage Database
   - Page Navigation
   - Mobile Sidebar
   - Header Clock
   - Athlete Management
   - Athlete Select Sync
   - Dashboard Base
========================================================= */

"use strict";


/* =========================================================
   01. APP CONFIG
========================================================= */

const APP_CONFIG = {

  name: "설천고 WEIGHT PERFORMANCE LAB",

  version: "2.0.0",

  storage: {

    athletes: "weightLabAthletes",

    analyses: "weightLabAnalyses",

    programs: "weightLabPrograms",

    settings: "weightLabSettings",

    selectedAthlete: "weightLabSelectedAthlete",

    selectedExercise: "weightLabSelectedExercise"

  }

};


/* =========================================================
   02. APP STATE
========================================================= */

const APP_STATE = {

  currentPage: "dashboard",

  athletes: [],

  analyses: [],

  programs: [],

  selectedAthleteId: null,

  currentProgramExercises: [],

  charts: {

    radar: null,

    trend: null

  }

};


window.APP_STATE = APP_STATE;


/* =========================================================
   03. SAFE JSON
========================================================= */

function safeJSONParse(value, fallback) {

  try {

    if (!value) {

      return fallback;

    }

    const parsed = JSON.parse(value);

    return parsed ?? fallback;

  }

  catch (error) {

    console.warn(
      "[WEIGHT LAB] JSON parse error:",
      error
    );

    return fallback;

  }

}


/* =========================================================
   04. LOAD DATABASE
========================================================= */

function loadDatabase() {

  APP_STATE.athletes = safeJSONParse(

    localStorage.getItem(
      APP_CONFIG.storage.athletes
    ),

    []

  );


  APP_STATE.analyses = safeJSONParse(

    localStorage.getItem(
      APP_CONFIG.storage.analyses
    ),

    []

  );


  APP_STATE.programs = safeJSONParse(

    localStorage.getItem(
      APP_CONFIG.storage.programs
    ),

    []

  );


  APP_STATE.selectedAthleteId =

    localStorage.getItem(
      APP_CONFIG.storage.selectedAthlete
    ) || null;


  if (
    !Array.isArray(
      APP_STATE.athletes
    )
  ) {

    APP_STATE.athletes = [];

  }


  if (
    !Array.isArray(
      APP_STATE.analyses
    )
  ) {

    APP_STATE.analyses = [];

  }


  if (
    !Array.isArray(
      APP_STATE.programs
    )
  ) {

    APP_STATE.programs = [];

  }

}


/* =========================================================
   05. SAVE DATABASE
========================================================= */

function saveAthletes() {

  localStorage.setItem(

    APP_CONFIG.storage.athletes,

    JSON.stringify(
      APP_STATE.athletes
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

}


function savePrograms() {

  localStorage.setItem(

    APP_CONFIG.storage.programs,

    JSON.stringify(
      APP_STATE.programs
    )

  );

}


function saveSelectedAthlete() {

  if (
    APP_STATE.selectedAthleteId
  ) {

    localStorage.setItem(

      APP_CONFIG.storage.selectedAthlete,

      APP_STATE.selectedAthleteId

    );

  }

  else {

    localStorage.removeItem(

      APP_CONFIG.storage.selectedAthlete

    );

  }

}


/* =========================================================
   06. ID
========================================================= */

function createID(prefix = "item") {

  if (
    window.crypto &&
    typeof crypto.randomUUID ===
    "function"
  ) {

    return (
      prefix +
      "-" +
      crypto.randomUUID()
    );

  }


  return (

    prefix +
    "-" +
    Date.now() +
    "-" +
    Math.random()
      .toString(36)
      .slice(2, 10)

  );

}


/* =========================================================
   07. HTML ESCAPE
========================================================= */

function escapeHTML(value) {

  return String(
    value ?? ""
  )

    .replaceAll(
      "&",
      "&amp;"
    )

    .replaceAll(
      "<",
      "&lt;"
    )

    .replaceAll(
      ">",
      "&gt;"
    )

    .replaceAll(
      '"',
      "&quot;"
    )

    .replaceAll(
      "'",
      "&#039;"
    );

}


/* =========================================================
   08. TOAST
========================================================= */

let toastTimer = null;


function showToast(
  message,
  duration = 2200
) {

  const toast =

    document.getElementById(
      "toast"
    );


  if (!toast) {

    console.log(message);

    return;

  }


  clearTimeout(
    toastTimer
  );


  toast.textContent =
    message;


  toast.classList.add(
    "show"
  );


  toastTimer = setTimeout(
    () => {

      toast.classList.remove(
        "show"
      );

    },

    duration
  );

}


window.showToast =
  showToast;


/* =========================================================
   09. PAGE NAVIGATION
========================================================= */

function showPage(pageName) {

  const targetPage =

    document.getElementById(
      `page-${pageName}`
    );


  if (!targetPage) {

    console.warn(
      "[WEIGHT LAB] Page not found:",
      pageName
    );

    return;

  }


  document
    .querySelectorAll(".page")
    .forEach(page => {

      page.classList.remove(
        "active"
      );

    });


  targetPage.classList.add(
    "active"
  );


  document
    .querySelectorAll(".nav-item")
    .forEach(button => {

      button.classList.toggle(

        "active",

        button.dataset.page ===
          pageName

      );

    });


  APP_STATE.currentPage =
    pageName;


  const sidebar =

    document.getElementById(
      "sidebar"
    );


  sidebar?.classList.remove(
    "open"
  );


  window.scrollTo({

    top: 0,

    behavior: "smooth"

  });


  /* 페이지 진입 업데이트 */

  if (
    pageName === "dashboard"
  ) {

    renderDashboard();

  }


  if (
    pageName === "athletes"
  ) {

    renderAthleteList();

  }


  if (
    pageName === "records"
  ) {

    if (
      typeof window.renderRecords ===
      "function"
    ) {

      window.renderRecords();

    }

  }


  if (
    pageName === "program"
  ) {

    renderProgramBuilder();

  }


  if (
    pageName === "report"
  ) {

    syncAthleteSelects();

  }

}


window.showPage =
  showPage;


/* =========================================================
   10. NAVIGATION EVENTS
========================================================= */

function setupNavigation() {

  document
    .querySelectorAll(
      ".nav-item"
    )
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          const page =

            button.dataset.page;


          if (page) {

            showPage(page);

          }

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

          const page =

            button.dataset.pageTarget;


          if (page) {

            showPage(page);

          }

        }
      );

    });

}


/* =========================================================
   11. MOBILE SIDEBAR
========================================================= */

function setupMobileSidebar() {

  const button =

    document.getElementById(
      "mobileMenuBtn"
    );


  const sidebar =

    document.getElementById(
      "sidebar"
    );


  if (
    !button ||
    !sidebar
  ) {

    return;

  }


  button.addEventListener(
    "click",
    () => {

      sidebar.classList.toggle(
        "open"
      );

    }
  );


  document.addEventListener(
    "click",
    event => {

      if (
        window.innerWidth > 900
      ) {

        return;

      }


      if (
        !sidebar.classList.contains(
          "open"
        )
      ) {

        return;

      }


      const insideSidebar =

        sidebar.contains(
          event.target
        );


      const menuButton =

        button.contains(
          event.target
        );


      if (
        !insideSidebar &&
        !menuButton
      ) {

        sidebar.classList.remove(
          "open"
        );

      }

    }
  );

}


/* =========================================================
   12. HEADER CLOCK
========================================================= */

function updateHeaderClock() {

  const dateElement =

    document.getElementById(
      "headerDate"
    );


  const timeElement =

    document.getElementById(
      "headerTime"
    );


  const now = new Date();


  if (dateElement) {

    dateElement.textContent =

      new Intl.DateTimeFormat(
        "ko-KR",
        {
          year: "numeric",
          month: "2-digit",
          day: "2-digit"
        }
      ).format(now);

  }


  if (timeElement) {

    timeElement.textContent =

      new Intl.DateTimeFormat(
        "ko-KR",
        {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false
        }
      ).format(now);

  }

}


/* =========================================================
   13. ATHLETE GETTERS
========================================================= */

function getAthleteById(id) {

  return (

    APP_STATE.athletes.find(
      athlete =>
        athlete.id === id
    ) || null

  );

}


window.getAthleteById =
  getAthleteById;


function getSelectedAthlete() {

  if (
    !APP_STATE.selectedAthleteId
  ) {

    return null;

  }


  return getAthleteById(

    APP_STATE.selectedAthleteId

  );

}


window.getSelectedAthlete =
  getSelectedAthlete;


/* =========================================================
   14. ATHLETE FORM
========================================================= */

function setupAthleteForm() {

  const form =

    document.getElementById(
      "athleteForm"
    );


  if (!form) return;


  form.addEventListener(
    "submit",
    event => {

      event.preventDefault();


      const name =

        document
          .getElementById(
            "athleteName"
          )
          ?.value
          .trim();


      if (!name) {

        showToast(
          "선수 이름을 입력하세요."
        );

        return;

      }


      const athlete = {

        id:
          createID(
            "athlete"
          ),

        name,

        birth:
          document
            .getElementById(
              "athleteBirth"
            )
            ?.value || "",

        sport:
          document
            .getElementById(
              "athleteSport"
            )
            ?.value
            .trim() || "",

        height:
          Number(
            document
              .getElementById(
                "athleteHeight"
              )
              ?.value
          ) || 0,

        weight:
          Number(
            document
              .getElementById(
                "athleteWeight"
              )
              ?.value
          ) || 0,

        group:
          document
            .getElementById(
              "athleteGroup"
            )
            ?.value
            .trim() || "",

        memo:
          document
            .getElementById(
              "athleteMemo"
            )
            ?.value
            .trim() || "",

        createdAt:
          new Date()
            .toISOString()

      };


      APP_STATE.athletes.push(
        athlete
      );


      APP_STATE.selectedAthleteId =
        athlete.id;


      saveAthletes();

      saveSelectedAthlete();


      form.reset();


      renderAthleteList();

      syncAthleteSelects();

      renderDashboard();


      showToast(
        `${athlete.name} 선수 등록 완료`
      );

    }
  );

}


/* =========================================================
   15. ATHLETE LIST
========================================================= */

function renderAthleteList() {

  const container =

    document.getElementById(
      "athleteList"
    );


  if (!container) return;


  const search =

    document
      .getElementById(
        "athleteSearch"
      )
      ?.value
      .trim()
      .toLowerCase() || "";


  const athletes =

    APP_STATE.athletes.filter(
      athlete => {

        const text =

          `${athlete.name}
           ${athlete.sport}
           ${athlete.group}`

            .toLowerCase();


        return (
          !search ||
          text.includes(search)
        );

      }
    );


  container.innerHTML = "";


  if (!athletes.length) {

    container.innerHTML = `

      <div class="empty-state">

        등록된 선수가 없습니다.

      </div>

    `;

    return;

  }


  athletes.forEach(
    athlete => {

      const selected =

        athlete.id ===
        APP_STATE.selectedAthleteId;


      const card =

        document.createElement(
          "article"
        );


      card.className =

        `athlete-card ${
          selected
            ? "selected"
            : ""
        }`;


      card.innerHTML = `

        <div class="athlete-card-avatar">

          👤

        </div>


        <div class="athlete-card-info">

          <span class="eyebrow">

            ${
              escapeHTML(
                athlete.group ||
                "ATHLETE"
              )
            }

          </span>


          <h3>

            ${
              escapeHTML(
                athlete.name
              )
            }

          </h3>


          <p>

            ${
              escapeHTML(
                athlete.sport ||
                "종목 미등록"
              )
            }

          </p>


          <div class="athlete-card-data">

            <span>

              ${
                athlete.height
                  ? athlete.height +
                    " cm"
                  : "-"
              }

            </span>

            <span>

              ${
                athlete.weight
                  ? athlete.weight +
                    " kg"
                  : "-"
              }

            </span>

          </div>

        </div>


        <div class="athlete-card-actions">

          <button
            class="secondary-button select-athlete-btn"
            type="button"
          >

            ${
              selected
                ? "선택됨"
                : "선택"
            }

          </button>


          <button
            class="primary-button analyze-athlete-btn"
            type="button"
          >

            자세 분석

          </button>


          <button
            class="danger-button delete-athlete-btn"
            type="button"
          >

            삭제

          </button>

        </div>

      `;


      /* 선수 선택 */

      card
        .querySelector(
          ".select-athlete-btn"
        )
        ?.addEventListener(
          "click",
          () => {

            selectAthlete(
              athlete.id
            );

          }
        );


      /* 선수 → 자세분석 */

      card
        .querySelector(
          ".analyze-athlete-btn"
        )
        ?.addEventListener(
          "click",
          () => {

            selectAthlete(
              athlete.id
            );


            showPage(
              "analysis"
            );


            const select =

              document.getElementById(
                "analysisAthlete"
              );


            if (select) {

              select.value =
                athlete.id;

            }


            showToast(

              `${athlete.name} 선수 분석 준비`

            );

          }
        );


      /* 삭제 */

      card
        .querySelector(
          ".delete-athlete-btn"
        )
        ?.addEventListener(
          "click",
          () => {

            deleteAthlete(
              athlete.id
            );

          }
        );


      container.appendChild(
        card
      );

    }
  );

}


/* =========================================================
   16. SELECT ATHLETE
========================================================= */

function selectAthlete(id) {

  const athlete =

    getAthleteById(id);


  if (!athlete) {

    return;

  }


  APP_STATE.selectedAthleteId =
    athlete.id;


  saveSelectedAthlete();


  syncAthleteSelects();

  renderAthleteList();

  renderDashboard();


  showToast(

    `${athlete.name} 선수 선택`

  );

}


window.selectAthlete =
  selectAthlete;


/* =========================================================
   17. DELETE ATHLETE
========================================================= */

function deleteAthlete(id) {

  const athlete =

    getAthleteById(id);


  if (!athlete) return;


  const confirmed =

    window.confirm(

      `${athlete.name} 선수를 삭제할까요?\n\n분석 기록은 자동 삭제되지 않습니다.`

    );


  if (!confirmed) {

    return;

  }


  APP_STATE.athletes =

    APP_STATE.athletes.filter(
      item =>
        item.id !== id
    );


  if (
    APP_STATE.selectedAthleteId ===
    id
  ) {

    APP_STATE.selectedAthleteId =

      APP_STATE.athletes[0]?.id ||
      null;

  }


  saveAthletes();

  saveSelectedAthlete();


  renderAthleteList();

  syncAthleteSelects();

  renderDashboard();


  showToast(
    "선수를 삭제했습니다."
  );

}


/* =========================================================
   18. ATHLETE SEARCH
========================================================= */

function setupAthleteSearch() {

  document
    .getElementById(
      "athleteSearch"
    )
    ?.addEventListener(
      "input",
      renderAthleteList
    );

}


/* =========================================================
   19. SYNC ATHLETE SELECTS
========================================================= */

function syncAthleteSelects() {

  const ids = [

    "analysisAthlete",

    "programAthlete",

    "reportAthlete"

  ];


  ids.forEach(id => {

    const select =

      document.getElementById(id);


    if (!select) return;


    const previous =

      select.value;


    select.innerHTML = `

      <option value="">

        선수 선택

      </option>

    `;


    APP_STATE.athletes.forEach(
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
      APP_STATE.selectedAthleteId &&
      getAthleteById(
        APP_STATE.selectedAthleteId
      )
    ) {

      select.value =

        APP_STATE.selectedAthleteId;

    }

    else if (
      previous &&
      getAthleteById(previous)
    ) {

      select.value =
        previous;

    }

  });


  /* 기록 필터 */

  const recordFilter =

    document.getElementById(
      "recordAthleteFilter"
    );


  if (recordFilter) {

    const previous =
      recordFilter.value;


    recordFilter.innerHTML = `

      <option value="all">

        전체 선수

      </option>

    `;


    APP_STATE.athletes.forEach(
      athlete => {

        const option =

          document.createElement(
            "option"
          );


        option.value =
          athlete.id;


        option.textContent =
          athlete.name;


        recordFilter.appendChild(
          option
        );

      }
    );


    if (
      previous === "all" ||
      getAthleteById(previous)
    ) {

      recordFilter.value =
        previous;

    }

  }

}


/* =========================================================
   20. ANALYSIS ATHLETE CHANGE
========================================================= */

function setupAthleteSelectChange() {

  const analysisAthlete =

    document.getElementById(
      "analysisAthlete"
    );


  analysisAthlete?.addEventListener(
    "change",
    () => {

      if (
        analysisAthlete.value
      ) {

        APP_STATE.selectedAthleteId =

          analysisAthlete.value;


        saveSelectedAthlete();

        renderDashboard();

        renderAthleteList();

      }

    }
  );


  const reportAthlete =

    document.getElementById(
      "reportAthlete"
    );


  reportAthlete?.addEventListener(
    "change",
    () => {

      if (
        reportAthlete.value
      ) {

        APP_STATE.selectedAthleteId =

          reportAthlete.value;


        saveSelectedAthlete();

      }

    }
  );

}


/* =========================================================
   21. DASHBOARD ATHLETE
========================================================= */

function renderDashboardAthlete() {

  const athlete =

    getSelectedAthlete();


  const name =

    document.getElementById(
      "dashboardAthleteName"
    );


  const sport =

    document.getElementById(
      "dashboardAthleteSport"
    );


  const height =

    document.getElementById(
      "dashboardHeight"
    );


  const weight =

    document.getElementById(
      "dashboardWeight"
    );


  const latestScore =

    document.getElementById(
      "dashboardLatestScore"
    );


  if (!athlete) {

    if (name) {

      name.textContent =
        "선수 미선택";

    }


    if (sport) {

      sport.textContent =
        "-";

    }


    if (height) {

      height.textContent =
        "-";

    }


    if (weight) {

      weight.textContent =
        "-";

    }


    if (latestScore) {

      latestScore.textContent =
        "-";

    }


    return;

  }


  if (name) {

    name.textContent =
      athlete.name;

  }


  if (sport) {

    sport.textContent =

      athlete.sport || "-";

  }


  if (height) {

    height.textContent =

      athlete.height
        ? `${athlete.height} cm`
        : "-";

  }


  if (weight) {

    weight.textContent =

      athlete.weight
        ? `${athlete.weight} kg`
        : "-";

  }


  const analyses =

    APP_STATE.analyses

      .filter(
        analysis =>
          analysis.athleteId ===
          athlete.id
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


  if (latestScore) {

    latestScore.textContent =

      analyses[0]?.score
        ? analyses[0].score
        : "-";

  }

}


/* =========================================================
   22. DASHBOARD KPI
========================================================= */

function renderDashboardKPI() {

  const athleteCount =

    document.getElementById(
      "dashboardAthleteCount"
    );


  const analysisCount =

    document.getElementById(
      "dashboardAnalysisCount"
    );


  const averageScore =

    document.getElementById(
      "dashboardAverageScore"
    );


  const prCount =

    document.getElementById(
      "dashboardPRCount"
    );


  if (athleteCount) {

    athleteCount.textContent =

      APP_STATE.athletes.length;

  }


  if (analysisCount) {

    analysisCount.textContent =

      APP_STATE.analyses.length;

  }


  const scores =

    APP_STATE.analyses

      .map(
        item =>
          Number(
            item.score
          )
      )

      .filter(
        Number.isFinite
      );


  if (averageScore) {

    if (!scores.length) {

      averageScore.textContent =
        "--";

    }

    else {

      const average =

        scores.reduce(
          (sum, value) =>
            sum + value,
          0
        ) /
        scores.length;


      averageScore.textContent =

        Math.round(
          average
        );

    }

  }


  if (prCount) {

    const count =

      APP_STATE.analyses.filter(
        item =>
          item.isPR === true
      ).length;


    prCount.textContent =
      count;

  }

}


/* =========================================================
   23. DEFAULT RADAR
========================================================= */

function getAthleteRadarData() {

  const athlete =

    getSelectedAthlete();


  if (!athlete) {

    return {

      strength: 0,

      power: 0,

      stability: 0,

      symmetry: 0,

      mobility: 0,

      technique: 0

    };

  }


  const records =

    APP_STATE.analyses.filter(
      analysis =>
        analysis.athleteId ===
        athlete.id
    );


  if (!records.length) {

    return {

      strength: 0,

      power: 0,

      stability: 0,

      symmetry: 0,

      mobility: 0,

      technique: 0

    };

  }


  const latest =

    [...records].sort(
      (a, b) =>
        new Date(
          b.createdAt
        ) -
        new Date(
          a.createdAt
        )
    )[0];


  return {

    strength:
      Number(
        latest.strength
      ) || 0,

    power:
      Number(
        latest.power
      ) || 0,

    stability:
      Number(
        latest.stability
      ) || 0,

    symmetry:
      Number(
        latest.symmetry
      ) || 0,

    mobility:
      Number(
        latest.mobility
      ) || 0,

    technique:
      Number(
        latest.technique
      ) || 0

  };

}


/* =========================================================
   24. RADAR VALUES
========================================================= */

function renderRadarValues() {

  const data =
    getAthleteRadarData();


  const mapping = {

    radarStrength:
      data.strength,

    radarPower:
      data.power,

    radarStability:
      data.stability,

    radarSymmetry:
      data.symmetry,

    radarMobility:
      data.mobility,

    radarTechnique:
      data.technique

  };


  Object.entries(
    mapping
  ).forEach(
    ([id, value]) => {

      const element =

        document.getElementById(
          id
        );


      if (element) {

        element.textContent =
          Math.round(value);

      }

    }
  );

}


/* =========================================================
   25. PERFORMANCE RADAR CHART
========================================================= */

function renderPerformanceRadar() {

  const canvas =

    document.getElementById(
      "performanceRadar"
    );


  if (
    !canvas ||
    typeof Chart ===
      "undefined"
  ) {

    return;

  }


  const data =
    getAthleteRadarData();


  if (
    APP_STATE.charts.radar
  ) {

    APP_STATE.charts.radar.destroy();

  }


  APP_STATE.charts.radar =

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

                data.strength,

                data.power,

                data.stability,

                data.symmetry,

                data.mobility,

                data.technique

              ],

              borderWidth: 2,

              pointRadius: 3,

              fill: true

            }

          ]

        },

        options: {

          responsive: true,

          maintainAspectRatio:
            false,

          animation: {

            duration: 500

          },

          plugins: {

            legend: {

              display: false

            }

          },

          scales: {

            r: {

              beginAtZero: true,

              min: 0,

              max: 100,

              ticks: {

                display: false,

                stepSize: 20

              },

              pointLabels: {

                font: {

                  size: 12,

                  weight: "600"

                }

              }

            }

          }

        }

      }
    );

}


/* =========================================================
   26. PERFORMANCE TREND
========================================================= */

function renderPerformanceTrend() {

  const canvas =

    document.getElementById(
      "performanceTrendChart"
    );


  if (
    !canvas ||
    typeof Chart ===
      "undefined"
  ) {

    return;

  }


  const athlete =

    getSelectedAthlete();


  const period =

    Number(
      document
        .getElementById(
          "dashboardPeriod"
        )
        ?.value
    ) || 7;


  let records =

    APP_STATE.analyses;


  if (athlete) {

    records = records.filter(
      record =>
        record.athleteId ===
        athlete.id
    );

  }


  records =

    [...records]

      .sort(
        (a, b) =>
          new Date(
            a.createdAt
          ) -
          new Date(
            b.createdAt
          )
      )

      .slice(-period);


  const labels =

    records.map(
      (_, index) =>
        `${index + 1}회`
    );


  const scores =

    records.map(
      record =>
        Number(
          record.score
        ) || 0
    );


  if (
    APP_STATE.charts.trend
  ) {

    APP_STATE.charts.trend.destroy();

  }


  APP_STATE.charts.trend =

    new Chart(
      canvas,
      {

        type: "line",

        data: {

          labels,

          datasets: [

            {

              label:
                "자세 점수",

              data:
                scores,

              borderWidth: 2,

              tension: 0.3,

              pointRadius: 3

            }

          ]

        },

        options: {

          responsive: true,

          maintainAspectRatio:
            false,

          plugins: {

            legend: {

              display: false

            }

          },

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
   27. RECENT ANALYSIS
========================================================= */

function renderRecentAnalysis() {

  const container =

    document.getElementById(
      "dashboardRecentList"
    );


  if (!container) return;


  let records =

    [...APP_STATE.analyses];


  const athlete =

    getSelectedAthlete();


  if (athlete) {

    records = records.filter(
      record =>
        record.athleteId ===
        athlete.id
    );

  }


  records = records

    .sort(
      (a, b) =>
        new Date(
          b.createdAt
        ) -
        new Date(
          a.createdAt
        )
    )

    .slice(0, 5);


  if (!records.length) {

    container.innerHTML = `

      <div class="empty-state">

        아직 분석 기록이 없습니다.

      </div>

    `;

    return;

  }


  container.innerHTML = "";


  records.forEach(
    record => {

      const athleteData =

        getAthleteById(
          record.athleteId
        );


      const exercise =

        typeof window.getExerciseById ===
        "function"

          ? window.getExerciseById(
              record.exerciseId
            )

          : null;


      const row =

        document.createElement(
          "div"
        );


      row.className =
        "recent-item";


      row.innerHTML = `

        <div>

          <strong>

            ${
              escapeHTML(
                exercise?.name ||
                record.exerciseName ||
                "웨이트 분석"
              )
            }

          </strong>

          <span>

            ${
              escapeHTML(
                athleteData?.name ||
                record.athleteName ||
                "-"
              )
            }

          </span>

        </div>


        <strong class="recent-score">

          ${
            Number(
              record.score
            ) || 0
          }

        </strong>

      `;


      container.appendChild(
        row
      );

    }
  );

}


/* =========================================================
   28. RECENT PR
========================================================= */

function renderRecentPR() {

  const container =

    document.getElementById(
      "dashboardPRList"
    );


  if (!container) return;


  const records =

    APP_STATE.analyses

      .filter(
        record =>
          record.isPR === true
      )

      .sort(
        (a, b) =>
          new Date(
            b.createdAt
          ) -
          new Date(
            a.createdAt
          )
      )

      .slice(0, 5);


  if (!records.length) {

    container.innerHTML = `

      <div class="empty-state">

        기록된 PR이 없습니다.

      </div>

    `;

    return;

  }


  container.innerHTML = "";


  records.forEach(
    record => {

      const exercise =

        typeof window.getExerciseById ===
        "function"

          ? window.getExerciseById(
              record.exerciseId
            )

          : null;


      const row =

        document.createElement(
          "div"
        );


      row.className =
        "pr-item";


      row.innerHTML = `

        <div>

          <span class="eyebrow">

            PERSONAL RECORD

          </span>

          <strong>

            ${
              escapeHTML(
                exercise?.name ||
                record.exerciseName ||
                "운동"
              )
            }

          </strong>

        </div>


        <strong>

          ${
            record.weight
              ? record.weight +
                " kg"
              : record.score +
                "점"
          }

        </strong>

      `;


      container.appendChild(
        row
      );

    }
  );

}


/* =========================================================
   29. DASHBOARD
========================================================= */

function renderDashboard() {

  renderDashboardKPI();

  renderDashboardAthlete();

  renderRadarValues();

  renderPerformanceRadar();

  renderPerformanceTrend();

  renderRecentAnalysis();

  renderRecentPR();

}


window.renderDashboard =
  renderDashboard;


/* =========================================================
   30. DASHBOARD PERIOD
========================================================= */

function setupDashboardPeriod() {

  document
    .getElementById(
      "dashboardPeriod"
    )
    ?.addEventListener(
      "change",
      renderPerformanceTrend
    );

}


/* =========================================================
   31. PROGRAM BASE
========================================================= */

function renderProgramBuilder() {

  syncAthleteSelects();

}


/* =========================================================
   32. COACH MODE
========================================================= */

function setupCoachMode() {

  const button =

    document.getElementById(
      "coachModeBtn"
    );


  button?.addEventListener(
    "click",
    () => {

      document.body.classList.toggle(
        "coach-mode"
      );


      const enabled =

        document.body.classList.contains(
          "coach-mode"
        );


      button.textContent =

        enabled

          ? "✓ 코치 모드"

          : "👤 코치 모드";


      showToast(

        enabled

          ? "코치 모드 활성화"

          : "코치 모드 해제"

      );

    }
  );

}


/* =========================================================
   33. INITIALIZE PART 1
========================================================= */

function initializeAppCore() {

  loadDatabase();

  setupNavigation();

  setupMobileSidebar();

  setupAthleteForm();

  setupAthleteSearch();

  setupAthleteSelectChange();

  setupDashboardPeriod();

  setupCoachMode();

  syncAthleteSelects();

  renderAthleteList();

  renderDashboard();


  updateHeaderClock();


  setInterval(
    updateHeaderClock,
    1000
  );


  console.log(
    `[WEIGHT LAB] APP CORE ${APP_CONFIG.version} READY`
  );

}


/* =========================================================
   34. START
========================================================= */

if (
  document.readyState ===
  "loading"
) {

  document.addEventListener(

    "DOMContentLoaded",

    initializeAppCore

  );

}

else {

  initializeAppCore();

}


/* =========================================================
   APP.JS PART 1 / 3 END

   ↓ PART 2를 바로 아래에 이어 붙이기
========================================================= */
/* =========================================================
   설천고 WEIGHT PERFORMANCE LAB
   APP.JS
   PART 2 / 3

   MOTION ANALYSIS ENGINE
   - Camera
   - Front / Rear Camera
   - Video Upload
   - Image Upload
   - MediaPipe Pose 33 Landmarks
   - Skeleton
   - Joint Angle
   - 2D / 3D Visualization
   - Reference Lines
   - Bar Path
   - Slow Motion
   - Frame Control
========================================================= */


/* =========================================================
   35. MOTION STATE
========================================================= */

const MOTION_STATE = {

  pose: null,

  stream: null,

  source: null,

  sourceType: null,

  running: false,

  processing: false,

  facingMode: "environment",

  view: "front",

  mode: "2d",

  showSkeleton: true,

  showReference: true,

  showBarPath: true,

  landmarks: null,

  worldLandmarks: null,

  barPath: [],

  angleHistory: {

    knee: [],

    hip: [],

    ankle: [],

    trunk: []

  },

  frameCount: 0,

  lastFrameTime: 0,

  fps: 0,

  startTime: null,

  timerInterval: null

};


window.MOTION_STATE =
  MOTION_STATE;


/* =========================================================
   36. MEDIAPIPE CONNECTIONS
========================================================= */

const BODY_CONNECTIONS = [

  [0, 1],
  [1, 2],
  [2, 3],
  [3, 7],

  [0, 4],
  [4, 5],
  [5, 6],
  [6, 8],

  [9, 10],

  [11, 12],

  [11, 13],
  [13, 15],

  [12, 14],
  [14, 16],

  [15, 17],
  [15, 19],
  [15, 21],

  [16, 18],
  [16, 20],
  [16, 22],

  [11, 23],
  [12, 24],

  [23, 24],

  [23, 25],
  [25, 27],

  [24, 26],
  [26, 28],

  [27, 29],
  [29, 31],

  [28, 30],
  [30, 32],

  [27, 31],
  [28, 32]

];


/* =========================================================
   37. LANDMARK NAME
========================================================= */

const LANDMARK_NAMES = [

  "nose",

  "left_eye_inner",
  "left_eye",
  "left_eye_outer",

  "right_eye_inner",
  "right_eye",
  "right_eye_outer",

  "left_ear",
  "right_ear",

  "mouth_left",
  "mouth_right",

  "left_shoulder",
  "right_shoulder",

  "left_elbow",
  "right_elbow",

  "left_wrist",
  "right_wrist",

  "left_pinky",
  "right_pinky",

  "left_index",
  "right_index",

  "left_thumb",
  "right_thumb",

  "left_hip",
  "right_hip",

  "left_knee",
  "right_knee",

  "left_ankle",
  "right_ankle",

  "left_heel",
  "right_heel",

  "left_foot_index",
  "right_foot_index"

];


window.LANDMARK_NAMES =
  LANDMARK_NAMES;


/* =========================================================
   38. ELEMENTS
========================================================= */

function getMotionDOM() {

  return {

    camera:
      document.getElementById(
        "cameraVideo"
      ),

    uploadedVideo:
      document.getElementById(
        "uploadedVideo"
      ),

    uploadedImage:
      document.getElementById(
        "uploadedImage"
      ),

    canvas:
      document.getElementById(
        "poseCanvas"
      ),

    barCanvas:
      document.getElementById(
        "barPathCanvas"
      ),

    placeholder:
      document.getElementById(
        "viewerPlaceholder"
      ),

    status:
      document.getElementById(
        "liveStatusBadge"
      ),

    engine:
      document.getElementById(
        "analysisEngineStatus"
      )

  };

}


/* =========================================================
   39. INITIALIZE MEDIAPIPE
========================================================= */

function initializePoseEngine() {

  if (
    typeof Pose ===
    "undefined"
  ) {

    console.error(
      "[WEIGHT LAB] MediaPipe Pose not loaded"
    );


    const status =

      document.getElementById(
        "analysisEngineStatus"
      );


    if (status) {

      status.textContent =
        "ENGINE ERROR";

    }


    return false;

  }


  try {

    const pose = new Pose({

      locateFile: file =>

        `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`

    });


    pose.setOptions({

      modelComplexity: 2,

      smoothLandmarks: true,

      enableSegmentation: false,

      smoothSegmentation: false,

      minDetectionConfidence: 0.5,

      minTrackingConfidence: 0.5

    });


    pose.onResults(
      handlePoseResults
    );


    MOTION_STATE.pose =
      pose;


    const status =

      document.getElementById(
        "analysisEngineStatus"
      );


    if (status) {

      status.textContent =
        "33 JOINT ENGINE READY";

    }


    console.log(
      "[WEIGHT LAB] MediaPipe 33 landmark engine ready"
    );


    return true;

  }

  catch (error) {

    console.error(
      error
    );


    showToast(
      "자세 분석 엔진 초기화 실패"
    );


    return false;

  }

}


/* =========================================================
   40. CAMERA
========================================================= */

async function connectCamera() {

  const dom =
    getMotionDOM();


  if (!dom.camera) {

    return;

  }


  if (
    !navigator.mediaDevices ||
    !navigator.mediaDevices.getUserMedia
  ) {

    showToast(
      "이 브라우저에서 카메라를 사용할 수 없습니다."
    );

    return;

  }


  try {

    stopCameraStream();


    const constraints = {

      audio: false,

      video: {

        facingMode: {

          ideal:
            MOTION_STATE.facingMode

        },

        width: {

          ideal: 1280

        },

        height: {

          ideal: 720

        },

        frameRate: {

          ideal: 30,

          max: 60

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


    MOTION_STATE.source =
      dom.camera;


    MOTION_STATE.sourceType =
      "camera";


    dom.camera.srcObject =
      stream;


    dom.camera.hidden =
      false;


    if (dom.uploadedVideo) {

      dom.uploadedVideo.hidden =
        true;

    }


    if (dom.uploadedImage) {

      dom.uploadedImage.hidden =
        true;

    }


    if (dom.placeholder) {

      dom.placeholder.style.display =
        "none";

    }


    await dom.camera.play();


    setLiveStatus(
      "CAMERA LIVE"
    );


    showToast(
      "카메라 연결 완료"
    );


    startPoseLoop();

  }

  catch (error) {

    console.error(
      "[CAMERA ERROR]",
      error
    );


    if (
      error.name ===
      "NotAllowedError"
    ) {

      showToast(
        "카메라 권한을 허용해주세요."
      );

    }

    else {

      showToast(
        "카메라 연결에 실패했습니다."
      );

    }

  }

}


window.connectCamera =
  connectCamera;


/* =========================================================
   41. STOP CAMERA
========================================================= */

function stopCameraStream() {

  if (
    MOTION_STATE.stream
  ) {

    MOTION_STATE.stream
      .getTracks()
      .forEach(
        track =>
          track.stop()
      );

  }


  MOTION_STATE.stream =
    null;


  const camera =

    document.getElementById(
      "cameraVideo"
    );


  if (camera) {

    camera.srcObject =
      null;

  }

}


/* =========================================================
   42. SWITCH CAMERA
========================================================= */

async function switchCamera() {

  MOTION_STATE.facingMode =

    MOTION_STATE.facingMode ===
      "environment"

      ? "user"

      : "environment";


  await connectCamera();

}


window.switchCamera =
  switchCamera;


/* =========================================================
   43. VIDEO UPLOAD
========================================================= */

function handleVideoUpload(
  event
) {

  const file =

    event.target.files?.[0];


  if (!file) {

    return;

  }


  if (
    !file.type.startsWith(
      "video/"
    )
  ) {

    showToast(
      "동영상 파일을 선택하세요."
    );

    return;

  }


  stopCameraStream();


  const dom =
    getMotionDOM();


  if (
    !dom.uploadedVideo
  ) {

    return;

  }


  const url =

    URL.createObjectURL(
      file
    );


  dom.uploadedVideo.src =
    url;


  dom.uploadedVideo.hidden =
    false;


  if (dom.camera) {

    dom.camera.hidden =
      true;

  }


  if (dom.uploadedImage) {

    dom.uploadedImage.hidden =
      true;

  }


  if (dom.placeholder) {

    dom.placeholder.style.display =
      "none";

  }


  MOTION_STATE.source =
    dom.uploadedVideo;


  MOTION_STATE.sourceType =
    "video";


  dom.uploadedVideo.onloadedmetadata =
    () => {

      dom.uploadedVideo
        .play()
        .catch(
          () => {}
        );


      startPoseLoop();


      setLiveStatus(
        "VIDEO ANALYSIS"
      );


      showToast(
        "분석 영상 로드 완료"
      );

    };

}


/* =========================================================
   44. IMAGE UPLOAD
========================================================= */

function handleImageUpload(
  event
) {

  const file =

    event.target.files?.[0];


  if (!file) {

    return;

  }


  if (
    !file.type.startsWith(
      "image/"
    )
  ) {

    showToast(
      "이미지 파일을 선택하세요."
    );

    return;

  }


  stopCameraStream();


  const dom =
    getMotionDOM();


  if (
    !dom.uploadedImage
  ) {

    return;

  }


  const url =

    URL.createObjectURL(
      file
    );


  dom.uploadedImage.src =
    url;


  dom.uploadedImage.hidden =
    false;


  if (dom.camera) {

    dom.camera.hidden =
      true;

  }


  if (dom.uploadedVideo) {

    dom.uploadedVideo.hidden =
      true;

  }


  if (dom.placeholder) {

    dom.placeholder.style.display =
      "none";

  }


  MOTION_STATE.source =
    dom.uploadedImage;


  MOTION_STATE.sourceType =
    "image";


  dom.uploadedImage.onload =
    async () => {

      setLiveStatus(
        "IMAGE ANALYSIS"
      );


      await analyzeSingleFrame(
        dom.uploadedImage
      );


      showToast(
        "사진 자세 분석 완료"
      );

    };

}


/* =========================================================
   45. POSE LOOP
========================================================= */

function startPoseLoop() {

  if (
    MOTION_STATE.running
  ) {

    return;

  }


  MOTION_STATE.running =
    true;


  requestAnimationFrame(
    poseLoop
  );

}


async function poseLoop() {

  if (
    !MOTION_STATE.running
  ) {

    return;

  }


  const source =
    MOTION_STATE.source;


  if (
    !source ||
    !MOTION_STATE.pose
  ) {

    requestAnimationFrame(
      poseLoop
    );

    return;

  }


  const ready =

    MOTION_STATE.sourceType ===
      "camera"

      ? source.readyState >= 2

      : MOTION_STATE.sourceType ===
        "video"

        ? (
            source.readyState >= 2 &&
            !source.paused &&
            !source.ended
          )

        : false;


  if (
    ready &&
    !MOTION_STATE.processing
  ) {

    MOTION_STATE.processing =
      true;


    try {

      await MOTION_STATE.pose.send({

        image:
          source

      });

    }

    catch (error) {

      console.warn(
        "[POSE FRAME ERROR]",
        error
      );

    }

    finally {

      MOTION_STATE.processing =
        false;

    }

  }


  requestAnimationFrame(
    poseLoop
  );

}


/* =========================================================
   46. SINGLE FRAME
========================================================= */

async function analyzeSingleFrame(
  source
) {

  if (
    !MOTION_STATE.pose
  ) {

    return;

  }


  try {

    await MOTION_STATE.pose.send({

      image:
        source

    });

  }

  catch (error) {

    console.error(
      error
    );

  }

}


/* =========================================================
   47. POSE RESULTS
========================================================= */

function handlePoseResults(
  results
) {

  const landmarks =

    results.poseLandmarks;


  const worldLandmarks =

    results.poseWorldLandmarks;


  if (
    !landmarks ||
    landmarks.length < 33
  ) {

    clearPoseCanvas();

    return;

  }


  MOTION_STATE.landmarks =
    landmarks;


  MOTION_STATE.worldLandmarks =
    worldLandmarks || null;


  calculateFPS();


  drawPose(
    results.image,
    landmarks,
    worldLandmarks
  );


  updateBiomechanics(
    landmarks
  );


  trackBarPath(
    landmarks
  );

}


/* =========================================================
   48. CANVAS SIZE
========================================================= */

function resizeMotionCanvas(
  canvas,
  source
) {

  if (
    !canvas ||
    !source
  ) {

    return;

  }


  const width =

    source.videoWidth ||

    source.naturalWidth ||

    source.clientWidth ||

    1280;


  const height =

    source.videoHeight ||

    source.naturalHeight ||

    source.clientHeight ||

    720;


  if (
    canvas.width !== width
  ) {

    canvas.width =
      width;

  }


  if (
    canvas.height !== height
  ) {

    canvas.height =
      height;

  }

}


/* =========================================================
   49. DRAW POSE
========================================================= */

function drawPose(
  image,
  landmarks,
  worldLandmarks
) {

  const canvas =

    document.getElementById(
      "poseCanvas"
    );


  if (!canvas) {

    return;

  }


  resizeMotionCanvas(
    canvas,
    image
  );


  const ctx =

    canvas.getContext(
      "2d"
    );


  ctx.clearRect(
    0,
    0,
    canvas.width,
    canvas.height
  );


  if (
    !MOTION_STATE.showSkeleton
  ) {

    return;

  }


  if (
    MOTION_STATE.mode ===
    "3d" &&
    worldLandmarks
  ) {

    draw3DSkeleton(

      ctx,

      landmarks,

      worldLandmarks,

      canvas.width,

      canvas.height

    );

  }

  else {

    draw2DSkeleton(

      ctx,

      landmarks,

      canvas.width,

      canvas.height

    );

  }

}


/* =========================================================
   50. 2D SKELETON
========================================================= */

function draw2DSkeleton(
  ctx,
  landmarks,
  width,
  height
) {

  ctx.save();


  ctx.lineWidth = 4;

  ctx.lineCap =
    "round";

  ctx.lineJoin =
    "round";


  BODY_CONNECTIONS.forEach(
    connection => {

      const a =

        landmarks[
          connection[0]
        ];


      const b =

        landmarks[
          connection[1]
        ];


      if (
        !isVisibleLandmark(a) ||
        !isVisibleLandmark(b)
      ) {

        return;

      }


      ctx.beginPath();


      ctx.moveTo(

        a.x * width,

        a.y * height

      );


      ctx.lineTo(

        b.x * width,

        b.y * height

      );


      ctx.stroke();

    }
  );


  landmarks.forEach(
    (point, index) => {

      if (
        !isVisibleLandmark(
          point
        )
      ) {

        return;

      }


      const x =
        point.x * width;


      const y =
        point.y * height;


      ctx.beginPath();


      ctx.arc(

        x,

        y,

        isMajorJoint(index)
          ? 7
          : 4,

        0,

        Math.PI * 2

      );


      ctx.fill();


      if (
        shouldDrawLandmarkNumber(
          index
        )
      ) {

        ctx.font =
          "12px sans-serif";


        ctx.fillText(

          String(index),

          x + 8,

          y - 8

        );

      }

    }
  );


  ctx.restore();

}


/* =========================================================
   51. 3D SKELETON

   MediaPipe world landmark의 z값을 화면상에 투영
========================================================= */

function draw3DSkeleton(
  ctx,
  landmarks,
  worldLandmarks,
  width,
  height
) {

  const projected =

    landmarks.map(
      (point, index) => {

        const world =

          worldLandmarks[index];


        const depth =

          world
            ? world.z
            : 0;


        const perspective =

          1 +
          Math.max(
            -0.25,
            Math.min(
              0.25,
              -depth * 0.2
            )
          );


        const centerX =
          width / 2;


        const centerY =
          height / 2;


        return {

          x:

            centerX +

            (
              point.x *
              width -
              centerX
            ) *
            perspective,

          y:

            centerY +

            (
              point.y *
              height -
              centerY
            ) *
            perspective,

          z:
            depth,

          visibility:
            point.visibility

        };

      }
    );


  ctx.save();


  ctx.lineWidth = 4;


  BODY_CONNECTIONS.forEach(
    connection => {

      const a =

        projected[
          connection[0]
        ];


      const b =

        projected[
          connection[1]
        ];


      if (
        !isVisibleLandmark(a) ||
        !isVisibleLandmark(b)
      ) {

        return;

      }


      ctx.beginPath();


      ctx.moveTo(
        a.x,
        a.y
      );


      ctx.lineTo(
        b.x,
        b.y
      );


      ctx.stroke();

    }
  );


  projected.forEach(
    (point, index) => {

      if (
        !isVisibleLandmark(
          point
        )
      ) {

        return;

      }


      const depthSize =

        Math.max(
          4,
          Math.min(
            10,
            7 -
            point.z * 6
          )
        );


      ctx.beginPath();


      ctx.arc(

        point.x,

        point.y,

        isMajorJoint(index)
          ? depthSize
          : depthSize * 0.65,

        0,

        Math.PI * 2

      );


      ctx.fill();

    }
  );


  drawDepthAxis(
    ctx,
    width,
    height
  );


  ctx.restore();

}


/* =========================================================
   52. 3D AXIS
========================================================= */

function drawDepthAxis(
  ctx,
  width,
  height
) {

  const x =
    width - 90;


  const y =
    height - 70;


  ctx.save();


  ctx.lineWidth = 2;


  ctx.beginPath();

  ctx.moveTo(x, y);

  ctx.lineTo(
    x + 45,
    y
  );

  ctx.stroke();


  ctx.beginPath();

  ctx.moveTo(x, y);

  ctx.lineTo(
    x,
    y - 45
  );

  ctx.stroke();


  ctx.beginPath();

  ctx.moveTo(x, y);

  ctx.lineTo(
    x - 25,
    y + 25
  );

  ctx.stroke();


  ctx.font =
    "13px sans-serif";


  ctx.fillText(
    "X",
    x + 50,
    y + 4
  );


  ctx.fillText(
    "Y",
    x - 4,
    y - 52
  );


  ctx.fillText(
    "Z",
    x - 38,
    y + 35
  );


  ctx.restore();

}


/* =========================================================
   53. VISIBILITY
========================================================= */

function isVisibleLandmark(
  landmark
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
    landmark.visibility >
    0.35
  );

}


function isMajorJoint(index) {

  return [

    11, 12,

    13, 14,

    15, 16,

    23, 24,

    25, 26,

    27, 28

  ].includes(index);

}


function shouldDrawLandmarkNumber(
  index
) {

  return [

    11, 12,

    13, 14,

    15, 16,

    23, 24,

    25, 26,

    27, 28

  ].includes(index);

}


/* =========================================================
   54. CLEAR CANVAS
========================================================= */

function clearPoseCanvas() {

  const canvas =

    document.getElementById(
      "poseCanvas"
    );


  if (!canvas) {

    return;

  }


  const ctx =

    canvas.getContext(
      "2d"
    );


  ctx.clearRect(

    0,
    0,

    canvas.width,
    canvas.height

  );

}


/* =========================================================
   55. ANGLE CALCULATION
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

    return 0;

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
      360 - angle;

  }


  return angle;

}


/* =========================================================
   56. AVERAGE ANGLE
========================================================= */

function averageValidAngles(
  ...values
) {

  const valid =

    values.filter(
      value =>
        Number.isFinite(value) &&
        value > 0
    );


  if (!valid.length) {

    return 0;

  }


  return (

    valid.reduce(
      (sum, value) =>
        sum + value,
      0
    )

    /

    valid.length

  );

}


/* =========================================================
   57. TRUNK ANGLE
========================================================= */

function calculateTrunkAngle(
  landmarks
) {

  const leftShoulder =
    landmarks[11];


  const rightShoulder =
    landmarks[12];


  const leftHip =
    landmarks[23];


  const rightHip =
    landmarks[24];


  const shoulder = {

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


  const hip = {

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

    shoulder.x -
    hip.x;


  const dy =

    hip.y -
    shoulder.y;


  return Math.abs(

    Math.atan2(
      dx,
      dy
    )

    *

    180 /
    Math.PI

  );

}


/* =========================================================
   58. BIOMECHANICS
========================================================= */

function updateBiomechanics(
  landmarks
) {

  const leftKnee =

    calculateAngle(

      landmarks[23],

      landmarks[25],

      landmarks[27]

    );


  const rightKnee =

    calculateAngle(

      landmarks[24],

      landmarks[26],

      landmarks[28]

    );


  const leftHip =

    calculateAngle(

      landmarks[11],

      landmarks[23],

      landmarks[25]

    );


  const rightHip =

    calculateAngle(

      landmarks[12],

      landmarks[24],

      landmarks[26]

    );


  const leftAnkle =

    calculateAngle(

      landmarks[25],

      landmarks[27],

      landmarks[31]

    );


  const rightAnkle =

    calculateAngle(

      landmarks[26],

      landmarks[28],

      landmarks[32]

    );


  const knee =

    averageValidAngles(
      leftKnee,
      rightKnee
    );


  const hip =

    averageValidAngles(
      leftHip,
      rightHip
    );


  const ankle =

    averageValidAngles(
      leftAnkle,
      rightAnkle
    );


  const trunk =

    calculateTrunkAngle(
      landmarks
    );


  const symmetry =

    calculateSymmetryScore(
      leftKnee,
      rightKnee,
      leftHip,
      rightHip
    );


  const stability =

    calculateStabilityScore(
      landmarks
    );


  const rom =

    calculateROMScore(
      knee,
      hip,
      ankle
    );


  const technique =

    calculateTechniqueScore(

      knee,

      hip,

      ankle,

      trunk,

      symmetry,

      stability

    );


  updateMetricText(

    "kneeAngle",

    `${Math.round(knee)}°`

  );


  updateMetricText(

    "hipAngle",

    `${Math.round(hip)}°`

  );


  updateMetricText(

    "ankleAngle",

    `${Math.round(ankle)}°`

  );


  updateMetricText(

    "trunkAngle",

    `${Math.round(trunk)}°`

  );


  updateMetricText(

    "liveKnee",

    `${Math.round(knee)}°`

  );


  updateMetricText(

    "liveHip",

    `${Math.round(hip)}°`

  );


  updateMetricText(

    "liveAnkle",

    `${Math.round(ankle)}°`

  );


  updateMetricText(

    "liveTrunk",

    `${Math.round(trunk)}°`

  );


  updateMetricText(

    "liveSymmetry",

    Math.round(symmetry)

  );


  updateMetricText(

    "liveStability",

    Math.round(stability)

  );


  updateMetricText(

    "liveROM",

    Math.round(rom)

  );


  updateMetricText(

    "liveTechnique",

    Math.round(technique)

  );


  updateMetricText(

    "currentPoseScore",

    Math.round(

      (
        symmetry +
        stability +
        rom +
        technique
      ) / 4

    )

  );


  pushAngleHistory(

    knee,

    hip,

    ankle,

    trunk

  );

}


/* =========================================================
   59. SYMMETRY
========================================================= */

function calculateSymmetryScore(
  leftKnee,
  rightKnee,
  leftHip,
  rightHip
) {

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


  const difference =

    (
      kneeDifference +
      hipDifference
    ) / 2;


  return clamp(

    100 -
    difference * 2,

    0,

    100

  );

}


/* =========================================================
   60. STABILITY
========================================================= */

function calculateStabilityScore(
  landmarks
) {

  const leftShoulder =
    landmarks[11];


  const rightShoulder =
    landmarks[12];


  const leftHip =
    landmarks[23];


  const rightHip =
    landmarks[24];


  const shoulderTilt =

    Math.abs(

      leftShoulder.y -
      rightShoulder.y

    ) * 500;


  const hipTilt =

    Math.abs(

      leftHip.y -
      rightHip.y

    ) * 500;


  return clamp(

    100 -
    shoulderTilt -
    hipTilt,

    0,

    100

  );

}


/* =========================================================
   61. ROM
========================================================= */

function calculateROMScore(
  knee,
  hip,
  ankle
) {

  let score = 100;


  if (
    knee > 175
  ) {

    score -= 8;

  }


  if (
    hip > 175
  ) {

    score -= 6;

  }


  if (
    ankle < 60 ||
    ankle > 170
  ) {

    score -= 8;

  }


  return clamp(
    score,
    0,
    100
  );

}


/* =========================================================
   62. TECHNIQUE
========================================================= */

function calculateTechniqueScore(
  knee,
  hip,
  ankle,
  trunk,
  symmetry,
  stability
) {

  let score =

    symmetry * 0.35 +

    stability * 0.35 +

    30;


  if (
    trunk > 55
  ) {

    score -= 8;

  }


  if (
    knee <= 0 ||
    hip <= 0 ||
    ankle <= 0
  ) {

    score -= 15;

  }


  return clamp(
    score,
    0,
    100
  );

}


/* =========================================================
   63. CLAMP
========================================================= */

function clamp(
  value,
  min,
  max
) {

  return Math.max(

    min,

    Math.min(
      max,
      value
    )

  );

}


/* =========================================================
   64. UPDATE TEXT
========================================================= */

function updateMetricText(
  id,
  value
) {

  const element =

    document.getElementById(
      id
    );


  if (element) {

    element.textContent =
      value;

  }

}


/* =========================================================
   65. ANGLE HISTORY
========================================================= */

function pushAngleHistory(
  knee,
  hip,
  ankle,
  trunk
) {

  const maxPoints =
    120;


  MOTION_STATE.angleHistory
    .knee
    .push(knee);


  MOTION_STATE.angleHistory
    .hip
    .push(hip);


  MOTION_STATE.angleHistory
    .ankle
    .push(ankle);


  MOTION_STATE.angleHistory
    .trunk
    .push(trunk);


  Object
    .values(
      MOTION_STATE.angleHistory
    )
    .forEach(array => {

      if (
        array.length >
        maxPoints
      ) {

        array.shift();

      }

    });


  if (
    typeof window.updateAngleChart ===
    "function"
  ) {

    window.updateAngleChart(

      MOTION_STATE.angleHistory

    );

  }

}


/* =========================================================
   66. BAR PATH

   손목 중점 기반의 시각적 궤적 추정.
========================================================= */

function trackBarPath(
  landmarks
) {

  if (
    !MOTION_STATE.showBarPath
  ) {

    return;

  }


  const leftWrist =
    landmarks[15];


  const rightWrist =
    landmarks[16];


  if (
    !isVisibleLandmark(
      leftWrist
    ) ||
    !isVisibleLandmark(
      rightWrist
    )
  ) {

    return;

  }


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


  MOTION_STATE.barPath.push(
    point
  );


  if (
    MOTION_STATE.barPath.length >
    180
  ) {

    MOTION_STATE.barPath.shift();

  }


  drawBarPath();

}


/* =========================================================
   67. DRAW BAR PATH
========================================================= */

function drawBarPath() {

  const canvas =

    document.getElementById(
      "barPathCanvas"
    );


  const source =
    MOTION_STATE.source;


  if (
    !canvas ||
    !source
  ) {

    return;

  }


  resizeMotionCanvas(
    canvas,
    source
  );


  const ctx =

    canvas.getContext(
      "2d"
    );


  ctx.clearRect(

    0,
    0,

    canvas.width,
    canvas.height

  );


  if (
    !MOTION_STATE.showBarPath ||
    MOTION_STATE.barPath.length <
      2
  ) {

    return;

  }


  ctx.save();


  ctx.lineWidth = 5;

  ctx.lineCap =
    "round";

  ctx.lineJoin =
    "round";


  ctx.beginPath();


  MOTION_STATE.barPath.forEach(
    (point, index) => {

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


  const last =

    MOTION_STATE.barPath[
      MOTION_STATE.barPath.length -
      1
    ];


  ctx.beginPath();


  ctx.arc(

    last.x *
      canvas.width,

    last.y *
      canvas.height,

    8,

    0,

    Math.PI * 2

  );


  ctx.fill();


  ctx.restore();

}


/* =========================================================
   68. REFERENCE LINES
========================================================= */

function updateReferenceLines() {

  const vertical =

    document.getElementById(
      "referenceVertical"
    );


  const horizontal =

    document.getElementById(
      "referenceHorizontal"
    );


  const display =

    MOTION_STATE.showReference

      ? ""

      : "none";


  if (vertical) {

    vertical.style.display =
      display;

  }


  if (horizontal) {

    horizontal.style.display =
      display;

  }

}


/* =========================================================
   69. VIEW SELECTOR
========================================================= */

function setupViewSelector() {

  document
    .querySelectorAll(
      "[data-view]"
    )
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          MOTION_STATE.view =

            button.dataset.view;


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


          showToast(

            `${
              getCameraViewName(
                MOTION_STATE.view
              )
            } 분석 모드`

          );

        }
      );

    });

}


function getCameraViewName(
  view
) {

  const names = {

    front: "정면",

    side: "측면",

    rear: "후면",

    top: "상단"

  };


  return (
    names[view] ||
    view
  );

}


/* =========================================================
   70. 2D / 3D
========================================================= */

function setupAnalysisMode() {

  document
    .querySelectorAll(
      "[data-analysis-mode]"
    )
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          MOTION_STATE.mode =

            button.dataset
              .analysisMode;


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


          showToast(

            MOTION_STATE.mode ===
              "3d"

              ? "3D 자세 추정 활성화"

              : "2D 자세 분석 활성화"

          );

        }
      );

    });

}


/* =========================================================
   71. SKELETON BUTTON
========================================================= */

function toggleSkeleton() {

  MOTION_STATE.showSkeleton =

    !MOTION_STATE.showSkeleton;


  const button =

    document.getElementById(
      "toggleSkeletonBtn"
    );


  button?.classList.toggle(

    "active",

    MOTION_STATE.showSkeleton

  );


  if (
    !MOTION_STATE.showSkeleton
  ) {

    clearPoseCanvas();

  }


  showToast(

    MOTION_STATE.showSkeleton

      ? "33관절 스켈레톤 표시"

      : "스켈레톤 숨김"

  );

}


/* =========================================================
   72. REFERENCE BUTTON
========================================================= */

function toggleReference() {

  MOTION_STATE.showReference =

    !MOTION_STATE.showReference;


  updateReferenceLines();


  const button =

    document.getElementById(
      "toggleReferenceBtn"
    );


  button?.classList.toggle(

    "active",

    MOTION_STATE.showReference

  );

}


/* =========================================================
   73. BAR PATH BUTTON
========================================================= */

function toggleBarPath() {

  MOTION_STATE.showBarPath =

    !MOTION_STATE.showBarPath;


  const button =

    document.getElementById(
      "toggleBarPathBtn"
    );


  button?.classList.toggle(

    "active",

    MOTION_STATE.showBarPath

  );


  if (
    !MOTION_STATE.showBarPath
  ) {

    const canvas =

      document.getElementById(
        "barPathCanvas"
      );


    const ctx =

      canvas?.getContext(
        "2d"
      );


    ctx?.clearRect(

      0,
      0,

      canvas.width,
      canvas.height

    );

  }

}


/* =========================================================
   74. PLAYBACK SPEED
========================================================= */

function changePlaybackSpeed() {

  const video =

    document.getElementById(
      "uploadedVideo"
    );


  const speed =

    Number(

      document
        .getElementById(
          "playbackSpeed"
        )
        ?.value

    ) || 1;


  if (video) {

    video.playbackRate =
      speed;

  }


  showToast(

    `재생 속도 ${speed}×`

  );

}


/* =========================================================
   75. PLAY / PAUSE
========================================================= */

function toggleVideoPlayback() {

  const video =

    document.getElementById(
      "uploadedVideo"
    );


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

  }

  else {

    video.pause();

  }

}


/* =========================================================
   76. FRAME CONTROL
========================================================= */

function moveVideoFrame(
  direction
) {

  const video =

    document.getElementById(
      "uploadedVideo"
    );


  if (
    !video ||
    video.hidden
  ) {

    return;

  }


  video.pause();


  const frameDuration =
    1 / 30;


  video.currentTime =

    Math.max(

      0,

      Math.min(

        video.duration || Infinity,

        video.currentTime +

        frameDuration *
        direction

      )

    );


  setTimeout(
    () => {

      analyzeSingleFrame(
        video
      );

    },

    80
  );

}


/* =========================================================
   77. STATUS
========================================================= */

function setLiveStatus(
  text
) {

  const badge =

    document.getElementById(
      "liveStatusBadge"
    );


  if (!badge) {

    return;

  }


  badge.textContent =

    `● ${text}`;


  badge.classList.remove(
    "standby"
  );

}


/* =========================================================
   78. FPS
========================================================= */

function calculateFPS() {

  const now =
    performance.now();


  if (
    MOTION_STATE.lastFrameTime
  ) {

    const delta =

      now -
      MOTION_STATE.lastFrameTime;


    if (
      delta > 0
    ) {

      MOTION_STATE.fps =

        1000 / delta;

    }

  }


  MOTION_STATE.lastFrameTime =
    now;


  MOTION_STATE.frameCount++;

}


/* =========================================================
   79. START MEASUREMENT
========================================================= */

function startMotionMeasurement() {

  const athleteId =

    document
      .getElementById(
        "analysisAthlete"
      )
      ?.value;


  const exerciseId =

    document
      .getElementById(
        "analysisExercise"
      )
      ?.value;


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


  if (
    !MOTION_STATE.source
  ) {

    showToast(
      "카메라·영상·사진 중 하나를 먼저 연결하세요."
    );

    return;

  }


  MOTION_STATE.startTime =
    Date.now();


  MOTION_STATE.barPath = [];


  MOTION_STATE.angleHistory = {

    knee: [],

    hip: [],

    ankle: [],

    trunk: []

  };


  startAnalysisTimer();


  setLiveStatus(
    "ANALYZING"
  );


  const exercise =

    typeof window.getExerciseById ===
    "function"

      ? window.getExerciseById(
          exerciseId
        )

      : null;


  if (
    exercise &&
    typeof window
      .renderExerciseRecommendations ===
      "function"
  ) {

    window
      .renderExerciseRecommendations(
        exercise.id
      );

  }


  showToast(
    "자세 분석을 시작했습니다."
  );

}


/* =========================================================
   80. ANALYSIS TIMER
========================================================= */

function startAnalysisTimer() {

  clearInterval(
    MOTION_STATE.timerInterval
  );


  const timer =

    document.getElementById(
      "analysisTimer"
    );


  MOTION_STATE.timerInterval =

    setInterval(
      () => {

        if (
          !MOTION_STATE.startTime
        ) {

          return;

        }


        const elapsed =

          Math.floor(

            (
              Date.now() -
              MOTION_STATE.startTime
            ) / 1000

          );


        const minutes =

          String(

            Math.floor(
              elapsed / 60
            )

          ).padStart(
            2,
            "0"
          );


        const seconds =

          String(

            elapsed % 60

          ).padStart(
            2,
            "0"
          );


        if (timer) {

          timer.textContent =

            `${minutes}:${seconds}`;

        }

      },

      250
    );

}


/* =========================================================
   81. STOP MEASUREMENT
========================================================= */

function stopMotionMeasurement() {

  clearInterval(
    MOTION_STATE.timerInterval
  );


  MOTION_STATE.timerInterval =
    null;


  setLiveStatus(
    "ANALYSIS COMPLETE"
  );


  /*
   PART 3에서 이 함수가 존재하게 됨.
   분석 결과 저장 + PR + 리포트 연결.
  */

  if (
    typeof window
      .saveCurrentAnalysis ===
      "function"
  ) {

    window.saveCurrentAnalysis();

  }


  showToast(
    "분석을 종료했습니다."
  );

}


/* =========================================================
   82. SETTINGS SYNC
========================================================= */

function setupMotionSettings() {

  const skeleton =

    document.getElementById(
      "settingSkeleton"
    );


  const reference =

    document.getElementById(
      "settingReference"
    );


  const barPath =

    document.getElementById(
      "settingBarPath"
    );


  skeleton?.addEventListener(
    "change",
    () => {

      MOTION_STATE.showSkeleton =
        skeleton.checked;

    }
  );


  reference?.addEventListener(
    "change",
    () => {

      MOTION_STATE.showReference =
        reference.checked;

      updateReferenceLines();

    }
  );


  barPath?.addEventListener(
    "change",
    () => {

      MOTION_STATE.showBarPath =
        barPath.checked;

    }
  );

}


/* =========================================================
   83. MOTION EVENTS
========================================================= */

function setupMotionEvents() {

  document
    .getElementById(
      "connectCameraBtn"
    )
    ?.addEventListener(
      "click",
      connectCamera
    );


  document
    .getElementById(
      "switchCameraBtn"
    )
    ?.addEventListener(
      "click",
      switchCamera
    );


  document
    .getElementById(
      "analysisVideoUpload"
    )
    ?.addEventListener(
      "change",
      handleVideoUpload
    );


  document
    .getElementById(
      "analysisImageUpload"
    )
    ?.addEventListener(
      "change",
      handleImageUpload
    );


  document
    .getElementById(
      "startAnalysisBtn"
    )
    ?.addEventListener(
      "click",
      startMotionMeasurement
    );


  document
    .getElementById(
      "stopAnalysisBtn"
    )
    ?.addEventListener(
      "click",
      stopMotionMeasurement
    );


  document
    .getElementById(
      "toggleSkeletonBtn"
    )
    ?.addEventListener(
      "click",
      toggleSkeleton
    );


  document
    .getElementById(
      "toggleReferenceBtn"
    )
    ?.addEventListener(
      "click",
      toggleReference
    );


  document
    .getElementById(
      "toggleBarPathBtn"
    )
    ?.addEventListener(
      "click",
      toggleBarPath
    );


  document
    .getElementById(
      "playbackSpeed"
    )
    ?.addEventListener(
      "change",
      changePlaybackSpeed
    );


  document
    .getElementById(
      "playPauseBtn"
    )
    ?.addEventListener(
      "click",
      toggleVideoPlayback
    );


  document
    .getElementById(
      "frameBackBtn"
    )
    ?.addEventListener(
      "click",
      () => {

        moveVideoFrame(-1);

      }
    );


  document
    .getElementById(
      "frameForwardBtn"
    )
    ?.addEventListener(
      "click",
      () => {

        moveVideoFrame(1);

      }
    );


  setupViewSelector();

  setupAnalysisMode();

  setupMotionSettings();

}


/* =========================================================
   84. TARGET REP
========================================================= */

function setupTargetReps() {

  const input =

    document.getElementById(
      "analysisTargetReps"
    );


  const display =

    document.getElementById(
      "targetRepCount"
    );


  if (
    !input ||
    !display
  ) {

    return;

  }


  const update = () => {

    display.textContent =

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
   85. INITIALIZE MOTION ENGINE
========================================================= */

function initializeMotionSystem() {

  initializePoseEngine();

  setupMotionEvents();

  setupTargetReps();

  updateReferenceLines();


  const skeletonButton =

    document.getElementById(
      "toggleSkeletonBtn"
    );


  const referenceButton =

    document.getElementById(
      "toggleReferenceBtn"
    );


  const barButton =

    document.getElementById(
      "toggleBarPathBtn"
    );


  skeletonButton
    ?.classList.add(
      "active"
    );


  referenceButton
    ?.classList.add(
      "active"
    );


  barButton
    ?.classList.add(
      "active"
    );


  console.log(
    "[WEIGHT LAB] MOTION ENGINE READY"
  );

}


/* =========================================================
   86. START PART 2
========================================================= */

if (
  document.readyState ===
  "loading"
) {

  document.addEventListener(

    "DOMContentLoaded",

    initializeMotionSystem

  );

}

else {

  initializeMotionSystem();

}


/* =========================================================
   APP.JS PART 2 / 3 END

   ↓ PART 3를 바로 아래에 이어 붙이기
========================================================= */
/* =========================================================
   설천고 WEIGHT PERFORMANCE LAB
   APP.JS
   PART 3 / 3

   FINAL SYSTEM
   - Rep Counter
   - Exercise Criteria
   - Angle Chart
   - Analysis Save
   - Personal Record
   - Records
   - Record Detail
   - CSV Export
   - Training Program
   - Exercise → Analysis
   - Backup / Restore
   - Final Integration
========================================================= */


/* =========================================================
   87. FINAL STATE
========================================================= */

const FINAL_STATE = {

  rep: {

    count: 0,

    phase: "up",

    lowestKnee: 180,

    highestKnee: 0,

    lastRepTime: 0,

    repTimes: []

  },

  charts: {

    angle: null

  },

  selectedExerciseId: null

};


/* =========================================================
   88. EXERCISE GETTER SAFE
========================================================= */

function getExerciseSafe(id) {

  if (
    typeof window.getExerciseById ===
    "function"
  ) {

    return window.getExerciseById(id);

  }


  if (
    Array.isArray(window.EXERCISES)
  ) {

    return (

      window.EXERCISES.find(
        exercise =>
          exercise.id === id
      ) || null

    );

  }


  return null;

}


/* =========================================================
   89. EXERCISE LIST
========================================================= */

function getExerciseListSafe() {

  if (
    Array.isArray(window.EXERCISES)
  ) {

    return window.EXERCISES;

  }


  if (
    typeof window.getAllExercises ===
    "function"
  ) {

    return (
      window.getAllExercises() || []
    );

  }


  return [];

}


/* =========================================================
   90. SYNC EXERCISE SELECTS
========================================================= */

function syncExerciseSelects() {

  const exercises =
    getExerciseListSafe();


  const selectIds = [

    "analysisExercise",

    "programExercise"

  ];


  selectIds.forEach(id => {

    const select =

      document.getElementById(id);


    if (!select) return;


    const previous =
      select.value;


    select.innerHTML = `

      <option value="">

        운동 선택

      </option>

    `;


    exercises.forEach(
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
      previous &&
      getExerciseSafe(previous)
    ) {

      select.value =
        previous;

    }

  });


  const recordFilter =

    document.getElementById(
      "recordExerciseFilter"
    );


  if (recordFilter) {

    const previous =
      recordFilter.value;


    recordFilter.innerHTML = `

      <option value="all">

        전체 운동

      </option>

    `;


    exercises.forEach(
      exercise => {

        const option =

          document.createElement(
            "option"
          );


        option.value =
          exercise.id;


        option.textContent =
          exercise.name;


        recordFilter.appendChild(
          option
        );

      }
    );


    if (
      previous === "all" ||
      getExerciseSafe(previous)
    ) {

      recordFilter.value =
        previous;

    }

  }

}


/* =========================================================
   91. EXERCISE ANALYSIS PROFILE

   exercises.js 안에 분석 기준이 있으면 우선 사용.
   없으면 기본 프로필 사용.
========================================================= */

function getExerciseAnalysisProfile(
  exercise
) {

  const custom =

    exercise?.analysis ||
    exercise?.criteria ||
    {};


  const category =

    exercise?.category ||
    "fullbody";


  const defaults = {

    lower: {

      kneeBottom: 105,

      kneeTop: 155,

      hipBottom: 120,

      maxTrunk: 45,

      repJoint: "knee",

      checkpoints: [

        "무릎과 발끝 방향 정렬",

        "좌우 골반 높이 확인",

        "발 전체의 지지 유지",

        "몸통 과도한 전방 기울기 확인",

        "하강·상승 시 좌우 대칭 확인"

      ]

    },


    chest: {

      kneeBottom: 120,

      kneeTop: 155,

      hipBottom: 120,

      maxTrunk: 35,

      repJoint: "elbow",

      checkpoints: [

        "양쪽 어깨 높이 확인",

        "손목과 팔꿈치 정렬",

        "좌우 팔 움직임 대칭",

        "몸통 안정성 유지",

        "반복 속도 일정하게 유지"

      ]

    },


    back: {

      kneeBottom: 120,

      kneeTop: 160,

      hipBottom: 120,

      maxTrunk: 55,

      repJoint: "hip",

      checkpoints: [

        "척추와 몸통 정렬",

        "좌우 어깨 대칭",

        "고관절 중심 움직임",

        "무릎과 발 정렬",

        "당기는 동작의 좌우 차이 확인"

      ]

    },


    shoulder: {

      kneeBottom: 120,

      kneeTop: 160,

      hipBottom: 120,

      maxTrunk: 30,

      repJoint: "elbow",

      checkpoints: [

        "머리 위 동작 시 몸통 안정",

        "좌우 팔꿈치 이동 대칭",

        "어깨 으쓱임 최소화",

        "허리 과신전 확인",

        "손목 정렬 확인"

      ]

    },


    arms: {

      kneeBottom: 120,

      kneeTop: 160,

      hipBottom: 120,

      maxTrunk: 30,

      repJoint: "elbow",

      checkpoints: [

        "팔꿈치 위치 안정",

        "좌우 움직임 대칭",

        "몸통 반동 최소화",

        "손목 중립 유지",

        "전체 가동범위 확인"

      ]

    },


    core: {

      kneeBottom: 120,

      kneeTop: 160,

      hipBottom: 120,

      maxTrunk: 45,

      repJoint: "hip",

      checkpoints: [

        "골반 정렬",

        "몸통 흔들림 확인",

        "좌우 대칭성",

        "호흡과 움직임 리듬",

        "허리 과도한 움직임 확인"

      ]

    },


    olympic: {

      kneeBottom: 115,

      kneeTop: 155,

      hipBottom: 125,

      maxTrunk: 50,

      repJoint: "knee",

      checkpoints: [

        "바벨 수직 궤적",

        "무릎·고관절 동시 신전",

        "받기 자세 안정성",

        "좌우 발 착지 대칭",

        "몸통 중심 유지",

        "폭발적 신전 타이밍"

      ]

    },


    power: {

      kneeBottom: 120,

      kneeTop: 155,

      hipBottom: 130,

      maxTrunk: 45,

      repJoint: "knee",

      checkpoints: [

        "폭발적 신전 타이밍",

        "착지 안정성",

        "좌우 힘 전달 대칭",

        "몸통 중심 유지",

        "무릎 정렬 확인"

      ]

    },


    plyometric: {

      kneeBottom: 120,

      kneeTop: 160,

      hipBottom: 130,

      maxTrunk: 45,

      repJoint: "knee",

      checkpoints: [

        "착지 시 무릎 정렬",

        "좌우 착지 대칭",

        "지면 접촉 안정성",

        "몸통 흔들림 최소화",

        "반복 간 리듬 확인"

      ]

    },


    functional: {

      kneeBottom: 115,

      kneeTop: 155,

      hipBottom: 125,

      maxTrunk: 50,

      repJoint: "knee",

      checkpoints: [

        "전신 연결성",

        "좌우 대칭",

        "중심 이동",

        "관절 정렬",

        "움직임 속도 제어"

      ]

    },


    mobility: {

      kneeBottom: 110,

      kneeTop: 160,

      hipBottom: 120,

      maxTrunk: 60,

      repJoint: "knee",

      checkpoints: [

        "가동범위",

        "좌우 가동성 차이",

        "보상 움직임",

        "관절 정렬",

        "움직임 제어"

      ]

    },


    fullbody: {

      kneeBottom: 115,

      kneeTop: 155,

      hipBottom: 125,

      maxTrunk: 50,

      repJoint: "knee",

      checkpoints: [

        "전신 정렬",

        "좌우 대칭",

        "몸통 안정성",

        "가동범위",

        "움직임 타이밍"

      ]

    }

  };


  const base =

    defaults[category] ||
    defaults.fullbody;


  return {

    ...base,

    ...custom,

    checkpoints:

      custom.checkpoints ||
      base.checkpoints

  };

}


/* =========================================================
   92. CHECKPOINT RENDER
========================================================= */

function renderExerciseCheckpoints(
  exercise
) {

  const container =

    document.getElementById(
      "checkpointList"
    );


  if (!container) return;


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


  const profile =

    getExerciseAnalysisProfile(
      exercise
    );


  container.innerHTML = "";


  profile.checkpoints.forEach(
    checkpoint => {

      const row =

        document.createElement(
          "div"
        );


      row.className =
        "checkpoint-row";


      row.innerHTML = `

        <span>

          ${escapeHTML(checkpoint)}

        </span>

        <strong>

          CHECK

        </strong>

      `;


      container.appendChild(
        row
      );

    }
  );

}


/* =========================================================
   93. RANGE LABELS
========================================================= */

function renderExerciseRanges(
  exercise
) {

  const profile =

    exercise

      ? getExerciseAnalysisProfile(
          exercise
        )

      : null;


  updateMetricText(

    "kneeRange",

    profile

      ? `하단 기준 약 ${profile.kneeBottom}°`

      : "운동별 기준"

  );


  updateMetricText(

    "hipRange",

    profile

      ? `하단 기준 약 ${profile.hipBottom}°`

      : "운동별 기준"

  );


  updateMetricText(

    "trunkRange",

    profile

      ? `권장 ≤ ${profile.maxTrunk}°`

      : "운동별 기준"

  );


  updateMetricText(

    "ankleRange",

    exercise

      ? "좌우 차이 및 ROM 분석"

      : "운동별 기준"

  );

}


/* =========================================================
   94. EXERCISE CHANGE
========================================================= */

function setupAnalysisExerciseChange() {

  const select =

    document.getElementById(
      "analysisExercise"
    );


  select?.addEventListener(
    "change",
    () => {

      const exercise =

        getExerciseSafe(
          select.value
        );


      FINAL_STATE.selectedExerciseId =

        exercise?.id ||
        null;


      if (exercise) {

        localStorage.setItem(

          APP_CONFIG.storage.selectedExercise,

          exercise.id

        );


        updateMetricText(

          "motionAnalysisTitle",

          `${exercise.name} 자세 분석`

        );

      }


      renderExerciseCheckpoints(
        exercise
      );


      renderExerciseRanges(
        exercise
      );


      resetRepCounter();


      if (
        exercise &&
        typeof window
          .renderExerciseRecommendations ===
          "function"
      ) {

        window
          .renderExerciseRecommendations(
            exercise.id
          );

      }

    }
  );

}


/* =========================================================
   95. OPEN EXERCISE IN ANALYSIS
========================================================= */

function openExerciseAnalysis(
  exerciseId
) {

  const exercise =

    getExerciseSafe(
      exerciseId
    );


  if (!exercise) {

    showToast(
      "운동 정보를 찾을 수 없습니다."
    );

    return;

  }


  FINAL_STATE.selectedExerciseId =
    exercise.id;


  localStorage.setItem(

    APP_CONFIG.storage.selectedExercise,

    exercise.id

  );


  showPage(
    "analysis"
  );


  const select =

    document.getElementById(
      "analysisExercise"
    );


  if (select) {

    select.value =
      exercise.id;


    select.dispatchEvent(

      new Event(
        "change"
      )

    );

  }


  showToast(

    `${exercise.name} 분석 화면으로 이동했습니다.`

  );

}


window.openExerciseAnalysis =
  openExerciseAnalysis;


/* =========================================================
   96. EXERCISE CARD → ANALYSIS

   exercises.js 카드가
   data-exercise-id를 가지고 있으면 자동 연결.
========================================================= */

function setupExerciseCardNavigation() {

  document.addEventListener(
    "click",
    event => {

      const analyzeButton =

        event.target.closest(
          "[data-analyze-exercise]"
        );


      if (analyzeButton) {

        const id =

          analyzeButton.dataset
            .analyzeExercise;


        if (id) {

          openExerciseAnalysis(id);

        }


        return;

      }


      const card =

        event.target.closest(
          "[data-exercise-id]"
        );


      if (!card) {

        return;

      }


      /*
       카드 내부 버튼 클릭은
       exercises.js의 모달 기능을 방해하지 않음.
      */

      if (
        event.target.closest(
          "button"
        )
      ) {

        return;

      }


      const id =

        card.dataset.exerciseId;


      if (
        event.detail === 2 &&
        id
      ) {

        openExerciseAnalysis(id);

      }

    }
  );


  document
    .getElementById(
      "analyzeSelectedExerciseBtn"
    )
    ?.addEventListener(
      "click",
      () => {

        const modal =

          document.getElementById(
            "exerciseModal"
          );


        const id =

          modal?.dataset
            .exerciseId ||
          FINAL_STATE
            .selectedExerciseId;


        if (id) {

          modal?.classList.remove(
            "show"
          );


          openExerciseAnalysis(id);

        }

      }
    );

}


/* =========================================================
   97. REP COUNTER RESET
========================================================= */

function resetRepCounter() {

  FINAL_STATE.rep = {

    count: 0,

    phase: "up",

    lowestKnee: 180,

    highestKnee: 0,

    lastRepTime: 0,

    repTimes: []

  };


  updateMetricText(
    "currentRepCount",
    0
  );


  updateMetricText(
    "analysisTempo",
    "--"
  );

}


/* =========================================================
   98. REP COUNTER

   기본은 무릎 굽힘/신전 패턴.
   스쿼트·런지·올림픽 리프트 등에서 사용.
========================================================= */

function updateRepCounter(
  kneeAngle
) {

  if (
    !MOTION_STATE.startTime
  ) {

    return;

  }


  const exercise =

    getExerciseSafe(

      document
        .getElementById(
          "analysisExercise"
        )
        ?.value

    );


  if (!exercise) {

    return;

  }


  const profile =

    getExerciseAnalysisProfile(
      exercise
    );


  if (
    !Number.isFinite(
      kneeAngle
    )
  ) {

    return;

  }


  FINAL_STATE.rep.lowestKnee =

    Math.min(

      FINAL_STATE.rep
        .lowestKnee,

      kneeAngle

    );


  FINAL_STATE.rep.highestKnee =

    Math.max(

      FINAL_STATE.rep
        .highestKnee,

      kneeAngle

    );


  /*
   DOWN
  */

  if (

    FINAL_STATE.rep.phase ===
      "up"

    &&

    kneeAngle <
      profile.kneeBottom

  ) {

    FINAL_STATE.rep.phase =
      "down";

  }


  /*
   UP → REP COMPLETE
  */

  if (

    FINAL_STATE.rep.phase ===
      "down"

    &&

    kneeAngle >
      profile.kneeTop

  ) {

    FINAL_STATE.rep.phase =
      "up";


    FINAL_STATE.rep.count++;


    const now =
      Date.now();


    if (
      FINAL_STATE.rep.lastRepTime
    ) {

      const seconds =

        (
          now -
          FINAL_STATE.rep
            .lastRepTime
        ) / 1000;


      if (
        seconds > 0.3 &&
        seconds < 20
      ) {

        FINAL_STATE.rep
          .repTimes
          .push(seconds);

      }

    }


    FINAL_STATE.rep.lastRepTime =
      now;


    updateMetricText(

      "currentRepCount",

      FINAL_STATE.rep.count

    );


    updateTempo();


    const target =

      Number(

        document
          .getElementById(
            "analysisTargetReps"
          )
          ?.value

      ) || 10;


    if (
      FINAL_STATE.rep.count >=
      target
    ) {

      showToast(
        `목표 ${target}회 완료`
      );

    }

  }

}


/* =========================================================
   99. TEMPO
========================================================= */

function updateTempo() {

  const times =

    FINAL_STATE.rep
      .repTimes;


  if (!times.length) {

    return;

  }


  const recent =

    times.slice(-3);


  const average =

    recent.reduce(
      (sum, value) =>
        sum + value,
      0
    )

    /

    recent.length;


  updateMetricText(

    "analysisTempo",

    `${average.toFixed(1)}s`

  );

}


/* =========================================================
   100. HOOK REP COUNTER INTO BIOMECHANICS
========================================================= */

const originalUpdateBiomechanics =
  updateBiomechanics;


updateBiomechanics =
  function(landmarks) {

    originalUpdateBiomechanics(
      landmarks
    );


    const leftKnee =

      calculateAngle(

        landmarks[23],

        landmarks[25],

        landmarks[27]

      );


    const rightKnee =

      calculateAngle(

        landmarks[24],

        landmarks[26],

        landmarks[28]

      );


    const knee =

      averageValidAngles(

        leftKnee,

        rightKnee

      );


    updateRepCounter(
      knee
    );

  };


/* =========================================================
   101. ANGLE CHART
========================================================= */

function initializeAngleChart() {

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
    FINAL_STATE.charts.angle
  ) {

    FINAL_STATE.charts.angle
      .destroy();

  }


  FINAL_STATE.charts.angle =

    new Chart(
      canvas,
      {

        type: "line",

        data: {

          labels: [],

          datasets: [

            {

              label:
                "무릎",

              data: [],

              borderWidth: 2,

              pointRadius: 0,

              tension: 0.25

            },


            {

              label:
                "고관절",

              data: [],

              borderWidth: 2,

              pointRadius: 0,

              tension: 0.25

            },


            {

              label:
                "발목",

              data: [],

              borderWidth: 2,

              pointRadius: 0,

              tension: 0.25

            },


            {

              label:
                "몸통",

              data: [],

              borderWidth: 2,

              pointRadius: 0,

              tension: 0.25

            }

          ]

        },


        options: {

          responsive: true,

          maintainAspectRatio:
            false,

          animation: false,

          interaction: {

            intersect: false,

            mode: "index"

          },

          scales: {

            y: {

              min: 0,

              max: 180,

              title: {

                display: true,

                text: "ANGLE °"

              }

            },

            x: {

              ticks: {

                display: false

              }

            }

          }

        }

      }
    );

}


/* =========================================================
   102. UPDATE ANGLE CHART
========================================================= */

function updateAngleChart(
  history
) {

  const chart =

    FINAL_STATE.charts.angle;


  if (!chart) {

    return;

  }


  const length =

    Math.max(

      history.knee.length,

      history.hip.length,

      history.ankle.length,

      history.trunk.length

    );


  chart.data.labels =

    Array.from(

      {
        length
      },

      (_, index) =>
        index + 1

    );


  chart.data.datasets[0].data =

    [...history.knee];


  chart.data.datasets[1].data =

    [...history.hip];


  chart.data.datasets[2].data =

    [...history.ankle];


  chart.data.datasets[3].data =

    [...history.trunk];


  chart.update(
    "none"
  );

}


window.updateAngleChart =
  updateAngleChart;


/* =========================================================
   103. ANALYSIS AVERAGE
========================================================= */

function averageArray(
  array
) {

  const valid =

    array.filter(
      value =>
        Number.isFinite(value)
    );


  if (!valid.length) {

    return 0;

  }


  return (

    valid.reduce(
      (sum, value) =>
        sum + value,
      0
    )

    /

    valid.length

  );

}


/* =========================================================
   104. CURRENT METRIC NUMBER
========================================================= */

function readMetricNumber(id) {

  const text =

    document
      .getElementById(id)
      ?.textContent || "";


  const number =

    parseFloat(
      text.replace(
        /[^0-9.-]/g,
        ""
      )
    );


  return Number.isFinite(number)

    ? number

    : 0;

}


/* =========================================================
   105. CAPTURE ANALYSIS FRAME
========================================================= */

function captureAnalysisFrame() {

  const source =
    MOTION_STATE.source;


  if (!source) {

    return null;

  }


  try {

    const canvas =

      document.createElement(
        "canvas"
      );


    const width =

      source.videoWidth ||
      source.naturalWidth ||
      1280;


    const height =

      source.videoHeight ||
      source.naturalHeight ||
      720;


    canvas.width =
      Math.min(width, 960);


    canvas.height =

      Math.round(

        canvas.width *
        height /
        width

      );


    const ctx =

      canvas.getContext(
        "2d"
      );


    ctx.drawImage(

      source,

      0,
      0,

      canvas.width,
      canvas.height

    );


    const poseCanvas =

      document.getElementById(
        "poseCanvas"
      );


    if (
      poseCanvas &&
      poseCanvas.width
    ) {

      ctx.drawImage(

        poseCanvas,

        0,
        0,

        canvas.width,
        canvas.height

      );

    }


    return canvas.toDataURL(

      "image/jpeg",

      0.72

    );

  }

  catch (error) {

    console.warn(
      "Frame capture failed",
      error
    );


    return null;

  }

}


/* =========================================================
   106. PR CHECK
========================================================= */

function checkPersonalRecord(
  athleteId,
  exerciseId,
  score
) {

  const previous =

    APP_STATE.analyses.filter(
      item =>

        item.athleteId ===
          athleteId

        &&

        item.exerciseId ===
          exerciseId

    );


  if (!previous.length) {

    return true;

  }


  const best =

    Math.max(

      ...previous.map(
        item =>
          Number(
            item.score
          ) || 0
      )

    );


  return (
    score > best
  );

}


/* =========================================================
   107. SAVE CURRENT ANALYSIS
========================================================= */

function saveCurrentAnalysis() {

  const athleteId =

    document
      .getElementById(
        "analysisAthlete"
      )
      ?.value;


  const exerciseId =

    document
      .getElementById(
        "analysisExercise"
      )
      ?.value;


  if (
    !athleteId ||
    !exerciseId
  ) {

    return;

  }


  const athlete =

    getAthleteById(
      athleteId
    );


  const exercise =

    getExerciseSafe(
      exerciseId
    );


  if (
    !athlete ||
    !exercise
  ) {

    return;

  }


  const symmetry =

    readMetricNumber(
      "liveSymmetry"
    );


  const stability =

    readMetricNumber(
      "liveStability"
    );


  const mobility =

    readMetricNumber(
      "liveROM"
    );


  const technique =

    readMetricNumber(
      "liveTechnique"
    );


  const score =

    Math.round(

      (
        symmetry +
        stability +
        mobility +
        technique
      ) / 4

    );


  /*
   실제 1RM 측정값이 없는 자세분석에서는
   strength/power를 모션 품질 기반 지표로 추정.
  */

  const strength =

    clamp(

      Math.round(
        technique * 0.55 +
        stability * 0.45
      ),

      0,

      100

    );


  const power =

    clamp(

      Math.round(

        technique * 0.45 +

        stability * 0.25 +

        mobility * 0.30

      ),

      0,

      100

    );


  const isPR =

    checkPersonalRecord(

      athleteId,

      exerciseId,

      score

    );


  const record = {

    id:
      createID(
        "analysis"
      ),

    athleteId,

    athleteName:
      athlete.name,

    exerciseId,

    exerciseName:
      exercise.name,

    exerciseCategory:
      exercise.category || "",

    view:
      MOTION_STATE.view,

    analysisMode:
      MOTION_STATE.mode,

    sourceType:
      MOTION_STATE.sourceType,

    reps:
      FINAL_STATE.rep.count,

    score,

    strength,

    power,

    stability:
      Math.round(stability),

    symmetry:
      Math.round(symmetry),

    mobility:
      Math.round(mobility),

    technique:
      Math.round(technique),

    rom:
      Math.round(mobility),

    kneeAverage:
      Math.round(

        averageArray(
          MOTION_STATE
            .angleHistory
            .knee
        )

      ),

    hipAverage:
      Math.round(

        averageArray(
          MOTION_STATE
            .angleHistory
            .hip
        )

      ),

    ankleAverage:
      Math.round(

        averageArray(
          MOTION_STATE
            .angleHistory
            .ankle
        )

      ),

    trunkAverage:
      Math.round(

        averageArray(
          MOTION_STATE
            .angleHistory
            .trunk
        )

      ),

    tempo:
      document
        .getElementById(
          "analysisTempo"
        )
        ?.textContent || "--",

    duration:
      document
        .getElementById(
          "analysisTimer"
        )
        ?.textContent || "00:00",

    isPR,

    frame:
      captureAnalysisFrame(),

    createdAt:
      new Date()
        .toISOString()

  };


  APP_STATE.analyses.push(
    record
  );


  saveAnalyses();


  renderDashboard();

  renderRecords();


  if (
    isPR
  ) {

    showToast(
      `새 PR! 자세 점수 ${score}점`
    );

  }

  else {

    showToast(
      `분석 저장 완료 · ${score}점`
    );

  }


  MOTION_STATE.startTime =
    null;


  return record;

}


window.saveCurrentAnalysis =
  saveCurrentAnalysis;


/* =========================================================
   108. RECORD FILTER
========================================================= */

function getFilteredRecords() {

  const athleteFilter =

    document
      .getElementById(
        "recordAthleteFilter"
      )
      ?.value || "all";


  const exerciseFilter =

    document
      .getElementById(
        "recordExerciseFilter"
      )
      ?.value || "all";


  const search =

    document
      .getElementById(
        "recordSearch"
      )
      ?.value
      .trim()
      .toLowerCase() || "";


  return [

    ...APP_STATE.analyses

  ]

    .filter(record => {

      if (

        athleteFilter !==
          "all"

        &&

        record.athleteId !==
          athleteFilter

      ) {

        return false;

      }


      if (

        exerciseFilter !==
          "all"

        &&

        record.exerciseId !==
          exerciseFilter

      ) {

        return false;

      }


      if (search) {

        const text =

          `${record.athleteName}
           ${record.exerciseName}`

            .toLowerCase();


        if (
          !text.includes(search)
        ) {

          return false;

        }

      }


      return true;

    })

    .sort(
      (a, b) =>

        new Date(
          b.createdAt
        )

        -

        new Date(
          a.createdAt
        )
    );

}


/* =========================================================
   109. RENDER RECORDS
========================================================= */

function renderRecords() {

  const tbody =

    document.getElementById(
      "recordsTableBody"
    );


  if (!tbody) {

    return;

  }


  const records =

    getFilteredRecords();


  tbody.innerHTML = "";


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


  records.forEach(
    record => {

      const row =

        document.createElement(
          "tr"
        );


      const date =

        new Date(
          record.createdAt
        );


      row.innerHTML = `

        <td>

          ${
            date.toLocaleDateString(
              "ko-KR"
            )
          }

        </td>


        <td>

          ${
            escapeHTML(
              record.athleteName
            )
          }

        </td>


        <td>

          ${
            escapeHTML(
              record.exerciseName
            )
          }

        </td>


        <td>

          ${
            record.reps || 0
          }

        </td>


        <td>

          <strong>

            ${
              record.score || 0
            }

          </strong>

          ${
            record.isPR

              ? `<span class="pr-badge">PR</span>`

              : ""
          }

        </td>


        <td>

          ${
            record.symmetry || 0
          }%

        </td>


        <td>

          ${
            record.rom ||
            record.mobility ||
            0
          }

        </td>


        <td>

          <button
            class="secondary-button record-view-btn"
            type="button"
          >

            상세

          </button>

        </td>

      `;


      row
        .querySelector(
          ".record-view-btn"
        )
        ?.addEventListener(
          "click",
          () => {

            openRecordDetail(
              record.id
            );

          }
        );


      tbody.appendChild(
        row
      );

    }
  );

}


window.renderRecords =
  renderRecords;


/* =========================================================
   110. RECORD DETAIL
========================================================= */

function openRecordDetail(id) {

  const record =

    APP_STATE.analyses.find(
      item =>
        item.id === id
    );


  if (!record) {

    return;

  }


  const modal =

    document.getElementById(
      "recordModal"
    );


  const content =

    document.getElementById(
      "recordDetailContent"
    );


  if (
    !modal ||
    !content
  ) {

    return;

  }


  content.innerHTML = `

    ${
      record.frame

        ? `

          <div class="record-frame">

            <img
              src="${record.frame}"
              alt="자세 분석 프레임"
            />

          </div>

        `

        : ""
    }


    <div class="report-info-grid">

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

        <span>자세 점수</span>

        <strong>

          ${record.score}

        </strong>

      </div>


      <div>

        <span>반복</span>

        <strong>

          ${record.reps}

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


      <div>

        <span>가동성</span>

        <strong>

          ${record.mobility}

        </strong>

      </div>


      <div>

        <span>기술</span>

        <strong>

          ${record.technique}

        </strong>

      </div>

    </div>


    <div class="record-angle-grid">

      <div>

        <span>평균 무릎</span>

        <strong>

          ${record.kneeAverage}°

        </strong>

      </div>


      <div>

        <span>평균 고관절</span>

        <strong>

          ${record.hipAverage}°

        </strong>

      </div>


      <div>

        <span>평균 발목</span>

        <strong>

          ${record.ankleAverage}°

        </strong>

      </div>


      <div>

        <span>평균 몸통</span>

        <strong>

          ${record.trunkAverage}°

        </strong>

      </div>

    </div>

  `;


  modal.classList.add(
    "show"
  );

}


/* =========================================================
   111. RECORD MODAL
========================================================= */

function setupRecordModal() {

  const modal =

    document.getElementById(
      "recordModal"
    );


  document
    .getElementById(
      "closeRecordModal"
    )
    ?.addEventListener(
      "click",
      () => {

        modal?.classList.remove(
          "show"
        );

      }
    );


  modal?.addEventListener(
    "click",
    event => {

      if (
        event.target === modal
      ) {

        modal.classList.remove(
          "show"
        );

      }

    }
  );

}


/* =========================================================
   112. RECORD FILTER EVENTS
========================================================= */

function setupRecordFilters() {

  [

    "recordAthleteFilter",

    "recordExerciseFilter"

  ].forEach(id => {

    document
      .getElementById(id)
      ?.addEventListener(
        "change",
        renderRecords
      );

  });


  document
    .getElementById(
      "recordSearch"
    )
    ?.addEventListener(
      "input",
      renderRecords
    );

}


/* =========================================================
   113. CSV EXPORT
========================================================= */

function exportAnalysisCSV() {

  const records =

    getFilteredRecords();


  if (!records.length) {

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

      "근력",

      "파워",

      "안정성",

      "대칭성",

      "가동성",

      "기술",

      "평균 무릎각",

      "평균 고관절각",

      "평균 발목각",

      "평균 몸통각"

    ]

  ];


  records.forEach(
    record => {

      rows.push([

        record.createdAt,

        record.athleteName,

        record.exerciseName,

        record.reps,

        record.score,

        record.strength,

        record.power,

        record.stability,

        record.symmetry,

        record.mobility,

        record.technique,

        record.kneeAverage,

        record.hipAverage,

        record.ankleAverage,

        record.trunkAverage

      ]);

    }
  );


  const csv =

    "\uFEFF" +

    rows

      .map(
        row =>

          row

            .map(value =>

              `"${String(
                value ?? ""
              ).replaceAll(
                '"',
                '""'
              )}"`

            )

            .join(",")

      )

      .join("\n");


  downloadBlob(

    csv,

    `WEIGHT_ANALYSIS_${
      getDateFileName()
    }.csv`,

    "text/csv;charset=utf-8"

  );


  showToast(
    "CSV 저장 완료"
  );

}


/* =========================================================
   114. DOWNLOAD BLOB
========================================================= */

function downloadBlob(
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


  const anchor =

    document.createElement(
      "a"
    );


  anchor.href =
    url;


  anchor.download =
    filename;


  document.body.appendChild(
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
   115. DATE FILE NAME
========================================================= */

function getDateFileName() {

  const date =
    new Date();


  return [

    date.getFullYear(),

    String(
      date.getMonth() + 1
    ).padStart(
      2,
      "0"
    ),

    String(
      date.getDate()
    ).padStart(
      2,
      "0"
    )

  ].join("-");

}


/* =========================================================
   116. PROGRAM ADD
========================================================= */

function addProgramExercise() {

  const exerciseId =

    document
      .getElementById(
        "programExercise"
      )
      ?.value;


  if (!exerciseId) {

    showToast(
      "운동을 선택하세요."
    );

    return;

  }


  const exercise =

    getExerciseSafe(
      exerciseId
    );


  if (!exercise) {

    return;

  }


  const item = {

    id:
      createID(
        "program-item"
      ),

    exerciseId,

    exerciseName:
      exercise.name,

    sets:

      Math.max(

        1,

        Number(

          document
            .getElementById(
              "programSets"
            )
            ?.value

        ) || 1

      ),

    reps:

      Math.max(

        1,

        Number(

          document
            .getElementById(
              "programReps"
            )
            ?.value

        ) || 1

      ),

    weight:

      Math.max(

        0,

        Number(

          document
            .getElementById(
              "programWeight"
            )
            ?.value

        ) || 0

      ),

    rest:

      Math.max(

        0,

        Number(

          document
            .getElementById(
              "programRest"
            )
            ?.value

        ) || 0

      )

  };


  APP_STATE
    .currentProgramExercises
    .push(item);


  renderCurrentProgram();


  showToast(
    `${exercise.name} 추가`
  );

}


/* =========================================================
   117. RENDER CURRENT PROGRAM
========================================================= */

function renderCurrentProgram() {

  const container =

    document.getElementById(
      "programExerciseList"
    );


  if (!container) {

    return;

  }


  const items =

    APP_STATE
      .currentProgramExercises;


  if (!items.length) {

    container.innerHTML = `

      <div class="empty-state">

        추가된 운동이 없습니다.

      </div>

    `;

  }

  else {

    container.innerHTML =
      "";


    items.forEach(
      (item, index) => {

        const row =

          document.createElement(
            "div"
          );


        row.className =
          "program-exercise-row";


        row.innerHTML = `

          <div class="program-number">

            ${index + 1}

          </div>


          <div>

            <strong>

              ${
                escapeHTML(
                  item.exerciseName
                )
              }

            </strong>

            <span>

              ${item.sets}세트 ·
              ${item.reps}회 ·
              ${item.weight}kg ·
              휴식 ${item.rest}초

            </span>

          </div>


          <button
            class="danger-button"
            type="button"
          >

            삭제

          </button>

        `;


        row
          .querySelector(
            "button"
          )
          ?.addEventListener(
            "click",
            () => {

              APP_STATE
                .currentProgramExercises
                .splice(
                  index,
                  1
                );


              renderCurrentProgram();

            }
          );


        container.appendChild(
          row
        );

      }
    );

  }


  const exerciseCount =

    items.length;


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


  updateMetricText(

    "programExerciseCount",

    exerciseCount

  );


  updateMetricText(

    "programTotalSets",

    totalSets

  );


  updateMetricText(

    "programTotalVolume",

    `${Math.round(volume)} kg`

  );

}


/* =========================================================
   118. SAVE PROGRAM
========================================================= */

function saveTrainingProgram() {

  const athleteId =

    document
      .getElementById(
        "programAthlete"
      )
      ?.value;


  const name =

    document
      .getElementById(
        "programName"
      )
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
    !APP_STATE
      .currentProgramExercises
      .length
  ) {

    showToast(
      "운동을 추가하세요."
    );

    return;

  }


  const athlete =

    getAthleteById(
      athleteId
    );


  const program = {

    id:
      createID(
        "program"
      ),

    athleteId,

    athleteName:
      athlete?.name || "",

    name,

    exercises:

      APP_STATE
        .currentProgramExercises
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


  APP_STATE
    .currentProgramExercises =
      [];


  renderCurrentProgram();


  const nameInput =

    document.getElementById(
      "programName"
    );


  if (nameInput) {

    nameInput.value =
      "";

  }


  showToast(
    "훈련 프로그램 저장 완료"
  );

}


/* =========================================================
   119. PROGRAM EVENTS
========================================================= */

function setupProgramEvents() {

  document
    .getElementById(
      "addProgramExerciseBtn"
    )
    ?.addEventListener(
      "click",
      addProgramExercise
    );


  document
    .getElementById(
      "saveProgramBtn"
    )
    ?.addEventListener(
      "click",
      saveTrainingProgram
    );

}


/* =========================================================
   120. BACKUP DATA
========================================================= */

function backupAllData() {

  const data = {

    app:
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
      APP_STATE.programs

  };


  downloadBlob(

    JSON.stringify(
      data,
      null,
      2
    ),

    `WEIGHT_LAB_BACKUP_${
      getDateFileName()
    }.json`,

    "application/json"

  );


  showToast(
    "데이터 백업 완료"
  );

}


/* =========================================================
   121. RESTORE DATA
========================================================= */

function restoreAllData(
  event
) {

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

        JSON.parse(
          reader.result
        );


      if (
        !Array.isArray(
          data.athletes
        ) ||
        !Array.isArray(
          data.analyses
        )
      ) {

        throw new Error(
          "Invalid backup"
        );

      }


      APP_STATE.athletes =
        data.athletes;


      APP_STATE.analyses =
        data.analyses;


      APP_STATE.programs =

        Array.isArray(
          data.programs
        )

          ? data.programs

          : [];


      saveAthletes();

      saveAnalyses();

      savePrograms();


      APP_STATE.selectedAthleteId =

        APP_STATE.athletes[0]?.id ||
        null;


      saveSelectedAthlete();


      syncAthleteSelects();

      renderAthleteList();

      renderDashboard();

      renderRecords();


      showToast(
        "데이터 복원 완료"
      );

    }

    catch (error) {

      console.error(
        error
      );


      showToast(
        "올바른 백업 파일이 아닙니다."
      );

    }

  };


  reader.readAsText(
    file
  );


  event.target.value =
    "";

}


/* =========================================================
   122. CLEAR ALL DATA
========================================================= */

function clearAllData() {

  const confirmed =

    window.confirm(

      "선수·분석·프로그램 데이터를 모두 삭제할까요?\n\n이 작업은 되돌릴 수 없습니다."

    );


  if (!confirmed) {

    return;

  }


  APP_STATE.athletes = [];

  APP_STATE.analyses = [];

  APP_STATE.programs = [];

  APP_STATE.currentProgramExercises =
    [];

  APP_STATE.selectedAthleteId =
    null;


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


  syncAthleteSelects();

  renderAthleteList();

  renderDashboard();

  renderRecords();

  renderCurrentProgram();


  showToast(
    "모든 데이터가 초기화되었습니다."
  );

}


/* =========================================================
   123. DATA EVENTS
========================================================= */

function setupDataEvents() {

  document
    .getElementById(
      "backupDataBtn"
    )
    ?.addEventListener(
      "click",
      backupAllData
    );


  document
    .getElementById(
      "restoreDataInput"
    )
    ?.addEventListener(
      "change",
      restoreAllData
    );


  document
    .getElementById(
      "clearDataBtn"
    )
    ?.addEventListener(
      "click",
      clearAllData
    );


  document
    .getElementById(
      "exportCSVBtn"
    )
    ?.addEventListener(
      "click",
      exportAnalysisCSV
    );

}


/* =========================================================
   124. RESTORE LAST EXERCISE
========================================================= */

function restoreSelectedExercise() {

  const saved =

    localStorage.getItem(

      APP_CONFIG.storage
        .selectedExercise

    );


  if (!saved) {

    return;

  }


  const exercise =

    getExerciseSafe(
      saved
    );


  if (!exercise) {

    return;

  }


  FINAL_STATE.selectedExerciseId =
    saved;


  const select =

    document.getElementById(
      "analysisExercise"
    );


  if (select) {

    select.value =
      saved;


    renderExerciseCheckpoints(
      exercise
    );


    renderExerciseRanges(
      exercise
    );


    updateMetricText(

      "motionAnalysisTitle",

      `${exercise.name} 자세 분석`

    );

  }

}


/* =========================================================
   125. RESET MOTION WHEN START
========================================================= */

const originalStartMotionMeasurement =
  startMotionMeasurement;


startMotionMeasurement =
  function() {

    resetRepCounter();


    MOTION_STATE.startTime =
      null;


    originalStartMotionMeasurement();

  };


/* =========================================================
   126. STOP CAMERA ON PAGE CLOSE
========================================================= */

window.addEventListener(
  "beforeunload",
  () => {

    stopCameraStream();


    if (
      MOTION_STATE.pose &&
      typeof MOTION_STATE.pose.close ===
        "function"
    ) {

      try {

        MOTION_STATE.pose.close();

      }

      catch (_) {}

    }

  }
);


/* =========================================================
   127. FINAL INITIALIZATION
========================================================= */

function initializeFinalSystem() {

  syncExerciseSelects();

  setupAnalysisExerciseChange();

  setupExerciseCardNavigation();

  setupRecordModal();

  setupRecordFilters();

  setupProgramEvents();

  setupDataEvents();

  initializeAngleChart();

  renderRecords();

  renderCurrentProgram();

  restoreSelectedExercise();


  console.log(
    "[WEIGHT LAB] FINAL SYSTEM READY"
  );

}


/* =========================================================
   128. START FINAL
========================================================= */

if (
  document.readyState ===
  "loading"
) {

  document.addEventListener(

    "DOMContentLoaded",

    initializeFinalSystem

  );

}

else {

  initializeFinalSystem();

}


/* =========================================================
   WEIGHT PERFORMANCE LAB
   APP.JS COMPLETE

   PART 1 + PART 2 + PART 3
========================================================= */