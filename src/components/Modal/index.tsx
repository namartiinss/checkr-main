import { useState } from 'react';
import './style.css';

function Modal() {
  const validateModal = localStorage.getItem('@modal-checkr');
  const [isModal, setIsModal] = useState(!validateModal ? true : false);

  function handleValidateModal() {
    localStorage.setItem('@modal-checkr', 'true');
    setIsModal(false);
  }
  return (
    <div className={`modal ${!isModal && 'hidden'}`}>
      <h2>Instruções</h2>
      <p>Crie uma task, segure e arraste a mesma para trocar de coluna</p>
      <br />
      <p>É possível dar scroll na página</p>
      <button onClick={handleValidateModal}>Entendido!</button>
    </div>
  );
}

export default Modal;
