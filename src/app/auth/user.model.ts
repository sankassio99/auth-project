export class UserModel {
  constructor(
    public email: string,
    public id: string,
    private _token: string,
    private _tokenExpirantionDate: Date
  ) {}

  get token(): string | null {
    if (!this._tokenExpirantionDate || new Date() > this._tokenExpirantionDate) {
      return null;
    }

    return this._token;
  }
}
