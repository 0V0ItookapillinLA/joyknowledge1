import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles, Send, FileText, Tag, Upload, Link2,
  X, File, CheckCircle2, Plus, Search, Loader2, Save, Zap,
  Mic, Video, GitBranch, BarChart3, Globe, ArrowRight,
  ChevronLeft, Edit3, BookOpen, Wand2, MessageSquare, FileUp,
  Check, RotateCcw, Image, FileAudio, FileVideo,
  Headphones, StickyNote, Layers, PenTool, Table2,
  HelpCircle, Monitor, Cloud, Landmark, Building2, ChevronDown,
  GripVertical, Trash2, Import, Shield, Users, Lock, UserCheck
} from "lucide-react";
import AppLayout from "@/components/AppLayout";

/* ───── Types ───── */
interface Source {
  id: string;
  name: string;
  type: "file" | "url" | "text" | "case" | "image" | "audio" | "video";
  status: "ready" | "processing" | "analyzing";
  selected: boolean;
  size?: string;
  favicon?: string;
}

interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
}

interface ToolOption {
  id: string;
  label: string;
  desc: string;
  icon: typeof FileText;
  checked: boolean;
  color: string;
}

interface OutputTemplate {
  id: string;
  label: string;
  desc: string;
  icon: typeof FileText;
  preview: string[];
  color: string;
  gradient: string;
}

interface SearchResult {
  id: string;
  title: string;
  url: string;
  desc: string;
  source: string;
}

type AppMode = "select" | "workspace" | "generating" | "result" | "quick-upload" | "quick-template" | "deep-structuring";
type ExtractMode = "quick" | "deep";
type SearchScope = "web" | "enterprise";
type SearchDepth = "fast" | "deep";

/* ───── Mock Content ───── */
const GENERATED_DOC = `# Q3季度研发效能提升专项总结

## 概述
本报告基于上传的研发效能报告和项目复盘会议纪要，结合 AI 深度分析生成。涵盖项目背景、实施过程、核心成果与经验反思。

---

## 1. 项目背景与目标

### 1.1 业务挑战
随着业务规模快速扩张，研发团队面临交付周期长、质量不稳定、跨部门协作低效等核心痛点。季度初的内部调研显示，超过 72% 的开发者认为现有流程存在明显瓶颈。

### 1.2 目标设定
- 发布周期缩短 30% 以上
- 代码覆盖率提升至 80%+
- 需求交付率提升至 90%+

## 2. 解决方案设计

### 2.1 技术选型
采用 Jenkins + GitLab CI 构建自动化流水线，引入 SonarQube 进行代码质量管控。经过对比评估 3 种方案后，选择了渐进式迁移策略。

### 2.2 流程重构
推行 Scrum + Kanban 混合敏捷模式，建立每日站会和 Sprint Review 机制。通过两周一个迭代的节奏逐步优化流程，确保团队适应性和可持续性。

## 3. 实施成果

### 3.1 核心指标改进
发布周期从 14 天缩短至 8.4 天，降幅达 40%。Bug 修复时长从 48 小时缩短至 12 小时，降幅 75%。代码覆盖率从 45% 提升至 82%，需求交付率从 65% 提升至 91%。

### 3.2 团队效能变化
团队满意度调研显示，流程满意度从改进前的 35% 提升至 78%。跨部门协作效率提升明显，需求对齐周期缩短了 60%。

## 4. 经验与反思

### 4.1 关键成功因素
高层支持与资源保障是首要因素。渐进式推进避免了一刀切带来的团队抵触情绪。数据驱动的持续优化确保了每个改进点都有据可依。

### 4.2 踩坑总结
初期自动化测试覆盖率目标设定过高，导致团队抵触。跨部门协作需要明确的接口人机制，否则沟通成本反而增加。工具链的选型需要充分调研，避免中途更换带来的沉没成本。

### 4.3 未来规划
下一阶段将重点推进 AI 辅助代码审查和智能测试生成，预计可进一步提升 20% 的研发效率。同时计划将成功经验推广至其他 BU，形成集团级最佳实践。`;

const SOCRATIC_RESPONSES = [
  "你提到了这个做法很有效，能具体说说**当时是什么契机**让你决定采用这种方式的吗？背后的思考过程是什么？",
  "这个经验很有价值。我想深入了解一下，在实施过程中**你遇到的最大阻力**是什么？你是如何克服的？",
  "你刚才提到的这个方法论很独到。如果让你**给刚入行的同事一个建议**，你会怎么总结这个经验的核心？",
  "非常好的观点！那在这个过程中，有没有什么**你事后觉得可以做得更好**的地方？",
  "我注意到你的描述中隐含了一个很重要的决策点。能聊聊**当时有哪些备选方案**，为什么最终选择了这个方向？",
  "这个经验背后的**底层逻辑**是什么？你觉得它可以迁移到其他类似的场景中吗？",
];

const QUICK_RESPONSES = [
  "已收到你的补充信息！我正在将其与文件内容进行交叉分析，更新后的内容将体现在最终文档中。\n\n还有什么需要补充的吗？或者你可以直接点击右侧的「开始生成」。",
  "好的，这个信息很有价值。我会在生成报告时重点突出这部分内容。\n\n如果准备好了，可以选好工具后点击生成。",
  "明白了，这为报告增加了很好的上下文。我已经记录下来。\n\n你可以继续补充，或者选好工具后直接生成文档。",
];

/* ───── Upload categories ───── */
const LOCAL_UPLOAD_TYPES = [
  { icon: FileText, label: "本地非结构化文档", desc: "根据上传的文件，进行解析和切分处理", type: "file" as const, gradient: "from-blue-500 to-indigo-600" },
  { icon: Table2, label: "表格", desc: "根据上传的表格数据，按照索引列进行分块和解析处理", type: "file" as const, gradient: "from-emerald-500 to-teal-600" },
  { icon: HelpCircle, label: "QA 文件", desc: "CSV、Excel 文件，只包含 Question、Answer 两列数据", type: "file" as const, gradient: "from-amber-500 to-orange-500" },
  { icon: Image, label: "图片", desc: "JPG、PNG、截图等，OCR 识别与内容提取", type: "image" as const, gradient: "from-pink-500 to-rose-600" },
  { icon: FileVideo, label: "视频", desc: "根据上传的视频数据，进行视频、文字识别，再对图片、文本进行解析和切分处理", type: "video" as const, gradient: "from-purple-500 to-violet-600" },
  { icon: Headphones, label: "音频", desc: "根据上传的音频数据，进行 ASR 文本识别，再对文本进行解析和切分处理", type: "audio" as const, gradient: "from-orange-500 to-amber-600" },
];

const ONLINE_UPLOAD_TYPES = [
  { icon: BookOpen, label: "JoySpace", desc: "获取 JoySpace 文档或目录下文档内容，进行解析和切分处理，支持设置自动更新", type: "url" as const, gradient: "from-red-400 to-red-600" },
  { icon: Globe, label: "网页", desc: "获取上传 URL 的网页数据，进行解析和切分处理，支持设置自动更新", type: "url" as const, gradient: "from-blue-500 to-blue-700" },
  { icon: Landmark, label: "神灯文章", desc: "获取神灯文章文档或目录下文档内容，进行解析和切分处理，支持设置自动更新", type: "url" as const, gradient: "from-amber-500 to-amber-700" },
];

const FILE_TYPE_ICON: Record<string, typeof FileText> = {
  file: FileText, image: Image, audio: FileAudio, video: FileVideo, url: Link2, text: StickyNote, case: BookOpen,
};

const FILE_TYPE_COLOR: Record<string, string> = {
  file: "text-blue-500 bg-blue-50", image: "text-emerald-500 bg-emerald-50", audio: "text-orange-500 bg-orange-50",
  video: "text-purple-500 bg-purple-50", url: "text-cyan-500 bg-cyan-50", text: "text-rose-500 bg-rose-50", case: "text-amber-500 bg-amber-50",
};

/* ───── Output Templates ───── */
const OUTPUT_TEMPLATES: OutputTemplate[] = [
  {
    id: "structured-report", label: "结构化报告", desc: "按章节组织的完整知识文档，适合正式的经验总结与汇报",
    icon: FileText, color: "border-blue-200 bg-blue-50/60", gradient: "from-blue-500 to-indigo-600",
    preview: ["📋 概述与背景", "🎯 核心观点提炼", "📊 数据与指标分析", "💡 经验总结与建议", "🏷️ 标签与分类"],
  },
  {
    id: "project-review", label: "项目复盘", desc: "复盘框架：目标回顾 → 结果评估 → 亮点与不足 → 改进措施",
    icon: RotateCcw, color: "border-amber-200 bg-amber-50/60", gradient: "from-amber-500 to-orange-600",
    preview: ["🎯 目标与计划回顾", "📈 执行结果评估", "✅ 亮点总结", "⚠️ 不足与改进", "📝 行动计划"],
  },
  {
    id: "best-practice", label: "最佳实践", desc: "提炼可复用的方法论与操作指南，方便团队学习推广",
    icon: Sparkles, color: "border-emerald-200 bg-emerald-50/60", gradient: "from-emerald-500 to-teal-600",
    preview: ["🧩 场景与问题定义", "🔧 解决方案详述", "📐 操作步骤拆解", "⚡ 关键注意事项", "🔄 适用范围与迁移"],
  },
  {
    id: "training-material", label: "培训教材", desc: "面向新人或团队的学习材料，包含知识点、练习与测验",
    icon: BookOpen, color: "border-purple-200 bg-purple-50/60", gradient: "from-purple-500 to-violet-600",
    preview: ["📖 学习目标", "🧠 核心知识点", "💬 案例与场景", "✍️ 练习与思考题", "📋 学习检查清单"],
  },
  {
    id: "meeting-summary", label: "会议纪要", desc: "提炼会议核心信息：决议、待办、负责人与时间节点",
    icon: MessageSquare, color: "border-cyan-200 bg-cyan-50/60", gradient: "from-cyan-500 to-sky-600",
    preview: ["📌 会议概要", "✅ 关键决议", "📋 待办事项", "👤 责任人分配", "⏰ 时间节点"],
  },
  {
    id: "insight-cards", label: "知识卡片", desc: "将知识浓缩为一张张闪卡，适合碎片化学习和快速回顾",
    icon: Zap, color: "border-rose-200 bg-rose-50/60", gradient: "from-rose-500 to-pink-600",
    preview: ["⚡ 核心概念卡", "🔑 关键公式/模型", "💡 经验金句", "❓ Q&A 速记卡", "🏷️ 主题分类索引"],
  },
];

/* ───── Component ───── */
const KnowledgeExtract = () => {
  const [appMode, setAppMode] = useState<AppMode>("select");
  const [extractMode, setExtractMode] = useState<ExtractMode>("quick");

  const [sources, setSources] = useState<Source[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [showAddSource, setShowAddSource] = useState(false);
  const [quickTitle, setQuickTitle] = useState("");
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [webSearchQuery, setWebSearchQuery] = useState("");
  const [socraticIndex, setSocraticIndex] = useState(0);
  const [quickIndex, setQuickIndex] = useState(0);
  const [generatingProgress, setGeneratingProgress] = useState(0);
  const [resultContent, setResultContent] = useState(GENERATED_DOC);
  const [isEditing, setIsEditing] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [activeUploadType, setActiveUploadType] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Deep mode search state
  const [searchScope, setSearchScope] = useState<SearchScope>("web");
  const [searchDepth, setSearchDepth] = useState<SearchDepth>("fast");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchComplete, setSearchComplete] = useState(false);
  const [searchProgress, setSearchProgress] = useState<string[]>([]);
  const [showScopeDropdown, setShowScopeDropdown] = useState(false);
  const [showDepthDropdown, setShowDepthDropdown] = useState(false);

  // Deep structuring state
  const [initialDoc, setInitialDoc] = useState("");
  const [paragraphTools, setParagraphTools] = useState<Record<number, string[]>>({});
  const [draggedTool, setDraggedTool] = useState<string | null>(null);
  const [showPublishDialog, setShowPublishDialog] = useState(false);
  const [publishTarget, setPublishTarget] = useState<"personal" | "bgbu" | null>(null);
  const [publishSubmitted, setPublishSubmitted] = useState(false);
  const [dropHighlight, setDropHighlight] = useState<number | null>(null);

  // Deep structuring tool workspace state
  const [selectedStructTool, setSelectedStructTool] = useState<string | null>(null);
  const [toolInputTexts, setToolInputTexts] = useState<Record<string, string>>({});
  const [toolGenerating, setToolGenerating] = useState<string | null>(null);
  const [toolResults, setToolResults] = useState<Record<string, string>>({});
  const [toolGenProgress, setToolGenProgress] = useState(0);

  const [tools, setTools] = useState<ToolOption[]>([
    { id: "report", label: "结构化文本", desc: "按章节组织的完整文档", icon: FileText, checked: false, color: "text-blue-600 bg-blue-50 border-blue-200" },
    { id: "mindmap", label: "思维导图", desc: "知识脉络可视化", icon: GitBranch, checked: false, color: "text-green-600 bg-green-50 border-green-200" },
    { id: "flashcard", label: "知识闪卡", desc: "核心知识点速记卡", icon: Zap, checked: false, color: "text-amber-600 bg-amber-50 border-amber-200" },
    { id: "data", label: "数据图表", desc: "关键指标可视化", icon: BarChart3, checked: false, color: "text-rose-600 bg-rose-50 border-rose-200" },
    { id: "audio", label: "音频概览", desc: "语音版内容摘要", icon: Mic, checked: false, color: "text-orange-600 bg-orange-50 border-orange-200" },
    { id: "video", label: "视频概览", desc: "视频版知识讲解", icon: Video, checked: false, color: "text-purple-600 bg-purple-50 border-purple-200" },
  ]);

  const MOCK_SEARCH_RESULTS: SearchResult[] = [
    { id: "sr1", title: "2024中国大模型+知识管理最佳实践案例TOP15重磅发布", url: "https://53ai.com/news/top15", desc: "这份报告为你揭示了大模型在知识管理领域的最佳实践案例。", source: "53AI" },
    { id: "sr2", title: "《技术趋势2026》报告 | 德勤中国", url: "https://deloitte.com/cn/tech-trends", desc: "德勤发布的2026年技术趋势深度报告。", source: "Deloitte" },
    { id: "sr3", title: "人工智能知识管理：指南、策略与优势", url: "https://lark.com/ai-knowledge", desc: "全面解读AI驱动的知识管理指南与策略。", source: "Lark" },
    { id: "sr4", title: "大模型知识管理系统", url: "https://zte.com/km-system", desc: "中兴通讯大模型知识管理系统技术架构。", source: "ZTE" },
    { id: "sr5", title: "人工智能安全治理框架解读", url: "https://security.com/ai-governance", desc: "AI安全治理框架的深度解读。", source: "安全内参" },
  ];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  /* ───── Mode entry ───── */
  const enterWorkspace = (mode: ExtractMode) => {
    setExtractMode(mode);
    if (mode === "quick") {
      setAppMode("quick-upload");
      return;
    }
    setAppMode("workspace");
    const welcome: ChatMessage = { id: "1", role: "assistant", content: "你好！我将通过苏格拉底式提问来帮你挖掘**隐性知识** 🧠\n\n我已解析了你的文件，首先想问：\n\n在推动这个研发效能项目时，**最初的动机是什么**？是来自上级要求，还是你自己观察到了某些痛点？" };
    setChatMessages([
      { id: "sys", role: "system", content: `已自动解析 ${sources.filter(s => s.selected).length} 个来源文件` },
      welcome,
    ]);
  };

  /* ───── Source management ───── */
  const addSource = (type: Source["type"], name: string) => {
    const sizes: Record<string, string> = { file: "1.2 MB", image: "3.8 MB", audio: "24.5 MB", video: "156 MB" };
    const newSource: Source = { id: Date.now().toString(), name, type, status: "analyzing", selected: true, size: sizes[type] || "" };
    setSources(prev => [...prev, newSource]);
    setShowAddSource(false);
    setActiveUploadType(null);
    setChatMessages(prev => [...prev, { id: `sys-${Date.now()}`, role: "system", content: `正在解析新来源：${name}...` }]);
    setTimeout(() => {
      setSources(prev => prev.map(s => s.id === newSource.id ? { ...s, status: "ready" } : s));
      setChatMessages(prev => [...prev, { id: `ai-${Date.now()}`, role: "assistant", content: `✅ 已完成「${name}」的解析，新增内容已纳入分析范围。` }]);
    }, 2000);
  };

  const quickAddSource = (type: Source["type"], name: string) => {
    const sizes: Record<string, string> = { file: "1.2 MB", image: "3.8 MB", audio: "24.5 MB", video: "156 MB" };
    const newSource: Source = { id: Date.now().toString(), name, type, status: "analyzing", selected: true, size: sizes[type] || "" };
    setSources(prev => [...prev, newSource]);
    setActiveUploadType(null);
    setTimeout(() => {
      setSources(prev => prev.map(s => s.id === newSource.id ? { ...s, status: "ready" } : s));
    }, 1500 + Math.random() * 1000);
  };

  const toggleSource = (id: string) => setSources(prev => prev.map(s => s.id === id ? { ...s, selected: !s.selected } : s));
  const removeSource = (id: string) => setSources(prev => prev.filter(s => s.id !== id));
  const toggleTool = (id: string) => setTools(prev => prev.map(t => t.id === id ? { ...t, checked: !t.checked } : t));

  /* ───── Web search ───── */
  const handleWebSearch = () => {
    if (!webSearchQuery.trim() || isSearching) return;
    setIsSearching(true);
    setSearchComplete(false);
    setSearchResults([]);
    setSearchProgress([]);
    const progressMsgs = searchDepth === "deep"
      ? ["正在分析搜索意图...", "正在搜索相关网页...", "正在深度解析内容...", "正在提取关键信息..."]
      : ["正在搜索相关网页...", "正在提取关键信息..."];
    let idx = 0;
    const interval = setInterval(() => {
      if (idx < progressMsgs.length) {
        setSearchProgress(prev => [...prev, progressMsgs[idx]]);
        idx++;
      } else {
        clearInterval(interval);
        setSearchResults(MOCK_SEARCH_RESULTS);
        setIsSearching(false);
        setSearchComplete(true);
      }
    }, searchDepth === "deep" ? 800 : 600);
  };

  const importSearchResults = () => {
    searchResults.forEach((result, i) => {
      setTimeout(() => {
        const newSource: Source = { id: `search-${Date.now()}-${i}`, name: result.title, type: "url", status: "analyzing", selected: true };
        setSources(prev => [...prev, newSource]);
        setTimeout(() => {
          setSources(prev => prev.map(s => s.id === newSource.id ? { ...s, status: "ready" } : s));
        }, 1500 + Math.random() * 1000);
      }, i * 200);
    });
    setSearchResults([]);
    setSearchComplete(false);
    setWebSearchQuery("");
  };

  const clearSearchResults = () => {
    setSearchResults([]);
    setSearchComplete(false);
    setSearchProgress([]);
  };

  /* ───── Deep structuring ───── */
  const enterStructuringMode = () => {
    setInitialDoc(GENERATED_DOC);
    setParagraphTools({});
    setDropHighlight(null);
    setAppMode("deep-structuring");
  };

  const addToolToParagraph = (paragraphIdx: number, toolId: string) => {
    setParagraphTools(prev => ({ ...prev, [paragraphIdx]: [toolId] }));
  };

  const TOOL_MOCK_RESULTS: Record<string, string> = {
    report: "## 结构化分析结果\n\n### 核心要点\n1. 研发效能提升关键在于自动化流水线建设\n2. 渐进式推进策略有效降低团队抵触\n3. 数据驱动优化确保改进点有据可依\n\n### 详细分析\n该段落涉及技术选型与流程重构两个维度...",
    mindmap: "🗺️ 思维导图\n\n├── 项目背景\n│   ├── 业务挑战\n│   │   ├── 交付周期长\n│   │   ├── 质量不稳定\n│   │   └── 协作低效\n│   └── 目标设定\n│       ├── 发布周期缩短30%\n│       └── 代码覆盖率80%+\n├── 解决方案\n│   ├── Jenkins + GitLab CI\n│   └── Scrum + Kanban\n└── 实施成果\n    ├── 发布周期↓40%\n    └── Bug修复↓75%",
    flashcard: "⚡ 知识闪卡\n\n【卡片1】渐进式迁移策略\nQ: 为什么选择渐进式而非一刀切？\nA: 避免团队抵触情绪，确保适应性和可持续性\n\n【卡片2】数据驱动优化\nQ: 如何确保改进有效？\nA: 每个改进点都有数据支撑，持续跟踪核心指标\n\n【卡片3】跨部门协作\nQ: 协作效率提升的关键？\nA: 明确接口人机制，缩短需求对齐周期",
    data: "📊 数据图表摘要\n\n| 指标 | 改进前 | 改进后 | 变化 |\n|------|--------|--------|------|\n| 发布周期 | 14天 | 8.4天 | ↓40% |\n| Bug修复时长 | 48h | 12h | ↓75% |\n| 代码覆盖率 | 45% | 82% | ↑82% |\n| 需求交付率 | 65% | 91% | ↑40% |\n| 满意度 | 35% | 78% | ↑123% |",
    audio: "🎙️ 音频概览脚本\n\n大家好，今天为大家分享Q3研发效能提升的核心经验。\n\n首先是背景：我们团队面临交付周期长、质量不稳定的挑战...\n\n关键举措包括引入CI/CD流水线和混合敏捷模式...\n\n最终成果：发布周期缩短40%，团队满意度翻倍。",
    video: "🎬 视频概览脚本\n\n[开场] 标题卡：Q3研发效能提升总结\n[场景1] 问题展示：72%开发者认为流程有瓶颈\n[场景2] 方案解析：Jenkins + GitLab CI 自动化\n[场景3] 成果数据：核心指标全面提升\n[结尾] 下一步：AI辅助代码审查",
  };

  const handleToolGenerate = (toolId: string) => {
    if (toolGenerating) return; // only one at a time
    const inputText = toolInputTexts[toolId];
    if (!inputText?.trim()) return;
    setToolGenerating(toolId);
    setToolGenProgress(0);
    let step = 0;
    const totalSteps = 15;
    const interval = setInterval(() => {
      step++;
      setToolGenProgress(Math.min((step / totalSteps) * 100, 100));
      if (step >= totalSteps) {
        clearInterval(interval);
        setToolResults(prev => ({ ...prev, [toolId]: TOOL_MOCK_RESULTS[toolId] || "生成完成的内容..." }));
        setToolGenerating(null);
        setToolGenProgress(0);
      }
    }, 200);
  };

  const handleSend = () => {
    if (!chatInput.trim() || isAiTyping) return;
    setChatMessages(prev => [...prev, { id: Date.now().toString(), role: "user", content: chatInput }]);
    setChatInput("");
    setIsAiTyping(true);
    setTimeout(() => {
      let response: string;
      if (extractMode === "deep") {
        response = SOCRATIC_RESPONSES[socraticIndex % SOCRATIC_RESPONSES.length];
        setSocraticIndex(prev => prev + 1);
        response += "\n\n> 💡 你的每一次回答都在帮助我构建更完整的知识体系。";
      } else {
        response = QUICK_RESPONSES[quickIndex % QUICK_RESPONSES.length];
        setQuickIndex(prev => prev + 1);
      }
      setChatMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: "assistant", content: response }]);
      setIsAiTyping(false);
    }, 1500);
  };

  const handleSuggestionClick = (text: string) => {
    setChatInput(text);
    setTimeout(() => {
      setChatMessages(prev => [...prev, { id: Date.now().toString(), role: "user", content: text }]);
      setChatInput("");
      setIsAiTyping(true);
      setTimeout(() => {
        const deepMap: Record<string, string> = {
          "继续追问我": "好的，让我继续挖掘。\n\n你在刚才提到了团队协作——**你认为跨部门沟通中最容易被忽视的环节是什么？**",
          "总结我的隐性知识": "## 🧠 隐性知识萃取总结\n\n1. **决策直觉**：倾向于「先小范围试点，再逐步推广」\n2. **团队管理**：「数据说话」比「行政命令」更能推动变革\n3. **风险感知**：能提前识别软性风险并渐进式化解\n4. **方法论迁移**：善于将成功经验抽象后跨场景应用\n\n> 准备好后可以选择工具并开始生成文档。",
        };
        const quickMap: Record<string, string> = {
          "帮我提炼核心观点": "## 📌 核心观点\n\n1. DevOps 流水线是效能提升的关键基础设施\n2. 渐进式推进比一刀切更适合组织变革\n3. 数据驱动是持续优化的核心方法论\n4. 跨部门协作需要明确的机制保障\n\n准备好后请选择右侧工具并点击生成。",
          "补充背景信息": "好的，请告诉我更多关于项目的背景信息。",
        };
        const map = extractMode === "deep" ? deepMap : quickMap;
        const response = map[text] || (extractMode === "deep" ? SOCRATIC_RESPONSES[socraticIndex % SOCRATIC_RESPONSES.length] : QUICK_RESPONSES[quickIndex % QUICK_RESPONSES.length]);
        setChatMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: "assistant", content: response }]);
        setIsAiTyping(false);
      }, 1500);
    }, 100);
  };

  /* ───── Generation ───── */
  const startGeneration = () => {
    setAppMode("generating");
    setGeneratingProgress(0);
    const template = OUTPUT_TEMPLATES.find(t => t.id === selectedTemplate);
    const totalSteps = (template?.preview.length || 5) * 3;
    let step = 0;
    const interval = setInterval(() => {
      step++;
      setGeneratingProgress(Math.min((step / totalSteps) * 100, 100));
      if (step >= totalSteps) {
        clearInterval(interval);
        setTimeout(() => setAppMode("result"), 600);
      }
    }, 350);
  };

  const selectedCount = sources.filter(s => s.selected).length;
  const checkedTools = tools.filter(t => t.checked);
  const readySources = sources.filter(s => s.status === "ready");
  const analyzingSources = sources.filter(s => s.status === "analyzing");
  const currentTemplate = OUTPUT_TEMPLATES.find(t => t.id === selectedTemplate);

  const typeStats = sources.reduce((acc, s) => {
    acc[s.type] = (acc[s.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  /* ═══════ RENDER ═══════ */

  // ───── Step 0: Mode Selection ─────
  if (appMode === "select") {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-[calc(100vh-56px)] bg-background">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-2xl px-6">
            <div className="text-center mb-10">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring", stiffness: 200 }} className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
                <Sparkles className="w-8 h-8 text-primary" />
              </motion.div>
              <h1 className="text-2xl font-bold text-foreground mb-2">开始知识萃取</h1>
              <p className="text-muted-foreground">选择萃取模式，开启你的知识沉淀之旅</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <motion.button initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }} onClick={() => enterWorkspace("quick")}
                className="group relative p-6 rounded-2xl border-2 border-border bg-card text-left hover:border-primary/50 hover:shadow-lg transition-all">
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <FileUp className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-1.5">快速提炼</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">多模态上传资料，选择输出模板，一键生成知识文档</p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {["文档", "图片", "音视频", "网页"].map(t => (
                    <span key={t} className="px-2 py-0.5 rounded-md bg-accent text-xs text-muted-foreground">{t}</span>
                  ))}
                </div>
                <ArrowRight className="absolute right-5 top-6 w-5 h-5 text-muted-foreground/30 group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </motion.button>
              <motion.button initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }} onClick={() => enterWorkspace("deep")}
                className="group relative p-6 rounded-2xl border-2 border-border bg-card text-left hover:border-primary/50 hover:shadow-lg transition-all">
                <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <MessageSquare className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-1.5">深度萃取</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">AI 苏格拉底式追问，深度挖掘你的隐性知识与经验</p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {["深度追问", "隐性知识", "经验萃取"].map(t => (
                    <span key={t} className="px-2 py-0.5 rounded-md bg-accent text-xs text-muted-foreground">{t}</span>
                  ))}
                </div>
                <ArrowRight className="absolute right-5 top-6 w-5 h-5 text-muted-foreground/30 group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </AppLayout>
    );
  }

  /* ───── Step indicator component ───── */
  const StepIndicator = ({ current }: { current: number }) => {
    const steps = [
      { n: 1, label: "上传资料" },
      { n: 2, label: "选择模板" },
      { n: 3, label: "生成预览" },
    ];
    return (
      <div className="flex items-center gap-2">
        {steps.map((step, i) => (
          <div key={step.n} className="flex items-center gap-2">
            {i > 0 && <div className={`w-8 h-px ${step.n <= current ? "bg-primary" : "bg-border"}`} />}
            <div className="flex items-center gap-1.5">
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${
                step.n < current ? "bg-primary/20 text-primary" :
                step.n === current ? "bg-primary text-primary-foreground" : "bg-accent text-muted-foreground"
              }`}>
                {step.n < current ? "✓" : step.n}
              </span>
              <span className={`text-xs font-medium ${step.n <= current ? "text-foreground" : "text-muted-foreground"}`}>{step.label}</span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // ───── Quick Step 1: Multi-Modal Upload ─────
  if (appMode === "quick-upload") {
    const handleTypeClick = (opt: { type: string; comingSoon?: boolean; label: string }) => {
      if ((opt as any).comingSoon) return;
      if (opt.type === "url") {
        setActiveUploadType(activeUploadType === "url" ? null : "url");
      } else if (opt.type === "text") {
        setActiveUploadType(activeUploadType === "text" ? null : "text");
      } else {
        const names: Record<string, string> = {
          file: `文档_${sources.length + 1}.pdf`,
          image: `截图_${sources.length + 1}.png`,
          audio: `会议录音_${sources.length + 1}.mp3`,
          video: `培训视频_${sources.length + 1}.mp4`,
        };
        quickAddSource(opt.type as Source["type"], names[opt.type] || `${opt.label}_${sources.length + 1}`);
      }
    };

    return (
      <AppLayout>
        <div className="flex flex-col h-[calc(100vh-56px)] bg-background">
          {/* Header - compact */}
          <div className="px-6 pt-4 pb-3 border-b border-border">
            <div className="flex items-center gap-3 mb-3">
              <button onClick={() => setAppMode("select")} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
                <ChevronLeft className="w-4 h-4" /> 返回
              </button>
              <StepIndicator current={1} />
            </div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className="text-lg font-bold text-foreground">上传你的知识资料</h1>
            </motion.div>
          </div>

          {/* Main content - two column layout */}
          <div className="flex-1 overflow-hidden flex">
            {/* Left: Upload options - all visible without scroll */}
            <div className="flex-1 overflow-y-auto border-r border-border">
              <div className="px-5 py-4 space-y-3">

                {/* ── 本地文件 ── */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Monitor className="w-3.5 h-3.5 text-primary" />
                    <h2 className="text-xs font-semibold text-foreground">本地文件</h2>
                    <div className="flex-1 h-px bg-border" />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {LOCAL_UPLOAD_TYPES.map((opt, i) => (
                      <motion.button
                        key={opt.label}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.05 + i * 0.02 }}
                        whileHover={{ scale: 1.03, y: -1 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => handleTypeClick(opt)}
                        className="group relative p-2.5 rounded-lg border border-border bg-card hover:border-primary/40 hover:shadow-sm transition-all text-left"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <div className={`w-6 h-6 rounded-md bg-gradient-to-br ${opt.gradient} flex items-center justify-center shrink-0 shadow-sm`}>
                            <opt.icon className="w-3 h-3 text-white" />
                          </div>
                          <span className="text-[11px] font-medium text-foreground truncate">{opt.label}</span>
                        </div>
                        <p className="text-[9px] text-muted-foreground leading-tight line-clamp-2">{opt.desc}</p>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Drop zone - compact */}
                <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
                  onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                  onDragLeave={() => setIsDragOver(false)}
                  onDrop={(e) => { e.preventDefault(); setIsDragOver(false); quickAddSource("file", `拖放文件_${sources.length + 1}.pdf`); }}
                  className={`relative border border-dashed rounded-lg px-4 py-3 text-center transition-all cursor-pointer ${
                    isDragOver ? "border-primary bg-primary/5" : "border-border hover:border-primary/30 hover:bg-accent/20"
                  }`}
                >
                  <AnimatePresence>
                    {isDragOver && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 rounded-lg bg-primary/10 flex items-center justify-center z-10">
                        <Upload className="w-8 h-8 text-primary animate-bounce" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <div className="flex items-center justify-center gap-2">
                    <Upload className="w-4 h-4 text-muted-foreground/50" />
                    <span className="text-[11px] text-muted-foreground">拖动文件至此处，或点击上方类型按钮上传</span>
                  </div>
                </motion.div>

                {/* ── 在线资源 ── */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Cloud className="w-3.5 h-3.5 text-cyan-600" />
                    <h2 className="text-xs font-semibold text-foreground">在线资源</h2>
                    <div className="flex-1 h-px bg-border" />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {ONLINE_UPLOAD_TYPES.map((opt, i) => (
                      <motion.button
                        key={opt.label}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 + i * 0.02 }}
                        whileHover={{ scale: 1.03, y: -1 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => handleTypeClick(opt)}
                        className="group relative p-2.5 rounded-lg border border-border bg-card hover:border-primary/40 hover:shadow-sm transition-all text-left"
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <div className={`w-6 h-6 rounded-md bg-gradient-to-br ${opt.gradient} flex items-center justify-center shrink-0 shadow-sm`}>
                            <opt.icon className="w-3 h-3 text-white" />
                          </div>
                          <span className="text-[11px] font-medium text-foreground truncate">{opt.label}</span>
                        </div>
                        <p className="text-[9px] text-muted-foreground leading-tight line-clamp-2">{opt.desc}</p>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* URL input area */}
                <AnimatePresence>
                  {activeUploadType === "url" && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                      <div className="p-3 rounded-lg border border-primary/20 bg-primary/5 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-medium text-foreground flex items-center gap-1.5">
                            <Globe className="w-3 h-3 text-primary" /> 输入链接
                          </span>
                          <button onClick={() => setActiveUploadType(null)} className="p-0.5 rounded hover:bg-accent"><X className="w-3 h-3 text-muted-foreground" /></button>
                        </div>
                        <textarea
                          placeholder={"每行一条 URL\nhttps://example.com/article"}
                          className="w-full h-16 px-3 py-2 rounded-md border border-border bg-background text-[11px] outline-none focus:border-primary/50 resize-none"
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey && (e.target as HTMLTextAreaElement).value.trim()) {
                              e.preventDefault();
                              const urls = (e.target as HTMLTextAreaElement).value.split("\n").filter(u => u.trim());
                              urls.forEach(url => quickAddSource("url", url.trim()));
                              (e.target as HTMLTextAreaElement).value = "";
                            }
                          }}
                        />
                        <div className="flex items-center justify-end">
                          <button onClick={() => quickAddSource("url", "https://wiki.company.com/article")} className="px-3 py-1 rounded-md bg-primary text-primary-foreground text-[11px] hover:bg-primary/90 transition-colors">添加</button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Right: Added files */}
            <div className="w-[360px] shrink-0 overflow-y-auto flex flex-col">
              <div className="px-5 py-4 border-b border-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-foreground">已添加资料</span>
                    <span className="px-1.5 py-0.5 rounded-md bg-primary/10 text-primary text-[10px] font-medium">{sources.length}</span>
                  </div>
                  {Object.keys(typeStats).length > 0 && (
                    <div className="flex items-center gap-1">
                      {Object.entries(typeStats).map(([type, count]) => {
                        const Icon = FILE_TYPE_ICON[type] || File;
                        const colorClass = FILE_TYPE_COLOR[type] || "text-muted-foreground bg-accent";
                        return <span key={type} className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-medium ${colorClass}`}><Icon className="w-2.5 h-2.5" />{count}</span>;
                      })}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto px-3 py-3">
                {sources.length === 0 ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center h-full text-center px-6">
                    <div className="w-12 h-12 rounded-2xl bg-accent flex items-center justify-center mb-3">
                      <Layers className="w-5 h-5 text-muted-foreground/40" />
                    </div>
                    <p className="text-xs text-muted-foreground">从左侧选择类型</p>
                    <p className="text-xs text-muted-foreground">添加你的知识资料</p>
                  </motion.div>
                ) : (
                  <div className="space-y-1">
                    <AnimatePresence>
                      {sources.map((s, i) => {
                        const Icon = FILE_TYPE_ICON[s.type] || File;
                        const colorClass = FILE_TYPE_COLOR[s.type] || "text-muted-foreground bg-accent";
                        return (
                          <motion.div key={s.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20, height: 0 }} transition={{ delay: i * 0.02 }}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-lg border border-transparent bg-card group hover:border-primary/10 hover:bg-accent/30 transition-all">
                            <div className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 ${colorClass}`}><Icon className="w-3 h-3" /></div>
                            <div className="flex-1 min-w-0">
                              <span className="text-xs text-foreground truncate block">{s.name}</span>
                              {s.size && <span className="text-[10px] text-muted-foreground">{s.size}</span>}
                            </div>
                            <span className="shrink-0">
                              {s.status === "analyzing" ? (
                                <Loader2 className="w-3 h-3 text-primary animate-spin" />
                              ) : (
                                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}>
                                  <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                                </motion.span>
                              )}
                            </span>
                            <button onClick={() => removeSource(s.id)} className="p-0.5 rounded opacity-0 group-hover:opacity-100 hover:bg-accent text-muted-foreground transition-all"><X className="w-3 h-3" /></button>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bottom action bar */}
          <div className="px-8 py-3.5 border-t border-border bg-card/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span>{readySources.length} 个文件已就绪</span>
                {analyzingSources.length > 0 && (
                  <span className="flex items-center gap-1 text-primary"><Loader2 className="w-3 h-3 animate-spin" />{analyzingSources.length} 个解析中</span>
                )}
              </div>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={() => setAppMode("quick-template")}
                disabled={readySources.length === 0}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-all shadow-sm disabled:opacity-50 group">
                下一步：选择模板 <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </motion.button>
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  // ───── Quick Step 2: Template Selection ─────
  if (appMode === "quick-template") {
    return (
      <AppLayout>
        <div className="flex flex-col h-[calc(100vh-56px)] bg-background">
          {/* Header */}
          <div className="px-8 pt-6 pb-4 border-b border-border">
            <div className="flex items-center gap-3 mb-5">
              <button onClick={() => setAppMode("quick-upload")} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
                <ChevronLeft className="w-4 h-4" /> 返回
              </button>
              <StepIndicator current={2} />
            </div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className="text-xl font-bold text-foreground mb-1">选择输出模板</h1>
              <p className="text-sm text-muted-foreground">选择一个常用模板，AI 将基于你的 {sources.length} 份资料生成对应格式的知识文档</p>
            </motion.div>
          </div>

          {/* Main content */}
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-4xl mx-auto px-8 py-6">
              {/* Source summary bar */}
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 mb-6 p-3 rounded-xl border border-border bg-card">
                <Layers className="w-4 h-4 text-primary shrink-0" />
                <span className="text-sm text-foreground font-medium">已上传 {sources.length} 份资料</span>
                <div className="flex items-center gap-1.5 ml-auto">
                  {Object.entries(typeStats).map(([type, count]) => {
                    const Icon = FILE_TYPE_ICON[type] || File;
                    const colorClass = FILE_TYPE_COLOR[type] || "text-muted-foreground bg-accent";
                    return <span key={type} className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium ${colorClass}`}><Icon className="w-3 h-3" />{count}</span>;
                  })}
                </div>
              </motion.div>

              {/* Template grid */}
              <div className="grid grid-cols-2 gap-4">
                {OUTPUT_TEMPLATES.map((tpl, i) => {
                  const isSelected = selectedTemplate === tpl.id;
                  return (
                    <motion.button
                      key={tpl.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + i * 0.06 }}
                      whileHover={{ scale: 1.01, y: -2 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => setSelectedTemplate(isSelected ? null : tpl.id)}
                      className={`relative text-left p-5 rounded-2xl border-2 transition-all ${
                        isSelected
                          ? "border-primary shadow-lg shadow-primary/10 bg-card"
                          : "border-border bg-card hover:border-primary/30 hover:shadow-md"
                      }`}
                    >
                      {/* Selected check */}
                      {isSelected && (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 300 }}
                          className="absolute top-4 right-4 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                          <Check className="w-3.5 h-3.5 text-primary-foreground" />
                        </motion.div>
                      )}

                      {/* Icon + Title */}
                      <div className="flex items-start gap-3 mb-3">
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${tpl.gradient} flex items-center justify-center shrink-0`}>
                          <tpl.icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-sm font-semibold text-foreground">{tpl.label}</h3>
                          <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{tpl.desc}</p>
                        </div>
                      </div>

                      {/* Preview structure */}
                      <div className={`rounded-xl p-3 space-y-1.5 transition-colors ${isSelected ? tpl.color : "bg-accent/50"}`}>
                        {tpl.preview.map((item, j) => (
                          <motion.div
                            key={j}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 + i * 0.06 + j * 0.04 }}
                            className="flex items-center gap-2"
                          >
                            <div className={`w-1 h-1 rounded-full ${isSelected ? "bg-primary" : "bg-muted-foreground/30"}`} />
                            <span className="text-[11px] text-muted-foreground">{item}</span>
                          </motion.div>
                        ))}
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              {/* Title input - appears when template selected */}
              <AnimatePresence>
                {selectedTemplate && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden mt-6"
                  >
                    <div className="p-5 rounded-2xl border border-border bg-card space-y-3">
                      <div className="flex items-center gap-2">
                        <PenTool className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium text-foreground">为文档命名（可选）</span>
                      </div>
                      <input
                        value={quickTitle}
                        onChange={(e) => setQuickTitle(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground text-sm outline-none focus:border-primary/50 transition-colors"
                        placeholder="AI 将根据内容自动生成标题，你也可以自定义..."
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Bottom action bar */}
          <div className="px-8 py-4 border-t border-border bg-card/50">
            <div className="max-w-4xl mx-auto flex items-center justify-between">
              <button onClick={() => setAppMode("quick-upload")} className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
                <ChevronLeft className="w-4 h-4" /> 上一步
              </button>
              <div className="flex items-center gap-3">
                {selectedTemplate && currentTemplate && (
                  <motion.span initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <currentTemplate.icon className="w-3.5 h-3.5 text-primary" />
                    已选：{currentTemplate.label}
                  </motion.span>
                )}
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={startGeneration}
                  disabled={!selectedTemplate}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-all shadow-md disabled:opacity-50">
                  <Wand2 className="w-4 h-4" /> 确认生成
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  // ───── Generating ─────
  if (appMode === "generating") {
    const steps = currentTemplate?.preview || ["📋 分析内容", "🧠 提炼知识", "📝 生成文档"];
    const currentStepIdx = Math.floor((generatingProgress / 100) * steps.length);
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-[calc(100vh-56px)] bg-background">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-lg text-center px-6">
            {/* Animated icon */}
            <div className="relative w-28 h-28 mx-auto mb-8">
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }} className="absolute inset-0">
                {sources.slice(0, 5).map((s, i) => {
                  const Icon = FILE_TYPE_ICON[s.type] || File;
                  const angle = (i / Math.min(sources.length, 5)) * Math.PI * 2;
                  return (
                    <motion.div key={s.id} className="absolute w-8 h-8 rounded-lg bg-accent flex items-center justify-center shadow-sm"
                      style={{ top: `${50 + 42 * Math.sin(angle)}%`, left: `${50 + 42 * Math.cos(angle)}%`, transform: "translate(-50%, -50%)" }}>
                      <Icon className="w-4 h-4 text-primary" />
                    </motion.div>
                  );
                })}
              </motion.div>
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div animate={{ scale: [1, 1.12, 1] }} transition={{ duration: 2, repeat: Infinity }} className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center shadow-inner">
                  <Wand2 className="w-7 h-7 text-primary" />
                </motion.div>
              </div>
            </div>

            <h2 className="text-xl font-bold text-foreground mb-2">AI 正在生成{currentTemplate?.label || "文档"}</h2>
            <p className="text-sm text-muted-foreground mb-8">基于 {sources.length} 份资料，使用「{currentTemplate?.label}」模板生成中...</p>

            <div className="w-full h-2.5 rounded-full bg-accent overflow-hidden mb-6">
              <motion.div className="h-full rounded-full bg-gradient-to-r from-primary to-primary/70" initial={{ width: "0%" }} animate={{ width: `${generatingProgress}%` }} transition={{ duration: 0.3 }} />
            </div>

            <div className="space-y-2">
              {steps.map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0.3 }}
                  animate={{
                    opacity: i <= currentStepIdx ? 1 : 0.3,
                    x: i === currentStepIdx ? [0, 3, 0] : 0,
                  }}
                  transition={i === currentStepIdx ? { x: { duration: 1, repeat: Infinity } } : {}}
                  className="flex items-center gap-2 justify-center"
                >
                  {i < currentStepIdx ? (
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                  ) : i === currentStepIdx ? (
                    <Loader2 className="w-4 h-4 text-primary animate-spin" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border-2 border-muted-foreground/20" />
                  )}
                  <span className={`text-sm ${i <= currentStepIdx ? "text-foreground" : "text-muted-foreground"}`}>{step}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </AppLayout>
    );
  }

  // ───── Deep Step Indicator ─────
  const DeepStepIndicator = ({ current }: { current: number }) => {
    const steps = [
      { n: 1, label: "知识发现" },
      { n: 2, label: "结构化处理" },
      { n: 3, label: "生成预览" },
    ];
    return (
      <div className="flex items-center gap-2">
        {steps.map((step, i) => (
          <div key={step.n} className="flex items-center gap-2">
            {i > 0 && <div className={`w-8 h-px ${step.n <= current ? "bg-primary" : "bg-border"}`} />}
            <div className="flex items-center gap-1.5">
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${
                step.n < current ? "bg-primary/20 text-primary" :
                step.n === current ? "bg-primary text-primary-foreground" : "bg-accent text-muted-foreground"
              }`}>
                {step.n < current ? "✓" : step.n}
              </span>
              <span className={`text-xs font-medium ${step.n <= current ? "text-foreground" : "text-muted-foreground"}`}>{step.label}</span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  if (appMode === "result") {
    return (
      <AppLayout>
        <div className="flex flex-col h-[calc(100vh-56px)] bg-background">
          {/* Top bar */}
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between px-6 py-3 border-b border-border bg-card/80 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <button onClick={() => extractMode === "deep" ? setAppMode("deep-structuring") : setAppMode("quick-template")} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
                <ChevronLeft className="w-4 h-4" /> 返回
              </button>
              {extractMode === "quick" && <><div className="h-5 w-px bg-border" /><StepIndicator current={3} /></>}
              {extractMode === "deep" && <><div className="h-5 w-px bg-border" /><DeepStepIndicator current={3} /></>}
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setIsEditing(!isEditing)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors ${isEditing ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-accent"}`}>
                <Edit3 className="w-3.5 h-3.5" />{isEditing ? "预览" : "编辑"}
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
                <Save className="w-3.5 h-3.5" /> 保存草稿
              </button>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={() => setShowPublishDialog(true)}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 shadow-sm transition-colors">
                <CheckCircle2 className="w-3.5 h-3.5" /> 确认发布
              </motion.button>
            </div>
          </motion.div>

          {/* Document preview */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex-1 overflow-y-auto">
            <div className="max-w-3xl mx-auto py-8 px-6">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
                className="flex items-center gap-3 mb-6">
                {currentTemplate && (
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium ${currentTemplate.color}`}>
                    <currentTemplate.icon className="w-3.5 h-3.5" />{currentTemplate.label}
                  </span>
                )}
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-accent text-xs text-muted-foreground">
                  <Layers className="w-3 h-3" />基于 {sources.length} 份资料生成
                </span>
              </motion.div>

              {isEditing ? (
                <textarea value={resultContent} onChange={(e) => setResultContent(e.target.value)}
                  className="w-full min-h-[70vh] bg-transparent text-sm text-foreground leading-relaxed outline-none resize-none font-mono" />
              ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="space-y-1">
                  {resultContent.split("\n").map((line, i) => {
                    if (line.startsWith("# ")) return <h1 key={i} className="text-2xl font-bold text-foreground mt-8 mb-4">{line.slice(2)}</h1>;
                    if (line.startsWith("## ")) return <h2 key={i} className="text-xl font-semibold text-foreground mt-6 mb-3">{line.slice(3)}</h2>;
                    if (line.startsWith("### ")) return <h3 key={i} className="text-base font-medium text-foreground mt-4 mb-2">{line.slice(4)}</h3>;
                    if (line.startsWith("---")) return <hr key={i} className="border-border my-6" />;
                    if (line.startsWith("- ")) return <li key={i} className="text-sm text-foreground ml-4 mb-1.5 list-disc">{line.slice(2)}</li>;
                    if (line.startsWith("> ")) return <blockquote key={i} className="text-sm text-muted-foreground border-l-2 border-primary/30 pl-3 my-1 italic">{line.slice(2)}</blockquote>;
                    if (line.startsWith("```")) return <div key={i} className="text-xs text-muted-foreground font-mono" />;
                    if (line.startsWith("|")) return <p key={i} className="text-sm text-foreground font-mono bg-accent/50 px-3 py-1 rounded">{line}</p>;
                    if (line.startsWith("**") && line.includes("**")) return <p key={i} className="text-sm font-semibold text-foreground mb-1">{line.replace(/\*\*/g, "")}</p>;
                    if (line.trim() === "") return <div key={i} className="h-2" />;
                    return <p key={i} className="text-sm text-foreground leading-relaxed">{line}</p>;
                  })}
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* ═══ Publish Dialog ═══ */}
          <AnimatePresence>
            {showPublishDialog && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40" onClick={() => { setShowPublishDialog(false); setPublishTarget(null); setPublishSubmitted(false); }}>
                <motion.div initial={{ opacity: 0, scale: 0.95, y: 12 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 12 }}
                  className="w-full max-w-lg bg-card rounded-2xl shadow-2xl border border-border overflow-hidden" onClick={(e) => e.stopPropagation()}>

                  {!publishSubmitted ? (
                    <>
                      <div className="relative px-8 pt-8 pb-4 text-center">
                        <button onClick={() => { setShowPublishDialog(false); setPublishTarget(null); }} className="absolute right-4 top-4 p-1.5 rounded-lg hover:bg-accent text-muted-foreground transition-colors"><X className="w-5 h-5" /></button>
                        <h2 className="text-xl font-semibold text-foreground">选择发布位置</h2>
                        <p className="text-sm text-muted-foreground mt-1">你的知识文档将发布到选定的位置</p>
                      </div>
                      <div className="px-8 pb-6 grid grid-cols-2 gap-4">
                        {/* Personal Zone */}
                        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                          onClick={() => setPublishTarget("personal")}
                          className={`relative text-left p-5 rounded-2xl border-2 transition-all ${
                            publishTarget === "personal" ? "border-primary shadow-lg bg-primary/5" : "border-border hover:border-primary/30"
                          }`}>
                          {publishTarget === "personal" && (
                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-3 right-3 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                              <Check className="w-3 h-3 text-primary-foreground" />
                            </motion.div>
                          )}
                          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center mb-3">
                            <Lock className="w-5 h-5 text-blue-600" />
                          </div>
                          <h3 className="text-sm font-semibold text-foreground mb-1">个人专区</h3>
                          <p className="text-xs text-muted-foreground leading-relaxed">发布到个人知识库，作为私人智库沉淀</p>
                          <div className="mt-3 flex items-center gap-1.5 text-[10px] text-emerald-600">
                            <CheckCircle2 className="w-3 h-3" /> 无需审批，即时发布
                          </div>
                        </motion.button>

                        {/* BG/BU */}
                        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                          onClick={() => setPublishTarget("bgbu")}
                          className={`relative text-left p-5 rounded-2xl border-2 transition-all ${
                            publishTarget === "bgbu" ? "border-primary shadow-lg bg-primary/5" : "border-border hover:border-primary/30"
                          }`}>
                          {publishTarget === "bgbu" && (
                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-3 right-3 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                              <Check className="w-3 h-3 text-primary-foreground" />
                            </motion.div>
                          )}
                          <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center mb-3">
                            <Building2 className="w-5 h-5 text-purple-600" />
                          </div>
                          <h3 className="text-sm font-semibold text-foreground mb-1">BG/BU 专区</h3>
                          <p className="text-xs text-muted-foreground leading-relaxed">发布到部门知识库，共享给团队成员</p>
                          <div className="mt-3 flex items-center gap-1.5 text-[10px] text-amber-600">
                            <Shield className="w-3 h-3" /> 需要审批流程
                          </div>
                        </motion.button>
                      </div>

                      {/* Approval info for BG/BU */}
                      <AnimatePresence>
                        {publishTarget === "bgbu" && (
                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                            className="px-8 pb-4 overflow-hidden">
                            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
                              <div className="flex items-center gap-2 mb-3">
                                <Shield className="w-4 h-4 text-amber-600" />
                                <span className="text-xs font-semibold text-amber-800">审批流程</span>
                              </div>
                              <div className="space-y-2.5">
                                <div className="flex items-center gap-3">
                                  <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center text-[10px] font-bold text-amber-700">1</div>
                                  <div className="flex items-center gap-2">
                                    <UserCheck className="w-3.5 h-3.5 text-amber-600" />
                                    <span className="text-xs text-amber-800">直属上级审批</span>
                                  </div>
                                </div>
                                <div className="ml-3 w-px h-3 bg-amber-300" />
                                <div className="flex items-center gap-3">
                                  <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center text-[10px] font-bold text-amber-700">2</div>
                                  <div className="flex items-center gap-2">
                                    <Users className="w-3.5 h-3.5 text-amber-600" />
                                    <span className="text-xs text-amber-800">BG/BU 专区管理员审批</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <div className="px-8 pb-8">
                        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                          disabled={!publishTarget}
                          onClick={() => setPublishSubmitted(true)}
                          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 shadow-md disabled:opacity-40 transition-all">
                          {publishTarget === "bgbu" ? (
                            <><Shield className="w-4 h-4" /> 提交审批</>
                          ) : (
                            <><CheckCircle2 className="w-4 h-4" /> 立即发布</>
                          )}
                        </motion.button>
                      </div>
                    </>
                  ) : (
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="px-8 py-12 text-center">
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200 }}
                        className={`w-16 h-16 rounded-2xl mx-auto mb-5 flex items-center justify-center ${publishTarget === "personal" ? "bg-emerald-100" : "bg-amber-100"}`}>
                        {publishTarget === "personal"
                          ? <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                          : <Shield className="w-8 h-8 text-amber-600" />
                        }
                      </motion.div>
                      <h3 className="text-lg font-bold text-foreground mb-2">
                        {publishTarget === "personal" ? "发布成功！" : "已提交审批！"}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-6">
                        {publishTarget === "personal"
                          ? "知识文档已发布到你的个人专区"
                          : "审批请求已发送给直属上级和 BG/BU 管理员，审批通过后将自动发布"
                        }
                      </p>
                      <button onClick={() => { setShowPublishDialog(false); setPublishTarget(null); setPublishSubmitted(false); setAppMode("select"); }}
                        className="px-6 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
                        返回首页
                      </button>
                    </motion.div>
                  )}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </AppLayout>
    );
  }

  // ───── Deep Structuring Mode ─────
  if (appMode === "deep-structuring") {
    const paragraphs = initialDoc.split("\n\n").filter(p => p.trim());
    return (
      <AppLayout>
        <div className="flex flex-col h-[calc(100vh-56px)]">
          {/* Header with step indicator */}
          <div className="px-6 pt-4 pb-3 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => setAppMode("workspace")} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
                <ChevronLeft className="w-4 h-4" /> 返回
              </button>
              <DeepStepIndicator current={2} />
            </div>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={startGeneration}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 shadow-md">
              <Wand2 className="w-4 h-4" /> 最终生成
            </motion.button>
          </div>

          <div className="flex flex-1 overflow-hidden">
            {/* Left: Word-style document */}
            <div className="flex-1 overflow-y-auto">
              <div className="max-w-3xl mx-auto py-8 px-10">
                {paragraphs.map((para, idx) => {
                  const assignedToolIds = paragraphTools[idx] || [];
                  const assignedTool = assignedToolIds.length > 0 ? tools.find(t => t.id === assignedToolIds[0]) : null;
                  const isHighlighted = dropHighlight === idx;
                  return (
                    <div
                      key={idx}
                      onDragOver={(e) => { e.preventDefault(); setDropHighlight(idx); }}
                      onDragLeave={() => setDropHighlight(null)}
                      onDrop={(e) => {
                        e.preventDefault();
                        setDropHighlight(null);
                        const toolId = e.dataTransfer.getData("toolId");
                        if (toolId) addToolToParagraph(idx, toolId);
                      }}
                      className={`py-2 transition-all ${isHighlighted ? "bg-primary/5 border-b-2 border-dashed border-primary" : "border-b border-transparent"}`}
                    >
                      <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{para}</p>
                      {assignedTool && (
                        <motion.span
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium mt-1.5 border ${assignedTool.color}`}
                        >
                          <assignedTool.icon className="w-3 h-3" />
                          {assignedTool.label}
                          <button
                            onClick={() => setParagraphTools(prev => { const next = { ...prev }; delete next[idx]; return next; })}
                            className="ml-0.5 p-0.5 rounded-full hover:bg-foreground/10 transition-colors"
                          >
                            <X className="w-2.5 h-2.5" />
                          </button>
                        </motion.span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right: Draggable tools */}
            <aside className="w-[260px] shrink-0 border-l border-border flex flex-col bg-muted/30">
              <div className="px-4 pt-4 pb-3 border-b border-border">
                <h3 className="font-semibold text-sm text-foreground">结构化工具</h3>
                <p className="text-xs text-muted-foreground mt-1">拖拽到左侧段落，添加结构化标签</p>
              </div>
              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {tools.map((tool) => (
                  <div
                    key={tool.id}
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData("toolId", tool.id);
                      e.dataTransfer.effectAllowed = "copy";
                      setDraggedTool(tool.id);
                    }}
                    onDragEnd={() => { setDraggedTool(null); setDropHighlight(null); }}
                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-grab active:cursor-grabbing transition-all ${
                      draggedTool === tool.id ? "opacity-40 border-primary scale-95" : `${tool.color} hover:shadow-md hover:scale-[1.02]`
                    }`}
                  >
                    <GripVertical className="w-3.5 h-3.5 text-muted-foreground/40 shrink-0" />
                    <tool.icon className="w-4 h-4 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-medium block">{tool.label}</span>
                      <span className="text-[10px] text-muted-foreground">{tool.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </div>
      </AppLayout>
    );
  }

  // ───── Deep mode: Workspace (2-column: sources + chat) ─────
  const suggestions = extractMode === "deep"
    ? [{ emoji: "🧠", text: "继续追问我" }, { emoji: "📝", text: "总结我的隐性知识" }]
    : [{ emoji: "📌", text: "帮我提炼核心观点" }, { emoji: "💬", text: "补充背景信息" }];

  return (
    <AppLayout>
      <div className="flex flex-col h-[calc(100vh-56px)] relative">
        {/* ═══ Top: Step indicator + back ═══ */}
        <div className="px-6 py-3 border-b border-border flex items-center gap-3 bg-card/80 backdrop-blur-sm shrink-0">
          <button onClick={() => { setAppMode("select"); setChatMessages([]); }} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
            <ChevronLeft className="w-4 h-4" /> 返回
          </button>
          <div className="h-5 w-px bg-border" />
          <DeepStepIndicator current={1} />
        </div>

        <div className="flex flex-1 overflow-hidden relative">
        {/* ═══ Left: Sources + Search ═══ */}
        <aside className="w-[300px] shrink-0 border-r border-border flex flex-col bg-muted/30">
          <div className="px-4 pt-4 pb-3">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-sm text-foreground">来源</h3>
                <span className="px-1.5 py-0.5 rounded bg-accent text-xs text-muted-foreground">{sources.length}</span>
              </div>
              <button onClick={() => setShowAddSource(true)} className="p-1.5 rounded-lg hover:bg-accent text-muted-foreground hover:text-primary transition-colors"><Plus className="w-4 h-4" /></button>
            </div>

            {/* ── Enhanced search box ── */}
            <div className="rounded-xl border border-border bg-card shadow-sm">
              <div className="flex items-center gap-2 px-3 py-2.5">
                <Search className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                <input
                  value={webSearchQuery}
                  onChange={(e) => setWebSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleWebSearch()}
                  placeholder="搜索知识来源..."
                  className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
                />
                <button onClick={handleWebSearch} disabled={isSearching || !webSearchQuery.trim()}
                  className="p-1.5 rounded-full bg-primary/10 hover:bg-primary/20 text-primary transition-colors disabled:opacity-30">
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="flex items-center gap-2 px-3 pb-2.5">
                <div className="relative">
                  <button onClick={() => { setShowScopeDropdown(!showScopeDropdown); setShowDepthDropdown(false); }}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-accent text-xs text-muted-foreground hover:text-foreground transition-colors">
                    {searchScope === "web" ? <Globe className="w-3 h-3" /> : <Building2 className="w-3 h-3" />}
                    {searchScope === "web" ? "全网" : "企业"}
                    <ChevronDown className="w-3 h-3" />
                  </button>
                  <AnimatePresence>
                    {showScopeDropdown && (
                      <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                        className="absolute top-full left-0 mt-1 w-28 bg-card rounded-lg border border-border shadow-lg z-50 overflow-hidden">
                        {[{ value: "web" as const, label: "全网", icon: Globe }, { value: "enterprise" as const, label: "企业", icon: Building2 }].map(opt => (
                          <button key={opt.value} onClick={() => { setSearchScope(opt.value); setShowScopeDropdown(false); }}
                            className={`w-full flex items-center gap-2 px-3 py-2 text-xs hover:bg-accent transition-colors ${searchScope === opt.value ? "text-primary bg-primary/5" : "text-foreground"}`}>
                            <opt.icon className="w-3 h-3" />{opt.label}
                            {searchScope === opt.value && <Check className="w-3 h-3 ml-auto" />}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <div className="relative">
                  <button onClick={() => { setShowDepthDropdown(!showDepthDropdown); setShowScopeDropdown(false); }}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-accent text-xs text-muted-foreground hover:text-foreground transition-colors">
                    <Sparkles className="w-3 h-3" />
                    {searchDepth === "fast" ? "快速搜索" : "深度搜索"}
                    <ChevronDown className="w-3 h-3" />
                  </button>
                  <AnimatePresence>
                    {showDepthDropdown && (
                      <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                        className="absolute top-full left-0 mt-1 w-32 bg-card rounded-lg border border-border shadow-lg z-50 overflow-hidden">
                        {[{ value: "fast" as const, label: "快速搜索" }, { value: "deep" as const, label: "深度搜索" }].map(opt => (
                          <button key={opt.value} onClick={() => { setSearchDepth(opt.value); setShowDepthDropdown(false); }}
                            className={`w-full flex items-center gap-2 px-3 py-2 text-xs hover:bg-accent transition-colors ${searchDepth === opt.value ? "text-primary bg-primary/5" : "text-foreground"}`}>
                            {opt.label}
                            {searchDepth === opt.value && <Check className="w-3 h-3 ml-auto" />}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* ── Search status / results ── */}
            <AnimatePresence>
              {(isSearching || searchComplete) && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                  className="mt-3 overflow-hidden">
                  <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
                    {isSearching && (
                      <div className="px-3 py-3">
                        <div className="flex items-center gap-2 mb-2">
                          <Loader2 className="w-4 h-4 text-primary animate-spin" />
                          <span className="text-xs font-medium text-foreground">
                            {searchDepth === "deep" ? "深度搜索中..." : "快速搜索中..."}
                          </span>
                        </div>
                        <div className="space-y-1.5">
                          {searchProgress.map((msg, i) => (
                            <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                              className="flex items-center gap-2 text-[11px] text-muted-foreground">
                              <CheckCircle2 className="w-3 h-3 text-primary shrink-0" />
                              {msg}
                            </motion.div>
                          ))}
                          <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.2, repeat: Infinity }}
                            className="h-1 rounded-full bg-gradient-to-r from-primary/20 via-primary to-primary/20 mt-2" />
                        </div>
                      </div>
                    )}
                    {searchComplete && searchResults.length > 0 && (
                      <div>
                        <div className="flex items-center justify-between px-3 pt-3 pb-2">
                          <div className="flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-primary" />
                            <span className="text-xs font-semibold text-foreground">
                              {searchDepth === "deep" ? "深度搜索完成!" : "快速搜索完成!"}
                            </span>
                          </div>
                        </div>
                        <div className="px-3 space-y-1.5 max-h-[200px] overflow-y-auto">
                          {searchResults.slice(0, 3).map((result) => (
                            <div key={result.id} className="flex items-start gap-2 py-1.5">
                              <div className="w-5 h-5 rounded bg-accent flex items-center justify-center shrink-0 mt-0.5">
                                <Globe className="w-3 h-3 text-muted-foreground" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-[11px] font-medium text-foreground truncate">{result.title}</p>
                                <p className="text-[10px] text-muted-foreground truncate">{result.desc}</p>
                              </div>
                            </div>
                          ))}
                          {searchResults.length > 3 && (
                            <div className="flex items-center gap-1.5 py-1 text-[10px] text-muted-foreground">
                              <Link2 className="w-3 h-3" /> 还有 {searchResults.length - 3} 个来源
                            </div>
                          )}
                        </div>
                        <div className="flex items-center justify-between px-3 py-2.5 border-t border-border mt-2">
                          <button onClick={clearSearchResults} className="text-xs text-muted-foreground hover:text-destructive transition-colors">删除</button>
                          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={importSearchResults}
                            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 shadow-sm">
                            <Plus className="w-3 h-3" /> 导入
                          </motion.button>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Source list */}
          <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-1.5">
            <AnimatePresence>
              {sources.map((source) => {
                const Icon = FILE_TYPE_ICON[source.type] || File;
                return (
                  <motion.div key={source.id} layout
                    initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20, height: 0 }}
                    className={`flex items-center gap-2.5 px-3 py-3 rounded-xl border group transition-all cursor-pointer ${source.selected ? "bg-card border-primary/20 shadow-sm" : "bg-card/50 border-border hover:border-border"}`}
                    onClick={() => toggleSource(source.id)}>
                    <div className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${source.selected ? "bg-primary border-primary" : "border-muted-foreground/30"}`}>
                      {source.selected && <CheckCircle2 className="w-3 h-3 text-primary-foreground" />}
                    </div>
                    <Icon className={`w-4 h-4 shrink-0 ${source.selected ? "text-primary" : "text-muted-foreground"}`} />
                    <div className="flex-1 min-w-0">
                      <span className="text-sm text-foreground truncate block">{source.name}</span>
                      {source.status === "analyzing" && (
                        <div className="flex items-center gap-1 mt-0.5">
                          <span className="text-xs text-primary flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin" /> 解析中</span>
                          <motion.div className="flex-1 h-1 rounded-full bg-accent overflow-hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <motion.div className="h-full rounded-full bg-primary" initial={{ width: "0%" }} animate={{ width: "100%" }} transition={{ duration: 2, ease: "easeInOut" }} />
                          </motion.div>
                        </div>
                      )}
                    </div>
                    {source.status === "ready" && (
                      <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}>
                        <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                      </motion.span>
                    )}
                    <button onClick={(e) => { e.stopPropagation(); removeSource(source.id); }} className="p-0.5 rounded opacity-0 group-hover:opacity-100 hover:bg-accent text-muted-foreground transition-all"><X className="w-3 h-3" /></button>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
          <div className="px-4 py-3 border-t border-border">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>已选中 {selectedCount} / {sources.length}</span>
              <button onClick={() => setSources(prev => prev.map(s => ({ ...s, selected: true })))} className="text-primary hover:underline">全选</button>
            </div>
          </div>
        </aside>

        {/* ═══ Center: Chat (no right panel) ═══ */}
        <div className="flex-1 min-w-0 flex flex-col bg-background">
          <div className="px-6 py-3 border-b border-border flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center"><Sparkles className="w-4 h-4 text-primary" /></div>
            <div>
              <span className="font-semibold text-sm text-foreground">AI 知识萃取助手</span>
              <p className="text-xs text-muted-foreground">苏格拉底式追问 · {selectedCount} 个来源</p>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
            {chatMessages.map((msg) => (
              <motion.div key={msg.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}
                className={`flex ${msg.role === "user" ? "justify-end" : msg.role === "system" ? "justify-center" : "justify-start"}`}>
                {msg.role === "system" ? (
                  <div className="px-3 py-1.5 rounded-full bg-accent text-xs text-muted-foreground flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-primary" />{msg.content}</div>
                ) : (
                  <div className="flex gap-2.5 max-w-[75%]">
                    {msg.role === "assistant" && <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5"><Sparkles className="w-3.5 h-3.5 text-primary" /></div>}
                    <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${msg.role === "user" ? "bg-primary text-primary-foreground rounded-br-md" : "bg-accent/80 text-foreground border border-border/50 rounded-bl-md shadow-sm"}`}>{msg.content}</div>
                  </div>
                )}
              </motion.div>
            ))}
            {isAiTyping && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0"><Sparkles className="w-3.5 h-3.5 text-primary" /></div>
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
          <div className="px-6 pb-3">
            <div className="flex flex-wrap gap-2">
              {suggestions.map((s) => (
                <button key={s.text} onClick={() => handleSuggestionClick(s.text)} disabled={isAiTyping}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-border bg-card text-xs text-foreground hover:border-primary/40 hover:bg-primary/5 hover:shadow-sm transition-all disabled:opacity-50 shadow-sm">
                  <span>{s.emoji}</span>{s.text}
                </button>
              ))}
            </div>
          </div>
          <div className="px-6 pb-5">
            <div className="flex items-center gap-3">
              <div className="flex-1 flex items-center gap-3 px-4 py-3 rounded-2xl border border-border bg-card shadow-sm focus-within:border-primary/40 focus-within:shadow-md transition-all">
                <input value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                  placeholder="分享你的经验，AI 会通过追问帮你挖掘隐性知识..."
                  disabled={isAiTyping} className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none disabled:opacity-50" />
                <button onClick={handleSend} disabled={!chatInput.trim() || isAiTyping}
                  className="p-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-30 shadow-sm"><Send className="w-4 h-4" /></button>
              </div>
              {/* Generate draft button */}
              <motion.button
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                onClick={enterStructuringMode}
                disabled={chatMessages.length < 4}
                className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 shadow-lg disabled:opacity-40 transition-all shrink-0"
              >
                <Wand2 className="w-4 h-4" /> 生成初稿
              </motion.button>
            </div>
          </div>
        </div>

        {/* Close flex-1 wrapper */}
        </div>

        {/* ═══ Add Source Modal ═══ */}
        <AnimatePresence>
          {showAddSource && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 flex items-center justify-center bg-foreground/40" onClick={() => setShowAddSource(false)}>
              <motion.div initial={{ opacity: 0, scale: 0.95, y: 12 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 12 }}
                className="w-full max-w-[600px] bg-card rounded-2xl shadow-2xl border border-border overflow-hidden" onClick={(e) => e.stopPropagation()}>
                <div className="relative px-8 pt-8 pb-4 text-center">
                  <button onClick={() => setShowAddSource(false)} className="absolute right-4 top-4 p-1.5 rounded-lg hover:bg-accent text-muted-foreground transition-colors"><X className="w-5 h-5" /></button>
                  <h2 className="text-xl font-semibold text-foreground">添加知识来源</h2>
                  <p className="text-sm text-primary mt-1">支持多种格式的资料上传</p>
                </div>
                <div className="px-8 pb-6">
                  <div className="border-2 border-dashed border-border rounded-xl p-10 text-center hover:border-primary/40 hover:bg-primary/5 transition-all cursor-pointer">
                    <p className="text-base text-muted-foreground font-medium">拖放你的文件到这里</p>
                    <p className="text-sm text-muted-foreground/70 mt-1">支持文档、图片、音频、视频等格式</p>
                  </div>
                </div>
                <div className="px-8 pb-8 grid grid-cols-3 gap-2">
                  {[
                    { icon: FileText, label: "研发规范文档.pdf", type: "file" as const },
                    { icon: Image, label: "架构设计图.png", type: "image" as const },
                    { icon: FileAudio, label: "需求评审录音.mp3", type: "audio" as const },
                  ].map((item) => (
                    <button key={item.label} onClick={() => addSource(item.type, item.label)}
                      className="flex items-center gap-2.5 p-3 rounded-xl border border-border bg-background hover:border-primary/30 hover:bg-primary/5 transition-all text-left">
                      <item.icon className="w-4 h-4 text-primary shrink-0" />
                      <span className="text-xs text-foreground truncate">{item.label}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AppLayout>
  );
};

export default KnowledgeExtract;
