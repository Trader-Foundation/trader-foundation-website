"use strict";
/* Trader Foundation | Sales Family Certification exam engine.
   Served as a PLAIN TEXT static file on purpose. Earlier builds shipped this
   engine as a compressed binary (app.bin) and the upload path corrupted the
   binary every time. Keep this file plain text. */
var CERT_VERSION = "2026-07-30-repo-r1";

var MAX_ATTEMPTS = 3, PASS_PCT = 0.8, FAST_MINUTES = 12;

/* Question bank. 45 questions: 27 in Part One, 18 in Part Two.
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

/* 28 */ {part:2,type:"mc",stems:[
"You open with, \"This is really just for the two of us to figure out if what we do is even a fit for you.\" Why say it that way, and how long should rapport run before discovery?",
"What does the fit-focused opening frame accomplish, and what is the trained length for rapport at the top of the call?"],
opts:[
{t:"It sets the frame and lowers their guard, takes the commissioned breath out of the call, and quietly makes it exclusive since both sides are deciding. Rapport runs about a minute, because five minutes makes you a friend and it is easy to say no to a friend. Real rapport gets built through caring questions inside discovery.",c:true},
{t:"It is mostly a professional way to fill the first moments while you pull up their file and get organized, and rapport should run a good five minutes, because people only open up in discovery after the small talk has fully warmed them up."},
{t:"It politely warns them the call will be short and business-only, and rapport should be skipped entirely. High-ticket buyers respect efficiency, and every minute spent on small talk at the top is selling time you never get back."},
{t:"It is the compliance-required fit disclaimer read at the top of every recorded call, and on a high-ticket offer rapport should run around fifteen minutes, because an ask this size demands a real relationship before any hard question lands. The relationship math is simple: nobody wires five figures to a stranger, so the first quarter of the call is where the money actually gets made, long before discovery starts."}]},

/* 29 */ {part:2,type:"mc",stems:[
"What does KYOSWAQ stand for, who controls the sale, and whose words count as true?",
"Break down KYOSWAQ: the acronym, the control principle, and whose statements actually carry weight on the call."],
opts:[
{t:"Know Your Outcome, Start With A Question. Whoever asks more questions controls the sale, and a prospect with unanswered questions stays curious instead of defensive. Only their words count as true: never state their pain for them, even when you are almost certainly right. If you say it, it becomes a battle. If they say it, it is true. Ask \"how did that go?\" and let them talk.",c:true},
{t:"Keep Your Offer Simple, Watch And Qualify. The rep keeps control of the sale by doing most of the talking and keeping the offer easy to follow, and the rep's professional read of the situation is what counts as the truth on the call. The logic is that a confused buyer never buys, so the rep carries the conversation, keeps every explanation to one sentence, and treats their own experienced judgment of the prospect's situation as the ground truth the close gets built on."},
{t:"Know Your Objections, Sell With A Quote. Control comes from anticipating every objection before it lands and leading with the price early, because whoever gets the number on the table first is the one framing the entire negotiation."},
{t:"It is the name of the CRM the team uses for booking and tracking calls, and this question is really checking whether you finished the software training. Control of the sale and whose words count are covered in a different module."}]},

/* 30 */ {part:2,type:"mc",stems:[
"A prospect says, \"I just do not know how to trade properly and I keep losing money.\" Is that the real problem?",
"\"My problem is I keep losing money and I do not really know what I am doing.\" Surface problem or real problem?"],
opts:[
{t:"No, it is surface. Nobody wants profitability for its own sake. There is something behind it: what the money is for, who it is for, what situation he is trying to get out of. Keep digging until you find that.",c:true},
{t:"Yes. He named the problem clearly and in his own words, losing money and not knowing what he is doing, so discovery has done its job, and the trained move at that point is transitioning into the pitch while the pain is still fresh."},
{t:"Neither, honestly. Lines like that are just how prospects make conversation at the top of a call, so you note the sentiment, keep the tone light, and wait for something concrete about money or family before treating anything as real."},
{t:"Yes, but only once he has said it twice. A problem stated a single time is a passing complaint, and a problem the prospect repeats is a priority, so you circle back later and see whether he brings it up again on his own."}]},

/* 31 */ {part:2,type:"mc",stems:[
"Mid-discovery the prospect names the exact problem we solve: \"I need someone to keep me accountable.\" What do you do?",
"During discovery the prospect hands you the perfect setup line for our coaching. What is the trained move?"],
opts:[
{t:"Do not get baited. Present nothing. Discovery has barricades, and you do not get past one until you have everything you need about them. Presenting early hands them the answer and ends their curiosity.",c:true},
{t:"Say something like, \"I am really glad you mentioned that, because accountability is exactly what our one-on-one coaching is built around,\" and begin presenting. When a prospect hands you the opening, taking it right away is what listening looks like."},
{t:"Quote the price on the spot, since a prospect who names the exact problem you solve is clearly already sold, and the fastest path from there is finding out whether the budget is real before either of you invests more time in the call."},
{t:"Gently change the subject so they forget they said it, and save the accountability card for the close. If they connect our offer to their problem this early, the pitch later has nothing new in it and the ending falls flat."}]},

/* 32 */ {part:2,type:"mc",stems:[
"The prospect says he has no system and panic sells. What is the trained way to magnify that?",
"A prospect admits he panic sells with no system. How do you magnify the problem the trained way?"],
opts:[
{t:"\"Has that had an impact on you?\" and when he says yes, \"In what way, though?\" That pulls him out of the guarded, logical headspace and into what it has actually cost him, which is where a real decision gets made.",c:true},
{t:"Say, \"Yeah, that is rough, we honestly see it all the time,\" so he knows he is not alone and does not shut down from embarrassment, then move into what we do, since normalizing the problem is what keeps the call comfortable for him."},
{t:"Do the math for him out loud, estimating how much the panic selling has probably cost him over a year, and let the size of that number do the magnifying. Specific dollar figures land harder than feelings on a logical buyer."},
{t:"Touch it lightly and move past it quickly so the energy of the call stays positive. Dwelling on failure puts a prospect in a defensive headspace, and people buy from optimism about the future, not from reliving their worst trades."}]},

/* 33 */ {part:2,type:"mc",stems:[
"The prospect says, \"I want to be home for my kid's games. He is 12, I do not get these years back.\" What do you do with that, and what question comes next?",
"The prospect gives you an emotional line about missing his son's games. What happens to that line, and what do you ask next?"],
opts:[
{t:"Write it down word for word and bank it, because that exact line gets spent at the close in his own words. Then future pace it: \"have you given any thought to what happens if nothing changes over the next six to twelve months?\" Say nothing after that and do not rescue the moment. If anything, \"and what would happen then?\"",c:true},
{t:"Acknowledge it warmly, tell him that is exactly the kind of reason people come to us, and use the emotional high point as your cue to move into the pitch, because a moment like that is the peak of the call and you present into it. Emotion has a shelf life measured in seconds, and the reps who wait for a cleaner moment later in the call are the ones wondering afterward why the close felt flat."},
{t:"That line tells you a spouse is in the picture, so the next question is whether his wife needs to be part of the decision, because there is no point building a close around the kid if the real objection is waiting at home later."},
{t:"Capture the idea in your notes in cleaner language, something like values family time over income growth, and keep moving. The exact wording fades by the close anyway, and what you need for later is the theme, not the sentence."}]},

/* 34 */ {part:2,type:"mc",stems:[
"Transitioning to the pitch you say, \"What we do might actually work for you. With your permission, let me walk you through a few things. Is that okay?\" Why \"might,\" and why ask permission?",
"The transition uses \"might\" instead of \"will\" and asks permission before presenting. What is the strategy behind each?"],
opts:[
{t:"\"Might\" keeps them leaning in and asking what exactly they would have to do, where \"will\" hands them certainty and closes the loop early. Permission is a small yes in a chain of small yeses, each one reinforcing that this is their idea rather than something being done to them.",c:true},
{t:"The word \"might\" protects the company legally by never promising a fit, and asking permission creates a documented moment of consent on the recording, which matters if a client ever disputes what they agreed to hear on the call."},
{t:"Both are really just politeness. They are in the script because calls flow better when reps sound courteous, but neither word carries strategy, and swapping them for your own phrasing changes nothing about how the pitch lands."},
{t:"\"Might\" keeps you sounding humble instead of salesy, and the permission question is a practical check that they are still engaged and have not tuned out, since long discovery sections lose people and you want proof of attention."}]},

/* 35 */ {part:2,type:"mc",stems:[
"How should the pitch be structured?",
"What is the trained structure of the presentation itself?"],
opts:[
{t:"Three commitments, each wrapped in their story. Build the foundation so they have total clarity and can place a trade in the first seven days. Teach them to sell options and collect premium, the engine behind the Paycheck Collector. Support it with the one-on-one coaching. Same concepts every call, framed with what this person actually told you.",c:true},
{t:"Recite the full feature list in the same fixed order on every call, because consistency is what makes a pitch trainable and reviewable, and a rep who customizes the order call to call is a rep whose numbers cannot be diagnosed when they slip. Sales is a numbers game run on repetition, and once every rep delivers the same presentation the same way, the data tells you exactly which sentence in the pitch is leaking prospects."},
{t:"Lead with the guarantee to remove the risk, follow immediately with the price while trust is at its peak, and then stop talking entirely. The first person to speak after the number loses, so the pitch is really those two beats and silence."},
{t:"Open by asking what they would want a program like this to include, then agree and confirm we do each thing they name. Building the pitch out of their wish list means there is nothing left to object to when you reach the close."}]},

/* 36 */ {part:2,type:"mc",stems:[
"A prospect says he has tried courses before and they never worked. How do you present the one-on-one coaching?",
"\"I have bought two trading courses. Watched maybe half of the first, never finished the second. I do not want to waste money again.\" Which presentation of our coaching is trained?"],
opts:[
{t:"Use contrast. Remind him of his own experience first: most people who buy courses finish with more questions than answers, and the worst part is they walk away thinking they are stupid, when what they actually missed was mentorship. Then the coaching lands as the fix for a pain he already named, not a feature on a list.",c:true},
{t:"Answer it simply, \"we do unlimited one-on-one coaching,\" and keep the presentation moving to the next feature. The list itself is impressive enough, and slowing down to dwell on his past purchases gives the bad memories more air time."},
{t:"Take the comparison head-on: explain that our course is better produced, more current, and more complete than whatever he bought before, so even the self-study portion alone beats the products that burned him, before you get to coaching."},
{t:"Steer clear of the topic entirely, since bringing up his past courses invites him to compare us to things that failed him. Present the coaching fresh, on its own merits, and let the contrast happen silently in his head without naming it. The past is a minefield you do not control, and the version of our offer that lives in his imagination, untouched by his history, closes better than any comparison you could win out loud."}]},

/* 37 */ {part:2,type:"mc",stems:[
"You have three tiers. How many do you present, and when is the price named?",
"Tier presentation and price timing: what is the trained standard?"],
opts:[
{t:"One, chosen from what they told you and anchored to their own words, because multiple selections make people afraid of picking wrong and a prospect afraid of choosing wrong will do whatever it takes to get off the call. On timing, the price is in the room whether you name it or not, so naming it inside the pitch gives them the rest of the presentation to justify it while they are still hooked emotionally. What is absolute is that the moment the number lands, you are ready to justify it.",c:true},
{t:"Present all three tiers every time, with the prices held to the very end so the value lands first. Options are how buyers feel in control, and a prospect who picks a package himself is more committed than one handed a single answer."},
{t:"Present exactly two, priced upfront, so the cheaper one anchors the more complete one. A two-way comparison is the classic frame that moves people toward the bigger option without pressure, and leading with numbers builds trust early. Car dealers, insurance brokers, and every subscription page on the internet run the same two-option frame because it works: the small option makes the big option look complete instead of expensive, the buyer feels smart for choosing up, and the question of whether to buy quietly becomes which one to buy, which is the close doing itself."},
{t:"Present none at all, and let them ask. If discovery ran well, curiosity about packages and price comes from their side, and a pitch that never has to introduce money holds the strongest frame a sales call can have."}]},

/* 38 */ {part:2,type:"mc",stems:[
"A prospect who said money is not the issue says, \"Let me think about it over the weekend.\" What is the read and the next move?",
"After the pitch, a qualified prospect who never raised money wants to \"think about it.\" What is the trained read and move?"],
opts:[
{t:"It is vague and money was never raised, so treat it as a possible smokescreen. Apply light pressure once with a non-threatening question, like \"money aside for a second, do you feel like this is the thing that actually solves it for you?\" Then watch whether the objection shrinks and names itself, or grows.",c:true},
{t:"Respect it completely, thank him for his time, and set a follow-up for next week. Pressure of any kind after someone asks for space is what creates refunds and bad reviews, and a weekend of thinking usually firms a good prospect up. The prospects who come back after a respected weekend close at full conviction, refer their friends, and stay clients for years."},
{t:"Run the pitch again from the top with more energy and better stories, because a prospect who wants to think it over is really telling you the presentation did not land the first time, and the second pass is where these calls get saved."},
{t:"Bring out a discount that expires when the call ends, since a real deadline with real savings turns thinking about it into a decision today, and a prospect who walks away from a discount was never going to buy at full price anyway."}]},

/* 39 */ {part:2,type:"mc",stems:[
"Light pressure worked and the objection named itself: \"The money is not the issue, I just always tell myself I will start things later.\" What now?",
"The smokescreen dropped and the real objection is his habit of putting things off. What is the trained move?"],
opts:[
{t:"Drive it gently using the bank. Name the pattern with his own words: he told you that if nothing changes he is in the same spot a year from now, still the only one making the money, still missing the games. Later is the exact thing it has already cost him. Then finish with a question, not a statement: what actually changes by next week that we cannot handle right now?",c:true},
{t:"Accept the answer at face value and get a follow-up on the calendar before you hang up. He named a real thing about himself, and honoring it builds the kind of trust that closes next month instead of forcing a no today that sticks. A no forced today closes the file forever, but a booked follow-up keeps the door open, and his own words will still be waiting in your notes next month when the same pain is still there."},
{t:"Tell him directly that he is making excuses, that later is a lie people tell themselves, and that he needs to decide right now on the call. Some prospects only move when someone finally refuses to accept the pattern from them."},
{t:"Drop the price, because a habit of putting things off usually dissolves the moment the deal gets sweeter, and a one-time number he will not see again gives him a reason to break the pattern today without anyone naming it out loud."}]},

/* 40 */ {part:2,type:"mc",stems:[
"Three prospects respond differently to light pressure. Which reads match the trained gears?",
"Drive, Step Back, Disqualify: which answer applies the three gears correctly?"],
opts:[
{t:"Drive when they like it and have the means. Step back when they want it but are burned or scared. Disqualify when there is real debt or they are genuinely not a fit.",c:true},
{t:"Drive every prospect with equal pressure, because hesitation is always a smokescreen in disguise, and the gears really describe three intensities of the same push rather than three different reads of three different people."},
{t:"Step back from everyone who hesitates, without exception, since pressure of any kind damages the brand and generates disputes, and the prospects worth having will drive themselves once the information has had time to settle."},
{t:"Disqualify anyone who hesitates at all, on the spot. The pipeline is full, hesitation now predicts hesitation as a client, and the cleanest book of business comes from only enrolling people who say yes without a second question."}]},

/* 41 */ {part:2,type:"mc",stems:[
"A client agrees to split the payment, some today and the rest in 30 days. What matters most in setting up that payment link?",
"Split payment agreed: part now, part in 30 days. What matters most when you build the payment link?"],
opts:[
{t:"Set the initial amount and the recurring amount correctly, set the 30-day period, and end the subscription after the right number of periods so it cancels itself. Getting this wrong overcharges the client badly. If they ask about the service charge, it is the card processing fee, and it is never described as taxes.",c:true},
{t:"Honestly not much, as long as the total comes out right over time. The processor sorts out the details on its end, and small setup mistakes just shift when the money lands rather than how much of it there is, so speed matters more than precision."},
{t:"Always run financing first before building any split link, since practically everyone gets approved, the company gets its money upfront, and a client on a lender's schedule is a client whose payments are never yours to chase. The finance partners exist precisely so payment mechanics never sit in a rep's hands, where one typo can cost a client thousands."},
{t:"Charge the full amount today and refund the difference afterward, because collecting everything while the card is out protects the deal, and a refund is a clean, documented way to honor whatever split the two of you agreed to on the call."}]},

/* 42 */ {part:2,type:"mc",stems:[
"Earlier in the call the prospect said he wants to stop working weekends to be around for his daughter, and that if nothing changes he is in the same place next year. He now says: \"It is my busy season, I cannot focus on this.\" Which response is trained?",
"The prospect banked strong lines about his daughter and being stuck, and now says busy season means he cannot do this. Pick the trained response."],
opts:[
{t:"I hear you, and I am not going to pretend busy season is not real. But can I be straight with you for a second? Earlier you told me the whole reason you are here is the weekends, being around for your daughter, and that if nothing changes you are in the same place next year. So I am just curious, is it really the time, or is this the pattern you told me about? What actually changes after busy season that we cannot handle right now?",c:true},
{t:"What is really stopping you here? Come on, be honest with yourself for a second, because we both know it is not the season. Sometimes the kindest thing a coach can do is refuse the surface answer until the real one shows up. The training calls this holding the mirror: you drop the polite fiction, let the silence sit, and force the real objection into the open in one move. It is uncomfortable on purpose, because comfort is what let him put things off for years, and the reps who can sit in that silence are the ones who save the calls everyone else loses."},
{t:"That honestly sounds like an excuse, and I say it with respect. Busy people make time for the things that matter to them, so if this mattered, the season would not be the deciding factor, and maybe that tells us both something."},
{t:"I hear you, so let me make it easier: if you can start today I can knock a thousand off, and busy season stops being a money conversation. That way the timing problem and the price problem solve each other on this one call."}]},

/* 43 */ {part:2,type:"tf",vars:[
{s:"If a client asks about the service charge at checkout, it is fine to tell them it is taxes.",a:false},
{s:"The service charge at checkout is the card processing fee, and you never describe it as taxes.",a:true}]},

/* 44 */ {part:2,type:"tf",vars:[
{s:"Your job during discovery is to give the prospect good advice about what they are doing wrong.",a:false},
{s:"During discovery you never give advice. Your job is to ask the questions that get the prospect to say it themselves.",a:true}]},

/* 45 */ {part:2,type:"tf",vars:[
{s:"A call where the prospect talked far more than you did, and you barely said a word before they bought, means you ran it wrong.",a:false},
{s:"Prospects who talk themselves into it buy at a different level than prospects who were talked into it, so a call where they did most of the talking is a call run correctly.",a:true}]}
];

var WRITTEN = [
{part:1,stem:"You are on a setting call. The prospect interrupts: \"Look, before I get on any Zoom, just tell me straight. How much does this cost?\" Write exactly what you would say."},
{part:1,stem:"A prospect just told you: \"I tried day trading futures for a year, blew up two accounts, and I think my problem is I do not follow my own rules. I still want this to work.\" Write two or three sentences introducing Steve and the upcoming call using the specialist frame, built from what this prospect said. Do not use the phrase people like you."},
{part:2,stem:"Earlier in the call the prospect said he wants to stop working weekends so he can be around for his daughter, and that if nothing changes he will be in the same place next year. He now says: \"I am just really busy right now, it is my busy season, I cannot focus on this.\" Write your response using what he already gave you."}
];

/* ------------------------------ app state ------------------------------ */

var CURRENT = null, ATTEMPT = null, ADMIN_CODE_ENTERED = "", ADMIN_USERS = null, ADMIN_VIEW = "people";

function $(id){ return document.getElementById(id); }

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
    CURRENT = {name:name, email:info.email, info:info};
    $("menu-user").textContent = name + " (" + info.email + ")";
    renderMenuStatus();
    show("scr-menu");
  } catch(e){
    $("login-err").textContent = e.message;
  }
  $("btn-login").disabled = false;
}

function logout(){
  CURRENT = null;
  $("in-name").value = "";
  $("in-email").value = "";
  show("scr-login");
}

function renderMenuStatus(){
  var info = CURRENT.info;
  $("btn-start").disabled = false;
  if (info.tester){
    $("menu-status").textContent = "Tester account: attempts do not count against the limit and are labeled TESTER in the dashboard.";
    return;
  }
  var t = info.attemptCount === 0
    ? "You have not attempted the certification yet. "
    : "Attempts used: " + info.attemptCount + " of " + MAX_ATTEMPTS + "." +
      (info.bestScore !== null && info.bestScore !== undefined ? " Best score: " + info.bestScore + " of " + info.total + "." : "") + " ";
  if (info.passed){
    t += "You have already passed. Additional attempts are for practice.";
  } else if (info.attemptCount >= MAX_ATTEMPTS){
    t += "No attempts remaining. Speak with your trainer to unlock another attempt.";
    $("btn-start").disabled = true;
  } else {
    t += "Attempts remaining: " + (MAX_ATTEMPTS - info.attemptCount) + ".";
  }
  $("menu-status").textContent = t;
}

/* ------------------------------ the exam ------------------------------ */

/* Builds one attempt. lastServed maps bank index -> variant served last time;
   retakes deliberately serve the other phrasing and flip true/false variants. */
function buildAttempt(lastServed){
  var prev = lastServed || {}, served = {}, items = [];
  BANK.forEach(function(q, bi){
    var v;
    if (q.type === "mc"){
      v = Math.floor(Math.random() * q.stems.length);
      if (prev["q"+bi] !== undefined && q.stems.length > 1) v = (prev["q"+bi] + 1) % q.stems.length;
      served["q"+bi] = v;
      items.push({part:q.part, type:"mc", bi:bi, stem:q.stems[v], opts:shuffle(q.opts.map(function(o){ return {t:o.t, c:!!o.c}; }))});
    } else {
      v = Math.floor(Math.random() * q.vars.length);
      if (prev["q"+bi] !== undefined && q.vars.length > 1) v = (prev["q"+bi] + 1) % q.vars.length;
      served["q"+bi] = v;
      items.push({part:q.part, type:"tf", bi:bi, stem:q.vars[v].s, ans:q.vars[v].a});
    }
  });
  return {
    items: shuffle(items.filter(function(i){ return i.part === 1; })).concat(shuffle(items.filter(function(i){ return i.part === 2; }))),
    served: served
  };
}

function startExam(){
  var built = buildAttempt(CURRENT.info.lastServed);
  ATTEMPT = {items:built.items, served:built.served, startTs:Date.now()};
  $("exam-user").textContent = CURRENT.name;
  renderExam();
  show("scr-exam");
  if (ATTEMPT.timerId) clearInterval(ATTEMPT.timerId);
  ATTEMPT.timerId = setInterval(function(){
    var s = Math.floor((Date.now() - ATTEMPT.startTs) / 1000);
    $("exam-timer").textContent = Math.floor(s/60) + ":" + String(s%60).padStart(2,"0");
  }, 1000);
}

function renderExam(){
  var body = $("exam-body"), html = "", n = 0;
  ATTEMPT.wdisp = [];
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
  var writtenBox = function(w, wi){
    n++; ATTEMPT.wdisp[wi] = n;
    return '<div class="q" id="qbox'+n+'"><p class="stem"><span class="qn">'+n+'.</span> '+esc(w.stem)+'</p>' +
      '<textarea id="w'+wi+'" rows="5" placeholder="One to three sentences, the way you would say it on a live call."></textarea>' +
      '<p class="small">Short written response, one to three sentences is plenty. Your trainer reviews these.</p></div>';
  };
  html += '<p class="secnum">Part One</p><h2 class="section">The Offer and the Setting Call</h2>';
  ATTEMPT.items.filter(function(i){ return i.part === 1; }).forEach(function(i){ html += choiceBox(i); });
  WRITTEN.forEach(function(w, wi){ if (w.part === 1) html += writtenBox(w, wi); });
  html += '<div class="note"><b>Part Two: The Strategy Call.</b> Everyone is tested on this so the whole team works from the same canon. These are the Education Coordinator&#39;s moves. You do not run discovery, present the pitch, name a price, or handle a close on a setting call.</div>';
  html += '<p class="secnum">Part Two</p><h2 class="section">The Strategy Call</h2>';
  ATTEMPT.items.filter(function(i){ return i.part === 2; }).forEach(function(i){ html += choiceBox(i); });
  WRITTEN.forEach(function(w, wi){ if (w.part === 2) html += writtenBox(w, wi); });
  body.innerHTML = html;
}

async function submitExam(){
  var total = ATTEMPT.items.length, unanswered = [];
  ATTEMPT.items.forEach(function(item){
    var sel = document.querySelector('input[name="q'+item.disp+'"]:checked');
    item.given = sel ? sel.value : null;
    if (item.given === null) unanswered.push(item.disp);
  });
  unanswered.sort(function(a,b){ return a-b; });
  var answers = [], emptyW = [];
  WRITTEN.forEach(function(w, wi){
    var v = $("w"+wi) ? $("w"+wi).value.trim() : "";
    answers.push(v);
    if (v.length === 0) emptyW.push(ATTEMPT.wdisp[wi]);
  });
  if (unanswered.length || emptyW.length){
    var msg = unanswered.length ? "Unanswered choice question" + (unanswered.length>1?"s":"") + ": " + unanswered.join(", ") + ". " : "";
    if (emptyW.length) msg += "Written answer" + (emptyW.length>1?"s":"") + " still empty at question" + (emptyW.length>1?"s":"") + " " + emptyW.join(", ") + ". One to three sentences is all it takes.";
    $("unanswered").textContent = msg;
    $("qbox" + Math.min.apply(null, unanswered.concat(emptyW))).scrollIntoView({behavior:"smooth"});
    return;
  }
  if (!confirm("Submit for grading? You cannot change answers after this.")) return;
  clearInterval(ATTEMPT.timerId);
  $("btn-submit").disabled = true;
  $("unanswered").textContent = "Saving your result...";

  var score = 0, part1 = 0, part2 = 0, perQ = [];
  ATTEMPT.items.forEach(function(item){
    var ok = item.type === "mc"
      ? item.opts[parseInt(item.given,10)].c === true
      : (item.given === "true") === item.ans;
    if (ok){ score++; if (item.part === 1) part1++; else part2++; }
    perQ.push({bi:item.bi, ok:ok});
  });
  var mins = Math.round((Date.now() - ATTEMPT.startTs) / 60000 * 10) / 10;
  var autoPass = score >= Math.ceil(PASS_PCT * total);
  var payload = {
    score:score, total:total, part1:part1, part2:part2, mins:mins, autoPass:autoPass,
    served:ATTEMPT.served, perQ:perQ,
    written: WRITTEN.map(function(w, wi){ return {stem:w.stem.slice(0,120), answer:answers[wi]}; })
  };
  try {
    await api("/api/submit", {email:CURRENT.email, attempt:payload});
    $("unanswered").textContent = "";
    $("res-score").textContent = score + " / " + total;
    $("res-verdict").textContent = autoPass ? "Pending written review" : "Not yet";
    $("res-verdict").className = "verdict " + (autoPass ? "pend" : "fail");
    $("res-detail").textContent = "Part One: " + part1 + ". Part Two: " + part2 + ". Time: " + mins +
      " minutes. Passing standard: " + Math.ceil(PASS_PCT * total) + " of " + total +
      " choice questions plus all written responses approved by your trainer.";
    CURRENT.info.attemptCount++;
    CURRENT.info.lastServed = ATTEMPT.served;
    show("scr-result");
  } catch(e){
    $("unanswered").textContent = "Save failed: " + e.message + " Press Submit to retry, your answers are still here.";
    $("btn-submit").disabled = false;
  }
}

function backToMenu(){
  renderMenuStatus();
  show("scr-menu");
}

/* ------------------------------ trainer dashboard ------------------------------ */

async function adminLogin(){
  ADMIN_CODE_ENTERED = $("in-admin").value;
  $("admin-err").textContent = "";
  try {
    await api("/api/admin?code=" + encodeURIComponent(ADMIN_CODE_ENTERED));
    $("in-admin").value = "";
    loadAdmin();
    show("scr-admin");
  } catch(e){
    $("admin-err").textContent = e.message;
  }
}

async function loadAdmin(){
  var box = $("admin-table");
  box.innerHTML = '<p class="small">Loading...</p>';
  try {
    ADMIN_USERS = (await api("/api/admin?code=" + encodeURIComponent(ADMIN_CODE_ENTERED))).users;
  } catch(e){
    box.innerHTML = '<p class="small">' + esc(e.message) + '</p>';
    return;
  }
  renderAdminView();
}

function toggleAdminView(){
  ADMIN_VIEW = ADMIN_VIEW === "people" ? "questions" : "people";
  $("btn-adminview").textContent = ADMIN_VIEW === "people" ? "Question analysis" : "Back to people";
  renderAdminView();
}

function renderAdminView(){
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
  var h = "<table><tr><th>Name</th><th>Email</th><th>Logins</th><th>Last login</th><th>Attempts</th><th>Best</th><th>Status</th><th>Flags</th><th>Admin</th></tr>";
  users.forEach(function(u, ui){
    var at = u.attempts || [];
    var best = at.length ? Math.max.apply(null, at.map(function(a){ return a.score; })) + " / " + BANK.length : "";
    var certified = at.some(function(a){ return a.finalPass; });
    var pending = at.some(function(a){ return a.pendingReview; });
    var status = certified ? '<span class="ok">CERTIFIED</span>' : pending ? '<span class="pend">REVIEW WRITTEN</span>' : at.length ? '<span class="flag">NOT YET</span>' : "";
    var flags = [];
    if (at.some(function(a){ return a.mins && a.mins < FAST_MINUTES; })) flags.push('<span class="flag">fast</span>');
    if ((u.logins || []).length > at.length + 2) flags.push('<span class="flag">logins &gt; attempts</span>');
    h += '<tr><td style="cursor:pointer;text-decoration:underline" onclick="document.getElementById(&#39;det'+ui+'&#39;).classList.toggle(&#39;hidden&#39;)">' +
      esc(u.name || "") + (u.tester ? ' <span class="flag">TESTER</span>' : "") + '</td><td>' + esc(u.email) + '</td><td>' +
      (u.logins || []).length + '</td><td>' + (u.logins && u.logins.length ? fmtDate(u.logins[u.logins.length-1]) : "") + '</td><td>' +
      at.length + '</td><td>' + best + '</td><td>' + status + '</td><td>' + flags.join(" ") + '</td><td>' +
      '<button class="ghost" style="margin:0;padding:5px 9px;font-size:12px" onclick="adminAction(&#39;'+esc(u.email)+'&#39;,&#39;reset&#39;)">Reset</button> ' +
      '<button class="ghost" style="margin:0;padding:5px 9px;font-size:12px" onclick="adminAction(&#39;'+esc(u.email)+'&#39;,&#39;tester&#39;,'+(!u.tester)+')">'+(u.tester ? "Untester" : "Tester")+'</button> ' +
      '<button class="ghost" style="margin:0;padding:5px 9px;font-size:12px" onclick="adminAction(&#39;'+esc(u.email)+'&#39;,&#39;delete&#39;)">Delete</button>' +
      '</td></tr>';
    h += '<tr class="hidden" id="det'+ui+'"><td colspan="9">' + attemptDetail(u) + '</td></tr>';
  });
  h += "</table>";
  box.innerHTML = h;
}

function attemptDetail(u){
  var at = u.attempts || [];
  if (!at.length) return '<p class="small">No attempts.</p>';
  var h = "";
  at.forEach(function(a, ai){
    h += '<div class="wbox"><b>Attempt ' + (ai+1) + '</b> &middot; ' + fmtDate(a.ts) + ' &middot; ' + a.score + '/' + BANK.length +
      ' choice (' + (a.autoPass ? '<span class="ok">met standard</span>' : '<span class="flag">below standard</span>') + ') &middot; ' +
      a.mins + 'm &middot; overall: ' +
      (a.finalPass ? '<span class="ok">CERTIFIED</span>' : a.pendingReview ? '<span class="pend">awaiting written review</span>' : '<span class="flag">NOT YET</span>');
    (a.written || []).forEach(function(w, wi){
      h += '<div style="margin-top:8px"><b>W' + (wi+1) + '.</b> <span class="small">' + esc(w.stem) + '</span><br>' + esc(w.answer || "") + '<br>';
      if (w.verdict === "pass"){
        h += '<span class="ok">Passed</span> <button class="ghost" style="margin:4px 0 0;padding:4px 8px;font-size:12px" onclick="verdict(&#39;'+esc(u.email)+'&#39;,'+a.ts+','+wi+',&#39;revise&#39;)">Change to Revise</button>';
      } else if (w.verdict === "revise"){
        h += '<span class="flag">Revise</span> <button class="ghost" style="margin:4px 0 0;padding:4px 8px;font-size:12px" onclick="verdict(&#39;'+esc(u.email)+'&#39;,'+a.ts+','+wi+',&#39;pass&#39;)">Change to Pass</button>';
      } else {
        h += '<button class="ghost" style="margin:4px 6px 0 0;padding:4px 10px;font-size:12px" onclick="verdict(&#39;'+esc(u.email)+'&#39;,'+a.ts+','+wi+',&#39;pass&#39;)">Pass</button>' +
             '<button class="ghost" style="margin:4px 0 0;padding:4px 10px;font-size:12px" onclick="verdict(&#39;'+esc(u.email)+'&#39;,'+a.ts+','+wi+',&#39;revise&#39;)">Revise</button>';
      }
      h += '</div>';
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
    (u.attempts || []).forEach(function(a){
      (a.perQ || []).forEach(function(p){
        if (typeof p.bi !== "number") return;
        if (!stats[p.bi]) stats[p.bi] = {asked:0, missed:0};
        stats[p.bi].asked++;
        if (!p.ok) stats[p.bi].missed++;
      });
    });
  });
  var rows = BANK.map(function(q, bi){
    var s = stats[bi] || {asked:0, missed:0};
    var pct = s.asked ? Math.round(100 * s.missed / s.asked) : 0;
    var label = q.type === "mc" ? q.stems[0] : q.vars[0].s;
    return {bi:bi, part:q.part, label:label, asked:s.asked, missed:s.missed, pct:pct,
            hot:s.asked > 0 && pct >= 40 && s.missed >= 2};
  });
  rows.sort(function(a,b){
    if ((b.asked>0) !== (a.asked>0)) return (b.asked>0) ? 1 : -1;
    if (b.pct !== a.pct) return b.pct - a.pct;
    if (b.missed !== a.missed) return b.missed - a.missed;
    return a.bi - b.bi;
  });
  var anyData = rows.some(function(r){ return r.asked > 0; });
  var h = '<p class="small">All 45 questions ranked by miss rate across every real attempt. Tester accounts are excluded. ' +
    '<span class="flag">Red rows</span> are missed by 40 percent or more of attempts, with at least 2 misses: either a training gap or a question worth reviewing.</p>';
  if (!anyData) h += '<p class="small">No attempt data yet. This table fills in as the team takes the certification.</p>';
  h += "<table><tr><th>#</th><th>Part</th><th>Question</th><th>Asked</th><th>Missed</th><th>Miss rate</th></tr>";
  rows.forEach(function(r){
    h += '<tr' + (r.hot ? ' class="hot"' : '') + '><td>' + (r.bi+1) + '</td><td>' + r.part + '</td><td>' +
      esc(r.label.length > 110 ? r.label.slice(0,110) + "..." : r.label) + '</td><td>' + r.asked + '</td><td>' +
      (r.hot ? '<span class="flag">' + r.missed + '</span>' : r.missed) + '</td><td>' + (r.asked ? r.pct + "%" : "") + '</td></tr>';
  });
  h += "</table>";
  box.innerHTML = h;
}

async function verdict(email, attemptTs, wIdx, v){
  try {
    await api("/api/admin-action", {code:ADMIN_CODE_ENTERED, email:email, type:"verdict", attemptTs:attemptTs, wIdx:wIdx, verdict:v});
    loadAdmin();
  } catch(e){
    alert(e.message);
  }
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
