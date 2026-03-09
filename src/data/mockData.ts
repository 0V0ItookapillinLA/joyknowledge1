export interface CaseItem {
  id: string;
  title: string;
  author: string;
  department: string;
  summary: string;
  tags: string[];
  views: number;
  likes: number;
  comments: number;
  avatar?: string;
  createdAt: string;
  category: string;
}

export interface Expert {
  id: string;
  name: string;
  title: string;
  department: string;
  avatar: string;
  domains: string[];
  skills: string[];
  caseCount: number;
  followers: number;
  bio: string;
}

export interface TagItem {
  label: string;
  emoji?: string;
  count?: number;
}

export const MOCK_TAGS: TagItem[] = [
  { label: "项目复盘", emoji: "🎯", count: 128 },
  { label: "最佳实践", emoji: "🚀", count: 96 },
  { label: "AI应用", emoji: "🤖", count: 84 },
  { label: "团队管理", emoji: "👥", count: 72 },
  { label: "产品设计", emoji: "🎨", count: 65 },
  { label: "技术架构", emoji: "🏗️", count: 58 },
  { label: "客户案例", emoji: "🤝", count: 52 },
  { label: "流程优化", emoji: "⚡", count: 45 },
  { label: "数据分析", emoji: "📊", count: 41 },
  { label: "创新方法", emoji: "💡", count: 38 },
];

export const MOCK_CASES: CaseItem[] = [
  { id: "1", title: "基于大模型的智能客服系统落地实践", author: "张明", department: "AI中台", summary: "本文详细记录了从需求调研、模型选型、提示词工程到灰度上线的完整过程，分享了3个关键踩坑点。", tags: ["AI应用", "最佳实践", "客户案例"], views: 3420, likes: 286, comments: 42, createdAt: "2026-03-08", category: "经验案例" },
  { id: "2", title: "跨部门协作效率提升 40% 的方法论", author: "李芳", department: "项目管理部", summary: "通过引入 OKR 对齐机制和每周同步会改进，实现了跨部门项目交付效率的显著提升。", tags: ["团队管理", "流程优化"], views: 2180, likes: 195, comments: 28, createdAt: "2026-03-07", category: "项目复盘" },
  { id: "3", title: "从0到1搭建企业知识图谱的实战经验", author: "王磊", department: "数据平台", summary: "知识图谱在企业场景的应用远比想象中复杂，本文从数据采集、实体抽取到图谱构建，分享了全链路经验。", tags: ["技术架构", "AI应用", "数据分析"], views: 4510, likes: 378, comments: 56, createdAt: "2026-03-06", category: "最佳实践" },
  { id: "4", title: "用户增长策略：如何通过产品化手段实现 DAU 翻倍", author: "陈雪", department: "增长团队", summary: "复盘了Q4增长实验的完整过程，包括A/B测试策略、渠道优化和留存提升方案。", tags: ["产品设计", "数据分析"], views: 1890, likes: 167, comments: 23, createdAt: "2026-03-05", category: "项目复盘" },
  { id: "5", title: "敏捷转型中的团队文化建设", author: "刘伟", department: "研发效能", summary: "敏捷不仅是方法论，更是团队文化。分享了如何在传统团队中推进敏捷思维的实践。", tags: ["团队管理", "最佳实践"], views: 1560, likes: 134, comments: 19, createdAt: "2026-03-04", category: "经验案例" },
  { id: "6", title: "RAG 检索增强生成在企业文档中的应用", author: "赵强", department: "AI中台", summary: "深入探讨RAG技术在企业内部文档检索场景的实践，包括向量数据库选型和Chunk策略。", tags: ["AI应用", "技术架构"], views: 5200, likes: 420, comments: 68, createdAt: "2026-03-03", category: "最佳实践" },
  { id: "7", title: "B端产品的用户体验设计方法论", author: "孙婷", department: "UX设计", summary: "B端产品不等于丑陋，本文分享了在复杂业务场景下做好体验设计的核心原则。", tags: ["产品设计", "最佳实践"], views: 2340, likes: 201, comments: 31, createdAt: "2026-03-02", category: "经验案例" },
  { id: "8", title: "大型项目风险管控的5个关键动作", author: "周鹏", department: "PMO", summary: "总结了过去两年管理10+大型项目的风险管控经验，提出了风险预警-评估-应对的系统方法。", tags: ["项目复盘", "流程优化"], views: 1780, likes: 152, comments: 22, createdAt: "2026-03-01", category: "项目复盘" },
];

export const MOCK_EXPERTS: Expert[] = [
  { id: "1", name: "Sam Chen", title: "首席架构师", department: "技术委员会", avatar: "", domains: ["云架构", "微服务", "DevOps"], skills: ["Java", "Python", "React", "DevOps", "Agile"], caseCount: 128, followers: 2360, bio: "15年技术架构经验，主导多个企业级平台从0到1建设。" },
  { id: "2", name: "Eric Wang", title: "AI技术专家", department: "AI中台", avatar: "", domains: ["自然语言处理", "大模型应用", "智能客服"], skills: ["Prompt Engineering", "RAG", "LangChain", "向量数据库"], caseCount: 42, followers: 1580, bio: "10年AI领域经验，专注于大模型在企业场景的落地应用。" },
  { id: "3", name: "Richard Li", title: "数据架构师", department: "数据平台", avatar: "", domains: ["知识图谱", "数据架构", "数据治理"], skills: ["Neo4j", "数据建模", "ETL", "Spark"], caseCount: 35, followers: 1120, bio: "深耕企业数据平台建设，知识图谱领域技术专家。" },
  { id: "4", name: "Sophie Zhang", title: "高级项目经理", department: "项目管理部", avatar: "", domains: ["项目管理", "敏捷方法", "跨部门协作"], skills: ["OKR", "Scrum", "风险管理", "干系人管理"], caseCount: 18, followers: 890, bio: "PMP认证，擅长复杂项目的全生命周期管理。" },
  { id: "5", name: "Kevin Liu", title: "产品总监", department: "产品部", avatar: "", domains: ["产品设计", "用户增长", "商业化"], skills: ["用户研究", "数据分析", "A/B测试", "商业模型"], caseCount: 23, followers: 760, bio: "从0到1打造过多款百万级用户产品，擅长增长策略。" },
  { id: "6", name: "Amy Wu", title: "UX设计负责人", department: "UX设计", avatar: "", domains: ["用户体验", "交互设计", "设计系统"], skills: ["Figma", "用户研究", "可用性测试", "设计规范"], caseCount: 14, followers: 530, bio: "关注B端产品的用户体验提升，推动设计系统建设。" },
  { id: "7", name: "David Zhao", title: "运维架构师", department: "基础设施", avatar: "", domains: ["云原生", "SRE", "安全合规"], skills: ["Kubernetes", "Terraform", "监控告警", "CI/CD"], caseCount: 20, followers: 680, bio: "主导企业云原生转型，构建高可用基础设施体系。" },
  { id: "8", name: "Grace Lin", title: "市场营销总监", department: "市场部", avatar: "", domains: ["品牌营销", "数字营销", "内容运营"], skills: ["SEO", "社媒运营", "营销自动化", "数据驱动"], caseCount: 11, followers: 420, bio: "深耕B2B营销领域，擅长品效合一的增长打法。" },
];

export const NAV_ITEMS = [
  { label: "推荐", icon: "Home", path: "/" },
  { label: "专家书房", icon: "Users", path: "/experts" },
  { label: "个人专区", icon: "User", path: "/profile" },
  { label: "知识萃取", icon: "Sparkles", path: "/extract" },
];

export const CASE_CATEGORIES = ["经验案例", "项目复盘", "问题解决", "最佳实践", "客户案例"];
