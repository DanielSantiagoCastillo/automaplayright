import { Page, Locator } from '@playwright/test';

export class LoginUserPage {
  private readonly page: Page;

  private readonly cardBookStoreApplication: Locator;
  private readonly btnLogin: Locator;

  private readonly inputUserName: Locator;
  private readonly inputPassword: Locator;
  private readonly btnIngreso: Locator;

  private readonly userNameProfile: Locator;
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

    this.inputUserName = page.locator('#userName');
    this.inputPassword = page.locator('#password');
    this.btnIngreso = page.locator('#login');

    this.userNameProfile = page.locator(
      "//label[@id='userName-value' and contains(normalize-space(),'userprueba0011.')]"
    );

    this.lblPasswordError = page.locator('#name');
  }

  // Delay central de 1s
  private async wait() {
    await this.page.waitForTimeout(1000);
  }

  // Screenshot central
  private async capture(nombre: string) {
    await this.page.screenshot({ path: `screenshots/${Date.now()}_${nombre}.png`, fullPage: true });
  }

  async abrirPaginaPrincipal(): Promise<void> {
    await this.page.goto('https://demoqa.com/automation-practice-form');
    await this.capture('abrirPaginaPrincipal');
    await this.cardBookStoreApplication.waitFor();
    await this.wait();
  }

  async navegarAlFormularioDeLogin(): Promise<void> {
    await this.cardBookStoreApplication.click();
    await this.wait();
    await this.capture('clickBookStoreCard');

    await this.btnLogin.click();
    await this.wait();
    await this.capture('clickBtnLogin');
  }

  async escribirUserName(baseUserName: string): Promise<void> {
    await this.inputUserName.fill(baseUserName);
    await this.wait();
    await this.capture(`escribirUserName_${baseUserName}`);
  }

  async escribirPassword(password: string): Promise<void> {
    await this.inputPassword.fill(password);
    await this.wait();
    await this.capture('escribirPassword');
  }

  async clickLogin(): Promise<void> {
    await this.btnIngreso.click();
    await this.wait();
    await this.capture('clickLogin');
  }

  async validateNameProfile(): Promise<void> {
    await this.userNameProfile.waitFor();
    await this.wait();
    await this.capture('validateNameProfile');
  }

  async escribirInvalidPassword(invalidpassword: string): Promise<void> {
    await this.inputPassword.fill(invalidpassword);
    await this.wait();
    await this.capture(`escribirInvalidPassword_${invalidpassword}`);
  }

  async obtenerMensajeContrasenaInvalida(): Promise<string> {
    await this.wait();
    const text = await this.lblPasswordError.textContent();
    await this.capture('obtenerMensajeErrorPassword');
    await this.wait();
    return text?.trim() ?? '';
  }
}
