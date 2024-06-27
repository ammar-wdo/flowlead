import { formatWithLeadingZeros, replacePlaceholders } from "@/lib/utils";
import { Quotation } from "@prisma/client";
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
  quotation: Quotation | undefined | null;
  companyInfo: {
    logo: string | null;
    address: string;
    cocNumber: string | null;
    vatNumber: string;
    IBAN: string;
    country: string;
    name: string;
    zipcode: string;
  };
};

const QuotationPdfGenerator = ({ quotation, companyInfo }: Props) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.contentContainer}>
        <View style={styles.header}>
          {!!companyInfo.logo ? (
            <Image src={companyInfo.logo} style={styles.logo} />
          ) : (
            <View style={styles.companyLetter}>
              <Text>{companyInfo.name.charAt(0).toUpperCase()}</Text>
            </View>
          )}
          <View>
            <Text style={styles.companyName}>{companyInfo.name}</Text>
            <Text style={styles.companyInfoLine}>{companyInfo.address}</Text>
            <Text style={styles.companyInfoLine}>{companyInfo.zipcode}</Text>
            <Text style={styles.companyInfoLine}>{companyInfo.country}</Text>

            <Text style={[styles.companyInfoLine, { marginTop: 15 }]}>
              {companyInfo.cocNumber}
            </Text>
            <Text style={styles.companyInfoLine}>{companyInfo.vatNumber}</Text>
            <Text style={styles.companyInfoLine}>{companyInfo.IBAN}</Text>
          </View>
        </View>
        <View style={styles.contactDetails}>
          <Text style={styles.companyInfoLine}>Contact Details</Text>
          <Text style={styles.companyInfoLine}>Company/Contact Name</Text>
          <Text style={styles.companyInfoLine}>Contact Person</Text>
          <Text style={styles.companyInfoLine}>Address</Text>
        </View>
        <View style={styles.quotationInfo}>
          <View>
            <Text style={styles.quotationNumber}>
              {replacePlaceholders(quotation?.quotationString)}
              {formatWithLeadingZeros(quotation?.quotationNumber!, 4)}
            </Text>
          </View>
          <View>
            <View style={styles.quotationDates}>
              <Text style={styles.quotationDateText}>Quotation Date: </Text>
              <Text style={styles.quotationDateText}>
                {format(quotation?.quotationDate || "", "dd-MM-yyy")}
              </Text>
            </View>
            <View style={[styles.quotationDates, { marginTop: 2 }]}>
              <Text style={styles.quotationDateText}>Expiry Date: </Text>
              <Text style={styles.quotationDateText}>
                {format(quotation?.expiryDate || "", "dd-MM-yyy")}
              </Text>
            </View>
          </View>
        </View>
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
              <Text style={[styles.tableCellHeader,{textAlign:'right'}]}>Amount</Text>
            </View>
            <View style={[styles.tableColHeader, styles.tableColTotal]}>
              <Text style={[styles.tableCellHeader,{textAlign:'right'}]}>Total</Text>
            </View>
            <View style={[styles.tableColHeader, styles.tableColVAT]}>
              <Text style={[styles.tableCellHeader,{textAlign:'right'}]}>VAT</Text>
            </View>
          </View>
          {/* Table Content */}
          {quotation?.lineItems.map((item, index) => (
            <View
              style={[
                index === quotation.lineItems.length - 1
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
                <Text style={[styles.tableCell,{textAlign:'right'}]}>€ {item.price}</Text>
              </View>
              <View style={styles.tableColTotal}>
                <Text style={[styles.tableCell,{textAlign:'right'}]}>€ {item.totalPrice}</Text>
              </View>
              <View style={styles.tableColVAT}>
                <Text style={[styles.tableCell,{textAlign:'right'}]}>{item.taxPercentage}</Text>
              </View>
            </View>
          ))}
          <View style={styles.tableRow}>
            <View style={styles.tableColQuantity}></View>
            <View style={styles.tableColDescription}></View>
            <View style={styles.tableColAmount}>
              <Text style={[styles.tableDiscount,{textAlign:'right'}]}>
                {quotation?.discount?.type === "PERCENTAGE"
                  ? `% ${quotation.discount.percentageValue}`
                  : `€ ${quotation?.discount?.fixedValue}`}{" "}
                Discount
              </Text>
            </View>
            <View>
              <Text></Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

const styles = StyleSheet.create({
  page: { paddingHorizontal: 40, paddingVertical: 50 },
  contentContainer:{
    paddingHorizontal:40
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
  quotationInfo: {
    marginTop: 40,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  quotationNumber: { fontWeight: "normal", fontSize: 16 },
  quotationDates: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 20,
  },
  quotationDateText: {
    fontSize: 10,
    fontWeight: "light",
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
  tableDiscount:{
    fontSize:10,
    fontWeight:'bold'
  }
});

export default QuotationPdfGenerator;
