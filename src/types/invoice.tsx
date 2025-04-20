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
  logo?: string;
  company: {
    name: string;
    address: string;
    telephone: string;
    email: string; // Added email
    phone: string; // Added phone
    website?: string; // Optional company website, already present
    taxRegistrationNo: string;
    taxLabel: string; // Editable title for tax field
    companyRegistrationNo?: string; // Optional company registration number
  };
  billTo: {
    name: string;
    address: string;
    email: string;
  };
  items: InvoiceItem[];
  bankAccount: string;
  paymentTerms: string;
  latePaymentInfo: string;
  currency: string; // Currency type
  discount?: number; // Optional discount percentage
  status: 'Pending' | 'Paid' | 'Overdue'; // Invoice status
  paymentMethod?: string; // Payment method (e.g., 'Credit Card')
  transactionId?: string; // Transaction ID
  shippingAddress?: string; // Optional shipping address
  shippingDate?: string; // Optional shipping date
  createdAt: string; // Timestamp for creation
  updatedAt: string; // Timestamp for last update
  taxPercentage: number; // Tax percentage
  taxBreakdown?: {
    label: string;  // Tax label (e.g., 'GST', 'VAT')
    rate: number;   // Tax rate percentage
    amount: number; // Tax amount
  }[];
  total: number; // Total amount including tax
}
