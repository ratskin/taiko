import {
  switchTo,
  openTab,
  closeTab,
  reload,
  goto,
  overridePermissions,
  setLocation,
  evaluate,
  emulateDevice,
  goBack,
  goForward,
  getCookies,
  emulateTimezone,
} from 'taiko';
import { Step } from 'gauge-ts';
const assert = require('assert');
const cwd = process.cwd();

export default class Assert {
  @Step('Switch to tab with url <title>')
  public async switchTabWithURL(title) {
    await switchTo(title);
  }

  @Step('Open Tab <url>')
  public async openTab(url) {
    await openTab(url);
  }

  @Step('Close Tab <url>')
  public async closeTabWithURL(url) {
    await closeTab(url);
  }

  @Step('Close Tab')
  public async closeTab() {
    await closeTab();
  }

  @Step('Reload the page')
  public async reloadPage() {
    await reload();
  }

  @Step('Assert cookies to be present')
  public async assertCookies() {
    const cookies = await getCookies();
    assert.ok(cookies.length > 0);
  }

  @Step('Assert cookie with valid options url <arg>')
  public async assertCookiesWithOptions(arg) {
    const cookies = await getCookies({ urls: [arg] });
    assert.ok(cookies.length > 0);
  }

  @Step('Assert cookie with invalid options url <arg>')
  public async assertCookieWithInvalidOption(arg) {
    const cookies = await getCookies({ urls: [arg] });
    assert.ok(cookies.length === 0);
  }

  @Step('Navigate to file with relative Path <filePath>')
  public async navigateToFileWithRelativePath(filePath) {
    await goto('file:///' + cwd + filePath);
  }

  @Step('Override browser permission with <geolocation> for site <url>')
  public async overrideBrowserPermission(geolocation, url) {
    await overridePermissions(url, [geolocation]);
  }

  @Step('Setlocation with longitude as <longitude> and latitude as <latitude>')
  public async setLocationWithLatAndLong(longitude, latitude) {
    await setLocation({
      longitude: parseFloat(longitude),
      latitude: parseFloat(latitude),
    });
  }

  @Step('Assert location longitude as <longitude> and latitude as <latitude>')
  public async function(longitude, latitude) {
    const geolocation: any = await evaluate(
      () =>
        new Promise((resolve) =>
          navigator.geolocation.getCurrentPosition((position) => {
            resolve({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
          }),
        ),
    );
    assert.equal(geolocation.longitude, parseFloat(longitude));
    assert.equal(geolocation.latitude, parseFloat(latitude));
  }

  @Step('Emulate device <deviceModel>')
  public async emulateDevice(deviceModel) {
    await emulateDevice(deviceModel);
  }

  @Step('Assert width is <width> and height is <height>')
  public async assertWidthAndHeight(width, height) {
    const innerWidth = await evaluate(() => window.innerWidth);
    const innerHeight = await evaluate(() => window.innerHeight);
    assert.equal(innerWidth, width);
    assert.equal(innerHeight, height);
  }

  @Step('Navigate back')
  public async navigateBack() {
    await goBack();
  }

  @Step('Navigate forward')
  public async navigateForward() {
    await goForward();
  }

  @Step('Set timezone <arg0>')
  public async setTimeZone(arg0) {
    await emulateTimezone(arg0);
  }
}