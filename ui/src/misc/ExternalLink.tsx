import React, { Component } from "react";
import "./ExternalLink.scss";

interface ExternalLinkProps {
    src: string;
    text: string;
    newTab?: boolean;
}

export default class ExternalLink extends Component<ExternalLinkProps> {
    public render() {
        const newTab: string = this.props.newTab ? `"_blank" rel="noopener noreferrer"` : `_self`;
        return <a href={this.props.src} target={newTab}>{this.props.text}</a>;
    }
}
