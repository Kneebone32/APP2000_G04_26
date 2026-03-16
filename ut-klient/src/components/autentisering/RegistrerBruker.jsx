import { useState } from 'react';
import Modal from '../../modal/Modal';
import './Autentisering.css';

//Registrerer en ny bruker med Modal. Laget av Kay
export default function RegisterBruker({ show, onClose, onByttTilLogginn, registrer, loading, error }) {
  const [formData, setFormData] = useState({
    bruker_navn: '',
    bruker_etternavn: '',
    bruker_epost: '',
    bruker_passord: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registrer(
        formData.bruker_navn,
        formData.bruker_etternavn,
        formData.bruker_epost,
        formData.bruker_passord
      );
      onClose(); 
      setFormData({
        bruker_navn: '',
        bruker_etternavn: '',
        bruker_epost: '',
        bruker_passord: ''
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleBytt = () => {
    setFormData({
      bruker_navn: '',
      bruker_etternavn: '',
      bruker_epost: '',
      bruker_passord: ''
    });
    onByttTilLogginn();
  };

  return (
    <Modal show={show} onClose={onClose} title="Registrer ny bruker" size="sm">
      <div className="custom-modal-body">
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-container">
            <label className='input'>Fornavn</label>
              <input
                type="text"
                name="bruker_navn"
                value={formData.bruker_navn}
                onChange={handleChange}
                required
                disabled={loading}
              />
          </div>

          <div className="input-container">
            <label className='input'>Etternavn</label>
              <input
                type="text"
                name="bruker_etternavn"
                value={formData.bruker_etternavn}
                onChange={handleChange}
                required
                disabled={loading}
              />
          </div>

          <div className="input-container">
            <label className='input'> E-post</label>
              <input
                type="email"
                name="bruker_epost"
                value={formData.bruker_epost}
                onChange={handleChange}
                required
                disabled={loading}
              />
          </div>

          <div className="input-container">
            <label className='input'>Passord</label>
              <input
                type="password"
                name="bruker_passord"
                value={formData.bruker_passord}
                onChange={handleChange}
                required
                minLength={6}
                disabled={loading}
              />
          </div>

          {error && <p className="error-melding">{error}</p>}

          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? "Registrerer" : "Registrer"}
          </button>
        </form>

        <div className="modal-footer">
          <p>
            Har allerede konto?{' '}
            <button type="button" onClick={handleBytt} className="auth-link-btn">
              Logg inn
            </button>
          </p>
        </div>
      </div>
    </Modal>
  );
}