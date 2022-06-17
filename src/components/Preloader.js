import React, { useEffect } from "react";
import { gsap } from "gsap";

function Preloader({ setAnimationComplete }) {

    const completeAnimation = () => {
        setAnimationComplete(true);
    };

    useEffect(() => {
        // GSAP animation
        let tl = gsap.timeline();
        const homeAnimation = (animation) => {
            tl.to(".ball", {
                duration: 2,
                y: "100vh",
                ease: "bounce.out"
            })
                .to(".ball", {
                    duration: 0.6,
                    scale: 30,
                    ease: "power3.out",
                    onComplete: animation
                })
                .to(".home-content", {
                    duration: 1,
                    y: 0,
                    delay: 0.1,
                    opacity: 1,
                    ease: "power3.out"
                })
                .to("nav", {
                    duration: 1.2,
                    y: 0,
                    delay: 0.1,
                    opacity: 1,
                    ease: "power3.out"
                });
        };
        homeAnimation(completeAnimation);
    });

    return (
        <div className="preloader h-screen w-full bg-gradient-to-b from-black via-black to-gray-800 fixed z-50">
            <div className="ball bg-gradient-to-t from-gray-800 via-black to-gray-700"></div>
        </div>
    );
}

export default Preloader;