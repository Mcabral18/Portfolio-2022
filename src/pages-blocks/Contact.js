import React from "react";

const Contact = () => {
    return (
        <div
            name="contact"
            className="w-full h-screen bg-gradient-to-b from-black to-gray-800 p-4 text-white"
        >
            <div className="flex flex-col p-4 justify-center max-w-screen-lg mx-auto h-full">
                <div className="mb-6">
                    <p className="text-4xl font-bold border-b-2 border-gray-500 p-2 inline">
                        Get in Touch
                    </p>
                    <p className="py-8">If You Want To Create Amazing Experience For People – You Are Very Welcome To Contact Me</p>
                </div>

                <div className=" flex justify-center items-center">
                    <form
                        action="https://getform.io/f/096c529a-984b-4d93-b65c-91b30624a372"
                        method="POST"
                        className=" flex flex-col w-full md:w-1/2"
                    >
                        <input
                            type="text"
                            name="name"
                            placeholder="Enter your name"
                            className="p-2 bg-transparent border-b-2 border-cyan-500  text-white focus:outline-none"
                        />
                        <input
                            type="text"
                            name="email"
                            placeholder="Enter your email"
                            className="my-8 p-2 bg-transparent border-b-2 border-cyan-500 text-white focus:outline-none"
                        />
                        <textarea
                            name="message"
                            placeholder="Enter your message"
                            rows="5"
                            className="p-2 bg-transparent border-b-2 border-cyan-500  text-white focus:outline-none"
                        ></textarea>

                        <button className="text-white bg-gradient-to-b from-cyan-500 to-blue-500 px-6 py-3 my-8 mx-auto flex items-center rounded-md hover:scale-110 duration-300">
                            Let's talk
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Contact;