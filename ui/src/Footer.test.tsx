import React from "react";
import ReactDOM from "react-dom";
import Footer from "./Footer";

it(`renders without crashing`, () => {
    const div = document.createElement(`div`);
    const r = ReactDOM.render(<Footer author="me" projectName="Nice Project" github="https://github.io"  />, div);
});
