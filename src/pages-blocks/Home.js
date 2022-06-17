import { FaLinkedinIn } from "react-icons/fa";
import { AiOutlineGithub } from "react-icons/ai";
import TypeWriterEffect from 'react-typewriter-effect';

function Home() {
    return (
        <div className="home-block h-screen w-full bg-gradient-to-b from-black via-black to-gray-800 px-4 md:px-8 flex justify-center items-center" name="home">
            <div className="container home-content mx-auto text-center">
                <h1 className="text-blue font-black md:text-7xl text-4xl mb-5 font-poppins"> I´m <span className="text-grey">Marco</span></h1>
                <span className="text-center text-grey text-2xl font-bold font-poppins">
                    <TypeWriterEffect
                        textStyle={{
                            fontFamily: 'Poppins',
                            color: '#e1e1e1',
                            fontWeight: 700,
                            fontSize: '24px',
                            textAlign: 'center',
                        }}
                        cursorColor="#e1e1e1"
                        multiText={[
                            'Front-end Developer',
                            'Wordpress Developer',
                            'Front-end Developer',
                            'Wordpress Developer',
                            'Front-end Developer',
                            'Wordpress Developer',
                            'Front-end Developer',
                            'Wordpress Developer',
                            'Front-end Developer',
                            'Wordpress Developer',
                        ]}
                        multiTextDelay={1000}
                        typeSpeed={80}
                        loop
                    />
                </span>
                <div className="social-icons flex justify-center mt-5">
                    <div className="linkdin mx-2 p-1.5 border border-darkGrey hover:scale-105 duration-200 hover:bg-blue">
                        <a target="_blank" href="https://www.linkedin.com/in/marco-cabral/" rel="noreferrer"><FaLinkedinIn className="text-grey" size={22} /></a>
                    </div>
                    <div className="github mx-2 p-1.5 border border-darkGrey hover:scale-105 duration-200 hover:bg-blue">
                        <a target="_blank" href="https://github.com/Mcabral18" rel="noreferrer"><AiOutlineGithub className="text-grey" size={22} /></a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;
