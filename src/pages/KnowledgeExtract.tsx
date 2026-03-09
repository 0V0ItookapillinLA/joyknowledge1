import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles, Send, FileText, Tag, Upload, Link2, ClipboardPaste,
  X, File, CheckCircle2, Plus, Search, Mic, Video, GitBranch, BarChart3,
  ChevronRight, Square, Loader2, Eye, Save, Zap
} from "lucide-react";
import AppLayout from "@/components/AppLayout";

interface Source {
  id: string;
  name: string;
  type: "file" | "url" | "text" | "case";
  status: "ready" | "processing" | "analyzing";
  selected: boolean;
}

interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  isTyping?: boolean;
}

interface StudioItem {
  id: string;
  type: string;
  label: string;
  icon: typeof FileText;
  status: "idle" | "generating" | "ready";
  preview?: string;
  color: string;
}

const KnowledgeExtract = () => {
  const [sources, setSources] = useState<Source[]>([
    { id: "1", name: "Q3季度研发效能报告.pdf", type: "file", status: "ready", selected: true },
    { id: "2", name: "项目复盘会议纪要.docx", type: "file", status: "ready", selected: true },
    { id: "3", name: "DevOps最佳实践指南.md", type: "file", status: "ready", selected: false },
  ]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "system",
      content: "已自动解析 2 个来源文件，识别到 3 个核心主题。",
    },
    {
      id: "1",
      role: "assistant",
      content: "你好！我已经完成了对来源文件的深度解析 📄\n\n**识别到的核心主题：**\n- 🔧 研发效能提升（DevOps流水线优化）\n- 📊 关键指标变化（发布周期缩短40%）\n- 🎯 团队协作改进（跨部门对齐机制）\n\n你可以让我基于这些内容生成结构化案例，或直接提问。",
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [showAddSource, setShowAddSource] = useState(false);
  const [isAiTyping, setIsAiTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [studioItems, setStudioItems] = useState<StudioItem[]>([
    { id: "report", type: "report", label: "结构化报告", icon: FileText, status: "ready", preview: "Q3研发效能提升专项总结，含4个章节...", color: "bg-blue-50 text-blue-600 border-blue-100" },
    { id: "mindmap", type: "mindmap", label: "思维导图", icon: GitBranch, status: "ready", preview: "3层知识结构，12个关键节点", color: "bg-green-50 text-green-600 border-green-100" },
    { id: "flashcard", type: "flashcard", label: "知识闪卡", icon: Zap, status: "generating", color: "bg-amber-50 text-amber-600 border-amber-100" },
    { id: "audio", type: "audio", label: "音频概览", icon: Mic, status: "idle", color: "bg-orange-50 text-orange-600 border-orange-100" },
    { id: "video", type: "video", label: "视频概览", icon: Video, status: "idle", color: "bg-purple-50 text-purple-600 border-purple-100" },
    { id: "data", type: "data", label: "数据报告", icon: BarChart3, status: "idle", color: "bg-rose-50 text-rose-600 border-rose-100" },
  ]);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  // Simulate flashcard generation completing
  useEffect(() => {
    const timer = setTimeout(() => {
      setStudioItems(prev => prev.map(item =>
        item.id === "flashcard" ? { ...item, status: "ready" as const, preview: "8张核心知识卡片已生成" } : item
      ));
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const addSource = (type: Source["type"], name: string) => {
    const newSource: Source = {
      id: Date.now().toString(),
      name,
      type,
      status: "analyzing",
      selected: true,
    };
    setSources(prev => [...prev, newSource]);
    setShowAddSource(false);

    // System message about new source
    setChatMessages(prev => [...prev, {
      id: `sys-${Date.now()}`,
      role: "system",
      content: `正在解析新来源：${name}...`,
    }]);

    // Simulate analysis
    setTimeout(() => {
      setSources(prev => prev.map(s => s.id === newSource.id ? { ...s, status: "ready" } : s));
      setChatMessages(prev => [...prev, {
        id: `ai-${Date.now()}`,
        role: "assistant",
        content: `✅ 已完成「${name}」的解析。新增 2 个相关主题，来源总数：${sources.length + 1}。\n\n有什么需要我帮你分析的吗？`,
      }]);
    }, 2000);
  };

  const toggleSource = (id: string) => {
    setSources(prev => prev.map(s => s.id === id ? { ...s, selected: !s.selected } : s));
  };

  const removeSource = (id: string) => {
    setSources(prev => prev.filter(s => s.id !== id));
  };

  const handleSend = () => {
    if (!chatInput.trim() || isAiTyping) return;
    const userMsg: ChatMessage = { id: Date.now().toString(), role: "user", content: chatInput };
    setChatMessages(prev => [...prev, userMsg]);
    const input = chatInput;
    setChatInput("");
    setIsAiTyping(true);

    setTimeout(() => {
      let response = "";
      if (input.includes("摘要") || input.includes("总结")) {
        response = "## 📝 案例摘要\n\n**标题**：Q3季度研发效能提升专项行动总结\n\n**核心成果**：通过引入DevOps流水线和自动化测试体系，团队发布周期从平均14天缩短至8.4天，缩短了 **40%**。\n\n**关键举措**：\n1. 建立CI/CD自动化流水线\n2. 引入代码质量门禁机制\n3. 推行每日站会与Sprint Review\n4. 优化跨部门需求对齐流程\n\n> 💡 已同步更新到右侧 Studio 的「结构化报告」中。";
      } else if (input.includes("标签") || input.includes("tag")) {
        response = "## 🏷️ 推荐标签\n\n基于内容分析，推荐以下标签：\n\n| 标签 | 相关度 | 频次 |\n|------|--------|------|\n| 研发效能 | ⭐⭐⭐⭐⭐ | 23次 |\n| DevOps | ⭐⭐⭐⭐⭐ | 18次 |\n| 自动化测试 | ⭐⭐⭐⭐ | 12次 |\n| 流程优化 | ⭐⭐⭐⭐ | 9次 |\n| CI/CD | ⭐⭐⭐ | 7次 |\n\n需要我将这些标签应用到案例中吗？";
      } else if (input.includes("章节") || input.includes("结构")) {
        response = "## 📋 章节结构建议\n\n```\n1. 项目背景与目标\n   1.1 业务挑战\n   1.2 效能痛点分析\n   1.3 目标设定\n\n2. 解决方案设计\n   2.1 技术选型\n   2.2 流程重构\n   2.3 工具链搭建\n\n3. 实施过程\n   3.1 第一阶段：基础设施\n   3.2 第二阶段：流程落地\n   3.3 第三阶段：持续优化\n\n4. 成果与数据\n   4.1 核心指标对比\n   4.2 团队反馈\n\n5. 经验与反思\n   5.1 关键成功因素\n   5.2 踩坑总结\n   5.3 后续计划\n```\n\n需要我基于此结构生成完整正文吗？";
      } else {
        response = `基于已选中的 ${sources.filter(s => s.selected).length} 个来源文件，我来回答你的问题：\n\n根据分析，来源文件中提到了以下关键信息：\n\n- 📌 项目周期为 3 个月（7月-9月）\n- 📌 涉及 3 个核心团队的协作\n- 📌 采用了 Scrum + Kanban 混合模式\n\n需要我深入分析某个具体方面吗？`;
      }

      setChatMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
      }]);
      setIsAiTyping(false);
    }, 1500);
  };

  const handleSuggestionClick = (text: string) => {
    setChatInput(text);
    // Auto-send after a brief visual feedback
    setTimeout(() => {
      const userMsg: ChatMessage = { id: Date.now().toString(), role: "user", content: text };
      setChatMessages(prev => [...prev, userMsg]);
      setChatInput("");
      setIsAiTyping(true);

      setTimeout(() => {
        setChatMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: text.includes("摘要")
            ? "## 📝 案例摘要\n\n**标题**：Q3季度研发效能提升专项行动总结\n\n通过引入DevOps流水线和自动化测试，发布周期缩短了**40%**。详细拆解了从需求管理到代码发布的完整优化路径，为类似项目提供了可复用的方法论。\n\n> 已同步至右侧 Studio → 结构化报告"
            : text.includes("数据")
            ? "## 📊 关键数据提取\n\n| 指标 | 改进前 | 改进后 | 变化 |\n|------|--------|--------|------|\n| 发布周期 | 14天 | 8.4天 | -40% |\n| Bug修复时长 | 48h | 12h | -75% |\n| 代码覆盖率 | 45% | 82% | +82% |\n| 需求交付率 | 65% | 91% | +40% |"
            : text.includes("标签")
            ? "## 🏷️ 推荐标签\n\n`研发效能` `DevOps` `自动化测试` `流程优化` `CI/CD` `敏捷开发`\n\n这些标签基于内容频次和语义关联度生成。需要调整吗？"
            : "## 📋 章节结构\n\n1. **项目背景与目标** — 业务挑战、痛点分析\n2. **解决方案设计** — 技术选型、流程重构\n3. **实施过程** — 分阶段推进策略\n4. **成果与数据** — 核心指标对比\n5. **经验与反思** — 成功因素、踩坑总结",
        }]);
        setIsAiTyping(false);
      }, 1500);
    }, 100);
  };

  const generateStudioItem = (id: string) => {
    setStudioItems(prev => prev.map(item =>
      item.id === id ? { ...item, status: "generating" as const } : item
    ));
    setTimeout(() => {
      setStudioItems(prev => prev.map(item =>
        item.id === id ? { ...item, status: "ready" as const, preview: `已基于 ${sources.filter(s => s.selected).length} 个来源生成` } : item
      ));
    }, 2500);
  };

  const selectedCount = sources.filter(s => s.selected).length;

  return (
    <AppLayout>
      <div className="flex h-[calc(100vh-56px)]">
        {/* ========== Left: Sources panel ========== */}
        <aside className="w-[272px] shrink-0 border-r border-border flex flex-col bg-muted/30">
          {/* Header */}
          <div className="px-4 pt-4 pb-3">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-sm text-foreground">来源</h3>
                <span className="px-1.5 py-0.5 rounded bg-accent text-xs text-muted-foreground">{sources.length}</span>
              </div>
              <button
                onClick={() => setShowAddSource(!showAddSource)}
                className="p-1.5 rounded-lg hover:bg-accent text-muted-foreground hover:text-primary transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-card text-sm shadow-sm">
              <Search className="w-3.5 h-3.5 text-muted-foreground" />
              <input
                placeholder="搜索来源..."
                className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground outline-none text-sm"
              />
            </div>
          </div>

          {/* Add source panel */}
          <AnimatePresence>
            {showAddSource && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="px-3 pb-3 grid grid-cols-2 gap-1.5">
                  {[
                    { icon: Upload, label: "上传文件", type: "file" as const, name: `文档_${sources.length + 1}.pdf` },
                    { icon: Link2, label: "网页链接", type: "url" as const, name: "https://wiki.company.com" },
                    { icon: ClipboardPaste, label: "粘贴文本", type: "text" as const, name: "粘贴的笔记" },
                    { icon: FileText, label: "引用案例", type: "case" as const, name: "已有案例引用" },
                  ].map(opt => (
                    <button
                      key={opt.label}
                      onClick={() => addSource(opt.type, opt.name)}
                      className="flex flex-col items-center gap-1.5 px-3 py-3 rounded-lg border border-dashed border-border text-xs text-muted-foreground hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition-all"
                    >
                      <opt.icon className="w-4 h-4" />
                      {opt.label}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Source list */}
          <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-1.5">
            {sources.map((source) => (
              <motion.div
                key={source.id}
                layout
                className={`flex items-center gap-2.5 px-3 py-3 rounded-xl border group transition-all cursor-pointer ${
                  source.selected
                    ? "bg-card border-primary/20 shadow-sm"
                    : "bg-card/50 border-border hover:border-border"
                }`}
                onClick={() => toggleSource(source.id)}
              >
                {/* Checkbox */}
                <div className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
                  source.selected ? "bg-primary border-primary" : "border-muted-foreground/30"
                }`}>
                  {source.selected && <CheckCircle2 className="w-3 h-3 text-primary-foreground" />}
                </div>

                <File className={`w-4 h-4 shrink-0 ${source.selected ? "text-primary" : "text-muted-foreground"}`} />
                <div className="flex-1 min-w-0">
                  <span className="text-sm text-foreground truncate block">{source.name}</span>
                  {source.status === "analyzing" && (
                    <span className="text-xs text-primary flex items-center gap-1 mt-0.5">
                      <Loader2 className="w-3 h-3 animate-spin" /> 解析中...
                    </span>
                  )}
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); removeSource(source.id); }}
                  className="p-0.5 rounded opacity-0 group-hover:opacity-100 hover:bg-accent text-muted-foreground transition-all"
                >
                  <X className="w-3 h-3" />
                </button>
              </motion.div>
            ))}
          </div>

          {/* Footer */}
          <div className="px-4 py-3 border-t border-border">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>已选中 {selectedCount} / {sources.length}</span>
              <button
                onClick={() => setSources(prev => prev.map(s => ({ ...s, selected: true })))}
                className="text-primary hover:underline"
              >
                全选
              </button>
            </div>
          </div>
        </aside>

        {/* ========== Center: AI Chat ========== */}
        <div className="flex-1 min-w-0 flex flex-col bg-background">
          {/* Chat header */}
          <div className="px-6 py-3 border-b border-border flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary" />
            </div>
            <div>
              <span className="font-semibold text-sm text-foreground">AI 知识萃取助手</span>
              <p className="text-xs text-muted-foreground">基于 {selectedCount} 个已选来源 · 实时分析</p>
            </div>
          </div>

          {/* Chat messages */}
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
            {chatMessages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : msg.role === "system" ? "justify-center" : "justify-start"
                }`}
              >
                {msg.role === "system" ? (
                  <div className="px-3 py-1.5 rounded-full bg-accent text-xs text-muted-foreground flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-primary" />
                    {msg.content}
                  </div>
                ) : (
                  <div className="flex gap-2.5 max-w-[85%]">
                    {msg.role === "assistant" && (
                      <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                        <Sparkles className="w-3.5 h-3.5 text-primary" />
                      </div>
                    )}
                    <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground rounded-br-md"
                        : "bg-accent/80 text-foreground border border-border/50 rounded-bl-md shadow-sm"
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                )}
              </motion.div>
            ))}

            {isAiTyping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-2.5"
              >
                <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Sparkles className="w-3.5 h-3.5 text-primary" />
                </div>
                <div className="rounded-2xl rounded-bl-md px-4 py-3 bg-accent/80 border border-border/50 shadow-sm">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="w-2 h-2 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <div className="w-2 h-2 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Suggestion chips */}
          <div className="px-6 pb-3">
            <div className="flex flex-wrap gap-2">
              {[
                { emoji: "📝", text: "帮我生成案例摘要" },
                { emoji: "📊", text: "提取关键数据指标" },
                { emoji: "🏷️", text: "推荐合适的标签" },
                { emoji: "📋", text: "生成章节结构" },
              ].map((suggestion) => (
                <button
                  key={suggestion.text}
                  onClick={() => handleSuggestionClick(suggestion.text)}
                  disabled={isAiTyping}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-border bg-card text-xs text-foreground hover:border-primary/40 hover:bg-primary/5 hover:shadow-sm transition-all disabled:opacity-50 shadow-sm"
                >
                  <span>{suggestion.emoji}</span>
                  {suggestion.text}
                </button>
              ))}
            </div>
          </div>

          {/* Chat input */}
          <div className="px-6 pb-5">
            <div className="flex items-center gap-3 px-4 py-3 rounded-2xl border border-border bg-card shadow-sm focus-within:border-primary/40 focus-within:shadow-md transition-all">
              <input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                placeholder="输入你的问题，或让 AI 帮你生成内容..."
                disabled={isAiTyping}
                className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none disabled:opacity-50"
              />
              <button
                onClick={handleSend}
                disabled={!chatInput.trim() || isAiTyping}
                className="p-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-30 shadow-sm"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* ========== Right: Studio panel ========== */}
        <aside className="w-[260px] shrink-0 border-l border-border flex flex-col bg-muted/30">
          <div className="px-4 pt-4 pb-3 border-b border-border">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-sm text-foreground">Studio</h3>
              <span className="px-1.5 py-0.5 rounded-md bg-primary/10 text-primary text-[10px] font-medium">Beta</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">AI 自动生成创作产物</p>
          </div>

          <div className="flex-1 overflow-y-auto p-3">
            <div className="grid grid-cols-2 gap-2">
              {studioItems.map((item) => (
                <motion.button
                  key={item.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => item.status === "idle" && generateStudioItem(item.id)}
                  className={`relative flex flex-col items-center gap-2 p-4 rounded-xl border text-center transition-all group ${
                    item.status === "ready"
                      ? `${item.color} border shadow-sm`
                      : item.status === "generating"
                      ? "bg-card border-primary/20 border-dashed"
                      : "bg-card border-border hover:border-primary/30 hover:shadow-sm"
                  }`}
                >
                  {item.status === "generating" ? (
                    <Loader2 className="w-5 h-5 text-primary animate-spin" />
                  ) : (
                    <item.icon className="w-5 h-5" />
                  )}
                  <span className="text-xs font-medium">{item.label}</span>

                  {item.status === "ready" && (
                    <span className="text-[10px] text-muted-foreground line-clamp-1 px-1">{item.preview}</span>
                  )}
                  {item.status === "generating" && (
                    <span className="text-[10px] text-primary">生成中...</span>
                  )}
                  {item.status === "idle" && (
                    <span className="text-[10px] text-muted-foreground">点击生成</span>
                  )}

                  {/* Hover actions for ready items */}
                  {item.status === "ready" && (
                    <div className="absolute inset-0 rounded-xl bg-foreground/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button className="p-1.5 rounded-lg bg-card border border-border shadow-sm hover:border-primary/40 transition-colors">
                        <Eye className="w-3.5 h-3.5 text-foreground" />
                      </button>
                      <button className="p-1.5 rounded-lg bg-card border border-border shadow-sm hover:border-primary/40 transition-colors">
                        <Save className="w-3.5 h-3.5 text-foreground" />
                      </button>
                    </div>
                  )}
                </motion.button>
              ))}
            </div>

            {/* Tags section */}
            <div className="mt-4 p-3 rounded-xl border border-border bg-card">
              <div className="flex items-center gap-2 mb-2">
                <Tag className="w-3.5 h-3.5 text-primary" />
                <span className="text-xs font-medium text-foreground">推荐标签</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {["研发效能", "DevOps", "自动化测试", "流程优化", "CI/CD"].map(tag => (
                  <span key={tag} className="px-2 py-0.5 rounded-md bg-primary/10 text-primary text-xs">{tag}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Publish */}
          <div className="p-3 border-t border-border space-y-2">
            <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm">
              <Send className="w-4 h-4" /> 发布案例
            </button>
            <button className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-border text-sm text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors">
              <Save className="w-4 h-4" /> 保存草稿
            </button>
          </div>
        </aside>
      </div>
    </AppLayout>
  );
};

export default KnowledgeExtract;
