import React from 'react';
import { FaInfoCircle } from 'react-icons/fa'
import { IconContext } from 'react-icons'

const AboutButton = () => {
    return (
        <IconContext.Provider value={{ color: "#fed766" }}>
            <div className="about-button-panel">
                <a href="./about">
                    <FaInfoCircle style={{ verticalAlign: 'middle' }} />
                </a>
            </div>
        </IconContext.Provider>
    )
}

export default AboutButton;