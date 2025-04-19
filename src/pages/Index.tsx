
import { useState } from "react";
import { InvoiceForm } from "../components/InvoiceForm";
import { InvoicePreview } from "../components/InvoicePreview";
import { InvoiceData } from "../types/invoice";

const Index = () => {
  const [invoice, setInvoice] = useState<InvoiceData>({
    invoiceNumber: "",
    date: new Date().toISOString().split("T")[0],
    dueDate: "",
    billTo: {
      name: "",
      address: "",
      email: "",
    },
    items: [],
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Invoice Generator</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <InvoiceForm onUpdateInvoice={setInvoice} />
          </div>
          <div>
            <InvoicePreview invoice={invoice} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;