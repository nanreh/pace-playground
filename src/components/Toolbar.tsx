import HomeButton from "./HomeButton";
import AboutButton from "./AboutButton";
import GitHubButton from "./GitHubButton";

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
  );
};

export default Toolbar;
