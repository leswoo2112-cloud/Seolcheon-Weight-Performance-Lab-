/* =========================================================
   설천고 WEIGHT PERFORMANCE LAB
   EXERCISES.JS

   EXERCISE DATABASE
   - Bodyweight
   - Barbell
   - Dumbbell
   - Machine
   - Cable
   - Kettlebell
   - Olympic Lifting
   - Power
   - Plyometric
   - Core
   - Functional
   - Mobility / Corrective
========================================================= */

"use strict";


/* =========================================================
   CATEGORY LABEL
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


/* =========================================================
   EQUIPMENT LABEL
========================================================= */

const EXERCISE_EQUIPMENT_LABELS = {

  bodyweight: "맨몸",

  barbell: "바벨",

  dumbbell: "덤벨",

  machine: "머신",

  cable: "케이블",

  kettlebell: "케틀벨",

  band: "밴드",

  medicineball: "메디신볼",

  box: "박스",

  bench: "벤치",

  trapbar: "트랩바",

  landmine: "랜드마인",

  sled: "슬레드",

  other: "기타"

};


/* =========================================================
   EXERCISE DATABASE
========================================================= */

const EXERCISES = [

/* =========================================================
   LOWER BODY
========================================================= */

{
  id: "bodyweight-squat",

  name: "스쿼트",

  category: "lower",

  equipment: "bodyweight",

  pictogram: "🏋️",

  muscles: "대퇴사두근 · 둔근 · 햄스트링 · 코어",

  description:
    "기본 맨몸 스쿼트. 하지 정렬과 가동성, 좌우 대칭성을 평가하기 좋은 기본 동작입니다.",

  recommendedView: "front",

  metrics:
    "무릎 각도 · 고관절 각도 · 발목 각도 · 몸통 기울기 · 좌우 대칭",

  checkpoints: [
    "무릎과 발끝 방향",
    "좌우 골반 높이",
    "스쿼트 깊이",
    "몸통 기울기",
    "뒤꿈치 안정성"
  ]
},


{
  id: "air-squat",

  name: "에어 스쿼트",

  category: "lower",

  equipment: "bodyweight",

  pictogram: "🧍",

  muscles: "대퇴사두근 · 둔근 · 코어",

  description:
    "반복 수행 능력과 스쿼트 패턴을 확인하는 맨몸 스쿼트입니다.",

  recommendedView: "front",

  metrics:
    "대칭성 · ROM · 반복 템포 · 무릎 정렬",

  checkpoints: [
    "좌우 무릎 정렬",
    "골반 이동",
    "반복 템포",
    "상체 안정성"
  ]
},


{
  id: "back-squat",

  name: "백 스쿼트",

  category: "lower",

  equipment: "barbell",

  pictogram: "🏋️",

  muscles: "대퇴사두근 · 둔근 · 햄스트링 · 척추기립근",

  description:
    "바벨을 등 상부에 위치시키는 대표적인 하체 근력 운동입니다.",

  recommendedView: "side",

  metrics:
    "무릎 · 고관절 · 발목 · 몸통 · 바벨 궤적",

  checkpoints: [
    "바벨 수직 궤적",
    "무릎 정렬",
    "고관절 깊이",
    "몸통 기울기",
    "발 압력 중심"
  ]
},


{
  id: "front-squat",

  name: "프론트 스쿼트",

  category: "lower",

  equipment: "barbell",

  pictogram: "🏋️",

  muscles: "대퇴사두근 · 둔근 · 코어 · 상부등",

  description:
    "바벨을 전면 랙 포지션에 두고 수행하는 스쿼트입니다.",

  recommendedView: "side",

  metrics:
    "몸통 각도 · 무릎 각도 · 고관절 각도 · 바벨 궤적",

  checkpoints: [
    "상체 직립",
    "팔꿈치 위치",
    "바벨 중심",
    "무릎 이동",
    "스쿼트 깊이"
  ]
},


{
  id: "goblet-squat",

  name: "고블릿 스쿼트",

  category: "lower",

  equipment: "dumbbell",

  pictogram: "🏋",

  muscles: "대퇴사두근 · 둔근 · 코어",

  description:
    "덤벨을 가슴 앞에 들고 수행하는 스쿼트입니다.",

  recommendedView: "front",

  metrics:
    "무릎 정렬 · 골반 대칭 · 몸통 안정성",

  checkpoints: [
    "무릎 정렬",
    "골반 대칭",
    "상체 안정성",
    "발 압력"
  ]
},


{
  id: "overhead-squat",

  name: "오버헤드 스쿼트",

  category: "fullbody",

  equipment: "barbell",

  pictogram: "🏋️",

  muscles: "전신 · 어깨 · 코어 · 하체",

  description:
    "바벨을 머리 위에 유지하면서 수행하는 전신 안정성 운동입니다.",

  recommendedView: "side",

  metrics:
    "어깨 · 몸통 · 고관절 · 무릎 · 발목",

  checkpoints: [
    "바벨 중심선",
    "어깨 가동성",
    "몸통 안정성",
    "무릎 정렬",
    "스쿼트 깊이"
  ]
},


{
  id: "split-squat",

  name: "스플릿 스쿼트",

  category: "lower",

  equipment: "bodyweight",

  pictogram: "🦵",

  muscles: "둔근 · 대퇴사두근 · 햄스트링",

  description:
    "앞뒤 스탠스에서 수행하는 편측 하체 운동입니다.",

  recommendedView: "side",

  metrics:
    "앞 무릎 각도 · 골반 높이 · 몸통 기울기",

  checkpoints: [
    "앞 무릎 정렬",
    "골반 중심",
    "몸통 안정성",
    "좌우 차이"
  ]
},


{
  id: "bulgarian-split-squat",

  name: "불가리안 스플릿 스쿼트",

  category: "lower",

  equipment: "dumbbell",

  pictogram: "🦵",

  muscles: "둔근 · 대퇴사두근 · 햄스트링",

  description:
    "후방 발을 벤치에 올려 수행하는 편측 하체 운동입니다.",

  recommendedView: "side",

  metrics:
    "무릎 · 고관절 · 골반 · 몸통",

  checkpoints: [
    "앞발 안정성",
    "골반 정렬",
    "무릎 이동",
    "상체 기울기"
  ]
},


{
  id: "reverse-lunge",

  name: "리버스 런지",

  category: "lower",

  equipment: "bodyweight",

  pictogram: "🚶",

  muscles: "둔근 · 대퇴사두근 · 햄스트링",

  description:
    "한 발을 뒤로 보내며 수행하는 런지입니다.",

  recommendedView: "front",

  metrics:
    "무릎 정렬 · 골반 대칭 · 균형",

  checkpoints: [
    "무릎 안쪽 붕괴",
    "골반 회전",
    "균형",
    "보폭"
  ]
},


{
  id: "forward-lunge",

  name: "포워드 런지",

  category: "lower",

  equipment: "bodyweight",

  pictogram: "🚶",

  muscles: "대퇴사두근 · 둔근 · 햄스트링",

  description:
    "앞으로 한 발을 내딛으며 수행하는 기본 런지입니다.",

  recommendedView: "front",

  metrics:
    "무릎 정렬 · 골반 · 보폭 · 몸통",

  checkpoints: [
    "무릎과 발끝 방향",
    "골반 흔들림",
    "착지 안정성",
    "몸통 제어"
  ]
},


{
  id: "walking-lunge",

  name: "워킹 런지",

  category: "lower",

  equipment: "bodyweight",

  pictogram: "🚶",

  muscles: "둔근 · 대퇴사두근 · 햄스트링",

  description:
    "전진하면서 연속적으로 수행하는 런지입니다.",

  recommendedView: "front",

  metrics:
    "좌우 대칭 · 무릎 정렬 · 골반 이동",

  checkpoints: [
    "좌우 보폭",
    "골반 흔들림",
    "무릎 정렬",
    "착지 안정성"
  ]
},


{
  id: "lateral-lunge",

  name: "사이드 런지",

  category: "lower",

  equipment: "bodyweight",

  pictogram: "↔️",

  muscles: "내전근 · 둔근 · 대퇴사두근",

  description:
    "측면 방향 움직임을 사용하는 런지입니다.",

  recommendedView: "front",

  metrics:
    "골반 이동 · 무릎 정렬 · 좌우 ROM",

  checkpoints: [
    "측면 골반 이동",
    "무릎 방향",
    "반대쪽 다리 정렬",
    "좌우 가동범위"
  ]
},


{
  id: "step-up",

  name: "스텝 업",

  category: "lower",

  equipment: "box",

  pictogram: "🪜",

  muscles: "둔근 · 대퇴사두근",

  description:
    "박스나 벤치 위로 올라가는 편측 하체 운동입니다.",

  recommendedView: "front",

  metrics:
    "무릎 정렬 · 골반 안정성 · 좌우 차이",

  checkpoints: [
    "지지 다리 정렬",
    "골반 상승",
    "반대발 보조",
    "균형"
  ]
},


{
  id: "single-leg-squat",

  name: "싱글 레그 스쿼트",

  category: "lower",

  equipment: "bodyweight",

  pictogram: "🦵",

  muscles: "둔근 · 대퇴사두근 · 코어",

  description:
    "한쪽 다리로 수행하여 좌우 안정성과 근력 차이를 평가합니다.",

  recommendedView: "front",

  metrics:
    "무릎 외반 · 골반 드롭 · 균형 · ROM",

  checkpoints: [
    "무릎 안쪽 이동",
    "골반 드롭",
    "몸통 흔들림",
    "좌우 차이"
  ]
},


{
  id: "pistol-squat",

  name: "피스톨 스쿼트",

  category: "lower",

  equipment: "bodyweight",

  pictogram: "🦵",

  muscles: "대퇴사두근 · 둔근 · 코어",

  description:
    "한 다리로 깊게 앉는 고난도 편측 스쿼트입니다.",

  recommendedView: "side",

  metrics:
    "무릎 · 고관절 · 발목 ROM · 균형",

  checkpoints: [
    "발목 가동성",
    "무릎 정렬",
    "골반 안정성",
    "깊이"
  ]
},


{
  id: "romanian-deadlift",

  name: "루마니안 데드리프트",

  category: "lower",

  equipment: "barbell",

  pictogram: "🏋",

  muscles: "햄스트링 · 둔근 · 척추기립근",

  description:
    "힙힌지 패턴을 중심으로 수행하는 후면사슬 운동입니다.",

  recommendedView: "side",

  metrics:
    "고관절 각도 · 몸통 · 무릎 · 바벨 궤적",

  checkpoints: [
    "힙힌지",
    "척추 정렬",
    "바벨과 몸의 거리",
    "무릎 굴곡"
  ]
},


{
  id: "deadlift",

  name: "데드리프트",

  category: "fullbody",

  equipment: "barbell",

  pictogram: "🏋",

  muscles: "둔근 · 햄스트링 · 등 · 코어",

  description:
    "바닥의 바벨을 들어 올리는 대표적인 전신 근력 운동입니다.",

  recommendedView: "side",

  metrics:
    "고관절 · 무릎 · 몸통 · 바벨 궤적",

  checkpoints: [
    "바벨 수직 이동",
    "척추 정렬",
    "고관절과 무릎 타이밍",
    "락아웃"
  ]
},


{
  id: "sumo-deadlift",

  name: "스모 데드리프트",

  category: "fullbody",

  equipment: "barbell",

  pictogram: "🏋",

  muscles: "둔근 · 내전근 · 대퇴사두근 · 등",

  description:
    "넓은 스탠스로 수행하는 데드리프트입니다.",

  recommendedView: "front",

  metrics:
    "무릎 정렬 · 골반 · 좌우 대칭 · 바벨",

  checkpoints: [
    "무릎 방향",
    "좌우 하중",
    "골반 중심",
    "락아웃"
  ]
},


{
  id: "trap-bar-deadlift",

  name: "트랩바 데드리프트",

  category: "fullbody",

  equipment: "trapbar",

  pictogram: "⬡",

  muscles: "하체 · 둔근 · 등 · 코어",

  description:
    "트랩바를 이용한 전신 근력 운동입니다.",

  recommendedView: "side",

  metrics:
    "무릎 · 고관절 · 몸통 · 상승 속도",

  checkpoints: [
    "중심 위치",
    "무릎과 고관절 타이밍",
    "척추 정렬",
    "락아웃"
  ]
},


{
  id: "hip-thrust",

  name: "힙 쓰러스트",

  category: "lower",

  equipment: "barbell",

  pictogram: "⬆️",

  muscles: "둔근 · 햄스트링",

  description:
    "고관절 신전을 집중적으로 강화하는 운동입니다.",

  recommendedView: "side",

  metrics:
    "고관절 신전 · 몸통 · 무릎",

  checkpoints: [
    "완전한 고관절 신전",
    "과도한 허리 신전",
    "무릎 위치",
    "좌우 골반"
  ]
},


{
  id: "glute-bridge",

  name: "글루트 브리지",

  category: "lower",

  equipment: "bodyweight",

  pictogram: "🌉",

  muscles: "둔근 · 햄스트링",

  description:
    "맨몸으로 수행하는 기본 고관절 신전 운동입니다.",

  recommendedView: "side",

  metrics:
    "골반 높이 · 고관절 신전 · 좌우 대칭",

  checkpoints: [
    "골반 높이",
    "허리 과신전",
    "발 위치",
    "좌우 대칭"
  ]
},


{
  id: "leg-press",

  name: "레그 프레스",

  category: "lower",

  equipment: "machine",

  pictogram: "🦿",

  muscles: "대퇴사두근 · 둔근",

  description:
    "머신을 이용한 하체 프레스 운동입니다.",

  recommendedView: "side",

  metrics:
    "무릎 ROM · 고관절 ROM · 좌우 정렬",

  checkpoints: [
    "무릎 깊이",
    "골반 말림",
    "무릎 정렬",
    "완전 잠금 여부"
  ]
},


{
  id: "leg-extension",

  name: "레그 익스텐션",

  category: "lower",

  equipment: "machine",

  pictogram: "🦿",

  muscles: "대퇴사두근",

  description:
    "무릎 신전 근력을 강화하는 머신 운동입니다.",

  recommendedView: "side",

  metrics:
    "무릎 ROM · 좌우 속도",

  checkpoints: [
    "무릎 신전 범위",
    "반동",
    "좌우 차이",
    "템포"
  ]
},


{
  id: "leg-curl",

  name: "레그 컬",

  category: "lower",

  equipment: "machine",

  pictogram: "🦿",

  muscles: "햄스트링",

  description:
    "무릎 굴곡을 통해 햄스트링을 강화합니다.",

  recommendedView: "side",

  metrics:
    "무릎 굴곡 ROM · 좌우 차이",

  checkpoints: [
    "무릎 굴곡",
    "골반 움직임",
    "반동",
    "좌우 차이"
  ]
},


{
  id: "calf-raise",

  name: "카프 레이즈",

  category: "lower",

  equipment: "bodyweight",

  pictogram: "🦶",

  muscles: "비복근 · 가자미근",

  description:
    "발목 저측굴곡 근력을 강화합니다.",

  recommendedView: "rear",

  metrics:
    "발목 ROM · 좌우 대칭",

  checkpoints: [
    "뒤꿈치 높이",
    "발목 정렬",
    "좌우 차이",
    "균형"
  ]
},


/* =========================================================
   CHEST
========================================================= */

{
  id: "push-up",

  name: "푸시업",

  category: "chest",

  equipment: "bodyweight",

  pictogram: "💪",

  muscles: "대흉근 · 삼두근 · 전면삼각근 · 코어",

  description:
    "대표적인 맨몸 상체 밀기 운동입니다.",

  recommendedView: "side",

  metrics:
    "팔꿈치 · 어깨 · 몸통 정렬 · ROM",

  checkpoints: [
    "몸통 일직선",
    "팔꿈치 각도",
    "가슴 깊이",
    "골반 처짐"
  ]
},


{
  id: "bench-press",

  name: "벤치프레스",

  category: "chest",

  equipment: "barbell",

  pictogram: "🏋",

  muscles: "대흉근 · 삼두근 · 전면삼각근",

  description:
    "바벨을 이용하는 대표적인 상체 프레스 운동입니다.",

  recommendedView: "side",

  metrics:
    "팔꿈치 · 바벨 궤적 · 좌우 대칭",

  checkpoints: [
    "바벨 하강 위치",
    "팔꿈치 정렬",
    "좌우 바벨 높이",
    "바벨 궤적"
  ]
},


{
  id: "dumbbell-bench-press",

  name: "덤벨 벤치프레스",

  category: "chest",

  equipment: "dumbbell",

  pictogram: "🏋",

  muscles: "대흉근 · 삼두근 · 어깨",

  description:
    "덤벨을 사용해 좌우 독립적으로 수행하는 벤치프레스입니다.",

  recommendedView: "front",

  metrics:
    "좌우 대칭 · 팔꿈치 · 어깨",

  checkpoints: [
    "덤벨 높이",
    "좌우 속도",
    "팔꿈치 정렬",
    "어깨 안정성"
  ]
},


{
  id: "incline-bench",

  name: "인클라인 벤치프레스",

  category: "chest",

  equipment: "barbell",

  pictogram: "🏋",

  muscles: "상부 대흉근 · 삼두근 · 어깨",

  description:
    "경사진 벤치에서 수행하는 프레스입니다.",

  recommendedView: "side",

  metrics:
    "바벨 궤적 · 팔꿈치 · 어깨",

  checkpoints: [
    "바벨 경로",
    "팔꿈치 위치",
    "어깨 안정성",
    "좌우 균형"
  ]
},


{
  id: "chest-fly",

  name: "덤벨 플라이",

  category: "chest",

  equipment: "dumbbell",

  pictogram: "🪽",

  muscles: "대흉근 · 전면삼각근",

  description:
    "덤벨을 양옆으로 벌렸다 모으는 가슴 운동입니다.",

  recommendedView: "front",

  metrics:
    "어깨 ROM · 팔꿈치 각도 · 좌우 대칭",

  checkpoints: [
    "팔꿈치 각도 유지",
    "좌우 깊이",
    "어깨 과신전",
    "덤벨 경로"
  ]
},


{
  id: "cable-fly",

  name: "케이블 플라이",

  category: "chest",

  equipment: "cable",

  pictogram: "🪽",

  muscles: "대흉근 · 어깨",

  description:
    "케이블 저항을 이용한 가슴 모으기 운동입니다.",

  recommendedView: "front",

  metrics:
    "좌우 대칭 · 어깨 ROM · 손 경로",

  checkpoints: [
    "좌우 손 높이",
    "어깨 안정성",
    "몸통 흔들림",
    "가동범위"
  ]
},


{
  id: "dip",

  name: "딥스",

  category: "chest",

  equipment: "bodyweight",

  pictogram: "💪",

  muscles: "대흉근 · 삼두근 · 어깨",

  description:
    "평행봉에서 수행하는 맨몸 프레스 운동입니다.",

  recommendedView: "side",

  metrics:
    "팔꿈치 ROM · 어깨 · 몸통",

  checkpoints: [
    "하강 깊이",
    "어깨 위치",
    "몸통 각도",
    "좌우 균형"
  ]
},


/* =========================================================
   BACK
========================================================= */

{
  id: "pull-up",

  name: "풀업",

  category: "back",

  equipment: "bodyweight",

  pictogram: "🧗",

  muscles: "광배근 · 승모근 · 이두근",

  description:
    "철봉을 이용한 대표적인 맨몸 당기기 운동입니다.",

  recommendedView: "front",

  metrics:
    "어깨 높이 · 팔꿈치 · 좌우 대칭",

  checkpoints: [
    "좌우 어깨 높이",
    "몸통 흔들림",
    "턱 높이",
    "팔꿈치 경로"
  ]
},


{
  id: "chin-up",

  name: "친업",

  category: "back",

  equipment: "bodyweight",

  pictogram: "🧗",

  muscles: "광배근 · 이두근",

  description:
    "언더그립으로 수행하는 철봉 당기기 운동입니다.",

  recommendedView: "front",

  metrics:
    "좌우 대칭 · 어깨 · 팔꿈치",

  checkpoints: [
    "어깨 정렬",
    "팔꿈치 경로",
    "몸통 반동",
    "완전 ROM"
  ]
},


{
  id: "barbell-row",

  name: "바벨 로우",

  category: "back",

  equipment: "barbell",

  pictogram: "🏋",

  muscles: "광배근 · 능형근 · 승모근 · 후면삼각근",

  description:
    "힙힌지 자세에서 바벨을 몸쪽으로 당기는 운동입니다.",

  recommendedView: "side",

  metrics:
    "몸통 각도 · 바벨 경로 · 팔꿈치",

  checkpoints: [
    "허리 정렬",
    "몸통 각도",
    "바벨과 몸의 거리",
    "반동"
  ]
},


{
  id: "dumbbell-row",

  name: "원암 덤벨 로우",

  category: "back",

  equipment: "dumbbell",

  pictogram: "🏋",

  muscles: "광배근 · 승모근 · 후면삼각근",

  description:
    "한쪽씩 수행하는 덤벨 로우입니다.",

  recommendedView: "side",

  metrics:
    "몸통 회전 · 팔꿈치 · 어깨",

  checkpoints: [
    "몸통 회전",
    "어깨 높이",
    "팔꿈치 경로",
    "ROM"
  ]
},


{
  id: "lat-pulldown",

  name: "랫 풀다운",

  category: "back",

  equipment: "machine",

  pictogram: "⬇️",

  muscles: "광배근 · 이두근 · 승모근",

  description:
    "랫 풀다운 머신을 이용한 수직 당기기 운동입니다.",

  recommendedView: "front",

  metrics:
    "좌우 바 높이 · 어깨 · 팔꿈치",

  checkpoints: [
    "좌우 당김 대칭",
    "어깨 상승",
    "몸통 반동",
    "바 위치"
  ]
},


{
  id: "seated-row",

  name: "시티드 로우",

  category: "back",

  equipment: "cable",

  pictogram: "⬅️",

  muscles: "광배근 · 능형근 · 승모근",

  description:
    "앉은 자세에서 케이블을 몸쪽으로 당기는 운동입니다.",

  recommendedView: "side",

  metrics:
    "몸통 움직임 · 팔꿈치 · 어깨",

  checkpoints: [
    "몸통 반동",
    "견갑 움직임",
    "팔꿈치 경로",
    "척추 정렬"
  ]
},


{
  id: "face-pull",

  name: "페이스 풀",

  category: "back",

  equipment: "cable",

  pictogram: "🎯",

  muscles: "후면삼각근 · 회전근개 · 승모근",

  description:
    "어깨 후면과 견갑 안정성을 강화하는 케이블 운동입니다.",

  recommendedView: "front",

  metrics:
    "팔꿈치 높이 · 좌우 대칭 · 어깨 회전",

  checkpoints: [
    "팔꿈치 높이",
    "좌우 손 위치",
    "어깨 외회전",
    "몸통 반동"
  ]
},


/* =========================================================
   SHOULDER
========================================================= */

{
  id: "overhead-press",

  name: "오버헤드 프레스",

  category: "shoulder",

  equipment: "barbell",

  pictogram: "⬆️",

  muscles: "삼각근 · 삼두근 · 코어",

  description:
    "바벨을 머리 위로 밀어 올리는 상체 프레스입니다.",

  recommendedView: "side",

  metrics:
    "바벨 궤적 · 어깨 · 팔꿈치 · 몸통",

  checkpoints: [
    "바벨 중심선",
    "허리 과신전",
    "팔꿈치 위치",
    "락아웃"
  ]
},


{
  id: "dumbbell-shoulder-press",

  name: "덤벨 숄더 프레스",

  category: "shoulder",

  equipment: "dumbbell",

  pictogram: "⬆️",

  muscles: "삼각근 · 삼두근",

  description:
    "덤벨을 양손으로 머리 위로 밀어 올립니다.",

  recommendedView: "front",

  metrics:
    "좌우 높이 · 팔꿈치 · 어깨",

  checkpoints: [
    "덤벨 높이",
    "좌우 속도",
    "어깨 안정성",
    "팔꿈치 위치"
  ]
},


{
  id: "lateral-raise",

  name: "사이드 레터럴 레이즈",

  category: "shoulder",

  equipment: "dumbbell",

  pictogram: "🪽",

  muscles: "측면삼각근",

  description:
    "덤벨을 측면으로 들어 올리는 어깨 운동입니다.",

  recommendedView: "front",

  metrics:
    "좌우 높이 · 어깨 각도 · 몸통 흔들림",

  checkpoints: [
    "좌우 높이",
    "승모근 보상",
    "몸통 반동",
    "팔꿈치 각도"
  ]
},


{
  id: "front-raise",

  name: "프론트 레이즈",

  category: "shoulder",

  equipment: "dumbbell",

  pictogram: "⬆️",

  muscles: "전면삼각근",

  description:
    "덤벨을 전방으로 들어 올리는 운동입니다.",

  recommendedView: "side",

  metrics:
    "어깨 ROM · 몸통 · 팔꿈치",

  checkpoints: [
    "몸통 반동",
    "팔 높이",
    "허리 보상",
    "템포"
  ]
},


{
  id: "rear-delt-fly",

  name: "리어 델트 플라이",

  category: "shoulder",

  equipment: "dumbbell",

  pictogram: "🪽",

  muscles: "후면삼각근 · 능형근",

  description:
    "어깨 후면과 상부 등을 강화합니다.",

  recommendedView: "rear",

  metrics:
    "좌우 어깨 · 팔 경로 · 몸통",

  checkpoints: [
    "좌우 대칭",
    "견갑 움직임",
    "몸통 반동",
    "팔 높이"
  ]
},


/* =========================================================
   ARMS
========================================================= */

{
  id: "biceps-curl",

  name: "덤벨 컬",

  category: "arms",

  equipment: "dumbbell",

  pictogram: "💪",

  muscles: "상완이두근",

  description:
    "덤벨을 이용한 기본 이두근 운동입니다.",

  recommendedView: "side",

  metrics:
    "팔꿈치 각도 · 몸통 반동 · 좌우 차이",

  checkpoints: [
    "팔꿈치 고정",
    "몸통 반동",
    "완전 ROM",
    "좌우 속도"
  ]
},


{
  id: "hammer-curl",

  name: "해머 컬",

  category: "arms",

  equipment: "dumbbell",

  pictogram: "🔨",

  muscles: "상완근 · 상완요골근 · 이두근",

  description:
    "중립 그립으로 수행하는 덤벨 컬입니다.",

  recommendedView: "front",

  metrics:
    "좌우 ROM · 팔꿈치 위치",

  checkpoints: [
    "팔꿈치 고정",
    "좌우 높이",
    "몸통 흔들림",
    "손목 정렬"
  ]
},


{
  id: "triceps-pushdown",

  name: "트라이셉스 푸시다운",

  category: "arms",

  equipment: "cable",

  pictogram: "⬇️",

  muscles: "상완삼두근",

  description:
    "케이블을 아래로 밀어 삼두근을 강화합니다.",

  recommendedView: "side",

  metrics:
    "팔꿈치 ROM · 몸통",

  checkpoints: [
    "팔꿈치 고정",
    "완전 신전",
    "몸통 반동",
    "손목 정렬"
  ]
},


{
  id: "skull-crusher",

  name: "라잉 트라이셉스 익스텐션",

  category: "arms",

  equipment: "barbell",

  pictogram: "💪",

  muscles: "상완삼두근",

  description:
    "누운 자세에서 팔꿈치를 굽혔다 펴는 삼두 운동입니다.",

  recommendedView: "side",

  metrics:
    "팔꿈치 ROM · 어깨 안정성",

  checkpoints: [
    "팔꿈치 위치",
    "좌우 대칭",
    "어깨 움직임",
    "ROM"
  ]
},


/* =========================================================
   CORE
========================================================= */

{
  id: "plank",

  name: "플랭크",

  category: "core",

  equipment: "bodyweight",

  pictogram: "▬",

  muscles: "복부 · 코어 · 둔근",

  description:
    "몸통을 일직선으로 유지하는 기본 코어 안정화 운동입니다.",

  recommendedView: "side",

  metrics:
    "몸통 정렬 · 골반 높이 · 유지 시간",

  checkpoints: [
    "머리-골반-발목 정렬",
    "골반 처짐",
    "허리 과신전",
    "유지 안정성"
  ]
},


{
  id: "side-plank",

  name: "사이드 플랭크",

  category: "core",

  equipment: "bodyweight",

  pictogram: "▬",

  muscles: "복사근 · 둔근 · 코어",

  description:
    "측면 코어와 골반 안정성을 강화합니다.",

  recommendedView: "front",

  metrics:
    "골반 높이 · 몸통 정렬",

  checkpoints: [
    "골반 높이",
    "어깨 정렬",
    "몸통 회전",
    "좌우 차이"
  ]
},


{
  id: "dead-bug",

  name: "데드버그",

  category: "core",

  equipment: "bodyweight",

  pictogram: "✳️",

  muscles: "복부 · 심부코어",

  description:
    "사지 움직임 중 몸통 안정성을 유지하는 코어 운동입니다.",

  recommendedView: "top",

  metrics:
    "좌우 대칭 · 골반 안정성 · 사지 협응",

  checkpoints: [
    "허리 중립",
    "좌우 팔·다리 대칭",
    "골반 회전",
    "움직임 제어"
  ]
},


{
  id: "bird-dog",

  name: "버드독",

  category: "core",

  equipment: "bodyweight",

  pictogram: "🐦",

  muscles: "코어 · 둔근 · 척추 안정근",

  description:
    "네발 자세에서 반대 팔과 다리를 뻗는 안정성 운동입니다.",

  recommendedView: "rear",

  metrics:
    "골반 회전 · 어깨 · 좌우 대칭",

  checkpoints: [
    "골반 수평",
    "몸통 회전",
    "팔·다리 높이",
    "균형"
  ]
},


{
  id: "hollow-hold",

  name: "할로우 홀드",

  category: "core",

  equipment: "bodyweight",

  pictogram: "🌙",

  muscles: "복직근 · 심부코어",

  description:
    "전신을 굽힌 형태로 유지하는 체조식 코어 운동입니다.",

  recommendedView: "side",

  metrics:
    "몸통 곡선 · 골반 · 유지시간",

  checkpoints: [
    "허리 바닥 접촉",
    "다리 높이",
    "팔 위치",
    "유지 자세"
  ]
},


{
  id: "russian-twist",

  name: "러시안 트위스트",

  category: "core",

  equipment: "medicineball",

  pictogram: "🔄",

  muscles: "복사근 · 코어",

  description:
    "몸통 회전 능력을 강화하는 코어 운동입니다.",

  recommendedView: "front",

  metrics:
    "몸통 회전 · 좌우 ROM · 골반",

  checkpoints: [
    "좌우 회전 범위",
    "골반 안정",
    "몸통 기울기",
    "템포"
  ]
},


{
  id: "pallof-press",

  name: "팔로프 프레스",

  category: "core",

  equipment: "cable",

  pictogram: "↔️",

  muscles: "심부코어 · 복사근",

  description:
    "회전 저항을 버티며 몸통 안정성을 강화합니다.",

  recommendedView: "front",

  metrics:
    "몸통 회전 · 골반 · 손 경로",

  checkpoints: [
    "몸통 회전 억제",
    "골반 정렬",
    "팔 경로",
    "좌우 차이"
  ]
},


{
  id: "hanging-leg-raise",

  name: "행잉 레그 레이즈",

  category: "core",

  equipment: "bodyweight",

  pictogram: "🧗",

  muscles: "복부 · 고관절 굴곡근",

  description:
    "철봉에 매달려 다리를 들어 올리는 코어 운동입니다.",

  recommendedView: "side",

  metrics:
    "고관절 ROM · 몸통 흔들림",

  checkpoints: [
    "반동",
    "골반 후방회전",
    "다리 높이",
    "어깨 안정성"
  ]
},


/* =========================================================
   OLYMPIC LIFTING
========================================================= */

{
  id: "clean",

  name: "클린",

  category: "olympic",

  equipment: "barbell",

  pictogram: "🏋️",

  muscles: "전신 · 둔근 · 대퇴사두근 · 등 · 어깨",

  description:
    "바벨을 지면에서 어깨 랙 위치까지 폭발적으로 이동시키는 리프트입니다.",

  recommendedView: "side",

  metrics:
    "바벨 궤적 · 1차풀 · 2차풀 · 캐치 · 고관절",

  checkpoints: [
    "바벨과 몸의 거리",
    "무릎 재굽힘",
    "고관절 신전",
    "캐치 위치",
    "바벨 최고점"
  ]
},


{
  id: "power-clean",

  name: "파워 클린",

  category: "olympic",

  equipment: "barbell",

  pictogram: "⚡",

  muscles: "전신 · 하체 · 등 · 어깨",

  description:
    "높은 캐치 위치에서 받는 폭발적인 클린 동작입니다.",

  recommendedView: "side",

  metrics:
    "바벨 속도 · 궤적 · 고관절 신전 · 캐치",

  checkpoints: [
    "폭발적 신전",
    "바벨 수직 이동",
    "캐치 높이",
    "발 이동"
  ]
},


{
  id: "hang-clean",

  name: "행 클린",

  category: "olympic",

  equipment: "barbell",

  pictogram: "⚡",

  muscles: "둔근 · 햄스트링 · 등 · 어깨",

  description:
    "행 포지션에서 시작하는 클린 변형입니다.",

  recommendedView: "side",

  metrics:
    "힙힌지 · 바벨 궤적 · 신전 타이밍",

  checkpoints: [
    "행 시작 위치",
    "고관절 신전",
    "바벨 거리",
    "캐치 안정성"
  ]
},


{
  id: "snatch",

  name: "스내치",

  category: "olympic",

  equipment: "barbell",

  pictogram: "🏋️",

  muscles: "전신 · 하체 · 등 · 어깨 · 코어",

  description:
    "바벨을 한 번의 연속 동작으로 머리 위까지 이동시키는 리프트입니다.",

  recommendedView: "side",

  metrics:
    "바벨 궤적 · 속도 · 고관절 · 캐치 · 오버헤드",

  checkpoints: [
    "바벨 수직 경로",
    "2차풀",
    "오버헤드 위치",
    "캐치 깊이",
    "발 이동"
  ]
},


{
  id: "power-snatch",

  name: "파워 스내치",

  category: "olympic",

  equipment: "barbell",

  pictogram: "⚡",

  muscles: "전신 · 어깨 · 하체",

  description:
    "높은 자세에서 바벨을 캐치하는 스내치 변형입니다.",

  recommendedView: "side",

  metrics:
    "바벨 속도 · 궤적 · 캐치 높이",

  checkpoints: [
    "폭발적 신전",
    "바벨 경로",
    "캐치 위치",
    "오버헤드 안정성"
  ]
},


{
  id: "clean-and-jerk",

  name: "클린 앤 저크",

  category: "olympic",

  equipment: "barbell",

  pictogram: "🏋️",

  muscles: "전신",

  description:
    "클린 후 바벨을 머리 위로 올리는 올림픽 리프팅 종목입니다.",

  recommendedView: "side",

  metrics:
    "클린 궤적 · 딥 · 드라이브 · 저크 · 캐치",

  checkpoints: [
    "클린 캐치",
    "딥 수직성",
    "드라이브",
    "오버헤드 중심",
    "발 위치"
  ]
},


{
  id: "push-press",

  name: "푸시 프레스",

  category: "power",

  equipment: "barbell",

  pictogram: "⬆️",

  muscles: "하체 · 어깨 · 삼두근",

  description:
    "하체의 힘을 이용해 바벨을 머리 위로 밀어 올립니다.",

  recommendedView: "side",

  metrics:
    "딥 각도 · 바벨 속도 · 몸통 · 락아웃",

  checkpoints: [
    "딥 수직성",
    "하체-상체 연결",
    "바벨 경로",
    "락아웃"
  ]
},


{
  id: "high-pull",

  name: "하이 풀",

  category: "power",

  equipment: "barbell",

  pictogram: "⚡",

  muscles: "둔근 · 등 · 승모근 · 하체",

  description:
    "폭발적인 고관절 신전과 상체 당기기를 결합한 운동입니다.",

  recommendedView: "side",

  metrics:
    "바벨 속도 · 고관절 신전 · 바벨 높이",

  checkpoints: [
    "고관절 완전 신전",
    "바벨과 몸 거리",
    "팔 당김 타이밍",
    "최고 높이"
  ]
},


/* =========================================================
   POWER / PLYOMETRIC
========================================================= */

{
  id: "box-jump",

  name: "박스 점프",

  category: "plyometric",

  equipment: "box",

  pictogram: "📦",

  muscles: "둔근 · 대퇴사두근 · 종아리",

  description:
    "박스 위로 폭발적으로 점프하는 플라이오메트릭 운동입니다.",

  recommendedView: "side",

  metrics:
    "도약 각도 · 착지 · 무릎 · 고관절",

  checkpoints: [
    "팔 스윙",
    "고관절 신전",
    "착지 충격 흡수",
    "무릎 정렬"
  ]
},


{
  id: "vertical-jump",

  name: "수직 점프",

  category: "plyometric",

  equipment: "bodyweight",

  pictogram: "⬆️",

  muscles: "하체 · 둔근 · 종아리",

  description:
    "제자리에서 최대 높이로 점프하는 파워 테스트입니다.",

  recommendedView: "side",

  metrics:
    "점프 높이 · 체공시간 · 무릎 · 고관절",

  checkpoints: [
    "카운터무브먼트",
    "고관절 신전",
    "도약 타이밍",
    "착지"
  ]
},


{
  id: "squat-jump",

  name: "스쿼트 점프",

  category: "plyometric",

  equipment: "bodyweight",

  pictogram: "🚀",

  muscles: "하체 · 둔근",

  description:
    "스쿼트 자세에서 폭발적으로 점프합니다.",

  recommendedView: "side",

  metrics:
    "점프 높이 · 무릎 · 고관절 · 착지",

  checkpoints: [
    "스쿼트 깊이",
    "신전 속도",
    "착지 무릎",
    "좌우 균형"
  ]
},


{
  id: "broad-jump",

  name: "제자리 멀리뛰기",

  category: "plyometric",

  equipment: "bodyweight",

  pictogram: "➡️",

  muscles: "둔근 · 햄스트링 · 대퇴사두근",

  description:
    "수평 방향 폭발력을 평가하는 점프입니다.",

  recommendedView: "side",

  metrics:
    "도약 각도 · 거리 · 착지 · 몸통",

  checkpoints: [
    "팔 스윙",
    "도약 각도",
    "고관절 신전",
    "착지 안정성"
  ]
},


{
  id: "depth-jump",

  name: "뎁스 점프",

  category: "plyometric",

  equipment: "box",

  pictogram: "⚡",

  muscles: "하체 · 종아리 · 둔근",

  description:
    "박스에서 내려온 뒤 빠르게 재도약하는 반응성 운동입니다.",

  recommendedView: "side",

  metrics:
    "접지시간 · 점프높이 · 무릎 · 착지",

  checkpoints: [
    "접지시간",
    "무릎 정렬",
    "재도약 속도",
    "착지 안정"
  ]
},


{
  id: "lateral-bound",

  name: "레터럴 바운드",

  category: "plyometric",

  equipment: "bodyweight",

  pictogram: "↔️",

  muscles: "둔근 · 하체 · 발목",

  description:
    "좌우 방향으로 폭발적으로 이동하는 편측 점프입니다.",

  recommendedView: "front",

  metrics:
    "좌우 거리 · 무릎 · 골반 · 착지",

  checkpoints: [
    "착지 무릎",
    "골반 안정",
    "좌우 거리",
    "균형"
  ]
},


{
  id: "single-leg-hop",

  name: "싱글 레그 홉",

  category: "plyometric",

  equipment: "bodyweight",

  pictogram: "🦵",

  muscles: "하체 · 발목 · 둔근",

  description:
    "한 다리로 도약과 착지를 반복하는 운동입니다.",

  recommendedView: "front",

  metrics:
    "무릎 정렬 · 착지 · 좌우 차이",

  checkpoints: [
    "무릎 외반",
    "골반 안정",
    "착지 균형",
    "좌우 차이"
  ]
},


{
  id: "medicine-ball-chest-pass",

  name: "메디신볼 체스트 패스",

  category: "power",

  equipment: "medicineball",

  pictogram: "🏐",

  muscles: "가슴 · 삼두 · 코어",

  description:
    "메디신볼을 전방으로 폭발적으로 던지는 상체 파워 운동입니다.",

  recommendedView: "side",

  metrics:
    "팔 속도 · 몸통 · 공 릴리즈",

  checkpoints: [
    "몸통 안정성",
    "팔 신전",
    "릴리즈 타이밍",
    "좌우 대칭"
  ]
},


{
  id: "medicine-ball-slam",

  name: "메디신볼 슬램",

  category: "power",

  equipment: "medicineball",

  pictogram: "💥",

  muscles: "광배근 · 코어 · 어깨 · 하체",

  description:
    "메디신볼을 머리 위에서 바닥으로 강하게 던지는 전신 파워 운동입니다.",

  recommendedView: "side",

  metrics:
    "몸통 굴곡 · 팔 경로 · 고관절",

  checkpoints: [
    "오버헤드 위치",
    "몸통 사용",
    "고관절 굴곡",
    "릴리즈 타이밍"
  ]
},


{
  id: "rotational-med-ball-throw",

  name: "회전 메디신볼 던지기",

  category: "power",

  equipment: "medicineball",

  pictogram: "🔄",

  muscles: "코어 · 둔근 · 어깨",

  description:
    "몸통 회전을 이용해 메디신볼을 던지는 회전 파워 운동입니다.",

  recommendedView: "top",

  metrics:
    "몸통 회전 · 골반 회전 · 어깨 회전",

  checkpoints: [
    "골반 선행",
    "몸통 회전",
    "체중 이동",
    "릴리즈"
  ]
},


/* =========================================================
   KETTLEBELL / FUNCTIONAL
========================================================= */

{
  id: "kettlebell-swing",

  name: "케틀벨 스윙",

  category: "functional",

  equipment: "kettlebell",

  pictogram: "🔔",

  muscles: "둔근 · 햄스트링 · 코어 · 등",

  description:
    "힙힌지와 폭발적인 고관절 신전을 사용하는 운동입니다.",

  recommendedView: "side",

  metrics:
    "고관절 · 몸통 · 케틀벨 궤적",

  checkpoints: [
    "힙힌지",
    "고관절 신전",
    "무릎 과굴곡",
    "케틀벨 궤적"
  ]
},


{
  id: "turkish-get-up",

  name: "터키시 겟업",

  category: "functional",

  equipment: "kettlebell",

  pictogram: "🔔",

  muscles: "전신 · 어깨 · 코어 · 둔근",

  description:
    "누운 자세에서 일어나는 전신 안정성 운동입니다.",

  recommendedView: "front",

  metrics:
    "어깨 안정성 · 몸통 · 고관절 · 균형",

  checkpoints: [
    "팔 수직 유지",
    "몸통 제어",
    "고관절 안정성",
    "단계별 균형"
  ]
},


{
  id: "farmers-walk",

  name: "파머스 워크",

  category: "functional",

  equipment: "dumbbell",

  pictogram: "🚶",

  muscles: "그립 · 승모근 · 코어 · 하체",

  description:
    "중량을 들고 걸으며 전신 안정성과 그립을 강화합니다.",

  recommendedView: "front",

  metrics:
    "좌우 어깨 · 골반 · 보행 대칭",

  checkpoints: [
    "어깨 높이",
    "몸통 기울기",
    "보폭 대칭",
    "골반 안정성"
  ]
},


{
  id: "sled-push",

  name: "슬레드 푸시",

  category: "functional",

  equipment: "sled",

  pictogram: "➡️",

  muscles: "하체 · 둔근 · 종아리 · 코어",

  description:
    "슬레드를 밀면서 가속력과 하체 추진력을 강화합니다.",

  recommendedView: "side",

  metrics:
    "몸통 각도 · 무릎 · 고관절 · 보폭",

  checkpoints: [
    "몸통 각도",
    "발 접지",
    "고관절 신전",
    "보폭"
  ]
},


{
  id: "bear-crawl",

  name: "베어 크롤",

  category: "functional",

  equipment: "bodyweight",

  pictogram: "🐻",

  muscles: "코어 · 어깨 · 하체",

  description:
    "네발 자세로 이동하며 전신 협응과 코어 안정성을 강화합니다.",

  recommendedView: "side",

  metrics:
    "몸통 안정성 · 골반 · 좌우 협응",

  checkpoints: [
    "골반 높이",
    "몸통 회전",
    "반대 손발 협응",
    "무릎 높이"
  ]
},


{
  id: "mountain-climber",

  name: "마운틴 클라이머",

  category: "functional",

  equipment: "bodyweight",

  pictogram: "⛰️",

  muscles: "코어 · 고관절 · 어깨",

  description:
    "플랭크 자세에서 무릎을 빠르게 당기는 전신 운동입니다.",

  recommendedView: "side",

  metrics:
    "몸통 · 골반 · 무릎 속도",

  checkpoints: [
    "골반 높이",
    "몸통 안정",
    "무릎 이동",
    "좌우 템포"
  ]
},


{
  id: "burpee",

  name: "버피",

  category: "fullbody",

  equipment: "bodyweight",

  pictogram: "🔥",

  muscles: "전신",

  description:
    "스쿼트, 플랭크, 점프를 연속으로 수행하는 전신 운동입니다.",

  recommendedView: "side",

  metrics:
    "전환시간 · 몸통 · 무릎 · 점프",

  checkpoints: [
    "플랭크 정렬",
    "발 착지 위치",
    "점프",
    "반복 템포"
  ]
},


/* =========================================================
   MOBILITY / CORRECTIVE
========================================================= */

{
  id: "ankle-mobility",

  name: "발목 가동성 테스트",

  category: "mobility",

  equipment: "bodyweight",

  pictogram: "🦶",

  muscles: "발목 · 종아리",

  description:
    "발목 배측굴곡 가동범위를 평가합니다.",

  recommendedView: "side",

  metrics:
    "발목 각도 · 무릎 이동거리",

  checkpoints: [
    "뒤꿈치 들림",
    "무릎 진행 방향",
    "좌우 차이",
    "최대 ROM"
  ]
},


{
  id: "hip-mobility",

  name: "고관절 가동성 테스트",

  category: "mobility",

  equipment: "bodyweight",

  pictogram: "🦵",

  muscles: "고관절",

  description:
    "고관절의 움직임과 좌우 가동범위를 확인합니다.",

  recommendedView: "front",

  metrics:
    "고관절 ROM · 골반 회전 · 좌우 차이",

  checkpoints: [
    "골반 보상",
    "좌우 ROM",
    "몸통 움직임",
    "고관절 회전"
  ]
},


{
  id: "shoulder-mobility",

  name: "어깨 가동성 테스트",

  category: "mobility",

  equipment: "bodyweight",

  pictogram: "🙆",

  muscles: "어깨 · 흉추",

  description:
    "어깨 굴곡과 좌우 가동성을 확인합니다.",

  recommendedView: "side",

  metrics:
    "어깨 굴곡 · 몸통 보상 · 좌우 차이",

  checkpoints: [
    "팔 높이",
    "허리 과신전",
    "좌우 차이",
    "흉추 움직임"
  ]
},


{
  id: "wall-slide",

  name: "월 슬라이드",

  category: "mobility",

  equipment: "bodyweight",

  pictogram: "🙆",

  muscles: "견갑 안정근 · 어깨",

  description:
    "벽을 이용해 어깨 가동성과 견갑 움직임을 개선합니다.",

  recommendedView: "rear",

  metrics:
    "어깨 높이 · 견갑 대칭 · 팔 ROM",

  checkpoints: [
    "좌우 팔 높이",
    "견갑 움직임",
    "허리 보상",
    "손목 접촉"
  ]
},


{
  id: "band-pull-apart",

  name: "밴드 풀 어파트",

  category: "mobility",

  equipment: "band",

  pictogram: "↔️",

  muscles: "후면삼각근 · 능형근 · 승모근",

  description:
    "밴드를 양옆으로 벌려 상부 등과 어깨 안정성을 강화합니다.",

  recommendedView: "front",

  metrics:
    "좌우 대칭 · 어깨 높이 · 팔 경로",

  checkpoints: [
    "어깨 상승",
    "좌우 대칭",
    "팔꿈치 정렬",
    "몸통 반동"
  ]
},


{
  id: "single-leg-balance",

  name: "싱글 레그 밸런스",

  category: "mobility",

  equipment: "bodyweight",

  pictogram: "⚖️",

  muscles: "발목 · 둔근 · 코어",

  description:
    "한 다리 지지 능력과 자세 안정성을 평가합니다.",

  recommendedView: "front",

  metrics:
    "골반 흔들림 · 무릎 · 몸통 · 유지시간",

  checkpoints: [
    "골반 수평",
    "무릎 정렬",
    "발목 흔들림",
    "몸통 이동"
  ]
}

];


/* =========================================================
   ADDITIONAL EXERCISES
========================================================= */

EXERCISES.push(

{
  id: "hack-squat",
  name: "핵 스쿼트",
  category: "lower",
  equipment: "machine",
  pictogram: "🦿",
  muscles: "대퇴사두근 · 둔근",
  description: "핵 스쿼트 머신을 이용한 하체 운동입니다.",
  recommendedView: "side",
  metrics: "무릎 · 고관절 · ROM",
  checkpoints: [
    "무릎 정렬",
    "스쿼트 깊이",
    "골반 위치",
    "발 압력"
  ]
},

{
  id: "smith-squat",
  name: "스미스머신 스쿼트",
  category: "lower",
  equipment: "machine",
  pictogram: "🏋",
  muscles: "대퇴사두근 · 둔근",
  description: "스미스머신에서 수행하는 스쿼트입니다.",
  recommendedView: "side",
  metrics: "무릎 · 고관절 · 몸통",
  checkpoints: [
    "발 위치",
    "무릎 정렬",
    "깊이",
    "골반"
  ]
},

{
  id: "dumbbell-rdl",
  name: "덤벨 루마니안 데드리프트",
  category: "lower",
  equipment: "dumbbell",
  pictogram: "🏋",
  muscles: "햄스트링 · 둔근",
  description: "덤벨을 이용한 힙힌지 운동입니다.",
  recommendedView: "side",
  metrics: "고관절 · 몸통 · 무릎",
  checkpoints: [
    "힙힌지",
    "허리 정렬",
    "덤벨 경로",
    "무릎 굴곡"
  ]
},

{
  id: "single-leg-rdl",
  name: "싱글 레그 RDL",
  category: "lower",
  equipment: "dumbbell",
  pictogram: "🦵",
  muscles: "햄스트링 · 둔근 · 코어",
  description: "한 다리로 수행하는 힙힌지 운동입니다.",
  recommendedView: "rear",
  metrics: "골반 · 균형 · 고관절",
  checkpoints: [
    "골반 회전",
    "지지 무릎",
    "몸통 정렬",
    "균형"
  ]
},

{
  id: "nordic-curl",
  name: "노르딕 햄스트링 컬",
  category: "lower",
  equipment: "bodyweight",
  pictogram: "🦵",
  muscles: "햄스트링",
  description: "햄스트링의 편심성 근력을 강화하는 운동입니다.",
  recommendedView: "side",
  metrics: "무릎 · 몸통 정렬 · 하강 속도",
  checkpoints: [
    "몸통 일직선",
    "고관절 굴곡",
    "하강 제어",
    "좌우 대칭"
  ]
},

{
  id: "copenhagen-plank",
  name: "코펜하겐 플랭크",
  category: "core",
  equipment: "bodyweight",
  pictogram: "▬",
  muscles: "내전근 · 코어",
  description: "내전근과 측면 코어를 강화하는 운동입니다.",
  recommendedView: "front",
  metrics: "골반 · 몸통 · 유지시간",
  checkpoints: [
    "골반 높이",
    "몸통 정렬",
    "지지 다리",
    "좌우 차이"
  ]
},

{
  id: "landmine-press",
  name: "랜드마인 프레스",
  category: "shoulder",
  equipment: "landmine",
  pictogram: "↗️",
  muscles: "어깨 · 가슴 · 삼두 · 코어",
  description: "랜드마인을 전상방으로 밀어 올리는 운동입니다.",
  recommendedView: "side",
  metrics: "어깨 · 몸통 · 바벨 경로",
  checkpoints: [
    "몸통 회전",
    "팔 경로",
    "어깨 안정성",
    "락아웃"
  ]
},

{
  id: "thruster",
  name: "쓰러스터",
  category: "fullbody",
  equipment: "barbell",
  pictogram: "🚀",
  muscles: "하체 · 어깨 · 코어",
  description: "프론트 스쿼트와 오버헤드 프레스를 연결한 전신 운동입니다.",
  recommendedView: "side",
  metrics: "스쿼트 · 신전 · 바벨 궤적",
  checkpoints: [
    "스쿼트 깊이",
    "하체 신전",
    "바벨 타이밍",
    "락아웃"
  ]
},

{
  id: "battle-rope",
  name: "배틀로프",
  category: "functional",
  equipment: "other",
  pictogram: "〰️",
  muscles: "어깨 · 팔 · 코어",
  description: "로프를 반복적으로 움직이는 전신 컨디셔닝 운동입니다.",
  recommendedView: "front",
  metrics: "좌우 리듬 · 어깨 · 몸통",
  checkpoints: [
    "좌우 리듬",
    "어깨 높이",
    "몸통 안정",
    "무릎 자세"
  ]
},

{
  id: "inverted-row",
  name: "인버티드 로우",
  category: "back",
  equipment: "bodyweight",
  pictogram: "↖️",
  muscles: "광배근 · 능형근 · 이두근",
  description: "몸을 기울인 상태에서 자신의 체중을 당기는 운동입니다.",
  recommendedView: "side",
  metrics: "몸통 정렬 · 팔꿈치 · 어깨",
  checkpoints: [
    "몸통 일직선",
    "가슴 높이",
    "견갑 움직임",
    "팔꿈치"
  ]
},

{
  id: "diamond-push-up",
  name: "다이아몬드 푸시업",
  category: "arms",
  equipment: "bodyweight",
  pictogram: "💎",
  muscles: "삼두근 · 가슴 · 어깨",
  description: "좁은 손 간격으로 수행하는 푸시업입니다.",
  recommendedView: "side",
  metrics: "팔꿈치 · 몸통 · ROM",
  checkpoints: [
    "팔꿈치 경로",
    "몸통 정렬",
    "가슴 깊이",
    "골반"
  ]
},

{
  id: "pike-push-up",
  name: "파이크 푸시업",
  category: "shoulder",
  equipment: "bodyweight",
  pictogram: "🔺",
  muscles: "어깨 · 삼두근",
  description: "엉덩이를 높여 수행하는 맨몸 어깨 프레스입니다.",
  recommendedView: "side",
  metrics: "어깨 · 팔꿈치 · 몸통",
  checkpoints: [
    "머리 경로",
    "팔꿈치",
    "골반 높이",
    "어깨 ROM"
  ]
},

{
  id: "jump-lunge",
  name: "점프 런지",
  category: "plyometric",
  equipment: "bodyweight",
  pictogram: "🚀",
  muscles: "둔근 · 대퇴사두근 · 종아리",
  description: "런지 자세에서 좌우 다리를 교대하며 점프합니다.",
  recommendedView: "front",
  metrics: "착지 · 무릎 · 골반 · 좌우 대칭",
  checkpoints: [
    "착지 무릎",
    "골반 안정",
    "좌우 대칭",
    "점프 리듬"
  ]
},

{
  id: "tuck-jump",
  name: "턱 점프",
  category: "plyometric",
  equipment: "bodyweight",
  pictogram: "⬆️",
  muscles: "하체 · 코어",
  description: "점프 중 무릎을 빠르게 가슴 방향으로 당기는 운동입니다.",
  recommendedView: "side",
  metrics: "점프높이 · 무릎 · 착지",
  checkpoints: [
    "도약",
    "무릎 상승",
    "착지",
    "반복 리듬"
  ]
},

{
  id: "skater-jump",
  name: "스케이터 점프",
  category: "plyometric",
  equipment: "bodyweight",
  pictogram: "⛸️",
  muscles: "둔근 · 하체 · 코어",
  description: "좌우 측면으로 이동하며 한 발 착지를 반복합니다.",
  recommendedView: "front",
  metrics: "측면거리 · 무릎 · 골반 · 균형",
  checkpoints: [
    "측면 이동거리",
    "착지 무릎",
    "골반",
    "균형"
  ]
}

);


/* =========================================================
   EXERCISE UTILS
========================================================= */

function getExerciseById(id) {

  return EXERCISES.find(
    exercise => exercise.id === id
  ) || null;

}


function getExerciseCategoryLabel(category) {

  return EXERCISE_CATEGORY_LABELS[category] || category;

}


function getExerciseEquipmentLabel(equipment) {

  return EXERCISE_EQUIPMENT_LABELS[equipment] || equipment;

}


function getExercisesByCategory(category) {

  if (!category || category === "all") {

    return [...EXERCISES];

  }

  return EXERCISES.filter(
    exercise => exercise.category === category
  );

}


function getExercisesByEquipment(equipment) {

  if (!equipment || equipment === "all") {

    return [...EXERCISES];

  }

  return EXERCISES.filter(
    exercise => exercise.equipment === equipment
  );

}


/* =========================================================
   SEARCH
========================================================= */

function searchExercises(
  keyword = "",
  category = "all",
  equipment = "all"
) {

  const search = keyword
    .trim()
    .toLowerCase();


  return EXERCISES.filter(exercise => {

    const categoryMatch =
      category === "all" ||
      exercise.category === category;


    const equipmentMatch =
      equipment === "all" ||
      exercise.equipment === equipment;


    const searchTarget = [

      exercise.name,

      exercise.muscles,

      exercise.description,

      getExerciseCategoryLabel(
        exercise.category
      ),

      getExerciseEquipmentLabel(
        exercise.equipment
      )

    ]
      .join(" ")
      .toLowerCase();


    const keywordMatch =
      !search ||
      searchTarget.includes(search);


    return (
      categoryMatch &&
      equipmentMatch &&
      keywordMatch
    );

  });

}


/* =========================================================
   ANALYSIS PROFILE

   운동별 기본 분석 설정
========================================================= */

function getExerciseAnalysisProfile(exerciseId) {

  const exercise =
    getExerciseById(exerciseId);


  if (!exercise) {

    return null;

  }


  const profile = {

    exerciseId: exercise.id,

    name: exercise.name,

    recommendedView:
      exercise.recommendedView || "side",

    checkpoints:
      exercise.checkpoints || [],


    angles: {

      knee: true,

      hip: true,

      trunk: true,

      ankle: true

    },


    trackBar:
      exercise.equipment === "barbell" ||
      exercise.equipment === "trapbar" ||
      exercise.equipment === "landmine",


    repDetection: true,

    symmetryAnalysis: true,

    stabilityAnalysis: true,

    romAnalysis: true,

    tempoAnalysis: true

  };


  /* -------------------------------------------------------
     UPPER BODY
  ------------------------------------------------------- */

  if (
    exercise.category === "chest" ||
    exercise.category === "back" ||
    exercise.category === "shoulder" ||
    exercise.category === "arms"
  ) {

    profile.angles = {

      knee: false,

      hip: false,

      trunk: true,

      ankle: false,

      shoulder: true,

      elbow: true

    };

  }


  /* -------------------------------------------------------
     CORE
  ------------------------------------------------------- */

  if (exercise.category === "core") {

    profile.angles = {

      knee: true,

      hip: true,

      trunk: true,

      ankle: false,

      shoulder: true

    };

  }


  /* -------------------------------------------------------
     OLYMPIC
  ------------------------------------------------------- */

  if (
    exercise.category === "olympic" ||
    exercise.category === "power"
  ) {

    profile.trackBar = true;

    profile.velocityAnalysis = true;

    profile.phaseAnalysis = true;

  }


  /* -------------------------------------------------------
     PLYOMETRIC
  ------------------------------------------------------- */

  if (exercise.category === "plyometric") {

    profile.jumpAnalysis = true;

    profile.flightTimeAnalysis = true;

    profile.landingAnalysis = true;

  }


  /* -------------------------------------------------------
     MOBILITY
  ------------------------------------------------------- */

  if (exercise.category === "mobility") {

    profile.repDetection = false;

    profile.mobilityAnalysis = true;

  }


  return profile;

}


/* =========================================================
   ANALYSIS RECOMMENDATIONS
========================================================= */

function getExerciseRecommendations(
  exerciseId,
  result = {}
) {

  const exercise =
    getExerciseById(exerciseId);


  if (!exercise) {

    return [];

  }


  const recommendations = [];


  const symmetry =
    Number(result.symmetry || 100);


  const stability =
    Number(result.stability || 100);


  const mobility =
    Number(result.mobility || 100);


  const technique =
    Number(result.technique || 100);


  /* -------------------------------------------------------
     SYMMETRY
  ------------------------------------------------------- */

  if (symmetry < 85) {

    recommendations.push({

      title: "좌우 대칭 보강",

      description:
        "편측 운동과 낮은 강도의 컨트롤 훈련으로 좌우 움직임 차이를 확인하세요."

    });

  }


  /* -------------------------------------------------------
     STABILITY
  ------------------------------------------------------- */

  if (stability < 80) {

    recommendations.push({

      title: "안정성 훈련",

      description:
        "코어 안정성과 느린 템포 동작을 활용해 자세 제어 능력을 강화하세요."

    });

  }


  /* -------------------------------------------------------
     MOBILITY
  ------------------------------------------------------- */

  if (mobility < 80) {

    recommendations.push({

      title: "가동성 보강",

      description:
        "해당 동작에 필요한 발목·고관절·어깨 가동범위를 단계적으로 확보하세요."

    });

  }


  /* -------------------------------------------------------
     TECHNIQUE
  ------------------------------------------------------- */

  if (technique < 80) {

    recommendations.push({

      title: "기술 패턴 교정",

      description:
        "중량이나 속도를 낮추고 기준선과 관절 각도를 확인하며 정확한 동작을 반복하세요."

    });

  }


  /* -------------------------------------------------------
     LOWER BODY
  ------------------------------------------------------- */

  if (exercise.category === "lower") {

    recommendations.push({

      title: "하체 컨트롤",

      description:
        "스플릿 스쿼트·싱글 레그 밸런스 등으로 무릎과 골반 제어 능력을 강화할 수 있습니다."

    });

  }


  /* -------------------------------------------------------
     OLYMPIC
  ------------------------------------------------------- */

  if (exercise.category === "olympic") {

    recommendations.push({

      title: "리프팅 기술",

      description:
        "가벼운 중량에서 바벨 궤적과 각 구간의 타이밍을 먼저 안정시키는 것이 좋습니다."

    });

  }


  /* -------------------------------------------------------
     PLYOMETRIC
  ------------------------------------------------------- */

  if (exercise.category === "plyometric") {

    recommendations.push({

      title: "착지 안정성",

      description:
        "점프 높이보다 안정적인 착지와 좌우 무릎 정렬을 우선 확인하세요."

    });

  }


  return recommendations.slice(0, 6);

}


/* =========================================================
   EXPOSE GLOBAL
========================================================= */

window.EXERCISES =
  EXERCISES;


window.EXERCISE_CATEGORY_LABELS =
  EXERCISE_CATEGORY_LABELS;


window.EXERCISE_EQUIPMENT_LABELS =
  EXERCISE_EQUIPMENT_LABELS;


window.getExerciseById =
  getExerciseById;


window.getExerciseCategoryLabel =
  getExerciseCategoryLabel;


window.getExerciseEquipmentLabel =
  getExerciseEquipmentLabel;


window.getExercisesByCategory =
  getExercisesByCategory;


window.getExercisesByEquipment =
  getExercisesByEquipment;


window.searchExercises =
  searchExercises;


window.getExerciseAnalysisProfile =
  getExerciseAnalysisProfile;


window.getExerciseRecommendations =
  getExerciseRecommendations;


/* =========================================================
   DEBUG
========================================================= */

console.log(
  `[WEIGHT LAB] Exercise Database Loaded: ${EXERCISES.length}`
);