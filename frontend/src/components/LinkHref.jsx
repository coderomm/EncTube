import { Link, useLocation } from "react-router-dom"

export const LinkHref = ({ to, label, icon }) => {
    const location = useLocation();
    const isActive = location.pathname === to;

    return (
        <Link
            to={to}
            className={`cursor-pointer py-2 px-4 rounded-lg flex items-center justify-center gap-2 ${isActive
                ? 'bg-[#d9d9d9] text-black' : 'bg-[#f2f2f2] hover:bg-[#E6E6E6] text-black'}`}>
            {label}
            {icon}
        </Link>
    )
}