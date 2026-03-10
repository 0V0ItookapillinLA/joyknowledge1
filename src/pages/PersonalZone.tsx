import { useState } from "react";
import { motion } from "framer-motion";
import { Award, FileText, Star, Edit, Share2, Bookmark, Clock, Eye, Heart, MessageCircle, Search, SlidersHorizontal, PenLine, History, Tag, Download } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { Link } from "react-router-dom";
import { MOCK_CASES } from "@/data/mockData";

import kevinAvatar from "@/assets/avatars/kevin.jpg";

const LEFT_NAV = [
  { label: "我发布的", icon: PenLine, count: 12, key: "published" },
  { label: "我的收藏", icon: Star, count: 45, key: "favorites" },
  { label: "草稿箱", icon: FileText, count: 3, key: "drafts" },
  { label: "浏览历史", icon: History, count: undefined, key: "history" },
];

const BADGES = [
  { icon: "🏅", label: "知识贡献者", date: "2023.10 获得" },
  { icon: "🏆", label: "年度优秀员工", date: "2023.10 获得" },
  { icon: "💡", label: "创新先锋", date: "2023.10 获得" },
];

const PersonalZone = () => {
  const [activeSection, setActiveSection] = useState("published");
  const myCases = MOCK_CASES.slice(0, 4);

  return (
    <AppLayout>
      <div className="flex max-w-[1400px] mx-auto">
        {/* Left sidebar */}
        <aside className="w-[220px] shrink-0 border-r border-border p-5 hidden lg:block sticky top-14 h-[calc(100vh-56px)]">
          <h3 className="font-semibold text-foreground mb-4">个人中心</h3>
          <div className="space-y-0.5">
            {LEFT_NAV.map((item) => (
              <button
                key={item.key}
                onClick={() => setActiveSection(item.key)}
                className={`flex items-center justify-between w-full px-3 py-2.5 rounded-md text-sm transition-colors ${
                  activeSection === item.key
                    ? "text-primary font-medium bg-primary/5"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </span>
                {item.count !== undefined && (
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                    activeSection === item.key
                      ? "bg-primary/10 text-primary"
                      : "bg-accent text-muted-foreground"
                  }`}>
                    {item.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </aside>

        {/* Center content */}
        <div className="flex-1 min-w-0 p-6">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            {/* Profile card */}
            <div className="card-base p-8 mb-6">
              <div className="flex flex-col items-center">
                {/* Avatar */}
                <div className="relative mb-4">
                  <img
                    src={kevinAvatar}
                    alt="Kevin"
                    className="w-24 h-24 rounded-full object-cover border-4 border-card"
                  />
                  <button className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md">
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Name & title */}
                <h1 className="text-xl font-semibold text-foreground mb-1">Kevin</h1>
                <p className="text-sm text-muted-foreground mb-5">高级产品经理 @ 产品创新部</p>

                {/* Action buttons */}
                <div className="flex gap-3 mb-8">
                  <button className="px-6 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
                    编辑资料
                  </button>
                  <button className="px-6 py-2 rounded-lg border border-border text-sm text-foreground hover:border-primary hover:text-primary transition-colors">
                    分享主页
                  </button>
                </div>

                {/* Stats */}
                <div className="flex gap-12">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-foreground">12</p>
                    <p className="text-xs text-muted-foreground mt-0.5">发布内容</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-foreground">856</p>
                    <p className="text-xs text-muted-foreground mt-0.5">获得赞同</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-foreground">340</p>
                    <p className="text-xs text-muted-foreground mt-0.5">被收藏</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Content section header */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">
                {activeSection === "published" && "我发布的"}
                {activeSection === "favorites" && "我的收藏"}
                {activeSection === "drafts" && "草稿箱"}
                {activeSection === "history" && "浏览历史"}
              </h2>
              <div className="flex items-center gap-2">
                <button className="p-2 rounded-md hover:bg-accent transition-colors text-muted-foreground hover:text-foreground">
                  <Search className="w-4 h-4" />
                </button>
                <button className="p-2 rounded-md hover:bg-accent transition-colors text-muted-foreground hover:text-foreground">
                  <SlidersHorizontal className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Content list */}
            {(activeSection === "published" || activeSection === "favorites") && (
              <div className="space-y-0">
                {(activeSection === "published" ? myCases : MOCK_CASES.slice(2, 6)).map((c, i) => (
                  <motion.div
                    key={c.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <Link
                      to={`/case/${c.id}`}
                      className="block py-5 border-b border-border hover:bg-accent/30 transition-colors -mx-2 px-2 rounded"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="px-2 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary">已发布</span>
                        <span className="text-xs text-muted-foreground">{i === 0 ? "2小时前" : i === 1 ? "4小时前" : i === 2 ? "昨天" : "3天前"}</span>
                      </div>
                      <h3 className="text-base font-semibold text-foreground mb-2 line-clamp-1">{c.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{c.summary}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5" />
                          {c.views >= 1000 ? (c.views / 1000).toFixed(1) + "k" : c.views}
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="w-3.5 h-3.5" />
                          {c.likes}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageCircle className="w-3.5 h-3.5" />
                          {c.comments}
                        </span>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}

            {activeSection === "drafts" && (
              <div className="text-center py-16">
                <FileText className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-muted-foreground text-sm">暂无草稿</p>
                <button className="mt-4 px-5 py-2 rounded-lg bg-primary text-primary-foreground text-sm hover:bg-primary/90 transition-colors">
                  新建草稿
                </button>
              </div>
            )}

            {activeSection === "history" && (
              <div className="text-center py-16">
                <History className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-muted-foreground text-sm">暂无浏览记录</p>
              </div>
            )}
          </motion.div>
        </div>

        {/* Right sidebar */}
        <aside className="w-[300px] shrink-0 border-l border-border p-5 hidden xl:block sticky top-14 h-[calc(100vh-56px)] overflow-y-auto space-y-6">
          {/* Knowledge tags */}
          <div>
            <h3 className="font-semibold text-sm text-foreground mb-3 flex items-center gap-2">
              <Tag className="w-4 h-4 text-primary" /> 我的知识标签
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {[
                { emoji: "🎯", label: "项目复盘" },
                { emoji: "🚀", label: "最佳实践" },
                { emoji: "🤖", label: "AI应用" },
                { emoji: "👥", label: "团队管理" },
                { emoji: "🎨", label: "产品设计" },
              ].map((tag) => (
                <span key={tag.label} className="px-2.5 py-1 rounded-md bg-accent text-secondary-foreground text-xs">
                  {tag.emoji} {tag.label}
                </span>
              ))}
            </div>
          </div>

          {/* Skills */}
          <div>
            <h3 className="font-semibold text-sm text-foreground mb-3 flex items-center gap-2">
              🛠️ 能力技能
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {[
                "Prompt Engineering", "用户研究", "A/B测试", "数据分析",
                "产品规划", "竞品分析", "Figma", "需求管理",
              ].map((skill) => (
                <span key={skill} className="px-2.5 py-1 rounded-md border border-border text-xs text-foreground">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Personal attributes */}
          <div>
            <h3 className="font-semibold text-sm text-foreground mb-3 flex items-center gap-2">
              🧬 个人属性
            </h3>
            <div className="space-y-2">
              {[
                { label: "擅长领域", value: "产品创新 · 增长策略" },
                { label: "工作年限", value: "8年" },
                { label: "认证资质", value: "PMP · NPDP" },
                { label: "带队规模", value: "15人团队" },
                { label: "主导项目", value: "12个" },
              ].map((attr) => (
                <div key={attr.label} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{attr.label}</span>
                  <span className="font-medium text-foreground">{attr.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Achievements */}
          <div>
            <h3 className="font-semibold text-sm text-foreground mb-3 flex items-center gap-2">
              <Award className="w-4 h-4 text-primary" /> 成就与荣誉
            </h3>
            <div className="space-y-2">
              {BADGES.map((badge) => (
                <div key={badge.label} className="flex items-center gap-3 p-3 rounded-lg border border-border hover:border-primary/20 transition-colors">
                  <span className="text-xl">{badge.icon}</span>
                  <div>
                    <p className="text-sm font-medium text-foreground">{badge.label}</p>
                    <p className="text-xs text-muted-foreground">{badge.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Influence */}
          <div>
            <h3 className="font-semibold text-sm text-foreground mb-3 flex items-center gap-2">
              <Star className="w-4 h-4 text-primary" /> 影响力
            </h3>
            <div className="card-base p-4 space-y-2.5">
              {[
                { label: "总浏览量", value: "12.3k" },
                { label: "总获赞数", value: "128" },
                { label: "影响力排名", value: "Top 15%" },
              ].map((stat) => (
                <div key={stat.label} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{stat.label}</span>
                  <span className="font-medium text-foreground">{stat.value}</span>
                </div>
              ))}
            </div>
          </div>

          <button className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-md border border-border text-sm text-muted-foreground hover:text-foreground hover:border-primary transition-colors">
            <Download className="w-4 h-4" /> 导出数据
          </button>
        </aside>
      </div>
    </AppLayout>
  );
};

export default PersonalZone;
