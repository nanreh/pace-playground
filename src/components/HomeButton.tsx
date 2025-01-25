import { FaHome } from 'react-icons/fa'
import { NavLink } from "react-router-dom";

const HomeButton = () => {
    return (
        <div className="tool-button">
            <NavLink to="/">
                <FaHome style={{ verticalAlign: 'middle' }} />
            </NavLink>
        </div>
    )
}

export default HomeButton;