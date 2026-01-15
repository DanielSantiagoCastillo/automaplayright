import { Page, Locator } from '@playwright/test';
import path from 'path';

/**
 * Page Object del "Practice Form" de DemoQA.
 */
export class PracticeFormPage {
  private readonly page: Page;

  // Inputs básicos
  private readonly inputFirstName: Locator;
  private readonly inputLastName: Locator;
  private readonly inputEmail: Locator;
  private readonly inputMobileNumber: Locator;
  private readonly inputDateOfBirth: Locator;
  private readonly inputSubjects: Locator;
  private readonly inputCurrentAddress: Locator;
  private readonly inputUploadPicture: Locator;

  // Selects react de State y City
  private readonly stateContainer: Locator;
  private readonly stateInput: Locator;
  private readonly cityContainer: Locator;
  private readonly cityInput: Locator;

  // Botón Submit
  private readonly btnSubmit: Locator;

  constructor(page: Page) {
    this.page = page;

    // Campos texto
    this.inputFirstName = page.locator('#firstName');
    this.inputLastName = page.locator('#lastName');
    this.inputEmail = page.locator('#userEmail');
    this.inputMobileNumber = page.locator('#userNumber');
    this.inputDateOfBirth = page.locator('#dateOfBirthInput');
    this.inputSubjects = page.locator('#subjectsInput');
    this.inputCurrentAddress = page.locator('#currentAddress');
    this.inputUploadPicture = page.locator('#uploadPicture');

    // React select de State
    this.stateContainer = page.locator('#state');
    this.stateInput = page.locator('#react-select-3-input');

    // React select de City
    this.cityContainer = page.locator('#city');
    this.cityInput = page.locator('#react-select-4-input');

    // Botón Submit
    this.btnSubmit = page.locator('#submit');
  }

  // ----------------------------------------------------------------------
  // Helpers
  // ----------------------------------------------------------------------

  // Delay de 1 segundo centralizado
  private async wait(): Promise<void> {
    await this.page.waitForTimeout(1000);
  }

  // Screenshot centralizado
  private async capture(nombre: string): Promise<void> {
    await this.page.screenshot({
      path: `screenshots/${Date.now()}_${nombre}.png`,
      fullPage: true,
    });
  }

  private async write(locator: Locator, text: string): Promise<void> {
    await locator.fill(text);
  }

  private async safeClick(locator: Locator): Promise<void> {
    await locator.waitFor({ state: 'visible' });
    await locator.click({ force: true });
    await this.wait();
    await this.capture('safeClick');
  }

  // ----------------------------------------------------------------------
  // Acciones del formulario
  // ----------------------------------------------------------------------

  async abrirPaginaPracticeForm(): Promise<void> {
    await this.page.goto('https://demoqa.com/automation-practice-form');
    await this.capture('abrirPaginaPracticeForm_afterGoto');

    // Quitar banners/ads que interceptan clics
    await this.page.evaluate(() => {
      const fixedban = document.getElementById('fixedban');
      if (fixedban) fixedban.style.display = 'none';

      const ad = document.querySelector('[id^="google_ads"]');
      if (ad) (ad as HTMLElement).style.display = 'none';
    });

    await this.capture('abrirPaginaPracticeForm_afterRemoveAds');
  }

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

  async seleccionarGenero(gender: 'Male' | 'Female' | 'Other'): Promise<void> {
    const label = this.page.locator(
      `//div[@id='genterWrapper']//label[@class='custom-control-label' and normalize-space()='${gender}']`
    );
    await this.safeClick(label);
    await this.capture(`seleccionarGenero_${gender}`);
  }

  async escribirMobileNumber(value: string): Promise<void> {
    await this.write(this.inputMobileNumber, value);
    await this.capture('escribirMobileNumber');
  }

  /**
   * Fecha en formato "14 Jan 2026".
   */
  async seleccionarFechaNacimiento(value: string): Promise<void> {
    await this.inputDateOfBirth.fill(value);
    await this.inputDateOfBirth.press('Enter');
    await this.capture('seleccionarFechaNacimiento');
  }

  /**
   * Subject usando el input react (#subjectsInput).
   * Ejemplo: "Maths"
   */
  async escribirSubject(subject: string): Promise<void> {
    // 1. Foco en el input
    await this.inputSubjects.click();
    await this.wait();
    await this.capture('escribirSubject_focus');

    // 2. Escribir el texto a buscar
    await this.inputSubjects.fill(subject);
    await this.wait();
    await this.capture(`escribirSubject_fill_${subject}`);

    // 3. Esperar y hacer click en la opción del dropdown
    const option = this.page.locator(
      `//div[contains(@id,'react-select-2-option') and normalize-space()='${subject}']`
    );

    await option.waitFor({ state: 'visible' });
    await option.click();
    await this.capture(`escribirSubject_select_${subject}`);
  }

  /**
   * Hobbies: "Sports, Reading, Music"
   */
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

  async cargarImagenValida(): Promise<void> {
    const filePath = path.resolve('tests/data/foto.png');
    await this.inputUploadPicture.setInputFiles(filePath);
    await this.capture('cargarImagenValida');
  }

  async escribirCurrentAddress(value: string): Promise<void> {
    await this.write(this.inputCurrentAddress, value);
    await this.capture('escribirCurrentAddress');
  }

  /**
   * State react-select. Ejemplo: "NCR"
   */
  async seleccionarEstado(state: string): Promise<void> {
    await this.safeClick(this.stateContainer);
    await this.stateInput.fill(state);
    const option = this.page.locator(
      `//div[starts-with(@id,'react-select-3-option-') and normalize-space()='${state}']`
    );
    await this.safeClick(option);
    await this.capture(`seleccionarEstado_${state}`);
  }

  /**
   * City react-select. Ejemplo (para NCR): "Delhi"
   */
  async seleccionarCiudad(city: string): Promise<void> {
    await this.safeClick(this.cityContainer);
    await this.cityInput.fill(city);
    const option = this.page.locator(
      `//div[starts-with(@id,'react-select-4-option-') and normalize-space()='${city}']`
    );
    await this.safeClick(option);
    await this.capture(`seleccionarCiudad_${city}`);
  }

  /**
   * Scroll hasta abajo y hace click en Submit.
   * No valida ningún mensaje de respuesta.
   */
  async clickSubmit(): Promise<void> {
    await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await this.page.waitForTimeout(800);
    await this.capture('clickSubmit_scroll');

    await this.btnSubmit.waitFor({ state: 'visible' });
    await this.btnSubmit.click({ force: true });
    await this.capture('clickSubmit_click');
  }
}
