import React, { Component } from "react";

interface ExternalLinkProps {
    src: string;
    text: string;
}

export default class ExternalLink extends Component<ExternalLinkProps> {
    public render() {
        return (
            <a href={this.props.src} target="_blank" rel="noopener noreferrer">{this.props.text}</a>
        );
    }
}
