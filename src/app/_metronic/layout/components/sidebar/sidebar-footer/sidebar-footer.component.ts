import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { environment } from '../../../../../../environments/environment';

@Component({
  selector: 'app-sidebar-footer',
  templateUrl: './sidebar-footer.component.html',
  styleUrls: ['./sidebar-footer.component.scss'],
})
export class SidebarFooterComponent implements OnInit, OnDestroy {
  appPreviewChangelogUrl: string = environment.appPreviewChangelogUrl;

  isMinimized: boolean = false; // Propiedad para indicar si el sidebar está minimizado
  private observer: MutationObserver;

  constructor(private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.checkSidebarMinimized();
    // Opcional: Escucha cambios en el DOM si el minimizado puede cambiar dinámicamente
    this.observer = new MutationObserver(() => {
      this.checkSidebarMinimized();
      this.cdr.detectChanges(); // Forzar la detección del cambio
    });
    this.observer.observe(document.body, { attributes: true, attributeFilter: ['data-kt-app-sidebar-minimize'] });
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect(); // Detener el MutationObserver
    }
  }

  checkSidebarMinimized(): void {
    this.isMinimized = document.body.hasAttribute('data-kt-app-sidebar-minimize');
  }

}
