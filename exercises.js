/* =========================================================
   설천고 WEIGHT PERFORMANCE LAB
   EXERCISES.JS

   EXERCISE DATABASE
   - Exercise Library
   - Category Filter
   - Equipment Filter
   - Search
   - Exercise Modal
   - Analysis Connection
========================================================= */

"use strict";


/* =========================================================
   01. CATEGORY LABEL
========================================================= */

const EXERCISE_CATEGORY_LABELS = {

  all: "전체",

  lower: "하체",

  chest: "가슴",

  back: "등",

  shoulder: "어깨",

  arms: "팔",

  core: "코어",

  olympic: "올림픽 리프팅",

  power: "파워",

  plyometric: "플라이오",

  functional: "기능성",

  mobility: "보강·가동성",

  fullbody: "전신"

};


/* =========================================================
   02. EQUIPMENT LABEL
========================================================= */

const EXERCISE_EQUIPMENT_LABELS = {

  barbell: "바벨",

  dumbbell: "덤벨",

  machine: "머신",

  cable: "케이블",

  bodyweight: "맨몸",

  kettlebell: "케틀벨",

  band: "밴드",

  medicineball: "메디신볼",

  other: "기타"

};


/* =========================================================
   03. EXERCISE FACTORY

   코드 길이는 줄이고
   종목 데이터는 많이 넣기 위한 함수
========================================================= */

function makeExercise(
  id,
  name,
  category,
  equipment,
  icon,
  muscles,
  view = "side",
  metrics = [],
  description = ""
) {

  return {

    id,

    name,

    category,

    equipment,

    icon,

    muscles,

    view,

    metrics,

    description,

    analysis: {

      repCounter: true,

      skeleton: true,

      angles: true,

      symmetry: true,

      rom: true,

      stability: true,

      tempo: true,

      barPath:
        equipment === "barbell" ||
        category === "olympic",

      checkpoints: []

    }

  };

}


/* =========================================================
   04. EXERCISE DATABASE
========================================================= */

const EXERCISES = [

  /* =======================================================
     LOWER BODY
  ======================================================= */

  makeExercise(
    "bodyweight-squat",
    "스쿼트",
    "lower",
    "bodyweight",
    "🏋️",
    "대퇴사두근 · 둔근 · 햄스트링 · 코어",
    "side",
    ["knee", "hip", "ankle", "trunk"],
    "기본 맨몸 스쿼트 자세를 분석합니다."
  ),

  makeExercise(
    "air-squat",
    "에어 스쿼트",
    "lower",
    "bodyweight",
    "🏋️",
    "대퇴사두근 · 둔근 · 코어",
    "front",
    ["knee", "hip", "symmetry"],
    "맨몸 스쿼트의 좌우 정렬과 깊이를 분석합니다."
  ),

  makeExercise(
    "back-squat",
    "백 스쿼트",
    "lower",
    "barbell",
    "🏋️",
    "대퇴사두근 · 둔근 · 햄스트링 · 척추기립근",
    "side",
    ["knee", "hip", "ankle", "trunk", "barPath"],
    "바벨 백 스쿼트의 깊이와 바벨 궤적을 분석합니다."
  ),

  makeExercise(
    "high-bar-squat",
    "하이바 스쿼트",
    "lower",
    "barbell",
    "🏋️",
    "대퇴사두근 · 둔근 · 코어",
    "side",
    ["knee", "hip", "ankle", "barPath"]
  ),

  makeExercise(
    "low-bar-squat",
    "로우바 스쿼트",
    "lower",
    "barbell",
    "🏋️",
    "둔근 · 햄스트링 · 대퇴사두근 · 등",
    "side",
    ["hip", "knee", "trunk", "barPath"]
  ),

  makeExercise(
    "front-squat",
    "프론트 스쿼트",
    "lower",
    "barbell",
    "🏋️",
    "대퇴사두근 · 둔근 · 코어 · 상부등",
    "side",
    ["knee", "hip", "trunk", "barPath"]
  ),

  makeExercise(
    "pause-squat",
    "포즈 스쿼트",
    "lower",
    "barbell",
    "🏋️",
    "대퇴사두근 · 둔근 · 코어",
    "side",
    ["knee", "hip", "tempo", "barPath"]
  ),

  makeExercise(
    "box-squat",
    "박스 스쿼트",
    "lower",
    "barbell",
    "🏋️",
    "둔근 · 햄스트링 · 대퇴사두근",
    "side",
    ["hip", "knee", "trunk"]
  ),

  makeExercise(
    "goblet-squat",
    "고블릿 스쿼트",
    "lower",
    "dumbbell",
    "🏋️",
    "대퇴사두근 · 둔근 · 코어",
    "front",
    ["knee", "hip", "symmetry"]
  ),

  makeExercise(
    "dumbbell-squat",
    "덤벨 스쿼트",
    "lower",
    "dumbbell",
    "🏋️",
    "대퇴사두근 · 둔근 · 코어",
    "front",
    ["knee", "hip", "symmetry"]
  ),

  makeExercise(
    "sumo-squat",
    "스모 스쿼트",
    "lower",
    "bodyweight",
    "🏋️",
    "내전근 · 둔근 · 대퇴사두근",
    "front",
    ["knee", "hip", "symmetry"]
  ),

  makeExercise(
    "split-squat",
    "스플릿 스쿼트",
    "lower",
    "bodyweight",
    "🦵",
    "대퇴사두근 · 둔근 · 햄스트링",
    "side",
    ["knee", "hip", "balance"]
  ),

  makeExercise(
    "bulgarian-split-squat",
    "불가리안 스플릿 스쿼트",
    "lower",
    "dumbbell",
    "🦵",
    "둔근 · 대퇴사두근 · 햄스트링",
    "side",
    ["knee", "hip", "balance"]
  ),

  makeExercise(
    "lunge",
    "런지",
    "lower",
    "bodyweight",
    "🚶",
    "대퇴사두근 · 둔근 · 햄스트링",
    "side",
    ["knee", "hip", "balance"],
    "기본 맨몸 런지입니다."
  ),

  makeExercise(
    "forward-lunge",
    "포워드 런지",
    "lower",
    "bodyweight",
    "🚶",
    "대퇴사두근 · 둔근 · 햄스트링",
    "side",
    ["knee", "hip", "stability"]
  ),

  makeExercise(
    "reverse-lunge",
    "리버스 런지",
    "lower",
    "bodyweight",
    "🚶",
    "둔근 · 대퇴사두근 · 햄스트링",
    "side",
    ["knee", "hip", "stability"]
  ),

  makeExercise(
    "walking-lunge",
    "워킹 런지",
    "lower",
    "bodyweight",
    "🚶",
    "둔근 · 대퇴사두근 · 햄스트링",
    "side",
    ["knee", "hip", "balance"]
  ),

  makeExercise(
    "lateral-lunge",
    "사이드 런지",
    "lower",
    "bodyweight",
    "↔️",
    "내전근 · 둔근 · 대퇴사두근",
    "front",
    ["knee", "hip", "symmetry"]
  ),

  makeExercise(
    "curtsy-lunge",
    "커티시 런지",
    "lower",
    "bodyweight",
    "🦵",
    "둔근 · 내전근 · 대퇴사두근",
    "front",
    ["knee", "hip", "balance"]
  ),

  makeExercise(
    "step-up",
    "스텝 업",
    "lower",
    "bodyweight",
    "🪜",
    "둔근 · 대퇴사두근 · 햄스트링",
    "side",
    ["knee", "hip", "balance"]
  ),

  makeExercise(
    "single-leg-squat",
    "싱글 레그 스쿼트",
    "lower",
    "bodyweight",
    "🦵",
    "둔근 · 대퇴사두근 · 코어",
    "front",
    ["knee", "hip", "balance"]
  ),

  makeExercise(
    "pistol-squat",
    "피스톨 스쿼트",
    "lower",
    "bodyweight",
    "🦵",
    "대퇴사두근 · 둔근 · 코어",
    "side",
    ["knee", "hip", "ankle", "balance"]
  ),

  makeExercise(
    "wall-sit",
    "월 싯",
    "lower",
    "bodyweight",
    "🧱",
    "대퇴사두근 · 둔근",
    "side",
    ["knee", "hip", "time"]
  ),

  makeExercise(
    "leg-press",
    "레그 프레스",
    "lower",
    "machine",
    "🦵",
    "대퇴사두근 · 둔근 · 햄스트링",
    "side",
    ["knee", "hip", "rom"]
  ),

  makeExercise(
    "hack-squat",
    "핵 스쿼트",
    "lower",
    "machine",
    "🦵",
    "대퇴사두근 · 둔근",
    "side",
    ["knee", "hip", "rom"]
  ),

  makeExercise(
    "leg-extension",
    "레그 익스텐션",
    "lower",
    "machine",
    "🦵",
    "대퇴사두근",
    "side",
    ["knee", "tempo", "rom"]
  ),

  makeExercise(
    "leg-curl",
    "레그 컬",
    "lower",
    "machine",
    "🦵",
    "햄스트링",
    "side",
    ["knee", "tempo", "rom"]
  ),

  makeExercise(
    "seated-leg-curl",
    "시티드 레그 컬",
    "lower",
    "machine",
    "🦵",
    "햄스트링",
    "side",
    ["knee", "rom"]
  ),

  makeExercise(
    "hip-thrust",
    "힙 쓰러스트",
    "lower",
    "barbell",
    "🍑",
    "둔근 · 햄스트링",
    "side",
    ["hip", "trunk", "barPath"]
  ),

  makeExercise(
    "glute-bridge",
    "글루트 브리지",
    "lower",
    "bodyweight",
    "🍑",
    "둔근 · 햄스트링 · 코어",
    "side",
    ["hip", "trunk"]
  ),

  makeExercise(
    "single-leg-glute-bridge",
    "싱글 레그 글루트 브리지",
    "lower",
    "bodyweight",
    "🍑",
    "둔근 · 햄스트링 · 코어",
    "front",
    ["hip", "symmetry", "stability"]
  ),

  makeExercise(
    "calf-raise",
    "카프 레이즈",
    "lower",
    "bodyweight",
    "🦶",
    "비복근 · 가자미근",
    "side",
    ["ankle", "rom", "tempo"]
  ),

  makeExercise(
    "single-calf-raise",
    "싱글 레그 카프 레이즈",
    "lower",
    "bodyweight",
    "🦶",
    "비복근 · 가자미근",
    "side",
    ["ankle", "balance", "rom"]
  ),


  /* =======================================================
     DEADLIFT / POSTERIOR CHAIN
  ======================================================= */

  makeExercise(
    "deadlift",
    "데드리프트",
    "lower",
    "barbell",
    "🏋️",
    "둔근 · 햄스트링 · 척추기립근 · 광배근",
    "side",
    ["hip", "knee", "trunk", "barPath"]
  ),

  makeExercise(
    "conventional-deadlift",
    "컨벤셔널 데드리프트",
    "lower",
    "barbell",
    "🏋️",
    "둔근 · 햄스트링 · 등 · 코어",
    "side",
    ["hip", "knee", "trunk", "barPath"]
  ),

  makeExercise(
    "sumo-deadlift",
    "스모 데드리프트",
    "lower",
    "barbell",
    "🏋️",
    "둔근 · 내전근 · 대퇴사두근 · 등",
    "front",
    ["hip", "knee", "symmetry", "barPath"]
  ),

  makeExercise(
    "romanian-deadlift",
    "루마니안 데드리프트",
    "lower",
    "barbell",
    "🏋️",
    "햄스트링 · 둔근 · 척추기립근",
    "side",
    ["hip", "trunk", "barPath"]
  ),

  makeExercise(
    "stiff-leg-deadlift",
    "스티프 레그 데드리프트",
    "lower",
    "barbell",
    "🏋️",
    "햄스트링 · 둔근 · 척추기립근",
    "side",
    ["hip", "trunk"]
  ),

  makeExercise(
    "trap-bar-deadlift",
    "트랩바 데드리프트",
    "lower",
    "other",
    "⬡",
    "둔근 · 대퇴사두근 · 햄스트링 · 등",
    "side",
    ["hip", "knee", "trunk"]
  ),

  makeExercise(
    "single-leg-rdl",
    "싱글 레그 RDL",
    "lower",
    "dumbbell",
    "🦵",
    "햄스트링 · 둔근 · 코어",
    "side",
    ["hip", "trunk", "balance"]
  ),

  makeExercise(
    "good-morning",
    "굿모닝",
    "lower",
    "barbell",
    "🏋️",
    "햄스트링 · 둔근 · 척추기립근",
    "side",
    ["hip", "trunk"]
  ),

  makeExercise(
    "nordic-curl",
    "노르딕 햄스트링 컬",
    "lower",
    "bodyweight",
    "🦵",
    "햄스트링",
    "side",
    ["knee", "hip", "trunk"]
  ),


  /* =======================================================
     CHEST
  ======================================================= */

  makeExercise(
    "push-up",
    "푸시업",
    "chest",
    "bodyweight",
    "💪",
    "대흉근 · 삼두근 · 전면삼각근 · 코어",
    "side",
    ["elbow", "shoulder", "trunk"]
  ),

  makeExercise(
    "knee-push-up",
    "니 푸시업",
    "chest",
    "bodyweight",
    "💪",
    "대흉근 · 삼두근",
    "side",
    ["elbow", "shoulder", "trunk"]
  ),

  makeExercise(
    "wide-push-up",
    "와이드 푸시업",
    "chest",
    "bodyweight",
    "💪",
    "대흉근 · 삼두근",
    "front",
    ["elbow", "shoulder", "symmetry"]
  ),

  makeExercise(
    "diamond-push-up",
    "다이아몬드 푸시업",
    "chest",
    "bodyweight",
    "💎",
    "삼두근 · 대흉근",
    "side",
    ["elbow", "shoulder"]
  ),

  makeExercise(
    "decline-push-up",
    "디클라인 푸시업",
    "chest",
    "bodyweight",
    "💪",
    "상부 대흉근 · 삼두근 · 어깨",
    "side",
    ["elbow", "shoulder", "trunk"]
  ),

  makeExercise(
    "bench-press",
    "벤치프레스",
    "chest",
    "barbell",
    "🏋️",
    "대흉근 · 삼두근 · 전면삼각근",
    "side",
    ["elbow", "shoulder", "barPath"]
  ),

  makeExercise(
    "pause-bench",
    "포즈 벤치프레스",
    "chest",
    "barbell",
    "🏋️",
    "대흉근 · 삼두근 · 전면삼각근",
    "side",
    ["elbow", "shoulder", "tempo", "barPath"]
  ),

  makeExercise(
    "close-grip-bench",
    "클로즈그립 벤치프레스",
    "chest",
    "barbell",
    "🏋️",
    "삼두근 · 대흉근",
    "side",
    ["elbow", "shoulder", "barPath"]
  ),

  makeExercise(
    "incline-bench",
    "인클라인 벤치프레스",
    "chest",
    "barbell",
    "🏋️",
    "상부 대흉근 · 삼두근 · 어깨",
    "side",
    ["elbow", "shoulder", "barPath"]
  ),

  makeExercise(
    "decline-bench",
    "디클라인 벤치프레스",
    "chest",
    "barbell",
    "🏋️",
    "하부 대흉근 · 삼두근",
    "side",
    ["elbow", "shoulder", "barPath"]
  ),

  makeExercise(
    "dumbbell-bench",
    "덤벨 벤치프레스",
    "chest",
    "dumbbell",
    "🏋️",
    "대흉근 · 삼두근 · 어깨",
    "front",
    ["elbow", "shoulder", "symmetry"]
  ),

  makeExercise(
    "incline-db-press",
    "인클라인 덤벨프레스",
    "chest",
    "dumbbell",
    "🏋️",
    "상부 대흉근 · 어깨 · 삼두근",
    "front",
    ["elbow", "shoulder", "symmetry"]
  ),

  makeExercise(
    "dumbbell-fly",
    "덤벨 플라이",
    "chest",
    "dumbbell",
    "🪽",
    "대흉근",
    "front",
    ["elbow", "shoulder", "symmetry"]
  ),

  makeExercise(
    "pec-deck",
    "펙덱 플라이",
    "chest",
    "machine",
    "🪽",
    "대흉근",
    "front",
    ["shoulder", "symmetry", "rom"]
  ),

  makeExercise(
    "cable-fly",
    "케이블 플라이",
    "chest",
    "cable",
    "🪽",
    "대흉근",
    "front",
    ["shoulder", "symmetry"]
  ),

  makeExercise(
    "chest-press-machine",
    "체스트 프레스",
    "chest",
    "machine",
    "💪",
    "대흉근 · 삼두근 · 어깨",
    "front",
    ["elbow", "shoulder", "symmetry"]
  ),


  /* =======================================================
     BACK
  ======================================================= */

  makeExercise(
    "pull-up",
    "풀업",
    "back",
    "bodyweight",
    "🧗",
    "광배근 · 승모근 · 이두근",
    "front",
    ["elbow", "shoulder", "symmetry"]
  ),

  makeExercise(
    "chin-up",
    "친업",
    "back",
    "bodyweight",
    "🧗",
    "광배근 · 이두근",
    "front",
    ["elbow", "shoulder", "symmetry"]
  ),

  makeExercise(
    "inverted-row",
    "인버티드 로우",
    "back",
    "bodyweight",
    "↔️",
    "광배근 · 능형근 · 이두근",
    "side",
    ["elbow", "shoulder", "trunk"]
  ),

  makeExercise(
    "barbell-row",
    "바벨 로우",
    "back",
    "barbell",
    "🏋️",
    "광배근 · 승모근 · 능형근 · 이두근",
    "side",
    ["hip", "trunk", "elbow", "barPath"]
  ),

  makeExercise(
    "pendlay-row",
    "펜들레이 로우",
    "back",
    "barbell",
    "🏋️",
    "광배근 · 승모근 · 후면삼각근",
    "side",
    ["hip", "trunk", "elbow", "barPath"]
  ),

  makeExercise(
    "dumbbell-row",
    "원암 덤벨 로우",
    "back",
    "dumbbell",
    "🏋️",
    "광배근 · 능형근 · 이두근",
    "side",
    ["elbow", "shoulder", "trunk"]
  ),

  makeExercise(
    "lat-pulldown",
    "랫 풀다운",
    "back",
    "machine",
    "⬇️",
    "광배근 · 이두근 · 승모근",
    "front",
    ["elbow", "shoulder", "symmetry"]
  ),

  makeExercise(
    "seated-row",
    "시티드 로우",
    "back",
    "cable",
    "↔️",
    "광배근 · 능형근 · 승모근",
    "side",
    ["elbow", "shoulder", "trunk"]
  ),

  makeExercise(
    "t-bar-row",
    "T바 로우",
    "back",
    "other",
    "🏋️",
    "광배근 · 승모근 · 능형근",
    "side",
    ["hip", "trunk", "elbow"]
  ),

  makeExercise(
    "straight-arm-pulldown",
    "스트레이트 암 풀다운",
    "back",
    "cable",
    "⬇️",
    "광배근 · 대원근",
    "side",
    ["shoulder", "trunk"]
  ),

  makeExercise(
    "back-extension",
    "백 익스텐션",
    "back",
    "bodyweight",
    "↕️",
    "척추기립근 · 둔근 · 햄스트링",
    "side",
    ["hip", "trunk"]
  ),


  /* =======================================================
     SHOULDERS
  ======================================================= */

  makeExercise(
    "overhead-press",
    "오버헤드 프레스",
    "shoulder",
    "barbell",
    "⬆️",
    "삼각근 · 삼두근 · 코어",
    "side",
    ["elbow", "shoulder", "trunk", "barPath"]
  ),

  makeExercise(
    "military-press",
    "밀리터리 프레스",
    "shoulder",
    "barbell",
    "⬆️",
    "삼각근 · 삼두근 · 상부흉근",
    "front",
    ["elbow", "shoulder", "symmetry", "barPath"]
  ),

  makeExercise(
    "seated-db-press",
    "시티드 덤벨 숄더프레스",
    "shoulder",
    "dumbbell",
    "⬆️",
    "삼각근 · 삼두근",
    "front",
    ["elbow", "shoulder", "symmetry"]
  ),

  makeExercise(
    "arnold-press",
    "아놀드 프레스",
    "shoulder",
    "dumbbell",
    "🔄",
    "삼각근 · 삼두근",
    "front",
    ["elbow", "shoulder", "symmetry"]
  ),

  makeExercise(
    "lateral-raise",
    "사이드 레터럴 레이즈",
    "shoulder",
    "dumbbell",
    "🪽",
    "측면삼각근",
    "front",
    ["shoulder", "symmetry"]
  ),

  makeExercise(
    "front-raise",
    "프론트 레이즈",
    "shoulder",
    "dumbbell",
    "⬆️",
    "전면삼각근",
    "side",
    ["shoulder", "trunk"]
  ),

  makeExercise(
    "rear-delt-fly",
    "리어 델트 플라이",
    "shoulder",
    "dumbbell",
    "🪽",
    "후면삼각근 · 능형근",
    "rear",
    ["shoulder", "symmetry"]
  ),

  makeExercise(
    "face-pull",
    "페이스 풀",
    "shoulder",
    "cable",
    "⬅️",
    "후면삼각근 · 회전근개 · 승모근",
    "front",
    ["elbow", "shoulder", "symmetry"]
  ),

  makeExercise(
    "upright-row",
    "업라이트 로우",
    "shoulder",
    "barbell",
    "⬆️",
    "삼각근 · 승모근",
    "front",
    ["elbow", "shoulder", "symmetry"]
  ),

  makeExercise(
    "shrug",
    "슈러그",
    "shoulder",
    "dumbbell",
    "⬆️",
    "승모근",
    "front",
    ["shoulder", "symmetry"]
  ),


  /* =======================================================
     ARMS
  ======================================================= */

  makeExercise(
    "barbell-curl",
    "바벨 컬",
    "arms",
    "barbell",
    "💪",
    "이두근 · 상완근",
    "side",
    ["elbow", "tempo"]
  ),

  makeExercise(
    "dumbbell-curl",
    "덤벨 컬",
    "arms",
    "dumbbell",
    "💪",
    "이두근 · 상완근",
    "front",
    ["elbow", "symmetry"]
  ),

  makeExercise(
    "hammer-curl",
    "해머 컬",
    "arms",
    "dumbbell",
    "🔨",
    "상완근 · 상완요골근 · 이두근",
    "front",
    ["elbow", "symmetry"]
  ),

  makeExercise(
    "preacher-curl",
    "프리처 컬",
    "arms",
    "machine",
    "💪",
    "이두근",
    "side",
    ["elbow", "rom"]
  ),

  makeExercise(
    "cable-curl",
    "케이블 컬",
    "arms",
    "cable",
    "💪",
    "이두근",
    "side",
    ["elbow", "tempo"]
  ),

  makeExercise(
    "triceps-pushdown",
    "트라이셉스 푸시다운",
    "arms",
    "cable",
    "⬇️",
    "삼두근",
    "side",
    ["elbow", "tempo"]
  ),

  makeExercise(
    "overhead-triceps-extension",
    "오버헤드 트라이셉스 익스텐션",
    "arms",
    "dumbbell",
    "💪",
    "삼두근",
    "side",
    ["elbow", "shoulder"]
  ),

  makeExercise(
    "skull-crusher",
    "스컬 크러셔",
    "arms",
    "barbell",
    "💪",
    "삼두근",
    "side",
    ["elbow", "rom"]
  ),

  makeExercise(
    "bench-dip",
    "벤치 딥",
    "arms",
    "bodyweight",
    "💪",
    "삼두근 · 대흉근 · 어깨",
    "side",
    ["elbow", "shoulder"]
  ),

  makeExercise(
    "dip",
    "딥스",
    "arms",
    "bodyweight",
    "💪",
    "삼두근 · 대흉근 · 전면삼각근",
    "side",
    ["elbow", "shoulder", "trunk"]
  ),


  /* =======================================================
     CORE
  ======================================================= */

  makeExercise(
    "plank",
    "플랭크",
    "core",
    "bodyweight",
    "▬",
    "복직근 · 복횡근 · 둔근 · 어깨",
    "side",
    ["trunk", "hip", "stability"]
  ),

  makeExercise(
    "side-plank",
    "사이드 플랭크",
    "core",
    "bodyweight",
    "▬",
    "복사근 · 중둔근 · 코어",
    "front",
    ["trunk", "hip", "stability"]
  ),

  makeExercise(
    "crunch",
    "크런치",
    "core",
    "bodyweight",
    "🔁",
    "복직근",
    "side",
    ["trunk", "tempo"]
  ),

  makeExercise(
    "sit-up",
    "싯업",
    "core",
    "bodyweight",
    "🔁",
    "복직근 · 장요근",
    "side",
    ["hip", "trunk", "tempo"]
  ),

  makeExercise(
    "reverse-crunch",
    "리버스 크런치",
    "core",
    "bodyweight",
    "🔁",
    "복직근 · 장요근",
    "side",
    ["hip", "trunk"]
  ),

  makeExercise(
    "leg-raise",
    "레그 레이즈",
    "core",
    "bodyweight",
    "⬆️",
    "복직근 · 장요근",
    "side",
    ["hip", "trunk"]
  ),

  makeExercise(
    "hanging-leg-raise",
    "행잉 레그 레이즈",
    "core",
    "bodyweight",
    "🧗",
    "복직근 · 장요근 · 광배근",
    "side",
    ["hip", "shoulder", "trunk"]
  ),

  makeExercise(
    "russian-twist",
    "러시안 트위스트",
    "core",
    "bodyweight",
    "🔄",
    "복사근 · 복직근",
    "front",
    ["trunk", "symmetry"]
  ),

  makeExercise(
    "dead-bug",
    "데드버그",
    "core",
    "bodyweight",
    "✳️",
    "복횡근 · 복직근 · 장요근",
    "top",
    ["hip", "shoulder", "symmetry"]
  ),

  makeExercise(
    "bird-dog",
    "버드독",
    "core",
    "bodyweight",
    "🐦",
    "코어 · 둔근 · 척추기립근",
    "side",
    ["hip", "shoulder", "stability"]
  ),

  makeExercise(
    "mountain-climber",
    "마운틴 클라이머",
    "core",
    "bodyweight",
    "⛰️",
    "코어 · 장요근 · 어깨",
    "side",
    ["hip", "knee", "tempo"]
  ),

  makeExercise(
    "ab-wheel",
    "AB 롤아웃",
    "core",
    "other",
    "⚙️",
    "복직근 · 광배근 · 어깨",
    "side",
    ["shoulder", "hip", "trunk"]
  ),

  makeExercise(
    "pallof-press",
    "팔로프 프레스",
    "core",
    "cable",
    "↔️",
    "복사근 · 복횡근",
    "front",
    ["trunk", "symmetry", "stability"]
  ),

  makeExercise(
    "farmer-carry",
    "파머스 캐리",
    "core",
    "dumbbell",
    "🚶",
    "코어 · 승모근 · 전완근 · 둔근",
    "front",
    ["trunk", "gait", "symmetry"]
  ),


  /* =======================================================
     OLYMPIC LIFTING
  ======================================================= */

  makeExercise(
    "clean",
    "클린",
    "olympic",
    "barbell",
    "🏋️",
    "전신 · 둔근 · 대퇴사두근 · 승모근",
    "side",
    ["hip", "knee", "ankle", "barPath", "velocity"]
  ),

  makeExercise(
    "power-clean",
    "파워 클린",
    "olympic",
    "barbell",
    "⚡",
    "전신 · 둔근 · 대퇴사두근 · 승모근",
    "side",
    ["hip", "knee", "ankle", "barPath", "velocity"]
  ),

  makeExercise(
    "hang-clean",
    "행 클린",
    "olympic",
    "barbell",
    "⚡",
    "둔근 · 햄스트링 · 승모근 · 대퇴사두근",
    "side",
    ["hip", "knee", "barPath", "velocity"]
  ),

  makeExercise(
    "clean-pull",
    "클린 풀",
    "olympic",
    "barbell",
    "⬆️",
    "둔근 · 햄스트링 · 승모근",
    "side",
    ["hip", "knee", "ankle", "barPath"]
  ),

  makeExercise(
    "clean-and-jerk",
    "클린 앤 저크",
    "olympic",
    "barbell",
    "🏋️",
    "전신",
    "side",
    ["hip", "knee", "shoulder", "barPath", "velocity"]
  ),

  makeExercise(
    "snatch",
    "스내치",
    "olympic",
    "barbell",
    "🏋️",
    "전신 · 둔근 · 햄스트링 · 어깨",
    "side",
    ["hip", "knee", "ankle", "shoulder", "barPath"]
  ),

  makeExercise(
    "power-snatch",
    "파워 스내치",
    "olympic",
    "barbell",
    "⚡",
    "전신 · 둔근 · 어깨 · 승모근",
    "side",
    ["hip", "knee", "shoulder", "barPath", "velocity"]
  ),

  makeExercise(
    "hang-snatch",
    "행 스내치",
    "olympic",
    "barbell",
    "⚡",
    "전신 · 둔근 · 햄스트링 · 어깨",
    "side",
    ["hip", "knee", "shoulder", "barPath"]
  ),

  makeExercise(
    "snatch-pull",
    "스내치 풀",
    "olympic",
    "barbell",
    "⬆️",
    "둔근 · 햄스트링 · 승모근",
    "side",
    ["hip", "knee", "ankle", "barPath"]
  ),

  makeExercise(
    "jerk",
    "저크",
    "olympic",
    "barbell",
    "⬆️",
    "어깨 · 삼두근 · 하체 · 코어",
    "side",
    ["knee", "hip", "shoulder", "barPath"]
  ),

  makeExercise(
    "split-jerk",
    "스플릿 저크",
    "olympic",
    "barbell",
    "🏋️",
    "전신 · 어깨 · 하체",
    "side",
    ["knee", "hip", "shoulder", "balance", "barPath"]
  ),

  makeExercise(
    "push-press",
    "푸시 프레스",
    "olympic",
    "barbell",
    "⬆️",
    "어깨 · 삼두근 · 둔근 · 대퇴사두근",
    "side",
    ["knee", "hip", "shoulder", "barPath"]
  ),

  makeExercise(
    "overhead-squat",
    "오버헤드 스쿼트",
    "olympic",
    "barbell",
    "🏋️",
    "대퇴사두근 · 둔근 · 어깨 · 코어",
    "side",
    ["knee", "hip", "ankle", "shoulder", "trunk"]
  ),


  /* =======================================================
     POWER
  ======================================================= */

  makeExercise(
    "jump-squat",
    "점프 스쿼트",
    "power",
    "bodyweight",
    "⚡",
    "대퇴사두근 · 둔근 · 종아리",
    "side",
    ["knee", "hip", "ankle", "jumpHeight"]
  ),

  makeExercise(
    "barbell-jump-squat",
    "바벨 점프 스쿼트",
    "power",
    "barbell",
    "⚡",
    "대퇴사두근 · 둔근 · 종아리",
    "side",
    ["knee", "hip", "velocity", "barPath"]
  ),

  makeExercise(
    "kettlebell-swing",
    "케틀벨 스윙",
    "power",
    "kettlebell",
    "🔔",
    "둔근 · 햄스트링 · 코어",
    "side",
    ["hip", "trunk", "tempo"]
  ),

  makeExercise(
    "medicine-ball-slam",
    "메디신볼 슬램",
    "power",
    "medicineball",
    "💥",
    "광배근 · 복근 · 어깨 · 하체",
    "side",
    ["shoulder", "hip", "velocity"]
  ),

  makeExercise(
    "medicine-ball-chest-pass",
    "메디신볼 체스트 패스",
    "power",
    "medicineball",
    "🏀",
    "대흉근 · 삼두근 · 코어",
    "side",
    ["elbow", "shoulder", "velocity"]
  ),

  makeExercise(
    "medicine-ball-rotational-throw",
    "메디신볼 회전 던지기",
    "power",
    "medicineball",
    "🔄",
    "복사근 · 둔근 · 어깨",
    "front",
    ["hip", "trunk", "velocity"]
  ),

  makeExercise(
    "push-jerk",
    "푸시 저크",
    "power",
    "barbell",
    "⚡",
    "하체 · 어깨 · 삼두근 · 코어",
    "side",
    ["knee", "hip", "shoulder", "barPath"]
  ),


  /* =======================================================
     PLYOMETRIC
  ======================================================= */

  makeExercise(
    "vertical-jump",
    "버티컬 점프",
    "plyometric",
    "bodyweight",
    "⬆️",
    "둔근 · 대퇴사두근 · 종아리",
    "side",
    ["knee", "hip", "ankle", "jumpHeight"]
  ),

  makeExercise(
    "countermovement-jump",
    "CMJ",
    "plyometric",
    "bodyweight",
    "⬆️",
    "둔근 · 대퇴사두근 · 종아리",
    "side",
    ["knee", "hip", "ankle", "jumpHeight"]
  ),

  makeExercise(
    "squat-jump",
    "스쿼트 점프",
    "plyometric",
    "bodyweight",
    "⬆️",
    "둔근 · 대퇴사두근 · 종아리",
    "side",
    ["knee", "hip", "jumpHeight"]
  ),

  makeExercise(
    "box-jump",
    "박스 점프",
    "plyometric",
    "bodyweight",
    "📦",
    "둔근 · 대퇴사두근 · 종아리",
    "side",
    ["knee", "hip", "ankle", "landing"]
  ),

  makeExercise(
    "depth-jump",
    "뎁스 점프",
    "plyometric",
    "bodyweight",
    "⬇️",
    "하체 · 종아리 · 코어",
    "side",
    ["knee", "hip", "landing", "contactTime"]
  ),

  makeExercise(
    "broad-jump",
    "제자리 멀리뛰기",
    "plyometric",
    "bodyweight",
    "➡️",
    "둔근 · 햄스트링 · 대퇴사두근",
    "side",
    ["hip", "knee", "ankle", "distance"]
  ),

  makeExercise(
    "single-leg-hop",
    "싱글 레그 홉",
    "plyometric",
    "bodyweight",
    "🦵",
    "둔근 · 대퇴사두근 · 종아리",
    "side",
    ["knee", "ankle", "landing", "balance"]
  ),

  makeExercise(
    "lateral-bound",
    "사이드 바운드",
    "plyometric",
    "bodyweight",
    "↔️",
    "중둔근 · 둔근 · 대퇴사두근",
    "front",
    ["knee", "hip", "landing", "balance"]
  ),

  makeExercise(
    "tuck-jump",
    "턱 점프",
    "plyometric",
    "bodyweight",
    "⬆️",
    "하체 · 코어",
    "side",
    ["knee", "hip", "jumpHeight"]
  ),

  makeExercise(
    "pogo-jump",
    "포고 점프",
    "plyometric",
    "bodyweight",
    "🦘",
    "종아리 · 발목",
    "side",
    ["ankle", "contactTime", "tempo"]
  ),

  makeExercise(
    "skater-jump",
    "스케이터 점프",
    "plyometric",
    "bodyweight",
    "⛸️",
    "둔근 · 중둔근 · 하체",
    "front",
    ["knee", "hip", "balance", "landing"]
  ),


  /* =======================================================
     FUNCTIONAL
  ======================================================= */

  makeExercise(
    "burpee",
    "버피",
    "functional",
    "bodyweight",
    "🔥",
    "전신",
    "side",
    ["hip", "knee", "shoulder", "tempo"]
  ),

  makeExercise(
    "bear-crawl",
    "베어 크롤",
    "functional",
    "bodyweight",
    "🐻",
    "코어 · 어깨 · 둔근",
    "side",
    ["hip", "shoulder", "coordination"]
  ),

  makeExercise(
    "crab-walk",
    "크랩 워크",
    "functional",
    "bodyweight",
    "🦀",
    "둔근 · 어깨 · 코어",
    "side",
    ["hip", "shoulder", "coordination"]
  ),

  makeExercise(
    "walking-knee-drive",
    "워킹 니 드라이브",
    "functional",
    "bodyweight",
    "🚶",
    "장요근 · 둔근 · 코어",
    "side",
    ["hip", "knee", "balance"]
  ),

  makeExercise(
    "sled-push",
    "슬레드 푸시",
    "functional",
    "other",
    "➡️",
    "둔근 · 대퇴사두근 · 종아리 · 코어",
    "side",
    ["hip", "knee", "trunk"]
  ),

  makeExercise(
    "sled-pull",
    "슬레드 풀",
    "functional",
    "other",
    "⬅️",
    "둔근 · 햄스트링 · 등 · 팔",
    "side",
    ["hip", "knee", "trunk"]
  ),

  makeExercise(
    "battle-rope",
    "배틀 로프",
    "functional",
    "other",
    "〰️",
    "어깨 · 팔 · 코어",
    "front",
    ["shoulder", "tempo", "symmetry"]
  ),

  makeExercise(
    "turkish-get-up",
    "터키시 겟업",
    "functional",
    "kettlebell",
    "🔔",
    "전신 · 코어 · 어깨",
    "side",
    ["hip", "knee", "shoulder", "stability"]
  ),

  makeExercise(
    "kettlebell-clean",
    "케틀벨 클린",
    "functional",
    "kettlebell",
    "🔔",
    "둔근 · 햄스트링 · 어깨",
    "side",
    ["hip", "shoulder", "tempo"]
  ),

  makeExercise(
    "kettlebell-snatch",
    "케틀벨 스내치",
    "functional",
    "kettlebell",
    "🔔",
    "둔근 · 햄스트링 · 어깨 · 코어",
    "side",
    ["hip", "shoulder", "velocity"]
  ),

  makeExercise(
    "single-arm-carry",
    "수트케이스 캐리",
    "functional",
    "dumbbell",
    "🧳",
    "코어 · 전완근 · 승모근",
    "front",
    ["trunk", "gait", "stability"]
  ),

  makeExercise(
    "overhead-carry",
    "오버헤드 캐리",
    "functional",
    "dumbbell",
    "⬆️",
    "어깨 · 코어 · 둔근",
    "front",
    ["shoulder", "trunk", "gait"]
  ),


  /* =======================================================
     MOBILITY / CORRECTIVE
  ======================================================= */

  makeExercise(
    "bodyweight-good-morning",
    "맨몸 굿모닝",
    "mobility",
    "bodyweight",
    "↘️",
    "햄스트링 · 둔근 · 척추기립근",
    "side",
    ["hip", "trunk"]
  ),

  makeExercise(
    "deep-squat-hold",
    "딥 스쿼트 홀드",
    "mobility",
    "bodyweight",
    "🏋️",
    "고관절 · 발목 · 둔근",
    "front",
    ["knee", "hip", "ankle"]
  ),

  makeExercise(
    "ankle-mobility",
    "발목 가동성",
    "mobility",
    "bodyweight",
    "🦶",
    "발목 · 종아리",
    "side",
    ["ankle", "rom"]
  ),

  makeExercise(
    "hip-flexor-stretch",
    "고관절 굴곡근 스트레칭",
    "mobility",
    "bodyweight",
    "🦵",
    "장요근 · 대퇴직근",
    "side",
    ["hip", "trunk"]
  ),

  makeExercise(
    "hamstring-stretch",
    "햄스트링 스트레칭",
    "mobility",
    "bodyweight",
    "🦵",
    "햄스트링",
    "side",
    ["hip", "knee"]
  ),

  makeExercise(
    "world-greatest-stretch",
    "월드 그레이티스트 스트레치",
    "mobility",
    "bodyweight",
    "🌎",
    "고관절 · 햄스트링 · 흉추",
    "side",
    ["hip", "trunk", "shoulder"]
  ),

  makeExercise(
    "thoracic-rotation",
    "흉추 회전",
    "mobility",
    "bodyweight",
    "🔄",
    "흉추 · 코어",
    "top",
    ["trunk", "symmetry"]
  ),

  makeExercise(
    "band-pull-apart",
    "밴드 풀 어파트",
    "mobility",
    "band",
    "↔️",
    "후면삼각근 · 능형근 · 승모근",
    "front",
    ["shoulder", "symmetry"]
  ),

  makeExercise(
    "band-external-rotation",
    "밴드 외회전",
    "mobility",
    "band",
    "🔄",
    "회전근개",
    "front",
    ["elbow", "shoulder", "symmetry"]
  ),

  makeExercise(
    "monster-walk",
    "몬스터 워크",
    "mobility",
    "band",
    "🚶",
    "중둔근 · 둔근",
    "front",
    ["hip", "knee", "symmetry"]
  ),

  makeExercise(
    "lateral-band-walk",
    "밴드 사이드 워크",
    "mobility",
    "band",
    "↔️",
    "중둔근 · 둔근",
    "front",
    ["hip", "knee", "symmetry"]
  ),

  makeExercise(
    "clamshell",
    "클램셸",
    "mobility",
    "band",
    "🐚",
    "중둔근 · 외회전근",
    "front",
    ["hip", "symmetry"]
  ),


  /* =======================================================
     FULL BODY
  ======================================================= */

  makeExercise(
    "thruster",
    "스러스터",
    "fullbody",
    "barbell",
    "🚀",
    "대퇴사두근 · 둔근 · 어깨 · 삼두근",
    "side",
    ["knee", "hip", "shoulder", "barPath"]
  ),

  makeExercise(
    "dumbbell-thruster",
    "덤벨 스러스터",
    "fullbody",
    "dumbbell",
    "🚀",
    "하체 · 어깨 · 삼두근 · 코어",
    "front",
    ["knee", "hip", "shoulder", "symmetry"]
  ),

  makeExercise(
    "devils-press",
    "데빌 프레스",
    "fullbody",
    "dumbbell",
    "🔥",
    "전신",
    "side",
    ["hip", "knee", "shoulder", "tempo"]
  ),

  makeExercise(
    "man-maker",
    "맨 메이커",
    "fullbody",
    "dumbbell",
    "🔥",
    "전신",
    "side",
    ["hip", "knee", "elbow", "shoulder"]
  ),

  makeExercise(
    "clean-to-press",
    "클린 투 프레스",
    "fullbody",
    "dumbbell",
    "⚡",
    "하체 · 둔근 · 어깨 · 팔",
    "side",
    ["hip", "knee", "shoulder"]
  ),

  makeExercise(
    "sandbag-clean",
    "샌드백 클린",
    "fullbody",
    "other",
    "🎒",
    "전신 · 둔근 · 등 · 팔",
    "side",
    ["hip", "knee", "trunk"]
  )

];


/* =========================================================
   05. EXTRA ANALYSIS CONFIG
========================================================= */

const ANALYSIS_METRIC_LABELS = {

  knee: "무릎 각도",

  hip: "고관절 각도",

  ankle: "발목 각도",

  trunk: "몸통 기울기",

  elbow: "팔꿈치 각도",

  shoulder: "어깨 각도",

  symmetry: "좌우 대칭성",

  rom: "가동범위",

  tempo: "동작 템포",

  stability: "안정성",

  balance: "균형",

  velocity: "속도",

  barPath: "중량 궤적",

  jumpHeight: "점프 높이",

  landing: "착지 안정성",

  contactTime: "지면 접촉시간",

  distance: "이동 거리",

  gait: "보행 패턴",

  coordination: "협응력",

  time: "유지 시간"

};


/* =========================================================
   06. VIEW LABEL
========================================================= */

const EXERCISE_VIEW_LABELS = {

  front: "정면",

  side: "측면",

  rear: "후면",

  top: "상단"

};


/* =========================================================
   07. STATE
========================================================= */

const exerciseLibraryState = {

  category: "all",

  equipment: "all",

  search: "",

  selectedExercise: null

};


/* =========================================================
   08. DOM HELPER
========================================================= */

function exerciseDOM(id) {

  return document.getElementById(id);

}


/* =========================================================
   09. ESCAPE HTML
========================================================= */

function escapeExerciseHTML(value = "") {

  return String(value)

    .replaceAll("&", "&amp;")

    .replaceAll("<", "&lt;")

    .replaceAll(">", "&gt;")

    .replaceAll('"', "&quot;")

    .replaceAll("'", "&#039;");

}


/* =========================================================
   10. FIND EXERCISE
========================================================= */

function getExerciseById(id) {

  return EXERCISES.find(
    exercise => exercise.id === id
  ) || null;

}


/* =========================================================
   11. FILTER EXERCISES
========================================================= */

function getFilteredExercises() {

  const keyword =
    exerciseLibraryState.search
      .trim()
      .toLowerCase();

  return EXERCISES.filter(exercise => {

    const categoryMatch =
      exerciseLibraryState.category === "all" ||
      exercise.category ===
      exerciseLibraryState.category;

    const equipmentMatch =
      exerciseLibraryState.equipment === "all" ||
      exercise.equipment ===
      exerciseLibraryState.equipment;

    const searchTarget = [

      exercise.name,

      exercise.muscles,

      EXERCISE_CATEGORY_LABELS[
        exercise.category
      ],

      EXERCISE_EQUIPMENT_LABELS[
        exercise.equipment
      ]

    ]
      .join(" ")
      .toLowerCase();

    const searchMatch =
      !keyword ||
      searchTarget.includes(keyword);

    return (
      categoryMatch &&
      equipmentMatch &&
      searchMatch
    );

  });

}


/* =========================================================
   12. RENDER LIBRARY
========================================================= */

function renderExerciseLibrary() {

  const grid =
    exerciseDOM("exerciseGrid");

  if (!grid) {
    return;
  }

  const exercises =
    getFilteredExercises();

  const count =
    exerciseDOM("exerciseTotalCount");

  if (count) {
    count.textContent =
      exercises.length;
  }


  if (!exercises.length) {

    grid.innerHTML = `

      <div
        class="empty-state"
        style="grid-column:1/-1"
      >

        조건에 맞는 운동이 없습니다.

      </div>

    `;

    return;
  }


  grid.innerHTML =
    exercises
      .map(exercise => {

        const category =
          EXERCISE_CATEGORY_LABELS[
            exercise.category
          ] || exercise.category;

        const equipment =
          EXERCISE_EQUIPMENT_LABELS[
            exercise.equipment
          ] || exercise.equipment;

        return `

          <article
            class="exercise-card"
            data-exercise-id="${escapeExerciseHTML(
              exercise.id
            )}"
          >

            <div class="exercise-pictogram">

              ${escapeExerciseHTML(
                exercise.icon
              )}

            </div>


            <span class="exercise-card-category">

              ${escapeExerciseHTML(
                category
              )}

            </span>


            <h3>

              ${escapeExerciseHTML(
                exercise.name
              )}

            </h3>


            <p>

              ${escapeExerciseHTML(
                exercise.muscles
              )}

            </p>


            <div class="exercise-card-footer">

              <span class="exercise-tag">

                ${escapeExerciseHTML(
                  equipment
                )}

              </span>


              <button
                type="button"
                class="exercise-analyze-button"
                data-analyze-exercise="${escapeExerciseHTML(
                  exercise.id
                )}"
              >

                자세분석 →

              </button>

            </div>

          </article>

        `;

      })
      .join("");

}


/* =========================================================
   13. OPEN EXERCISE MODAL
========================================================= */

function openExerciseModal(exerciseId) {

  const exercise =
    getExerciseById(exerciseId);

  if (!exercise) {
    return;
  }

  exerciseLibraryState.selectedExercise =
    exercise;


  const modal =
    exerciseDOM("exerciseModal");

  if (!modal) {
    return;
  }


  const pictogram =
    exerciseDOM(
      "modalExercisePictogram"
    );

  const category =
    exerciseDOM(
      "modalExerciseCategory"
    );

  const name =
    exerciseDOM(
      "modalExerciseName"
    );

  const description =
    exerciseDOM(
      "modalExerciseDescription"
    );

  const muscles =
    exerciseDOM(
      "modalExerciseMuscles"
    );

  const equipment =
    exerciseDOM(
      "modalExerciseEquipment"
    );

  const view =
    exerciseDOM(
      "modalExerciseView"
    );

  const metrics =
    exerciseDOM(
      "modalExerciseMetrics"
    );


  if (pictogram) {

    pictogram.textContent =
      exercise.icon;

  }


  if (category) {

    category.textContent =
      EXERCISE_CATEGORY_LABELS[
        exercise.category
      ] || exercise.category;

  }


  if (name) {

    name.textContent =
      exercise.name;

  }


  if (description) {

    description.textContent =
      exercise.description ||
      `${exercise.name} 동작을 분석합니다.`;

  }


  if (muscles) {

    muscles.textContent =
      exercise.muscles;

  }


  if (equipment) {

    equipment.textContent =
      EXERCISE_EQUIPMENT_LABELS[
        exercise.equipment
      ] || exercise.equipment;

  }


  if (view) {

    view.textContent =
      EXERCISE_VIEW_LABELS[
        exercise.view
      ] || exercise.view;

  }


  if (metrics) {

    metrics.textContent =
      exercise.metrics
        .map(metric =>
          ANALYSIS_METRIC_LABELS[
            metric
          ] || metric
        )
        .join(" · ");

  }


  modal.classList.add("open");

}


/* =========================================================
   14. CLOSE MODAL
========================================================= */

function closeExerciseModal() {

  const modal =
    exerciseDOM("exerciseModal");

  if (!modal) {
    return;
  }

  modal.classList.remove("open");

}


/* =========================================================
   15. GO TO ANALYSIS
========================================================= */

function goToExerciseAnalysis(exerciseId) {

  const exercise =
    getExerciseById(exerciseId);

  if (!exercise) {
    return;
  }


  /* -------------------------------------------------------
     현재 선택 운동 저장
  ------------------------------------------------------- */

  localStorage.setItem(
    "weightLabSelectedExercise",
    exercise.id
  );


  /* -------------------------------------------------------
     분석 운동 SELECT
  ------------------------------------------------------- */

  const select =
    exerciseDOM("analysisExercise");

  if (select) {

    select.value =
      exercise.id;

    select.dispatchEvent(
      new Event(
        "change",
        {
          bubbles: true
        }
      )
    );

  }


  /* -------------------------------------------------------
     촬영 방향 자동 선택
  ------------------------------------------------------- */

  document
    .querySelectorAll(
      "[data-view]"
    )
    .forEach(button => {

      button.classList.toggle(
        "active",
        button.dataset.view ===
        exercise.view
      );

    });


  /* -------------------------------------------------------
     분석 페이지 이동

     app.js에 showPage가 있으면 사용
     없으면 여기서 직접 이동
  ------------------------------------------------------- */

  if (
    typeof window.showPage ===
    "function"
  ) {

    window.showPage(
      "analysis"
    );

  }

  else {

    document
      .querySelectorAll(".page")
      .forEach(page => {

        page.classList.remove(
          "active"
        );

      });


    const analysisPage =
      exerciseDOM(
        "page-analysis"
      );

    if (analysisPage) {

      analysisPage.classList.add(
        "active"
      );

    }


    document
      .querySelectorAll(
        ".nav-item"
      )
      .forEach(button => {

        button.classList.toggle(
          "active",
          button.dataset.page ===
          "analysis"
        );

      });

  }


  /* -------------------------------------------------------
     분석 제목
  ------------------------------------------------------- */

  const title =
    exerciseDOM(
      "motionAnalysisTitle"
    );

  if (title) {

    title.textContent =
      `${exercise.name} 자세 분석`;

  }


  closeExerciseModal();


  if (
    typeof window.showToast ===
    "function"
  ) {

    window.showToast(
      `${exercise.name} 분석 모드가 준비되었습니다.`
    );

  }

}


/* =========================================================
   16. POPULATE ANALYSIS SELECT
========================================================= */

function populateAnalysisExerciseSelect() {

  const select =
    exerciseDOM(
      "analysisExercise"
    );

  if (!select) {
    return;
  }


  const previous =
    select.value;


  const grouped = {};


  EXERCISES.forEach(exercise => {

    if (!grouped[exercise.category]) {

      grouped[
        exercise.category
      ] = [];

    }

    grouped[
      exercise.category
    ].push(exercise);

  });


  select.innerHTML = `

    <option value="">
      운동 선택
    </option>

  `;


  Object
    .entries(grouped)
    .forEach(
      ([category, exercises]) => {

        const group =
          document.createElement(
            "optgroup"
          );

        group.label =
          EXERCISE_CATEGORY_LABELS[
            category
          ] || category;


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

            group.appendChild(
              option
            );

          }
        );


        select.appendChild(
          group
        );

      }
    );


  const saved =
    localStorage.getItem(
      "weightLabSelectedExercise"
    );


  if (
    saved &&
    getExerciseById(saved)
  ) {

    select.value =
      saved;

  }

  else if (previous) {

    select.value =
      previous;

  }

}


/* =========================================================
   17. POPULATE PROGRAM SELECT
========================================================= */

function populateProgramExerciseSelect() {

  const select =
    exerciseDOM(
      "programExercise"
    );

  if (!select) {
    return;
  }


  select.innerHTML = `

    <option value="">
      운동 선택
    </option>

  `;


  const categories =
    Object.keys(
      EXERCISE_CATEGORY_LABELS
    )
      .filter(
        category =>
          category !== "all"
      );


  categories.forEach(category => {

    const exercises =
      EXERCISES.filter(
        exercise =>
          exercise.category ===
          category
      );


    if (!exercises.length) {
      return;
    }


    const group =
      document.createElement(
        "optgroup"
      );


    group.label =
      EXERCISE_CATEGORY_LABELS[
        category
      ];


    exercises.forEach(exercise => {

      const option =
        document.createElement(
          "option"
        );

      option.value =
        exercise.id;

      option.textContent =
        exercise.name;

      group.appendChild(
        option
      );

    });


    select.appendChild(
      group
    );

  });

}


/* =========================================================
   18. RECORD FILTER
========================================================= */

function populateRecordExerciseFilter() {

  const select =
    exerciseDOM(
      "recordExerciseFilter"
    );

  if (!select) {
    return;
  }


  select.innerHTML = `

    <option value="all">
      전체 운동
    </option>

  `;


  EXERCISES.forEach(exercise => {

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

  });

}


/* =========================================================
   19. ANALYSIS SELECT CHANGE
========================================================= */

function handleAnalysisExerciseChange() {

  const select =
    exerciseDOM(
      "analysisExercise"
    );

  if (!select) {
    return;
  }


  const exercise =
    getExerciseById(
      select.value
    );


  if (!exercise) {
    return;
  }


  localStorage.setItem(
    "weightLabSelectedExercise",
    exercise.id
  );


  const title =
    exerciseDOM(
      "motionAnalysisTitle"
    );


  if (title) {

    title.textContent =
      `${exercise.name} 자세 분석`;

  }


  document
    .querySelectorAll(
      "[data-view]"
    )
    .forEach(button => {

      button.classList.toggle(
        "active",
        button.dataset.view ===
        exercise.view
      );

    });


  renderExerciseCheckpoints(
    exercise
  );

}


/* =========================================================
   20. CHECKPOINTS
========================================================= */

function getExerciseCheckpoints(
  exercise
) {

  const result = [];


  if (
    exercise.metrics.includes(
      "knee"
    )
  ) {

    result.push(
      "무릎의 정렬과 굴곡 각도"
    );

  }


  if (
    exercise.metrics.includes(
      "hip"
    )
  ) {

    result.push(
      "고관절의 굴곡·신전 타이밍"
    );

  }


  if (
    exercise.metrics.includes(
      "ankle"
    )
  ) {

    result.push(
      "발목 가동범위와 안정성"
    );

  }


  if (
    exercise.metrics.includes(
      "trunk"
    )
  ) {

    result.push(
      "몸통 기울기와 중심 유지"
    );

  }


  if (
    exercise.metrics.includes(
      "shoulder"
    )
  ) {

    result.push(
      "어깨 관절의 움직임과 정렬"
    );

  }


  if (
    exercise.metrics.includes(
      "elbow"
    )
  ) {

    result.push(
      "팔꿈치 굴곡·신전 패턴"
    );

  }


  if (
    exercise.metrics.includes(
      "symmetry"
    )
  ) {

    result.push(
      "좌우 움직임 대칭성"
    );

  }


  if (
    exercise.metrics.includes(
      "barPath"
    )
  ) {

    result.push(
      "바벨 또는 중량의 이동 궤적"
    );

  }


  if (
    exercise.metrics.includes(
      "landing"
    )
  ) {

    result.push(
      "착지 시 무릎·고관절 안정성"
    );

  }


  if (
    exercise.metrics.includes(
      "balance"
    )
  ) {

    result.push(
      "단측 지지와 균형 유지"
    );

  }


  if (!result.length) {

    result.push(
      "전체 움직임 패턴"
    );

  }


  return result;

}


/* =========================================================
   21. RENDER CHECKPOINTS
========================================================= */

function renderExerciseCheckpoints(
  exercise
) {

  const container =
    exerciseDOM(
      "checkpointList"
    );

  if (!container) {
    return;
  }


  const checkpoints =
    getExerciseCheckpoints(
      exercise
    );


  container.innerHTML =
    checkpoints
      .map(
        (checkpoint, index) => `

          <div class="checkpoint-row">

            <span>

              ${index + 1}.
              ${escapeExerciseHTML(
                checkpoint
              )}

            </span>

            <strong>
              LIVE
            </strong>

          </div>

        `
      )
      .join("");

}


/* =========================================================
   22. CATEGORY EVENT
========================================================= */

function setupExerciseCategoryEvents() {

  document
    .querySelectorAll(
      ".category-tab"
    )
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          document
            .querySelectorAll(
              ".category-tab"
            )
            .forEach(item => {

              item.classList.remove(
                "active"
              );

            });


          button.classList.add(
            "active"
          );


          exerciseLibraryState.category =
            button.dataset.category ||
            "all";


          renderExerciseLibrary();

        }
      );

    });

}


/* =========================================================
   23. SEARCH EVENT
========================================================= */

function setupExerciseSearch() {

  const search =
    exerciseDOM(
      "exerciseSearch"
    );

  if (!search) {
    return;
  }


  search.addEventListener(
    "input",
    event => {

      exerciseLibraryState.search =
        event.target.value;

      renderExerciseLibrary();

    }
  );

}


/* =========================================================
   24. EQUIPMENT EVENT
========================================================= */

function setupEquipmentFilter() {

  const select =
    exerciseDOM(
      "equipmentFilter"
    );

  if (!select) {
    return;
  }


  select.addEventListener(
    "change",
    event => {

      exerciseLibraryState.equipment =
        event.target.value;

      renderExerciseLibrary();

    }
  );

}


/* =========================================================
   25. GRID EVENT DELEGATION
========================================================= */

function setupExerciseGridEvents() {

  const grid =
    exerciseDOM(
      "exerciseGrid"
    );

  if (!grid) {
    return;
  }


  grid.addEventListener(
    "click",
    event => {

      const analyzeButton =
        event.target.closest(
          "[data-analyze-exercise]"
        );


      if (analyzeButton) {

        event.stopPropagation();

        goToExerciseAnalysis(
          analyzeButton.dataset
            .analyzeExercise
        );

        return;

      }


      const card =
        event.target.closest(
          "[data-exercise-id]"
        );


      if (!card) {
        return;
      }


      openExerciseModal(
        card.dataset.exerciseId
      );

    }
  );

}


/* =========================================================
   26. MODAL EVENTS
========================================================= */

function setupExerciseModalEvents() {

  const closeButton =
    exerciseDOM(
      "closeExerciseModal"
    );


  if (closeButton) {

    closeButton.addEventListener(
      "click",
      closeExerciseModal
    );

  }


  const modal =
    exerciseDOM(
      "exerciseModal"
    );


  if (modal) {

    modal.addEventListener(
      "click",
      event => {

        if (
          event.target === modal
        ) {

          closeExerciseModal();

        }

      }
    );

  }


  const analyzeButton =
    exerciseDOM(
      "analyzeSelectedExerciseBtn"
    );


  if (analyzeButton) {

    analyzeButton.addEventListener(
      "click",
      () => {

        const exercise =
          exerciseLibraryState
            .selectedExercise;


        if (!exercise) {
          return;
        }


        goToExerciseAnalysis(
          exercise.id
        );

      }
    );

  }

}


/* =========================================================
   27. ANALYSIS SELECT EVENT
========================================================= */

function setupAnalysisExerciseEvent() {

  const select =
    exerciseDOM(
      "analysisExercise"
    );


  if (!select) {
    return;
  }


  select.addEventListener(
    "change",
    handleAnalysisExerciseChange
  );

}


/* =========================================================
   28. ESC KEY
========================================================= */

function setupExerciseKeyboardEvents() {

  document.addEventListener(
    "keydown",
    event => {

      if (
        event.key === "Escape"
      ) {

        closeExerciseModal();

      }

    }
  );

}


/* =========================================================
   29. GET ANALYSIS CONFIG

   app.js에서 사용
========================================================= */

function getExerciseAnalysisConfig(
  exerciseId
) {

  const exercise =
    getExerciseById(
      exerciseId
    );


  if (!exercise) {
    return null;
  }


  return {

    id:
      exercise.id,

    name:
      exercise.name,

    category:
      exercise.category,

    equipment:
      exercise.equipment,

    recommendedView:
      exercise.view,

    metrics:
      [...exercise.metrics],

    checkpoints:
      getExerciseCheckpoints(
        exercise
      ),

    repCounter:
      exercise.analysis.repCounter,

    skeleton:
      exercise.analysis.skeleton,

    angles:
      exercise.analysis.angles,

    symmetry:
      exercise.analysis.symmetry,

    rom:
      exercise.analysis.rom,

    stability:
      exercise.analysis.stability,

    tempo:
      exercise.analysis.tempo,

    barPath:
      exercise.analysis.barPath

  };

}


/* =========================================================
   30. EXERCISE STATISTICS
========================================================= */

function getExerciseDatabaseStats() {

  const stats = {

    total:
      EXERCISES.length,

    categories: {},

    equipment: {}

  };


  EXERCISES.forEach(exercise => {

    stats.categories[
      exercise.category
    ] =
      (
        stats.categories[
          exercise.category
        ] || 0
      ) + 1;


    stats.equipment[
      exercise.equipment
    ] =
      (
        stats.equipment[
          exercise.equipment
        ] || 0
      ) + 1;

  });


  return stats;

}


/* =========================================================
   31. RANDOM EXERCISE RECOMMENDATIONS
========================================================= */

function getRelatedExercises(
  exerciseId,
  limit = 3
) {

  const current =
    getExerciseById(
      exerciseId
    );


  if (!current) {
    return [];
  }


  return EXERCISES

    .filter(exercise => {

      return (
        exercise.id !==
        current.id
      ) &&
      (
        exercise.category ===
        current.category ||
        exercise.muscles
          .split(" · ")
          .some(muscle =>
            current.muscles.includes(
              muscle
            )
          )
      );

    })

    .slice(0, limit);

}


/* =========================================================
   32. RESTORE SELECTED EXERCISE
========================================================= */

function restoreSelectedExercise() {

  const saved =
    localStorage.getItem(
      "weightLabSelectedExercise"
    );


  if (!saved) {
    return;
  }


  const exercise =
    getExerciseById(saved);


  if (!exercise) {
    return;
  }


  const select =
    exerciseDOM(
      "analysisExercise"
    );


  if (select) {

    select.value =
      exercise.id;

  }


  const title =
    exerciseDOM(
      "motionAnalysisTitle"
    );


  if (title) {

    title.textContent =
      `${exercise.name} 자세 분석`;

  }


  renderExerciseCheckpoints(
    exercise
  );

}


/* =========================================================
   33. INIT
========================================================= */

function initExerciseLibrary() {

  populateAnalysisExerciseSelect();

  populateProgramExerciseSelect();

  populateRecordExerciseFilter();


  setupExerciseCategoryEvents();

  setupExerciseSearch();

  setupEquipmentFilter();

  setupExerciseGridEvents();

  setupExerciseModalEvents();

  setupAnalysisExerciseEvent();

  setupExerciseKeyboardEvents();


  renderExerciseLibrary();

  restoreSelectedExercise();


  console.log(
    `[WEIGHT LAB] Exercise Database Loaded: ${EXERCISES.length} exercises`
  );

}


/* =========================================================
   34. GLOBAL API

   app.js에서 바로 사용 가능
========================================================= */

window.EXERCISES =
  EXERCISES;

window.EXERCISE_CATEGORY_LABELS =
  EXERCISE_CATEGORY_LABELS;

window.EXERCISE_EQUIPMENT_LABELS =
  EXERCISE_EQUIPMENT_LABELS;

window.ANALYSIS_METRIC_LABELS =
  ANALYSIS_METRIC_LABELS;

window.getExerciseById =
  getExerciseById;

window.getExerciseAnalysisConfig =
  getExerciseAnalysisConfig;

window.getExerciseDatabaseStats =
  getExerciseDatabaseStats;

window.getRelatedExercises =
  getRelatedExercises;

window.renderExerciseLibrary =
  renderExerciseLibrary;

window.goToExerciseAnalysis =
  goToExerciseAnalysis;


/* =========================================================
   35. AUTO START
========================================================= */

if (
  document.readyState ===
  "loading"
) {

  document.addEventListener(
    "DOMContentLoaded",
    initExerciseLibrary
  );

}

else {

  initExerciseLibrary();

}


/* =========================================================
   END
========================================================= */