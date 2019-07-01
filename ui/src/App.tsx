import React, { Component } from 'react';
import Footer from './Footer';

export default class App extends Component {
  public render() {
    return (
      <div>
        <h1>First react component</h1>
        <Footer author={`Assaf Sapir`} />
      </div>
    );
  }
}
