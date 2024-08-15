import { Link, useLocation } from "react-router-dom"
import { AuthContext } from '../context/AuthContext';
import { useContext, useEffect } from "react";
import Loader from "./Loader";

const Menu = () => {
    const location = useLocation();
    const isActive = (path) => location.pathname === path;
    const { user, loading } = useContext(AuthContext);
    useEffect(() => {
        if (loading) {
            return <Loader />;
        }
    })

    return (
        <div className="w-full flex flex-col lg:flex-row gap-3 md:gap-3 lg:justify-end">
            {!user && <Link className={`cursor-pointer text-white text-2xl font-lowballLight tracking-wider hover:bg-[#27272a] transition-all duration-200 ease-out py-2 px-4 rounded-lg flex items-center justify-start gap-5 lg:gap-2 ${isActive("/")
                ? 'bg-[#27272a] hover:bg-none' : ''}`} to={"/"}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                </svg>
                Home</Link>}
            {!user && <Link className={`cursor-pointer text-white text-2xl font-lowballLight tracking-wider hover:bg-[#27272a] transition-all duration-200 ease-out py-2 px-4 rounded-lg flex items-center justify-start gap-5 lg:gap-2 ${isActive("/us/features")
                ? 'bg-[#27272a] hover:bg-none' : ''}`} to={"/us/features"}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
                </svg>
                Features</Link>}
            {!user && <Link className={`cursor-pointer text-white text-2xl font-lowballLight tracking-wider hover:bg-[#27272a] transition-all duration-200 ease-out py-2 px-4 rounded-lg flex items-center justify-start gap-5 lg:gap-2 ${isActive('/youtuber/login')
                ? 'bg-[#27272a] hover:bg-none' : ''}`} to={'/youtuber/login'}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
                </svg> Youtuber</Link>}
            {!user && <Link className={`cursor-pointer text-white text-2xl font-lowballLight tracking-wider hover:bg-[#27272a] transition-all duration-200 ease-out py-2 px-4 rounded-lg flex items-center justify-start gap-5 lg:gap-2 ${isActive('/editor/login')
                ? 'bg-[#27272a] hover:bg-none' : ''}`} to={'/editor/login'}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
                </svg> Editor</Link>}
            {user && <Link className={`cursor-pointer text-white text-2xl font-lowballLight tracking-wider hover:bg-[#27272a] transition-all duration-200 ease-out py-2 px-4 rounded-lg flex items-center justify-start gap-5 lg:gap-2 ${isActive('/account')
                ? 'bg-[#27272a] hover:bg-none' : ''}`} to={'/account'}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg> Account</Link>}
            {user && <Link className={`cursor-pointer text-white text-2xl font-lowballLight tracking-wider hover:bg-[#27272a] transition-all duration-200 ease-out py-2 px-4 rounded-lg flex items-center justify-start gap-5 lg:gap-2 ${isActive('/account/logout')
                ? 'bg-[#27272a] hover:bg-none' : ''}`} to={'/account/logout'}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
                </svg> Logout</Link>}
            <Link className={`cursor-pointer text-white text-2xl font-lowballLight tracking-wider hover:bg-[#27272a] transition-all duration-200 ease-out py-2 px-4 rounded-lg flex items-center justify-start gap-5 lg:gap-2 ${isActive('/contact-us')
                ? 'bg-[#27272a] hover:bg-none' : ''}`} to={'/contact-us'}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                </svg>
                Contact</Link>
        </div>
    )
}
export default Menu;