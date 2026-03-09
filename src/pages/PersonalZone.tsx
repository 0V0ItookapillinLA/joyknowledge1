import { motion } from "framer-motion";
import { Award, FileText, Star, Tag } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import CaseCard from "@/components/CaseCard";
import { MOCK_CASES, MOCK_TAGS } from "@/data/mockData";

const PersonalZone = () => {
  const myCases = MOCK_CASES.slice(0, 4);
  const myTags = MOCK_TAGS.slice(0, 5);

  return (
    <AppLayout>
      <div className="flex">
        <div className="flex-1 min-w-0 p-6">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            {/* Profile header */}
            <div className="card-base p-6 mb-6 flex items-center gap-5">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-2xl font-display">
                我
              </div>
              <div>
                <h1 className="font-display text-xl font-bold text-foreground">我的知识中心</h1>
                <p className="text-sm text-muted-foreground mt-1">累计贡献 4 篇案例 · 获得 128 次点赞</p>
              </div>
            </div>

            {/* My cases */}
            <h2 className="font-display font-semibold text-lg text-foreground mb-4 flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" /> 我发布的内容
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {myCases.map((c, i) => (
                <motion.div key={c.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <CaseCard caseItem={c} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right sidebar */}
        <aside className="w-72 shrink-0 border-l border-border p-5 hidden xl:block sticky top-0 h-screen overflow-y-auto space-y-6">
          <div>
            <h3 className="font-display font-semibold text-sm text-foreground mb-3 flex items-center gap-2">
              <Tag className="w-4 h-4 text-primary" /> 我的知识标签
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {myTags.map((tag) => (
                <span key={tag.label} className="px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs">
                  {tag.emoji} {tag.label}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-display font-semibold text-sm text-foreground mb-3 flex items-center gap-2">
              <Award className="w-4 h-4 text-primary" /> 成就与荣誉
            </h3>
            <div className="space-y-3">
              {[
                { icon: "🏅", label: "知识先锋", desc: "累计发布 5+ 案例" },
                { icon: "⭐", label: "优质作者", desc: "获得 100+ 点赞" },
                { icon: "🔥", label: "活跃贡献者", desc: "连续 30 天活跃" },
              ].map((badge) => (
                <div key={badge.label} className="flex items-center gap-3 p-3 rounded-lg bg-secondary">
                  <span className="text-xl">{badge.icon}</span>
                  <div>
                    <p className="text-sm font-medium text-foreground">{badge.label}</p>
                    <p className="text-xs text-muted-foreground">{badge.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-display font-semibold text-sm text-foreground mb-3 flex items-center gap-2">
              <Star className="w-4 h-4 text-primary" /> 贡献度
            </h3>
            <div className="card-base p-4 space-y-3">
              {[
                { label: "发布案例", value: 4 },
                { label: "收到点赞", value: 128 },
                { label: "收到评论", value: 42 },
                { label: "被收藏", value: 36 },
              ].map((stat) => (
                <div key={stat.label} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{stat.label}</span>
                  <span className="font-semibold text-foreground">{stat.value}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </AppLayout>
  );
};

export default PersonalZone;
