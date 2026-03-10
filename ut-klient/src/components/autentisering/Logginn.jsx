import { useState } from 'react';
import { useAutentisering } from '../../hooks/useAutentisering';
import Modal from '../../modal/Modal';
import './Autentisering.css';

//Håndterer brukerinnlogging med Modal. Laget av Kay
export default function Logginn({ show, onClose, onByttTilRegistrer }) {
  const { logginn, loading, error } = useAutentisering({ autoFetch: false });
  const [epost, setEpost] = useState('');
  const [passord, setPassord] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await logginn(epost, passord);
      onClose();
      setEpost('');
      setPassord('');
    } catch (err) {
      console.log(err);
    }
  };

  const handleBytt = () => {
    setEpost('');
    setPassord('');
    onByttTilRegistrer();
  };

  return (
    <Modal show={show} onClose={onClose} title="Logg inn" size="sm">
      <div className="custom-modal-body">
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-container">
            <label className='input'>E-post</label>
              <input
                className='input'
                type="email"
                value={epost}
                onChange={(e) => setEpost(e.target.value)}
                required
                disabled={loading}
              />
            
          </div>

          <div className="input-container">
            <label className='input'>Passord</label>
              
              <input
                type="password"
                value={passord}
                onChange={(e) => setPassord(e.target.value)}
                required
                disabled={loading}
              />
            
          </div>

          {error && <p className="error-melding">{error}</p>}

          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? "Logger inn" : "Logg inn"}
          </button>
        </form>

        <div className="modal-footer">
          <p>
            Ingen konto? {' '}
            <button type="button" onClick={handleBytt} className="auth-link-btn">
              Registrer
            </button>
          </p>
        </div>
      </div>
    </Modal>
  );
}