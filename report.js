/* =========================================================
   SEOLCHEON HIGH SCHOOL
   WEIGHT PERFORMANCE LAB

   REPORT.JS
   PART 1 / 3

   PERFORMANCE REPORT ENGINE
   ---------------------------------------------------------
   - Report State
   - Athlete / Analysis Loading
   - Latest Analysis Connection
   - Athlete Information
   - Exercise Information
   - Exercise Pictogram
   - Overall Score
   - Performance Metrics
   - Representative Motion Frame
   - Report Date
========================================================= */

"use strict";


/* =========================================================
   01. REPORT CONFIG
========================================================= */

const REPORT_CONFIG = {

  analysisStorageKey:
    "seolcheon_weight_analyses",

  athleteStorageKeys: [

    "seolcheon_weight_athletes",

    "seolcheon_pro_athletes",

    "weight_athletes",

    "athletes"

  ],

  systemName:
    "설천고 WEIGHT PERFORMANCE LAB",

  reportName:
    "WEIGHT PERFORMANCE REPORT",

  version:
    "1.0.0"

};


/* =========================================================
   02. REPORT STATE
========================================================= */

const REPORT_STATE = {

  athlete:
    null,

  analysis:
    null,

  records:
    [],

  radarChart:
    null,

  generatedAt:
    null

};


/* =========================================================
   03. REPORT DOM
========================================================= */

const REPORT_DOM = {

  athleteSelect:
    document.getElementById(
      "reportAthlete"
    ),

  generateButton:
    document.getElementById(
      "generateReportBtn"
    ),

  printButton:
    document.getElementById(
      "printReportBtn"
    ),

  paper:
    document.getElementById(
      "reportPaper"
    ),

  generatedDate:
    document.getElementById(
      "reportGeneratedDate"
    ),

  overallScore:
    document.getElementById(
      "reportOverallScore"
    ),

  athleteName:
    document.getElementById(
      "reportAthleteName"
    ),

  sport:
    document.getElementById(
      "reportSport"
    ),

  height:
    document.getElementById(
      "reportHeight"
    ),

  weight:
    document.getElementById(
      "reportWeight"
    ),

  exercisePictogram:
    document.getElementById(
      "reportExercisePictogram"
    ),

  exerciseName:
    document.getElementById(
      "reportExerciseName"
    ),

  exerciseCategory:
    document.getElementById(
      "reportExerciseCategory"
    ),

  radarCanvas:
    document.getElementById(
      "reportRadarChart"
    ),

  strength:
    document.getElementById(
      "reportStrength"
    ),

  power:
    document.getElementById(
      "reportPower"
    ),

  stability:
    document.getElementById(
      "reportStability"
    ),

  symmetry:
    document.getElementById(
      "reportSymmetry"
    ),

  mobility:
    document.getElementById(
      "reportMobility"
    ),

  technique:
    document.getElementById(
      "reportTechnique"
    ),

  analysisFrame:
    document.getElementById(
      "reportAnalysisFrame"
    ),

  recommendations:
    document.getElementById(
      "reportRecommendations"
    )

};


/* =========================================================
   04. SAFE JSON PARSE
========================================================= */

function reportSafeJSONParse(
  value,
  fallback = []
) {

  if (!value) {
    return fallback;
  }


  try {

    return JSON.parse(
      value
    );

  }

  catch (error) {

    console.warn(
      "REPORT JSON PARSE ERROR",
      error
    );

    return fallback;

  }

}


/* =========================================================
   05. LOAD ATHLETES
========================================================= */

function loadReportAthletes() {

  for (
    const key of
    REPORT_CONFIG.athleteStorageKeys
  ) {

    const raw =
      localStorage.getItem(
        key
      );


    if (!raw) {
      continue;
    }


    const athletes =
      reportSafeJSONParse(
        raw,
        []
      );


    if (
      Array.isArray(athletes) &&
      athletes.length
    ) {

      return athletes;

    }

  }


  /*
    app.js에서 전역 선수 배열을
    사용하고 있는 경우에도 대응
  */

  const possibleGlobalLists = [

    window.ATHLETES,

    window.athletes,

    window.athleteDatabase

  ];


  for (
    const list of
    possibleGlobalLists
  ) {

    if (
      Array.isArray(list)
    ) {

      return list;

    }

  }


  return [];

}


/* =========================================================
   06. LOAD ANALYSIS RECORDS
========================================================= */

function loadReportAnalysisRecords() {

  /*
    analysis.js에서 만든 전역 함수가 있으면
    그것을 가장 먼저 사용
  */

  if (
    typeof window
      .getWeightAnalysisRecords ===
    "function"
  ) {

    const records =
      window
        .getWeightAnalysisRecords();


    if (
      Array.isArray(records)
    ) {

      REPORT_STATE.records =
        records;


      return records;

    }

  }


  const raw =
    localStorage.getItem(
      REPORT_CONFIG
        .analysisStorageKey
    );


  const records =
    reportSafeJSONParse(
      raw,
      []
    );


  REPORT_STATE.records =
    Array.isArray(records)
      ? records
      : [];


  return REPORT_STATE.records;

}


/* =========================================================
   07. ATHLETE ID
========================================================= */

function getReportAthleteId(
  athlete
) {

  if (!athlete) {
    return "";
  }


  return String(

    athlete.id ??

    athlete.athleteId ??

    athlete.uid ??

    athlete.name ??

    ""

  );

}


/* =========================================================
   08. ATHLETE NAME
========================================================= */

function getReportAthleteName(
  athlete
) {

  if (!athlete) {
    return "선수 미선택";
  }


  return (

    athlete.name ||

    athlete.athleteName ||

    athlete.playerName ||

    "이름 없음"

  );

}


/* =========================================================
   09. POPULATE ATHLETE SELECT
========================================================= */

function populateReportAthleteSelect() {

  const select =
    REPORT_DOM.athleteSelect;


  if (!select) {
    return;
  }


  const athletes =
    loadReportAthletes();


  const previousValue =
    select.value;


  select.innerHTML = `

    <option value="">
      선수 선택
    </option>

  `;


  athletes.forEach(
    athlete => {

      const option =
        document.createElement(
          "option"
        );


      option.value =
        getReportAthleteId(
          athlete
        );


      option.textContent =
        getReportAthleteName(
          athlete
        );


      select.appendChild(
        option
      );

    }
  );


  if (
    previousValue &&
    [
      ...select.options
    ].some(
      option =>
        option.value ===
        previousValue
    )
  ) {

    select.value =
      previousValue;

  }

}


/* =========================================================
   10. FIND ATHLETE
========================================================= */

function findReportAthlete(
  athleteId
) {

  const athletes =
    loadReportAthletes();


  return (

    athletes.find(
      athlete =>

        getReportAthleteId(
          athlete
        ) ===
        String(
          athleteId
        )
    )

    ||

    null

  );

}


/* =========================================================
   11. FIND LATEST ANALYSIS
========================================================= */

function findLatestReportAnalysis(
  athleteId
) {

  /*
    analysis.js bridge
  */

  if (
    typeof window
      .getLatestWeightAnalysis ===
    "function"
  ) {

    const analysis =
      window
        .getLatestWeightAnalysis(
          athleteId
        );


    if (analysis) {

      return analysis;

    }

  }


  const records =
    loadReportAnalysisRecords();


  const athleteRecords =
    records.filter(
      record =>

        String(
          record.athleteId
        ) ===
        String(
          athleteId
        )
    );


  if (
    athleteRecords.length ===
    0
  ) {

    return null;

  }


  athleteRecords.sort(
    (
      a,
      b
    ) => {

      return (

        new Date(
          b.createdAt ||
          0
        )

        -

        new Date(
          a.createdAt ||
          0
        )

      );

    }
  );


  return athleteRecords[0];

}


/* =========================================================
   12. FORMAT DATE
========================================================= */

function formatReportDate(
  value = new Date()
) {

  const date =
    value instanceof Date
      ? value
      : new Date(value);


  if (
    Number.isNaN(
      date.getTime()
    )
  ) {

    return "-";

  }


  const year =
    date.getFullYear();


  const month =
    String(
      date.getMonth() + 1
    ).padStart(
      2,
      "0"
    );


  const day =
    String(
      date.getDate()
    ).padStart(
      2,
      "0"
    );


  const hours =
    String(
      date.getHours()
    ).padStart(
      2,
      "0"
    );


  const minutes =
    String(
      date.getMinutes()
    ).padStart(
      2,
      "0"
    );


  return (
    `${year}.${month}.${day} ${hours}:${minutes}`
  );

}


/* =========================================================
   13. SCORE VALUE
========================================================= */

function normalizeReportScore(
  value
) {

  const number =
    Number(value);


  if (
    !Number.isFinite(number)
  ) {

    return 0;

  }


  return Math.round(

    Math.max(
      0,
      Math.min(
        100,
        number
      )
    )

  );

}


/* =========================================================
   14. TEXT
========================================================= */

function reportText(
  value,
  fallback = "-"
) {

  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {

    return fallback;

  }


  return String(value);

}


/* =========================================================
   15. ATHLETE HEIGHT
========================================================= */

function getAthleteHeight(
  athlete
) {

  const value =

    athlete?.height ??

    athlete?.athleteHeight;


  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {

    return "-";

  }


  return `${value} cm`;

}


/* =========================================================
   16. ATHLETE WEIGHT
========================================================= */

function getAthleteWeight(
  athlete
) {

  const value =

    athlete?.weight ??

    athlete?.athleteWeight;


  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {

    return "-";

  }


  return `${value} kg`;

}


/* =========================================================
   17. SPORT
========================================================= */

function getAthleteSport(
  athlete
) {

  return (

    athlete?.sport ||

    athlete?.mainSport ||

    athlete?.athleteSport ||

    "-"

  );

}


/* =========================================================
   18. EXERCISE DATABASE
========================================================= */

function getReportExerciseDatabase() {

  const possibleArrays = [

    window.EXERCISES,

    window.exercises,

    window.EXERCISE_DATABASE,

    window.exerciseDatabase,

    window.WEIGHT_EXERCISES

  ];


  for (
    const list of
    possibleArrays
  ) {

    if (
      Array.isArray(list)
    ) {

      return list;

    }

  }


  return [];

}


/* =========================================================
   19. FIND EXERCISE
========================================================= */

function findReportExercise(
  analysis
) {

  if (!analysis) {
    return null;
  }


  const database =
    getReportExerciseDatabase();


  const exerciseId =
    analysis.exerciseId;


  if (
    exerciseId
  ) {

    const found =
      database.find(
        exercise =>

          String(
            exercise.id
          ) ===
          String(
            exerciseId
          )
      );


    if (found) {
      return found;
    }

  }


  const name =
    analysis.exerciseName;


  if (
    name
  ) {

    const found =
      database.find(
        exercise =>

          String(
            exercise.name
          ).toLowerCase() ===
          String(
            name
          ).toLowerCase()
      );


    if (found) {
      return found;
    }

  }


  return null;

}


/* =========================================================
   20. EXERCISE PICTOGRAM

   exercises.js에 pictogram/icon이 있으면
   그것을 사용하고 없으면 운동 종류에 따라 자동 지정
========================================================= */

function getExercisePictogram(
  analysis
) {

  const exercise =
    findReportExercise(
      analysis
    );


  if (
    exercise?.pictogram
  ) {

    return exercise.pictogram;

  }


  if (
    exercise?.icon
  ) {

    return exercise.icon;

  }


  const name =
    (
      analysis?.exerciseName ||
      ""
    ).toLowerCase();


  if (
    name.includes(
      "스쿼트"
    ) ||
    name.includes(
      "squat"
    )
  ) {

    return "🏋";

  }


  if (
    name.includes(
      "데드"
    ) ||
    name.includes(
      "deadlift"
    )
  ) {

    return "🏋";

  }


  if (
    name.includes(
      "벤치"
    ) ||
    name.includes(
      "bench"
    )
  ) {

    return "🏋";

  }


  if (
    name.includes(
      "클린"
    ) ||
    name.includes(
      "clean"
    )
  ) {

    return "🏋";

  }


  if (
    name.includes(
      "스내치"
    ) ||
    name.includes(
      "snatch"
    )
  ) {

    return "🏋";

  }


  if (
    name.includes(
      "점프"
    ) ||
    name.includes(
      "jump"
    )
  ) {

    return "⚡";

  }


  if (
    name.includes(
      "플랭크"
    ) ||
    name.includes(
      "core"
    )
  ) {

    return "◎";

  }


  return "🏋";

}


/* =========================================================
   21. EXERCISE CATEGORY NAME
========================================================= */

function getExerciseCategoryLabel(
  analysis
) {

  const exercise =
    findReportExercise(
      analysis
    );


  const category =

    exercise?.category ||

    analysis?.exerciseCategory ||

    "";


  const map = {

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


  return (
    map[category] ||
    category ||
    "-"
  );

}


/* =========================================================
   22. GET RADAR VALUES
========================================================= */

function getReportRadarValues(
  analysis
) {

  const radar =
    analysis?.radar ||
    {};


  return {

    strength:
      normalizeReportScore(
        radar.strength ??
        analysis?.score
      ),

    power:
      normalizeReportScore(
        radar.power ??
        analysis?.score
      ),

    stability:
      normalizeReportScore(
        radar.stability ??
        analysis?.stability
      ),

    symmetry:
      normalizeReportScore(
        radar.symmetry ??
        analysis?.symmetry
      ),

    mobility:
      normalizeReportScore(
        radar.mobility ??
        analysis?.mobility
      ),

    technique:
      normalizeReportScore(
        radar.technique ??
        analysis?.technique
      )

  };

}


/* =========================================================
   23. OVERALL SCORE
========================================================= */

function calculateReportOverall(
  analysis
) {

  if (
    Number.isFinite(
      Number(
        analysis?.score
      )
    )
  ) {

    return normalizeReportScore(
      analysis.score
    );

  }


  const radar =
    getReportRadarValues(
      analysis
    );


  const values = [

    radar.strength,

    radar.power,

    radar.stability,

    radar.symmetry,

    radar.mobility,

    radar.technique

  ];


  const average =

    values.reduce(
      (
        total,
        value
      ) =>
        total + value,
      0
    )

    /

    values.length;


  return normalizeReportScore(
    average
  );

}


/* =========================================================
   24. RENDER ATHLETE INFO
========================================================= */

function renderReportAthlete(
  athlete
) {

  if (
    REPORT_DOM.athleteName
  ) {

    REPORT_DOM
      .athleteName
      .textContent =
      getReportAthleteName(
        athlete
      );

  }


  if (
    REPORT_DOM.sport
  ) {

    REPORT_DOM
      .sport
      .textContent =
      getAthleteSport(
        athlete
      );

  }


  if (
    REPORT_DOM.height
  ) {

    REPORT_DOM
      .height
      .textContent =
      getAthleteHeight(
        athlete
      );

  }


  if (
    REPORT_DOM.weight
  ) {

    REPORT_DOM
      .weight
      .textContent =
      getAthleteWeight(
        athlete
      );

  }

}


/* =========================================================
   25. RENDER EXERCISE
========================================================= */

function renderReportExercise(
  analysis
) {

  if (
    !analysis
  ) {

    if (
      REPORT_DOM.exerciseName
    ) {

      REPORT_DOM
        .exerciseName
        .textContent =
        "분석 기록 없음";

    }


    if (
      REPORT_DOM.exerciseCategory
    ) {

      REPORT_DOM
        .exerciseCategory
        .textContent =
        "-";

    }


    if (
      REPORT_DOM.exercisePictogram
    ) {

      REPORT_DOM
        .exercisePictogram
        .textContent =
        "🏋";

    }


    return;

  }


  if (
    REPORT_DOM.exerciseName
  ) {

    REPORT_DOM
      .exerciseName
      .textContent =
      reportText(
        analysis.exerciseName,
        "운동"
      );

  }


  if (
    REPORT_DOM.exerciseCategory
  ) {

    REPORT_DOM
      .exerciseCategory
      .textContent =
      getExerciseCategoryLabel(
        analysis
      );

  }


  if (
    REPORT_DOM.exercisePictogram
  ) {

    REPORT_DOM
      .exercisePictogram
      .textContent =
      getExercisePictogram(
        analysis
      );

  }

}


/* =========================================================
   26. RENDER PERFORMANCE SCORES
========================================================= */

function renderReportPerformance(
  analysis
) {

  const radar =
    getReportRadarValues(
      analysis
    );


  const values = {

    strength:
      radar.strength,

    power:
      radar.power,

    stability:
      radar.stability,

    symmetry:
      radar.symmetry,

    mobility:
      radar.mobility,

    technique:
      radar.technique

  };


  Object.entries(
    values
  ).forEach(
    (
      [
        key,
        value
      ]
    ) => {

      const element =
        REPORT_DOM[key];


      if (!element) {
        return;
      }


      element.textContent =
        `${value} / 100`;

    }
  );


  if (
    REPORT_DOM.overallScore
  ) {

    REPORT_DOM
      .overallScore
      .textContent =
      calculateReportOverall(
        analysis
      );

  }

}


/* =========================================================
   27. ANALYSIS FRAME
========================================================= */

function renderReportAnalysisFrame(
  analysis
) {

  const container =
    REPORT_DOM.analysisFrame;


  if (!container) {
    return;
  }


  const frame =
    analysis?.frame;


  if (!frame) {

    container.innerHTML = `

      <div class="report-frame-empty">

        <div class="report-frame-icon">
          ◎
        </div>

        <strong>
          분석 대표 장면 없음
        </strong>

        <p>
          자세 분석을 완료하면
          스켈레톤이 포함된 대표 장면이 표시됩니다.
        </p>

      </div>

    `;


    return;

  }


  container.innerHTML =
    "";


  const image =
    document.createElement(
      "img"
    );


  image.src =
    frame;


  image.alt =
    "웨이트 자세 분석 대표 장면";


  image.className =
    "report-motion-image";


  container.appendChild(
    image
  );

}


/* =========================================================
   28. REPORT DATE
========================================================= */

function renderReportDate() {

  REPORT_STATE.generatedAt =
    new Date();


  if (
    REPORT_DOM.generatedDate
  ) {

    REPORT_DOM
      .generatedDate
      .textContent =
      formatReportDate(
        REPORT_STATE.generatedAt
      );

  }

}


/* =========================================================
   29. EMPTY REPORT
========================================================= */

function renderEmptyReport() {

  REPORT_STATE.athlete =
    null;


  REPORT_STATE.analysis =
    null;


  if (
    REPORT_DOM.athleteName
  ) {

    REPORT_DOM
      .athleteName
      .textContent =
      "-";

  }


  if (
    REPORT_DOM.sport
  ) {

    REPORT_DOM
      .sport
      .textContent =
      "-";

  }


  if (
    REPORT_DOM.height
  ) {

    REPORT_DOM
      .height
      .textContent =
      "-";

  }


  if (
    REPORT_DOM.weight
  ) {

    REPORT_DOM
      .weight
      .textContent =
      "-";

  }


  if (
    REPORT_DOM.overallScore
  ) {

    REPORT_DOM
      .overallScore
      .textContent =
      "--";

  }


  renderReportExercise(
    null
  );


  renderReportAnalysisFrame(
    null
  );


  if (
    REPORT_DOM.recommendations
  ) {

    REPORT_DOM
      .recommendations
      .textContent =
      "분석 결과가 없습니다.";

  }

}


/* =========================================================
   30. GENERATE BASE REPORT
========================================================= */

function generateWeightPerformanceReport() {

  const athleteId =
    REPORT_DOM
      .athleteSelect
      ?.value;


  if (!athleteId) {

    if (
      typeof showToast ===
      "function"
    ) {

      showToast(
        "리포트를 생성할 선수를 선택하세요."
      );

    }


    return null;

  }


  const athlete =
    findReportAthlete(
      athleteId
    );


  if (!athlete) {

    if (
      typeof showToast ===
      "function"
    ) {

      showToast(
        "선수 정보를 찾을 수 없습니다."
      );

    }


    return null;

  }


  const analysis =
    findLatestReportAnalysis(
      athleteId
    );


  REPORT_STATE.athlete =
    athlete;


  REPORT_STATE.analysis =
    analysis;


  renderReportDate();


  renderReportAthlete(
    athlete
  );


  renderReportExercise(
    analysis
  );


  renderReportPerformance(
    analysis
  );


  renderReportAnalysisFrame(
    analysis
  );


  /*
    PART 2에서 구현되는 함수.
  */

  if (
    typeof renderPerformanceRadar ===
    "function"
  ) {

    renderPerformanceRadar(
      analysis
    );

  }


  if (
    typeof renderReportRecommendations ===
    "function"
  ) {

    renderReportRecommendations(
      analysis
    );

  }


  if (
    typeof renderDetailedBiomechanics ===
    "function"
  ) {

    renderDetailedBiomechanics(
      analysis
    );

  }


  if (
    typeof showToast ===
    "function"
  ) {

    if (analysis) {

      showToast(
        "선수 퍼포먼스 리포트를 생성했습니다."
      );

    }

    else {

      showToast(
        "선수 정보는 불러왔지만 아직 분석 기록이 없습니다."
      );

    }

  }


  return {

    athlete,

    analysis

  };

}


/* =========================================================
   31. GLOBAL REPORT GENERATOR
========================================================= */

window.generateWeightPerformanceReport =
  generateWeightPerformanceReport;


/* =========================================================
   32. REPORT SELECT EVENT
========================================================= */

function connectReportAthleteSelect() {

  REPORT_DOM
    .athleteSelect
    ?.addEventListener(
      "change",
      () => {

        const athleteId =
          REPORT_DOM
            .athleteSelect
            .value;


        if (!athleteId) {

          renderEmptyReport();

          return;

        }


        /*
          선수 선택만 해도 미리보기 자동 생성
        */

        generateWeightPerformanceReport();

      }
    );

}


/* =========================================================
   33. GENERATE BUTTON
========================================================= */

function connectReportGenerateButton() {

  REPORT_DOM
    .generateButton
    ?.addEventListener(
      "click",
      () => {

        generateWeightPerformanceReport();

      }
    );

}


/* =========================================================
   34. REFRESH AFTER ANALYSIS SAVE
========================================================= */

function connectReportAnalysisSaveEvent() {

  window.addEventListener(
    "seolcheonAnalysisSaved",
    event => {

      loadReportAnalysisRecords();


      const record =
        event.detail;


      const selectedAthlete =
        REPORT_DOM
          .athleteSelect
          ?.value;


      if (
        selectedAthlete &&
        String(
          selectedAthlete
        ) ===
        String(
          record?.athleteId
        )
      ) {

        generateWeightPerformanceReport();

      }

    }
  );

}


/* =========================================================
   35. PART 1 INITIALIZATION
========================================================= */

function initializeReportPart1() {

  populateReportAthleteSelect();


  loadReportAnalysisRecords();


  connectReportAthleteSelect();


  connectReportGenerateButton();


  connectReportAnalysisSaveEvent();


  renderReportDate();


  console.log(
    "WEIGHT PERFORMANCE REPORT / PART 1 READY"
  );

}


/* =========================================================
   36. SAFE START
========================================================= */

if (
  document.readyState ===
  "loading"
) {

  document.addEventListener(
    "DOMContentLoaded",
    initializeReportPart1
  );

}

else {

  initializeReportPart1();

}


/* =========================================================
   REPORT.JS PART 1 / 3 COMPLETE

   ✓ Athlete Loading
   ✓ Analysis Loading
   ✓ Latest Analysis
   ✓ Athlete Profile
   ✓ Exercise Information
   ✓ Exercise Pictogram
   ✓ Overall Score
   ✓ Six Performance Metrics
   ✓ Representative Motion Frame
   ✓ Auto Report Preview

   PART 2
   ↓
   Performance Radar
   Detailed Joint Analysis
   Angle Evaluation
   Training Recommendations
   Report Interpretation
========================================================= */
/* =========================================================
   SEOLCHEON HIGH SCHOOL
   WEIGHT PERFORMANCE LAB

   REPORT.JS
   PART 2 / 3

   PERFORMANCE INTERPRETATION ENGINE
   ---------------------------------------------------------
   - Performance Radar
   - Biomechanics Detail
   - Joint Angle Analysis
   - Performance Grade
   - Movement Issue Detection
   - Training Recommendation
   - Coach Summary
========================================================= */


/* =========================================================
   37. PERFORMANCE RADAR
========================================================= */

function renderPerformanceRadar(analysis) {

  const canvas =
    REPORT_DOM.radarCanvas;

  if (
    !canvas ||
    typeof Chart === "undefined"
  ) {
    return;
  }


  const radar =
    getReportRadarValues(
      analysis
    );


  const values = [

    radar.strength,

    radar.power,

    radar.stability,

    radar.symmetry,

    radar.mobility,

    radar.technique

  ];


  if (
    REPORT_STATE.radarChart
  ) {

    REPORT_STATE
      .radarChart
      .destroy();

  }


  REPORT_STATE.radarChart =
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

              data:
                values,

              borderWidth:
                2,

              pointRadius:
                4,

              pointHoverRadius:
                6,

              fill:
                true

            }

          ]

        },


        options: {

          responsive:
            true,

          maintainAspectRatio:
            false,

          animation: {

            duration:
              600

          },

          scales: {

            r: {

              beginAtZero:
                true,

              min:
                0,

              max:
                100,

              ticks: {

                stepSize:
                  20,

                backdropColor:
                  "transparent"

              },

              pointLabels: {

                font: {

                  size:
                    13,

                  weight:
                    "600"

                }

              }

            }

          },

          plugins: {

            legend: {

              display:
                false

            },

            tooltip: {

              callbacks: {

                label:
                  context =>
                    `${context.raw} / 100`

              }

            }

          }

        }

      }
    );

}


/* =========================================================
   38. PERFORMANCE GRADE
========================================================= */

function getPerformanceGrade(
  score
) {

  const value =
    normalizeReportScore(
      score
    );


  if (
    value >= 95
  ) {

    return {

      grade:
        "S+",

      label:
        "EXCELLENT",

      description:
        "매우 높은 수준"

    };

  }


  if (
    value >= 90
  ) {

    return {

      grade:
        "S",

      label:
        "EXCELLENT",

      description:
        "우수한 수준"

    };

  }


  if (
    value >= 85
  ) {

    return {

      grade:
        "A",

      label:
        "VERY GOOD",

      description:
        "안정적인 수준"

    };

  }


  if (
    value >= 75
  ) {

    return {

      grade:
        "B",

      label:
        "GOOD",

      description:
        "양호하지만 개선 가능"

    };

  }


  if (
    value >= 65
  ) {

    return {

      grade:
        "C",

      label:
        "NEEDS WORK",

      description:
        "일부 보완 필요"

    };

  }


  return {

    grade:
      "D",

    label:
      "DEVELOPMENT",

    description:
      "기술 재점검 필요"

  };

}


/* =========================================================
   39. ANGLE VALUE
========================================================= */

function getReportAngle(
  analysis,
  key
) {

  const value =
    analysis
      ?.angles
      ?.[key];


  if (
    value === null ||
    value === undefined ||
    !Number.isFinite(
      Number(value)
    )
  ) {

    return null;

  }


  return Math.round(
    Number(value)
  );

}


/* =========================================================
   40. FORMAT ANGLE
========================================================= */

function formatReportAngle(
  value
) {

  if (
    value === null ||
    value === undefined
  ) {

    return "-";

  }


  return `${value}°`;

}


/* =========================================================
   41. BIOMECHANICS CONTAINER

   index.html에 별도 상세 영역이 없어도
   JS가 자동 생성
========================================================= */

function ensureBiomechanicsContainer() {

  let container =
    document.getElementById(
      "reportBiomechanics"
    );


  if (container) {
    return container;
  }


  const frameSection =
    REPORT_DOM
      .analysisFrame
      ?.closest(
        ".report-section"
      );


  if (!frameSection) {
    return null;
  }


  const section =
    document.createElement(
      "section"
    );


  section.className =
    "report-section report-biomechanics-section";


  section.innerHTML = `

    <h3>
      5-1. 관절 · 움직임 상세 분석
    </h3>

    <div
      class="report-biomechanics-grid"
      id="reportBiomechanics"
    ></div>

  `;


  frameSection.insertAdjacentElement(
    "afterend",
    section
  );


  return document.getElementById(
    "reportBiomechanics"
  );

}


/* =========================================================
   42. RENDER BIOMECHANICS
========================================================= */

function renderDetailedBiomechanics(
  analysis
) {

  const container =
    ensureBiomechanicsContainer();


  if (!container) {
    return;
  }


  if (!analysis) {

    container.innerHTML = `

      <div class="empty-state">
        자세 분석 기록이 없습니다.
      </div>

    `;

    return;

  }


  const knee =
    getReportAngle(
      analysis,
      "knee"
    );


  const hip =
    getReportAngle(
      analysis,
      "hip"
    );


  const ankle =
    getReportAngle(
      analysis,
      "ankle"
    );


  const trunk =
    getReportAngle(
      analysis,
      "trunk"
    );


  const items = [

    {

      title:
        "무릎 각도",

      value:
        formatReportAngle(
          knee
        ),

      code:
        "KNEE",

      description:
        getJointAngleComment(
          "knee",
          knee,
          analysis
        )

    },


    {

      title:
        "고관절 각도",

      value:
        formatReportAngle(
          hip
        ),

      code:
        "HIP",

      description:
        getJointAngleComment(
          "hip",
          hip,
          analysis
        )

    },


    {

      title:
        "발목 각도",

      value:
        formatReportAngle(
          ankle
        ),

      code:
        "ANKLE",

      description:
        getJointAngleComment(
          "ankle",
          ankle,
          analysis
        )

    },


    {

      title:
        "몸통 기울기",

      value:
        formatReportAngle(
          trunk
        ),

      code:
        "TRUNK",

      description:
        getJointAngleComment(
          "trunk",
          trunk,
          analysis
        )

    },


    {

      title:
        "좌우 대칭",

      value:
        `${normalizeReportScore(
          analysis.symmetry
        )}%`,

      code:
        "SYMMETRY",

      description:
        getSymmetryComment(
          analysis.symmetry
        )

    },


    {

      title:
        "가동범위",

      value:
        analysis.rom !==
        undefined
          ? `${Math.round(
              Number(
                analysis.rom
              ) || 0
            )}°`
          : "-",

      code:
        "ROM",

      description:
        getROMComment(
          analysis
        )

    }

  ];


  container.innerHTML =
    items
      .map(
        item => `

          <article class="report-bio-card">

            <span class="report-bio-code">
              ${item.code}
            </span>

            <strong class="report-bio-value">
              ${item.value}
            </strong>

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

}


/* =========================================================
   43. JOINT ANGLE COMMENT

   중요:
   실제 "좋은 각도"는 운동 종류/개인/촬영 방향에 따라
   달라지므로 절대값으로 진단하지 않음.
========================================================= */

function getJointAngleComment(
  joint,
  value,
  analysis
) {

  if (
    value === null ||
    value === undefined
  ) {

    return (
      "측정 가능한 관절 데이터가 없습니다."
    );

  }


  const exercise =
    reportText(
      analysis?.exerciseName,
      "현재 운동"
    );


  const comments = {

    knee:
      `${exercise} 수행 중 무릎 각도 ${value}°가 측정되었습니다. 반복 간 각도 변화와 좌우 차이를 함께 확인하세요.`,

    hip:
      `${exercise} 수행 중 고관절 각도 ${value}°가 측정되었습니다. 무릎·몸통 움직임과 함께 패턴을 확인하세요.`,

    ankle:
      `발목 각도 ${value}°가 측정되었습니다. 발의 안정성과 하체 관절의 연동을 함께 확인하세요.`,

    trunk:
      `몸통 관련 각도 ${value}°가 측정되었습니다. 운동 특성과 촬영 방향을 고려해 몸통 위치 변화를 확인하세요.`

  };


  return (
    comments[joint] ||
    `${value}° 측정`
  );

}


/* =========================================================
   44. SYMMETRY COMMENT
========================================================= */

function getSymmetryComment(
  score
) {

  const value =
    normalizeReportScore(
      score
    );


  if (
    value >= 90
  ) {

    return (
      "좌우 움직임이 비교적 균형 있게 나타났습니다."
    );

  }


  if (
    value >= 80
  ) {

    return (
      "작은 좌우 차이가 감지되었습니다. 반복 측정으로 일관성을 확인하세요."
    );

  }


  if (
    value >= 70
  ) {

    return (
      "좌우 움직임 차이가 나타났습니다. 단측 운동과 저중량 기술 훈련을 고려할 수 있습니다."
    );

  }


  return (
    "좌우 차이가 크게 계산되었습니다. 촬영 위치와 관절 인식 정확도를 먼저 확인한 뒤 재측정하세요."
  );

}


/* =========================================================
   45. ROM COMMENT
========================================================= */

function getROMComment(
  analysis
) {

  const value =
    Number(
      analysis?.rom
    );


  if (
    !Number.isFinite(value)
  ) {

    return (
      "가동범위 데이터가 없습니다."
    );

  }


  return (
    `이번 분석에서 계산된 움직임 범위는 약 ${Math.round(value)}°입니다. 동일 운동의 이전 기록과 비교해 변화를 확인하세요.`
  );

}


/* =========================================================
   46. MOVEMENT ISSUE DETECTION
========================================================= */

function detectMovementIssues(
  analysis
) {

  if (!analysis) {
    return [];
  }


  const issues =
    [];


  const radar =
    getReportRadarValues(
      analysis
    );


  if (
    radar.symmetry <
    80
  ) {

    issues.push({

      type:
        "symmetry",

      priority:
        1,

      title:
        "좌우 대칭성",

      message:
        "좌우 움직임 차이가 상대적으로 크게 계산되었습니다."

    });

  }


  if (
    radar.stability <
    80
  ) {

    issues.push({

      type:
        "stability",

      priority:
        2,

      title:
        "동작 안정성",

      message:
        "동작 과정에서 관절 또는 몸통 위치의 변동성이 높게 계산되었습니다."

    });

  }


  if (
    radar.mobility <
    80
  ) {

    issues.push({

      type:
        "mobility",

      priority:
        3,

      title:
        "가동성",

      message:
        "현재 분석에서 가동성 점수가 상대적으로 낮게 나타났습니다."

    });

  }


  if (
    radar.technique <
    80
  ) {

    issues.push({

      type:
        "technique",

      priority:
        4,

      title:
        "기술 수행",

      message:
        "기술 점수가 목표 범위보다 낮게 계산되었습니다."

    });

  }


  if (
    radar.power <
    75
  ) {

    issues.push({

      type:
        "power",

      priority:
        5,

      title:
        "파워",

      message:
        "파워 관련 지표가 다른 항목보다 낮게 나타났습니다."

    });

  }


  if (
    radar.strength <
    75
  ) {

    issues.push({

      type:
        "strength",

      priority:
        6,

      title:
        "근력",

      message:
        "현재 기록에서 근력 지표가 상대적으로 낮게 계산되었습니다."

    });

  }


  return issues.sort(
    (
      a,
      b
    ) =>
      a.priority -
      b.priority
  );

}


/* =========================================================
   47. EXERCISE RECOMMENDATION DATABASE
========================================================= */

const REPORT_TRAINING_LIBRARY = {

  symmetry: [

    {
      name:
        "불가리안 스플릿 스쿼트",

      category:
        "단측 하체",

      reason:
        "좌우 하체를 독립적으로 사용"
    },

    {
      name:
        "싱글 레그 RDL",

      category:
        "단측 힙힌지",

      reason:
        "한쪽 고관절 컨트롤"
    },

    {
      name:
        "스텝업",

      category:
        "하체",

      reason:
        "좌우 힘 발휘 비교"
    },

    {
      name:
        "싱글 레그 브리지",

      category:
        "둔근",

      reason:
        "좌우 둔근 활성 패턴 확인"
    },

    {
      name:
        "원암 덤벨 로우",

      category:
        "등",

      reason:
        "상체 좌우 독립 컨트롤"
    }

  ],


  stability: [

    {
      name:
        "데드버그",

      category:
        "코어",

      reason:
        "몸통 안정성"
    },

    {
      name:
        "버드독",

      category:
        "코어",

      reason:
        "몸통과 골반 컨트롤"
    },

    {
      name:
        "팔로프 프레스",

      category:
        "코어",

      reason:
        "회전 저항 능력"
    },

    {
      name:
        "플랭크",

      category:
        "코어",

      reason:
        "기본 몸통 안정성"
    },

    {
      name:
        "사이드 플랭크",

      category:
        "코어",

      reason:
        "측면 안정성"
    }

  ],


  mobility: [

    {
      name:
        "발목 도르시플렉션 모빌리티",

      category:
        "가동성",

      reason:
        "발목 움직임 준비"
    },

    {
      name:
        "90/90 힙 모빌리티",

      category:
        "가동성",

      reason:
        "고관절 회전 움직임"
    },

    {
      name:
        "월드 그레이티스트 스트레치",

      category:
        "가동성",

      reason:
        "전신 동적 가동성"
    },

    {
      name:
        "코사크 스쿼트",

      category:
        "가동성",

      reason:
        "고관절과 내전근 움직임"
    },

    {
      name:
        "딥 스쿼트 홀드",

      category:
        "가동성",

      reason:
        "스쿼트 자세 적응"
    }

  ],


  technique: [

    {
      name:
        "템포 스쿼트",

      category:
        "기술",

      reason:
        "속도를 낮춰 자세 제어"
    },

    {
      name:
        "포즈 스쿼트",

      category:
        "기술",

      reason:
        "특정 구간 자세 확인"
    },

    {
      name:
        "PVC 힌지 드릴",

      category:
        "기술",

      reason:
        "힙힌지 패턴 학습"
    },

    {
      name:
        "저중량 기술 세트",

      category:
        "기술",

      reason:
        "반복 가능한 움직임 패턴 확보"
    },

    {
      name:
        "슬로모션 비디오 피드백",

      category:
        "분석",

      reason:
        "프레임별 자세 비교"
    }

  ],


  power: [

    {
      name:
        "박스 점프",

      category:
        "플라이오",

      reason:
        "폭발적 하체 동작"
    },

    {
      name:
        "메디신볼 스로우",

      category:
        "파워",

      reason:
        "전신 폭발적 움직임"
    },

    {
      name:
        "점프 스쿼트",

      category:
        "파워",

      reason:
        "하체 파워"
    },

    {
      name:
        "케틀벨 스윙",

      category:
        "파워",

      reason:
        "고관절 신전 속도"
    }

  ],


  strength: [

    {
      name:
        "백 스쿼트",

      category:
        "하체",

      reason:
        "전반적인 하체 근력"
    },

    {
      name:
        "트랩바 데드리프트",

      category:
        "전신",

      reason:
        "하체와 후면사슬 근력"
    },

    {
      name:
        "벤치프레스",

      category:
        "상체",

      reason:
        "상체 밀기 근력"
    },

    {
      name:
        "풀업",

      category:
        "상체",

      reason:
        "상체 당기기 근력"
    }

  ]

};


/* =========================================================
   48. GET STORED RECOMMENDATIONS
========================================================= */

function getStoredRecommendations(
  analysis
) {

  if (
    !Array.isArray(
      analysis?.recommendations
    )
  ) {

    return [];

  }


  return analysis
    .recommendations
    .filter(Boolean)
    .map(
      item => {

        if (
          typeof item === "string"
        ) {

          return {

            title:
              item,

            description:
              "자세 분석 결과를 바탕으로 추천된 훈련입니다.",

            tag:
              "ANALYSIS"

          };

        }


        return {

          title:
            item.title ||
            item.name ||
            "추천 훈련",

          description:
            item.description ||
            item.reason ||
            "분석 결과 기반 추천",

          tag:
            item.tag ||
            "ANALYSIS"

        };

      }
    );

}


/* =========================================================
   49. AUTO TRAINING RECOMMENDATIONS
========================================================= */

function buildAutomaticRecommendations(
  analysis
) {

  const issues =
    detectMovementIssues(
      analysis
    );


  const recommendations =
    [];


  issues.forEach(
    issue => {

      const library =
        REPORT_TRAINING_LIBRARY[
          issue.type
        ] ||
        [];


      library
        .slice(
          0,
          3
        )
        .forEach(
          exercise => {

            recommendations.push({

              title:
                exercise.name,

              description:
                exercise.reason,

              tag:
                issue.title

            });

          }
        );

    }
  );


  /*
    문제가 적게 잡혀도 기본 추천
  */

  if (
    recommendations.length <
    4
  ) {

    [

      {
        title:
          "저중량 기술 세트",

        description:
          "현재 운동을 낮은 부하에서 반복하며 자세 일관성을 확인합니다.",

        tag:
          "TECHNIQUE"
      },

      {
        title:
          "데드버그",

        description:
          "몸통 안정성과 사지 움직임의 협응을 훈련합니다.",

        tag:
          "CORE"
      },

      {
        title:
          "동적 가동성 루틴",

        description:
          "훈련 전 주요 관절을 준비하는 가동성 루틴입니다.",

        tag:
          "MOBILITY"
      },

      {
        title:
          "슬로모션 자세 재측정",

        description:
          "동일한 촬영 방향에서 다시 측정해 자세 변화와 일관성을 비교합니다.",

        tag:
          "RETEST"
      }

    ].forEach(
      item => {

        recommendations.push(
          item
        );

      }
    );

  }


  return recommendations;

}


/* =========================================================
   50. REMOVE DUPLICATE RECOMMENDATIONS
========================================================= */

function uniqueRecommendations(
  items
) {

  const used =
    new Set();


  return items.filter(
    item => {

      const key =
        String(
          item.title
        )
          .trim()
          .toLowerCase();


      if (
        !key ||
        used.has(key)
      ) {

        return false;

      }


      used.add(
        key
      );


      return true;

    }
  );

}


/* =========================================================
   51. RENDER TRAINING RECOMMENDATIONS
========================================================= */

function renderReportRecommendations(
  analysis
) {

  const container =
    REPORT_DOM.recommendations;


  if (!container) {
    return;
  }


  if (!analysis) {

    container.innerHTML = `

      <div class="empty-state">
        분석 완료 후 추천 훈련이 표시됩니다.
      </div>

    `;

    return;

  }


  const stored =
    getStoredRecommendations(
      analysis
    );


  const automatic =
    buildAutomaticRecommendations(
      analysis
    );


  const recommendations =
    uniqueRecommendations(
      [
        ...stored,
        ...automatic
      ]
    ).slice(
      0,
      10
    );


  container.innerHTML =
    recommendations
      .map(
        (
          item,
          index
        ) => `

          <article class="report-recommendation-card">

            <div class="report-recommendation-number">
              ${String(
                index + 1
              ).padStart(
                2,
                "0"
              )}
            </div>

            <div>

              <span class="report-recommendation-tag">
                ${item.tag}
              </span>

              <h4>
                ${item.title}
              </h4>

              <p>
                ${item.description}
              </p>

            </div>

          </article>

        `
      )
      .join("");

}


/* =========================================================
   52. COACH SUMMARY CONTAINER
========================================================= */

function ensureCoachSummaryContainer() {

  let container =
    document.getElementById(
      "reportCoachSummary"
    );


  if (container) {
    return container;
  }


  const recommendationSection =
    REPORT_DOM
      .recommendations
      ?.closest(
        ".report-section"
      );


  if (
    !recommendationSection
  ) {

    return null;

  }


  const section =
    document.createElement(
      "section"
    );


  section.className =
    "report-section report-coach-section";


  section.innerHTML = `

    <h3>
      7. 종합 분석
    </h3>

    <div
      id="reportCoachSummary"
      class="report-coach-summary"
    ></div>

  `;


  recommendationSection
    .insertAdjacentElement(
      "afterend",
      section
    );


  return document.getElementById(
    "reportCoachSummary"
  );

}


/* =========================================================
   53. STRONGEST METRIC
========================================================= */

function getStrongestMetric(
  analysis
) {

  const radar =
    getReportRadarValues(
      analysis
    );


  const metrics = [

    {
      key:
        "strength",

      name:
        "근력",

      value:
        radar.strength
    },

    {
      key:
        "power",

      name:
        "파워",

      value:
        radar.power
    },

    {
      key:
        "stability",

      name:
        "안정성",

      value:
        radar.stability
    },

    {
      key:
        "symmetry",

      name:
        "대칭성",

      value:
        radar.symmetry
    },

    {
      key:
        "mobility",

      name:
        "가동성",

      value:
        radar.mobility
    },

    {
      key:
        "technique",

      name:
        "기술",

      value:
        radar.technique
    }

  ];


  metrics.sort(
    (
      a,
      b
    ) =>
      b.value -
      a.value
  );


  return metrics[0];

}


/* =========================================================
   54. WEAKEST METRIC
========================================================= */

function getWeakestMetric(
  analysis
) {

  const radar =
    getReportRadarValues(
      analysis
    );


  const metrics = [

    {
      name:
        "근력",

      value:
        radar.strength
    },

    {
      name:
        "파워",

      value:
        radar.power
    },

    {
      name:
        "안정성",

      value:
        radar.stability
    },

    {
      name:
        "대칭성",

      value:
        radar.symmetry
    },

    {
      name:
        "가동성",

      value:
        radar.mobility
    },

    {
      name:
        "기술",

      value:
        radar.technique
    }

  ];


  metrics.sort(
    (
      a,
      b
    ) =>
      a.value -
      b.value
  );


  return metrics[0];

}


/* =========================================================
   55. COACH SUMMARY
========================================================= */

function renderCoachSummary(
  analysis
) {

  const container =
    ensureCoachSummaryContainer();


  if (!container) {
    return;
  }


  if (!analysis) {

    container.innerHTML = `

      <div class="empty-state">
        분석 기록이 없습니다.
      </div>

    `;

    return;

  }


  const overall =
    calculateReportOverall(
      analysis
    );


  const grade =
    getPerformanceGrade(
      overall
    );


  const strongest =
    getStrongestMetric(
      analysis
    );


  const weakest =
    getWeakestMetric(
      analysis
    );


  const issues =
    detectMovementIssues(
      analysis
    );


  const issueText =
    issues.length

      ? issues
          .slice(
            0,
            3
          )
          .map(
            item =>
              item.title
          )
          .join(
            " · "
          )

      : "큰 보완 항목 없음";


  container.innerHTML = `

    <div class="coach-summary-top">

      <div class="coach-grade">

        <span>
          PERFORMANCE GRADE
        </span>

        <strong>
          ${grade.grade}
        </strong>

        <small>
          ${grade.label}
        </small>

      </div>


      <div class="coach-summary-text">

        <h4>
          종합 퍼포먼스 ${overall} / 100
        </h4>

        <p>
          이번 측정의 종합 평가는
          <strong>${grade.description}</strong>입니다.
          가장 높은 지표는
          <strong>${strongest.name} ${strongest.value}</strong>,
          우선적으로 확인할 지표는
          <strong>${weakest.name} ${weakest.value}</strong>입니다.
        </p>

      </div>

    </div>


    <div class="coach-summary-grid">

      <div>

        <span>
          STRONG POINT
        </span>

        <strong>
          ${strongest.name}
        </strong>

        <small>
          ${strongest.value} / 100
        </small>

      </div>


      <div>

        <span>
          PRIORITY
        </span>

        <strong>
          ${weakest.name}
        </strong>

        <small>
          ${weakest.value} / 100
        </small>

      </div>


      <div>

        <span>
          CHECK
        </span>

        <strong>
          ${issueText}
        </strong>

      </div>

    </div>


    <p class="report-analysis-note">

      본 리포트의 자동 분석값은 영상 기반 자세 추정 결과입니다.
      촬영 각도·가림·조명·카메라 위치에 따라 오차가 발생할 수 있으므로
      코치의 실제 관찰과 함께 활용하세요.

    </p>

  `;

}


/* =========================================================
   56. ANALYSIS INFORMATION CONTAINER
========================================================= */

function ensureAnalysisInfoContainer() {

  let container =
    document.getElementById(
      "reportAnalysisInfo"
    );


  if (container) {
    return container;
  }


  const exerciseCard =
    document.querySelector(
      ".report-exercise-card"
    );


  if (!exerciseCard) {
    return null;
  }


  const containerElement =
    document.createElement(
      "div"
    );


  containerElement.id =
    "reportAnalysisInfo";


  containerElement.className =
    "report-analysis-info";


  exerciseCard
    .insertAdjacentElement(
      "afterend",
      containerElement
    );


  return containerElement;

}


/* =========================================================
   57. RENDER ANALYSIS INFO
========================================================= */

function renderReportAnalysisInfo(
  analysis
) {

  const container =
    ensureAnalysisInfoContainer();


  if (!container) {
    return;
  }


  if (!analysis) {

    container.innerHTML =
      "";

    return;

  }


  const viewNames = {

    front:
      "정면",

    side:
      "측면",

    rear:
      "후면",

    top:
      "상단"

  };


  container.innerHTML = `

    <div>

      <span>
        분석 일시
      </span>

      <strong>
        ${formatReportDate(
          analysis.createdAt
        )}
      </strong>

    </div>


    <div>

      <span>
        분석 모드
      </span>

      <strong>
        ${
          String(
            analysis.mode
          ).toUpperCase()
        }
      </strong>

    </div>


    <div>

      <span>
        촬영 방향
      </span>

      <strong>
        ${
          viewNames[
            analysis.view
          ] ||
          analysis.view ||
          "-"
        }
      </strong>

    </div>


    <div>

      <span>
        반복 횟수
      </span>

      <strong>
        ${
          analysis.reps ??
          "-"
        }
        /
        ${
          analysis.targetReps ??
          "-"
        }
      </strong>

    </div>

  `;

}


/* =========================================================
   58. FULL DETAIL RENDER
========================================================= */

function renderReportPart2(
  analysis
) {

  renderPerformanceRadar(
    analysis
  );


  renderDetailedBiomechanics(
    analysis
  );


  renderReportRecommendations(
    analysis
  );


  renderCoachSummary(
    analysis
  );


  renderReportAnalysisInfo(
    analysis
  );

}


/* =========================================================
   59. HOOK INTO PART 1 GENERATOR

   PART 1의 기존 generateWeightPerformanceReport를
   감싸서 PART 2까지 자동 실행
========================================================= */

const reportBaseGenerator =
  window.generateWeightPerformanceReport;


if (
  typeof reportBaseGenerator ===
  "function"
) {

  window.generateWeightPerformanceReport =
    function() {

      const result =
        reportBaseGenerator();


      if (
        !result
      ) {

        return null;

      }


      renderReportPart2(
        result.analysis
      );


      return result;

    };


  /*
    PART 1의 버튼 이벤트는 원래 함수 참조가
    이미 연결될 수 있으므로 버튼도 추가 보정.
  */

  REPORT_DOM
    .generateButton
    ?.addEventListener(
      "click",
      () => {

        const athleteId =
          REPORT_DOM
            .athleteSelect
            ?.value;


        if (!athleteId) {
          return;
        }


        const analysis =
          findLatestReportAnalysis(
            athleteId
          );


        setTimeout(
          () => {

            renderReportPart2(
              analysis
            );

          },
          0
        );

      }
    );

}


/* =========================================================
   60. ATHLETE SELECT PART 2 CONNECTION
========================================================= */

REPORT_DOM
  .athleteSelect
  ?.addEventListener(
    "change",
    () => {

      const athleteId =
        REPORT_DOM
          .athleteSelect
          .value;


      if (!athleteId) {

        renderReportPart2(
          null
        );

        return;

      }


      const analysis =
        findLatestReportAnalysis(
          athleteId
        );


      setTimeout(
        () => {

          renderReportPart2(
            analysis
          );

        },
        0
      );

    }
  );


/* =========================================================
   61. ANALYSIS SAVE LIVE REFRESH
========================================================= */

window.addEventListener(
  "seolcheonAnalysisSaved",
  event => {

    const record =
      event.detail;


    const selected =
      REPORT_DOM
        .athleteSelect
        ?.value;


    if (
      !selected ||
      String(
        selected
      ) !==
      String(
        record?.athleteId
      )
    ) {

      return;

    }


    setTimeout(
      () => {

        renderReportPart2(
          record
        );

      },
      0
    );

  }
);


/* =========================================================
   62. REPORT PUBLIC API
========================================================= */

window.WeightReport = {

  generate() {

    return window
      .generateWeightPerformanceReport();

  },


  getCurrentAthlete() {

    return REPORT_STATE.athlete;

  },


  getCurrentAnalysis() {

    return REPORT_STATE.analysis;

  },


  getRadar() {

    return getReportRadarValues(
      REPORT_STATE.analysis
    );

  },


  getIssues() {

    return detectMovementIssues(
      REPORT_STATE.analysis
    );

  },


  getGrade() {

    const score =
      calculateReportOverall(
        REPORT_STATE.analysis
      );


    return getPerformanceGrade(
      score
    );

  },


  refresh() {

    const athleteId =
      REPORT_DOM
        .athleteSelect
        ?.value;


    if (!athleteId) {
      return;
    }


    const analysis =
      findLatestReportAnalysis(
        athleteId
      );


    renderReportPart2(
      analysis
    );

  }

};


/* =========================================================
   63. PART 2 INITIAL RENDER
========================================================= */

function initializeReportPart2() {

  /*
    이미 선수가 선택되어 있으면
    현재 리포트 렌더링
  */

  const athleteId =
    REPORT_DOM
      .athleteSelect
      ?.value;


  if (
    athleteId
  ) {

    const analysis =
      findLatestReportAnalysis(
        athleteId
      );


    renderReportPart2(
      analysis
    );

  }


  console.log(
    "WEIGHT PERFORMANCE REPORT / PART 2 READY"
  );

}


/* =========================================================
   64. SAFE START
========================================================= */

if (
  document.readyState ===
  "loading"
) {

  document.addEventListener(
    "DOMContentLoaded",
    initializeReportPart2
  );

}

else {

  initializeReportPart2();

}


/* =========================================================
   REPORT.JS PART 2 / 3 COMPLETE

   ✓ Performance Hexagon / Radar
   ✓ Strength
   ✓ Power
   ✓ Stability
   ✓ Symmetry
   ✓ Mobility
   ✓ Technique

   ✓ Knee Angle
   ✓ Hip Angle
   ✓ Ankle Angle
   ✓ Trunk Angle
   ✓ ROM

   ✓ Movement Issue Detection
   ✓ Strong Point Detection
   ✓ Priority Detection

   ✓ Automatic Training Recommendation
   ✓ Coach Summary
   ✓ Performance Grade
   ✓ Analysis Information

   NEXT
   ↓↓↓

   REPORT.JS PART 3 / 3

   - Print / PDF
   - Report History
   - Previous vs Current
   - Progress Comparison
   - PR Detection
   - Final Report Polish
========================================================= */
/* =========================================================
   SEOLCHEON HIGH SCHOOL
   WEIGHT PERFORMANCE LAB

   REPORT.JS
   PART 3 / 3

   FINAL REPORT ENGINE
   ---------------------------------------------------------
   - Previous vs Current
   - Progress Comparison
   - PR Detection
   - Report History
   - Print / PDF
   - Report Snapshot
   - Final Initialization
========================================================= */


/* =========================================================
   65. REPORT HISTORY CONFIG
========================================================= */

const REPORT_HISTORY_KEY =
  "seolcheon_weight_reports";


/* =========================================================
   66. LOAD REPORT HISTORY
========================================================= */

function loadReportHistory() {

  return reportSafeJSONParse(

    localStorage.getItem(
      REPORT_HISTORY_KEY
    ),

    []

  );

}


/* =========================================================
   67. SAVE REPORT HISTORY
========================================================= */

function saveReportHistory(
  reports
) {

  try {

    localStorage.setItem(

      REPORT_HISTORY_KEY,

      JSON.stringify(
        reports
      )

    );


    return true;

  }

  catch (error) {

    console.error(
      "REPORT HISTORY SAVE ERROR",
      error
    );


    return false;

  }

}


/* =========================================================
   68. ATHLETE ANALYSIS HISTORY
========================================================= */

function getAthleteAnalysisHistory(
  athleteId
) {

  const records =
    loadReportAnalysisRecords();


  return records
    .filter(
      record =>

        String(
          record.athleteId
        ) ===
        String(
          athleteId
        )
    )
    .sort(
      (
        a,
        b
      ) =>

        new Date(
          b.createdAt || 0
        )

        -

        new Date(
          a.createdAt || 0
        )
    );

}


/* =========================================================
   69. SAME EXERCISE HISTORY
========================================================= */

function getSameExerciseHistory(
  analysis
) {

  if (!analysis) {
    return [];
  }


  const athleteId =
    analysis.athleteId;


  const exerciseId =
    analysis.exerciseId;


  const exerciseName =
    String(
      analysis.exerciseName || ""
    ).toLowerCase();


  return getAthleteAnalysisHistory(
    athleteId
  ).filter(
    record => {

      if (
        exerciseId &&
        record.exerciseId
      ) {

        return (
          String(
            record.exerciseId
          ) ===
          String(
            exerciseId
          )
        );

      }


      return (
        String(
          record.exerciseName || ""
        ).toLowerCase() ===
        exerciseName
      );

    }
  );

}


/* =========================================================
   70. PREVIOUS ANALYSIS
========================================================= */

function getPreviousAnalysis(
  current
) {

  const history =
    getSameExerciseHistory(
      current
    );


  if (
    history.length < 2
  ) {

    return null;

  }


  const currentId =
    String(
      current.id || ""
    );


  const index =
    history.findIndex(
      item =>
        String(
          item.id || ""
        ) ===
        currentId
    );


  if (
    index >= 0 &&
    history[index + 1]
  ) {

    return history[
      index + 1
    ];

  }


  /*
    ID를 찾지 못했을 경우
    현재 기록보다 이전 날짜의 기록 검색
  */

  const currentTime =
    new Date(
      current.createdAt || 0
    ).getTime();


  return (

    history.find(
      item =>

        new Date(
          item.createdAt || 0
        ).getTime() <
        currentTime
    )

    ||

    null

  );

}


/* =========================================================
   71. DIFFERENCE
========================================================= */

function reportDifference(
  current,
  previous
) {

  const a =
    Number(current);


  const b =
    Number(previous);


  if (
    !Number.isFinite(a) ||
    !Number.isFinite(b)
  ) {

    return null;

  }


  return Math.round(
    a - b
  );

}


/* =========================================================
   72. DIFFERENCE TEXT
========================================================= */

function reportDifferenceText(
  value,
  suffix = ""
) {

  if (
    value === null
  ) {

    return "-";

  }


  if (
    value > 0
  ) {

    return `▲ +${value}${suffix}`;

  }


  if (
    value < 0
  ) {

    return `▼ ${value}${suffix}`;

  }


  return `― 0${suffix}`;

}


/* =========================================================
   73. PROGRESS CONTAINER
========================================================= */

function ensureProgressContainer() {

  let container =
    document.getElementById(
      "reportProgressComparison"
    );


  if (container) {
    return container;
  }


  const coachSection =
    document
      .getElementById(
        "reportCoachSummary"
      )
      ?.closest(
        ".report-section"
      );


  const reportPaper =
    REPORT_DOM.paper;


  if (
    !reportPaper
  ) {

    return null;

  }


  const section =
    document.createElement(
      "section"
    );


  section.className =
    "report-section report-progress-section";


  section.innerHTML = `

    <h3>
      8. 이전 측정 비교
    </h3>

    <div
      id="reportProgressComparison"
      class="report-progress-comparison"
    ></div>

  `;


  if (
    coachSection
  ) {

    coachSection.insertAdjacentElement(
      "afterend",
      section
    );

  }

  else {

    reportPaper.appendChild(
      section
    );

  }


  return document.getElementById(
    "reportProgressComparison"
  );

}


/* =========================================================
   74. RENDER PROGRESS
========================================================= */

function renderProgressComparison(
  analysis
) {

  const container =
    ensureProgressContainer();


  if (!container) {
    return;
  }


  if (!analysis) {

    container.innerHTML = `

      <div class="empty-state">
        분석 기록이 없습니다.
      </div>

    `;

    return;

  }


  const previous =
    getPreviousAnalysis(
      analysis
    );


  if (!previous) {

    container.innerHTML = `

      <div class="report-first-measurement">

        <strong>
          FIRST MEASUREMENT
        </strong>

        <p>
          동일 운동의 이전 분석 기록이 없습니다.
          다음 측정부터 변화량을 비교할 수 있습니다.
        </p>

      </div>

    `;

    return;

  }


  const currentRadar =
    getReportRadarValues(
      analysis
    );


  const previousRadar =
    getReportRadarValues(
      previous
    );


  const currentOverall =
    calculateReportOverall(
      analysis
    );


  const previousOverall =
    calculateReportOverall(
      previous
    );


  const comparison = [

    {
      name:
        "종합점수",

      current:
        currentOverall,

      previous:
        previousOverall
    },

    {
      name:
        "근력",

      current:
        currentRadar.strength,

      previous:
        previousRadar.strength
    },

    {
      name:
        "파워",

      current:
        currentRadar.power,

      previous:
        previousRadar.power
    },

    {
      name:
        "안정성",

      current:
        currentRadar.stability,

      previous:
        previousRadar.stability
    },

    {
      name:
        "대칭성",

      current:
        currentRadar.symmetry,

      previous:
        previousRadar.symmetry
    },

    {
      name:
        "가동성",

      current:
        currentRadar.mobility,

      previous:
        previousRadar.mobility
    },

    {
      name:
        "기술",

      current:
        currentRadar.technique,

      previous:
        previousRadar.technique
    }

  ];


  container.innerHTML = `

    <div class="report-previous-date">

      이전 측정

      <strong>
        ${formatReportDate(
          previous.createdAt
        )}
      </strong>

    </div>


    <div class="report-progress-grid">

      ${comparison
        .map(
          item => {

            const difference =
              reportDifference(
                item.current,
                item.previous
              );


            return `

              <article class="progress-card">

                <span>
                  ${item.name}
                </span>

                <strong>
                  ${item.current}
                </strong>

                <small>
                  이전 ${item.previous}
                </small>

                <div
                  class="
                    progress-difference
                    ${
                      difference > 0
                        ? "positive"
                        : difference < 0
                          ? "negative"
                          : "neutral"
                    }
                  "
                >
                  ${reportDifferenceText(
                    difference
                  )}
                </div>

              </article>

            `;

          }
        )
        .join("")}

    </div>

  `;

}


/* =========================================================
   75. PR CHECK
========================================================= */

function detectPersonalRecord(
  analysis
) {

  if (!analysis) {
    return null;
  }


  const history =
    getSameExerciseHistory(
      analysis
    );


  if (
    history.length === 0
  ) {

    return null;

  }


  const current =
    calculateReportOverall(
      analysis
    );


  const otherScores =
    history
      .filter(
        item =>
          String(
            item.id
          ) !==
          String(
            analysis.id
          )
      )
      .map(
        item =>
          calculateReportOverall(
            item
          )
      );


  if (
    otherScores.length === 0
  ) {

    return {

      isPR:
        true,

      current,

      previousBest:
        null

    };

  }


  const previousBest =
    Math.max(
      ...otherScores
    );


  return {

    isPR:
      current >
      previousBest,

    current,

    previousBest

  };

}


/* =========================================================
   76. PR BADGE
========================================================= */

function renderPRBadge(
  analysis
) {

  const result =
    detectPersonalRecord(
      analysis
    );


  let badge =
    document.getElementById(
      "reportPRBadge"
    );


  if (
    !REPORT_DOM.paper
  ) {

    return;

  }


  if (!badge) {

    badge =
      document.createElement(
        "div"
      );


    badge.id =
      "reportPRBadge";


    badge.className =
      "report-pr-badge";


    const header =
      REPORT_DOM.paper
        .querySelector(
          ".report-header"
        );


    header?.appendChild(
      badge
    );

  }


  if (
    !result ||
    !result.isPR
  ) {

    badge.hidden =
      true;

    return;

  }


  badge.hidden =
    false;


  badge.innerHTML = `

    <span>
      PERSONAL BEST
    </span>

    <strong>
      PR
    </strong>

  `;

}


/* =========================================================
   77. TREND CONTAINER
========================================================= */

function ensureTrendContainer() {

  let canvas =
    document.getElementById(
      "reportTrendChart"
    );


  if (canvas) {
    return canvas;
  }


  const progressSection =
    document
      .getElementById(
        "reportProgressComparison"
      )
      ?.closest(
        ".report-section"
      );


  if (!progressSection) {
    return null;
  }


  const section =
    document.createElement(
      "section"
    );


  section.className =
    "report-section report-trend-section";


  section.innerHTML = `

    <h3>
      9. 퍼포먼스 추세
    </h3>

    <div class="report-trend-chart">

      <canvas
        id="reportTrendChart"
      ></canvas>

    </div>

  `;


  progressSection
    .insertAdjacentElement(
      "afterend",
      section
    );


  return document.getElementById(
    "reportTrendChart"
  );

}


/* =========================================================
   78. TREND CHART
========================================================= */

let reportTrendChartInstance =
  null;


function renderReportTrendChart(
  analysis
) {

  const canvas =
    ensureTrendContainer();


  if (
    !canvas ||
    !analysis ||
    typeof Chart === "undefined"
  ) {

    return;

  }


  const history =
    getSameExerciseHistory(
      analysis
    )
      .slice(
        0,
        10
      )
      .reverse();


  if (
    history.length === 0
  ) {

    return;

  }


  const labels =
    history.map(
      record => {

        const date =
          new Date(
            record.createdAt
          );


        return (
          `${date.getMonth() + 1}/${date.getDate()}`
        );

      }
    );


  const scores =
    history.map(
      record =>
        calculateReportOverall(
          record
        )
    );


  if (
    reportTrendChartInstance
  ) {

    reportTrendChartInstance
      .destroy();

  }


  reportTrendChartInstance =
    new Chart(
      canvas,
      {

        type:
          "line",

        data: {

          labels,

          datasets: [

            {

              label:
                "종합점수",

              data:
                scores,

              borderWidth:
                3,

              pointRadius:
                4,

              pointHoverRadius:
                6,

              tension:
                0.25,

              fill:
                false

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
   79. REPORT SNAPSHOT
========================================================= */

function buildReportSnapshot() {

  const athlete =
    REPORT_STATE.athlete;


  const analysis =
    REPORT_STATE.analysis;


  if (
    !athlete ||
    !analysis
  ) {

    return null;

  }


  const radar =
    getReportRadarValues(
      analysis
    );


  return {

    id:
      "report_" +
      Date.now(),

    createdAt:
      new Date()
        .toISOString(),

    athleteId:
      getReportAthleteId(
        athlete
      ),

    athleteName:
      getReportAthleteName(
        athlete
      ),

    sport:
      getAthleteSport(
        athlete
      ),

    analysisId:
      analysis.id,

    exerciseId:
      analysis.exerciseId,

    exerciseName:
      analysis.exerciseName,

    overall:
      calculateReportOverall(
        analysis
      ),

    grade:
      getPerformanceGrade(
        calculateReportOverall(
          analysis
        )
      ).grade,

    radar,

    symmetry:
      analysis.symmetry,

    rom:
      analysis.rom,

    recommendations:
      uniqueRecommendations(
        [
          ...getStoredRecommendations(
            analysis
          ),

          ...buildAutomaticRecommendations(
            analysis
          )
        ]
      ).slice(
        0,
        10
      )

  };

}


/* =========================================================
   80. SAVE GENERATED REPORT
========================================================= */

function saveGeneratedReport() {

  const snapshot =
    buildReportSnapshot();


  if (!snapshot) {
    return null;
  }


  let reports =
    loadReportHistory();


  /*
    같은 분석으로 리포트를 여러 번 눌러도
    중복 저장 방지
  */

  reports =
    reports.filter(
      report =>
        String(
          report.analysisId
        ) !==
        String(
          snapshot.analysisId
        )
    );


  reports.unshift(
    snapshot
  );


  reports =
    reports.slice(
      0,
      100
    );


  saveReportHistory(
    reports
  );


  window.dispatchEvent(
    new CustomEvent(
      "seolcheonReportSaved",
      {
        detail:
          snapshot
      }
    )
  );


  return snapshot;

}


/* =========================================================
   81. REPORT HISTORY CONTAINER
========================================================= */

function ensureReportHistoryContainer() {

  let container =
    document.getElementById(
      "reportHistoryList"
    );


  if (container) {
    return container;
  }


  const control =
    document.querySelector(
      ".report-control"
    );


  if (!control) {
    return null;
  }


  const wrapper =
    document.createElement(
      "div"
    );


  wrapper.className =
    "report-history-wrapper";


  wrapper.innerHTML = `

    <div class="report-history-header">

      <span class="eyebrow">
        REPORT HISTORY
      </span>

      <h3>
        최근 리포트
      </h3>

    </div>

    <div
      id="reportHistoryList"
      class="report-history-list"
    ></div>

  `;


  control.appendChild(
    wrapper
  );


  return document.getElementById(
    "reportHistoryList"
  );

}


/* =========================================================
   82. RENDER REPORT HISTORY
========================================================= */

function renderReportHistory() {

  const container =
    ensureReportHistoryContainer();


  if (!container) {
    return;
  }


  const reports =
    loadReportHistory();


  if (
    reports.length === 0
  ) {

    container.innerHTML = `

      <div class="empty-state">
        저장된 리포트가 없습니다.
      </div>

    `;

    return;

  }


  container.innerHTML =
    reports
      .slice(
        0,
        8
      )
      .map(
        report => `

          <button
            type="button"
            class="report-history-item"
            data-report-athlete="${report.athleteId}"
          >

            <div>

              <strong>
                ${report.athleteName}
              </strong>

              <span>
                ${report.exerciseName || "-"}
              </span>

            </div>


            <div class="report-history-score">

              <strong>
                ${report.overall}
              </strong>

              <small>
                ${report.grade}
              </small>

            </div>

          </button>

        `
      )
      .join("");

}


/* =========================================================
   83. REPORT HISTORY CLICK
========================================================= */

function connectReportHistory() {

  document.addEventListener(
    "click",
    event => {

      const item =
        event.target.closest(
          "[data-report-athlete]"
        );


      if (!item) {
        return;
      }


      const athleteId =
        item.dataset
          .reportAthlete;


      if (
        !athleteId ||
        !REPORT_DOM.athleteSelect
      ) {

        return;

      }


      REPORT_DOM
        .athleteSelect
        .value =
        athleteId;


      REPORT_DOM
        .athleteSelect
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
  );

}


/* =========================================================
   84. PRINT MODE
========================================================= */

function prepareReportForPrint() {

  if (
    !REPORT_STATE.analysis
  ) {

    if (
      typeof showToast ===
      "function"
    ) {

      showToast(
        "먼저 리포트를 생성하세요."
      );

    }


    return false;

  }


  document.body
    .classList.add(
      "printing-report"
    );


  /*
    Chart.js canvas가 인쇄 전에
    최종 크기를 다시 계산하도록 함
  */

  REPORT_STATE
    .radarChart
    ?.resize();


  reportTrendChartInstance
    ?.resize();


  return true;

}


/* =========================================================
   85. PRINT / PDF
========================================================= */

function printWeightReport() {

  if (
    !prepareReportForPrint()
  ) {

    return;

  }


  saveGeneratedReport();


  renderReportHistory();


  /*
    브라우저 인쇄창에서
    PDF로 저장 가능
  */

  setTimeout(
    () => {

      window.print();

    },
    250
  );

}


/* =========================================================
   86. PRINT FINISH
========================================================= */

window.addEventListener(
  "afterprint",
  () => {

    document.body
      .classList.remove(
        "printing-report"
      );

  }
);


/* =========================================================
   87. PRINT BUTTON
========================================================= */

function connectPrintButton() {

  REPORT_DOM
    .printButton
    ?.addEventListener(
      "click",
      printWeightReport
    );

}


/* =========================================================
   88. GENERATE + SAVE BUTTON BRIDGE
========================================================= */

function connectFinalGenerateBridge() {

  REPORT_DOM
    .generateButton
    ?.addEventListener(
      "click",
      () => {

        setTimeout(
          () => {

            const analysis =
              REPORT_STATE.analysis;


            if (!analysis) {
              return;
            }


            renderProgressComparison(
              analysis
            );


            renderPRBadge(
              analysis
            );


            renderReportTrendChart(
              analysis
            );


            saveGeneratedReport();


            renderReportHistory();

          },
          30
        );

      }
    );

}


/* =========================================================
   89. SELECT CHANGE FINAL RENDER
========================================================= */

function connectFinalAthleteChange() {

  REPORT_DOM
    .athleteSelect
    ?.addEventListener(
      "change",
      () => {

        const athleteId =
          REPORT_DOM
            .athleteSelect
            .value;


        if (!athleteId) {

          renderProgressComparison(
            null
          );


          renderPRBadge(
            null
          );


          return;

        }


        setTimeout(
          () => {

            const analysis =
              findLatestReportAnalysis(
                athleteId
              );


            REPORT_STATE.analysis =
              analysis;


            renderProgressComparison(
              analysis
            );


            renderPRBadge(
              analysis
            );


            renderReportTrendChart(
              analysis
            );

          },
          30
        );

      }
    );

}


/* =========================================================
   90. ANALYSIS SAVED → REPORT UPDATE
========================================================= */

function connectFinalAnalysisRefresh() {

  window.addEventListener(
    "seolcheonAnalysisSaved",
    event => {

      const analysis =
        event.detail;


      const selected =
        REPORT_DOM
          .athleteSelect
          ?.value;


      if (
        !selected ||
        String(
          selected
        ) !==
        String(
          analysis?.athleteId
        )
      ) {

        return;

      }


      REPORT_STATE.analysis =
        analysis;


      setTimeout(
        () => {

          renderProgressComparison(
            analysis
          );


          renderPRBadge(
            analysis
          );


          renderReportTrendChart(
            analysis
          );

        },
        30
      );

    }
  );

}


/* =========================================================
   91. REPORT DOWNLOAD NAME
========================================================= */

function getReportPrintName() {

  const athlete =
    REPORT_STATE.athlete;


  const analysis =
    REPORT_STATE.analysis;


  if (
    !athlete
  ) {

    return (
      "WEIGHT_PERFORMANCE_REPORT"
    );

  }


  const athleteName =
    getReportAthleteName(
      athlete
    )
      .replace(
        /\s+/g,
        "_"
      );


  const exercise =
    String(
      analysis?.exerciseName ||
      "WEIGHT"
    )
      .replace(
        /\s+/g,
        "_"
      );


  const now =
    new Date();


  const date =
    [

      now.getFullYear(),

      String(
        now.getMonth() + 1
      ).padStart(
        2,
        "0"
      ),

      String(
        now.getDate()
      ).padStart(
        2,
        "0"
      )

    ].join("");


  return (
    `${athleteName}_${exercise}_${date}_REPORT`
  );

}


/* =========================================================
   92. PAGE TITLE FOR PDF
========================================================= */

function updateReportDocumentTitle() {

  if (
    !REPORT_STATE.athlete
  ) {
    return;
  }


  document.title =
    getReportPrintName();

}


/* =========================================================
   93. RESTORE TITLE
========================================================= */

const DEFAULT_REPORT_DOCUMENT_TITLE =
  document.title;


window.addEventListener(
  "afterprint",
  () => {

    document.title =
      DEFAULT_REPORT_DOCUMENT_TITLE;

  }
);


/* =========================================================
   94. BEFORE PRINT
========================================================= */

window.addEventListener(
  "beforeprint",
  () => {

    updateReportDocumentTitle();

  }
);


/* =========================================================
   95. REPORT DATA EXPORT
========================================================= */

window.getCurrentWeightReportData =
  function() {

    if (
      !REPORT_STATE.athlete
    ) {

      return null;

    }


    return {

      athlete:
        REPORT_STATE.athlete,

      analysis:
        REPORT_STATE.analysis,

      overall:
        calculateReportOverall(
          REPORT_STATE.analysis
        ),

      radar:
        getReportRadarValues(
          REPORT_STATE.analysis
        ),

      issues:
        detectMovementIssues(
          REPORT_STATE.analysis
        ),

      recommendations:
        uniqueRecommendations(
          [

            ...getStoredRecommendations(
              REPORT_STATE.analysis
            ),

            ...buildAutomaticRecommendations(
              REPORT_STATE.analysis
            )

          ]
        ),

      pr:
        detectPersonalRecord(
          REPORT_STATE.analysis
        ),

      previous:
        getPreviousAnalysis(
          REPORT_STATE.analysis
        )

    };

  };


/* =========================================================
   96. REPORT PUBLIC API EXTENSION
========================================================= */

if (
  window.WeightReport
) {

  window.WeightReport.print =
    printWeightReport;


  window.WeightReport.save =
    saveGeneratedReport;


  window.WeightReport.history =
    loadReportHistory;


  window.WeightReport.getPrevious =
    function() {

      return getPreviousAnalysis(
        REPORT_STATE.analysis
      );

    };


  window.WeightReport.getPR =
    function() {

      return detectPersonalRecord(
        REPORT_STATE.analysis
      );

    };


  window.WeightReport.getData =
    window
      .getCurrentWeightReportData;

}


/* =========================================================
   97. REPORT EMPTY PROTECTION
========================================================= */

function protectEmptyReportPrint() {

  document.addEventListener(
    "keydown",
    event => {

      /*
        Ctrl/Cmd + P
      */

      if (
        (
          event.ctrlKey ||
          event.metaKey
        ) &&
        event.key.toLowerCase() ===
        "p"
      ) {

        const reportPage =
          document.getElementById(
            "page-report"
          );


        if (
          !reportPage
            ?.classList
            .contains(
              "active"
            )
        ) {

          return;

        }


        if (
          !REPORT_STATE.analysis
        ) {

          event.preventDefault();


          if (
            typeof showToast ===
            "function"
          ) {

            showToast(
              "리포트를 먼저 생성하세요."
            );

          }

        }

      }

    }
  );

}


/* =========================================================
   98. FINAL REPORT RENDER
========================================================= */

function renderFinalReportFeatures() {

  const athleteId =
    REPORT_DOM
      .athleteSelect
      ?.value;


  if (!athleteId) {

    renderReportHistory();

    return;

  }


  const analysis =
    findLatestReportAnalysis(
      athleteId
    );


  REPORT_STATE.analysis =
    analysis;


  renderProgressComparison(
    analysis
  );


  renderPRBadge(
    analysis
  );


  renderReportTrendChart(
    analysis
  );


  renderReportHistory();

}


/* =========================================================
   99. FINAL INITIALIZATION
========================================================= */

function initializeReportPart3() {

  connectPrintButton();


  connectFinalGenerateBridge();


  connectFinalAthleteChange();


  connectFinalAnalysisRefresh();


  connectReportHistory();


  protectEmptyReportPrint();


  renderFinalReportFeatures();


  console.log(
    "WEIGHT PERFORMANCE REPORT / PART 3 READY"
  );

}


/* =========================================================
   100. SAFE START
========================================================= */

if (
  document.readyState ===
  "loading"
) {

  document.addEventListener(
    "DOMContentLoaded",
    initializeReportPart3
  );

}

else {

  initializeReportPart3();

}


/* =========================================================
   REPORT.JS COMPLETE
   ---------------------------------------------------------

   ATHLETE
   ✓ 선수 정보
   ✓ 종목
   ✓ 신장 / 체중

   EXERCISE
   ✓ 웨이트 종목
   ✓ 픽토그램
   ✓ 운동 분류

   MOTION ANALYSIS
   ✓ 분석 대표 장면
   ✓ 33 관절 Motion Capture 연동
   ✓ 2D / 3D 모드 정보
   ✓ 정면 / 측면 / 후면 / 상단
   ✓ 무릎 각도
   ✓ 고관절 각도
   ✓ 발목 각도
   ✓ 몸통 각도
   ✓ ROM
   ✓ 좌우 대칭

   PERFORMANCE
   ✓ 근력
   ✓ 파워
   ✓ 안정성
   ✓ 대칭성
   ✓ 가동성
   ✓ 기술
   ✓ 육각형 Radar

   INTELLIGENCE
   ✓ 강점 자동 탐지
   ✓ 보완 지표 탐지
   ✓ 추천 훈련
   ✓ 종합 분석
   ✓ Performance Grade

   LONGITUDINAL ANALYSIS
   ✓ 이전 측정 비교
   ✓ 점수 변화
   ✓ 운동별 기록 추적
   ✓ 퍼포먼스 추세 그래프
   ✓ PR 자동 탐지

   REPORT
   ✓ Report History
   ✓ Print
   ✓ PDF 저장
   ✓ PDF 파일명 자동 생성

   ---------------------------------------------------------
   SEOLCHEON HIGH SCHOOL
   WEIGHT PERFORMANCE LAB
   SCIENCE FOR PERFORMANCE
========================================================= */