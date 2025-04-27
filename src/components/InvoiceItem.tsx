import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { X } from "lucide-react";
import { InvoiceItem as InvoiceItemType } from "@/types/invoice";

interface InvoiceItemProps {
  item: InvoiceItemType;
  onChange: (item: InvoiceItemType) => void;
  onDelete: () => void;
}

export function InvoiceItem({ item, onChange, onDelete }: InvoiceItemProps) {
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // This will properly convert the string to a number, 
    // removing any leading zeros
    const value = e.target.value;
    const price = value === '' ? 0 : parseFloat(value);
    onChange({ ...item, price });
  };
  
  return (
    <div className="flex items-center gap-4 mb-2">
      <Input
        placeholder="Description"
        value={item.description}
        onChange={(e) => onChange({ ...item, description: e.target.value })}
        className="flex-1"
      />
      <Input
        type="number"
        placeholder="Qty"
        value={item.quantity}
        onChange={(e) => onChange({ ...item, quantity: Number(e.target.value) })}
        className="w-24"
      />
      <Input
        type="number"
        placeholder="Price"
        value={item.price === 0 ? '' : item.price} // Show empty string instead of 0
        onChange={handlePriceChange}
        className="w-32"
      />
      <div className="w-32 text-right">
        ${(item.quantity * item.price).toFixed(2)}
      </div>
      <Button variant="ghost" size="icon" onClick={onDelete}>
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}