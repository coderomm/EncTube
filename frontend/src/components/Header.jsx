import { useSetRecoilState } from "recoil";
import { SideBarOpen } from "../atoms/sidebarAtom";
import { Menu } from "./Menu";

export const Header = () => {
    const setSideBarOpen = useSetRecoilState(SideBarOpen);

    return (
        <header className=" flex justify-between items-center gap-2 sm:gap-4 px-4 py-6 border-b border-[#D9D9D9] top-0 sticky
        transition-all duration-400 z-[1] rounded-b-[35px] backdrop-blur-[10px] max-w-[1400px] p-[20px_40px]">
            <div className="flex items-center gap-2 sm:gap-4 sm:flex-grow">
                <a href="/" className="font-lowballBold text-3xl drop-shadow-2xl text-white cursor-pointer">EncTube</a>
            </div>
            <div className="flex gap-2 justify-end sm:flex-grow">
                <div className="gap-2 justify-end sm:flex-grow hidden lg:flex">
                    <Menu />
                </div>
                <button className="block lg:hidden" onClick={() => setSideBarOpen((prev) => !prev)}>
                    <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                    </svg>
                </button>
            </div>
        </header >
    );
};