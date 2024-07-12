import { formatWithLeadingZeros, replacePlaceholders } from "@/lib/utils";
import { $Enums, Invoice, Quotation } from "@prisma/client";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import { format } from "date-fns";

type Props = {
  invoice:
    | (Invoice & {
        contact:
          | {
              address: string | null;
              zipcode: string | null;
              city: string | null;
              country: string | null;
              contactType: $Enums.ContactType;
              contactName: string;
              emailAddress: string;
              companyName: string | null;
            }
          | null
          | undefined;
        contactPerson:
          | {
              emailAddress: string;
              contactName: string;
            }
          | null
          | undefined;
      })
    | undefined
    | null;
  companyInfo: {
    logo: string | null | undefined;
  address: string | null | undefined;
  cocNumber: string | null | undefined;
  vatNumber: string | null | undefined;
  IBAN: string |null | undefined;
  country: string |null | undefined;
  name: string |null | undefined;
  zipcode: string |null | undefined;
  city: string |null | undefined;
  companyEmail:string |null | undefined
  };
};

const InvoicePdfGenerator = ({ invoice, companyInfo }: Props) => {
  const subTotalAmount =
    invoice?.lineItems.reduce(
      (acc, val) => acc + val.price * val.quantity,
      0
    ) || 0;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.contentContainer}>
          <View style={styles.header}>
            {!!companyInfo.logo ? (
              <Image src={companyInfo.logo} style={styles.logo}  />
            ) : (
              <View style={{ padding: 12 }}></View>
            )}
            <View>
              <Text style={styles.companyName}>{companyInfo.name}</Text>
              <Text style={styles.companyInfoLine}>{companyInfo.address}</Text>
              <View style={{ flexDirection: "row", columnGap: 12 }}>
                <Text style={styles.companyInfoLine}>
                  {companyInfo.zipcode}
                </Text>
                <Text style={styles.companyInfoLine}>{companyInfo.city}</Text>
              </View>

              <Text style={styles.companyInfoLine}>{companyInfo.country}</Text>
              <Text style={[styles.companyInfoLine,{marginTop:15}]}>{companyInfo.companyEmail}</Text>
              <View style={{ marginTop: 15 }}>
                {companyInfo.cocNumber && (
                  <Text style={styles.companyInfoLine}>
                    CoC: {companyInfo.cocNumber}
                  </Text>
                )}
                <Text style={styles.companyInfoLine}>
                  VAT: {companyInfo.vatNumber}
                </Text>
                <Text style={styles.companyInfoLine}>
                  IBAN: {companyInfo.IBAN}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.contactDetails}>
            <Text style={styles.companyInfoLine}>
              {invoice?.contact?.contactType === "BUSINESS"
                ? invoice.contact.companyName
                : invoice?.contact?.contactName}
            </Text>
            {invoice?.contactPerson?.contactName && (
              <Text style={styles.companyInfoLine}>
                {invoice?.contactPerson?.contactName}
              </Text>
            )}
            <Text style={styles.companyInfoLine}>
              {invoice?.contact?.address}
            </Text>
            {invoice?.contact?.zipcode ||
              (invoice?.contact?.city && (
                <View style={{ flexDirection: "row", columnGap: 12 }}>
                  <Text style={styles.companyInfoLine}>
                    {invoice?.contact?.zipcode}
                  </Text>
                  <Text style={styles.companyInfoLine}>
                    {invoice?.contact?.city}
                  </Text>
                </View>
              ))}
            <Text style={styles.companyInfoLine}>
              {invoice?.contact?.country}
            </Text>
          </View>
          <View style={styles.invoiceInfo}>
            <View>
              <Text style={styles.invoiceNumber}>
                {replacePlaceholders(invoice?.invoiceString)}
                {formatWithLeadingZeros(invoice?.invoiceNumber!, 4)}
              </Text>
            </View>
            <View>
              <View style={styles.invoiceDates}>
                <Text style={styles.invoiceDateText}>invoice Date: </Text>
                <Text style={styles.invoiceDateText}>
                  {format(invoice?.invoiceDate || "", "dd-MM-yyy")}
                </Text>
              </View>
              <View style={[styles.invoiceDates, { marginTop: 2 }]}>
                <Text style={styles.invoiceDateText}>Expiry Date: </Text>
                <Text style={styles.invoiceDateText}>
                  {format(invoice?.expiryDate || "", "dd-MM-yyy")}
                </Text>
              </View>
            </View>
          </View>
        </View>
        {/* Subject */}
        <View style={styles.subjectContainer}>
          <Text style={styles.subjectText}>{invoice?.subject}</Text>
        </View>

        {/* Table */}
        <View style={styles.table}>
          {/* Table Header */}
          <View style={styles.tableRow}>
            <View style={[styles.tableColHeader, styles.tableColQuantity]}>
              <Text style={styles.tableCellHeader}></Text>
            </View>
            <View style={[styles.tableColHeader, styles.tableColDescription]}>
              <Text style={styles.tableCellHeader}>Description</Text>
            </View>
            <View style={[styles.tableColHeader, styles.tableColAmount]}>
              <Text style={[styles.tableCellHeader, { textAlign: "right" }]}>
                Amount
              </Text>
            </View>
            <View style={[styles.tableColHeader, styles.tableColTotal]}>
              <Text style={[styles.tableCellHeader, { textAlign: "right" }]}>
                Total
              </Text>
            </View>
            <View style={[styles.tableColHeader, styles.tableColVAT]}>
              <Text style={[styles.tableCellHeader, { textAlign: "right" }]}>
                VAT
              </Text>
            </View>
          </View>
          {/* Table Content */}
          {invoice?.lineItems.map((item, index) => (
            <View
              style={[
                index === invoice.lineItems.length - 1
                  ? styles.tableRowNoBorder
                  : styles.tableRow,
              ]}
              key={index}
            >
              <View style={styles.tableColQuantity}>
                <Text style={styles.tableCell}>{item.quantity} x</Text>
              </View>
              <View style={styles.tableColDescription}>
                <View>
                  <Text
                    style={[
                      styles.tableCell,
                      { fontWeight: "semibold", fontSize: 11 },
                    ]}
                  >
                    {item.name}
                  </Text>
                  <Text
                    style={[styles.tableCell, { marginTop: 3, fontSize: 8 }]}
                  >
                    {item.description}
                  </Text>
                </View>
              </View>
              <View style={styles.tableColAmount}>
                <Text style={[styles.tableCell, { textAlign: "right" }]}>
                  € {item.price}
                </Text>
              </View>
              <View style={styles.tableColTotal}>
                <Text style={[styles.tableCell, { textAlign: "right" }]}>
                  € {item.totalPrice}
                </Text>
              </View>
              <View style={styles.tableColVAT}>
                <Text style={[styles.tableCell, { textAlign: "right" }]}>
                  {item.taxPercentage} %
                </Text>
              </View>
            </View>
          ))}
         { invoice?.discount && <View style={styles.tableRow}>
            <View style={styles.tableColQuantity}></View>
            <View style={styles.tableColDescription}></View>
            <View style={styles.tableColAmount}>
              <Text style={[styles.tableDiscount, { textAlign: "right" }]}>
                {invoice?.discount?.type === "PERCENTAGE"
                  ? `% ${invoice.discount.percentageValue}`
                  : `€ ${invoice?.discount?.fixedValue}`}{" "}
                Discount
              </Text>
            </View>
            <View style={styles.tableColTotal}>
              <Text style={[styles.tableDiscount, { textAlign: "right" }]}>
                - € {invoice?.discountAmount}
              </Text>
            </View>
          </View>}
          <View style={styles.tableRowNoBorder}>
            <View style={styles.tableColQuantity}></View>
            <View style={styles.tableColDescription}></View>
            <View style={styles.tableColAmount}>
              <Text style={[styles.tableDiscount, { textAlign: "right" }]}>
                Subtotal
              </Text>
            </View>
            <View style={styles.tableColTotal}>
              <Text style={[styles.tableDiscount, { textAlign: "right" }]}>
                € {subTotalAmount - (invoice?.discountAmount || 0)}
              </Text>
            </View>
          </View>
          {invoice?.lineItems.map((item, index) => (
            <View key={`VAT-${item.id}`} style={styles.tableRowNoBorder}>
              <View style={styles.tableColQuantity}></View>
              <View style={styles.tableColDescription}></View>
              <View
                style={
                  index === invoice.lineItems.length - 1
                    ? styles.tableColAmountBorder
                    : styles.tableColAmount
                }
              >
                <Text style={[styles.tableDiscount, { textAlign: "right" }]}>
                  % {item.taxPercentage} VAT
                </Text>
              </View>
              <View
                style={
                  index === invoice.lineItems.length - 1
                    ? styles.tableColTotalBorder
                    : styles.tableColTotal
                }
              >
                <Text style={[styles.tableDiscount, { textAlign: "right" }]}>
                  € {item.taxAmount}
                </Text>
              </View>
            </View>
          ))}
          <View style={styles.tableRowNoBorder}>
            <View style={styles.tableColQuantity}></View>
            <View style={styles.tableColDescription}></View>
            <View style={styles.tableColAmount}>
              <Text
                style={[
                  styles.tableDiscount,
                  { textAlign: "right", fontWeight: "semibold", fontSize: 14 },
                ]}
              >
                Total
              </Text>
            </View>
            <View style={styles.tableColTotal}>
              <Text
                style={[
                  styles.tableDiscount,
                  { textAlign: "right", fontWeight: "semibold", fontSize: 14 },
                ]}
              >
                € {invoice?.totalAmount}
              </Text>
            </View>
          </View>
        </View>
        {/* Footnote */}
        <View style={styles.footNoteContainer}>
          <Text style={styles.footNoteText}>
            {invoice?.footNote}
          </Text>
        </View>
      </Page>
    </Document>
  );
};

const styles = StyleSheet.create({
  page: { paddingHorizontal: 40, paddingVertical: 50 },
  contentContainer: {
    paddingHorizontal: 40,
  },

  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },

  companyInfoLine: {
    fontSize: 10,
    fontWeight: "light",
    marginTop: 2,
  },
  companyName: { fontWeight: "semibold", fontSize: "15px" },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 15,
    objectFit:'contain'
  },
  companyLetter: {
    display: "flex",
    width: 40,
    height: 40,
    borderRadius: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "gray",
  },
  contactDetails: {
    marginTop: 20,
  },
  invoiceInfo: {
    marginTop: 40,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  invoiceNumber: { fontWeight: "normal", fontSize: 16 },
  invoiceDates: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 20,
  },
  invoiceDateText: {
    fontSize: 10,
    fontWeight: "light",
  },
  subjectContainer:{
marginTop:30
  },
  subjectText:{
    fontSize:12,
    fontWeight:'light'
  },
  table: {
    width: "100%",
    marginTop: 60,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#000",
  },
  tableRowNoBorder: {
    flexDirection: "row",
  },
  tableColHeader: {
    padding: 5,
  },
  tableColDescription: {
    width: "45%",
    padding: 5,
  },
  tableColQuantity: {
    width: "15%",
    padding: 5,
  },
  tableColTotal: {
    width: "15%",
    padding: 5,
  },
  tableColAmount: {
    width: "15%",
    padding: 5,
  },
  tableColVAT: {
    width: "10%",
    padding: 5,
  },
  tableCellHeader: {
    fontSize: 15,
    fontWeight: "semibold",
  },
  tableCell: {
    fontSize: 10,
  },
  tableDiscount: {
    fontSize: 10,
    fontWeight: "bold",
  },
  tableColTotalBorder: {
    width: "15%",
    padding: 5,
    borderBottomWidth: 1,
    borderColor: "#000",
  },
  tableColAmountBorder: {
    width: "15%",
    padding: 5,
    borderBottomWidth: 1,
    borderColor: "#000",
  },
  footNoteContainer:{
    paddingTop:12,
    borderTop:1,
    borderTopColor:'#000',
    marginTop:'auto'
  },
  footNoteText:{
    fontSize:12,
    fontWeight:'light'
  }
});

export default InvoicePdfGenerator;
