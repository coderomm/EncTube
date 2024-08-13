import { Link, useLocation } from "react-router-dom"

export const Menu = () => {
    const location = useLocation();
    const isActive = (path) => location.pathname === path;

    return (
        <div className="w-full flex flex-col lg:flex-row gap-3 lg:gap-1 lg:justify-end">
            <Link className={`cursor-pointer text-white lg:text-black text-3xl font-lowballLight tracking-wider bigShoulders py-2 px-4 rounded-lg flex items-center justify-start gap-5 lg:gap-2 ${isActive("/")
                ? 'bg-[#27272a] hover:bg-none' : ''}`} to={"/"}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                </svg>
                Home</Link>
            <Link className={`cursor-pointer text-white lg:text-black text-3xl font-lowballLight tracking-wider bigShoulders py-2 px-4 rounded-lg flex items-center justify-start gap-5 lg:gap-2 ${isActive("/us/features")
                ? 'bg-[#27272a] hover:bg-none' : ''}`} to={"/us/features"}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
                </svg>
                Features</Link>
            <Link className={`cursor-pointer text-white lg:text-black text-3xl font-lowballLight tracking-wider bigShoulders py-2 px-4 rounded-lg flex items-center justify-start gap-5 lg:gap-2 ${isActive('/account')
                ? 'bg-[#27272a] hover:bg-none' : ''}`} to={'/account'}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg> Account</Link>
            <Link className={`cursor-pointer text-white lg:text-black text-3xl font-lowballLight tracking-wider bigShoulders py-2 px-4 rounded-lg flex items-center justify-start gap-5 lg:gap-2 ${isActive('/account/logout')
                ? 'bg-[#27272a] hover:bg-none' : ''}`} to={'/account/logout'}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
                </svg> Logout</Link>
        </div>
    )
}