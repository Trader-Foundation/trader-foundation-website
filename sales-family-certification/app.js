"use strict";
/* Trader Foundation | Sales Family Certification exam engine.
   Served as a PLAIN TEXT static file on purpose. Earlier builds shipped this
   engine as a compressed binary (app.bin) and the upload path corrupted the
   binary every time. Keep this file plain text. */
var CERT_VERSION = "2026-08-07-coach-r1";

var MAX_ATTEMPTS = 3, PASS_PCT = 0.8, FAST_MINUTES = 12;

/* Question bank. 64 questions: 42 in Part One, 22 in Part Two. Later additions
   are APPENDED at the end rather than inserted, whatever their part, so that a
   question's index never shifts again: stored results reference questions by
   index, and the one insert that did shift them (the Aug 4 lesson) is undone
   for old records by decodeBi below.
   mc questions: two stems (retakes serve the other phrasing), first option is
   correct (c: true), positions shuffle at render time.
   tf questions: two variants with reversed polarity, retakes serve the other.
   Wrong answers are written long on purpose so answer length signals nothing. */
var BANK = [

/* 1 */ {part:1,type:"mc",stems:[
"Which answer correctly describes our two strategies, how the Paycheck Collector makes money, and how that differs from the way most people lose money with options?",
"A prospect wants to understand what we actually trade. Which answer gets our two strategies right, including how the Paycheck Collector earns and why that is the opposite of how most people lose with options?"],
opts:[
{t:"A swing trading strategy that builds income, building toward the Paycheck Collector where money compounds. The Paycheck Collector sells options to collect premium, so money goes into the account upfront with a low probability of losing it. Most people lose the opposite way: day trading options, including zero DTE trades that expire the same day, all or nothing.",c:true},
{t:"Day trading and crypto. The Paycheck Collector works by buying cheap calls ahead of big moves so a small account can multiply quickly, and the reason most people lose with options is that they play it too cautious and take profits too early instead of letting winners run. The coaches call it stacking momentum: catch the morning move, take the profit by lunch, and let the account snowball from daily wins instead of waiting around on slow monthly trades."},
{t:"Futures and forex. The Paycheck Collector is our alert system, where coaches send out the exact trades they are taking and students copy them in their own accounts, and most people lose with options because they trade their own ideas instead of following the alerts."},
{t:"One buy and hold portfolio that the coaches manage for each student. Money compounds through long-term positions the team selects, and most people lose with options because active trading of any kind is a losing game compared to letting professionals hold positions for you."}]},

/* 2 */ {part:1,type:"mc",stems:[
"A prospect asks, \"So are we going to be using Robinhood? What platform do you use?\" What is the trained answer?",
"\"What broker or platform does this run on, Robinhood?\" a prospect asks. What is the trained answer?"],
opts:[
{t:"We start with ThinkOrSwim because it lets us back-test and paper trade options, like a time machine to test trades. Once you learn it, we do not push you to stay. Coaching will walk you through Robinhood, Fidelity, or whatever you prefer.",c:true},
{t:"We run everything through Robinhood because it is the platform most people already have on their phone, and keeping the whole program on one simple app means nobody gets lost learning complicated software in their first week."},
{t:"You can use absolutely anything you want from day one. We have no standard platform and no preference, because the strategy works the same everywhere and the software you pick has no real effect on how you learn."},
{t:"I am actually not allowed to get into platforms or software before your call, because that counts as personalized guidance. Steve handles all of those questions once he has looked at your situation on the strategy call."}]},

/* 3 */ {part:1,type:"mc",stems:[
"What is the core differentiator of the program, and what does Trader Foundation actually teach?",
"If you had to name the one thing that separates this program, plus what the teaching itself is, which answer is right?"],
opts:[
{t:"Unlimited one-on-one coaching, teaching pattern recognition and risk management. It is not a course you watch and forget, we do not send signals, and we do not trade the account for the client. The goal is self-sufficiency.",c:true},
{t:"The lowest price point on the market for what you get. The teaching itself centers on news trading and earnings plays, because those are the moments the market actually moves and where the fastest money gets made."},
{t:"The coaches place the trades directly in the student's account, so the student never has to learn entries or exits at all. What we really teach is hands-off investing, letting the team handle it while the student watches it grow."},
{t:"A private group chat with the whole community, teaching a set of proprietary indicators that predict where the market goes next. The edge is in the tools, so once a student has the indicators the results follow on their own."}]},

/* 4 */ {part:1,type:"mc",stems:[
"A prospect with a full-time job asks how much time the program takes. What is the trained answer?",
"\"I work full time. How many hours does this actually take?\" What is the trained answer?"],
opts:[
{t:"About a 45-minute coaching call once a week, and roughly three to five hours a week total. Calls schedule Monday through Friday during trading hours, and we have weekend coaching available, so time should never be the issue. The program was designed so people with jobs have no excuses.",c:true},
{t:"To do this properly you need eyes on the market for several hours every trading day, especially the open and the close, so most of our working students end up watching charts at their desk through the day until it becomes second nature."},
{t:"There is genuinely no set structure and no schedule at all. You put in whatever time you feel like, whenever you feel like it, and the program bends around that completely, so the time question really has no fixed answer."},
{t:"Plan on ten hours a week at an absolute minimum, and that number is written into the agreement, because putting in less than ten hours voids the guarantee and the coaches are required to log your time each week."}]},

/* 5 */ {part:1,type:"mc",stems:[
"A prospect says, \"I have $5,000, but it is sitting in a 401k from my old job. Can I even use that for trading?\" What is the correct answer?",
"\"My money is in a 401k from a previous employer. Is it stuck there or can I trade with it?\" What is the correct answer?"],
opts:[
{t:"Yes, a 401k from a previous employer is yours to move. The specific move is a rollover into your own account, like an IRA, it is quick, and a proper rollover is not a cash-out, so it does not trigger the taxes and penalties an early withdrawal would. It is something we walk students through. A 401k at a current job generally has to stay in that plan while you work there.",c:true},
{t:"No, unfortunately a 401k is locked until retirement age no matter what, even one sitting at an old employer, so that money cannot be touched for trading and the account would have to be built from fresh savings instead."},
{t:"Only if the old employer signs a release form first. The company that sponsored the plan keeps a legal hold on the money, so the move starts with a request to their HR department and usually takes a few months to clear. It works like transferring a pension, and HR departments process these requests all the time, so the honest answer is that the money is reachable, just not on any timeline that helps a trading conversation this month."},
{t:"Yes, but money coming out of a 401k can only be used to pay for the program itself, not as trading capital, because retirement funds carry restrictions on the kinds of accounts they are allowed to be invested through."}]},

/* 6 */ {part:1,type:"mc",stems:[
"Why does the marketing use a $15,000 capital number, and how should capital be qualified on a live setting call?",
"What is the $15,000 capital figure in the marketing actually for, and where does capital qualification belong in the setting process?"],
opts:[
{t:"It is a standard that filters for serious people, not a starting requirement. Students can start with less, for example with swing trading. On the call itself you do not ask \"do you have $15,000 sitting in an account.\" The survey and the texts do the awkward capital qualification, where there is less emotion involved.",c:true},
{t:"It is the price of the program, and the reason it is in the marketing is so nobody gets surprised on the call. Your job on the phone is confirming they have the full amount ready before the Education Coordinator invests an hour in them. That is also why the number sits in the ads: prospects who cannot handle seeing it upfront were never getting past the strategy call anyway, so the marketing does the disqualifying for you."},
{t:"It is the legal minimum the brokerages require before anyone can open an options account, and there is a short disclosure you are required to read on the call before any conversation about their capital can go further."},
{t:"Every student deposits $15,000 into their trading account on day one, that is simply how the program works, so you ask the number directly on every call and anyone who hesitates about having it ready gets disqualified on the spot."}]},

/* 7 */ {part:1,type:"mc",stems:[
"What are the current program tiers, and what number should never be confused with them?",
"Name the current tiers correctly, plus the separate number they are most often mixed up with."],
opts:[
{t:"Six Months $6,800, One Year $10,000, Lifetime $15,000. The $15,000 capital standard used in marketing is a separate number, what the strategy calls for, not a price, and the two must never be mixed up on a call.",c:true},
{t:"Elite Four at $4,000 and Elite 12 at $12,000, the pair of packages on the current price sheet, with Elite 12 carrying the lifetime coaching and Elite Four built as the starter program most new students choose first."},
{t:"A single flat price of $6,800 for everyone. The program deliberately has one number and no tiers, which keeps the conversation simple and means the only decision a prospect ever makes is yes or no, never which package."},
{t:"A monthly membership at $259 that runs as long as the student wants coaching, with no long-term tiers at all. It keeps the barrier low, and the $15,000 figure in the marketing is simply what that membership adds up to over the years."}]},

/* 8 */ {part:1,type:"mc",stems:[
"What are the three Cs every set call must accomplish, and how is a setter graded on them?",
"Name the three Cs of a set call and the two things a setter is actually graded on."],
opts:[
{t:"Coordinator, Call, Content: sell who they are meeting, why this call matters for them, and why to watch the videos. Grading is show rate plus preparation. 60 to 70 percent show rate is healthy, 30 percent is on the setter, and 100 percent is not automatically good because the job is fit, not volume. A prospect who watches the videos and weeds themselves out is a win, and a prospect who shows unprepared turns the Education Coordinator back into a setter.",c:true},
{t:"Capital, Credit, Commitment: confirm the money is there, make sure financing can pass, and lock in the decision maker. A setter is graded on bookings per day, because volume on the calendar is the one number the company can actually manage to."},
{t:"Confirm, Calendar, Close: confirm the contact information, get the slot on the calendar, and close them on showing up. Grading runs on talk time per call, since longer conversations reliably produce better prospects than quick ones."},
{t:"Care, Curiosity, Cash: show them you care, get them curious, and check for cash. The grade is purely how many prospects show up, because a show is a show, and the more bodies on the Education Coordinator's calendar the better the week. Care opens them up, curiosity gets them leaning in, and the cash check protects the calendar. It is the oldest sequence in phone sales, and shows are the only grade because everything upstream of a show is invisible: nobody can measure how warm a conversation felt, but everybody can count who showed up."}]},

/* 9 */ {part:1,type:"mc",stems:[
"A prospect asks what is actually in the pre-call videos. Which answer describes them correctly?",
"\"What is in these videos you want me to watch?\" Which answer describes the pre-call videos correctly?"],
opts:[
{t:"The videos walk through what we actually trade and how the strategy works, what kind of capital it takes, how to think about time if your schedule is full, and what happens if things do not click right away. Basically every question you would normally spend the first half of the call asking, answered before you sit down.",c:true},
{t:"They are essentially a recorded version of the sales presentation along with the full price list, so the prospect arrives already pitched and the Education Coordinator only has to take the order instead of explaining anything."},
{t:"Live market commentary updated every morning before the open, so whenever a prospect watches, they see the coaches reading that day's charts in real time and can judge for themselves whether the calls are accurate. That is why the links expire and why we push people to watch the night before instead of days ahead, since stale commentary would leave a worse impression than no video at all."},
{t:"Student interviews from start to finish, story after story, with no strategy content at all. Proof sells better than teaching, so the videos stay entirely on results and leave every explanation for the strategy call itself."}]},

/* 10 */ {part:1,type:"mc",stems:[
"You have sold the prospect on watching the pre-call videos. What is the trained move to turn that into a real commitment?",
"The prospect is excited about the videos. How do you convert that excitement into a commitment that actually predicts a show?"],
opts:[
{t:"Once they are excited about the videos, pin down when: \"Your appointment is tomorrow at two. Are you watching tonight or in the morning?\" Then ask them to text you two sentences after they watch. That is accountability, and it also tells you who is a real fit before the Education Coordinator spends an hour.",c:true},
{t:"Send the link right after you hang up, then set yourself a reminder to call the next day and check whether they watched. Pushing too hard on the first call comes across as desperate, so the follow-up call is where the real accountability happens."},
{t:"Tell them clearly, more than once if needed, that watching is mandatory and the appointment gets canceled if they show up without having seen the videos. People respect a hard requirement far more than they respect a soft suggestion."},
{t:"Frame it as completely optional and ask them to watch only if they happen to have spare time, so you never come across as pushy. The prospects who are meant to become clients will watch on their own without any pressure from you."}]},

/* 11 */ {part:1,type:"mc",stems:[
"A prospect tells you she is brand new, has never traded, works a nine to five, and wants out of the rat race. Which introduction of Steve applies the specialist frame correctly?",
"Brand new prospect, never traded, nine to five job, wants out of the rat race. Pick the introduction of Steve that uses the specialist frame the way we were trained."],
opts:[
{t:"What is cool about Steve is he specializes in people who have never done this before, someone who does not even know what a stock is. He builds that foundation step by step, and he will show you exactly how to do it in your spare time around a nine to five, since we do not day trade.",c:true},
{t:"You will be meeting with Steve. He is our VP, he has been doing this for years, and honestly he is great, one of the best people in the company, so you are in really good hands on that call and I think the two of you will get along."},
{t:"Steve is one of our Education Coordinators. His whole job is to look at your situation, walk you through how the program is structured, and map out which of our options would actually make sense for where you are starting from."},
{t:"Steve helps people like you every single day, brand new folks with regular jobs who want out of the rat race, so there is truly nothing to be nervous about, he has seen your exact situation more times than either of us could count."}]},

/* 12 */ {part:1,type:"mc",stems:[
"Why is the phrase \"people like you\" banned when introducing the Education Coordinator?",
"The phrase \"people like you\" is off limits when you introduce Steve. Why?"],
opts:[
{t:"Because \"that is me\" has to be the conclusion the prospect draws in their own head. You paint who Steve specializes in using their own situation and let them connect it. Saying it for them kills the effect.",c:true},
{t:"Because it is too casual for a first conversation with a stranger. The specialist frame depends on formality and authority, and overly familiar phrasing lowers Steve's status before the prospect has ever met him, which weakens the handoff."},
{t:"Because compliance prohibits comparing one prospect to another in any form. Describing who else Steve works with edges into sharing client information, so the rule keeps every conversation strictly about the person on the phone."},
{t:"Because prospects find it flattering, and a flattered prospect relaxes and stops paying close attention to the call. You want them slightly on edge and listening carefully, not feeling like they have already been accepted."}]},

/* 13 */ {part:1,type:"mc",stems:[
"Why must you explicitly explain that the appointment is a Zoom call, not a phone call?",
"The script requires spelling out that the appointment is a Zoom, not a phone call. What is the reason behind that rule?"],
opts:[
{t:"Because prospects were treating the Zoom link like a phone call, and at one point not a single person was joining the Zoom. You tell them a ring is coming, it is a Zoom, be at a computer, camera on, somewhere quiet, and confirm they know how to use Zoom.",c:true},
{t:"Because Zoom records every session automatically and the company needs that recording for compliance. A phone call leaves no record, so every appointment has to happen somewhere the conversation can be stored and reviewed later."},
{t:"Because phone calls are simply not allowed under company policy for anything past the first conversation. Every meeting after the setting call happens on video with no exceptions, and booking one as a phone call is a write-up."},
{t:"Because Zoom appointments count double toward the setter's show rate in the weekly grading, so spelling out the Zoom details protects your own numbers. A prospect who shows by phone instead only counts as half a show."}]},

/* 14 */ {part:1,type:"mc",stems:[
"On a setting call the prospect pushes: \"Just tell me, how much does this cost?\" What is the trained move, and what is the risk if you drop the number?",
"A prospect demands the price before the strategy call. What do you do, and what actually goes wrong if you say the number?"],
opts:[
{t:"Do not drop the price. Acknowledge the question, let them know it is an investment, and reframe to the Education Coordinator, who reviews their exact situation and builds the custom game plan where pricing can be justified. Dropping the number flips the frame: you end up defending a price with no value built, the number is the only thing in their head until the call, and the Education Coordinator loses his leverage before he says hello.",c:true},
{t:"Quote the full price right away so there are no surprises later. Hiding the number is what makes people suspicious, and if you say it confidently and stand behind it there is no real risk, because serious buyers respect directness about money."},
{t:"Quote the lowest tier only, as a friendly anchor. It puts a real number on the table so they stop pushing, it will not scare anyone off, and the Education Coordinator can always walk them up to the right package once value has been built. A prospect who hears the smallest number first has a working figure to plan around, nobody feels ambushed on the strategy call, and if they could never afford even the entry tier you just saved Steve an hour, which is half the reason setters exist."},
{t:"Say \"it is honestly not that expensive\" compared to what they would lose trading alone, then move the conversation along to the videos. Softening the number without saying it keeps the price question handled and the momentum going."}]},

/* 15 */ {part:1,type:"mc",stems:[
"A skeptical prospect asks about the guarantee. How do you frame it, and why does that framing work on serious buyers?",
"\"So what is this guarantee?\" a skeptical prospect asks. Which framing is trained, and why does it land with money?"],
opts:[
{t:"Lead with the catch, told straight: you have to put in the work. Do the coaching sessions, place the trades the way we show you, do the homework, show up to live sessions. It is in the agreement you sign, and honestly, we have never had to use it. This works because people with money hear a too-good claim and immediately hunt for the catch. Naming it first is the transparency that earns the listen, while empty hype mostly attracts broke buyers.",c:true},
{t:"Tell them there is literally zero risk on their end and leave it there. Reassurance is what closes people, and the less fine print you get into on the phone, the fewer reasons the prospect has to hesitate before the strategy call."},
{t:"Tell them plainly that it means they will make money with us. Confidence is what sells, the guarantee exists precisely so reps can say that sentence, and walking it back with conditions only waters down the strongest card in the deck."},
{t:"Steer around the topic whenever you can, because talking about guarantees plants the idea of refunds in the prospect's head. If they bring it up, keep the answer to one vague sentence and get back to the parts of the offer that excite them. The rule of thumb is that whoever dwells on the guarantee is the one picturing failure, and you never want a prospect picturing failure on a setting call. Every extra sentence spent there is a sentence spent teaching them how to ask for their money back."}]},

/* 16 */ {part:1,type:"mc",stems:[
"A prospect says, \"I have been burned before. Show me proof anyone actually profits.\" What is the strongest trained response?",
"A prospect was scammed by a different program and wants proof before going further. What is the strongest trained response?"],
opts:[
{t:"Point them to the specific video where Vlad goes over the good, the bad, and the ugly: the Trustpilot reviews including the one-star review, the Better Business Bureau A+ rating, even the dispute record. Frame it before sending: \"he covers the bad stuff too.\" A wealthy skeptic opens Trustpilot and reads the one-star reviews first, which is exactly why we address the negatives ourselves. Then back it with student interviews, screenshots on the confirmation page, and students willing to speak with them.",c:true},
{t:"Tell them straight that we are legit and they just have to trust us on that. Overexplaining to a skeptic reads as defensive, and the confidence of not needing to produce proof is itself the strongest proof you can offer on a phone call."},
{t:"Promise them they will be profitable within 90 days, because a concrete timeline with a real number attached is exactly the proof a burned prospect is asking for, and it shows the company is willing to put a stake in the ground. Vague reassurance is what the last program gave him, so the trained counter is specificity: a number, a date, and a consequence. It separates us from every guru who never commits to anything, and the people who were hurt the worst respect it the most, because it is the first time anyone put real skin in the game for them."},
{t:"Tell them respectfully that this level of skepticism usually means someone is not a fit for coaching, and end the call. A prospect who needs convincing at this stage will need convincing at every stage, and that is not a client we want."}]},

/* 17 */ {part:1,type:"mc",stems:[
"A prospect asks, \"What company is this, and where are you registered?\" Which answer is fully correct?",
"\"Who exactly am I dealing with here? Where is the company registered?\" Which answer is fully correct?"],
opts:[
{t:"Trader Foundation LLC, registered in Pennsylvania. We have been in business over six years, served over 1,200 clients, and hold an A+ rating with the Better Business Bureau.",c:true},
{t:"Trader Foundation LLC, registered in New Jersey, in business for about two years now and growing fast. The registration details live on the website, so anyone who wants the paperwork can pull it up while you are on the phone."},
{t:"I am actually not able to share company details like registration before your call, since that is the kind of question the Education Coordinator covers once he knows your situation. What I can tell you is that you are in good hands."},
{t:"Trader Foundation, registered in Delaware like most companies of this size, since that is where the legal advantages are. The company has been around a while, and the reviews online speak louder than any registration paperwork could."}]},

/* 18 */ {part:1,type:"mc",stems:[
"Who is who at Trader Foundation?",
"A prospect asks about the people behind the company. Which answer has the roles right?"],
opts:[
{t:"Vlad Tayman is the founder. Steve is the VP and an Education Coordinator who runs the strategy calls. Erin is a student turned coach turned partner, and she is the face of the pre-call videos. Leo and Elliot are coaches, with weekend coaching available.",c:true},
{t:"Erin is the founder, and she built the program around her own trading story. Vlad is one of the coaches students meet after enrolling, and Steve runs the marketing side, which is why his name is on so much of the material."},
{t:"Steve is the founder and the face of the company, which is why the big call is with him personally. Vlad handles the day-to-day coaching calls behind the scenes, and Erin manages scheduling and the student support inbox."},
{t:"Everyone works as an independent contractor without defined roles, and people rotate between coaching, sales, and content depending on the week. That flexibility is part of the culture, so there is no fixed answer to who does what."}]},

/* 19 */ {part:1,type:"mc",stems:[
"A prospect says, \"Honestly I want to trade crypto, not options.\" What is the trained answer?",
"\"I am really more of a crypto person, options are not my thing.\" What is the trained answer?"],
opts:[
{t:"We teach the foundation of trading, and options is our vehicle, but the foundation transfers. Trading psychology and the indicators are the same across markets. We have students and even a coach who trade futures, and students who trade crypto. With a bad foundation you lose no matter what you trade, so we unlock the foundation and you pick your vehicle.",c:true},
{t:"Be honest with them: this is strictly an options program, so if crypto is what they want, this is not for them. Bending the offer to fit what someone wants to hear is how you end up with a client who quits inside the first month. The cleanest sales floor is one where every client got exactly what the marketing promised, and a crypto person talked into an options program is a refund waiting to happen, so respect what they asked for and let them go find it."},
{t:"Tell them the truth as the company sees it, which is that crypto is gambling and anyone serious about their money should not touch it. Part of the setter's job is protecting prospects from the mistakes they walked in wanting to make."},
{t:"Let them in on the fact that we actually teach crypto too, we just cannot put it in the advertising for legal reasons. Once they are inside the program, the coaches work with whatever market the student really wants to trade."}]},

/* 20 */ {part:1,type:"mc",stems:[
"Why does a setting call fail when the script is read word for word at speed?",
"A rep says every correct word on the call, straight off the page, and the prospect still does not show. What explains it?"],
opts:[
{t:"Roughly 80 percent of communication is body language and voice tone. You can say every correct word and still land as a robot, and a prospect who feels processed does not show up. The script is an outline, not a page to read, and the standard is extemporaneous: your words, our concepts.",c:true},
{t:"Because scripts are actually against company policy on live calls. The trainings hand out scripts only as study material, and a rep caught reading one word for word to a real prospect gets coached off the team fairly quickly."},
{t:"Because prospects can genuinely hear it: the flat rhythm, pauses in the wrong places, even pages turning. The moment they detect a script they assume boiler room and hang up, no matter how good the words themselves are."},
{t:"It does not fail, and that is the trick of the question. Reading the script exactly as written is the standard, because the words were tested across hundreds of calls, and the reps who improvise are the ones whose show rates collapse."}]},

/* 21 */ {part:1,type:"mc",stems:[
"A prospect tells you: \"I will be honest, I am a little hesitant. I have heard options are dangerous and people lose a lot of money with them.\" Which response is trained?",
"\"Everyone says options are how people blow up their accounts, and options is what you do.\" Which response is trained?"],
opts:[
{t:"You are right to be careful, options can absolutely be dangerous without proper guidance, and a lot of people do lose money. That usually happens when people day trade options with no foundation. It is exactly why the call with Steve exists: he shows the safer approach we teach, step by step.",c:true},
{t:"Options are not actually dangerous at all, that reputation is a myth spread by people who never learned them properly. Once you understand what you are doing there is nothing to be afraid of, and the fear itself is the only real risk."},
{t:"Take the concern head-on with real mechanics: walk them through how selling a vertical credit spread caps the risk on both sides of the trade, so they can see mathematically that the danger they heard about is handled by the structure."},
{t:"Reassure them that with our system and our coaches watching over every trade they are not going to lose money, so there is nothing to be nervous about. The whole point of paying for guidance is that the downside gets handled for you."}]},

/* 22 */ {part:1,type:"mc",stems:[
"On a setting call the prospect interrupts: \"Look, before I get on any Zoom, just tell me straight. How much does this cost?\" Which reply is trained?",
"\"I am not booking anything until you tell me the price.\" Which reply is trained for a setting call?"],
opts:[
{t:"Totally fair question, and I will be straight with you: it is an investment, and I am not going to throw a number at you, because it would not mean anything yet. Steve looks at your exact situation and builds a game plan around it, and that is where the options and pricing that actually fit you get covered, where he can walk you through what you would be getting for it.",c:true},
{t:"It is $6,800, and I will be straight with you about why it is worth it: we hold an A+ rating, we have served over a thousand clients, and the coaching is unlimited, so compared to what people lose trading alone it pays for itself. Transparency on the number is what separates us from the programs that burned people, and once it is out there the rest of the call stops being a chase and becomes a real conversation about fit, which is all the strategy call was ever going to be anyway."},
{t:"It is really not that expensive, and most people are pleasantly surprised when they hear the details. I would rather not spoil the breakdown Steve walks through, but I can tell you the number is not going to be the problem here."},
{t:"I am not allowed to talk about money at all on this call, that is company policy, so you will have to hold that question for the strategy session. What I can say is that nobody has ever told us the program was not worth it."}]},

/* 23 */ {part:1,type:"mc",stems:[
"A prospect says: \"I tried day trading futures for a year, blew up two accounts, and I think my problem is I do not follow my own rules.\" Which introduction of Steve uses the specialist frame correctly?",
"A prospect who blew up two futures accounts and admits he breaks his own rules is booking a call. Pick the introduction of Steve that applies the specialist frame."],
opts:[
{t:"Honestly, you are going to like Steve, because his specialty is people who have actually traded before, tried the aggressive stuff, and lost accounts because there was no real structure or rules holding it together. He shows the safer way to rebuild from a real foundation, and that call is going to be built around exactly what you just told me.",c:true},
{t:"Steve helps people like you get back on track every single day, traders who went too aggressive and paid for it, so your story is nothing new to him and there is no reason to feel embarrassed about any of it on the call. Normalizing the losses is the whole play with an experienced trader, because shame is the real objection under the surface, and a prospect who stops feeling judged is a prospect who shows up ready to listen."},
{t:"Steve is our VP, and he is genuinely one of the best people you will ever get on a call with. I will not spoil what he covers, but you two will get along, and I think you will walk away glad you took the meeting."},
{t:"Wow, two accounts, that is rough, but it is fixable. Steve will straighten out your discipline problem, he has a whole system for people who cannot follow their own rules, and by the end of the call you will know exactly what went wrong."}]},

/* 24 */ {part:1,type:"tf",vars:[
{s:"If a prospect praises the program they are currently in, the right move is to point out what is wrong with that program.",a:false},
{s:"If a prospect praises the program they are currently in, the right move is to ask what they like about it, then what could be better, so the negatives come from them.",a:true}]},

/* 25 */ {part:1,type:"tf",vars:[
{s:"When sharing a standout student result, you must make clear that results like that are not promised and are not the typical outcome.",a:true},
{s:"As long as a student result is real, you can share it without any disclaimer about typical outcomes.",a:false}]},

/* 26 */ {part:1,type:"tf",vars:[
{s:"No matter what happens on the call, even if the prospect is not a fit, they receive our beginners course at no charge just for taking the time, and it is the same course our paid clients get.",a:true},
{s:"Only prospects who enroll in the program receive the beginners course.",a:false}]},

/* 27 */ {part:1,type:"tf",vars:[
{s:"Personality and care transfer through text just as well as they do on a phone call, so a thorough text exchange can replace the confirmation call.",a:false},
{s:"Texting is not talking: personality and care do not transfer through text, which is why the confirmation call carries the relationship.",a:true}]},

/* 28 */ {part:1,type:"mc",stems:[
"Describe our ideal person. Which answer names what actually matters most in a prospect?",
"A trainer asks you to describe the avatar we are looking for. Which answer matches how the company defines it?"],
opts:[
{t:"Coachable first, so they are not coming in to run the show themselves. Then genuinely qualified, meaning they have money to trade with. And able to give about three hours a week to show up consistently.",c:true},
{t:"Anyone at all who says they want to learn trading, because willingness to learn is the only filter that really matters and the money side tends to sort itself out on its own once somebody is excited enough about the opportunity in front of them."},
{t:"Someone who already trades actively and knows the platforms well, because an experienced trader needs less hand holding from the coaches and will get to a profitable result far faster than a total beginner ever could."},
{t:"Someone with a completely open schedule and no job to work around, because the program only works for people who can sit at the screen through every session live rather than catching the recordings later in their own time."}]},

/* 29 */ {part:1,type:"mc",stems:[
"A prospect asks what results you actually promise. What is the trained answer?",
"\"So what am I actually going to get out of this?\" What does the company promise, and what does it deliberately not promise?"],
opts:[
{t:"No profit is promised. Show up consistently and you should be placing a trade on your own inside about a week, and the goal is being self-sufficient by around ninety days, with the coaches still there after that.",c:true},
{t:"That they will replace their current income within ninety days, because that is the timeline the coaching is built around and it is the outcome the great majority of students reach once they commit to following the strategy properly."},
{t:"A specific monthly return once they are running the Paycheck Collector, since the strategy is risk averse enough that the figure holds up, and quoting a real number is what makes the value of the program land for a prospect."},
{t:"That the coaches will place trades in their account for the first ninety days while they learn by watching, and after that they take the wheel themselves with the coaching team continuing to monitor every position they open."}]},

/* 30 */ {part:1,type:"tf",vars:[
{s:"If a prospect wants proof we are not a scam, pointing them to our Google reviews is fine, because that is one of the places our rating is published.",a:false},
{s:"Our public rating lives on Trustpilot and the Better Business Bureau, so sending a skeptical prospect off to find Google reviews points them at something that is not there.",a:true}]},

/* 31 */ {part:1,type:"mc",stems:[
"Early on a setting call the prospect asks, \"How much does this cost?\" What are the two words you answer with, and what comes next?",
"A prospect leads with the price question before you have learned anything about them. What is the trained response?"],
opts:[
{t:"\"It depends.\" Then say it depends on a few things, and ask if they mind you asking a couple of questions so you can work out what it would look like for them. That hands the conversation back to you and earns the right to qualify.",c:true},
{t:"Give them the range the packages fall into straight away, because being upfront about money builds trust faster than anything else, and a prospect who is going to object to the price will object to it eventually anyway."},
{t:"Tell them you are not permitted to discuss pricing at all and that only the Education Coordinator can answer that, then move directly to booking the appointment before they get a chance to put the question to you again."},
{t:"Explain that the packages are tailored to each person because trading is not one size fits all, then carry on to the booking, since the tailoring answer covers the question honestly without you having to get into numbers."}]},

/* 32 */ {part:1,type:"mc",stems:[
"How do you find out whether a prospect can actually fund an account without interrogating them about their money?",
"You need to know if a prospect is qualified, but asking what is in their bank account feels wrong. What is the trained approach?"],
opts:[
{t:"Do not ask it, speak to it. Say the strategies need leverage, that most of our people are comfortable starting somewhere around five to ten thousand, and that we never want anyone trading out of desperation instead of inspiration. Then let them react.",c:true},
{t:"Ask them directly how much they have available to trade with right now, because you cannot qualify somebody without the number, and a prospect who is serious about the opportunity is not going to take offence at a straightforward question."},
{t:"Leave the money out of the setting call entirely and let the Education Coordinator handle all of it, because that conversation belongs on the Zoom where there is enough time and rapport to get into somebody's personal finances properly."},
{t:"Tell them there is a firm minimum they have to meet before you can book anything and ask them to confirm they can meet it, so that nobody turns up to a call they were never qualified for and wastes everybody's time."}]},

/* 33 */ {part:1,type:"mc",stems:[
"Beyond booking the call, what are setters actually graded on, and what do good numbers look like?",
"What is the preparation score, what else is measured alongside it, and what are the targets?"],
opts:[
{t:"Whether they show, which should run around eighty percent, and how they show, meaning whether they arrive having watched the videos, which should be ninety to one hundred. The Education Coordinator opens by asking whether they watched.",c:true},
{t:"The raw number of appointments you put on the calendar each week, since volume is the only part of the outcome a setter genuinely controls, and everything past the booking belongs to whoever ends up running the call."},
{t:"The share of your booked calls that end in a sale, because that is the number the business actually runs on and it is the fairest way to compare one setter against another over the course of a full month."},
{t:"The length of your calls and the dials behind each booking, because a longer conversation and a higher dial count are what separate a setter working the list properly from one who is skimming the easy names off it."}]},

/* 34 */ {part:1,type:"mc",stems:[
"The call is booked and there is a page of videos to send. What is the trained way to get one actually watched?",
"Why is telling a prospect to \"watch the videos\" the wrong instruction, and what do you do instead?"],
opts:[
{t:"Pick the one video that answers the concern they just voiced, walk them to it on the page, and ask them to text you any questions once they have seen it. Naming one leaves nothing to guess at, and the question opens a loop into the call.",c:true},
{t:"Send the whole library and let them work through as much of it as they have time for, because different people care about different things and handing them the full picture respects that more than choosing for them."},
{t:"Send the link the moment you hang up and then check later whether they opened it, so you know before the appointment whether they prepared and can decide whether the call is still worth the Education Coordinator's time."},
{t:"Say nothing about the videos yourself and let the confirmation text and the reminder sequence carry that message, because the automation is already built to do it and repeating it makes your call sound like a list of chores."}]},

/* 35 */ {part:1,type:"mc",stems:[
"You are calling a revive who has not heard from us in years and does not remember signing up. What makes the opening work?",
"What is the trained opening on an old lead who has no memory of us, and why does it work?"],
opts:[
{t:"Reference when they showed interest. Telling them you are reaching out about the interest they showed back in January turns the question in their head from whether this is a scam into what it was they did in January.",c:true},
{t:"Lead with the company name and a short summary of what the mentorship offers, so that somebody who has completely forgotten signing up still has enough context to decide on the spot whether they want to keep listening."},
{t:"Open by apologising for the interruption and asking whether it is a good time to talk, because acknowledging that you have called out of nowhere is what earns you permission to carry on into the rest of the conversation."},
{t:"Open with something that holds their attention, such as a place in the next intake or a limited offer, because an old lead needs a concrete reason to stay on the line with somebody they do not remember hearing from before."}]},

/* 36 */ {part:2,type:"mc",stems:[
"You open with, \"This is really just for the two of us to figure out if what we do is even a fit for you.\" Why say it that way, and how long should rapport run before discovery?",
"What does the fit-focused opening frame accomplish, and what is the trained length for rapport at the top of the call?"],
opts:[
{t:"It sets the frame and lowers their guard, takes the commissioned breath out of the call, and quietly makes it exclusive since both sides are deciding. Rapport runs about a minute, because five minutes makes you a friend and it is easy to say no to a friend. Real rapport gets built through caring questions inside discovery.",c:true},
{t:"It is mostly a professional way to fill the first moments while you pull up their file and get organized, and rapport should run a good five minutes, because people only open up in discovery after the small talk has fully warmed them up."},
{t:"It politely warns them the call will be short and business-only, and rapport should be skipped entirely. High-ticket buyers respect efficiency, and every minute spent on small talk at the top is selling time you never get back."},
{t:"It is the compliance-required fit disclaimer read at the top of every recorded call, and on a high-ticket offer rapport should run around fifteen minutes, because an ask this size demands a real relationship before any hard question lands. The relationship math is simple: nobody wires five figures to a stranger, so the first quarter of the call is where the money actually gets made, long before discovery starts."}]},

/* 37 */ {part:2,type:"mc",stems:[
"What does KYOSWAQ stand for, who controls the sale, and whose words count as true?",
"Break down KYOSWAQ: the acronym, the control principle, and whose statements actually carry weight on the call."],
opts:[
{t:"Know Your Outcome, Start With A Question. Whoever asks more questions controls the sale, and a prospect with unanswered questions stays curious instead of defensive. Only their words count as true: never state their pain for them, even when you are almost certainly right. If you say it, it becomes a battle. If they say it, it is true. Ask \"how did that go?\" and let them talk.",c:true},
{t:"Keep Your Offer Simple, Watch And Qualify. The rep keeps control of the sale by doing most of the talking and keeping the offer easy to follow, and the rep's professional read of the situation is what counts as the truth on the call. The logic is that a confused buyer never buys, so the rep carries the conversation, keeps every explanation to one sentence, and treats their own experienced judgment of the prospect's situation as the ground truth the close gets built on."},
{t:"Know Your Objections, Sell With A Quote. Control comes from anticipating every objection before it lands and leading with the price early, because whoever gets the number on the table first is the one framing the entire negotiation."},
{t:"It is the name of the CRM the team uses for booking and tracking calls, and this question is really checking whether you finished the software training. Control of the sale and whose words count are covered in a different module."}]},

/* 38 */ {part:2,type:"mc",stems:[
"A prospect says, \"I just do not know how to trade properly and I keep losing money.\" Is that the real problem?",
"\"My problem is I keep losing money and I do not really know what I am doing.\" Surface problem or real problem?"],
opts:[
{t:"No, it is surface. Nobody wants profitability for its own sake. There is something behind it: what the money is for, who it is for, what situation he is trying to get out of. Keep digging until you find that.",c:true},
{t:"Yes. He named the problem clearly and in his own words, losing money and not knowing what he is doing, so discovery has done its job, and the trained move at that point is transitioning into the pitch while the pain is still fresh."},
{t:"Neither, honestly. Lines like that are just how prospects make conversation at the top of a call, so you note the sentiment, keep the tone light, and wait for something concrete about money or family before treating anything as real."},
{t:"Yes, but only once he has said it twice. A problem stated a single time is a passing complaint, and a problem the prospect repeats is a priority, so you circle back later and see whether he brings it up again on his own."}]},

/* 39 */ {part:2,type:"mc",stems:[
"Mid-discovery the prospect names the exact problem we solve: \"I need someone to keep me accountable.\" What do you do?",
"During discovery the prospect hands you the perfect setup line for our coaching. What is the trained move?"],
opts:[
{t:"Do not get baited. Present nothing. Discovery has barricades, and you do not get past one until you have everything you need about them. Presenting early hands them the answer and ends their curiosity.",c:true},
{t:"Say something like, \"I am really glad you mentioned that, because accountability is exactly what our one-on-one coaching is built around,\" and begin presenting. When a prospect hands you the opening, taking it right away is what listening looks like."},
{t:"Quote the price on the spot, since a prospect who names the exact problem you solve is clearly already sold, and the fastest path from there is finding out whether the budget is real before either of you invests more time in the call."},
{t:"Gently change the subject so they forget they said it, and save the accountability card for the close. If they connect our offer to their problem this early, the pitch later has nothing new in it and the ending falls flat."}]},

/* 40 */ {part:2,type:"mc",stems:[
"The prospect says he has no system and panic sells. What is the trained way to magnify that?",
"A prospect admits he panic sells with no system. How do you magnify the problem the trained way?"],
opts:[
{t:"\"Has that had an impact on you?\" and when he says yes, \"In what way, though?\" That pulls him out of the guarded, logical headspace and into what it has actually cost him, which is where a real decision gets made.",c:true},
{t:"Say, \"Yeah, that is rough, we honestly see it all the time,\" so he knows he is not alone and does not shut down from embarrassment, then move into what we do, since normalizing the problem is what keeps the call comfortable for him."},
{t:"Do the math for him out loud, estimating how much the panic selling has probably cost him over a year, and let the size of that number do the magnifying. Specific dollar figures land harder than feelings on a logical buyer."},
{t:"Touch it lightly and move past it quickly so the energy of the call stays positive. Dwelling on failure puts a prospect in a defensive headspace, and people buy from optimism about the future, not from reliving their worst trades."}]},

/* 41 */ {part:2,type:"mc",stems:[
"The prospect says, \"I want to be home for my kid's games. He is 12, I do not get these years back.\" What do you do with that, and what question comes next?",
"The prospect gives you an emotional line about missing his son's games. What happens to that line, and what do you ask next?"],
opts:[
{t:"Write it down word for word and bank it, because that exact line gets spent at the close in his own words. Then future pace it: \"have you given any thought to what happens if nothing changes over the next six to twelve months?\" Say nothing after that and do not rescue the moment. If anything, \"and what would happen then?\"",c:true},
{t:"Acknowledge it warmly, tell him that is exactly the kind of reason people come to us, and use the emotional high point as your cue to move into the pitch, because a moment like that is the peak of the call and you present into it. Emotion has a shelf life measured in seconds, and the reps who wait for a cleaner moment later in the call are the ones wondering afterward why the close felt flat."},
{t:"That line tells you a spouse is in the picture, so the next question is whether his wife needs to be part of the decision, because there is no point building a close around the kid if the real objection is waiting at home later."},
{t:"Capture the idea in your notes in cleaner language, something like values family time over income growth, and keep moving. The exact wording fades by the close anyway, and what you need for later is the theme, not the sentence."}]},

/* 42 */ {part:2,type:"mc",stems:[
"Transitioning to the pitch you say, \"What we do might actually work for you. With your permission, let me walk you through a few things. Is that okay?\" Why \"might,\" and why ask permission?",
"The transition uses \"might\" instead of \"will\" and asks permission before presenting. What is the strategy behind each?"],
opts:[
{t:"\"Might\" keeps them leaning in and asking what exactly they would have to do, where \"will\" hands them certainty and closes the loop early. Permission is a small yes in a chain of small yeses, each one reinforcing that this is their idea rather than something being done to them.",c:true},
{t:"The word \"might\" protects the company legally by never promising a fit, and asking permission creates a documented moment of consent on the recording, which matters if a client ever disputes what they agreed to hear on the call."},
{t:"Both are really just politeness. They are in the script because calls flow better when reps sound courteous, but neither word carries strategy, and swapping them for your own phrasing changes nothing about how the pitch lands."},
{t:"\"Might\" keeps you sounding humble instead of salesy, and the permission question is a practical check that they are still engaged and have not tuned out, since long discovery sections lose people and you want proof of attention."}]},

/* 43 */ {part:2,type:"mc",stems:[
"How should the pitch be structured?",
"What is the trained structure of the presentation itself?"],
opts:[
{t:"Three commitments, each wrapped in their story. Build the foundation so they have total clarity and can place a trade in the first seven days. Teach them to sell options and collect premium, the engine behind the Paycheck Collector. Support it with the one-on-one coaching. Same concepts every call, framed with what this person actually told you.",c:true},
{t:"Recite the full feature list in the same fixed order on every call, because consistency is what makes a pitch trainable and reviewable, and a rep who customizes the order call to call is a rep whose numbers cannot be diagnosed when they slip. Sales is a numbers game run on repetition, and once every rep delivers the same presentation the same way, the data tells you exactly which sentence in the pitch is leaking prospects."},
{t:"Lead with the guarantee to remove the risk, follow immediately with the price while trust is at its peak, and then stop talking entirely. The first person to speak after the number loses, so the pitch is really those two beats and silence."},
{t:"Open by asking what they would want a program like this to include, then agree and confirm we do each thing they name. Building the pitch out of their wish list means there is nothing left to object to when you reach the close."}]},

/* 44 */ {part:2,type:"mc",stems:[
"A prospect says he has tried courses before and they never worked. How do you present the one-on-one coaching?",
"\"I have bought two trading courses. Watched maybe half of the first, never finished the second. I do not want to waste money again.\" Which presentation of our coaching is trained?"],
opts:[
{t:"Use contrast. Remind him of his own experience first: most people who buy courses finish with more questions than answers, and the worst part is they walk away thinking they are stupid, when what they actually missed was mentorship. Then the coaching lands as the fix for a pain he already named, not a feature on a list.",c:true},
{t:"Answer it simply, \"we do unlimited one-on-one coaching,\" and keep the presentation moving to the next feature. The list itself is impressive enough, and slowing down to dwell on his past purchases gives the bad memories more air time."},
{t:"Take the comparison head-on: explain that our course is better produced, more current, and more complete than whatever he bought before, so even the self-study portion alone beats the products that burned him, before you get to coaching."},
{t:"Steer clear of the topic entirely, since bringing up his past courses invites him to compare us to things that failed him. Present the coaching fresh, on its own merits, and let the contrast happen silently in his head without naming it. The past is a minefield you do not control, and the version of our offer that lives in his imagination, untouched by his history, closes better than any comparison you could win out loud."}]},

/* 45 */ {part:2,type:"mc",stems:[
"You have three tiers. How many do you present, and when is the price named?",
"Tier presentation and price timing: what is the trained standard?"],
opts:[
{t:"One, chosen from what they told you and anchored to their own words, because multiple selections make people afraid of picking wrong and a prospect afraid of choosing wrong will do whatever it takes to get off the call. On timing, the price is in the room whether you name it or not, so naming it inside the pitch gives them the rest of the presentation to justify it while they are still hooked emotionally. What is absolute is that the moment the number lands, you are ready to justify it.",c:true},
{t:"Present all three tiers every time, with the prices held to the very end so the value lands first. Options are how buyers feel in control, and a prospect who picks a package himself is more committed than one handed a single answer."},
{t:"Present exactly two, priced upfront, so the cheaper one anchors the more complete one. A two-way comparison is the classic frame that moves people toward the bigger option without pressure, and leading with numbers builds trust early. Car dealers, insurance brokers, and every subscription page on the internet run the same two-option frame because it works: the small option makes the big option look complete instead of expensive, the buyer feels smart for choosing up, and the question of whether to buy quietly becomes which one to buy, which is the close doing itself."},
{t:"Present none at all, and let them ask. If discovery ran well, curiosity about packages and price comes from their side, and a pitch that never has to introduce money holds the strongest frame a sales call can have."}]},

/* 46 */ {part:2,type:"mc",stems:[
"A prospect who said money is not the issue says, \"Let me think about it over the weekend.\" What is the read and the next move?",
"After the pitch, a qualified prospect who never raised money wants to \"think about it.\" What is the trained read and move?"],
opts:[
{t:"It is vague and money was never raised, so treat it as a possible smokescreen. Apply light pressure once with a non-threatening question, like \"money aside for a second, do you feel like this is the thing that actually solves it for you?\" Then watch whether the objection shrinks and names itself, or grows.",c:true},
{t:"Respect it completely, thank him for his time, and set a follow-up for next week. Pressure of any kind after someone asks for space is what creates refunds and bad reviews, and a weekend of thinking usually firms a good prospect up. The prospects who come back after a respected weekend close at full conviction, refer their friends, and stay clients for years."},
{t:"Run the pitch again from the top with more energy and better stories, because a prospect who wants to think it over is really telling you the presentation did not land the first time, and the second pass is where these calls get saved."},
{t:"Bring out a discount that expires when the call ends, since a real deadline with real savings turns thinking about it into a decision today, and a prospect who walks away from a discount was never going to buy at full price anyway."}]},

/* 47 */ {part:2,type:"mc",stems:[
"Light pressure worked and the objection named itself: \"The money is not the issue, I just always tell myself I will start things later.\" What now?",
"The smokescreen dropped and the real objection is his habit of putting things off. What is the trained move?"],
opts:[
{t:"Drive it gently using the bank. Name the pattern with his own words: he told you that if nothing changes he is in the same spot a year from now, still the only one making the money, still missing the games. Later is the exact thing it has already cost him. Then finish with a question, not a statement: what actually changes by next week that we cannot handle right now?",c:true},
{t:"Accept the answer at face value and get a follow-up on the calendar before you hang up. He named a real thing about himself, and honoring it builds the kind of trust that closes next month instead of forcing a no today that sticks. A no forced today closes the file forever, but a booked follow-up keeps the door open, and his own words will still be waiting in your notes next month when the same pain is still there."},
{t:"Tell him directly that he is making excuses, that later is a lie people tell themselves, and that he needs to decide right now on the call. Some prospects only move when someone finally refuses to accept the pattern from them."},
{t:"Drop the price, because a habit of putting things off usually dissolves the moment the deal gets sweeter, and a one-time number he will not see again gives him a reason to break the pattern today without anyone naming it out loud."}]},

/* 48 */ {part:2,type:"mc",stems:[
"Three prospects respond differently to light pressure. Which reads match the trained gears?",
"Drive, Step Back, Disqualify: which answer applies the three gears correctly?"],
opts:[
{t:"Drive when they like it and have the means. Step back when they want it but are burned or scared. Disqualify when there is real debt or they are genuinely not a fit.",c:true},
{t:"Drive every prospect with equal pressure, because hesitation is always a smokescreen in disguise, and the gears really describe three intensities of the same push rather than three different reads of three different people."},
{t:"Step back from everyone who hesitates, without exception, since pressure of any kind damages the brand and generates disputes, and the prospects worth having will drive themselves once the information has had time to settle."},
{t:"Disqualify anyone who hesitates at all, on the spot. The pipeline is full, hesitation now predicts hesitation as a client, and the cleanest book of business comes from only enrolling people who say yes without a second question."}]},

/* 49 */ {part:2,type:"mc",stems:[
"A client agrees to split the payment, some today and the rest in 30 days. What matters most in setting up that payment link?",
"Split payment agreed: part now, part in 30 days. What matters most when you build the payment link?"],
opts:[
{t:"Set the initial amount and the recurring amount correctly, set the 30-day period, and end the subscription after the right number of periods so it cancels itself. Getting this wrong overcharges the client badly. If they ask about the service charge, it is the card processing fee, and it is never described as taxes.",c:true},
{t:"Honestly not much, as long as the total comes out right over time. The processor sorts out the details on its end, and small setup mistakes just shift when the money lands rather than how much of it there is, so speed matters more than precision."},
{t:"Always run financing first before building any split link, since practically everyone gets approved, the company gets its money upfront, and a client on a lender's schedule is a client whose payments are never yours to chase. The finance partners exist precisely so payment mechanics never sit in a rep's hands, where one typo can cost a client thousands."},
{t:"Charge the full amount today and refund the difference afterward, because collecting everything while the card is out protects the deal, and a refund is a clean, documented way to honor whatever split the two of you agreed to on the call."}]},

/* 50 */ {part:2,type:"mc",stems:[
"Earlier in the call the prospect said he wants to stop working weekends to be around for his daughter, and that if nothing changes he is in the same place next year. He now says: \"It is my busy season, I cannot focus on this.\" Which response is trained?",
"The prospect banked strong lines about his daughter and being stuck, and now says busy season means he cannot do this. Pick the trained response."],
opts:[
{t:"I hear you, and I am not going to pretend busy season is not real. But can I be straight with you for a second? Earlier you told me the whole reason you are here is the weekends, being around for your daughter, and that if nothing changes you are in the same place next year. So I am just curious, is it really the time, or is this the pattern you told me about? What actually changes after busy season that we cannot handle right now?",c:true},
{t:"What is really stopping you here? Come on, be honest with yourself for a second, because we both know it is not the season. Sometimes the kindest thing a coach can do is refuse the surface answer until the real one shows up. The training calls this holding the mirror: you drop the polite fiction, let the silence sit, and force the real objection into the open in one move. It is uncomfortable on purpose, because comfort is what let him put things off for years, and the reps who can sit in that silence are the ones who save the calls everyone else loses."},
{t:"That honestly sounds like an excuse, and I say it with respect. Busy people make time for the things that matter to them, so if this mattered, the season would not be the deciding factor, and maybe that tells us both something."},
{t:"I hear you, so let me make it easier: if you can start today I can knock a thousand off, and busy season stops being a money conversation. That way the timing problem and the price problem solve each other on this one call."}]},

/* 51 */ {part:2,type:"tf",vars:[
{s:"If a client asks about the service charge at checkout, it is fine to tell them it is taxes.",a:false},
{s:"The service charge at checkout is the card processing fee, and you never describe it as taxes.",a:true}]},

/* 52 */ {part:2,type:"tf",vars:[
{s:"Your job during discovery is to give the prospect good advice about what they are doing wrong.",a:false},
{s:"During discovery you never give advice. Your job is to ask the questions that get the prospect to say it themselves.",a:true}]},

/* 53 */ {part:2,type:"tf",vars:[
{s:"A call where the prospect talked far more than you did, and you barely said a word before they bought, means you ran it wrong.",a:false},
{s:"Prospects who talk themselves into it buy at a different level than prospects who were talked into it, so a call where they did most of the talking is a call run correctly.",a:true}]},

/* 54 */ {part:2,type:"mc",stems:[
"A prospect asks what the personalized plan actually is. What is the trained answer?",
"What does a personalized plan mean here, and what is it not?"],
opts:[
{t:"Matching them to the coach and the schedule that fit their life, with sessions recorded and their coach answering their questions on the live even when they cannot make it. It is not a projection of what their money will do.",c:true},
{t:"A written projection of what their account should grow to over six months and a year at the level they are funding it, because seeing the numbers laid out is what makes the value of the program concrete for someone on the fence."},
{t:"A portfolio the coaching team builds and manages on their behalf for the first stretch, so that a complete beginner is never making allocation decisions alone before they have learned enough to be making them well."},
{t:"A curriculum document listing every lesson in the order they will work through it, so they can see exactly what is coming and how much material they are getting for what they are about to pay for the program."}]},
/* 55 */ {part:1,type:"mc",stems:[
"A prospect asks about the money back guarantee. What are the actual terms?",
"\"So if this does not work, do I get my money back?\" What is the honest, accurate answer?"],
opts:[
{t:"If you follow the training, do the work, and still do not profit, you get your money back. Doing the work is provable: coaching attendance and a trading log. That is exactly what our one refund refusal was missing, the client completed the course, took the coaching, then would not share his log.",c:true},
{t:"Thirty days, no questions asked, full refund for any reason at all and with no paperwork, because standing behind the program that unconditionally is the strongest trust signal a company can possibly send a nervous buyer, and in practice it costs almost nothing to offer since so few people who actually start the coaching ever go on to use it."},
{t:"There is no guarantee and it is better not to bring the subject up, because the moment a rep starts talking about refunds the prospect starts planning their exit instead of their success, and the whole tone of the call turns defensive."},
{t:"If their trades lose money in the first ninety days, the company reimburses the losses out of the guarantee fund, which is why the coaches keep such a close eye on every position a new student opens during that window."}]},

/* 56 */ {part:1,type:"mc",stems:[
"A skeptical prospect wants hard proof the company is legitimate, beyond star ratings. What do you point to?",
"\"Reviews can be faked. What real evidence is there that you are not a scam?\" What is the trained answer?"],
opts:[
{t:"The receipts nobody can fake: four payment disputes across 959 transactions since 2021, two won, one an honest double charge we refunded and own, one we take on the chin. Plus Better Business Bureau accreditation with an A plus, a public Trustpilot page we cannot delete, and an open community where they can talk to real students directly.",c:true},
{t:"Screenshots of student profit and loss statements, because unlike marketing words those are actual account numbers from actual trades placed by actual people, and once a skeptic has seen real money made in real accounts the whole legitimacy question answers itself on the spot, which is why results screenshots have always been the strongest proof any trading educator can put in front of a doubter."},
{t:"Explain that dispute records and payment histories are private banking information no company can share, so at the end of the day the star ratings really are the only evidence available and they will have to weigh those for themselves."},
{t:"Our Google reviews, since Google is the platform people trust most and the rating there is strong enough that a skeptic who looks it up will come back reassured without you having to argue the point at all."}]},

/* 57 */ {part:1,type:"mc",stems:[
"Why do we refuse to show profit and loss screenshots as proof, even real ones?",
"A rep wants to close a skeptic by showing a student's trading results. Why is that against the rules here?"],
opts:[
{t:"Because P and L screenshots are the number one way people get scammed, they are usually fake, and presenting results as proof is a claim that can cross a legal line. We show the service instead, and a skeptic can go talk to real students in the open community themselves.",c:true},
{t:"Because our student results are honestly not strong enough yet to persuade anybody, so until the numbers improve it is safer for everyone if reps keep the conversation away from performance entirely and sell the coaching relationship instead."},
{t:"Because only Steve is authorized to show results material, so the right move is to promise the prospect that all the performance data they want will be waiting for them on the strategy call once they have booked it."},
{t:"Because there is simply no need for that kind of proof when the strategy already wins 93 percent of the time, so instead of digging up screenshots the rep should walk the prospect slowly through the win ratio and the monthly percentages until the skepticism has nowhere left to hide and the numbers have done the closing on their own."}]},

/* 58 */ {part:1,type:"mc",stems:[
"What are the four Ms, and why is the first one first?",
"The program is built on the four M process. Which answer names all four and gets the order right?"],
opts:[
{t:"Mindset, Manageable technical training, Mentorship, Mastermind community. Mindset comes first because the psychology has to land before any strategy will: teach a complicated strategy to an unprepared brain and the person concludes it does not work.",c:true},
{t:"Money, Markets, Mentorship, Mastery. Money comes first because nothing else in the program can even begin until the account is funded, which is why the qualifying conversation always starts with what the prospect has to invest."},
{t:"Mindset, Momentum, Marketing, Mastermind. Momentum sits at the center because the data shows students who take their first trade inside seventy two hours are the ones who stay, so everything is built to get money moving fast."},
{t:"Manageable technical training, Mindset, Mentorship, Mastermind community. The technicals come first because until someone can actually read a chart there is nothing for the psychology to even act on, which is exactly why the charting course has always been the piece that opens the program."}]},

/* 59 */ {part:1,type:"mc",stems:[
"A prospect asks you something you genuinely do not know. What do you do?",
"Mid-call, a question comes up that you honestly cannot answer. What is the right move?"],
opts:[
{t:"Say so plainly: great question, I want to get it right, so let me find out and text you today. Then actually do it. Guessing trades the whole relationship for one smooth moment, and the follow-up text is another touch before the call anyway.",c:true},
{t:"Give the most confident answer you can piece together on the spot, because hesitation reads as weakness everywhere in sales, and a prospect who hears a single um will quietly discount everything else you said on the call, however right or wrong your educated guess later turns out to be."},
{t:"Tell them every question of that kind is handled by Steve and move on, since the setter's job description does not include knowing details, and questions on the setting call are mostly a sign the prospect is stalling anyway."},
{t:"Steer the conversation straight back to the calendar, because time spent on questions you cannot answer is time the booking is leaking away, and once the appointment is set the question will take care of itself on the Zoom."}]},

/* 60 */ {part:1,type:"mc",stems:[
"A prospect is short with you, a bit hostile, interrupting. What is the trained posture?",
"The person on the line is rude and combative from the first minute. How do you handle it?"],
opts:[
{t:"Stay warm and stay curious, because hostility is usually armor from being burned before, and calm questions find out what is under it. And if they stay abusive, end it kindly and move on: we are picky on purpose, and no booking is worth training someone to treat the team badly.",c:true},
{t:"Match their energy and push back a little rather than absorbing it, because respect in sales is taken rather than given, and a prospect who successfully bullies you inside the first minute of a call has already privately decided that you have nothing they need before you get to say another word about the program."},
{t:"End the call at the first sign of resistance and mark the lead dead, because the pipeline always has friendlier people in it and time spent softening a hostile prospect is time a cooperative one spent talking to a competitor."},
{t:"Defuse it by giving something away, a discount or an extra, because nothing settles an aggravated prospect faster than feeling they have already won something, and a small concession up front is cheap against a closed deal later."}]},

/* 61 */ {part:1,type:"mc",stems:[
"It is the end of the week, you are behind on bookings, and a keen prospect who is clearly not qualified wants to book. What do you do?",
"Your numbers are down and the only interested person on the line today has no money to trade with. What is the right call?"],
opts:[
{t:"Do not book it. A call that wastes an Education Coordinator's hour and ends in a rejection costs more than a missing number, and quality over quantity is the whole account. Point them to the open community and the no-cost course, and spend the hour on revives instead.",c:true},
{t:"Book it anyway, because your job is measured in appointments set and the qualifying question belongs to the person running the strategy call, who is better placed than you to judge who can and cannot be worked with."},
{t:"Book it but quietly give the Education Coordinator a heads up that this one is probably dead on arrival, so the number counts for the week while the team at least knows not to prepare too hard for the call itself."},
{t:"Suggest they look into borrowing options or a credit line in the days before the call, because plenty of perfectly successful students started out with money that was not technically theirs to begin with, and at the end of the day it is not a setter's place to decide how much risk another consenting adult chooses to take."}]},

/* 62 */ {part:2,type:"mc",stems:[
"The program takes 15 people a month. How do you use that honestly on a strategy call?",
"How does the monthly intake cap get used in the close, and what is off limits about it?"],
opts:[
{t:"Say it as fact, not pressure: one-on-one coaching does not scale, so intake is capped at 15 a month, which is why we recommend starting before the month's spots go instead of waiting for a better time. Never invent a lower number to force the close.",c:true},
{t:"Tell them there are two spots left whatever the real number is, because scarcity only works when it feels immediate, and nobody on the other end of the phone has any way of checking how many spots a private program actually has open."},
{t:"Leave the cap out of the conversation entirely, because talking about limited spots makes even an honest program sound like a late night infomercial, and a genuinely serious buyer makes the decision on the merits of the coaching itself rather than on whatever calendar pressure happens to be sitting around it."},
{t:"Offer to hold a spot outside the cap if they pay today, because flexibility on the limit shows goodwill to a serious buyer and the cap is really there for the hesitant people rather than for the ones ready to move."}]},

/* 63 */ {part:2,type:"mc",stems:[
"Why does the founder's blow up story belong on a strategy call, and what are its facts?",
"What is the story of how the founder started trading, and what work does it do in the conversation?"],
opts:[
{t:"He lost 29 thousand dollars in 29 days at age 29 on penny stocks, then 20 thousand more in two months on options in 2013. It is the same struggle the prospect is living, and it lands the point: it was never that he was not smart enough, it was the system.",c:true},
{t:"He was profitable almost from his very first month in the market, which is the whole reason he is qualified to be teaching anyone at all, and the story matters on calls because prospects only really want to learn from someone whose account has gone in one direction since the day he started trading."},
{t:"He lost money for years and the lesson of the story is that trading is mostly luck and timing, so the honest pitch is that we cannot promise the market will cooperate, but we can promise the prospect will have company while they find out."},
{t:"The story is that he built the strategy at a bank desk before leaving to teach it, and it works on calls because institutional credentials close the trust gap faster than any personal struggle story ever could with a skeptical buyer."}]},

/* 64 */ {part:2,type:"mc",stems:[
"The prospect asks, \"So I will really make 10 to 30 percent a month?\" How do you handle the strategy's numbers?",
"How are the Paycheck Collector figures, the 93 percent win ratio and 10 to 30 percent a month, allowed to be used in a close?"],
opts:[
{t:"As what the strategy has done in training, never as a promise for their account. Anchor to the real promise: a trade placed on their own inside a week, self-sufficiency around ninety days, the guarantee if they do the work without profit.",c:true},
{t:"Confirm it plainly, ten to thirty percent a month is what the strategy pays, because hedging on your own numbers at the close reads as doubt, and doubt at the close is the single most expensive thing a salesperson can put in a prospect's head."},
{t:"Refuse to discuss performance numbers at any point, because any figure spoken aloud on a recorded call is a liability, and a rep who never says a number is a rep who can never be quoted, which protects the company completely."},
{t:"Tell them that results are entirely up to them and so any numbers are effectively meaningless, which has the considerable advantage of being technically true while also putting the responsibility exactly where it belongs before they have even started, on the student themselves rather than on the program or the coaches."}]}
];


/* ------------------------------ the two certifications ------------------------------

   Two separate exams, not one combined test. Product knowledge is the half both
   roles genuinely need: tiers, the guarantee, the 401k rollover, platforms,
   crypto, who the company is, the burned-before proof. Neither role can work
   without it. What differs is the call each one runs, so each exam pairs the
   shared product half with its own call.

   Every Part One question carries a track: "product" is shared by both exams,
   "setting" belongs to the setter. Every Part Two question is "strategy" and
   belongs to the Education Coordinator. */

var PRODUCT_IDX = [0,1,2,3,4,5,6,8,14,15,16,17,18,20,24,25,27,28,29,54,55,56,57];

function trackOf(bi){
  if (BANK[bi].part === 2) return "strategy";
  return PRODUCT_IDX.indexOf(bi) >= 0 ? "product" : "setting";
}

var EXAMS = {
  setter: {
    key: "setter",
    name: "Setter Certification",
    blurb: "The offer and the setting call. What we sell, and how you set the appointment.",
    tracks: ["product", "setting"],
    sections: [
      {track:"product", eyebrow:"Section One", title:"The Offer and the Product"},
      {track:"setting", eyebrow:"Section Two", title:"The Setting Call"}
    ]
  },
  ec: {
    key: "ec",
    name: "Education Coordinator Certification",
    blurb: "The offer and the strategy call. The same product knowledge, plus running the call itself.",
    tracks: ["product", "strategy"],
    sections: [
      {track:"product", eyebrow:"Section One", title:"The Offer and the Product"},
      {track:"strategy", eyebrow:"Section Two", title:"The Strategy Call"}
    ]
  }
};

function examItems(examKey){
  var ex = EXAMS[examKey], out = [];
  BANK.forEach(function(q, bi){
    if (ex.tracks.indexOf(trackOf(bi)) >= 0) out.push(bi);
  });
  return out;
}

function examTotal(examKey){ return examItems(examKey).length; }
function examPassMark(examKey){ return Math.ceil(PASS_PCT * examTotal(examKey)); }
function examName(examKey){ return EXAMS[examKey] ? EXAMS[examKey].name : examKey; }

/* ------------------------------ app state ------------------------------ */

var CURRENT = null, ATTEMPT = null, ADMIN_CODE_ENTERED = "", ADMIN_USERS = null, ADMIN_VIEW = "people";
var ADMIN_EXAM = "setter"; // which certification the dashboard is showing

/* Safari on a phone discards background tabs and reloads them when you come
   back. The rendered page returns with answers still visible, but the state
   behind it is gone, so an in-progress exam used to die on Submit with nothing
   shown. The attempt and every answer are mirrored here so a reload resumes
   exactly where the rep left off. Cleared on submit and on sign out. */
var SESSION_KEY = "tfcert_inprogress_v1";

function saveSession(){
  if (!CURRENT || !ATTEMPT) return;
  try {
    var answers = {};
    ATTEMPT.items.forEach(function(item){
      var sel = document.querySelector('input[name="q'+item.disp+'"]:checked');
      if (sel) answers[item.disp] = sel.value;
    });
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({
      user: {name:CURRENT.name, email:CURRENT.email, info:CURRENT.info, exam:CURRENT.exam},
      attempt: {exam:ATTEMPT.exam, items:ATTEMPT.items, served:ATTEMPT.served, startTs:ATTEMPT.startTs},
      answers: answers
    }));
  } catch(e){ /* private browsing or a full quota: the exam still works, it just cannot resume */ }
}

function clearSession(){
  try { sessionStorage.removeItem(SESSION_KEY); } catch(e){}
}

/* Escape hatch: without this, anyone with an abandoned attempt is stuck being
   resumed into it and can never reach the sign-in card or the dashboard. */
function discardSession(){
  clearSession();
  if (ATTEMPT && ATTEMPT.timerId) clearInterval(ATTEMPT.timerId);
  ATTEMPT = null;
  CURRENT = null;
  $("in-name").value = "";
  $("in-email").value = "";
  $("unanswered").textContent = "";
  show("scr-login");
}

function restoreSession(){
  var raw;
  try { raw = sessionStorage.getItem(SESSION_KEY); } catch(e){ return false; }
  if (!raw) return false;
  var s;
  try { s = JSON.parse(raw); } catch(e){ clearSession(); return false; }
  if (!s || !s.attempt || !s.attempt.items || !s.user) { clearSession(); return false; }
  /* A sitting is one sitting. Anything older than a few hours is stale and
     should not silently resurrect on top of somebody else's sign-in. */
  if (!s.attempt.startTs || Date.now() - s.attempt.startTs > 4 * 60 * 60 * 1000) { clearSession(); return false; }
  CURRENT = {name:s.user.name, email:s.user.email, info:s.user.info, exam:s.user.exam};
  ATTEMPT = {exam:s.attempt.exam, items:s.attempt.items, served:s.attempt.served, startTs:s.attempt.startTs};
  $("menu-user").textContent = CURRENT.name + " (" + CURRENT.email + ")";
  $("exam-user").textContent = CURRENT.name + " \u00b7 " + examName(ATTEMPT.exam);
  renderExam();
  Object.keys(s.answers || {}).forEach(function(disp){
    var el = document.querySelector('input[name="q'+disp+'"][value="'+s.answers[disp]+'"]');
    if (el) el.checked = true;
  });
  startTimer();
  show("scr-exam");
  $("unanswered").innerHTML = 'Your place was saved and restored. Carry on where you left off. ' +
    '<a class="adminlink" onclick="discardSession()">Not you? Start over</a>';
  return true;
}

/* Every result saves straight to the results database and shows up in the
   trainer dashboard on its own. That is the whole point of the dashboard, so
   there is no per-rep workaround to carry results by hand. */

function $(id){ return document.getElementById(id); }

function isNoStorage(msg){
  return /storage is not connected|Storage tab/i.test(String(msg || ""));
}

function show(id){
  ["scr-login","scr-menu","scr-exam","scr-result","scr-adminlogin","scr-admin"].forEach(function(s){ $(s).classList.add("hidden"); });
  $(id).classList.remove("hidden");
  window.scrollTo(0,0);
}

function shuffle(arr){
  var a = arr.slice();
  for (var i = a.length - 1; i > 0; i--){
    var j = Math.floor(Math.random() * (i + 1));
    var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
  }
  return a;
}

function esc(s){
  return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
}

function fmtDate(ts){
  var d = new Date(ts);
  return d.toLocaleDateString() + " " + d.toLocaleTimeString([], {hour:"numeric", minute:"2-digit"});
}

function api(path, body){
  var opts = body ? {method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(body)} : {};
  return fetch(path, opts).then(function(r){
    return r.json().catch(function(){ return {error:"Bad server response."}; }).then(function(data){
      if (!r.ok) throw new Error(data.error || ("Error " + r.status));
      return data;
    });
  });
}

/* ------------------------------ sign in ------------------------------ */

async function doLogin(){
  var name = $("in-name").value.trim(), email = $("in-email").value.trim();
  $("login-err").textContent = "";
  $("btn-login").disabled = true;
  try {
    var info = await api("/api/login", {name:name, email:email});
    CURRENT = {name:name, email:info.email, info:info, exam:null};
    $("menu-user").textContent = name + " (" + info.email + ")";
    renderExamPicker();
    show("scr-menu");
  } catch(e){
    $("login-err").textContent = isNoStorage(e.message)
      ? "This certification is not finished being set up yet. Tell your trainer the results database is not connected."
      : e.message;
  }
  $("btn-login").disabled = false;
}

function logout(){
  clearSession();
  CURRENT = null;
  $("in-name").value = "";
  $("in-email").value = "";
  show("scr-login");
}

function renderExamPicker(){
  var info = CURRENT.info, html = "";
  Object.keys(EXAMS).forEach(function(k){
    var ex = EXAMS[k], st = (info.exams && info.exams[k]) || {attemptCount:0, bestScore:null, total:examTotal(k), passed:false};
    var total = examTotal(k), pass = examPassMark(k);
    html += '<div class="pick"><h3>' + esc(ex.name) + '</h3>' +
      '<p class="small">' + esc(ex.blurb) + '</p>' +
      '<p class="small">' + total + ' questions, graded the moment you submit. Passing: ' + pass + ' of ' + total + '.</p>';

    var status, locked = false;
    if (info.tester){
      status = "Tester account: attempts do not count against the limit and are labeled TESTER in the dashboard.";
    } else if (st.passed){
      status = "You have passed this one. Additional attempts are for practice.";
    } else if (st.attemptCount === 0){
      status = "Not attempted yet. Attempts: 3.";
    } else if (st.attemptCount >= MAX_ATTEMPTS){
      status = "Attempts used: " + st.attemptCount + " of " + MAX_ATTEMPTS +
        (st.bestScore !== null ? ". Best score: " + st.bestScore + " of " + st.total : "") +
        ". No attempts remaining, speak with your trainer.";
      locked = true;
    } else {
      status = "Attempts used: " + st.attemptCount + " of " + MAX_ATTEMPTS +
        (st.bestScore !== null ? ". Best score: " + st.bestScore + " of " + st.total : "") +
        ". Attempts remaining: " + (MAX_ATTEMPTS - st.attemptCount) + ".";
    }
    html += '<p class="small" id="status-' + k + '">' + esc(status) + '</p>' +
      '<button id="btn-start-' + k + '" onclick="startPicked(&#39;' + k + '&#39;)"' + (locked ? ' disabled' : '') + '>' +
      (st.attemptCount > 0 ? 'Retake' : 'Start') + ' the ' + esc(ex.name.replace(" Certification", "")) + ' test</button></div>';
  });
  $("exam-picker").innerHTML = html;
}

function startPicked(examKey){
  CURRENT.exam = examKey;
  var st = (CURRENT.info.exams && CURRENT.info.exams[examKey]) || {};
  CURRENT.info.lastServed = st.lastServed || null;
  startExam();
}

/* ------------------------------ the exam ------------------------------ */

/* Builds one attempt. lastServed maps bank index -> variant served last time;
   retakes deliberately serve the other phrasing and flip true/false variants. */
function buildAttempt(examKey, lastServed){
  var ex = EXAMS[examKey], prev = lastServed || {}, served = {}, items = [];
  examItems(examKey).forEach(function(bi){
    var q = BANK[bi], v, track = trackOf(bi);
    if (q.type === "mc"){
      v = Math.floor(Math.random() * q.stems.length);
      if (prev["q"+bi] !== undefined && q.stems.length > 1) v = (prev["q"+bi] + 1) % q.stems.length;
      served["q"+bi] = v;
      /* oi remembers each option's position in the bank, so the record of what
         a rep picked survives the shuffle and a trainer can read it back. */
      items.push({track:track, type:"mc", bi:bi, stem:q.stems[v], opts:shuffle(q.opts.map(function(o, oi){ return {t:o.t, c:!!o.c, oi:oi}; }))});
    } else {
      v = Math.floor(Math.random() * q.vars.length);
      if (prev["q"+bi] !== undefined && q.vars.length > 1) v = (prev["q"+bi] + 1) % q.vars.length;
      served["q"+bi] = v;
      items.push({track:track, type:"tf", bi:bi, stem:q.vars[v].s, ans:q.vars[v].a});
    }
  });
  /* Shuffle within each section so question order moves between attempts, but
     keep the sections themselves in order so the exam still reads as a whole. */
  var ordered = [];
  ex.sections.forEach(function(sec){
    ordered = ordered.concat(shuffle(items.filter(function(i){ return i.track === sec.track; })));
  });
  return {items: ordered, served: served};
}

function startExam(){
  var built = buildAttempt(CURRENT.exam, CURRENT.info.lastServed);
  ATTEMPT = {exam:CURRENT.exam, items:built.items, served:built.served, startTs:Date.now()};
  $("exam-user").textContent = CURRENT.name + " · " + examName(CURRENT.exam);
  renderExam();
  show("scr-exam");
  startTimer();
  saveSession();
}

function startTimer(){
  if (ATTEMPT.timerId) clearInterval(ATTEMPT.timerId);
  ATTEMPT.timerId = setInterval(function(){
    var s = Math.floor((Date.now() - ATTEMPT.startTs) / 1000);
    $("exam-timer").textContent = Math.floor(s/60) + ":" + String(s%60).padStart(2,"0");
  }, 1000);
}

function renderExam(){
  var body = $("exam-body"), html = "", n = 0;
  var choiceBox = function(item){
    n++; item.disp = n;
    var h = '<div class="q" id="qbox'+n+'"><p class="stem"><span class="qn">'+n+'.</span> '+esc(item.stem)+'</p>';
    if (item.type === "mc"){
      item.opts.forEach(function(o, oi){
        h += '<label class="opt"><input type="radio" name="q'+n+'" value="'+oi+'"><span>'+esc(o.t)+'</span></label>';
      });
    } else {
      h += '<label class="opt"><input type="radio" name="q'+n+'" value="true"><span>True</span></label>' +
           '<label class="opt"><input type="radio" name="q'+n+'" value="false"><span>False</span></label>';
    }
    return h + '</div>';
  };
  var ex = EXAMS[ATTEMPT.exam];
  ex.sections.forEach(function(sec){
    html += '<p class="secnum">' + esc(sec.eyebrow) + '</p><h2 class="section">' + esc(sec.title) + '</h2>';
    ATTEMPT.items.filter(function(i){ return i.track === sec.track; }).forEach(function(i){ html += choiceBox(i); });
  });
  body.innerHTML = html;
  body.onchange = saveSession;
}

async function submitExam(){
  /* Never fail silently. Anything unexpected in here used to leave the rep
     tapping a dead button with no explanation. */
  try {
    await runSubmit();
  } catch(e){
    $("unanswered").textContent = "Something went wrong submitting: " + (e && e.message ? e.message : e) +
      ". Your answers are still on screen, press Submit to try again.";
    $("btn-submit").disabled = false;
  }
}

async function runSubmit(){
  if (!ATTEMPT || !ATTEMPT.items || !CURRENT){
    $("unanswered").textContent = "This page lost its place, most often because the browser reloaded the tab. Sign in again and your attempt will pick up where it left off.";
    return;
  }
  var total = ATTEMPT.items.length, unanswered = [];
  ATTEMPT.items.forEach(function(item){
    var sel = document.querySelector('input[name="q'+item.disp+'"]:checked');
    item.given = sel ? sel.value : null;
    if (item.given === null) unanswered.push(item.disp);
  });
  unanswered.sort(function(a,b){ return a-b; });
  var ex = EXAMS[ATTEMPT.exam];
  if (unanswered.length){
    $("unanswered").textContent = "Unanswered question" + (unanswered.length>1?"s":"") + ": " + unanswered.join(", ") + ".";
    $("qbox" + Math.min.apply(null, unanswered)).scrollIntoView({behavior:"smooth"});
    return;
  }
  if (!confirm("Submit for grading? You cannot change answers after this.")) return;
  clearInterval(ATTEMPT.timerId);
  $("btn-submit").disabled = true;
  $("unanswered").textContent = "Saving your result...";

  var score = 0, sectionScores = {}, perQ = [];
  ATTEMPT.items.forEach(function(item){
    var ok, pick;
    if (item.type === "mc"){
      var chosen = item.opts[parseInt(item.given,10)];
      ok = chosen.c === true;
      pick = chosen.oi;
    } else {
      ok = (item.given === "true") === item.ans;
      pick = item.given === "true" ? 1 : 0;
    }
    if (ok){
      score++;
      sectionScores[item.track] = (sectionScores[item.track] || 0) + 1;
    }
    /* pick is the bank position of the option they chose (mc), or 1/0 for a
       True/False answer, so the dashboard can show a trainer not just that a
       question was missed but which wrong idea the rep actually holds. */
    perQ.push({bi:item.bi, ok:ok, pick:pick});
  });
  var mins = Math.round((Date.now() - ATTEMPT.startTs) / 60000 * 10) / 10;
  var autoPass = score >= Math.ceil(PASS_PCT * total);
  var payload = {
    exam:ATTEMPT.exam,
    /* bn records which bank generation graded this attempt. Questions are only
       ever appended, so any bi below a recorded bn refers to the same question
       forever, which is what lets the dashboard reconstruct old attempts. */
    bn:BANK.length,
    score:score, total:total, sectionScores:sectionScores, mins:mins, autoPass:autoPass,
    served:ATTEMPT.served, perQ:perQ
  };
  try {
    await api("/api/submit", {email:CURRENT.email, attempt:payload});
  } catch(e){
    /* Nothing is lost on a failed save: the answers stay on the page and the
       button comes back, so Submit can simply be pressed again. */
    $("unanswered").textContent = (isNoStorage(e.message)
      ? "Could not save: the results database is not connected. Tell your trainer."
      : "Save failed: " + e.message) + " Your answers are still here, press Submit to try again.";
    $("btn-submit").disabled = false;
    return;
  }

  $("unanswered").textContent = "";
  $("res-score").textContent = score + " / " + total;
  $("res-verdict").textContent = autoPass ? "Certified" : "Not yet";
  $("res-verdict").className = "verdict " + (autoPass ? "pass" : "fail");
  var secText = ex.sections.map(function(sec){
    var got = sectionScores[sec.track] || 0;
    var outOf = ATTEMPT.items.filter(function(i){ return i.track === sec.track; }).length;
    return sec.title + ": " + got + " of " + outOf;
  }).join(". ");
  $("res-detail").textContent = ex.name + ". " + secText + ". Time: " + mins +
    " minutes. Passing standard: " + Math.ceil(PASS_PCT * total) + " of " + total + ".";
  clearSession();
  $("res-delivery").innerHTML = '<p class="small">Result saved. Your trainer can see it now.</p>';
  if (autoPass && CURRENT.info.exams[ATTEMPT.exam]) CURRENT.info.exams[ATTEMPT.exam].passed = true;
  var st = CURRENT.info.exams[ATTEMPT.exam];
  st.attemptCount++;
  st.lastServed = ATTEMPT.served;
  if (st.bestScore === null || score > st.bestScore) st.bestScore = score;
  show("scr-result");
}

function backToMenu(){
  renderExamPicker();
  show("scr-menu");
}

/* ------------------------------ trainer dashboard ------------------------------ */

async function adminLogin(){
  ADMIN_CODE_ENTERED = $("in-admin").value;
  $("admin-err").textContent = "";
  try {
    await api("/api/admin?code=" + encodeURIComponent(ADMIN_CODE_ENTERED));
  } catch(e){
    $("admin-err").textContent = isNoStorage(e.message)
      ? "The results database is not connected yet, so there is nothing to show. Open this project in Vercel, Storage tab, connect a Blob store to the project, then redeploy."
      : e.message;
    return;
  }
  $("in-admin").value = "";
  loadAdmin();
  show("scr-admin");
}

async function loadAdmin(){
  var box = $("admin-table");
  box.innerHTML = '<p class="small">Loading...</p>';
  try {
    ADMIN_USERS = (await api("/api/admin?code=" + encodeURIComponent(ADMIN_CODE_ENTERED))).users || [];
  } catch(e){
    box.innerHTML = '<p class="small">' + esc(isNoStorage(e.message)
      ? "The results database is not connected yet. Open this project in Vercel, Storage tab, connect a Blob store to the project, then redeploy."
      : e.message) + '</p>';
    return;
  }
  $("admin-storage").innerHTML = "";
  renderAdminView();
}

function toggleAdminView(){
  ADMIN_VIEW = ADMIN_VIEW === "people" ? "questions" : "people";
  $("btn-adminview").textContent = ADMIN_VIEW === "people" ? "Question analysis" : "Back to people";
  renderAdminView();
}

/* Attempts for one certification. Records written before the split carry no
   exam tag; they were the combined test, whose Part One is the setter exam. */
function attemptsFor(u, examKey){
  return (u.attempts || []).filter(function(a){ return (a.exam || "setter") === examKey; });
}

function renderExamTabs(){
  var h = '<p class="small" style="margin-bottom:6px">Showing:</p>';
  Object.keys(EXAMS).forEach(function(k){
    var n = (ADMIN_USERS || []).reduce(function(sum, u){ return sum + attemptsFor(u, k).length; }, 0);
    var on = k === ADMIN_EXAM;
    h += '<button class="ghost" style="margin:0 8px 0 0;' + (on ? 'background:var(--gold);color:#fff;border-color:var(--gold-dark)' : '') +
      '" onclick="setAdminExam(&#39;' + k + '&#39;)">' + esc(EXAMS[k].name) + ' (' + n + ')</button>';
  });
  $("admin-exams").innerHTML = h;
}

function setAdminExam(k){
  ADMIN_EXAM = k;
  renderExamTabs();
  renderAdminView();
}

function renderAdminView(){
  renderExamTabs();
  if (ADMIN_VIEW === "people"){
    $("admin-analysis").classList.add("hidden");
    $("admin-table").classList.remove("hidden");
    renderPeople();
  } else {
    $("admin-table").classList.add("hidden");
    $("admin-analysis").classList.remove("hidden");
    renderAnalysis();
  }
}

function renderPeople(){
  var box = $("admin-table"), users = ADMIN_USERS || [];
  if (!users.length){
    box.innerHTML = '<p class="small">No one has signed in yet.</p>';
    return;
  }
  users.sort(function(a,b){
    return ((b.logins[b.logins.length-1]) || 0) - ((a.logins[a.logins.length-1]) || 0);
  });
  var h = '<p class="small">' + esc(EXAMS[ADMIN_EXAM].name) + ': ' + examPassMark(ADMIN_EXAM) + ' of ' + examTotal(ADMIN_EXAM) +
    ' to pass. Results are graded automatically.</p>' +
    "<table><tr><th>Name</th><th>Email</th><th>Logins</th><th>Last login</th><th>Attempts</th><th>Best</th><th>Status</th><th>Flags</th><th>Admin</th></tr>";
  users.forEach(function(u, ui){
    var at = attemptsFor(u, ADMIN_EXAM);
    var best = at.length ? Math.max.apply(null, at.map(function(a){ return a.score; })) + " / " + examTotal(ADMIN_EXAM) : "";
    var certified = at.some(function(a){ return a.finalPass; });
    var status = certified ? '<span class="ok">Certified</span>' : at.length ? '<span class="flag">Not yet</span>' : "";
    var flags = [];
    /* Compare the number itself: a run fast enough to round to 0.0 minutes is
       the most suspicious kind there is, and a truthiness check would let it
       slip through unflagged. */
    if (at.some(function(a){ return typeof a.mins === "number" && a.mins < FAST_MINUTES; })) flags.push('<span class="flag">fast</span>');
    if ((u.logins || []).length > at.length + 2) flags.push('<span class="flag">logins &gt; attempts</span>');
    h += '<tr><td style="cursor:pointer;text-decoration:underline" onclick="document.getElementById(&#39;det'+ui+'&#39;).classList.toggle(&#39;hidden&#39;)">' +
      esc(u.name || "") + (u.tester ? ' <span class="flag">Tester</span>' : "") + '</td><td>' + esc(u.email) + '</td><td>' +
      (u.logins || []).length + '</td><td>' + (u.logins && u.logins.length ? fmtDate(u.logins[u.logins.length-1]) : "") + '</td><td>' +
      at.length + '</td><td>' + best + '</td><td>' + status + '</td><td>' + flags.join(" ") + '</td><td>' +
      '<button class="ghost" style="margin:0;padding:5px 9px;font-size:12px" onclick="adminAction(&#39;'+esc(u.email)+'&#39;,&#39;reset&#39;)">Reset</button> ' +
      '<button class="ghost" style="margin:0;padding:5px 9px;font-size:12px" onclick="adminAction(&#39;'+esc(u.email)+'&#39;,&#39;tester&#39;,'+(!u.tester)+')">'+(u.tester ? "Untester" : "Tester")+'</button> ' +
      '<button class="ghost" style="margin:0;padding:5px 9px;font-size:12px" onclick="adminAction(&#39;'+esc(u.email)+'&#39;,&#39;delete&#39;)">Delete</button>' +
      '</td></tr>';
    h += '<tr class="hidden" id="det'+ui+'"><td colspan="9">' + attemptDetail(u, at) + '</td></tr>';
  });
  h += "</table>";
  box.innerHTML = h;
}

/* ------------------------------ coaching layer ------------------------------

   Everything below exists so a trainer clicking a name sees not just that a
   question was missed, but which wrong idea the rep actually holds, what to
   say to fix it, and what the pattern of their wrong choices says about how
   they will behave on a live call. */

/* What to tell a rep who missed this question, keyed by bank index. Anything
   without an entry falls back to walking them through the trained answer. */
var COACH = {
  0:"Re-teach the two strategies as one arc: swing trading builds the account, the Paycheck Collector sells options to collect premium upfront. Have them say it back in thirty seconds.",
  1:"The platform answer is ThinkOrSwim first, for back-testing and paper trading, then coaching walks them to whatever broker they prefer. Never dodge a platform question.",
  5:"The fifteen thousand is a filter for serious people, not an entry requirement. Role-play qualifying by speaking to capital instead of asking for it.",
  9:"The video ask has to end in a commitment: pin down exactly when they will watch, then ask for a two sentence text afterwards. Role-play that close until it is automatic.",
  10:"Brand new is not an obstacle, it is the fit: Steve specializes in people who have never traded. Practice welcoming the beginner instead of hesitating on them.",
  14:"Lead the guarantee with the catch, told straight: do the work, keep the trading log, then it pays. Serious people trust conditions, tourists want no questions asked.",
  18:"A crypto asker stays: the foundation transfers and options is just our vehicle. Practice bridging from what they asked for to what actually gets them there.",
  37:"Losing money is the surface complaint. Coach two more questions before any pitch: what is the money for, who is it for, what changes when it works.",
  38:"When a prospect names the exact problem we solve, do not pitch early. Finish discovery first, so the close lands on full information instead of one lucky line.",
  40:"An emotional line like the kids' games is close material: write it down word for word and spend it back at the close in their own words.",
  41:"\"Might\" beats \"will\" in the transition: might keeps them leaning in and asking, will hands them certainty too early. Drill the permission-based pitch opening.",
  44:"Present one tier, chosen from their own words, never the menu. Three options makes people afraid of picking wrong, and afraid people stall.",
  48:"Split payments live or die on setup: right initial amount, right recurring amount, right period, and the subscription must end after the agreed cycles.",
  52:"A call where the prospect did most of the talking is a call run right. People who talk themselves into it buy at a different level than people who were talked into it.",
  54:"Guarantee terms exactly: follow the training, prove the work with coaching attendance and a trading log, no profit means money back. Never unconditional, never dodged.",
  55:"Legitimacy is receipts, not adjectives: four disputes in 959 transactions since 2021, BBB A plus, a public Trustpilot page, and an open community full of real students.",
  56:"P and L screenshots are how people get scammed, and presenting results as proof can cross a legal line. We show the service and let skeptics meet real students.",
  57:"The four Ms in order: Mindset, Manageable technicals, Mentorship, Mastermind. Mindset first, because a strategy taught to an unprepared brain reads as \"it does not work\".",
  58:"Not knowing is fine, hiding it is not: say so, find out, text them the same day. The follow-up text is one more touch before the call anyway.",
  59:"Hostility is usually armor from being burned. Stay warm, get curious about what is under it, and if it stays abusive end it kindly. We are picky on purpose.",
  60:"Never book an unqualified call to protect a number. A wasted Education Coordinator hour costs more than a missing booking. The open community, which costs nothing, is the graceful give.",
  61:"The fifteen a month cap is real scarcity, said as fact. Inventing a lower number is lying to a prospect, and it is a habit that ends careers.",
  62:"The blow up story: twenty nine thousand in twenty nine days at age twenty nine, then twenty thousand more on options. It normalizes their losses and lands the point that the system, not the person, was the problem.",
  63:"Strategy numbers are training results, never promises. Pair any figure with the real promise: a trade in a week, self-sufficient around ninety days, the guarantee if the work is done."
};

/* What choosing a specific wrong option says about the person, keyed
   "bankIndex:optionIndex". Only distractors that are genuinely diagnostic are
   tagged: a factual mix-up says nothing about character, but choosing to
   invent scarcity or dodge a hard question does. */
var TRAITS = {
  "1:3":"dodges hard questions",
  "9:2":"pressures instead of guides", "9:3":"avoids the ask",
  "54:1":"overpromises", "54:2":"dodges hard questions", "54:3":"overpromises",
  "55:1":"compliance risk", "55:3":"sloppy on details",
  "56:2":"dodges hard questions", "56:3":"overpromises",
  "58:1":"wings it instead of checking", "58:2":"dodges hard questions", "58:3":"chases the booking",
  "59:1":"reactive under pressure", "59:2":"gives up early", "59:3":"overpromises",
  "60:1":"chases numbers over quality", "60:3":"ethics risk",
  "61:1":"invents urgency", "61:2":"avoids the ask", "61:3":"overpromises",
  "63:1":"overpromises", "63:2":"dodges hard questions"
};

/* Stored results reference questions by bank index, and the bank has been
   edited once in a way that shifted indices: the Aug 4 lesson inserted eight
   Part One questions ahead of Part Two, moving every original Part Two
   question up by eight. Attempts record bn (the bank size that graded them)
   since then, and the bank is append-only since then, so:
   - an attempt with bn: any bi below it is already correct, forever
   - no bn: the attempt's own total dates it, since no two generations share
     one. 27 or 34 is the original 45-bank, whose Part Two sat 8 lower. 35 or
     38 is the 54-bank, whose indexing already matches today's. */
function decodeBi(a, bi){
  if (a && a.bn) return bi < a.bn ? bi : null;
  var legacy45 = a && (a.total === 27 || a.total === 34);
  var d = legacy45 && bi >= 27 ? bi + 8 : bi;
  return d < BANK.length ? d : null;
}

function correctTextOf(q, v){
  if (q.type === "mc"){
    for (var i = 0; i < q.opts.length; i++) if (q.opts[i].c) return q.opts[i].t;
  }
  return q.vars[v] && q.vars[v].a ? "True" : "False";
}

/* The trainer-facing read on one person: are they solid, where are they weak,
   and what their wrong choices say about them. Deliberately plain sentences,
   because Kaleb reads this between calls. */
function personAssessment(u, at){
  if (!at.length) return "";
  var best = at.reduce(function(m, a){ return a.score > m.score ? a : m; }, at[0]);
  var certified = at.some(function(a){ return a.finalPass; });
  var passMark = Math.ceil(PASS_PCT * (best.total || examTotal(ADMIN_EXAM)));
  var margin = best.score - passMark;
  var lines = [];

  if (certified){
    lines.push(margin >= 3
      ? "Certified with room to spare: best score clears the pass mark by " + margin + "."
      : "Certified, but at the line: best score clears the pass mark by " + (margin < 1 ? "nothing" : margin) + ". Verify the misses below in person before treating this as solid.");
  } else {
    var left = Math.max(0, MAX_ATTEMPTS - at.length);
    lines.push("Not certified. " + (left ? left + " attempt" + (left>1?"s":"") + " remaining." : "No attempts remaining without a trainer reset."));
  }
  if (typeof best.mins === "number" && best.mins < FAST_MINUTES){
    lines.push("Their best run took " + best.mins + " minutes, which is fast enough to question how carefully they read.");
  }

  /* Weakest area, computed from the misses themselves so it works on every
     generation of the bank. */
  var tr = {};
  (best.perQ || []).forEach(function(p){
    var d = decodeBi(best, p.bi);
    if (d === null) return;
    var t = trackOf(d);
    tr[t] = tr[t] || {asked:0, missed:0};
    tr[t].asked++;
    if (!p.ok) tr[t].missed++;
  });
  var label = {product:"product knowledge", setting:"the setting call", strategy:"the strategy call"};
  var worst = null;
  Object.keys(tr).forEach(function(k){
    if (tr[k].missed && (!worst || tr[k].missed / tr[k].asked > tr[worst].missed / tr[worst].asked)) worst = k;
  });
  if (worst) lines.push("Weakest area on their best attempt: " + label[worst] + ", " + tr[worst].missed + " of " + tr[worst].asked + " missed.");

  /* Personality signals, from which wrong answers they chose across every
     attempt. Only attempts new enough to have recorded the choice count. */
  var sig = {}, anyPicks = false;
  at.forEach(function(a){
    (a.perQ || []).forEach(function(p){
      if (p.ok || typeof p.pick !== "number") return;
      anyPicks = true;
      var d = decodeBi(a, p.bi);
      if (d === null) return;
      var t = TRAITS[d + ":" + p.pick];
      if (t) sig[t] = (sig[t] || 0) + 1;
    });
  });
  var sigKeys = Object.keys(sig).sort(function(a,b){ return sig[b] - sig[a]; });
  if (sigKeys.length){
    lines.push("Pattern in the wrong answers they chose: " + sigKeys.map(function(k){ return k + (sig[k] > 1 ? " (" + sig[k] + "×)" : ""); }).join(", ") + ". Probe this in the interview, it predicts call behavior.");
  } else if (anyPicks){
    lines.push("No concerning pattern in which wrong answers they chose: their misses read as knowledge gaps, not character ones.");
  }
  return '<div class="wbox" style="border-left:4px solid var(--gold)"><b>Trainer read</b><br>' +
    lines.map(esc).join("<br>") + '</div>';
}

function attemptDetail(u, at){
  at = at || [];
  if (!at.length) return '<p class="small">No attempts at this certification.</p>';
  var h = personAssessment(u, at);
  at.forEach(function(a, ai){
    var outOf = a.total || examTotal(ADMIN_EXAM);
    h += '<div class="wbox"><b>Attempt ' + (ai+1) + '</b> &middot; ' + fmtDate(a.ts) + ' &middot; ' +
      a.score + '/' + outOf + ' &middot; ' + a.mins + 'm &middot; ' +
      (a.finalPass ? '<span class="ok">Certified</span>' : '<span class="flag">Not yet</span>');
    var secs = a.sectionScores || {};
    var parts = Object.keys(secs).map(function(k){
      var label = {product:"Product", setting:"Setting call", strategy:"Strategy call"}[k] || k;
      return label + ": " + secs[k];
    });
    if (parts.length) h += '<br><span class="small">' + esc(parts.join(" · ")) + '</span>';

    /* Every miss, with what they chose, the trained answer, and what to say. */
    (a.perQ || []).forEach(function(p){
      if (p.ok) return;
      var d = decodeBi(a, p.bi);
      if (d === null) return;
      var q = BANK[d];
      var v = a.served && typeof a.served["q" + p.bi] === "number" ? a.served["q" + p.bi] : 0;
      var stem = q.type === "mc" ? q.stems[Math.min(v, q.stems.length - 1)] : q.vars[Math.min(v, q.vars.length - 1)].s;
      var picked = null;
      if (typeof p.pick === "number"){
        picked = q.type === "mc" ? (q.opts[p.pick] ? q.opts[p.pick].t : null) : (p.pick === 1 ? "True" : "False");
      }
      var trait = typeof p.pick === "number" ? TRAITS[d + ":" + p.pick] : null;
      h += '<div style="margin:8px 0 0;padding:8px 10px;border-left:3px solid var(--fail);background:#fff">' +
        '<b>Missed:</b> ' + esc(stem) + '<br>' +
        '<span class="flag">They chose:</span> ' + (picked ? esc(picked) : '<i>answer choice was not recorded on this attempt</i>') +
        (trait ? ' <span class="flag">[signal: ' + esc(trait) + ']</span>' : '') + '<br>' +
        '<span class="ok">Trained answer:</span> ' + esc(correctTextOf(q, Math.min(v, (q.vars||[]).length ? q.vars.length-1 : 0))) + '<br>' +
        '<b>Coach:</b> ' + esc(COACH[d] || "Walk them back through the trained answer above until they can say it in their own words.") +
        '</div>';
    });
    h += '</div>';
  });
  return h;
}

/* Question analysis: every question ranked by miss rate across all real
   (non-tester) attempts. Red flag at 40 percent or higher with 2 or more misses. */
function renderAnalysis(){
  var box = $("admin-analysis"), users = ADMIN_USERS || [];
  var stats = {};
  users.forEach(function(u){
    if (u.tester) return;
    attemptsFor(u, ADMIN_EXAM).forEach(function(a){
      (a.perQ || []).forEach(function(p){
        if (typeof p.bi !== "number") return;
        /* Decode through the bank generation the attempt was graded on, so an
           old record counts against the question it actually asked rather
           than whatever now sits at that index. */
        var d = decodeBi(a, p.bi);
        if (d === null) return;
        if (!stats[d]) stats[d] = {asked:0, missed:0};
        stats[d].asked++;
        if (!p.ok) stats[d].missed++;
      });
    });
  });
  var trackLabel = {product:"Product", setting:"Setting call", strategy:"Strategy call"};
  var rows = examItems(ADMIN_EXAM).map(function(bi){
    var q = BANK[bi];
    var s = stats[bi] || {asked:0, missed:0};
    var pct = s.asked ? Math.round(100 * s.missed / s.asked) : 0;
    var label = q.type === "mc" ? q.stems[0] : q.vars[0].s;
    return {bi:bi, part:trackLabel[trackOf(bi)], label:label, asked:s.asked, missed:s.missed, pct:pct,
            hot:s.asked > 0 && pct >= 40 && s.missed >= 2};
  });
  rows.sort(function(a,b){
    if ((b.asked>0) !== (a.asked>0)) return (b.asked>0) ? 1 : -1;
    if (b.pct !== a.pct) return b.pct - a.pct;
    if (b.missed !== a.missed) return b.missed - a.missed;
    return a.bi - b.bi;
  });
  var anyData = rows.some(function(r){ return r.asked > 0; });
  var h = '<p class="small">All ' + rows.length + ' questions on the ' + esc(EXAMS[ADMIN_EXAM].name) +
    ' ranked by miss rate across every real attempt at it. Tester accounts are excluded. ' +
    '<span class="flag">Red rows</span> are missed by 40 percent or more of attempts, with at least 2 misses: either a training gap or a question worth reviewing.</p>';
  if (!anyData) h += '<p class="small">No attempt data yet. This table fills in as the team takes this certification.</p>';
  h += "<table><tr><th>#</th><th>Section</th><th>Question</th><th>Asked</th><th>Missed</th><th>Miss rate</th></tr>";
  rows.forEach(function(r){
    h += '<tr' + (r.hot ? ' class="hot"' : '') + '><td>' + (r.bi+1) + '</td><td>' + r.part + '</td><td>' +
      esc(r.label.length > 110 ? r.label.slice(0,110) + "..." : r.label) + '</td><td>' + r.asked + '</td><td>' +
      (r.hot ? '<span class="flag">' + r.missed + '</span>' : r.missed) + '</td><td>' + (r.asked ? r.pct + "%" : "") + '</td></tr>';
  });
  h += "</table>";
  box.innerHTML = h;
}

async function adminAction(email, type, on){
  if (type === "reset" && !confirm("Clear all attempts for " + email + "? Logins stay logged.")) return;
  if (type === "delete" && !confirm("Remove " + email + " and their whole history from the dashboard? This cannot be undone.")) return;
  try {
    await api("/api/admin-action", {code:ADMIN_CODE_ENTERED, email:email, type:type, on:on});
    loadAdmin();
  } catch(e){
    alert(e.message);
  }
}

/* Resume an interrupted attempt as soon as the page comes back. */
if (typeof window !== "undefined" && window.addEventListener){
  window.addEventListener("DOMContentLoaded", function(){
    try { restoreSession(); } catch(e){ clearSession(); }
  });
}
