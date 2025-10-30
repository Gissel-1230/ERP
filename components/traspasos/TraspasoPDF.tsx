// components/traspasos/TraspasoPDF.tsx
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import { type Traspaso } from '@/lib/data'; // Importa la interfaz corregida

const styles = StyleSheet.create({
  page: { padding: 35, fontFamily: 'Helvetica', fontSize: 11 },
  title: { fontSize: 20, textAlign: 'center', marginBottom: 20, fontFamily: 'Helvetica-Bold' },
  section: { marginBottom: 15 },
  sectionHeader: { backgroundColor: '#f3f4f6', padding: 5, fontFamily: 'Helvetica-Bold', fontSize: 12, marginBottom: 8 },
  flexRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  text: { marginBottom: 4 },
  bold: { fontFamily: 'Helvetica-Bold' },
  footer: { position: 'absolute', bottom: 30, left: 30, right: 30, textAlign: 'center', color: 'grey', fontSize: 9 },
});

export default function TraspasoPDF({ traspaso }: { traspaso: Traspaso }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Comprobante de Traspaso Interno</Text>
        
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Información General</Text>
          <View style={styles.flexRow}>
            {/* --- CAMPOS CORREGIDOS --- */}
            <Text><Text style={styles.bold}>Folio:</Text> {traspaso.folio}</Text>
            <Text><Text style={styles.bold}>Fecha Solicitud:</Text> {traspaso.request_date ? new Date(traspaso.request_date).toLocaleDateString('es-MX') : 'N/A'}</Text>
          </View>
          <Text style={styles.text}><Text style={styles.bold}>Estado:</Text> {traspaso.status.toUpperCase()}</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Movimiento</Text>
          <Text style={styles.text}><Text style={styles.bold}>Producto:</Text> {traspaso.product_name}</Text>
          <Text style={styles.text}><Text style={styles.bold}>Cantidad:</Text> {traspaso.quantity}</Text>
        </View>
        <View style={styles.flexRow}>
          <View style={{...styles.section, width: '48%'}}>
            <Text style={styles.sectionHeader}>Origen</Text>
            <Text><Text style={styles.bold}>Almacén:</Text> {traspaso.from_warehouse_name}</Text>
          </View>
          <View style={{...styles.section, width: '48%'}}>
            <Text style={styles.sectionHeader}>Destino</Text>
            <Text><Text style={styles.bold}>Almacén:</Text> {traspaso.to_warehouse_name}</Text>
          </View>
        </View>
        {traspaso.observations && (
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Observaciones</Text>
            <Text>{traspaso.observations}</Text>
          </View>
        )}
        <Text style={styles.footer}>Documento interno ERP PEC - {new Date().toLocaleString('es-MX')}</Text>
      </Page>
    </Document>
  );
}