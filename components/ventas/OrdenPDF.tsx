import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import type { OrdenDeCompra } from '@/lib/data';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'Helvetica-Bold',
  },
  section: {
    margin: 10,
    padding: 10,
    border: '1px solid #e0e0e0',
    borderRadius: 5,
  },
  header: {
    fontSize: 12,
    marginBottom: 10,
    color: 'grey',
  },
  text: {
    fontSize: 11,
    marginBottom: 5,
  },
  bold: {
    fontFamily: 'Helvetica-Bold',
  },
  flexRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  }
});

export default function OrdenPDF({ orden }: { orden: OrdenDeCompra }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Orden de Venta / Remisión</Text>
        
        <View style={styles.section}>
          <View style={styles.flexRow}>
            <Text style={styles.header}><Text style={styles.bold}>Folio:</Text> {orden.folio}</Text>
            <Text style={styles.header}><Text style={styles.bold}>Fecha:</Text> {orden.fechaCreacion}</Text>
          </View>
          <Text style={styles.text}><Text style={styles.bold}>Código de Orden:</Text> {orden.codigo}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.header}><Text style={styles.bold}>Cliente:</Text></Text>
          <Text style={styles.text}>{orden.cliente}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.header}><Text style={styles.bold}>Detalles del Producto:</Text></Text>
          <Text style={styles.text}><Text style={styles.bold}>Producto:</Text> {orden.producto}</Text>
          <Text style={styles.text}><Text style={styles.bold}>Cantidad:</Text> {orden.cantidad} piezas</Text>
        </View>

        <View style={{ marginTop: 'auto', paddingTop: 20, borderTop: '1px solid #e0e0e0' }}>
            <Text style={{ fontSize: 9, color: 'grey', textAlign: 'center' }}>
                Documento generado por ERP PEC - {new Date().toLocaleString('es-MX')}
            </Text>
        </View>
      </Page>
    </Document>
  );
}