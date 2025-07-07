export class Color {
  public r: number;
  public g: number;
  public b: number;
  public a: number;

  constructor(r: number = 0, g: number = 0, b: number = 0, a: number = 1) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
  }

  static fromHex(hex: string): Color {
    // Remove the hash if present
    hex = hex.replace(/^#/, '');

    if (hex.length !== 6) {
      throw new Error("Invalid hex color format");
    }

    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    return new Color(r / 255, g / 255, b / 255);
  }

  toHex(): string {
    const r = Math.round(this.r * 255).toString(16).padStart(2, '0');
    const g = Math.round(this.g * 255).toString(16).padStart(2, '0');
    const b = Math.round(this.b * 255).toString(16).padStart(2, '0');
    return `#${r}${g}${b}`;
  }

  private _toLinear(c: number): number {
    return (c <= 0.04045)
      ? c / 12.92
      : Math.pow((c + 0.055) / 1.055, 2.4);
  }
  toLinear(): Color {
    return new Color(
      this._toLinear(this.r),
      this._toLinear(this.g),
      this._toLinear(this.b),
      this.a
    );
  }
  private _toSRGB(c: number): number {
    return (c <= 0.0031308)
      ? c * 12.92
      : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
  }
  toSRGB(): Color {
    return new Color(
      this._toSRGB(this.r),
      this._toSRGB(this.g),
      this._toSRGB(this.b),
      this.a
    );
  }
}