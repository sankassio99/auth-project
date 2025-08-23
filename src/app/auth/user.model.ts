export class UserModel {
  constructor(
    public email: string,
    public id: string,
    private _token: string,
    private _tokenExpirationDate: Date,
    private _refreshToken?: string
  ) {}

  get token(): string | null {
    if (!this._tokenExpirationDate || new Date() > this._tokenExpirationDate) {
      return null;
    }

    return this._token;
  }

  get refreshToken(): string | null {
    return this._refreshToken || null;
  }

  get tokenExpirationDate(): Date {
    return this._tokenExpirationDate;
  }
}
