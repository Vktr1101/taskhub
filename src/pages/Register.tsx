import Header from "../components/Header.tsx";
import Title from "../components/Title.tsx";
import RegisterForm from "../components/RegisterForm.tsx";
import Button from "../components/Button.tsx";

function Register() {
    function handleRegister() {

    }

    return (
        <div>
            <Header />
            <Title text="Register"/>
            <RegisterForm />
            <Button text="Create account" onClick={handleRegister} />
        </div>
    );}

export default Register;