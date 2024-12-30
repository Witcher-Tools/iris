import { twMerge } from "tailwind-merge";

import "./Paragraph.css";

function Paragraph({ children, className }) {
    return <p className={twMerge("gwent-paragraph text-base", className)}>{children}</p>;
}

export default Paragraph;
