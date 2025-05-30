import React from 'react';
import { useParams } from 'react-router-dom';
import { useZohoInvoiceById, useGenerateInvoicePdf } from '../../../services/zoho_invoice.service';

const InvoiceView = () => {
  const { id } = useParams();
  const { data: invoice, isLoading, error } = useZohoInvoiceById(id||"")


  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !invoice?.data) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Error loading invoice: {error?.message || 'Invoice not found'}
        </div>
      </div>
    );
  }


  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <div className="bg-gray-100 shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-6">Invoice Details</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-700">Invoice Number</h2>
            <p className="text-gray-600">{invoice.data.invoice_number}</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-700">Customer</h2>
            <p className="text-gray-600">{invoice.data.customer_name}</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-700">Date</h2>
            <p className="text-gray-600">{new Date(invoice.data.date).toLocaleDateString()}</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-700">Status</h2>
            <span className={`inline-block px-2 py-1 rounded text-sm capitalize 
              ${invoice.data.status === 'paid' ? 'bg-green-100 text-green-800' : 
                invoice.data.status === 'draft' ? 'bg-gray-100 text-gray-800' : 
                'bg-yellow-100 text-yellow-800'}`}>
              {invoice.data.status}
            </span>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-700">Total</h2>
            <p className="text-gray-600">
              {invoice.data.total.toFixed(2)} {invoice.data.currency_code}
            </p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-700">Balance</h2>
            <p className="text-gray-600">
              {invoice.data.balance.toFixed(2)} {invoice.data.currency_code}
            </p>
          </div>
        </div>cha

        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-700">Timestamps</h2>
          <p className="text-gray-600">
            Created: {new Date(invoice.data.created_time).toLocaleString()}
          </p>
          <p className="text-gray-600">
            Updated: {new Date(invoice.data.updated_time).toLocaleString()}
          </p>
        </div>

  
      </div>
    </div>
  );
};

export default InvoiceView;