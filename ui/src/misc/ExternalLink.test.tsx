import React from "react";
import ReactDOM from "react-dom";
import ExternalLink from "./ExternalLink";

it(`renders without crashing`, () => {
    const div = document.createElement(`div`);
    ReactDOM.render(<ExternalLink src="http://example.com" text="nice link" />, div);
});

it(`crate a link with the right attribute and text`, () => {
    const div = document.createElement(`div`);
    ReactDOM.render(<ExternalLink src="http://example.com" text="nice link" />, div);
    expect(div.innerHTML).toEqual(`<a href="http://example.com" target="_self">nice link</a>`);
});
