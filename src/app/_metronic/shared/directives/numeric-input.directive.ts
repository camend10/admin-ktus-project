import { Directive, HostListener, ElementRef, Renderer2, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

@Directive({
  selector: '[appNumericInput]',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NumericInputDirective),
      multi: true
    }
  ]
})
export class NumericInputDirective implements ControlValueAccessor {
  private onChange = (value: any) => {}; // Callback para actualizar el modelo
  private onTouched = () => {}; // Callback para el evento "touched"
  private isFormatting = false; // Bandera para evitar ciclos infinitos

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  // Detectar la entrada al escribir
  @HostListener('input', ['$event'])
  formatInput(event: Event): void {
    if (this.isFormatting) {
      return; // Salir si ya estamos formateando
    }

    this.isFormatting = true; // Activar la bandera

    const inputElement = this.el.nativeElement as HTMLInputElement;

    // Permitir solo números, comas y un punto decimal
    let value = inputElement.value.replace(/[^0-9.]/g, '');

    // Asegurarse de que solo haya un punto decimal
    const parts = value.split('.');
    if (parts.length > 2) {
      value = parts[0] + '.' + parts[1];
    }

    // Agregar un `0` si el usuario comienza con un punto decimal
    if (value.startsWith('.')) {
      value = '0' + value;
    }

    // Eliminar ceros iniciales no válidos (excepto si el valor es "0" o "0.")
    if (value.startsWith('0') && !value.startsWith('0.') && parts[0].length > 1) {
      value = value.replace(/^0+/, ''); // Eliminar todos los ceros iniciales
    }

    // Actualizar el modelo con el valor puro (sin comas)
    const numericValue = parseFloat(value) || 0;
    this.onChange(numericValue);

    // Formatear la parte entera con comas
    const integerPart = value.split('.')[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    // Reconstruir el valor con decimales si los hay
    const formattedValue = parts.length > 1 ? `${integerPart}.${parts[1]}` : integerPart;

    // Actualizar el campo de entrada visualmente
    this.renderer.setProperty(inputElement, 'value', formattedValue);

    this.isFormatting = false; // Desactivar la bandera
  }

  @HostListener('blur')
  onBlur(): void {
    this.onTouched(); // Registrar el evento de pérdida de foco
  }

  private formatNumber(value: number): string {
    if (isNaN(value)) {
      return ''; // Manejar entradas vacías
    }
    return value.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2 // Máximo dos decimales
    });
  }

  // Métodos de la interfaz ControlValueAccessor
  writeValue(value: any): void {
    if (value == null || isNaN(value)) {
      this.renderer.setProperty(this.el.nativeElement, 'value', '');
      return;
    }

    const parts = value.toString().split('.');
    const integerPart = parseInt(parts[0], 10).toLocaleString('en-US');
    const formattedValue = parts[1] ? `${integerPart}.${parts[1]}` : integerPart;

    this.renderer.setProperty(this.el.nativeElement, 'value', formattedValue);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn; // Registrar el callback para actualizar el modelo
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn; // Registrar el callback para el evento touched
  }

  setDisabledState?(isDisabled: boolean): void {
    this.renderer.setProperty(this.el.nativeElement, 'disabled', isDisabled);
  }
}
