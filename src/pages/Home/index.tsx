import ImageHome from '../../assets/home/home-image.png';

import './App.css';
import FormHome from '../../components/FormHome';
import Header from '../../components/Header';

export default function Home() {
  return (
    <main className="main">
      <Header />
      <div className="container container-home">
        <div className="image-home">
          <img src={ImageHome} alt="" />
        </div>
        <FormHome />
      </div>
    </main>
  );
}
