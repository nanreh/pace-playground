import { FaInfoCircle } from 'react-icons/fa'
import { NavLink, useNavigate } from "react-router-dom";

const AboutButton = () => {
    const navigate = useNavigate();
    return (
        <div className="tool-button">
            <NavLink
                to="/about"
                aria-label="About"
                onClick={(e) => {
                    // Take the query along, so the address still describes the splits on the way back.
                    // It is read from the address bar because the splits update it without telling the router.
                    e.preventDefault();
                    navigate({ pathname: "/about", search: window.location.search });
                }}
            >
                <FaInfoCircle style={{ verticalAlign: 'middle' }} />
            </NavLink>
        </div>
    )
}

export default AboutButton;