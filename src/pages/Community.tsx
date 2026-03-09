import { useState } from "react";
import { motion } from "framer-motion";
import { MessageSquare, Eye, Plus, CheckCircle2, Clock, Flame, HelpCircle, Trophy } from "lucide-react";
import AppLayout from "@/components/AppLayout";

interface Question {
  id: string;
  title: string;
  content: string;
  author: string;
  department: string;
  tags: string[];
  answers: number;
  views: number;
  solved: boolean;
  createdAt: string;
}

const MOCK_QUESTIONS: Question[] = [
  {
    id: "1", title: "如何快速在部门内推广新的敏捷开发流程？",
    content: "最近部门准备从瀑布流转型敏捷，但是阻力很大，大家习惯了原来的节奏。有没有什么好的破局点？",
    author: "张三", department: "研发部", tags: ["敏捷开发", "团队管理"],
    answers: 12, views: 340, solved: false, createdAt: "2小时前"
  },
  {
    id: "2", title: "私有云环境部署 K8s 集群遇到的网络插件选型问题",
    content: "求助各位大佬，我们在内网环境部署 K8s，对于 Calico 和 Flannel 的选择比较纠结，主要考虑到跨网段通信性能...",
    author: "李四", department: "运维部", tags: ["Kubernetes", "运维"],
    answers: 8, views: 210, solved: false, createdAt: "5小时前"
  },
  {
    id: "3", title: "供应链大促备货模型参数设定请教",
    content: "今年的双11大促，关于长尾商品的备货系数，大家一般是设定在多少范围比较合理？",
    author: "王五", department: "供应链部", tags: ["供应链", "大促备货"],
    answers: 24, views: 890, solved: false, createdAt: "昨天"
  },
  {
    id: "4", title: "微服务架构下如何做好分布式事务？",
    content: "我们在进行微服务改造，遇到了跨服务事务一致性的问题...",
    author: "王磊", department: "数据平台", tags: ["技术架构", "微服务"],
    answers: 12, views: 2100, solved: true, createdAt: "2天前"
  },
];

const CHANNELS = [
  { label: "全部问答", count: "99+" },
  { label: "技术研发", count: null },
  { label: "产品运营", count: null },
  { label: "市场营销", count: null },
  { label: "职场交流", count: null },
];

const FILTERS = ["最新", "最热", "待回答"];

const HOT_TOPICS = ["#ChatGPT落地", "#降本增效", "#低代码", "#OKR实战"];

const Community = () => {
  const [activeFilter, setActiveFilter] = useState("最新");
  const [activeChannel, setActiveChannel] = useState("全部问答");

  return (
    <AppLayout>
      <div className="flex max-w-[1400px] mx-auto">
        {/* Left sidebar */}
        <aside className="w-[220px] shrink-0 border-r border-border p-5 hidden lg:block sticky top-14 h-[calc(100vh-56px)] overflow-y-auto">
          <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors mb-6">
            <Plus className="w-4 h-4" /> 我要提问
          </button>

          <p className="text-xs text-muted-foreground mb-2 px-1">频道</p>
          <div className="space-y-0.5">
            {CHANNELS.map((ch) => (
              <button
                key={ch.label}
                onClick={() => setActiveChannel(ch.label)}
                className={`flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm transition-colors ${
                  activeChannel === ch.label
                    ? "text-primary font-medium bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                }`}
              >
                {ch.label}
                {ch.count && (
                  <span className="px-1.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">{ch.count}</span>
                )}
              </button>
            ))}
          </div>
        </aside>

        {/* Main */}
        <div className="flex-1 min-w-0 p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-semibold text-foreground">问答社区</h1>
            <div className="flex items-center gap-1 bg-accent rounded-lg p-0.5">
              {FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`px-4 py-1.5 rounded-md text-sm transition-colors ${
                    activeFilter === f
                      ? "bg-card text-foreground font-medium shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-0 divide-y divide-border">
            {MOCK_QUESTIONS.map((q, i) => (
              <motion.div
                key={q.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="py-5 first:pt-0"
              >
                <h3 className="font-semibold text-foreground mb-2 hover:text-primary transition-colors cursor-pointer">
                  {q.title}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{q.content}</p>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {q.tags.map(tag => (
                    <span key={tag} className="px-2.5 py-0.5 rounded-md border border-border text-xs text-muted-foreground">{tag}</span>
                  ))}
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{q.author} · {q.createdAt}</span>
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1"><MessageSquare className="w-3.5 h-3.5" /> {q.answers} 回答</span>
                    <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> {q.views} 浏览</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right sidebar */}
        <aside className="w-[280px] shrink-0 border-l border-border p-5 hidden lg:block sticky top-14 h-[calc(100vh-56px)] overflow-y-auto space-y-5">
          {/* Hot topics */}
          <div>
            <h3 className="font-semibold text-sm text-foreground mb-3">热门话题</h3>
            <div className="flex flex-wrap gap-2">
              {HOT_TOPICS.map(t => (
                <span key={t} className="px-3 py-1 rounded-md bg-accent text-sm text-foreground cursor-pointer hover:bg-primary/10 hover:text-primary transition-colors">{t}</span>
              ))}
            </div>
          </div>

          {/* Weekly picks */}
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="w-4 h-4 text-primary" />
              <h4 className="font-semibold text-sm text-primary">每周精选</h4>
            </div>
            <p className="text-xs text-muted-foreground mb-3">参与本周话题讨论，赢取积分奖励！</p>
            <p className="text-sm text-foreground font-medium">话题：如何在远程办公中保持高效沟通？</p>
          </div>
        </aside>
      </div>
    </AppLayout>
  );
};

export default Community;
