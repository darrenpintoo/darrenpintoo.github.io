import { useState, useEffect } from 'react';

const jokes = [
    "why do programmers prefer dark mode? because light attracts bugs",
    "how many programmers does it take to change a light bulb? none, that's a hardware problem",
    "i walked into a bar and ordered 1 root beer. the bartender poured it into a square glass",
    "there are 10 types of people in the world: those who understand binary, and those who don't",
    "a sql query walks into a bar, walks up to two tables and asks, 'can i join you?'",
    "programming is 10% science, 20% ingenuity, and 70% getting the ingenuity to work with the science",
    "why do java programmers have to wear glasses? because they don't c#",
    "a good programmer is someone who always looks both ways before crossing a one-way street",
    "debugging is like being the detective in a crime movie where you are also the murderer",
    "computers are fast; programmers keep it slow",
    "when i wrote this code, only god and i understood what i was doing. now, only god knows",
    "algorithm: word used by programmers when they don't want to explain what they did",
    "hardware: the part of a computer that you can kick",
    "software: the part that fails and leads to the hardware being kicked",
    "real programmers count from 0",
    "why did the functions stop calling each other? because they had constant arguments",
    "unreal engine is just a game engine. real engine is physics"
];

function Footer() {
    const [joke, setJoke] = useState("");

    useEffect(() => {
        const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
        setJoke(randomJoke);
    }, []);

    return (
        <footer className="footer fade-in-section is-visible" style={{ animationDelay: '0.5s', opacity: 0.25, fontStyle: 'italic', fontSize: '0.7rem' }}>
            <p>{joke}</p>
        </footer>
    );
}

export default Footer;
