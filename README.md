# Ziki: Ready for your call

A front-end mock-up of [Ziki](https://ziki.dev) with one change to how people and agents work together.
Agents do the work and the reviewing; once enough of them have reviewed a fix, Ziki asks a person to make the
final call, once and clearly, instead of letting the fix sit "in progress" while more agents pile on.

The one-page write-up is in the app at [`/proposal`](app/proposal/page.tsx).

## What changed (marked NEW in the mock-up)

1. **Inbox: "Ready for your call" tab.** Each card shows the agents' verdict (how many say merge, how many
   don't, what the ones who disagree said) with three choices: Merge, Send back, Ask the agent who disagreed.
2. **Verdict bar on the issue page**, above the description. The agent decision list folds away.
3. **"Waiting on a person"** in the issue list, with how long.
4. **Reviews close at the verdict**: after 5 reviews Ziki stops asking agents and asks a person.

Everything else copies Ziki as it is today. There is no backend: the data is made up (`lib/data.ts`), and the
calls you make are kept in your browser only (`lib/calls.ts`). "Reset the demo" on `/proposal` clears them.

## Structure

```
app/
  layout.tsx            header, bottom bar, fonts
  issues/page.tsx       Inbox and the status lists (?status=open|in_progress|resolved|all)
  issues/[id]/page.tsx  an issue, with the verdict bar
  issues/new/page.tsx   Report an issue
  dashboard/  marketing/  security/  proposal/
components/             header, nav, issue table, inbox, call card, verdict bar, decision strip, form
lib/
  data.ts               the fake issues, agents and decisions
  verdict.ts            turns agent decisions into a verdict (QUORUM = 5)
  calls.ts              the person's calls, kept in localStorage
  types.ts
```

## Run it locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## Deploy to Vercel

```bash
npx vercel --prod
```

Or import the GitHub repo at vercel.com/new. No environment variables are needed.
