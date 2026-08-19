"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { Tutorial, TutorialBlock } from "@/lib/tutorials";

function Block({ block }: { block: TutorialBlock }) {
  if (block.type === "prompt" || block.type === "code") return <div className="guide-code"><div><span>{block.type === "prompt" ? "✨ 复制给 AI" : "⌘ "}{block.label || "操作内容"}</span><CopyButton text={block.text} /></div><pre>{block.text}</pre></div>;
  if (block.type === "note") return <div className={`guide-note ${block.kind || "tip"}`}><i>{block.icon || "💡"}</i><p><b>{block.label || "提示"}：</b>{block.text}</p></div>;
  if (block.type === "list") { const List = block.ordered ? "ol" : "ul"; return <List className="guide-list">{block.items.map((item) => <li key={item}>{item}</li>)}</List>; }
  return block.text ? <p>{block.text}</p> : null;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  async function copy() { await navigator.clipboard.writeText(text); setCopied(true); window.setTimeout(() => setCopied(false), 1500); }
  return <button type="button" onClick={copy}>{copied ? "已复制" : "复制"}</button>;
}

export function TutorialDocument({ tutorial, sourceAuthors }: { tutorial: Tutorial; sourceAuthors: string[] }) {
  const storageKey = useMemo(() => `kunlun-guide-${tutorial.short}`, [tutorial.short]);
  const [done, setDone] = useState<number[]>([]);
  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) setDone(JSON.parse(stored));
    } catch { /* corrupted localStorage, ignore */ }
  }, [storageKey]);
  const completed = (index: number) => done.includes(index);
  function toggle(index: number) {
    const next = completed(index) ? done.filter((value) => value !== index) : [...done, index];
    setDone(next);
    try { localStorage.setItem(storageKey, JSON.stringify(next)); } catch { /* storage full or disabled */ }
  }
  return <div className="guide-page">
    <header className="guide-topbar"><Link href="/tutorials" className="guide-brand"><span></span>昆仑增长AI实战 <small>清爽分步教程</small></Link><div className="guide-top-actions"><Link href="/tutorials">▦ 教程合集</Link><CopyButton text={`${tutorial.short}\n\n${tutorial.goal || tutorial.sub}`} /></div></header>
    <div className="guide-layout">
      <aside className="guide-sidebar"><div className="guide-progress"><div><i style={{ width: `${done.length / tutorial.steps.length * 100}%` }} /></div><small>{done.length} / {tutorial.steps.length} 步已完成</small></div><p className="guide-nav-label">开始</p><a href="#goal">目标与通关条件</a><p className="guide-nav-label">实操步骤</p>{tutorial.steps.map((step, index) => <a className={completed(index + 1) ? "is-done" : ""} href={`#step-${index + 1}`} key={step.title}><b>{completed(index + 1) ? "✓" : index + 1}</b>{step.title}</a>)}<p className="guide-nav-label">附录</p><a href="#faq">卡住了怎么办</a><a href="#sources">来源与作者</a></aside>
      <main className="guide-doc">
        <section className="guide-hero"><span>✦ {tutorial.eyebrow}</span><h1 dangerouslySetInnerHTML={{ __html: tutorial.titleHtml }} /><p>{tutorial.sub}</p><div className="guide-chips">{tutorial.chips.map((chip) => <i key={chip} dangerouslySetInnerHTML={{ __html: chip }} />)}</div><div className="guide-actions"><a href="#step-1">▶ 从第 1 步开始</a><a href="#faq">? 直接看排错</a></div></section>
        <div className="guide-note tip"><i>{tutorial.introIcon || "✦"}</i><p><b>{tutorial.introTitle || "成果优先"}</b>{tutorial.intro || tutorial.goal}</p></div>
        <section id="goal" className="guide-goal"><header><h2>你要做什么？</h2><p>{tutorial.goalLead || "从目标到成果，每一步都能验证。"}</p></header><div className="guide-card"><p>{tutorial.goal}</p><div className="guide-outcomes">{(tutorial.outcomes || []).map(([title, text], index) => <div key={title}><strong>0{index + 1}</strong><h3>{title}</h3><p>{text}</p></div>)}</div></div><div className="guide-card"><h3>通关条件</h3><div className="guide-checks">{tutorial.criteria?.map((item) => <span key={item}>✓ {item}</span>)}</div></div></section>
        <section className="guide-module"><small>HANDS-ON</small><h2>{tutorial.module || "从空白到可验证成果"}</h2><p>{tutorial.moduleSub || "范围先收紧，操作留证据，失败有退路。"}</p></section>
        {tutorial.steps.map((step, index) => <section className={`guide-step ${completed(index + 1) ? "is-done" : ""}`} id={`step-${index + 1}`} key={step.title}><header><b>{index + 1}</b><div><h2>{step.title}</h2><span>⏱ {step.time}</span><span>🎯 {step.target}</span></div><label><input type="checkbox" checked={completed(index + 1)} onChange={() => toggle(index + 1)} /> 已完成</label></header>{step.blocks.map((block, blockIndex) => <Block block={block} key={blockIndex} />)}<div className="guide-note ok"><i>✅</i><p><b>做完你应该看到：</b>{step.done}</p></div></section>)}
        <section id="faq" className="guide-faq"><header><h2>卡住了怎么办</h2><p>先定位原因，再重试。</p></header><div><table><thead><tr><th>现象</th><th>原因</th><th>处理</th></tr></thead><tbody>{tutorial.faq?.map(([symptom, cause, fix]) => <tr key={symptom}><td>{symptom}</td><td>{cause}</td><td>{fix}</td></tr>)}</tbody></table></div></section>
        <section id="sources" className="guide-sources"><h2>资料来源与作者</h2><p>保留原始作者与链接；热门帖的收益或效果主张不视为事实。</p>{tutorial.sources?.map(([label, url], index) => <a href={url} target="_blank" rel="noreferrer" key={url}>{label}<small>作者 / 机构：{sourceAuthors[index]}</small></a>)}</section>
      </main>
    </div>
  </div>;
}
