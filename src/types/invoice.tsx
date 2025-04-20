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
  billTo: {
    name: string;
    address: string;
    email: string;
  };
  company: {
    name: string;
    address: string;
    telephone: string;
    email: string;
    phone: string;
    website: string;
    taxRegistrationNo: string;
    taxLabel: string;
    companyRegistrationNo: string;
  };
  items: any[];
  taxPercentage: number;
  bankAccount?: string;
  paymentTerms?: string;
  latePaymentInfo?: string;
  currency?: string;
  status?: string;           // optional
  createdAt?: string;        // optional
  updatedAt?: string;        // optional
  total?: number;            // optional

}
