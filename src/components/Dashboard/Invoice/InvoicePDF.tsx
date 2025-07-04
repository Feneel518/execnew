import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { format } from "date-fns";

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 10,
    fontFamily: "Helvetica",
  },
  section: {
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    marginBottom: 8,
    textAlign: "center",
    textTransform: "uppercase",
  },
  heading: {
    fontSize: 12,
    marginBottom: 4,
    fontWeight: "bold",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  itemRow: {
    borderBottom: "1px solid #ccc",
    paddingVertical: 4,
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

import { FC } from "react";

interface InvoicePDFProps {
  invoice: {
    invoiceNumber: string;
    poNumber: string;
    poDate: string;
    date: string;
    customerName: string;
    customerAddress: string;
    items: { description: string; qty: number; price: number; total: number }[];
    gstAmount: number;
    totalAmount: number;
  };
}

const InvoicePDF: FC<InvoicePDFProps> = ({ invoice }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Explosion Proof Electrical Control</Text>
        <Text style={{ textAlign: "center", marginBottom: 10 }}>
          Plot no. 920, GIDC, phase 4, Vapi, Gujarat, India
        </Text>

        <View style={styles.section}>
          <Text style={styles.heading}>Invoice</Text>
          <Text>Invoice Number: {invoice.invoiceNumber}</Text>
          <Text>Date: {format(new Date(invoice.date), "dd MMM yyyy")}</Text>
          <Text>PO Number: {invoice.poNumber}</Text>
          <Text>
            PO Date: {format(new Date(invoice.poDate), "dd MMM yyyy")}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>Bill To:</Text>
          <Text>{invoice.customerName}</Text>
          <Text>{invoice.customerAddress}</Text>
        </View>

        <View
          style={[
            styles.section,
            { borderTop: "1px solid black", paddingTop: 6 },
          ]}
        >
          <View style={styles.row}>
            <Text style={{ width: "50%" }}>Item</Text>
            <Text style={{ width: "10%" }}>Qty</Text>
            <Text style={{ width: "20%" }}>Price</Text>
            <Text style={{ width: "20%" }}>Total</Text>
          </View>
          {invoice.items.map((item, idx) => (
            <View style={styles.itemRow} key={idx}>
              <Text style={{ width: "50%" }}>{item.description}</Text>
              <Text style={{ width: "10%" }}>{item.qty}</Text>
              <Text style={{ width: "20%" }}>₹{item.price.toFixed(2)}</Text>
              <Text style={{ width: "20%" }}>₹{item.total.toFixed(2)}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text>GST (18%): ₹{invoice.gstAmount.toFixed(2)}</Text>
          <Text style={{ fontWeight: "bold" }}>
            Total: ₹{invoice.totalAmount.toFixed(2)}
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default InvoicePDF;
