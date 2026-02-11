import PageWrapper from "../components/PageWrapper";
import { useModal } from "../hooks/useModal";
import Modal from "../modal/Modal";
import Nytur from "../components/Nytur";

export default function Test() {
    const {isOpen, open, close} = useModal();
  return (

        <PageWrapper>
        <button onClick={open}>Gå til kart</button>
        <Modal show={isOpen} onClose={close} title="Title" size="md">
            <div className="modal-body">
            <Nytur/> 
            </div>
        </Modal>
        </PageWrapper>

    );
}