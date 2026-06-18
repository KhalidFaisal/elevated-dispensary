const fs = require('fs');
const svg = fs.readFileSync('cannabis.svg', 'utf8');
const pathStart = svg.indexOf('<path d="') + 9;
const pathEnd = svg.indexOf('"/>', pathStart);
const pathD = svg.substring(pathStart, pathEnd).replace(/\r?\n/g, ' ');

const code = `export default function CannabisIcon({ className = 'w-5 h-5', ...props }) {
  return (
    <svg version="1.0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 1277" preserveAspectRatio="xMidYMid meet" className={className} {...props}>
      <g transform="translate(0, 1277) scale(0.1, -0.1)" fill="currentColor" stroke="none">
        <path d="${pathD}" />
      </g>
    </svg>
  );
}
`;
fs.mkdirSync('src/components/icons', { recursive: true });
fs.writeFileSync('src/components/icons/CannabisIcon.jsx', code);
