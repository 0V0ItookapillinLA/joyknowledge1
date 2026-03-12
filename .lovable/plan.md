

## Plan: Deep Structuring Mode UI Overhaul

### Changes to `src/pages/KnowledgeExtract.tsx`

**1. Remove pre-assigned tags — start blank, only show after drag**
- Change `enterStructuringMode` to initialize `paragraphTools` as empty `{}` instead of pre-filling every paragraph with `"report"`.
- Only render a tag after a paragraph if `paragraphTools[idx]` exists.
- Reference image shows tags as small inline colored chips (e.g. `⬇ 个人画像.md`) embedded right after the text on the same line or just below.

**2. Make document look like a Word editor, not cards**
- Remove `border`, `rounded-xl`, `bg-card` wrapper from each paragraph div.
- Render paragraphs as plain editable text with `contentEditable` or just plain `<p>` elements with minimal styling.
- Keep drag-over highlight as a subtle underline/background rather than a card border.
- Remove the instruction text "拖拽右侧工具到某一段文本上..."

**3. Add step indicator at top (like quick mode)**
- Create a `DeepStepIndicator` with 3 steps: ① 知识发现 → ② 结构化处理 → ③ 生成预览
- Replace the current header ("纯文本初稿" + "返回对话" button) with: back button + step indicator (current = step 2).
- The workspace/chat phase = step 1, structuring = step 2, result = step 3.
- Also add step indicator to the deep workspace view (step 1) and result view (step 3).

**4. Tag visual style (per reference image)**
- After each paragraph, if a tool is assigned, show an inline tag like: colored icon + tool label, styled as a small rounded pill/chip directly after the text (not below in a separate row). Similar to the uploaded image: `⬇ 个人画像.md` style — compact, inline, colored.
- Allow removing a tag by clicking an X on it.

### Implementation details
- Reuse existing `StepIndicator` component but with deep-mode step labels.
- `paragraphTools` starts as `{}`, tag only appears when dragged.
- Paragraph containers become borderless, just `py-2` spacing, with a subtle dashed bottom border on drag-over.

