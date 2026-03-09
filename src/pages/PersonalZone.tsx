import { useState } from "react";
import { motion } from "framer-motion";
import { Award, FileText, Star, Tag, Edit, Download, Share2, MessageCircle, Bookmark, Clock } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import CaseCard from "@/components/CaseCard";
import { MOCK_CASES, MOCK_TAGS } from "@/data/mockData";

const TABS = ["发布", "草稿", "收藏", "评论"];

const PersonalZone = () => {
  const [activeTab, setActiveTab] = useState("发布");
  const myCases = MOCK_CASES.slice(0, 4);
  const myTags = MOCK_TAGS.slice(0, 5);

  return (
    <AppLayout>
      <div className="flex max-w-[1100px] mx-auto">
        <div className="flex-1 min-w-0 p-6">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            {/* Profile header */}
            <div className="card-base p-6 mb-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-2xl">
                  我
                </div>
                <div className="flex-1">
                  <h1 className="text-lg font-semibold text-foreground">我的知识中心</h1>
                  <p className="text-sm text-muted-foreground mt-0.5">AI中台 · 知识贡献者</p>
                </div>
                <div className="flex gap-2">
                  <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border text-xs text-foreground hover:border-primary hover:text-primary transition-colors">
                    <Edit className="w-3.5 h-3.5" /> 编辑资料
                  </button>
                  <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border text-xs text-foreground hover:border-primary hover:text-primary transition-colors">
                    <Share2 className="w-3.5 h-3.5" /> 分享主页
                  </button>
                </div>
              </div>
              <div className="flex gap-6 text-sm">
                <div className="text-center">
                  <p className="font-semibold text-foreground">4</p>
                  <p className="text-xs text-muted-foreground">发布</p>
                </div>
                <div className="text-center">
                  <p className="font-semibold text-foreground">128</p>
                  <p className="text-xs text-muted-foreground">获赞</p>
                </div>
                <div className="text-center">
                  <p className="font-semibold text-foreground">42</p>
                  <p className="text-xs text-muted-foreground">评论</p>
                </div>
                <div className="text-center">
                  <p className="font-semibold text-foreground">36</p>
                  <p className="text-xs text-muted-foreground">收藏</p>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-1 mb-6 border-b border-border">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2.5 text-sm transition-colors border-b-2 -mb-px ${
                    activeTab === tab
                      ? "border-primary text-primary font-medium"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab === "发布" && <FileText className="w-3.5 h-3.5 inline mr-1.5" />}
                  {tab === "草稿" && <Clock className="w-3.5 h-3.5 inline mr-1.5" />}
                  {tab === "收藏" && <Bookmark className="w-3.5 h-3.5 inline mr-1.5" />}
                  {tab === "评论" && <MessageCircle className="w-3.5 h-3.5 inline mr-1.5" />}
                  {tab}
                </button>
              ))}
            </div>

            {/* Content */}
            {activeTab === "发布" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                {myCases.map((c, i) => (
                  <motion.div key={c.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                    <CaseCard caseItem={c} />
                  </motion.div>
                ))}
              </div>
            )}

            {activeTab === "草稿" && (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-sm">暂无草稿</p>
                <button className="mt-3 px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm hover:bg-primary/90 transition-colors">
                  新建草稿
                </button>
              </div>
            )}

            {activeTab === "收藏" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                {MOCK_CASES.slice(2, 6).map((c, i) => (
                  <motion.div key={c.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                    <CaseCard caseItem={c} />
                  </motion.div>
                ))}
              </div>
            )}

            {activeTab === "评论" && (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-sm">暂无评论记录</p>
              </div>
            )}
          </motion.div>
        </div>

        {/* Right sidebar */}
        <aside className="w-[260px] shrink-0 border-l border-border p-5 hidden xl:block sticky top-14 h-[calc(100vh-56px)] overflow-y-auto space-y-5">
          <div>
            <h3 className="font-semibold text-sm text-foreground mb-3 flex items-center gap-2">
              <Tag className="w-4 h-4 text-primary" /> 我的知识标签
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {myTags.map((tag) => (
                <span key={tag.label} className="px-2.5 py-0.5 rounded bg-accent text-secondary-foreground text-xs">
                  {tag.emoji} {tag.label}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-sm text-foreground mb-3 flex items-center gap-2">
              <Award className="w-4 h-4 text-primary" /> 成就与荣誉
            </h3>
            <div className="space-y-2">
              {[
                { icon: "🏅", label: "知识先锋", desc: "累计发布 5+ 案例" },
                { icon: "⭐", label: "优质作者", desc: "获得 100+ 点赞" },
                { icon: "🔥", label: "活跃贡献者", desc: "连续 30 天活跃" },
              ].map((badge) => (
                <div key={badge.label} className="flex items-center gap-3 p-3 rounded-md bg-accent">
                  <span className="text-lg">{badge.icon}</span>
                  <div>
                    <p className="text-sm font-medium text-foreground">{badge.label}</p>
                    <p className="text-xs text-muted-foreground">{badge.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-sm text-foreground mb-3 flex items-center gap-2">
              <Star className="w-4 h-4 text-primary" /> 影响力
            </h3>
            <div className="card-base p-4 space-y-2.5">
              {[
                { label: "总浏览量", value: "12.3k" },
                { label: "总获赞数", value: 128 },
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
