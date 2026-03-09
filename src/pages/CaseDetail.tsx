import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Heart, MessageCircle, Bookmark, Share2, Eye } from "lucide-react";
import { motion } from "framer-motion";
import AppLayout from "@/components/AppLayout";
import { MOCK_CASES } from "@/data/mockData";

const formatNumber = (n: number) => {
  if (n >= 10000) return (n / 10000).toFixed(1) + "万";
  if (n >= 1000) return (n / 1000).toFixed(1) + "k";
  return n.toString();
};

const CaseDetail = () => {
  const { id } = useParams();
  const caseItem = MOCK_CASES.find((c) => c.id === id) || MOCK_CASES[0];
  const relatedCases = MOCK_CASES.filter(
    (c) => c.id !== caseItem.id && c.tags.some((t) => caseItem.tags.includes(t))
  ).slice(0, 3);

  return (
    <AppLayout>
      <div className="flex">
        <div className="flex-1 min-w-0 p-6 max-w-4xl">
          <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> 返回
          </Link>

          <motion.article initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
            <div>
              <span className="text-xs font-medium text-primary">{caseItem.category}</span>
              <h1 className="text-xl font-semibold text-foreground mt-1">{caseItem.title}</h1>
              <div className="flex items-center gap-3 mt-3 text-sm text-muted-foreground">
                <Link to={`/experts?id=${caseItem.author}`} className="flex items-center gap-2 hover:text-primary transition-colors">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-medium">
                    {caseItem.author[0]}
                  </div>
                  <span className="font-medium text-foreground">{caseItem.author}</span>
                </Link>
                <span>· {caseItem.department}</span>
                <span>· {caseItem.createdAt}</span>
                <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" />{formatNumber(caseItem.views)}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {caseItem.tags.map((tag) => (
                <Link key={tag} to={`/?tag=${tag}`} className="px-2.5 py-0.5 rounded bg-accent text-secondary-foreground text-xs hover:bg-primary/10 hover:text-primary transition-colors">
                  {tag}
                </Link>
              ))}
            </div>

            {/* Content body */}
            <div className="card-base p-6 space-y-4">
              <h2 className="font-semibold text-base text-foreground">概述</h2>
              <p className="text-sm text-card-foreground leading-relaxed">{caseItem.summary}</p>
              <h2 className="font-semibold text-base text-foreground">背景与挑战</h2>
              <p className="text-sm text-card-foreground leading-relaxed">
                在快速变化的业务环境中，团队面临着多方面的挑战。传统方法已无法满足日益增长的业务需求，需要创新性地解决核心痛点。本案例详细记录了从问题发现到方案落地的完整过程。
              </p>
              <h2 className="font-semibold text-base text-foreground">解决方案</h2>
              <p className="text-sm text-card-foreground leading-relaxed">
                经过深入调研和方案比选，团队最终选择了分阶段推进的策略。第一阶段聚焦基础能力建设，第二阶段进行场景化应用，第三阶段实现规模化推广。每个阶段都设置了明确的里程碑和验收标准。
              </p>
              <h2 className="font-semibold text-base text-foreground">成果与反思</h2>
              <p className="text-sm text-card-foreground leading-relaxed">
                项目最终取得了显著成效，核心指标提升超过预期。同时，过程中也积累了宝贵的经验教训，为后续类似项目提供了可复用的方法论和工具包。
              </p>
            </div>

            {/* Interaction bar */}
            <div className="flex items-center gap-3 py-4 border-t border-b border-border">
              <button className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md border border-border text-sm text-foreground hover:border-primary/40 hover:text-primary transition-colors">
                <Heart className="w-4 h-4" /> {formatNumber(caseItem.likes)}
              </button>
              <button className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md border border-border text-sm text-foreground hover:border-primary/40 hover:text-primary transition-colors">
                <MessageCircle className="w-4 h-4" /> {caseItem.comments}
              </button>
              <button className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md border border-border text-sm text-foreground hover:border-primary/40 hover:text-primary transition-colors">
                <Bookmark className="w-4 h-4" /> 收藏
              </button>
              <button className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md border border-border text-sm text-foreground hover:border-primary/40 hover:text-primary transition-colors">
                <Share2 className="w-4 h-4" /> 分享
              </button>
            </div>

            {/* Comments area */}
            <div>
              <h3 className="font-semibold text-foreground mb-4">参与讨论</h3>
              <div className="card-base p-4">
                <textarea
                  placeholder="分享你的想法..."
                  className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground resize-none outline-none min-h-[80px]"
                />
                <div className="flex justify-end mt-2">
                  <button className="px-4 py-1.5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
                    发表评论
                  </button>
                </div>
              </div>
            </div>
          </motion.article>
        </div>

        {/* Related */}
        <aside className="w-64 shrink-0 border-l border-border p-5 hidden xl:block sticky top-0 h-screen overflow-y-auto">
          <h3 className="font-semibold text-sm text-foreground mb-4">相关推荐</h3>
          <div className="space-y-2">
            {relatedCases.map((c) => (
              <Link key={c.id} to={`/case/${c.id}`} className="block card-base p-3 group">
                <p className="text-sm font-medium text-card-foreground group-hover:text-primary transition-colors line-clamp-2">{c.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{c.author} · {c.department}</p>
              </Link>
            ))}
          </div>
        </aside>
      </div>
    </AppLayout>
  );
};

export default CaseDetail;
