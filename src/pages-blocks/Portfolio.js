import React from "react";
import forumAveiro from "../assets/portfolio/forumaveiro.png";
import Natixis from "../assets/portfolio/natixis.png";
import Blip from "../assets/portfolio/blip.png";
import Conquistador from "../assets/portfolio/conquistador.png";
import kiaPortugal from "../assets/portfolio/kia.png";

const Portfolio = () => {
    const portfolios = [
        {
            id: 1,
            src: forumAveiro,
            demo: "https://forumaveiro.com/",
            github: ""
        },
        {
            id: 2,
            src: Natixis,
            demo: "https://wewantyourbrain.com/",
            github: ""
        },
        {
            id: 3,
            src: Blip,
            demo: "https://www.blip.deliverymanager.pt/",
            github: ""
        },
        {
            id: 4,
            src: Conquistador,
            demo: "https://conquistadorpalace.pt/",
            github: ""
        },
        {
            id: 5,
            src: kiaPortugal,
            demo: "https://kia.pt",
            github: ""
        },
        {
            id: 6,
            src: kiaPortugal,
            demo: "https://m.kia.pt",
            github: ""
        },
    ];

    return (
        <div
            name="portfolio"
            className="bg-gradient-to-b from-black to-gray-800 w-full text-white md:h-screen"
        >
            <div className="max-w-screen-lg p-4 mx-auto flex flex-col justify-center w-full h-full">
                <div className="pb-12">
                    <p className="text-4xl font-bold inline border-b-4 border-gray-500">
                        Portfolio
                    </p>
                    {/* <p className="py-6">Check out some of my work right here</p> */}
                </div>

                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8 px-12 sm:px-0 ">
                    {portfolios.map(({ id, src, demo, github }) => (
                        <div key={id} className="shadow-md shadow-gray-600 rounded-lg overflow-hidden">
                            <img
                                src={src}
                                alt=""
                                className="rounded-md w-full duration-200 hover:scale-105"
                            />
                            <div className="flex items-center justify-center">
                                <button className="w-1/2 px-6 py-3 m-4 duration-200 hover:scale-105">
                                    <a target="_blank" href={demo} >Website</a>
                                </button>
                                {/* {
                                    github === 0 ? "" :
                                        <button className="w-1/2 px-6 py-3 m-4 duration-200 hover:scale-105">
                                            <a target="_blank" href={github} >Code</a>
                                        </button>

                                } */}
                                {github &&
                                    <button className="w-1/2 px-6 py-3 m-4 duration-200 hover:scale-105">
                                        <a target="_blank" href={github} >Code</a>
                                    </button>
                                }
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Portfolio;