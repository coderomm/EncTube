import { Link, useNavigate } from "react-router-dom";
import googleSvg from '/images/google.svg'

const HeroBanner = () => {
    const navigate = useNavigate();
    const handleYoutuberLogin = () => {
        navigate('/youtuber/login')
    }
    return (
        <div className="flex flex-col items-center justify-center md:gap-5">
            <h2 className="text-4xl md:text-6xl font-lowballBold mb-4 text-center tracking-wider text-white">The Best Tool 🎬 To Securely Collaborate with Editors, Without Exposing Your Channel.</h2>
            <div className="flex items-center justify-between gap-3">
                <Link to="/youtuber/login" className="btn brandBtn text-white py-2 px-6 rounded-lg text-xl tracking-wider flex items-center"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
                </svg> YouTuber</Link>
                <Link to="/editor/login" className="btn brandBtnOutline text-white py-2 px-6 rounded-lg text-xl tracking-wider flex items-center"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
                </svg> &nbsp;Editor</Link>
            </div>
            <button type="button" onClick={handleYoutuberLogin} className="flex items-center justify-center gap-1 mt-3  bg-[#27272a] py-2 px-8 rounded-full text-white tracking-wider text-xl">
                <img src={googleSvg} />Signup with Google
            </button>
        </div>
    );
}
export default HeroBanner;