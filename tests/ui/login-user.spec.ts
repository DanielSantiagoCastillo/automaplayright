import { test, expect } from '@playwright/test';
import { LoginUserPage } from '../pages/loginUser.page';

test.describe('Login - DemoQA Book Store', () => {
  const USERNAME = 'userprueba0011.';          
  const PASSWORD_VALIDA = 'Pass123!*'; 
  const PASSWORD_INVALIDA = 'abc123';

  test('Login exitoso con credenciales válidas', async ({ page }) => {
    const login = new LoginUserPage(page);

    // Parametros de ingreso
    await login.abrirPaginaPrincipal();
    await login.navegarAlFormularioDeLogin();
    await login.escribirUserName(USERNAME);
    await login.escribirPassword(PASSWORD_VALIDA);
    await login.clickLogin();
    await login.validateNameProfile();
  });

  test('Login con contraseña inválida', async ({ page }) => {
    const login = new LoginUserPage(page);

    // Parametros de ingreso
    await login.abrirPaginaPrincipal();
    await login.navegarAlFormularioDeLogin();
    await login.escribirUserName(USERNAME);
    await login.escribirInvalidPassword(PASSWORD_INVALIDA);
    await login.clickLogin();

    const mensajeError = await login.obtenerMensajeContrasenaInvalida();
    expect(mensajeError).not.toBe('');
  });
});
