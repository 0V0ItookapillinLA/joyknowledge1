import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, ChevronRight, FileText, Eye, Users, FolderOpen } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";

import samAvatar from "@/assets/avatars/sam.jpg";
import ericAvatar from "@/assets/avatars/eric.jpg";
import richardAvatar from "@/assets/avatars/richard.jpg";
import sophieAvatar from "@/assets/avatars/sophie.jpg";
import kevinAvatar from "@/assets/avatars/kevin.jpg";
import amyAvatar from "@/assets/avatars/amy.jpg";

// Department to BGBU mapping
const DEPT_BGBU_MAP: Record<string, { bgbu: string; parent: string }> = {
  "企业信息化部": { bgbu: "京东职能", parent: "CHO体系" },
  "产品创新部": { bgbu: "京东零售", parent: "产品中心" },
  "技术研发部": { bgbu: "京东科技", parent: "技术中心" },
  "供应链管理部": { bgbu: "京东物流", parent: "供应链中心" },
  "数据平台部": { bgbu: "京东科技", parent: "数据中心" },
};

const DIRECTORY = [
  { label: "首页", key: "home", icon: "≡" },
  { label: "0-业务规划", key: "plan" },
  { label: "1-新人必读", key: "newbie" },
  { label: "3-关键沉淀", key: "key" },
  { label: "4-学习分享", key: "learning" },
  { label: "5-部门文化", key: "culture" },
  { label: "8-历史归档", key: "archive" },
  { label: "7-二级空间", key: "sub" },
  { label: "\n", key: "weekly" },
];

const TEAM_MEMBERS = [
  { name: "张孔泓伯", role: "负责人", avatar: samAvatar },
  { name: "庞晓宇", role: "产品", avatar: ericAvatar },
  { name: "杨宇翔", role: "研发", avatar: richardAvatar },
  { name: "姜东良", role: "产品", avatar: sophieAvatar },
  { name: "马丽杰", role: "研发", avatar: kevinAvatar },
  { name: "于潇", role: "财务", avatar: amyAvatar },
];

const BIZ_SCENARIOS = [
  {
    line: "HR条线",
    color: "text-primary",
    roles: [
      { scene: "招聘", members: [{ name: "庞晓宇", avatar: ericAvatar }, { name: "杨宇翔", avatar: richardAvatar }] },
      { scene: "绩效", members: [{ name: "马丽杰", avatar: kevinAvatar }, { name: "张孔泓伯", avatar: samAvatar }] },
    ],
  },
  {
    line: "京ME条线",
    color: "text-orange-600",
    roles: [
      { scene: "日历", members: [{ name: "杨宇翔", avatar: richardAvatar }] },
      { scene: "待办+项目", members: [{ name: "姜东良", avatar: sophieAvatar }] },
    ],
  },
  {
    line: "财务条线",
    color: "text-red-600",
    roles: [
      { scene: "税务发票", members: [{ name: "于潇", avatar: amyAvatar }] },
      { scene: "经营性结算", members: [{ name: "刘靓璠", avatar: kevinAvatar }] },
    ],
  },
];

const DepartmentSpace = () => {
  const { name } = useParams<{ name: string }>();
  const deptName = name ? decodeURIComponent(name) : "企业信息化部";
  const navigate = useNavigate();
  const [activeDir, setActiveDir] = useState("home");
  const [searchQuery, setSearchQuery] = useState("");

  const deptInfo = DEPT_BGBU_MAP[deptName] || { bgbu: "京东集团", parent: "职能体系" };

  return (
    <AppLayout>
      <div className="flex max-w-[1400px] mx-auto">
        {/* Left sidebar - directory */}
        <aside className="w-[240px] shrink-0 border-r border-border p-4 hidden lg:block sticky top-14 h-[calc(100vh-56px)] overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground text-sm">{deptName}</h3>
            <span className="text-xs text-muted-foreground">私有</span>
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="搜索空间"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-2 rounded-md border border-border bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/40"
            />
          </div>

          {/* Directory */}
          <div className="space-y-0.5">
            {DIRECTORY.map((item) => (
              <button
                key={item.key}
                onClick={() => setActiveDir(item.key)}
                className={`flex items-center gap-2 w-full px-3 py-2 rounded-md text-sm transition-colors ${
                  activeDir === item.key
                    ? "text-primary font-medium bg-primary/5"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                }`}
              >
                {item.key === "home" ? (
                  <span className="text-base">≡</span>
                ) : (
                  <FolderOpen className="w-3.5 h-3.5" />
                )}
                {item.label}
              </button>
            ))}
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 min-w-0 p-6">
          {/* Breadcrumb */}
          <Breadcrumb className="mb-6">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">京东集团</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link
                    to={`/knowledge?type=dept&value=${encodeURIComponent(deptInfo.bgbu)}&label=${encodeURIComponent(deptInfo.bgbu)}`}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {deptInfo.parent}
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link
                    to={`/knowledge?type=dept&value=${encodeURIComponent(deptInfo.bgbu)}&label=${encodeURIComponent(deptInfo.bgbu)}`}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {deptInfo.bgbu}
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{deptName}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <Eye className="w-3.5 h-3.5" />
                <span>371人已读</span>
              </div>
              <h1 className="text-lg font-semibold text-foreground mb-3">
                EI{deptName}团队空间主页
              </h1>
              <div className="flex items-center gap-3 mb-6">
                <img src={samAvatar} alt="creator" className="w-8 h-8 rounded-full object-cover" />
                <span className="text-sm text-foreground font-medium">张孔泓伯(Cris)</span>
                <span className="text-sm text-muted-foreground">创建于 2025年4月24日</span>
              </div>
            </div>

            {/* Welcome section */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-foreground mb-2">
                🎉 欢迎来到{" "}
                <span className="px-2 py-0.5 rounded bg-primary/10 text-primary font-semibold">
                  EI{deptName}
                </span>
                {" "}团队空间
              </h2>
              <p className="text-sm text-muted-foreground">
                希望你可以在这里{" "}
                <span className="text-primary font-medium">简单</span>、
                <span className="text-orange-500 font-medium">快捷</span>、
                <span className="text-green-600 font-medium">高效</span>
                {" "}找到所有你想找的内容，如有任何意见建议请联系
                <span className="inline-flex items-center gap-1 ml-1">
                  <img src={samAvatar} alt="" className="w-4 h-4 rounded-full" />
                  <span className="text-foreground font-medium">潘月敏</span>
                </span>
              </p>
            </div>

            {/* Business scenarios table */}
            <div className="mb-8">
              <h3 className="text-sm font-semibold text-foreground mb-4">• 按业务场景找人</h3>
              <div className="border border-border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-accent/50">
                      {BIZ_SCENARIOS.map((scenario) => (
                        <th key={scenario.line} colSpan={2} className="px-4 py-3 text-left">
                          <span className={`font-semibold ${scenario.color}`}>{scenario.line}</span>
                        </th>
                      ))}
                    </tr>
                    <tr className="bg-accent/30 border-t border-border">
                      {BIZ_SCENARIOS.map((scenario) =>
                        scenario.roles.length >= 1 ? (
                          <>
                            <th key={`${scenario.line}-scene`} className="px-4 py-2 text-left text-muted-foreground font-medium">场景</th>
                            <th key={`${scenario.line}-member`} className="px-4 py-2 text-left text-muted-foreground font-medium">负责人</th>
                          </>
                        ) : null
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {[0, 1].map((rowIdx) => (
                      <tr key={rowIdx} className="border-t border-border">
                        {BIZ_SCENARIOS.map((scenario) => {
                          const role = scenario.roles[rowIdx];
                          if (!role) return <td key={`${scenario.line}-${rowIdx}`} colSpan={2} className="px-4 py-3" />;
                          return (
                            <>
                              <td key={`${scenario.line}-${rowIdx}-scene`} className="px-4 py-3 text-foreground">
                                {role.scene}
                              </td>
                              <td key={`${scenario.line}-${rowIdx}-members`} className="px-4 py-3">
                                <div className="flex items-center gap-2 flex-wrap">
                                  {role.members.map((m) => (
                                    <div key={m.name} className="flex flex-col items-center gap-1">
                                      <img src={m.avatar} alt={m.name} className="w-8 h-8 rounded-full object-cover" />
                                      <span className="text-xs text-muted-foreground">{m.name}</span>
                                    </div>
                                  ))}
                                </div>
                              </td>
                            </>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Team members */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">• 团队成员</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {TEAM_MEMBERS.map((member) => (
                  <div key={member.name} className="flex flex-col items-center gap-2 p-4 rounded-lg border border-border hover:border-primary/30 transition-colors">
                    <img src={member.avatar} alt={member.name} className="w-12 h-12 rounded-full object-cover" />
                    <span className="text-sm font-medium text-foreground">{member.name}</span>
                    <span className="text-xs text-muted-foreground">{member.role}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </AppLayout>
  );
};

export default DepartmentSpace;
