import { FaInfoCircle } from 'react-icons/fa'
import { NavLink } from "react-router-dom";

const AboutButton = () => {
    return (
        <div className="tool-button">
            <NavLink to="/about">
                <FaInfoCircle style={{ verticalAlign: 'middle' }} />
            </NavLink>
        </div>
    )
}

export default AboutButton;