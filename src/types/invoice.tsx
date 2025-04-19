
export interface InvoiceItem {
    id: string;
    description: string;
    quantity: number;
    price: number;
  }
  
  export interface InvoiceData {
    invoiceNumber: string;
    date: string;
    dueDate: string;
    billTo: {
      name: string;
      address: string;
      email: string;
    };
    items: InvoiceItem[];
  }
  