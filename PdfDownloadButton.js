import React, { useState } from 'react';

const PdfDownloadButton = ({ productId, addressAdded }) => {
    const handleDownloadReceipt = async () => {
        try {
            const response = await fetch(`http://localhost:3001/api/products/${productId}/receipt`);

            if (!response.ok) {
                throw new Error('Error al descargar el PDF');
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = 'receipt.pdf';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error al descargar el recibo PDF:', error);
        }
    };

    return (
        <button className="buy-button" onClick={handleDownloadReceipt} disabled={!addressAdded}>
            Descargar Recibo
        </button>
    );
};

export default PdfDownloadButton;
