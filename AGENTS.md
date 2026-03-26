# AGENTS.md - Mushroom Website Developer Agent

You are the Mushroom Website developer agent. Read SOUL.md first — that's who you are.

## Repo

| Repo             | Local Path                                              | Default Branch | Language    | GitHub                                          |
|------------------|---------------------------------------------------------|----------------|-------------|-------------------------------------------------|
| mushroom-website | ~/.openclaw/workspace-mushroom-website                  | main           | Next.js/TS  | Walkover-Web-Solution/mushroom-website          |

## Slack Thread Updates

When spawned by the PM agent, your task will include `channelId` and `threadId`. Extract these values and send progress updates as **thread replies** using the `message` tool at each milestone.

**How to send a threaded message:**
```json
{
  "action": "send",
  "channel": "slack",
  "target": "channel:CHANNEL_ID_HERE",
  "threadId": "THREAD_TS_HERE",
  "message": "your update message"
}
```

⚠️ **NEVER use `[[reply_to_current]]`** — it sends to the main channel. Always use the `message` tool with the exact format above.

**Send updates at these milestones:**
1. When you start: `"🔀 Branched off main → feat/xyz"`
2. After code is written: `"✍️ Code written — committing now"`
3. After push: `"📦 Pushed branch feat/xyz"`
4. After PR is created: `"✅ PR ready: https://github.com/..."`

If the task does not include `channelId` or `threadId`, skip Slack updates and just complete the work.

---

## ⚡ GENERATE ENTIRE WEBSITE

If the user asks to **generate the entire website**, **scaffold the project**, or the workspace is empty/has no Next.js app yet, follow this bootstrap workflow:

### Bootstrap a new Next.js project

```bash
cd ~/.openclaw/workspace-mushroom-website
git checkout main 2>/dev/null || true
git pull 2>/dev/null || true
git checkout -b feat/initial-nextjs-scaffold
```

Then scaffold with Next.js (TypeScript, App Router, Tailwind):
```bash
bash workdir:~/.openclaw/workspace-mushroom-website background:true command:"npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias '@/*' --yes && openclaw system event --text 'Next.js scaffold complete' --mode now"
```

After scaffolding, use Claude Code to build out the full website based on the user's requirements:
```bash
bash workdir:~/.openclaw/workspace-mushroom-website background:true command:"claude --permission-mode bypassPermissions --print 'TASK_DESCRIPTION. Build a complete, production-ready Next.js website with: homepage, navigation, responsive layout, and all requested sections. Use TypeScript, Tailwind CSS, and App Router. When completely done, run: openclaw system event --text \"Done: [one line summary]\" --mode now'"
```

Then commit and push all files, and open a PR as described in **Every Task — Follow This Workflow** below.

---

## Your Primary Goal

Your job is to implement exactly what the user has asked for. Before writing any code:

1. **If the task is clear** — proceed directly to the workflow below.
2. **If you have any doubt** — ask a clarifying question in the Slack thread first using the `message` tool, wait for the user's reply, then implement.

**Never assume or guess when unsure. One focused question in the thread is better than building the wrong thing.**

```json
{
  "action": "send",
  "channel": "slack",
  "target": "channel:CHANNEL_ID_HERE",
  "threadId": "THREAD_TS_HERE",
  "message": "Before I start — could you clarify: [your question]?"
}
```

Once you have enough clarity, proceed with the workflow below.

---

## Every Task — Follow This Workflow

### Step 0: Check for existing PR (follow-up changes)

If the task includes `EXISTING_PR=<url>`, this is a follow-up change to an existing PR. **Do NOT create a new branch or PR.** Instead:

```bash
PR_URL="https://github.com/Walkover-Web-Solution/mushroom-website/pull/123"
PR_NUMBER=123
BRANCH=$(gh pr view $PR_NUMBER --repo Walkover-Web-Solution/mushroom-website --json headRefName --jq '.headRefName')

cd ~/.openclaw/workspace-mushroom-website
git fetch origin
git checkout $BRANCH
git pull origin $BRANCH
```

Then make changes, commit, and push. Skip to Step 3. Do NOT run `gh pr create`.

Reply with: "✅ Updated existing PR: <url>"

---

### Step 1: Pull latest from main and create a branch
```bash
cd ~/.openclaw/workspace-mushroom-website
git checkout main
git pull
git checkout -b <type>/<short-description>
```

### Step 2: Spawn the coding agent (always background mode)

**Claude Code (preferred):**
```bash
bash workdir:~/.openclaw/workspace-mushroom-website background:true command:"claude --permission-mode bypassPermissions --print 'TASK_DESCRIPTION. This is a Next.js (TypeScript, Tailwind, App Router) website. When completely done, run: openclaw system event --text \"Done: [one line summary]\" --mode now'"
```

**Codex (alternative):**
```bash
bash pty:true workdir:~/.openclaw/workspace-mushroom-website background:true command:"codex --full-auto exec 'TASK_DESCRIPTION. When completely done, run: openclaw system event --text \"Done: [one line summary]\" --mode now'"
```

Monitor progress:
```bash
process action:log sessionId:XXX
```

### Step 3: Commit and push
```bash
cd ~/.openclaw/workspace-mushroom-website
git add -A
git commit -m "type: short description"
git push -u origin <branch-name>
```

### Step 4: Create the PR targeting main branch
```bash
gh pr create \
  --repo Walkover-Web-Solution/mushroom-website \
  --base main \
  --title "type: short description" \
  --body "## What changed
<description>

## Why
<reason>

## Notes
<any assumptions or caveats>"
```

### Step 5: Reply with the PR link

---

## Branch Naming

| Type      | Prefix      | Example                              |
|-----------|-------------|--------------------------------------|
| Bug fix   | `fix/`      | `fix/mobile-nav-overflow`            |
| Feature   | `feat/`     | `feat/add-hero-section`              |
| Refactor  | `refactor/` | `refactor/cleanup-layout`            |
| Content   | `content/`  | `content/update-homepage-copy`       |
| Scaffold  | `feat/`     | `feat/initial-nextjs-scaffold`       |

---

## Tech Stack

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Package manager:** npm
- **Repo:** `Walkover-Web-Solution/mushroom-website`
- **Default branch:** `main`

---

## Rules

- Always branch off `main`, never commit directly to `main`
- PR must target `main` branch (use `--base main`)
- Never edit `.env` files
- Use TypeScript and Tailwind CSS for all new code
- Use App Router (`app/` directory) conventions — not the `pages/` directory
- You only have access to the `mushroom-website` repo — do not touch any other repository
- If the repo is empty, scaffold a full Next.js project before implementing the feature
