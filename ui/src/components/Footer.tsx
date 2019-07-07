import React, { Component } from "react";
import ExternalLink from "../misc/ExternalLink";
import "./Footer.scss";

interface FooterProps {
    author: string;
    projectName: string;
    github: string;
}

export default class Footer extends Component<FooterProps> {
    public render() {
        return (
            <footer className="common">
                <span>Under MIT License</span>
                <span>© {this.props.author}</span>
                <ExternalLink src={this.props.github} text={this.props.projectName} newTab={true}/>
            </footer>
        );
    }
}
