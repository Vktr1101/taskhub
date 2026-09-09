import Header from "../components/Header.tsx";
import Title from "../components/Title.tsx";
import LoginForm from "../components/LoginForm.tsx";
import Button from "../components/Button.tsx";

function Login() {
    function handleLogin() {

    }

    return (
        <div>
            <Header />
            <Title text="Login"/>
            <LoginForm />
            <br/>
            <Button text="Login account" onClick={handleLogin} />
        </div>
    );
}

export default Login;