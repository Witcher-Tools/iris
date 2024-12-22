import "./Card.css";

const Card = ({ children }) => {
    return <div className={"gwent-card h-full"}>{children}</div>;
};

export default Card;
