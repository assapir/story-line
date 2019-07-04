import React, { Component } from 'react';
import './Footer.scss';
import ExternalLink from './misc/ExternalLink';

interface FooterProps {
    author: string;
    projectName: string;
    github: string;
}

export default class Footer extends Component<FooterProps> {
    public render() {
        return (
            <footer>
                <span>Under MIT License</span>
                <span>© {this.props.author}</span>
                <ExternalLink src={this.props.github} text={this.props.projectName} newTab={true}/>
            </footer>
        );
    }
}
