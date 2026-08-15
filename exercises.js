/* =========================================================
   설천고 WEIGHT PERFORMANCE LAB
   EXERCISES.JS
   PART 3 / 6

   EXERCISE DATABASE
   - Lower Body
   - Chest
   - Back
   - Shoulder
   - Arms
   - Core
   - Olympic Lifting
   - Power
   - Plyometric
   - Functional
   - Mobility / Corrective
   - Full Body

   Motion Analysis Ready
   - 33 Landmark Pose
   - Joint Angle Targets
   - Camera View
   - Checkpoints
   - Training Recommendations
========================================================= */

"use strict";


/* =========================================================
   01. CATEGORY INFORMATION
========================================================= */

const EXERCISE_CATEGORIES = {

  lower: {
    name: "하체",
    icon: "🦵"
  },

  chest: {
    name: "가슴",
    icon: "🏋️"
  },

  back: {
    name: "등",
    icon: "🔙"
  },

  shoulder: {
    name: "어깨",
    icon: "💪"
  },

  arms: {
    name: "팔",
    icon: "💪"
  },

  core: {
    name: "코어",
    icon: "◎"
  },

  olympic: {
    name: "올림픽 리프팅",
    icon: "🏋️"
  },

  power: {
    name: "파워",
    icon: "⚡"
  },

  plyometric: {
    name: "플라이오메트릭",
    icon: "⬆️"
  },

  functional: {
    name: "기능성",
    icon: "🔄"
  },

  mobility: {
    name: "보강 · 가동성",
    icon: "🧘"
  },

  fullbody: {
    name: "전신",
    icon: "🏃"
  }

};


/* =========================================================
   02. HELPER
========================================================= */

function createExercise({
  id,
  name,
  category,
  equipment,
  icon,
  muscles,
  description,
  view = "side",
  metrics = [],
  checkpoints = [],
  recommendations = [],
  angleTargets = {}
}) {

  return {
    id,
    name,
    category,
    equipment,
    icon,
    muscles,
    description,
    view,
    metrics,
    checkpoints,
    recommendations,
    angleTargets
  };

}


/* =========================================================
   03. LOWER BODY
========================================================= */

const LOWER_EXERCISES = [

  createExercise({
    id: "back-squat",
    name: "백 스쿼트",
    category: "lower",
    equipment: "barbell",
    icon: "🏋️",
    muscles: "대퇴사두근 · 둔근 · 햄스트링 · 코어",
    description: "대표적인 하체 복합 근력 운동",
    view: "side",
    metrics: [
      "무릎 각도",
      "고관절 각도",
      "발목 각도",
      "몸통 기울기",
      "좌우 대칭",
      "바벨 궤적"
    ],
    checkpoints: [
      "발바닥 지지 유지",
      "무릎 진행 방향",
      "골반 안정성",
      "척추 중립",
      "바벨 수직 궤적",
      "좌우 대칭"
    ],
    recommendations: [
      "고블릿 스쿼트",
      "템포 스쿼트",
      "스플릿 스쿼트",
      "발목 가동성",
      "코어 안정화"
    ],
    angleTargets: {
      knee: [70, 110],
      hip: [60, 110],
      ankle: [65, 100],
      trunk: [0, 45]
    }
  }),

  createExercise({
    id: "front-squat",
    name: "프론트 스쿼트",
    category: "lower",
    equipment: "barbell",
    icon: "🏋️",
    muscles: "대퇴사두근 · 둔근 · 코어",
    description: "바벨을 전면에 위치시키는 스쿼트",
    view: "side",
    metrics: [
      "무릎",
      "고관절",
      "몸통",
      "바벨 궤적"
    ],
    checkpoints: [
      "몸통 세우기",
      "팔꿈치 높이",
      "무릎 정렬",
      "발바닥 지지"
    ],
    recommendations: [
      "프론트랙 스트레칭",
      "고블릿 스쿼트",
      "코어 브레이싱"
    ],
    angleTargets: {
      knee: [65, 110],
      hip: [65, 115],
      ankle: [65, 100],
      trunk: [0, 30]
    }
  }),

  createExercise({
    id: "goblet-squat",
    name: "고블릿 스쿼트",
    category: "lower",
    equipment: "dumbbell",
    icon: "🦵",
    muscles: "대퇴사두근 · 둔근 · 코어",
    description: "덤벨을 가슴 앞에 들고 수행하는 스쿼트",
    view: "front",
    metrics: [
      "무릎 정렬",
      "좌우 대칭",
      "스쿼트 깊이"
    ],
    checkpoints: [
      "무릎과 발끝 방향",
      "골반 좌우 균형",
      "상체 안정"
    ],
    recommendations: [
      "발목 가동성",
      "힙 어브덕션",
      "템포 스쿼트"
    ]
  }),

  createExercise({
    id: "overhead-squat",
    name: "오버헤드 스쿼트",
    category: "lower",
    equipment: "barbell",
    icon: "🏋️",
    muscles: "전신 · 코어 · 어깨 · 하체",
    description: "바벨을 머리 위에 유지하며 수행하는 스쿼트",
    view: "front",
    metrics: [
      "어깨 안정성",
      "몸통 정렬",
      "무릎 정렬",
      "좌우 대칭"
    ],
    checkpoints: [
      "바벨 중심 유지",
      "팔꿈치 잠금",
      "무릎 정렬",
      "몸통 안정"
    ],
    recommendations: [
      "PVC 오버헤드 스쿼트",
      "흉추 가동성",
      "어깨 가동성",
      "발목 가동성"
    ]
  }),

  createExercise({
    id: "box-squat",
    name: "박스 스쿼트",
    category: "lower",
    equipment: "barbell",
    icon: "📦",
    muscles: "둔근 · 햄스트링 · 대퇴사두근",
    description: "박스를 이용해 깊이와 힙 패턴을 조절하는 스쿼트",
    view: "side",
    metrics: [
      "고관절 이동",
      "무릎 각도",
      "몸통 기울기"
    ]
  }),

  createExercise({
    id: "split-squat",
    name: "스플릿 스쿼트",
    category: "lower",
    equipment: "bodyweight",
    icon: "🦵",
    muscles: "대퇴사두근 · 둔근",
    description: "좌우 다리를 분리해 수행하는 하체 운동",
    view: "side",
    metrics: [
      "무릎 각도",
      "골반 안정성",
      "좌우 차이"
    ]
  }),

  createExercise({
    id: "bulgarian-split-squat",
    name: "불가리안 스플릿 스쿼트",
    category: "lower",
    equipment: "dumbbell",
    icon: "🦵",
    muscles: "둔근 · 대퇴사두근 · 햄스트링",
    description: "후방 다리를 벤치에 올려 수행하는 단측 하체 운동",
    view: "side",
    metrics: [
      "무릎",
      "고관절",
      "골반",
      "좌우 차이"
    ]
  }),

  createExercise({
    id: "walking-lunge",
    name: "워킹 런지",
    category: "lower",
    equipment: "dumbbell",
    icon: "🚶",
    muscles: "둔근 · 대퇴사두근 · 햄스트링",
    description: "전진하며 반복하는 런지",
    view: "side",
    metrics: [
      "보폭",
      "무릎 각도",
      "골반 안정"
    ]
  }),

  createExercise({
    id: "reverse-lunge",
    name: "리버스 런지",
    category: "lower",
    equipment: "bodyweight",
    icon: "↩️",
    muscles: "둔근 · 대퇴사두근",
    description: "뒤로 발을 이동해 수행하는 런지",
    view: "side",
    metrics: [
      "무릎",
      "고관절",
      "균형"
    ]
  }),

  createExercise({
    id: "lateral-lunge",
    name: "사이드 런지",
    category: "lower",
    equipment: "bodyweight",
    icon: "↔️",
    muscles: "내전근 · 둔근 · 대퇴사두근",
    description: "측면 방향으로 이동하는 런지",
    view: "front",
    metrics: [
      "골반 이동",
      "무릎 정렬",
      "좌우 차이"
    ]
  }),

  createExercise({
    id: "step-up",
    name: "스텝 업",
    category: "lower",
    equipment: "dumbbell",
    icon: "🪜",
    muscles: "둔근 · 대퇴사두근",
    description: "박스 위로 올라가는 단측 하체 운동",
    view: "side",
    metrics: [
      "무릎",
      "고관절",
      "골반 안정"
    ]
  }),

  createExercise({
    id: "leg-press",
    name: "레그 프레스",
    category: "lower",
    equipment: "machine",
    icon: "🦵",
    muscles: "대퇴사두근 · 둔근",
    description: "머신을 이용한 하체 프레스 운동",
    view: "side",
    metrics: [
      "무릎 각도",
      "고관절 각도",
      "ROM"
    ]
  }),

  createExercise({
    id: "hack-squat",
    name: "핵 스쿼트",
    category: "lower",
    equipment: "machine",
    icon: "🦵",
    muscles: "대퇴사두근 · 둔근",
    description: "머신 궤도에서 수행하는 스쿼트",
    view: "side",
    metrics: [
      "무릎",
      "고관절",
      "ROM"
    ]
  }),

  createExercise({
    id: "leg-extension",
    name: "레그 익스텐션",
    category: "lower",
    equipment: "machine",
    icon: "🦵",
    muscles: "대퇴사두근",
    description: "무릎 신전 중심 머신 운동",
    view: "side",
    metrics: [
      "무릎 ROM",
      "좌우 차이"
    ]
  }),

  createExercise({
    id: "leg-curl",
    name: "레그 컬",
    category: "lower",
    equipment: "machine",
    icon: "🦵",
    muscles: "햄스트링",
    description: "무릎 굴곡 중심 머신 운동",
    view: "side",
    metrics: [
      "무릎 ROM",
      "좌우 차이"
    ]
  }),

  createExercise({
    id: "hip-thrust",
    name: "힙 쓰러스트",
    category: "lower",
    equipment: "barbell",
    icon: "⬆️",
    muscles: "둔근 · 햄스트링",
    description: "고관절 신전 파워를 강화하는 운동",
    view: "side",
    metrics: [
      "고관절 신전",
      "몸통",
      "골반"
    ]
  }),

  createExercise({
    id: "glute-bridge",
    name: "글루트 브리지",
    category: "lower",
    equipment: "bodyweight",
    icon: "⬆️",
    muscles: "둔근 · 햄스트링",
    description: "기초 고관절 신전 운동",
    view: "side",
    metrics: [
      "고관절",
      "골반 정렬"
    ]
  }),

  createExercise({
    id: "romanian-deadlift",
    name: "루마니안 데드리프트",
    category: "lower",
    equipment: "barbell",
    icon: "🏋️",
    muscles: "햄스트링 · 둔근 · 척추기립근",
    description: "힙힌지 패턴을 강화하는 데드리프트 변형",
    view: "side",
    metrics: [
      "고관절",
      "무릎",
      "몸통",
      "바벨 궤적"
    ],
    checkpoints: [
      "척추 중립",
      "바벨과 몸의 거리",
      "힙힌지",
      "무릎 과굴곡 방지"
    ]
  }),

  createExercise({
    id: "single-leg-rdl",
    name: "싱글 레그 RDL",
    category: "lower",
    equipment: "dumbbell",
    icon: "🦵",
    muscles: "햄스트링 · 둔근 · 코어",
    description: "한 다리 힙힌지와 균형을 동시에 훈련",
    view: "rear",
    metrics: [
      "골반 회전",
      "균형",
      "좌우 차이"
    ]
  }),

  createExercise({
    id: "conventional-deadlift",
    name: "컨벤셔널 데드리프트",
    category: "lower",
    equipment: "barbell",
    icon: "🏋️",
    muscles: "둔근 · 햄스트링 · 등 · 코어",
    description: "바닥에서 바벨을 들어올리는 대표 복합 운동",
    view: "side",
    metrics: [
      "고관절",
      "무릎",
      "몸통",
      "바벨 궤적"
    ]
  }),

  createExercise({
    id: "sumo-deadlift",
    name: "스모 데드리프트",
    category: "lower",
    equipment: "barbell",
    icon: "🏋️",
    muscles: "둔근 · 내전근 · 대퇴사두근",
    description: "넓은 스탠스로 수행하는 데드리프트",
    view: "front",
    metrics: [
      "무릎 정렬",
      "골반",
      "좌우 대칭"
    ]
  }),

  createExercise({
    id: "trap-bar-deadlift",
    name: "트랩바 데드리프트",
    category: "lower",
    equipment: "other",
    icon: "⬡",
    muscles: "하체 · 둔근 · 등",
    description: "트랩바를 이용한 데드리프트",
    view: "side",
    metrics: [
      "무릎",
      "고관절",
      "몸통"
    ]
  }),

  createExercise({
    id: "standing-calf-raise",
    name: "스탠딩 카프 레이즈",
    category: "lower",
    equipment: "machine",
    icon: "🦶",
    muscles: "비복근 · 가자미근",
    description: "발목 저측굴곡 근력을 강화",
    view: "side",
    metrics: [
      "발목 ROM",
      "좌우 차이"
    ]
  }),

  createExercise({
    id: "seated-calf-raise",
    name: "시티드 카프 레이즈",
    category: "lower",
    equipment: "machine",
    icon: "🦶",
    muscles: "가자미근",
    description: "앉아서 수행하는 종아리 운동",
    view: "side",
    metrics: [
      "발목 ROM"
    ]
  })

];


/* =========================================================
   04. CHEST
========================================================= */

const CHEST_EXERCISES = [

  createExercise({
    id: "bench-press",
    name: "벤치프레스",
    category: "chest",
    equipment: "barbell",
    icon: "🏋️",
    muscles: "대흉근 · 삼두근 · 전면삼각근",
    description: "대표적인 상체 수평 프레스 운동",
    view: "side",
    metrics: [
      "팔꿈치 각도",
      "손목 정렬",
      "바벨 궤적",
      "좌우 대칭"
    ],
    checkpoints: [
      "손목 중립",
      "견갑 안정",
      "바벨 좌우 균형",
      "팔꿈치 궤적"
    ],
    recommendations: [
      "푸시업",
      "덤벨 벤치프레스",
      "스캐풀라 푸시업",
      "밴드 외회전"
    ]
  }),

  createExercise({
    id: "incline-bench",
    name: "인클라인 벤치프레스",
    category: "chest",
    equipment: "barbell",
    icon: "🏋️",
    muscles: "상부 대흉근 · 삼두근 · 어깨",
    description: "상부 가슴 중심 프레스",
    view: "side",
    metrics: [
      "팔꿈치",
      "바벨 궤적",
      "좌우 대칭"
    ]
  }),

  createExercise({
    id: "decline-bench",
    name: "디클라인 벤치프레스",
    category: "chest",
    equipment: "barbell",
    icon: "🏋️",
    muscles: "대흉근 · 삼두근",
    description: "하부 가슴 중심 프레스",
    view: "side",
    metrics: [
      "팔꿈치",
      "바벨 궤적"
    ]
  }),

  createExercise({
    id: "dumbbell-bench",
    name: "덤벨 벤치프레스",
    category: "chest",
    equipment: "dumbbell",
    icon: "🏋️",
    muscles: "대흉근 · 삼두근",
    description: "덤벨을 이용한 수평 프레스",
    view: "front",
    metrics: [
      "좌우 대칭",
      "팔꿈치",
      "손목"
    ]
  }),

  createExercise({
    id: "incline-db-press",
    name: "인클라인 덤벨프레스",
    category: "chest",
    equipment: "dumbbell",
    icon: "🏋️",
    muscles: "상부 대흉근 · 어깨",
    description: "덤벨 인클라인 프레스",
    view: "front",
    metrics: [
      "좌우 대칭",
      "팔꿈치"
    ]
  }),

  createExercise({
    id: "chest-press",
    name: "체스트 프레스",
    category: "chest",
    equipment: "machine",
    icon: "💪",
    muscles: "대흉근 · 삼두근",
    description: "머신 기반 가슴 프레스",
    view: "front",
    metrics: [
      "좌우 대칭",
      "팔꿈치 ROM"
    ]
  }),

  createExercise({
    id: "push-up",
    name: "푸시업",
    category: "chest",
    equipment: "bodyweight",
    icon: "🤸",
    muscles: "대흉근 · 삼두근 · 코어",
    description: "대표적인 맨몸 상체 운동",
    view: "side",
    metrics: [
      "팔꿈치",
      "몸통 정렬",
      "골반"
    ]
  }),

  createExercise({
    id: "dip",
    name: "딥스",
    category: "chest",
    equipment: "bodyweight",
    icon: "💪",
    muscles: "가슴 · 삼두근 · 어깨",
    description: "평행봉 프레스 운동",
    view: "side",
    metrics: [
      "팔꿈치",
      "어깨",
      "몸통"
    ]
  }),

  createExercise({
    id: "cable-fly",
    name: "케이블 플라이",
    category: "chest",
    equipment: "cable",
    icon: "↔️",
    muscles: "대흉근",
    description: "케이블을 이용한 가슴 모음 운동",
    view: "front",
    metrics: [
      "좌우 대칭",
      "어깨 ROM"
    ]
  }),

  createExercise({
    id: "pec-deck",
    name: "펙덱 플라이",
    category: "chest",
    equipment: "machine",
    icon: "↔️",
    muscles: "대흉근",
    description: "머신 가슴 플라이",
    view: "front",
    metrics: [
      "좌우 대칭",
      "어깨"
    ]
  })

];


/* =========================================================
   05. BACK
========================================================= */

const BACK_EXERCISES = [

  createExercise({
    id: "pull-up",
    name: "풀업",
    category: "back",
    equipment: "bodyweight",
    icon: "⬆️",
    muscles: "광배근 · 이두근 · 등",
    description: "대표적인 수직 당기기 운동",
    view: "front",
    metrics: [
      "어깨",
      "팔꿈치",
      "좌우 대칭",
      "몸통 흔들림"
    ]
  }),

  createExercise({
    id: "chin-up",
    name: "친업",
    category: "back",
    equipment: "bodyweight",
    icon: "⬆️",
    muscles: "광배근 · 이두근",
    description: "언더그립 수직 당기기",
    view: "front",
    metrics: [
      "팔꿈치",
      "좌우 대칭"
    ]
  }),

  createExercise({
    id: "lat-pulldown",
    name: "랫풀다운",
    category: "back",
    equipment: "cable",
    icon: "⬇️",
    muscles: "광배근 · 이두근",
    description: "수직 당기기 머신 운동",
    view: "front",
    metrics: [
      "팔꿈치",
      "어깨",
      "좌우 대칭"
    ]
  }),

  createExercise({
    id: "barbell-row",
    name: "바벨 로우",
    category: "back",
    equipment: "barbell",
    icon: "🏋️",
    muscles: "광배근 · 승모근 · 후면삼각근",
    description: "힙힌지 자세에서 수행하는 로우",
    view: "side",
    metrics: [
      "몸통",
      "고관절",
      "팔꿈치",
      "바벨 궤적"
    ]
  }),

  createExercise({
    id: "pendlay-row",
    name: "펜들레이 로우",
    category: "back",
    equipment: "barbell",
    icon: "🏋️",
    muscles: "등 · 광배근",
    description: "바닥에서 매 반복 시작하는 바벨 로우",
    view: "side",
    metrics: [
      "몸통",
      "바벨 궤적",
      "고관절"
    ]
  }),

  createExercise({
    id: "one-arm-db-row",
    name: "원암 덤벨 로우",
    category: "back",
    equipment: "dumbbell",
    icon: "💪",
    muscles: "광배근 · 능형근",
    description: "한 팔씩 수행하는 덤벨 로우",
    view: "side",
    metrics: [
      "팔꿈치",
      "몸통 회전"
    ]
  }),

  createExercise({
    id: "seated-row",
    name: "시티드 케이블 로우",
    category: "back",
    equipment: "cable",
    icon: "↔️",
    muscles: "광배근 · 능형근",
    description: "앉아서 수행하는 수평 당기기",
    view: "side",
    metrics: [
      "팔꿈치",
      "몸통",
      "어깨"
    ]
  }),

  createExercise({
    id: "tbar-row",
    name: "T바 로우",
    category: "back",
    equipment: "other",
    icon: "🏋️",
    muscles: "광배근 · 등",
    description: "T바를 이용한 로우",
    view: "side",
    metrics: [
      "몸통",
      "팔꿈치"
    ]
  }),

  createExercise({
    id: "face-pull",
    name: "페이스 풀",
    category: "back",
    equipment: "cable",
    icon: "↔️",
    muscles: "후면삼각근 · 회전근개 · 승모근",
    description: "어깨 안정성과 후면 체인을 강화",
    view: "front",
    metrics: [
      "어깨",
      "팔꿈치",
      "좌우 대칭"
    ]
  }),

  createExercise({
    id: "back-extension",
    name: "백 익스텐션",
    category: "back",
    equipment: "bodyweight",
    icon: "↗️",
    muscles: "척추기립근 · 둔근 · 햄스트링",
    description: "후면 체인 강화 운동",
    view: "side",
    metrics: [
      "고관절",
      "몸통"
    ]
  })

];


/* =========================================================
   06. SHOULDERS
========================================================= */

const SHOULDER_EXERCISES = [

  createExercise({
    id: "overhead-press",
    name: "오버헤드 프레스",
    category: "shoulder",
    equipment: "barbell",
    icon: "🏋️",
    muscles: "삼각근 · 삼두근 · 코어",
    description: "바벨 수직 프레스",
    view: "front",
    metrics: [
      "어깨",
      "팔꿈치",
      "몸통",
      "바벨 궤적"
    ]
  }),

  createExercise({
    id: "db-shoulder-press",
    name: "덤벨 숄더프레스",
    category: "shoulder",
    equipment: "dumbbell",
    icon: "💪",
    muscles: "삼각근 · 삼두근",
    description: "덤벨 수직 프레스",
    view: "front",
    metrics: [
      "좌우 대칭",
      "팔꿈치",
      "어깨"
    ]
  }),

  createExercise({
    id: "arnold-press",
    name: "아놀드 프레스",
    category: "shoulder",
    equipment: "dumbbell",
    icon: "💪",
    muscles: "삼각근",
    description: "회전을 포함한 덤벨 프레스",
    view: "front",
    metrics: [
      "어깨 회전",
      "팔꿈치"
    ]
  }),

  createExercise({
    id: "lateral-raise",
    name: "사이드 레터럴 레이즈",
    category: "shoulder",
    equipment: "dumbbell",
    icon: "↔️",
    muscles: "측면삼각근",
    description: "어깨 외전 운동",
    view: "front",
    metrics: [
      "어깨 각도",
      "좌우 대칭"
    ]
  }),

  createExercise({
    id: "front-raise",
    name: "프론트 레이즈",
    category: "shoulder",
    equipment: "dumbbell",
    icon: "⬆️",
    muscles: "전면삼각근",
    description: "어깨 굴곡 운동",
    view: "side",
    metrics: [
      "어깨 ROM",
      "몸통 보상"
    ]
  }),

  createExercise({
    id: "rear-delt-fly",
    name: "리어 델트 플라이",
    category: "shoulder",
    equipment: "dumbbell",
    icon: "↔️",
    muscles: "후면삼각근 · 능형근",
    description: "후면 어깨 강화 운동",
    view: "rear",
    metrics: [
      "좌우 대칭",
      "어깨"
    ]
  }),

  createExercise({
    id: "upright-row",
    name: "업라이트 로우",
    category: "shoulder",
    equipment: "barbell",
    icon: "⬆️",
    muscles: "삼각근 · 승모근",
    description: "바벨을 몸 앞에서 수직으로 당기는 운동",
    view: "front",
    metrics: [
      "팔꿈치",
      "어깨"
    ]
  })

];


/* =========================================================
   07. ARMS
========================================================= */

const ARM_EXERCISES = [

  createExercise({
    id: "barbell-curl",
    name: "바벨 컬",
    category: "arms",
    equipment: "barbell",
    icon: "💪",
    muscles: "상완이두근",
    description: "대표적인 이두근 운동",
    view: "side",
    metrics: [
      "팔꿈치 ROM",
      "몸통 흔들림"
    ]
  }),

  createExercise({
    id: "db-curl",
    name: "덤벨 컬",
    category: "arms",
    equipment: "dumbbell",
    icon: "💪",
    muscles: "상완이두근",
    description: "덤벨 이두근 운동",
    view: "front",
    metrics: [
      "팔꿈치",
      "좌우 대칭"
    ]
  }),

  createExercise({
    id: "hammer-curl",
    name: "해머 컬",
    category: "arms",
    equipment: "dumbbell",
    icon: "🔨",
    muscles: "상완근 · 상완요골근",
    description: "중립 그립 컬",
    view: "front",
    metrics: [
      "팔꿈치",
      "좌우 대칭"
    ]
  }),

  createExercise({
    id: "preacher-curl",
    name: "프리처 컬",
    category: "arms",
    equipment: "barbell",
    icon: "💪",
    muscles: "상완이두근",
    description: "팔꿈치를 고정한 컬",
    view: "side",
    metrics: [
      "팔꿈치 ROM"
    ]
  }),

  createExercise({
    id: "triceps-pushdown",
    name: "트라이셉스 푸시다운",
    category: "arms",
    equipment: "cable",
    icon: "⬇️",
    muscles: "상완삼두근",
    description: "케이블 삼두 신전 운동",
    view: "side",
    metrics: [
      "팔꿈치 ROM"
    ]
  }),

  createExercise({
    id: "skull-crusher",
    name: "스컬 크러셔",
    category: "arms",
    equipment: "barbell",
    icon: "💪",
    muscles: "상완삼두근",
    description: "누워서 수행하는 삼두 운동",
    view: "side",
    metrics: [
      "팔꿈치 ROM"
    ]
  }),

  createExercise({
    id: "close-grip-bench",
    name: "클로즈그립 벤치프레스",
    category: "arms",
    equipment: "barbell",
    icon: "🏋️",
    muscles: "삼두근 · 가슴",
    description: "좁은 그립의 벤치프레스",
    view: "side",
    metrics: [
      "팔꿈치",
      "바벨 궤적"
    ]
  })

];


/* =========================================================
   08. CORE
========================================================= */

const CORE_EXERCISES = [

  createExercise({
    id: "plank",
    name: "플랭크",
    category: "core",
    equipment: "bodyweight",
    icon: "━",
    muscles: "복횡근 · 복직근 · 둔근",
    description: "기본 코어 안정화 운동",
    view: "side",
    metrics: [
      "몸통 정렬",
      "골반 높이"
    ]
  }),

  createExercise({
    id: "side-plank",
    name: "사이드 플랭크",
    category: "core",
    equipment: "bodyweight",
    icon: "━",
    muscles: "복사근 · 중둔근",
    description: "측면 코어 안정화",
    view: "front",
    metrics: [
      "골반 높이",
      "몸통 정렬"
    ]
  }),

  createExercise({
    id: "dead-bug",
    name: "데드버그",
    category: "core",
    equipment: "bodyweight",
    icon: "✣",
    muscles: "심부 코어",
    description: "사지 움직임 중 몸통 안정성을 훈련",
    view: "top",
    metrics: [
      "골반 안정",
      "좌우 대칭"
    ]
  }),

  createExercise({
    id: "bird-dog",
    name: "버드독",
    category: "core",
    equipment: "bodyweight",
    icon: "✣",
    muscles: "코어 · 둔근 · 등",
    description: "대각선 사지 안정화 운동",
    view: "side",
    metrics: [
      "골반 회전",
      "몸통 안정"
    ]
  }),

  createExercise({
    id: "pallof-press",
    name: "팔로프 프레스",
    category: "core",
    equipment: "cable",
    icon: "↔️",
    muscles: "복사근 · 심부 코어",
    description: "회전 저항 코어 운동",
    view: "front",
    metrics: [
      "몸통 회전",
      "골반 안정"
    ]
  }),

  createExercise({
    id: "cable-rotation",
    name: "케이블 로테이션",
    category: "core",
    equipment: "cable",
    icon: "🔄",
    muscles: "복사근 · 둔근",
    description: "회전 파워 운동",
    view: "front",
    metrics: [
      "몸통 회전",
      "골반 회전"
    ]
  }),

  createExercise({
    id: "hanging-leg-raise",
    name: "행잉 레그레이즈",
    category: "core",
    equipment: "bodyweight",
    icon: "⬆️",
    muscles: "복직근 · 고관절 굴곡근",
    description: "매달린 상태에서 다리를 들어올리는 코어 운동",
    view: "side",
    metrics: [
      "고관절 ROM",
      "몸통 흔들림"
    ]
  }),

  createExercise({
    id: "ab-wheel",
    name: "AB 휠 롤아웃",
    category: "core",
    equipment: "other",
    icon: "◉",
    muscles: "복직근 · 광배근 · 코어",
    description: "전방으로 몸을 뻗으며 코어를 유지",
    view: "side",
    metrics: [
      "몸통 정렬",
      "고관절"
    ]
  }),

  createExercise({
    id: "farmer-carry",
    name: "파머스 캐리",
    category: "core",
    equipment: "dumbbell",
    icon: "🚶",
    muscles: "코어 · 악력 · 승모근",
    description: "중량을 들고 걷는 전신 안정화 운동",
    view: "front",
    metrics: [
      "몸통 흔들림",
      "좌우 대칭",
      "보행"
    ]
  })

];


/* =========================================================
   09. OLYMPIC LIFTING
========================================================= */

const OLYMPIC_EXERCISES = [

  createExercise({
    id: "clean",
    name: "클린",
    category: "olympic",
    equipment: "barbell",
    icon: "🏋️",
    muscles: "전신 · 둔근 · 대퇴사두근 · 승모근",
    description: "폭발적인 바벨 리프팅 동작",
    view: "side",
    metrics: [
      "바벨 궤적",
      "고관절 속도",
      "무릎",
      "캐치 자세"
    ],
    checkpoints: [
      "1차 당기기",
      "무릎 재진입",
      "2차 당기기",
      "완전 신전",
      "캐치 안정"
    ],
    recommendations: [
      "클린 풀",
      "행 파워클린",
      "프론트 스쿼트",
      "점프 스쿼트"
    ]
  }),

  createExercise({
    id: "power-clean",
    name: "파워 클린",
    category: "olympic",
    equipment: "barbell",
    icon: "⚡",
    muscles: "전신 · 둔근 · 대퇴사두근",
    description: "높은 캐치 위치의 클린",
    view: "side",
    metrics: [
      "바벨 궤적",
      "폭발적 신전",
      "캐치"
    ]
  }),

  createExercise({
    id: "hang-clean",
    name: "행 클린",
    category: "olympic",
    equipment: "barbell",
    icon: "🏋️",
    muscles: "둔근 · 햄스트링 · 승모근",
    description: "행 포지션에서 시작하는 클린",
    view: "side",
    metrics: [
      "고관절",
      "바벨 궤적",
      "캐치"
    ]
  }),

  createExercise({
    id: "clean-pull",
    name: "클린 풀",
    category: "olympic",
    equipment: "barbell",
    icon: "⬆️",
    muscles: "후면 체인 · 승모근",
    description: "클린의 당기기 구간을 강화",
    view: "side",
    metrics: [
      "바벨 궤적",
      "신전 타이밍"
    ]
  }),

  createExercise({
    id: "snatch",
    name: "스내치",
    category: "olympic",
    equipment: "barbell",
    icon: "🏋️",
    muscles: "전신",
    description: "바벨을 한 번에 머리 위로 이동시키는 리프트",
    view: "side",
    metrics: [
      "바벨 궤적",
      "고관절",
      "캐치",
      "오버헤드 안정"
    ]
  }),

  createExercise({
    id: "power-snatch",
    name: "파워 스내치",
    category: "olympic",
    equipment: "barbell",
    icon: "⚡",
    muscles: "전신",
    description: "높은 캐치 위치의 스내치",
    view: "side",
    metrics: [
      "바벨 궤적",
      "신전",
      "캐치"
    ]
  }),

  createExercise({
    id: "hang-snatch",
    name: "행 스내치",
    category: "olympic",
    equipment: "barbell",
    icon: "🏋️",
    muscles: "전신",
    description: "행 포지션에서 시작하는 스내치",
    view: "side",
    metrics: [
      "바벨 궤적",
      "고관절",
      "오버헤드"
    ]
  }),

  createExercise({
    id: "snatch-pull",
    name: "스내치 풀",
    category: "olympic",
    equipment: "barbell",
    icon: "⬆️",
    muscles: "후면 체인 · 승모근",
    description: "스내치 당기기 구간 훈련",
    view: "side",
    metrics: [
      "바벨 궤적",
      "신전 타이밍"
    ]
  }),

  createExercise({
    id: "push-press",
    name: "푸시 프레스",
    category: "olympic",
    equipment: "barbell",
    icon: "⬆️",
    muscles: "하체 · 어깨 · 삼두",
    description: "하체 반동을 이용한 오버헤드 프레스",
    view: "side",
    metrics: [
      "딥 깊이",
      "신전 타이밍",
      "바벨 궤적"
    ]
  }),

  createExercise({
    id: "push-jerk",
    name: "푸시 저크",
    category: "olympic",
    equipment: "barbell",
    icon: "⚡",
    muscles: "전신",
    description: "하체 드라이브와 캐치를 이용한 오버헤드 리프트",
    view: "front",
    metrics: [
      "딥",
      "드라이브",
      "캐치",
      "좌우 대칭"
    ]
  }),

  createExercise({
    id: "split-jerk",
    name: "스플릿 저크",
    category: "olympic",
    equipment: "barbell",
    icon: "🏋️",
    muscles: "전신",
    description: "스플릿 캐치 형태의 저크",
    view: "side",
    metrics: [
      "스플릿 거리",
      "바벨 위치",
      "균형"
    ]
  })

];


/* =========================================================
   10. POWER
========================================================= */

const POWER_EXERCISES = [

  createExercise({
    id: "jump-squat",
    name: "점프 스쿼트",
    category: "power",
    equipment: "bodyweight",
    icon: "⬆️",
    muscles: "대퇴사두근 · 둔근 · 종아리",
    description: "수직 폭발력을 강화하는 운동",
    view: "side",
    metrics: [
      "점프 높이",
      "무릎",
      "고관절",
      "착지"
    ]
  }),

  createExercise({
    id: "trapbar-jump",
    name: "트랩바 점프",
    category: "power",
    equipment: "other",
    icon: "⚡",
    muscles: "하체 · 둔근",
    description: "외부 저항을 이용한 점프 파워 운동",
    view: "side",
    metrics: [
      "점프 높이",
      "신전 속도",
      "착지"
    ]
  }),

  createExercise({
    id: "medicine-ball-slam",
    name: "메디신볼 슬램",
    category: "power",
    equipment: "medicineball",
    icon: "💥",
    muscles: "코어 · 광배근 · 어깨",
    description: "전신 파워를 이용해 볼을 바닥으로 던지는 운동",
    view: "side",
    metrics: [
      "몸통",
      "어깨",
      "고관절"
    ]
  }),

  createExercise({
    id: "medball-chest-pass",
    name: "메디신볼 체스트 패스",
    category: "power",
    equipment: "medicineball",
    icon: "💥",
    muscles: "가슴 · 삼두 · 코어",
    description: "상체 수평 파워 훈련",
    view: "side",
    metrics: [
      "팔꿈치",
      "몸통",
      "릴리스"
    ]
  }),

  createExercise({
    id: "medball-rotational-throw",
    name: "메디신볼 회전 던지기",
    category: "power",
    equipment: "medicineball",
    icon: "🔄",
    muscles: "코어 · 둔근 · 어깨",
    description: "회전 파워 훈련",
    view: "front",
    metrics: [
      "골반 회전",
      "몸통 회전",
      "타이밍"
    ]
  }),

  createExercise({
    id: "kettlebell-swing",
    name: "케틀벨 스윙",
    category: "power",
    equipment: "kettlebell",
    icon: "🔔",
    muscles: "둔근 · 햄스트링 · 코어",
    description: "힙힌지 기반 폭발적 운동",
    view: "side",
    metrics: [
      "고관절",
      "무릎",
      "몸통",
      "케틀벨 궤적"
    ]
  })

];


/* =========================================================
   11. PLYOMETRIC
========================================================= */

const PLYOMETRIC_EXERCISES = [

  createExercise({
    id: "countermovement-jump",
    name: "CMJ",
    category: "plyometric",
    equipment: "bodyweight",
    icon: "⬆️",
    muscles: "하체",
    description: "카운터무브먼트 점프",
    view: "side",
    metrics: [
      "점프 높이",
      "하강 깊이",
      "착지"
    ]
  }),

  createExercise({
    id: "squat-jump",
    name: "스쿼트 점프",
    category: "plyometric",
    equipment: "bodyweight",
    icon: "⬆️",
    muscles: "하체",
    description: "정지 스쿼트 자세에서 시작하는 점프",
    view: "side",
    metrics: [
      "점프 높이",
      "신전",
      "착지"
    ]
  }),

  createExercise({
    id: "box-jump",
    name: "박스 점프",
    category: "plyometric",
    equipment: "other",
    icon: "📦",
    muscles: "하체",
    description: "박스 위로 점프하는 플라이오메트릭 운동",
    view: "side",
    metrics: [
      "도약",
      "무릎",
      "착지"
    ]
  }),

  createExercise({
    id: "depth-jump",
    name: "뎁스 점프",
    category: "plyometric",
    equipment: "other",
    icon: "⬇️⬆️",
    muscles: "하체",
    description: "낮은 높이에서 내려온 뒤 반응성 점프를 수행",
    view: "side",
    metrics: [
      "착지",
      "전환",
      "점프"
    ]
  }),

  createExercise({
    id: "broad-jump",
    name: "제자리 멀리뛰기",
    category: "plyometric",
    equipment: "bodyweight",
    icon: "➡️",
    muscles: "하체 · 둔근",
    description: "수평 파워를 평가하고 훈련",
    view: "side",
    metrics: [
      "도약각",
      "거리",
      "착지"
    ]
  }),

  createExercise({
    id: "single-leg-hop",
    name: "싱글 레그 홉",
    category: "plyometric",
    equipment: "bodyweight",
    icon: "🦵",
    muscles: "하체 · 발목",
    description: "단측 점프 능력과 안정성을 평가",
    view: "front",
    metrics: [
      "좌우 차이",
      "무릎 정렬",
      "착지"
    ]
  }),

  createExercise({
    id: "lateral-bound",
    name: "라테랄 바운드",
    category: "plyometric",
    equipment: "bodyweight",
    icon: "↔️",
    muscles: "둔근 · 하체",
    description: "측면 점프와 착지 안정성 훈련",
    view: "front",
    metrics: [
      "이동 거리",
      "착지",
      "골반"
    ]
  }),

  createExercise({
    id: "pogo-jump",
    name: "포고 점프",
    category: "plyometric",
    equipment: "bodyweight",
    icon: "⬆️",
    muscles: "종아리 · 발목",
    description: "발목 반응성과 탄성을 강화",
    view: "side",
    metrics: [
      "발목",
      "접지 패턴"
    ]
  })

];


/* =========================================================
   12. FUNCTIONAL
========================================================= */

const FUNCTIONAL_EXERCISES = [

  createExercise({
    id: "sled-push",
    name: "슬레드 푸시",
    category: "functional",
    equipment: "other",
    icon: "➡️",
    muscles: "하체 · 코어 · 어깨",
    description: "슬레드를 밀며 전신 힘을 전달",
    view: "side",
    metrics: [
      "몸통 각도",
      "고관절",
      "보폭"
    ]
  }),

  createExercise({
    id: "sled-pull",
    name: "슬레드 풀",
    category: "functional",
    equipment: "other",
    icon: "⬅️",
    muscles: "하체 · 등 · 코어",
    description: "슬레드를 당기며 이동",
    view: "side",
    metrics: [
      "몸통",
      "보폭"
    ]
  }),

  createExercise({
    id: "battle-rope",
    name: "배틀로프",
    category: "functional",
    equipment: "other",
    icon: "〰️",
    muscles: "어깨 · 팔 · 코어",
    description: "상체 파워와 전신 컨디셔닝 운동",
    view: "front",
    metrics: [
      "좌우 대칭",
      "어깨",
      "몸통"
    ]
  }),

  createExercise({
    id: "turkish-getup",
    name: "터키시 겟업",
    category: "functional",
    equipment: "kettlebell",
    icon: "🔔",
    muscles: "전신 · 코어 · 어깨",
    description: "여러 자세 전환을 포함하는 전신 안정성 운동",
    view: "side",
    metrics: [
      "어깨",
      "고관절",
      "몸통",
      "균형"
    ]
  }),

  createExercise({
    id: "single-arm-carry",
    name: "수트케이스 캐리",
    category: "functional",
    equipment: "dumbbell",
    icon: "🚶",
    muscles: "코어 · 악력",
    description: "한쪽 중량을 들고 걷는 항측굴 운동",
    view: "front",
    metrics: [
      "몸통 기울기",
      "골반",
      "보행"
    ]
  }),

  createExercise({
    id: "bear-crawl",
    name: "베어 크롤",
    category: "functional",
    equipment: "bodyweight",
    icon: "🐾",
    muscles: "코어 · 어깨 · 고관절",
    description: "네발 자세로 이동하는 전신 협응 운동",
    view: "side",
    metrics: [
      "몸통",
      "골반",
      "사지 협응"
    ]
  })

];


/* =========================================================
   13. MOBILITY / CORRECTIVE
========================================================= */

const MOBILITY_EXERCISES = [

  createExercise({
    id: "ankle-mobility",
    name: "발목 가동성",
    category: "mobility",
    equipment: "bodyweight",
    icon: "🦶",
    muscles: "발목",
    description: "발목 배측굴곡 가동범위를 개선",
    view: "side",
    metrics: [
      "발목 ROM"
    ]
  }),

  createExercise({
    id: "hip-mobility",
    name: "고관절 가동성",
    category: "mobility",
    equipment: "bodyweight",
    icon: "🔄",
    muscles: "고관절",
    description: "고관절 움직임 범위를 개선",
    view: "front",
    metrics: [
      "고관절 ROM",
      "좌우 차이"
    ]
  }),

  createExercise({
    id: "thoracic-rotation",
    name: "흉추 회전",
    category: "mobility",
    equipment: "bodyweight",
    icon: "🔄",
    muscles: "흉추 · 코어",
    description: "흉추 회전 가동성 운동",
    view: "top",
    metrics: [
      "몸통 회전",
      "좌우 차이"
    ]
  }),

  createExercise({
    id: "shoulder-mobility",
    name: "어깨 가동성",
    category: "mobility",
    equipment: "band",
    icon: "🙆",
    muscles: "어깨",
    description: "어깨 관절 가동범위를 개선",
    view: "front",
    metrics: [
      "어깨 ROM",
      "좌우 차이"
    ]
  }),

  createExercise({
    id: "band-external-rotation",
    name: "밴드 외회전",
    category: "mobility",
    equipment: "band",
    icon: "↔️",
    muscles: "회전근개",
    description: "어깨 외회전근 강화",
    view: "front",
    metrics: [
      "팔꿈치",
      "어깨 회전"
    ]
  }),

  createExercise({
    id: "monster-walk",
    name: "몬스터 워크",
    category: "mobility",
    equipment: "band",
    icon: "🚶",
    muscles: "중둔근 · 둔근",
    description: "밴드를 이용한 고관절 안정성 운동",
    view: "front",
    metrics: [
      "무릎 정렬",
      "골반"
    ]
  }),

  createExercise({
    id: "copenhagen-plank",
    name: "코펜하겐 플랭크",
    category: "mobility",
    equipment: "bodyweight",
    icon: "━",
    muscles: "내전근 · 코어",
    description: "내전근과 측면 코어 강화",
    view: "front",
    metrics: [
      "골반",
      "몸통"
    ]
  }),

  createExercise({
    id: "nordic-hamstring",
    name: "노르딕 햄스트링",
    category: "mobility",
    equipment: "bodyweight",
    icon: "🦵",
    muscles: "햄스트링",
    description: "햄스트링 편심성 근력을 강화",
    view: "side",
    metrics: [
      "무릎",
      "몸통 정렬"
    ]
  })

];


/* =========================================================
   14. FULL BODY
========================================================= */

const FULLBODY_EXERCISES = [

  createExercise({
    id: "thruster",
    name: "쓰러스터",
    category: "fullbody",
    equipment: "barbell",
    icon: "🏋️",
    muscles: "하체 · 어깨 · 코어",
    description: "프론트 스쿼트와 프레스를 연결한 전신 운동",
    view: "side",
    metrics: [
      "무릎",
      "고관절",
      "어깨",
      "바벨 궤적"
    ]
  }),

  createExercise({
    id: "db-thruster",
    name: "덤벨 쓰러스터",
    category: "fullbody",
    equipment: "dumbbell",
    icon: "💪",
    muscles: "하체 · 어깨 · 코어",
    description: "덤벨 기반 전신 파워 운동",
    view: "front",
    metrics: [
      "좌우 대칭",
      "무릎",
      "어깨"
    ]
  }),

  createExercise({
    id: "burpee",
    name: "버피",
    category: "fullbody",
    equipment: "bodyweight",
    icon: "🏃",
    muscles: "전신",
    description: "전신 컨디셔닝 운동",
    view: "side",
    metrics: [
      "몸통",
      "고관절",
      "점프",
      "동작 리듬"
    ]
  }),

  createExercise({
    id: "devils-press",
    name: "데빌스 프레스",
    category: "fullbody",
    equipment: "dumbbell",
    icon: "🏋️",
    muscles: "전신",
    description: "버피와 덤벨 오버헤드 동작을 결합",
    view: "side",
    metrics: [
      "몸통",
      "고관절",
      "어깨"
    ]
  }),

  createExercise({
    id: "man-maker",
    name: "맨 메이커",
    category: "fullbody",
    equipment: "dumbbell",
    icon: "🏋️",
    muscles: "전신",
    description: "푸시업·로우·클린·프레스를 연결한 복합 운동",
    view: "side",
    metrics: [
      "몸통",
      "어깨",
      "고관절",
      "동작 연결"
    ]
  }),

  createExercise({
    id: "sandbag-clean",
    name: "샌드백 클린",
    category: "fullbody",
    equipment: "other",
    icon: "🎒",
    muscles: "전신 · 후면 체인",
    description: "샌드백을 이용한 전신 리프팅",
    view: "side",
    metrics: [
      "고관절",
      "몸통",
      "캐치"
    ]
  })

];


/* =========================================================
   15. COMPLETE DATABASE
========================================================= */

const EXERCISES = [

  ...LOWER_EXERCISES,

  ...CHEST_EXERCISES,

  ...BACK_EXERCISES,

  ...SHOULDER_EXERCISES,

  ...ARM_EXERCISES,

  ...CORE_EXERCISES,

  ...OLYMPIC_EXERCISES,

  ...POWER_EXERCISES,

  ...PLYOMETRIC_EXERCISES,

  ...FUNCTIONAL_EXERCISES,

  ...MOBILITY_EXERCISES,

  ...FULLBODY_EXERCISES

];


/* =========================================================
   16. SEARCH HELPERS
========================================================= */

function getExerciseById(id) {

  return EXERCISES.find(
    exercise => exercise.id === id
  ) || null;

}


function getExercisesByCategory(category) {

  if (category === "all") {
    return EXERCISES;
  }

  return EXERCISES.filter(
    exercise =>
      exercise.category === category
  );

}


function getExercisesByEquipment(equipment) {

  if (equipment === "all") {
    return EXERCISES;
  }

  return EXERCISES.filter(
    exercise =>
      exercise.equipment === equipment
  );

}


/* =========================================================
   17. SEARCH
========================================================= */

function searchExercises(keyword = "") {

  const query =
    keyword
      .trim()
      .toLowerCase();

  if (!query) {
    return EXERCISES;
  }

  return EXERCISES.filter(exercise => {

    const searchable = [

      exercise.name,

      exercise.muscles,

      exercise.description,

      exercise.category,

      exercise.equipment,

      ...exercise.metrics,

      ...exercise.checkpoints,

      ...exercise.recommendations

    ]
      .join(" ")
      .toLowerCase();

    return searchable.includes(query);

  });

}


/* =========================================================
   18. FILTER
========================================================= */

function filterExercises({
  category = "all",
  equipment = "all",
  keyword = ""
} = {}) {

  let result = [...EXERCISES];


  if (category !== "all") {

    result =
      result.filter(
        exercise =>
          exercise.category === category
      );

  }


  if (equipment !== "all") {

    result =
      result.filter(
        exercise =>
          exercise.equipment === equipment
      );

  }


  if (keyword.trim()) {

    const query =
      keyword
        .trim()
        .toLowerCase();

    result =
      result.filter(exercise => {

        const searchable = [

          exercise.name,

          exercise.muscles,

          exercise.description,

          ...exercise.metrics

        ]
          .join(" ")
          .toLowerCase();

        return searchable.includes(query);

      });

  }


  return result;

}


/* =========================================================
   19. CAMERA VIEW NAME
========================================================= */

function getViewName(view) {

  const names = {

    front: "정면",

    side: "측면",

    rear: "후면",

    top: "상단"

  };

  return names[view] || view;

}


/* =========================================================
   20. EQUIPMENT NAME
========================================================= */

function getEquipmentName(type) {

  const names = {

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

  return names[type] || type;

}


/* =========================================================
   21. CATEGORY NAME
========================================================= */

function getCategoryName(category) {

  return (
    EXERCISE_CATEGORIES[category]?.name ||
    category
  );

}


/* =========================================================
   22. RANDOM RECOMMENDATION FALLBACK
========================================================= */

function getGeneralRecommendations(
  exercise
) {

  if (!exercise) {

    return [
      "코어 안정화",
      "기초 가동성",
      "저강도 기술 연습"
    ];

  }


  if (
    exercise.recommendations &&
    exercise.recommendations.length
  ) {

    return exercise.recommendations;

  }


  const categoryRecommendations = {

    lower: [
      "고블릿 스쿼트",
      "스플릿 스쿼트",
      "힙 브리지",
      "발목 가동성",
      "고관절 가동성"
    ],

    chest: [
      "푸시업",
      "덤벨 프레스",
      "스캐풀라 푸시업",
      "밴드 외회전"
    ],

    back: [
      "랫풀다운",
      "페이스 풀",
      "시티드 로우",
      "흉추 가동성"
    ],

    shoulder: [
      "밴드 외회전",
      "페이스 풀",
      "어깨 가동성",
      "스캐풀라 컨트롤"
    ],

    arms: [
      "저중량 컨트롤",
      "편측 운동",
      "팔꿈치 안정화"
    ],

    core: [
      "데드버그",
      "버드독",
      "팔로프 프레스",
      "플랭크"
    ],

    olympic: [
      "기술 드릴",
      "클린 풀",
      "점프 스쿼트",
      "프론트 스쿼트"
    ],

    power: [
      "점프 스쿼트",
      "메디신볼 던지기",
      "케틀벨 스윙"
    ],

    plyometric: [
      "착지 드릴",
      "포고 점프",
      "싱글 레그 밸런스",
      "저강도 홉"
    ],

    functional: [
      "파머스 캐리",
      "팔로프 프레스",
      "베어 크롤"
    ],

    mobility: [
      "관절 가동성",
      "저강도 활성화",
      "좌우 균형 훈련"
    ],

    fullbody: [
      "기초 패턴 훈련",
      "코어 안정화",
      "힙힌지",
      "스쿼트 패턴"
    ]

  };


  return (
    categoryRecommendations[
      exercise.category
    ] || []
  );

}


/* =========================================================
   23. ANALYSIS CONFIG GENERATOR
========================================================= */

function createAnalysisConfig(
  exerciseId
) {

  const exercise =
    getExerciseById(exerciseId);


  if (!exercise) {
    return null;
  }


  return {

    exerciseId:
      exercise.id,

    exerciseName:
      exercise.name,

    recommendedView:
      exercise.view,

    metrics:
      exercise.metrics,

    checkpoints:
      exercise.checkpoints,

    recommendations:
      getGeneralRecommendations(
        exercise
      ),

    angleTargets:
      exercise.angleTargets,

    poseModel: {
      landmarkCount: 33,
      mode2D: true,
      mode3D: true,
      skeleton: true
    }

  };

}


/* =========================================================
   24. 33 LANDMARK INFORMATION

   MediaPipe Pose landmark index
========================================================= */

const POSE_LANDMARKS = {

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

  LEFT_FOOT_INDEX: 31,
  RIGHT_FOOT_INDEX: 32

};


/* =========================================================
   25. BODY SEGMENTS

   analysis.js에서 스켈레톤을 직접 그릴 때 사용
========================================================= */

const POSE_CONNECTIONS_CUSTOM = [

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
  [27, 31],

  [28, 30],
  [30, 32],
  [28, 32]

];


/* =========================================================
   26. IMPORTANT ANGLE JOINTS
========================================================= */

const JOINT_ANGLE_POINTS = {

  leftElbow: [
    11,
    13,
    15
  ],

  rightElbow: [
    12,
    14,
    16
  ],

  leftShoulder: [
    13,
    11,
    23
  ],

  rightShoulder: [
    14,
    12,
    24
  ],

  leftHip: [
    11,
    23,
    25
  ],

  rightHip: [
    12,
    24,
    26
  ],

  leftKnee: [
    23,
    25,
    27
  ],

  rightKnee: [
    24,
    26,
    28
  ],

  leftAnkle: [
    25,
    27,
    31
  ],

  rightAnkle: [
    26,
    28,
    32
  ]

};


/* =========================================================
   27. EXPORT TO WINDOW

   다른 JS 파일에서 사용
========================================================= */

window.EXERCISES =
  EXERCISES;

window.EXERCISE_CATEGORIES =
  EXERCISE_CATEGORIES;

window.POSE_LANDMARKS =
  POSE_LANDMARKS;

window.POSE_CONNECTIONS_CUSTOM =
  POSE_CONNECTIONS_CUSTOM;

window.JOINT_ANGLE_POINTS =
  JOINT_ANGLE_POINTS;

window.getExerciseById =
  getExerciseById;

window.getExercisesByCategory =
  getExercisesByCategory;

window.getExercisesByEquipment =
  getExercisesByEquipment;

window.searchExercises =
  searchExercises;

window.filterExercises =
  filterExercises;

window.getViewName =
  getViewName;

window.getEquipmentName =
  getEquipmentName;

window.getCategoryName =
  getCategoryName;

window.getGeneralRecommendations =
  getGeneralRecommendations;

window.createAnalysisConfig =
  createAnalysisConfig;


/* =========================================================
   28. DATABASE CHECK
========================================================= */

console.log(
  `[WEIGHT PERFORMANCE LAB] ${EXERCISES.length} exercises loaded.`
);

console.log(
  "[POSE ENGINE] 33 landmark skeleton configuration ready."
);