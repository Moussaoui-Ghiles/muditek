---
title: 13 Steps to Turn Reddit Into a Client Acquisition Channel With One Hermes Agent
status: approved
asset_type: long-form article
created: 2026-08-24
updated: 2026-08-24
tags:
  - gtm/outbound
  - gtm/demand-capture
  - agents/hermes
---

# 13 Steps to Turn Reddit Into a Client Acquisition Channel With One Hermes Agent

Reddit is the largest free source of buying intent that no outbound tool touches. There is a community for almost every problem a person can have, and the people in it describe that problem in public, in their own words, every day.

This guide gives you the complete build. You set up one Hermes agent, point it at a set of subreddits, and run it in one of two modes.

- **Mode one is for when you have nothing to sell yet.** The agent monitors the communities, finds the problem that comes up again and again, builds the guide that answers it, and deploys the landing page.
- **Mode two is for when you already have a product.** The agent learns your offer, finds the people describing the problem it solves, and has the reply written before you open the thread.

Both modes run on the same core, so you build once and point it at whichever you need.

One rule sits above everything else in this system: **the agent never logs into Reddit.** It reads, it writes, it queues the work with the link ready, and you do the clicking. That is not a limitation you work around. It is the reason the accounts survive.

## What the agent does and what you do

Split the work before you build anything, because the split is what keeps the account alive.

The agent owns the reading side and the drafting side. It pulls the feeds, keeps the history, maintains a written profile of each community, scores every match, writes the replies and the posts, and puts them on a dashboard with the link next to each one.

You own every action that touches the account. You open the dashboard, read what was drafted, and post it from your own browser in your own session. That takes ten to twenty minutes a day. What it buys you is that every action on the account came from a real person on a real session, which is the only version of this that survives.

It also means you read everything before it goes out.

## Why the agent never logs in

The reading side needs no login at all, because Reddit's feeds are public.

The acting side is where accounts get banned. Running automation through VPNs and rotating proxies feels safer and is the thing that gets accounts banned. The browser and network fingerprint gives the automation away no matter how careful the writing is.

So the agent drafts and queues. You post. Keep that boundary even when the queue is long.

## You do not need a scraper

Reddit publishes public RSS feeds and they still work. Add `.rss` to almost any Reddit URL and you get structured data back.

- **Posts** give you the title, the original poster, the link, and the body.
- **Comments** give you the username, the full comment, the post it sits on, a permalink straight to it, and a timestamp.

That is everything this system needs. No scraper, no API key, no third-party data vendor. The agent pulls the feeds directly.

There is a rate limit. It is approximately one request per minute from a single IP address, and you get an error if you go over. Sixty requests per hour is far more than this system needs. Tell the agent about the limit at setup and it will pace itself.

## The account you post from

You need an account that can actually post. A new account gets removed by AutoModerator before anyone sees it, because most subreddits worth being in check karma and account age first.

You have three options: use an old account you already own, buy an account with karma, or warm one up. To warm one up, comment about fifteen times a day in large general subreddits for two weeks, and answer things you actually know.

If you plan to run this across several niches, warm several accounts and keep them separate.

## What running this teaches you

This system trains marketing judgment, and it trains it by making you read the output every day.

You end up looking at a profile of a community that says: these are people in their thirties, who tried several things before this and got burned by two of them, who use this specific phrase for the problem and this other phrase for the solution. Then you watch which of your posts landed and which died, against that profile.

Do that for a month and you understand an audience better than most people who have worked in marketing for years.

It also repairs your writing. Every reply the agent drafts is written in the tone of the place it is going. After a few hundred of those, you stop writing like yourself and start writing like the person you are selling to. That skill transfers to everything else you ever sell.

So even if the first product does not work, you finish knowing how to pick the second one.

## Step 1. Set up Hermes

Everything below Step 1 is something you say to the agent in chat. Step 1 is the only part that is infrastructure.

Open Claude Code and give it this:

```
set up a hermes agent for me. here's the hermes site: https://nousresearch.com

- walk me through it step by step and tell me what you need from me
- it needs a telegram bot so it can message me, so tell me exactly how to get the token
- host it on railway
- give it persistent storage so it keeps files between runs
- when it's running, confirm it can message me on telegram before you finish
```

Persistent storage and Telegram are not optional extras. Storage is what lets the agent keep the community profiles and the collected history between runs. Telegram is how the agent reaches you when a posting window opens or a queued reply is about to go stale.

## Step 2. Point the agent at Reddit

Your first message to the agent teaches it the data layer:

```
i want you to monitor reddit for me.

- reddit's public rss feeds work without any api key. you can pull posts and comments from any subreddit by adding .rss to the url
- test it now and tell me what fields you can actually get back for both posts and comments
- the rate limit is about one request a minute from a single ip, so pace yourself and handle 429s by waiting rather than retrying immediately
- once you've confirmed it works, save this as a skill so you don't have to work it out again
```

The last line matters most. Hermes writes itself a reusable skill for Reddit monitoring, and every instruction after this one runs faster and more reliably.

Then give it the subreddits:

```
monitor these subreddits: [list].

- every 30 minutes, pull new posts and comments
- store them so you build up history rather than only looking at what's live
- for comments, keep the username, the text, the post it's on, the permalink and the timestamp
- tell me how much you're pulling and flag it if you're getting close to the rate limit
```

If you do not know which subreddits to watch, ask first:

```
i sell [product] to [who].

- name the subreddits where those people actually spend time, not the ones about my industry
- for each one tell me the member count, how active it is, and whether self promotion gets removed
- then rank them by how likely someone in there is to buy what i'm selling, and tell me which ones to skip and why
```

Expect the answer to include exclusions. A large general subreddit with no buying intent and a total promotion ban is a place to skip, and the agent should say so.

## Step 3. Build the subreddit profiles

A subreddit is a group of people with a shared situation. Two communities can look identical from the outside and contain completely different people. If you write for one in the voice of the other, the post gets no attention.

So the agent keeps a written profile of each community and updates it every day.

```
keep a markdown file for each subreddit you're monitoring. each one holds:

- demographics. rough age range, where they are, what they do for money, what stage they're at in whatever this community is about. infer it from what people say about themselves and mark anything you're guessing
- psychographics. what they want, what they're afraid of, how they see themselves, who they don't want to be associated with, what they're embarrassed about
- the words they use. the exact phrases that come up for the problem, for the solution, and for the things they've tried. quote them
- what they've already tried and what they said about why it failed
- what gets upvoted and what gets buried, with examples of both
- the rules of the place. what gets removed, what the mods are strict about, whether links are tolerated
- tone. how long posts usually are, how personal, whether they use headers, how people open a post
- an update log at the bottom

every night, read that day's activity and update the file. only change something if the new data actually contradicts or adds to what's there. append a dated line to the log saying what changed and why.

if you notice something shifting over time, say so explicitly. a new complaint appearing, a phrase people have started using, a rule that seems to be enforced harder than it was.
```

Two details carry the weight here. First, the agent must mark inferences as inferences instead of stating them as facts. Second, the update log makes drift visible: a new phrase appearing this week, or moderators removing product mentions faster than they did last week.

That file is the thing to read every morning. It is a live document about a few thousand people who might buy from you, written from what they actually said, and it gets sharper every day you leave it running.

Everything below reads from it.

## Step 4. Mode one, find the niche

This step is for when you do not have anything to sell yet. Skip to Step 7 if you already have a product.

Do not start from whatever subreddits you happen to be watching. Start by working out which kinds of people are desperate enough to pay for an answer, then monitor those.

```
find me niches where people are actively desperate for a solution, not just curious about a topic.

- i want problems that are urgent rather than aspirational, where people are already spending money trying to fix it and mostly failing
- for each one tell me what the problem is, who has it, what makes it urgent, what they're currently buying instead, and which subreddits they're in
- rank them by how easy it is to reach those people for free
- mark any where i'd need credentials or where getting it wrong would hurt someone
```

That last line matters. Plenty of desperate niches are ones you have no business selling into. You want those named rather than quietly included in the list.

Pick one, point the monitor at its subreddits, and let it run for a week before you look at anything.

## Step 5. Mode one, find the product

Now you are looking for the same question asked over and over. That repetition is the whole signal.

```
look at everything you've pulled in the last 30 days and find the problems that come up repeatedly.

- for each one, give me the problem in the words people actually used, how many times something like it appeared, and how frustrated they sound
- quote three real lines for each so i can see how they describe it themselves
- tell me what they've already tried and what they said about why it didn't work
- rank by how badly people want the answer, and tell me which ones people are already paying to solve
- if nothing in here is worth building for, say so instead of forcing something
```

The permission to return nothing is part of the instruction. An agent that always finds a product will invent one.

## Step 6. Mode one, build it and deploy it

```
build the guide for [problem].

- 25 to 30 pages. read the subreddit profile first and use its language section for how these people talk
- structure it as a process someone follows in order. for each step say what to do, why it works and what usually goes wrong
- address the things they said they'd already tried and explain why those failed for them
- no filler and no padding to hit a page count

then build a landing page for it at [price].

- the headline is the problem in their own words, taken from the profile
- then what's inside, specific rather than benefit language
- then who it's for and who it isn't
- then the buy section
- deploy it and give me the url. set up checkout (use whop) so the guide gets emailed on purchase
- no fake testimonials, no invented numbers, no 'join 2,000 readers' when there are none
```

The agent has storage and deploy access, so this is one instruction rather than a project. You get a URL back.

The headline rule is the important one. The headline is a line lifted from the community, not a line you wrote about your product. The exclusions section ("who this is not for") does more selling than any claim, because it tells a suspicious reader that the offer has edges.

## Step 7. Mode two, teach the agent the product

This step is for when you already have something to sell. It is also what mode one needs once the product exists.

```
create a product file and keep it updated. it holds:

- what the product is and what it costs
- the exact problem it solves, written the way a buyer would describe it
- who it's for and who it isn't for
- the specific things it covers
- what it doesn't do, so you never overpromise on my behalf
- the objections people raise and the honest answer to each
- three real quotes from the monitored subreddits that describe the problem this solves

read this file and the relevant subreddit profile before writing any post, reply or message.
```

That file is the difference between an agent that sounds like you and one that sounds like a bot. Spend an hour getting it right. The "what it does not do" section is what stops the agent from overpromising in public on your behalf.

## Step 8. Find the threads

```
search everything you've collected for posts and comments where someone is describing the problem my product solves, whether or not they use the same words for it.

- use the language section of each subreddit profile so you catch the phrasings that community actually uses rather than only the obvious ones
- for each match give me the link, what they said, how recent it is, and how directly it relates on a scale of 1 to 5
- flag anyone who is clearly looking for a solution right now rather than just complaining
- ignore anything older than a month, anything already answered well, and anything where replying would obviously be spam
```

That flag is what you want. Someone actively asking for a recommendation is a completely different conversation from someone venting. The scoring also gives you a threshold to automate against in the next step.

## Step 9. Queue the replies

This is the volume part of the system, and it is what the dashboard is mostly full of.

```
for each new match scoring 4 or above, write a reply and queue it.

- read the subreddit profile for wherever it's going and match its tone section exactly
- answer their actual question properly, using the product file for substance
- do not mention the product. do not link anything. the reply has to stand on its own as help
- match the length of the other replies in that thread
- no marketing language, no exclamation marks, and never start with 'great question'
- put each one on the dashboard with the direct link to that comment, so i can click through and paste it
- order them by how time sensitive they are. a thread from an hour ago goes above one from yesterday
- log what you skipped and why
```

No link and no product mention is not modesty. A reply that stands on its own as help is the only reply that survives moderation and the only one that makes a stranger check your profile.

## Step 10. Draft the posts

Posts are the traffic. Replies are the trust.

```
every morning, draft five posts across my subreddits.

- read the subreddit profile for the target community. use its tone section for the shape and its language section for the words
- give away the whole method with nothing held back. no link and no product mention
- end with a line offering to answer questions
- then tell me what about each post might get it removed in that subreddit, based on the rules section of the profile, and what to change if i want it to survive
- put them on the dashboard with the submit link for that subreddit next to each one
- tell me the best time to post in each subreddit based on when that community is actually active, and remind me on telegram when that window comes round
```

Five drafts a day is a selection pool, not a posting quota. Pick the two you would actually stand behind, click through, and post them.

The removal-risk review is the part people skip. A post that gets removed twenty minutes after it goes up costs you the traffic and moves the account closer to a ban.

## Step 11. Handle the direct messages yourself

When a post does well, people message you. That is where the money is.

The agent cannot see any of this. Direct messages are not public, so there is no feed for it.

Block out time and answer them yourself, or pay someone to do it. It is not wasted time. These are the conversations that turn into sales, and what people write in them is the best market research you will get. Paste the good ones back into the subreddit profile yourself.

## Step 12. Build the two dashboards

Two dashboards, one per mode, and the agent updates them once a day.

```
build me two dashboards and host them. update them each morning.

the first one is for finding the product:
- what's coming up in my subreddits this week, ranked by how often it appeared, with the real quotes underneath
- what changed in the subreddit profiles

the second one is for selling:
- everything ready to send, each with the full text, a copy button, and a direct link to the thread or the submit page, sorted by how time sensitive it is
- underneath that, what i've already sent so i don't do the same thread twice
- and the account health

if something happens that doesn't fit either page, add a section rather than leaving it out.

keep them plain and on one page each.
```

The "already sent" list is what stops you from replying twice in the same thread. The last instruction is what keeps the dashboard honest over time. When an account gets its first removal, or a subreddit changes its rules, that shows up as a new section instead of disappearing.

## Step 13. Put it on a schedule

```
from now on, run this on a schedule.

- every 30 minutes: pull new posts and comments from my subreddits
- through the day: find new matches and queue replies for them
- every night: update the subreddit profiles from that day's activity
- every morning: draft five posts, queue them, and update both dashboards
- weekly: run the problem analysis and tell me what's changed in what people are asking for

message me each morning with what's waiting and a link to the dashboard. ping me again when a posting window opens for a subreddit that has a post queued, and if a queued reply is about to go stale.
```

After this, the loop is: you open the dashboard, work down the list clicking and pasting, and skip whatever does not look right.

## Which model does which job

Running one model for all of it is how the cost gets away from you. Route by volume and by whether the output is visible in public.

| Job | Model | Why |
| --- | --- | --- |
| Orchestration and order of work | Claude Opus 5 | It is what Hermes runs on and what decides the sequence |
| Reading the feeds and matching | Claude Haiku | High volume, low difficulty |
| Writing posts and replies, maintaining the subreddit profiles | Claude Sonnet | This is where quality is visible in public |
| Reading at volume, such as thousands of comments for patterns | Gemini 2.5 Flash | Built for large-volume reading |
| Building the landing page and the dashboards | Kimi K3 | Build work, not judgment work |

The rule behind the table: cheap models for reading, strong models for anything a stranger will judge you on.

## What it costs

The RSS feeds are free, which is the main thing.

The matching runs on Haiku across a lot of text, which stays cheap. The post and reply writing runs on Sonnet at roughly fifty generations a day, which is small. Railway hosting for the agent and the dashboards is a few dollars a month.

That puts the whole system well under $100 a month, and the only variable that scales is how many subreddits you watch.

Treat that figure as the model, not as a measurement of your own setup. It assumes free feeds, the model routing in the table above, and a single-digit number of monitored subreddits. Check it against your own token usage in the first week.

## Where to start

One subreddit and one product.

If you do not have a product, let the agent collect for a week before you look at anything.

If you do have one, get the product file right first. Everything downstream reads from it.

Read the subreddit profile every morning. That file is the actual product of this whole system. The money follows from understanding those people.
