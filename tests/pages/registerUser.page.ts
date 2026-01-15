import { Page, Locator } from '@playwright/test';

/**
 * Page Object encargado del flujo de registro de usuario en DemoQA (Book Store Application).
 * Maneja navegación, llenado de formulario, interacción con CAPTCHA
 * y recuperación de mensajes de éxito o error.
 */
export class RegisterUserPage {
  private readonly page: Page;

  // Elementos principales de navegación hacia Book Store / Login / Registro
  private readonly cardBookStoreApplication: Locator;
  private readonly btnLogin: Locator;
  private readonly btnNewUser: Locator;

  // Campos del formulario de registro
  private readonly inputFirstName: Locator;
  private readonly inputLastName: Locator;
  private readonly inputUserName: Locator;
  private readonly inputPassword: Locator;
  private readonly btnRegister: Locator;

  // Labels para mensajes de sistema (CAPTCHA, errores, etc.)
  private readonly lblMensaje: Locator;
  private readonly lblPasswordError: Locator;

  constructor(page: Page) {
    this.page = page;

    // Tarjeta principal del módulo "Book Store Application"
    this.cardBookStoreApplication = page.locator(
      "//div[contains(@class,'header-text') and contains(.,'Book Store Application')]"
    );

    // Opción de menú para acceder al Login del módulo Book Store
    this.btnLogin = page.locator(
      "//div[@class='header-text' and normalize-space()='Book Store Application']" +
        "/ancestor::div[contains(@class,'element-group')]" +
        "//li[.//span[@class='text' and normalize-space()='Login']]"
    );

    // Botón para ir al formulario de nuevo usuario
    this.btnNewUser = page.locator('#newUser');

    // Campos del formulario de registro
    this.inputFirstName = page.locator('#firstname');
    this.inputLastName = page.locator('#lastname');
    this.inputUserName = page.locator('#userName');
    this.inputPassword = page.locator('#password');
    this.btnRegister = page.locator('#register');

    // Mensajes mostrados en el label #name (CAPTCHA, errores, etc.)
    this.lblMensaje = page.locator('#name');
    this.lblPasswordError = page.locator('#name');
  }

  // Espera genérica de 1 segundo para estabilizar la UI
  private async wait(): Promise<void> {
    await this.page.waitForTimeout(1000); // delay de 1 segundo
  }

  // Captura centralizada de pantallas con nombre y timestamp
  private async capture(nombre: string): Promise<void> {
    await this.page.screenshot({
      path: `screenshots/${Date.now()}_${nombre}.png`,
      fullPage: true
    });
  }

  // Realiza scroll al elemento pasado como parámetro
  private async scrollToElement(locator: Locator): Promise<void> {
    await locator.scrollIntoViewIfNeeded();
  }

  // Espera explícita para que el usuario complete el CAPTCHA manualmente
  async esperarCaptcha(): Promise<void> {
    console.log('Esperando 20 segundos para que el usuario realice el CAPTCHA...');
    await this.page.waitForTimeout(10000);
    await this.capture('esperarCaptcha');
  }

  // Abre la página principal y espera la tarjeta de Book Store
  async abrirPaginaPrincipal(): Promise<void> {
    await this.page.goto('https://demoqa.com/automation-practice-form');
    await this.cardBookStoreApplication.waitFor();
    await this.capture('abrirPaginaPrincipal');
  }

  // Navega desde el card hasta el formulario de registro de nuevo usuario
  async navegarAlFormularioDeRegistro(): Promise<void> {
    await this.cardBookStoreApplication.click();
    await this.capture('clickCardBookStore');

    await this.btnLogin.click();
    await this.capture('clickBtnLogin');

    await this.btnNewUser.click();
    await this.capture('clickBtnNewUser');
  }

  // Escribe el nombre en el campo First Name
  async escribirNombre(firstName: string): Promise<void> {
    await this.inputFirstName.fill(firstName);
    await this.capture(`escribirNombre_${firstName}`);
  }

  // Escribe el apellido en el campo Last Name
  async escribirApellido(lastName: string): Promise<void> {
    await this.inputLastName.fill(lastName);
    await this.capture(`escribirApellido_${lastName}`);
  }

  // Genera un username único usando base + timestamp, lo escribe y deja evidencia
  async escribirUserName(baseUserName: string): Promise<void> {
    const uniqueUserName = `${baseUserName}_${Date.now()}`;
    console.log('Username generado: ' + uniqueUserName);

    await this.inputUserName.fill(uniqueUserName);
    await this.capture(`escribirUserName_${uniqueUserName}`);
  }

  // Escribe la contraseña, hace scroll al final y activa la espera para el CAPTCHA
  async escribirPassword(password: string): Promise<void> {
    await this.inputPassword.fill(password);
    await this.capture('escribirPassword');

    await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await this.wait();
    await this.capture('scrollAfterPassword');

    await this.esperarCaptcha();
  }

  /**
   * Intenta confirmar el registro haciendo clic en "Register".
   * - Si aparece un dialog (alert), devuelve su texto.
   * - Si no aparece, devuelve null y se asume problema de CAPTCHA o datos.
   */
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

  // Obtiene el mensaje mostrado cuando falla el CAPTCHA u otro mensaje general
  async obtenerMensajeCaptcha(): Promise<string> {
    const text = await this.lblMensaje.textContent();
    await this.wait();
    await this.capture('obtenerMensajeCaptcha');
    return text?.trim() ?? '';
  }

  // Obtiene el mensaje mostrado cuando la contraseña es inválida
  async obtenerMensajeContrasenaInvalida(): Promise<string> {
    const text = await this.lblPasswordError.textContent();
    await this.wait();
    await this.capture('obtenerMensajeContrasenaInvalida');
    return text?.trim() ?? '';
  }
}
