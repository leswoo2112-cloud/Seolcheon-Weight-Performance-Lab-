/* =========================================================
   설천고 WEIGHT PERFORMANCE LAB
   EXERCISES.JS
   Exercise Database + Pictogram + Analysis Presets
========================================================= */

"use strict";

/* =========================================================
   01. CATEGORY / EQUIPMENT LABELS
========================================================= */

const EXERCISE_CATEGORY_LABELS = {
  lower: "하체",
  chest: "가슴",
  back: "등",
  shoulder: "어깨",
  arms: "팔",
  core: "코어",
  olympic: "올림픽 리프팅",
  power: "파워",
  plyometric: "플라이오메트릭",
  functional: "기능성",
  mobility: "보강 · 가동성",
  fullbody: "전신"
};

const EQUIPMENT_LABELS = {
  bodyweight: "맨몸",
  barbell: "바벨",
  dumbbell: "덤벨",
  kettlebell: "케틀벨",
  machine: "머신",
  cable: "케이블",
  band: "밴드",
  medicineball: "메디신볼",
  box: "박스",
  trx: "TRX",
  landmine: "랜드마인",
  sled: "슬레드",
  bench: "벤치",
  other: "기타"
};

const VIEW_LABELS = {
  front: "정면",
  side: "측면",
  rear: "후면",
  top: "상단"
};


/* =========================================================
   02. EXERCISE FACTORY
========================================================= */

function makeExercise(
  id,
  name,
  category,
  equipment,
  pictogram,
  muscles,
  view,
  metrics,
  description,
  checkpoints = [],
  recommendations = [],
  counter = null
) {
  return {
    id,
    name,
    category,
    equipment,
    pictogram,
    muscles,
    view,
    metrics,
    description,
    checkpoints,
    recommendations,
    counter
  };
}


/* =========================================================
   03. EXERCISE DATABASE
========================================================= */

const WEIGHT_EXERCISES = [

/* =========================================================
   LOWER BODY — BODYWEIGHT
========================================================= */

makeExercise(
  "bodyweight-squat",
  "맨몸 스쿼트",
  "lower",
  "bodyweight",
  "🏋️",
  "대퇴사두근 · 둔근 · 햄스트링 · 코어",
  "side",
  ["무릎", "고관절", "발목", "몸통", "대칭성", "ROM"],
  "기본적인 하체 움직임 패턴을 평가하는 맨몸 스쿼트입니다.",
  [
    "무릎과 발끝 방향 확인",
    "발뒤꿈치 지면 유지",
    "몸통 안정성 확인",
    "좌우 골반 높이 확인",
    "스쿼트 깊이 확인"
  ],
  [
    "Goblet Squat",
    "Tempo Squat",
    "Wall Ankle Mobility",
    "Glute Bridge",
    "Dead Bug"
  ],
  {
    joint: "knee",
    downAngle: 105,
    upAngle: 155
  }
),

makeExercise(
  "air-squat",
  "에어 스쿼트",
  "lower",
  "bodyweight",
  "🧍",
  "대퇴사두근 · 둔근 · 코어",
  "front",
  ["무릎 정렬", "대칭성", "골반 이동"],
  "정면에서 좌우 움직임과 무릎 정렬을 확인하는 스쿼트입니다.",
  [
    "좌우 무릎 이동 비교",
    "골반 중심 유지",
    "발 간격 유지"
  ],
  [
    "Mini Band Squat",
    "Single Leg Balance",
    "Lateral Band Walk"
  ],
  {
    joint: "knee",
    downAngle: 105,
    upAngle: 155
  }
),

makeExercise(
  "bodyweight-lunge",
  "맨몸 런지",
  "lower",
  "bodyweight",
  "🚶",
  "대퇴사두근 · 둔근 · 햄스트링",
  "side",
  ["앞무릎", "뒷무릎", "고관절", "몸통"],
  "기본 런지 움직임과 한쪽 다리 안정성을 분석합니다.",
  [
    "앞발 전체 지지",
    "무릎 정렬",
    "몸통 과도한 전방 이동 확인",
    "좌우 수행 비교"
  ],
  [
    "Split Squat",
    "Reverse Lunge",
    "Single Leg RDL",
    "Step Up"
  ],
  {
    joint: "knee",
    downAngle: 105,
    upAngle: 155
  }
),

makeExercise(
  "reverse-lunge",
  "리버스 런지",
  "lower",
  "bodyweight",
  "↩️",
  "둔근 · 대퇴사두근 · 햄스트링",
  "side",
  ["무릎", "고관절", "균형"],
  "뒤로 발을 이동하는 런지 패턴입니다.",
  [
    "앞발 지지 유지",
    "골반 회전 최소화",
    "몸통 중심 유지"
  ],
  [
    "Split Squat",
    "Step Up",
    "Single Leg Balance"
  ]
),

makeExercise(
  "walking-lunge",
  "워킹 런지",
  "lower",
  "bodyweight",
  "🚶",
  "둔근 · 대퇴사두근 · 햄스트링",
  "side",
  ["보폭", "무릎", "골반", "몸통"],
  "연속 이동 상황에서 하체 안정성을 분석합니다.",
  [
    "보폭 일정성",
    "좌우 균형",
    "무릎 정렬"
  ],
  [
    "Reverse Lunge",
    "Split Squat",
    "Lateral Lunge"
  ]
),

makeExercise(
  "split-squat",
  "스플릿 스쿼트",
  "lower",
  "bodyweight",
  "🦵",
  "둔근 · 대퇴사두근",
  "side",
  ["무릎", "고관절", "몸통"],
  "고정된 스플릿 자세에서 하체 근력과 안정성을 분석합니다.",
  [
    "앞무릎 정렬",
    "골반 수직 이동",
    "몸통 안정"
  ],
  [
    "Bulgarian Split Squat",
    "Reverse Lunge",
    "Step Up"
  ]
),

makeExercise(
  "lateral-lunge",
  "사이드 런지",
  "lower",
  "bodyweight",
  "↔️",
  "둔근 · 내전근 · 대퇴사두근",
  "front",
  ["무릎", "골반", "좌우 이동"],
  "측면 방향 하체 움직임을 평가합니다.",
  [
    "무릎과 발끝 방향",
    "골반 후방 이동",
    "반대쪽 다리 정렬"
  ],
  [
    "Cossack Squat",
    "Lateral Band Walk",
    "Adductor Mobility"
  ]
),

makeExercise(
  "cossack-squat",
  "코사크 스쿼트",
  "lower",
  "bodyweight",
  "↔️",
  "내전근 · 둔근 · 대퇴사두근",
  "front",
  ["고관절", "무릎", "발목", "ROM"],
  "좌우 고관절 가동성과 하체 제어를 분석합니다.",
  [
    "골반 좌우 이동",
    "발 지지",
    "무릎 정렬"
  ],
  [
    "Adductor Rock Back",
    "Lateral Lunge",
    "Ankle Mobility"
  ]
),

makeExercise(
  "single-leg-squat",
  "싱글 레그 스쿼트",
  "lower",
  "bodyweight",
  "🦵",
  "둔근 · 대퇴사두근 · 코어",
  "front",
  ["무릎 정렬", "골반", "대칭성", "균형"],
  "한발 스쿼트에서 좌우 기능 차이를 확인합니다.",
  [
    "무릎 안쪽 붕괴 확인",
    "골반 기울기 확인",
    "상체 흔들림 확인"
  ],
  [
    "Step Down",
    "Single Leg Balance",
    "Lateral Band Walk",
    "Split Squat"
  ]
),

makeExercise(
  "pistol-squat",
  "피스톨 스쿼트",
  "lower",
  "bodyweight",
  "🦵",
  "대퇴사두근 · 둔근 · 코어",
  "side",
  ["무릎", "고관절", "발목", "ROM"],
  "고난도 한발 스쿼트 동작입니다.",
  [
    "발뒤꿈치 유지",
    "몸통 제어",
    "무릎 정렬"
  ],
  [
    "Box Pistol Squat",
    "Single Leg Squat",
    "Ankle Mobility"
  ]
),

makeExercise(
  "glute-bridge",
  "글루트 브리지",
  "lower",
  "bodyweight",
  "🌉",
  "둔근 · 햄스트링",
  "side",
  ["고관절 신전", "골반"],
  "둔근 활성화와 고관절 신전 패턴을 평가합니다.",
  [
    "허리 과신전 최소화",
    "골반 수평 유지",
    "둔근 수축"
  ],
  [
    "Hip Thrust",
    "Single Leg Bridge",
    "Dead Bug"
  ]
),

makeExercise(
  "single-leg-bridge",
  "싱글 레그 브리지",
  "lower",
  "bodyweight",
  "🌉",
  "둔근 · 햄스트링 · 코어",
  "front",
  ["골반 대칭", "고관절"],
  "한쪽 둔근의 기능과 골반 안정성을 평가합니다.",
  [
    "골반 회전 확인",
    "좌우 높이 비교"
  ],
  [
    "Glute Bridge",
    "Hip Thrust",
    "Single Leg RDL"
  ]
),

makeExercise(
  "calf-raise",
  "카프 레이즈",
  "lower",
  "bodyweight",
  "🦶",
  "비복근 · 가자미근",
  "side",
  ["발목", "ROM"],
  "발목 저측굴곡 움직임과 종아리 기능을 확인합니다.",
  [
    "최대 높이",
    "발목 흔들림",
    "반복 일정성"
  ],
  [
    "Single Leg Calf Raise",
    "Ankle Mobility",
    "Tibialis Raise"
  ]
),

makeExercise(
  "single-leg-calf-raise",
  "싱글 레그 카프 레이즈",
  "lower",
  "bodyweight",
  "🦶",
  "비복근 · 가자미근",
  "rear",
  ["발목", "좌우 대칭"],
  "한발 종아리 근력과 안정성을 비교합니다.",
  [
    "발목 좌우 흔들림",
    "최대 높이",
    "좌우 반복 차이"
  ],
  [
    "Calf Raise",
    "Single Leg Balance"
  ]
),

/* =========================================================
   LOWER BODY — BARBELL
========================================================= */

makeExercise(
  "back-squat",
  "바벨 백 스쿼트",
  "lower",
  "barbell",
  "🏋️",
  "대퇴사두근 · 둔근 · 햄스트링 · 코어",
  "side",
  ["무릎", "고관절", "몸통", "발목", "바벨 궤적"],
  "바벨 백 스쿼트의 관절 각도와 바벨 궤적을 분석합니다.",
  [
    "바벨-중족부 정렬",
    "몸통 각도",
    "스쿼트 깊이",
    "무릎 이동",
    "힙 시프트"
  ],
  [
    "Tempo Squat",
    "Pause Squat",
    "Goblet Squat",
    "Ankle Mobility",
    "Core Bracing"
  ],
  {
    joint: "knee",
    downAngle: 105,
    upAngle: 160
  }
),

makeExercise(
  "front-squat",
  "프론트 스쿼트",
  "lower",
  "barbell",
  "🏋️",
  "대퇴사두근 · 둔근 · 코어",
  "side",
  ["무릎", "고관절", "몸통", "바벨 궤적"],
  "프론트 랙 자세와 스쿼트 움직임을 분석합니다.",
  [
    "팔꿈치 위치",
    "몸통 수직 유지",
    "바벨 궤적",
    "발 전체 지지"
  ],
  [
    "Goblet Squat",
    "Front Rack Mobility",
    "Pause Front Squat"
  ]
),

makeExercise(
  "box-squat",
  "박스 스쿼트",
  "lower",
  "barbell",
  "📦",
  "둔근 · 대퇴사두근 · 햄스트링",
  "side",
  ["고관절", "무릎", "몸통"],
  "박스를 이용한 스쿼트 패턴을 분석합니다.",
  [
    "후방 체중 이동",
    "몸통 제어",
    "박스 접촉 후 자세 유지"
  ],
  [
    "Back Squat",
    "Tempo Squat",
    "Hip Hinge Drill"
  ]
),

makeExercise(
  "pause-squat",
  "포즈 스쿼트",
  "lower",
  "barbell",
  "⏸️",
  "대퇴사두근 · 둔근 · 코어",
  "side",
  ["깊이", "정지 안정성", "바벨 궤적"],
  "스쿼트 하단 정지 구간의 안정성을 분석합니다.",
  [
    "하단 자세 유지",
    "바벨 흔들림",
    "상승 시작 자세"
  ],
  [
    "Tempo Squat",
    "Goblet Squat",
    "Core Bracing"
  ]
),

makeExercise(
  "tempo-squat",
  "템포 스쿼트",
  "lower",
  "barbell",
  "⏱️",
  "대퇴사두근 · 둔근 · 코어",
  "side",
  ["하강 시간", "상승 시간", "관절 각도"],
  "일정한 템포로 스쿼트 동작을 제어합니다.",
  [
    "하강 속도 일정",
    "반동 최소화",
    "상승 궤적"
  ],
  [
    "Pause Squat",
    "Bodyweight Squat",
    "Core Bracing"
  ]
),

makeExercise(
  "barbell-rdl",
  "바벨 루마니안 데드리프트",
  "lower",
  "barbell",
  "🏋️",
  "햄스트링 · 둔근 · 척추기립근",
  "side",
  ["고관절", "무릎", "몸통", "바벨 궤적"],
  "힙힌지 패턴과 햄스트링 움직임을 분석합니다.",
  [
    "바벨을 몸 가까이 유지",
    "허리 중립",
    "고관절 후방 이동",
    "무릎 각도 유지"
  ],
  [
    "Hip Hinge Drill",
    "Single Leg RDL",
    "Hamstring Mobility"
  ]
),

makeExercise(
  "deadlift",
  "컨벤셔널 데드리프트",
  "lower",
  "barbell",
  "🏋️",
  "둔근 · 햄스트링 · 등 · 코어",
  "side",
  ["고관절", "무릎", "몸통", "바벨 궤적"],
  "데드리프트 시작 자세와 상승 궤적을 분석합니다.",
  [
    "바벨과 중족부 정렬",
    "바벨 몸 가까이 유지",
    "고관절과 무릎 신전 타이밍",
    "몸통 안정"
  ],
  [
    "RDL",
    "Block Deadlift",
    "Hip Hinge Drill",
    "Core Bracing"
  ]
),

makeExercise(
  "sumo-deadlift",
  "스모 데드리프트",
  "lower",
  "barbell",
  "🏋️",
  "둔근 · 내전근 · 햄스트링",
  "front",
  ["무릎", "골반", "바벨 대칭"],
  "넓은 스탠스 데드리프트를 분석합니다.",
  [
    "무릎과 발끝 방향",
    "좌우 힘 전달",
    "바벨 중심 유지"
  ],
  [
    "Sumo RDL",
    "Adductor Mobility",
    "Goblet Squat"
  ]
),

makeExercise(
  "barbell-hip-thrust",
  "바벨 힙 쓰러스트",
  "lower",
  "barbell",
  "🏋️",
  "둔근 · 햄스트링",
  "side",
  ["고관절", "골반", "몸통"],
  "둔근 중심의 고관절 신전 운동입니다.",
  [
    "최상단 골반 위치",
    "허리 과신전 확인",
    "턱 위치 유지"
  ],
  [
    "Glute Bridge",
    "Single Leg Bridge",
    "RDL"
  ]
),

/* =========================================================
   LOWER — DUMBBELL / KETTLEBELL
========================================================= */

makeExercise(
  "goblet-squat",
  "고블릿 스쿼트",
  "lower",
  "kettlebell",
  "🏋️",
  "대퇴사두근 · 둔근 · 코어",
  "side",
  ["무릎", "고관절", "발목", "몸통"],
  "중량을 몸 앞에 들고 수행하는 스쿼트입니다.",
  [
    "몸통 안정",
    "스쿼트 깊이",
    "무릎 정렬"
  ],
  [
    "Bodyweight Squat",
    "Tempo Squat",
    "Ankle Mobility"
  ]
),

makeExercise(
  "dumbbell-lunge",
  "덤벨 런지",
  "lower",
  "dumbbell",
  "🏋️",
  "둔근 · 대퇴사두근",
  "side",
  ["무릎", "고관절", "몸통"],
  "덤벨을 들고 수행하는 런지입니다.",
  [
    "덤벨 흔들림",
    "무릎 정렬",
    "보폭"
  ],
  [
    "Bodyweight Lunge",
    "Split Squat",
    "Step Up"
  ]
),

makeExercise(
  "bulgarian-split-squat",
  "불가리안 스플릿 스쿼트",
  "lower",
  "dumbbell",
  "🦵",
  "둔근 · 대퇴사두근",
  "side",
  ["무릎", "고관절", "몸통", "균형"],
  "후방 발을 높인 한발 하체 운동입니다.",
  [
    "앞발 지지",
    "골반 정렬",
    "몸통 흔들림"
  ],
  [
    "Split Squat",
    "Single Leg Squat",
    "Step Up"
  ]
),

makeExercise(
  "step-up",
  "스텝 업",
  "lower",
  "dumbbell",
  "📦",
  "둔근 · 대퇴사두근",
  "front",
  ["무릎", "골반", "대칭성"],
  "박스 상승 동작에서 한쪽 다리의 힘 전달을 평가합니다.",
  [
    "지지측 무릎 정렬",
    "반대발 반동 최소화",
    "골반 수평"
  ],
  [
    "Split Squat",
    "Single Leg Squat",
    "Lateral Step Down"
  ]
),

makeExercise(
  "single-leg-rdl",
  "싱글 레그 RDL",
  "lower",
  "dumbbell",
  "🦵",
  "햄스트링 · 둔근 · 코어",
  "side",
  ["고관절", "몸통", "균형"],
  "한발 힙힌지와 골반 안정성을 평가합니다.",
  [
    "골반 회전 최소화",
    "몸통과 뒷다리 정렬",
    "지지발 안정"
  ],
  [
    "RDL",
    "Single Leg Balance",
    "Glute Medius Training"
  ]
),

/* =========================================================
   CHEST
========================================================= */

makeExercise(
  "push-up",
  "푸시업",
  "chest",
  "bodyweight",
  "💪",
  "대흉근 · 삼두근 · 전면삼각근 · 코어",
  "side",
  ["팔꿈치", "어깨", "몸통"],
  "기본적인 상체 밀기 패턴을 분석합니다.",
  [
    "머리-몸통-골반 정렬",
    "팔꿈치 경로",
    "가슴 하강 깊이"
  ],
  [
    "Incline Push Up",
    "Plank",
    "Scapular Push Up"
  ],
  {
    joint: "elbow",
    downAngle: 100,
    upAngle: 155
  }
),

makeExercise(
  "incline-push-up",
  "인클라인 푸시업",
  "chest",
  "bodyweight",
  "💪",
  "가슴 · 삼두근 · 코어",
  "side",
  ["팔꿈치", "몸통"],
  "상체를 높여 수행하는 푸시업입니다.",
  [
    "몸통 일직선",
    "팔꿈치 제어"
  ],
  [
    "Push Up",
    "Plank"
  ]
),

makeExercise(
  "bench-press",
  "바벨 벤치프레스",
  "chest",
  "barbell",
  "🏋️",
  "대흉근 · 삼두근 · 전면삼각근",
  "side",
  ["팔꿈치", "어깨", "바벨 궤적"],
  "벤치프레스의 바벨 이동과 상지 관절을 분석합니다.",
  [
    "바벨 하강 위치",
    "손목 정렬",
    "좌우 바벨 높이",
    "견갑 안정"
  ],
  [
    "Dumbbell Bench Press",
    "Push Up",
    "Scapular Stability"
  ],
  {
    joint: "elbow",
    downAngle: 100,
    upAngle: 155
  }
),

makeExercise(
  "incline-bench-press",
  "인클라인 벤치프레스",
  "chest",
  "barbell",
  "🏋️",
  "상부가슴 · 삼두근 · 어깨",
  "side",
  ["팔꿈치", "어깨", "바벨 궤적"],
  "인클라인 벤치에서 밀기 패턴을 분석합니다.",
  [
    "바벨 경로",
    "팔꿈치 정렬",
    "견갑 안정"
  ],
  [
    "Dumbbell Incline Press",
    "Push Up"
  ]
),

makeExercise(
  "dumbbell-bench",
  "덤벨 벤치프레스",
  "chest",
  "dumbbell",
  "🏋️",
  "가슴 · 삼두근 · 어깨",
  "front",
  ["팔꿈치", "좌우 대칭"],
  "덤벨 벤치프레스의 좌우 움직임을 비교합니다.",
  [
    "좌우 덤벨 높이",
    "팔꿈치 각도",
    "속도 대칭"
  ],
  [
    "Bench Press",
    "Push Up",
    "Single Arm Press"
  ]
),

makeExercise(
  "dumbbell-fly",
  "덤벨 플라이",
  "chest",
  "dumbbell",
  "🏋️",
  "대흉근",
  "front",
  ["어깨", "팔꿈치", "대칭성"],
  "가슴 수평 내전 움직임을 분석합니다.",
  [
    "좌우 ROM",
    "팔꿈치 각도 유지"
  ],
  [
    "Cable Fly",
    "Push Up"
  ]
),

makeExercise(
  "cable-fly",
  "케이블 플라이",
  "chest",
  "cable",
  "🔗",
  "대흉근",
  "front",
  ["어깨", "대칭성"],
  "케이블을 이용한 가슴 운동입니다.",
  [
    "좌우 손 이동",
    "몸통 흔들림"
  ],
  [
    "Dumbbell Fly",
    "Push Up"
  ]
),

/* =========================================================
   BACK
========================================================= */

makeExercise(
  "pull-up",
  "풀업",
  "back",
  "bodyweight",
  "🧗",
  "광배근 · 이두근 · 능형근",
  "front",
  ["팔꿈치", "어깨", "좌우 대칭"],
  "수직 당기기 움직임과 좌우 대칭을 분석합니다.",
  [
    "턱 높이",
    "좌우 어깨 높이",
    "몸통 흔들림"
  ],
  [
    "Lat Pulldown",
    "Scapular Pull Up",
    "Dead Hang"
  ],
  {
    joint: "elbow",
    downAngle: 155,
    upAngle: 75
  }
),

makeExercise(
  "chin-up",
  "친업",
  "back",
  "bodyweight",
  "🧗",
  "광배근 · 이두근",
  "front",
  ["팔꿈치", "어깨", "대칭성"],
  "언더그립 수직 당기기 동작입니다.",
  [
    "좌우 높이",
    "몸통 흔들림"
  ],
  [
    "Pull Up",
    "Lat Pulldown"
  ]
),

makeExercise(
  "barbell-row",
  "바벨 로우",
  "back",
  "barbell",
  "🏋️",
  "광배근 · 능형근 · 후면삼각근",
  "side",
  ["몸통", "팔꿈치", "바벨 궤적"],
  "힙힌지를 유지하며 수행하는 수평 당기기 운동입니다.",
  [
    "몸통 각도 유지",
    "바벨 경로",
    "허리 중립"
  ],
  [
    "Chest Supported Row",
    "RDL",
    "Cable Row"
  ]
),

makeExercise(
  "one-arm-db-row",
  "원암 덤벨 로우",
  "back",
  "dumbbell",
  "🏋️",
  "광배근 · 능형근",
  "side",
  ["팔꿈치", "몸통"],
  "한팔 로우 동작을 분석합니다.",
  [
    "몸통 회전 최소화",
    "팔꿈치 이동"
  ],
  [
    "Cable Row",
    "Bird Dog"
  ]
),

makeExercise(
  "lat-pulldown",
  "랫 풀다운",
  "back",
  "cable",
  "⬇️",
  "광배근 · 이두근",
  "front",
  ["팔꿈치", "어깨", "대칭성"],
  "수직 당기기 패턴을 분석합니다.",
  [
    "좌우 팔꿈치 높이",
    "몸통 과도한 후방 기울기 확인"
  ],
  [
    "Pull Up",
    "Scapular Pulldown"
  ]
),

makeExercise(
  "seated-cable-row",
  "시티드 케이블 로우",
  "back",
  "cable",
  "🔗",
  "광배근 · 능형근",
  "side",
  ["팔꿈치", "몸통"],
  "수평 당기기 동작을 분석합니다.",
  [
    "몸통 흔들림",
    "팔꿈치 경로"
  ],
  [
    "Chest Supported Row",
    "Face Pull"
  ]
),

makeExercise(
  "face-pull",
  "페이스 풀",
  "back",
  "cable",
  "🔗",
  "후면삼각근 · 회전근개",
  "front",
  ["어깨", "팔꿈치"],
  "견갑과 어깨 안정성 운동입니다.",
  [
    "팔꿈치 높이",
    "좌우 대칭"
  ],
  [
    "Band External Rotation",
    "Y Raise"
  ]
),

/* =========================================================
   SHOULDERS
========================================================= */

makeExercise(
  "overhead-press",
  "오버헤드 프레스",
  "shoulder",
  "barbell",
  "🏋️",
  "삼각근 · 삼두근 · 코어",
  "side",
  ["팔꿈치", "어깨", "몸통", "바벨 궤적"],
  "머리 위 밀기 패턴과 바벨 궤적을 분석합니다.",
  [
    "바벨 수직 이동",
    "허리 과신전 확인",
    "팔꿈치 정렬"
  ],
  [
    "Dumbbell Shoulder Press",
    "Wall Slide",
    "Core Bracing"
  ]
),

makeExercise(
  "dumbbell-shoulder-press",
  "덤벨 숄더프레스",
  "shoulder",
  "dumbbell",
  "🏋️",
  "삼각근 · 삼두근",
  "front",
  ["어깨", "팔꿈치", "대칭성"],
  "덤벨 오버헤드 프레스의 좌우 대칭을 분석합니다.",
  [
    "좌우 덤벨 높이",
    "팔꿈치 경로"
  ],
  [
    "Overhead Press",
    "Landmine Press"
  ]
),

makeExercise(
  "lateral-raise",
  "사이드 레터럴 레이즈",
  "shoulder",
  "dumbbell",
  "🪽",
  "측면삼각근",
  "front",
  ["어깨", "대칭성"],
  "어깨 외전 움직임의 좌우 대칭을 분석합니다.",
  [
    "좌우 손 높이",
    "몸통 반동"
  ],
  [
    "Cable Lateral Raise",
    "Y Raise"
  ]
),

makeExercise(
  "front-raise",
  "프론트 레이즈",
  "shoulder",
  "dumbbell",
  "⬆️",
  "전면삼각근",
  "side",
  ["어깨", "몸통"],
  "어깨 굴곡 동작을 분석합니다.",
  [
    "몸통 반동 최소화",
    "팔 높이"
  ],
  [
    "Landmine Press",
    "Wall Slide"
  ]
),

makeExercise(
  "rear-delt-fly",
  "리어 델트 플라이",
  "shoulder",
  "dumbbell",
  "🪽",
  "후면삼각근 · 능형근",
  "rear",
  ["어깨", "대칭성"],
  "후면 어깨와 견갑 움직임을 분석합니다.",
  [
    "좌우 손 높이",
    "견갑 움직임"
  ],
  [
    "Face Pull",
    "Band Pull Apart"
  ]
),

/* =========================================================
   ARMS
========================================================= */

makeExercise(
  "barbell-curl",
  "바벨 컬",
  "arms",
  "barbell",
  "💪",
  "상완이두근",
  "side",
  ["팔꿈치", "몸통"],
  "팔꿈치 굴곡과 몸통 반동을 분석합니다.",
  [
    "팔꿈치 위치",
    "몸통 반동 최소화"
  ],
  [
    "Dumbbell Curl",
    "Hammer Curl"
  ]
),

makeExercise(
  "dumbbell-curl",
  "덤벨 컬",
  "arms",
  "dumbbell",
  "💪",
  "상완이두근",
  "front",
  ["팔꿈치", "대칭성"],
  "좌우 팔꿈치 굴곡을 비교합니다.",
  [
    "좌우 ROM",
    "팔꿈치 위치"
  ],
  [
    "Hammer Curl",
    "Cable Curl"
  ]
),

makeExercise(
  "hammer-curl",
  "해머 컬",
  "arms",
  "dumbbell",
  "💪",
  "상완근 · 상완요골근",
  "front",
  ["팔꿈치", "대칭성"],
  "뉴트럴 그립 컬 동작입니다.",
  [
    "좌우 높이",
    "몸통 반동"
  ],
  [
    "Dumbbell Curl"
  ]
),

makeExercise(
  "triceps-pushdown",
  "트라이셉스 푸시다운",
  "arms",
  "cable",
  "⬇️",
  "상완삼두근",
  "side",
  ["팔꿈치"],
  "팔꿈치 신전 움직임을 분석합니다.",
  [
    "팔꿈치 위치 고정",
    "몸통 흔들림"
  ],
  [
    "Close Grip Push Up"
  ]
),

makeExercise(
  "dips",
  "딥스",
  "arms",
  "bodyweight",
  "💪",
  "삼두근 · 가슴 · 전면삼각근",
  "side",
  ["팔꿈치", "어깨", "몸통"],
  "체중을 이용한 상체 밀기 운동입니다.",
  [
    "어깨 깊이",
    "팔꿈치 경로",
    "몸통 제어"
  ],
  [
    "Push Up",
    "Bench Press"
  ]
),

/* =========================================================
   CORE
========================================================= */

makeExercise(
  "plank",
  "플랭크",
  "core",
  "bodyweight",
  "🧱",
  "복횡근 · 복직근 · 둔근",
  "side",
  ["몸통", "골반", "어깨"],
  "정적 코어 안정성을 평가합니다.",
  [
    "머리-등-골반 정렬",
    "골반 처짐 확인",
    "어깨 위치"
  ],
  [
    "Dead Bug",
    "Bird Dog",
    "Side Plank"
  ]
),

makeExercise(
  "side-plank",
  "사이드 플랭크",
  "core",
  "bodyweight",
  "🧱",
  "복사근 · 중둔근",
  "front",
  ["몸통", "골반"],
  "측면 코어 안정성을 분석합니다.",
  [
    "골반 높이",
    "몸통 정렬"
  ],
  [
    "Pallof Press",
    "Suitcase Carry"
  ]
),

makeExercise(
  "dead-bug",
  "데드 버그",
  "core",
  "bodyweight",
  "🐞",
  "심부 코어",
  "top",
  ["골반", "대측 협응"],
  "팔다리 움직임 중 몸통 안정성을 분석합니다.",
  [
    "허리 중립 유지",
    "대측 움직임"
  ],
  [
    "Bird Dog",
    "Plank"
  ]
),

makeExercise(
  "bird-dog",
  "버드독",
  "core",
  "bodyweight",
  "🐕",
  "코어 · 둔근 · 척추 안정근",
  "side",
  ["몸통", "골반"],
  "네발 자세에서 대측 팔다리 제어를 분석합니다.",
  [
    "골반 회전 최소화",
    "허리 중립"
  ],
  [
    "Dead Bug",
    "Pallof Press"
  ]
),

makeExercise(
  "hollow-hold",
  "할로우 홀드",
  "core",
  "bodyweight",
  "🛡️",
  "복직근 · 심부코어",
  "side",
  ["몸통", "골반"],
  "체간 전면 안정성을 평가합니다.",
  [
    "허리 바닥 유지",
    "갈비뼈 제어"
  ],
  [
    "Dead Bug",
    "Plank"
  ]
),

makeExercise(
  "pallof-press",
  "팔로프 프레스",
  "core",
  "cable",
  "↔️",
  "복사근 · 심부코어",
  "front",
  ["몸통 회전", "골반"],
  "회전 저항 능력을 분석합니다.",
  [
    "몸통 회전 최소화",
    "골반 정면 유지"
  ],
  [
    "Side Plank",
    "Suitcase Carry"
  ]
),

makeExercise(
  "russian-twist",
  "러시안 트위스트",
  "core",
  "medicineball",
  "🔄",
  "복사근 · 코어",
  "front",
  ["몸통 회전", "대칭성"],
  "체간 회전 움직임을 분석합니다.",
  [
    "좌우 회전 범위",
    "골반 안정"
  ],
  [
    "Pallof Press",
    "Dead Bug"
  ]
),

/* =========================================================
   OLYMPIC LIFTING
========================================================= */

makeExercise(
  "power-clean",
  "파워 클린",
  "olympic",
  "barbell",
  "🏋️",
  "둔근 · 햄스트링 · 대퇴사두근 · 승모근",
  "side",
  ["무릎", "고관절", "몸통", "바벨 궤적", "캐치"],
  "폭발적인 바벨 가속과 캐치 동작을 분석합니다.",
  [
    "1차 당기기",
    "무릎 재진입",
    "고관절 폭발",
    "바벨 몸 가까이 유지",
    "캐치 안정성"
  ],
  [
    "Clean Pull",
    "Hang Power Clean",
    "Front Squat",
    "Jump Shrug"
  ]
),

makeExercise(
  "hang-power-clean",
  "행 파워 클린",
  "olympic",
  "barbell",
  "🏋️",
  "둔근 · 햄스트링 · 승모근",
  "side",
  ["고관절", "무릎", "바벨 궤적", "캐치"],
  "행 포지션에서 폭발적인 클린 동작을 분석합니다.",
  [
    "행 시작 자세",
    "고관절 신전",
    "바벨 수직 궤적",
    "캐치"
  ],
  [
    "Clean Pull",
    "Jump Shrug",
    "Front Squat"
  ]
),

makeExercise(
  "clean-pull",
  "클린 풀",
  "olympic",
  "barbell",
  "⬆️",
  "후면사슬 · 승모근",
  "side",
  ["바벨 궤적", "고관절", "무릎"],
  "클린 당기기 구간의 바벨 움직임을 분석합니다.",
  [
    "바벨 몸 가까이 유지",
    "고관절 신전 타이밍"
  ],
  [
    "Power Clean",
    "RDL",
    "Jump Shrug"
  ]
),

makeExercise(
  "power-snatch",
  "파워 스내치",
  "olympic",
  "barbell",
  "🏋️",
  "전신 · 어깨 · 후면사슬",
  "side",
  ["바벨 궤적", "고관절", "무릎", "캐치"],
  "스내치의 폭발적 당기기와 오버헤드 캐치를 분석합니다.",
  [
    "바벨 경로",
    "고관절 폭발",
    "오버헤드 안정"
  ],
  [
    "Snatch Pull",
    "Overhead Squat",
    "Snatch Balance"
  ]
),

makeExercise(
  "hang-snatch",
  "행 파워 스내치",
  "olympic",
  "barbell",
  "🏋️",
  "전신 · 어깨 · 둔근",
  "side",
  ["고관절", "바벨 궤적", "캐치"],
  "행 포지션 스내치 동작을 분석합니다.",
  [
    "고관절 신전",
    "바벨 수직 이동",
    "캐치 안정"
  ],
  [
    "Snatch Pull",
    "Overhead Squat"
  ]
),

makeExercise(
  "overhead-squat",
  "오버헤드 스쿼트",
  "olympic",
  "barbell",
  "🏋️",
  "하체 · 어깨 · 코어",
  "side",
  ["어깨", "몸통", "고관절", "무릎", "발목"],
  "오버헤드 안정성과 전신 가동성을 분석합니다.",
  [
    "바벨 중족부 정렬",
    "어깨 안정",
    "몸통 수직성",
    "스쿼트 깊이"
  ],
  [
    "Wall Squat",
    "Shoulder Mobility",
    "Ankle Mobility"
  ]
),

makeExercise(
  "push-press",
  "푸시 프레스",
  "power",
  "barbell",
  "🏋️",
  "하체 · 어깨 · 삼두근",
  "side",
  ["무릎", "고관절", "바벨 궤적"],
  "하체 드라이브를 이용한 오버헤드 파워 동작입니다.",
  [
    "딥 깊이",
    "하체-상체 타이밍",
    "바벨 수직 궤적"
  ],
  [
    "Overhead Press",
    "Push Jerk",
    "Jump Squat"
  ]
),

makeExercise(
  "push-jerk",
  "푸시 저크",
  "olympic",
  "barbell",
  "🏋️",
  "전신 · 어깨 · 하체",
  "side",
  ["딥", "드라이브", "캐치", "바벨 궤적"],
  "하체 드라이브와 오버헤드 캐치를 분석합니다.",
  [
    "딥 수직성",
    "드라이브 타이밍",
    "캐치 안정"
  ],
  [
    "Push Press",
    "Jerk Dip",
    "Overhead Stability"
  ]
),

/* =========================================================
   POWER
========================================================= */

makeExercise(
  "kettlebell-swing",
  "케틀벨 스윙",
  "power",
  "kettlebell",
  "🏋️",
  "둔근 · 햄스트링 · 코어",
  "side",
  ["고관절", "무릎", "몸통"],
  "폭발적인 힙힌지 파워를 분석합니다.",
  [
    "스쿼트가 아닌 힙힌지",
    "고관절 신전",
    "허리 중립"
  ],
  [
    "RDL",
    "Hip Hinge Drill",
    "Broad Jump"
  ]
),

makeExercise(
  "jump-squat",
  "점프 스쿼트",
  "power",
  "bodyweight",
  "🚀",
  "둔근 · 대퇴사두근 · 종아리",
  "side",
  ["무릎", "고관절", "점프 높이", "착지"],
  "수직 점프 파워와 착지 패턴을 분석합니다.",
  [
    "카운터무브먼트",
    "완전 신전",
    "착지 충격 제어"
  ],
  [
    "Countermovement Jump",
    "Snap Down",
    "Squat"
  ]
),

makeExercise(
  "medicine-ball-slam",
  "메디신볼 슬램",
  "power",
  "medicineball",
  "🏐",
  "광배근 · 코어 · 어깨",
  "side",
  ["어깨", "몸통", "고관절"],
  "전신 굴곡을 이용한 폭발적 슬램 동작입니다.",
  [
    "오버헤드 시작",
    "몸통-고관절 협응"
  ],
  [
    "Overhead Throw",
    "Dead Bug"
  ]
),

makeExercise(
  "medicine-ball-chest-pass",
  "메디신볼 체스트 패스",
  "power",
  "medicineball",
  "🏐",
  "가슴 · 삼두근 · 코어",
  "side",
  ["팔꿈치", "몸통"],
  "상체 수평 파워를 분석합니다.",
  [
    "양팔 대칭",
    "몸통 힘 전달"
  ],
  [
    "Push Up",
    "Bench Press"
  ]
),

makeExercise(
  "rotational-med-ball-throw",
  "회전 메디신볼 스로우",
  "power",
  "medicineball",
  "🏐",
  "코어 · 둔근 · 어깨",
  "front",
  ["몸통 회전", "골반 회전"],
  "회전 파워와 상하체 연결을 분석합니다.",
  [
    "골반 선행",
    "몸통 회전",
    "발 회전"
  ],
  [
    "Pallof Press",
    "Cable Rotation"
  ]
),

/* =========================================================
   PLYOMETRIC
========================================================= */

makeExercise(
  "countermovement-jump",
  "카운터무브먼트 점프",
  "plyometric",
  "bodyweight",
  "⬆️",
  "하체 전반",
  "side",
  ["점프 높이", "무릎", "고관절", "착지"],
  "기본적인 수직 점프 능력을 평가합니다.",
  [
    "하강 깊이",
    "이륙 타이밍",
    "착지 안정"
  ],
  [
    "Jump Squat",
    "Snap Down",
    "Calf Raise"
  ]
),

makeExercise(
  "squat-jump",
  "스쿼트 점프",
  "plyometric",
  "bodyweight",
  "⬆️",
  "대퇴사두근 · 둔근 · 종아리",
  "side",
  ["점프 높이", "이륙"],
  "정적 스쿼트 자세에서 수직 파워를 평가합니다.",
  [
    "시작 깊이 일정",
    "이륙 시 완전 신전"
  ],
  [
    "Countermovement Jump",
    "Jump Squat"
  ]
),

makeExercise(
  "box-jump",
  "박스 점프",
  "plyometric",
  "box",
  "📦",
  "하체 전반",
  "side",
  ["이륙", "무릎", "착지"],
  "박스로 점프하는 폭발력 동작입니다.",
  [
    "양발 이륙",
    "부드러운 착지",
    "무릎 정렬"
  ],
  [
    "Countermovement Jump",
    "Snap Down"
  ]
),

makeExercise(
  "broad-jump",
  "제자리 멀리뛰기",
  "plyometric",
  "bodyweight",
  "➡️",
  "둔근 · 햄스트링 · 대퇴사두근",
  "side",
  ["이륙각", "고관절", "착지"],
  "수평 방향 폭발력을 분석합니다.",
  [
    "팔 스윙",
    "완전 신전",
    "착지 안정"
  ],
  [
    "Kettlebell Swing",
    "Jump Squat"
  ]
),

makeExercise(
  "depth-jump",
  "뎁스 점프",
  "plyometric",
  "box",
  "⬇️",
  "하체 전반",
  "side",
  ["접지시간", "무릎", "점프"],
  "착지 후 빠르게 재도약하는 반응성 동작을 평가합니다.",
  [
    "착지 제어",
    "짧은 접지",
    "무릎 정렬"
  ],
  [
    "Pogo Jump",
    "Snap Down",
    "Box Jump"
  ]
),

makeExercise(
  "pogo-jump",
  "포고 점프",
  "plyometric",
  "bodyweight",
  "⬆️",
  "종아리 · 발목",
  "side",
  ["발목", "접지시간"],
  "발목 중심의 빠른 탄성 움직임을 분석합니다.",
  [
    "짧은 접지",
    "무릎 움직임 최소화"
  ],
  [
    "Calf Raise",
    "Jump Rope"
  ]
),

makeExercise(
  "lateral-bound",
  "라테럴 바운드",
  "plyometric",
  "bodyweight",
  "↔️",
  "둔근 · 대퇴사두근 · 중둔근",
  "front",
  ["좌우 거리", "무릎", "착지"],
  "측면 폭발력과 한발 착지 안정성을 분석합니다.",
  [
    "무릎 정렬",
    "착지 후 골반 안정"
  ],
  [
    "Single Leg Balance",
    "Lateral Lunge"
  ]
),

makeExercise(
  "single-leg-hop",
  "싱글 레그 홉",
  "plyometric",
  "bodyweight",
  "🦵",
  "하체 · 발목",
  "side",
  ["거리", "착지", "무릎"],
  "한발 점프 능력과 착지 안정성을 평가합니다.",
  [
    "무릎 정렬",
    "착지 유지",
    "골반 안정"
  ],
  [
    "Single Leg Balance",
    "Step Down"
  ]
),

/* =========================================================
   FUNCTIONAL
========================================================= */

makeExercise(
  "farmers-carry",
  "파머스 캐리",
  "functional",
  "dumbbell",
  "🚶",
  "전신 · 코어 · 전완",
  "front",
  ["몸통", "골반", "보행 대칭"],
  "중량을 들고 걷는 동안 체간 안정성을 분석합니다.",
  [
    "좌우 어깨 높이",
    "몸통 기울기",
    "보폭"
  ],
  [
    "Suitcase Carry",
    "Plank"
  ]
),

makeExercise(
  "suitcase-carry",
  "수트케이스 캐리",
  "functional",
  "dumbbell",
  "🧳",
  "코어 · 전완 · 중둔근",
  "front",
  ["몸통 기울기", "골반"],
  "한쪽 중량에 저항하는 체간 안정성을 분석합니다.",
  [
    "몸통 측굴 최소화",
    "골반 수평"
  ],
  [
    "Side Plank",
    "Pallof Press"
  ]
),

makeExercise(
  "sled-push",
  "슬레드 푸시",
  "functional",
  "sled",
  "➡️",
  "둔근 · 대퇴사두근 · 종아리",
  "side",
  ["몸통", "무릎", "고관절"],
  "슬레드를 미는 가속 패턴을 분석합니다.",
  [
    "몸통 각도",
    "발 접지 위치",
    "고관절 신전"
  ],
  [
    "Walking Lunge",
    "Calf Raise",
    "Plank"
  ]
),

makeExercise(
  "bear-crawl",
  "베어 크롤",
  "functional",
  "bodyweight",
  "🐻",
  "코어 · 어깨 · 고관절",
  "top",
  ["골반", "어깨", "대측 협응"],
  "네발 이동 중 코어와 사지 협응을 분석합니다.",
  [
    "골반 흔들림",
    "대측 움직임",
    "무릎 높이"
  ],
  [
    "Bird Dog",
    "Dead Bug"
  ]
),

makeExercise(
  "turkish-get-up",
  "터키시 겟업",
  "functional",
  "kettlebell",
  "🏋️",
  "전신 · 어깨 · 코어",
  "side",
  ["어깨", "고관절", "몸통"],
  "다단계 전신 안정성 움직임을 분석합니다.",
  [
    "중량 수직 유지",
    "어깨 안정",
    "단계별 자세"
  ],
  [
    "Half Kneeling Press",
    "Windmill",
    "Side Plank"
  ]
),

makeExercise(
  "battle-rope",
  "배틀로프",
  "functional",
  "other",
  "〰️",
  "어깨 · 팔 · 코어",
  "front",
  ["좌우 대칭", "몸통"],
  "반복적인 상체 파워와 좌우 대칭을 분석합니다.",
  [
    "좌우 파동 높이",
    "몸통 안정"
  ],
  [
    "Plank",
    "Shoulder Press"
  ]
),

/* =========================================================
   MOBILITY / CORRECTIVE
========================================================= */

makeExercise(
  "ankle-mobility",
  "발목 가동성 드릴",
  "mobility",
  "bodyweight",
  "🦶",
  "발목",
  "side",
  ["발목 ROM", "무릎 이동"],
  "발목 배측굴곡 가동범위를 확인합니다.",
  [
    "뒤꿈치 지면 유지",
    "무릎 전방 이동"
  ],
  [
    "Calf Stretch",
    "Tibialis Raise"
  ]
),

makeExercise(
  "hip-90-90",
  "90/90 힙 모빌리티",
  "mobility",
  "bodyweight",
  "🧘",
  "고관절",
  "front",
  ["고관절 회전", "대칭성"],
  "고관절 내외회전 가동성을 확인합니다.",
  [
    "좌우 ROM 비교",
    "몸통 보상 최소화"
  ],
  [
    "Hip Airplane",
    "Adductor Mobility"
  ]
),

makeExercise(
  "wall-slide",
  "월 슬라이드",
  "mobility",
  "bodyweight",
  "🧱",
  "어깨 · 견갑",
  "rear",
  ["어깨", "견갑 대칭"],
  "오버헤드 어깨 가동성과 견갑 움직임을 확인합니다.",
  [
    "허리 과신전 최소화",
    "좌우 팔 높이"
  ],
  [
    "Band Pull Apart",
    "Face Pull"
  ]
),

makeExercise(
  "band-pull-apart",
  "밴드 풀 어파트",
  "mobility",
  "band",
  "↔️",
  "후면삼각근 · 견갑",
  "front",
  ["어깨", "대칭성"],
  "견갑 후인과 어깨 안정성을 강화합니다.",
  [
    "좌우 대칭",
    "어깨 으쓱 최소화"
  ],
  [
    "Face Pull",
    "Wall Slide"
  ]
),

makeExercise(
  "band-external-rotation",
  "밴드 외회전",
  "mobility",
  "band",
  "🔄",
  "회전근개",
  "front",
  ["어깨 외회전", "대칭성"],
  "회전근개 기능을 보강합니다.",
  [
    "팔꿈치 고정",
    "좌우 ROM"
  ],
  [
    "Face Pull",
    "Wall Slide"
  ]
),

makeExercise(
  "hip-airplane",
  "힙 에어플레인",
  "mobility",
  "bodyweight",
  "✈️",
  "둔근 · 고관절 · 코어",
  "rear",
  ["골반 회전", "균형"],
  "한발 상태에서 고관절 회전 제어를 평가합니다.",
  [
    "지지 무릎 정렬",
    "골반 회전 제어"
  ],
  [
    "Single Leg RDL",
    "Single Leg Balance"
  ]
),

/* =========================================================
   FULL BODY
========================================================= */

makeExercise(
  "burpee",
  "버피",
  "fullbody",
  "bodyweight",
  "🔥",
  "전신",
  "side",
  ["몸통", "고관절", "무릎", "템포"],
  "스쿼트·플랭크·점프가 연결되는 전신 운동입니다.",
  [
    "플랭크 자세",
    "발 착지 위치",
    "점프 자세"
  ],
  [
    "Squat",
    "Push Up",
    "Plank"
  ]
),

makeExercise(
  "thruster",
  "덤벨 스러스터",
  "fullbody",
  "dumbbell",
  "🚀",
  "하체 · 어깨 · 코어",
  "side",
  ["무릎", "고관절", "어깨", "타이밍"],
  "스쿼트와 오버헤드 프레스를 연결한 전신 운동입니다.",
  [
    "스쿼트 깊이",
    "하체-상체 연결",
    "오버헤드 안정"
  ],
  [
    "Goblet Squat",
    "Shoulder Press",
    "Push Press"
  ]
),

makeExercise(
  "devils-press",
  "데빌 프레스",
  "fullbody",
  "dumbbell",
  "🔥",
  "전신",
  "side",
  ["고관절", "어깨", "몸통"],
  "버피와 덤벨 오버헤드 동작이 결합된 전신 운동입니다.",
  [
    "허리 중립",
    "힙 드라이브",
    "오버헤드 안정"
  ],
  [
    "Burpee",
    "Kettlebell Swing",
    "Shoulder Press"
  ]
)

];


/* =========================================================
   04. EXTRA EXERCISES

   기본 DB에 추가로 넣을 종목
========================================================= */

const EXTRA_EXERCISES = [

makeExercise(
  "wall-sit",
  "월 싯",
  "lower",
  "bodyweight",
  "🧱",
  "대퇴사두근 · 둔근",
  "side",
  ["무릎", "고관절"],
  "벽을 이용한 정적 하체 근지구력 운동입니다."
),

makeExercise(
  "step-down",
  "스텝 다운",
  "lower",
  "bodyweight",
  "📦",
  "둔근 · 대퇴사두근",
  "front",
  ["무릎 정렬", "골반"],
  "한발 하강 동작에서 무릎과 골반 제어를 분석합니다."
),

makeExercise(
  "lateral-step-up",
  "라테럴 스텝 업",
  "lower",
  "dumbbell",
  "📦",
  "중둔근 · 대퇴사두근",
  "front",
  ["무릎", "골반"],
  "측면 방향 스텝 업입니다."
),

makeExercise(
  "good-morning",
  "굿모닝",
  "lower",
  "barbell",
  "🏋️",
  "햄스트링 · 둔근 · 척추기립근",
  "side",
  ["고관절", "몸통"],
  "바벨을 이용한 힙힌지 운동입니다."
),

makeExercise(
  "leg-press",
  "레그 프레스",
  "lower",
  "machine",
  "🦵",
  "대퇴사두근 · 둔근",
  "side",
  ["무릎", "고관절"],
  "머신 하체 밀기 운동입니다."
),

makeExercise(
  "leg-extension",
  "레그 익스텐션",
  "lower",
  "machine",
  "🦵",
  "대퇴사두근",
  "side",
  ["무릎"],
  "무릎 신전 운동입니다."
),

makeExercise(
  "leg-curl",
  "레그 컬",
  "lower",
  "machine",
  "🦵",
  "햄스트링",
  "side",
  ["무릎"],
  "무릎 굴곡을 통한 햄스트링 운동입니다."
),

makeExercise(
  "hack-squat",
  "핵 스쿼트",
  "lower",
  "machine",
  "🏋️",
  "대퇴사두근 · 둔근",
  "side",
  ["무릎", "고관절"],
  "머신을 이용한 스쿼트 운동입니다."
),

makeExercise(
  "chest-press",
  "체스트 프레스",
  "chest",
  "machine",
  "💪",
  "가슴 · 삼두근",
  "side",
  ["팔꿈치", "어깨"],
  "머신을 이용한 가슴 밀기 운동입니다."
),

makeExercise(
  "pec-deck",
  "펙덱 플라이",
  "chest",
  "machine",
  "🪽",
  "대흉근",
  "front",
  ["어깨", "대칭성"],
  "머신 가슴 플라이 운동입니다."
),

makeExercise(
  "machine-row",
  "머신 로우",
  "back",
  "machine",
  "⬅️",
  "광배근 · 능형근",
  "side",
  ["팔꿈치", "어깨"],
  "머신 수평 당기기 운동입니다."
),

makeExercise(
  "straight-arm-pulldown",
  "스트레이트 암 풀다운",
  "back",
  "cable",
  "⬇️",
  "광배근",
  "side",
  ["어깨"],
  "팔꿈치 움직임을 최소화한 광배근 운동입니다."
),

makeExercise(
  "shrug",
  "바벨 슈러그",
  "back",
  "barbell",
  "⬆️",
  "승모근",
  "front",
  ["어깨 높이", "대칭성"],
  "승모근을 이용한 견갑 상승 운동입니다."
),

makeExercise(
  "arnold-press",
  "아놀드 프레스",
  "shoulder",
  "dumbbell",
  "🔄",
  "삼각근",
  "front",
  ["어깨", "팔꿈치"],
  "회전 동작을 포함한 덤벨 숄더프레스입니다."
),

makeExercise(
  "upright-row",
  "업라이트 로우",
  "shoulder",
  "barbell",
  "⬆️",
  "삼각근 · 승모근",
  "front",
  ["팔꿈치", "어깨"],
  "바벨을 수직으로 당기는 상체 운동입니다."
),

makeExercise(
  "close-grip-bench",
  "클로즈그립 벤치프레스",
  "arms",
  "barbell",
  "🏋️",
  "삼두근 · 가슴",
  "side",
  ["팔꿈치", "바벨 궤적"],
  "삼두근 비중이 높은 벤치프레스입니다."
),

makeExercise(
  "skull-crusher",
  "스컬 크러셔",
  "arms",
  "barbell",
  "💪",
  "삼두근",
  "side",
  ["팔꿈치"],
  "누운 자세의 팔꿈치 신전 운동입니다."
),

makeExercise(
  "hanging-knee-raise",
  "행잉 니 레이즈",
  "core",
  "bodyweight",
  "⬆️",
  "복근 · 고관절굴곡근",
  "side",
  ["고관절", "몸통"],
  "매달린 자세에서 무릎을 들어올리는 코어 운동입니다."
),

makeExercise(
  "hanging-leg-raise",
  "행잉 레그 레이즈",
  "core",
  "bodyweight",
  "⬆️",
  "복근 · 고관절굴곡근",
  "side",
  ["고관절", "몸통"],
  "매달린 자세의 다리 들기 운동입니다."
),

makeExercise(
  "ab-wheel",
  "AB 휠 롤아웃",
  "core",
  "other",
  "🛞",
  "복근 · 광배근 · 어깨",
  "side",
  ["몸통", "어깨", "고관절"],
  "전방으로 몸을 뻗으며 코어를 제어합니다."
),

makeExercise(
  "mountain-climber",
  "마운틴 클라이머",
  "core",
  "bodyweight",
  "⛰️",
  "코어 · 고관절굴곡근",
  "side",
  ["몸통", "고관절", "템포"],
  "플랭크 자세에서 반복적인 무릎 드라이브를 수행합니다."
),

makeExercise(
  "clean-and-jerk",
  "클린 앤 저크",
  "olympic",
  "barbell",
  "🏋️",
  "전신",
  "side",
  ["바벨 궤적", "캐치", "저크"],
  "클린과 저크가 연결되는 올림픽 리프팅 동작입니다."
),

makeExercise(
  "snatch",
  "스내치",
  "olympic",
  "barbell",
  "🏋️",
  "전신",
  "side",
  ["바벨 궤적", "고관절", "캐치"],
  "바벨을 한 동작으로 머리 위까지 들어올립니다."
),

makeExercise(
  "high-pull",
  "하이 풀",
  "power",
  "barbell",
  "⬆️",
  "후면사슬 · 승모근",
  "side",
  ["고관절", "팔꿈치", "바벨 궤적"],
  "폭발적인 고관절 신전 후 바벨을 당기는 운동입니다."
),

makeExercise(
  "jump-shrug",
  "점프 슈러그",
  "power",
  "barbell",
  "🚀",
  "둔근 · 종아리 · 승모근",
  "side",
  ["고관절", "무릎", "바벨 궤적"],
  "클린 파워 향상을 위한 폭발적 당기기 드릴입니다."
),

makeExercise(
  "tuck-jump",
  "턱 점프",
  "plyometric",
  "bodyweight",
  "🚀",
  "하체",
  "side",
  ["점프 높이", "무릎", "착지"],
  "점프 중 무릎을 빠르게 들어올리는 플라이오 운동입니다."
),

makeExercise(
  "split-jump",
  "스플릿 점프",
  "plyometric",
  "bodyweight",
  "🦵",
  "하체",
  "side",
  ["무릎", "착지", "대칭성"],
  "런지 자세에서 다리를 교환하며 점프합니다."
),

makeExercise(
  "skater-jump",
  "스케이터 점프",
  "plyometric",
  "bodyweight",
  "⛸️",
  "중둔근 · 둔근 · 하체",
  "front",
  ["좌우 거리", "착지", "골반"],
  "좌우 방향으로 이동하는 측면 플라이오 운동입니다."
),

makeExercise(
  "jump-rope",
  "줄넘기",
  "plyometric",
  "other",
  "➰",
  "종아리 · 발목",
  "front",
  ["접지", "리듬", "대칭성"],
  "반복적인 짧은 접지 능력을 평가합니다."
),

makeExercise(
  "inchworm",
  "인치웜",
  "functional",
  "bodyweight",
  "🐛",
  "코어 · 햄스트링 · 어깨",
  "side",
  ["몸통", "고관절", "어깨"],
  "전신 가동성과 코어를 연결하는 맨몸 운동입니다."
),

makeExercise(
  "crab-walk",
  "크랩 워크",
  "functional",
  "bodyweight",
  "🦀",
  "어깨 · 둔근 · 코어",
  "side",
  ["골반", "어깨"],
  "후방 지지 자세에서 이동하는 전신 운동입니다."
),

makeExercise(
  "band-lateral-walk",
  "밴드 라테럴 워크",
  "mobility",
  "band",
  "↔️",
  "중둔근",
  "front",
  ["무릎", "골반"],
  "중둔근 활성화와 무릎 정렬 보강 운동입니다."
),

makeExercise(
  "tibialis-raise",
  "티비얼리스 레이즈",
  "mobility",
  "bodyweight",
  "🦶",
  "전경골근",
  "side",
  ["발목"],
  "발목 배측굴곡 근력을 강화합니다."
),

makeExercise(
  "adductor-rockback",
  "내전근 락백",
  "mobility",
  "bodyweight",
  "🧘",
  "내전근 · 고관절",
  "side",
  ["고관절 ROM"],
  "내전근과 고관절 가동성을 위한 드릴입니다."
),

makeExercise(
  "worlds-greatest-stretch",
  "월드 그레이티스트 스트레치",
  "mobility",
  "bodyweight",
  "🧘",
  "고관절 · 흉추 · 햄스트링",
  "side",
  ["고관절", "몸통 회전"],
  "전신 가동성을 위한 복합 모빌리티 드릴입니다."
)

];

WEIGHT_EXERCISES.push(...EXTRA_EXERCISES);


/* =========================================================
   05. UTILITY
========================================================= */

function getExerciseById(id) {
  return WEIGHT_EXERCISES.find(exercise => exercise.id === id);
}

function getExerciseName(id) {
  return getExerciseById(id)?.name || id || "-";
}

function getCategoryLabel(category) {
  return EXERCISE_CATEGORY_LABELS[category] || category;
}

function getEquipmentLabel(equipment) {
  return EQUIPMENT_LABELS[equipment] || equipment;
}

function getViewLabel(view) {
  return VIEW_LABELS[view] || view;
}


/* =========================================================
   06. STATE
========================================================= */

let currentExerciseCategory = "all";
let currentExerciseEquipment = "all";
let currentExerciseSearch = "";
let currentExerciseFavoritesOnly = false;
let selectedExerciseId = null;

function getExerciseFavorites() {
  try {
    return JSON.parse(
      localStorage.getItem("weightLabExerciseFavorites") || "[]"
    );
  } catch {
    return [];
  }
}

function saveExerciseFavorites(list) {
  localStorage.setItem(
    "weightLabExerciseFavorites",
    JSON.stringify(list)
  );
}

function isFavoriteExercise(id) {
  return getExerciseFavorites().includes(id);
}

function toggleExerciseFavorite(id) {

  let favorites = getExerciseFavorites();

  if (favorites.includes(id)) {
    favorites = favorites.filter(item => item !== id);
  } else {
    favorites.push(id);
  }

  saveExerciseFavorites(favorites);

  renderExerciseLibrary();

  if (selectedExerciseId === id) {
    updateModalFavoriteButton(id);
  }
}


/* =========================================================
   07. RENDER EXERCISE LIBRARY
========================================================= */

function renderExerciseLibrary() {

  const grid = document.getElementById("exerciseGrid");
  const count = document.getElementById("exerciseTotalCount");

  if (!grid) return;

  const searchText =
    currentExerciseSearch
      .trim()
      .toLowerCase();

  let filtered = WEIGHT_EXERCISES.filter(exercise => {

    const categoryMatch =
      currentExerciseCategory === "all" ||
      exercise.category === currentExerciseCategory;

    const equipmentMatch =
      currentExerciseEquipment === "all" ||
      exercise.equipment === currentExerciseEquipment;

    const searchMatch =
      !searchText ||
      exercise.name.toLowerCase().includes(searchText) ||
      exercise.muscles.toLowerCase().includes(searchText) ||
      exercise.description.toLowerCase().includes(searchText) ||
      getCategoryLabel(exercise.category)
        .toLowerCase()
        .includes(searchText);

    const favoriteMatch =
      !currentExerciseFavoritesOnly ||
      isFavoriteExercise(exercise.id);

    return (
      categoryMatch &&
      equipmentMatch &&
      searchMatch &&
      favoriteMatch
    );
  });

  if (count) {
    count.textContent = filtered.length;
  }

  if (!filtered.length) {

    grid.innerHTML = `
      <div class="empty-state">
        조건에 맞는 운동이 없습니다.
      </div>
    `;

    return;
  }

  grid.innerHTML = filtered
    .map(exercise => {

      const favorite =
        isFavoriteExercise(exercise.id);

      return `
        <article
          class="exercise-card"
          data-exercise-id="${exercise.id}"
        >

          <button
            class="favorite-button"
            type="button"
            data-favorite-exercise="${exercise.id}"
            title="즐겨찾기"
          >
            ${favorite ? "★" : "☆"}
          </button>

          <div class="exercise-pictogram">
            ${exercise.pictogram}
          </div>

          <span class="eyebrow">
            ${getCategoryLabel(exercise.category)}
          </span>

          <h3>
            ${exercise.name}
          </h3>

          <p>
            ${exercise.muscles}
          </p>

          <div class="exercise-meta">

            <span class="exercise-tag">
              ${getEquipmentLabel(exercise.equipment)}
            </span>

            <span class="exercise-tag">
              ${getViewLabel(exercise.view)} 분석
            </span>

            ${
              exercise.counter
                ? `
                <span class="exercise-tag">
                  REP AI
                </span>
                `
                : ""
            }

          </div>

        </article>
      `;
    })
    .join("");

  bindExerciseCards();
}


/* =========================================================
   08. CARD EVENTS
========================================================= */

function bindExerciseCards() {

  document
    .querySelectorAll(".exercise-card")
    .forEach(card => {

      card.addEventListener("click", event => {

        if (
          event.target.closest(
            "[data-favorite-exercise]"
          )
        ) {
          return;
        }

        const id =
          card.dataset.exerciseId;

        openExerciseModal(id);

      });

    });

  document
    .querySelectorAll("[data-favorite-exercise]")
    .forEach(button => {

      button.addEventListener("click", event => {

        event.stopPropagation();

        toggleExerciseFavorite(
          button.dataset.favoriteExercise
        );

      });

    });
}


/* =========================================================
   09. MODAL
========================================================= */

function openExerciseModal(id) {

  const exercise = getExerciseById(id);
  const modal = document.getElementById("exerciseModal");

  if (!exercise || !modal) return;

  selectedExerciseId = id;

  const pictogram =
    document.getElementById("modalExercisePictogram");

  const category =
    document.getElementById("modalExerciseCategory");

  const name =
    document.getElementById("modalExerciseName");

  const description =
    document.getElementById("modalExerciseDescription");

  const muscles =
    document.getElementById("modalExerciseMuscles");

  const equipment =
    document.getElementById("modalExerciseEquipment");

  const view =
    document.getElementById("modalExerciseView");

  const metrics =
    document.getElementById("modalExerciseMetrics");

  if (pictogram) {
    pictogram.textContent = exercise.pictogram;
  }

  if (category) {
    category.textContent =
      getCategoryLabel(exercise.category);
  }

  if (name) {
    name.textContent = exercise.name;
  }

  if (description) {
    description.textContent =
      exercise.description;
  }

  if (muscles) {
    muscles.textContent =
      exercise.muscles;
  }

  if (equipment) {
    equipment.textContent =
      getEquipmentLabel(exercise.equipment);
  }

  if (view) {
    view.textContent =
      getViewLabel(exercise.view);
  }

  if (metrics) {
    metrics.textContent =
      exercise.metrics?.join(" · ") || "-";
  }

  renderExerciseModalCheckpoints(exercise);

  modal.classList.add("open");

  updateModalFavoriteButton(id);
}

function closeExerciseModal() {

  const modal =
    document.getElementById("exerciseModal");

  modal?.classList.remove("open");
}


/* =========================================================
   10. MODAL CHECKPOINTS
========================================================= */

function renderExerciseModalCheckpoints(exercise) {

  let container =
    document.getElementById(
      "modalExerciseCheckpoints"
    );

  if (!container) {

    const detailGrid =
      document.querySelector(
        "#exerciseModal .exercise-detail-grid"
      );

    if (!detailGrid) return;

    container =
      document.createElement("div");

    container.id =
      "modalExerciseCheckpoints";

    container.className =
      "modal-checkpoint-list";

    detailGrid.insertAdjacentElement(
      "afterend",
      container
    );
  }

  if (!exercise.checkpoints?.length) {

    container.innerHTML = `
      <div class="checkpoint-row">
        <span>
          기본 관절 정렬 및 움직임을 분석합니다.
        </span>
        <strong>CHECK</strong>
      </div>
    `;

    return;
  }

  container.innerHTML =
    exercise.checkpoints
      .map(item => `
        <div class="checkpoint-row">
          <span>${item}</span>
          <strong>CHECK</strong>
        </div>
      `)
      .join("");
}


/* =========================================================
   11. FAVORITE BUTTON IN MODAL
========================================================= */

function updateModalFavoriteButton(id) {

  const modalCard =
    document.querySelector(
      "#exerciseModal .modal-card"
    );

  if (!modalCard) return;

  let button =
    document.getElementById(
      "modalFavoriteExerciseBtn"
    );

  if (!button) {

    button =
      document.createElement("button");

    button.id =
      "modalFavoriteExerciseBtn";

    button.type = "button";

    button.className =
      "favorite-modal-button";

    modalCard.appendChild(button);

    button.addEventListener(
      "click",
      () => {

        if (selectedExerciseId) {
          toggleExerciseFavorite(
            selectedExerciseId
          );
        }

      }
    );
  }

  button.textContent =
    isFavoriteExercise(id)
      ? "★"
      : "☆";
}


/* =========================================================
   12. GO TO ANALYSIS

   중요:
   운동 선택 → 자세분석 페이지 → 운동 자동 선택
========================================================= */

function analyzeSelectedExercise() {

  if (!selectedExerciseId) return;

  const exercise =
    getExerciseById(selectedExerciseId);

  if (!exercise) return;

  closeExerciseModal();

  selectExerciseForAnalysis(exercise.id);

  if (
    typeof navigateToPage === "function"
  ) {

    navigateToPage("analysis");

  } else {

    document
      .querySelectorAll(".page")
      .forEach(page => {
        page.classList.remove("active");
      });

    document
      .getElementById("page-analysis")
      ?.classList.add("active");

    document
      .querySelectorAll(".nav-item")
      .forEach(button => {
        button.classList.remove("active");
      });

    document
      .querySelector(
        '[data-page="analysis"]'
      )
      ?.classList.add("active");
  }

  setTimeout(() => {

    document
      .getElementById("page-analysis")
      ?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

  }, 100);
}


/* =========================================================
   13. SELECT EXERCISE FOR ANALYSIS
========================================================= */

function selectExerciseForAnalysis(id) {

  const exercise =
    getExerciseById(id);

  if (!exercise) return;

  const select =
    document.getElementById(
      "analysisExercise"
    );

  if (select) {

    populateAnalysisExerciseSelect();

    select.value = exercise.id;

    select.dispatchEvent(
      new Event("change")
    );
  }

  applyExerciseAnalysisPreset(exercise);
}


/* =========================================================
   14. ANALYSIS SELECT OPTIONS
========================================================= */

function populateAnalysisExerciseSelect() {

  const select =
    document.getElementById(
      "analysisExercise"
    );

  if (!select) return;

  const oldValue = select.value;

  select.innerHTML = `
    <option value="">
      운동 선택
    </option>

    ${WEIGHT_EXERCISES
      .map(exercise => `
        <option value="${exercise.id}">
          ${exercise.name}
        </option>
      `)
      .join("")}
  `;

  if (
    WEIGHT_EXERCISES.some(
      item => item.id === oldValue
    )
  ) {
    select.value = oldValue;
  }
}


/* =========================================================
   15. PROGRAM EXERCISE OPTIONS
========================================================= */

function populateProgramExerciseSelect() {

  const select =
    document.getElementById(
      "programExercise"
    );

  if (!select) return;

  select.innerHTML = `
    <option value="">
      운동 선택
    </option>

    ${WEIGHT_EXERCISES
      .map(exercise => `
        <option value="${exercise.id}">
          ${exercise.name}
        </option>
      `)
      .join("")}
  `;
}


/* =========================================================
   16. RECORD FILTER OPTIONS
========================================================= */

function populateRecordExerciseFilter() {

  const select =
    document.getElementById(
      "recordExerciseFilter"
    );

  if (!select) return;

  select.innerHTML = `
    <option value="all">
      전체 운동
    </option>

    ${WEIGHT_EXERCISES
      .map(exercise => `
        <option value="${exercise.id}">
          ${exercise.name}
        </option>
      `)
      .join("")}
  `;
}


/* =========================================================
   17. EXERCISE ANALYSIS PRESET
========================================================= */

function applyExerciseAnalysisPreset(exercise) {

  if (!exercise) return;

  const title =
    document.getElementById(
      "motionAnalysisTitle"
    );

  if (title) {
    title.textContent =
      `${exercise.name} 자세 분석`;
  }

  updateRecommendedView(exercise.view);

  renderAnalysisCheckpoints(exercise);

  renderPreAnalysisRecommendations(exercise);
}


/* =========================================================
   18. RECOMMENDED VIEW
========================================================= */

function updateRecommendedView(view) {

  document
    .querySelectorAll(".view-button")
    .forEach(button => {

      button.classList.toggle(
        "active",
        button.dataset.view === view
      );

    });

  if (
    typeof window.setAnalysisView ===
    "function"
  ) {
    window.setAnalysisView(view);
  }
}


/* =========================================================
   19. ANALYSIS CHECKPOINTS
========================================================= */

function renderAnalysisCheckpoints(exercise) {

  const container =
    document.getElementById(
      "checkpointList"
    );

  if (!container) return;

  const checkpoints =
    exercise.checkpoints?.length
      ? exercise.checkpoints
      : [
          "관절 정렬",
          "좌우 대칭",
          "동작 범위",
          "몸통 안정성"
        ];

  container.innerHTML =
    checkpoints
      .map((item, index) => `
        <div class="checkpoint-row">
          <span>
            ${index + 1}. ${item}
          </span>

          <strong>
            READY
          </strong>
        </div>
      `)
      .join("");
}


/* =========================================================
   20. PRE-ANALYSIS RECOMMENDATIONS
========================================================= */

function renderPreAnalysisRecommendations(exercise) {

  const container =
    document.getElementById(
      "trainingRecommendations"
    );

  if (!container) return;

  const recommendations =
    exercise.recommendations?.length
      ? exercise.recommendations
      : getDefaultRecommendations(
          exercise.category
        );

  container.innerHTML =
    recommendations
      .slice(0, 8)
      .map((name, index) => `
        <div class="recommendation-card">

          <span class="eyebrow">
            ${
              index < 2
                ? "HIGH PRIORITY"
                : "TRAINING"
            }
          </span>

          <strong>
            ${name}
          </strong>

          <p>
            ${exercise.name}의 움직임 품질과
            관련 능력을 향상시키기 위한
            보조 훈련입니다.
          </p>

        </div>
      `)
      .join("");
}


/* =========================================================
   21. DEFAULT RECOMMENDATIONS
========================================================= */

function getDefaultRecommendations(category) {

  const map = {

    lower: [
      "Goblet Squat",
      "Split Squat",
      "Single Leg RDL",
      "Glute Bridge",
      "Ankle Mobility",
      "Lateral Band Walk",
      "Dead Bug"
    ],

    chest: [
      "Push Up",
      "Dumbbell Bench Press",
      "Scapular Push Up",
      "Plank",
      "Band Pull Apart"
    ],

    back: [
      "Lat Pulldown",
      "Cable Row",
      "Face Pull",
      "Scapular Pull Up",
      "Bird Dog"
    ],

    shoulder: [
      "Wall Slide",
      "Landmine Press",
      "Face Pull",
      "Band External Rotation",
      "Core Bracing"
    ],

    arms: [
      "Push Up",
      "Cable Curl",
      "Triceps Pushdown",
      "Farmer Carry"
    ],

    core: [
      "Dead Bug",
      "Bird Dog",
      "Pallof Press",
      "Side Plank",
      "Farmer Carry"
    ],

    olympic: [
      "Front Squat",
      "Clean Pull",
      "Jump Shrug",
      "RDL",
      "Overhead Squat",
      "Ankle Mobility"
    ],

    power: [
      "Countermovement Jump",
      "Jump Squat",
      "Kettlebell Swing",
      "Medicine Ball Throw"
    ],

    plyometric: [
      "Snap Down",
      "Pogo Jump",
      "Countermovement Jump",
      "Single Leg Balance",
      "Calf Raise"
    ],

    functional: [
      "Farmer Carry",
      "Pallof Press",
      "Split Squat",
      "Bear Crawl",
      "Dead Bug"
    ],

    mobility: [
      "Ankle Mobility",
      "90/90 Hip Mobility",
      "Wall Slide",
      "Adductor Mobility"
    ],

    fullbody: [
      "Squat",
      "Push Up",
      "RDL",
      "Plank",
      "Farmer Carry"
    ]

  };

  return map[category] || [
    "Mobility Training",
    "Core Stability",
    "Movement Control"
  ];
}


/* =========================================================
   22. FILTER EVENTS
========================================================= */

function initializeExerciseFilters() {

  const search =
    document.getElementById(
      "exerciseSearch"
    );

  const equipment =
    document.getElementById(
      "equipmentFilter"
    );

  if (search) {

    search.addEventListener(
      "input",
      () => {

        currentExerciseSearch =
          search.value;

        renderExerciseLibrary();

      }
    );
  }

  if (equipment) {

    equipment.addEventListener(
      "change",
      () => {

        currentExerciseEquipment =
          equipment.value;

        renderExerciseLibrary();

      }
    );
  }

  document
    .querySelectorAll(".category-tab")
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          document
            .querySelectorAll(
              ".category-tab"
            )
            .forEach(item =>
              item.classList.remove(
                "active"
              )
            );

          button.classList.add("active");

          currentExerciseCategory =
            button.dataset.category;

          renderExerciseLibrary();

        }
      );

    });
}


/* =========================================================
   23. ANALYSIS EXERCISE CHANGE
========================================================= */

function initializeAnalysisExerciseChange() {

  const select =
    document.getElementById(
      "analysisExercise"
    );

  if (!select) return;

  select.addEventListener(
    "change",
    () => {

      const exercise =
        getExerciseById(select.value);

      if (!exercise) return;

      selectedExerciseId =
        exercise.id;

      applyExerciseAnalysisPreset(
        exercise
      );

    }
  );
}


/* =========================================================
   24. MODAL EVENTS
========================================================= */

function initializeExerciseModalEvents() {

  const closeButton =
    document.getElementById(
      "closeExerciseModal"
    );

  const analyzeButton =
    document.getElementById(
      "analyzeSelectedExerciseBtn"
    );

  const modal =
    document.getElementById(
      "exerciseModal"
    );

  closeButton?.addEventListener(
    "click",
    closeExerciseModal
  );

  analyzeButton?.addEventListener(
    "click",
    analyzeSelectedExercise
  );

  modal?.addEventListener(
    "click",
    event => {

      if (event.target === modal) {
        closeExerciseModal();
      }

    }
  );
}


/* =========================================================
   25. KEYBOARD
========================================================= */

function initializeExerciseKeyboard() {

  document.addEventListener(
    "keydown",
    event => {

      if (event.key === "Escape") {
        closeExerciseModal();
      }

    }
  );
}


/* =========================================================
   26. GET ANALYSIS CONFIG

   app.js에서 REP 카운터가 사용할 수 있음
========================================================= */

function getCurrentExerciseAnalysisConfig() {

  const select =
    document.getElementById(
      "analysisExercise"
    );

  if (!select?.value) return null;

  return getExerciseById(
    select.value
  );
}


/* =========================================================
   27. FIND RELATED EXERCISES
========================================================= */

function getRelatedExercises(exerciseId, limit = 8) {

  const source =
    getExerciseById(exerciseId);

  if (!source) return [];

  return WEIGHT_EXERCISES
    .filter(item =>
      item.id !== source.id &&
      (
        item.category === source.category ||
        item.equipment === source.equipment
      )
    )
    .slice(0, limit);
}


/* =========================================================
   28. EXERCISE STATISTICS
========================================================= */

function getExerciseDatabaseStats() {

  const stats = {
    total: WEIGHT_EXERCISES.length,
    categories: {},
    equipment: {}
  };

  WEIGHT_EXERCISES.forEach(exercise => {

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
   29. GLOBAL EXPORTS
========================================================= */

window.WEIGHT_EXERCISES =
  WEIGHT_EXERCISES;

window.getExerciseById =
  getExerciseById;

window.getExerciseName =
  getExerciseName;

window.getCurrentExerciseAnalysisConfig =
  getCurrentExerciseAnalysisConfig;

window.getRelatedExercises =
  getRelatedExercises;

window.getExerciseDatabaseStats =
  getExerciseDatabaseStats;

window.selectExerciseForAnalysis =
  selectExerciseForAnalysis;

window.populateAnalysisExerciseSelect =
  populateAnalysisExerciseSelect;

window.populateProgramExerciseSelect =
  populateProgramExerciseSelect;


/* =========================================================
   30. INITIALIZE
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    renderExerciseLibrary();

    initializeExerciseFilters();

    initializeExerciseModalEvents();

    initializeExerciseKeyboard();

    populateAnalysisExerciseSelect();

    populateProgramExerciseSelect();

    populateRecordExerciseFilter();

    initializeAnalysisExerciseChange();

    console.log(
      `[WEIGHT LAB] Exercise DB loaded: ${WEIGHT_EXERCISES.length} exercises`
    );

  }
);