
import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card } from "../components/ui/card";
import { InvoiceItem as InvoiceItemComponent } from "./InvoiceItem";
import { InvoiceData, InvoiceItem } from "@/types/invoice";
import { FilePlus } from "lucide-react";

interface InvoiceFormProps {
  onUpdateInvoice: (invoice: InvoiceData) => void;
}

export function InvoiceForm({ onUpdateInvoice }: InvoiceFormProps) {
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

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: Math.random().toString(36).substring(7),
      description: "",
      quantity: 1,
      price: 0,
    };
    setInvoice({
      ...invoice,
      items: [...invoice.items, newItem],
    });
  };

  const updateItem = (index: number, updatedItem: InvoiceItem) => {
    const newItems = [...invoice.items];
    newItems[index] = updatedItem;
    const newInvoice = { ...invoice, items: newItems };
    setInvoice(newInvoice);
    onUpdateInvoice(newInvoice);
  };

  const deleteItem = (index: number) => {
    const newItems = invoice.items.filter((_, i) => i !== index);
    const newInvoice = { ...invoice, items: newItems };
    setInvoice(newInvoice);
    onUpdateInvoice(newInvoice);
  };

  const handleFormChange = (field: string, value: string) => {
    let newInvoice: InvoiceData;
    if (field.includes(".")) {
      const [parent, child] = field.split(".");
      if (parent === "billTo") {
        newInvoice = {
          ...invoice,
          billTo: {
            ...invoice.billTo,
            [child]: value,
          },
        };
      } else {
        newInvoice = { ...invoice };
      }
    } else {
      newInvoice = { ...invoice, [field]: value };
    }
    setInvoice(newInvoice);
    onUpdateInvoice(newInvoice);
  };

  return (
    <Card className="p-6">
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-1">Invoice Number</label>
          <Input
            value={invoice.invoiceNumber}
            onChange={(e) => handleFormChange("invoiceNumber", e.target.value)}
            placeholder="INV-001"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Date</label>
          <Input
            type="date"
            value={invoice.date}
            onChange={(e) => handleFormChange("date", e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Due Date</label>
          <Input
            type="date"
            value={invoice.dueDate}
            onChange={(e) => handleFormChange("dueDate", e.target.value)}
          />
        </div>
      </div>

      <div className="mb-6">
        <h3 className="font-medium mb-2">Bill To</h3>
        <div className="space-y-2">
          <Input
            placeholder="Name"
            value={invoice.billTo.name}
            onChange={(e) => handleFormChange("billTo.name", e.target.value)}
          />
          <Input
            placeholder="Address"
            value={invoice.billTo.address}
            onChange={(e) => handleFormChange("billTo.address", e.target.value)}
          />
          <Input
            type="email"
            placeholder="Email"
            value={invoice.billTo.email}
            onChange={(e) => handleFormChange("billTo.email", e.target.value)}
          />
        </div>
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-medium">Items</h3>
          <Button onClick={addItem} variant="outline" size="sm">
            <FilePlus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </div>
        <div className="space-y-2">
          {invoice.items.map((item, index) => (
            <InvoiceItemComponent
              key={item.id}
              item={item}
              onChange={(updatedItem) => updateItem(index, updatedItem)}
              onDelete={() => deleteItem(index)}
            />
          ))}
        </div>
      </div>
    </Card>
  );
}
