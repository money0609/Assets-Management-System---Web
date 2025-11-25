import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import type { Asset } from '../types/asset.types';

interface ModalProps {
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ onClose, children }) => {
  // Extract asset from children (AssetForm component)
  const getAssetFromChildren = (): Asset | null => {
    if (React.isValidElement(children) && children.props && typeof children.props === 'object' && 'asset' in children.props) {
      return children.props.asset as Asset | null;
    }
    return null;
  };

  const editingAsset = getAssetFromChildren();

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={handleBackdropClick}
    >
        <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
                <h2 className="text-2xl font-bold text-gray-900">
                    {editingAsset?.id ? 'Edit Asset' : 'Add New Asset'}
                </h2>
                <button
                    onClick={onClose}
                    className="!p-2 !bg-white hover:!bg-gray-100 !rounded-lg !transition-colors !border-0 !shadow-none focus:!outline-none focus-visible:!outline-none"
                    type="button"
                >
                    <X className="w-5 h-5 text-gray-500" />
                </button>
            </div>
            {children}
        </div>
    </div>
  );
};

export default Modal;

