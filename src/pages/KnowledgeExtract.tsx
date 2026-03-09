import { useState } from "react";
import { motion } from "framer-motion";
import {
  Sparkles, Send, Wand2, FileText, Tag, Upload, Link2, ClipboardPaste,
  X, File, CheckCircle2, Plus, Search, Mic, Video, GitBranch, BarChart3,
  ChevronRight, MessageCircle
} from "lucide-react";
import AppLayout from "@/components/AppLayout";

interface Source {
  id: string;
  name: string;
  type: "file" | "url" | "text" | "case";
  status: "ready" | "processing";
}

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const KnowledgeExtract = () => {
  const [sources, setSources] = useState<Source[]>([
    { id: "1", name: "Q3季度研发效能报告.pdf", type: "file", status: "ready" },
    { id: "2", name: "项目复盘会议纪要.docx", type: "file", status: "ready" },
  ]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      role: "assistant",
      content: "你好！我已经分析了你上传的 2 个来源文件。你可以问我关于这些内容的任何问题，或者让我帮你生成结构化的知识案例。\n\n以下是一些建议：\n- 📝 帮我生成案例摘要\n- 🏷️ 推荐合适的标签\n- 📊 提取关键数据指标\n- 📋 生成章节结构",
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [showAddSource, setShowAddSource] = useState(false);

  const addSource = (type: Source["type"], name: string) => {
    const newSource: Source = {
      id: Date.now().toString(),
      name,
      type,
      status: "processing",
    };
    setSources(prev => [...prev, newSource]);
    setShowAddSource(false);
    setTimeout(() => {
      setSources(prev => prev.map(s => s.id === newSource.id ? { ...s, status: "ready" } : s));
    }, 1500);
  };

  const removeSource = (id: string) => {
    setSources(prev => prev.filter(s => s.id !== id));
  };

  const handleSend = () => {
    if (!chatInput.trim()) return;
    const userMsg: ChatMessage = { id: Date.now().toString(), role: "user", content: chatInput };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput("");

    // Simulate AI response
    setTimeout(() => {
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "基于你上传的来源文件，我为你生成了以下内容：\n\n**标题建议**：Q3季度研发效能提升专项行动总结\n\n**摘要**：通过引入DevOps流水线和自动化测试，发布周期缩短了40%。详细拆解了从需求管理到代码发布的优化路径。\n\n**推荐标签**：研发效能、DevOps、自动化测试、流程优化\n\n需要我进一步完善某个部分吗？",
      };
      setChatMessages(prev => [...prev, aiMsg]);
    }, 1200);
  };

  const studioTools = [
    { icon: Mic, label: "音频概览", desc: "生成播客式讲解", color: "text-orange-500" },
    { icon: Video, label: "视频概览", desc: "生成视频演示", color: "text-blue-500" },
    { icon: GitBranch, label: "思维导图", desc: "可视化知识结构", color: "text-green-500" },
    { icon: BarChart3, label: "数据报告", desc: "生成数据图表", color: "text-purple-500" },
    { icon: Tag, label: "生成标签", desc: "AI 推荐标签", color: "text-primary" },
    { icon: FileText, label: "生成案例", desc: "输出结构化案例", color: "text-primary" },
  ];

  return (
    <AppLayout>
      <div className="flex h-[calc(100vh-56px)]">
        {/* Left: Sources panel */}
        <aside className="w-[260px] shrink-0 border-r border-border flex flex-col bg-accent/30">
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-sm text-foreground">来源</h3>
              <button
                onClick={() => setShowAddSource(!showAddSource)}
                className="p-1 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Search */}
            <div className="flex items-center gap-2 px-3 py-2 rounded-md border border-border bg-card text-sm">
              <Search className="w-3.5 h-3.5 text-muted-foreground" />
              <input
                placeholder="搜索来源..."
                className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground outline-none text-sm"
              />
            </div>
          </div>

          {/* Add source options */}
          {showAddSource && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="border-b border-border p-3 space-y-1"
            >
              <button
                onClick={() => addSource("file", `文档_${sources.length + 1}.pdf`)}
                className="flex items-center gap-2 w-full px-3 py-2 rounded-md text-sm text-foreground hover:bg-accent transition-colors"
              >
                <Upload className="w-4 h-4 text-muted-foreground" /> 上传文件
              </button>
              <button
                onClick={() => addSource("url", "https://wiki.company.com/page")}
                className="flex items-center gap-2 w-full px-3 py-2 rounded-md text-sm text-foreground hover:bg-accent transition-colors"
              >
                <Link2 className="w-4 h-4 text-muted-foreground" /> 网页链接
              </button>
              <button
                onClick={() => addSource("text", "粘贴的文本笔记")}
                className="flex items-center gap-2 w-full px-3 py-2 rounded-md text-sm text-foreground hover:bg-accent transition-colors"
              >
                <ClipboardPaste className="w-4 h-4 text-muted-foreground" /> 粘贴文本
              </button>
              <button
                onClick={() => addSource("case", "已有案例引用")}
                className="flex items-center gap-2 w-full px-3 py-2 rounded-md text-sm text-foreground hover:bg-accent transition-colors"
              >
                <FileText className="w-4 h-4 text-muted-foreground" /> 引用案例
              </button>
            </motion.div>
          )}

          {/* Source list */}
          <div className="flex-1 overflow-y-auto p-3 space-y-1">
            {sources.map((source) => (
              <div
                key={source.id}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-md bg-card border border-border group hover:border-primary/30 transition-colors"
              >
                <File className="w-4 h-4 text-primary shrink-0" />
                <span className="text-sm text-foreground flex-1 truncate">{source.name}</span>
                {source.status === "processing" ? (
                  <span className="text-xs text-muted-foreground animate-pulse">...</span>
                ) : (
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-500 shrink-0" />
                )}
                <button
                  onClick={() => removeSource(source.id)}
                  className="p-0.5 rounded opacity-0 group-hover:opacity-100 hover:bg-accent text-muted-foreground transition-all"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}

            {sources.length === 0 && (
              <div className="text-center py-8">
                <p className="text-sm text-muted-foreground">还没有添加来源</p>
                <p className="text-xs text-muted-foreground mt-1">点击上方 + 添加素材</p>
              </div>
            )}
          </div>

          <div className="p-3 border-t border-border">
            <p className="text-xs text-muted-foreground text-center">{sources.length} 个来源</p>
          </div>
        </aside>

        {/* Center: AI Chat */}
        <div className="flex-1 min-w-0 flex flex-col">
          {/* Chat header */}
          <div className="px-6 py-3 border-b border-border flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="font-semibold text-sm text-foreground">AI 知识萃取助手</span>
            <span className="text-xs text-muted-foreground ml-2">基于 {sources.length} 个来源</span>
          </div>

          {/* Chat messages */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {chatMessages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className={`max-w-[80%] rounded-lg px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-accent text-foreground"
                }`}>
                  {msg.content}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Suggested actions */}
          <div className="px-6 pb-2 flex flex-wrap gap-2">
            {["帮我生成案例摘要", "提取关键数据", "推荐标签", "生成章节结构"].map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => { setChatInput(suggestion); }}
                className="px-3 py-1.5 rounded-md border border-border text-xs text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>

          {/* Chat input */}
          <div className="px-6 pb-4">
            <div className="flex items-center gap-2 px-4 py-3 rounded-lg border border-border bg-card">
              <input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                placeholder="输入你的问题，或让 AI 帮你生成内容..."
                className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
              />
              <button
                onClick={handleSend}
                disabled={!chatInput.trim()}
                className="p-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-40"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right: Studio panel */}
        <aside className="w-[240px] shrink-0 border-l border-border flex flex-col bg-accent/30">
          <div className="p-4 border-b border-border">
            <h3 className="font-semibold text-sm text-foreground">Studio</h3>
            <p className="text-xs text-muted-foreground mt-0.5">AI 工具箱</p>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
            {studioTools.map((tool) => (
              <button
                key={tool.label}
                className="w-full flex items-center gap-3 px-3 py-3 rounded-md border border-border bg-card hover:border-primary/30 transition-colors text-left group"
              >
                <tool.icon className={`w-4 h-4 ${tool.color} shrink-0`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{tool.label}</p>
                  <p className="text-xs text-muted-foreground">{tool.desc}</p>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            ))}
          </div>

          {/* Publish button */}
          <div className="p-3 border-t border-border">
            <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
              <Send className="w-4 h-4" /> 发布案例
            </button>
          </div>
        </aside>
      </div>
    </AppLayout>
  );
};

export default KnowledgeExtract;
