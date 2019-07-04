import React, { Component } from "react";
import "./ExternalLink.scss";

interface ExternalLinkProps {
    src: string;
    text: string;
    newTab?: boolean;
}

export default class ExternalLink extends Component<ExternalLinkProps> {
    public render() {
        const target: string = this.props.newTab ? `_blank` : `_self`;
        const rel: string | undefined = this.props.newTab ? `noreferrer noopener` : undefined;
        return <a href={this.props.src} target={target} rel={rel}>{this.props.text}</a>;
    }
}
