import {
  AfterViewInit,
  Component,
  computed,
  ElementRef,
  inject,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { IonSearchbar } from '@ionic/angular/standalone';
import * as L from 'leaflet';
import { OtmService } from 'src/app/services/otm/otm.service';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [IonSearchbar],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements AfterViewInit {
  addressSelected = output<{ lat: number; lng: number }>();

  private service = inject(OtmService);
  private map: L.Map | undefined;
  private marker: L.Marker | undefined;
  mapNode = viewChild<ElementRef>('mapNode');
  ref = computed(() => this.mapNode()?.nativeElement);
  defaultLat = signal<number>(-34.635611);
  defaultLng = signal<number>(-58.364264);

  ngAfterViewInit(): void {
    const ref = this.ref();
    if (ref) {
      const defaultLat = -34.635611;
      const defaultLng = -58.364264;

      this.map = L.map(ref).setView([defaultLat, defaultLng], 16);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
      }).addTo(this.map);

      const icon = L.icon({
        iconUrl: '/media/marker-icon.png',
        shadowUrl: '/media/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      });

      this.marker = L.marker([defaultLat, defaultLng], {
        icon,
        draggable: true,
      }).addTo(this.map);

      this.map.on('click', (event: L.LeafletMouseEvent) => {
        this.moveMarker(event.latlng.lat, event.latlng.lng);
      });

      setTimeout(() => this.refreshMap(), 500);
      window.addEventListener('resize', () => this.refreshMap());
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            this.map?.setView([latitude, longitude], 16);
            this.moveMarker(latitude, longitude);
          },
          (error) => {
            console.error(
              'Error obteniendo la ubicación del dispositivo: ',
              error
            );
            this.map?.setView([defaultLat, defaultLng], 16);
          }
        );
      } else {
        console.error(
          'La geolocalización no está disponible en este navegador'
        );
        this.map?.setView([defaultLat, defaultLng], 16);
      }
    }
  }

  /**
   * Mueve el marcador a la latitud y longitud especificadas.
   * @param lat Latitud a la que se moverá el marcador.
   * @param lng Longitud a la que se moverá el marcador.
   */
  moveMarker(lat: number, lng: number): void {
    this.defaultLat.set(lat);
    this.defaultLng.set(lng);
    console.log(lat, lng);
    if (this.marker) {
      this.marker.setLatLng([lat, lng]);
      this.map?.setView([lat, lng]);
    }
  }

  seleccionar() {
    if (this.marker) {
      const { lat, lng } = this.marker.getLatLng();
      this.addressSelected.emit({ lat, lng });
    }
  }

  onSearchInput(event: Event): void {
    const query = (event.target as HTMLIonSearchbarElement).value?.trim();
    if (query) {
      this.searchLocation(query);
    }
  }

  clearSearch(): void {
    this.map?.setView([-34.635611, -58.364264], 16);
    this.moveMarker(-34.635611, -58.364264);
  }

  searchLocation(query: string): void {
    this.service.searchLocation(query).subscribe({
      next: (results) => {
        if (results.length > 0) {
          console.log(results);
          const { lat, lon } = results[0];
          this.moveMarker(parseFloat(lat), parseFloat(lon));
        } else {
          console.log('Ubicación no encontrada');
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  /**
   * Refresca el mapa si se ve gris o no carga bien.
   */
  private refreshMap(): void {
    setTimeout(() => {
      this.map?.invalidateSize();
    }, 0);
  }
}
