import { mdiClose } from "@mdi/js";
import { Dialog, Icon, Label, Content, Subheader } from "../../ui";

import pkg from "../../../package.json";
import audiopkg from "solo-composer-scheduler/package.json";
import logo from "./logo-silo.svg";

import "./styles.css";

interface Props {
  onClose: () => void;
}

export const About = Dialog<Props>(({ onClose }) => {
  return (
    <div className="about">
      <div className="about__header">
        <Icon path={mdiClose} size={24} onClick={onClose} />
      </div>
      <div className="about__logo">
        <img className="about__logo-img" alt="Solo Composer Logo" src={logo} />
        <Label className="about__logo-text">
          <p>Solo Composer</p>
          <p>Music notation everywhere</p>
        </Label>
      </div>
      <Content className="about__content">
        <p className="about__warning">
          This project is very much an experimental work in progress. Things <b>will</b> break, not exist, make no sense
          and crash!
        </p>
      </Content>
      <Content className="about__versions">
        <Subheader>Versions</Subheader>
        <p className="about__version">
          <span className="about__grow">Application</span>
          <span>{pkg.version}</span>
        </p>
        <p className="about__version">
          <span className="about__grow">Audio Engine</span>
          <span>{audiopkg.version}</span>
        </p>
        <p className="about__version">
          <span className="about__grow">Rendering Engine</span>
          <span>@experimental</span>
        </p>
      </Content>
    </div>
  );
});
