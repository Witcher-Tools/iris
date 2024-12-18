import './Card.css'

const Card = ({ children }) => {
    return (
        <div className={"gwent-card px-12 py-8 h-full"}>
            {children}
        </div>
    );
};

export default Card