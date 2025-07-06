export interface DolarQuery {
  fuente: string;
  nombre: string;
  compra: number;
  venta: number;
  promedio: number;
  fechaActualizacion: string;
}

export const getDolarApi = async (): Promise<DolarQuery | null> => {
  try {
    console.log('Fetching dollar rate from API...');
    
    // Usar una API más confiable y simple
    const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
    console.log('Response status:', response.status);
    
    if (!response.ok) {
      throw new Error(`Error al obtener el cambio del dólar: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Raw API response:', data);
    
    // Esta API devuelve tasas de cambio para múltiples monedas
    if (data && data.rates && data.rates.VES) {
      const vesRate = data.rates.VES;
      const result: DolarQuery = {
        fuente: 'Exchange Rate API',
        nombre: 'Dólar a Bolívar',
        compra: vesRate * 0.98, // Aproximación para compra (2% menos)
        venta: vesRate * 1.02,  // Aproximación para venta (2% más)
        promedio: vesRate,
        fechaActualizacion: data.time_last_updated_utc || new Date().toISOString()
      };
      console.log('Processed exchange rate data:', result);
      return result;
    }
    
    console.log('No valid VES rate found in response');
    return null;
  } catch (error) {
    console.error('Error fetching dollar rate:', error);
    
    // Datos de respaldo si la API falla
    console.log('Using fallback data');
    const fallbackData: DolarQuery = {
      fuente: 'Datos de Respaldo',
      nombre: 'Dólar Estimado',
      compra: 35.50,
      venta: 36.20,
      promedio: 35.85,
      fechaActualizacion: new Date().toISOString()
    };
    return fallbackData;
  }
};