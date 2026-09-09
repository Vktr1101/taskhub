import "./styles/Title.css";

interface TitleProps {
    text: string;
}

function Title({ text }: TitleProps) {
    return (
        <div>
            <h1 className="page-title">{text}</h1>
        </div>
    );
}

export default Title;