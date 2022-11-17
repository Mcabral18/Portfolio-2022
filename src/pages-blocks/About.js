import profile from '../assets/photo.jpg';

function About() {
    return (
        <div name="about" className="w-full md:h-screen bg-gradient-to-b from-gray-800 to-black text-white">
            <div className="max-w-screen-lg p-4 mx-auto flex flex-col justify-center w-full h-full">
                <div className="grid grid-cols-1 md:grid-cols-2 md:gap-6">
                    <div className="column-inner mt-5 mt-md-3 hover:scale-custom1 transition duration-700 ease-in-out">
                        <div>
                            <img src={profile} alt="Marco Cabral - Profile" />
                        </div>
                    </div>
                    <div className="column-inner flex items-center relative -mt-16">
                        <div className="bg-gray-800 px-4 py-10 m-4 md:absolute md:-left-24 md:px-12 md:py-16 shadow-inner shadow-gray-700/60 rounded-md">
                            <h2 className="text-3xl font-poppins font-bold inline border-b-2 border-gray-500 mb-8">About</h2>
                            <p className="pt-6 text-sm">Communication and multimedia graduate from the University of Trás Os Montes and Alto Douro. I am an ambitious person when it comes to the projects I am involved in. I am hardworking and always search for the solutions to the problems I face. Communicative and always ready to learn, I constantly aim to improve the speed and efficiency of project resolutions.</p>
                            <p className="pt-4 text-sm">I am a Web Developer with experience building websites and web applications. I specialise in building custom themes for Wordpress. I also have experience working with React and Gatsby.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default About;
