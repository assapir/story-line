import React, { Component } from 'react';

interface FooterProps {
    author: string;
}

export default class Footer extends Component<FooterProps> {
    public render() {
        return (
            <footer>
                {this.props.author}
            </footer>
        );
    }
}
