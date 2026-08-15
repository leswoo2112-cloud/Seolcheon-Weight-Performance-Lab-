/* =========================================================
   설천고 WEIGHT PERFORMANCE LAB
   REPORT.JS
   PART 5 / 6

   PERFORMANCE REPORT ENGINE

   - Athlete report
   - Latest analysis integration
   - Exercise pictogram
   - Analysis frame capture
   - Performance radar
   - Six performance metrics
   - Training recommendations
   - Print / PDF
   - Automatic report refresh
========================================================= */

"use strict";


/* =========================================================
   01. REPORT DOM
========================================================= */

const REPORT_DOM = {

  athlete:
    document.getElementById("reportAthlete"),

  generate:
    document.getElementById("generateReportBtn"),

  print:
    document.getElementById("printReportBtn"),

  paper:
    document.getElementById("reportPaper"),

  date:
    document.getElementById("reportGeneratedDate"),

  overall:
    document.getElementById("reportOverallScore"),

  athleteName:
    document.getElementById("reportAthleteName"),

  sport:
    document.getElementById("reportSport"),

  height:
    document.getElementById("reportHeight"),

  weight:
    document.getElementById("reportWeight"),

  exercisePictogram:
    document.getElementById("reportExercisePictogram"),

  exerciseName:
    document.getElementById("reportExerciseName"),

  exerciseCategory:
    document.getElementById("reportExerciseCategory"),

  radarCanvas:
    document.getElementById("reportRadarChart"),

  strength:
    document.getElementById("reportStrength"),

  power:
    document.getElementById("reportPower"),

  stability:
    document.getElementById("reportStability"),

  symmetry:
    document.getElementById("reportSymmetry"),

  mobility:
    document.getElementById("reportMobility"),

  technique:
    document.getElementById("reportTechnique"),

  analysisFrame:
    document.getElementById("reportAnalysisFrame"),

  recommendations:
    document.getElementById("reportRecommendations")

};


/* =========================================================
   02. REPORT STATE
========================================================= */

const REPORT_STATE = {

  radar:
    null,

  currentAthlete:
    null,

  currentAnalysis:
    null,

  generated:
    false,

  snapshotImage:
    null

};


/* =========================================================
   03. STORAGE KEYS

   app.js의 저장 키와 다를 경우에도
   여러 후보를 확인하도록 구성.
========================================================= */

const REPORT_STORAGE_KEYS = {

  athletes: [
    "weight_lab_athletes",
    "weightPerformanceAthletes",
    "seolcheon_weight_athletes",
    "seolcheon_pro_athletes"
  ],

  analyses: [
    "weight_lab_analyses",
    "weightPerformanceAnalyses",
    "seolcheon_weight_analyses",
    "seolcheon_pro_analyses"
  ]

};


/* =========================================================
   04. BASIC HELPERS
========================================================= */

function reportClamp(
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


function reportAverage(values) {

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


function safeJSONParse(
  value,
  fallback = []
) {

  try {

    const parsed =
      JSON.parse(value);

    return parsed ?? fallback;

  }

  catch (_) {

    return fallback;

  }

}


function escapeReportHTML(
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


/* =========================================================
   05. GET ATHLETES
========================================================= */

function getReportAthletes() {

  /*
     app.js가 전역으로 선수를 제공하면
     그 데이터를 가장 먼저 사용.
  */

  if (
    Array.isArray(
      window.athletes
    )
  ) {

    return window.athletes;

  }


  if (
    Array.isArray(
      window.ATHLETES
    )
  ) {

    return window.ATHLETES;

  }


  if (
    typeof window.getAthletes ===
    "function"
  ) {

    const athletes =
      window.getAthletes();

    if (
      Array.isArray(athletes)
    ) {

      return athletes;

    }

  }


  /*
     localStorage fallback
  */

  for (
    const key
    of REPORT_STORAGE_KEYS.athletes
  ) {

    const value =
      localStorage.getItem(key);


    if (!value) {
      continue;
    }


    const athletes =
      safeJSONParse(
        value,
        []
      );


    if (
      Array.isArray(athletes) &&
      athletes.length
    ) {

      return athletes;

    }

  }


  return [];

}


/* =========================================================
   06. GET ANALYSES
========================================================= */

function getReportAnalyses() {

  const possibleGlobals = [

    window.analysisRecords,

    window.analyses,

    window.weightAnalyses,

    window.ANALYSIS_RECORDS

  ];


  for (
    const value
    of possibleGlobals
  ) {

    if (
      Array.isArray(value)
    ) {

      return value;

    }

  }


  if (
    typeof window.getAnalysisRecords ===
    "function"
  ) {

    const records =
      window.getAnalysisRecords();


    if (
      Array.isArray(records)
    ) {

      return records;

    }

  }


  for (
    const key
    of REPORT_STORAGE_KEYS.analyses
  ) {

    const value =
      localStorage.getItem(key);


    if (!value) {
      continue;
    }


    const analyses =
      safeJSONParse(
        value,
        []
      );


    if (
      Array.isArray(analyses) &&
      analyses.length
    ) {

      return analyses;

    }

  }


  return [];

}


/* =========================================================
   07. ATHLETE ID
========================================================= */

function getAthleteId(
  athlete
) {

  return String(

    athlete?.id ??

    athlete?.athleteId ??

    athlete?.uuid ??

    athlete?.name ??

    ""

  );

}


/* =========================================================
   08. ATHLETE NAME
========================================================= */

function getAthleteName(
  athlete
) {

  return (

    athlete?.name ||

    athlete?.athleteName ||

    athlete?.playerName ||

    "선수"

  );

}


/* =========================================================
   09. POPULATE ATHLETE SELECT
========================================================= */

function populateReportAthletes() {

  if (
    !REPORT_DOM.athlete
  ) {
    return;
  }


  const current =
    REPORT_DOM.athlete.value;


  const athletes =
    getReportAthletes();


  REPORT_DOM.athlete.innerHTML =
    `
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
        getAthleteId(
          athlete
        );


      option.textContent =
        getAthleteName(
          athlete
        );


      REPORT_DOM.athlete
        .appendChild(
          option
        );

    }
  );


  if (
    current &&
    [
      ...REPORT_DOM.athlete.options
    ].some(
      option =>
        option.value ===
        current
    )
  ) {

    REPORT_DOM.athlete.value =
      current;

  }

}


/* =========================================================
   10. FIND ATHLETE
========================================================= */

function findReportAthlete(
  athleteId
) {

  const athletes =
    getReportAthletes();


  return (

    athletes.find(
      athlete =>
        getAthleteId(athlete) ===
        String(athleteId)
    )

    ||

    null

  );

}


/* =========================================================
   11. FIND LATEST ANALYSIS
========================================================= */

function findLatestAthleteAnalysis(
  athleteId
) {

  /*
     방금 analysis.js에서 생성한
     분석 결과가 해당 선수라면
     가장 우선 사용.
  */

  const live =
    window.latestWeightAnalysis;


  if (
    live &&
    String(
      live.athleteId
    ) ===
    String(
      athleteId
    )
  ) {

    return live;

  }


  const analyses =
    getReportAnalyses();


  const filtered =
    analyses.filter(
      record => {

        const id =

          record.athleteId ??

          record.playerId ??

          record.athlete?.id ??

          record.athleteName ??
          "";


        return (
          String(id) ===
          String(athleteId)
        );

      }
    );


  filtered.sort(
    (a, b) => {

      const dateA =
        new Date(
          a.createdAt ||
          a.date ||
          a.timestamp ||
          0
        ).getTime();


      const dateB =
        new Date(
          b.createdAt ||
          b.date ||
          b.timestamp ||
          0
        ).getTime();


      return (
        dateB -
        dateA
      );

    }
  );


  return (
    filtered[0] ||
    null
  );

}


/* =========================================================
   12. GET EXERCISE
========================================================= */

function getReportExercise(
  analysis
) {

  if (!analysis) {
    return null;
  }


  if (
    analysis.exercise &&
    typeof analysis.exercise ===
    "object"
  ) {

    return analysis.exercise;

  }


  if (
    typeof window.getExerciseById ===
    "function"
  ) {

    const found =
      window.getExerciseById(
        analysis.exerciseId
      );


    if (found) {
      return found;
    }

  }


  if (
    Array.isArray(
      window.EXERCISES
    )
  ) {

    const found =
      window.EXERCISES.find(
        exercise =>
          String(exercise.id) ===
          String(
            analysis.exerciseId
          )
      );


    if (found) {
      return found;
    }

  }


  return {

    id:
      analysis.exerciseId ||
      "",

    name:
      analysis.exerciseName ||
      "웨이트 분석",

    icon:
      analysis.exerciseIcon ||
      "🏋️",

    category:
      analysis.exerciseCategory ||
      "",

    recommendations:
      analysis.recommendations ||
      []

  };

}


/* =========================================================
   13. PERFORMANCE VALUES
========================================================= */

function calculateReportMetrics(
  athlete,
  analysis
) {

  if (!analysis) {

    return {

      strength:
        0,

      power:
        0,

      stability:
        0,

      symmetry:
        0,

      mobility:
        0,

      technique:
        0,

      overall:
        0

    };

  }


  /*
     실제 분석값이 존재하면 그대로 사용.

     strength / power가 없는 경우에는
     자세 분석값에서 임의로 높은 점수를
     만들어내지 않고 중립값을 사용.
  */

  const technique =
    reportClamp(
      analysis.technique ??
      analysis.score ??
      0
    );


  const stability =
    reportClamp(
      analysis.stability ??
      0
    );


  const symmetry =
    reportClamp(
      analysis.symmetry ??
      0
    );


  let mobility =
    Number(
      analysis.mobility
    );


  if (
    !Number.isFinite(
      mobility
    )
  ) {

    /*
       ROM 데이터가 있으면
       단순한 표시용 가동성 지표로 환산.
       의학적 평가값이 아님.
    */

    const rom =
      Number(
        analysis.rom ??
        analysis.ROM
      );


    mobility =
      Number.isFinite(rom)

        ? reportClamp(
            50 +
            rom * 0.45
          )

        : 0;

  }


  let strength =
    Number(
      analysis.strength
    );


  if (
    !Number.isFinite(
      strength
    )
  ) {

    strength =
      0;

  }


  let power =
    Number(
      analysis.power
    );


  if (
    !Number.isFinite(
      power
    )
  ) {

    power =
      0;

  }


  const measuredValues = [

    technique,

    stability,

    symmetry,

    mobility

  ];


  if (strength > 0) {

    measuredValues.push(
      strength
    );

  }


  if (power > 0) {

    measuredValues.push(
      power
    );

  }


  const overall =
    Math.round(
      reportAverage(
        measuredValues
      )
    );


  return {

    strength:
      Math.round(strength),

    power:
      Math.round(power),

    stability:
      Math.round(stability),

    symmetry:
      Math.round(symmetry),

    mobility:
      Math.round(mobility),

    technique:
      Math.round(technique),

    overall

  };

}


/* =========================================================
   14. FORMAT PROFILE
========================================================= */

function formatHeight(
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


function formatWeight(
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
   15. GENERATE REPORT
========================================================= */

function generatePerformanceReport() {

  const athleteId =
    REPORT_DOM.athlete?.value;


  if (!athleteId) {

    reportToast(
      "리포트를 생성할 선수를 선택하세요."
    );

    return;

  }


  const athlete =
    findReportAthlete(
      athleteId
    );


  if (!athlete) {

    reportToast(
      "선수 정보를 찾을 수 없습니다."
    );

    return;

  }


  const analysis =
    findLatestAthleteAnalysis(
      athleteId
    );


  REPORT_STATE.currentAthlete =
    athlete;

  REPORT_STATE.currentAnalysis =
    analysis;


  renderReportHeader();

  renderReportAthlete(
    athlete
  );

  renderReportExercise(
    analysis
  );


  const metrics =
    calculateReportMetrics(
      athlete,
      analysis
    );


  renderReportMetrics(
    metrics
  );


  renderReportRadar(
    metrics
  );


  renderReportAnalysisFrame();


  renderReportRecommendations(
    analysis
  );


  REPORT_STATE.generated =
    true;


  reportToast(
    analysis
      ? "선수 퍼포먼스 리포트가 생성되었습니다."
      : "선수 정보 리포트가 생성되었습니다. 아직 분석 기록은 없습니다."
  );

}


/* =========================================================
   16. REPORT HEADER
========================================================= */

function renderReportHeader() {

  const now =
    new Date();


  REPORT_DOM.date.textContent =
    new Intl.DateTimeFormat(
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
    ).format(now);

}


/* =========================================================
   17. ATHLETE PROFILE
========================================================= */

function renderReportAthlete(
  athlete
) {

  REPORT_DOM.athleteName.textContent =
    getAthleteName(
      athlete
    );


  REPORT_DOM.sport.textContent =

    athlete.sport ||

    athlete.mainSport ||

    athlete.athleteSport ||

    "-";


  REPORT_DOM.height.textContent =
    formatHeight(
      athlete
    );


  REPORT_DOM.weight.textContent =
    formatWeight(
      athlete
    );

}


/* =========================================================
   18. EXERCISE
========================================================= */

function renderReportExercise(
  analysis
) {

  const exercise =
    getReportExercise(
      analysis
    );


  if (!exercise) {

    REPORT_DOM.exercisePictogram.textContent =
      "🏋";


    REPORT_DOM.exerciseName.textContent =
      "운동 분석 기록 없음";


    REPORT_DOM.exerciseCategory.textContent =
      "분석을 진행하면 최근 운동이 표시됩니다.";


    return;

  }


  REPORT_DOM.exercisePictogram.textContent =

    exercise.icon ||

    exercise.pictogram ||

    "🏋️";


  REPORT_DOM.exerciseName.textContent =

    exercise.name ||

    analysis?.exerciseName ||

    "웨이트 분석";


  const categoryName =

    typeof window.getCategoryName ===
    "function"

      ? window.getCategoryName(
          exercise.category
        )

      : exercise.category ||
        "WEIGHT TRAINING";


  REPORT_DOM.exerciseCategory.textContent =
    categoryName;

}


/* =========================================================
   19. METRICS
========================================================= */

function renderReportMetrics(
  metrics
) {

  REPORT_DOM.strength.textContent =
    metrics.strength > 0
      ? metrics.strength
      : "-";


  REPORT_DOM.power.textContent =
    metrics.power > 0
      ? metrics.power
      : "-";


  REPORT_DOM.stability.textContent =
    metrics.stability || "-";


  REPORT_DOM.symmetry.textContent =
    metrics.symmetry || "-";


  REPORT_DOM.mobility.textContent =
    metrics.mobility || "-";


  REPORT_DOM.technique.textContent =
    metrics.technique || "-";


  REPORT_DOM.overall.textContent =
    metrics.overall || "--";

}


/* =========================================================
   20. RADAR CHART
========================================================= */

function renderReportRadar(
  metrics
) {

  if (
    !REPORT_DOM.radarCanvas ||
    typeof Chart ===
    "undefined"
  ) {

    return;

  }


  if (
    REPORT_STATE.radar
  ) {

    REPORT_STATE.radar.destroy();

  }


  REPORT_STATE.radar =
    new Chart(
      REPORT_DOM.radarCanvas,
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
                3,

              pointHoverRadius:
                5

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
              500
          },

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
                  false,

                stepSize:
                  20

              },

              pointLabels: {

                font: {
                  size:
                    12,
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
            }

          }

        }

      }
    );

}


/* =========================================================
   21. ANALYSIS FRAME CAPTURE
========================================================= */

function renderReportAnalysisFrame() {

  const container =
    REPORT_DOM.analysisFrame;


  if (!container) {
    return;
  }


  const image =
    captureCurrentAnalysisFrame();


  if (!image) {

    container.innerHTML =
      `
        <div class="report-frame-empty">

          <strong>
            ANALYSIS FRAME
          </strong>

          <p>
            자세 분석 화면에서 선수를 측정하면
            대표 프레임을 리포트에 표시할 수 있습니다.
          </p>

        </div>
      `;

    return;

  }


  REPORT_STATE.snapshotImage =
    image;


  container.innerHTML =
    `
      <img
        src="${image}"
        alt="자세 분석 대표 프레임"
        style="
          width:100%;
          height:100%;
          object-fit:contain;
          display:block;
        "
      />
    `;

}


/* =========================================================
   22. CAPTURE FRAME
========================================================= */

function captureCurrentAnalysisFrame() {

  const poseCanvas =
    document.getElementById(
      "poseCanvas"
    );


  const pathCanvas =
    document.getElementById(
      "barPathCanvas"
    );


  const camera =
    document.getElementById(
      "cameraVideo"
    );


  const uploadedVideo =
    document.getElementById(
      "uploadedVideo"
    );


  const uploadedImage =
    document.getElementById(
      "uploadedImage"
    );


  const source =
    getVisibleReportSource(
      camera,
      uploadedVideo,
      uploadedImage
    );


  if (!source) {

    /*
       분석 캔버스에 이미 스켈레톤이
       그려져 있을 수도 있으므로
       캔버스 자체 캡처 시도.
    */

    if (
      poseCanvas &&
      poseCanvas.width &&
      poseCanvas.height
    ) {

      try {

        return (
          poseCanvas.toDataURL(
            "image/jpeg",
            0.88
          )
        );

      }

      catch (_) {

        return null;

      }

    }


    return null;

  }


  try {

    const width =
      poseCanvas?.width ||
      source.videoWidth ||
      source.naturalWidth ||
      1280;


    const height =
      poseCanvas?.height ||
      source.videoHeight ||
      source.naturalHeight ||
      720;


    if (
      width <= 1 ||
      height <= 1
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


    ctx.fillStyle =
      "#020b11";


    ctx.fillRect(
      0,
      0,
      width,
      height
    );


    /*
       실제 카메라 / 영상 / 사진
    */

    ctx.drawImage(
      source,
      0,
      0,
      width,
      height
    );


    /*
       스켈레톤 overlay
    */

    if (
      poseCanvas &&
      poseCanvas.width
    ) {

      ctx.drawImage(
        poseCanvas,
        0,
        0,
        width,
        height
      );

    }


    /*
       궤적 overlay
    */

    if (
      pathCanvas &&
      pathCanvas.width
    ) {

      ctx.drawImage(
        pathCanvas,
        0,
        0,
        width,
        height
      );

    }


    return canvas.toDataURL(
      "image/jpeg",
      0.9
    );

  }

  catch (error) {

    console.warn(
      "Report frame capture failed:",
      error
    );


    return null;

  }

}


/* =========================================================
   23. FIND VISIBLE SOURCE
========================================================= */

function getVisibleReportSource(
  camera,
  video,
  image
) {

  if (
    camera &&
    camera.style.display !== "none" &&
    camera.readyState >= 2
  ) {

    return camera;

  }


  if (
    video &&
    !video.hidden &&
    video.style.display !== "none" &&
    video.readyState >= 2
  ) {

    return video;

  }


  if (
    image &&
    !image.hidden &&
    image.style.display !== "none" &&
    image.complete
  ) {

    return image;

  }


  return null;

}


/* =========================================================
   24. RECOMMENDATIONS
========================================================= */

function renderReportRecommendations(
  analysis
) {

  if (!analysis) {

    REPORT_DOM.recommendations.innerHTML =
      `
        <div class="report-empty-text">
          아직 분석 결과가 없습니다.
        </div>
      `;

    return;

  }


  const exercise =
    getReportExercise(
      analysis
    );


  let recommendations = [];


  if (
    Array.isArray(
      analysis.recommendations
    )
  ) {

    recommendations =
      analysis.recommendations;

  }


  if (
    !recommendations.length &&
    exercise &&
    typeof window.getGeneralRecommendations ===
    "function"
  ) {

    recommendations =
      window.getGeneralRecommendations(
        exercise
      ) || [];

  }


  if (
    !recommendations.length &&
    Array.isArray(
      exercise?.recommendations
    )
  ) {

    recommendations =
      exercise.recommendations;

  }


  /*
     분석값 기반 추가 권장사항
  */

  const smartRecommendations =
    buildSmartRecommendations(
      analysis
    );


  recommendations = [

    ...recommendations,

    ...smartRecommendations

  ];


  /*
     중복 제거
  */

  recommendations =
    [
      ...new Set(
        recommendations
          .filter(Boolean)
          .map(String)
      )
    ];


  if (!recommendations.length) {

    REPORT_DOM.recommendations.innerHTML =
      `
        <div class="report-empty-text">
          현재 분석에서는 별도의 보완 훈련이
          자동 생성되지 않았습니다.
        </div>
      `;

    return;

  }


  REPORT_DOM.recommendations.innerHTML =
    recommendations
      .slice(0, 12)
      .map(
        (item, index) => `

          <div class="report-recommendation-item">

            <span>
              ${String(index + 1)
                .padStart(2, "0")}
            </span>

            <strong>
              ${escapeReportHTML(item)}
            </strong>

          </div>

        `
      )
      .join("");

}


/* =========================================================
   25. SMART RECOMMENDATIONS
========================================================= */

function buildSmartRecommendations(
  analysis
) {

  const list = [];


  const symmetry =
    Number(
      analysis.symmetry
    );


  const stability =
    Number(
      analysis.stability
    );


  const technique =
    Number(
      analysis.technique ??
      analysis.score
    );


  const knee =
    Number(
      analysis.knee
    );


  const trunk =
    Number(
      analysis.trunk
    );


  if (
    Number.isFinite(symmetry) &&
    symmetry < 85
  ) {

    list.push(
      "불가리안 스플릿 스쿼트"
    );

    list.push(
      "싱글 레그 RDL"
    );

    list.push(
      "스텝업"
    );

    list.push(
      "싱글 레그 밸런스"
    );

  }


  if (
    Number.isFinite(stability) &&
    stability < 85
  ) {

    list.push(
      "데드버그"
    );

    list.push(
      "버드독"
    );

    list.push(
      "팔로프 프레스"
    );

    list.push(
      "플랭크"
    );

    list.push(
      "사이드 플랭크"
    );

  }


  if (
    Number.isFinite(technique) &&
    technique < 80
  ) {

    list.push(
      "저중량 템포 반복"
    );

    list.push(
      "포즈 반복"
    );

    list.push(
      "기술 드릴"
    );

    list.push(
      "영상 피드백 세션"
    );

  }


  if (
    Number.isFinite(knee) &&
    knee < 80
  ) {

    list.push(
      "발목 가동성 드릴"
    );

    list.push(
      "고블릿 스쿼트"
    );

  }


  if (
    Number.isFinite(trunk) &&
    trunk > 40
  ) {

    list.push(
      "프론트 스쿼트 기술 드릴"
    );

    list.push(
      "안티 플렉션 코어 훈련"
    );

  }


  return list;

}


/* =========================================================
   26. PRINT REPORT
========================================================= */

function printPerformanceReport() {

  if (
    !REPORT_STATE.generated
  ) {

    generatePerformanceReport();


    if (
      !REPORT_STATE.generated
    ) {
      return;
    }

  }


  /*
     Chart.js 애니메이션이 끝난 후
     브라우저 인쇄창을 실행.
  */

  setTimeout(
    () => {

      window.print();

    },
    250
  );

}


/* =========================================================
   27. AUTOMATIC ANALYSIS EVENT
========================================================= */

function handleAnalysisComplete(
  event
) {

  const analysis =
    event.detail;


  if (!analysis) {
    return;
  }


  REPORT_STATE.currentAnalysis =
    analysis;


  /*
     분석한 선수와 현재 리포트 선수가
     동일하면 자동으로 최신 상태 반영.
  */

  if (
    REPORT_DOM.athlete &&
    String(
      REPORT_DOM.athlete.value
    ) ===
    String(
      analysis.athleteId
    )
  ) {

    generatePerformanceReport();

  }

}


/* =========================================================
   28. ATHLETE DATA UPDATED
========================================================= */

function refreshReportAthletes() {

  const current =
    REPORT_DOM.athlete?.value;


  populateReportAthletes();


  if (
    current &&
    REPORT_DOM.athlete
  ) {

    REPORT_DOM.athlete.value =
      current;

  }

}


/* =========================================================
   29. REPORT RESET
========================================================= */

function resetReportDisplay() {

  if (
    REPORT_DOM.date
  ) {

    REPORT_DOM.date.textContent =
      "-";

  }


  if (
    REPORT_DOM.overall
  ) {

    REPORT_DOM.overall.textContent =
      "--";

  }


  if (
    REPORT_DOM.athleteName
  ) {

    REPORT_DOM.athleteName.textContent =
      "-";

  }


  if (
    REPORT_DOM.sport
  ) {

    REPORT_DOM.sport.textContent =
      "-";

  }


  if (
    REPORT_DOM.height
  ) {

    REPORT_DOM.height.textContent =
      "-";

  }


  if (
    REPORT_DOM.weight
  ) {

    REPORT_DOM.weight.textContent =
      "-";

  }


  if (
    REPORT_DOM.exercisePictogram
  ) {

    REPORT_DOM.exercisePictogram.textContent =
      "🏋";

  }


  if (
    REPORT_DOM.exerciseName
  ) {

    REPORT_DOM.exerciseName.textContent =
      "운동 분석 기록 없음";

  }


  if (
    REPORT_DOM.exerciseCategory
  ) {

    REPORT_DOM.exerciseCategory.textContent =
      "-";

  }


  [

    REPORT_DOM.strength,

    REPORT_DOM.power,

    REPORT_DOM.stability,

    REPORT_DOM.symmetry,

    REPORT_DOM.mobility,

    REPORT_DOM.technique

  ]
    .forEach(
      element => {

        if (element) {

          element.textContent =
            "-";

        }

      }
    );


  if (
    REPORT_DOM.analysisFrame
  ) {

    REPORT_DOM.analysisFrame.innerHTML =
      "분석 영상의 대표 프레임이 표시됩니다.";

  }


  if (
    REPORT_DOM.recommendations
  ) {

    REPORT_DOM.recommendations.innerHTML =
      "분석 결과가 없습니다.";

  }


  if (
    REPORT_STATE.radar
  ) {

    REPORT_STATE.radar.destroy();

    REPORT_STATE.radar =
      null;

  }


  REPORT_STATE.generated =
    false;

}


/* =========================================================
   30. SELECT CHANGE
========================================================= */

function handleReportAthleteChange() {

  REPORT_STATE.generated =
    false;


  if (
    !REPORT_DOM.athlete.value
  ) {

    resetReportDisplay();

  }

}


/* =========================================================
   31. TOAST
========================================================= */

function reportToast(
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
    toast._reportTimer
  );


  toast._reportTimer =
    setTimeout(
      () => {

        toast.classList.remove(
          "show"
        );

      },
      2500
    );

}


/* =========================================================
   32. EXTERNAL API
========================================================= */

window.WeightReport = {

  generate:
    generatePerformanceReport,

  print:
    printPerformanceReport,

  refreshAthletes:
    refreshReportAthletes,

  reset:
    resetReportDisplay,

  getCurrentReport() {

    return {

      athlete:
        REPORT_STATE.currentAthlete,

      analysis:
        REPORT_STATE.currentAnalysis,

      generated:
        REPORT_STATE.generated,

      snapshot:
        REPORT_STATE.snapshotImage

    };

  }

};


/* =========================================================
   33. EVENT BINDING
========================================================= */

function bindReportEvents() {

  REPORT_DOM.generate
    ?.addEventListener(
      "click",
      generatePerformanceReport
    );


  REPORT_DOM.print
    ?.addEventListener(
      "click",
      printPerformanceReport
    );


  REPORT_DOM.athlete
    ?.addEventListener(
      "change",
      handleReportAthleteChange
    );


  window.addEventListener(
    "weight-analysis-complete",
    handleAnalysisComplete
  );


  /*
     app.js에서 선수 등록 후
     아래 이벤트를 발생시키면
     자동 갱신 가능.

     window.dispatchEvent(
       new Event("weight-athletes-updated")
     );
  */

  window.addEventListener(
    "weight-athletes-updated",
    refreshReportAthletes
  );

}


/* =========================================================
   34. INITIALIZE
========================================================= */

function initializeReportSystem() {

  populateReportAthletes();

  bindReportEvents();


  console.log(
    "[WEIGHT PERFORMANCE LAB] Report engine initialized."
  );

}


/* =========================================================
   35. DOM READY
========================================================= */

if (
  document.readyState ===
  "loading"
) {

  document.addEventListener(
    "DOMContentLoaded",
    initializeReportSystem
  );

}

else {

  initializeReportSystem();

}