// import ShareButton from './ShareButton'
import HomeButton from './HomeButton'
import AboutButton from './AboutButton'
// import { Units } from '../pc/models'
// import { Intervals } from '../pc/pacecalc';
import GitHubButton from './GitHubButton';

// interface Props {
//     intervals: Intervals,
//     units: Units,
// }

// const Toolbar = ({ intervals, units }: Props) => {
const Toolbar = () => {
    return (
        <>
            <nav>
                <div className="tools">
                    <div className="tools-start">
                        <HomeButton />
                        <AboutButton />
                    </div>
                    <div className="tools-middle">
                        <h1>Pace Playground</h1>
                    </div>
                    <div className="tools-end">
                        <GitHubButton />
                    </div>
                </div>
            </nav>
        </>
    )
}

export default Toolbar;