import * as React from "react";
const SvgComment = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={20}
    fill="none"
    viewBox="0 0 24 24"
    {...props}
  >
    <g clipPath="url(#comment_svg__a)">
      <path
        stroke="#FFF"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M12 21a9 9 0 1 0-9-9c0 1.488.36 2.891 1 4.127L3 21l4.873-1c1.236.64 2.64 1 4.127 1"
      />
    </g>
    <defs>
      <clipPath id="comment_svg__a">
        <path fill="#FFF" d="M0 0h24v24H0z" />
      </clipPath>
    </defs>
  </svg>
);
export default SvgComment;
