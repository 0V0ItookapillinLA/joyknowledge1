import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Heart, MessageCircle, Bookmark, Share2, Eye, ThumbsUp, ChevronRight, List } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import AppLayout from "@/components/AppLayout";
import { MOCK_CASES, MOCK_EXPERTS } from "@/data/mockData";

const formatNumber = (n: number) => {
  if (n >= 10000) return (n / 10000).toFixed(1) + "万";
  if (n >= 1000) return (n / 1000).toFixed(1) + "k";
  return n.toString();
};

const TOC_ITEMS = [
  { id: "section-bg", label: "案例背景" },
  { id: "section-process", label: "实施过程" },
  { id: "section-timeline", label: "项目时间轴" },
  { id: "section-results", label: "成果与价值" },
  { id: "section-tags", label: "标签" },
  { id: "section-discussion", label: "参与讨论" },
];

const CaseDetail = () => {
  const { id } = useParams();
  const caseItem = MOCK_CASES.find((c) => c.id === id) || MOCK_CASES[0];
  const relatedCases = MOCK_CASES.filter(
    (c) => c.id !== caseItem.id && c.tags.some((t) => caseItem.tags.includes(t))
  ).slice(0, 3);
  const authorExpert = MOCK_EXPERTS.find(e => e.name === caseItem.author);
  const authorCases = MOCK_CASES.filter(c => c.author === caseItem.author && c.id !== caseItem.id).slice(0, 3);
  const [activeSection, setActiveSection] = useState("section-bg");
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = contentRef.current;
    if (!container) return;
    const handleScroll = () => {
      const sections = TOC_ITEMS.map(item => ({
        id: item.id,
        el: container.querySelector(`#${item.id}`) as HTMLElement,
      })).filter(s => s.el);
      
      for (let i = sections.length - 1; i >= 0; i--) {
        const rect = sections[i].el.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        if (rect.top <= containerRect.top + 80) {
          setActiveSection(sections[i].id);
          break;
        }
      }
    };
    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const container = contentRef.current;
    if (!container) return;
    const el = container.querySelector(`#${sectionId}`) as HTMLElement;
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveSection(sectionId);
    }
  };

  return (
    <AppLayout>
      <div className="flex max-w-[1400px] mx-auto h-[calc(100vh-56px)]">
        {/* Left TOC sidebar */}
        <aside className="w-[200px] shrink-0 border-r border-border p-4 hidden lg:block sticky top-14 h-[calc(100vh-56px)] overflow-y-auto">
          <div className="flex items-center gap-2 mb-4">
            <List className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">文章目录</h3>
          </div>
          <nav className="space-y-0.5">
            {TOC_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`block w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                  activeSection === item.id
                    ? "text-primary font-medium bg-primary/5 border-l-2 border-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Center content - scrollable */}
        <div ref={contentRef} className="flex-1 min-w-0 overflow-y-auto">
          <div className="p-6 max-w-3xl mx-auto">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
              <Link to="/" className="hover:text-foreground transition-colors">首页</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span>案例详情</span>
            </div>

            <motion.article initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              {/* Title */}
              <h1 className="text-xl font-semibold text-foreground">{caseItem.title}</h1>

              {/* Author row */}
              <div className="flex items-center justify-between">
                <Link to={`/experts?id=${caseItem.author}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-medium">
                    {caseItem.author[0]}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{caseItem.author}</p>
                    <p className="text-xs text-muted-foreground">{caseItem.department} · {caseItem.createdAt}</p>
                  </div>
                </Link>
                <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border text-sm text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors">
                  + 关注
                </button>
              </div>

              {/* Article body */}
              <div className="space-y-6">
                <div id="section-bg">
                  <h2 className="text-lg font-semibold text-foreground mb-3">一、案例背景</h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">{caseItem.summary}</p>
                </div>

                <div id="section-process">
                  <h2 className="text-lg font-semibold text-foreground mb-3">四、实施过程</h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    项目组采用了敏捷迭代的方式，每两周作为一个Sprint。第一阶段完成了数据清洗和打通，第二阶段上线了营销自动化引擎...
                  </p>
                </div>

                {/* Timeline */}
                <div id="section-timeline" className="card-base p-4">
                  <p className="text-xs text-muted-foreground mb-3">项目时间轴</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      <span className="text-sm text-foreground">2023.01 - 需求调研</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      <span className="text-sm text-foreground">2023.03 - 系统上线</span>
                    </div>
                  </div>
                </div>

                <div id="section-results">
                  <h2 className="text-lg font-semibold text-foreground mb-3">五、成果与价值</h2>
                  <ul className="space-y-1.5 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2"><span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-muted-foreground shrink-0" />营销投放ROI提升30%</li>
                    <li className="flex items-start gap-2"><span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-muted-foreground shrink-0" />客户复购率提升15%</li>
                    <li className="flex items-start gap-2"><span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-muted-foreground shrink-0" />沉淀了3套标准人群包模型</li>
                  </ul>
                </div>
              </div>

              {/* Tags */}
              <div id="section-tags" className="flex flex-wrap gap-1.5">
                {caseItem.tags.map((tag) => (
                  <Link key={tag} to={`/?tag=${tag}`} className="px-3 py-1 rounded-md border border-border text-xs text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors">
                    #{tag}
                  </Link>
                ))}
              </div>

              {/* Action bar */}
              <div className="flex items-center gap-4 py-4 border-t border-border">
                <button className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors">
                  <ThumbsUp className="w-4 h-4" /> 点赞 {formatNumber(caseItem.likes)}
                </button>
                <button className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors">
                  <Bookmark className="w-4 h-4" /> 收藏
                </button>
                <button className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors">
                  <Share2 className="w-4 h-4" /> 分享
                </button>
                <span className="ml-auto text-sm text-muted-foreground flex items-center gap-1">
                  <Eye className="w-4 h-4" /> 阅读 {formatNumber(caseItem.views)}
                </span>
              </div>

              {/* Comment section */}
              <div id="section-discussion">
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
        </div>

        {/* Right sidebar */}
        <aside className="w-[280px] shrink-0 border-l border-border p-5 hidden lg:block sticky top-14 h-[calc(100vh-56px)] overflow-y-auto space-y-6">
          {/* Related recommendations */}
          <div>
            <h3 className="font-semibold text-sm text-foreground mb-3">相关推荐</h3>
            <div className="space-y-3">
              {relatedCases.map((c) => (
                <Link key={c.id} to={`/case/${c.id}`} className="block group">
                  <p className="text-sm text-foreground group-hover:text-primary transition-colors line-clamp-2 font-medium">{c.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">阅读 {formatNumber(c.views)} · {c.createdAt}</p>
                </Link>
              ))}
            </div>
          </div>

          {/* Author other cases */}
          <div>
            <h3 className="font-semibold text-sm text-foreground mb-3">作者其他案例</h3>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-medium">
                {caseItem.author[0]}
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{caseItem.author}</p>
                <p className="text-xs text-muted-foreground">共发布 {authorExpert?.caseCount || 12} 篇</p>
              </div>
            </div>
            <Link
              to={`/experts?id=${authorExpert?.id || caseItem.author}`}
              className="block w-full text-center py-2 rounded-md border border-border text-sm text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors"
            >
              进入作者主页
            </Link>
          </div>
        </aside>
      </div>
    </AppLayout>
  );
};

export default CaseDetail;
