import { test, expect } from '@playwright/test';
import { LoginUserPage } from '../pages/loginUser.page';

test.describe('Login - DemoQA Book Store', () => {
  const USERNAME = 'userprueba0011.';          // ajusta según tu entorno
  const PASSWORD_VALIDA = 'Pass123!*'; // ajusta según tu usuario real
  const PASSWORD_INVALIDA = 'abc123';

  test('Login exitoso con credenciales válidas', async ({ page }) => {
    const login = new LoginUserPage(page);

    await login.abrirPaginaPrincipal();
    await login.navegarAlFormularioDeLogin();
    await login.escribirUserName(USERNAME);
    await login.escribirPassword(PASSWORD_VALIDA);
    await login.clickLogin();
    await login.validateNameProfile(); // si no encuentra el perfil, el test falla

    // Aquí podrías agregar una validación adicional si quieres
    // por ejemplo esperar que una URL cambie o que exista algún elemento más
  });

  test('Login con contraseña inválida', async ({ page }) => {
    const login = new LoginUserPage(page);

    await login.abrirPaginaPrincipal();
    await login.navegarAlFormularioDeLogin();
    await login.escribirUserName(USERNAME);
    await login.escribirInvalidPassword(PASSWORD_INVALIDA);
    await login.clickLogin();

    const mensajeError = await login.obtenerMensajeContrasenaInvalida();
    // Ajusta el texto esperado según lo que realmente retorne la app
    expect(mensajeError).not.toBe('');
    // Si sabes el mensaje exacto, puedes hacer algo como:
    // expect(mensajeError).toContain('Invalid username or password!');
  });
});
