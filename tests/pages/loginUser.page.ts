import { Page, Locator } from '@playwright/test';

// Página de Login del módulo Book Store Application.
// Implementa navegación, interacción con campos, validaciones
// y captura de evidencia mediante screenshots.
export class LoginUserPage {
  private readonly page: Page;

  // Elementos principales para navegar hacia el módulo
  private readonly cardBookStoreApplication: Locator;
  private readonly btnLogin: Locator;

  // Inputs del formulario de Login
  private readonly inputUserName: Locator;
  private readonly inputPassword: Locator;
  private readonly btnIngreso: Locator;

  // Validación de login exitoso
  private readonly userNameProfile: Locator;

  // Mensaje de error de password inválida
  private readonly lblPasswordError: Locator;

  constructor(page: Page) {
    this.page = page;

    // Tarjeta principal de acceso a "Book Store Application"
    this.cardBookStoreApplication = page.locator(
      "//div[contains(@class,'header-text') and contains(.,'Book Store Application')]"
    );

    // Botón del menú interno para ir al Login
    this.btnLogin = page.locator(
      "//div[@class='header-text' and normalize-space()='Book Store Application']" +
        "/ancestor::div[contains(@class,'element-group')]" +
        "//li[.//span[@class='text' and normalize-space()='Login']]"
    );

    // Inputs del formulario de login
    this.inputUserName = page.locator('#userName');
    this.inputPassword = page.locator('#password');
    this.btnIngreso = page.locator('#login');

    // Localizador que confirma inicio de sesión exitoso
    this.userNameProfile = page.locator(
      "//label[@id='userName-value' and contains(normalize-space(),'userprueba0011.')]"
    );

    // Localizador del mensaje de error cuando la contraseña es inválida
    this.lblPasswordError = page.locator('#name');
  }

  // Pausa centralizada de 1 segundo (control del timing)
  private async wait() {
    await this.page.waitForTimeout(1000);
  }

  // Captura de pantalla centralizada en carpeta /screenshots
  private async capture(nombre: string) {
    await this.page.screenshot({ path: `screenshots/${Date.now()}_${nombre}.png`, fullPage: true });
  }

  // Abre la página principal y espera que cargue el card de Book Store
  async abrirPaginaPrincipal(): Promise<void> {
    await this.page.goto('https://demoqa.com/automation-practice-form');
    await this.capture('abrirPaginaPrincipal');
    await this.cardBookStoreApplication.waitFor();
    await this.wait();
  }

  // Navega desde el card principal hasta el formulario de Login
  async navegarAlFormularioDeLogin(): Promise<void> {
    await this.cardBookStoreApplication.click();
    await this.wait();
    await this.capture('clickBookStoreCard');

    await this.btnLogin.click();
    await this.wait();
    await this.capture('clickBtnLogin');
  }

  // Escribe el username en el campo correspondiente
  async escribirUserName(baseUserName: string): Promise<void> {
    await this.inputUserName.fill(baseUserName);
    await this.wait();
    await this.capture(`escribirUserName_${baseUserName}`);
  }

  // Escribe la contraseña válida en el campo
  async escribirPassword(password: string): Promise<void> {
    await this.inputPassword.fill(password);
    await this.wait();
    await this.capture('escribirPassword');
  }

  // Clic en el botón Login
  async clickLogin(): Promise<void> {
    await this.btnIngreso.click();
    await this.wait();
    await this.capture('clickLogin');
  }

  // Valida que el perfil del usuario cargó (Login exitoso)
  async validateNameProfile(): Promise<void> {
    await this.userNameProfile.waitFor();
    await this.wait();
    await this.capture('validateNameProfile');
  }

  // Escribe una contraseña inválida para pruebas negativas
  async escribirInvalidPassword(invalidpassword: string): Promise<void> {
    await this.inputPassword.fill(invalidpassword);
    await this.wait();
    await this.capture(`escribirInvalidPassword_${invalidpassword}`);
  }

  // Obtiene el texto del mensaje de error de contraseña inválida
  async obtenerMensajeContrasenaInvalida(): Promise<string> {
    await this.wait();
    const text = await this.lblPasswordError.textContent();
    await this.capture('obtenerMensajeErrorPassword');
    await this.wait();
    return text?.trim() ?? '';
  }
}
