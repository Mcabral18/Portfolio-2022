import React, { useState } from "react";
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
            link: "portfolio",
        },
        {
            id: 4,
            link: "experience",
        },
        {
            id: 5,
            link: "contact",
        },
    ];

    return (
        <nav className="flex justify-between items-center w-full h-20 px-8 text-white bg-black fixed">
            <div className="relative z-10">
                <img src={logo} className="w-10" alt="Marco Cabral - Logo" />
            </div>

            <ul className="hidden md:flex">
                {links.map((link) => (
                    <li key={link.id} className="px-4 cursor-pointer capitalize font-medium text-gray-300 hover:scale-105 duration-200">
                        <Link to={link.link} smooth duration={500}>
                            {link.link}
                        </Link>
                    </li>
                ))}
            </ul>

            <div onClick={() => setNav(!nav)} className="cursor-pointer pr-4 z-10 text-gray-300 md:hidden">
                {nav ? <IoMdClose size={30} /> : <HiOutlineMenuAlt2 size={30} />}
            </div>

            {nav && (
                <ul className="flex flex-col justify-center items-center absolute top-0 left-0 w-full h-screen bg-gradient-to-b from-black to-gray-800 text-gray-500">
                    {links.map(({ id, link }) => (
                        <li key={id} className="px-4 cursor-pointer capitalize font-medium text-gray-300 hover:scale-105 duration-200">
                            <Link to={link} smooth duration={500}>
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