import { useState } from "react";
import { motion } from "framer-motion";
import { MessageSquare, ThumbsUp, ThumbsDown, Eye, Award, Search, Plus, CheckCircle2, Clock } from "lucide-react";
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
  votes: number;
  bounty?: number;
  solved: boolean;
  createdAt: string;
}

const MOCK_QUESTIONS: Question[] = [
  {
    id: "1", title: "如何在企业级项目中有效实施 RAG 架构？",
    content: "我们团队正在尝试将 RAG 技术应用到内部知识检索系统中，但在 Chunk 策略和向量数据库选型上遇到了困难...",
    author: "赵强", department: "AI中台", tags: ["AI应用", "技术架构", "RAG"],
    answers: 5, views: 1230, votes: 23, bounty: 50, solved: true, createdAt: "2小时前"
  },
  {
    id: "2", title: "跨部门项目的 OKR 对齐有哪些好的实践？",
    content: "我们的项目涉及 3 个部门协作，各部门 OKR 方向不一致导致优先级冲突...",
    author: "李芳", department: "项目管理部", tags: ["项目管理", "OKR", "跨部门协作"],
    answers: 8, views: 890, votes: 15, solved: false, createdAt: "5小时前"
  },
  {
    id: "3", title: "B端产品的用户体验度量有哪些推荐指标？",
    content: "想建立一套 B 端产品的体验度量体系，但传统的 NPS、CSAT 似乎不太适用...",
    author: "孙婷", department: "UX设计", tags: ["产品设计", "用户体验", "度量"],
    answers: 3, views: 560, votes: 9, solved: false, createdAt: "1天前"
  },
  {
    id: "4", title: "微服务架构下如何做好分布式事务？",
    content: "我们在进行微服务改造，遇到了跨服务事务一致性的问题...",
    author: "王磊", department: "数据平台", tags: ["技术架构", "微服务"],
    answers: 12, views: 2100, votes: 31, bounty: 100, solved: true, createdAt: "2天前"
  },
  {
    id: "5", title: "敏捷开发中如何平衡技术债务和业务迭代？",
    content: "团队在快速迭代中积累了大量技术债务，想了解其他团队是如何处理的...",
    author: "刘伟", department: "研发效能", tags: ["敏捷开发", "技术债务"],
    answers: 6, views: 780, votes: 18, solved: false, createdAt: "3天前"
  },
];

const FILTERS = ["最新", "热门", "待解决", "已解决"];

const Community = () => {
  const [activeFilter, setActiveFilter] = useState("最新");

  const filteredQuestions = activeFilter === "已解决"
    ? MOCK_QUESTIONS.filter(q => q.solved)
    : activeFilter === "待解决"
    ? MOCK_QUESTIONS.filter(q => !q.solved)
    : MOCK_QUESTIONS;

  return (
    <AppLayout>
      <div className="flex">
        {/* Left filter */}
        <aside className="w-[200px] shrink-0 border-r border-border p-4 hidden lg:block sticky top-14 h-[calc(100vh-56px)] overflow-y-auto">
          <p className="text-xs text-muted-foreground mb-2 px-3">筛选</p>
          <div className="space-y-0.5">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`flex items-center gap-2 w-full px-3 py-2 rounded-md text-sm transition-colors ${
                  activeFilter === f ? "text-primary font-medium bg-primary/5" : "text-muted-foreground hover:text-foreground hover:bg-accent"
                }`}
              >
                {f === "最新" && <Clock className="w-4 h-4" />}
                {f === "热门" && <ThumbsUp className="w-4 h-4" />}
                {f === "待解决" && <MessageSquare className="w-4 h-4" />}
                {f === "已解决" && <CheckCircle2 className="w-4 h-4" />}
                {f}
              </button>
            ))}
          </div>

          <div className="mt-6">
            <p className="text-xs text-muted-foreground mb-2 px-3">热门标签</p>
            <div className="space-y-0.5">
              {["AI应用", "项目管理", "技术架构", "产品设计", "敏捷开发"].map(tag => (
                <button key={tag} className="block w-full text-left px-3 py-1.5 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
                  # {tag}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Main */}
        <div className="flex-1 min-w-0 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-xl font-semibold text-foreground">问答社区</h1>
              <p className="text-sm text-muted-foreground">提出问题，分享经验，共同成长</p>
            </div>
            <button className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
              <Plus className="w-4 h-4" /> 提问
            </button>
          </div>

          <div className="space-y-3">
            {filteredQuestions.map((q, i) => (
              <motion.div
                key={q.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="card-base p-5"
              >
                <div className="flex gap-4">
                  {/* Vote column */}
                  <div className="flex flex-col items-center gap-1 shrink-0 w-12">
                    <button className="p-1 rounded hover:bg-accent text-muted-foreground hover:text-primary transition-colors">
                      <ThumbsUp className="w-4 h-4" />
                    </button>
                    <span className="text-sm font-semibold text-foreground">{q.votes}</span>
                    <button className="p-1 rounded hover:bg-accent text-muted-foreground transition-colors">
                      <ThumbsDown className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {q.solved && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-green-50 text-green-600 text-xs font-medium">
                          <CheckCircle2 className="w-3 h-3" /> 已解决
                        </span>
                      )}
                      {q.bounty && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-orange-50 text-orange-600 text-xs font-medium">
                          <Award className="w-3 h-3" /> {q.bounty} 积分
                        </span>
                      )}
                    </div>
                    <h3 className="font-medium text-foreground mb-1 hover:text-primary transition-colors cursor-pointer">
                      {q.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{q.content}</p>
                    <div className="flex items-center gap-3 flex-wrap">
                      <div className="flex flex-wrap gap-1">
                        {q.tags.map(tag => (
                          <span key={tag} className="px-2 py-0.5 rounded bg-accent text-xs text-secondary-foreground">{tag}</span>
                        ))}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground ml-auto">
                        <span>{q.author} · {q.department}</span>
                        <span>{q.createdAt}</span>
                        <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" />{q.answers}</span>
                        <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{q.views}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right sidebar */}
        <aside className="w-[260px] shrink-0 border-l border-border p-5 hidden xl:block sticky top-14 h-[calc(100vh-56px)] overflow-y-auto space-y-5">
          <div>
            <h3 className="font-semibold text-sm text-foreground mb-3">活跃回答者</h3>
            <div className="space-y-3">
              {[
                { name: "张明", dept: "AI中台", answers: 42 },
                { name: "王磊", dept: "数据平台", answers: 38 },
                { name: "李芳", dept: "项目管理部", answers: 29 },
              ].map(user => (
                <div key={user.name} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-medium">
                    {user.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.dept} · {user.answers} 回答</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-sm text-foreground mb-3">悬赏问题</h3>
            <div className="space-y-2">
              {MOCK_QUESTIONS.filter(q => q.bounty).map(q => (
                <div key={q.id} className="p-3 rounded-md border border-border bg-card">
                  <p className="text-sm text-foreground line-clamp-2 mb-1">{q.title}</p>
                  <span className="inline-flex items-center gap-1 text-xs text-orange-600">
                    <Award className="w-3 h-3" /> {q.bounty} 积分
                  </span>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </AppLayout>
  );
};

export default Community;
