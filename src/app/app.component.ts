import { Component, inject, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { GeolocationService } from './services/geolocation/geolocation.service';
import { Platform } from '@ionic/angular';
import { Capacitor } from '@capacitor/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent implements OnInit {
  private gps = inject(GeolocationService);
  private platform = inject(Platform);

  ngOnInit(): void {
    this.platform.ready().then(() => {
      if (this.isMobile()) {
        this.gps.requestPermission();
      }
    });
  }

  private isMobile(): boolean {
    return Capacitor.getPlatform() !== 'web';
  }
}
