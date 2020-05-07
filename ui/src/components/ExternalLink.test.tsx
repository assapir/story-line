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
    expect(div.textContent).toEqual(`nice link`);
    const anchor = div.firstChild as HTMLAnchorElement;
    expect(anchor.href).toEqual(`http://example.com/`);
    expect(anchor.target).toEqual(`_self`);
    expect(anchor.rel).toEqual(``);
});

it(`crate a link with the right attribute and text with _blank`, () => {
    const div = document.createElement(`div`);
    ReactDOM.render(<ExternalLink src="http://example.com" text="nice link" newTab={true} />, div);
    expect(div.textContent).toEqual(`nice link`);
    const anchor = div.firstChild as HTMLAnchorElement;
    expect(anchor.href).toEqual(`http://example.com/`);
    expect(anchor.target).toEqual(`_blank`);
    expect(anchor.rel).toEqual(`noreferrer noopener`);
});
