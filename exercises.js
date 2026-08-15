/* =========================================================
   SEOLCHEON HIGH SCHOOL
   WEIGHT PERFORMANCE LAB
   exercises.js

   - Exercise Database
   - Category
   - Equipment
   - Pictogram
   - Motion Analysis Standard
   - Camera View
   - Checkpoints
   - Corrective Training
========================================================= */

"use strict";


/* =========================================================
   01. CATEGORY
========================================================= */

const EXERCISE_CATEGORIES = {

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
   02. EQUIPMENT
========================================================= */

const EQUIPMENT_NAMES = {

  barbell: "바벨",

  dumbbell: "덤벨",

  machine: "머신",

  cable: "케이블",

  bodyweight: "맨몸",

  kettlebell: "케틀벨",

  band: "밴드",

  medicineball: "메디신볼",

  box: "박스",

  landmine: "랜드마인",

  trx: "TRX",

  bench: "벤치",

  sled: "슬레드",

  other: "기타"

};


/* =========================================================
   03. HELPER
========================================================= */

function createExercise(
  id,
  name,
  category,
  equipment,
  icon,
  muscles,
  view,
  description,
  metrics = [],
  checkpoints = [],
  recommendations = []
) {

  return {

    id,

    name,

    category,

    equipment,

    icon,

    muscles,

    view,

    description,

    metrics,

    checkpoints,

    recommendations

  };

}


/* =========================================================
   04. EXERCISE DATABASE
========================================================= */

const WEIGHT_EXERCISES = [

/* =========================================================
   LOWER BODY
========================================================= */

createExercise(
  "back-squat",
  "백 스쿼트",
  "lower",
  "barbell",
  "🏋️",
  "대퇴사두근 · 둔근 · 햄스트링 · 코어",
  "side",
  "대표적인 하체 복합 근력 운동",
  ["무릎 각도", "고관절 각도", "몸통 기울기", "발목 ROM", "대칭성", "바벨 궤적"],
  [
    "무릎과 발끝 방향 정렬",
    "좌우 골반 높이 확인",
    "허리 중립 유지",
    "바벨 수직 궤적 확인"
  ],
  [
    "고블릿 스쿼트",
    "스플릿 스쿼트",
    "발목 가동성",
    "데드버그",
    "힙 어브덕션"
  ]
),

createExercise(
  "front-squat",
  "프론트 스쿼트",
  "lower",
  "barbell",
  "🏋️",
  "대퇴사두근 · 둔근 · 코어",
  "side",
  "바벨을 전면에 위치시키는 스쿼트",
  ["무릎 각도", "몸통 기울기", "고관절 ROM", "바벨 궤적"],
  [
    "상체 과도한 전방 기울기 확인",
    "팔꿈치 높이 유지",
    "발뒤꿈치 접촉 유지"
  ],
  [
    "고블릿 스쿼트",
    "프론트랙 모빌리티",
    "발목 모빌리티",
    "코어 브레이싱"
  ]
),

createExercise(
  "goblet-squat",
  "고블릿 스쿼트",
  "lower",
  "dumbbell",
  "🏋️",
  "대퇴사두근 · 둔근 · 코어",
  "front",
  "덤벨을 가슴 앞에 들고 수행하는 스쿼트",
  ["무릎 정렬", "골반 대칭", "스쿼트 깊이"],
  [
    "좌우 무릎 이동 비교",
    "골반 좌우 이동 확인",
    "발바닥 접촉 유지"
  ],
  [
    "발목 가동성",
    "밴드 사이드워크",
    "스플릿 스쿼트"
  ]
),

createExercise(
  "overhead-squat",
  "오버헤드 스쿼트",
  "lower",
  "barbell",
  "🏋️",
  "전신 · 코어 · 어깨 · 하체",
  "front",
  "바벨을 머리 위에 유지하면서 수행하는 스쿼트",
  ["어깨 ROM", "몸통 안정성", "무릎 정렬", "고관절 ROM"],
  [
    "바벨이 발 중심 위에 위치",
    "팔꿈치 잠금 유지",
    "몸통 회전 확인"
  ],
  [
    "흉추 모빌리티",
    "숄더 플렉션",
    "고블릿 스쿼트",
    "오버헤드 홀드"
  ]
),

createExercise(
  "box-squat",
  "박스 스쿼트",
  "lower",
  "barbell",
  "🏋️",
  "둔근 · 햄스트링 · 대퇴사두근",
  "side",
  "박스를 이용해 깊이를 조절하는 스쿼트",
  ["고관절 각도", "무릎 각도", "몸통 각도"],
  [
    "박스 접촉 위치",
    "상체 중립 유지",
    "상승 시 좌우 균형"
  ],
  [
    "힙 브리지",
    "스플릿 스쿼트",
    "코어 브레이싱"
  ]
),

createExercise(
  "pause-squat",
  "포즈 스쿼트",
  "lower",
  "barbell",
  "🏋️",
  "대퇴사두근 · 둔근 · 코어",
  "side",
  "최저점에서 정지하는 스쿼트",
  ["최저점 안정성", "몸통 각도", "바벨 이동"],
  [
    "최저점에서 흔들림 확인",
    "무릎 정렬",
    "바벨 중심 유지"
  ],
  [
    "템포 스쿼트",
    "고블릿 스쿼트",
    "코어 안정화"
  ]
),

createExercise(
  "split-squat",
  "스플릿 스쿼트",
  "lower",
  "dumbbell",
  "🦵",
  "둔근 · 대퇴사두근 · 햄스트링",
  "front",
  "한쪽 다리 중심의 하체 운동",
  ["골반 대칭", "무릎 정렬", "몸통 안정성"],
  [
    "앞무릎 안쪽 붕괴 확인",
    "골반 회전 확인",
    "좌우 수행 비교"
  ],
  [
    "밴드 사이드워크",
    "싱글레그 브리지",
    "힙 어브덕션"
  ]
),

createExercise(
  "bulgarian-split-squat",
  "불가리안 스플릿 스쿼트",
  "lower",
  "dumbbell",
  "🦵",
  "둔근 · 대퇴사두근 · 햄스트링",
  "front",
  "후방 다리를 벤치에 올려 수행하는 단측 운동",
  ["무릎 정렬", "골반 안정성", "좌우 대칭"],
  [
    "골반 좌우 기울기",
    "무릎 내측 이동",
    "몸통 회전"
  ],
  [
    "싱글레그 RDL",
    "힙 어브덕션",
    "사이드 플랭크",
    "밴드 사이드워크"
  ]
),

createExercise(
  "reverse-lunge",
  "리버스 런지",
  "lower",
  "dumbbell",
  "🦵",
  "둔근 · 대퇴사두근",
  "front",
  "뒤로 스텝하며 수행하는 런지",
  ["무릎 정렬", "골반 대칭", "스텝 거리"],
  [
    "무릎과 발 정렬",
    "골반 회전",
    "좌우 스텝 차이"
  ],
  [
    "스플릿 스쿼트",
    "싱글레그 밸런스",
    "힙 안정화"
  ]
),

createExercise(
  "forward-lunge",
  "포워드 런지",
  "lower",
  "dumbbell",
  "🦵",
  "대퇴사두근 · 둔근",
  "front",
  "전방으로 스텝하는 런지",
  ["무릎 정렬", "충격 안정성", "골반 안정성"],
  [
    "착지 후 무릎 흔들림",
    "골반 좌우 이동",
    "상체 안정"
  ],
  [
    "스텝다운",
    "밴드 워크",
    "싱글레그 스쿼트"
  ]
),

createExercise(
  "walking-lunge",
  "워킹 런지",
  "lower",
  "dumbbell",
  "🚶",
  "대퇴사두근 · 둔근 · 햄스트링",
  "front",
  "전진하면서 반복하는 런지",
  ["보폭", "무릎 정렬", "골반 안정성"],
  [
    "좌우 보폭 차이",
    "몸통 좌우 흔들림",
    "무릎 정렬"
  ],
  [
    "리버스 런지",
    "싱글레그 밸런스",
    "힙 안정화"
  ]
),

createExercise(
  "step-up",
  "스텝업",
  "lower",
  "box",
  "🦵",
  "둔근 · 대퇴사두근",
  "front",
  "박스 위로 올라가는 단측 하체 운동",
  ["무릎 정렬", "골반 높이", "좌우 차이"],
  [
    "반대쪽 다리 반동 확인",
    "무릎 내측 이동",
    "골반 안정"
  ],
  [
    "스플릿 스쿼트",
    "싱글레그 스쿼트",
    "힙 어브덕션"
  ]
),

createExercise(
  "single-leg-squat",
  "싱글레그 스쿼트",
  "lower",
  "bodyweight",
  "🦵",
  "둔근 · 대퇴사두근 · 코어",
  "front",
  "한 다리로 수행하는 스쿼트",
  ["무릎 정렬", "골반 대칭", "몸통 이동"],
  [
    "무릎 안쪽 붕괴",
    "골반 반대쪽 하강",
    "몸통 회전"
  ],
  [
    "스텝다운",
    "밴드 사이드워크",
    "사이드 플랭크",
    "싱글레그 브리지"
  ]
),

createExercise(
  "leg-press",
  "레그프레스",
  "lower",
  "machine",
  "🦵",
  "대퇴사두근 · 둔근",
  "side",
  "머신 기반 하체 프레스",
  ["무릎 ROM", "좌우 대칭"],
  [
    "무릎 과도한 내측 이동",
    "좌우 발 압력 차이",
    "골반 들림"
  ],
  [
    "스쿼트",
    "스플릿 스쿼트",
    "발목 모빌리티"
  ]
),

createExercise(
  "leg-extension",
  "레그 익스텐션",
  "lower",
  "machine",
  "🦵",
  "대퇴사두근",
  "side",
  "무릎 신전 중심 머신 운동",
  ["무릎 ROM", "좌우 차이"],
  [
    "무릎 신전 범위",
    "좌우 속도 차이"
  ],
  [
    "스텝업",
    "스플릿 스쿼트"
  ]
),

createExercise(
  "leg-curl",
  "레그 컬",
  "lower",
  "machine",
  "🦵",
  "햄스트링",
  "side",
  "무릎 굴곡 중심 햄스트링 운동",
  ["무릎 ROM", "좌우 대칭"],
  [
    "골반 움직임 최소화",
    "좌우 ROM 비교"
  ],
  [
    "RDL",
    "노르딕 햄스트링",
    "싱글레그 브리지"
  ]
),

createExercise(
  "nordic-curl",
  "노르딕 햄스트링 컬",
  "lower",
  "bodyweight",
  "🦵",
  "햄스트링",
  "side",
  "햄스트링 편심성 근력 운동",
  ["몸통 정렬", "고관절 고정", "하강 제어"],
  [
    "고관절 굴곡 보상",
    "몸통 일직선 유지",
    "하강 속도"
  ],
  [
    "슬라이더 레그컬",
    "RDL",
    "햄스트링 브리지"
  ]
),

createExercise(
  "hip-thrust",
  "힙 쓰러스트",
  "lower",
  "barbell",
  "🏋️",
  "둔근 · 햄스트링",
  "side",
  "고관절 신전 중심 운동",
  ["고관절 각도", "몸통 위치", "좌우 대칭"],
  [
    "최상단 고관절 완전 신전",
    "허리 과신전 확인",
    "좌우 골반 높이"
  ],
  [
    "글루트 브리지",
    "밴드 어브덕션",
    "RDL"
  ]
),

createExercise(
  "glute-bridge",
  "글루트 브리지",
  "lower",
  "bodyweight",
  "🦵",
  "둔근 · 햄스트링",
  "side",
  "기초 고관절 신전 운동",
  ["고관절 신전", "골반 대칭"],
  [
    "허리 과신전",
    "골반 좌우 차이"
  ],
  [
    "힙 쓰러스트",
    "싱글레그 브리지"
  ]
),

createExercise(
  "calf-raise",
  "카프 레이즈",
  "lower",
  "bodyweight",
  "🦶",
  "비복근 · 가자미근",
  "rear",
  "발목 저측굴곡 근력 운동",
  ["발목 ROM", "좌우 대칭"],
  [
    "발목 좌우 흔들림",
    "최상단 높이",
    "좌우 높이 비교"
  ],
  [
    "싱글레그 카프레이즈",
    "발목 안정화"
  ]
),

/* =========================================================
   DEADLIFT / POSTERIOR CHAIN
========================================================= */

createExercise(
  "deadlift",
  "컨벤셔널 데드리프트",
  "lower",
  "barbell",
  "🏋️",
  "둔근 · 햄스트링 · 척추기립근 · 광배근",
  "side",
  "대표적인 힙힌지 근력 운동",
  ["고관절 각도", "무릎 각도", "몸통 각도", "바벨 궤적"],
  [
    "바벨이 몸에서 멀어지지 않는지 확인",
    "허리 중립",
    "고관절과 무릎 신전 타이밍"
  ],
  [
    "RDL",
    "힙힌지 드릴",
    "데드버그",
    "백 익스텐션"
  ]
),

createExercise(
  "sumo-deadlift",
  "스모 데드리프트",
  "lower",
  "barbell",
  "🏋️",
  "둔근 · 내전근 · 햄스트링",
  "front",
  "넓은 스탠스로 수행하는 데드리프트",
  ["무릎 정렬", "골반 대칭", "바벨 궤적"],
  [
    "무릎과 발끝 정렬",
    "골반 회전",
    "좌우 락아웃"
  ],
  [
    "고블릿 스쿼트",
    "내전근 모빌리티",
    "힙 안정화"
  ]
),

createExercise(
  "romanian-deadlift",
  "루마니안 데드리프트",
  "lower",
  "barbell",
  "🏋️",
  "햄스트링 · 둔근 · 척추기립근",
  "side",
  "힙힌지 중심 후면사슬 운동",
  ["고관절 ROM", "몸통 각도", "바벨 거리"],
  [
    "무릎 각도 과도한 변화 확인",
    "바벨과 다리 거리",
    "허리 중립"
  ],
  [
    "힙힌지 드릴",
    "햄스트링 모빌리티",
    "백 익스텐션"
  ]
),

createExercise(
  "single-leg-rdl",
  "싱글레그 RDL",
  "lower",
  "dumbbell",
  "🦵",
  "햄스트링 · 둔근 · 코어",
  "rear",
  "한 다리 힙힌지 운동",
  ["골반 회전", "좌우 균형", "몸통 안정성"],
  [
    "골반 열림",
    "지지 무릎 정렬",
    "몸통 회전"
  ],
  [
    "싱글레그 밸런스",
    "밴드 사이드워크",
    "사이드 플랭크"
  ]
),

createExercise(
  "trapbar-deadlift",
  "트랩바 데드리프트",
  "lower",
  "other",
  "🏋️",
  "대퇴사두근 · 둔근 · 햄스트링",
  "side",
  "트랩바를 이용한 데드리프트",
  ["무릎 각도", "고관절 각도", "몸통 각도"],
  [
    "몸통 중립",
    "좌우 힘 전달",
    "락아웃"
  ],
  [
    "힙힌지",
    "스쿼트",
    "코어 브레이싱"
  ]
),

/* =========================================================
   CHEST
========================================================= */

createExercise(
  "bench-press",
  "벤치프레스",
  "chest",
  "barbell",
  "🏋️",
  "대흉근 · 삼두근 · 전면삼각근",
  "front",
  "대표적인 상체 프레스 운동",
  ["팔꿈치 각도", "바벨 좌우 대칭", "바벨 궤적"],
  [
    "바벨 좌우 기울기",
    "손목 정렬",
    "팔꿈치 좌우 각도"
  ],
  [
    "덤벨 벤치프레스",
    "푸시업",
    "페이스풀",
    "회전근개 강화"
  ]
),

createExercise(
  "incline-bench",
  "인클라인 벤치프레스",
  "chest",
  "barbell",
  "🏋️",
  "상부 대흉근 · 삼두 · 전면삼각근",
  "front",
  "상부 가슴 중심 프레스",
  ["팔꿈치 대칭", "바벨 궤적", "어깨 안정성"],
  [
    "바벨 좌우 이동",
    "어깨 들림",
    "손목 정렬"
  ],
  [
    "인클라인 덤벨프레스",
    "페이스풀",
    "밴드 외회전"
  ]
),

createExercise(
  "dumbbell-bench",
  "덤벨 벤치프레스",
  "chest",
  "dumbbell",
  "🏋️",
  "대흉근 · 삼두근",
  "front",
  "덤벨을 이용한 수평 프레스",
  ["좌우 ROM", "팔꿈치 각도", "대칭성"],
  [
    "덤벨 높이 차이",
    "팔꿈치 좌우 각도",
    "어깨 안정"
  ],
  [
    "푸시업",
    "싱글암 프레스",
    "회전근개 강화"
  ]
),

createExercise(
  "push-up",
  "푸시업",
  "chest",
  "bodyweight",
  "🤸",
  "가슴 · 삼두 · 코어",
  "side",
  "기본 상체 밀기 운동",
  ["팔꿈치 각도", "몸통 정렬", "고관절 위치"],
  [
    "머리-몸통-골반 정렬",
    "팔꿈치 방향",
    "좌우 어깨 높이"
  ],
  [
    "플랭크",
    "스캐풀라 푸시업",
    "덤벨 프레스"
  ]
),

createExercise(
  "dip",
  "딥스",
  "chest",
  "bodyweight",
  "🤸",
  "가슴 · 삼두 · 어깨",
  "front",
  "평행봉 상체 프레스",
  ["어깨 대칭", "팔꿈치 ROM", "몸통 안정성"],
  [
    "어깨 과도한 전방 이동",
    "좌우 하강 차이",
    "몸통 흔들림"
  ],
  [
    "푸시업",
    "벤치 딥",
    "삼두 강화"
  ]
),

/* =========================================================
   BACK
========================================================= */

createExercise(
  "pull-up",
  "풀업",
  "back",
  "bodyweight",
  "🧗",
  "광배근 · 이두근 · 능형근",
  "front",
  "수직 당기기 운동",
  ["어깨 높이", "팔꿈치 ROM", "몸통 흔들림"],
  [
    "좌우 어깨 높이",
    "몸통 회전",
    "턱 위치"
  ],
  [
    "랫풀다운",
    "스캐풀라 풀업",
    "페이스풀"
  ]
),

createExercise(
  "chin-up",
  "친업",
  "back",
  "bodyweight",
  "🧗",
  "광배근 · 이두근",
  "front",
  "언더그립 수직 당기기",
  ["팔꿈치 ROM", "좌우 대칭"],
  [
    "좌우 당김 높이",
    "몸통 흔들림"
  ],
  [
    "랫풀다운",
    "바벨 컬",
    "스캐풀라 풀업"
  ]
),

createExercise(
  "lat-pulldown",
  "랫풀다운",
  "back",
  "cable",
  "🏋️",
  "광배근 · 이두근",
  "front",
  "케이블 수직 당기기 운동",
  ["팔꿈치 각도", "어깨 대칭", "몸통 각도"],
  [
    "몸통 과도한 후방 기울기",
    "좌우 팔꿈치 높이",
    "어깨 으쓱임"
  ],
  [
    "풀업",
    "스트레이트암 풀다운",
    "페이스풀"
  ]
),

createExercise(
  "barbell-row",
  "바벨 로우",
  "back",
  "barbell",
  "🏋️",
  "광배근 · 능형근 · 후면삼각근",
  "side",
  "바벨 수평 당기기",
  ["몸통 각도", "바벨 궤적", "팔꿈치 이동"],
  [
    "몸통 각도 유지",
    "허리 중립",
    "바벨 경로"
  ],
  [
    "체스트서포티드 로우",
    "페이스풀",
    "RDL"
  ]
),

createExercise(
  "dumbbell-row",
  "원암 덤벨 로우",
  "back",
  "dumbbell",
  "🏋️",
  "광배근 · 능형근",
  "rear",
  "단측 수평 당기기",
  ["몸통 회전", "팔꿈치 이동", "어깨 위치"],
  [
    "몸통 과도한 회전",
    "어깨 으쓱임",
    "좌우 ROM"
  ],
  [
    "케이블 로우",
    "페이스풀",
    "사이드 플랭크"
  ]
),

createExercise(
  "seated-row",
  "시티드 케이블 로우",
  "back",
  "cable",
  "🏋️",
  "광배근 · 능형근",
  "side",
  "앉아서 수행하는 수평 당기기",
  ["몸통 각도", "팔꿈치 ROM"],
  [
    "몸통 반동",
    "어깨 전방 이동",
    "팔꿈치 경로"
  ],
  [
    "체스트서포티드 로우",
    "페이스풀"
  ]
),

createExercise(
  "face-pull",
  "페이스풀",
  "back",
  "cable",
  "🏋️",
  "후면삼각근 · 회전근개 · 능형근",
  "front",
  "견갑 안정성과 후면 어깨 강화",
  ["어깨 대칭", "팔꿈치 위치"],
  [
    "팔꿈치 높이",
    "좌우 ROM",
    "몸통 반동"
  ],
  [
    "밴드 외회전",
    "Y 레이즈",
    "리버스 플라이"
  ]
),

/* =========================================================
   SHOULDER
========================================================= */

createExercise(
  "overhead-press",
  "오버헤드 프레스",
  "shoulder",
  "barbell",
  "🏋️",
  "삼각근 · 삼두근 · 코어",
  "front",
  "바벨 수직 프레스",
  ["어깨 ROM", "팔꿈치 대칭", "바벨 궤적"],
  [
    "바벨 좌우 기울기",
    "허리 과신전",
    "머리와 바벨 위치"
  ],
  [
    "랜드마인 프레스",
    "덤벨 숄더프레스",
    "흉추 모빌리티",
    "회전근개 강화"
  ]
),

createExercise(
  "dumbbell-shoulder-press",
  "덤벨 숄더프레스",
  "shoulder",
  "dumbbell",
  "🏋️",
  "삼각근 · 삼두근",
  "front",
  "덤벨 수직 프레스",
  ["좌우 ROM", "팔꿈치 대칭"],
  [
    "덤벨 높이 차이",
    "허리 과신전",
    "어깨 으쓱임"
  ],
  [
    "랜드마인 프레스",
    "밴드 외회전",
    "페이스풀"
  ]
),

createExercise(
  "lateral-raise",
  "레터럴 레이즈",
  "shoulder",
  "dumbbell",
  "🏋️",
  "측면삼각근",
  "front",
  "어깨 외전 운동",
  ["좌우 높이", "팔꿈치 각도"],
  [
    "좌우 높이 차이",
    "몸통 반동",
    "어깨 으쓱임"
  ],
  [
    "케이블 레터럴레이즈",
    "회전근개 강화"
  ]
),

createExercise(
  "rear-delt-fly",
  "리버스 플라이",
  "shoulder",
  "dumbbell",
  "🏋️",
  "후면삼각근 · 능형근",
  "rear",
  "후면 어깨 강화",
  ["좌우 ROM", "견갑 움직임"],
  [
    "몸통 회전",
    "좌우 높이 차이"
  ],
  [
    "페이스풀",
    "Y 레이즈"
  ]
),

/* =========================================================
   ARMS
========================================================= */

createExercise(
  "barbell-curl",
  "바벨 컬",
  "arms",
  "barbell",
  "💪",
  "이두근",
  "front",
  "바벨 이두근 운동",
  ["팔꿈치 위치", "좌우 ROM"],
  [
    "팔꿈치 전방 이동",
    "몸통 반동",
    "좌우 높이"
  ],
  [
    "덤벨 컬",
    "해머 컬"
  ]
),

createExercise(
  "hammer-curl",
  "해머 컬",
  "arms",
  "dumbbell",
  "💪",
  "상완근 · 이두근",
  "front",
  "뉴트럴 그립 컬",
  ["팔꿈치 ROM", "좌우 대칭"],
  [
    "팔꿈치 고정",
    "몸통 반동"
  ],
  [
    "바벨 컬",
    "케이블 컬"
  ]
),

createExercise(
  "triceps-pushdown",
  "트라이셉스 푸시다운",
  "arms",
  "cable",
  "💪",
  "삼두근",
  "side",
  "케이블 삼두 신전 운동",
  ["팔꿈치 위치", "ROM"],
  [
    "팔꿈치 고정",
    "어깨 움직임 최소화"
  ],
  [
    "클로즈그립 푸시업",
    "덤벨 트라이셉스 익스텐션"
  ]
),

/* =========================================================
   CORE
========================================================= */

createExercise(
  "plank",
  "플랭크",
  "core",
  "bodyweight",
  "🤸",
  "복횡근 · 복직근 · 둔근",
  "side",
  "기본 코어 안정화 운동",
  ["몸통 정렬", "골반 높이"],
  [
    "허리 처짐",
    "골반 과도한 상승",
    "머리 위치"
  ],
  [
    "데드버그",
    "사이드 플랭크",
    "버드독"
  ]
),

createExercise(
  "side-plank",
  "사이드 플랭크",
  "core",
  "bodyweight",
  "🤸",
  "복사근 · 중둔근",
  "front",
  "측면 코어 안정화 운동",
  ["골반 높이", "몸통 정렬"],
  [
    "골반 하강",
    "몸통 회전"
  ],
  [
    "팔로프 프레스",
    "사이드 플랭크 리치"
  ]
),

createExercise(
  "dead-bug",
  "데드버그",
  "core",
  "bodyweight",
  "🤸",
  "심부 코어",
  "top",
  "요추 안정화 운동",
  ["골반 안정성", "좌우 대칭"],
  [
    "허리 들림",
    "골반 회전",
    "좌우 ROM"
  ],
  [
    "플랭크",
    "버드독",
    "팔로프 프레스"
  ]
),

createExercise(
  "bird-dog",
  "버드독",
  "core",
  "bodyweight",
  "🤸",
  "코어 · 둔근 · 척추 안정근",
  "rear",
  "교차 사지 코어 안정화",
  ["골반 회전", "몸통 안정성"],
  [
    "골반 회전",
    "허리 과신전"
  ],
  [
    "데드버그",
    "플랭크"
  ]
),

createExercise(
  "pallof-press",
  "팔로프 프레스",
  "core",
  "cable",
  "🤸",
  "복사근 · 심부 코어",
  "front",
  "회전 저항 코어 운동",
  ["몸통 회전", "골반 안정성"],
  [
    "몸통 회전",
    "골반 이동"
  ],
  [
    "사이드 플랭크",
    "데드버그"
  ]
),

createExercise(
  "hanging-leg-raise",
  "행잉 레그레이즈",
  "core",
  "bodyweight",
  "🤸",
  "복직근 · 고관절 굴곡근",
  "side",
  "매달린 상태에서 다리를 들어올리는 코어 운동",
  ["고관절 ROM", "몸통 흔들림"],
  [
    "반동",
    "허리 과신전",
    "좌우 다리 높이"
  ],
  [
    "니레이즈",
    "데드버그",
    "플랭크"
  ]
),

/* =========================================================
   OLYMPIC LIFTING
========================================================= */

createExercise(
  "power-clean",
  "파워 클린",
  "olympic",
  "barbell",
  "🏋️",
  "둔근 · 햄스트링 · 대퇴사두근 · 승모근",
  "side",
  "폭발적인 전신 파워 운동",
  ["바벨 궤적", "고관절 신전", "캐치 각도", "속도"],
  [
    "바벨이 몸 가까이 이동",
    "완전한 고관절 신전",
    "캐치 좌우 대칭"
  ],
  [
    "클린 풀",
    "점프 슈러그",
    "프론트 스쿼트",
    "행 파워클린"
  ]
),

createExercise(
  "hang-clean",
  "행 클린",
  "olympic",
  "barbell",
  "🏋️",
  "둔근 · 햄스트링 · 승모근",
  "side",
  "행 포지션에서 시작하는 클린",
  ["바벨 궤적", "폭발적 신전", "캐치"],
  [
    "바벨과 몸 거리",
    "고관절 신전 타이밍",
    "캐치 안정성"
  ],
  [
    "클린 풀",
    "점프 슈러그",
    "프론트 스쿼트"
  ]
),

createExercise(
  "clean-pull",
  "클린 풀",
  "olympic",
  "barbell",
  "🏋️",
  "둔근 · 햄스트링 · 승모근",
  "side",
  "클린의 풀 동작을 강화하는 운동",
  ["바벨 궤적", "신전 타이밍"],
  [
    "바벨 수직 이동",
    "무릎-고관절 신전 타이밍"
  ],
  [
    "데드리프트",
    "점프 슈러그",
    "행 클린"
  ]
),

createExercise(
  "power-snatch",
  "파워 스내치",
  "olympic",
  "barbell",
  "🏋️",
  "전신 · 어깨 · 둔근 · 햄스트링",
  "side",
  "바벨을 한 번에 머리 위로 이동시키는 파워 운동",
  ["바벨 궤적", "고관절 신전", "캐치 안정성"],
  [
    "바벨과 몸 거리",
    "오버헤드 안정성",
    "캐치 대칭"
  ],
  [
    "스내치 풀",
    "오버헤드 스쿼트",
    "행 스내치"
  ]
),

createExercise(
  "hang-snatch",
  "행 스내치",
  "olympic",
  "barbell",
  "🏋️",
  "전신 · 어깨 · 둔근",
  "side",
  "행 포지션 스내치",
  ["바벨 궤적", "신전 속도", "캐치"],
  [
    "고관절 완전 신전",
    "바벨 수직 이동",
    "오버헤드 안정"
  ],
  [
    "스내치 풀",
    "오버헤드 스쿼트"
  ]
),

createExercise(
  "push-press",
  "푸시 프레스",
  "olympic",
  "barbell",
  "🏋️",
  "어깨 · 삼두 · 하체",
  "side",
  "하체 반동을 이용한 오버헤드 프레스",
  ["딥 각도", "바벨 궤적", "락아웃"],
  [
    "딥 수직 이동",
    "바벨 중심 유지",
    "오버헤드 락아웃"
  ],
  [
    "오버헤드 프레스",
    "점프 스쿼트",
    "랜드마인 프레스"
  ]
),

createExercise(
  "split-jerk",
  "스플릿 저크",
  "olympic",
  "barbell",
  "🏋️",
  "전신 · 어깨 · 하체",
  "front",
  "스플릿 스탠스로 바벨을 캐치하는 저크",
  ["스플릿 폭", "골반 정렬", "오버헤드 안정성"],
  [
    "앞뒤 발 위치",
    "골반 회전",
    "바벨 좌우 위치"
  ],
  [
    "푸시 프레스",
    "스플릿 스쿼트",
    "오버헤드 홀드"
  ]
),

/* =========================================================
   POWER
========================================================= */

createExercise(
  "jump-squat",
  "점프 스쿼트",
  "power",
  "bodyweight",
  "⚡",
  "둔근 · 대퇴사두근 · 종아리",
  "front",
  "수직 폭발력 운동",
  ["점프 높이", "착지 대칭", "무릎 정렬"],
  [
    "좌우 착지 시간",
    "무릎 내측 붕괴",
    "착지 충격 흡수"
  ],
  [
    "스쿼트",
    "포고 점프",
    "박스 점프",
    "스냅다운"
  ]
),

createExercise(
  "kettlebell-swing",
  "케틀벨 스윙",
  "power",
  "kettlebell",
  "⚡",
  "둔근 · 햄스트링 · 코어",
  "side",
  "폭발적 힙힌지 운동",
  ["고관절 신전", "몸통 각도", "케틀벨 궤적"],
  [
    "스쿼트 형태로 변하지 않는지",
    "고관절 폭발적 신전",
    "허리 중립"
  ],
  [
    "RDL",
    "힙힌지 드릴",
    "브로드 점프"
  ]
),

createExercise(
  "medicine-ball-slam",
  "메디신볼 슬램",
  "power",
  "medicineball",
  "⚡",
  "광배근 · 코어 · 어깨",
  "front",
  "상체와 코어의 폭발적 파워 운동",
  ["몸통 굴곡", "팔 대칭", "속도"],
  [
    "좌우 팔 움직임",
    "몸통 과도한 회전"
  ],
  [
    "케이블 풀다운",
    "데드버그",
    "오버헤드 스로우"
  ]
),

createExercise(
  "medicine-ball-rotation",
  "메디신볼 로테이션 스로우",
  "power",
  "medicineball",
  "⚡",
  "코어 · 둔근 · 어깨",
  "front",
  "회전 파워 운동",
  ["몸통 회전", "골반 회전", "좌우 차이"],
  [
    "골반-몸통 회전 순서",
    "좌우 파워 차이"
  ],
  [
    "팔로프 프레스",
    "케이블 로테이션"
  ]
),

/* =========================================================
   PLYOMETRIC
========================================================= */

createExercise(
  "box-jump",
  "박스 점프",
  "plyometric",
  "box",
  "⚡",
  "둔근 · 대퇴사두근 · 종아리",
  "front",
  "수직 폭발력과 착지 안정성 운동",
  ["점프 높이", "착지 무릎 정렬", "대칭성"],
  [
    "좌우 발 착지",
    "무릎 내측 이동",
    "착지 자세"
  ],
  [
    "스냅다운",
    "점프 스쿼트",
    "포고 점프"
  ]
),

createExercise(
  "broad-jump",
  "브로드 점프",
  "plyometric",
  "bodyweight",
  "⚡",
  "둔근 · 햄스트링 · 대퇴사두근",
  "side",
  "수평 폭발력 운동",
  ["점프 거리", "이륙 각도", "착지 안정성"],
  [
    "이륙 시 고관절 신전",
    "착지 시 몸통 안정"
  ],
  [
    "힙힌지",
    "점프 스쿼트",
    "스냅다운"
  ]
),

createExercise(
  "depth-jump",
  "뎁스 점프",
  "plyometric",
  "box",
  "⚡",
  "하체 전체",
  "front",
  "반응성 점프 능력 운동",
  ["접지시간", "점프 높이", "착지 대칭"],
  [
    "접지 후 빠른 반발",
    "무릎 정렬",
    "좌우 접지 차이"
  ],
  [
    "포고 점프",
    "박스 점프",
    "스냅다운"
  ]
),

createExercise(
  "pogo-jump",
  "포고 점프",
  "plyometric",
  "bodyweight",
  "⚡",
  "종아리 · 발목",
  "front",
  "발목 반응성과 탄성을 위한 점프",
  ["접지시간", "발목 안정성", "좌우 대칭"],
  [
    "무릎 과도한 굴곡",
    "좌우 점프 높이",
    "발목 흔들림"
  ],
  [
    "카프레이즈",
    "싱글레그 포고",
    "줄넘기"
  ]
),

createExercise(
  "lateral-bound",
  "레터럴 바운드",
  "plyometric",
  "bodyweight",
  "⚡",
  "중둔근 · 둔근 · 하체",
  "front",
  "측면 폭발력과 착지 안정성 운동",
  ["착지 안정성", "골반 위치", "무릎 정렬"],
  [
    "무릎 내측 붕괴",
    "골반 좌우 이동",
    "착지 후 흔들림"
  ],
  [
    "싱글레그 스쿼트",
    "밴드 사이드워크",
    "스케이터 점프"
  ]
),

createExercise(
  "skater-jump",
  "스케이터 점프",
  "plyometric",
  "bodyweight",
  "⛸️",
  "둔근 · 중둔근 · 하체",
  "front",
  "스케이팅 형태의 측면 점프",
  ["측면 거리", "착지 안정성", "골반 정렬"],
  [
    "좌우 이동 거리",
    "착지 무릎 정렬",
    "몸통 흔들림"
  ],
  [
    "레터럴 바운드",
    "싱글레그 RDL",
    "사이드 플랭크"
  ]
),

/* =========================================================
   FUNCTIONAL
========================================================= */

createExercise(
  "farmers-walk",
  "파머스 워크",
  "functional",
  "dumbbell",
  "🚶",
  "그립 · 코어 · 승모근 · 전신",
  "front",
  "중량을 들고 보행하는 전신 안정화 운동",
  ["몸통 기울기", "보폭 대칭", "골반 안정성"],
  [
    "좌우 몸통 기울기",
    "보폭 차이",
    "어깨 높이"
  ],
  [
    "수트케이스 캐리",
    "팔로프 프레스",
    "데드버그"
  ]
),

createExercise(
  "suitcase-carry",
  "수트케이스 캐리",
  "functional",
  "dumbbell",
  "🚶",
  "측면 코어 · 그립",
  "front",
  "한쪽에 중량을 들고 걷는 코어 운동",
  ["몸통 기울기", "골반 안정성"],
  [
    "중량 반대쪽 몸통 기울기",
    "골반 높이"
  ],
  [
    "사이드 플랭크",
    "팔로프 프레스"
  ]
),

createExercise(
  "sled-push",
  "슬레드 푸시",
  "functional",
  "sled",
  "🏃",
  "하체 · 둔근 · 코어",
  "side",
  "슬레드를 밀며 전진하는 전신 운동",
  ["몸통 각도", "보폭", "무릎 드라이브"],
  [
    "몸통 각도 유지",
    "좌우 보폭",
    "발 접지 위치"
  ],
  [
    "스플릿 스쿼트",
    "스텝업",
    "스프린트 드릴"
  ]
),

createExercise(
  "battle-rope",
  "배틀로프",
  "functional",
  "other",
  "🌊",
  "어깨 · 팔 · 코어",
  "front",
  "상체 파워와 컨디셔닝 운동",
  ["좌우 파동 대칭", "몸통 안정성"],
  [
    "좌우 손 높이",
    "몸통 과도한 흔들림"
  ],
  [
    "플랭크",
    "덤벨 프레스",
    "메디신볼 슬램"
  ]
),

createExercise(
  "turkish-get-up",
  "터키시 겟업",
  "functional",
  "kettlebell",
  "🏋️",
  "전신 · 어깨 · 코어",
  "side",
  "전신 안정성과 가동성을 요구하는 운동",
  ["어깨 안정성", "고관절 이동", "몸통 정렬"],
  [
    "중량 수직 유지",
    "어깨 안정",
    "전환 구간 균형"
  ],
  [
    "윈드밀",
    "사이드 플랭크",
    "오버헤드 캐리"
  ]
),

createExercise(
  "landmine-press",
  "랜드마인 프레스",
  "functional",
  "landmine",
  "🏋️",
  "어깨 · 가슴 · 코어",
  "front",
  "대각선 방향 프레스 운동",
  ["어깨 ROM", "몸통 회전", "좌우 차이"],
  [
    "허리 과신전",
    "몸통 회전",
    "어깨 으쓱임"
  ],
  [
    "오버헤드 프레스",
    "팔로프 프레스",
    "페이스풀"
  ]
),

/* =========================================================
   MOBILITY / CORRECTIVE
========================================================= */

createExercise(
  "ankle-mobility",
  "발목 가동성 드릴",
  "mobility",
  "bodyweight",
  "🦶",
  "발목 · 종아리",
  "side",
  "발목 배측굴곡 가동성 개선",
  ["발목 ROM", "좌우 차이"],
  [
    "뒤꿈치 들림 여부",
    "무릎 이동 거리"
  ],
  [
    "카프 스트레칭",
    "티비얼리스 레이즈"
  ]
),

createExercise(
  "hip-mobility",
  "고관절 가동성",
  "mobility",
  "bodyweight",
  "🧘",
  "고관절",
  "front",
  "고관절 회전과 굴곡 가동성 운동",
  ["고관절 ROM", "좌우 차이"],
  [
    "골반 보상",
    "좌우 가동범위"
  ],
  [
    "90/90",
    "코사크 스쿼트"
  ]
),

createExercise(
  "thoracic-rotation",
  "흉추 회전",
  "mobility",
  "bodyweight",
  "🧘",
  "흉추 · 어깨",
  "top",
  "흉추 회전 가동성 운동",
  ["흉추 회전", "좌우 차이"],
  [
    "골반 고정",
    "좌우 회전 범위"
  ],
  [
    "오픈북",
    "월 슬라이드"
  ]
),

createExercise(
  "band-external-rotation",
  "밴드 외회전",
  "mobility",
  "band",
  "💪",
  "회전근개",
  "front",
  "어깨 외회전근 강화",
  ["좌우 ROM", "팔꿈치 위치"],
  [
    "팔꿈치 고정",
    "몸통 회전 최소화"
  ],
  [
    "페이스풀",
    "Y 레이즈"
  ]
),

createExercise(
  "band-side-walk",
  "밴드 사이드워크",
  "mobility",
  "band",
  "🦵",
  "중둔근 · 둔근",
  "front",
  "고관절 외전 안정성 운동",
  ["무릎 정렬", "골반 높이"],
  [
    "무릎 안쪽 붕괴",
    "몸통 흔들림"
  ],
  [
    "싱글레그 스쿼트",
    "힙 어브덕션"
  ]
),

createExercise(
  "copenhagen-plank",
  "코펜하겐 플랭크",
  "mobility",
  "bodyweight",
  "🤸",
  "내전근 · 코어",
  "front",
  "내전근과 측면 코어 강화",
  ["골반 높이", "몸통 정렬"],
  [
    "골반 하강",
    "몸통 회전"
  ],
  [
    "사이드 플랭크",
    "내전근 강화"
  ]
),

/* =========================================================
   FULL BODY
========================================================= */

createExercise(
  "thruster",
  "쓰러스터",
  "fullbody",
  "barbell",
  "🏋️",
  "하체 · 어깨 · 삼두 · 코어",
  "side",
  "스쿼트와 오버헤드 프레스를 연결한 전신 운동",
  ["스쿼트 깊이", "신전 타이밍", "바벨 궤적"],
  [
    "하체 신전과 프레스 연결",
    "바벨 수직 이동",
    "허리 과신전"
  ],
  [
    "프론트 스쿼트",
    "푸시 프레스",
    "코어 브레이싱"
  ]
),

createExercise(
  "burpee",
  "버피",
  "fullbody",
  "bodyweight",
  "🤸",
  "전신",
  "side",
  "전신 컨디셔닝 운동",
  ["몸통 안정성", "착지", "동작 리듬"],
  [
    "푸시업 구간 허리 처짐",
    "착지 무릎 정렬",
    "좌우 발 위치"
  ],
  [
    "푸시업",
    "스쿼트 점프",
    "플랭크"
  ]
),

createExercise(
  "dumbbell-snatch",
  "덤벨 스내치",
  "fullbody",
  "dumbbell",
  "🏋️",
  "둔근 · 햄스트링 · 어깨 · 코어",
  "side",
  "단측 폭발적 전신 운동",
  ["고관절 신전", "덤벨 궤적", "오버헤드 안정성"],
  [
    "팔로 당기기보다 하체 신전 사용",
    "몸통 회전",
    "오버헤드 락아웃"
  ],
  [
    "케틀벨 스윙",
    "랜드마인 프레스",
    "싱글레그 RDL"
  ]
)

];


/* =========================================================
   05. EXTRA EXERCISES
   데이터베이스 확장
========================================================= */

const EXTRA_EXERCISES = [

  ["hack-squat","핵 스쿼트","lower","machine","🦵"],
  ["belt-squat","벨트 스쿼트","lower","machine","🦵"],
  ["sissy-squat","시시 스쿼트","lower","bodyweight","🦵"],
  ["cossack-squat","코사크 스쿼트","lower","bodyweight","🦵"],
  ["lateral-lunge","레터럴 런지","lower","dumbbell","🦵"],
  ["curtsy-lunge","커시 런지","lower","dumbbell","🦵"],
  ["single-leg-press","싱글레그 프레스","lower","machine","🦵"],
  ["seated-leg-curl","시티드 레그컬","lower","machine","🦵"],
  ["standing-leg-curl","스탠딩 레그컬","lower","machine","🦵"],
  ["adductor-machine","어덕터 머신","lower","machine","🦵"],
  ["abductor-machine","어브덕터 머신","lower","machine","🦵"],
  ["seated-calf","시티드 카프레이즈","lower","machine","🦶"],
  ["tibialis-raise","티비얼리스 레이즈","lower","bodyweight","🦶"],

  ["decline-bench","디클라인 벤치프레스","chest","barbell","🏋️"],
  ["machine-chest-press","체스트 프레스","chest","machine","🏋️"],
  ["cable-fly","케이블 플라이","chest","cable","🏋️"],
  ["dumbbell-fly","덤벨 플라이","chest","dumbbell","🏋️"],
  ["close-grip-bench","클로즈그립 벤치프레스","chest","barbell","🏋️"],

  ["tbar-row","T바 로우","back","barbell","🏋️"],
  ["chest-supported-row","체스트 서포티드 로우","back","dumbbell","🏋️"],
  ["machine-row","머신 로우","back","machine","🏋️"],
  ["straight-arm-pulldown","스트레이트암 풀다운","back","cable","🏋️"],
  ["inverted-row","인버티드 로우","back","bodyweight","🧗"],

  ["arnold-press","아놀드 프레스","shoulder","dumbbell","🏋️"],
  ["front-raise","프론트 레이즈","shoulder","dumbbell","🏋️"],
  ["cable-lateral-raise","케이블 레터럴레이즈","shoulder","cable","🏋️"],
  ["y-raise","Y 레이즈","shoulder","dumbbell","🏋️"],
  ["scapular-pushup","스캐풀라 푸시업","shoulder","bodyweight","🤸"],

  ["preacher-curl","프리처 컬","arms","machine","💪"],
  ["cable-curl","케이블 컬","arms","cable","💪"],
  ["concentration-curl","컨센트레이션 컬","arms","dumbbell","💪"],
  ["skull-crusher","스컬크러셔","arms","barbell","💪"],
  ["overhead-triceps","오버헤드 트라이셉스 익스텐션","arms","dumbbell","💪"],

  ["ab-wheel","AB 휠","core","other","🤸"],
  ["reverse-crunch","리버스 크런치","core","bodyweight","🤸"],
  ["cable-crunch","케이블 크런치","core","cable","🤸"],
  ["russian-twist","러시안 트위스트","core","medicineball","🤸"],
  ["woodchop","케이블 우드촙","core","cable","🤸"],
  ["bear-crawl","베어 크롤","core","bodyweight","🐻"],
  ["hollow-hold","할로우 홀드","core","bodyweight","🤸"],

  ["muscle-snatch","머슬 스내치","olympic","barbell","🏋️"],
  ["snatch-pull","스내치 풀","olympic","barbell","🏋️"],
  ["clean-and-jerk","클린 앤 저크","olympic","barbell","🏋️"],
  ["high-pull","하이 풀","olympic","barbell","🏋️"],
  ["jump-shrug","점프 슈러그","olympic","barbell","⚡"],

  ["single-leg-box-jump","싱글레그 박스점프","plyometric","box","⚡"],
  ["tuck-jump","턱 점프","plyometric","bodyweight","⚡"],
  ["split-jump","스플릿 점프","plyometric","bodyweight","⚡"],
  ["hurdle-hop","허들 홉","plyometric","other","⚡"],
  ["drop-jump","드롭 점프","plyometric","box","⚡"],

  ["overhead-carry","오버헤드 캐리","functional","dumbbell","🚶"],
  ["front-rack-carry","프론트랙 캐리","functional","kettlebell","🚶"],
  ["sled-drag","슬레드 드래그","functional","sled","🏃"],
  ["trx-row","TRX 로우","functional","trx","🏋️"],
  ["trx-squat","TRX 스쿼트","functional","trx","🦵"],
  ["kettlebell-clean","케틀벨 클린","functional","kettlebell","🏋️"],
  ["kettlebell-snatch","케틀벨 스내치","functional","kettlebell","🏋️"]

];


EXTRA_EXERCISES.forEach(item => {

  const [
    id,
    name,
    category,
    equipment,
    icon
  ] = item;

  WEIGHT_EXERCISES.push(

    createExercise(

      id,

      name,

      category,

      equipment,

      icon,

      "운동별 주요 근육",

      "front",

      `${name} 동작 분석`,

      [
        "관절 각도",
        "좌우 대칭",
        "가동범위",
        "안정성"
      ],

      [
        "좌우 움직임 비교",
        "관절 정렬 확인",
        "몸통 안정성 확인"
      ],

      [
        "기초 패턴 훈련",
        "가동성 훈련",
        "코어 안정화",
        "단측 보강운동"
      ]

    )

  );

});


/* =========================================================
   06. GLOBAL
========================================================= */

window.WEIGHT_EXERCISES = WEIGHT_EXERCISES;

window.EXERCISE_CATEGORIES = EXERCISE_CATEGORIES;

window.EQUIPMENT_NAMES = EQUIPMENT_NAMES;


/* =========================================================
   07. STATE
========================================================= */

let currentExerciseCategory = "all";

let currentEquipmentFilter = "all";

let currentExerciseSearch = "";


/* =========================================================
   08. DOM
========================================================= */

function getExerciseDOM() {

  return {

    grid:
      document.getElementById("exerciseGrid"),

    search:
      document.getElementById("exerciseSearch"),

    equipment:
      document.getElementById("equipmentFilter"),

    categoryTabs:
      document.getElementById("exerciseCategoryTabs"),

    total:
      document.getElementById("exerciseTotalCount"),

    modal:
      document.getElementById("exerciseModal"),

    modalClose:
      document.getElementById("closeExerciseModal"),

    modalIcon:
      document.getElementById("modalExercisePictogram"),

    modalCategory:
      document.getElementById("modalExerciseCategory"),

    modalName:
      document.getElementById("modalExerciseName"),

    modalDescription:
      document.getElementById("modalExerciseDescription"),

    modalMuscles:
      document.getElementById("modalExerciseMuscles"),

    modalEquipment:
      document.getElementById("modalExerciseEquipment"),

    modalView:
      document.getElementById("modalExerciseView"),

    modalMetrics:
      document.getElementById("modalExerciseMetrics"),

    analyzeButton:
      document.getElementById("analyzeSelectedExerciseBtn")

  };

}


/* =========================================================
   09. FILTER
========================================================= */

function getFilteredExercises() {

  return WEIGHT_EXERCISES.filter(exercise => {

    const categoryMatch =

      currentExerciseCategory === "all" ||

      exercise.category === currentExerciseCategory;


    const equipmentMatch =

      currentEquipmentFilter === "all" ||

      exercise.equipment === currentEquipmentFilter;


    const searchText =

      `${exercise.name}
       ${exercise.muscles}
       ${exercise.description}`

        .toLowerCase();


    const searchMatch =

      !currentExerciseSearch ||

      searchText.includes(
        currentExerciseSearch.toLowerCase()
      );


    return (

      categoryMatch &&

      equipmentMatch &&

      searchMatch

    );

  });

}


/* =========================================================
   10. CARD
========================================================= */

function createExerciseCard(exercise) {

  const article =
    document.createElement("article");

  article.className = "exercise-card";

  article.dataset.exerciseId =
    exercise.id;


  const categoryName =

    EXERCISE_CATEGORIES[
      exercise.category
    ] || exercise.category;


  const equipmentName =

    EQUIPMENT_NAMES[
      exercise.equipment
    ] || exercise.equipment;


  article.innerHTML = `

    <div class="exercise-card-icon">

      ${exercise.icon}

    </div>


    <span class="eyebrow">

      ${categoryName}

    </span>


    <h3>

      ${exercise.name}

    </h3>


    <p>

      ${exercise.muscles}

    </p>


    <div class="exercise-card-footer">

      <span class="exercise-tag">

        ${equipmentName}

      </span>


      <button
        class="exercise-analyze-btn"
        type="button"
      >

        자세 분석 →

      </button>

    </div>

  `;


  /* 카드 클릭 → 상세 */

  article.addEventListener(
    "click",
    event => {

      if (
        event.target.closest(
          ".exercise-analyze-btn"
        )
      ) {

        return;

      }

      openExerciseModal(
        exercise.id
      );

    }
  );


  /* 분석 버튼 */

  const analyzeButton =

    article.querySelector(
      ".exercise-analyze-btn"
    );


  analyzeButton.addEventListener(
    "click",
    event => {

      event.stopPropagation();

      goToExerciseAnalysis(
        exercise.id
      );

    }
  );


  return article;

}


/* =========================================================
   11. RENDER
========================================================= */

function renderExerciseLibrary() {

  const dom = getExerciseDOM();

  if (!dom.grid) return;


  const exercises =
    getFilteredExercises();


  dom.grid.innerHTML = "";


  if (dom.total) {

    dom.total.textContent =
      WEIGHT_EXERCISES.length;

  }


  if (!exercises.length) {

    dom.grid.innerHTML = `

      <div class="empty-state">

        조건에 맞는 운동이 없습니다.

      </div>

    `;

    return;

  }


  exercises.forEach(exercise => {

    dom.grid.appendChild(

      createExerciseCard(
        exercise
      )

    );

  });

}


/* =========================================================
   12. MODAL
========================================================= */

let selectedModalExerciseId = null;


function openExerciseModal(id) {

  const exercise =

    WEIGHT_EXERCISES.find(
      item => item.id === id
    );


  if (!exercise) return;


  selectedModalExerciseId =
    exercise.id;


  const dom = getExerciseDOM();


  if (!dom.modal) return;


  dom.modalIcon.textContent =
    exercise.icon;


  dom.modalCategory.textContent =

    EXERCISE_CATEGORIES[
      exercise.category
    ] || exercise.category;


  dom.modalName.textContent =
    exercise.name;


  dom.modalDescription.textContent =
    exercise.description;


  dom.modalMuscles.textContent =
    exercise.muscles;


  dom.modalEquipment.textContent =

    EQUIPMENT_NAMES[
      exercise.equipment
    ] || exercise.equipment;


  dom.modalView.textContent =

    getViewName(
      exercise.view
    );


  dom.modalMetrics.textContent =

    exercise.metrics.join(" · ");


  dom.modal.classList.add("open");

}


function closeExerciseModal() {

  const modal =

    document.getElementById(
      "exerciseModal"
    );


  modal?.classList.remove("open");

}


/* =========================================================
   13. ANALYSIS LINK

   ★ 핵심 기능
   운동 선택 → 자세분석 페이지 → 운동 자동 선택
========================================================= */

function goToExerciseAnalysis(
  exerciseId
) {

  const exercise =

    WEIGHT_EXERCISES.find(
      item => item.id === exerciseId
    );


  if (!exercise) return;


  /* 선택 운동 저장 */

  localStorage.setItem(

    "weightLabSelectedExercise",

    exercise.id

  );


  /* APP 전역 함수가 있으면 사용 */

  if (
    typeof window.showPage ===
    "function"
  ) {

    window.showPage(
      "analysis"
    );

  }

  else {

    /* 직접 페이지 전환 */

    document
      .querySelectorAll(".page")
      .forEach(page => {

        page.classList.remove(
          "active"
        );

      });


    const analysisPage =

      document.getElementById(
        "page-analysis"
      );


    analysisPage?.classList.add(
      "active"
    );


    document
      .querySelectorAll(".nav-item")
      .forEach(button => {

        button.classList.toggle(

          "active",

          button.dataset.page ===
          "analysis"

        );

      });

  }


  /* 운동 Select 자동 선택 */

  setTimeout(() => {

    const select =

      document.getElementById(
        "analysisExercise"
      );


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


    /* 분석 제목 */

    const title =

      document.getElementById(
        "motionAnalysisTitle"
      );


    if (title) {

      title.textContent =

        `${exercise.name} 자세 분석`;

    }


    /* 분석 영역으로 이동 */

    document
      .getElementById(
        "page-analysis"
      )
      ?.scrollIntoView({

        behavior: "smooth",

        block: "start"

      });


    if (
      typeof window.showToast ===
      "function"
    ) {

      window.showToast(

        `${exercise.name} 분석 준비 완료`

      );

    }

  }, 80);


  closeExerciseModal();

}


window.goToExerciseAnalysis =
  goToExerciseAnalysis;


/* =========================================================
   14. VIEW NAME
========================================================= */

function getViewName(view) {

  const names = {

    front:
      "정면",

    side:
      "측면",

    rear:
      "후면",

    top:
      "상단"

  };


  return names[view] || view;

}


/* =========================================================
   15. ANALYSIS SELECT
========================================================= */

function populateAnalysisExerciseSelect() {

  const select =

    document.getElementById(
      "analysisExercise"
    );


  if (!select) return;


  const previous =
    select.value;


  select.innerHTML = `

    <option value="">

      운동 선택

    </option>

  `;


  const categories =

    Object.keys(
      EXERCISE_CATEGORIES
    )
    .filter(
      category =>
        category !== "all"
    );


  categories.forEach(category => {

    const exercises =

      WEIGHT_EXERCISES.filter(
        exercise =>
          exercise.category ===
          category
      );


    if (!exercises.length) return;


    const group =

      document.createElement(
        "optgroup"
      );


    group.label =

      EXERCISE_CATEGORIES[
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


  if (
    previous &&
    WEIGHT_EXERCISES.some(
      exercise =>
        exercise.id === previous
    )
  ) {

    select.value =
      previous;

  }


  /* 이전에 라이브러리에서 선택한 운동 */

  const saved =

    localStorage.getItem(
      "weightLabSelectedExercise"
    );


  if (
    saved &&
    WEIGHT_EXERCISES.some(
      exercise =>
        exercise.id === saved
    )
  ) {

    select.value = saved;

  }

}


/* =========================================================
   16. PROGRAM SELECT
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

  `;


  WEIGHT_EXERCISES.forEach(
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

}


/* =========================================================
   17. RECORD FILTER
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

  `;


  WEIGHT_EXERCISES.forEach(
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

}


/* =========================================================
   18. GET EXERCISE
========================================================= */

function getExerciseById(id) {

  return WEIGHT_EXERCISES.find(
    exercise =>
      exercise.id === id
  ) || null;

}


window.getExerciseById =
  getExerciseById;


/* =========================================================
   19. FILTER EVENTS
========================================================= */

function setupExerciseFilters() {

  const dom = getExerciseDOM();


  dom.search?.addEventListener(
    "input",
    event => {

      currentExerciseSearch =
        event.target.value.trim();

      renderExerciseLibrary();

    }
  );


  dom.equipment?.addEventListener(
    "change",
    event => {

      currentEquipmentFilter =
        event.target.value;

      renderExerciseLibrary();

    }
  );


  dom.categoryTabs
    ?.querySelectorAll(
      ".category-tab"
    )
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          currentExerciseCategory =

            button.dataset.category ||
            "all";


          dom.categoryTabs
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


          renderExerciseLibrary();

        }
      );

    });

}


/* =========================================================
   20. MODAL EVENTS
========================================================= */

function setupExerciseModal() {

  const dom = getExerciseDOM();


  dom.modalClose
    ?.addEventListener(
      "click",
      closeExerciseModal
    );


  dom.modal?.addEventListener(
    "click",
    event => {

      if (
        event.target ===
        dom.modal
      ) {

        closeExerciseModal();

      }

    }
  );


  dom.analyzeButton
    ?.addEventListener(
      "click",
      () => {

        if (
          !selectedModalExerciseId
        ) {

          return;

        }


        goToExerciseAnalysis(

          selectedModalExerciseId

        );

      }
    );

}


/* =========================================================
   21. ANALYSIS CHANGE
========================================================= */

function setupAnalysisExerciseChange() {

  const select =

    document.getElementById(
      "analysisExercise"
    );


  if (!select) return;


  select.addEventListener(
    "change",
    () => {

      const exercise =

        getExerciseById(
          select.value
        );


      if (!exercise) return;


      localStorage.setItem(

        "weightLabSelectedExercise",

        exercise.id

      );


      const title =

        document.getElementById(
          "motionAnalysisTitle"
        );


      if (title) {

        title.textContent =

          `${exercise.name} 자세 분석`;

      }


      updateExerciseCheckpoints(
        exercise
      );

    }
  );

}


/* =========================================================
   22. CHECKPOINT
========================================================= */

function updateExerciseCheckpoints(
  exercise
) {

  const list =

    document.getElementById(
      "checkpointList"
    );


  if (!list) return;


  list.innerHTML = "";


  if (
    !exercise.checkpoints ||
    !exercise.checkpoints.length
  ) {

    list.innerHTML = `

      <div class="empty-state">

        체크포인트가 없습니다.

      </div>

    `;

    return;

  }


  exercise.checkpoints.forEach(
    checkpoint => {

      const row =

        document.createElement(
          "div"
        );


      row.className =
        "checkpoint-row";


      row.innerHTML = `

        <span>

          ${checkpoint}

        </span>

        <strong>

          CHECK

        </strong>

      `;


      list.appendChild(
        row
      );

    }
  );

}


/* =========================================================
   23. RECOMMENDATIONS
========================================================= */

function renderExerciseRecommendations(
  exerciseId
) {

  const exercise =

    getExerciseById(
      exerciseId
    );


  const container =

    document.getElementById(
      "trainingRecommendations"
    );


  if (
    !exercise ||
    !container
  ) {

    return;

  }


  container.innerHTML = "";


  exercise.recommendations.forEach(
    (name, index) => {

      const card =

        document.createElement(
          "div"
        );


      card.className =
        "recommendation-card";


      card.innerHTML = `

        <span>

          TRAINING ${index + 1}

        </span>

        <strong>

          ${name}

        </strong>

        <p>

          분석 결과를 보완하기 위한
          추천 훈련입니다.

        </p>

      `;


      container.appendChild(
        card
      );

    }
  );

}


window.renderExerciseRecommendations =
  renderExerciseRecommendations;


/* =========================================================
   24. INITIALIZE
========================================================= */

function initializeExercises() {

  renderExerciseLibrary();

  setupExerciseFilters();

  setupExerciseModal();

  populateAnalysisExerciseSelect();

  populateProgramExerciseSelect();

  populateRecordExerciseFilter();

  setupAnalysisExerciseChange();


  const analysisSelect =

    document.getElementById(
      "analysisExercise"
    );


  if (
    analysisSelect &&
    analysisSelect.value
  ) {

    const exercise =

      getExerciseById(
        analysisSelect.value
      );


    if (exercise) {

      updateExerciseCheckpoints(
        exercise
      );

    }

  }


  console.log(
    `[WEIGHT LAB] ${WEIGHT_EXERCISES.length} exercises loaded`
  );

}


/* =========================================================
   25. START
========================================================= */

if (
  document.readyState ===
  "loading"
) {

  document.addEventListener(

    "DOMContentLoaded",

    initializeExercises

  );

}

else {

  initializeExercises();

}


/* =========================================================
   exercises.js COMPLETE
========================================================= */