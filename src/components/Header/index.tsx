import { Link } from 'react-router-dom';

import Logo from '../../assets/logo.svg';

import './styles.css';

function Header() {
  return (
    <header className="header container">
      <Link to="/">
        <img src={Logo} alt="Logo cherkr" />
      </Link>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/tasks">Tasks</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
