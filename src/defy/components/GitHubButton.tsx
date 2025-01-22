import React from 'react';
import { FaGithub } from 'react-icons/fa'
import { IconContext } from 'react-icons'

const GitHubButton = () => {
    return (
        <IconContext.Provider value={{ color: "#fed766" }}>
            <div className="github-button-panel">
                <a href="https://github.com/nanreh/pace-playground">
                    <FaGithub style={{ verticalAlign: 'middle' }} />
                </a>
            </div>
        </IconContext.Provider>
    )
}

export default GitHubButton;