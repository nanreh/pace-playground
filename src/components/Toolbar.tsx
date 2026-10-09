import AboutBurst from "./AboutBurst";
import GitHubButton from "./GitHubButton";

const Toolbar = () => {
  return (
    <>
      <nav>
        <div className="tools">
          <div className="tools-start">
            <div className="burst-container">
              <AboutBurst size={80} />
            </div>
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
