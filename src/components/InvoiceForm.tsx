import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { InvoiceItem as InvoiceItemComponent } from "./InvoiceItem";
import { InvoiceData, InvoiceItem } from "@/types/invoice";
import { FilePlus, Upload } from "lucide-react";
import { toast } from "sonner";

interface InvoiceFormProps {
  onUpdateInvoice: (invoice: InvoiceData) => void;
}

export function InvoiceForm({ onUpdateInvoice }: InvoiceFormProps) {
  const [invoice, setInvoice] = useState<InvoiceData>({
    invoiceNumber: "",
    date: new Date().toISOString().split("T")[0],
    dueDate: "",
    logo: "",
    company: {
      name: "",
      address: "",
      telephone: "",
      email: "",
      phone: "",
      website: "",
      taxRegistrationNo: "",
      taxLabel: "GST No",
      companyRegistrationNo: "",
    },
    billTo: {
      name: "",
      address: "",
      email: "",
    },
    items: [],
    bankAccount: "",
    paymentTerms: "",
    latePaymentInfo: "",
    taxPercentage: 0,
    total: 0,
    currency: "USD", // must match your InvoiceData type
    status: "draft", 
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
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
    updateTotal(newInvoice);
  };

  const deleteItem = (index: number) => {
    const newItems = invoice.items.filter((_, i) => i !== index);
    const newInvoice = { ...invoice, items: newItems };
    setInvoice(newInvoice);
    onUpdateInvoice(newInvoice);
    updateTotal(newInvoice);
  };

  const updateTotal = (updatedInvoice: InvoiceData) => {
    const totalBeforeTax = updatedInvoice.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const totalTax = (totalBeforeTax * updatedInvoice.taxPercentage) / 100;
    const total = totalBeforeTax + totalTax;
    setInvoice((prevInvoice) => ({
      ...prevInvoice,
      total: total,
    }));
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5000000) {
        toast.error("Logo file is too large. Maximum size is 5MB.");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const newInvoice = { ...invoice, logo: reader.result as string };
        setInvoice(newInvoice);
        onUpdateInvoice(newInvoice);
      };
      reader.readAsDataURL(file);
    }
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
      } else if (parent === "company") {
        newInvoice = {
          ...invoice,
          company: {
            ...invoice.company,
            [child]: value,
          },
        };
      } else {
        newInvoice = { ...invoice };
      }
    } else {
      // Handle Date fields properly
      if (field === "date" || field === "dueDate") {
        value = new Date(value).toISOString().split("T")[0];  // Ensure proper date format
      }
      // Validate tax percentage
      if (field === "taxPercentage") {
        const taxValue = parseFloat(value);
        if (taxValue < 0 || taxValue > 100) {
          toast.error("Tax percentage must be between 0 and 100.");
          return;
        }
      }
      newInvoice = { ...invoice, [field]: value };
    }
    setInvoice(newInvoice);
    onUpdateInvoice(newInvoice);
    if (field === "taxPercentage") {
      updateTotal(newInvoice); // Recalculate total when tax percentage changes
    }
  };

  return (
    <Card className="p-6">
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="col-span-2">
          <label className="block text-sm font-medium mb-1">Logo</label>
          <div className="flex items-center gap-2">
            {invoice.logo && (
              <img
                src={invoice.logo}
                alt="Invoice logo"
                className="h-12 w-12 object-contain"
              />
            )}
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => document.getElementById("logo-upload")?.click()}
            >
              <Upload className="h-4 w-4" />
              Upload Logo
            </Button>
            <Input
              id="logo-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleLogoUpload}
            />
          </div>
        </div>

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
        <h3 className="font-medium mb-2">Company Details</h3>
        <div className="space-y-2">
          <Input
            placeholder="Company Name"
            value={invoice.company.name}
            onChange={(e) => handleFormChange("company.name", e.target.value)}
          />
          <Input
            placeholder="Address"
            value={invoice.company.address}
            onChange={(e) => handleFormChange("company.address", e.target.value)}
          />
          <Input
            placeholder="Telephone"
            value={invoice.company.telephone}
            onChange={(e) => handleFormChange("company.telephone", e.target.value)}
          />
          <Input
            placeholder="Phone"
            value={invoice.company.phone}
            onChange={(e) => handleFormChange("company.phone", e.target.value)}
          />
          <Input
            type="email"
            placeholder="Email"
            value={invoice.company.email}
            onChange={(e) => handleFormChange("company.email", e.target.value)}
          />
          <Input
            placeholder="Website"
            value={invoice.company.website}
            onChange={(e) => handleFormChange("company.website", e.target.value)}
          />
          <div className="flex gap-2">
            <Input
              placeholder="Tax Field Label (e.g. GST No, VAT ID)"
              value={invoice.company.taxLabel}
              onChange={(e) => handleFormChange("company.taxLabel", e.target.value)}
              className="w-1/2"
            />
            <Input
              placeholder="Tax Number"
              value={invoice.company.taxRegistrationNo}
              onChange={(e) => handleFormChange("company.taxRegistrationNo", e.target.value)}
              className="w-1/2"
            />
          </div>
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

      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium mb-1">Tax Percentage</label>
          <Input
            type="number"
            value={invoice.taxPercentage}
            onChange={(e) => handleFormChange("taxPercentage", e.target.value)}
            placeholder="Tax (%)"
          />
        </div>
        <div className="flex justify-between items-center">
          <h4 className="font-medium">Total</h4>
          <span>{invoice.total?.toFixed(2)}</span>
        </div>
      </div>
    </Card>
  );
}
