import { Injectable } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';

@Injectable({
  providedIn: 'root',
})
export class GeolocationService {
  async requestPermission(): Promise<void> {
    const { location } = await Geolocation.requestPermissions();
    if (location !== 'granted') {
      console.log('Permiso denegado para geolocalización');
    }
  }

  // Obtiene la ubicación actual
  async getCurrentPosition() {
    try {
      const position = await Geolocation.getCurrentPosition();
      console.log('Ubicación actual:', position);
      return position;
    } catch (error) {
      console.error('Error obteniendo la ubicación:', error);
      throw error;
    }
  }

  watchPosition() {
    const watchId = Geolocation.watchPosition({}, (position, err) => {
      if (err) {
        console.error('Error al observar la ubicación:', err);
      } else {
        console.log('Posición actualizada:', position);
      }
    });
    return watchId;
  }

  stopWatching(watchId: string) {
    Geolocation.clearWatch({ id: watchId });
  }
}
