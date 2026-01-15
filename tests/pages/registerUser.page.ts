import { Page, Locator } from '@playwright/test';

/**
 * Page Object encargado del flujo de registro de usuario en DemoQA (Book Store Application).
 */
export class RegisterUserPage {
  private readonly page: Page;

  private readonly cardBookStoreApplication: Locator;
  private readonly btnLogin: Locator;
  private readonly btnNewUser: Locator;

  private readonly inputFirstName: Locator;
  private readonly inputLastName: Locator;
  private readonly inputUserName: Locator;
  private readonly inputPassword: Locator;
  private readonly btnRegister: Locator;

  private readonly lblMensaje: Locator;
  private readonly lblPasswordError: Locator;

  constructor(page: Page) {
    this.page = page;

    this.cardBookStoreApplication = page.locator(
      "//div[contains(@class,'header-text') and contains(.,'Book Store Application')]"
    );

    this.btnLogin = page.locator(
      "//div[@class='header-text' and normalize-space()='Book Store Application']" +
        "/ancestor::div[contains(@class,'element-group')]" +
        "//li[.//span[@class='text' and normalize-space()='Login']]"
    );

    this.btnNewUser = page.locator('#newUser');

    this.inputFirstName = page.locator('#firstname');
    this.inputLastName = page.locator('#lastname');
    this.inputUserName = page.locator('#userName');
    this.inputPassword = page.locator('#password');
    this.btnRegister = page.locator('#register');

    this.lblMensaje = page.locator('#name');
    this.lblPasswordError = page.locator('#name');
  }

  // ----------------------------------------------------------------------
  // Helpers añadidos
  // ----------------------------------------------------------------------

  private async wait(): Promise<void> {
    await this.page.waitForTimeout(1000); // delay de 1 segundo
  }

  private async capture(nombre: string): Promise<void> {
    await this.page.screenshot({
      path: `screenshots/${Date.now()}_${nombre}.png`,
      fullPage: true
    });
  }

  private async scrollToElement(locator: Locator): Promise<void> {
    await locator.scrollIntoViewIfNeeded();
  }

  // ----------------------------------------------------------------------
  // Acciones originales (sin cambiar nada) + delay + screenshots
  // ----------------------------------------------------------------------

  async esperarCaptcha(): Promise<void> {
    console.log('Esperando 20 segundos para que el usuario realice el CAPTCHA...');
    await this.page.waitForTimeout(10000);
    await this.capture('esperarCaptcha');
  }

  async abrirPaginaPrincipal(): Promise<void> {
    await this.page.goto('https://demoqa.com/automation-practice-form');
    await this.cardBookStoreApplication.waitFor();
    await this.capture('abrirPaginaPrincipal');
  }

  async navegarAlFormularioDeRegistro(): Promise<void> {
    await this.cardBookStoreApplication.click();
    await this.capture('clickCardBookStore');

    await this.btnLogin.click();
    await this.capture('clickBtnLogin');

    await this.btnNewUser.click();
    await this.capture('clickBtnNewUser');
  }

  async escribirNombre(firstName: string): Promise<void> {
    await this.inputFirstName.fill(firstName);
    await this.capture(`escribirNombre_${firstName}`);
  }

  async escribirApellido(lastName: string): Promise<void> {
    await this.inputLastName.fill(lastName);
    await this.capture(`escribirApellido_${lastName}`);
  }

  async escribirUserName(baseUserName: string): Promise<void> {
    const uniqueUserName = `${baseUserName}_${Date.now()}`;
    console.log('Username generado: ' + uniqueUserName);

    await this.inputUserName.fill(uniqueUserName);
    await this.capture(`escribirUserName_${uniqueUserName}`);
  }

  async escribirPassword(password: string): Promise<void> {
    await this.inputPassword.fill(password);
    await this.capture('escribirPassword');

    await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await this.wait();
    await this.capture('scrollAfterPassword');

    await this.esperarCaptcha();
  }

  async confirmarRegistroYObtenerMensajeAlertaOpcional(): Promise<string | null> {
    await this.scrollToElement(this.btnRegister);
    await this.wait();
    await this.capture('scrollToRegister');

    await this.btnRegister.click();
    await this.wait();
    await this.capture('clickRegister');

    try {
      const dialog = await this.page.waitForEvent('dialog', { timeout: 3000 });
      const text = dialog.message();
      console.log('Texto de la alerta: ' + text);

      await dialog.accept();
      await this.wait();
      await this.capture('dialogAccepted');

      return text;
    } catch {
      console.log('No apareció alerta: se asume CAPTCHA NO marcado o error de datos.');
      await this.wait();
      await this.capture('sinAlerta');
      return null;
    }
  }

  async obtenerMensajeCaptcha(): Promise<string> {
    const text = await this.lblMensaje.textContent();
    await this.wait();
    await this.capture('obtenerMensajeCaptcha');
    return text?.trim() ?? '';
  }

  async obtenerMensajeContrasenaInvalida(): Promise<string> {
    const text = await this.lblPasswordError.textContent();
    await this.wait();
    await this.capture('obtenerMensajeContrasenaInvalida');
    return text?.trim() ?? '';
  }
}
