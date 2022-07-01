import React, { useState, useEffect } from "react";
import { HiOutlineMenuAlt2 } from "react-icons/hi";
import { IoMdClose } from "react-icons/io";
import { Link } from "react-scroll";

import logo from '../logo.svg';

const Navbar = () => {
    const [nav, setNav] = useState(false);

    const links = [
        {
            id: 1,
            link: "home",
        },
        {
            id: 2,
            link: "about",
        },
        {
            id: 3,
            link: "experience",
        },
        {
            id: 4,
            link: "portfolio",
        },
        {
            id: 5,
            link: "contact",
        },
    ];

    //Scroll Trigger
    const [scroll, setScroll] = useState('')
    
    useEffect(() => {
        window.addEventListener("scroll", () => {
            setScroll(window.scrollY > 130)
        })
    }, [])

    return (
        <nav className={scroll ? "flex justify-between items-center w-full h-20 px-4 md:px-8 text-white fixed top-0 bg-gradient-to-b from-black via-black to-gray-800 z-10" : "flex justify-between items-center w-full h-20 px-4 md:px-8 text-white bg-black fixed -translate-y-24 z-10"}>
            <div className="relative">
                <img src={logo} className="w-10" alt="Marco Cabral - Logo" />
            </div>
            <ul className="hidden md:flex">
                {links.map((link) => (
                    <li key={link.id} className="px-4 cursor-pointer capitalize font-medium text-gray-300 hover:scale-105 duration-200">
                        <Link to={link.link} smooth duration={500} activeClass="active" spy={true}>
                            {link.link}
                        </Link>
                    </li>
                ))}
            </ul>
            <div onClick={() => setNav(!nav)} className="cursor-pointer z-10 text-gray-300 md:hidden">
                {nav ? <IoMdClose size={30} /> : <HiOutlineMenuAlt2 size={30} />}
            </div>
            {nav && (
                <ul className="flex flex-col justify-center items-center absolute top-0 left-0 w-full h-screen bg-gradient-to-b from-black to-gray-800 text-gray-500">
                    {links.map(({ id, link }) => (
                        <li key={id} className="px-4 py-5 text-2xl cursor-pointer capitalize font-medium text-gray-300 hover:scale-105 duration-200">
                            <Link to={link} smooth duration={500} activeClass="active" spy={true}>
                                {link}
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </nav>
    );
};

export default Navbar;