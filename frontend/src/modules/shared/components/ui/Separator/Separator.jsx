import classNames from "classnames";

import "./Separator.css";

const Selector = ({ ...props }) => {
    return <div className={classNames("gwent-separator", props?.className)}></div>;
};

export default Selector;
