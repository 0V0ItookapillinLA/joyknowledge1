import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import AppLayout from "@/components/AppLayout";
import PageHeader from "@/components/PageHeader";
import { MOCK_EXPERTS, MOCK_CASES } from "@/data/mockData";
import { ArrowLeft, UserPlus, Mail, Calendar, Heart, MessageCircle, ChevronDown, Star } from "lucide-react";

import samAvatar from "@/assets/avatars/sam.jpg";
import ericAvatar from "@/assets/avatars/eric.jpg";
import richardAvatar from "@/assets/avatars/richard.jpg";
import sophieAvatar from "@/assets/avatars/sophie.jpg";
import kevinAvatar from "@/assets/avatars/kevin.jpg";
import amyAvatar from "@/assets/avatars/amy.jpg";
import davidAvatar from "@/assets/avatars/david.jpg";
import graceAvatar from "@/assets/avatars/grace.jpg";

const AVATAR_MAP: Record<string, string> = {
  "1": samAvatar,
  "2": ericAvatar,
  "3": richardAvatar,
  "4": sophieAvatar,
  "5": kevinAvatar,
  "6": amyAvatar,
  "7": davidAvatar,
  "8": graceAvatar,
};

const DOMAINS = ["全部领域", "营销管理", "研发管理", "质量管理", "采购管理", "产品管理", "运营管理"];

const ExpertLibrary = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [selectedDomain, setSelectedDomain] = useState("全部领域");
  const [selectedExpert, setSelectedExpert] = useState<typeof MOCK_EXPERTS[0] | null>(null);
  const [sortBy, setSortBy] = useState("按热度排序");

  useEffect(() => {
    const expertId = searchParams.get("id");
    if (expertId) {
      const found = MOCK_EXPERTS.find(e => e.id === expertId || e.name === expertId);
      if (found) setSelectedExpert(found);
    }
  }, [searchParams]);

  const filteredExperts = selectedDomain === "全部领域"
    ? MOCK_EXPERTS
    : MOCK_EXPERTS.filter((e) => e.domains.some(d => d.includes(selectedDomain.replace("管理", ""))));

  const expertCases = selectedExpert
    ? MOCK_CASES.filter((c) => c.author === selectedExpert.name)
    : [];

  // Ability radar data for detail view
  const getAbilityData = (expert: typeof MOCK_EXPERTS[0]) => {
    const abilities = expert.domains.map((d, i) => ({
      name: d.length > 4 ? d.slice(0, 4) : d,
      score: 95 - i * 7,
    }));
    expert.skills.slice(0, Math.max(0, 6 - abilities.length)).forEach((s, i) => {
      abilities.push({ name: s.length > 4 ? s.slice(0, 4) : s, score: 88 - i * 5 });
    });
    // Ensure at least 5 points for a good radar shape
    while (abilities.length < 5) {
      abilities.push({ name: "综合", score: 75 });
    }
    return abilities.slice(0, 6);
  };

  // SVG radar chart helper
  const renderRadarChart = (data: { name: string; score: number }[]) => {
    const cx = 120, cy = 120, maxR = 90;
    const n = data.length;
    const angles = data.map((_, i) => (Math.PI * 2 * i) / n - Math.PI / 2);

    const getPoint = (angle: number, r: number) => ({
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
    });

    const levels = [0.25, 0.5, 0.75, 1];
    const dataPoints = data.map((d, i) => getPoint(angles[i], (d.score / 100) * maxR));
    const dataPath = dataPoints.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ") + " Z";

    return (
      <svg viewBox="0 0 240 240" className="w-full max-w-[240px] mx-auto">
        {/* Grid levels */}
        {levels.map((level) => {
          const pts = angles.map((a) => getPoint(a, maxR * level));
          const path = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ") + " Z";
          return <path key={level} d={path} fill="none" stroke="hsl(var(--border))" strokeWidth="1" />;
        })}
        {/* Axis lines */}
        {angles.map((angle, i) => {
          const end = getPoint(angle, maxR);
          return <line key={i} x1={cx} y1={cy} x2={end.x} y2={end.y} stroke="hsl(var(--border))" strokeWidth="1" />;
        })}
        {/* Data fill */}
        <path d={dataPath} fill="hsl(var(--primary) / 0.15)" stroke="hsl(var(--primary))" strokeWidth="2" />
        {/* Data points */}
        {dataPoints.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="4" fill="hsl(var(--primary))" stroke="hsl(var(--card))" strokeWidth="2" />
        ))}
        {/* Labels */}
        {data.map((d, i) => {
          const labelR = maxR + 18;
          const pos = getPoint(angles[i], labelR);
          const anchor = pos.x < cx - 5 ? "end" : pos.x > cx + 5 ? "start" : "middle";
          return (
            <text key={i} x={pos.x} y={pos.y} textAnchor={anchor} dominantBaseline="central" className="fill-foreground text-[11px]">
              {d.name}
            </text>
          );
        })}
      </svg>
    );
  };

  // ========== Detail View ==========
  if (selectedExpert) {
    const abilities = getAbilityData(selectedExpert);

    return (
      <AppLayout>
        <div className="flex max-w-[1400px] mx-auto">
          {/* Left sidebar */}
          <aside className="w-[220px] shrink-0 border-r border-border p-5 hidden lg:block sticky top-14 h-[calc(100vh-56px)] overflow-y-auto">
            <button
              onClick={() => setSelectedExpert(null)}
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> 返回专家库
            </button>

            <h3 className="font-semibold text-sm text-foreground mb-3">专家领域</h3>
            <div className="flex flex-wrap gap-1.5 mb-6">
              {selectedExpert.domains.map((d) => (
                <span key={d} className="px-3 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-medium">{d}</span>
              ))}
            </div>

            <h3 className="font-semibold text-sm text-foreground mb-3">技能专长</h3>
            <div className="flex flex-wrap gap-1.5">
              {selectedExpert.skills.map((s) => (
                <span key={s} className="px-2.5 py-1 rounded-md bg-accent text-secondary-foreground text-xs">{s}</span>
              ))}
            </div>
          </aside>

          {/* Center: Profile + Cases */}
          <div className="flex-1 min-w-0 p-6">
            {/* Profile hero */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-8"
            >
              <div className="relative inline-block mb-4">
                <img
                  src={AVATAR_MAP[selectedExpert.id]}
                  alt={selectedExpert.name}
                  className="w-24 h-24 rounded-full object-cover mx-auto border-4 border-card shadow-md"
                />
                <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-amber-400 flex items-center justify-center shadow-sm">
                  <Star className="w-4 h-4 text-white fill-white" />
                </div>
              </div>
              <h1 className="text-xl font-semibold text-foreground">{selectedExpert.name}</h1>
              <p className="text-sm text-muted-foreground mt-1">
                {selectedExpert.title} @ {selectedExpert.department}
              </p>

              {/* Action buttons */}
              <div className="flex items-center justify-center gap-3 mt-5">
                <button className="inline-flex items-center gap-2 px-6 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
                  <UserPlus className="w-4 h-4" /> 关注专家
                </button>
                <button className="inline-flex items-center gap-2 px-6 py-2 rounded-lg border border-border text-sm text-foreground hover:border-primary/40 hover:text-primary transition-colors">
                  <Mail className="w-4 h-4" /> 发私信
                </button>
              </div>

              {/* Stats row */}
              <div className="flex items-center justify-center gap-12 mt-8">
                <div className="text-center">
                  <p className="text-2xl font-semibold text-foreground">15</p>
                  <p className="text-xs text-muted-foreground mt-0.5">从业年限</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-semibold text-foreground">{selectedExpert.caseCount}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">发布案例</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-semibold text-foreground">4.9</p>
                  <p className="text-xs text-muted-foreground mt-0.5">专家评分</p>
                </div>
              </div>
            </motion.div>

            {/* Cases */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-base text-foreground">已发布案例</h2>
                <button className="text-sm text-primary hover:underline">查看全部</button>
              </div>

              <div className="space-y-4">
                {(expertCases.length > 0 ? expertCases : MOCK_CASES.slice(0, 3)).map((c, i) => (
                  <motion.div
                    key={c.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="card-base p-5"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2 py-0.5 rounded bg-primary/10 text-primary text-xs font-medium">{c.category}</span>
                      <span className="text-xs text-muted-foreground">{c.createdAt}</span>
                    </div>
                    <h3 className="font-semibold text-sm text-foreground mb-2">{c.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{c.summary}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Heart className="w-3.5 h-3.5" /> {c.likes}</span>
                      <span className="flex items-center gap-1"><MessageCircle className="w-3.5 h-3.5" /> {c.comments}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Ability radar + Consult CTA */}
          <aside className="w-[280px] shrink-0 border-l border-border p-5 hidden xl:block sticky top-14 h-[calc(100vh-56px)] overflow-y-auto space-y-5">
            {/* Ability radar */}
            <div>
              <h3 className="font-semibold text-sm text-foreground mb-3">能力图谱</h3>
              {renderRadarChart(abilities)}
              <div className="grid grid-cols-2 gap-2 mt-3">
                {abilities.map((a) => (
                  <div key={a.name} className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{a.name}</span>
                    <span className="font-medium text-foreground">{a.score}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Consult CTA */}
            <div className="rounded-xl bg-foreground p-5 text-card">
              <div className="flex justify-center mb-3">
                <div className="w-12 h-12 rounded-full bg-card/15 flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-card" />
                </div>
              </div>
              <h4 className="font-semibold text-sm text-card mb-1 text-center">专家咨询</h4>
              <p className="text-xs text-card/70 mb-4 text-center">
                与 {selectedExpert.name} 1 对 1 交流，解决您的技术难题。
              </p>
              <button
                onClick={() => navigate(`/messages?to=${encodeURIComponent(selectedExpert.name)}`)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-card text-foreground text-sm font-medium hover:bg-card/90 transition-colors"
              >
                <MessageCircle className="w-4 h-4" /> 咨询一下
              </button>
            </div>
          </aside>
        </div>
      </AppLayout>
    );
  }

  // ========== List View ==========
  return (
    <AppLayout>
       <div className="flex max-w-[1400px] mx-auto">
        {/* Left sidebar */}
        <aside className="w-[220px] shrink-0 border-r border-border p-5 hidden lg:block sticky top-14 h-[calc(100vh-56px)] overflow-y-auto">
          <h3 className="font-semibold text-sm text-foreground mb-3">专家领域</h3>
          <div className="space-y-1">
            {DOMAINS.map((d) => (
              <button
                key={d}
                onClick={() => setSelectedDomain(d)}
                className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  selectedDomain === d
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </aside>

        {/* Main */}
        <div className="flex-1 min-w-0 p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-xl font-semibold text-foreground">
                企业专家库
                <span className="text-sm font-normal text-muted-foreground ml-3">共 42 位认证专家</span>
              </h1>
            </div>
            <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground transition-colors">
              {sortBy}
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          {/* Expert grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredExperts.map((expert, i) => (
              <motion.button
                key={expert.id}
                onClick={() => setSelectedExpert(expert)}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="card-base p-6 text-left w-full"
              >
                {/* Top row: Avatar + EXPERT badge */}
                <div className="flex items-start justify-between mb-4">
                  <img
                    src={AVATAR_MAP[expert.id]}
                    alt={expert.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-card shadow-sm"
                  />
                  <span className="px-2 py-0.5 rounded text-xs font-bold tracking-wider text-primary">
                    EXPERT
                  </span>
                </div>

                {/* Name + title */}
                <h3 className="font-semibold text-base text-foreground">{expert.name}</h3>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {expert.title} | {expert.department}
                </p>

                {/* Domain tags */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {expert.domains.slice(0, 2).map(d => (
                    <span key={d} className="px-2.5 py-0.5 rounded border border-primary/20 text-primary text-xs">{d}</span>
                  ))}
                </div>

                {/* Stats */}
                <div className="flex items-center gap-8 mt-5 pt-4 border-t border-border">
                  <div className="text-center flex-1">
                    <p className="text-lg font-semibold text-foreground">{expert.caseCount}</p>
                    <p className="text-xs text-muted-foreground">案例数</p>
                  </div>
                  <div className="text-center flex-1">
                    <p className="text-lg font-semibold text-foreground">
                      {expert.followers >= 1000 ? (expert.followers / 1000).toFixed(1) + "k" : expert.followers}
                    </p>
                    <p className="text-xs text-muted-foreground">获赞数</p>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default ExpertLibrary;
