import { FaHome } from 'react-icons/fa'
import { NavLink, useNavigate } from "react-router-dom";

const HomeButton = () => {
    const navigate = useNavigate();
    return (
        <div className="tool-button">
            <NavLink
                to="/"
                aria-label="Splits"
                onClick={(e) => {
                    // Take the query along, so the address still describes the splits on the way back.
                    // It is read from the address bar because the splits update it without telling the router.
                    e.preventDefault();
                    navigate({ pathname: "/", search: window.location.search });
                }}
            >
                <FaHome style={{ verticalAlign: 'middle' }} />
            </NavLink>
        </div>
    )
}

export default HomeButton;