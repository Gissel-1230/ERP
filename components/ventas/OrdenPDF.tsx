import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import type { OrdenDeCompra, OrderStatus } from '@/lib/data';

// --- ESTILOS MEJORADOS PARA EL PDF ---
const styles = StyleSheet.create({
  page: {
    padding: 35,
    fontFamily: 'Helvetica',
    fontSize: 11,
    color: '#333',
  },
  header: {
    marginBottom: 25,
    textAlign: 'center',
  },
  title: {
    fontSize: 22,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 12,
    color: 'grey',
  },
  section: {
    marginBottom: 15,
  },
  sectionHeader: {
    backgroundColor: '#f3f4f6',
    padding: 5,
    fontFamily: 'Helvetica-Bold',
    fontSize: 12,
    marginBottom: 8,
  },
  flexRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  text: {
    marginBottom: 4,
  },
  bold: {
    fontFamily: 'Helvetica-Bold',
  },
  totalSection: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
  },
  totalText: {
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    color: 'grey',
    fontSize: 9,
  },
  // Estilos para el estado de la orden
  statusBox: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 5,
  },
  statusText: {
    color: 'white',
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
  }
});

// Colores para cada estado, similar al Kanban
const statusColors: { [key in OrderStatus]: string } = {
  'Pendiente': '#f59e0b', // amber-500
  'En proceso de preparar': '#3b82f6', // blue-500
  'Aceptado': '#22c55e', // green-500
  'En Camino': '#06b6d4', // cyan-500
  'Rechazado': '#ef4444', // red-500
};

// Formateador de moneda
const currencyFormatter = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN',
});

export default function OrdenPDF({ orden }: { orden: OrdenDeCompra }) {
  const statusColor = statusColors[orden.status];

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Aquí iría el logo en el futuro */}
        {/* <Image src="/logo.png" style={styles.logo} /> */}

        <View style={styles.header}>
          <Text style={styles.title}>Orden de Venta / Remisión</Text>
          <Text style={styles.subtitle}>Folio: {orden.folio}</Text>
        </View>

        {/* --- SECCIÓN DE INFORMACIÓN GENERAL --- */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Información General</Text>
          <View style={styles.flexRow}>
            <Text style={styles.text}><Text style={styles.bold}>Código de Orden:</Text> {orden.codigo}</Text>
            <Text style={styles.text}><Text style={styles.bold}>Fecha:</Text> {orden.fechaCreacion}</Text>
          </View>
          <View style={styles.flexRow}>
            <Text style={styles.text}><Text style={styles.bold}>Cliente:</Text> {orden.cliente}</Text>
            {/* --- ESTADO DE LA ORDEN --- */}
            <View style={{ ...styles.statusBox, backgroundColor: statusColor }}>
              <Text style={styles.statusText}>{orden.status.toUpperCase()}</Text>
            </View>
          </View>
        </View>

        {/* --- SECCIÓN DE DETALLES DEL PRODUCTO --- */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Detalles de la Orden</Text>
          <Text style={styles.text}><Text style={styles.bold}>Producto:</Text> {orden.producto}</Text>
          <Text style={styles.text}><Text style={styles.bold}>Cantidad:</Text> {orden.cantidad} piezas</Text>
        </View>

        {/* --- SECCIÓN DE TOTALES --- */}
        <View style={styles.totalSection}>
          <Text style={styles.totalText}>
            VALOR TOTAL: {currencyFormatter.format(orden.valorTotal)}
          </Text>
        </View>

        <Text style={styles.footer}>
          Documento generado por ERP PEC - {new Date().toLocaleString('es-MX')}
        </Text>
      </Page>
    </Document>
  );
}