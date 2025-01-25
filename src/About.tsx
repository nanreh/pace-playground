import { FaPlus, FaMinus, FaLock } from 'react-icons/fa'

const About = () => {
    return <>
        <div className="about-container">
            <h3 className="title">About</h3>
            <hr/>
            <p>
            You're probably not Mo Farah but if you're training hard for a race, and you have a finish time in mind, you are likely a bit obsessed with time. Maybe the following questions sound familiar:
            </p>
            <ul>
                <li>What pace do I have to run to finish a marathon in <a href="./?d=Marathon&t=12569&u=mi">3:30</a>? Boston qualifying time? <a href="./?d=Marathon&t=10799&u=mi">Sub-3 hours</a>?</li>
                <li>How slowly can I make my way through the first stampede miles of my race without having to run impossible splits later?</li>
                <li>How much closer to my goal time would I be if I stopped drinking beer, lost 10 pounds, and took five seconds off each mile?</li>
                <li>I&rsquo;m going to run a 10K tune-up race: <a href="./?d=10K&t=2399&u=mi">what the hell is 10K in miles</a>?</li>
                <li>How fast did Abel Kirui have to run his mile splits to win the 2016 Chicago Marathon in <a href="./?d=Marathon&t=7883&u=mi">2:11:23</a>?</li>
            </ul>
            <p>
            If you've searched for a pace calculator to help answer these questions, you know that most running-related destinations on the Internet are 1% content and 99% downward spiral of advertising and sales pitches. If you make it through the noise, you're likely to find a pace calculator that sucks.
            </p>
            <p>
            Given this lack usable tools, I've resorted to building Excel spreadsheets in the past to play with basic pace arithmetic. But Excel is what people do at work, that's no fun. So I've spent a bit of my free time building a simple interactive pace tool that (hopefully) doesn't suck.</p>
            <p>
            <a href="./">Pace Playground</a> is built to be interactive and playful. Using it is simple:
            </p>
            <ol>
                <li>Choose a race distance</li>
                <li>Choose a goal time</li>
                <li>Play with the split times</li>
            </ol>
            <p>
            Initially, every split gets the same time. Use the <FaPlus/> and <FaMinus/> buttons to adjust split times.
            </p>
            <p>
            Any split you adjust locks in place where you set it. When you adjust a split, the remaining unlocked splits automatically adjust so your goal time is always achieved.
            </p>
            <p>Click the <FaLock/> to unlock a split.</p>
            <p>At the top is a share button you can use to get a shareable link to your splits. There's also a button to download the data as a CSV file.</p>
            <p>Change the race, goal time, or split units any time you like to start over and imagine a different scenario or another race.</p>
            <p>I hope you find this useful and fun. If you want to get in touch, report bugs, ask for features, pm me naked running pictures, or tell me how much this pace calculator sucks, my contact info appears below.</p>

        </div>
    </>
}

export default About;