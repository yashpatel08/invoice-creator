import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { InvoiceData } from "@/types/invoice";
import { Receipt, Download } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { toast } from "sonner";
import { useState } from "react";

interface InvoicePreviewProps {
  invoice: InvoiceData;
  companyDetails: {
    name: string;
    address: string;
    email: string;
    phone: string;
    website: string;
  };
}

export function InvoicePreview({ invoice, companyDetails }: InvoicePreviewProps) {
  const [taxPercentage, setTaxPercentage] = useState<number>(0);
  
  const totalBeforeTax = invoice.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const taxAmount = (totalBeforeTax * invoice.taxPercentage) / 100;

  const totalAfterTax = totalBeforeTax + taxAmount;
  
  const handleDownload = () => {
    const doc = new jsPDF();
    const margin = 20;
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const contentMargin = margin + 10;

    doc.setDrawColor(0);
    doc.setLineWidth(0.5);
    doc.rect(margin, margin, pageWidth - 2 * margin, pageHeight - 2 * margin);

    if (invoice.logo) {
      doc.addImage(invoice.logo, "JPEG", contentMargin, contentMargin, 10, 10);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(20);
      doc.setTextColor(0);
      doc.text("INVOICE", contentMargin + 65, contentMargin + 6);
    } else {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(20);
      doc.setTextColor(0);
      doc.text("INVOICE", contentMargin, contentMargin + 20);
    }

    const detailsY = contentMargin + 30;
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(60);
    doc.text(`Invoice #: ${invoice.invoiceNumber}`, contentMargin, detailsY);
    doc.text(`Date: ${invoice.date}`, contentMargin, detailsY + 10);
    doc.text(`Due Date: ${invoice.dueDate}`, contentMargin, detailsY + 20);

    // Company Details Box
    const companyDetailsY = detailsY + 40;
    const companyDetailsMaxWidth = pageWidth - 2 * contentMargin;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text("Company Details:", contentMargin, companyDetailsY);

    const companyTextLines = [
      invoice.company.name,
      invoice.company.address,
      invoice.company.email,
      invoice.company.phone,
      invoice.company.website || ""
    ].flatMap(line => doc.splitTextToSize(line, companyDetailsMaxWidth));

    const companyTextHeight = companyTextLines.length * 7;
    doc.setDrawColor(0);
    doc.setLineWidth(0.2);
    doc.rect(contentMargin - 5, companyDetailsY - 5, companyDetailsMaxWidth + 5, companyTextHeight + 15);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    let currentCompanyY = companyDetailsY + 10;
    companyTextLines.forEach(line => {
      doc.text(line, contentMargin, currentCompanyY);
      currentCompanyY += 7;
    });

    // Bill To Box
    const billToY = currentCompanyY + 10;
    const billToMaxWidth = pageWidth - 2 * contentMargin;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text("Bill To:", contentMargin, billToY);

    const billToLines = [
      invoice.billTo.name,
      invoice.billTo.address,
      invoice.billTo.email
    ].flatMap(line => doc.splitTextToSize(line, billToMaxWidth));

    const billToTextHeight = billToLines.length * 7;
    doc.setDrawColor(0);
    doc.setLineWidth(0.2);
    doc.rect(contentMargin - 5, billToY - 5, billToMaxWidth + 5, billToTextHeight + 15);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    let currentBillY = billToY + 10;
    billToLines.forEach(line => {
      doc.text(line, contentMargin, currentBillY);
      currentBillY += 7;
    });

    // Items Table
    const tableStartY = currentBillY + 10;
    const tableColumn = ["Description", "Quantity", "Price", "Total"];
    const tableRows = invoice.items.map(item => [
      item.description,
      item.quantity.toString(),
      `$${item.price.toFixed(2)}`,
      `$${(item.quantity * item.price).toFixed(2)}`
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: tableStartY,
      theme: 'grid',
      headStyles: {
        fillColor: [33, 37, 41],
        textColor: 255,
        fontSize: 10,
        fontStyle: 'bold',
        halign: 'center',
        cellPadding: 2,
        lineWidth: 0.1,
        lineColor: [200, 200, 200],
      },
      bodyStyles: {
        textColor: 50,
        lineColor: [230, 230, 230],
        lineWidth: 0.1,
      },
      styles: {
        fontSize: 10,
        cellPadding: 6,
        valign: 'middle',
      },
      columnStyles: {
        0: { cellWidth: 'auto' },
        1: { cellWidth: 40, halign: 'center' },
        2: { cellWidth: 40, halign: 'right' },
        3: { cellWidth: 40, halign: 'right' },
      },
      margin: { left: contentMargin, right: contentMargin },
    });

    const finalY = (doc as any).lastAutoTable.finalY + 20;

    doc.setDrawColor(200);
    doc.line(contentMargin, finalY - 10, pageWidth - contentMargin, finalY - 10);

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(`Base Total: $${totalBeforeTax.toFixed(2)}`, pageWidth - contentMargin, finalY, { align: "right" });

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0);
    doc.text(`Tax (${invoice.taxPercentage}%): $${taxAmount}`, pageWidth - contentMargin - 37, finalY + 10);

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(`Total: $${totalAfterTax.toFixed(2)}`, pageWidth - contentMargin, finalY + 20, { align: "right" });

    const fileName = `invoice_${invoice.invoiceNumber}.pdf`;
    doc.save(fileName);
    toast.success("Invoice downloaded successfully!");
  };
  return (
    <Card className="p-6 bg-white rounded-xl shadow-md">
      <div className="flex justify-between items-start mb-8">
        <div>
          {invoice.logo ? (
            <img
              src={invoice.logo}
              alt="Company logo"
              className="h-10 w-10 object-contain mb-4"
            />
          ) : (
            <div className="flex items-center gap-2 text-2xl font-bold mb-1">
              <Receipt className="h-6 w-6" />
              Invoice
            </div>
          )}
          <div className="text-sm text-gray-600">#{invoice.invoiceNumber}</div>
        </div>
        <div className="text-right text-sm">
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

      <div className="mb-8 border rounded-lg p-4 bg-gray-50">
        <h3 className="font-semibold text-gray-800 mb-2">Company Details</h3>
        <div className="text-gray-600 space-y-1 text-sm">
          <div>{invoice.company?.name}</div>
          <div>{invoice.company?.address}</div>
          <div>{invoice.company?.email}</div>
          <div>{invoice.company?.phone}</div>
          <div>{invoice.company?.website}</div>
        </div>
      </div>

      <div className="mb-8 border rounded-lg p-4 bg-gray-50">
        <h3 className="font-semibold text-gray-800 mb-2">Bill To</h3>
        <div className="text-gray-600 space-y-1 text-sm">
          <div>{invoice.billTo.name}</div>
          <div>{invoice.billTo.address}</div>
          <div>{invoice.billTo.email}</div>
        </div>
      </div>

      <table className="w-full mb-6 text-sm border">
        <thead className="bg-gray-100">
          <tr>
            <th className="text-left py-2 px-3 border-b">Description</th>
            <th className="text-right py-2 px-3 border-b">Quantity</th>
            <th className="text-right py-2 px-3 border-b">Price</th>
            <th className="text-right py-2 px-3 border-b">Total</th>
          </tr>
        </thead>
        <tbody>
          {invoice.items.map((item) => (
            <tr key={item.id} className="hover:bg-gray-50">
              <td className="py-2 px-3 border-b">{item.description}</td>
              <td className="text-right py-2 px-3 border-b">{item.quantity}</td>
              <td className="text-right py-2 px-3 border-b">${item.price.toFixed(2)}</td>
              <td className="text-right py-2 px-3 border-b">
                ${(item.quantity * item.price).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-between items-center">
        <Button
          onClick={handleDownload}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Download Invoice
        </Button>

        <div className="w-64 text-right">
          <div className="flex justify-between py-2 text-base">
            <span className="font-semibold">Base Total:</span>
            <span className="text-xl font-bold text-green-600">
              ${totalBeforeTax.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between py-2 text-base">
            <span className="font-semibold">Tax ({invoice.taxPercentage}%):</span>
            <span className="text-xl font-bold text-green-600">
              ${taxAmount}
            </span>
          </div>
          <div className="flex justify-between py-2 text-base">
            <span className="font-semibold">Total:</span>
            <span className="text-xl font-bold text-green-600">
              ${totalAfterTax.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
