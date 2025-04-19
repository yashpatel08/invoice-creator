
import { Card } from "../components/ui/card";
import { InvoiceData } from "../types/invoice";
import { Receipt } from "lucide-react";

interface InvoicePreviewProps {
  invoice: InvoiceData;
}

export function InvoicePreview({ invoice }: InvoicePreviewProps) {
  const calculateTotal = () => {
    return invoice.items.reduce((sum, item) => sum + item.quantity * item.price, 0);
  };

  return (
    <Card className="p-6 bg-white">
      <div className="flex justify-between items-start mb-8">
        <div>
          <div className="flex items-center gap-2 text-2xl font-bold mb-1">
            <Receipt className="h-6 w-6" />
            Invoice
          </div>
          <div className="text-sm text-gray-600">#{invoice.invoiceNumber}</div>
        </div>
        <div className="text-right">
          <div className="mb-1">
            <span className="font-medium">Date: </span>
            {invoice.date}
          </div>
          <div>
            <span className="font-medium">Due Date: </span>
            {invoice.dueDate}
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="font-medium mb-2">Bill To</h3>
        <div className="text-gray-600">
          <div>{invoice.billTo.name}</div>
          <div>{invoice.billTo.address}</div>
          <div>{invoice.billTo.email}</div>
        </div>
      </div>

      <table className="w-full mb-6">
        <thead>
          <tr className="border-b">
            <th className="text-left py-2">Description</th>
            <th className="text-right py-2">Quantity</th>
            <th className="text-right py-2">Price</th>
            <th className="text-right py-2">Total</th>
          </tr>
        </thead>
        <tbody>
          {invoice.items.map((item) => (
            <tr key={item.id} className="border-b">
              <td className="py-2">{item.description}</td>
              <td className="text-right py-2">{item.quantity}</td>
              <td className="text-right py-2">${item.price.toFixed(2)}</td>
              <td className="text-right py-2">
                ${(item.quantity * item.price).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-end">
        <div className="w-64">
          <div className="flex justify-between py-2">
            <span className="font-medium">Total:</span>
            <span className="font-bold">${calculateTotal().toFixed(2)}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
