import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import CloseIcon from '../../assets/icons/close.svg';
import EyeIcon from '../../assets/icons/eye.svg';
import GoogleIcon from '../../assets/icons/google.svg';
import Logo from '../../assets/logo.svg';

import './styles.css';
import { baseUrl } from '../../environments/baseUrl';

function FormHome() {
  const notify = (text: string) =>
    toast.error(text, {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'light'
    });
  const navigate = useNavigate();
  const [formActive, setFormActive] = useState(1);
  const [isBusy, setIsBusy] = useState(false);

  function activeForm(value: number) {
    setFormActive(value);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsBusy(true);
    const formData = new FormData(e.currentTarget);

    const email = formData.get('email_login');
    const password = formData.get('pass_login');

    if (String(email).trim() === '') {
      setIsBusy(false);

      notify('Email é obrigatório');
      return;
    }
    if (String(password).trim() === '') {
      setIsBusy(false);
      notify('Senha é obrigatória');
      return;
    }

    const userData = {
      email: String(email),
      password: String(password)
    };
    const data = await loginUser(userData);

    if (data.message) {
      setIsBusy(false);
      notify(data.message);
      return;
    }

    try {
      if (data.user) {
        sessionStorage.setItem('@checkr', JSON.stringify(data.user));
        navigate('/tasks');
      }
      setIsBusy(false);
    } catch (error) {
      console.log(error);
      setIsBusy(false);
    }
  }

  async function loginUser(data: { email: string; password: string }) {
    const res = await fetch(`${baseUrl}/users/check/`, {
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify(data)
    });

    const result = await res.json();

    return result;
  }

  async function registerUser(data: {
    email: string;
    password: string;
    name: string;
  }) {
    const res = await fetch(`${baseUrl}/users/`, {
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify(data)
    });

    const result = await res.json();

    return result;
  }

  async function handleSubmitRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsBusy(true);
    const formData = new FormData(e.currentTarget);

    const email = formData.get('email_register');
    const name = formData.get('name_register');
    const password = formData.get('pass_register');

    if (String(name).trim() === '') {
      setIsBusy(false);

      notify('Nome é obrigatório');
      return;
    }

    if (String(email).trim() === '') {
      setIsBusy(false);

      notify('Email é obrigatório');
      return;
    }

    if (String(password).trim() === '') {
      setIsBusy(false);
      notify('Senha é obrigatória');
      return;
    }

    const userData = {
      email: String(email),
      password: String(password),
      name: String(name)
    };
    const data = await registerUser(userData);

    if (data.message && !data.user) {
      setIsBusy(false);
      notify(data.message);
      return;
    }

    try {
      if (data.user) {
        sessionStorage.setItem('@checkr', JSON.stringify(data.user));
        navigate('/tasks');
      }
      setIsBusy(false);
    } catch (error) {
      console.log(error);
      setIsBusy(false);
    }
  }
  if (formActive === 1) {
    return (
      <aside className="form-container">
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        <div className="change-form">
          <button onClick={() => activeForm(1)}>Sign in</button>
          <button onClick={() => activeForm(0)} className="active">
            Register
          </button>
        </div>
        <div className="title">
          <h3>Welcome to</h3>
          <img src={Logo} alt="Checkr" />
        </div>

        <form onSubmit={(e) => handleSubmit(e)}>
          <label htmlFor="">
            <input
              type="text"
              name="email_login"
              placeholder="Digite seu Email"
            />
            <img src={CloseIcon} alt="" />
          </label>

          <label htmlFor="">
            <input
              type="password"
              name="pass_login"
              id=""
              placeholder="Digite sua senha"
            />
            <img src={EyeIcon} alt="" />
          </label>
          <button disabled={isBusy} className="signIn">
            {isBusy ? 'Entrando...' : 'Sign in'}
          </button>
          <div className="or">
            <p>Or continue with</p>
          </div>
          <button type="button" className="google-button">
            <img src={GoogleIcon} alt="" /> Login with Google
          </button>
        </form>
      </aside>
    );
  }
  if (formActive === 0) {
    return (
      <aside className="form-container">
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />

        <div className="change-form">
          <button onClick={() => activeForm(1)} className="active">
            Sign in
          </button>
          <button onClick={() => activeForm(0)}>Register</button>
        </div>
        <div className="title">
          <h3>Welcome to</h3>
          <img src={Logo} alt="Checkr" />
        </div>

        <form onSubmit={handleSubmitRegister}>
          <label htmlFor="">
            <input
              type="text"
              name="name_register"
              placeholder="Digite seu Nome"
            />
          </label>

          <label htmlFor="">
            <input
              type="text"
              name="email_register"
              placeholder="Digite seu Email"
            />
          </label>

          <label htmlFor="">
            <input
              name="pass_register"
              type="password"
              id=""
              placeholder="Digite sua senha"
            />
          </label>
          <button className="signIn" type="submit" disabled={isBusy}>
            {isBusy ? 'Registrando...' : 'Registre-se'}
          </button>
          <div className="or">
            <p>Or continue with</p>
          </div>
          <button type="button" className="google-button">
            <img src={GoogleIcon} alt="" /> Login with Google
          </button>
        </form>
      </aside>
    );
  }
}

export default FormHome;
