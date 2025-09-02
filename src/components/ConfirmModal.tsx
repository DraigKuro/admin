import type { FC } from "react";

interface ConfirmModalProps {
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}

const ConfirmModal: FC<ConfirmModalProps> = ({ message, onConfirm, onCancel }) => {
    return (
        <div className="modal-backdrop">
            <div className="modal-content">
                <p>{message}</p>
                <div className="modal-actions">
                    <button className="modal-btn confirm" onClick={onConfirm}>
                        Sí
                    </button>
                    <button className="modal-btn cancel" onClick={onCancel}>
                        No
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
