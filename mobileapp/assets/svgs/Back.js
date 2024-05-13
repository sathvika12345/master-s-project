import * as React from "react";
const SvgBack = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={800}
    height={800}
    viewBox="0 0 512 512"
    {...props}
  >
    <defs>
      <style>
        {
          ".back_svg__cls-1{fill:none;stroke:#000;stroke-linecap:round;stroke-linejoin:round;stroke-width:20px}"
        }
      </style>
    </defs>
    <g id="back_svg__Layer_2" data-name="Layer 2">
      <g
        id="back_svg__E421_Back_buttons_multimedia_play_stop"
        data-name="E421, Back, buttons, multimedia, play, stop"
      >
        <circle cx={256} cy={256} r={246} className="back_svg__cls-1" />
        <path
          d="M352.26 256H170.43M223.91 202.52 170.44 256l53.47 53.48"
          className="back_svg__cls-1"
        />
      </g>
    </g>
  </svg>
);
export default SvgBack;
