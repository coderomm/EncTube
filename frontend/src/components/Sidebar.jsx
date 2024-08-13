import { useEffect, useRef } from 'react';
import { useRecoilState } from "recoil";
import { SideBarOpen } from "../atoms/sidebarAtom";
import { Menu } from './Menu';
import { Link } from 'react-router-dom';

export const Sidebar = () => {

    const modalRef = useRef(null);
    const [isOpen, setIsOpen] = useRecoilState(SideBarOpen);

    const handleToggleModal = () => {
        setIsOpen(!isOpen);
    };

    const handleClickOutside = (event) => {
        if (modalRef.current && !modalRef.current.contains(event.target)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return <>
        <aside className={`fixed left-0 top-0 z-10 h-[100vh] w-full overflow-hidden transition-all duration-300 lg:hidden ${isOpen ? "pointer-events-all opacity-100" : "pointer-events-none opacity-0 lg:opacity-100 lg:pointer-events-auto"}`}>
            <div className="absolute inset-0 transition-opacity bg-[#00000080]"></div>
            <button className={`${isOpen ? "fixed" : "hidden"} top-6 right-4 lg:hidden`} onClick={handleToggleModal}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8 text-black bg-white rounded-full p-1">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
            </button>
            <div className={`relative mr-auto transition-transform duration-300 ease-in-out flex flex-col max-w-[285px] px-2 py-4 h-[100vh] gap-4 bg-custom-gradient justify-between ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`} ref={modalRef}>
                <div className="w-full flex flex-col gap-6 items-center">
                    <div className="flex items-center w-fit mx-auto">
                        <a href="/" className="font-medium text-3xl drop-shadow-2xl text-white cursor-pointer">EncTube</a>
                    </div>
                    <Menu />
                </div>
                <div className="border-t border-[#222] p-10">
                    <div className="flex gap-3 items-center justify-between">
                        <Link className='rounded-full p-2 bg-[#1d1d1d] w-12 h-12 text-center color-[#cfcfcf] iconhover flex items-center'>
                            <svg viewBox="0 0 512 512"><path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z"></path></svg>
                        </Link>
                        <Link className='rounded-full p-2 bg-[#1d1d1d] w-12 h-12 text-center color-[#cfcfcf] iconhover flex items-center'>
                            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 24 24">
                                <path d="M10.9,2.1c-4.6,0.5-8.3,4.2-8.8,8.7c-0.5,4.7,2.2,8.9,6.3,10.5C8.7,21.4,9,21.2,9,20.8v-1.6c0,0-0.4,0.1-0.9,0.1 c-1.4,0-2-1.2-2.1-1.9c-0.1-0.4-0.3-0.7-0.6-1C5.1,16.3,5,16.3,5,16.2C5,16,5.3,16,5.4,16c0.6,0,1.1,0.7,1.3,1c0.5,0.8,1.1,1,1.4,1 c0.4,0,0.7-0.1,0.9-0.2c0.1-0.7,0.4-1.4,1-1.8c-2.3-0.5-4-1.8-4-4c0-1.1,0.5-2.2,1.2-3C7.1,8.8,7,8.3,7,7.6c0-0.4,0-0.9,0.2-1.3 C7.2,6.1,7.4,6,7.5,6c0,0,0.1,0,0.1,0C8.1,6.1,9.1,6.4,10,7.3C10.6,7.1,11.3,7,12,7s1.4,0.1,2,0.3c0.9-0.9,2-1.2,2.5-1.3 c0,0,0.1,0,0.1,0c0.2,0,0.3,0.1,0.4,0.3C17,6.7,17,7.2,17,7.6c0,0.8-0.1,1.2-0.2,1.4c0.7,0.8,1.2,1.8,1.2,3c0,2.2-1.7,3.5-4,4 c0.6,0.5,1,1.4,1,2.3v2.6c0,0.3,0.3,0.6,0.7,0.5c3.7-1.5,6.3-5.1,6.3-9.3C22,6.1,16.9,1.4,10.9,2.1z"></path>
                            </svg>
                        </Link>
                        <Link className='rounded-full p-2 bg-[#1d1d1d] w-12 h-12 text-center color-[#cfcfcf] iconhover flex items-center'></Link>
                        <Link className='rounded-full p-2 bg-[#1d1d1d] w-12 h-12 text-center color-[#cfcfcf] iconhover flex items-center'></Link>
                    </div>
                </div>
            </div>
        </aside>
    </>
}