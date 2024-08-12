import { useEffect, useRef } from 'react';
import { useRecoilState } from "recoil";
import { SideBarOpen } from "../atoms/sidebarAtom";
import { Menu } from './Menu';

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
            <button className={`${isOpen ? "fixed" : "hidden"} top-4 right-7 lg:hidden`} onClick={handleToggleModal}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8 text-black bg-white rounded-full p-1">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
            </button>
            <div className={`relative mr-auto transition-transform duration-300 ease-in-out flex flex-col max-w-[330px] px-2 py-4 h-[100vh] gap-4 bg-custom-gradient justify-between ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`} ref={modalRef}>
                <div className="w-full flex flex-col gap-6 items-center">
                    <div className="flex items-center w-fit mx-auto">
                        <a href="/" className="font-medium text-3xl drop-shadow-2xl text-white cursor-pointer">EncTube</a>
                    </div>
                    <Menu />
                </div>
                <div className="py-[6px] px-3 bg-[#353C53] mx-2 rounded">
                    <div className="flex gap-3 items-center">
                        <div className="w-9 h-9 bg-[#FFFFFF]/10 rounded p-[6px] flex justify-center items-center">
                            <svg width="24" height="20" viewBox="0 0 24 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" clipRule="evenodd" d="M3.00312 1.79727C2.42636 1.79727 1.80313 2.35527 1.80313 3.24727V16.7473C1.80313 17.6393 2.42636 18.1973 3.00312 18.1973H21.0031C21.5799 18.1973 22.2031 17.6393 22.2031 16.7473V13.8473H17.0032C14.8769 13.8473 13.1532 12.1236 13.1532 9.99727C13.1532 7.87097 14.8769 6.14727 17.0032 6.14727H22.2031V3.24727C22.2031 2.35527 21.5799 1.79727 21.0031 1.79727H3.00312ZM23.8031 6.14727V3.24727C23.8031 1.65398 22.6355 0.197266 21.0031 0.197266H3.00312C1.37075 0.197266 0.203125 1.65398 0.203125 3.24727V16.7473C0.203125 18.3405 1.37075 19.7973 3.00312 19.7973H21.0031C22.6355 19.7973 23.8031 18.3405 23.8031 16.7473V13.8473H23.8532V6.14727H23.8031ZM16.0032 9.94727C16.0032 9.47783 16.3837 9.09727 16.8532 9.09727H18.1532C18.6226 9.09727 19.0032 9.47783 19.0032 9.94727C19.0032 10.4167 18.6226 10.7973 18.1532 10.7973H16.8532C16.3837 10.7973 16.0032 10.4167 16.0032 9.94727ZM14.8532 9.99727C14.8532 8.80986 15.8158 7.84727 17.0032 7.84727H22.1532V12.1473H17.0032C15.8158 12.1473 14.8532 11.1847 14.8532 9.99727Z" fill="white" />
                            </svg>
                        </div>
                        <div className="flex flex-col text-white gap-[2px]">
                            <h3 className="text-[13px] text-[#FFFFFF] font-light">Available Credits</h3>
                            <h6 className="text-base font-medium">224.10</h6>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    </>
}