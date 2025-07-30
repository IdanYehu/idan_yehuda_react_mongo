import { Link, useLocation } from 'react-router-dom'


const NavButton = ({ text, to ,icon}) => {
    const location = useLocation();
    const isActive = location.pathname.includes(to.toLowerCase());
    
    return (
        <Link to={`/${to.toLowerCase()}`} className="mx-1">
            <button className={`
            flex items-center justify-center
                px-4 py-2 font-medium rounded-md transition-all duration-300
                ${isActive 
                    ? 'bg-white text-red-600 shadow-md' 
                    : 'text-white hover:bg-red-700 hover:shadow-inner'}
                ${text ? 'gap-2' : ''}
            `}>
                {text}
                {icon && <span className="">{icon}</span>}
            </button>
        </Link>
    )
}
export default NavButton