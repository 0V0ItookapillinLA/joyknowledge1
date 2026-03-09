import { useState, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Send, Search, MoreHorizontal, Phone, Video, Smile, Paperclip, Check, CheckCheck } from "lucide-react";
import AppLayout from "@/components/AppLayout";

import samAvatar from "@/assets/avatars/sam.jpg";
import ericAvatar from "@/assets/avatars/eric.jpg";
import sophieAvatar from "@/assets/avatars/sophie.jpg";
import amyAvatar from "@/assets/avatars/amy.jpg";
import graceAvatar from "@/assets/avatars/grace.jpg";

interface Conversation {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
}

interface Message {
  id: string;
  content: string;
  time: string;
  fromMe: boolean;
  read: boolean;
}

const CONVERSATIONS: Conversation[] = [
  { id: "1", name: "Sam Chen", avatar: samAvatar, lastMessage: "关于微服务架构的那个方案，我整理了一份文档，你看看有没有补充的？", time: "刚刚", unread: 2, online: true },
  { id: "2", name: "Eric Wang", avatar: ericAvatar, lastMessage: "RAG 的检索效果提升了不少，明天上午我们对一下细节", time: "10分钟前", unread: 1, online: true },
  { id: "3", name: "Sophie Zhang", avatar: sophieAvatar, lastMessage: "好的，那我们下周三的会议确认一下议题", time: "1小时前", unread: 0, online: false },
  { id: "4", name: "Amy Wu", avatar: amyAvatar, lastMessage: "设计稿已经更新了，你方便的时候review一下", time: "昨天", unread: 0, online: false },
  { id: "5", name: "Grace Lin", avatar: graceAvatar, lastMessage: "营销活动的数据报告已经发到你邮箱了", time: "2天前", unread: 0, online: false },
];

const MESSAGES_MAP: Record<string, Message[]> = {
  "1": [
    { id: "m1", content: "你好，我看了你之前发的那篇关于知识图谱的案例，写得非常好！", time: "09:15", fromMe: false, read: true },
    { id: "m2", content: "谢谢！那篇花了不少时间整理，主要是想把实际踩坑经验分享出来", time: "09:18", fromMe: true, read: true },
    { id: "m3", content: "对了，我们团队最近也在做微服务架构升级，想跟你请教一些经验", time: "09:20", fromMe: false, read: true },
    { id: "m4", content: "当然可以，你们目前遇到了什么问题？", time: "09:22", fromMe: true, read: true },
    { id: "m5", content: "主要是服务拆分粒度和数据一致性方面，团队意见不太统一", time: "09:25", fromMe: false, read: true },
    { id: "m6", content: "这个确实是最常见的问题。服务拆分建议从业务域出发，先做DDD领域分析", time: "09:30", fromMe: true, read: true },
    { id: "m7", content: "数据一致性的话，看业务场景，核心链路用Saga模式，非核心的最终一致性就行", time: "09:31", fromMe: true, read: true },
    { id: "m8", content: "明白了，非常受用！我回去跟团队讨论一下", time: "09:35", fromMe: false, read: true },
    { id: "m9", content: "关于微服务架构的那个方案，我整理了一份文档，你看看有没有补充的？", time: "14:20", fromMe: false, read: false },
    { id: "m10", content: "还有一个问题想请教，服务注册发现你们用的什么方案？", time: "14:21", fromMe: false, read: false },
  ],
  "2": [
    { id: "m1", content: "Eric，上次你提到的向量数据库选型，最终决定用哪个了？", time: "昨天 15:30", fromMe: true, read: true },
    { id: "m2", content: "最终选了 Milvus，性能和生态都不错", time: "昨天 15:45", fromMe: false, read: true },
    { id: "m3", content: "好的，我们这边也在评估，回头分享下你们的benchmark数据？", time: "昨天 16:00", fromMe: true, read: true },
    { id: "m4", content: "没问题，我整理好发你", time: "昨天 16:05", fromMe: false, read: true },
    { id: "m5", content: "RAG 的检索效果提升了不少，明天上午我们对一下细节", time: "10:30", fromMe: false, read: false },
  ],
  "3": [
    { id: "m1", content: "Sophie，下周三的项目复盘会议还是按原计划进行吗？", time: "昨天 10:00", fromMe: true, read: true },
    { id: "m2", content: "是的，我已经发了会议邀请，你收到了吗？", time: "昨天 10:15", fromMe: false, read: true },
    { id: "m3", content: "收到了，我会准备Q1的项目数据", time: "昨天 10:20", fromMe: true, read: true },
    { id: "m4", content: "好的，那我们下周三的会议确认一下议题", time: "1小时前", fromMe: false, read: true },
  ],
};

const Messages = () => {
  const [selectedConv, setSelectedConv] = useState<string>("1");
  const [inputValue, setInputValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const currentConv = CONVERSATIONS.find(c => c.id === selectedConv);
  const messages = MESSAGES_MAP[selectedConv] || [];

  const filteredConversations = searchQuery
    ? CONVERSATIONS.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.lastMessage.includes(searchQuery))
    : CONVERSATIONS;

  return (
    <AppLayout>
      <div className="max-w-[1200px] mx-auto flex h-[calc(100vh-56px)]">
        {/* Conversation list */}
        <aside className="w-[320px] shrink-0 border-r border-border flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between mb-3">
              <h1 className="text-lg font-semibold text-foreground">私信</h1>
              <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="w-4 h-4" />
              </Link>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="搜索联系人..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-md border border-border bg-accent/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40"
              />
            </div>
          </div>

          {/* Conversation items */}
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => setSelectedConv(conv.id)}
                className={`w-full flex items-start gap-3 px-4 py-3.5 text-left transition-colors border-b border-border/50 ${
                  selectedConv === conv.id ? "bg-primary/5" : "hover:bg-accent/50"
                }`}
              >
                <div className="relative shrink-0">
                  <img src={conv.avatar} alt={conv.name} className="w-11 h-11 rounded-full object-cover" />
                  {conv.online && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-card" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">{conv.name}</span>
                    <span className="text-xs text-muted-foreground shrink-0">{conv.time}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{conv.lastMessage}</p>
                </div>
                {conv.unread > 0 && (
                  <span className="shrink-0 mt-1 w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
                    {conv.unread}
                  </span>
                )}
              </button>
            ))}
          </div>
        </aside>

        {/* Chat area */}
        <div className="flex-1 flex flex-col min-w-0">
          {currentConv ? (
            <>
              {/* Chat header */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-border">
                <div className="flex items-center gap-3">
                  <img src={currentConv.avatar} alt={currentConv.name} className="w-9 h-9 rounded-full object-cover" />
                  <div>
                    <h2 className="text-sm font-semibold text-foreground">{currentConv.name}</h2>
                    <p className="text-xs text-muted-foreground">
                      {currentConv.online ? "在线" : "离线"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button className="p-2 rounded-md hover:bg-accent text-muted-foreground transition-colors">
                    <Phone className="w-4 h-4" />
                  </button>
                  <button className="p-2 rounded-md hover:bg-accent text-muted-foreground transition-colors">
                    <Video className="w-4 h-4" />
                  </button>
                  <button className="p-2 rounded-md hover:bg-accent text-muted-foreground transition-colors">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
                {messages.map((msg, i) => {
                  // Date separator
                  const showDateSep = i === 0 || (msg.time.includes("昨天") && !messages[i - 1]?.time.includes("昨天"));
                  return (
                    <div key={msg.id}>
                      {showDateSep && i > 0 && (
                        <div className="flex items-center justify-center my-4">
                          <span className="text-xs text-muted-foreground bg-accent px-3 py-1 rounded-full">
                            {msg.time.includes("昨天") ? "昨天" : "今天"}
                          </span>
                        </div>
                      )}
                      <motion.div
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.02 }}
                        className={`flex ${msg.fromMe ? "justify-end" : "justify-start"}`}
                      >
                        <div className={`max-w-[70%] ${msg.fromMe ? "order-1" : ""}`}>
                          <div
                            className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                              msg.fromMe
                                ? "bg-primary text-primary-foreground rounded-br-md"
                                : "bg-accent text-foreground rounded-bl-md"
                            }`}
                          >
                            {msg.content}
                          </div>
                          <div className={`flex items-center gap-1 mt-1 ${msg.fromMe ? "justify-end" : ""}`}>
                            <span className="text-[10px] text-muted-foreground">
                              {msg.time.replace("昨天 ", "")}
                            </span>
                            {msg.fromMe && (
                              msg.read
                                ? <CheckCheck className="w-3 h-3 text-primary" />
                                : <Check className="w-3 h-3 text-muted-foreground" />
                            )}
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  );
                })}
              </div>

              {/* Input area */}
              <div className="border-t border-border px-5 py-3">
                <div className="flex items-end gap-2">
                  <button className="p-2 rounded-md hover:bg-accent text-muted-foreground transition-colors shrink-0">
                    <Paperclip className="w-4 h-4" />
                  </button>
                  <div className="flex-1 relative">
                    <textarea
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="输入消息..."
                      rows={1}
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-accent/30 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40 resize-none"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          setInputValue("");
                        }
                      }}
                    />
                  </div>
                  <button className="p-2 rounded-md hover:bg-accent text-muted-foreground transition-colors shrink-0">
                    <Smile className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setInputValue("")}
                    className={`p-2.5 rounded-xl shrink-0 transition-colors ${
                      inputValue.trim()
                        ? "bg-primary text-primary-foreground hover:bg-primary/90"
                        : "bg-accent text-muted-foreground"
                    }`}
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-muted-foreground text-sm">选择一个对话开始聊天</p>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default Messages;
