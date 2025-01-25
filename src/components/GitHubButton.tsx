import { FaGithub } from 'react-icons/fa'

const GitHubButton = () => {
    return (
        <div className="tool-button">
            <a href="https://github.com/nanreh/pace-playground" target="_blank">
                <FaGithub style={{ verticalAlign: 'middle' }} />
            </a>
        </div>
    )
}

export default GitHubButton;