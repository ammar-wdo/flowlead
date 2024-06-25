import { Quotation } from '@prisma/client';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { format } from 'date-fns';

type Props = {
    quotation:Quotation |undefined | null
}

const QuotationPdfGenerator = ({quotation}: Props) => {
  return (
    <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text>Quotation #{quotation!.quotationNumber}</Text>
      </View>
      <View style={styles.section}>
        <Text>Date: {format(quotation?.quotationDate!,"dd-MM-yyyy")}</Text>
        <Text>Expiry Date: {format(quotation?.expiryDate!,"dd-MM-yyyy")}</Text>
      </View>
      <View style={styles.section}>
        <Text>Subject: {quotation?.subject}</Text>
      </View>
      <View style={styles.section}>
        <Text>Line Items:</Text>
        {quotation!.lineItems.map((item, index) => (
          <Text key={index} style={styles.text}>
            {item.description} - {item.quantity} x ${item.price} (Tax: {item.taxPercentage}%)
          </Text>
        ))}
      </View>
      <View style={styles.section}>
        <Text>Total Tax: ${quotation!.totalTax}</Text>
        <Text>Discount Amount: ${quotation!.discountAmount}</Text>
        <Text>Total Amount: ${quotation!.totalAmount}</Text>
      </View>
      <View style={styles.section}>
        <Text>Footnote: {quotation!.footNote}</Text>
      </View>
    </Page>
  </Document>
  )
}



const styles = StyleSheet.create({
    page: { padding: 30 },
    section: { marginBottom: 10 },
    header: { fontSize: 18, marginBottom: 20 },
    text: { fontSize: 12, marginBottom: 5 },
  });

export default QuotationPdfGenerator