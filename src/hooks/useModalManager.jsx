import { useState, useCallback } from 'react';

// Define tipos de modales (opcional pero PRO)
export const MODALS = {
  CREATE: 'CREATE',
  EDIT: 'EDIT',
  DELETE: 'DELETE',
  VIEW: 'VIEW',
};

export function useModalManager() {
  const [modalState, setModalState] = useState({
    type: null,
    data: null,
  });

  const openModal = useCallback((type, data = null) => {
    setModalState({ type, data });
  }, []);

  const closeModal = useCallback(() => {
    setModalState({ type: null, data: null });
  }, []);

  const isModalOpen = useCallback(
    (type) => modalState.type === type,
    [modalState.type],
  );

  return {
    modalState,
    openModal,
    closeModal,
    isModalOpen,
  };
}
