# 🌌 Anti-Gravity 專案駕駛艙 (Cockpit)

> **專案名稱**：Anti-Gravity 專屬懶人包 (antigravity-lazy-pack)
> **當前狀態**：已成功複製 (Cloned) 且初始化完成 🚀
> **開發人員**：USER ✕ Antigravity (AI Coding Assistant)

---

## 🟢 自動化工作流 SOP 指令集

當您在對話中對我輸入以下關鍵字時，我會自動觸發並執行對應的完整工作流：

### 1. 🟢 輸入「開工」或「我來了」
我將會自動為您執行以下開工儀式：
- [ ] **Git 倉庫狀態確認**：檢查當前分支、本地與遠端同步狀態（執行 `git status` 與 `git log -n 5`）。
- [ ] **讀取工作進度**：從您的 Obsidian 本地第二大腦或本地記錄中，讀取上次的工作進度與今日計畫。
- [ ] **啟動行動方案**：分析當前程式碼與進度，給出今日開發的第一步具體行動建議。

### 2. 🔴 輸入「收工」或「下班了」
我將會自動為您執行安全與進度存檔流程：
- [ ] **安全敏感性掃描**：自動掃描專案目錄，防範 API Key 或敏感憑證（如 `.env`, Firebase keys）不慎被提交。
- [ ] **自動化 Commit & Push**：執行 `git add .`，並根據今日修改的程式碼自動為您撰寫符合 Git 規範的 Commit Message，執行 Commit 並 Push 至 GitHub。
- [ ] **同步第二大腦**：在您的 Obsidian 每日筆記或本地記錄中，自動更新今日「已完成工作」與「留待明日待辦事項」。

### 3. 🔵 輸入「初始化專案」
當您要在新目錄開始開發時，我會自動執行：
- [ ] **專案初始化**：在根目錄自動生成標準的 `ANTIGRAVITY.md`、`.gitignore` 及專案首頁說明。
- [ ] **版本控制建立**：執行 `git init`，加入所有檔案並完成 initial commit。
- [ ] **GitHub 遠端同步**：使用 GitHub CLI (`gh repo create`) 自動為您在 GitHub 上建立同名儲存庫並推上去。

---

## 📊 專案資源導覽

- 📄 **[README.md](file:///C:/Users/User/.gemini/antigravity/scratch/antigravity-lazy-pack/README.md)**：專案核心特色與快速開始指南。
- 📖 **[09-AntiGravity專屬懶人包.md](file:///C:/Users/User/.gemini/antigravity/scratch/antigravity-lazy-pack/09-AntiGravity專屬懶人包.md)**：包含 **NotebookLM**、**Firebase**、**GitHub** 與 **Obsidian** 連接與踩坑指南的核心指南主檔。
- 📊 **[ai_educational_agents_trends.md](file:///C:/Users/User/.gemini/antigravity/scratch/antigravity-lazy-pack/ai_educational_agents_trends.md)**：實戰產出的 AI 教育代理人深度趨勢報告。
- ☁️ **[wordcloud-app/](file:///C:/Users/User/.gemini/antigravity/scratch/antigravity-lazy-pack/wordcloud-app)**：多人即時雲端文字雲網頁應用（Vanilla HTML/CSS/JS + Firebase Firestore + WordCloud2.js）。

---

## 🛠️ 開發中任務看板 (Task Board)

- [x] 成功自 GitHub 複製 lazy-pack 專案至本地
- [x] 建立專案駕駛艙 `ANTIGRAVITY.md`
- [ ] 推薦用戶將此目錄設定為 active workspace
- [ ] 協助用戶測試 `wordcloud-app` 本地運行
