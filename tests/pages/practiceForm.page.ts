import { Page, Locator } from '@playwright/test';
import path from 'path';

/**
 * Page Object del "Practice Form" de DemoQA.
 * Contiene toda la lógica de interacción, selección, escritura de datos,
 * carga de archivos, manejo de dropdowns dinámicos y screenshots.
 */
export class PracticeFormPage {
  private readonly page: Page;

  // Campos de entrada del formulario
  private readonly inputFirstName: Locator;
  private readonly inputLastName: Locator;
  private readonly inputEmail: Locator;
  private readonly inputMobileNumber: Locator;
  private readonly inputDateOfBirth: Locator;
  private readonly inputSubjects: Locator;
  private readonly inputCurrentAddress: Locator;
  private readonly inputUploadPicture: Locator;

  // Controles de dropdown de Estado y Ciudad (React Select)
  private readonly stateContainer: Locator;
  private readonly stateInput: Locator;
  private readonly cityContainer: Locator;
  private readonly cityInput: Locator;

  // Botón para enviar el formulario
  private readonly btnSubmit: Locator;

  constructor(page: Page) {
    this.page = page;

    // Inputs básicos del formulario
    this.inputFirstName = page.locator('#firstName');
    this.inputLastName = page.locator('#lastName');
    this.inputEmail = page.locator('#userEmail');
    this.inputMobileNumber = page.locator('#userNumber');
    this.inputDateOfBirth = page.locator('#dateOfBirthInput');
    this.inputSubjects = page.locator('#subjectsInput');
    this.inputCurrentAddress = page.locator('#currentAddress');
    this.inputUploadPicture = page.locator('#uploadPicture');

    // Select de Estado (React Select)
    this.stateContainer = page.locator('#state');
    this.stateInput = page.locator('#react-select-3-input');

    // Select de Ciudad (React Select)
    this.cityContainer = page.locator('#city');
    this.cityInput = page.locator('#react-select-4-input');

    // Botón Submit del formulario
    this.btnSubmit = page.locator('#submit');
  }

  // Delay centralizado de 1 segundo usado en varias acciones
  private async wait(): Promise<void> {
    await this.page.waitForTimeout(1000);
  }

  // Captura de pantalla centralizada con timestamp
  private async capture(nombre: string): Promise<void> {
    await this.page.screenshot({
      path: `screenshots/${Date.now()}_${nombre}.png`,
      fullPage: true,
    });
  }

  // Método genérico para escribir texto
  private async write(locator: Locator, text: string): Promise<void> {
    await locator.fill(text);
  }

  // Click seguro: espera visibilidad, hace force click, espera y captura
  private async safeClick(locator: Locator): Promise<void> {
    await locator.waitFor({ state: 'visible' });
    await locator.click({ force: true });
    await this.wait();
    await this.capture('safeClick');
  }

  // Abre el formulario Practice Form y elimina anuncios/ads del DOM
  async abrirPaginaPracticeForm(): Promise<void> {
    await this.page.goto('https://demoqa.com/automation-practice-form');
    await this.capture('abrirPaginaPracticeForm_afterGoto');

    // Eliminación de banners y anuncios intrusivos
    await this.page.evaluate(() => {
      const fixedban = document.getElementById('fixedban');
      if (fixedban) fixedban.style.display = 'none';

      const ad = document.querySelector('[id^="google_ads"]');
      if (ad) (ad as HTMLElement).style.display = 'none';
    });

    await this.capture('abrirPaginaPracticeForm_afterRemoveAds');
  }

  // Escribir nombres y datos personales
  async escribirFirstName(value: string): Promise<void> {
    await this.write(this.inputFirstName, value);
    await this.capture('escribirFirstName');
  }

  async escribirLastName(value: string): Promise<void> {
    await this.write(this.inputLastName, value);
    await this.capture('escribirLastName');
  }

  async escribirEmail(value: string): Promise<void> {
    await this.write(this.inputEmail, value);
    await this.wait();
    await this.capture('escribirEmail');
  }

  // Selección de género mediante label dinámico
  async seleccionarGenero(gender: 'Male' | 'Female' | 'Other'): Promise<void> {
    const label = this.page.locator(
      `//div[@id='genterWrapper']//label[@class='custom-control-label' and normalize-space()='${gender}']`
    );
    await this.safeClick(label);
    await this.capture(`seleccionarGenero_${gender}`);
  }

  // Número de teléfono
  async escribirMobileNumber(value: string): Promise<void> {
    await this.write(this.inputMobileNumber, value);
    await this.capture('escribirMobileNumber');
  }

  // Selección directa del campo fecha (usa fill + Enter)
  async seleccionarFechaNacimiento(value: string): Promise<void> {
    await this.inputDateOfBirth.fill(value);
    await this.inputDateOfBirth.press('Enter');
    await this.capture('seleccionarFechaNacimiento');
  }

  // Selección de Subjects (usa React Select con búsqueda + opción)
  async escribirSubject(subject: string): Promise<void> {
    // Foco
    await this.inputSubjects.click();
    await this.wait();
    await this.capture('escribirSubject_focus');

    // Escribir búsqueda
    await this.inputSubjects.fill(subject);
    await this.wait();
    await this.capture(`escribirSubject_fill_${subject}`);

    // Seleccionar la opción encontrada
    const option = this.page.locator(
      `//div[contains(@id,'react-select-2-option') and normalize-space()='${subject}']`
    );

    await option.waitFor({ state: 'visible' });
    await option.click();
    await this.capture(`escribirSubject_select_${subject}`);
  }

  // Selección de hobbies (pueden venir separados por coma)
  async seleccionarHobbies(hobbies: string): Promise<void> {
    const list = hobbies.split(',');
    for (const h of list) {
      const trimmed = h.trim();
      if (!trimmed) continue;

      const label = this.page.locator(
        `//div[@id='hobbiesWrapper']//label[@class='custom-control-label' and normalize-space()='${trimmed}']`
      );
      await this.safeClick(label);
      await this.capture(`seleccionarHobby_${trimmed}`);
    }
  }

  // Cargar imagen válida desde carpeta tests/data
  async cargarImagenValida(): Promise<void> {
    const filePath = path.resolve('tests/data/foto.png');
    await this.inputUploadPicture.setInputFiles(filePath);
    await this.capture('cargarImagenValida');
  }

  // Dirección actual
  async escribirCurrentAddress(value: string): Promise<void> {
    await this.write(this.inputCurrentAddress, value);
    await this.capture('escribirCurrentAddress');
  }

  // Selección dinámica del Estado
  async seleccionarEstado(state: string): Promise<void> {
    await this.safeClick(this.stateContainer);
    await this.stateInput.fill(state);

    const option = this.page.locator(
      `//div[starts-with(@id,'react-select-3-option-') and normalize-space()='${state}']`
    );

    await this.safeClick(option);
    await this.capture(`seleccionarEstado_${state}`);
  }

  // Selección dinámica de Ciudad
  async seleccionarCiudad(city: string): Promise<void> {
    await this.safeClick(this.cityContainer);
    await this.cityInput.fill(city);

    const option = this.page.locator(
      `//div[starts-with(@id,'react-select-4-option-') and normalize-space()='${city}']`
    );

    await this.safeClick(option);
    await this.capture(`seleccionarCiudad_${city}`);
  }

  // Enviar el formulario: scroll + click forzado
  async clickSubmit(): Promise<void> {
    // Scroll al final para evitar overlays o elementos tapando el botón
    await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await this.page.waitForTimeout(800);
    await this.capture('clickSubmit_scroll');

    await this.btnSubmit.waitFor({ state: 'visible' });
    await this.btnSubmit.click({ force: true });
    await this.capture('clickSubmit_click');
  }
}
