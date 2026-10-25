function Flower({ x, y, color, r = 8 }) {
  const c = r * 1.25
  return (
    <g>
      <circle cx={x}   cy={y - c} r={r * 0.58} fill={color} opacity="0.92"/>
      <circle cx={x + c} cy={y} r={r * 0.58} fill={color} opacity="0.92"/>
      <circle cx={x}   cy={y + c} r={r * 0.58} fill={color} opacity="0.92"/>
      <circle cx={x - c} cy={y} r={r * 0.58} fill={color} opacity="0.92"/>
      <circle cx={x + c * 0.72} cy={y - c * 0.72} r={r * 0.48} fill={color} opacity="0.80"/>
      <circle cx={x + c * 0.72} cy={y + c * 0.72} r={r * 0.48} fill={color} opacity="0.80"/>
      <circle cx={x - c * 0.72} cy={y - c * 0.72} r={r * 0.48} fill={color} opacity="0.80"/>
      <circle cx={x - c * 0.72} cy={y + c * 0.72} r={r * 0.48} fill={color} opacity="0.80"/>
      <circle cx={x} cy={y} r={r * 0.42} fill="#FFE66D"/>
    </g>
  )
}

function PineTree({ x, y, h = 120, w = 50, color = '#2E7D32', dark = '#1B5E20' }) {
  return (
    <g>
      <rect x={x - 4} y={y} width={8} height={h * 0.28} fill="#5D4037"/>
      <polygon points={`${x},${y - h} ${x - w * 0.5},${y - h * 0.25} ${x + w * 0.5},${y - h * 0.25}`} fill={color}/>
      <polygon points={`${x},${y - h * 0.72} ${x - w * 0.65},${y - h * 0.1} ${x + w * 0.65},${y - h * 0.1}`} fill={dark}/>
      <polygon points={`${x},${y - h * 0.48} ${x - w * 0.78},${y + h * 0.04} ${x + w * 0.78},${y + h * 0.04}`} fill={color}/>
    </g>
  )
}

function RoundTree({ x, y, r = 55, trunkH = 45, color = '#388E3C', light = '#66BB6A', dark = '#2E7D32' }) {
  return (
    <g>
      <rect x={x - 6} y={y - trunkH} width={12} height={trunkH + 8} fill="#5D4037" rx="3"/>
      <ellipse cx={x} cy={y - trunkH - r * 0.7} rx={r} ry={r * 0.88} fill={dark}/>
      <ellipse cx={x - r * 0.3} cy={y - trunkH - r * 0.85} rx={r * 0.72} ry={r * 0.72} fill={color}/>
      <ellipse cx={x + r * 0.2} cy={y - trunkH - r * 0.75} rx={r * 0.62} ry={r * 0.62} fill={light}/>
    </g>
  )
}

export default function ForestBackground() {
  return (
    <div className="forest-bg">
      <svg
        viewBox="0 0 1440 900"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
        width="100%"
        height="100%"
      >
        <defs>
          <linearGradient id="fSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#7EC8E3"/>
            <stop offset="55%"  stopColor="#B8E0F7"/>
            <stop offset="100%" stopColor="#D0ECE7"/>
          </linearGradient>
          <linearGradient id="fGround" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#8BC34A"/>
            <stop offset="60%"  stopColor="#558B2F"/>
            <stop offset="100%" stopColor="#33691E"/>
          </linearGradient>
          <linearGradient id="fHill1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#A5D6A7"/>
            <stop offset="100%" stopColor="#66BB6A"/>
          </linearGradient>
          <linearGradient id="fHill2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#81C784"/>
            <stop offset="100%" stopColor="#4CAF50"/>
          </linearGradient>
          <linearGradient id="fStream" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="#29B6F6"/>
            <stop offset="50%"  stopColor="#81D4FA"/>
            <stop offset="100%" stopColor="#29B6F6"/>
          </linearGradient>
          <radialGradient id="fSun" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#FFF9C4" stopOpacity="1"/>
            <stop offset="50%"  stopColor="#FFF176" stopOpacity="0.9"/>
            <stop offset="100%" stopColor="#FFEB3B" stopOpacity="0.5"/>
          </radialGradient>
          <radialGradient id="fSunGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#FFF176" stopOpacity="0.6"/>
            <stop offset="100%" stopColor="#FFF176" stopOpacity="0"/>
          </radialGradient>
          <filter id="fBlur3" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3"/>
          </filter>
        </defs>

        {/* SKY */}
        <rect x="0" y="0" width="1440" height="900" fill="url(#fSky)"/>

        {/* SUN */}
        <circle cx="1260" cy="110" r="160" fill="url(#fSunGlow)"/>
        <circle cx="1260" cy="110" r="70"  fill="url(#fSun)"/>
        <circle cx="1260" cy="110" r="54"  fill="#FFF9C4"/>

        {/* CLOUDS */}
        <g className="cloud-1" opacity="0.92">
          <ellipse cx="130" cy="130" rx="72" ry="42" fill="white"/>
          <ellipse cx="185" cy="108" rx="62" ry="48" fill="white"/>
          <ellipse cx="245" cy="128" rx="72" ry="40" fill="white"/>
          <ellipse cx="300" cy="138" rx="52" ry="36" fill="#F5F5F5"/>
        </g>
        <g className="cloud-2" opacity="0.85">
          <ellipse cx="540" cy="90"  rx="62" ry="36" fill="white"/>
          <ellipse cx="596" cy="68"  rx="57" ry="44" fill="white"/>
          <ellipse cx="655" cy="90"  rx="66" ry="36" fill="white"/>
          <ellipse cx="706" cy="100" rx="46" ry="30" fill="#F5F5F5"/>
        </g>
        <g className="cloud-3" opacity="0.78">
          <ellipse cx="895" cy="148" rx="55" ry="33" fill="white"/>
          <ellipse cx="948" cy="124" rx="52" ry="40" fill="white"/>
          <ellipse cx="1005" cy="146" rx="58" ry="32" fill="white"/>
        </g>

        {/* BACKGROUND HILLS */}
        <path
          d="M0,540 Q180,420 380,480 Q580,390 780,455 Q980,385 1170,440 Q1320,408 1440,455 L1440,680 L0,680 Z"
          fill="url(#fHill1)" opacity="0.75"/>
        <path
          d="M0,570 Q150,505 310,545 Q520,488 720,535 Q920,495 1110,528 Q1300,505 1440,530 L1440,680 L0,680 Z"
          fill="url(#fHill2)" opacity="0.85"/>

        {/* FAR TREE SILHOUETTE */}
        <path
          d="M0,570 L24,498 L48,570 L72,472 L96,570 L120,488 L144,570 L168,462 L192,570
             L216,480 L240,570 L264,475 L288,570 L312,490 L336,570 L360,468 L384,570
             L408,484 L432,570 L456,472 L480,570 L504,480 L528,570 L552,466 L576,570
             L600,486 L624,570 L648,470 L672,570 L696,478 L720,570 L744,464 L768,570
             L792,482 L816,570 L840,472 L864,570 L888,466 L912,570 L936,480 L960,570
             L984,468 L1008,570 L1032,476 L1056,570 L1080,462 L1104,570 L1128,478 L1152,570
             L1176,466 L1200,570 L1224,480 L1248,570 L1272,470 L1296,570 L1320,476 L1344,570
             L1368,468 L1392,570 L1416,478 L1440,570 L1440,640 L0,640 Z"
          fill="#2E7D32" opacity="0.9"/>

        {/* GROUND */}
        <rect x="0" y="628" width="1440" height="272" fill="url(#fGround)"/>
        <path
          d="M0,628 Q360,598 720,622 Q1080,598 1440,628 L1440,668 L0,668 Z"
          fill="#7CB342" opacity="0.65"/>

        {/* LEFT TREES */}
        <RoundTree x={55}  y={620} r={62} trunkH={55} color="#388E3C" light="#66BB6A" dark="#2E7D32"/>
        <RoundTree x={155} y={630} r={48} trunkH={42} color="#43A047" light="#81C784" dark="#388E3C"/>
        <PineTree  x={245} y={628} h={130} w={52} color="#2E7D32" dark="#1B5E20"/>
        <PineTree  x={310} y={638} h={100} w={42} color="#388E3C" dark="#2E7D32"/>

        {/* RIGHT TREES */}
        <RoundTree x={1150} y={620} r={58} trunkH={50} color="#2E7D32" light="#43A047" dark="#1B5E20"/>
        <PineTree  x={1240} y={625} h={140} w={56} color="#1B5E20" dark="#2E7D32"/>
        <RoundTree x={1340} y={630} r={52} trunkH={44} color="#388E3C" light="#66BB6A" dark="#2E7D32"/>
        <RoundTree x={1420} y={640} r={38} trunkH={35} color="#43A047" light="#81C784" dark="#388E3C"/>

        {/* MID TREES (left side, near construction) */}
        <RoundTree x={355} y={660} r={32} trunkH={30} color="#558B2F" light="#8BC34A" dark="#33691E"/>
        <PineTree  x={400} y={658} h={75} w={32} color="#33691E" dark="#2E7D32"/>

        {/* STREAM (winding, center-right) */}
        <path
          d="M860,560 Q885,605 855,650 Q830,695 865,740 Q895,785 862,830 Q840,862 865,900 L935,900 Q908,862 932,830 Q958,785 924,740 Q896,695 928,650 Q958,605 932,560 Z"
          fill="url(#fStream)" opacity="0.82"/>
        <path
          d="M878,580 Q858,625 880,670 Q900,715 872,758"
          fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="3.5" strokeLinecap="round"/>
        <path
          d="M908,572 Q924,617 902,662 Q884,706 910,752"
          fill="none" stroke="rgba(255,255,255,0.38)" strokeWidth="2.5" strokeLinecap="round"/>
        {/* Stream bank */}
        <ellipse cx="898" cy="628" rx="48" ry="13" fill="#AED581" opacity="0.55"/>
        <ellipse cx="882" cy="900" rx="58" ry="16" fill="#AED581" opacity="0.40"/>

        {/* Bushes near stream */}
        <ellipse cx="845" cy="668" rx="28" ry="18" fill="#2E7D32"/>
        <ellipse cx="828" cy="662" rx="20" ry="14" fill="#1B5E20"/>
        <ellipse cx="860" cy="666" rx="22" ry="16" fill="#388E3C"/>
        <ellipse cx="945" cy="670" rx="26" ry="17" fill="#33691E"/>
        <ellipse cx="964" cy="665" rx="20" ry="14" fill="#388E3C"/>

        {/* ═══════════════════════════════════════════════════ */}
        {/*  HAMSTER HOUSE — UNDER CONSTRUCTION                */}
        {/* ═══════════════════════════════════════════════════ */}

        {/* Excavation pit (dug earth) */}
        <rect x="435" y="688" width="270" height="72" fill="#8D6E63" rx="5"/>
        <rect x="445" y="696" width="252" height="58" fill="#795548" rx="3"/>

        {/* Foundation concrete blocks */}
        <rect x="452" y="710" width="52" height="38" fill="#CFD8DC" rx="2"/>
        <line x1="452" y1="725" x2="504" y2="725" stroke="#B0BEC5" strokeWidth="1.5"/>
        <rect x="511" y="710" width="52" height="38" fill="#ECEFF1" rx="2"/>
        <line x1="511" y1="725" x2="563" y2="725" stroke="#CFD8DC" strokeWidth="1.5"/>
        <rect x="570" y="710" width="52" height="38" fill="#CFD8DC" rx="2"/>
        <line x1="570" y1="725" x2="622" y2="725" stroke="#B0BEC5" strokeWidth="1.5"/>
        <rect x="629" y="710" width="46" height="38" fill="#ECEFF1" rx="2"/>
        {/* Block mortar lines */}
        <line x1="504" y1="710" x2="504" y2="748" stroke="#9E9E9E" strokeWidth="1" opacity="0.5"/>
        <line x1="563" y1="710" x2="563" y2="748" stroke="#9E9E9E" strokeWidth="1" opacity="0.5"/>
        <line x1="622" y1="710" x2="622" y2="748" stroke="#9E9E9E" strokeWidth="1" opacity="0.5"/>

        {/* Scaffolding — vertical poles */}
        <line x1="442" y1="694" x2="442" y2="558" stroke="#8D6E63" strokeWidth="5.5" strokeLinecap="round"/>
        <line x1="558" y1="692" x2="558" y2="538" stroke="#8D6E63" strokeWidth="5.5" strokeLinecap="round"/>
        <line x1="680" y1="692" x2="680" y2="552" stroke="#8D6E63" strokeWidth="5.5" strokeLinecap="round"/>

        {/* Scaffolding — horizontal beams */}
        <line x1="440" y1="610" x2="682" y2="610" stroke="#A1887F" strokeWidth="4.5" strokeLinecap="round"/>
        <line x1="440" y1="652" x2="682" y2="652" stroke="#A1887F" strokeWidth="4.5" strokeLinecap="round"/>
        <line x1="440" y1="568" x2="682" y2="568" stroke="#A1887F" strokeWidth="3.5" strokeLinecap="round"/>

        {/* Scaffolding — diagonal cross-braces */}
        <line x1="442" y1="610" x2="558" y2="652" stroke="#A1887F" strokeWidth="2.5" opacity="0.65"/>
        <line x1="558" y1="610" x2="442" y2="652" stroke="#A1887F" strokeWidth="2.5" opacity="0.65"/>
        <line x1="558" y1="610" x2="680" y2="652" stroke="#A1887F" strokeWidth="2.5" opacity="0.65"/>
        <line x1="680" y1="610" x2="558" y2="652" stroke="#A1887F" strokeWidth="2.5" opacity="0.65"/>

        {/* Partial house frame (wall outlines) */}
        <rect x="466" y="630" width="200" height="82" fill="none" stroke="#6D4C41" strokeWidth="6" strokeDasharray="10,5"/>
        {/* Roof ridge line */}
        <line x1="466" y1="630" x2="566" y2="578" stroke="#5D4037" strokeWidth="6.5" strokeLinecap="round"/>
        <line x1="666" y1="630" x2="566" y2="578" stroke="#5D4037" strokeWidth="6.5" strokeLinecap="round"/>
        {/* Ridge cap */}
        <circle cx="566" cy="578" r="6" fill="#795548"/>

        {/* Door frame (rough opening) */}
        <rect x="538" y="660" width="48" height="52" fill="rgba(30,20,10,0.4)" stroke="#5D4037" strokeWidth="3.5"/>
        <line x1="538" y1="660" x2="538" y2="712" stroke="#6D4C41" strokeWidth="4"/>
        <line x1="586" y1="660" x2="586" y2="712" stroke="#6D4C41" strokeWidth="4"/>

        {/* Window opening (left) */}
        <rect x="482" y="648" width="38" height="32" fill="rgba(135,206,235,0.25)" stroke="#5D4037" strokeWidth="3"/>
        <line x1="501" y1="648" x2="501" y2="680" stroke="#5D4037" strokeWidth="1.8"/>
        <line x1="482" y1="664" x2="520" y2="664" stroke="#5D4037" strokeWidth="1.8"/>

        {/* Window opening (right) */}
        <rect x="612" y="648" width="38" height="32" fill="rgba(135,206,235,0.25)" stroke="#5D4037" strokeWidth="3"/>
        <line x1="631" y1="648" x2="631" y2="680" stroke="#5D4037" strokeWidth="1.8"/>
        <line x1="612" y1="664" x2="650" y2="664" stroke="#5D4037" strokeWidth="1.8"/>

        {/* Construction sign */}
        <rect x="696" y="630" width="100" height="52" fill="#FFC107" rx="7"/>
        <rect x="699" y="633" width="94" height="46" fill="#FFA000" rx="5" opacity="0.25"/>
        <text x="746" y="652" textAnchor="middle" fontSize="15" fontWeight="bold" fill="#212121">工事中</text>
        <text x="746" y="670" textAnchor="middle" fontSize="10" fill="#424242" letterSpacing="1">UNDER CONSTRUCTION</text>
        {/* Sign warning stripes */}
        <line x1="699" y1="676" x2="793" y2="676" stroke="#E65100" strokeWidth="2"/>
        {/* Sign pole */}
        <line x1="746" y1="682" x2="746" y2="732" stroke="#795548" strokeWidth="4.5"/>

        {/* Rebar / pipe stack */}
        <line x1="740" y1="750" x2="820" y2="742" stroke="#90A4AE" strokeWidth="5.5"/>
        <line x1="743" y1="757" x2="823" y2="749" stroke="#B0BEC5" strokeWidth="5.5"/>
        <line x1="746" y1="764" x2="826" y2="756" stroke="#90A4AE" strokeWidth="5.5"/>
        <line x1="749" y1="771" x2="829" y2="763" stroke="#CFD8DC" strokeWidth="4.5"/>

        {/* Cement mixer */}
        <ellipse cx="414" cy="722" rx="24" ry="30" fill="#90A4AE"/>
        <ellipse cx="414" cy="711" rx="20" ry="15" fill="#B0BEC5"/>
        <rect x="393" y="746" width="42" height="9" fill="#78909C" rx="2"/>
        <line x1="403" y1="754" x2="397" y2="773" stroke="#546E7A" strokeWidth="4.5"/>
        <line x1="425" y1="754" x2="431" y2="773" stroke="#546E7A" strokeWidth="4.5"/>
        <line x1="393" y1="773" x2="435" y2="773" stroke="#546E7A" strokeWidth="3.5"/>
        {/* Mixer drum detail */}
        <ellipse cx="414" cy="716" rx="14" ry="10" fill="#CFD8DC" opacity="0.5"/>

        {/* ── WORKER 1 — with shovel ── */}
        {/* Hard hat (red = worker) */}
        <ellipse cx="760" cy="694" rx="15" ry="9" fill="#F44336"/>
        <rect x="747" y="699" width="26" height="5.5" fill="#F44336" rx="1.5"/>
        {/* Head */}
        <circle cx="760" cy="710" r="12" fill="#FFCC80"/>
        {/* Eyes */}
        <circle cx="756" cy="709" r="2" fill="#5D4037"/>
        <circle cx="764" cy="709" r="2" fill="#5D4037"/>
        {/* Smile */}
        <path d="M756 715 Q760 719 764 715" fill="none" stroke="#BF6B36" strokeWidth="1.5" strokeLinecap="round"/>
        {/* Body / hi-vis vest */}
        <rect x="751" y="722" width="18" height="32" fill="#1565C0" rx="3.5"/>
        <rect x="755" y="724" width="10" height="28" fill="#FFC107" rx="1" opacity="0.5"/>
        {/* Legs */}
        <rect x="751" y="753" width="8" height="24" fill="#0D47A1" rx="2.5"/>
        <rect x="761" y="753" width="8" height="24" fill="#0D47A1" rx="2.5"/>
        {/* Arm — shovel side */}
        <line x1="751" y1="727" x2="728" y2="748" stroke="#1565C0" strokeWidth="6" strokeLinecap="round"/>
        {/* Shovel */}
        <line x1="728" y1="748" x2="714" y2="778" stroke="#795548" strokeWidth="4.5"/>
        <ellipse cx="710" cy="783" rx="9" ry="5" fill="#795548"/>
        <ellipse cx="710" cy="783" rx="6" ry="3" fill="#6D4C41"/>
        {/* Other arm (gesturing) */}
        <line x1="769" y1="727" x2="788" y2="738" stroke="#1565C0" strokeWidth="6" strokeLinecap="round"/>
        {/* Boots */}
        <rect x="749" y="774" width="11" height="7" fill="#37474F" rx="2"/>
        <rect x="760" y="774" width="11" height="7" fill="#37474F" rx="2"/>

        {/* ── WORKER 2 — supervisor with clipboard ── */}
        {/* Hard hat (yellow = supervisor) */}
        <ellipse cx="650" cy="658" rx="15" ry="9" fill="#FFC107"/>
        <rect x="637" y="663" width="26" height="5.5" fill="#FFC107" rx="1.5"/>
        {/* Head */}
        <circle cx="650" cy="674" r="12" fill="#FFCC80"/>
        {/* Eyes */}
        <circle cx="646" cy="673" r="2" fill="#5D4037"/>
        <circle cx="654" cy="673" r="2" fill="#5D4037"/>
        {/* Body */}
        <rect x="642" y="686" width="16" height="30" fill="#E65100" rx="3.5"/>
        {/* Hi-vis stripe */}
        <rect x="644" y="696" width="12" height="6" fill="#FFF176" rx="1" opacity="0.7"/>
        {/* Legs */}
        <rect x="642" y="715" width="7" height="22" fill="#BF360C" rx="2.5"/>
        <rect x="651" y="715" width="7" height="22" fill="#BF360C" rx="2.5"/>
        {/* Arm — holding clipboard */}
        <line x1="658" y1="691" x2="674" y2="698" stroke="#E65100" strokeWidth="6" strokeLinecap="round"/>
        {/* Clipboard */}
        <rect x="672" y="695" width="26" height="20" fill="white" stroke="#9E9E9E" strokeWidth="2.5" rx="2"/>
        <rect x="679" y="692" width="12" height="5" fill="#BDBDBD" rx="1.5"/>
        {/* Blueprint lines */}
        <line x1="675" y1="701" x2="695" y2="701" stroke="#1565C0" strokeWidth="1.2"/>
        <line x1="675" y1="705" x2="695" y2="705" stroke="#1565C0" strokeWidth="1.2"/>
        <line x1="675" y1="709" x2="690" y2="709" stroke="#1565C0" strokeWidth="1.2"/>
        {/* Other arm (pointing) */}
        <line x1="642" y1="691" x2="626" y2="700" stroke="#E65100" strokeWidth="6" strokeLinecap="round"/>
        {/* Boots */}
        <rect x="640" y="734" width="10" height="6" fill="#37474F" rx="2"/>
        <rect x="651" y="734" width="10" height="6" fill="#37474F" rx="2"/>

        {/* Small bush / shrubs near site */}
        <ellipse cx="425" cy="762" rx="32" ry="21" fill="#388E3C"/>
        <ellipse cx="404" cy="756" rx="22" ry="16" fill="#2E7D32"/>
        <ellipse cx="448" cy="760" rx="26" ry="19" fill="#43A047"/>
        <ellipse cx="800" cy="768" rx="28" ry="18" fill="#33691E"/>
        <ellipse cx="822" cy="764" rx="22" ry="15" fill="#388E3C"/>

        {/* FLOWERS — left meadow */}
        <Flower x={175} y={728} color="#FF6B6B" r={9}/>
        <Flower x={212} y={718} color="#FF9800" r={8}/>
        <Flower x={250} y={732} color="#FFEB3B" r={9}/>
        <Flower x={288} y={720} color="#E91E63" r={8}/>
        <Flower x={325} y={736} color="#FF6B6B" r={10}/>
        <Flower x={362} y={724} color="#9C27B0" r={8}/>
        <Flower x={196} y={748} color="#FFEB3B" r={7}/>
        <Flower x={238} y={744} color="#E91E63" r={7}/>
        <Flower x={304} y={750} color="#FF9800" r={8}/>
        <Flower x={340} y={742} color="#FF6B6B" r={7}/>

        {/* FLOWERS — right of stream */}
        <Flower x={968} y={715} color="#FF6B6B" r={9}/>
        <Flower x={1008} y={726} color="#FFEB3B" r={8}/>
        <Flower x={1048} y={714} color="#E91E63" r={9}/>
        <Flower x={1085} y={724} color="#FF9800" r={8}/>
        <Flower x={1120} y={736} color="#9C27B0" r={9}/>
        <Flower x={1155} y={718} color="#FF6B6B" r={8}/>
        <Flower x={990}  y={742} color="#FF9800" r={7}/>
        <Flower x={1032} y={748} color="#FFEB3B" r={7}/>
        <Flower x={1070} y={744} color="#FF6B6B" r={8}/>

        {/* GRASS tufts / detail */}
        <path d="M140,720 Q143,706 146,720" fill="none" stroke="#558B2F" strokeWidth="3"/>
        <path d="M148,718 Q151,703 154,718" fill="none" stroke="#558B2F" strokeWidth="3"/>
        <path d="M1200,718 Q1203,704 1206,718" fill="none" stroke="#558B2F" strokeWidth="3"/>
        <path d="M1210,716 Q1213,700 1216,716" fill="none" stroke="#558B2F" strokeWidth="3"/>

        {/* Bottom foliage strip to blend */}
        <rect x="0" y="840" width="1440" height="60" fill="#2E7D32" opacity="0.6"/>
        <path
          d="M0,840 Q100,822 200,840 Q300,822 400,840 Q500,822 600,840 Q700,822 800,840 Q900,822 1000,840 Q1100,822 1200,840 Q1300,822 1400,840 L1440,840 L1440,900 L0,900 Z"
          fill="#1B5E20" opacity="0.8"/>
      </svg>
    </div>
  )
}
